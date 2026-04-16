"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    href: "/dashboard",
    title: "Dashboard",
    desc: "Overview of your activity",
  },
  {
    href: "/resume/new",
    title: "New Resume",
    desc: "Create a fresh ATS-ready resume",
  },
  {
    href: "/jobs",
    title: "Job Tracker",
    desc: "Manage saved and applied jobs",
  },
  {
    href: "/match",
    title: "Job Matcher",
    desc: "Check how well your resume fits",
  },
  {
    href: "/skills",
    title: "Skill Gap",
    desc: "Find missing skills quickly",
  },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = open ? "hidden" : "auto";
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="text-2xl rounded-xl"
        aria-label="Open menu"
      >
        ☰
      </Button>

      {/* Overlay + Menu */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Background */}
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Fullscreen Menu */}
        <div
          className={`absolute inset-0 flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white transition-transform duration-300 ease-out ${
            open ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <div>
              <h2 className="text-lg font-semibold">Resume Copilot</h2>
              <p className="text-sm text-white/60">Navigation</p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="text-white hover:bg-white/10 rounded-xl"
              aria-label="Close menu"
            >
              ✕
            </Button>
          </div>

          {/* Nav Links */}
          <div className="flex-1 px-6 py-6 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-4 hover:bg-white/10 transition"
              >
                <div className="text-base font-semibold">{item.title}</div>
                <div className="text-sm text-white/60 mt-1">{item.desc}</div>
              </Link>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="px-6 pb-8 pt-4 border-t border-white/10">
            <Link
              href="/resume/new"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center rounded-2xl bg-white text-black font-semibold py-3 hover:opacity-90 transition"
            >
              Build Resume
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}