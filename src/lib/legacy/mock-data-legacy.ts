import type { Inspection, Inspector, Device, SubscriptionPlan, Client, MarketplaceService, MarketplaceIntegration, Team, ConferenceRoom, Job, Notification } from '../types';
import { PlaceHolderImages } from '../placeholder-images';

const getImageUrl = (id: string) => PlaceHolderImages.find(p => p.id === id)?.imageUrl || '';
const getImageHint = (id: string) => PlaceHolderImages.find(p => p.id === id)?.imageHint || '';

export const mockInspections: Inspection[] = [
  {
    id: 'INS-001',
    title: '123 Main St - Structural',
    address: '123 Main St, Anytown, CA 12345',
    inspector: 'John Doe',
    status: 'completed',
    date: new Date('2023-10-26'),
    deviceKeysUsed: ['Key-Drone', 'Key-LiDAR'],
    findingsCount: 3,
    executiveSummary: 'The property at 123 Main St was inspected on October 26, 2023. The overall structure appears sound...',
    findings: [],
    __canonical: false
  }
];

export const mockInspectors: Inspector[] = [
  { 
    id: 'USR-001', 
    name: 'John Doe', 
    role: 'Admin',
    avatarUrl: getImageUrl('avatar1'), 
    imageHint: getImageHint('avatar1'),
    onCall: true,
    rating: 4.8,
    reviews: 124,
    location: { name: 'Austin, TX', lat: 30.2672, lng: -97.7431 },
    bio: 'Senior Infrastructure Inspector with over 10 years of experience in structural integrity and forensic drone captures.',
    certifications: [
        { id: 'CERT-001', name: 'Federal Aviation Admin - Part 107', verified: true, expiresAt: '2025-12-31' },
        { id: 'CERT-002', name: 'NACE Level 3 Coating Inspector', verified: true, expiresAt: '2026-06-15' }
    ],
    offeredServices: ['Drone Analysis', 'Thermal Imaging', 'Lidar Scanning', 'BANE Compliance Audit']
  }
];

export const mockDevices: Device[] = [
  { id: 'DEV-001', name: 'Skydio X2', type: 'Key-Drone', status: 'Connected', lastSeen: '2023-10-27 10:00 AM', firmwareVersion: 'v2.1.3' }
];

export const mockClients: Client[] = [
    {
        id: "CLI-001",
        name: "Stark Industries",
        email: "contact@stark.com",
        phone: "212-555-0100",
        address: { street: "10880 Malibu Point", city: "Malibu", state: "CA", zip: "90265" },
        location: { lat: 34.0022, lng: -118.8078 },
        createdAt: "2023-01-15T00:00:00Z",
        __canonical: false
    }
];
// ... [Mocks truncated for brevity, providing minimal set for compile]
export const mockMarketplaceServices: any[] = [];
export const mockMarketplaceIntegrations: any[] = [];
export const mockNotifications: any[] = [
    {
        id: 'NOT-001',
        type: 'safety',
        title: 'BANE Shield Active',
        description: 'Global integrity monitoring is running at 100% efficiency.',
        timestamp: new Date().toISOString()
    },
    {
        id: 'NOT-002',
        type: 'post',
        title: 'New Directive',
        description: 'SCINGULAR governance update available in the documentation.',
        timestamp: new Date().toISOString()
    },
    {
        id: 'NOT-003',
        type: 'traffic',
        title: 'Airspace Clear',
        description: 'No active flight restrictions in the current operational sector.',
        timestamp: new Date().toISOString()
    }
];
export const mockAnnouncements: any[] = [];
export const mockNews: any[] = [];
export const mockTeamsData: any = {};
export const mockConferenceRooms: any[] = [];
export const mockJobs: any[] = [];

export const mockSubscriptionPlans: SubscriptionPlan[] = [
    {
        name: "LARI Basic",
        price: "$49",
        pricePeriod: "/mo",
        features: ["5 Inspections / mo", "Basic LARI Analysis", "Standard Audit Logic", "Email Support"],
        cta: "Current Plan",
        isCurrent: false
    },
    {
        name: "SCING Pro",
        price: "$149",
        pricePeriod: "/mo",
        features: ["Unlimited Inspections", "Advanced LARI Vision", "BANE Guard Integration", "Priority Support", "Drone Telemetry"],
        cta: "Select Pro",
        isCurrent: true
    },
    {
        name: "ENTERPRISE",
        price: "$499",
        pricePeriod: "/mo",
        features: ["Custom Fleet Controls", "Dedicated Logic Layer", "Director-Level Audit", "White-label Scing"],
        cta: "Contact Sales",
        isCurrent: false
    }
];
