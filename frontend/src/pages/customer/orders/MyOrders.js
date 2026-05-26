import React, { useState, useEffect } from 'react';
import CustomerLayout from '../../../components/customer/CustomerLayout';
import {
  Package, X, ChevronDown, ChevronUp, Truck, CheckCircle,
  Clock, XCircle, Bell, Brain, MapPin, Calendar, AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

const STEPS = [
  { label: 'Order Placed',     icon: '📋', color: '#6366f1' },
  { label: 'Packed',           icon: '📦', color: '#3b82f6' },
  { label: 'Shipped',          icon: '🚚', color: '#8b5cf6' },
  { label: 'Out for Delivery', icon: '🛵', color: '#f97316' },
  { label: 'Delivered',        icon: '✅', color: '#22c55e' },
];

const statusColor = {
  'Order Placed':     '#6366f1',
  Packed:             '#3b82f6',
  Shipped:            '#8b5cf6',
  'Out for Delivery': '#f97316',
  Delivered:          '#22c55e',
  Cancelled:          '#ef4444',
};

const statusIcon = {
  'Order Placed':     <Clock size={16} />,
  Packed:             <Package size={16} />,
  Shipped:            <Truck size={16} />,
  'Out for Delivery': <Truck size={16} />,
  Delivered:          <CheckCircle size={16} />,
  Cancelled:          <XCircle size={16} />,
};

const addDays = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const DEFAULT_ORDERS = [
  {
    id: '#ORD001',
    items: [{ name: 'iPhone 15', image: '📱', qty: 1, price: 79999 }],
    total: 94399, status: 'Delivered', date: '2026-05-01', method: 'UPI',
    estimatedDelivery: addDays(-2), deliveredOn: addDays(-2),
    address: '12, MG Road, Chennai - 600001',
    agent: 'Rajan K', agentPhone: '9876543210',
    stepIndex: 4, delayed: false,
  },
  {
    id: '#ORD002',
    items: [{ name: 'Nike Shoes', image: '👟', qty: 2, price: 3999 }],
    total: 9438, status: 'Out for Delivery', date: '2026-05-05', method: 'CARD',
    estimatedDelivery: addDays(0), deliveredOn: null,
    address: '45, Anna Nagar, Chennai - 600040',
    agent: 'Suresh M', agentPhone: '9876543211',
    stepIndex: 3, delayed: false,
  },
  {
    id: '#ORD003',
    items: [{ name: 'Basmati Rice', image: '🌾', qty: 3, price: 600 }],
    total: 2124, status: 'Shipped', date: '2026-05-04', method: 'COD',
    estimatedDelivery: addDays(1), deliveredOn: null,
    address: '78, T Nagar, Chennai - 600017',
    agent: 'Vijay P', agentPhone: '9876543212',
    stepIndex: 2, delayed: false,
  },
  {
    id: '#ORD004',
    items: [{ name: 'Wireless Earbuds', image: '🎧', qty: 1, price: 2499 }],
    total: 2949, status: 'Packed', date: '2026-05-06', method: 'UPI',
    estimatedDelivery: addDays(2), deliveredOn: null,
    address: '23, Velachery, Chennai - 600042',
    agent: 'Karthik R', agentPhone: '9876543213',
    stepIndex: 1, delayed: false,
  },
  {
    id: '#ORD005',
    items: [{ name: 'Laptop', image: '💻', qty: 1, price: 55000 }],
    total: 64900, status: 'Shipped', date: '2026-05-02', method: 'CARD',
    estimatedDelivery: addDays(-1), deliveredOn: null,
    address: '56, Adyar, Chennai - 600020',
    agent: 'Rajan K', agentPhone: '9876543210',
    stepIndex: 2, delayed: true,
  },
];

const AI_PREDICTIONS = [
  { icon: '🚦', message: 'Heavy traffic on OMR Road may delay orders in Velachery area by 2-3 hours today.', severity: 'warning' },
  { icon: '🌧️', message: 'Rain forecast in Chennai tomorrow. Orders in T Nagar may face 1-day delay.', severity: 'info' },
  { icon: '✅', message: 'Orders in Anna Nagar are being delivered on time. No delays expected.', severity: 'success' },
];

const NOTIFICATIONS = [
  { id: 1, orderId: '#ORD002', message: 'Your order is Out for Delivery! Expected by today.', time: '10:30 AM', read: false, icon: '🛵' },
  { id: 2, orderId: '#ORD003', message: 'Your order has been Shipped! Tracking ID: TRK123456', time: 'Yesterday', read: false, icon: '🚚' },
  { id: 3, orderId: '#ORD004', message: 'Your order is Packed and ready for dispatch.', time: 'Yesterday', read: true, icon: '📦' },
  { id: 4, orderId: '#ORD001', message: 'Your order has been Delivered! Enjoy your purchase.', time: '2 days ago', read: true, icon: '✅' },
];

export default function MyOrders({ orders, setOrders, cartCount, wishlistCount }) {
  const [tab, setTab]           = useState('orders');
  const [expanded, setExpanded] = useState(null);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const allOrders = [...orders, ...DEFAULT_ORDERS];
  const unreadCount = notifications.filter(n => !n.read).length;

  // Show notification toast on mount for active orders
  useEffect(() => {
    const active = allOrders.find(o => o.status === 'Out for Delivery');
    if (active) {
      setTimeout(() => toast(`🛵 ${active.id} is Out for Delivery!`, { icon: '📦', duration: 4000 }), 1000);
    }
  }, []);

  const cancelOrder = (id) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Cancelled', stepIndex: -1 } : o));
    toast.success('Order cancelled!');
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  return (
    <CustomerLayout title="My Orders" cartCount={cartCount} wishlistCount={wishlistCount}>

      {/* Tabs */}
      <div className="filter-tabs" style={{ marginBottom: '1.25rem' }}>
        {[
          { id: 'orders',        label: '📦 My Orders' },
          { id: 'notifications', label: `🔔 Notifications ${unreadCount > 0 ? `(${unreadCount})` : ''}` },
          { id: 'ai',            label: '🤖 AI Predictions' },
        ].map(t => (
          <button key={t.id} className={`filter-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ===== ORDERS TAB ===== */}
      {tab === 'orders' && (
        <>
          {/* Stats */}
          <div className="mini-stats" style={{ marginBottom: '1rem' }}>
            {['Order Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map(s => (
              <div key={s} className="mini-stat">
                <span style={{ fontSize: '0.68rem' }}>{s}</span>
                <strong style={{ color: statusColor[s] }}>{allOrders.filter(o => o.status === s).length}</strong>
              </div>
            ))}
          </div>

          {allOrders.length === 0 ? (
            <div className="empty-state"><Package size={64} color="#c7d2fe" /><h3>No orders yet</h3></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {allOrders.map(order => (
                <div key={order.id} className="order-card" style={{ border: order.delayed ? '2px solid #fecaca' : '1.5px solid #f1f5f9' }}>

                  {/* Header */}
                  <div className="order-card-header" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ color: statusColor[order.status] }}>{statusIcon[order.status]}</span>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <p style={{ fontWeight: 700, color: '#1e293b', margin: 0 }}>{order.id}</p>
                          {order.delayed && <span style={{ fontSize: '0.7rem', background: '#fff5f5', color: '#ef4444', fontWeight: 700, padding: '1px 8px', borderRadius: 20 }}>⚠️ Delayed</span>}
                        </div>
                        <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>{order.date} · {order.method}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className="status-badge" style={{ background: statusColor[order.status] + '20', color: statusColor[order.status] }}>
                        {order.status}
                      </span>
                      <strong>₹{order.total.toLocaleString()}</strong>
                      {expanded === order.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>

                  {/* Expanded Body */}
                  {expanded === order.id && (
                    <div className="order-card-body">

                      {/* Items */}
                      {order.items.map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: 10, padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                          <span style={{ fontSize: '1.5rem' }}>{item.image}</span>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: 600, fontSize: '0.875rem', margin: 0 }}>{item.name}</p>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>Qty: {item.qty} × ₹{item.price.toLocaleString()}</p>
                          </div>
                          <strong>₹{(item.qty * item.price).toLocaleString()}</strong>
                        </div>
                      ))}

                      {/* Delivery Info */}
                      {order.status !== 'Cancelled' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '1rem 0', background: '#f8fafc', borderRadius: 10, padding: '0.75rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Calendar size={16} color="#6366f1" />
                            <div>
                              <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0 }}>
                                {order.status === 'Delivered' ? 'Delivered On' : 'Estimated Delivery'}
                              </p>
                              <p style={{ fontWeight: 700, fontSize: '0.85rem', color: order.delayed ? '#ef4444' : '#22c55e', margin: 0 }}>
                                {order.deliveredOn || order.estimatedDelivery}
                              </p>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <MapPin size={16} color="#6366f1" />
                            <div>
                              <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0 }}>Delivery Address</p>
                              <p style={{ fontWeight: 600, fontSize: '0.78rem', color: '#1e293b', margin: 0 }}>{order.address}</p>
                            </div>
                          </div>
                          {order.agent && order.agent !== 'Pending' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <Truck size={16} color="#6366f1" />
                              <div>
                                <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0 }}>Delivery Agent</p>
                                <p style={{ fontWeight: 600, fontSize: '0.82rem', color: '#1e293b', margin: 0 }}>{order.agent} · {order.agentPhone}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tracking Steps */}
                      {order.status !== 'Cancelled' && (
                        <div style={{ marginTop: '0.75rem' }}>
                          <p style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '1rem' }}>📍 Live Order Tracking</p>
                          <div className="order-tracking-steps">
                            {STEPS.map((step, i) => {
                              const done    = i <= (order.stepIndex ?? 0);
                              const current = i === (order.stepIndex ?? 0);
                              return (
                                <div key={step.label} className="order-track-step">
                                  <div className={`order-track-dot ${done ? 'done' : ''} ${current ? 'current' : ''}`}
                                    style={done ? { background: step.color, borderColor: step.color } : {}}>
                                    {done ? (current ? step.icon : '✓') : step.icon}
                                  </div>
                                  <span className={`order-track-label ${done ? 'done' : ''}`}
                                    style={current ? { color: step.color, fontWeight: 700 } : {}}>
                                    {step.label}
                                  </span>
                                  {i < STEPS.length - 1 && (
                                    <div className={`order-track-line ${i < (order.stepIndex ?? 0) ? 'done' : ''}`}
                                      style={i < (order.stepIndex ?? 0) ? { background: step.color } : {}} />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Cancel Button */}
                      {(order.status === 'Order Placed' || order.status === 'Packed') && orders.find(o => o.id === order.id) && (
                        <button className="btn-cancel-order" onClick={() => cancelOrder(order.id)}>
                          <X size={15} /> Cancel Order
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ===== NOTIFICATIONS TAB ===== */}
      {tab === 'notifications' && (
        <>
          <div className="toolbar">
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{unreadCount} unread notifications</p>
            {unreadCount > 0 && (
              <button className="btn-add" style={{ background: '#f1f5f9', color: '#64748b' }} onClick={markAllRead}>
                Mark all as read
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {notifications.map(n => (
              <div key={n.id} className={`notification-card ${!n.read ? 'unread' : ''}`}
                onClick={() => setNotifications(notifications.map(x => x.id === n.id ? { ...x, read: true } : x))}>
                <div className="notif-icon">{n.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <p style={{ fontWeight: n.read ? 500 : 700, color: '#1e293b', margin: 0, fontSize: '0.875rem' }}>{n.message}</p>
                    {!n.read && <span style={{ width: 8, height: 8, background: '#6366f1', borderRadius: '50%', flexShrink: 0, marginLeft: 8, marginTop: 4 }} />}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '3px 0 0' }}>
                    <span className="order-id" style={{ fontSize: '0.75rem' }}>{n.orderId}</span> · {n.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ===== AI PREDICTIONS TAB ===== */}
      {tab === 'ai' && (
        <>
          <div style={{ background: 'linear-gradient(135deg,#eef2ff,#f5f3ff)', border: '1.5px solid #c7d2fe', borderRadius: 14, padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Brain size={28} color="#6366f1" />
            <div>
              <h3 style={{ color: '#4338ca', margin: 0 }}>AI Delivery Predictions</h3>
              <p style={{ color: '#6366f1', margin: 0, fontSize: '0.85rem' }}>Smart predictions based on traffic, weather & delivery patterns</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {AI_PREDICTIONS.map((p, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                background: 'white', borderRadius: 14, padding: '1.25rem',
                borderLeft: `4px solid ${p.severity === 'warning' ? '#f97316' : p.severity === 'success' ? '#22c55e' : '#3b82f6'}`,
                boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
              }}>
                <span style={{ fontSize: '1.75rem' }}>{p.icon}</span>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>{p.message}</p>
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 700, marginTop: 4, display: 'inline-block',
                    padding: '2px 8px', borderRadius: 20,
                    background: p.severity === 'warning' ? '#fff7ed' : p.severity === 'success' ? '#f0fdf4' : '#eff6ff',
                    color: p.severity === 'warning' ? '#f97316' : p.severity === 'success' ? '#22c55e' : '#3b82f6',
                  }}>
                    {p.severity === 'warning' ? '⚠️ Warning' : p.severity === 'success' ? '✅ On Track' : 'ℹ️ Info'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Delayed Orders */}
          {allOrders.filter(o => o.delayed).length > 0 && (
            <div className="table-card">
              <h3 className="chart-title" style={{ color: '#ef4444', marginBottom: '1rem' }}>
                <AlertTriangle size={18} /> Your Delayed Orders
              </h3>
              {allOrders.filter(o => o.delayed).map(o => (
                <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#fff5f5', borderRadius: 10, marginBottom: 8 }}>
                  <div>
                    <span className="order-id">{o.id}</span>
                    <span style={{ marginLeft: 8, fontSize: '0.85rem', color: '#1e293b' }}>{o.items[0]?.name}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: 700, margin: 0 }}>⚠️ Expected: {o.estimatedDelivery}</p>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>Status: {o.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </CustomerLayout>
  );
}
