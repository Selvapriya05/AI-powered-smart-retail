import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart2,
  LogOut, ChevronLeft, ChevronRight, ShoppingBag, Tag,
  Warehouse, Brain, FileText, Truck, Ticket, CreditCard, MapPin, RefreshCw
} from 'lucide-react';

const navItems = [
  { path: '/admin/dashboard',  icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { path: '/admin/products',   icon: <Package size={20} />,         label: 'Products' },
  { path: '/admin/categories', icon: <Tag size={20} />,             label: 'Categories' },
  { path: '/admin/inventory',  icon: <Warehouse size={20} />,       label: 'Inventory' },
  { path: '/admin/suppliers',  icon: <Truck size={20} />,           label: 'Suppliers' },
  { path: '/admin/orders',     icon: <ShoppingCart size={20} />,    label: 'Orders' },
  { path: '/admin/delivery',   icon: <MapPin size={20} />,          label: 'Delivery' },
  { path: '/admin/returns',    icon: <RefreshCw size={20} />,       label: 'Returns & Refunds' },
  { path: '/admin/customers',  icon: <Users size={20} />,           label: 'Customers' },
  { path: '/admin/payments',   icon: <CreditCard size={20} />,      label: 'Payments' },
  { path: '/admin/coupons',    icon: <Ticket size={20} />,          label: 'Coupons & Offers' },
  { path: '/admin/ai',         icon: <Brain size={20} />,           label: 'AI Features' },
  { path: '/admin/reports',    icon: <FileText size={20} />,        label: 'Reports' },
];

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

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
            <p className="sidebar-role">Administrator</p>
          </div>
        </div>
      )}

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button key={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}>
            {item.icon}
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
