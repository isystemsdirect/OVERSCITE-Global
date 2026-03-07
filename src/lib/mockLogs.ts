

export const srt_logs = [
    {
        id: 'srt_log_1',
        stage: 'MEASUREMENT',
        deterministicChecksum: 'cf12a27...21b448a',
        captureRef: 'cap_20240728_101234',
        stageDurationMs: 120,
    },
    {
        id: 'srt_log_2',
        stage: 'SIGNING',
        deterministicChecksum: 'a90b3c1...88c2fd0',
        captureRef: 'cap_20240728_101234',
        stageDurationMs: 45,
    },
];

export const advisory_logs = [
    {
        id: 'adv_log_1',
        advisoryBlockId: 'adv_cap_20240728_101234_narrative',
        selectedByInspector: true,
        modificationFlag: false,
    },
    {
        id: 'adv_log_2',
        advisoryBlockId: 'adv_cap_20240728_101234_remediation',
        selectedByInspector: false,
        modificationFlag: false,
    },
];

export const approval_logs = [
    {
        id: 'app_log_1',
        inspectorId: 'insp_001',
        approvalTimestamp: '2024-07-28T14:00:00Z',
        finalReportRef: 'report_cap_20240728_101234',
    },
];
