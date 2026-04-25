/**
 * SCINGULAR Global — Canonical Marketplace Type System
 * UTCB-S V1.0 — Ultra-Grade Marketplace Stack
 *
 * Governance: BANE-governed, human-sovereign.
 * Two distinct planes: Field Market (labor/dispatch) and Marketplace (capability/entitlement).
 * These planes share identity and shell DNA but must never be collapsed into a single entity model.
 *
 * Implementation Status: LIVE — types only. Backend pipeline and payment integration: SCAFFOLD.
 */

import { FieldValue, Timestamp } from 'firebase/firestore';

// ---------------------------------------------------------------------------
// STATUS VOCABULARIES — Plane-specific. Must not be casually interchanged.
// ---------------------------------------------------------------------------

/**
 * Field Market job/offer lifecycle statuses.
 * Describes the operational state of a labor exchange entity.
 */
export type FieldMarketStatus =
  | 'draft'
  | 'review_required'
  | 'live'
  | 'partial'
  | 'offered'
  | 'accepted'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'under_review'
  | 'closed'
  | 'blocked'
  | 'archived';

/**
 * Capability Marketplace product/listing statuses.
 * Describes the commercial readiness state of a capability product.
 * NEVER conflate with FieldMarketStatus — semantics differ.
 */
export type MarketplaceStatus =
  | 'draft'
  | 'review_required'
  | 'live'
  | 'beta'
  | 'experimental'
  | 'restricted'
  | 'enterprise_only'
  | 'deprecated'
  | 'archived'
  | 'blocked';

/**
 * Entitlement lifecycle statuses.
 * Governs access outcomes from capability purchases or contract grants.
 * Candidate purchase is NOT active. Draft product is NOT live.
 */
export type EntitlementStatus =
  | 'pending'
  | 'active'
  | 'suspended'
  | 'revoked'
  | 'expired'
  | 'trial';

/**
 * Order statuses spanning both planes.
 * A 'completed' order result does NOT imply entitlement activation.
 */
export type OrderStatus =
  | 'draft'
  | 'pending_payment'
  | 'payment_authorized'
  | 'payment_captured'
  | 'fulfillment_pending'
  | 'fulfilled'
  | 'under_review'
  | 'refunded'
  | 'disputed'
  | 'cancelled'
  | 'blocked';

/**
 * Payout lifecycle for Field Market labor transactions.
 * 'completed_work' does NOT mean 'payout_released' — hold conditions may apply.
 */
export type PayoutStatus =
  | 'pending'
  | 'on_hold'
  | 'dispute_hold'
  | 'ready_for_release'
  | 'released'
  | 'failed'
  | 'reversed';

// ---------------------------------------------------------------------------
// ROLES
// ---------------------------------------------------------------------------

export type GlobalMarketRole =
  | 'platform_super_admin'
  | 'marketplace_admin'
  | 'compliance_reviewer'
  | 'finance_admin'
  | 'support_admin';

export type FieldMarketRole =
  | 'client_buyer'
  | 'dispatch_manager'
  | 'org_scheduler'
  | 'field_agent'
  | 'field_agent_manager'
  | 'reviewer_auditor';

export type CapabilityMarketRole =
  | 'org_buyer'
  | 'module_publisher'
  | 'key_manager'
  | 'enterprise_sales_admin'
  | 'product_reviewer'
  | 'license_auditor';

export type MarketActorRole = GlobalMarketRole | FieldMarketRole | CapabilityMarketRole;

// ---------------------------------------------------------------------------
// PLANE 1: FIELD MARKET — Labor/Dispatch Exchange
// ---------------------------------------------------------------------------

/**
 * Job listing for the Field Market labor/dispatch exchange.
 * Collection: market_jobs
 */
export interface JobListing {
  job_id: string;
  org_id: string;
  creator_arc_id: string;
  job_type: FieldJobType;
  title: string;
  description: string;
  location: GeoLocation;
  coverage_radius_km?: number;
  required_capabilities: string[];
  required_credentials: string[];
  schedule_window: ScheduleWindow;
  payout_terms: PayoutTerms;
  platform_fee_model: PlatformFeeModel;
  status: FieldMarketStatus;
  review_flags: string[];
  geo_tags?: string[];
  urgency_level: 'standard' | 'elevated' | 'critical';
  created_at: Timestamp | FieldValue | string;
  updated_at: Timestamp | FieldValue | string;
}

export type FieldJobType =
  | 'inspection'
  | 'drone_operation'
  | 'environmental_survey'
  | 'forensic_capture'
  | 'thermal_lidar_mapping'
  | 'specialized_contractor'
  | 'specialist_engineer_support'
  | 'other';

export interface GeoLocation {
  name: string;
  lat: number;
  lng: number;
  address?: string;
  jurisdiction_code?: string;
}

