import * as admin from 'firebase-admin';

/**
 * BCI Revocation Engine
 * 
 * Centralizes the enforcement of session, device, and scope revocation
 * for cryptographic operations.
 */
export class RevocationEngine {
    /**
     * Checks if a target (session or device) is revoked.
     */
    static async isRevoked(targetId: string, type: 'SESSION' | 'DEVICE'): Promise<boolean> {
        const db = admin.firestore();
        
        if (type === 'DEVICE') {
            const snap = await db.collection('devices').doc(targetId).get();
            const data = snap.data();
            return snap.exists && data?.postureState === 'REVOKED';
        }
        
        if (type === 'SESSION') {
            const snap = await db.collection('sessions').doc(targetId).get();
            const data = snap.data();
            return snap.exists && data?.status === 'REVOKED';
        }
        
        return false;
    }

    /**
     * Records a cryptographic revocation event.
     */
    static async recordRevocation(params: {
        targetId: string;
        targetType: 'SESSION' | 'DEVICE' | 'SCOPE';
        actorId: string;
        reason: string;
        decisionId: string;
    }): Promise<void> {
        const db = admin.firestore();
        const revColl = db.collection('audit').doc('bane').collection('revocations');
        
        await revColl.add({
            ...params,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            system: 'BCI',
        });
    }
}
