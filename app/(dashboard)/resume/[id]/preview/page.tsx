import { db } from "@/lib/db";
import { notFound } from "next/navigation";

type BasicInfo = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  leetcode?: string;
  hackerrank?: string;
};

type Experience = {
  role?: string;
  company?: string;
  start?: string;
  end?: string;
  description?: string;
};

type Education = {
  degree?: string;
  institution?: string;
  start?: string;
  end?: string;
};

type Project = {
  name?: string;
  description?: string;
  link?: string;
  github?: string;
};

export default async function ResumePreviewPage({
  params,
}: {
  params: { id: string };
}) {
  const resume = await db.resume.findUnique({
    where: { id: params.id },
  });

  if (!resume) return notFound();

  const basicInfo = (resume.basicInfo || {}) as BasicInfo;
  const experience = (resume.experience || []) as Experience[];
  const education = (resume.education || []) as Education[];
  const skills = (resume.skills || []) as string[];
  const projects = (resume.projects || []) as Project[];

  const fullName = `${basicInfo.firstName || ""} ${basicInfo.lastName || ""}`.trim();

  const LinkItem = ({ href, label }: { href?: string; label: string }) =>
    href ? (
      <a
        href={href.startsWith("http") ? href : `https://${href}`}
        target="_blank"
        className="underline hover:text-blue-600"
      >
        {label}
      </a>
    ) : null;

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 space-y-6">

        {/* HEADER */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {fullName || "Your Name"}
          </h1>

          <div className="text-sm text-gray-600 flex flex-wrap gap-2">
            {basicInfo.email && (
              <a href={`mailto:${basicInfo.email}`} className="underline">
                {basicInfo.email}
              </a>
            )}
            {basicInfo.phone && (
              <a href={`tel:${basicInfo.phone}`} className="underline">
                {basicInfo.phone}
              </a>
            )}
            {basicInfo.location && <span>{basicInfo.location}</span>}
          </div>

          {/* SOCIAL LINKS */}
          <div className="text-xs text-gray-600 flex flex-wrap gap-3 pt-1">
            <LinkItem href={basicInfo.linkedin} label="LinkedIn" />
            <LinkItem href={basicInfo.github} label="GitHub" />
            <LinkItem href={basicInfo.portfolio} label="Portfolio" />
            <LinkItem href={basicInfo.leetcode} label="LeetCode" />
            <LinkItem href={basicInfo.hackerrank} label="HackerRank" />
          </div>
        </div>

        {/* SUMMARY */}
        {resume.summary && (
          <div>
            <h2 className="text-sm font-semibold border-b pb-1 mb-2">
              Summary
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {resume.summary}
            </p>
          </div>
        )}

        {/* SKILLS */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold border-b pb-1 mb-2">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="text-xs bg-gray-100 px-2 py-1 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* EXPERIENCE */}
        {experience.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold border-b pb-1 mb-2">
              Experience
            </h2>
            <div className="space-y-3">
              {experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between flex-wrap">
                    <p className="text-sm font-medium">
                      {exp.role} — {exp.company}
                    </p>
                    <p className="text-xs text-gray-500">
                      {exp.start} - {exp.end}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROJECTS */}
        {projects.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold border-b pb-1 mb-2">
              Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj, i) => (
                <div key={i}>
                  <div className="flex flex-wrap gap-2 items-center">
                    <p className="text-sm font-medium">{proj.name}</p>

                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        className="text-xs underline text-blue-600"
                      >
                        Live
                      </a>
                    )}

                    {proj.github && (
                      <a
                        href={proj.github}
                        target="_blank"
                        className="text-xs underline text-gray-600"
                      >
                        GitHub
                      </a>
                    )}
                  </div>

                  <p className="text-sm text-gray-700">
                    {proj.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EDUCATION */}
        {education.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold border-b pb-1 mb-2">
              Education
            </h2>
            <div className="space-y-2">
              {education.map((edu, i) => (
                <div key={i} className="flex justify-between flex-wrap">
                  <p className="text-sm font-medium">
                    {edu.degree} — {edu.institution}
                  </p>
                  <p className="text-xs text-gray-500">
                    {edu.start} - {edu.end}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}