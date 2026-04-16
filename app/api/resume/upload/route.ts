import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { validateFileUpload } from "@/lib/security";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limit = await checkRateLimit("uploads", `resume-upload:${session.user.id}`);
    if (!limit.success) {
      return NextResponse.json(
        { error: "Too many uploads. Please try again later." },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const validation = validateFileUpload(file);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let rawText = "";

    if (file.type === "application/pdf") {
      const PDFParser = require("pdf2json");

      const text = await new Promise<string>((resolve, reject) => {
        const pdfParser = new PDFParser(null, 1);

        pdfParser.on("pdfParser_dataError", (errData: any) =>
          reject(new Error(errData.parserError))
        );

        pdfParser.on("pdfParser_dataReady", () => {
          resolve(pdfParser.getRawTextContent());
        });

        pdfParser.parseBuffer(buffer);
      });

      rawText = text;

      if (!rawText || rawText.trim().length < 50) {
        return NextResponse.json(
          {
            error:
              "This PDF appears to be scanned or image-based and cannot be read. Please convert it to a DOCX file and try again, or copy-paste your resume text manually.",
          },
          { status: 422 }
        );
      }
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      rawText = result.value;
    }

    if (!rawText || rawText.trim().length < 50) {
      return NextResponse.json(
        {
          error:
            "Could not extract text from this file. Please try a DOCX file instead.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({ rawText: rawText.trim() });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 }
    );
  }
}