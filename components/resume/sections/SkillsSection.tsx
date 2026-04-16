"use client";

import { Input } from "@/components/ui/input";

export default function SkillsSection({ skills, setSkills }: any) {
  return (
    <div className="space-y-2">
      <Input
        placeholder="Add skill and press comma"
        onKeyDown={(e) => {
          if (e.key === ",") {
            const value = (e.target as HTMLInputElement).value.replace(",", "");
            if (!value.trim()) return;

            setSkills([...skills, value.trim()]);
            (e.target as HTMLInputElement).value = "";
          }
        }}
      />

      <div className="flex flex-wrap gap-2">
        {skills.map((skill: string, i: number) => (
          <span
            key={i}
            className="bg-gray-100 px-2 py-1 rounded text-xs"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}