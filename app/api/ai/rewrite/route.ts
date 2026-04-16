import { auth } from "@/lib/auth";
import { generateAI } from "@/lib/ai";
import { PROMPTS } from "@/lib/ai/prompts";
import { checkRateLimit } from "@/lib/rate-limit";
import { sanitizeInput } from "@/lib/security";
import { z } from "zod";

const rewriteSchema = z.object({
  bullet: z.string().trim().min(5).max(1000),
  role: z.string().trim().min(2).max(120),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limit = await checkRateLimit("ai", `rewrite:${session.user.id}`);
    if (!limit.success) {
      return Response.json(
        { error: "AI limit reached. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { bullet, role } = rewriteSchema.parse(body);

    const result = await generateAI(
      PROMPTS.REWRITE_EXPERIENCE(
        sanitizeInput(bullet),
        sanitizeInput(role)
      )
    );

    return Response.json({ result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    console.error("AI rewrite error:", error);
    return Response.json({ error: "AI rewrite error" }, { status: 500 });
  }
}