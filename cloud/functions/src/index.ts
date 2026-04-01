import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin immediately
if (admin.apps.length === 0) {
  admin.initializeApp();
}

/**
 * GROUPED EXPORTS for 1st Gen Cloud Functions
 * Preserving the group-function naming (e.g., scing-chat) while maintaining lazy-loading.
 */

// --- BANE (Security) ---
export const bane = {
  requestCapability: functions.https.onCall(async (data, context) => {
    return require('./bane').requestCapabilityFunc(data, context);
  }),
  createSDR: functions.https.onCall(async (data, context) => {
    return require('./bane').createSDRFunc(data, context);
  }),
  checkPolicy: functions.https.onCall(async (data, context) => {
    return require('./bane').checkPolicyFunc(data, context);
  }),
  issueEntitlement: functions.https.onCall(async (data, context) => {
    return require('./bane').baneIssueEntitlement(data, context);
  }),
  revokeEntitlement: functions.https.onCall(async (data, context) => {
    return require('./bane').baneRevokeEntitlement(data, context);
  }),
  issuePolicySnapshot: functions.https.onCall(async (data, context) => {
    return require('./bane').baneIssuePolicySnapshot(data, context);
  }),
};

// --- Evidence (Audit) ---
export const evidenceFinalizeArtifact = functions.https.onCall(async (data, context) => {
  return require('./evidence').evidenceFinalizeArtifact(data, context);
});
export const evidenceAppendEvent = functions.https.onCall(async (data, context) => {
  return require('./evidence').evidenceAppendEvent(data, context);
});

// --- Reports ---
export const exportInspectionReport = functions.https.onCall(async (data, context) => {
  return require('./report').exportInspectionReport(data, context);
});
export const buildInspectionReport = functions.https.onCall(async (data, context) => {
  return require('./report').buildInspectionReport(data, context);
});
export const exportInspectionBundle = functions.https.onCall(async (data, context) => {
  return require('./report').exportInspectionBundle(data, context);
});

// --- Inspection Workflow ---
export const createInspection = functions.https.onCall(async (data, context) => {
  return require('./inspection/create').createInspection(data, context);
});
export const finalizeInspection = functions.https.onCall(async (data, context) => {
  return require('./inspection/finalize').finalizeInspection(data, context);
});

// --- Monitor (Observability) ---
export const monitor = {
  classifyEvent: functions.https.onCall(async (data, context) => {
    return require('./monitor').monitorRouter.classifyEvent(data, context);
  }),
  buildAlertPacket: functions.https.onCall(async (data, context) => {
    return require('./monitor').monitorRouter.buildAlertPacket(data, context);
  }),
  routeToReviewQueue: functions.https.onCall(async (data, context) => {
    return require('./monitor').monitorRouter.routeToReviewQueue(data, context);
  }),
  aggregateTrendRollups: functions.https.onCall(async (data, context) => {
    return require('./monitor').monitorRouter.aggregateTrendRollups(data, context);
  }),
  financialEventClassifier: functions.https.onCall(async (data, context) => {
    return require('./monitor').monitorRouter.financialEventClassifier(data, context);
  }),

  // Phase 1 : BANE-Watcher Security Signals
  recordSecuritySignal: functions.https.onCall(async (data, context) => {
    return require('./monitor/securityMonitor').recordSecuritySignal(data, context);
  }),
  querySecuritySignals: functions.https.onCall(async (data, context) => {
    return require('./monitor/securityMonitor').querySecuritySignals(data, context);
  }),
};

// --- Notifications ---
export const notifications = {
  recordNotificationEvent: functions.https.onCall(async (data, context) => {
    return require('./notifications').notificationsRouter.recordNotificationEvent(data, context);
  }),
  dispatchNotification: functions.https.onCall(async (data, context) => {
    return require('./notifications').notificationsRouter.dispatchNotification(data, context);
  }),
  financialNotificationRouter: functions.https.onCall(async (data, context) => {
    return require('./notifications').notificationsRouter.financialNotificationRouter(data, context);
  }),
  recordDeliveryAttempt: functions.https.onCall(async (data, context) => {
    return require('./notifications').notificationsRouter.recordDeliveryAttempt(data, context);
  }),
};

// --- LARI ---
export const lari = {
  vision: functions.https.onCall(async (data, context) => {
    return require('./lari').lariRouter.vision(data, context);
  }),
};

// --- AIP & ISDC ---
export const aip = {
  protocol: functions.https.onCall(async (data, context) => {
    return require('./aip').aipRouter.protocol(data, context);
  }),
};
export const isdc = {
  protocol: functions.https.onCall(async (data, context) => {
    return require('./isdc').isdcRouter.protocol(data, context);
  }),
};

// --- Scing OS ---
export const scing = {
  boot: functions.https.onCall(async (data, context) => {
    return require('./scing').scingRouter.boot(data, context);
  }),
  chat: functions.https.onCall(async (data, context) => {
    return require('./scing').scingRouter.chat(data, context);
  }),
  tools: functions.https.onCall(async (data, context) => {
    return require('./scing').scingRouter.tools(data, context);
  }),
  health: functions.https.onCall(async (data, context) => {
    return require('./scing/health').scingHealth(data, context);
  }),
  
  // UTCB-S (STRICT) Gateways
  recordAsset: functions.https.onCall(async (data, context) => {
    return require('./scing/gateways').scing_record_asset(data, context);
  }),
  logSecurityEvent: functions.https.onCall(async (data, context) => {
    return require('./scing/gateways').scing_log_security_event(data, context);
  }),
  createConversationSession: functions.https.onCall(async (data, context) => {
    return require('./scing/gateways').scing_create_conversation_session(data, context);
  }),
  recordConversationMessage: functions.https.onCall(async (data, context) => {
    return require('./scing/gateways').scing_record_conversation_message(data, context);
  }),
  endConversationSession: functions.https.onCall(async (data, context) => {
    return require('./scing/gateways').scing_end_conversation_session(data, context);
  }),
  updateIntegrityStatus: functions.https.onCall(async (data, context) => {
    return require('./scing/gateways').scing_update_integrity_status(data, context);
  }),
};

// Direct aliases for specific legacy names
export const scingHealth = scing.health;
export const baneIssueEntitlement = bane.issueEntitlement;
export const baneRevokeEntitlement = bane.revokeEntitlement;
export const baneIssuePolicySnapshot = bane.issuePolicySnapshot;

// --- Observability ---
export const writeObsEvent = functions.https.onCall(async (data, context) => {
  return require('./obs').writeObsEvent(data, context);
});

// Health check endpoint (Direct request handler)
export const healthCheck = functions.https.onRequest(async (req, res) => {
  const { enforceBaneHttp } = require('./bane/enforce');
  const gate = await enforceBaneHttp({ req, res, name: 'healthCheck' });
  if (!gate.ok) return;

  res.status(200).json({
    status: 'healthy',
    service: 'ScingOS Cloud Functions',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
  });
});

// Background Triggers
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName } = user;
  await admin.firestore().collection('users').doc(uid).set({
    email,
    displayName: displayName || null,
    role: 'inspector',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});

export const onInspectionComplete = functions.firestore
  .document('inspections/{inspectionId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    if (before.status !== 'completed' && after.status === 'completed') {
      console.log(`Inspection completed: ${context.params.inspectionId}`);
    }
  });
