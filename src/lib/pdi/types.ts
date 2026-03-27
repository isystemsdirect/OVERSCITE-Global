
import { z } from 'zod';

export type PropertyDocumentType = 
    | 'permit_building'
    | 'permit_electrical'
    | 'permit_plumbing'
    | 'permit_mechanical'
    | 'permit_roofing'
    | 'plan_site'
    | 'plan_floor'
    | 'plan_elevation'
    | 'inspection_report'
    | 'certificate_occupancy'
    | 'deed'
    | 'plat_map'
    | 'zoning_certification'
    | 'unknown';

export const PropertyDocumentSchema = z.object({
    id: z.string(),
    type: z.enum([
        'permit_building', 'permit_electrical', 'permit_plumbing', 'permit_mechanical', 'permit_roofing',
        'plan_site', 'plan_floor', 'plan_elevation',
        'inspection_report', 'certificate_occupancy', 'deed', 'plat_map', 'zoning_certification', 'unknown'
    ]),
    source_jurisdiction: z.string(),
    issue_date: z.string().optional(), // ISO date string
    description: z.string().optional(),
    status: z.string().optional(), // e.g., 'Finaled', 'Expired', 'Issued'
    document_url: z.string().url().optional(),
    confidence_score: z.number().min(0).max(1),
    metadata: z.record(z.string(), z.any()).optional(),
});

export type PropertyDocument = z.infer<typeof PropertyDocumentSchema>;

export const ParcelDataSchema = z.object({
    parcel_id: z.string(),
    address_canonical: z.string(),
    owner_name: z.string().optional(), // Often redacted or private
    zoning_code: z.string().optional(),
    land_use_code: z.string().optional(),
    lot_size_sqft: z.number().optional(),
    building_sqft: z.number().optional(),
    year_built: z.number().optional(),
    stories: z.number().optional(),
    last_sale_date: z.string().optional(),
    last_sale_price: z.number().optional(),
    polygon: z.array(z.object({ lat: z.number(), lng: z.number() })).optional(),
});

export type ParcelData = z.infer<typeof ParcelDataSchema>;

export const PDIResultSchema = z.object({
    parcel: ParcelDataSchema,
    documents: z.array(PropertyDocumentSchema),
    match_confidence: z.number().min(0).max(1),
    search_timestamp: z.string(), // ISO date string
    data_sources: z.array(z.string()),
});

export type PDIResult = z.infer<typeof PDIResultSchema>;
