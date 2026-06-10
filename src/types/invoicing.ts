// ─── Invoicing & Payment Types ─────────────────────────────────────────

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'

export interface InvoiceLineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
  type: 'service' | 'retainer' | 'project' | 'expense' | 'other'
}

export interface Invoice {
  id: string
  invoiceNumber: string
  clientId: string
  status: InvoiceStatus
  issueDate: string
  dueDate: string
  paidAt?: string
  lineItems: InvoiceLineItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  total: number
  amountPaid: number
  balance: number
  notes?: string
  paymentTerms: string // e.g. "Net 15", "Net 30", "Due on Receipt"
  paymentMethod?: 'stripe' | 'bank_transfer' | 'check' | 'cash' | 'other'
  stripePaymentIntentId?: string
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: string
  invoiceId: string
  clientId: string
  amount: number
  method: 'stripe' | 'bank_transfer' | 'check' | 'cash' | 'other'
  status: 'succeeded' | 'pending' | 'failed' | 'refunded'
  stripePaymentIntentId?: string
  stripeChargeId?: string
  notes?: string
  receivedAt: string
  createdAt: string
}

export interface StripeConfig {
  publishableKey: string
  secretKey: string
  webhookSecret: string
  connected: boolean
  connectedEmail: string
}

let invoiceCounter = 1001
export function nextInvoiceNumber(): string {
  return `INV-${invoiceCounter++}`
}

export function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

export function calculateInvoiceTotals(lineItems: InvoiceLineItem[], taxRate: number = 0) {
  const subtotal = lineItems.reduce((s, i) => s + i.amount, 0)
  const taxAmount = subtotal * (taxRate / 100)
  const total = subtotal + taxAmount
  return { subtotal, taxAmount, total }
}

// ── Sample Invoices ────────────────────────────────────────────────────

export function buildSampleInvoices(): Invoice[] {
  const items1: InvoiceLineItem[] = [
    { id: uid(), description: 'Monthly Retainer — BrightPath Dental', quantity: 1, unitPrice: 4500, amount: 4500, type: 'retainer' },
    { id: uid(), description: 'Social Media Management (weekly posts)', quantity: 1, unitPrice: 1000, amount: 1000, type: 'service' },
    { id: uid(), description: 'Ad Spend — Meta Q3 Awareness', quantity: 1, unitPrice: 3200, amount: 3200, type: 'expense' },
  ]
  const sub1 = items1.reduce((s, i) => s + i.amount, 0)
  const tax1 = sub1 * 0.08

  const items2: InvoiceLineItem[] = [
    { id: uid(), description: 'Monthly Retainer — Summit Roofing', quantity: 1, unitPrice: 2500, amount: 2500, type: 'retainer' },
    { id: uid(), description: 'SEO Optimization (monthly)', quantity: 1, unitPrice: 800, amount: 800, type: 'service' },
  ]
  const sub2 = items2.reduce((s, i) => s + i.amount, 0)
  const tax2 = sub2 * 0.08

  const items3: InvoiceLineItem[] = [
    { id: uid(), description: 'Website Redesign — Phase 1', quantity: 1, unitPrice: 5000, amount: 5000, type: 'project' },
  ]
  const sub3 = items3.reduce((s, i) => s + i.amount, 0)
  const tax3 = sub3 * 0.08

  return [
    {
      id: 'inv-1',
      invoiceNumber: 'INV-1001',
      clientId: '100y22s',
      status: 'paid',
      issueDate: '2026-06-01',
      dueDate: '2026-06-15',
      paidAt: '2026-06-08',
      lineItems: items1,
      subtotal: sub1, taxRate: 8, taxAmount: tax1, total: sub1 + tax1,
      amountPaid: sub1 + tax1, balance: 0,
      paymentTerms: 'Net 15',
      paymentMethod: 'stripe',
      stripePaymentIntentId: 'pi_sample_abc123',
      createdAt: '2026-06-01', updatedAt: '2026-06-08',
    },
    {
      id: 'inv-2',
      invoiceNumber: 'INV-1002',
      clientId: 'bmq02ji',
      status: 'sent',
      issueDate: '2026-06-01',
      dueDate: '2026-06-25',
      lineItems: items2,
      subtotal: sub2, taxRate: 8, taxAmount: tax2, total: sub2 + tax2,
      amountPaid: 0, balance: sub2 + tax2,
      paymentTerms: 'Net 30',
      createdAt: '2026-06-01', updatedAt: '2026-06-01',
    },
    {
      id: 'inv-3',
      invoiceNumber: 'INV-1003',
      clientId: 'mbwfcu5',
      status: 'overdue',
      issueDate: '2026-05-01',
      dueDate: '2026-05-25',
      lineItems: items3,
      subtotal: sub3, taxRate: 8, taxAmount: tax3, total: sub3 + tax3,
      amountPaid: 3000, balance: (sub3 + tax3) - 3000,
      paymentTerms: 'Net 30',
      notes: 'Partial payment received. Follow up on balance.',
      createdAt: '2026-05-01', updatedAt: '2026-06-05',
    },
  ]
}

export function buildSamplePayments(): Payment[] {
  return [
    {
      id: 'pay-1',
      invoiceId: 'inv-1',
      clientId: '100y22s',
      amount: 9396,
      method: 'stripe',
      status: 'succeeded',
      stripePaymentIntentId: 'pi_sample_abc123',
      stripeChargeId: 'ch_sample_xyz789',
      receivedAt: '2026-06-08',
      createdAt: '2026-06-08',
    },
    {
      id: 'pay-2',
      invoiceId: 'inv-3',
      clientId: 'mbwfcu5',
      amount: 3000,
      method: 'bank_transfer',
      status: 'succeeded',
      receivedAt: '2026-05-20',
      createdAt: '2026-05-20',
    },
  ]
}
