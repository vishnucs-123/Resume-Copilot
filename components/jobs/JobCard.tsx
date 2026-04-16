"use client";

import { Button } from "@/components/ui/button";

type Job = {
  id: string;
  jobTitle: string;
  company: string;
  status: string;
  jobUrl?: string;
};

export default function JobCard({
  job,
  onStatusChange,
  onDelete,
}: {
  job: Job;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-white border rounded-xl p-4 space-y-3 shadow-sm">
      <div>
        <h3 className="font-semibold text-gray-900">{job.jobTitle}</h3>
        <p className="text-sm text-gray-500">{job.company}</p>
      </div>

      {job.jobUrl && (
        <a
          href={job.jobUrl}
          target="_blank"
          className="text-xs text-blue-600 underline"
        >
          View Job
        </a>
      )}

      <div className="flex gap-2 items-center">
        <select
          value={job.status}
          onChange={(e) => onStatusChange(job.id, e.target.value)}
          className="border rounded-md text-xs px-2 py-1"
        >
          {["SAVED", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"].map(
            (s) => (
              <option key={s} value={s}>
                {s}
              </option>
            )
          )}
        </select>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(job.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}