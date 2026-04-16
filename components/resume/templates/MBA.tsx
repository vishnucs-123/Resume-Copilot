export default function MBA({ basicInfo, summary, experience }: any) {
  return (
    <div className="bg-white p-8 max-w-[210mm] mx-auto">
      <h1 className="font-bold text-xl">{basicInfo.name}</h1>

      <h2 className="mt-4 font-bold">Executive Summary</h2>
      <p>{summary}</p>

      <h2 className="mt-4 font-bold">Leadership Experience</h2>
      {experience.map((e: any, i: number) => (
        <div key={i}>
          <b>{e.role}</b> - {e.company}
        </div>
      ))}
    </div>
  );
}
