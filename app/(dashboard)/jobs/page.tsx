"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const STATUSES = ["SAVED", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"];

const STATUS_COLORS: Record<string, string> = {
  SAVED: "bg-gray-100 text-gray-700",
  APPLIED: "bg-blue-50 text-blue-700",
  INTERVIEW: "bg-yellow-50 text-yellow-700",
  OFFER: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700",
};

export default function JobTrackerPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    jobTitle: "",
    company: "",
    jobUrl: "",
    jobDesc: "",
    status: "SAVED",
  });

  const fetchJobs = async () => {
    const res = await fetch("/api/jobs");
    const data = await res.json();
    setJobs(data.jobs || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleAdd = async () => {
    if (!form.jobTitle || !form.company) return;

    await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({
      jobTitle: "",
      company: "",
      jobUrl: "",
      jobDesc: "",
      status: "SAVED",
    });

    setShowForm(false);
    fetchJobs();
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    fetchJobs();
  };

  const deleteJob = async (id: string) => {
    const confirmDelete = confirm("Delete this job?");
    if (!confirmDelete) return;

    await fetch(`/api/jobs/${id}`, {
      method: "DELETE",
    });

    fetchJobs();
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Tracker</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track every application in one place
          </p>
        </div>

        <Button onClick={() => setShowForm(!showForm)}>
          + Add Job
        </Button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-white rounded-xl border p-6 space-y-4 shadow-sm">
          <h2 className="font-semibold text-gray-900">
            Add New Application
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              placeholder="Job Title"
              value={form.jobTitle}
              onChange={(e) =>
                setForm({ ...form, jobTitle: e.target.value })
              }
            />
            <Input
              placeholder="Company"
              value={form.company}
              onChange={(e) =>
                setForm({ ...form, company: e.target.value })
              }
            />
            <Input
              placeholder="Job URL"
              value={form.jobUrl}
              onChange={(e) =>
                setForm({ ...form, jobUrl: e.target.value })
              }
            />

            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
              className="border rounded-md px-3 py-2 text-sm"
            >
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <Textarea
            placeholder="Paste job description..."
            value={form.jobDesc}
            onChange={(e) =>
              setForm({ ...form, jobDesc: e.target.value })
            }
            rows={4}
          />

          <div className="flex gap-2">
            <Button onClick={handleAdd}>Save</Button>
            <Button
              variant="ghost"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="text-sm text-gray-500">Loading jobs...</div>
      )}

      {/* BOARD */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 overflow-x-auto">
        {STATUSES.map((status) => (
          <div key={status} className="space-y-3 min-w-[200px]">
            {/* COLUMN HEADER */}
            <div
              className={`text-xs font-semibold px-2 py-1 rounded-full text-center ${STATUS_COLORS[status]}`}
            >
              {status} (
              {jobs.filter((j) => j.status === status).length})
            </div>

            {/* JOB CARDS */}
            {jobs
              .filter((j) => j.status === status)
              .map((job) => (
                <div
                  key={job.id}
                  className="group bg-white rounded-xl border p-3 space-y-2 hover:shadow-md transition"
                >
                  <div className="font-medium text-sm text-gray-900">
                    {job.jobTitle}
                  </div>

                  <div className="text-xs text-gray-500">
                    {job.company}
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

                  {/* STATUS */}
                  <select
                    value={job.status}
                    onChange={(e) =>
                      updateStatus(job.id, e.target.value)
                    }
                    className="w-full border rounded text-xs px-1 py-1 mt-1"
                  >
                    {STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>

                  {/* ACTIONS */}
                  <div className="flex gap-2 mt-2 sm:opacity-0 sm:group-hover:opacity-100 transition">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteJob(job.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}