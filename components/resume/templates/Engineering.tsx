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

export default function Engineering({
  basicInfo,
  summary,
  experience,
  education,
  skills,
  projects,
}: Props) {
  return (
    <div className="bg-white p-8 max-w-[210mm] mx-auto text-[11pt] text-black">
      <h1 className="text-2xl font-bold">{basicInfo.name || "Your Name"}</h1>
      <p className="text-sm">
        {basicInfo.email} | {basicInfo.phone} | {basicInfo.linkedin}
      </p>

      {summary && (
        <section className="mt-4">
          <h2 className="font-bold">Summary</h2>
          <p>{summary}</p>
        </section>
      )}

      <section className="mt-4">
        <h2 className="font-bold">Technical Skills</h2>
        <p>{skills.join(", ")}</p>
      </section>

      <section className="mt-4">
        <h2 className="font-bold">Experience</h2>
        {experience.map((e, i) => (
          <div key={i}>
            <b>{e.role}</b> - {e.company}
            <p>{e.description}</p>
          </div>
        ))}
      </section>

      <section className="mt-4">
        <h2 className="font-bold">Projects</h2>
        {projects.map((p, i) => (
          <div key={i}>
            <b>{p.name}</b>
            <p>{p.description}</p>
          </div>
        ))}
      </section>

      <section className="mt-4">
        <h2 className="font-bold">Education</h2>
        {education.map((ed, i) => (
          <div key={i}>
            {ed.degree} - {ed.institution}
          </div>
        ))}
      </section>
    </div>
  );
}
