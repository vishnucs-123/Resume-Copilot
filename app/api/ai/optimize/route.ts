import { auth } from "@/lib/auth";
import { generateAI } from "@/lib/ai";
import { PROMPTS } from "@/lib/ai/prompts";
import { checkRateLimit } from "@/lib/rate-limit";
import { sanitizeInput } from "@/lib/security";
import { z } from "zod";

const optimizeSchema = z.object({
  resumeText: z.string().trim().min(50).max(12000),
  jobDescription: z.string().trim().min(30).max(15000),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limit = await checkRateLimit("ai", `optimize:${session.user.id}`);
    if (!limit.success) {
      return Response.json(
        { error: "AI limit reached. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { resumeText, jobDescription } = optimizeSchema.parse(body);

    const raw = await generateAI(
      PROMPTS.OPTIMIZE_FOR_JOB(
        sanitizeInput(resumeText),
        sanitizeInput(jobDescription)
      )
    );

    const result = JSON.parse(raw.replace(/```json|```/g, "").trim());
    return Response.json({ result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    console.error("AI optimize error:", error);
    return Response.json({ error: "AI optimize error" }, { status: 500 });
  }
}