export interface ScheduleWindow {
  starts_at: string;
  ends_at: string;
  flexible: boolean;
  notes?: string;
}

export interface PayoutTerms {
  gross_amount: number;
  currency: string;
  payout_model: 'flat' | 'hourly' | 'milestone' | 'negotiated';
  estimated_duration_hours?: number;
  hold_period_days?: number;
  notes?: string;
}

export interface PlatformFeeModel {
  fee_type: 'percentage' | 'flat' | 'tiered';
  fee_value: number;
  disclosed_to_agent: boolean;
}

/**
 * Dispatch offer extended from a job listing to a specific field agent.
 * Collection: market_job_offers
 */
export interface DispatchOffer {
  offer_id: string;
  job_id: string;
  org_id: string;
  issuer_arc_id: string;
  recipient_agent_id: string;
  offer_type: 'directed' | 'open_market' | 'invited';
  status: FieldMarketStatus;
  offered_payout: PayoutTerms;
  offered_at: Timestamp | FieldValue | string;
  expires_at?: string;
  accepted_at?: string;
  declined_at?: string;
  decline_reason?: string;
  bane_gate_ref?: string;
  audit_event_id?: string;
}

/**
 * Field agent marketplace profile.
 * Collection: market_agent_profiles
 */
export interface FieldAgentProfile {
  agent_id: string;
  arc_id: string;
  org_id?: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
  credentials: AgentCredential[];
  offered_services: FieldJobType[];
  geo_coverage: GeoLocation[];
  travel_radius_km: number;
  availability_status: 'available' | 'busy' | 'unavailable' | 'on_call';
  reputation: ReputationSummary;
  verified: boolean;
  created_at: Timestamp | FieldValue | string;
  updated_at: Timestamp | FieldValue | string;
}

export interface AgentCredential {
  credential_id: string;
  name: string;
  issuer: string;
  verified: boolean;
  expires_at?: string;
  scope: string[];
}

export interface ReputationSummary {
  completion_rate: number;
  avg_response_hours: number;
  cancellation_count: number;
  review_count: number;
  avg_rating: number;
  last_updated: string;
}

/**
 * Structured reputation/review packet for a field agent or publisher.
 * Collection: market_reputation_packets
 */
export interface ReputationPacket {
  packet_id: string;
  subject_id: string;
  subject_type: 'field_agent' | 'module_publisher';
  reviewer_arc_id: string;
  rating: number; // 1–5
  review_text?: string;
  job_id?: string;
  product_id?: string;
  verified_transaction: boolean;
  moderation_status: 'pending' | 'approved' | 'flagged' | 'removed';
  created_at: Timestamp | FieldValue | string;
}

/**
 * Payout record for Field Market labor disbursements.
 * Collection: market_payouts
 * [PARTIAL] — payout_release requires backend payment pipeline integration.
 */
export interface PayoutRecord {
  payout_id: string;
  job_id: string;
  offer_id: string;
  recipient_id: string;
  org_id: string;
  gross_amount: number;
  platform_fee: number;
  net_amount: number;
  currency: string;
  hold_state: boolean;
  hold_reason?: string;
  release_state: PayoutStatus;
  released_at?: string;
  dispute_ref?: string;
  audit_event_id: string;
  created_at: Timestamp | FieldValue | string;
  updated_at: Timestamp | FieldValue | string;
}

// ---------------------------------------------------------------------------
// PLANE 2: MARKETPLACE — Capability/Entitlement Commerce
// ---------------------------------------------------------------------------

export type CapabilityProductType =
  | 'lari_key'
  | 'workflow_pack'
  | 'compliance_pack'
  | 'export_pack'
  | 'premium_analytics_module'
  | 'enterprise_connector'
  | 'standalone_deployment_tier'
  | 'developer_integrator_package'
  | 'other';

export type PricingModel =
  | 'one_time'
  | 'subscription_monthly'
  | 'subscription_annual'
  | 'enterprise_contract'
  | 'approval_required'
  | 'free';

/**
 * Sellable capability product in the Marketplace plane.
 * Collection: market_products
 * NEVER conflate with a Field Market JobListing.
 */
export interface CapabilityProduct {
  product_id: string;
  publisher_org_id: string;
  product_type: CapabilityProductType;
  name: string;
  short_description: string;
  full_description: string;
  pricing_model: PricingModel;
  price_amount?: number;
  price_currency?: string;
  compatibility: ProductCompatibility;
  entitlement_scope: EntitlementScope;
  status: MarketplaceStatus;
  version: string;
  release_notes?: string;
  visibility: 'public' | 'org_only' | 'invite_only' | 'admin_only';
  requires_review_approval: boolean;
  governance_annotations: string[];
  created_at: Timestamp | FieldValue | string;
  updated_at: Timestamp | FieldValue | string;
}

