// src/lib/lari-repo/mock-data.ts
import { repoService } from './repo-service';
import { findingReviewService } from './finding-review-service';
import { notesService } from './notes-service';
import { FindingOverlay, RepoFile } from './types';

export const initializeMockData = async () => {
    // 1. Create a mock image artifact
    const mockFile: RepoFile = {
        id: 'img_8k_property_991',
        name: 'Main Property Capture_0323.jpg',
        type: 'image',
        jobId: 'JOB-2026-A1X',
        clientId: 'OVERSCITE_GLOBAL',
        createdAt: new Date().toISOString(),
        createdBy: 'SRT_SENSOR_ALPHA',
        reviewStatus: 'pending',
        ingestionEligibility: 'not_eligible',
        version: '1.0.0',
        currentVersionNumber: 1,
        metadata: {
            resolution: '7680x4320',
            exposure: 'auto',
            location: '34.0522° N, 118.2437° W'
        }
    };

    await repoService.fileArtifact(mockFile);

    // 2. Create mock findings for this image
    const findings: any[] = [
        {
            id: 'find_structural_01',
            findingNumber: 1,
            sourceFileId: mockFile.id,
            reportId: 'rep_daily_01',
            title: 'Roof Membrane Degradation',
            category: 'structural',
            severity: 'high',
            description: 'Significant weathering observed on south-facing section of EPDM roof membrane. Evidence of pooling and early-stage crack formation.',
            geometry: {
                type: 'bbox',
                x: 20,
                y: 15,
                width: 30,
                height: 25
            },
            tag: {
                label: 'Degradation',
                displayNumber: 1,
                colorToken: 'primary',
                anchorX: 20,
                anchorY: 15
            },
            review: { status: 'pending' },
            notes: [],
            audit: {
                createdAt: new Date().toISOString(),
                createdByEngine: 'LARI_ENGINE_V3',
                confidence: 0.94
            }
        },
        {
            id: 'find_hvac_02',
            findingNumber: 2,
            sourceFileId: mockFile.id,
            reportId: 'rep_daily_01',
            title: 'Anomalous Heat Signature',
            category: 'hvac',
            severity: 'medium',
            description: 'Infrared analysis indicates localized thermal bloom on HVAC unit #4. Possible bearing failure or refrigerant leak.',
            geometry: {
                type: 'bbox',
                x: 60,
                y: 45,
                width: 15,
                height: 20
            },
            tag: {
                label: 'Heat Bloom',
                displayNumber: 2,
                colorToken: 'primary',
                anchorX: 60,
                anchorY: 45
            },
            review: { status: 'pending' },
            notes: [],
            audit: {
                createdAt: new Date().toISOString(),
                createdByEngine: 'LARI_ENGINE_V3',
                confidence: 0.88
            }
        }
    ];

    // Push directly to matching service lists since they are private in my mock impl
    // (In a real app, these would be in a DB)
    (findingReviewService as any).overlays.push(...findings);

    // 3. Add an initial note to finding 1
    await notesService.addNote({
        findingId: 'find_structural_01',
        text: 'Previous inspection mentioned similar wear. Accelerated degradation suspected.',
        type: 'standards_note',
        authorId: 'inspector_smith',
        learningPortalStatus: 'pending'
    });
};
