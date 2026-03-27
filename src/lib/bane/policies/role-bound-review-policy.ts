// src/lib/bane/policies/role-bound-review-policy.ts
import { Context } from '../context';
import { Decision } from '../decision';

export type ReviewAction = 'accept' | 'reject' | 'correct' | 'add_note' | 'provisional_include';

export const evaluateRoleAction = (context: Context, action: ReviewAction): Decision => {
    const role = context.userRole as string;

    const permissions: Record<string, ReviewAction[]> = {
        'reviewer': ['accept', 'reject', 'correct', 'add_note'],
        'supervisor': ['accept', 'reject', 'correct', 'add_note', 'provisional_include'],
        'director': ['accept', 'reject', 'correct', 'add_note', 'provisional_include'],
        'admin': ['accept', 'reject', 'correct', 'add_note', 'provisional_include']
    };

    const allowedActions = permissions[role] || [];

    if (!allowedActions.includes(action)) {
        return {
            type: 'DENY',
            reasonCode: 'ACTION_NOT_PERMITTED_FOR_ROLE',
            mode: 'NORMAL'
        };
    }

    return {
        type: 'ALLOW',
        reasonCode: 'OK',
        mode: 'NORMAL'
    };
};
