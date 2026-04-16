import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function NewResumePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const resume = await db.resume.create({
    data: {
      userId,
      title: "My Resume",

      basicInfo: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        portfolio: "",
        leetcode: "",
        hackerrank: "",
      },

      summary: "",

      experience: [],

      education: [],

      skills: [],

      projects: [],

      certifications: [],
    },
  });

  redirect(`/resume/${resume.id}`);
}