export default function Design({ basicInfo, projects }: any) {
  return (
    <div className="bg-white p-8 max-w-[210mm] mx-auto">
      <h1 className="text-2xl font-bold">{basicInfo.name}</h1>

      <h2 className="font-bold mt-4">Portfolio Projects</h2>
      {projects.map((p: any, i: number) => (
        <div key={i}>
          <b>{p.name}</b>
          <p>{p.description}</p>
        </div>
      ))}
    </div>
  );
}
