import React, { useState } from 'react';
import CustomerLayout from '../../../components/customer/CustomerLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Truck, CheckCircle, Loader2, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Payment({ setCart, setOrders, cartCount, wishlistCount }) {
  const { state }   = useLocation();
  const navigate    = useNavigate();
  const total       = state?.total || 0;
  const cartItems   = state?.cart  || [];
  const coupon      = state?.coupon || null;
  const discount    = state?.discount || 0;

  const [method, setMethod] = useState('upi');
  const [upi, setUpi]       = useState('');
  const [card, setCard]     = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const tax      = Math.round(subtotal * 0.18);

  const handlePay = async () => {
    if (method === 'upi' && !upi) { toast.error('Enter UPI ID'); return; }
    if (method === 'card' && (!card.number || !card.name || !card.expiry || !card.cvv)) {
      toast.error('Fill all card details'); return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    const newOrder = {
      id: '#ORD' + Date.now(),
      items: cartItems,
      total,
      status: 'Processing',
      date: new Date().toLocaleDateString(),
      method: method.toUpperCase(),
      coupon: coupon?.code || null,
      discount,
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setLoading(false);
    setSuccess(true);
    setTimeout(() => navigate('/customer/orders'), 2500);
  };

  if (success) return (
    <CustomerLayout title="Payment" cartCount={cartCount} wishlistCount={wishlistCount}>
      <div className="empty-state">
        <CheckCircle size={72} color="#22c55e" />
        <h2 style={{ color: '#22c55e', marginTop: '1rem' }}>Payment Successful!</h2>
        <p>Your order has been placed. Redirecting...</p>
      </div>
    </CustomerLayout>
  );

  return (
    <CustomerLayout title="Payment" cartCount={cartCount} wishlistCount={wishlistCount}>
      <div className="payment-layout">
        <div className="payment-form">
          <h3 style={{ marginBottom: '1.25rem', color: '#1e293b' }}>Choose Payment Method</h3>

          <div className="pay-methods">
            {[
              { id: 'upi',  icon: <Smartphone size={20} />, label: 'UPI' },
              { id: 'card', icon: <CreditCard size={20} />, label: 'Card' },
              { id: 'cod',  icon: <Truck size={20} />,      label: 'Cash on Delivery' },
            ].map(m => (
              <button key={m.id} className={`pay-method-btn ${method === m.id ? 'active' : ''}`} onClick={() => setMethod(m.id)}>
                {m.icon} {m.label}
              </button>
            ))}
          </div>

          {method === 'upi' && (
            <div className="form-group" style={{ marginTop: '1.25rem' }}>
              <label>UPI ID</label>
              <input className="form-input" placeholder="yourname@upi" value={upi} onChange={e => setUpi(e.target.value)} />
            </div>
          )}

          {method === 'card' && (
            <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Card Number</label>
                <input className="form-input" placeholder="1234 5678 9012 3456" maxLength={19}
                  value={card.number} onChange={e => setCard({ ...card, number: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Cardholder Name</label>
                <input className="form-input" placeholder="John Doe"
                  value={card.name} onChange={e => setCard({ ...card, name: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry</label>
                  <input className="form-input" placeholder="MM/YY" maxLength={5}
                    value={card.expiry} onChange={e => setCard({ ...card, expiry: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input className="form-input" placeholder="***" maxLength={3} type="password"
                    value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value })} />
                </div>
              </div>
            </div>
          )}

          {method === 'cod' && (
            <div className="alert-box" style={{ marginTop: '1.25rem', background: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' }}>
              <Truck size={18} /> Pay when your order arrives at your doorstep.
            </div>
          )}

          <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={handlePay} disabled={loading}>
            {loading
              ? <><Loader2 size={18} className="spin" /> Processing...</>
              : `Pay ₹${total.toLocaleString()}`}
          </button>
        </div>

        {/* Order Summary */}
        <div className="cart-summary">
          <h3>Order Summary</h3>
          {cartItems.map(item => (
            <div key={item.id} className="summary-row" style={{ fontSize: '0.875rem' }}>
              <span>{item.image} {item.name} ×{item.qty}</span>
              <span>₹{(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
          <div className="summary-divider" />
          <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
          <div className="summary-row"><span>GST (18%)</span><span>₹{tax.toLocaleString()}</span></div>
          <div className="summary-row"><span>Delivery</span><span style={{ color: '#22c55e' }}>FREE</span></div>
          {coupon && discount > 0 && (
            <div className="summary-row" style={{ color: '#22c55e' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Tag size={13} /> {coupon.code}
              </span>
              <span style={{ fontWeight: 700 }}>-₹{discount.toLocaleString()}</span>
            </div>
          )}
          <div className="summary-divider" />
          <div className="summary-row total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
          {coupon && discount > 0 && (
            <div style={{ background: '#f0fdf4', borderRadius: 8, padding: '6px 10px', marginTop: 8, textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#22c55e', fontWeight: 700 }}>
                🎉 Saved ₹{discount.toLocaleString()} with {coupon.code}!
              </span>
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
}
