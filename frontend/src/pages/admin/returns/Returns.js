import React, { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import {
  Search, Eye, CheckCircle, XCircle, X, Brain,
  AlertTriangle, BarChart2, RefreshCw, Package
} from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import toast from 'react-hot-toast';

const RETURN_REASONS = [
  'Damaged Product',
  'Wrong Product Delivered',
  'Wrong Size / Quantity',
  'Product Not Working',
  'Quality Issue',
  'Changed Mind',
  'Late Delivery',
  'Missing Parts',
];

const INIT_RETURNS = [
  { id: 'RET001', orderId: '#ORD001', customer: 'Priya R',   email: 'priya@gmail.com',  product: 'Wireless Earbuds', amount: 2499,  reason: 'Product Not Working',      description: 'No sound from left ear after 2 days of use.', orderDate: '2026-04-25', returnDate: '2026-05-01', status: 'Pending',  refundStatus: '-',        image: '🎧' },
  { id: 'RET002', orderId: '#ORD003', customer: 'Arun T',    email: 'arun@gmail.com',   product: 'Nike T-Shirt',     amount: 999,   reason: 'Wrong Size / Quantity',    description: 'Ordered L size but received M size.', orderDate: '2026-04-20', returnDate: '2026-04-28', status: 'Approved', refundStatus: 'Refunded', image: '👕' },
  { id: 'RET003', orderId: '#ORD005', customer: 'Meena S',   email: 'meena@gmail.com',  product: 'Laptop',           amount: 55000, reason: 'Damaged Product',          description: 'Screen has cracks on arrival. Packaging was damaged.', orderDate: '2026-04-22', returnDate: '2026-04-30', status: 'Approved', refundStatus: 'Refunded', image: '💻' },
  { id: 'RET004', orderId: '#ORD007', customer: 'Kumar P',   email: 'kumar@gmail.com',  product: 'Basmati Rice',     amount: 600,   reason: 'Wrong Product Delivered',  description: 'Ordered 5kg but received 1kg pack.', orderDate: '2026-04-28', returnDate: '2026-05-03', status: 'Pending',  refundStatus: '-',        image: '🌾' },
  { id: 'RET005', orderId: '#ORD009', customer: 'Divya M',   email: 'divya@gmail.com',  product: 'Running Shoes',    amount: 3999,  reason: 'Quality Issue',            description: 'Sole came off after first use.', orderDate: '2026-04-15', returnDate: '2026-04-25', status: 'Rejected', refundStatus: 'Rejected', image: '👟' },
  { id: 'RET006', orderId: '#ORD011', customer: 'Vijay N',   email: 'vijay@gmail.com',  product: 'Denim Jeans',      amount: 1499,  reason: 'Changed Mind',             description: 'Did not like the color in person.', orderDate: '2026-05-01', returnDate: '2026-05-05', status: 'Pending',  refundStatus: '-',        image: '👖' },
  { id: 'RET007', orderId: '#ORD012', customer: 'Sita R',    email: 'sita@gmail.com',   product: 'Wireless Earbuds', amount: 2499,  reason: 'Product Not Working',      description: 'Bluetooth keeps disconnecting.', orderDate: '2026-04-18', returnDate: '2026-04-26', status: 'Approved', refundStatus: 'Refunded', image: '🎧' },
  { id: 'RET008', orderId: '#ORD014', customer: 'Ravi S',    email: 'ravi@gmail.com',   product: 'Olive Oil',        amount: 450,   reason: 'Damaged Product',          description: 'Bottle was leaking inside the package.', orderDate: '2026-05-02', returnDate: '2026-05-06', status: 'Pending',  refundStatus: '-',        image: '🫙' },
  { id: 'RET009', orderId: '#ORD015', customer: 'Anita B',   email: 'anita@gmail.com',  product: 'iPhone 15',        amount: 79999, reason: 'Missing Parts',            description: 'Charger and earphones not included in box.', orderDate: '2026-04-10', returnDate: '2026-04-18', status: 'Approved', refundStatus: 'Processing',image: '📱' },
  { id: 'RET010', orderId: '#ORD016', customer: 'Karthik M', email: 'karthik@gmail.com',product: 'Wireless Earbuds', amount: 2499,  reason: 'Quality Issue',            description: 'Battery drains in 30 minutes.', orderDate: '2026-05-03', returnDate: '2026-05-07', status: 'Pending',  refundStatus: '-',        image: '🎧' },
];

const reasonAnalytics = RETURN_REASONS.map(r => ({
  reason: r,
  count: INIT_RETURNS.filter(ret => ret.reason === r).length,
})).filter(r => r.count > 0).sort((a, b) => b.count - a.count);

const productAnalytics = Object.entries(
  INIT_RETURNS.reduce((acc, r) => { acc[r.product] = (acc[r.product] || 0) + 1; return acc; }, {})
).map(([product, count]) => ({ product, count })).sort((a, b) => b.count - a.count);

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#64748b'];

const AI_INSIGHTS = [
  { icon: '🎧', product: 'Wireless Earbuds', insight: '3 returns due to sound/battery issues — inspect supplier quality', severity: 'high' },
  { icon: '💻', product: 'Laptop',           insight: 'Screen damage on arrival — improve packaging', severity: 'medium' },
  { icon: '👟', product: 'Running Shoes',    insight: 'Quality complaints — consider changing supplier', severity: 'medium' },
];

const statusConfig = {
  Pending:  { color: '#f97316', bg: '#fff7ed' },
  Approved: { color: '#22c55e', bg: '#f0fdf4' },
  Rejected: { color: '#ef4444', bg: '#fff5f5' },
};

const refundConfig = {
  '-':          { color: '#94a3b8', label: 'Not Processed' },
  Refunded:     { color: '#22c55e', label: 'Refunded ✅' },
  Processing:   { color: '#3b82f6', label: 'Processing...' },
  Rejected:     { color: '#ef4444', label: 'Rejected ❌' },
};

export default function Returns() {
  const [returns, setReturns]     = useState(INIT_RETURNS);
  const [tab, setTab]             = useState('requests');
  const [search, setSearch]       = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [viewReturn, setViewReturn]     = useState(null);

  const filtered = returns.filter(r =>
    (filterStatus === 'All' || r.status === filterStatus) &&
    (r.id.toLowerCase().includes(search.toLowerCase()) ||
     r.customer.toLowerCase().includes(search.toLowerCase()) ||
     r.product.toLowerCase().includes(search.toLowerCase()) ||
     r.reason.toLowerCase().includes(search.toLowerCase()))
  );

  const handleApprove = (id) => {
    setReturns(returns.map(r => r.id === id
      ? { ...r, status: 'Approved', refundStatus: 'Processing' }
      : r
    ));
    toast.success('Return approved! Refund initiated.');
    if (viewReturn?.id === id) setViewReturn(prev => ({ ...prev, status: 'Approved', refundStatus: 'Processing' }));
  };

  const handleReject = (id) => {
    setReturns(returns.map(r => r.id === id
      ? { ...r, status: 'Rejected', refundStatus: 'Rejected' }
      : r
    ));
    toast.error('Return request rejected.');
    if (viewReturn?.id === id) setViewReturn(prev => ({ ...prev, status: 'Rejected', refundStatus: 'Rejected' }));
  };

  const totalRefunded = returns.filter(r => r.refundStatus === 'Refunded').reduce((s, r) => s + r.amount, 0);
  const pendingAmount = returns.filter(r => r.status === 'Pending').reduce((s, r) => s + r.amount, 0);

  return (
    <AdminLayout title="Returns & Refunds">

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon orange"><RefreshCw size={24} /></div>
          <div className="stat-info">
            <p className="stat-label">Total Returns</p>
            <h3 className="stat-value">{returns.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fff7ed', color: '#f97316' }}><Package size={24} /></div>
          <div className="stat-info">
            <p className="stat-label">Pending</p>
            <h3 className="stat-value">{returns.filter(r => r.status === 'Pending').length}</h3>
            <p className="stat-change" style={{ color: '#f97316' }}>₹{pendingAmount.toLocaleString()} at risk</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><CheckCircle size={24} /></div>
          <div className="stat-info">
            <p className="stat-label">Approved</p>
            <h3 className="stat-value">{returns.filter(r => r.status === 'Approved').length}</h3>
            <p className="stat-change up">₹{totalRefunded.toLocaleString()} refunded</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fff5f5', color: '#ef4444' }}><XCircle size={24} /></div>
          <div className="stat-info">
            <p className="stat-label">Rejected</p>
            <h3 className="stat-value">{returns.filter(r => r.status === 'Rejected').length}</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="filter-tabs" style={{ marginBottom: '1.25rem' }}>
        {[
          { id: 'requests',  label: '📋 Return Requests' },
          { id: 'analytics', label: '📊 Return Analytics' },
          { id: 'ai',        label: '🤖 AI Insights' },
        ].map(t => (
          <button key={t.id} className={`filter-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ===== RETURN REQUESTS TAB ===== */}
      {tab === 'requests' && (
        <>
          <div className="toolbar">
            <div className="search-box">
              <Search size={16} />
              <input placeholder="Search by ID, customer, product, reason..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="filter-tabs">
              {['All', 'Pending', 'Approved', 'Rejected'].map(s => (
                <button key={s} className={`filter-tab ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>{s}</button>
              ))}
            </div>
          </div>

          <div className="table-card" style={{ marginTop: '1rem' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Return ID</th><th>Customer</th><th>Product</th><th>Amount</th>
                  <th>Reason</th><th>Return Date</th><th>Status</th><th>Refund</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id}>
                    <td className="order-id">{r.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="sidebar-avatar" style={{ width: 28, height: 28, fontSize: '0.75rem' }}>{r.customer.charAt(0)}</div>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: '0.85rem', margin: 0 }}>{r.customer}</p>
                          <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0 }}>{r.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '1.2rem', marginRight: 6 }}>{r.image}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{r.product}</span>
                    </td>
                    <td><strong>₹{r.amount.toLocaleString()}</strong></td>
                    <td>
                      <span style={{ fontSize: '0.78rem', background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>
                        {r.reason}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{r.returnDate}</td>
                    <td>
                      <span className="status-badge" style={{ background: statusConfig[r.status].bg, color: statusConfig[r.status].color }}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: refundConfig[r.refundStatus].color }}>
                        {refundConfig[r.refundStatus].label}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="icon-btn blue" onClick={() => setViewReturn(r)}><Eye size={15} /></button>
                        {r.status === 'Pending' && (
                          <>
                            <button className="icon-btn green" title="Approve" onClick={() => handleApprove(r.id)}><CheckCircle size={15} /></button>
                            <button className="icon-btn red"   title="Reject"  onClick={() => handleReject(r.id)}><XCircle size={15} /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ===== ANALYTICS TAB ===== */}
      {tab === 'analytics' && (
        <>
          <div className="charts-grid" style={{ marginBottom: '1.5rem' }}>
            {/* Reason Bar Chart */}
            <div className="chart-card wide">
              <h3 className="chart-title"><BarChart2 size={18} color="#6366f1" /> Return Reasons Analysis</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={reasonAnalytics} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                  <YAxis dataKey="reason" type="category" width={160} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={v => [`${v} returns`, 'Count']} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {reasonAnalytics.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Product Pie Chart */}
            <div className="chart-card">
              <h3 className="chart-title">Returns by Product</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={productAnalytics} cx="50%" cy="50%" outerRadius={85} dataKey="count" nameKey="product">
                    {productAnalytics.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={v => [`${v} returns`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Reason Summary Table */}
          <div className="table-card">
            <h3 className="chart-title" style={{ marginBottom: '1rem' }}>Detailed Return Reasons Report</h3>
            <table className="data-table">
              <thead>
                <tr><th>Reason</th><th>Count</th><th>% of Total</th><th>Refund Amount</th><th>Progress</th></tr>
              </thead>
              <tbody>
                {reasonAnalytics.map((r, i) => {
                  const pct = Math.round((r.count / returns.length) * 100);
                  const amt = returns.filter(ret => ret.reason === r.reason).reduce((s, ret) => s + ret.amount, 0);
                  return (
                    <tr key={r.reason}>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i % COLORS.length], display: 'inline-block' }} />
                          {r.reason}
                        </span>
                      </td>
                      <td><strong>{r.count}</strong></td>
                      <td><strong style={{ color: COLORS[i % COLORS.length] }}>{pct}%</strong></td>
                      <td><strong>₹{amt.toLocaleString()}</strong></td>
                      <td style={{ width: 140 }}>
                        <div style={{ height: 8, background: '#f1f5f9', borderRadius: 10, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: pct + '%', background: COLORS[i % COLORS.length], borderRadius: 10 }} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ===== AI INSIGHTS TAB ===== */}
      {tab === 'ai' && (
        <>
          <div style={{ background: 'linear-gradient(135deg,#eef2ff,#f5f3ff)', border: '1.5px solid #c7d2fe', borderRadius: 14, padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Brain size={28} color="#6366f1" />
            <div>
              <h3 style={{ color: '#4338ca', margin: 0 }}>AI Pattern Detection</h3>
              <p style={{ color: '#6366f1', margin: 0, fontSize: '0.85rem' }}>AI analyzed {returns.length} return requests and found these patterns</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {AI_INSIGHTS.map((insight, i) => (
              <div key={i} className={`ai-insight-card ${insight.severity}`}>
                <div style={{ fontSize: '2rem' }}>{insight.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <strong style={{ color: '#1e293b' }}>{insight.product}</strong>
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                      background: insight.severity === 'high' ? '#fff5f5' : '#fff7ed',
                      color: insight.severity === 'high' ? '#ef4444' : '#f97316'
                    }}>
                      {insight.severity === 'high' ? '🔴 High Priority' : '🟠 Medium Priority'}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>🤖 {insight.insight}</p>
                </div>
                <AlertTriangle size={20} color={insight.severity === 'high' ? '#ef4444' : '#f97316'} />
              </div>
            ))}
          </div>

          {/* AI Recommendation Table */}
          <div className="table-card">
            <h3 className="chart-title" style={{ marginBottom: '1rem' }}>
              <Brain size={18} color="#6366f1" /> AI Recommendations
            </h3>
            <table className="data-table">
              <thead>
                <tr><th>Product</th><th>Return Count</th><th>Top Reason</th><th>AI Suggestion</th></tr>
              </thead>
              <tbody>
                {productAnalytics.map(p => {
                  const productReturns = returns.filter(r => r.product === p.product);
                  const topReason = productReturns.reduce((acc, r) => {
                    acc[r.reason] = (acc[r.reason] || 0) + 1;
                    return acc;
                  }, {});
                  const top = Object.entries(topReason).sort((a, b) => b[1] - a[1])[0]?.[0];
                  const suggestions = {
                    'Product Not Working': 'Inspect supplier quality & test before dispatch',
                    'Damaged Product':     'Improve packaging & handling procedures',
                    'Wrong Size / Quantity': 'Verify order details before packing',
                    'Wrong Product Delivered': 'Improve warehouse labeling system',
                    'Quality Issue':       'Review supplier contract & product standards',
                    'Changed Mind':        'Improve product descriptions & images',
                    'Missing Parts':       'Add checklist before sealing packages',
                    'Late Delivery':       'Optimize delivery routes & partner selection',
                  };
                  return (
                    <tr key={p.product}>
                      <td><strong>{p.product}</strong></td>
                      <td><span style={{ color: '#ef4444', fontWeight: 700 }}>{p.count}</span></td>
                      <td><span style={{ fontSize: '0.78rem', background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: 20 }}>{top}</span></td>
                      <td style={{ fontSize: '0.82rem', color: '#6366f1' }}>💡 {suggestions[top] || 'Review product quality'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* View Return Modal */}
      {viewReturn && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Return Request — {viewReturn.id}</h3>
              <button onClick={() => setViewReturn(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: 8 }}>{viewReturn.image}</div>
                <h3 style={{ margin: 0 }}>{viewReturn.product}</h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '4px 0' }}>Order: {viewReturn.orderId}</p>
                <span className="status-badge" style={{ background: statusConfig[viewReturn.status].bg, color: statusConfig[viewReturn.status].color }}>
                  {viewReturn.status}
                </span>
              </div>

              <div className="view-grid">
                <div className="view-item"><span>Customer</span><strong>{viewReturn.customer}</strong></div>
                <div className="view-item"><span>Email</span><strong style={{ fontSize: '0.8rem' }}>{viewReturn.email}</strong></div>
                <div className="view-item"><span>Amount</span><strong style={{ color: '#22c55e', fontSize: '1.1rem' }}>₹{viewReturn.amount.toLocaleString()}</strong></div>
                <div className="view-item"><span>Refund Status</span><strong style={{ color: refundConfig[viewReturn.refundStatus].color }}>{refundConfig[viewReturn.refundStatus].label}</strong></div>
                <div className="view-item"><span>Order Date</span><strong>{viewReturn.orderDate}</strong></div>
                <div className="view-item"><span>Return Date</span><strong>{viewReturn.returnDate}</strong></div>
                <div className="view-item" style={{ gridColumn: 'span 2' }}>
                  <span>Return Reason</span>
                  <strong style={{ color: '#f97316' }}>{viewReturn.reason}</strong>
                </div>
                <div className="view-item" style={{ gridColumn: 'span 2' }}>
                  <span>Customer Description</span>
                  <strong style={{ fontWeight: 400, color: '#475569' }}>{viewReturn.description}</strong>
                </div>
              </div>

              {viewReturn.status === 'Pending' && (
                <div className="modal-footer" style={{ padding: '1rem 0 0', border: 'none' }}>
                  <button className="btn-cancel" style={{ background: '#fff5f5', color: '#ef4444', border: '1.5px solid #fecaca' }}
                    onClick={() => handleReject(viewReturn.id)}>
                    <XCircle size={16} /> Reject
                  </button>
                  <button className="btn-save" style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)' }}
                    onClick={() => handleApprove(viewReturn.id)}>
                    <CheckCircle size={16} /> Approve Refund
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
