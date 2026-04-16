import { auth } from "@/lib/auth";
import { generateAI } from "@/lib/ai";
import { PROMPTS } from "@/lib/ai/prompts";
import { checkRateLimit } from "@/lib/rate-limit";
import { sanitizeInput } from "@/lib/security";
import { z } from "zod";

const skillsSchema = z.object({
  role: z.string().trim().min(2).max(120),
  existingSkills: z.array(z.string().trim().min(1).max(100)).max(100).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limit = await checkRateLimit("ai", `skills:${session.user.id}`);
    if (!limit.success) {
      return Response.json(
        { error: "AI limit reached. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { role, existingSkills = [] } = skillsSchema.parse(body);

    const safeRole = sanitizeInput(role);
    const safeSkills = existingSkills.map((skill) => sanitizeInput(skill));

    const raw = await generateAI(
      PROMPTS.SUGGEST_SKILLS(safeRole, safeSkills)
    );

    const cleaned = raw.replace(/```json|```/g, "").trim();
    const result = JSON.parse(cleaned);

    return Response.json({ result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    console.error("POST /api/ai/skills error:", error);
    return Response.json({ error: "AI parse error" }, { status: 500 });
  }
}