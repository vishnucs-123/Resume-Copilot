"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ATSAnalyzer({ resumeText }: { resumeText: string }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!resumeText) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });
      const data = await res.json();
      setResult(data.result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const scoreColor =
    result?.atsScore >= 80
      ? "text-green-600 border-green-500"
      : result?.atsScore >= 60
      ? "text-yellow-600 border-yellow-500"
      : "text-red-600 border-red-500";

  const scoreBg =
    result?.atsScore >= 80
      ? "from-green-500 to-emerald-500"
      : result?.atsScore >= 60
      ? "from-yellow-500 to-amber-500"
      : "from-red-500 to-rose-500";

  return (
    <div className="space-y-4">
      {/* Header card */}
      <div className="bg-white border rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">ATS Score Analyzer</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Check how well your resume passes Applicant Tracking Systems
            </p>
          </div>
          <Button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto flex-shrink-0"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Scanning...
              </span>
            ) : (
              "🔍 Analyze Resume"
            )}
          </Button>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4 animate-pulse">
          <div className="flex gap-4 items-center">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-100 rounded w-3/4" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-32 bg-gray-100 rounded-lg" />
            <div className="h-32 bg-gray-100 rounded-lg" />
          </div>
          <div className="h-24 bg-gray-100 rounded-lg" />
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-4">
          {/* Score card */}
          <div className="bg-white border rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              {/* Score circle */}
              <div className={`w-24 h-24 rounded-full border-4 flex-shrink-0 flex flex-col items-center justify-center mx-auto sm:mx-0 ${scoreColor}`}>
                <span className="text-3xl font-bold leading-none">{result.atsScore}</span>
                <span className="text-xs font-medium opacity-70">/ 100</span>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="font-bold text-gray-800 text-lg">
                  {result.atsScore >= 80 ? "🎉 Excellent!" : result.atsScore >= 60 ? "👍 Good" : "⚠️ Needs Work"}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Your resume scored <strong>{result.atsScore}/100</strong> for ATS compatibility
                </p>
                {/* Mini score bars */}
                <div className="flex flex-wrap gap-3 mt-3 justify-center sm:justify-start">
                  {result.readabilityScore && (
                    <div className="text-xs text-gray-500">
                      Readability: <span className="font-semibold text-gray-700">{result.readabilityScore}</span>
                    </div>
                  )}
                  {result.keywordDensity && (
                    <div className="text-xs text-gray-500">
                      Keywords: <span className="font-semibold text-gray-700">{result.keywordDensity}</span>
                    </div>
                  )}
                </div>
                {/* Progress bar */}
                <div className="mt-3 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${scoreBg} transition-all duration-700`}
                    style={{ width: `${result.atsScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Strengths + Weaknesses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2 text-sm">
                <span className="w-5 h-5 bg-green-200 rounded-full flex items-center justify-center text-xs">✓</span>
                Strengths
              </h4>
              <ul className="space-y-1.5">
                {result.strengths?.map((s: string, i: number) => (
                  <li key={i} className="flex gap-2 text-xs text-green-700">
                    <span className="mt-0.5 flex-shrink-0">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
              <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2 text-sm">
                <span className="w-5 h-5 bg-red-200 rounded-full flex items-center justify-center text-xs">✗</span>
                Weaknesses
              </h4>
              <ul className="space-y-1.5">
                {result.weaknesses?.map((w: string, i: number) => (
                  <li key={i} className="flex gap-2 text-xs text-red-700">
                    <span className="mt-0.5 flex-shrink-0">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Missing elements */}
          {result.missingElements?.length > 0 && (
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
              <h4 className="font-semibold text-amber-800 mb-3 text-sm flex items-center gap-2">
                <span>⚠️</span> Missing Elements
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.missingElements.map((m: string, i: number) => (
                  <span
                    key={i}
                    className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full border border-amber-200"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {result.suggestions?.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h4 className="font-semibold text-blue-800 mb-3 text-sm flex items-center gap-2">
                <span>💡</span> Actionable Suggestions
              </h4>
              <ol className="space-y-2">
                {result.suggestions.map((s: string, i: number) => (
                  <li key={i} className="flex gap-3 text-xs text-blue-700">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center font-bold text-xs">
                      {i + 1}
                    </span>
                    <span className="mt-0.5">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}