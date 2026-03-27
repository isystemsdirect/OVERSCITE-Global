import { onRequest } from 'firebase-functions/v2/https';
import * as functions from 'firebase-functions/v1';
import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
import { baneRouter } from './bane';
import { lariRouter } from './lari';
import { aipRouter } from './aip';

// Initialize Firebase Admin
admin.initializeApp();

// Export BANE functions (security)
export const bane = baneRouter;

// Export LARI functions (AI engines)
export const lari = lariRouter;

// Export AIP functions (protocol)
export const aip = aipRouter;

// Health check endpoint
export const healthCheck = onRequest((req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'ScingOS Cloud Functions',
    version: '0.1.0-v2',
    timestamp: new Date().toISOString(),
  });
});

// User creation trigger (v1 fallback due to SDK version limits)
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName } = user;

  // Create user document in Firestore
  await admin.firestore().collection('users').doc(uid).set({
    email,
    displayName: displayName || null,
    role: 'inspector',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log(`User created: ${uid}`);
});

// Inspection completion trigger
export const onInspectionComplete = onDocumentUpdated('inspections/{inspectionId}', async (event) => {
  const before = event.data?.before.data();
  const after = event.data?.after.data();

  if (before && after && before.status !== 'completed' && after.status === 'completed') {
    const inspectionId = event.params.inspectionId;
    console.log(`Inspection completed: ${inspectionId}`);

    // TODO: Generate report
    // TODO: Send notification
  }
});