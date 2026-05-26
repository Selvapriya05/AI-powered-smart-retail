import React, { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Edit2, Trash2, Eye, Search, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORY_UNITS = {
  Electronics: ['Nos', 'Pcs', 'Box', 'Set', 'Pair', 'Bottle', 'Can'],
  Clothing:    ['Pcs', 'Nos', 'Set', 'Pair', 'Box', 'Bottle', 'Can'],
  Groceries:   ['Kg', 'L', 'Pkt', 'Box', 'Bag', 'Nos', 'Pcs', 'Bottle', 'Can'],
  Dairy:       ['L', 'Pkt', 'Bottle', 'Can', 'Box', 'Nos', 'Pcs'],
  Beverages:   ['Bottle', 'Can', 'L', 'Pkt', 'Box', 'Nos', 'Pcs'],
  Snacks:      ['Pkt', 'Box', 'Bag', 'Nos', 'Kg', 'Pcs', 'Bottle', 'Can'],
};

const CATEGORIES = Object.keys(CATEGORY_UNITS);
const defaultForm = { name: '', category: 'Electronics', price: '', stock: '', unit: 'Nos', image: '', status: 'Active' };

export default function Products({ products = [], setProducts }) {
  const [search, setSearch]       = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showView, setShowView]   = useState(null);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(defaultForm);

  const handleCategoryChange = (category) => {
    const firstUnit = CATEGORY_UNITS[category][0];
    setForm(f => ({ ...f, category, unit: firstUnit }));
  };

  const openAdd = () => { setEditing(null); setForm(defaultForm); setShowModal(true); };
  const openEdit = (p) => { setEditing(p.id); setForm({ ...p }); setShowModal(true); };

  const handleSave = () => {
    if (!form.name || !form.price || !form.stock) { toast.error('Fill all required fields'); return; }
    const status = Number(form.stock) <= 5 ? 'Low Stock' : 'Active';
    if (editing) {
      setProducts(products.map(p => p.id === editing ? { ...form, id: editing, status } : p));
      toast.success('Product updated!');
    } else {
      setProducts(prev => [...prev, { ...form, id: Date.now(), status, rating: 4.5 }]);
      toast.success('Product added! Now visible in customer shop.');
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success('Product deleted!');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setForm(f => ({ ...f, image: ev.target.result }));
      reader.readAsDataURL(file);
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const units = CATEGORY_UNITS[form.category] || [];

  return (
    <AdminLayout title="Product Management">

      <div className="toolbar">
        <div className="search-box">
          <Search size={16} />
          <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn-add" onClick={openAdd}><Plus size={16} /> Add Product</button>
      </div>

      <div className="mini-stats">
        <div className="mini-stat"><span>Total</span><strong>{products.length}</strong></div>
        <div className="mini-stat red"><span>Low Stock</span><strong>{products.filter(p => p.status === 'Low Stock').length}</strong></div>
        <div className="mini-stat green"><span>Active</span><strong>{products.filter(p => p.status === 'Active').length}</strong></div>
      </div>

      {/* Unit legend */}
      <div className="unit-legend">
        {CATEGORIES.map(cat => (
          <div key={cat} className="unit-legend-item">
            <span className="cat-badge">{cat}</span>
            <span className="unit-legend-units">{CATEGORY_UNITS[cat].join(' / ')}</span>
          </div>
        ))}
      </div>

      <div className="table-card" style={{ marginTop: '1rem' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Image</th><th>Name</th><th>Category</th>
              <th>Price</th><th>Stock</th><th>Unit</th>
              <th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>No products yet. Click "Add Product" to add one.</td></tr>
            ) : filtered.map(p => (
              <tr key={p.id}>
                <td>
                  {p.image?.startsWith('data:')
                    ? <img src={p.image} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} />
                    : <span style={{ fontSize: '1.5rem' }}>{p.image}</span>}
                </td>
                <td><strong>{p.name}</strong></td>
                <td><span className="cat-badge">{p.category}</span></td>
                <td>₹{Number(p.price).toLocaleString()}</td>
                <td>{p.stock}</td>
                <td><span className="unit-badge">{p.unit}</span></td>
                <td>
                  <span className={`status-badge ${p.status === 'Low Stock' ? 'badge-red' : 'badge-green'}`}>
                    {p.status}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <button className="icon-btn blue"  onClick={() => setShowView(p)}><Eye size={15} /></button>
                    <button className="icon-btn green" onClick={() => openEdit(p)}><Edit2 size={15} /></button>
                    <button className="icon-btn red"   onClick={() => handleDelete(p.id)}><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editing ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input className="form-input" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Product name" />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select className="form-input" value={form.category}
                    onChange={e => handleCategoryChange(e.target.value)}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input className="form-input" type="number" value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0" />
                </div>
                <div className="form-group">
                  <label>Stock *</label>
                  <input className="form-input" type="number" value={form.stock}
                    onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} placeholder="0" />
                </div>
              </div>

              <div className="form-group">
                <label>Unit <span style={{ color: '#6366f1', fontSize: '0.75rem' }}>— {form.category}</span></label>
                <div className="unit-radio-group">
                  {units.map(u => (
                    <label key={u} className={`unit-radio ${form.unit === u ? 'active' : ''}`}>
                      <input type="radio" name="unit" value={u} checked={form.unit === u}
                        onChange={() => setForm(f => ({ ...f, unit: u }))} hidden />
                      {u}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Emoji / Icon</label>
                  <input className="form-input"
                    value={form.image?.startsWith('data:') ? '' : form.image}
                    onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                    placeholder="e.g. 🍎" />
                </div>
                <div className="form-group">
                  <label>Upload Image</label>
                  <label className="upload-btn">
                    <Upload size={16} /> Choose Image
                    <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                  </label>
                  {form.image?.startsWith('data:') && (
                    <img src={form.image} alt="" style={{ width: 50, height: 50, borderRadius: 8, marginTop: 6, objectFit: 'cover' }} />
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-save" onClick={handleSave}>{editing ? 'Update' : 'Add Product'}</button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showView && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Product Details</h3>
              <button onClick={() => setShowView(null)}><X size={20} /></button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                {showView.image?.startsWith('data:')
                  ? <img src={showView.image} alt="" style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover' }} />
                  : showView.image}
              </div>
              <h2 style={{ marginBottom: '0.5rem' }}>{showView.name}</h2>
              <p style={{ color: '#64748b', marginBottom: '1rem' }}>{showView.category}</p>
              <div className="view-grid">
                <div className="view-item"><span>Price</span><strong>₹{Number(showView.price).toLocaleString()}</strong></div>
                <div className="view-item"><span>Stock</span><strong>{showView.stock} {showView.unit}</strong></div>
                <div className="view-item"><span>Unit</span><strong>{showView.unit}</strong></div>
                <div className="view-item"><span>Status</span>
                  <strong style={{ color: showView.status === 'Low Stock' ? '#ef4444' : '#22c55e' }}>
                    {showView.status}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}
