export default function Medical({ basicInfo, education, experience }: any) {
  return (
    <div className="bg-white p-8 max-w-[210mm] mx-auto">
      <h1>{basicInfo.name}</h1>

      <h2 className="font-bold mt-4">Clinical Experience</h2>
      {experience.map((e: any, i: number) => (
        <p key={i}>{e.role} - {e.company}</p>
      ))}

      <h2 className="font-bold mt-4">Education</h2>
      {education.map((e: any, i: number) => (
        <p key={i}>{e.degree}</p>
      ))}
    </div>
  );
}
