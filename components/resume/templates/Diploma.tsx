export default function Diploma({ basicInfo, skills, projects }: any) {
  return (
    <div className="bg-white p-8 max-w-[210mm] mx-auto">
      <h1>{basicInfo.name}</h1>

      <h2 className="font-bold mt-4">Skills</h2>
      <p>{skills.join(", ")}</p>

      <h2 className="font-bold mt-4">Projects</h2>
      {projects.map((p: any, i: number) => (
        <p key={i}>{p.name}</p>
      ))}
    </div>
  );
}
