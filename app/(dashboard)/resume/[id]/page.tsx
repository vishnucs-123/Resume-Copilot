import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import ResumeEditor from "@/components/resume/ResumeEditor";

export default async function ResumeEditorPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const resume = await db.resume.findFirst({
    where: { id: params.id, userId: session.user.id },
  });

  if (!resume) {
    notFound();
  }

  return <ResumeEditor resume={resume} />;
}