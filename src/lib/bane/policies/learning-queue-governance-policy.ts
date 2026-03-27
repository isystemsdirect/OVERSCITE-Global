// src/lib/bane/policies/learning-queue-governance-policy.ts
import { Context } from '../context';
import { Decision } from '../decision';

export const evaluateLearningQueueTransition = (context: Context, attributes: any): Decision => {
    const { userRole, subject } = context;
    const { targetStatus, packetSubmitterId } = attributes;

    // Submission segment: any role

    // Review segment: supervisor+
    if (['reviewed', 'held', 'excluded'].includes(targetStatus)) {
        if (!['supervisor', 'director', 'ADMIN'].includes(userRole)) {
            return {
                type: 'DENY',
                reasonCode: 'UNAUTHORIZED_REVIEW_ROLE',
                mode: 'NORMAL'
            };
        }
    }

    // Approval segment: director+
    if (targetStatus === 'approved_for_possible_ingestion') {
        if (!['director', 'ADMIN'].includes(userRole)) {
            return {
                type: 'DENY',
                reasonCode: 'UNAUTHORIZED_APPROVAL_ROLE',
                mode: 'NORMAL'
            };
        }
        // Multi-actor check
        if (packetSubmitterId === subject) {
             return {
                type: 'DENY',
                reasonCode: 'MULTI_ACTOR_VIOLATION',
                mode: 'NORMAL'
            };
        }
    }

    return {
        type: 'ALLOW',
        reasonCode: 'OK',
        mode: 'NORMAL'
    };
};
