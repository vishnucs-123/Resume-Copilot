"use client";

import React from "react";

interface Props {
  basicInfo: any;
  summary: string;
  experience: any[];
  education: any[];
  skills: string[];
  projects: any[];
}

export default function ATSClean({
  basicInfo,
  summary,
  experience,
  education,
  skills,
  projects,
}: Props) {

  // ✅ FIX: Proper Section Component
  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="mb-4">
      <h2 className="text-[13px] font-bold uppercase tracking-wider border-b border-black pb-1 mb-2">
        {title}
      </h2>
      {children}
    </div>
  );

  return (
    <div
      id="resume-preview"
      className="bg-white text-black mx-auto"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "1.5cm",
        fontSize: "11pt",
        fontFamily: "serif",
        lineHeight: "1.4",
      }}
    >
      {/* HEADER */}
      <div className="text-center mb-4">
        <h1 className="text-[22px] font-bold uppercase tracking-wide">
          {basicInfo.name || "Your Name"}
        </h1>

        <div className="text-[10px] mt-1 flex flex-wrap justify-center gap-2">
          {basicInfo.email && <span>{basicInfo.email}</span>}
          {basicInfo.phone && <span>| {basicInfo.phone}</span>}
          {basicInfo.linkedin && <span>| {basicInfo.linkedin}</span>}
          {basicInfo.github && <span>| {basicInfo.github}</span>}
        </div>
      </div>

      {/* SUMMARY */}
      {summary && (
        <Section title="Summary">
          <p className="text-justify">{summary}</p>
        </Section>
      )}

           {/* SKILLS */}
      {skills.length > 0 && (
        <Section title="Technical Skills">
          <p>
            {skills
              .map((skill: any) =>
                typeof skill === "string"
                  ? skill
                  : skill?.name || skill?.description || ""
              )
              .filter(Boolean)
              .join(", ")}
          </p>
        </Section>
      )}

          {/* PROJECTS */}
      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((proj: any, i: number) => (
            <div key={i} className="mb-2">
              <div className="font-bold">
                {proj?.name || "Untitled Project"}
                {Array.isArray(proj?.techStack) && proj.techStack.length > 0 && (
                  <span className="font-normal italic">
                    {" "}
                    |{" "}
                    {proj.techStack
                      .map((tech: any) =>
                        typeof tech === "string"
                          ? tech
                          : tech?.name || tech?.description || ""
                      )
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                )}
              </div>
              {proj?.description && (
                <p className="text-[10.5pt]">{proj.description}</p>
              )}
            </div>
          ))}
        </Section>
      )}

            {/* EXPERIENCE */}
      {experience.length > 0 && (
        <Section title="Experience">
          {experience.map((exp, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between font-bold">
                <span>{exp.role}</span>
                <span>
                  {exp.startDate} — {exp.endDate || "Present"}
                </span>
              </div>
              <div className="italic">{exp.company}</div>

              <ul className="list-disc ml-4">
                {Array.isArray(exp.bullets) &&
                  exp.bullets.map((b: any, bi: number) => (
                    <li key={bi}>
                      {typeof b === "string"
                        ? b
                        : typeof b === "object" && b !== null
                        ? b.description || b.name || JSON.stringify(b)
                        : ""}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {/* EDUCATION */}
      {education.length > 0 && (
        <Section title="Education">
          {education.map((edu, i) => (
            <div key={i} className="mb-2">
              <div className="font-bold">{edu.institution}</div>
              <div>
                {edu.degree} {edu.field && `in ${edu.field}`}
              </div>
              <div className="text-[10px]">
                {edu.startDate} — {edu.endDate}
              </div>
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}