export interface ProductCompatibility {
  requires_plan_tier: string[];
  requires_org_role: MarketActorRole[];
  requires_lari_key?: string;
  restricted_jurisdictions?: string[];
  min_platform_version?: string;
}

export interface EntitlementScope {
  feature_flags: string[];
  access_duration_days?: number;
  renewable: boolean;
  max_seats?: number;
  org_wide: boolean;
}

/**
 * LARI Key — entitlement-bearing capability token.
 * Collection: market_lari_keys
 */
export interface LariKey {
  key_id: string;
  product_id: string;
  org_id: string;
  assigned_arc_id?: string;
  key_label: string;
  key_type: 'access' | 'deployment' | 'integration' | 'analytics';
  status: EntitlementStatus;
  feature_flags: string[];
  dependency_keys: string[];
  activated_at?: string;
  expires_at?: string;
  revoked_at?: string;
  revoked_reason?: string;
  revoked_by_arc_id?: string;
  order_ref: string;
  audit_event_id: string;
  created_at: Timestamp | FieldValue | string;
  updated_at: Timestamp | FieldValue | string;
}

/**
 * Commercial order record spanning both planes.
 * Field Market orders are labor transactions; Marketplace orders are capability purchases.
 * The order_plane field distinguishes them — never merge the status vocabulary.
 * Collection: market_orders
 * [PARTIAL] — payment capture and server-authoritative finalization: backend pipeline required.
 */
export interface OrderRecord {
  order_id: string;
  order_plane: 'field_market' | 'marketplace';
  buyer_arc_id: string;
  buyer_org_id: string;
  seller_org_id?: string;
  line_items: OrderLineItem[];
  subtotal: number;
  platform_fee: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  pricing_confirmed_at?: string;
  status: OrderStatus;
  approval_required: boolean;
  approval_arc_id?: string;
  approved_at?: string;
  entitlement_ref?: string;   // links to EntitlementRecord after fulfillment
  job_ref?: string;           // links to JobListing for Field Market orders
  dispute_ref?: string;
  bane_gate_ref?: string;
  audit_event_id: string;
  created_at: Timestamp | FieldValue | string;
  updated_at: Timestamp | FieldValue | string;
}

