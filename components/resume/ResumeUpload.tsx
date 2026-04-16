"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

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

interface ResumeUploadProps {
  onParsed: (data: ParsedResume) => void;
  onClose: () => void;
}

export default function ResumeUpload({ onParsed, onClose }: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<"idle" | "uploading" | "parsing" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  }

  async function handleUpload() {
    if (!file) return;
    setErrorMsg("");
    setStep("uploading");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || "Upload failed");
      }

      if (!uploadData.rawText || uploadData.rawText.length < 50) {
        throw new Error("Could not read enough text from your PDF. Please try a DOCX file instead.");
      }

      setStep("parsing");

      const parseRes = await fetch("/api/ai/parse-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: uploadData.rawText }),
      });

      const parseData = await parseRes.json();

      if (!parseRes.ok) {
        throw new Error(parseData.error || "Parsing failed");
      }

      setStep("done");
      setTimeout(() => { onParsed(parseData.structured); }, 800);
    } catch (err: unknown) {
      setStep("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const isProcessing = step === "uploading" || step === "parsing";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      {/* Sheet on mobile, modal on desktop */}
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 pt-4 pb-3 sm:pt-6 flex items-start justify-between border-b border-gray-100">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Upload Existing Resume</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              AI will read and fill your editor automatically
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-gray-400 hover:text-gray-600 transition ml-4 mt-0.5 disabled:opacity-40"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isProcessing && fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all ${
              isProcessing
                ? "opacity-60 cursor-not-allowed border-gray-200"
                : isDragging
                ? "border-blue-400 bg-blue-50 scale-[1.01]"
                : file
                ? "border-green-400 bg-green-50 cursor-pointer"
                : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 cursor-pointer"
            }`}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="hidden"
            />

            {file ? (
              <div>
                <div className="text-4xl mb-2">📄</div>
                <p className="font-medium text-gray-800 text-sm">{file.name}</p>
                <p className="text-xs text-gray-400 mt-1">{(file.size / 1024).toFixed(0)} KB</p>
                {!isProcessing && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile(null); setStep("idle"); }}
                    className="text-xs text-red-400 hover:text-red-600 mt-2 underline transition"
                  >
                    Remove file
                  </button>
                )}
              </div>
            ) : (
              <div>
                <div className="text-4xl mb-3">☁️</div>
                <p className="text-sm text-gray-700 font-medium">Drop your resume here</p>
                <p className="text-sm text-amber-700 font-medium">
                Best results: Upload DOCX  </p>
                <p className="text-xs text-amber-600 mt-1">
                PDF resumes can parse with broken formatting, missing sections, or incorrect text order. DOCX usually gives more accurate AI extraction.
                </p>

                <p className="text-xs text-gray-400 mt-1">or tap to browse</p>
                <div className="flex gap-2 justify-center mt-4">
                  {["PDF", "DOCX", "Max 5MB"].map((label) => (
                    <span key={label} className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Status Messages */}
          {step === "uploading" && (
            <div className="flex items-center gap-3 text-sm text-blue-600 bg-blue-50 px-4 py-3 rounded-lg">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <span>Reading your file...</span>
            </div>
          )}

          {step === "parsing" && (
            <div className="flex items-center gap-3 text-sm text-violet-600 bg-violet-50 px-4 py-3 rounded-lg">
              <div className="w-4 h-4 border-2 border-violet-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <span>AI is extracting your resume data...</span>
            </div>
          )}

          {step === "done" && (
            <div className="flex items-center gap-3 text-sm text-green-600 bg-green-50 px-4 py-3 rounded-lg">
              <span className="text-lg">✅</span>
              <span>Resume parsed! Filling your editor...</span>
            </div>
          )}

          {step === "error" && (
            <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              <p className="text-sm text-red-600">{errorMsg}</p>
              <button
                onClick={() => setStep("idle")}
                className="text-xs text-red-400 hover:text-red-600 underline mt-1.5 transition"
              >
                Try again
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={handleUpload}
              disabled={!file || isProcessing || step === "done"}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                "Parse with AI →"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}