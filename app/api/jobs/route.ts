import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const createJobSchema = z.object({
  jobTitle: z.string().trim().min(2).max(120),
  company: z.string().trim().min(2).max(120),
  jobUrl: z.union([z.string().url().max(500), z.literal(""), z.null()]).optional(),
  jobDesc: z.string().trim().max(15000).optional(),
  status: z
    .enum(["SAVED", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"])
    .optional(),
});

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jobs = await db.jobApplication.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ jobs });
  } catch (error) {
    console.error("GET /api/jobs error:", error);
    return Response.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limit = await checkRateLimit("writes", `job-create:${session.user.id}`);
    if (!limit.success) {
      return Response.json(
        { error: "Too many create requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = createJobSchema.parse(body);

    const job = await db.jobApplication.create({
      data: {
        userId: session.user.id,
        jobTitle: parsed.jobTitle,
        company: parsed.company,
        jobUrl: parsed.jobUrl || null,
        jobDesc: parsed.jobDesc || "",
        status: parsed.status || "SAVED",
      },
    });

    return Response.json({ job });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Invalid job data", details: error.flatten() },
        { status: 400 }
      );
    }

    console.error("POST /api/jobs error:", error);
    return Response.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}