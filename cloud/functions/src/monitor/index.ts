/**
 * OVERSCITE Global — Monitor Cloud Functions Barrel
 * UTCB-S V1.0.00 — Unified Notifications & LARI-Monitor Architecture
 */

export { classifyEvent } from './classifyEvent';
export { buildAlertPacket } from './buildAlertPacket';
export { routeToReviewQueue } from './routeToReviewQueue';
export { aggregateTrendRollups } from './aggregateTrendRollups';
export { financialEventClassifier } from './financialEventClassifier';

export const monitorRouter = {
  classifyEvent: require('./classifyEvent').classifyEvent,
  buildAlertPacket: require('./buildAlertPacket').buildAlertPacket,
  routeToReviewQueue: require('./routeToReviewQueue').routeToReviewQueue,
  aggregateTrendRollups: require('./aggregateTrendRollups').aggregateTrendRollups,
  financialEventClassifier: require('./financialEventClassifier').financialEventClassifier,
};
