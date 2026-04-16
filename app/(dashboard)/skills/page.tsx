"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SkillGapAnalyzer() {
  const [role, setRole] = useState("");
  const [existingSkills, setExistingSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState("");

  const analyzeSkills = async () => {
    if (!role.trim()) {
      setError("Please enter a target role");
      return;
    }

    setError("");
    setLoading(true);
    setResults([]);

    try {
      const currentSkills = existingSkills
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

      const res = await fetch("/api/ai/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: role.trim(), existingSkills: currentSkills }),
      });

      const data = await res.json();

if (!res.ok) {
  throw new Error(data.error || "Something went wrong");
}

// ✅ SAFE TYPE FIX (no unknown, no TS error)
const rawResult = data?.result;

const cleaned: string[] = Array.isArray(rawResult)
  ? rawResult.filter((item): item is string => typeof item === "string")
  : [];

setResults(Array.from(new Set(cleaned)));
    } catch (e: any) {
      setError(e.message || "Failed to analyze skills");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* HEADER */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Skill Gap Analyzer
        </h1>
        <p className="text-gray-500 text-sm mb-5">
          Discover missing skills for your target role and learn exactly what to improve.
        </p>

        <div className="space-y-4">
          {/* ROLE */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Target Role
            </label>
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Full Stack Developer"
            />
          </div>

          {/* SKILLS */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Your Skills (optional)
            </label>
            <Input
              value={existingSkills}
              onChange={(e) => setExistingSkills(e.target.value)}
              placeholder="React, Node.js, SQL..."
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            onClick={analyzeSkills}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? "Analyzing..." : "Analyze Skills"}
          </Button>
        </div>
      </div>

      {/* RESULTS */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Recommended Skills
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {results.map((skill, index) => (
              <div
                key={index}
                className="bg-white border rounded-xl p-4 flex flex-col justify-between hover:shadow-sm transition"
              >
                <span className="font-semibold text-gray-900 mb-3">
                  {skill}
                </span>

                <div className="flex flex-col gap-1 text-xs">
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                      skill + " tutorial"
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    🎥 Learn on YouTube
                  </a>

                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(
                      skill + " roadmap"
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-500 hover:underline"
                  >
                    📘 View roadmap
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && results.length === 0 && (
        <div className="text-center text-gray-400 text-sm pt-6">
          Enter a role and analyze to see missing skills
        </div>
      )}
    </div>
  );
}