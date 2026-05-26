import React, { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import {
  Package, Truck, CheckCircle, Clock, AlertTriangle,
  Search, Eye, X, MapPin, RefreshCw, Bell
} from 'lucide-react';
import toast from 'react-hot-toast';

const DISPATCH_STEPS = [
  'Order Received',
  'Packing',
  'Dispatched',
  'Out for Delivery',
  'Delivered',
];

const TRACKING_STEPS = [
  { label: 'Warehouse',       icon: '🏭' },
  { label: 'Delivery Hub',    icon: '📦' },
  { label: 'Out for Delivery',icon: '🚚' },
  { label: 'Delivered',       icon: '✅' },
];

const today = new Date();
const daysAgo = (n) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
};
const daysFromNow = (n) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
};

const INIT_ORDERS = [
  { id: '#ORD001', customer: 'Priya R',   phone: '9876543210', product: 'iPhone 15',      address: '12, MG Road, Chennai',       status: 'Delivered',       orderDate: daysAgo(5),  expectedDate: daysAgo(3),  deliveredDate: daysAgo(3),  agent: 'Rajan K',   tracking: 3 },
  { id: '#ORD002', customer: 'Rahul K',   phone: '9876543211', product: 'Nike T-Shirt',   address: '45, Anna Nagar, Chennai',    status: 'Out for Delivery',orderDate: daysAgo(2),  expectedDate: daysFromNow(0), deliveredDate: null,       agent: 'Suresh M',  tracking: 2 },
  { id: '#ORD003', customer: 'Arun T',    phone: '9876543212', product: 'Basmati Rice',   address: '78, T Nagar, Chennai',       status: 'Dispatched',      orderDate: daysAgo(3),  expectedDate: daysFromNow(1), deliveredDate: null,       agent: 'Vijay P',   tracking: 1 },
  { id: '#ORD004', customer: 'Meena S',   phone: '9876543213', product: 'Laptop',         address: '23, Velachery, Chennai',     status: 'Packing',         orderDate: daysAgo(1),  expectedDate: daysFromNow(2), deliveredDate: null,       agent: 'Karthik R', tracking: 0 },
  { id: '#ORD005', customer: 'Divya M',   phone: '9876543214', product: 'Olive Oil',      address: '56, Adyar, Chennai',         status: 'Order Received',  orderDate: daysAgo(0),  expectedDate: daysFromNow(3), deliveredDate: null,       agent: 'Pending',   tracking: 0 },
  { id: '#ORD006', customer: 'Kumar P',   phone: '9876543215', product: 'Wireless Earbuds','address': '90, Porur, Chennai',      status: 'Out for Delivery',orderDate: daysAgo(6),  expectedDate: daysAgo(3),  deliveredDate: null,       agent: 'Rajan K',   tracking: 2 },
  { id: '#ORD007', customer: 'Sita R',    phone: '9876543216', product: 'Denim Jeans',    address: '34, Tambaram, Chennai',      status: 'Dispatched',      orderDate: daysAgo(5),  expectedDate: daysAgo(2),  deliveredDate: null,       agent: 'Suresh M',  tracking: 1 },
  { id: '#ORD008', customer: 'Vijay N',   phone: '9876543217', product: 'Milk 1L',        address: '67, Chromepet, Chennai',     status: 'Delivered',       orderDate: daysAgo(4),  expectedDate: daysAgo(2),  deliveredDate: daysAgo(2),  agent: 'Vijay P',   tracking: 3 },
];

const statusConfig = {
  'Order Received':   { color: '#64748b', bg: '#f8fafc', icon: <Package size={14} />,      step: 0 },
  'Packing':          { color: '#3b82f6', bg: '#eff6ff', icon: <Package size={14} />,      step: 1 },
  'Dispatched':       { color: '#8b5cf6', bg: '#f5f3ff', icon: <Truck size={14} />,        step: 2 },
  'Out for Delivery': { color: '#f97316', bg: '#fff7ed', icon: <Truck size={14} />,        step: 3 },
  'Delivered':        { color: '#22c55e', bg: '#f0fdf4', icon: <CheckCircle size={14} />,  step: 4 },
};

