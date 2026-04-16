"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function JobMatcherPage() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [optimizedData, setOptimizedData] = useState<any>(null);

  const handleMatch = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/ai/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription }),
      });

      const data = await res.json();
      setResult(data); // ✅ FIXED (no .result)
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) return;

    setOptimizing(true);

    try {
      const res = await fetch("/api/ai/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription }),
      });

      const data = await res.json();
      setOptimizedData(data.result);
    } catch (e) {
      console.error(e);
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Job Matcher</h1>
        <p className="text-gray-500 text-sm mt-1">
          Match your resume with any job description
        </p>
      </div>

      {/* INPUTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your resume..."
          className="min-h-[200px]"
        />
        <Textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste job description..."
          className="min-h-[200px]"
        />
      </div>

      {/* ACTION BUTTON */}
      <Button onClick={handleMatch} disabled={loading} className="w-full">
        {loading ? "Analyzing..." : "🔍 Match Resume"}
      </Button>

      {/* RESULT */}
      {result && (
        <div className="space-y-6">
          {/* SCORE */}
          <div className="bg-white rounded-xl border p-6 text-center">
            <div className="text-5xl sm:text-6xl font-bold text-blue-600">
              {result.score}%
            </div>
            <p className="text-gray-500 text-sm mt-1">Match Score</p>

            <div className="mt-4 bg-gray-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${result.score}%` }}
              />
            </div>
          </div>

          {/* KEYWORDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* MATCHED */}
            <div className="bg-white rounded-xl border p-4">
              <h3 className="font-semibold text-green-700 mb-2">
                Matched Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.matchedKeywords?.map((k: string, i: number) => (
                  <span
                    key={i}
                    className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full border"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>

            {/* MISSING */}
            <div className="bg-white rounded-xl border p-4">
              <h3 className="font-semibold text-red-700 mb-2">
                Missing Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords?.map((k: string, i: number) => (
                  <span
                    key={i}
                    className="bg-red-50 text-red-700 text-xs px-2 py-1 rounded-full border"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* SUGGESTIONS */}
          {result.suggestions && (
            <div className="bg-white rounded-xl border p-4">
              <h3 className="font-semibold mb-2">Suggestions</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {result.suggestions.map((s: string, i: number) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
          )}

          {/* OPTIMIZER */}
          <div className="border-t pt-6">
            <Button
              onClick={handleOptimize}
              disabled={optimizing}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              {optimizing ? "Optimizing..." : "✨ Optimize Resume"}
            </Button>
          </div>

          {/* OPTIMIZED RESULT */}
          {optimizedData && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border p-4">
                <h3 className="font-semibold mb-2">
                  Optimized Summary
                </h3>
                <p className="text-sm text-gray-700">
                  {optimizedData}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}