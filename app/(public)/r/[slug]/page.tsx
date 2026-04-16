import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import ResumePreview from "@/components/resume/ResumePreview";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};
export default async function PublicResumePage({
  params,
}: {
  params: { slug: string };
}) {
  const resume = await db.resume.findUnique({
    where: { publicSlug: params.slug },
  });

  if (!resume || !resume.isPublic) {
    notFound();
  }

  const basicInfo =
    typeof resume.basicInfo === "object" && resume.basicInfo !== null
      ? resume.basicInfo
      : {};

  const summary = resume.summary ?? "";

  const experience = Array.isArray(resume.experience)
    ? resume.experience.filter(Boolean)
    : [];

  const education = Array.isArray(resume.education)
    ? resume.education.filter(Boolean)
    : [];

  const projects = Array.isArray(resume.projects)
    ? resume.projects.filter(Boolean)
    : [];

  const skills = Array.isArray(resume.skills)
    ? resume.skills.filter((s: unknown): s is string => typeof s === "string")
    : [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full bg-white shadow-sm border-b py-3 px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-2 mb-6">
        <span className="font-semibold text-gray-900 text-sm md:text-base text-center sm:text-left">
          {(basicInfo as { name?: string })?.name || "Anonymous"}'s Resume
        </span>

        <Link href="/">
          <Button variant="outline" size="sm">
            Create your resume
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-4xl overflow-x-auto px-4 pb-12 flex justify-center">
        <ResumePreview
          basicInfo={basicInfo}
          summary={summary}
          experience={experience}
          education={education}
          skills={skills}
          projects={projects}
          template={resume.template}
        />
      </div>
    </div>
  );
}