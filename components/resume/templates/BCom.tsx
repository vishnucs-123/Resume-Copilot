export default function BCom({ basicInfo, summary, education, skills, experience }: any) {
  return (
    <div className="bg-white p-8 max-w-[210mm] mx-auto text-black">
      <h1 className="text-xl font-bold">{basicInfo.name}</h1>
      <p>{basicInfo.email} | {basicInfo.phone}</p>

      <h2 className="font-bold mt-4">Profile Summary</h2>
      <p>{summary}</p>

      <h2 className="font-bold mt-4">Core Skills</h2>
      <p>Accounting, GST, Tally, Excel, Financial Reporting</p>

      <h2 className="font-bold mt-4">Experience</h2>
      {experience.map((e: any, i: number) => (
        <p key={i}>{e.role} - {e.company}</p>
      ))}

      <h2 className="font-bold mt-4">Education</h2>
      {education.map((e: any, i: number) => (
        <p key={i}>{e.degree} - {e.institution}</p>
      ))}
    </div>
  );
}
