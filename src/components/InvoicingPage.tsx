import { useState, useMemo } from 'react'
import { useAppStore } from '../store/useAppStore'
import { DollarSign, Plus, Eye, Trash2, Download, CreditCard, CheckCircle, AlertTriangle, Clock, ArrowUpRight, Receipt, Wallet, TrendingUp, Ban, ChevronDown, ChevronUp, Send } from 'lucide-react'
import { calculateInvoiceTotals, nextInvoiceNumber, uid } from '../types/invoicing'
import EmptyState from './EmptyState'
import type { Invoice, InvoiceLineItem, InvoiceStatus, StripeConfig } from '../types/invoicing'

const statusColors: Record<InvoiceStatus, string> = {
  draft: 'var(--text-muted)',
  sent: 'var(--info)',
  paid: 'var(--success)',
  overdue: 'var(--danger)',
  cancelled: 'var(--text-muted)',
}

const statusBg: Record<InvoiceStatus, string> = {
  draft: 'rgba(107,114,128,0.12)',
  sent: 'rgba(59,130,246,0.12)',
  paid: 'rgba(34,197,94,0.12)',
  overdue: 'rgba(239,68,68,0.12)',
  cancelled: 'rgba(107,114,128,0.12)',
}

const statusIcons: Record<InvoiceStatus, React.ReactNode> = {
  draft: <Clock size={14} />,
  sent: <ArrowUpRight size={14} />,
  paid: <CheckCircle size={14} />,
  overdue: <AlertTriangle size={14} />,
  cancelled: <Ban size={14} />,
}

interface InvoiceFormData {
  clientId: string
  issueDate: string
  dueDate: string
  paymentTerms: string
  taxRate: number
  notes: string
  lineItems: InvoiceLineItem[]
  status: InvoiceStatus
}

const emptyForm: InvoiceFormData = {
  clientId: '', issueDate: new Date().toISOString().slice(0, 10),
  dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
  paymentTerms: 'Net 30', taxRate: 0, notes: '',
  lineItems: [{ id: uid(), description: '', quantity: 1, unitPrice: 0, amount: 0, type: 'service' }],
  status: 'draft',
}

