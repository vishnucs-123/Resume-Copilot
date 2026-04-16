import { auth } from "@/lib/auth";
import { generateAI } from "@/lib/ai";
import { PROMPTS } from "@/lib/ai/prompts";
import { checkRateLimit } from "@/lib/rate-limit";
import { sanitizeInput } from "@/lib/security";
import { z } from "zod";

const summarySchema = z.object({
  name: z.string().trim().min(1).max(120),
  role: z.string().trim().min(2).max(120),
  yearsExp: z.union([z.string().trim().max(50), z.number().min(0).max(60)]),
  skills: z.array(z.string().trim().min(1).max(100)).max(100),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limit = await checkRateLimit("ai", `summary:${session.user.id}`);
    if (!limit.success) {
      return Response.json(
        { error: "AI limit reached. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, role, yearsExp, skills } = summarySchema.parse(body);

    const result = await generateAI(
      PROMPTS.GENERATE_SUMMARY(
        sanitizeInput(name),
        sanitizeInput(role),
        String(yearsExp),
        skills.map((s) => sanitizeInput(s))
      )
    );

    return Response.json({ result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    console.error("AI summary error:", error);
    return Response.json({ error: "AI summary error" }, { status: 500 });
  }
}