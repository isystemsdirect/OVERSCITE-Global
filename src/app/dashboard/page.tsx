
import DashboardGreetingBar from "@/components/dashboard/DashboardGreetingBar";
import PanelGrid from "@/components/dashboard/PanelGrid";

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <DashboardGreetingBar />
      <div className="flex-grow overflow-auto">
        <PanelGrid />
      </div>
    </div>
  );
}
