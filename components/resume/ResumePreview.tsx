import { templates } from "./templates";

interface Props {
  basicInfo: any;
  summary: string;
  experience: any[];
  education: any[];
  skills: string[];
  projects: any[];
  template?: string;
}

export default function ResumePreview({
  basicInfo,
  summary,
  experience,
  education,
  skills,
  projects,
  template = "ats",
}: Props) {
  const TemplateComponent = templates[template] || templates["ats"];

  if (!TemplateComponent) {
    return <div>Template not found</div>;
  }

  return (
    <div id="resume-preview">
      <TemplateComponent
        basicInfo={basicInfo}
        summary={summary}
        experience={experience}
        education={education}
        skills={skills}
        projects={projects}
      />
    </div>
  );
}