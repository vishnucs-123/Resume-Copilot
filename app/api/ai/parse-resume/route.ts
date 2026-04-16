import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateAI } from "@/lib/ai";
import { PROMPTS } from "@/lib/ai/prompts";
import { sanitizeInput } from "@/lib/security";
import { checkRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const schema = z.object({
  rawText: z.string().min(50).max(200000),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limit = await checkRateLimit("ai", `parse-resume:${session.user.id}`);
    if (!limit.success) {
      return NextResponse.json(
        { error: "AI limit reached. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { rawText } = schema.parse(body);

    const safeText = sanitizeInput(
  rawText
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 20000)
  );

    const aiResponse = await generateAI(
      PROMPTS.EXTRACT_RESUME_FROM_TEXT(safeText),
      "groq"
    );

    let structured;
    try {
      const cleaned = aiResponse
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      const jsonStart = cleaned.indexOf("{");
      const jsonEnd = cleaned.lastIndexOf("}");

      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("No JSON found in response");
      }

      const jsonOnly = cleaned.substring(jsonStart, jsonEnd + 1);
      structured = JSON.parse(jsonOnly);
    } catch {
      return NextResponse.json(
        { error: "AI could not parse resume structure. Please try again." },
        { status: 422 }
      );
    }

    return NextResponse.json({ structured });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    console.error("AI parse error:", error);
    return NextResponse.json(
      { error: "Failed to parse resume with AI" },
      { status: 500 }
    );
  }
}