import React from 'react';
import CustomerLayout from '../../../components/customer/CustomerLayout';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Wishlist({ wishlist, setWishlist, cart, setCart }) {
  const navigate = useNavigate();

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter(w => w.id !== id));
    toast.success('Removed from wishlist');
  };

  const moveToCart = (item) => {
    const exists = cart.find(c => c.id === item.id);
    if (exists) {
      setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
    setWishlist(wishlist.filter(w => w.id !== item.id));
    toast.success('Moved to cart!');
  };

  return (
    <CustomerLayout title="My Wishlist">
      {wishlist.length === 0 ? (
        <div className="empty-state">
          <Heart size={64} color="#fecdd3" />
          <h3>Your wishlist is empty</h3>
          <p>Save items you love for later</p>
          <button className="btn-primary" style={{ width: 'auto', padding: '0.75rem 2rem', marginTop: '1rem' }} onClick={() => navigate('/customer/shop')}>
            Browse Products
          </button>
        </div>
      ) : (
        <div className="shop-grid">
          {wishlist.map(item => (
            <div key={item.id} className="shop-card">
              <div className="shop-img">{item.image}</div>
              <p className="shop-category">{item.category}</p>
              <h4 className="shop-name">{item.name}</h4>
              <p className="shop-price">₹{item.price.toLocaleString()}</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button className="btn-cart" style={{ flex: 1 }} onClick={() => moveToCart(item)}>
                  <ShoppingCart size={15} /> Move to Cart
                </button>
                <button className="icon-btn red" onClick={() => removeFromWishlist(item.id)}><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </CustomerLayout>
  );
}
