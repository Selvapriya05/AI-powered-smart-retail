import React, { useState } from 'react';
import CustomerLayout from '../../../components/customer/CustomerLayout';
import { Trash2, Plus, Minus, ShoppingBag, Tag, X, CheckCircle, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Same coupons as admin created
const VALID_COUPONS = {
  SAVE10:     { type: 'percentage', discount: 10,  minOrder: 500,  maxDiscount: 200,  desc: '10% off on all products' },
  FLAT50:     { type: 'flat',       discount: 50,   minOrder: 300,  maxDiscount: 50,   desc: '₹50 flat off on Groceries' },
  ELEC20:     { type: 'percentage', discount: 20,  minOrder: 2000, maxDiscount: 1000, desc: '20% off on Electronics' },
  WELCOME:    { type: 'flat',       discount: 100,  minOrder: 500,  maxDiscount: 100,  desc: '₹100 off for new users' },
  FESTIVE25:  { type: 'percentage', discount: 25,  minOrder: 1000, maxDiscount: 500,  desc: '25% off — Festival Special!' },
  CASHBACK15: { type: 'percentage', discount: 15,  minOrder: 800,  maxDiscount: 300,  desc: '15% cashback on all orders' },
};

const QUICK_COUPONS = ['SAVE10', 'WELCOME', 'FESTIVE25', 'CASHBACK15'];

export default function Cart({ cart, setCart, cartCount, wishlistCount }) {
  const navigate = useNavigate();
  const [couponInput, setCouponInput]   = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError]   = useState('');

  const updateQty = (id, delta) => {
    setCart(cart.map(c => c.id === id ? { ...c, qty: Math.max(1, c.qty + delta) } : c));
  };

  const remove = (id) => {
    setCart(cart.filter(c => c.id !== id));
    toast.success('Item removed from cart');
  };

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const tax      = Math.round(subtotal * 0.18);

  const calcDiscount = (coupon) => {
    if (!coupon) return 0;
    const c = VALID_COUPONS[coupon.code];
    if (!c) return 0;
    let disc = c.type === 'percentage' ? Math.round(subtotal * c.discount / 100) : c.discount;
    return Math.min(disc, c.maxDiscount);
  };

  const discount = calcDiscount(appliedCoupon);
  const grand    = subtotal + tax - discount;

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    setCouponError('');
    if (!code) { setCouponError('Please enter a coupon code'); return; }
    const coupon = VALID_COUPONS[code];
    if (!coupon) { setCouponError('Invalid coupon code'); return; }
    if (subtotal < coupon.minOrder) {
      setCouponError(`Minimum order ₹${coupon.minOrder} required for this coupon`);
      return;
    }
    const disc = coupon.type === 'percentage'
      ? Math.min(Math.round(subtotal * coupon.discount / 100), coupon.maxDiscount)
      : coupon.discount;
    setAppliedCoupon({ code, ...coupon, discountAmount: disc });
    toast.success(`Coupon "${code}" applied! You save ₹${disc}`);
    setCouponInput('');
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
    toast.success('Coupon removed');
  };

  return (
    <CustomerLayout title="My Cart" cartCount={cartCount} wishlistCount={wishlistCount}>
      {cart.length === 0 ? (
        <div className="empty-state">
          <ShoppingBag size={64} color="#c7d2fe" />
          <h3>Your cart is empty</h3>
          <p>Add some products to get started</p>
          <button className="btn-primary" style={{ width: 'auto', padding: '0.75rem 2rem', marginTop: '1rem' }}
            onClick={() => navigate('/customer/shop')}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Cart Items */}
          <div>
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-img">
                    {item.image?.startsWith('data:')
                      ? <img src={item.image} alt={item.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} />
                      : item.image}
                  </div>
                  <div className="cart-info">
                    <h4>{item.name}</h4>
                    <p className="cart-category">{item.category} • {item.unit}</p>
                    <p className="cart-price">₹{item.price.toLocaleString()}</p>
                  </div>
                  <div className="cart-qty">
                    <button onClick={() => updateQty(item.id, -1)}><Minus size={14} /></button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)}><Plus size={14} /></button>
                  </div>
                  <div className="cart-subtotal">₹{(item.price * item.qty).toLocaleString()}</div>
                  <button className="icon-btn red" onClick={() => remove(item.id)}><Trash2 size={15} /></button>
                </div>
              ))}
            </div>

            {/* Coupon Section */}
            <div className="coupon-section">
              <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem', color: '#1e293b' }}>
                <Tag size={18} color="#6366f1" /> Apply Coupon
              </h4>

              {appliedCoupon ? (
                <div className="coupon-applied">
                  <CheckCircle size={18} color="#22c55e" />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, color: '#22c55e', margin: 0 }}>{appliedCoupon.code} Applied!</p>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>{appliedCoupon.desc}</p>
                  </div>
                  <strong style={{ color: '#22c55e' }}>-₹{appliedCoupon.discountAmount}</strong>
                  <button className="icon-btn red" onClick={removeCoupon}><X size={14} /></button>
                </div>
              ) : (
                <>
                  <div className="coupon-input-row">
                    <input
                      className="form-input"
                      placeholder="Enter coupon code (e.g. SAVE10)"
                      value={couponInput}
                      onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                      onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                      style={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}
                    />
                    <button className="btn-apply-coupon" onClick={applyCoupon}>Apply</button>
                  </div>
                  {couponError && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: 6 }}>❌ {couponError}</p>}

                  {/* Quick Apply */}
                  <div style={{ marginTop: '0.75rem' }}>
                    <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: 6 }}>Quick apply:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {QUICK_COUPONS.map(code => (
                        <button key={code} className="quick-coupon-btn"
                          onClick={() => { setCouponInput(code); setCouponError(''); }}>
                          <Tag size={11} /> {code}
                        </button>
                      ))}
                      <button className="quick-coupon-btn" style={{ color: '#6366f1', borderColor: '#6366f1' }}
                        onClick={() => navigate('/customer/offers')}>
                        <Gift size={11} /> View All Offers
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row"><span>Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} items)</span><span>₹{subtotal.toLocaleString()}</span></div>
            <div className="summary-row"><span>GST (18%)</span><span>₹{tax.toLocaleString()}</span></div>
            <div className="summary-row"><span>Delivery</span><span style={{ color: '#22c55e' }}>FREE</span></div>
            {appliedCoupon && (
              <div className="summary-row" style={{ color: '#22c55e' }}>
                <span>🏷️ Coupon ({appliedCoupon.code})</span>
                <span style={{ fontWeight: 700 }}>-₹{appliedCoupon.discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="summary-divider" />
            <div className="summary-row total"><span>Total</span><span>₹{grand.toLocaleString()}</span></div>
            {appliedCoupon && (
              <div style={{ background: '#f0fdf4', borderRadius: 8, padding: '6px 10px', marginTop: 8, textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#22c55e', fontWeight: 700 }}>
                  🎉 You save ₹{appliedCoupon.discountAmount.toLocaleString()} with {appliedCoupon.code}!
                </span>
              </div>
            )}
            <button className="btn-primary" style={{ marginTop: '1rem' }}
              onClick={() => navigate('/customer/payment', { state: { total: grand, cart, coupon: appliedCoupon, discount } })}>
              Proceed to Payment
            </button>
          </div>
        </div>
      )}
    </CustomerLayout>
  );
}
