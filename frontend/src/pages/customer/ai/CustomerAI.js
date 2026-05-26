import React, { useState } from 'react';
import CustomerLayout from '../../../components/customer/CustomerLayout';
import {
  Brain, TrendingUp, ShoppingBag, Star, Heart,
  Search, IndianRupee, Salad, Zap, ShoppingCart, X
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// ── Data ──────────────────────────────────────────────────────────────────────

const ALL_PRODUCTS = [
  { id: 1,  name: 'iPhone 15',        price: 79999, image: '📱', category: 'Electronics', rating: 4.8, tag: 'Best Seller' },
  { id: 2,  name: 'Wireless Earbuds', price: 2499,  image: '🎧', category: 'Electronics', rating: 4.5, tag: 'Popular' },
  { id: 3,  name: 'Laptop Stand',     price: 1299,  image: '💻', category: 'Electronics', rating: 4.1, tag: '' },
  { id: 4,  name: 'Phone Case',       price: 499,   image: '📱', category: 'Electronics', rating: 4.3, tag: '' },
  { id: 5,  name: 'Nike T-Shirt',     price: 999,   image: '👕', category: 'Clothing',    rating: 4.3, tag: '' },
  { id: 6,  name: 'Running Shoes',    price: 3999,  image: '👟', category: 'Clothing',    rating: 4.2, tag: 'Trending' },
  { id: 7,  name: 'Denim Jeans',      price: 1499,  image: '👖', category: 'Clothing',    rating: 4.2, tag: '' },
  { id: 8,  name: 'Basmati Rice',     price: 600,   image: '🌾', category: 'Groceries',   rating: 4.6, tag: '' },
  { id: 9,  name: 'Olive Oil',        price: 450,   image: '🫙', category: 'Groceries',   rating: 4.4, tag: '' },
  { id: 10, name: 'Almonds 500g',     price: 650,   image: '🥜', category: 'Snacks',      rating: 4.6, tag: 'Healthy' },
  { id: 11, name: 'Milk 1L',          price: 60,    image: '🥛', category: 'Dairy',       rating: 4.7, tag: '' },
  { id: 12, name: 'Coca Cola',        price: 40,    image: '🥤', category: 'Beverages',   rating: 4.3, tag: '' },
  { id: 13, name: 'Protein Bars',     price: 350,   image: '🍫', category: 'Snacks',      rating: 4.1, tag: 'Healthy' },
  { id: 14, name: 'Green Tea',        price: 280,   image: '🍵', category: 'Beverages',   rating: 4.5, tag: 'Healthy' },
  { id: 15, name: 'Oats 500g',        price: 180,   image: '🌾', category: 'Groceries',   rating: 4.4, tag: 'Healthy' },
  { id: 16, name: 'Honey 500g',       price: 320,   image: '🍯', category: 'Groceries',   rating: 4.8, tag: 'Healthy' },
  { id: 17, name: 'Laptop',           price: 55000, image: '💻', category: 'Electronics', rating: 4.7, tag: '' },
  { id: 18, name: 'Bluetooth Speaker',price: 1800,  image: '🔊', category: 'Electronics', rating: 4.4, tag: '' },
];

const PERSONALIZED = [
  { ...ALL_PRODUCTS[1], reason: 'Customers who bought iPhone also bought this', confidence: 94 },
  { ...ALL_PRODUCTS[3], reason: 'Frequently bought together with iPhone', confidence: 89 },
  { ...ALL_PRODUCTS[2], reason: 'You viewed this 3 times', confidence: 82 },
  { ...ALL_PRODUCTS[5], reason: 'Trending in your area', confidence: 76 },
];

const HEALTH_SUGGESTIONS = [
  { category: '🌅 Healthy Breakfast', items: [ALL_PRODUCTS[14], ALL_PRODUCTS[15], ALL_PRODUCTS[12]] },
  { category: '💪 Fitness Essentials', items: [ALL_PRODUCTS[9], ALL_PRODUCTS[12], ALL_PRODUCTS[13]] },
  { category: '🥗 Healthy Groceries',  items: [ALL_PRODUCTS[7], ALL_PRODUCTS[8], ALL_PRODUCTS[15]] },
];

const behaviorData = [
  { category: 'Electronics', value: 45 }, { category: 'Clothing', value: 25 },
  { category: 'Groceries',   value: 20 }, { category: 'Snacks',    value: 10 },
];
const monthlySpend = [
  { month: 'Jan', amount: 1200 }, { month: 'Feb', amount: 3400 },
  { month: 'Mar', amount: 2100 }, { month: 'Apr', amount: 4500 },
  { month: 'May', amount: 5200 },
];
const radarData = [
  { subject: 'Electronics', A: 90 }, { subject: 'Clothing', A: 60 },
  { subject: 'Groceries',   A: 75 }, { subject: 'Snacks',   A: 40 },
  { subject: 'Beverages',   A: 55 }, { subject: 'Dairy',    A: 30 },
];
const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd'];

// ── Component ─────────────────────────────────────────────────────────────────

export default function CustomerAI({ cartCount, wishlistCount, products = [] }) {
  const navigate = useNavigate();
  const [tab, setTab]             = useState('recommendations');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [budget, setBudget]       = useState('');
  const [budgetResults, setBudgetResults] = useState([]);
  const [budgetSearched, setBudgetSearched] = useState(false);

  const allProducts = products.length > 0 ? products : ALL_PRODUCTS;

  // Smart Search
  const handleSearch = (val) => {
    setSearchQuery(val);
    if (val.length < 2) { setSearchResults([]); setShowSuggestions(false); return; }
    const results = allProducts.filter(p =>
      p.name.toLowerCase().includes(val.toLowerCase()) ||
      p.category.toLowerCase().includes(val.toLowerCase())
    ).slice(0, 8);
    setSearchResults(results);
    setShowSuggestions(true);
  };

  // Budget Assistant
  const handleBudgetSearch = () => {
    const b = Number(budget);
    if (!b || b <= 0) { toast.error('Enter a valid budget amount'); return; }
    const results = allProducts.filter(p => Number(p.price) <= b)
      .sort((a, b) => b.rating - a.rating);
    setBudgetResults(results);
    setBudgetSearched(true);
    toast.success(`Found ${results.length} products under ₹${b.toLocaleString()}`);
  };

  const ProductCard = ({ p, reason, confidence }) => (
    <div className="shop-card">
      <div className="shop-img">
        {p.image?.startsWith('data:')
          ? <img src={p.image} alt={p.name} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8 }} />
          : p.image}
      </div>
      <p className="shop-category">{p.category}</p>
      <h4 className="shop-name">{p.name}</h4>
      {reason && (
        <p style={{ fontSize: '0.72rem', color: '#6366f1', background: '#eef2ff', padding: '2px 8px', borderRadius: 20, display: 'inline-block', marginBottom: 4 }}>
          🤖 {reason}
        </p>
      )}
      <div className="shop-rating"><Star size={13} fill="#f59e0b" color="#f59e0b" /> {p.rating || 4.0}</div>
      <p className="shop-price">₹{Number(p.price).toLocaleString()}</p>
      {confidence && <p style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center' }}>{confidence}% match</p>}
      <button className="btn-cart" onClick={() => navigate('/customer/shop')}>
        <ShoppingCart size={14} /> Add to Cart
      </button>
    </div>
  );

  return (
    <CustomerLayout title="AI Features" cartCount={cartCount} wishlistCount={wishlistCount}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 16, padding: '1.25rem 1.5rem', marginBottom: '1.5rem', color: 'white', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Brain size={32} />
        <div>
          <h3 style={{ margin: 0 }}>Your Personal AI Shopping Assistant</h3>
          <p style={{ margin: 0, opacity: 0.85, fontSize: '0.85rem' }}>Smart recommendations, search, budget planning & healthy suggestions</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="filter-tabs" style={{ marginBottom: '1.5rem' }}>
        {[
          { id: 'recommendations', label: '🎯 Recommendations' },
          { id: 'search',          label: '🔍 Smart Search' },
          { id: 'budget',          label: '💰 Budget Assistant' },
          { id: 'health',          label: '🥗 Health Suggestions' },
          { id: 'behavior',        label: '📊 My Behavior' },
        ].map(t => (
          <button key={t.id} className={`filter-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── RECOMMENDATIONS ── */}
      {tab === 'recommendations' && (
        <div className="table-card">
          <h3 className="chart-title"><Brain size={18} color="#6366f1" /> Personalized For You</h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem' }}>
            Based on your purchase history and browsing behavior
          </p>
          <div className="shop-grid">
            {PERSONALIZED.map(r => <ProductCard key={r.id} p={r} reason={r.reason} confidence={r.confidence} />)}
          </div>
          <div style={{ marginTop: '1.5rem', background: '#f8fafc', borderRadius: 12, padding: '1rem 1.25rem' }}>
            <h4 style={{ color: '#1e293b', marginBottom: 8 }}>🛒 Customers who bought <strong>iPhone 15</strong> also bought:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Wireless Earbuds', 'Phone Case', 'Laptop Stand', 'Bluetooth Speaker'].map(name => (
                <button key={name} className="quick-coupon-btn" onClick={() => navigate('/customer/shop')}>
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SMART SEARCH ── */}
      {tab === 'search' && (
        <div className="table-card">
          <h3 className="chart-title"><Search size={18} color="#6366f1" /> AI Smart Search</h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Start typing — AI suggests products instantly
          </p>

          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <div className="search-box" style={{ padding: '0.75rem 1rem', fontSize: '1rem' }}>
              <Search size={18} color="#6366f1" />
              <input
                placeholder="Search products, categories... (e.g. 'rice', 'electronics')"
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowSuggestions(true)}
                style={{ fontSize: '0.95rem', width: '100%' }}
                autoFocus
              />
              {searchQuery && (
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                  onClick={() => { setSearchQuery(''); setSearchResults([]); setShowSuggestions(false); }}>
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && searchResults.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100, border: '1.5px solid #e0e7ff', overflow: 'hidden' }}>
                {searchResults.map(p => (
                  <div key={p.id}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}
                    onClick={() => { setSearchQuery(p.name); setShowSuggestions(false); }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  >
                    <span style={{ fontSize: '1.25rem' }}>{p.image}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem' }}>{p.name}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{p.category}</p>
                    </div>
                    <strong style={{ color: '#6366f1' }}>₹{Number(p.price).toLocaleString()}</strong>
                  </div>
                ))}
                <div style={{ padding: '0.6rem 1rem', background: '#f8fafc', textAlign: 'center' }}>
                  <button className="btn-add" style={{ fontSize: '0.8rem' }} onClick={() => { navigate('/customer/shop'); setShowSuggestions(false); }}>
                    View all results in Shop →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Search Results */}
          {searchQuery.length >= 2 && !showSuggestions && (
            <>
              <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {searchResults.length} results for "<strong>{searchQuery}</strong>"
              </p>
              <div className="shop-grid">
                {searchResults.map(p => <ProductCard key={p.id} p={p} />)}
              </div>
            </>
          )}

          {searchQuery.length < 2 && (
            <div>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>💡 Try searching for:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['Rice', 'Electronics', 'Shoes', 'Milk', 'Laptop', 'Healthy', 'Snacks'].map(s => (
                  <button key={s} className="quick-coupon-btn" onClick={() => handleSearch(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── BUDGET ASSISTANT ── */}
      {tab === 'budget' && (
        <div className="table-card">
          <h3 className="chart-title"><IndianRupee size={18} color="#6366f1" /> Budget Shopping Assistant</h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Enter your budget and AI will show the best products within your range
          </p>

          <div style={{ display: 'flex', gap: 10, marginBottom: '1.5rem', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: 1, margin: 0 }}>
              <label style={{ fontWeight: 600, color: '#1e293b', marginBottom: 6, display: 'block' }}>Your Budget (₹)</label>
              <input
                className="form-input"
                type="number"
                placeholder="e.g. 2000"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleBudgetSearch()}
                style={{ fontSize: '1rem' }}
              />
            </div>
            <button className="btn-primary" style={{ width: 'auto', padding: '0.75rem 1.5rem' }} onClick={handleBudgetSearch}>
              <Zap size={16} /> Find Products
            </button>
          </div>

          {/* Quick Budget Buttons */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', width: '100%', margin: 0 }}>Quick select:</p>
            {[500, 1000, 2000, 5000, 10000].map(b => (
              <button key={b} className={`filter-tab ${budget == b ? 'active' : ''}`}
                onClick={() => { setBudget(String(b)); }}>
                Under ₹{b.toLocaleString()}
              </button>
            ))}
          </div>

          {budgetSearched && (
            <>
              <div style={{ background: '#eef2ff', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Brain size={18} color="#6366f1" />
                <span style={{ fontSize: '0.875rem', color: '#4338ca', fontWeight: 600 }}>
                  🤖 Found {budgetResults.length} products under ₹{Number(budget).toLocaleString()} — sorted by best rating
                </span>
              </div>
              {budgetResults.length === 0 ? (
                <div className="empty-state">
                  <span style={{ fontSize: '3rem' }}>😔</span>
                  <h3>No products found under ₹{Number(budget).toLocaleString()}</h3>
                  <p>Try increasing your budget</p>
                </div>
              ) : (
                <div className="shop-grid">
                  {budgetResults.slice(0, 8).map(p => <ProductCard key={p.id} p={p} />)}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── HEALTH SUGGESTIONS ── */}
      {tab === 'health' && (
        <div>
          <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 14, padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Salad size={24} color="#22c55e" />
            <div>
              <h3 style={{ color: '#166534', margin: 0 }}>AI Health & Food Suggestions</h3>
              <p style={{ color: '#16a34a', margin: 0, fontSize: '0.85rem' }}>Personalized healthy product recommendations based on your shopping habits</p>
            </div>
          </div>

          {HEALTH_SUGGESTIONS.map(section => (
            <div key={section.category} className="table-card" style={{ marginBottom: '1.25rem' }}>
              <h3 className="chart-title" style={{ marginBottom: '1rem' }}>{section.category}</h3>
              <div className="shop-grid">
                {section.items.map(p => <ProductCard key={p.id} p={p} reason="AI Health Pick" />)}
              </div>
            </div>
          ))}

          {/* Health Tips */}
          <div className="table-card">
            <h3 className="chart-title"><Brain size={18} color="#22c55e" /> 🤖 AI Nutrition Tips</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
              {[
                { icon: '🌅', tip: 'Start your day with Oats + Honey for sustained energy throughout the morning.' },
                { icon: '💪', tip: 'Almonds are a great protein snack. Eat 10-15 almonds daily for better health.' },
                { icon: '🥛', tip: 'Milk provides calcium and protein. 1-2 glasses daily is recommended.' },
                { icon: '🍵', tip: 'Green Tea has antioxidants. Replace your evening coffee with green tea.' },
              ].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '0.75rem 1rem', background: '#f0fdf4', borderRadius: 10 }}>
                  <span style={{ fontSize: '1.5rem' }}>{t.icon}</span>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#166534' }}>{t.tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── BEHAVIOR ── */}
      {tab === 'behavior' && (
        <div className="charts-grid">
          <div className="chart-card">
            <h3 className="chart-title"><TrendingUp size={18} color="#6366f1" /> Monthly Spending</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlySpend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" /><YAxis />
                <Tooltip formatter={v => '₹' + v.toLocaleString()} />
                <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-card">
            <h3 className="chart-title"><ShoppingBag size={18} color="#6366f1" /> Category Preference</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={behaviorData} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="category">
                  {behaviorData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={v => v + '%'} /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-card wide">
            <h3 className="chart-title"><Heart size={18} color="#6366f1" /> Shopping Behavior Radar</h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid /><PolarAngleAxis dataKey="subject" />
                <Radar name="You" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </CustomerLayout>
  );
}
