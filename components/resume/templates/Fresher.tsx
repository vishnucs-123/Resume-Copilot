export default function Fresher({ basicInfo, education, skills, projects }: any) {
  return (
    <div className="bg-white p-8 max-w-[210mm] mx-auto">
      <h1 className="text-xl font-bold">{basicInfo.name}</h1>

      <h2 className="mt-4 font-bold">Objective</h2>
      <p>Seeking entry-level opportunity to grow professionally.</p>

      <h2 className="mt-4 font-bold">Skills</h2>
      <p>{skills.join(", ")}</p>

      <h2 className="mt-4 font-bold">Projects</h2>
      {projects.map((p: any, i: number) => (
        <p key={i}>{p.name}</p>
      ))}

      <h2 className="mt-4 font-bold">Education</h2>
      {education.map((e: any, i: number) => (
        <p key={i}>{e.degree}</p>
      ))}
    </div>
  );
}