export interface OrderLineItem {
  line_id: string;
  product_id?: string;
  job_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

/**
 * Entitlement record — access outcome of a capability purchase or contract grant.
 * Collection: market_entitlements
 * 'pending' is NOT 'active'. Entitlement must never be activated from client-side optimistic state.
 */
export interface EntitlementRecord {
  entitlement_id: string;
  owner_type: 'user' | 'org';
  owner_id: string;
  source_order_id: string;
  source_product_id: string;
  status: EntitlementStatus;
  feature_flags: string[];
  issued_at?: string;
  expires_at?: string;
  renewal_state: 'none' | 'auto_renew' | 'manual_renew_pending' | 'cancelled';
  suspended_reason?: string;
  revoked_reason?: string;
  revoked_by_arc_id?: string;
  audit_event_id: string;
  created_at: Timestamp | FieldValue | string;
  updated_at: Timestamp | FieldValue | string;
}

// ---------------------------------------------------------------------------
// SHARED INFRASTRUCTURE
// ---------------------------------------------------------------------------

/**
 * Market audit event — canonical traceability record for all critical marketplace mutations.
 * Collection: market_audit_events
 * Written by Cloud Functions via Admin SDK only. Append-only. Immutable.
 */
export interface MarketAuditEvent {
  event_id: string;
  actor_id: string;
  actor_role: MarketActorRole;
  entity_type: MarketEntityType;
  entity_id: string;
  event_type: MarketEventType;
  before_state_ref?: string;
  after_state_ref?: string;
  reason?: string;
  policy_version: string;
  bane_gate_passed?: MarketBaneGate;
  metadata?: Record<string, unknown>;
  timestamp: Timestamp | FieldValue | string;
}

export type MarketEntityType =
  | 'job_listing'
  | 'dispatch_offer'
  | 'agent_profile'
  | 'capability_product'
  | 'lari_key'
  | 'order_record'
  | 'entitlement_record'
  | 'payout_record'
  | 'moderation_record'
  | 'billing_event';

export type MarketEventType =
  | 'job_published'
  | 'job_closed'
  | 'offer_issued'
  | 'offer_accepted'
  | 'offer_declined'
  | 'assignment_confirmed'
  | 'work_completed'
  | 'payout_prepared'
  | 'payout_released'
  | 'product_published'
  | 'order_created'
  | 'order_fulfilled'
  | 'order_refunded'
  | 'entitlement_activated'
  | 'entitlement_revoked'
  | 'entitlement_suspended'
  | 'key_issued'
  | 'key_revoked'
  | 'standalone_authorization_requested'
  | 'standalone_authorization_granted'
  | 'moderation_action'
  | 'high_risk_override';

export type MarketBaneGate =
  | 'gate_1_listing_visibility'
  | 'gate_2_assignment_purchase_readiness'
  | 'gate_3_mutation_integrity'
  | 'gate_4_high_risk_review';

/**
 * Moderation record for listings, products, fraud flags, and policy actions.
 * Collection: market_moderation_records
 */
export interface ModerationRecord {
  record_id: string;
  entity_type: MarketEntityType;
  entity_id: string;
  queue_type: ModerationQueueType;
  review_type: ModerationReviewType;
  status: 'pending' | 'approved' | 'blocked' | 'escalated' | 'resolved';
  reviewer_arc_id?: string;
  reason?: string;
  evidence_refs: string[];
  resolved_at?: string;
  audit_event_id?: string;
  created_at: Timestamp | FieldValue | string;
  updated_at: Timestamp | FieldValue | string;
}

export type ModerationQueueType =
  | 'job_review_queue'
  | 'product_review_queue'
  | 'fraud_review_queue'
  | 'financial_hold_queue'
  | 'dispute_review_queue'
  | 'standalone_authorization_queue';

export type ModerationReviewType =
  | 'policy_review'
  | 'fraud_review'
  | 'quality_review'
  | 'security_review'
  | 'commercial_review';

/**
 * Billing event — immutable commercial transaction record.
 * Collection: market_billing_events
 * Written by Cloud Functions via Admin SDK only. Append-only.
 */
export interface BillingEvent {
  event_id: string;
  order_id: string;
  event_type:
    | 'price_computed'
    | 'payment_authorized'
    | 'payment_captured'
    | 'payment_failed'
    | 'refund_initiated'
    | 'refund_completed'
    | 'dispute_opened'
    | 'dispute_resolved'
    | 'fee_computed'
    | 'payout_computed'
    | 'payout_released';
  amount: number;
  currency: string;
  actor_id: string;
  metadata?: Record<string, unknown>;
  timestamp: Timestamp | FieldValue | string;
}

// ---------------------------------------------------------------------------
// BANE GATE CONTEXT TYPES
// ---------------------------------------------------------------------------

/**
 * Context object passed to BANE gate evaluation functions.
 * All marketplace BANE gates require a typed, non-anonymous context.
 */
export interface MarketBaneContext {
  actor_id: string;
  actor_role: MarketActorRole;
  org_id?: string;
  entity_type: MarketEntityType;
  entity_id: string;
  gate: MarketBaneGate;
  action: MarketEventType;
  metadata?: Record<string, unknown>;
}

export interface MarketBaneResult {
  passed: boolean;
  gate: MarketBaneGate;
  reason_code?: string;
  reason_detail?: string;
  policy_version: string;
  evaluated_at: string;
}

// ---------------------------------------------------------------------------
// UI DISPLAY HELPERS
// ---------------------------------------------------------------------------

/**
 * Marketplace card discriminated union — ensures type safety across both planes.
 * NEVER render a CapabilityProduct as a JobCardDisplay or vice versa.
 */
export type MarketCardDisplay =
  | { plane: 'field_market'; entity: JobListing }
  | { plane: 'marketplace'; entity: CapabilityProduct };

/**
 * Availability record for field agents.
 * Collection: market_availability
 */
export interface AgentAvailability {
  availability_id: string;
  agent_id: string;
  arc_id: string;
  windows: AvailabilityWindow[];
  travel_radius_km: number;
  geo_coverage: GeoLocation[];
  asset_readiness: string[];
  updated_at: Timestamp | FieldValue | string;
}

export interface AvailabilityWindow {
  day_of_week?: number; // 0–6
  starts_at: string;   // ISO time HH:MM
  ends_at: string;
  recurring: boolean;
  date_override?: string; // ISO date for one-off overrides
}

/**
 * Standalone deployment authorization request.
 * Governs enterprise platform commercialization review flow.
 * Collection: part of market_moderation_records (queue: standalone_authorization_queue)
 * [SCAFFOLD] — full review flow wired via Cloud Function; approval requires formal review trail.
 */
export interface StandaloneAuthorizationRequest {
  request_id: string;
  requester_arc_id: string;
  requester_org_id: string;
  deployment_description: string;
  commercial_context: string;
  qualification_evidence: string[];
  status: 'submitted' | 'under_commercial_review' | 'approved' | 'declined' | 'pending_contract';
  reviewer_arc_id?: string;
  review_notes?: string;
  contract_ref?: string;
  audit_event_id?: string;
  created_at: Timestamp | FieldValue | string;
  updated_at: Timestamp | FieldValue | string;
}
