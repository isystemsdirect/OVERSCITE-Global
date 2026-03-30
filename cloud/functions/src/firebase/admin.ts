import * as admin from 'firebase-admin';

/**
 * SCINGULAR Canonical Firebase Admin Provider (Cloud Functions Local)
 */
export function getAdminFirestore() {
  return admin.firestore();
}

export function getAdminAuth() {
  return admin.auth();
}

export function getAdminStorage() {
  return admin.storage();
}
