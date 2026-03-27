/**
 * OVERSCITE Global — Notifications Cloud Functions Barrel
 * UTCB-S V1.0.00 — Unified Notifications & LARI-Monitor Architecture
 */

export { recordNotificationEvent } from './recordNotificationEvent';
export { dispatchNotification } from './dispatchNotification';
export { recordDeliveryAttempt } from './recordDeliveryAttempt';
export { financialNotificationRouter } from './financialNotificationRouter';

export const notificationsRouter = {
  recordNotificationEvent:  require('./recordNotificationEvent').recordNotificationEvent,
  dispatchNotification:     require('./dispatchNotification').dispatchNotification,
  recordDeliveryAttempt:    require('./recordDeliveryAttempt').recordDeliveryAttempt,
  financialNotificationRouter: require('./financialNotificationRouter').financialNotificationRouter,
};
