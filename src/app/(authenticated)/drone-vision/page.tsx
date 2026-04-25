import OversciteDroneVisionUI from "@/components/drone/OversciteDroneVisionUI";
import { LiveFlightProvider } from "@/context/LiveFlightContext";
import { ScingularRuntimeProvider } from "@/context/ScingularRuntimeContext";
import { LiveFlightSovereignShell } from "@/components/drone/LiveFlightSovereignShell";

import { ArcIdentityProvider } from "@/lib/auth/ArcIdentityContext";

export default function DroneVisionPage() {
  return (
    <ArcIdentityProvider>
      <ScingularRuntimeProvider>
        <LiveFlightProvider>
          <LiveFlightSovereignShell>
            <OversciteDroneVisionUI />
          </LiveFlightSovereignShell>
        </LiveFlightProvider>
      </ScingularRuntimeProvider>
    </ArcIdentityProvider>
  );
}
