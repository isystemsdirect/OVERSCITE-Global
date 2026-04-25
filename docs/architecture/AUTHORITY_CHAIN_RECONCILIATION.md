# Authority Chain Reconciliation

## Purpose
This document reconciles the legacy authority flow with the current IU expression chain without erasing historical lineage.

## Legacy Flow (Pre-SCIMEGA™)
**Human** → **ARC Identity Validation** → **Scing / SCINGULAR™** → **System**

In this model, ARC was the first gate. The human authenticated via ARC, and the system responded. Scing operated as a parallel advisory layer.

## Current IU Expression Flow
**IU Imprint** → **Scing Interface** → **LARI-ArcHive™** → **System**

In this model:
1. The **IU Imprint** represents the human's intellectual presence — their intent, context, and authority.
2. **Scing** translates that intent into governed system actions. Scing context is required before LARI-ArcHive™ can perform system translation.
3. **LARI-ArcHive™** performs the system translation — converting Scing-governed intent into executable operations, manifests, and witness records.
4. **System** executes under BANE/TEON constraints.

## Where ARC Fits
ARC has not been replaced. It operates at the **identity admission** layer:
- ARC validates that the human is who they claim to be (authentication).
- ARC binds actions to an accountable individual (attribution).
- ARC is a prerequisite for IU Imprint activation — you cannot imprint without verified identity.

The distinction: **ARC validates identity; Scing expresses intent.**

## No Authority Inversion
- Scing cannot bypass ARC identity requirements.
- LARI-ArcHive™ cannot bypass Scing context requirements.
- The system cannot execute without traversing the full chain.
- No external LLM or SDK may bypass Scing to access LARI-ArcHive™ directly.

## SCIMEGA™ Autonomy Chain (Extended)
**IU Authorization** → **Scing BFI Interface** → **LARI-ArcHive™ Translation** → **SCIMEGA™ DOS** → **BANE Gate** → **TEON Envelope** → **PL Boundary**
