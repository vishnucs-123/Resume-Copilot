export default function Arts({ basicInfo, summary, experience, education }: any) {
  return (
    <div className="p-8 bg-white max-w-[210mm] mx-auto">
      <h1 className="text-2xl font-bold">{basicInfo.name}</h1>

      <h2 className="mt-4 font-bold">Profile</h2>
      <p>{summary}</p>

      <h2 className="mt-4 font-bold">Experience</h2>
      {experience.map((e: any, i: number) => (
        <p key={i}>{e.role} - {e.company}</p>
      ))}

      <h2 className="mt-4 font-bold">Education</h2>
      {education.map((e: any, i: number) => (
        <p key={i}>{e.degree}</p>
      ))}
    </div>
  );
}
