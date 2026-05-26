import React, { useState } from 'react';
import CustomerLayout from '../../../components/customer/CustomerLayout';
import {
  RefreshCw, CheckCircle, Clock, Search, Upload,
  X, ChevronDown, ChevronUp, AlertTriangle, Package
} from 'lucide-react';
import toast from 'react-hot-toast';

const RETURN_REASONS = [
  'Damaged Product',
  'Wrong Product Delivered',
  'Wrong Size / Quantity',
  'Product Not Working',
  'Quality Issue',
  'Changed Mind',
  'Missing Parts',
];

const REFUND_STEPS = [
  { label: 'Request Submitted', icon: '📋' },
  { label: 'Under Review',      icon: '🔍' },
  { label: 'Approved',          icon: '✅' },
  { label: 'Refund Completed',  icon: '💰' },
];

const MY_ORDERS_FOR_RETURN = [
  { id: '#ORD001', product: 'iPhone 15',        image: '📱', date: '2026-05-01', amount: 94399 },
  { id: '#ORD002', product: 'Nike Shoes',        image: '👟', date: '2026-05-03', amount: 9438  },
  { id: '#ORD003', product: 'Basmati Rice',      image: '🌾', date: '2026-05-05', amount: 2124  },
  { id: '#ORD004', product: 'Wireless Earbuds',  image: '🎧', date: '2026-05-06', amount: 2449  },
  { id: '#ORD007', product: 'Denim Jeans',       image: '👖', date: '2026-04-28', amount: 1299  },
  { id: '#ORD008', product: 'Milk 1L',           image: '🥛', date: '2026-04-25', amount: 71    },
];

const INIT_RETURNS = [
  {
    id: 'RET001', orderId: '#ORD004', product: 'Wireless Earbuds', image: '🎧',
    amount: 2449, reason: 'Product Not Working',
    description: 'No sound from left ear after 2 days of use.',
    date: '2026-05-08', status: 'Approved', stepIndex: 2,
    refundMethod: 'UPI', refundDate: '2026-05-12',
  },
  {
    id: 'RET002', orderId: '#ORD002', product: 'Nike Shoes', image: '👟',
    amount: 9438, reason: 'Wrong Size / Quantity',
    description: 'Ordered size 9 but received size 8.',
    date: '2026-05-07', status: 'Under Review', stepIndex: 1,
    refundMethod: 'Card', refundDate: null,
  },
];

const statusColor = {
  'Request Submitted': '#6366f1',
  'Under Review':      '#f97316',
  'Approved':          '#22c55e',
  'Refund Completed':  '#22c55e',
  'Rejected':          '#ef4444',
};

