import { XsciteControllerUI } from "@/components/xscite/XsciteControllerUI";
import { LiveFlightProvider } from "@/context/LiveFlightContext";
import { ScingularRuntimeProvider } from "@/context/ScingularRuntimeContext";
import { ArcIdentityProvider } from "@/lib/auth/ArcIdentityContext";

/**
 * @fileOverview XSCITE™ Controller Page
 * @route /xscite/controller
 */
export default function XsciteControllerPage() {
  return (
    <ArcIdentityProvider>
      <ScingularRuntimeProvider>
        <LiveFlightProvider>
          <XsciteControllerUI />
        </LiveFlightProvider>
      </ScingularRuntimeProvider>
    </ArcIdentityProvider>
  );
}
