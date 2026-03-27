"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lariRouter = exports.generateReportFunc = exports.detectDefectsFunc = exports.understandIntentFunc = void 0;
const https_1 = require("firebase-functions/v2/https");
const language_1 = require("./language");
const vision_1 = require("./vision");
const reasoning_1 = require("./reasoning");
/**
 * LARI (Language and Reasoning Intelligence)
 * AI engines for perception, analysis, and decision support
 */
// Language understanding
exports.understandIntentFunc = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Must be authenticated');
    }
    const { text } = request.data;
    const intent = await (0, language_1.understandIntent)(text);
    return { intent };
});
// Vision: Detect defects
exports.detectDefectsFunc = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Must be authenticated');
    }
    const { imageUrl } = request.data;
    const defects = await (0, vision_1.detectDefects)(imageUrl);
    return { defects };
});
// Reasoning: Generate report
exports.generateReportFunc = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'Must be authenticated');
    }
    const { inspectionId } = request.data;
    const report = await (0, reasoning_1.generateReport)(inspectionId);
    return { report };
});
exports.lariRouter = {
    understandIntent: exports.understandIntentFunc,
    detectDefects: exports.detectDefectsFunc,
    generateReport: exports.generateReportFunc,
};
//# sourceMappingURL=index.js.map