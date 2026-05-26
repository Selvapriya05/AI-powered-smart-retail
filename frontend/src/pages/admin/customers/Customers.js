import React, { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Search, Eye, Lock, Unlock, X } from 'lucide-react';
import toast from 'react-hot-toast';

const initCustomers = [
  { id: 1, name: 'Priya R', email: 'priya@gmail.com', phone: '9876543210', orders: 12, spent: 95000, joined: '2024-01-15', blocked: false },
  { id: 2, name: 'Raj K', email: 'raj@gmail.com', phone: '9876543211', orders: 5, spent: 15000, joined: '2024-02-20', blocked: false },
  { id: 3, name: 'Meena S', email: 'meena@gmail.com', phone: '9876543212', orders: 8, spent: 22000, joined: '2024-03-10', blocked: true },
  { id: 4, name: 'Arun T', email: 'arun@gmail.com', phone: '9876543213', orders: 3, spent: 60000, joined: '2024-04-05', blocked: false },
  { id: 5, name: 'Divya M', email: 'divya@gmail.com', phone: '9876543214', orders: 20, spent: 45000, joined: '2024-01-01', blocked: false },
];

export default function Customers() {
  const [customers, setCustomers] = useState(initCustomers);
  const [search, setSearch] = useState('');
  const [viewCustomer, setViewCustomer] = useState(null);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const toggleBlock = (id) => {
    setCustomers(customers.map(c => {
      if (c.id === id) {
        toast.success(c.blocked ? 'Customer unblocked!' : 'Customer blocked!');
        return { ...c, blocked: !c.blocked };
      }
      return c;
    }));
  };

  return (
    <AdminLayout title="Customer Management">
      <div className="toolbar">
        <div className="search-box">
          <Search size={16} />
          <input placeholder="Search by name, email, phone..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="mini-stats">
        <div className="mini-stat"><span>Total Customers</span><strong>{customers.length}</strong></div>
        <div className="mini-stat green"><span>Active</span><strong>{customers.filter(c => !c.blocked).length}</strong></div>
        <div className="mini-stat red"><span>Blocked</span><strong>{customers.filter(c => c.blocked).length}</strong></div>
        <div className="mini-stat blue"><span>Total Revenue</span><strong>₹{customers.reduce((s, c) => s + c.spent, 0).toLocaleString()}</strong></div>
      </div>

      <div className="table-card" style={{ marginTop: '1rem' }}>
        <table className="data-table">
          <thead>
            <tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Orders</th><th>Total Spent</th><th>Joined</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={c.id}>
                <td>{i + 1}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="sidebar-avatar" style={{ width: 32, height: 32, fontSize: '0.85rem' }}>{c.name.charAt(0)}</div>
                    <strong>{c.name}</strong>
                  </div>
                </td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>{c.orders}</td>
                <td><strong>₹{c.spent.toLocaleString()}</strong></td>
                <td>{c.joined}</td>
                <td><span className={`status-badge ${c.blocked ? 'badge-red' : 'badge-green'}`}>{c.blocked ? 'Blocked' : 'Active'}</span></td>
                <td>
                  <div className="action-btns">
                    <button className="icon-btn blue" onClick={() => setViewCustomer(c)}><Eye size={15} /></button>
                    <button className={`icon-btn ${c.blocked ? 'green' : 'red'}`} onClick={() => toggleBlock(c.id)}>
                      {c.blocked ? <Unlock size={15} /> : <Lock size={15} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewCustomer && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Customer Details</h3>
              <button onClick={() => setViewCustomer(null)}><X size={20} /></button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <div className="sidebar-avatar" style={{ width: 64, height: 64, fontSize: '1.5rem', margin: '0 auto 1rem' }}>{viewCustomer.name.charAt(0)}</div>
              <h2>{viewCustomer.name}</h2>
              <p style={{ color: '#64748b', marginBottom: '1rem' }}>{viewCustomer.email}</p>
              <div className="view-grid">
                <div className="view-item"><span>Phone</span><strong>{viewCustomer.phone}</strong></div>
                <div className="view-item"><span>Total Orders</span><strong>{viewCustomer.orders}</strong></div>
                <div className="view-item"><span>Total Spent</span><strong>₹{viewCustomer.spent.toLocaleString()}</strong></div>
                <div className="view-item"><span>Joined</span><strong>{viewCustomer.joined}</strong></div>
                <div className="view-item"><span>Status</span><strong style={{ color: viewCustomer.blocked ? '#ef4444' : '#22c55e' }}>{viewCustomer.blocked ? 'Blocked' : 'Active'}</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
