import React, { useState } from 'react';
import CustomerLayout from '../../../components/customer/CustomerLayout';
import { Tag, Copy, Clock, Percent, IndianRupee, Gift, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const OFFERS = [
  {
    id: 1, code: 'SAVE10', type: 'percentage', discount: 10, minOrder: 500,
    maxDiscount: 200, category: 'All Categories', expiry: '2026-12-31',
    description: '10% off on all products', tag: 'Popular', tagColor: '#ef4444',
    icon: '🎉',
  },
  {
    id: 2, code: 'FLAT50', type: 'flat', discount: 50, minOrder: 300,
    maxDiscount: 50, category: 'Groceries', expiry: '2026-06-30',
    description: '₹50 flat off on Groceries', tag: 'Groceries', tagColor: '#22c55e',
    icon: '🛒',
  },
  {
    id: 3, code: 'ELEC20', type: 'percentage', discount: 20, minOrder: 2000,
    maxDiscount: 1000, category: 'Electronics', expiry: '2026-07-15',
    description: '20% off on Electronics', tag: 'Electronics', tagColor: '#3b82f6',
    icon: '📱',
  },
  {
    id: 4, code: 'WELCOME', type: 'flat', discount: 100, minOrder: 500,
    maxDiscount: 100, category: 'All Categories', expiry: '2026-12-31',
    description: '₹100 off for new users', tag: 'New User', tagColor: '#8b5cf6',
    icon: '👋',
  },
  {
    id: 5, code: 'FESTIVE25', type: 'percentage', discount: 25, minOrder: 1000,
    maxDiscount: 500, category: 'All Categories', expiry: '2026-08-15',
    description: '25% off — Festival Special Offer!', tag: '🎊 Festival', tagColor: '#f97316',
    icon: '🎊',
  },
  {
    id: 6, code: 'CASHBACK15', type: 'percentage', discount: 15, minOrder: 800,
    maxDiscount: 300, category: 'All Categories', expiry: '2026-09-30',
    description: '15% cashback on all orders', tag: 'Cashback', tagColor: '#06b6d4',
    icon: '💰',
  },
];

const daysLeft = (expiry) => {
  const diff = Math.ceil((new Date(expiry) - new Date()) / (1000 * 60 * 60 * 24));
  return diff;
};

export default function Offers({ cartCount, wishlistCount }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'All Categories', 'Electronics', 'Groceries'];

  const filtered = OFFERS.filter(o =>
    filter === 'All' || o.category === filter
  );

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon code "${code}" copied! Apply it in your cart.`);
  };

  return (
    <CustomerLayout title="Offers & Coupons" cartCount={cartCount} wishlistCount={wishlistCount}>

      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        borderRadius: 16, padding: '1.5rem 2rem', marginBottom: '1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        color: 'white',
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem' }}>🎉 Exclusive Offers For You!</h2>
          <p style={{ margin: '4px 0 0', opacity: 0.85, fontSize: '0.9rem' }}>
            Copy a coupon code and apply it in your cart to save money
          </p>
        </div>
        <div style={{ fontSize: '3rem' }}>🏷️</div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs" style={{ marginBottom: '1.5rem' }}>
        {categories.map(c => (
          <button key={c} className={`filter-tab ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>
            {c}
          </button>
        ))}
      </div>

      {/* Offer Cards */}
      <div className="offer-grid">
        {filtered.map(offer => {
          const days = daysLeft(offer.expiry);
          const expiringSoon = days <= 7;
          return (
            <div key={offer.id} className="offer-card">
              {/* Tag */}
              <div className="offer-tag" style={{ background: offer.tagColor }}>
                {offer.tag}
              </div>

              {/* Icon & Discount */}
              <div className="offer-top">
                <div className="offer-icon">{offer.icon}</div>
                <div className="offer-discount">
                  {offer.type === 'percentage'
                    ? <><Percent size={18} />{offer.discount}% OFF</>
                    : <><IndianRupee size={18} />{offer.discount} OFF</>
                  }
                </div>
              </div>

              <p className="offer-desc">{offer.description}</p>

              {/* Details */}
              <div className="offer-details">
                <div className="offer-detail"><span>Min Order</span><strong>₹{offer.minOrder}</strong></div>
                <div className="offer-detail"><span>Max Discount</span><strong>₹{offer.maxDiscount}</strong></div>
                <div className="offer-detail"><span>Category</span><strong>{offer.category}</strong></div>
                <div className="offer-detail">
                  <span>Expires</span>
                  <strong style={{ color: expiringSoon ? '#ef4444' : '#22c55e' }}>
                    {expiringSoon ? `⚠️ ${days} days left` : offer.expiry}
                  </strong>
                </div>
              </div>

              {/* Expiry bar */}
              {expiringSoon && (
                <div style={{ background: '#fff5f5', borderRadius: 8, padding: '6px 10px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={13} color="#ef4444" />
                  <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>Expiring soon! Only {days} days left</span>
                </div>
              )}

              {/* Coupon Code + Copy */}
              <div className="offer-code-row">
                <div className="offer-code">
                  <Tag size={14} color="#6366f1" />
                  <span>{offer.code}</span>
                </div>
                <button className="offer-copy-btn" onClick={() => copyCode(offer.code)}>
                  <Copy size={14} /> Copy Code
                </button>
              </div>

              <button
                className="btn-primary"
                style={{ marginTop: 10, fontSize: '0.85rem', padding: '0.6rem' }}
                onClick={() => { copyCode(offer.code); navigate('/customer/cart'); }}
              >
                <Zap size={15} /> Apply & Shop Now
              </button>
            </div>
          );
        })}
      </div>

      {/* How to use */}
      <div style={{ background: '#f8fafc', borderRadius: 14, padding: '1.25rem 1.5rem', marginTop: '2rem', border: '1.5px solid #e2e8f0' }}>
        <h3 style={{ color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Gift size={18} color="#6366f1" /> How to Use Coupons
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {[
            { step: '1', text: 'Browse offers and copy coupon code', icon: '🏷️' },
            { step: '2', text: 'Add products to your cart', icon: '🛒' },
            { step: '3', text: 'Enter coupon code in cart', icon: '✏️' },
            { step: '4', text: 'Enjoy your discount!', icon: '🎉' },
          ].map(s => (
            <div key={s.step} style={{ textAlign: 'center', padding: '0.75rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: 6 }}>{s.icon}</div>
              <div style={{ width: 24, height: 24, background: '#6366f1', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, margin: '0 auto 6px' }}>{s.step}</div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </CustomerLayout>
  );
}
