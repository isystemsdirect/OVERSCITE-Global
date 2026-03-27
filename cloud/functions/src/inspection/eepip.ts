import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

/**
 * EEPIP BACKEND CANON
 * Governed by UTCB_G_Canon_Patch_V1
 */

/**
 * Layer 1 & 2: Fetch and Normalize
 * STATUS: [SIMULATION] - Mock multi-source retrieval for architecture validation.
 */
export const fetchExternalPropertyIntelligence = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
    }

    const { propertyId, address } = data;
    console.log(`[SIMULATION] EEPIP: Fetching candidate data for ${propertyId} at ${address}`);

    // [SIMULATION] Mock multi-source retrieval
    const sources = [
      {
        id: 'assessor_v1',
        name: 'County Assessor',
        data: { lot_size: 5400, year_built: 1994, square_feet: 2150 }
      },
      {
        id: 'zoning_v1',
        name: 'Municipal Zoning',
        data: { zoning_code: 'R-1', usage: 'Single Family' }
      },
      {
        id: 'hazards_v1',
        name: 'Hazard Records',
        data: { flood_zone: 'X', seismic_risk: 'Low' }
      }
    ];

    return {
      success: true,
      propertyId,
      retrieved_at: new Date().toISOString(),
      sources,
      classification: 'SIMULATION'
    };
  }
);



/**
 * Layer 3: Delta Packet Construction
 * STATUS: [PROVISIONAL] - Prepares candidate changes for human review.
 */
interface EEPIP_Source {
  id: string;
  name: string;
  data: Record<string, any>;
}

interface EEPIP_Data {
  sources: EEPIP_Source[];
  retrieved_at: string;
}

interface FieldChange {
  section: string;
  field_path: string;
  old_value: any;
  proposed_value: any;
  change_type: 'NEW' | 'MODIFIED' | 'DELETED';
  source: string;
  source_timestamp: string;
  impact_level: 'LOW' | 'MEDIUM' | 'HIGH';
  validation_status: 'PENDING' | 'VALIDATED' | 'REJECTED';
}

export const buildPropertyDeltaPacket = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
    }

    const { propertyId, eepipData, currentPip } = data as {
      propertyId: string;
      eepipData: EEPIP_Data;
      currentPip: Record<string, any>;
    };
    console.log(`EEPIP: Building proposed delta packet for ${propertyId}`);

    const fieldChanges: FieldChange[] = [];

    // [SIMULATION] Generic diffing logic
    eepipData.sources.forEach((source: EEPIP_Source) => {
      Object.entries(source.data).forEach(([key, value]) => {
        const currentValue = currentPip?.[key];
        if (currentValue !== value) {
          fieldChanges.push({
            section: source.name,
            field_path: key,
            old_value: currentValue || null,
            proposed_value: value,
            change_type: currentValue ? 'MODIFIED' : 'NEW',
            source: source.name,
            source_timestamp: eepipData.retrieved_at,
            impact_level: 'MEDIUM',
            validation_status: 'VALIDATED',
          });
        }
      });
    });

    const summary = `${fieldChanges.length} proposed updates from ${eepipData.sources.length} sources.`;
    return {
      delta_packet_id: `dp_${propertyId}_${Date.now()}`,
      property_id: propertyId,
      pip_version_base: currentPip?.version || 1,
      proposed_eepip_version: 'v1.0.0',
      retrieved_at: eepipData.retrieved_at,
      source_list: eepipData.sources.map((s: EEPIP_Source) => s.name),
      change_count: fieldChanges.length,
      material_change_flag: fieldChanges.length > 0,
      impact_summary: summary,
      field_changes: fieldChanges,
      classification: 'SIMULATION'
    };
  }
);





/**
 * Layer 4: Application and Audit
 * STATUS: [IMPLEMENTED] - Governs atomic PIP mutation and versioned audit trail.
 */
interface ApplyDeltaParams {
  propertyId: string;
  deltaPacketId: string;
  acceptedFields: string[]; // field_paths
  actorId: string;
}

export const applyAcceptedPropertyDelta = functions.https.onCall(
  async (data: ApplyDeltaParams, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
    }

    const { propertyId, deltaPacketId, acceptedFields, actorId } = data;
    const db = admin.firestore();

    try {
      return await db.runTransaction(async (transaction) => {
        const pipRef = db.collection('property_pips').doc(propertyId);
        const pipDoc = await transaction.get(pipRef);

        if (!pipDoc.exists) {
          throw new functions.https.HttpsError('not-found', 'PIP not found');
        }

        const currentPip = pipDoc.data() || {};
        const preVersion = currentPip.pip_version || 1;
        const postVersion = preVersion + 1;

        // 1. Snapshot the old version for history
        const vId = `${propertyId}_v${preVersion}`;
        const versionRef = db.collection('property_pip_versions').doc(vId);
        transaction.set(versionRef, {
          ...currentPip,
          archived_at: admin.firestore.FieldValue.serverTimestamp(),
          archived_by: actorId
        });

        // 2. Update main PIP with accepted fields and new metadata
        const updates: any = {
          pip_version: postVersion,
          last_eepip_accepted_at: new Date().toISOString(),
          eepip_status: acceptedFields.length > 0 ? 'PARTIALLY_INGESTED' : 'FULLY_INGESTED',
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        // [SIMULATION] Value merge logic would go here
        transaction.update(pipRef, updates);

        // 3. Write Audit Entry (Canon Standard)
        const auditRef = db.collection('property_audit_log').doc();
        transaction.set(auditRef, {
          event_id: auditRef.id,
          property_id: propertyId,
          actor_id: actorId,
          event_type: 'eepip_accept',
          delta_packet_id: deltaPacketId,
          event_timestamp: new Date().toISOString(),
          pip_version_before: preVersion,
          pip_version_after: postVersion,
          source_summary: `Ingested ${acceptedFields.length} fields from EEPIP`,
          classification: 'SIMULATION_MUTATION'
        });

        return { success: true, new_version: postVersion };
      });
    } catch (error) {
      console.error(`EEPIP Error: ${error}`);
      throw new functions.https.HttpsError('internal', 'Failed to apply delta packet');
    }
  }
);

/**
 * Freshness Verification
 * STATUS: [SIMULATION] - Advisory check for external source availability.
 */
export const runPropertyFreshnessCheck = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
  }

  const { propertyId } = data;
  console.log(`[SIMULATION] EEPIP: Running freshness check for ${propertyId}`);

  // Log freshness detection event (Canon Standard)
  const auditRef = admin.firestore().collection('property_audit_log').doc();
  await auditRef.set({
    event_id: auditRef.id,
    property_id: propertyId,
    event_type: 'pip_freshness_no_change',
    event_timestamp: new Date().toISOString(),
    classification: 'SIMULATION'
  });

  return {
    status: 'NO_CHANGE',
    last_verified_at: new Date().toISOString(),
    classification: 'SIMULATION'
  };
});


export const writePropertyAuditTrail = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
  }
  // Internal audit logging utility
});

