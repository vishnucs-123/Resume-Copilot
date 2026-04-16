export default function BSc({ basicInfo, summary, skills, projects }: any) {
  return (
    <div className="bg-white p-8 max-w-[210mm] mx-auto">
      <h1 className="text-xl font-bold">{basicInfo.name}</h1>

      <h2 className="mt-4 font-bold">Objective</h2>
      <p>{summary}</p>

      <h2 className="mt-4 font-bold">Scientific Skills</h2>
      <p>{skills.join(", ")}</p>

      <h2 className="mt-4 font-bold">Projects</h2>
      {projects.map((p: any, i: number) => (
        <div key={i}>
          <b>{p.name}</b>
          <p>{p.description}</p>
        </div>
      ))}
    </div>
  );
}
