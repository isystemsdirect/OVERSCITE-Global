import { FinanceInvoice } from '../types';

// Seed initial invoices for truthfulness
const SEED_INVOICES: FinanceInvoice[] = [
  {
    id: 'inv-001',
    invoice_number: 'OSG-2023-001',
    status: 'paid',
    amount: 149.00,
    currency: 'USD',
    issued_at: new Date('2023-10-01').toISOString(),
    due_at: new Date('2023-11-01').toISOString(),
    download_url_if_real: '/api/finances/export/OSG-2023-001.pdf',
  },
  {
    id: 'inv-002',
    invoice_number: 'OSG-2023-002',
    status: 'issued',
    amount: 149.00,
    currency: 'USD',
    issued_at: new Date('2023-11-01').toISOString(),
    due_at: new Date('2023-12-01').toISOString(),
    download_url_if_real: '/api/finances/export/OSG-2023-002.pdf',
  },
  {
    id: 'inv-003',
    invoice_number: 'OSG-2023-003',
    status: 'draft',
    amount: 45.50,
    currency: 'USD',
    issued_at: new Date('2023-11-15').toISOString(),
    due_at: new Date('2023-12-15').toISOString(),
  }
];

export async function getFinanceInvoices(): Promise<FinanceInvoice[]> {
  // Simulate fetch
  return [...SEED_INVOICES];
}

export interface SubscriptionStatus {
  name: string;
  status: 'active' | 'pending' | 'canceled' | 'trialing';
  next_billing_at: string;
  is_pro: boolean;
}

export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  return {
    name: 'Pro Plan',
    status: 'active',
    next_billing_at: new Date('2023-12-01').toISOString(),
    is_pro: true,
  };
}
