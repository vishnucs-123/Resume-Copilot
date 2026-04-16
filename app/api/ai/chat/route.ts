import { auth } from "@/lib/auth";
import { generateAI } from "@/lib/ai";
import { PROMPTS } from "@/lib/ai/prompts";
import { checkRateLimit } from "@/lib/rate-limit";
import { sanitizeInput } from "@/lib/security";
import { z } from "zod";

const chatSchema = z.object({
  message: z.string().trim().min(1).max(3000),
  resumeContext: z.string().trim().min(20).max(12000),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limit = await checkRateLimit("ai", `chat:${session.user.id}`);
    if (!limit.success) {
      return Response.json(
        { error: "AI limit reached. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { message, resumeContext } = chatSchema.parse(body);

    const result = await generateAI(
      PROMPTS.COPILOT_CHAT(
        sanitizeInput(message),
        sanitizeInput(resumeContext).slice(0, 8000)
      )
    );

    return Response.json({ result: result.trim() });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    console.error("AI chat error:", error);
    return Response.json({ error: "AI chat error" }, { status: 500 });
  }
}