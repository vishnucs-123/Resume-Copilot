"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import ResumePreview from "./ResumePreview";
import ResumeUpload from "./ResumeUpload";
import ATSAnalyzer from "../ai/ATSAnalyzer";
import AICopilotChat from "../ai/AICopilotChat";
import { templateList } from "./templates";

interface BasicInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
}

interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  grade: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  link: string;
}

interface ParsedResume {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  summary: string;
  skills: string[];
  experience: {
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    current: boolean;
    bullets: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    grade: string;
  }[];
  projects: {
    name: string;
    description: string;
    techStack: string[];
    link: string;
  }[];
  certifications: {
    name: string;
    issuer: string;
    date: string;
  }[];
}

const TABS = ["basic", "summary", "experience", "education", "skills", "projects", "ats"] as const;
type Tab = typeof TABS[number];

export default function ResumeEditor({ resume }: { resume: any }) {
  const [title, setTitle] = useState(resume.title || "My Resume");
  const [basicInfo, setBasicInfo] = useState<BasicInfo>(
    resume.basicInfo || { name: "", email: "", phone: "", location: "", linkedin: "", github: "" }
  );
  const [summary, setSummary] = useState(resume.summary || "");
  const [experience, setExperience] = useState<Experience[]>(resume.experience || []);
  const [education, setEducation] = useState<Education[]>(resume.education || []);
  const [skills, setSkills] = useState<string[]>(resume.skills || []);
  const [projects, setProjects] = useState<Project[]>(resume.projects || []);
  const [newSkill, setNewSkill] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("basic");
  const [activeTemplate, setActiveTemplate] = useState(resume.template || "ats");
  const [isPublic, setIsPublic] = useState(resume.isPublic || false);
  const [publicSlug, setPublicSlug] = useState(resume.publicSlug || "");
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  // Mobile: "editor" | "preview"
  const [mobileView, setMobileView] = useState<"editor" | "preview">("editor");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  const saveResume = useCallback(async () => {
  setSaving(true);

  try {
    const res = await fetch(`/api/resume/${resume.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        basicInfo,
        summary,
        experience,
        education,
        skills,
        projects,
        template: activeTemplate,
        isPublic,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "Failed to save resume");
    }

    if (data?.resume) {
      setIsPublic(Boolean(data.resume.isPublic));
      setPublicSlug(data.resume.publicSlug || "");
      setTitle(data.resume.title || title);
    }

    setSaved(true);
  } catch (e) {
    console.error(e);
    setSaved(false);
  } finally {
    setSaving(false);
  }
}, [
  title,
  basicInfo,
  summary,
  experience,
  education,
  skills,
  projects,
  resume.id,
  activeTemplate,
  isPublic,
]);

 useEffect(() => {
  setSaved(false);

  const timer = setTimeout(() => {
    saveResume();
  }, 30000);

  return () => clearTimeout(timer);
}, [
  title,
  basicInfo,
  summary,
  experience,
  education,
  skills,
  projects,
  activeTemplate,
  isPublic,
  saveResume,
]);
{isPublic && publicSlug && (
  <div className="mt-3 flex flex-col sm:flex-row gap-2 sm:items-center">
    <a
      href={`/r/${publicSlug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm text-blue-600 hover:underline break-all"
    >
      {`${typeof window !== "undefined" ? window.location.origin : ""}/r/${publicSlug}`}
    </a>

    <button
      type="button"
      onClick={async () => {
        const url = `${window.location.origin}/r/${publicSlug}`;
        await navigator.clipboard.writeText(url);
        alert("Public resume link copied");
      }}
      className="text-sm px-3 py-1.5 rounded-md border bg-white hover:bg-gray-50"
    >
      Copy Link
    </button>
  </div>
)}
  

  function handleParsedResume(parsed: ParsedResume) {
    setBasicInfo({
      name: parsed.name || "",
      email: parsed.email || "",
      phone: parsed.phone || "",
      location: parsed.location || "",
      linkedin: parsed.linkedin || "",
      github: parsed.github || "",
    });
    setSummary(parsed.summary || "");
    setSkills(parsed.skills || []);
    setExperience(
      (parsed.experience || []).map((exp, i) => ({
        id: Date.now().toString() + i,
        company: exp.company || "",
        role: exp.role || "",
        startDate: exp.startDate || "",
        endDate: exp.endDate || "",
        current: exp.current || false,
        bullets: exp.bullets || [],
      }))
    );
    setEducation(
      (parsed.education || []).map((edu, i) => ({
        id: Date.now().toString() + i,
        institution: edu.institution || "",
        degree: edu.degree || "",
        field: edu.field || "",
        startDate: edu.startDate || "",
        endDate: edu.endDate || "",
        grade: edu.grade || "",
      }))
    );
    setProjects(
      (parsed.projects || []).map((proj, i) => ({
        id: Date.now().toString() + i,
        name: proj.name || "",
        description: proj.description || "",
        techStack: proj.techStack || [],
        link: proj.link || "",
      }))
    );
    setShowUpload(false);
    setSaved(false);
    setActiveTab("basic");
    setMobileView("editor");
  }

  const addExperience = () => {
    setExperience([...experience, {
      id: Date.now().toString(),
      company: "", role: "", startDate: "", endDate: "", current: false, bullets: [""],
    }]);
  };

  const updateExperience = (index: number, field: string, value: any) => {
    const updated = [...experience];
    updated[index] = { ...updated[index], [field]: value };
    setExperience(updated);
  };

  const addBullet = (expIndex: number) => {
    const updated = [...experience];
    updated[expIndex].bullets.push("");
    setExperience(updated);
  };

  const updateBullet = (expIndex: number, bulletIndex: number, value: string) => {
    const updated = [...experience];
    updated[expIndex].bullets[bulletIndex] = value;
    setExperience(updated);
  };

  const removeBullet = (expIndex: number, bulletIndex: number) => {
    const updated = [...experience];
    updated[expIndex].bullets.splice(bulletIndex, 1);
    setExperience(updated);
  };

  const removeExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const rewriteBullet = async (expIndex: number, bulletIndex: number) => {
    const bullet = experience[expIndex].bullets[bulletIndex];
    const role = experience[expIndex].role;
    if (!bullet.trim()) return;
    setAiLoading(`bullet-${expIndex}-${bulletIndex}`);
    try {
      const res = await fetch("/api/ai/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bullet, role }),
      });
      const data = await res.json();
      if (data.result) updateBullet(expIndex, bulletIndex, data.result);
    } finally {
      setAiLoading(null);
    }
  };

  const generateSummary = async () => {
    setAiLoading("summary");
    try {
      const res = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: basicInfo.name,
          role: experience[0]?.role || "Professional",
          yearsExp: experience.length > 0 ? `${experience.length}+` : "0",
          skills,
        }),
      });
      const data = await res.json();
      if (data.result) setSummary(data.result);
    } finally {
      setAiLoading(null);
    }
  };

  const downloadPDF = () => {
    const element = document.getElementById("resume-preview");
    if (!element) return;
    import("html2canvas").then(({ default: html2canvas }) => {
      html2canvas(element, { scale: 2 } as any).then((canvas) => {
        import("jspdf").then(({ default: jsPDF }) => {
          const pdf = new jsPDF("p", "mm", "a4");
          const imgData = canvas.toDataURL("image/png");
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
          pdf.save(`${basicInfo.name || "Resume"}_${new Date().toLocaleDateString()}.pdf`);
        });
      });
    });
  };

 const togglePublic = async () => {
  const newStatus = !isPublic;

  setIsPublic(newStatus);
  setSaved(false);

  try {
    const res = await fetch(`/api/resume/${resume.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        basicInfo,
        summary,
        experience,
        education,
        skills,
        projects,
        template: activeTemplate,
        isPublic: newStatus,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "Failed to update public sharing");
    }

    if (data?.resume) {
      setIsPublic(Boolean(data.resume.isPublic));
      setPublicSlug(data.resume.publicSlug || "");

      if (data.resume.isPublic && data.resume.publicSlug) {
        alert(
          `Your resume is public at: ${window.location.origin}/r/${data.resume.publicSlug}`
        );
      }
    }

    setSaved(true);
  } catch (e) {
    console.error(e);
    setIsPublic(!newStatus);
  }
};

  const addEducation = () => {
    setEducation([...education, {
      id: Date.now().toString(),
      institution: "", degree: "", field: "", startDate: "", endDate: "", grade: "",
    }]);
  };

  const addProject = () => {
    setProjects([...projects, {
      id: Date.now().toString(),
      name: "", description: "", techStack: [], link: "",
    }]);
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const getResumeText = () => `
Name: ${basicInfo.name}
Email: ${basicInfo.email}
Phone: ${basicInfo.phone}
Location: ${basicInfo.location}
Summary: ${summary}
Skills: ${skills.join(", ")}
Experience:
${experience.map(exp => `${exp.company} - ${exp.role} (${exp.startDate}-${exp.endDate})\n${exp.bullets.join("\n")}`).join("\n")}
Education:
${education.map(edu => `${edu.institution} - ${edu.degree} in ${edu.field}`).join("\n")}
Projects:
${projects.map(p => `${p.name}: ${p.description}`).join("\n")}
  `;

  // Scroll active tab into view
  useEffect(() => {
    const container = tabsRef.current;
    if (!container) return;
    const activeBtn = container.querySelector(`[data-tab="${activeTab}"]`) as HTMLElement;
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeTab]);

  const tabLabel: Record<Tab, string> = {
    basic: "Basic",
    summary: "Summary",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    projects: "Projects",
    ats: "ATS",
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-50">

      {/* ── TOP BAR ── */}
      <div className="bg-white border-b px-3 sm:px-5 py-2.5 flex items-center justify-between gap-2 flex-shrink-0">
        {/* Title */}
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-sm sm:text-base font-semibold border-none shadow-none w-28 sm:w-52 p-0 focus-visible:ring-0 truncate"
        />

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {saving ? "Saving..." : saved ? "✓ Saved" : "Unsaved"}
          </span>
          <Button variant="outline" size="sm" onClick={() => setShowUpload(true)} className="text-xs">
            📤 Upload
          </Button>
          <select
          value={activeTemplate}
            onChange={(e) => setActiveTemplate(e.target.value)}
              className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            {templateList.map((t) => (
            <option key={t.id} value={t.id}>
            {t.name}
             </option>
            ))}
            </select>
          <Button onClick={saveResume} disabled={saving} size="sm" className="text-xs">Save</Button>
          <Button onClick={downloadPDF} variant="outline" size="sm" className="text-xs">⬇ PDF</Button>
          <Button
            onClick={togglePublic}
            size="sm"
            variant={isPublic ? "default" : "outline"}
            className={`text-xs ${isPublic ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
          >
            {isPublic ? "🌍 Shared" : "🔗 Share"}
          </Button>
        </div>

        {/* Mobile actions */}
        <div className="flex md:hidden items-center gap-2">
          {/* View toggle */}
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setMobileView("editor")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${
                mobileView === "editor" ? "bg-white shadow text-gray-800" : "text-gray-500"
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setMobileView("preview")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${
                mobileView === "preview" ? "bg-white shadow text-gray-800" : "text-gray-500"
              }`}
            >
              Preview
            </button>
          </div>

          {/* Mobile overflow menu */}
          <div className="relative">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
              </svg>
            </button>
            {showMobileMenu && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowMobileMenu(false)} />
                <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-40 py-1 overflow-hidden">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-400">{saving ? "Saving..." : saved ? "✓ Saved" : "Unsaved changes"}</p>
                  </div>
                  <button onClick={() => { setShowUpload(true); setShowMobileMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    📤 Upload Resume
                  </button>
                  <div className="px-4 py-2 border-t border-gray-100">
                    <label className="text-xs text-gray-500 block mb-1">Template</label>
                    <select
                      value={activeTemplate}
                      onChange={(e) => { setActiveTemplate(e.target.value); setShowMobileMenu(false); }}
                      className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      <option value="ats-clean">ATS Clean</option>
                      <option value="modern-pro">Modern Pro</option>
                      <option value="minimal-dark">Minimal Dark</option>
                    </select>
                  </div>
                  <button onClick={() => { saveResume(); setShowMobileMenu(false); }} disabled={saving} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-t border-gray-100">
                    💾 Save
                  </button>
                  <button onClick={() => { downloadPDF(); setShowMobileMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    ⬇ Download PDF
                  </button>
                  <button onClick={() => { togglePublic(); setShowMobileMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    {isPublic ? "🌍 Unshare" : "🔗 Share Link"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── EDITOR PANEL ── */}
        <div className={`
          flex flex-col w-full md:w-1/2 bg-white border-r border-gray-200 overflow-hidden
          ${mobileView === "preview" ? "hidden md:flex" : "flex"}
        `}>
          {/* Tab bar */}
          <div ref={tabsRef} className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide flex-shrink-0">
            {TABS.map((tab) => (
              <button
                key={tab}
                data-tab={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium capitalize whitespace-nowrap transition-colors flex-shrink-0 ${
                  activeTab === tab
                    ? "border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50/50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tabLabel[tab]}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">

            {/* BASIC */}
            {activeTab === "basic" && (
              <div className="space-y-4">
                <h2 className="font-semibold text-gray-900">Basic Information</h2>
                {(["name", "email", "phone", "location", "linkedin", "github"] as const).map((field) => (
                  <div key={field}>
                    <label className="text-xs font-medium text-gray-600 capitalize mb-1.5 block">{field}</label>
                    <Input
                      value={basicInfo[field]}
                      onChange={(e) => setBasicInfo({ ...basicInfo, [field]: e.target.value })}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      className="text-sm"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* SUMMARY */}
            {activeTab === "summary" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Professional Summary</h2>
                  <Button size="sm" variant="outline" onClick={generateSummary} disabled={aiLoading === "summary"} className="text-xs">
                    {aiLoading === "summary" ? (
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                        Generating...
                      </span>
                    ) : "✨ AI Generate"}
                  </Button>
                </div>
                <Textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Write a professional summary or click AI Generate..."
                  rows={6}
                  className="text-sm resize-none"
                />
              </div>
            )}

            {/* EXPERIENCE */}
            {activeTab === "experience" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Work Experience</h2>
                  <Button size="sm" onClick={addExperience} className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white">+ Add</Button>
                </div>
                {experience.map((exp, i) => (
                  <div key={exp.id} className="border border-gray-200 rounded-xl p-4 space-y-3 relative group">
                    <button
                      onClick={() => removeExperience(i)}
                      className="absolute top-3 right-3 text-gray-300 hover:text-red-400 transition text-sm"
                    >✕</button>
                    <Input placeholder="Company" value={exp.company} onChange={(e) => updateExperience(i, "company", e.target.value)} className="text-sm" />
                    <Input placeholder="Role / Title" value={exp.role} onChange={(e) => updateExperience(i, "role", e.target.value)} className="text-sm" />
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Start Date" value={exp.startDate} onChange={(e) => updateExperience(i, "startDate", e.target.value)} className="text-sm" />
                      <Input placeholder="End Date" value={exp.endDate} onChange={(e) => updateExperience(i, "endDate", e.target.value)} className="text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-2 block">Bullet Points</label>
                      {exp.bullets.map((bullet, bi) => (
                        <div key={bi} className="flex gap-2 mb-2">
                          <Input
                            value={bullet}
                            onChange={(e) => updateBullet(i, bi, e.target.value)}
                            placeholder="Describe your impact..."
                            className="text-sm flex-1"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => rewriteBullet(i, bi)}
                            disabled={aiLoading === `bullet-${i}-${bi}`}
                            title="AI Rewrite"
                            className="flex-shrink-0 px-2"
                          >
                            {aiLoading === `bullet-${i}-${bi}` ? (
                              <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                            ) : "✨"}
                          </Button>
                          <button
                            onClick={() => removeBullet(i, bi)}
                            className="text-gray-300 hover:text-red-400 transition flex-shrink-0 px-1"
                          >✕</button>
                        </div>
                      ))}
                      <Button size="sm" variant="ghost" onClick={() => addBullet(i)} className="text-xs text-gray-500">
                        + Add bullet
                      </Button>
                    </div>
                  </div>
                ))}
                {experience.length === 0 && (
                  <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                    <p className="text-sm">No experience yet</p>
                    <button onClick={addExperience} className="text-indigo-600 text-sm mt-1 hover:underline">+ Add your first job</button>
                  </div>
                )}
              </div>
            )}

            {/* EDUCATION */}
            {activeTab === "education" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Education</h2>
                  <Button size="sm" onClick={addEducation} className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white">+ Add</Button>
                </div>
                {education.map((edu, i) => (
                  <div key={edu.id} className="border border-gray-200 rounded-xl p-4 space-y-3 relative">
                    <button onClick={() => removeEducation(i)} className="absolute top-3 right-3 text-gray-300 hover:text-red-400 transition text-sm">✕</button>
                    <Input placeholder="Institution" value={edu.institution} onChange={(e) => { const u = [...education]; u[i] = { ...u[i], institution: e.target.value }; setEducation(u); }} className="text-sm" />
                    <Input placeholder="Degree (e.g. B.Tech)" value={edu.degree} onChange={(e) => { const u = [...education]; u[i] = { ...u[i], degree: e.target.value }; setEducation(u); }} className="text-sm" />
                    <Input placeholder="Field of Study" value={edu.field} onChange={(e) => { const u = [...education]; u[i] = { ...u[i], field: e.target.value }; setEducation(u); }} className="text-sm" />
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Start Year" value={edu.startDate} onChange={(e) => { const u = [...education]; u[i] = { ...u[i], startDate: e.target.value }; setEducation(u); }} className="text-sm" />
                      <Input placeholder="End Year" value={edu.endDate} onChange={(e) => { const u = [...education]; u[i] = { ...u[i], endDate: e.target.value }; setEducation(u); }} className="text-sm" />
                    </div>
                    <Input placeholder="Grade / GPA (optional)" value={edu.grade} onChange={(e) => { const u = [...education]; u[i] = { ...u[i], grade: e.target.value }; setEducation(u); }} className="text-sm" />
                  </div>
                ))}
                {education.length === 0 && (
                  <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                    <p className="text-sm">No education added</p>
                    <button onClick={addEducation} className="text-indigo-600 text-sm mt-1 hover:underline">+ Add education</button>
                  </div>
                )}
              </div>
            )}

            {/* SKILLS */}
            {activeTab === "skills" && (
              <div className="space-y-4">
                <h2 className="font-semibold text-gray-900">Skills</h2>
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill..."
                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
                    className="text-sm flex-1"
                  />
                  <Button onClick={addSkill} className="bg-indigo-600 hover:bg-indigo-700 text-white flex-shrink-0">Add</Button>
                </div>
                {skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="cursor-pointer hover:bg-red-100 hover:text-red-700 transition text-xs py-1 px-2.5"
                        onClick={() => setSkills(skills.filter((_, si) => si !== i))}
                      >
                        {skill} ×
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-6">No skills added yet. Type a skill and press Enter or click Add.</p>
                )}
              </div>
            )}

            {/* PROJECTS */}
            {activeTab === "projects" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Projects</h2>
                  <Button size="sm" onClick={addProject} className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white">+ Add</Button>
                </div>
                {projects.map((proj, i) => (
                  <div key={proj.id} className="border border-gray-200 rounded-xl p-4 space-y-3 relative">
                    <button onClick={() => removeProject(i)} className="absolute top-3 right-3 text-gray-300 hover:text-red-400 transition text-sm">✕</button>
                    <Input placeholder="Project Name" value={proj.name} onChange={(e) => { const u = [...projects]; u[i] = { ...u[i], name: e.target.value }; setProjects(u); }} className="text-sm" />
                    <Textarea placeholder="Description" value={proj.description} onChange={(e) => { const u = [...projects]; u[i] = { ...u[i], description: e.target.value }; setProjects(u); }} rows={3} className="text-sm resize-none" />
                    <Input placeholder="Tech Stack (comma separated)" value={proj.techStack.join(", ")} onChange={(e) => { const u = [...projects]; u[i] = { ...u[i], techStack: e.target.value.split(",").map(s => s.trim()) }; setProjects(u); }} className="text-sm" />
                    <Input placeholder="Project Link (optional)" value={proj.link} onChange={(e) => { const u = [...projects]; u[i] = { ...u[i], link: e.target.value }; setProjects(u); }} className="text-sm" />
                  </div>
                ))}
                {projects.length === 0 && (
                  <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                    <p className="text-sm">No projects added</p>
                    <button onClick={addProject} className="text-indigo-600 text-sm mt-1 hover:underline">+ Add a project</button>
                  </div>
                )}
              </div>
            )}

            {/* ATS */}
            {activeTab === "ats" && (
              <ATSAnalyzer resumeText={getResumeText()} />
            )}
          </div>
        </div>

        {/* ── PREVIEW PANEL ── */}
        <div className={`
          flex-1 bg-gray-100 overflow-auto
          ${mobileView === "editor" ? "hidden md:block" : "block"}
        `} id="resume-preview-wrapper">
          <div className="p-3 sm:p-6">
            {/* Scale wrapper for preview */}
            <div className="w-full overflow-x-auto">
              <div
                className="origin-top-left"
                style={{
                  transform: "scale(var(--preview-scale, 1))",
                  minWidth: "210mm",
                }}
              >
                <ResumePreview
                  basicInfo={basicInfo}
                  summary={summary}
                  experience={experience}
                  education={education}
                  skills={skills}
                  projects={projects}
                  template={activeTemplate}
                />
              </div>
            </div>
          </div>

          <style jsx>{`
            @media (max-width: 640px) {
              #resume-preview-wrapper > div > div > div {
                --preview-scale: 0.5;
                margin-bottom: -50%;
              }
            }
            @media (min-width: 641px) and (max-width: 1023px) {
              #resume-preview-wrapper > div > div > div {
                --preview-scale: 0.7;
                margin-bottom: -30%;
              }
            }
          `}</style>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <ResumeUpload onParsed={handleParsedResume} onClose={() => setShowUpload(false)} />
      )}

      {/* AI Copilot */}
      <AICopilotChat resumeText={getResumeText()} />
    </div>
  );
}