
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import DashboardCard from "./DashboardCard";

export function CalendarPanel() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <DashboardCard title="Calendar">
      <div className="flex justify-center items-center h-full">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border border-border/50 bg-background/50 backdrop-blur-sm shadow-sm"
        />
      </div>
    </DashboardCard>
  );
}
