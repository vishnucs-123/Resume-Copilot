"use client";

import { Input } from "@/components/ui/input";

export default function PersonalInfoSection({
  data,
  setData,
}: any) {
  return (
    <div className="space-y-3">
      <Input
        placeholder="Full Name"
        value={data.name || ""}
        onChange={(e) =>
          setData({ ...data, name: e.target.value })
        }
      />

      <Input
        placeholder="Email"
        value={data.email || ""}
        onChange={(e) =>
          setData({ ...data, email: e.target.value })
        }
      />

      <Input
        placeholder="Phone"
        value={data.phone || ""}
        onChange={(e) =>
          setData({ ...data, phone: e.target.value })
        }
      />

      <Input
        placeholder="LinkedIn URL"
        value={data.linkedin || ""}
        onChange={(e) =>
          setData({ ...data, linkedin: e.target.value })
        }
      />

      <Input
        placeholder="GitHub URL"
        value={data.github || ""}
        onChange={(e) =>
          setData({ ...data, github: e.target.value })
        }
      />

      <Input
        placeholder="Portfolio URL"
        value={data.portfolio || ""}
        onChange={(e) =>
          setData({ ...data, portfolio: e.target.value })
        }
      />
    </div>
  );
}