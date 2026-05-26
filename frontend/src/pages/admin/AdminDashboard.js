import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Users, Package, ShoppingCart, TrendingUp, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';

const salesData = [
  { month: 'Jan', sales: 12000 }, { month: 'Feb', sales: 19000 },
  { month: 'Mar', sales: 15000 }, { month: 'Apr', sales: 25000 },
  { month: 'May', sales: 22000 }, { month: 'Jun', sales: 30000 },
  { month: 'Jul', sales: 28000 }, { month: 'Aug', sales: 35000 },
];

const categoryData = [
  { name: 'Electronics', value: 35 }, { name: 'Clothing', value: 25 },
  { name: 'Groceries', value: 20 }, { name: 'Others', value: 20 },
];

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd'];

const recentOrders = [
  { id: '#ORD001', customer: 'Priya R', product: 'iPhone 15', amount: '₹79,999', status: 'Delivered' },
  { id: '#ORD002', customer: 'Raj K', product: 'Nike Shoes', amount: '₹4,999', status: 'Pending' },
  { id: '#ORD003', customer: 'Meena S', product: 'Rice 10kg', amount: '₹850', status: 'Processing' },
  { id: '#ORD004', customer: 'Arun T', product: 'Laptop', amount: '₹55,000', status: 'Shipped' },
  { id: '#ORD005', customer: 'Divya M', product: 'T-Shirt', amount: '₹599', status: 'Delivered' },
];

const lowStockItems = [
  { name: 'Basmati Rice', stock: 5, unit: 'kg' },
  { name: 'Olive Oil', stock: 3, unit: 'liters' },
  { name: 'Sugar', stock: 8, unit: 'kg' },
];

const statusColor = { Delivered: '#22c55e', Pending: '#f97316', Processing: '#3b82f6', Shipped: '#8b5cf6' };

export default function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard">
      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><Users size={24} /></div>
          <div className="stat-info">
            <p className="stat-label">Total Users</p>
            <h3 className="stat-value">1,248</h3>
            <p className="stat-change up"><ArrowUp size={14} /> 12% this month</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><Package size={24} /></div>
          <div className="stat-info">
            <p className="stat-label">Total Products</p>
            <h3 className="stat-value">384</h3>
            <p className="stat-change up"><ArrowUp size={14} /> 5% this month</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><ShoppingCart size={24} /></div>
          <div className="stat-info">
            <p className="stat-label">Total Orders</p>
            <h3 className="stat-value">2,741</h3>
            <p className="stat-change down"><ArrowDown size={14} /> 3% this month</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><TrendingUp size={24} /></div>
          <div className="stat-info">
            <p className="stat-label">Total Revenue</p>
            <h3 className="stat-value">₹4.2L</h3>
            <p className="stat-change up"><ArrowUp size={14} /> 18% this month</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        <div className="chart-card wide">
          <h3 className="chart-title">Sales Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => '₹' + v.toLocaleString()} />
              <Area type="monotone" dataKey="sales" stroke="#6366f1" fill="url(#salesGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Category Sales</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value">
                {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v) => v + '%'} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="bottom-grid">
        {/* Recent Orders */}
        <div className="table-card wide">
          <h3 className="chart-title">Recent Orders</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th><th>Customer</th><th>Product</th><th>Amount</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id}>
                  <td className="order-id">{o.id}</td>
                  <td>{o.customer}</td>
                  <td>{o.product}</td>
                  <td><strong>{o.amount}</strong></td>
                  <td>
                    <span className="status-badge" style={{ background: statusColor[o.status] + '20', color: statusColor[o.status] }}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Low Stock */}
        <div className="table-card">
          <h3 className="chart-title" style={{ color: '#ef4444' }}>
            <AlertTriangle size={18} style={{ display: 'inline', marginRight: 6 }} />
            Low Stock Alerts
          </h3>
          <div className="stock-list">
            {lowStockItems.map((item) => (
              <div key={item.name} className="stock-item">
                <div>
                  <p className="stock-name">{item.name}</p>
                  <p className="stock-unit">{item.stock} {item.unit} remaining</p>
                </div>
                <div className="stock-bar-wrap">
                  <div className="stock-bar" style={{ width: (item.stock / 20 * 100) + '%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
