import OversciteDroneVisionUI from "@/components/drone/OversciteDroneVisionUI";
import { LiveFlightProvider } from "@/context/LiveFlightContext";
import { ScingularRuntimeProvider } from "@/context/ScingularRuntimeContext";
import { LiveFlightSovereignShell } from "@/components/drone/LiveFlightSovereignShell";

export default function DroneVisionPage() {
  return (
    <ScingularRuntimeProvider>
      <LiveFlightProvider>
        <LiveFlightSovereignShell>
          <OversciteDroneVisionUI />
        </LiveFlightSovereignShell>
      </LiveFlightProvider>
    </ScingularRuntimeProvider>
  );
}
