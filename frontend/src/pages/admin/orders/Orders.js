import React, { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Search, Eye, X } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const statusColor = { Pending: '#f97316', Processing: '#3b82f6', Shipped: '#8b5cf6', Delivered: '#22c55e', Cancelled: '#ef4444' };

const initOrders = [
  { id: '#ORD001', customer: 'Priya R', email: 'priya@gmail.com', product: 'iPhone 15', qty: 1, amount: 79999, status: 'Delivered', date: '2024-05-01' },
  { id: '#ORD002', customer: 'Raj K', email: 'raj@gmail.com', product: 'Nike Shoes', qty: 2, amount: 9998, status: 'Pending', date: '2024-05-03' },
  { id: '#ORD003', customer: 'Meena S', email: 'meena@gmail.com', product: 'Rice 10kg', qty: 3, amount: 2550, status: 'Processing', date: '2024-05-04' },
  { id: '#ORD004', customer: 'Arun T', email: 'arun@gmail.com', product: 'Laptop', qty: 1, amount: 55000, status: 'Shipped', date: '2024-05-05' },
  { id: '#ORD005', customer: 'Divya M', email: 'divya@gmail.com', product: 'T-Shirt', qty: 3, amount: 1797, status: 'Delivered', date: '2024-05-06' },
  { id: '#ORD006', customer: 'Kumar P', email: 'kumar@gmail.com', product: 'Olive Oil', qty: 2, amount: 900, status: 'Cancelled', date: '2024-05-02' },
];

export default function Orders() {
  const [orders, setOrders] = useState(initOrders);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [viewOrder, setViewOrder] = useState(null);

  const filtered = orders.filter(o =>
    (filterStatus === 'All' || o.status === filterStatus) &&
    (o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase()))
  );

  const updateStatus = (id, status) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
    toast.success('Order status updated!');
  };

  const cancelOrder = (id) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'Cancelled' } : o));
    toast.success('Order cancelled!');
  };

  return (
    <AdminLayout title="Order Management">
      <div className="toolbar">
        <div className="search-box">
          <Search size={16} />
          <input placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-tabs">
          {['All', ...STATUSES].map(s => (
            <button key={s} className={`filter-tab ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>{s}</button>
          ))}
        </div>
      </div>

      <div className="mini-stats">
        {STATUSES.map(s => (
          <div key={s} className="mini-stat"><span>{s}</span><strong style={{ color: statusColor[s] }}>{orders.filter(o => o.status === s).length}</strong></div>
        ))}
      </div>

      <div className="table-card" style={{ marginTop: '1rem' }}>
        <table className="data-table">
          <thead>
            <tr><th>Order ID</th><th>Customer</th><th>Product</th><th>Qty</th><th>Amount</th><th>Date</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id}>
                <td className="order-id">{o.id}</td>
                <td>{o.customer}</td>
                <td>{o.product}</td>
                <td>{o.qty}</td>
                <td><strong>₹{o.amount.toLocaleString()}</strong></td>
                <td>{o.date}</td>
                <td>
                  <select
                    className="status-select"
                    value={o.status}
                    style={{ color: statusColor[o.status] }}
                    onChange={e => updateStatus(o.id, e.target.value)}
                    disabled={o.status === 'Cancelled'}
                  >
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td>
                  <div className="action-btns">
                    <button className="icon-btn blue" onClick={() => setViewOrder(o)}><Eye size={15} /></button>
                    {o.status !== 'Cancelled' && o.status !== 'Delivered' &&
                      <button className="icon-btn red" onClick={() => cancelOrder(o.id)}><X size={15} /></button>
                    }
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewOrder && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Order Details — {viewOrder.id}</h3>
              <button onClick={() => setViewOrder(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="view-grid">
                <div className="view-item"><span>Customer</span><strong>{viewOrder.customer}</strong></div>
                <div className="view-item"><span>Email</span><strong>{viewOrder.email}</strong></div>
                <div className="view-item"><span>Product</span><strong>{viewOrder.product}</strong></div>
                <div className="view-item"><span>Quantity</span><strong>{viewOrder.qty}</strong></div>
                <div className="view-item"><span>Amount</span><strong>₹{viewOrder.amount.toLocaleString()}</strong></div>
                <div className="view-item"><span>Date</span><strong>{viewOrder.date}</strong></div>
                <div className="view-item"><span>Status</span><strong style={{ color: statusColor[viewOrder.status] }}>{viewOrder.status}</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
