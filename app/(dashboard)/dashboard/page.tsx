import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ResumeCard from "@/components/resume/ResumeCard";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const userDb = await db.user.findUnique({
    where: { id: userId },
  });

  const resumes = await db.resume.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  const jobApps = await db.jobApplication.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const statusCounts = {
   SAVED: jobApps.filter((j) => j.status === "SAVED").length,
APPLIED: jobApps.filter((j) => j.status === "APPLIED").length,
INTERVIEW: jobApps.filter((j) => j.status === "INTERVIEW").length,
OFFER: jobApps.filter((j) => j.status === "OFFER").length,
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {session.user.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your resumes and track applications
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <div className="text-xs sm:text-sm bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-100">
            ✨ AI Credits: <strong>{userDb?.aiCallsToday || 0}</strong>
          </div>
          <Link href="/resume/new">
            <Button>+ New Resume</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Create Resume", href: "/resume/new" },
          { label: "Upload Resume", href: "/resume/new" },
          { label: "Match Job", href: "/match" },
          { label: "Optimize", href: "/resume/new" },
        ].map((action) => (
          <Link key={action.label} href={action.href}>
            <div className="cursor-pointer bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
              <p className="font-semibold text-gray-900 text-sm">
                {action.label}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Saved", count: statusCounts.SAVED },
          { label: "Applied", count: statusCounts.APPLIED },
          { label: "Interview", count: statusCounts.INTERVIEW },
          { label: "Offer", count: statusCounts.OFFER },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
          >
            <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Your Resumes
        </h2>

        {resumes.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center">
            <p className="text-gray-500 mb-4">No resumes yet</p>
            <Link href="/resume/new">
              <Button>Create your first resume</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}