const isDelayed = (order) => {
  if (order.status === 'Delivered') return false;
  return new Date(order.expectedDate) < today;
};

export default function Delivery() {
  const [orders, setOrders]       = useState(INIT_ORDERS);
  const [tab, setTab]             = useState('dispatch');
  const [search, setSearch]       = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [viewOrder, setViewOrder] = useState(null);

  const delayed = orders.filter(isDelayed);

  const filtered = orders.filter(o =>
    (filterStatus === 'All' || o.status === filterStatus) &&
    (o.id.toLowerCase().includes(search.toLowerCase()) ||
     o.customer.toLowerCase().includes(search.toLowerCase()) ||
     o.product.toLowerCase().includes(search.toLowerCase()))
  );

  const updateStatus = (id, status) => {
    setOrders(orders.map(o => {
      if (o.id !== id) return o;
      const step = statusConfig[status].step;
      const trackingStep = step <= 1 ? 0 : step === 2 ? 1 : step === 3 ? 2 : 3;
      const deliveredDate = status === 'Delivered' ? today.toISOString().split('T')[0] : o.deliveredDate;
      return { ...o, status, tracking: trackingStep, deliveredDate };
    }));
    toast.success(`Status updated to "${status}"`);
    if (viewOrder?.id === id) setViewOrder(prev => ({ ...prev, status }));
  };

  const statusCounts = DISPATCH_STEPS.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length;
    return acc;
  }, {});

  return (
    <AdminLayout title="Delivery Management">

      {/* Delayed Alerts */}
      {delayed.length > 0 && (
        <div className="alert-box" style={{ marginBottom: '1.25rem', background: '#fff5f5', borderColor: '#fecaca', color: '#991b1b' }}>
          <Bell size={18} color="#ef4444" />
          <div>
            <strong>{delayed.length} Delayed Order{delayed.length > 1 ? 's' : ''}!</strong>
            <span style={{ marginLeft: 8, fontSize: '0.85rem' }}>
              {delayed.map(o => `${o.id} (${o.customer})`).join(' • ')}
            </span>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mini-stats" style={{ marginBottom: '1.25rem' }}>
        {DISPATCH_STEPS.map(s => (
          <div key={s} className="mini-stat">
            <span style={{ fontSize: '0.7rem' }}>{s}</span>
            <strong style={{ color: statusConfig[s].color }}>{statusCounts[s]}</strong>
          </div>
        ))}
        <div className="mini-stat red">
          <span>⚠️ Delayed</span>
          <strong>{delayed.length}</strong>
        </div>
      </div>

      {/* Tabs */}
      <div className="filter-tabs" style={{ marginBottom: '1.25rem' }}>
        {[
          { id: 'dispatch',  label: '📦 Dispatch Status' },
          { id: 'tracking',  label: '🚚 Delivery Tracking' },
          { id: 'delayed',   label: `⚠️ Delayed Alerts (${delayed.length})` },
        ].map(t => (
          <button key={t.id} className={`filter-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ===== DISPATCH STATUS TAB ===== */}
      {tab === 'dispatch' && (
        <>
          <div className="toolbar">
            <div className="search-box">
              <Search size={16} />
              <input placeholder="Search order, customer, product..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="filter-tabs">
              {['All', ...DISPATCH_STEPS].map(s => (
                <button key={s} className={`filter-tab ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="table-card" style={{ marginTop: '1rem' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th><th>Customer</th><th>Product</th>
                  <th>Order Date</th><th>Expected</th><th>Agent</th>
                  <th>Status</th><th>Update</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => (
                  <tr key={o.id} style={{ background: isDelayed(o) ? '#fff5f5' : 'white' }}>
                    <td>
                      <span className="order-id">{o.id}</span>
                      {isDelayed(o) && <span style={{ marginLeft: 4, fontSize: '0.7rem', color: '#ef4444', fontWeight: 700 }}>⚠️ DELAYED</span>}
                    </td>
                    <td>
                      <p style={{ fontWeight: 600, fontSize: '0.85rem', margin: 0 }}>{o.customer}</p>
                      <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0 }}>{o.phone}</p>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{o.product}</td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{o.orderDate}</td>
                    <td style={{ fontSize: '0.8rem', color: isDelayed(o) ? '#ef4444' : '#64748b', fontWeight: isDelayed(o) ? 700 : 400 }}>
                      {o.expectedDate}
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>{o.agent}</td>
                    <td>
                      <span className="status-badge" style={{ background: statusConfig[o.status].bg, color: statusConfig[o.status].color, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        {statusConfig[o.status].icon} {o.status}
                      </span>
                    </td>
                    <td>
                      {o.status !== 'Delivered' && (
                        <select
                          className="status-select"
                          value={o.status}
                          style={{ color: statusConfig[o.status].color, fontSize: '0.78rem' }}
                          onChange={e => updateStatus(o.id, e.target.value)}
                        >
                          {DISPATCH_STEPS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      )}
                      {o.status === 'Delivered' && <span style={{ color: '#22c55e', fontSize: '0.82rem', fontWeight: 700 }}>✅ Done</span>}
                    </td>
                    <td>
                      <button className="icon-btn blue" onClick={() => setViewOrder(o)}><Eye size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ===== DELIVERY TRACKING TAB ===== */}
      {tab === 'tracking' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.filter(o => o.status !== 'Delivered').map(o => (
            <div key={o.id} className="tracking-card">
              <div className="tracking-card-header">
                <div>
                  <span className="order-id">{o.id}</span>
                  <span style={{ marginLeft: 10, fontSize: '0.85rem', color: '#1e293b', fontWeight: 600 }}>{o.product}</span>
                  {isDelayed(o) && <span style={{ marginLeft: 8, fontSize: '0.72rem', color: '#ef4444', fontWeight: 700, background: '#fff5f5', padding: '2px 8px', borderRadius: 20 }}>⚠️ DELAYED</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{o.customer} • {o.agent}</span>
                  <span className="status-badge" style={{ background: statusConfig[o.status].bg, color: statusConfig[o.status].color }}>
                    {o.status}
                  </span>
                </div>
              </div>

              {/* Tracking Steps */}
              <div className="delivery-tracking-steps">
                {TRACKING_STEPS.map((step, i) => {
                  const done    = i <= o.tracking;
                  const current = i === o.tracking;
                  return (
                    <div key={step.label} className="delivery-step">
                      <div className={`delivery-dot ${done ? 'done' : ''} ${current ? 'current' : ''}`}>
                        {done ? '✓' : step.icon}
                      </div>
                      <span className={`delivery-label ${done ? 'done' : ''}`}>{step.label}</span>
                      {i < TRACKING_STEPS.length - 1 && (
                        <div className={`delivery-line ${i < o.tracking ? 'done' : ''}`} />
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: '0.78rem', color: '#64748b' }}>
                <span><MapPin size={12} style={{ display: 'inline' }} /> {o.address}</span>
                <span>Expected: <strong style={{ color: isDelayed(o) ? '#ef4444' : '#1e293b' }}>{o.expectedDate}</strong></span>
              </div>
            </div>
          ))}

          {orders.filter(o => o.status !== 'Delivered').length === 0 && (
            <div className="empty-state">
              <CheckCircle size={56} color="#22c55e" />
              <h3>All orders delivered!</h3>
            </div>
          )}
        </div>
      )}

      {/* ===== DELAYED ALERTS TAB ===== */}
      {tab === 'delayed' && (
        <>
          {delayed.length === 0 ? (
            <div className="empty-state">
              <CheckCircle size={56} color="#22c55e" />
              <h3>No delayed orders!</h3>
              <p>All deliveries are on time.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {delayed.map(o => {
                const daysDiff = Math.floor((today - new Date(o.expectedDate)) / (1000 * 60 * 60 * 24));
                return (
                  <div key={o.id} className="delayed-card">
                    <div className="delayed-card-left">
                      <AlertTriangle size={28} color="#ef4444" />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span className="order-id">{o.id}</span>
                          <span style={{ fontWeight: 700, color: '#1e293b' }}>{o.product}</span>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                          Customer: <strong>{o.customer}</strong> • {o.phone}
                        </p>
                        <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '2px 0 0' }}>
                          <MapPin size={12} style={{ display: 'inline' }} /> {o.address}
                        </p>
                      </div>
                    </div>
                    <div className="delayed-card-right">
                      <div style={{ textAlign: 'right', marginBottom: 8 }}>
                        <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>Expected: {o.expectedDate}</p>
                        <p style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 700, margin: 0 }}>
                          ⚠️ {daysDiff} day{daysDiff > 1 ? 's' : ''} overdue
                        </p>
                        <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>Agent: {o.agent}</p>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <select
                          className="status-select"
                          value={o.status}
                          style={{ color: statusConfig[o.status].color, fontSize: '0.78rem' }}
                          onChange={e => updateStatus(o.id, e.target.value)}
                        >
                          {DISPATCH_STEPS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button className="icon-btn blue" onClick={() => setViewOrder(o)}><Eye size={15} /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Order Detail Modal */}
      {viewOrder && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Delivery Details — {viewOrder.id}</h3>
              <button onClick={() => setViewOrder(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="view-grid">
                <div className="view-item"><span>Customer</span><strong>{viewOrder.customer}</strong></div>
                <div className="view-item"><span>Phone</span><strong>{viewOrder.phone}</strong></div>
                <div className="view-item"><span>Product</span><strong>{viewOrder.product}</strong></div>
                <div className="view-item"><span>Delivery Agent</span><strong>{viewOrder.agent}</strong></div>
                <div className="view-item"><span>Order Date</span><strong>{viewOrder.orderDate}</strong></div>
                <div className="view-item"><span>Expected Date</span><strong style={{ color: isDelayed(viewOrder) ? '#ef4444' : '#22c55e' }}>{viewOrder.expectedDate}</strong></div>
                {viewOrder.deliveredDate && <div className="view-item"><span>Delivered On</span><strong style={{ color: '#22c55e' }}>{viewOrder.deliveredDate}</strong></div>}
                <div className="view-item" style={{ gridColumn: 'span 2' }}><span>Address</span><strong>{viewOrder.address}</strong></div>
              </div>

              {/* Tracking in modal */}
              <div style={{ marginTop: '1.25rem' }}>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 12 }}>Tracking Progress</p>
                <div className="delivery-tracking-steps">
                  {TRACKING_STEPS.map((step, i) => {
                    const done    = i <= viewOrder.tracking;
                    const current = i === viewOrder.tracking;
                    return (
                      <div key={step.label} className="delivery-step">
                        <div className={`delivery-dot ${done ? 'done' : ''} ${current ? 'current' : ''}`}>
                          {done ? '✓' : step.icon}
                        </div>
                        <span className={`delivery-label ${done ? 'done' : ''}`}>{step.label}</span>
                        {i < TRACKING_STEPS.length - 1 && (
                          <div className={`delivery-line ${i < viewOrder.tracking ? 'done' : ''}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Update status */}
              {viewOrder.status !== 'Delivered' && (
                <div className="form-group" style={{ marginTop: '1.25rem' }}>
                  <label>Update Status</label>
                  <select className="form-input" value={viewOrder.status}
                    onChange={e => updateStatus(viewOrder.id, e.target.value)}>
                    {DISPATCH_STEPS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
