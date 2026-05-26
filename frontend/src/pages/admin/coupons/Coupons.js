import React, { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Edit2, Trash2, X, Save, Tag, ToggleLeft, ToggleRight, Copy, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['All Categories', 'Electronics', 'Clothing', 'Groceries', 'Dairy', 'Beverages', 'Snacks'];

const INIT_COUPONS = [
  { id: 1,  code: 'SAVE10',    type: 'percentage', discount: 10,   minOrder: 500,   maxDiscount: 200,  category: 'All Categories', expiry: '2026-12-31', usageLimit: 100, usedCount: 34, status: 'Active',   description: '10% off on all products' },
  { id: 2,  code: 'FLAT50',    type: 'flat',       discount: 50,   minOrder: 300,   maxDiscount: 50,   category: 'Groceries',      expiry: '2026-06-30', usageLimit: 50,  usedCount: 12, status: 'Active',   description: '₹50 flat off on Groceries' },
  { id: 3,  code: 'ELEC20',    type: 'percentage', discount: 20,   minOrder: 2000,  maxDiscount: 1000, category: 'Electronics',    expiry: '2026-07-15', usageLimit: 30,  usedCount: 8,  status: 'Active',   description: '20% off on Electronics' },
  { id: 4,  code: 'WELCOME',   type: 'flat',       discount: 100,  minOrder: 500,   maxDiscount: 100,  category: 'All Categories', expiry: '2026-12-31', usageLimit: 200, usedCount: 89, status: 'Active',   description: '₹100 off for new users' },
  { id: 5,  code: 'DAIRY15',   type: 'percentage', discount: 15,   minOrder: 200,   maxDiscount: 100,  category: 'Dairy',          expiry: '2026-05-31', usageLimit: 40,  usedCount: 40, status: 'Expired',  description: '15% off on Dairy products' },
  { id: 6,  code: 'SNACK5',    type: 'flat',       discount: 5,    minOrder: 100,   maxDiscount: 5,    category: 'Snacks',         expiry: '2026-08-01', usageLimit: 100, usedCount: 0,  status: 'Disabled', description: '₹5 off on Snacks' },
];

const emptyForm = {
  code: '', type: 'percentage', discount: '', minOrder: '',
  maxDiscount: '', category: 'All Categories',
  expiry: '', usageLimit: '', description: '', status: 'Active',
};

export default function Coupons() {
  const [coupons, setCoupons]     = useState(INIT_COUPONS);
  const [search, setSearch]       = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(emptyForm);

  const filtered = coupons.filter(c =>
    (filterStatus === 'All' || c.status === filterStatus) &&
    (c.code.toLowerCase().includes(search.toLowerCase()) ||
     c.description.toLowerCase().includes(search.toLowerCase()))
  );

  const openAdd  = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (c) => { setEditing(c.id); setForm({ ...c }); setShowModal(true); };

  const handleSave = () => {
    if (!form.code || !form.discount || !form.expiry) {
      toast.error('Code, discount and expiry are required');
      return;
    }
    if (editing) {
      setCoupons(coupons.map(c => c.id === editing ? { ...form, id: editing, usedCount: c.usedCount } : c));
      toast.success('Coupon updated!');
    } else {
      const exists = coupons.find(c => c.code.toUpperCase() === form.code.toUpperCase());
      if (exists) { toast.error('Coupon code already exists!'); return; }
      setCoupons([...coupons, { ...form, id: Date.now(), code: form.code.toUpperCase(), usedCount: 0 }]);
      toast.success('Coupon created!');
    }
    setShowModal(false);
  };

  const handleDelete = (id) => { setCoupons(coupons.filter(c => c.id !== id)); toast.success('Coupon deleted!'); };

  const toggleStatus = (id) => {
    setCoupons(coupons.map(c => {
      if (c.id !== id) return c;
      const next = c.status === 'Active' ? 'Disabled' : 'Active';
      toast.success(`Coupon ${next === 'Active' ? 'enabled' : 'disabled'}!`);
      return { ...c, status: next };
    }));
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied: ${code}`);
  };

  const statusColor = { Active: '#22c55e', Disabled: '#94a3b8', Expired: '#ef4444' };
  const usagePercent = (c) => Math.min(100, Math.round((c.usedCount / c.usageLimit) * 100));

  return (
    <AdminLayout title="Coupons & Offers">

      {/* Stats */}
      <div className="mini-stats" style={{ marginBottom: '1.25rem' }}>
        <div className="mini-stat"><span>Total Coupons</span><strong>{coupons.length}</strong></div>
        <div className="mini-stat green"><span>Active</span><strong>{coupons.filter(c => c.status === 'Active').length}</strong></div>
        <div className="mini-stat red"><span>Expired</span><strong>{coupons.filter(c => c.status === 'Expired').length}</strong></div>
        <div className="mini-stat"><span>Disabled</span><strong>{coupons.filter(c => c.status === 'Disabled').length}</strong></div>
        <div className="mini-stat blue"><span>Total Used</span><strong>{coupons.reduce((s, c) => s + c.usedCount, 0)}</strong></div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-box">
            <Search size={16} />
            <input placeholder="Search coupons..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="filter-tabs">
            {['All', 'Active', 'Disabled', 'Expired'].map(s => (
              <button key={s} className={`filter-tab ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>{s}</button>
            ))}
          </div>
        </div>
        <button className="btn-add" onClick={openAdd}><Plus size={16} /> Create Coupon</button>
      </div>

      {/* Coupon Cards */}
      <div className="coupon-grid">
        {filtered.map(c => (
          <div key={c.id} className={`coupon-card ${c.status === 'Disabled' ? 'disabled' : ''} ${c.status === 'Expired' ? 'expired' : ''}`}>
            {/* Header */}
            <div className="coupon-header">
              <div className="coupon-code-wrap">
                <Tag size={16} color="#6366f1" />
                <span className="coupon-code">{c.code}</span>
                <button className="copy-btn" onClick={() => copyCode(c.code)} title="Copy code">
                  <Copy size={13} />
                </button>
              </div>
              <span className="status-badge" style={{ background: statusColor[c.status] + '20', color: statusColor[c.status] }}>
                {c.status}
              </span>
            </div>

            {/* Discount */}
            <div className="coupon-discount">
              {c.type === 'percentage'
                ? <span className="discount-value">{c.discount}% OFF</span>
                : <span className="discount-value">₹{c.discount} OFF</span>
              }
              <span className="coupon-desc">{c.description}</span>
            </div>

            {/* Details */}
            <div className="coupon-details">
              <div className="coupon-detail-item"><span>Min Order</span><strong>₹{c.minOrder}</strong></div>
              <div className="coupon-detail-item"><span>Max Discount</span><strong>₹{c.maxDiscount}</strong></div>
              <div className="coupon-detail-item"><span>Category</span><strong>{c.category}</strong></div>
              <div className="coupon-detail-item"><span>Expiry</span><strong>{c.expiry}</strong></div>
            </div>

            {/* Usage Progress */}
            <div className="coupon-usage">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Usage</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e293b' }}>{c.usedCount} / {c.usageLimit}</span>
              </div>
              <div className="usage-bar-wrap">
                <div className="usage-bar" style={{ width: usagePercent(c) + '%', background: usagePercent(c) >= 90 ? '#ef4444' : '#6366f1' }} />
              </div>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{usagePercent(c)}% used</span>
            </div>

            {/* Actions */}
            <div className="coupon-actions">
              <button
                className={`toggle-btn ${c.status === 'Active' ? 'on' : 'off'}`}
                onClick={() => toggleStatus(c.id)}
                disabled={c.status === 'Expired'}
                title={c.status === 'Active' ? 'Disable' : 'Enable'}
              >
                {c.status === 'Active' ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                {c.status === 'Active' ? 'Enabled' : 'Disabled'}
              </button>
              <div className="action-btns">
                <button className="icon-btn green" onClick={() => openEdit(c)}><Edit2 size={15} /></button>
                <button className="icon-btn red"   onClick={() => handleDelete(c.id)}><Trash2 size={15} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <Tag size={48} color="#c7d2fe" />
          <h3>No coupons found</h3>
          <p>Create your first coupon to offer discounts</p>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editing ? 'Edit Coupon' : 'Create Coupon'}</h3>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Coupon Code *</label>
                  <input className="form-input" value={form.code}
                    onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. SAVE10" style={{ textTransform: 'uppercase', fontWeight: 700, letterSpacing: 2 }} />
                </div>
                <div className="form-group">
                  <label>Discount Type</label>
                  <select className="form-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Discount Value * {form.type === 'percentage' ? '(%)' : '(₹)'}</label>
                  <input className="form-input" type="number" value={form.discount}
                    onChange={e => setForm({ ...form, discount: e.target.value })} placeholder="e.g. 10" />
                </div>
                <div className="form-group">
                  <label>Max Discount (₹)</label>
                  <input className="form-input" type="number" value={form.maxDiscount}
                    onChange={e => setForm({ ...form, maxDiscount: e.target.value })} placeholder="e.g. 200" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Minimum Order (₹)</label>
                  <input className="form-input" type="number" value={form.minOrder}
                    onChange={e => setForm({ ...form, minOrder: e.target.value })} placeholder="e.g. 500" />
                </div>
                <div className="form-group">
                  <label>Usage Limit</label>
                  <input className="form-input" type="number" value={form.usageLimit}
                    onChange={e => setForm({ ...form, usageLimit: e.target.value })} placeholder="e.g. 100" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select className="form-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Expiry Date *</label>
                  <input className="form-input" type="date" value={form.expiry}
                    onChange={e => setForm({ ...form, expiry: e.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <input className="form-input" value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. 10% off on all products" />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select className="form-input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option>Active</option>
                  <option>Disabled</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-save" onClick={handleSave}><Save size={15} /> {editing ? 'Update' : 'Create Coupon'}</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
