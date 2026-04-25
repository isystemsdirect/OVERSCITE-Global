"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.onAssetCreated = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const admin = __importStar(require("firebase-admin"));
// Asset creation trigger for LARI-Vision
exports.onAssetCreated = (0, firestore_1.onDocumentCreated)('inspections/{inspectionId}/assets/{assetId}', async (event) => {
    const data = event.data?.data();
    if (!data)
        return;
    const { inspectionId, assetId } = event.params;
    // Only process live captures to avoid infinite loops or reprocessing uploads
    if (data.captureMode !== 'live_capture')
        return;
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
//# sourceMappingURL=lariVision.js.map