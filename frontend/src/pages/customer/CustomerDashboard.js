import React from 'react';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { ShoppingCart, Heart, Package, Star, Truck, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const spendingData = [
  { month: 'Jan', spent: 1200 }, { month: 'Feb', spent: 3400 },
  { month: 'Mar', spent: 2100 }, { month: 'Apr', spent: 4500 },
  { month: 'May', spent: 1800 }, { month: 'Jun', spent: 5200 },
];

const recentOrders = [
  { id: '#ORD001', product: 'iPhone 15', date: '2024-05-01', amount: '₹79,999', status: 'Delivered' },
  { id: '#ORD002', product: 'Nike Shoes', date: '2024-04-28', amount: '₹4,999', status: 'Shipped' },
  { id: '#ORD003', product: 'Rice 10kg', date: '2024-04-20', amount: '₹850', status: 'Delivered' },
];

const recommended = [
  { name: 'Wireless Earbuds', price: '₹2,499', rating: 4.5, img: '🎧' },
  { name: 'Running Shoes', price: '₹3,999', rating: 4.3, img: '👟' },
  { name: 'Organic Honey', price: '₹450', rating: 4.8, img: '🍯' },
  { name: 'Laptop Stand', price: '₹1,299', rating: 4.2, img: '💻' },
];

const statusColor = { Delivered: '#22c55e', Shipped: '#8b5cf6', Processing: '#3b82f6', Pending: '#f97316' };
const statusIcon = { Delivered: <CheckCircle size={14} />, Shipped: <Truck size={14} />, Processing: <Clock size={14} />, Pending: <Clock size={14} /> };

export default function CustomerDashboard({ cartCount = 0, wishlistCount = 0, products = [] }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Show last 4 added products as recommendations
  const recommended = products.slice(-4).reverse();

  return (
    <CustomerLayout title={`Welcome back, ${user?.fullName?.split(' ')[0]}! 👋`} cartCount={cartCount} wishlistCount={wishlistCount}>
      <div className="stats-grid">
        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/customer/cart')}>
          <div className="stat-icon blue"><ShoppingCart size={24} /></div>
          <div className="stat-info"><p className="stat-label">Cart Items</p><h3 className="stat-value">{cartCount}</h3></div>
        </div>
        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/customer/orders')}>
          <div className="stat-icon green"><Package size={24} /></div>
          <div className="stat-info"><p className="stat-label">My Orders</p><h3 className="stat-value">3</h3></div>
        </div>
        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/customer/wishlist')}>
          <div className="stat-icon orange"><Heart size={24} /></div>
          <div className="stat-info"><p className="stat-label">Wishlist</p><h3 className="stat-value">{wishlistCount}</h3></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><Star size={24} /></div>
          <div className="stat-info"><p className="stat-label">Reward Points</p><h3 className="stat-value">450</h3></div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card wide">
          <h3 className="chart-title">My Spending History</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={spendingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={v => '₹' + v.toLocaleString()} />
              <Line type="monotone" dataKey="spent" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Recent Orders</h3>
          <div className="order-list">
            {recentOrders.map(o => (
              <div key={o.id} className="order-item">
                <div className="order-item-info"><p className="order-item-name">{o.product}</p><p className="order-item-date">{o.date}</p></div>
                <div className="order-item-right">
                  <p className="order-item-amount">{o.amount}</p>
                  <span className="status-badge" style={{ background: statusColor[o.status] + '20', color: statusColor[o.status], display: 'flex', alignItems: 'center', gap: 4 }}>
                    {statusIcon[o.status]} {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="table-card" style={{ marginTop: '1.5rem' }}>
        <h3 className="chart-title">Recommended For You 🤖</h3>
        <div className="product-grid">
          {recommended.map(p => (
            <div key={p.id} className="product-card">
              <div className="product-emoji">
                {p.image?.startsWith('data:')
                  ? <img src={p.image} alt={p.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} />
                  : p.image}
              </div>
              <p className="product-name">{p.name}</p>
              <div className="product-rating"><Star size={14} fill="#f59e0b" color="#f59e0b" /> {p.rating || '4.0'}</div>
              <p className="product-price">₹{Number(p.price).toLocaleString()}</p>
              <button className="btn-add-cart" onClick={() => navigate('/customer/shop')}>Shop Now</button>
            </div>
          ))}
        </div>
      </div>
    </CustomerLayout>
  );
}
