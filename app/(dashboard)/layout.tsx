import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import MobileNav from "@/components/MobileNav";
import { handleSignOut } from "@/app/actions/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8">
          <MobileNav />
          <Link href="/dashboard">
            <span className="text-lg md:text-xl font-bold text-gray-900 hidden sm:block md:block">
              Resume Copilot
            </span>
            <span className="text-xl font-bold text-indigo-600 sm:hidden">
              RC
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Dashboard
            </Link>
            <Link
              href="/resume/new"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              New Resume
            </Link>
            <Link
              href="/jobs"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Job Tracker
            </Link>
            <Link
              href="/match"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Job Matcher
            </Link>
            <Link
              href="/skills"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Skill Gap
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 hidden md:block">
            {session.user.name}
          </span>
          {session.user.image && (
            <img
              src={session.user.image}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
          )}
          <form action={handleSignOut}>
          <Button variant="ghost" size="sm" type="submit">
               Sign out
         </Button>
          </form>
        </div>
      </nav>

      {/* Page content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">{children}</main>
    </div>
  );
}