
import React from "react";

export default function DashboardGreetingBar() {
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good morning. Field operations are live."
      : hour < 18
      ? "Good afternoon. Oversight is active."
      : "Good evening. Operational picture synchronized.";

  return (
    <div className="w-full rounded-xl border border-white/10 bg-[#0d1b2a]/90 px-6 py-4">
      <h1 className="text-3xl font-semibold tracking-tight text-white">
        {greeting}
      </h1>
    </div>
  );
}
