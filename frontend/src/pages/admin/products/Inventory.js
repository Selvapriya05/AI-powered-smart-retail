import React, { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { AlertTriangle, Edit2, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const UNITS = ['kg', 'packets', 'pieces', 'liters'];

const initInventory = [
  { id: 1, name: 'Basmati Rice', category: 'Groceries', stock: 50, unit: 'kg', minStock: 10, price: 120 },
  { id: 2, name: 'Olive Oil', category: 'Groceries', stock: 3, unit: 'liters', minStock: 10, price: 450 },
  { id: 3, name: 'iPhone 15', category: 'Electronics', stock: 10, unit: 'pieces', minStock: 5, price: 79999 },
  { id: 4, name: 'Nike T-Shirt', category: 'Clothing', stock: 25, unit: 'pieces', minStock: 10, price: 999 },
  { id: 5, name: 'Milk 1L', category: 'Dairy', stock: 5, unit: 'liters', minStock: 10, price: 60 },
  { id: 6, name: 'Biscuits', category: 'Snacks', stock: 8, unit: 'packets', minStock: 15, price: 30 },
];

export default function Inventory() {
  const [inventory, setInventory] = useState(initInventory);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const lowStock = inventory.filter(i => i.stock <= i.minStock);

  const startEdit = (item) => { setEditId(item.id); setEditForm({ stock: item.stock, unit: item.unit, minStock: item.minStock }); };

  const saveEdit = (id) => {
    setInventory(inventory.map(i => i.id === id ? { ...i, ...editForm, stock: Number(editForm.stock), minStock: Number(editForm.minStock) } : i));
    setEditId(null);
    toast.success('Stock updated!');
  };

  return (
    <AdminLayout title="Inventory Management">
      {/* Low Stock Alerts */}
      {lowStock.length > 0 && (
        <div className="alert-box">
          <AlertTriangle size={18} color="#f97316" />
          <span><strong>{lowStock.length} items</strong> are below minimum stock level: {lowStock.map(i => i.name).join(', ')}</span>
        </div>
      )}

      {/* Stats */}
      <div className="mini-stats">
        <div className="mini-stat"><span>Total Items</span><strong>{inventory.length}</strong></div>
        <div className="mini-stat red"><span>Low Stock</span><strong>{lowStock.length}</strong></div>
        <div className="mini-stat green"><span>Well Stocked</span><strong>{inventory.length - lowStock.length}</strong></div>
        <div className="mini-stat blue"><span>Total Value</span><strong>₹{inventory.reduce((s, i) => s + i.stock * i.price, 0).toLocaleString()}</strong></div>
      </div>

      <div className="table-card" style={{ marginTop: '1rem' }}>
        <table className="data-table">
          <thead>
            <tr><th>Product</th><th>Category</th><th>Current Stock</th><th>Unit</th><th>Min Stock</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id}>
                <td><strong>{item.name}</strong></td>
                <td>{item.category}</td>
                <td>
                  {editId === item.id
                    ? <input type="number" className="form-input" style={{ width: 80, padding: '4px 8px' }} value={editForm.stock} onChange={e => setEditForm({ ...editForm, stock: e.target.value })} />
                    : <span style={{ color: item.stock <= item.minStock ? '#ef4444' : '#22c55e', fontWeight: 700 }}>{item.stock}</span>
                  }
                </td>
                <td>
                  {editId === item.id
                    ? <select className="form-input" style={{ width: 100, padding: '4px 8px' }} value={editForm.unit} onChange={e => setEditForm({ ...editForm, unit: e.target.value })}>
                        {UNITS.map(u => <option key={u}>{u}</option>)}
                      </select>
                    : item.unit
                  }
                </td>
                <td>
                  {editId === item.id
                    ? <input type="number" className="form-input" style={{ width: 80, padding: '4px 8px' }} value={editForm.minStock} onChange={e => setEditForm({ ...editForm, minStock: e.target.value })} />
                    : item.minStock
                  }
                </td>
                <td>
                  <span className={`status-badge ${item.stock <= item.minStock ? 'badge-red' : 'badge-green'}`}>
                    {item.stock <= item.minStock ? '⚠️ Low Stock' : '✅ In Stock'}
                  </span>
                </td>
                <td>
                  {editId === item.id
                    ? <div className="action-btns">
                        <button className="icon-btn green" onClick={() => saveEdit(item.id)}><Save size={15} /></button>
                        <button className="icon-btn red" onClick={() => setEditId(null)}><X size={15} /></button>
                      </div>
                    : <button className="icon-btn blue" onClick={() => startEdit(item)}><Edit2 size={15} /></button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
