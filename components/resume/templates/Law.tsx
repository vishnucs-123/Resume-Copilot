export default function Law({ basicInfo, summary, education }: any) {
  return (
    <div className="bg-white p-8 max-w-[210mm] mx-auto">
      <h1 className="text-xl font-bold">{basicInfo.name}</h1>

      <h2 className="mt-4 font-bold">Legal Profile</h2>
      <p>{summary}</p>

      <h2 className="mt-4 font-bold">Education</h2>
      {education.map((e: any, i: number) => (
        <p key={i}>{e.degree}</p>
      ))}
    </div>
  );
}
