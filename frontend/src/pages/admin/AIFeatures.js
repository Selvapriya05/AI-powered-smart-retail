import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';
import { Brain, TrendingUp, Package, Star, AlertTriangle } from 'lucide-react';

const salesPrediction = [
  { month: 'Jun', actual: 30000, predicted: 32000 },
  { month: 'Jul', actual: 28000, predicted: 31000 },
  { month: 'Aug', actual: 35000, predicted: 36000 },
  { month: 'Sep', actual: null, predicted: 38000 },
  { month: 'Oct', actual: null, predicted: 42000 },
  { month: 'Nov', actual: null, predicted: 48000 },
];

const demandData = [
  { product: 'Rice', demand: 85 }, { product: 'Oil', demand: 72 },
  { product: 'iPhone', demand: 60 }, { product: 'Shoes', demand: 78 },
  { product: 'Milk', demand: 90 }, { product: 'Biscuits', demand: 65 },
];

const bestSelling = [
  { name: 'Basmati Rice', sales: 450, revenue: 54000, trend: '↑ 12%' },
  { name: 'iPhone 15', sales: 23, revenue: 183977, trend: '↑ 8%' },
  { name: 'Nike Shoes', sales: 89, revenue: 88911, trend: '↑ 5%' },
  { name: 'Milk 1L', sales: 320, revenue: 19200, trend: '↓ 2%' },
  { name: 'Olive Oil', sales: 67, revenue: 30150, trend: '↑ 15%' },
];

const lowStockPrediction = [
  { name: 'Olive Oil', currentStock: 3, daysLeft: 2, reorderQty: 50 },
  { name: 'Milk 1L', currentStock: 5, daysLeft: 3, reorderQty: 100 },
  { name: 'Biscuits', currentStock: 8, daysLeft: 5, reorderQty: 200 },
];

const recommendations = [
  { product: 'Organic Honey', reason: 'High search volume this week', confidence: 92 },
  { product: 'Protein Bars', reason: 'Trending in your region', confidence: 87 },
  { product: 'Green Tea', reason: 'Seasonal demand increase', confidence: 81 },
  { product: 'Almonds 500g', reason: 'Frequently bought together', confidence: 76 },
];

export default function AIFeatures() {
  return (
    <AdminLayout title="AI Features">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem', background: 'linear-gradient(135deg,#eef2ff,#f5f3ff)', padding: '1rem 1.5rem', borderRadius: 14 }}>
        <Brain size={28} color="#6366f1" />
        <div>
          <h3 style={{ color: '#4338ca', margin: 0 }}>AI-Powered Analytics</h3>
          <p style={{ color: '#6366f1', margin: 0, fontSize: '0.85rem' }}>Smart insights powered by machine learning</p>
        </div>
      </div>

      <div className="charts-grid">
        {/* Sales Prediction */}
        <div className="chart-card wide">
          <h3 className="chart-title"><TrendingUp size={18} color="#6366f1" /> Sales Prediction (Next 3 Months)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={salesPrediction}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={v => v ? '₹' + v.toLocaleString() : 'N/A'} />
              <Line type="monotone" dataKey="actual" stroke="#6366f1" strokeWidth={2} name="Actual" dot={{ fill: '#6366f1' }} />
              <Line type="monotone" dataKey="predicted" stroke="#f97316" strokeWidth={2} strokeDasharray="5 5" name="Predicted" dot={{ fill: '#f97316' }} />
            </LineChart>
          </ResponsiveContainer>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 8 }}>🟠 Dashed line = AI prediction | 🟣 Solid line = Actual sales</p>
        </div>

        {/* Demand Forecasting */}
        <div className="chart-card">
          <h3 className="chart-title"><Package size={18} color="#6366f1" /> Demand Forecast</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={demandData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="product" type="category" width={60} />
              <Tooltip formatter={v => v + '%'} />
              <Bar dataKey="demand" fill="#6366f1" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bottom-grid" style={{ marginTop: '1.5rem' }}>
        {/* Best Selling */}
        <div className="table-card wide">
          <h3 className="chart-title"><Star size={18} color="#f59e0b" /> Best Selling Products</h3>
          <table className="data-table">
            <thead><tr><th>Product</th><th>Units Sold</th><th>Revenue</th><th>Trend</th></tr></thead>
            <tbody>
              {bestSelling.map(p => (
                <tr key={p.name}>
                  <td><strong>{p.name}</strong></td>
                  <td>{p.sales}</td>
                  <td><strong>₹{p.revenue.toLocaleString()}</strong></td>
                  <td style={{ color: p.trend.includes('↑') ? '#22c55e' : '#ef4444', fontWeight: 700 }}>{p.trend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Low Stock Prediction */}
        <div className="table-card">
          <h3 className="chart-title" style={{ color: '#ef4444' }}><AlertTriangle size={18} /> Low Stock Prediction</h3>
          <div className="stock-list">
            {lowStockPrediction.map(item => (
              <div key={item.name} className="stock-item" style={{ background: '#fff5f5', padding: '0.75rem', borderRadius: 10, marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <strong style={{ fontSize: '0.875rem' }}>{item.name}</strong>
                  <span style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 700 }}>⚠️ {item.daysLeft} days left</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>Stock: {item.currentStock} | Reorder: {item.reorderQty} units</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Smart Recommendations */}
      <div className="table-card" style={{ marginTop: '1.5rem' }}>
        <h3 className="chart-title"><Brain size={18} color="#6366f1" /> Smart Product Recommendations</h3>
        <div className="product-grid">
          {recommendations.map(r => (
            <div key={r.product} className="product-card">
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>🤖</div>
              <p className="product-name">{r.product}</p>
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 8 }}>{r.reason}</p>
              <div style={{ background: '#eef2ff', borderRadius: 20, padding: '2px 10px', display: 'inline-block' }}>
                <span style={{ color: '#6366f1', fontWeight: 700, fontSize: '0.8rem' }}>{r.confidence}% confidence</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
