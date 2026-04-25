
import React from "react";

export default function DashboardGreetingBar() {
  const hour = new Date().getHours();

  const timeOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  const greeting = `Good ${timeOfDay} - SCINGULAR Global Online`;

  return (
    <div className="w-full px-6 py-4">
      <h1 className="text-3xl font-semibold tracking-tight text-white/90">
        {greeting}
      </h1>
    </div>
  );
}