export default function InvoicingPage() {
  const { invoices, payments, clients, stripeConfig, addInvoice, updateInvoice, deleteInvoice, addPayment, updateStripeConfig, addToast } = useAppStore()
  const [showForm, setShowForm] = useState(false)
  const [viewInvoiceId, setViewInvoiceId] = useState<string | null>(null)
  const [form, setForm] = useState<InvoiceFormData>({ ...emptyForm })
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all')
  const [showStripeConfig, setShowStripeConfig] = useState(false)

  const filtered = statusFilter === 'all' ? invoices : invoices.filter(i => i.status === statusFilter)

  // Stats
  const totalOutstanding = invoices.filter(i => i.status !== 'paid' && i.status !== 'cancelled').reduce((s, i) => s + i.balance, 0)
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.balance, 0)
  const thisMonthPaid = invoices.filter(i => i.status === 'paid' && i.paidAt?.startsWith(new Date().toISOString().slice(0, 7))).reduce((s, i) => s + i.total, 0)
  const collectionRate = invoices.length > 0
    ? Math.round((invoices.filter(i => i.status === 'paid').length / invoices.filter(i => i.status !== 'cancelled').length) * 100)
    : 0

  // Client lookup
  const getClientName = (clientId: string) => clients.find(c => c.id === clientId)?.name || 'Unknown Client'

  const handleCreateInvoice = () => {
    if (!form.clientId) return addToast('error', 'Select a client')
    if (form.lineItems.length === 0 || !form.lineItems[0].description) return addToast('error', 'Add at least one line item')
    const { subtotal, taxAmount, total } = calculateInvoiceTotals(form.lineItems, form.taxRate)
    addInvoice({
      invoiceNumber: nextInvoiceNumber(),
      clientId: form.clientId,
      status: form.status,
      issueDate: form.issueDate,
      dueDate: form.dueDate,
      lineItems: form.lineItems,
      subtotal, taxRate: form.taxRate, taxAmount, total,
      amountPaid: 0, balance: total,
      notes: form.notes || undefined,
      paymentTerms: form.paymentTerms,
    })
    setForm({ ...emptyForm })
    setShowForm(false)
    addToast('success', 'Invoice created', `$${total.toLocaleString()} for ${getClientName(form.clientId)}`)
  }

  const handleMarkPaid = (invId: string) => {
    const inv = invoices.find(i => i.id === invId)
    if (!inv) return
    updateInvoice(invId, {
      status: 'paid',
      paidAt: new Date().toISOString().slice(0, 10),
      amountPaid: inv.total,
      balance: 0,
      paymentMethod: 'stripe',
    })
    addPayment({
      invoiceId: invId, clientId: inv.clientId, amount: inv.total,
      method: inv.paymentMethod === 'stripe' ? 'stripe' : 'other',
      status: 'succeeded', receivedAt: new Date().toISOString().slice(0, 10),
    })
    addToast('success', 'Payment recorded', `$${inv.total.toLocaleString()} received`)
  }

  const handleMarkSent = (invId: string) => {
    updateInvoice(invId, { status: 'sent' })
    addToast('info', 'Invoice marked as sent')
  }

  const handleDelete = (invId: string) => {
    deleteInvoice(invId)
    addToast('info', 'Invoice deleted')
  }

  // Stripe Connect
  const handleConnectStripe = () => {
    if (!stripeConfig.publishableKey || !stripeConfig.secretKey) {
      addToast('error', 'Enter both publishable and secret keys')
      return
    }
    updateStripeConfig({ connected: true, connectedEmail: 'billing@frantzenterprise.com' })
    addToast('success', 'Stripe connected', 'Test mode — no real charges will be made')
  }

  // ── Invoice Detail View ──
  if (viewInvoiceId) {
    const inv = invoices.find(i => i.id === viewInvoiceId)
    if (!inv) { setViewInvoiceId(null); return null }
    const clientName = getClientName(inv.clientId)
    const invPayments = payments.filter(p => p.invoiceId === inv.id)

    return (
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">{inv.invoiceNumber}</h2>
            <p className="section-desc">{clientName}</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setViewInvoiceId(null)}>
              ← Back
            </button>
            {inv.status === 'draft' && (
              <button className="btn btn-primary btn-sm" onClick={() => handleMarkSent(inv.id)}>
                <Send size={14} /> Mark Sent
              </button>
            )}
            {inv.status !== 'paid' && inv.status !== 'cancelled' && (
              <button className="btn btn-secondary btn-sm" onClick={() => handleMarkPaid(inv.id)}>
                <CheckCircle size={14} /> Mark Paid
              </button>
            )}
            <button className="btn btn-ghost btn-icon" onClick={() => handleDelete(inv.id)}>
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Invoice Card */}
        <div className="card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Frantz Enterprise</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Full-Service Digital Agency</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{inv.invoiceNumber}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                <span className={`tag`} style={{ background: statusBg[inv.status], color: statusColors[inv.status], border: 'none' }}>
                  {inv.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, fontSize: 13 }}>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Bill To:</div>
              <div>{clientName}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div><strong>Issue:</strong> {new Date(inv.issueDate).toLocaleDateString()}</div>
              <div><strong>Due:</strong> {new Date(inv.dueDate).toLocaleDateString()}</div>
              <div><strong>Terms:</strong> {inv.paymentTerms}</div>
            </div>
          </div>

          {/* Line Items */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginBottom: 20 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '8px 4px', fontWeight: 600 }}>Description</th>
                <th style={{ textAlign: 'center', padding: '8px 4px', fontWeight: 600 }}>Qty</th>
                <th style={{ textAlign: 'right', padding: '8px 4px', fontWeight: 600 }}>Rate</th>
                <th style={{ textAlign: 'right', padding: '8px 4px', fontWeight: 600 }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {inv.lineItems.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 4px' }}>
                    <div style={{ fontWeight: 500 }}>{item.description}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{item.type}</div>
                  </td>
                  <td style={{ textAlign: 'center', padding: '10px 4px' }}>{item.quantity}</td>
                  <td style={{ textAlign: 'right', padding: '10px 4px' }}>${item.unitPrice.toLocaleString()}</td>
                  <td style={{ textAlign: 'right', padding: '10px 4px', fontWeight: 600 }}>${item.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ borderTop: '2px solid var(--border)', paddingTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: 240 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                <span>Subtotal</span><span>${inv.subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                <span>Tax ({inv.taxRate}%)</span><span>${inv.taxAmount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 800, borderTop: '1px solid var(--border)', paddingTop: 8, marginTop: 4 }}>
                <span>Total</span><span>${inv.total.toLocaleString()}</span>
              </div>
              {inv.amountPaid > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--success)', marginTop: 4 }}>
                  <span>Paid</span><span>-${inv.amountPaid.toLocaleString()}</span>
                </div>
              )}
              {inv.balance > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--danger)', marginTop: 4 }}>
                  <span>Balance Due</span><span>${inv.balance.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {inv.notes && (
            <div style={{ marginTop: 20, padding: 12, background: 'var(--bg-tertiary)', borderRadius: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
              <strong>Notes:</strong> {inv.notes}
            </div>
          )}

          {/* Payments */}
          {invPayments.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Payment History</h4>
              {invPayments.map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                  <span>{new Date(p.receivedAt).toLocaleDateString()} — <span style={{ textTransform: 'capitalize' }}>{p.method}</span></span>
                  <span style={{ fontWeight: 600, color: p.status === 'succeeded' ? 'var(--success)' : 'var(--danger)' }}>
                    ${p.amount.toLocaleString()} {p.status === 'succeeded' ? '✓' : '✗'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── List View ──
  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      <div className="section-header">
        <div>
          <h2 className="section-title">💰 Invoicing & Payments</h2>
          <p className="section-desc">Create, send, and track invoices. Accept payments via Stripe.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={16} /> New Invoice
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Outstanding', value: `$${totalOutstanding.toLocaleString()}`, icon: <Wallet size={20} />, color: 'var(--warning-500)' },
          { label: 'Overdue', value: `$${totalOverdue.toLocaleString()}`, icon: <AlertTriangle size={20} />, color: totalOverdue > 0 ? 'var(--danger-500)' : 'var(--text-muted)' },
          { label: 'Collected This Month', value: `$${thisMonthPaid.toLocaleString()}`, icon: <TrendingUp size={20} />, color: 'var(--success-500)' },
          { label: 'Collection Rate', value: `${collectionRate}%`, icon: <CheckCircle size={20} />, color: collectionRate >= 80 ? 'var(--success-500)' : 'var(--warning-500)' },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ color: stat.color, opacity: 0.6 }}>{stat.icon}</div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{stat.label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: stat.color }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Stripe Config */}
      <div className="card" style={{ padding: 14, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CreditCard size={18} style={{ color: stripeConfig.connected ? 'var(--success)' : 'var(--text-muted)' }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>
                Stripe {stripeConfig.connected ? '✓ Connected' : '— Not Connected'}
              </div>
              {stripeConfig.connected && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{stripeConfig.connectedEmail}</div>}
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowStripeConfig(!showStripeConfig)}>
            {showStripeConfig ? <ChevronUp size={14} /> : <ChevronDown size={14} />} Configure
          </button>
        </div>
        {showStripeConfig && (
          <div style={{ marginTop: 12, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div className="form-field" style={{ marginBottom: 0 }}>
                <label>Publishable Key</label>
                <input type="password" value={stripeConfig.publishableKey} onChange={e => updateStripeConfig({ publishableKey: e.target.value })} style={inputStyle} placeholder="pk_test_..." />
              </div>
              <div className="form-field" style={{ marginBottom: 0 }}>
                <label>Secret Key</label>
                <input type="password" value={stripeConfig.secretKey} onChange={e => updateStripeConfig({ secretKey: e.target.value })} style={inputStyle} placeholder="sk_test_..." />
              </div>
            </div>
            <div className="form-field" style={{ margin: '8px 0 0' }}>
              <label>Webhook Secret</label>
              <input type="password" value={stripeConfig.webhookSecret} onChange={e => updateStripeConfig({ webhookSecret: e.target.value })} style={inputStyle} placeholder="whsec_..." />
            </div>
            <button className="btn btn-primary btn-sm" style={{ marginTop: 8 }} onClick={handleConnectStripe}>
              <CreditCard size={14} /> Connect Stripe
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {(['all', 'draft', 'sent', 'paid', 'overdue', 'cancelled'] as const).map(f => (
          <button key={f} className={`btn btn-sm ${statusFilter === f ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setStatusFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* New Invoice Form */}
      {showForm && (
        <div className="card" style={{ padding: 20, marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>New Invoice</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
            <div className="form-field">
              <label>Client</label>
              <select value={form.clientId} onChange={e => setForm({ ...form, clientId: e.target.value })} style={selectStyle}>
                <option value="">— Select —</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as InvoiceStatus })} style={selectStyle}>
                <option value="draft">Draft</option>
                <option value="sent">Send Immediately</option>
              </select>
            </div>
            <div className="form-field">
              <label>Issue Date</label>
              <input type="date" value={form.issueDate} onChange={e => setForm({ ...form, issueDate: e.target.value })} style={inputStyle} />
            </div>
            <div className="form-field">
              <label>Due Date</label>
              <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} style={inputStyle} />
            </div>
            <div className="form-field">
              <label>Payment Terms</label>
              <select value={form.paymentTerms} onChange={e => setForm({ ...form, paymentTerms: e.target.value })} style={selectStyle}>
                <option value="Due on Receipt">Due on Receipt</option>
                <option value="Net 7">Net 7</option>
                <option value="Net 15">Net 15</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 60">Net 60</option>
              </select>
            </div>
            <div className="form-field">
              <label>Tax Rate (%)</label>
              <input type="number" min="0" max="30" step="0.5" value={form.taxRate} onChange={e => setForm({ ...form, taxRate: parseFloat(e.target.value) || 0 })} style={inputStyle} />
            </div>
          </div>

          {/* Line Items */}
          <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Line Items</label>
          {form.lineItems.map((item, i) => (
            <div key={item.id} style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
              <input value={item.description} onChange={e => {
                const newItems = [...form.lineItems]
                newItems[i] = { ...newItems[i], description: e.target.value }
                setForm({ ...form, lineItems: newItems })
              }} style={{ ...inputStyle, flex: 2 }} placeholder="Description" />
              <select value={item.type} onChange={e => {
                const newItems = [...form.lineItems]
                newItems[i] = { ...newItems[i], type: e.target.value as any }
                setForm({ ...form, lineItems: newItems })
              }} style={{ ...selectStyle, width: 90 }}>
                <option value="service">Service</option>
                <option value="retainer">Retainer</option>
                <option value="project">Project</option>
                <option value="expense">Expense</option>
              </select>
              <input type="number" min="1" value={item.quantity} onChange={e => {
                const qty = parseInt(e.target.value) || 1; const amt = qty * item.unitPrice
                const newItems = [...form.lineItems]
                newItems[i] = { ...newItems[i], quantity: qty, amount: amt }
                setForm({ ...form, lineItems: newItems })
              }} style={{ ...inputStyle, width: 60 }} placeholder="Qty" />
              <input type="number" min="0" step="1" value={item.unitPrice} onChange={e => {
                const price = parseFloat(e.target.value) || 0; const amt = item.quantity * price
                const newItems = [...form.lineItems]
                newItems[i] = { ...newItems[i], unitPrice: price, amount: amt }
                setForm({ ...form, lineItems: newItems })
              }} style={{ ...inputStyle, width: 100 }} placeholder="Rate" />
              <div style={{ fontSize: 13, fontWeight: 600, width: 80, textAlign: 'right' }}>
                ${(item.quantity * item.unitPrice).toLocaleString()}
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setForm({ ...form, lineItems: form.lineItems.filter((_, j) => j !== i) })}>
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          <button className="btn btn-ghost btn-sm" onClick={() => setForm({
            ...form,
            lineItems: [...form.lineItems, { id: uid(), description: '', quantity: 1, unitPrice: 0, amount: 0, type: 'service' as const }],
          })}>
            <Plus size={12} /> Add Line Item
          </button>

          <div className="form-field" style={{ marginTop: 10 }}>
            <label>Notes (optional)</label>
            <textarea rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
            <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreateInvoice}>
              <Receipt size={14} /> Create Invoice
            </button>
          </div>
        </div>
      )}

      {/* Invoice List */}
      {filtered.length === 0 && !showForm && (
        <EmptyState
          icon={<DollarSign size={40} />}
          title="No invoices yet"
          description="Create your first invoice to start tracking payments and revenue."
          action={{ label: 'Create Invoice', onClick: () => setShowForm(true) }}
        />
      )}

      {filtered.map(inv => {
        const clientName = getClientName(inv.clientId)
        return (
          <div key={inv.id} className="card" style={{ padding: 14, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className={`tag`} style={{ background: statusBg[inv.status], color: statusColors[inv.status], border: 'none', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
              {statusIcons[inv.status]} {inv.status}
            </div>
            <div style={{ fontWeight: 600, fontSize: 13, minWidth: 100 }}>{inv.invoiceNumber}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{clientName}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                Issued: {new Date(inv.issueDate).toLocaleDateString()} · Due: {new Date(inv.dueDate).toLocaleDateString()}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>${inv.total.toLocaleString()}</div>
              {inv.balance > 0 && <div style={{ fontSize: 11, color: 'var(--danger)', fontWeight: 600 }}>${inv.balance.toLocaleString()} due</div>}
              {inv.status === 'paid' && <div style={{ fontSize: 11, color: 'var(--success)' }}>Paid {inv.paidAt}</div>}
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button className="btn btn-ghost btn-icon" onClick={() => setViewInvoiceId(inv.id)} title="View">
                <Eye size={14} />
              </button>
              {inv.status === 'draft' && (
                <button className="btn btn-ghost btn-icon" onClick={() => handleMarkSent(inv.id)} title="Mark sent">
                  <Send size={14} />
                </button>
              )}
              {inv.status !== 'paid' && inv.status !== 'cancelled' && (
                <button className="btn btn-ghost btn-icon" onClick={() => handleMarkPaid(inv.id)} title="Mark paid" style={{ color: 'var(--success)' }}>
                  <CheckCircle size={14} />
                </button>
              )}
              <button className="btn btn-ghost btn-icon" onClick={() => handleDelete(inv.id)} title="Delete">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)',
  background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13, width: '100%', boxSizing: 'border-box',
}
const selectStyle: React.CSSProperties = {
  padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)',
  background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13, width: '100%',
}
