"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useEffect } from "react";

type Resume = {
  id: string;
  title: string;
  updatedAt: string | Date;
  template: string;
  atsScore?: number | null;
  slug?: string | null;
};

export default function ResumeCard({ resume }: { resume: Resume }) {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");

  useEffect(() => {
  setDate(new Date(resume.updatedAt).toLocaleDateString());
}, []);

  const handleDelete = async () => {
    const confirmDelete = confirm("Delete this resume?");
    if (!confirmDelete) return;

    setLoading(true);
    await fetch(`/api/resume/${resume.id}`, {
      method: "DELETE",
    });
    window.location.reload();
  };

  return (
    <div className="group relative bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
      <Link href={`/resume/${resume.id}`}>
        <div>
          <h3 className="font-semibold text-gray-900">{resume.title}</h3>
          <p className="text-xs text-gray-400 mt-1">
            Updated {date}
          </p>
        </div>
      </Link>

      {resume.atsScore && (
        <span className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
          ATS {resume.atsScore}
        </span>
      )}

      <div className="mt-3 text-xs text-gray-500 capitalize">
        Template: {resume.template}
      </div>

      <div className="mt-4 flex gap-2 flex-wrap sm:opacity-0 sm:group-hover:opacity-100 transition">
        <Link href={`/resume/${resume.id}`}>
          <Button size="sm" variant="outline">
            Edit
          </Button>
        </Link>

        <Link href={`/resume/${resume.id}/preview`}>
          <Button size="sm" variant="outline">
            Preview
          </Button>
        </Link>

        <Button
          size="sm"
          variant="destructive"
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>

        <Link href={`/r/${resume.slug || resume.id}`}>
          <Button size="sm" variant="secondary">
            Share
          </Button>
        </Link>
      </div>
    </div>
  );
}