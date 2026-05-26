import React, { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import {
  CheckCircle, XCircle, Clock, RefreshCw, Search,
  TrendingUp, IndianRupee, BarChart2, PieChart as PieIcon, Eye, X
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const PAYMENTS = [
  { id: 'ORD001', customer: 'Priya R',    email: 'priya@gmail.com',  amount: 94399,  method: 'UPI',  status: 'Successful', date: '2026-05-01', time: '10:23 AM', product: 'iPhone 15',      reason: '' },
  { id: 'ORD002', customer: 'Rahul K',    email: 'rahul@gmail.com',  amount: 1200,   method: 'Card', status: 'Pending',    date: '2026-05-02', time: '11:45 AM', product: 'Nike T-Shirt',   reason: '' },
  { id: 'ORD003', customer: 'Arun T',     email: 'arun@gmail.com',   amount: 800,    method: 'UPI',  status: 'Failed',     date: '2026-05-03', time: '02:10 PM', product: 'Basmati Rice',   reason: 'Insufficient balance' },
  { id: 'ORD004', customer: 'Meena S',    email: 'meena@gmail.com',  amount: 55000,  method: 'Card', status: 'Successful', date: '2026-05-03', time: '03:30 PM', product: 'Laptop',         reason: '' },
  { id: 'ORD005', customer: 'Divya M',    email: 'divya@gmail.com',  amount: 450,    method: 'COD',  status: 'Successful', date: '2026-05-04', time: '09:15 AM', product: 'Olive Oil',      reason: '' },
  { id: 'ORD006', customer: 'Kumar P',    email: 'kumar@gmail.com',  amount: 2499,   method: 'UPI',  status: 'Failed',     date: '2026-05-04', time: '04:00 PM', product: 'Earbuds',        reason: 'Wrong OTP entered' },
  { id: 'ORD007', customer: 'Sita R',     email: 'sita@gmail.com',   amount: 3999,   method: 'Card', status: 'Refunded',   date: '2026-05-05', time: '10:00 AM', product: 'Running Shoes',  reason: 'Customer cancelled' },
  { id: 'ORD008', customer: 'Vijay N',    email: 'vijay@gmail.com',  amount: 60,     method: 'UPI',  status: 'Successful', date: '2026-05-05', time: '08:30 AM', product: 'Milk 1L',        reason: '' },
  { id: 'ORD009', customer: 'Anita B',    email: 'anita@gmail.com',  amount: 650,    method: 'Card', status: 'Failed',     date: '2026-05-06', time: '01:20 PM', product: 'Almonds 500g',   reason: 'Network issue' },
  { id: 'ORD010', customer: 'Ravi S',     email: 'ravi@gmail.com',   amount: 79999,  method: 'Card', status: 'Successful', date: '2026-05-06', time: '05:45 PM', product: 'iPhone 15',      reason: '' },
  { id: 'ORD011', customer: 'Poorna L',   email: 'poorna@gmail.com', amount: 999,    method: 'UPI',  status: 'Successful', date: '2026-05-07', time: '11:00 AM', product: 'Nike T-Shirt',   reason: '' },
  { id: 'ORD012', customer: 'Karthik M',  email: 'karthik@gmail.com',amount: 1499,   method: 'COD',  status: 'Pending',    date: '2026-05-07', time: '02:30 PM', product: 'Denim Jeans',    reason: '' },
];

const dailyRevenue = [
  { day: 'Mon', revenue: 5000,  orders: 8  },
  { day: 'Tue', revenue: 7200,  orders: 12 },
  { day: 'Wed', revenue: 4800,  orders: 7  },
  { day: 'Thu', revenue: 9100,  orders: 15 },
  { day: 'Fri', revenue: 11200, orders: 18 },
  { day: 'Sat', revenue: 15400, orders: 24 },
  { day: 'Sun', revenue: 12800, orders: 20 },
];

const weeklyRevenue = [
  { week: 'Week 1', revenue: 45000 }, { week: 'Week 2', revenue: 62000 },
  { week: 'Week 3', revenue: 51000 }, { week: 'Week 4', revenue: 78000 },
];

const monthlyRevenue = [
  { month: 'Jan', revenue: 120000 }, { month: 'Feb', revenue: 190000 },
  { month: 'Mar', revenue: 150000 }, { month: 'Apr', revenue: 250000 },
  { month: 'May', revenue: 220000 }, { month: 'Jun', revenue: 300000 },
];

const categoryRevenue = [
  { name: 'Electronics', value: 185000, color: '#6366f1' },
  { name: 'Clothing',    value: 45000,  color: '#8b5cf6' },
  { name: 'Groceries',   value: 32000,  color: '#a78bfa' },
  { name: 'Dairy',       value: 12000,  color: '#c4b5fd' },
  { name: 'Beverages',   value: 8000,   color: '#ddd6fe' },
  { name: 'Snacks',      value: 6000,   color: '#ede9fe' },
];

const productRevenue = [
  { product: 'iPhone 15',    revenue: 159998 },
  { product: 'Laptop',       revenue: 55000  },
  { product: 'Earbuds',      revenue: 12495  },
  { product: 'Running Shoes',revenue: 7998   },
  { product: 'Denim Jeans',  revenue: 4497   },
];

const statusConfig = {
  Successful: { color: '#22c55e', bg: '#f0fdf4', icon: <CheckCircle size={15} /> },
  Pending:    { color: '#f97316', bg: '#fff7ed', icon: <Clock size={15} /> },
  Failed:     { color: '#ef4444', bg: '#fff5f5', icon: <XCircle size={15} /> },
  Refunded:   { color: '#8b5cf6', bg: '#f5f3ff', icon: <RefreshCw size={15} /> },
};

const failReasons = [
  { reason: 'Insufficient Balance', count: 12, color: '#ef4444' },
  { reason: 'Wrong OTP',            count: 8,  color: '#f97316' },
  { reason: 'Network Issue',        count: 6,  color: '#3b82f6' },
  { reason: 'Bank Server Issue',    count: 4,  color: '#8b5cf6' },
  { reason: 'Card Expired',         count: 3,  color: '#64748b' },
];

export default function Payments() {
  const [tab, setTab]             = useState('transactions');
  const [search, setSearch]       = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [revenueView, setRevenueView]   = useState('daily');
  const [viewPayment, setViewPayment]   = useState(null);

  const filtered = PAYMENTS.filter(p =>
    (filterStatus === 'All' || p.status === filterStatus) &&
    (p.id.toLowerCase().includes(search.toLowerCase()) ||
     p.customer.toLowerCase().includes(search.toLowerCase()) ||
     p.product.toLowerCase().includes(search.toLowerCase()))
  );

  const totalRevenue   = PAYMENTS.filter(p => p.status === 'Successful').reduce((s, p) => s + p.amount, 0);
  const totalRefunded  = PAYMENTS.filter(p => p.status === 'Refunded').reduce((s, p) => s + p.amount, 0);
  const successCount   = PAYMENTS.filter(p => p.status === 'Successful').length;
  const failedCount    = PAYMENTS.filter(p => p.status === 'Failed').length;
  const pendingCount   = PAYMENTS.filter(p => p.status === 'Pending').length;
  const successRate    = Math.round((successCount / PAYMENTS.length) * 100);

  const revenueData = revenueView === 'daily' ? dailyRevenue : revenueView === 'weekly' ? weeklyRevenue : monthlyRevenue;
  const revenueKey  = revenueView === 'daily' ? 'day' : revenueView === 'weekly' ? 'week' : 'month';

  return (
    <AdminLayout title="Payments & Revenue">

      {/* Summary Stats */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon green"><CheckCircle size={24} /></div>
          <div className="stat-info">
            <p className="stat-label">Total Revenue</p>
            <h3 className="stat-value">₹{totalRevenue.toLocaleString()}</h3>
            <p className="stat-change up">✅ {successCount} successful</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><Clock size={24} /></div>
          <div className="stat-info">
            <p className="stat-label">Pending</p>
            <h3 className="stat-value">{pendingCount}</h3>
            <p className="stat-change" style={{ color: '#f97316' }}>Awaiting payment</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fff5f5', color: '#ef4444' }}><XCircle size={24} /></div>
          <div className="stat-info">
            <p className="stat-label">Failed</p>
            <h3 className="stat-value">{failedCount}</h3>
            <p className="stat-change down">❌ Need attention</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><RefreshCw size={24} /></div>
          <div className="stat-info">
            <p className="stat-label">Refunded</p>
            <h3 className="stat-value">₹{totalRefunded.toLocaleString()}</h3>
            <p className="stat-change" style={{ color: '#8b5cf6' }}>Success rate: {successRate}%</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="filter-tabs" style={{ marginBottom: '1.25rem' }}>
        {[
          { id: 'transactions', label: '💳 All Transactions' },
          { id: 'failed',       label: '❌ Failed Payments' },
          { id: 'revenue',      label: '📊 Revenue Breakdown' },
        ].map(t => (
          <button key={t.id} className={`filter-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ===== TRANSACTIONS TAB ===== */}
      {tab === 'transactions' && (
        <>
          <div className="toolbar">
            <div className="search-box">
              <Search size={16} />
              <input placeholder="Search by order, customer, product..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="filter-tabs">
              {['All', 'Successful', 'Pending', 'Failed', 'Refunded'].map(s => (
                <button key={s} className={`filter-tab ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>{s}</button>
              ))}
            </div>
          </div>

          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr><th>Order ID</th><th>Customer</th><th>Product</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td className="order-id">{p.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="sidebar-avatar" style={{ width: 28, height: 28, fontSize: '0.75rem' }}>{p.customer.charAt(0)}</div>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: '0.85rem', margin: 0 }}>{p.customer}</p>
                          <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0 }}>{p.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{p.product}</td>
                    <td><strong>₹{p.amount.toLocaleString()}</strong></td>
                    <td><span className="unit-badge">{p.method}</span></td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{p.date}<br /><span style={{ fontSize: '0.72rem' }}>{p.time}</span></td>
                    <td>
                      <span className="status-badge" style={{ background: statusConfig[p.status].bg, color: statusConfig[p.status].color, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        {statusConfig[p.status].icon} {p.status}
                      </span>
                    </td>
                    <td>
                      <button className="icon-btn blue" onClick={() => setViewPayment(p)}><Eye size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ===== FAILED PAYMENTS TAB ===== */}
      {tab === 'failed' && (
        <>
          <div className="charts-grid" style={{ marginBottom: '1.5rem' }}>
            <div className="chart-card wide">
              <h3 className="chart-title"><XCircle size={18} color="#ef4444" /> Failed Payment Reasons</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {failReasons.map(r => (
                  <div key={r.reason}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>{r.reason}</span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: r.color }}>{r.count} cases</span>
                    </div>
                    <div style={{ height: 8, background: '#f1f5f9', borderRadius: 10, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(r.count / 15) * 100}%`, background: r.color, borderRadius: 10 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="chart-card">
              <h3 className="chart-title">Payment Success Rate</h3>
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ fontSize: '3rem', fontWeight: 800, color: '#22c55e' }}>{successRate}%</div>
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Success Rate</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: '1rem' }}>
                  {[
                    { label: 'Successful', count: successCount, color: '#22c55e' },
                    { label: 'Failed',     count: failedCount,  color: '#ef4444' },
                    { label: 'Pending',    count: pendingCount, color: '#f97316' },
                  ].map(s => (
                    <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', background: s.color + '15', borderRadius: 8 }}>
                      <span style={{ fontSize: '0.82rem', color: s.color, fontWeight: 600 }}>{s.label}</span>
                      <strong style={{ color: s.color }}>{s.count}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="table-card">
            <h3 className="chart-title" style={{ marginBottom: '1rem' }}><XCircle size={18} color="#ef4444" /> Failed Transactions</h3>
            <table className="data-table">
              <thead>
                <tr><th>Order ID</th><th>Customer</th><th>Product</th><th>Amount</th><th>Method</th><th>Date</th><th>Reason</th></tr>
              </thead>
              <tbody>
                {PAYMENTS.filter(p => p.status === 'Failed').map(p => (
                  <tr key={p.id}>
                    <td className="order-id">{p.id}</td>
                    <td><strong>{p.customer}</strong></td>
                    <td>{p.product}</td>
                    <td><strong>₹{p.amount.toLocaleString()}</strong></td>
                    <td><span className="unit-badge">{p.method}</span></td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{p.date}</td>
                    <td><span style={{ color: '#ef4444', fontSize: '0.82rem', fontWeight: 600 }}>❌ {p.reason}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ===== REVENUE BREAKDOWN TAB ===== */}
      {tab === 'revenue' && (
        <>
          <div className="filter-tabs" style={{ marginBottom: '1.25rem' }}>
            {['daily', 'weekly', 'monthly'].map(v => (
              <button key={v} className={`filter-tab ${revenueView === v ? 'active' : ''}`} onClick={() => setRevenueView(v)}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>

          <div className="charts-grid" style={{ marginBottom: '1.5rem' }}>
            {/* Revenue Chart */}
            <div className="chart-card wide">
              <h3 className="chart-title"><TrendingUp size={18} color="#6366f1" /> {revenueView.charAt(0).toUpperCase() + revenueView.slice(1)} Revenue</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey={revenueKey} tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={v => '₹' + v.toLocaleString()} />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="url(#revGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Category Revenue Pie */}
            <div className="chart-card">
              <h3 className="chart-title"><PieIcon size={18} color="#6366f1" /> Category Revenue</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={categoryRevenue} cx="50%" cy="50%" outerRadius={85} dataKey="value" nameKey="name">
                    {categoryRevenue.map((c, i) => <Cell key={i} fill={c.color} />)}
                  </Pie>
                  <Tooltip formatter={v => '₹' + v.toLocaleString()} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Product-wise Revenue */}
          <div className="chart-card" style={{ marginBottom: '1.5rem' }}>
            <h3 className="chart-title"><BarChart2 size={18} color="#6366f1" /> Product-wise Revenue</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={productRevenue} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="product" type="category" width={110} tick={{ fontSize: 11 }} />
                <Tooltip formatter={v => '₹' + v.toLocaleString()} />
                <Bar dataKey="revenue" fill="#6366f1" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Revenue Table */}
          <div className="table-card">
            <h3 className="chart-title" style={{ marginBottom: '1rem' }}>Category Revenue Breakdown</h3>
            <table className="data-table">
              <thead><tr><th>Category</th><th>Revenue</th><th>Share</th><th>Progress</th></tr></thead>
              <tbody>
                {categoryRevenue.map(c => {
                  const total = categoryRevenue.reduce((s, x) => s + x.value, 0);
                  const pct   = Math.round((c.value / total) * 100);
                  return (
                    <tr key={c.name}>
                      <td><span className="cat-badge">{c.name}</span></td>
                      <td><strong>₹{c.value.toLocaleString()}</strong></td>
                      <td><strong style={{ color: c.color }}>{pct}%</strong></td>
                      <td style={{ width: 160 }}>
                        <div style={{ height: 8, background: '#f1f5f9', borderRadius: 10, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: pct + '%', background: c.color, borderRadius: 10 }} />
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

      {/* Payment Detail Modal */}
      {viewPayment && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Payment Details — {viewPayment.id}</h3>
              <button onClick={() => setViewPayment(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <span className="status-badge" style={{ background: statusConfig[viewPayment.status].bg, color: statusConfig[viewPayment.status].color, fontSize: '1rem', padding: '6px 20px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  {statusConfig[viewPayment.status].icon} {viewPayment.status}
                </span>
              </div>
              <div className="view-grid">
                <div className="view-item"><span>Order ID</span><strong>{viewPayment.id}</strong></div>
                <div className="view-item"><span>Customer</span><strong>{viewPayment.customer}</strong></div>
                <div className="view-item"><span>Email</span><strong style={{ fontSize: '0.8rem' }}>{viewPayment.email}</strong></div>
                <div className="view-item"><span>Product</span><strong>{viewPayment.product}</strong></div>
                <div className="view-item"><span>Amount</span><strong style={{ color: '#22c55e', fontSize: '1.1rem' }}>₹{viewPayment.amount.toLocaleString()}</strong></div>
                <div className="view-item"><span>Method</span><strong>{viewPayment.method}</strong></div>
                <div className="view-item"><span>Date</span><strong>{viewPayment.date}</strong></div>
                <div className="view-item"><span>Time</span><strong>{viewPayment.time}</strong></div>
                {viewPayment.reason && (
                  <div className="view-item" style={{ gridColumn: 'span 2' }}>
                    <span>Failure Reason</span>
                    <strong style={{ color: '#ef4444' }}>❌ {viewPayment.reason}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
