# LARI-IPN Conflict Handling

## Scope
Defends the transport layer against erratic structural environments where downstream field operations frequently trigger topology failures. 

## Supported Conflicts
- **ISP Path Interference**: Routing dropped intentionally by intermediary.
- **Double NAT / CGNAT Pressure**: Ingress/egress tunnel collapsing.
- **Exterior VPN Collision**: Active transport attempts routing around encapsulated environments.
- **Enterprise Security Overlays**: OVERSCITE operating underneath strict inspection boundaries.

## Consequence Mapping
When conflicts exert pressure beyond normalized limits:
1. Devices map logically to `DEGRADED`.
2. BANE recommends opening posture parameters (`CONTROLLED` / `CONTROLLED_OPEN`) or restricts channels depending on the combination of conflict and device `SRTBound` identity.
3. Containment is enforced if conflict pressure coincides with BANE authentication failures.

## Governance Truth
Controlled Open never means safety open. BANE retains sovereign gatekeeping over all terminal payload commands regardless of underlying NAT topology.
