import React, { useState } from 'react';
import CustomerLayout from '../../../components/customer/CustomerLayout';
import {
  CreditCard, Smartphone, Truck, CheckCircle, XCircle,
  Clock, Download, Eye, X, Brain, TrendingUp, FileText, MapPin, Plus
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

const PAYMENT_HISTORY = [
  { id: 'PAY001', orderId: '#ORD001', product: 'iPhone 15',       amount: 94399, method: 'UPI',  upiId: 'priya@okaxis', cardLast4: '',   address: '', status: 'Paid',    date: '2026-05-01', time: '10:23 AM', items: [{ name: 'iPhone 15', qty: 1, price: 79999 }],       tax: 14400, discount: 0,   coupon: null },
  { id: 'PAY002', orderId: '#ORD002', product: 'Nike Shoes',       amount: 9438,  method: 'Card', upiId: '',             cardLast4: '4242', address: '', status: 'Paid',    date: '2026-05-03', time: '02:15 PM', items: [{ name: 'Nike Shoes', qty: 2, price: 3999 }],        tax: 1438,  discount: 0,   coupon: null },
  { id: 'PAY003', orderId: '#ORD003', product: 'Basmati Rice',     amount: 2124,  method: 'COD',  upiId: '',             cardLast4: '',   address: '78, T Nagar, Chennai', status: 'Paid', date: '2026-05-05', time: '09:00 AM', items: [{ name: 'Basmati Rice', qty: 3, price: 600 }], tax: 324, discount: 0, coupon: null },
  { id: 'PAY004', orderId: '#ORD004', product: 'Wireless Earbuds', amount: 2449,  method: 'UPI',  upiId: 'priya@okaxis', cardLast4: '',   address: '', status: 'Paid',    date: '2026-05-06', time: '11:30 AM', items: [{ name: 'Wireless Earbuds', qty: 1, price: 2499 }],  tax: 450,   discount: 500, coupon: 'SAVE10' },
  { id: 'PAY005', orderId: '#ORD005', product: 'Laptop',           amount: 64900, method: 'Card', upiId: '',             cardLast4: '4242', address: '', status: 'Pending', date: '2026-05-07', time: '04:45 PM', items: [{ name: 'Laptop', qty: 1, price: 55000 }],           tax: 9900,  discount: 0,   coupon: null },
  { id: 'PAY006', orderId: '#ORD006', product: 'Olive Oil',        amount: 531,   method: 'UPI',  upiId: 'priya@okaxis', cardLast4: '',   address: '', status: 'Failed',  date: '2026-05-04', time: '07:30 PM', items: [{ name: 'Olive Oil', qty: 1, price: 450 }],          tax: 81,    discount: 0,   coupon: null },
  { id: 'PAY007', orderId: '#ORD007', product: 'Denim Jeans',      amount: 1299,  method: 'Card', upiId: '',             cardLast4: '4242', address: '', status: 'Paid',  date: '2026-04-28', time: '03:20 PM', items: [{ name: 'Denim Jeans', qty: 1, price: 1499 }],       tax: 270,   discount: 200, coupon: 'FLAT50' },
  { id: 'PAY008', orderId: '#ORD008', product: 'Milk 1L',          amount: 71,    method: 'COD',  upiId: '',             cardLast4: '',   address: '12, MG Road, Chennai', status: 'Paid', date: '2026-04-25', time: '08:00 AM', items: [{ name: 'Milk 1L', qty: 1, price: 60 }], tax: 11, discount: 0, coupon: null },
];

const methodData = [
  { name: 'UPI',  value: 4, color: '#6366f1' },
  { name: 'Card', value: 3, color: '#8b5cf6' },
  { name: 'COD',  value: 2, color: '#f97316' },
];

const monthlySpend = [
  { month: 'Jan', amount: 1200 }, { month: 'Feb', amount: 3400 },
  { month: 'Mar', amount: 2100 }, { month: 'Apr', amount: 4500 },
  { month: 'May', amount: 5200 },
];

const AI_INSIGHTS = [
  { icon: '💳', text: 'You prefer UPI payments — 50% of your transactions use UPI.', color: '#6366f1' },
  { icon: '🌙', text: 'Your payment failures happen mostly in evening hours (7–9 PM). Try paying in the morning.', color: '#f97316' },
  { icon: '💰', text: 'You saved ₹700 using coupons this month. Keep using offers!', color: '#22c55e' },
  { icon: '📈', text: 'Your spending increased by 15% this month compared to last month.', color: '#3b82f6' },
];

const statusConfig = {
  Paid:    { color: '#22c55e', bg: '#f0fdf4', icon: <CheckCircle size={14} /> },
  Pending: { color: '#f97316', bg: '#fff7ed', icon: <Clock size={14} /> },
  Failed:  { color: '#ef4444', bg: '#fff5f5', icon: <XCircle size={14} /> },
};

const methodIcon = {
  UPI:  <Smartphone size={16} color="#6366f1" />,
  Card: <CreditCard size={16} color="#8b5cf6" />,
  COD:  <Truck size={16} color="#f97316" />,
};

export default function CustomerPayments({ cartCount, wishlistCount }) {
  const { user } = useAuth();
  const [tab, setTab]               = useState('history');
  const [filterStatus, setFilterStatus] = useState('All');
  const [viewInvoice, setViewInvoice]   = useState(null);
  const [addresses, setAddresses]   = useState([
    { id: 1, label: 'Home', address: '12, MG Road, Chennai - 600001',   default: true },
    { id: 2, label: 'Work', address: '45, Anna Nagar, Chennai - 600040', default: false },
  ]);
  const [showAddAddr, setShowAddAddr] = useState(false);
  const [newAddr, setNewAddr]         = useState({ label: 'Home', address: '' });

  const filtered = PAYMENT_HISTORY.filter(p =>
    filterStatus === 'All' || p.status === filterStatus
  );

  const totalPaid    = PAYMENT_HISTORY.filter(p => p.status === 'Paid').reduce((s, p) => s + p.amount, 0);
  const totalSaved   = PAYMENT_HISTORY.reduce((s, p) => s + (p.discount || 0), 0);
  const totalPending = PAYMENT_HISTORY.filter(p => p.status === 'Pending').reduce((s, p) => s + p.amount, 0);

  const downloadInvoice = (p) => {
    const lines = [
      '========================================',
      '       SMART RETAIL - INVOICE           ',
      '========================================',
      `Invoice ID  : ${p.id}`,
      `Order ID    : ${p.orderId}`,
      `Date        : ${p.date} ${p.time}`,
      `Customer    : ${user?.fullName}`,
      `Email       : ${user?.email}`,
      '----------------------------------------',
      'ITEMS:',
      ...p.items.map(i => `  ${i.name} x${i.qty}  =  Rs.${(i.qty * i.price).toLocaleString()}`),
      '----------------------------------------',
      `Subtotal    : Rs.${p.items.reduce((s, i) => s + i.qty * i.price, 0).toLocaleString()}`,
      `GST (18%)   : Rs.${p.tax.toLocaleString()}`,
      p.discount > 0 ? `Discount    : -Rs.${p.discount} (${p.coupon})` : '',
      `TOTAL       : Rs.${p.amount.toLocaleString()}`,
      '----------------------------------------',
      `Payment     : ${p.method}`,
      p.method === 'UPI'  ? `UPI ID      : ${p.upiId}` : '',
      p.method === 'Card' ? `Card        : **** **** **** ${p.cardLast4}` : '',
      p.method === 'COD'  ? `Address     : ${p.address}` : '',
      `Status      : ${p.status}`,
      '========================================',
      '   Thank you for shopping with us!      ',
      '========================================',
    ].filter(Boolean).join('\n');

    const blob = new Blob([lines], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `Invoice_${p.id}.txt`; a.click();
    URL.revokeObjectURL(url);
    toast.success(`Invoice ${p.id} downloaded!`);
  };

  const addAddress = () => {
    if (!newAddr.address) { toast.error('Enter address'); return; }
    setAddresses([...addresses, { id: Date.now(), ...newAddr, default: false }]);
    setNewAddr({ label: 'Home', address: '' });
    setShowAddAddr(false);
    toast.success('Address added!');
  };

  const setDefault = (id) => setAddresses(addresses.map(a => ({ ...a, default: a.id === id })));

  return (
    <CustomerLayout title="My Payments" cartCount={cartCount} wishlistCount={wishlistCount}>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon green"><CheckCircle size={24} /></div>
          <div className="stat-info"><p className="stat-label">Total Paid</p><h3 className="stat-value">₹{totalPaid.toLocaleString()}</h3></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><Clock size={24} /></div>
          <div className="stat-info"><p className="stat-label">Pending</p><h3 className="stat-value">₹{totalPending.toLocaleString()}</h3></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><CreditCard size={24} /></div>
          <div className="stat-info"><p className="stat-label">Transactions</p><h3 className="stat-value">{PAYMENT_HISTORY.length}</h3></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><TrendingUp size={24} /></div>
          <div className="stat-info"><p className="stat-label">Total Saved</p><h3 className="stat-value" style={{ color: '#22c55e' }}>₹{totalSaved}</h3></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="filter-tabs" style={{ marginBottom: '1.25rem' }}>
        {[
          { id: 'history',  label: '💳 Payment History' },
          { id: 'methods',  label: '📊 Analytics & Methods' },
          { id: 'ai',       label: '🤖 AI Insights' },
        ].map(t => (
          <button key={t.id} className={`filter-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* ===== HISTORY TAB ===== */}
      {tab === 'history' && (
        <>
          <div className="filter-tabs" style={{ marginBottom: '1rem' }}>
            {['All', 'Paid', 'Pending', 'Failed'].map(s => (
              <button key={s} className={`filter-tab ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>{s}</button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filtered.map(p => (
              <div key={p.id} className="payment-history-card">
                <div className="payment-history-left">
                  <div className="payment-method-icon">{methodIcon[p.method]}</div>
                  <div>
                    <p style={{ fontWeight: 700, color: '#1e293b', margin: 0 }}>{p.product}</p>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0' }}>{p.orderId} · {p.date} · {p.time}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      {methodIcon[p.method]}
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {p.method === 'UPI'  && p.upiId}
                        {p.method === 'Card' && `**** ${p.cardLast4}`}
                        {p.method === 'COD'  && p.address}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="payment-history-right">
                  <strong style={{ fontSize: '1rem' }}>₹{p.amount.toLocaleString()}</strong>
                  {p.discount > 0 && <span style={{ fontSize: '0.72rem', color: '#22c55e', fontWeight: 600 }}>-₹{p.discount} saved</span>}
                  <span className="status-badge" style={{ background: statusConfig[p.status].bg, color: statusConfig[p.status].color, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {statusConfig[p.status].icon} {p.status}
                  </span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="icon-btn blue" onClick={() => setViewInvoice(p)}><Eye size={15} /></button>
                    {p.status === 'Paid' && <button className="icon-btn green" onClick={() => downloadInvoice(p)}><Download size={15} /></button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ===== ANALYTICS TAB ===== */}
      {tab === 'methods' && (
        <>
          <div className="charts-grid" style={{ marginBottom: '1.5rem' }}>
            <div className="chart-card">
              <h3 className="chart-title">Payment Method Usage</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={methodData} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name">
                    {methodData.map((m, i) => <Cell key={i} fill={m.color} />)}
                  </Pie>
                  <Tooltip formatter={v => [`${v} transactions`]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                {methodData.map(m => (
                  <div key={m.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: m.color + '15', borderRadius: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {methodIcon[m.name]}
                      <span style={{ fontWeight: 600, color: m.color }}>{m.name}</span>
                    </div>
                    <strong style={{ color: m.color }}>{m.value} transactions</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="chart-card wide">
              <h3 className="chart-title">Monthly Spending</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlySpend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={v => '₹' + v.toLocaleString()} />
                  <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* COD Addresses */}
          <div className="table-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="chart-title" style={{ margin: 0 }}><Truck size={18} color="#f97316" /> Cash on Delivery Addresses</h3>
              <button className="btn-add" onClick={() => setShowAddAddr(!showAddAddr)}><Plus size={15} /> Add Address</button>
            </div>

            {showAddAddr && (
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: '1rem', marginBottom: '1rem', border: '1.5px solid #e2e8f0' }}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Label</label>
                    <select className="form-input" value={newAddr.label} onChange={e => setNewAddr({ ...newAddr, label: e.target.value })}>
                      <option>Home</option><option>Work</option><option>Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Full Address</label>
                    <input className="form-input" placeholder="Street, City, Pincode"
                      value={newAddr.address} onChange={e => setNewAddr({ ...newAddr, address: e.target.value })} />
                  </div>
                </div>
                <button className="btn-save" onClick={addAddress}>Save Address</button>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {addresses.map(a => (
                <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: 10, border: '1.5px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <MapPin size={16} color="#6366f1" />
                    <span className="cat-badge">{a.label}</span>
                    <span style={{ fontSize: '0.875rem', color: '#1e293b' }}>{a.address}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {a.default
                      ? <span className="status-badge badge-green">Default</span>
                      : <button className="quick-coupon-btn" onClick={() => setDefault(a.id)}>Set Default</button>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ===== AI INSIGHTS TAB ===== */}
      {tab === 'ai' && (
        <>
          <div style={{ background: 'linear-gradient(135deg,#eef2ff,#f5f3ff)', border: '1.5px solid #c7d2fe', borderRadius: 14, padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Brain size={28} color="#6366f1" />
            <div>
              <h3 style={{ color: '#4338ca', margin: 0 }}>AI Payment Insights</h3>
              <p style={{ color: '#6366f1', margin: 0, fontSize: '0.85rem' }}>Personalized analysis of your payment behavior</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {AI_INSIGHTS.map((insight, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'white', borderRadius: 14, padding: '1.25rem', borderLeft: `4px solid ${insight.color}`, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: '2rem' }}>{insight.icon}</span>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569', fontWeight: 500 }}>🤖 {insight.text}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Invoice Modal */}
      {viewInvoice && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3><FileText size={18} /> Invoice — {viewInvoice.id}</h3>
              <button onClick={() => setViewInvoice(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div style={{ textAlign: 'center', marginBottom: '1.25rem', padding: '1rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 12, color: 'white' }}>
                <h2 style={{ margin: 0 }}>🛍️ SmartRetail</h2>
                <p style={{ margin: '4px 0 0', opacity: 0.85, fontSize: '0.85rem' }}>Tax Invoice / Receipt</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.82rem', color: '#64748b' }}>
                <div>
                  <p style={{ margin: 0 }}><strong>Invoice:</strong> {viewInvoice.id}</p>
                  <p style={{ margin: 0 }}><strong>Order:</strong> {viewInvoice.orderId}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0 }}><strong>Date:</strong> {viewInvoice.date}</p>
                  <p style={{ margin: 0 }}><strong>Time:</strong> {viewInvoice.time}</p>
                </div>
              </div>
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.82rem' }}>
                <p style={{ margin: 0, fontWeight: 700 }}>Bill To: {user?.fullName}</p>
                <p style={{ margin: 0, color: '#64748b' }}>{user?.email}</p>
              </div>
              <table className="data-table" style={{ marginBottom: '1rem' }}>
                <thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
                <tbody>
                  {viewInvoice.items.map((item, i) => (
                    <tr key={i}>
                      <td>{item.name}</td><td>{item.qty}</td>
                      <td>₹{item.price.toLocaleString()}</td>
                      <td><strong>₹{(item.qty * item.price).toLocaleString()}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: '0.75rem 1rem' }}>
                <div className="summary-row"><span>Subtotal</span><span>₹{viewInvoice.items.reduce((s, i) => s + i.qty * i.price, 0).toLocaleString()}</span></div>
                <div className="summary-row"><span>GST (18%)</span><span>₹{viewInvoice.tax.toLocaleString()}</span></div>
                {viewInvoice.discount > 0 && (
                  <div className="summary-row" style={{ color: '#22c55e' }}>
                    <span>Discount ({viewInvoice.coupon})</span><span>-₹{viewInvoice.discount}</span>
                  </div>
                )}
                <div className="summary-divider" />
                <div className="summary-row total"><span>Total Paid</span><span>₹{viewInvoice.amount.toLocaleString()}</span></div>
                <div className="summary-row" style={{ marginTop: 8 }}>
                  <span>Payment</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {methodIcon[viewInvoice.method]} {viewInvoice.method}
                    {viewInvoice.method === 'UPI'  && ` (${viewInvoice.upiId})`}
                    {viewInvoice.method === 'Card' && ` (**** ${viewInvoice.cardLast4})`}
                    {viewInvoice.method === 'COD'  && ` — ${viewInvoice.address}`}
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setViewInvoice(null)}>Close</button>
              {viewInvoice.status === 'Paid' && (
                <button className="btn-save" onClick={() => { downloadInvoice(viewInvoice); setViewInvoice(null); }}>
                  <Download size={15} /> Download Invoice
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </CustomerLayout>
  );
}
