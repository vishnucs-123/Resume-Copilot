import { auth } from "@/lib/auth";
import { generateAI } from "@/lib/ai";
import { PROMPTS } from "@/lib/ai/prompts";
import { checkRateLimit } from "@/lib/rate-limit";
import { sanitizeInput } from "@/lib/security";
import { z } from "zod";

const analyzeSchema = z.object({
  resumeText: z.string().trim().min(50).max(12000),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limit = await checkRateLimit("ai", `analyze:${session.user.id}`);
    if (!limit.success) {
      return Response.json(
        { error: "AI limit reached. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { resumeText } = analyzeSchema.parse(body);

    const safeText = sanitizeInput(resumeText);
    const raw = await generateAI(PROMPTS.ANALYZE_RESUME(safeText));

    const cleaned = raw.replace(/```json|```/g, "").trim();
    const result = JSON.parse(cleaned);

    return Response.json({ result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    console.error("POST /api/ai/analyze error:", error);
    return Response.json({ error: "AI analyze error" }, { status: 500 });
  }
}