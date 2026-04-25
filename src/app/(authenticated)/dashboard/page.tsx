import DashboardGreetingBar from "@/components/dashboard/DashboardGreetingBar";
import PanelGrid from "@/components/dashboard/PanelGrid";
import { PageHeader } from "@/components/layout/PageHeader";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Command Dashboard" 
        status="live"
        description="The Command Dashboard serves as the central orchestration layer for SCINGULAR Global, providing real-time operational oversight across all active missions and personnel. It integrates high-fidelity mission maps, weather intelligence stream, and team readiness metrics into a single, cohesive visibility surface. By consolidating telemetry and status updates from the field, it enables rapid decision-making and jurisdictional coordination. This dashboard is the primary interface for maintaining SCINGULAR integrity and ensuring all field operations remain aligned with SCINGULAR governance."
      />
      <DashboardGreetingBar />
      <div className="flex-grow overflow-auto">
        <PanelGrid />
      </div>
    </div>
  );
}
