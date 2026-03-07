import { 
    getDb, 
    getFirebaseFunctions 
} from '../firebase';
import { 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    serverTimestamp,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    type DocumentData
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import type { 
    Inspection, 
    FieldCaptureObject, 
    AnalyticalResultObject, 
    MeasurementResultObject,
    ComplianceEvaluationObject,
    AdvisoryBlock,
    PipelineStatus
} from '../types';

/**
 * DETERMINISTIC PIPELINE PERSISTENCE ENGINE
 * Authority: ScingGPT
 */

export const pipelinePersistence = {
    
    async saveCapture(capture: FieldCaptureObject) {
        const db = getDb();
        if (!db) throw new Error("Database not available");
        
        const docRef = doc(db, 'fieldCaptures', capture.captureId);
        await setDoc(docRef, {
            ...capture,
            persistedAt: serverTimestamp()
        });
        return docRef.id;
    },

    async saveMeasurement(measurement: MeasurementResultObject) {
        const db = getDb();
        if (!db) throw new Error("Database not available");
        
        const docRef = doc(db, 'measurements', measurement.measurementId);
        await setDoc(docRef, {
            ...measurement,
            persistedAt: serverTimestamp()
        });
        return docRef.id;
    },

    async updateInspectionStatus(inspectionId: string, status: string, metadata: any = {}) {
        const db = getDb();
        if (!db) throw new Error("Database not available");
        
        const docRef = doc(db, 'inspections', inspectionId);
        await updateDoc(docRef, {
            status,
            ...metadata,
            updatedAt: serverTimestamp()
        });
    },

    async finalizeReport(inspectionId: string, inspectorNotes: string, approvals: any) {
        const db = getDb();
        if (!db) throw new Error("Database not available");

        const docRef = doc(db, 'inspections', inspectionId);
        await updateDoc(docRef, {
            status: 'Final',
            inspectorNotes,
            approvals,
            finalizedAt: serverTimestamp(),
            isLocked: true
        });
        
        // Trigger Cloud Ledger Entry (via backend function)
        const functions = getFirebaseFunctions();
        if (functions) {
            const signReport = httpsCallable(functions, 'signReport');
            await signReport({ inspectionId });
        }
    }
};
