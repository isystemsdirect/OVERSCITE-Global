import { SCIMEGAWorkstationDomain } from "./scimega-workstation-types";

/**
 * @fileOverview Flight-Safe Calibration Whitelist
 * @authority Director
 * @governance BANE / TEON
 */

export const FLIGHT_SAFE_MODULES: string[] = [
  "sensor_health_monitor",
  "telemetry_calibration_view",
  "camera_gimbal_trim",
  "payload_non_disruptive_calibration",
  "compass_gps_status",
  "battery_thermal_envelope",
  "teon_safety_envelope_view",
  "bane_advisory_diagnostics",
  "readonly_archivem_mission_trace"
];

export const BLOCKED_DURING_PILOT_MODE: string[] = [
  "build_profile_changes",
  "firmware_export_proposals",
  "mission_plan_restructure",
  "drylink_contract_edits",
  "pl_dl_package_mutation",
  "autonomy_mode_rule_edits",
  "archive_finalization",
  "any_restart_rebind_reflash_rewrite"
];

export function isModuleFlightSafe(moduleId: string): boolean {
  return FLIGHT_SAFE_MODULES.includes(moduleId);
}
