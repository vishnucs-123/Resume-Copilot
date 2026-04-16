import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const resumeId = searchParams.get("resumeId");

  if (!resumeId) {
    return Response.json({ error: "Resume ID required" }, { status: 400 });
  }

  const resume = await db.resume.findFirst({
    where: { id: resumeId, userId: session.user.id },
  });

  if (!resume) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ resume });
}