import React, { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import {
  Plus, Edit2, Trash2, Eye, Search, X, Phone, Mail,
  MapPin, Package, ShoppingBag, Brain, AlertTriangle, Save
} from 'lucide-react';
import toast from 'react-hot-toast';

const INIT_SUPPLIERS = [
  {
    id: 1,
    name: 'Kumar Raj',
    company: 'Fresh Foods Distributor',
    phone: '9876543210',
    email: 'kumar@freshfoods.com',
    address: '12, Market Street, Chennai - 600001',
    products: ['Rice', 'Oil', 'Milk'],
    status: 'Active',
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Ravi Shankar',
    company: 'ABC Electronics Hub',
    phone: '9876500001',
    email: 'ravi@abcelectronics.com',
    address: '45, Anna Nagar, Chennai - 600040',
    products: ['Mobile', 'Laptop', 'Earbuds'],
    status: 'Active',
    rating: 4.5,
  },
  {
    id: 3,
    name: 'Meena Devi',
    company: 'Style Garments Co.',
    phone: '9876500002',
    email: 'meena@stylegarments.com',
    address: '78, T Nagar, Chennai - 600017',
    products: ['T-Shirt', 'Jeans', 'Shoes'],
    status: 'Active',
    rating: 4.3,
  },
  {
    id: 4,
    name: 'Suresh Kumar',
    company: 'Dairy Fresh Pvt Ltd',
    phone: '9876500003',
    email: 'suresh@dairyfresh.com',
    address: '23, Velachery, Chennai - 600042',
    products: ['Milk', 'Curd', 'Butter'],
    status: 'Inactive',
    rating: 3.9,
  },
];

const INIT_PURCHASES = [
  { id: 1, supplierId: 1, supplier: 'Kumar Raj',    company: 'Fresh Foods Distributor', product: 'Basmati Rice', qty: 100, unit: 'Kg',  amount: 12000, date: '2026-05-01', status: 'Received' },
  { id: 2, supplierId: 2, supplier: 'Ravi Shankar', company: 'ABC Electronics Hub',     product: 'iPhone 15',    qty: 20,  unit: 'Nos', amount: 1599980, date: '2026-05-03', status: 'Received' },
  { id: 3, supplierId: 1, supplier: 'Kumar Raj',    company: 'Fresh Foods Distributor', product: 'Olive Oil',    qty: 50,  unit: 'L',   amount: 22500, date: '2026-05-04', status: 'Pending' },
  { id: 4, supplierId: 3, supplier: 'Meena Devi',   company: 'Style Garments Co.',      product: 'Nike T-Shirt', qty: 100, unit: 'Pcs', amount: 99900, date: '2026-05-05', status: 'Received' },
  { id: 5, supplierId: 4, supplier: 'Suresh Kumar', company: 'Dairy Fresh Pvt Ltd',     product: 'Milk 1L',      qty: 200, unit: 'L',   amount: 12000, date: '2026-05-06', status: 'Pending' },
  { id: 6, supplierId: 2, supplier: 'Ravi Shankar', company: 'ABC Electronics Hub',     product: 'Laptop',       qty: 10,  unit: 'Nos', amount: 550000, date: '2026-05-07', status: 'Received' },
];

const AI_SUGGESTIONS = [
  { supplier: 'Kumar Raj',    product: 'Basmati Rice', daysLeft: 3, action: 'Order 100 Kg immediately' },
  { supplier: 'Suresh Kumar', product: 'Milk 1L',      daysLeft: 2, action: 'Order 200 L urgently' },
  { supplier: 'Ravi Shankar', product: 'Earbuds',      daysLeft: 7, action: 'Order 30 Nos this week' },
];

const emptyForm = { name: '', company: '', phone: '', email: '', address: '', products: '', status: 'Active' };
const statusColor = { Received: '#22c55e', Pending: '#f97316', Cancelled: '#ef4444' };

export default function Suppliers() {
  const [suppliers, setSuppliers]   = useState(INIT_SUPPLIERS);
  const [purchases, setPurchases]   = useState(INIT_PURCHASES);
  const [tab, setTab]               = useState('suppliers');
  const [search, setSearch]         = useState('');
  const [showModal, setShowModal]   = useState(false);
  const [showView, setShowView]     = useState(null);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState(emptyForm);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseForm, setPurchaseForm] = useState({ supplierId: '', product: '', qty: '', unit: 'Kg', amount: '', date: new Date().toISOString().split('T')[0], status: 'Pending' });

  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.company.toLowerCase().includes(search.toLowerCase()) ||
    s.products.join(' ').toLowerCase().includes(search.toLowerCase())
  );

  const openAdd  = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (s) => { setEditing(s.id); setForm({ ...s, products: s.products.join(', ') }); setShowModal(true); };

  const handleSave = () => {
    if (!form.name || !form.company || !form.phone) { toast.error('Name, company and phone are required'); return; }
    const productsArr = form.products.split(',').map(p => p.trim()).filter(Boolean);
    if (editing) {
      setSuppliers(suppliers.map(s => s.id === editing ? { ...form, id: editing, products: productsArr } : s));
      toast.success('Supplier updated!');
    } else {
      setSuppliers([...suppliers, { ...form, id: Date.now(), products: productsArr, rating: 4.0 }]);
      toast.success('Supplier added!');
    }
    setShowModal(false);
  };

  const handleDelete = (id) => { setSuppliers(suppliers.filter(s => s.id !== id)); toast.success('Supplier removed!'); };

  const handleAddPurchase = () => {
    if (!purchaseForm.supplierId || !purchaseForm.product || !purchaseForm.qty) { toast.error('Fill all required fields'); return; }
    const sup = suppliers.find(s => s.id === Number(purchaseForm.supplierId));
    setPurchases([...purchases, {
      ...purchaseForm, id: Date.now(),
      supplier: sup?.name || '', company: sup?.company || '',
      qty: Number(purchaseForm.qty), amount: Number(purchaseForm.amount),
    }]);
    setShowPurchaseModal(false);
    toast.success('Purchase record added!');
  };

  return (
    <AdminLayout title="Supplier Management">

      {/* AI Suggestions Banner */}
      <div style={{ background: 'linear-gradient(135deg,#eef2ff,#f5f3ff)', border: '1.5px solid #c7d2fe', borderRadius: 14, padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Brain size={20} color="#6366f1" />
          <strong style={{ color: '#4338ca' }}>AI Reorder Suggestions</strong>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {AI_SUGGESTIONS.map((s, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 10, padding: '0.6rem 1rem', border: '1px solid #e0e7ff', flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <AlertTriangle size={14} color="#f97316" />
                <strong style={{ fontSize: '0.82rem', color: '#1e293b' }}>{s.product}</strong>
                <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700 }}>({s.daysLeft} days left)</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#6366f1', margin: 0 }}>📦 {s.action}</p>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Supplier: {s.supplier}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mini-stats" style={{ marginBottom: '1.25rem' }}>
        <div className="mini-stat"><span>Total Suppliers</span><strong>{suppliers.length}</strong></div>
        <div className="mini-stat green"><span>Active</span><strong>{suppliers.filter(s => s.status === 'Active').length}</strong></div>
        <div className="mini-stat red"><span>Inactive</span><strong>{suppliers.filter(s => s.status === 'Inactive').length}</strong></div>
        <div className="mini-stat blue"><span>Total Purchases</span><strong>{purchases.length}</strong></div>
        <div className="mini-stat blue"><span>Purchase Value</span><strong>₹{purchases.reduce((s, p) => s + p.amount, 0).toLocaleString()}</strong></div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.25rem' }}>
        {[
          { id: 'suppliers', label: '👥 Suppliers' },
          { id: 'purchases', label: '📦 Purchase History' },
        ].map(t => (
          <button key={t.id} className={`filter-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ===== SUPPLIERS TAB ===== */}
      {tab === 'suppliers' && (
        <>
          <div className="toolbar">
            <div className="search-box">
              <Search size={16} />
              <input placeholder="Search by name, company, product..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn-add" onClick={openAdd}><Plus size={16} /> Add Supplier</button>
          </div>

          <div className="supplier-grid">
            {filtered.map(s => (
              <div key={s.id} className="supplier-card">
                <div className="supplier-card-header">
                  <div className="supplier-avatar">{s.name.charAt(0)}</div>
                  <div style={{ flex: 1 }}>
                    <h4 className="supplier-name">{s.name}</h4>
                    <p className="supplier-company">{s.company}</p>
                  </div>
                  <span className={`status-badge ${s.status === 'Active' ? 'badge-green' : 'badge-red'}`}>{s.status}</span>
                </div>

                <div className="supplier-contacts">
                  <div className="supplier-contact-item"><Phone size={13} color="#6366f1" /><span>{s.phone}</span></div>
                  <div className="supplier-contact-item"><Mail size={13} color="#6366f1" /><span>{s.email}</span></div>
                  <div className="supplier-contact-item"><MapPin size={13} color="#6366f1" /><span>{s.address}</span></div>
                </div>

                <div className="supplier-products">
                  <Package size={13} color="#64748b" />
                  {s.products.map(p => <span key={p} className="product-tag">{p}</span>)}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ color: '#f59e0b', fontSize: '0.85rem' }}>★</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>{s.rating}</span>
                  </div>
                  <div className="action-btns">
                    <button className="icon-btn blue"  onClick={() => setShowView(s)}><Eye size={15} /></button>
                    <button className="icon-btn green" onClick={() => openEdit(s)}><Edit2 size={15} /></button>
                    <button className="icon-btn red"   onClick={() => handleDelete(s.id)}><Trash2 size={15} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ===== PURCHASE HISTORY TAB ===== */}
      {tab === 'purchases' && (
        <>
          <div className="toolbar">
            <h3 style={{ color: '#64748b', fontSize: '0.9rem' }}>All purchase records from suppliers</h3>
            <button className="btn-add" onClick={() => setShowPurchaseModal(true)}><Plus size={16} /> Add Purchase</button>
          </div>

          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th><th>Supplier</th><th>Company</th><th>Product</th>
                  <th>Qty</th><th>Amount</th><th>Date</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((p, i) => (
                  <tr key={p.id}>
                    <td>{i + 1}</td>
                    <td><strong>{p.supplier}</strong></td>
                    <td style={{ color: '#64748b', fontSize: '0.82rem' }}>{p.company}</td>
                    <td>{p.product}</td>
                    <td><span className="unit-badge">{p.qty} {p.unit}</span></td>
                    <td><strong>₹{Number(p.amount).toLocaleString()}</strong></td>
                    <td>{p.date}</td>
                    <td>
                      <span className="status-badge" style={{ background: statusColor[p.status] + '20', color: statusColor[p.status] }}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ===== ADD/EDIT SUPPLIER MODAL ===== */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editing ? 'Edit Supplier' : 'Add Supplier'}</h3>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Supplier Name *</label>
                  <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Kumar Raj" />
                </div>
                <div className="form-group">
                  <label>Company Name *</label>
                  <input className="form-input" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="e.g. Fresh Foods Distributor" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="9876543210" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input className="form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="supplier@email.com" />
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <input className="form-input" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Street, City, Pincode" />
              </div>
              <div className="form-group">
                <label>Products Supplied <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>(comma separated)</span></label>
                <input className="form-input" value={form.products} onChange={e => setForm({ ...form, products: e.target.value })} placeholder="e.g. Rice, Oil, Milk" />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select className="form-input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-save" onClick={handleSave}><Save size={15} /> {editing ? 'Update' : 'Add Supplier'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== VIEW SUPPLIER MODAL ===== */}
      {showView && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Supplier Details</h3>
              <button onClick={() => setShowView(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div className="supplier-avatar" style={{ width: 64, height: 64, fontSize: '1.5rem', margin: '0 auto 0.75rem' }}>{showView.name.charAt(0)}</div>
                <h3 style={{ color: '#1e293b' }}>{showView.name}</h3>
                <p style={{ color: '#6366f1', fontWeight: 600 }}>{showView.company}</p>
                <span className={`status-badge ${showView.status === 'Active' ? 'badge-green' : 'badge-red'}`}>{showView.status}</span>
              </div>

              <div className="view-grid">
                <div className="view-item"><span><Phone size={13} /> Phone</span><strong>{showView.phone}</strong></div>
                <div className="view-item"><span><Mail size={13} /> Email</span><strong style={{ fontSize: '0.8rem' }}>{showView.email}</strong></div>
                <div className="view-item" style={{ gridColumn: 'span 2' }}><span><MapPin size={13} /> Address</span><strong>{showView.address}</strong></div>
                <div className="view-item" style={{ gridColumn: 'span 2' }}>
                  <span><Package size={13} /> Products Supplied</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                    {showView.products.map(p => <span key={p} className="product-tag">{p}</span>)}
                  </div>
                </div>
              </div>

              {/* Purchase history for this supplier */}
              <div style={{ marginTop: '1.25rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: 10 }}>Purchase History</h4>
                <table className="data-table">
                  <thead><tr><th>Product</th><th>Qty</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
                  <tbody>
                    {purchases.filter(p => p.supplierId === showView.id).map(p => (
                      <tr key={p.id}>
                        <td>{p.product}</td>
                        <td>{p.qty} {p.unit}</td>
                        <td><strong>₹{p.amount.toLocaleString()}</strong></td>
                        <td>{p.date}</td>
                        <td><span className="status-badge" style={{ background: statusColor[p.status] + '20', color: statusColor[p.status] }}>{p.status}</span></td>
                      </tr>
                    ))}
                    {purchases.filter(p => p.supplierId === showView.id).length === 0 && (
                      <tr><td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8' }}>No purchases yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== ADD PURCHASE MODAL ===== */}
      {showPurchaseModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add Purchase Record</h3>
              <button onClick={() => setShowPurchaseModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Supplier *</label>
                <select className="form-input" value={purchaseForm.supplierId} onChange={e => setPurchaseForm({ ...purchaseForm, supplierId: e.target.value })}>
                  <option value="">Select Supplier</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} — {s.company}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Product *</label>
                  <input className="form-input" value={purchaseForm.product} onChange={e => setPurchaseForm({ ...purchaseForm, product: e.target.value })} placeholder="e.g. Basmati Rice" />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input className="form-input" type="date" value={purchaseForm.date} onChange={e => setPurchaseForm({ ...purchaseForm, date: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Quantity *</label>
                  <input className="form-input" type="number" value={purchaseForm.qty} onChange={e => setPurchaseForm({ ...purchaseForm, qty: e.target.value })} placeholder="0" />
                </div>
                <div className="form-group">
                  <label>Unit</label>
                  <select className="form-input" value={purchaseForm.unit} onChange={e => setPurchaseForm({ ...purchaseForm, unit: e.target.value })}>
                    {['Kg', 'L', 'Nos', 'Pcs', 'Pkt', 'Box', 'Bottle', 'Can'].map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Total Amount (₹)</label>
                  <input className="form-input" type="number" value={purchaseForm.amount} onChange={e => setPurchaseForm({ ...purchaseForm, amount: e.target.value })} placeholder="0" />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select className="form-input" value={purchaseForm.status} onChange={e => setPurchaseForm({ ...purchaseForm, status: e.target.value })}>
                    <option>Pending</option>
                    <option>Received</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowPurchaseModal(false)}>Cancel</button>
              <button className="btn-save" onClick={handleAddPurchase}><Save size={15} /> Add Purchase</button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}