export default function CustomerReturns({ cartCount, wishlistCount }) {
  const [tab, setTab]             = useState('myreturns');
  const [returns, setReturns]     = useState(INIT_RETURNS);
  const [expanded, setExpanded]   = useState(null);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState({
    orderId: '', reason: '', description: '', image: null,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setForm(f => ({ ...f, image: ev.target.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.orderId) { toast.error('Select an order'); return; }
    if (!form.reason)  { toast.error('Select a reason'); return; }
    if (!form.description) { toast.error('Describe the issue'); return; }

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));

    const order = MY_ORDERS_FOR_RETURN.find(o => o.id === form.orderId);
    const newReturn = {
      id: 'RET' + Date.now(),
      orderId: form.orderId,
      product: order?.product || '',
      image: order?.image || '📦',
      amount: order?.amount || 0,
      reason: form.reason,
      description: form.description,
      productImage: form.image,
      date: new Date().toISOString().split('T')[0],
      status: 'Request Submitted',
      stepIndex: 0,
      refundMethod: 'Original Payment Method',
      refundDate: null,
    };

    setReturns([newReturn, ...returns]);
    setForm({ orderId: '', reason: '', description: '', image: null });
    setShowForm(false);
    setSubmitting(false);
    setTab('myreturns');
    toast.success('Return request submitted successfully!');
  };

  return (
    <CustomerLayout title="Returns & Refunds" cartCount={cartCount} wishlistCount={wishlistCount}>

      {/* Stats */}
      <div className="mini-stats" style={{ marginBottom: '1.25rem' }}>
        <div className="mini-stat"><span>Total Returns</span><strong>{returns.length}</strong></div>
        <div className="mini-stat green"><span>Approved</span><strong>{returns.filter(r => r.status === 'Approved' || r.status === 'Refund Completed').length}</strong></div>
        <div className="mini-stat orange"><span>Under Review</span><strong>{returns.filter(r => r.status === 'Under Review').length}</strong></div>
        <div className="mini-stat blue"><span>Submitted</span><strong>{returns.filter(r => r.status === 'Request Submitted').length}</strong></div>
      </div>

      {/* Tabs */}
      <div className="filter-tabs" style={{ marginBottom: '1.25rem' }}>
        {[
          { id: 'myreturns', label: '📦 My Returns' },
          { id: 'newreturn', label: '➕ New Return Request' },
        ].map(t => (
          <button key={t.id} className={`filter-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ===== MY RETURNS TAB ===== */}
      {tab === 'myreturns' && (
        <>
          {returns.length === 0 ? (
            <div className="empty-state">
              <RefreshCw size={56} color="#c7d2fe" />
              <h3>No return requests yet</h3>
              <p>If you have an issue with a product, raise a return request.</p>
              <button className="btn-primary" style={{ width: 'auto', padding: '0.75rem 2rem', marginTop: '1rem' }}
                onClick={() => setTab('newreturn')}>
                Request a Return
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {returns.map(r => (
                <div key={r.id} className="order-card">
                  {/* Header */}
                  <div className="order-card-header" onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: '1.75rem' }}>{r.image}</span>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <p style={{ fontWeight: 700, color: '#1e293b', margin: 0 }}>{r.product}</p>
                          <span style={{ fontSize: '0.72rem', color: '#6366f1', background: '#eef2ff', padding: '1px 8px', borderRadius: 20 }}>{r.id}</span>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>{r.orderId} · {r.date} · {r.reason}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className="status-badge" style={{
                        background: (statusColor[r.status] || '#6366f1') + '20',
                        color: statusColor[r.status] || '#6366f1',
                      }}>
                        {r.status}
                      </span>
                      <strong>₹{r.amount.toLocaleString()}</strong>
                      {expanded === r.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>

                  {/* Expanded */}
                  {expanded === r.id && (
                    <div className="order-card-body">
                      {/* Description */}
                      <div style={{ background: '#f8fafc', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1rem' }}>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                          <strong>Issue:</strong> {r.description}
                        </p>
                        {r.productImage && (
                          <img src={r.productImage} alt="Product" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginTop: 8 }} />
                        )}
                      </div>

                      {/* Refund Tracking Steps */}
                      <p style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '1rem' }}>
                        💰 Refund Status Tracker
                      </p>
                      <div className="order-tracking-steps" style={{ marginBottom: '1rem' }}>
                        {REFUND_STEPS.map((step, i) => {
                          const done    = i <= r.stepIndex;
                          const current = i === r.stepIndex;
                          return (
                            <div key={step.label} className="order-track-step">
                              <div
                                className={`order-track-dot ${done ? 'done' : ''} ${current ? 'current' : ''}`}
                                style={done ? { background: statusColor[step.label] || '#6366f1', borderColor: statusColor[step.label] || '#6366f1' } : {}}
                              >
                                {done ? (current ? step.icon : '✓') : step.icon}
                              </div>
                              <span
                                className={`order-track-label ${done ? 'done' : ''}`}
                                style={current ? { color: statusColor[step.label] || '#6366f1', fontWeight: 700 } : {}}
                              >
                                {step.label}
                              </span>
                              {i < REFUND_STEPS.length - 1 && (
                                <div className={`order-track-line ${i < r.stepIndex ? 'done' : ''}`} />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Refund Info */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div style={{ background: '#f8fafc', borderRadius: 10, padding: '0.75rem 1rem' }}>
                          <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0 }}>Refund Amount</p>
                          <p style={{ fontWeight: 700, color: '#22c55e', fontSize: '1.1rem', margin: 0 }}>₹{r.amount.toLocaleString()}</p>
                        </div>
                        <div style={{ background: '#f8fafc', borderRadius: 10, padding: '0.75rem 1rem' }}>
                          <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0 }}>Refund Method</p>
                          <p style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.875rem', margin: 0 }}>{r.refundMethod}</p>
                        </div>
                        {r.refundDate && (
                          <div style={{ background: '#f0fdf4', borderRadius: 10, padding: '0.75rem 1rem', gridColumn: 'span 2' }}>
                            <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0 }}>Expected Refund Date</p>
                            <p style={{ fontWeight: 700, color: '#22c55e', margin: 0 }}>✅ {r.refundDate}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ===== NEW RETURN REQUEST TAB ===== */}
      {tab === 'newreturn' && (
        <div style={{ maxWidth: 600 }}>
          {/* Info Banner */}
          <div className="alert-box" style={{ marginBottom: '1.5rem', background: '#eef2ff', borderColor: '#c7d2fe', color: '#4338ca' }}>
            <AlertTriangle size={18} color="#6366f1" />
            <span>Returns are accepted within <strong>7 days</strong> of delivery. Refund will be processed in 5-7 business days after approval.</span>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Select Order */}
            <div className="form-group">
              <label style={{ fontWeight: 700, color: '#1e293b', marginBottom: 8, display: 'block' }}>
                Select Order *
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {MY_ORDERS_FOR_RETURN.map(o => (
                  <label key={o.id} className={`return-order-option ${form.orderId === o.id ? 'selected' : ''}`}>
                    <input type="radio" name="orderId" value={o.id} hidden
                      checked={form.orderId === o.id}
                      onChange={() => setForm(f => ({ ...f, orderId: o.id }))} />
                    <span style={{ fontSize: '1.5rem' }}>{o.image}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, margin: 0, fontSize: '0.875rem' }}>{o.product}</p>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>{o.id} · {o.date}</p>
                    </div>
                    <strong style={{ color: '#6366f1' }}>₹{o.amount.toLocaleString()}</strong>
                  </label>
                ))}
              </div>
            </div>

            {/* Return Reason */}
            <div className="form-group">
              <label style={{ fontWeight: 700, color: '#1e293b', marginBottom: 8, display: 'block' }}>
                Reason for Return *
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {RETURN_REASONS.map(r => (
                  <label key={r} className={`unit-radio ${form.reason === r ? 'active' : ''}`}>
                    <input type="radio" name="reason" value={r} hidden
                      checked={form.reason === r}
                      onChange={() => setForm(f => ({ ...f, reason: r }))} />
                    {r}
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label style={{ fontWeight: 700, color: '#1e293b', marginBottom: 8, display: 'block' }}>
                Describe the Issue *
              </label>
              <textarea
                className="form-input"
                rows={4}
                placeholder="Please describe the issue in detail..."
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Upload Image */}
            <div className="form-group">
              <label style={{ fontWeight: 700, color: '#1e293b', marginBottom: 8, display: 'block' }}>
                Upload Product Image <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span>
              </label>
              <label className="upload-btn" style={{ cursor: 'pointer' }}>
                <Upload size={16} /> Choose Image
                <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
              </label>
              {form.image && (
                <div style={{ marginTop: 10, position: 'relative', display: 'inline-block' }}>
                  <img src={form.image} alt="Product" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 10 }} />
                  <button type="button"
                    style={{ position: 'absolute', top: -6, right: -6, background: '#ef4444', border: 'none', borderRadius: '50%', width: 22, height: 22, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => setForm(f => ({ ...f, image: null }))}>
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>

            {/* Refund Info */}
            <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 12, padding: '1rem' }}>
              <p style={{ fontWeight: 700, color: '#166534', margin: '0 0 6px' }}>💰 Refund Information</p>
              <p style={{ fontSize: '0.82rem', color: '#166534', margin: 0 }}>
                • Refund will be credited to your original payment method<br />
                • Processing time: 5–7 business days after approval<br />
                • You will receive email updates on refund status
              </p>
            </div>

            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting
                ? <><span className="spin" style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }} /> Submitting...</>
                : '📋 Submit Return Request'
              }
            </button>
          </form>
        </div>
      )}
    </CustomerLayout>
  );
}
