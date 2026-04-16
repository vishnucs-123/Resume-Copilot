import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PublicHomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      
      {/* NAVBAR */}
      <header className="w-full border-b px-4 md:px-8 py-4 flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-bold text-gray-900">
          Resume Copilot
        </h1>

        <div className="flex gap-2">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      {/* HERO */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-3xl text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
            Build ATS-Optimized Resumes that get you hired faster 🚀
          </h2>

          <p className="text-gray-600 text-sm md:text-lg">
            AI-powered resume builder, job matcher, ATS score analyzer, and skill gap detector — all in one platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link href="/signup">
              <Button className="w-full sm:w-auto px-6 py-2 text-base">
                Start Free
              </Button>
            </Link>

            <Link href="/dashboard">
              <Button
                variant="outline"
                className="w-full sm:w-auto px-6 py-2 text-base"
              >
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* FEATURES */}
      <section className="px-4 md:px-8 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            {
              title: "ATS Resume Builder",
              desc: "Build resumes optimized for ATS systems used by companies.",
            },
            {
              title: "Job Match Analyzer",
              desc: "Check how well your resume matches job descriptions.",
            },
            {
              title: "Skill Gap AI",
              desc: "Find missing skills for your target job role instantly.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white border rounded-xl p-6 shadow-sm"
            >
              <h3 className="font-semibold text-gray-900 mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Resume Copilot. All rights reserved.
      </footer>
    </div>
  );
}