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

export default function MinimalDark({ basicInfo, summary, experience, education, skills, projects }: Props) {
  return (
    <div id="resume-preview" className="bg-[#121212] p-8 max-w-[210mm] min-h-[297mm] mx-auto text-[10.5pt] font-sans text-gray-300 leading-relaxed tracking-wide">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white tracking-tighter mb-2">{basicInfo.name || "YOUR NAME"}</h1>
        <div className="flex flex-wrap gap-4 text-[9pt] text-gray-400 font-medium">
          {basicInfo.email && <span>{basicInfo.email}</span>}
          {basicInfo.phone && <span>{basicInfo.phone}</span>}
          {basicInfo.location && <span>{basicInfo.location}</span>}
          {basicInfo.linkedin && <span>{basicInfo.linkedin}</span>}
          {basicInfo.github && <span>{basicInfo.github}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-8">
          <p className="border-l-2 border-emerald-500 pl-4 text-gray-400 italic">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-[10pt] font-mono uppercase tracking-[0.2em] text-emerald-500 mb-4 border-b border-gray-800 pb-2">Experience</h2>
          <div className="space-y-6">
            {experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-white text-[12pt]">{exp.role}</h3>
                  <span className="font-mono text-[8pt] text-gray-500 bg-gray-900 px-2 py-1 rounded">
                    {exp.startDate} — {exp.endDate || "PRESENT"}
                  </span>
                </div>
                <div className="text-gray-400 text-[10pt] mb-3">{exp.company}</div>
                <ul className="list-none space-y-2">
                  {exp.bullets.filter(Boolean).map((b: string, bi: number) => (
                    <li key={bi} className="flex relative pl-5">
                      <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-gray-700 rounded-full"></span>
                      <span className="text-gray-300">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-8">
        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <h2 className="text-[10pt] font-mono uppercase tracking-[0.2em] text-emerald-500 mb-4 border-b border-gray-800 pb-2">Projects</h2>
            <div className="space-y-4">
              {projects.map((proj, i) => (
                <div key={i} className="bg-gray-900 p-4 rounded-lg">
                  <h3 className="font-bold text-white mb-1">{proj.name}</h3>
                  {proj.techStack?.length > 0 && (
                    <div className="text-[8pt] font-mono text-emerald-400 mb-2">
                      {proj.techStack.join(" / ")}
                    </div>
                  )}
                  <p className="text-[9pt] text-gray-400">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-[10pt] font-mono uppercase tracking-[0.2em] text-emerald-500 mb-4 border-b border-gray-800 pb-2">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((s, i) => (
                  <span key={i} className="border border-gray-700 text-gray-300 px-3 py-1 rounded-full text-[8pt] font-mono">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div>
              <h2 className="text-[10pt] font-mono uppercase tracking-[0.2em] text-emerald-500 mb-4 border-b border-gray-800 pb-2">Education</h2>
              {education.map((edu, i) => (
                <div key={i} className="mb-4">
                  <div className="font-bold text-white">{edu.degree}</div>
                  <div className="text-emerald-400 text-[9pt] mb-1">{edu.institution}</div>
                  <div className="font-mono text-gray-500 text-[8pt]">{edu.startDate} — {edu.endDate}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
