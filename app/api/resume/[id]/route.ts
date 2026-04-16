import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { randomBytes } from "crypto";

const resumeUpdateSchema = z.object({
  title: z.string().trim().min(1).max(120),
  basicInfo: z.object({}).catchall(z.any()),
  summary: z.string().trim().max(5000).optional().default(""),
  experience: z.array(z.object({}).catchall(z.any())).max(100),
  education: z.array(z.object({}).catchall(z.any())).max(50),
  skills: z.array(z.string().trim().min(1).max(100)).max(200),
  projects: z.array(z.object({}).catchall(z.any())).max(100),
  template: z.string().trim().min(1).max(50).optional(),
  isPublic: z.boolean().optional(),
  publicSlug: z.string().trim().max(200).nullable().optional(),
});

function toJsonValue(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function slugifyName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

async function generateUniquePublicSlug(baseName?: string) {
  const base = slugifyName(baseName || "resume") || "resume";

  for (let i = 0; i < 10; i++) {
    const suffix = randomBytes(6).toString("hex"); // 12 chars
    const slug = `${base}-${suffix}`;

    const existing = await db.resume.findUnique({
      where: { publicSlug: slug },
      select: { id: true },
    });

    if (!existing) {
      return slug;
    }
  }

  throw new Error("Failed to generate unique public slug");
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limit = await checkRateLimit("writes", `resume-patch:${session.user.id}`);
    if (!limit.success) {
      return Response.json(
        { error: "Too many update requests. Please try again later." },
        { status: 429 }
      );
    }

    const existingResume = await db.resume.findFirst({
      where: { id: params.id, userId: session.user.id },
      select: {
        id: true,
        publicSlug: true,
        isPublic: true,
      },
    });

    if (!existingResume) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = resumeUpdateSchema.parse(body);

    let finalPublicSlug = existingResume.publicSlug;

    if (parsed.isPublic === true) {
      if (!finalPublicSlug) {
        const name =
          typeof parsed.basicInfo?.name === "string" ? parsed.basicInfo.name : "resume";

        finalPublicSlug = await generateUniquePublicSlug(name);
      }
    }

    if (parsed.isPublic === false) {
      // Keep slug for reuse if user republishes later.
      // If you want to fully disable old links forever, set this to null instead.
      finalPublicSlug = existingResume.publicSlug;
    }

    const updated = await db.resume.update({
      where: { id: params.id },
      data: {
        title: parsed.title,
        basicInfo: toJsonValue(parsed.basicInfo),
        summary: parsed.summary,
        experience: toJsonValue(parsed.experience),
        education: toJsonValue(parsed.education),
        skills: toJsonValue(parsed.skills),
        projects: toJsonValue(parsed.projects),
        ...(parsed.template ? { template: parsed.template } : {}),
        ...(typeof parsed.isPublic === "boolean"
          ? { isPublic: parsed.isPublic }
          : {}),
        publicSlug: finalPublicSlug,
      },
    });

    return Response.json({ resume: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Invalid resume data", details: error.flatten() },
        { status: 400 }
      );
    }

    console.error("PATCH /api/resume/[id] error:", error);
    return Response.json(
      { error: "Failed to update resume" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limit = await checkRateLimit("writes", `resume-delete:${session.user.id}`);
    if (!limit.success) {
      return Response.json(
        { error: "Too many delete requests. Please try again later." },
        { status: 429 }
      );
    }

    const resume = await db.resume.findFirst({
      where: { id: params.id, userId: session.user.id },
      select: { id: true },
    });

    if (!resume) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    await db.resume.delete({
      where: { id: params.id },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/resume/[id] error:", error);
    return Response.json(
      { error: "Failed to delete resume" },
      { status: 500 }
    );
  }
}