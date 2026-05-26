import React, { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const initCategories = [
  { id: 1, name: 'Electronics', icon: '📱', products: 45, status: 'Active' },
  { id: 2, name: 'Clothing', icon: '👕', products: 120, status: 'Active' },
  { id: 3, name: 'Groceries', icon: '🛒', products: 200, status: 'Active' },
  { id: 4, name: 'Dairy', icon: '🥛', products: 30, status: 'Active' },
  { id: 5, name: 'Beverages', icon: '🥤', products: 50, status: 'Active' },
  { id: 6, name: 'Snacks', icon: '🍿', products: 80, status: 'Active' },
];

export default function Categories() {
  const [categories, setCategories] = useState(initCategories);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', icon: '', status: 'Active' });

  const openAdd = () => { setEditing(null); setForm({ name: '', icon: '', status: 'Active' }); setShowModal(true); };
  const openEdit = (c) => { setEditing(c.id); setForm({ ...c }); setShowModal(true); };

  const handleSave = () => {
    if (!form.name) { toast.error('Category name required'); return; }
    if (editing) {
      setCategories(categories.map(c => c.id === editing ? { ...c, ...form } : c));
      toast.success('Category updated!');
    } else {
      setCategories([...categories, { ...form, id: Date.now(), products: 0 }]);
      toast.success('Category added!');
    }
    setShowModal(false);
  };

  const handleDelete = (id) => { setCategories(categories.filter(c => c.id !== id)); toast.success('Deleted!'); };

  return (
    <AdminLayout title="Category Management">
      <div className="toolbar">
        <h3 style={{ color: '#64748b' }}>Manage product categories</h3>
        <button className="btn-add" onClick={openAdd}><Plus size={16} /> Add Category</button>
      </div>

      <div className="cat-grid">
        {categories.map(c => (
          <div key={c.id} className="cat-card">
            <div className="cat-icon">{c.icon}</div>
            <h3 className="cat-name">{c.name}</h3>
            <p className="cat-count">{c.products} Products</p>
            <span className="status-badge badge-green">{c.status}</span>
            <div className="action-btns" style={{ marginTop: '0.75rem', justifyContent: 'center' }}>
              <button className="icon-btn green" onClick={() => openEdit(c)}><Edit2 size={15} /></button>
              <button className="icon-btn red" onClick={() => handleDelete(c.id)}><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editing ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Category Name *</label>
                <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Electronics" />
              </div>
              <div className="form-group">
                <label>Icon (Emoji)</label>
                <input className="form-input" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="e.g. 📱" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-save" onClick={handleSave}>{editing ? 'Update' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
