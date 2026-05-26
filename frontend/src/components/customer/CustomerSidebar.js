import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Home, ShoppingBag, ShoppingCart, Heart, Package,
  User, LogOut, ChevronLeft, ChevronRight, Brain, Tag, CreditCard, RefreshCw
} from 'lucide-react';

export default function CustomerSidebar({ cartCount = 0, wishlistCount = 0 }) {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { path: '/customer/dashboard', icon: <Home size={20} />,         label: 'Home' },
    { path: '/customer/shop',      icon: <ShoppingBag size={20} />,  label: 'Shop' },
    { path: '/customer/offers',    icon: <Tag size={20} />,          label: 'Offers & Coupons' },
    { path: '/customer/cart',      icon: <ShoppingCart size={20} />, label: 'Cart', badge: cartCount },
    { path: '/customer/wishlist',  icon: <Heart size={20} />,        label: 'Wishlist', badge: wishlistCount },
    { path: '/customer/orders',    icon: <Package size={20} />,      label: 'My Orders' },
    { path: '/customer/payments',  icon: <CreditCard size={20} />,   label: 'My Payments' },
    { path: '/customer/returns',   icon: <RefreshCw size={20} />,    label: 'Returns & Refunds' },
    { path: '/customer/ai',        icon: <Brain size={20} />,        label: 'AI Features' },
    { path: '/customer/profile',   icon: <User size={20} />,         label: 'Profile' },
  ];

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <ShoppingBag size={24} />
          {!collapsed && <span>SmartRetail</span>}
        </div>
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      {!collapsed && (
        <div className="sidebar-user">
          <div className="sidebar-avatar">{user?.fullName?.charAt(0)}</div>
          <div>
            <p className="sidebar-name">{user?.fullName}</p>
            <p className="sidebar-role">Customer</p>
          </div>
        </div>
      )}
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button key={item.path} className={`nav-item ${location.pathname === item.path ? 'active' : ''}`} onClick={() => navigate(item.path)}>
            <span style={{ position: 'relative' }}>
              {item.icon}
              {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
            </span>
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
      <button className="logout-btn" onClick={() => { logout(); navigate('/login'); }}>
        <LogOut size={20} />
        {!collapsed && <span>Logout</span>}
      </button>
    </aside>
  );
}
