import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';

// Asset creation trigger for LARI-Vision
export const onAssetCreated = onDocumentCreated('inspections/{inspectionId}/assets/{assetId}', async (event) => {
    const data = event.data?.data();
    if (!data) return;
    
    const { inspectionId, assetId } = event.params;

    // Only process live captures to avoid infinite loops or reprocessing uploads
    if (data.captureMode !== 'live_capture') return;

    console.log(`Analyzing asset ${assetId} for inspection ${inspectionId}`);

    // Simulating processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const findings = [
         {
            label: "Surface Anomaly",
            description: "AI analysis detected an irregularity on the surface that warrants further inspection.",
            confidence: 0.89,
            severity: "MEDIUM",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            sourceAssetId: assetId,
            engine: "LARI-VISION-CLOUD-V2"
        },
        {
            label: "Material Degradation",
            description: "Signs of potential weathering or material fatigue observed.",
            confidence: 0.72,
            severity: "LOW",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            sourceAssetId: assetId,
            engine: "LARI-VISION-CLOUD-V2"
        }
    ];

    const batch = admin.firestore().batch();
    findings.forEach(finding => {
        const ref = admin.firestore().collection(`inspections/${inspectionId}/findings`).doc();
        batch.set(ref, finding);
    });

    await batch.commit();
    console.log(`Created ${findings.length} findings for asset ${assetId}.`);
});
