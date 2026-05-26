import React, { useState } from 'react';
import CustomerLayout from '../../../components/customer/CustomerLayout';
import { Search, Heart, ShoppingCart, Star, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const badgeColor = { Hot: '#ef4444', New: '#3b82f6', 'Best Seller': '#f59e0b', Sale: '#22c55e' };

export default function Shop({ cart, setCart, wishlist, setWishlist, cartCount, wishlistCount, products = [] }) {
  const [search, setSearch]   = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort]       = useState('default');

  // Build category list dynamically from products
  const categories = ['All', ...new Set(products.map(p => p.category))];

  // Only show Active products to customers
  const filtered = products
    .filter(p => p.status !== 'Low Stock' ? true : true) // show all including low stock
    .filter(p => (category === 'All' || p.category === category) &&
      p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sort === 'low'    ? a.price - b.price :
      sort === 'high'   ? b.price - a.price :
      sort === 'rating' ? (b.rating || 0) - (a.rating || 0) : 0
    );

  const addToCart = (p) => {
    const exists = cart.find(c => c.id === p.id);
    if (exists) {
      setCart(cart.map(c => c.id === p.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...p, qty: 1 }]);
    }
    toast.success(`${p.name} added to cart!`);
  };

  const toggleWishlist = (p) => {
    const exists = wishlist.find(w => w.id === p.id);
    if (exists) {
      setWishlist(wishlist.filter(w => w.id !== p.id));
      toast.success('Removed from wishlist');
    } else {
      setWishlist([...wishlist, p]);
      toast.success('Added to wishlist!');
    }
  };

  return (
    <CustomerLayout title="Shop" cartCount={cartCount} wishlistCount={wishlistCount}>
      {/* Search & Sort */}
      <div className="toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Filter size={16} color="#64748b" />
          <select
            className="form-input"
            style={{ padding: '0.5rem 0.75rem', width: 'auto' }}
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            <option value="default">Sort: Default</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Category Tabs — dynamic from products */}
      <div className="filter-tabs" style={{ marginBottom: '1.5rem' }}>
        {categories.map(c => (
          <button
            key={c}
            className={`filter-tab ${category === c ? 'active' : ''}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Products count */}
      <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem' }}>
        Showing <strong>{filtered.length}</strong> products
      </p>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: '3rem' }}>🛍️</span>
          <h3>No products found</h3>
          <p>Try a different category or search term</p>
        </div>
      ) : (
        <div className="shop-grid">
          {filtered.map(p => {
            const inWishlist = wishlist.find(w => w.id === p.id);
            const inCart     = cart.find(c => c.id === p.id);
            return (
              <div key={p.id} className="shop-card">
                {/* Low stock badge */}
                {p.status === 'Low Stock' && (
                  <span className="shop-badge" style={{ background: '#f97316' }}>Low Stock</span>
                )}
                {/* Wishlist button */}
                <button
                  className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
                  onClick={() => toggleWishlist(p)}
                >
                  <Heart size={16} fill={inWishlist ? '#ef4444' : 'none'} color={inWishlist ? '#ef4444' : '#94a3b8'} />
                </button>

                {/* Image */}
                <div className="shop-img">
                  {p.image?.startsWith('data:')
                    ? <img src={p.image} alt={p.name} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 10 }} />
                    : p.image}
                </div>

                <p className="shop-category">{p.category}</p>
                <h4 className="shop-name">{p.name}</h4>

                {/* Rating */}
                <div className="shop-rating">
                  <Star size={13} fill="#f59e0b" color="#f59e0b" />
                  {p.rating || '4.0'}
                </div>

                {/* Unit */}
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 4 }}>
                  Per {p.unit || 'unit'}
                </p>

                <p className="shop-price">₹{Number(p.price).toLocaleString()}</p>

                <button
                  className={`btn-cart ${inCart ? 'in-cart' : ''}`}
                  onClick={() => addToCart(p)}
                >
                  <ShoppingCart size={15} />
                  {inCart ? `In Cart (${inCart.qty})` : 'Add to Cart'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </CustomerLayout>
  );
}
