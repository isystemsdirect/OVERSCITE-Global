"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baneRouter = exports.checkPolicyFunc = exports.createSDRFunc = exports.requestCapabilityFunc = void 0;
const https_1 = require("firebase-functions/v2/https");
const capability_1 = require("./capability");
const sdr_1 = require("./sdr");
const policy_1 = require("./policy");
/**
 * BANE (Backend Augmented Neural Engine)
 * Security governance and capability-based authorization
 */
// Request capability token
exports.requestCapabilityFunc = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Must be authenticated to request capabilities');
    }
    const { action, metadata } = request.data;
    const userId = request.auth.uid;
    try {
        const token = await (0, capability_1.requestCapability)(userId, action, metadata);
        return { token };
    }
    catch (error) {
        throw new https_1.HttpsError('permission-denied', error.message);
    }
});
// Create Security Decision Record
exports.createSDRFunc = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Must be authenticated');
    }
    const sdrId = await (0, sdr_1.createSDR)({
        userId: request.auth.uid,
        action: request.data.action,
        result: request.data.result,
        metadata: request.data.metadata,
    });
    return { sdrId };
});
// Check if action is allowed by policy
exports.checkPolicyFunc = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Must be authenticated');
    }
    const { action, resource } = request.data;
    const userId = request.auth.uid;
    const allowed = await (0, policy_1.checkPolicy)(userId, action, resource);
    return { allowed };
});
exports.baneRouter = {
    requestCapability: exports.requestCapabilityFunc,
    createSDR: exports.createSDRFunc,
    checkPolicy: exports.checkPolicyFunc,
};
//# sourceMappingURL=index.js.map