import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import Products from './pages/admin/products/Products';
import Categories from './pages/admin/products/Categories';
import Inventory from './pages/admin/products/Inventory';
import Orders from './pages/admin/orders/Orders';
import Customers from './pages/admin/customers/Customers';
import AIFeatures from './pages/admin/AIFeatures';
import Reports from './pages/admin/Reports';
import Suppliers from './pages/admin/suppliers/Suppliers';
import Coupons from './pages/admin/coupons/Coupons';
import Payments from './pages/admin/payments/Payments';
import Delivery from './pages/admin/delivery/Delivery';
import Returns from './pages/admin/returns/Returns';

// Customer
import CustomerDashboard from './pages/customer/CustomerDashboard';
import Shop from './pages/customer/shop/Shop';
import Cart from './pages/customer/shop/Cart';
import Wishlist from './pages/customer/shop/Wishlist';
import Payment from './pages/customer/shop/Payment';
import Offers from './pages/customer/shop/Offers';
import MyOrders from './pages/customer/orders/MyOrders';
import Profile from './pages/customer/profile/Profile';
import CustomerAI from './pages/customer/ai/CustomerAI';
import CustomerPayments from './pages/customer/payments/CustomerPayments';
import CustomerReturns from './pages/customer/returns/CustomerReturns';

import './App.css';

// Default products — always available
const DEFAULT_PRODUCTS = [
  { id: 1,  name: 'Basmati Rice',     category: 'Groceries',   price: 120,   stock: 50, unit: 'Kg',     image: '🌾', status: 'Active', rating: 4.6 },
  { id: 2,  name: 'Olive Oil 1L',     category: 'Groceries',   price: 450,   stock: 12, unit: 'L',      image: '🫙', status: 'Active', rating: 4.4 },
  { id: 3,  name: 'iPhone 15',        category: 'Electronics', price: 79999, stock: 10, unit: 'Nos',    image: '📱', status: 'Active', rating: 4.8 },
  { id: 4,  name: 'Wireless Earbuds', category: 'Electronics', price: 2499,  stock: 15, unit: 'Nos',    image: '🎧', status: 'Active', rating: 4.5 },
  { id: 5,  name: 'Laptop',           category: 'Electronics', price: 55000, stock: 8,  unit: 'Nos',    image: '💻', status: 'Active', rating: 4.7 },
  { id: 6,  name: 'Nike T-Shirt',     category: 'Clothing',    price: 999,   stock: 25, unit: 'Pcs',    image: '👕', status: 'Active', rating: 4.3 },
  { id: 7,  name: 'Denim Jeans',      category: 'Clothing',    price: 1499,  stock: 10, unit: 'Pcs',    image: '👖', status: 'Active', rating: 4.2 },
  { id: 8,  name: 'Running Shoes',    category: 'Clothing',    price: 3999,  stock: 12, unit: 'Pcs',    image: '👟', status: 'Active', rating: 4.2 },
  { id: 9,  name: 'Milk 1L',          category: 'Dairy',       price: 60,    stock: 30, unit: 'L',      image: '🥛', status: 'Active', rating: 4.7 },
  { id: 10, name: 'Curd 500g',        category: 'Dairy',       price: 45,    stock: 20, unit: 'Pkt',    image: '🍶', status: 'Active', rating: 4.5 },
  { id: 11, name: 'Butter 100g',      category: 'Dairy',       price: 55,    stock: 18, unit: 'Pkt',    image: '🧈', status: 'Active', rating: 4.4 },
  { id: 12, name: 'Coca Cola',        category: 'Beverages',   price: 40,    stock: 30, unit: 'Can',    image: '🥤', status: 'Active', rating: 4.3 },
  { id: 13, name: 'Orange Juice',     category: 'Beverages',   price: 180,   stock: 18, unit: 'Bottle', image: '🍊', status: 'Active', rating: 4.3 },
  { id: 14, name: 'Mineral Water',    category: 'Beverages',   price: 20,    stock: 50, unit: 'Bottle', image: '💧', status: 'Active', rating: 4.0 },
  { id: 15, name: 'Lays Chips',       category: 'Snacks',      price: 20,    stock: 40, unit: 'Pkt',    image: '🍟', status: 'Active', rating: 4.0 },
  { id: 16, name: 'Almonds 500g',     category: 'Snacks',      price: 650,   stock: 20, unit: 'Pkt',    image: '🥜', status: 'Active', rating: 4.6 },
  { id: 17, name: 'Biscuits',         category: 'Snacks',      price: 30,    stock: 35, unit: 'Pkt',    image: '🍪', status: 'Active', rating: 4.1 },
];

// Load from localStorage or use defaults
function loadProducts() {
  try {
    const saved = localStorage.getItem('smartretail_products');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return DEFAULT_PRODUCTS;
}

// Save to localStorage whenever products change
function saveProducts(products) {
  try {
    localStorage.setItem('smartretail_products', JSON.stringify(products));
  } catch (e) {}
}

const AdminRoute    = ({ children }) => <ProtectedRoute role="ADMIN">{children}</ProtectedRoute>;
const CustomerRoute = ({ children }) => <ProtectedRoute role="CUSTOMER">{children}</ProtectedRoute>;

function App() {
  const [products, setProductsState] = useState(loadProducts);
  const [cart, setCart]         = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders]     = useState([]);

  // Every time products change → save to localStorage
  const setProducts = (newProducts) => {
    const updated = typeof newProducts === 'function' ? newProducts(products) : newProducts;
    saveProducts(updated);
    setProductsState(updated);
  };

  // On first load, if localStorage is empty, save defaults
  useEffect(() => {
    if (!localStorage.getItem('smartretail_products')) {
      saveProducts(DEFAULT_PRODUCTS);
    }
  }, []);

  const sharedProps = { cart, setCart, wishlist, setWishlist, orders, setOrders };
  const counts      = { cartCount: cart.reduce((s, i) => s + i.qty, 0), wishlistCount: wishlist.length };

  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login"           element={<Login />} />
          <Route path="/signup"          element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password"  element={<ResetPassword />} />

          {/* Admin */}
          <Route path="/admin/dashboard"  element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/products"   element={<AdminRoute><Products products={products} setProducts={setProducts} /></AdminRoute>} />
          <Route path="/admin/categories" element={<AdminRoute><Categories /></AdminRoute>} />
          <Route path="/admin/inventory"  element={<AdminRoute><Inventory products={products} setProducts={setProducts} /></AdminRoute>} />
          <Route path="/admin/suppliers"  element={<AdminRoute><Suppliers /></AdminRoute>} />
          <Route path="/admin/coupons"    element={<AdminRoute><Coupons /></AdminRoute>} />
          <Route path="/admin/payments"   element={<AdminRoute><Payments /></AdminRoute>} />
          <Route path="/admin/orders"     element={<AdminRoute><Orders /></AdminRoute>} />
          <Route path="/admin/delivery"    element={<AdminRoute><Delivery /></AdminRoute>} />
          <Route path="/admin/returns"     element={<AdminRoute><Returns /></AdminRoute>} />
          <Route path="/admin/customers"  element={<AdminRoute><Customers /></AdminRoute>} />
          <Route path="/admin/ai"         element={<AdminRoute><AIFeatures /></AdminRoute>} />
          <Route path="/admin/reports"    element={<AdminRoute><Reports /></AdminRoute>} />

          {/* Customer */}
          <Route path="/customer/dashboard" element={<CustomerRoute><CustomerDashboard {...counts} products={products} /></CustomerRoute>} />
          <Route path="/customer/shop"      element={<CustomerRoute><Shop {...sharedProps} {...counts} products={products} /></CustomerRoute>} />
          <Route path="/customer/offers"    element={<CustomerRoute><Offers {...counts} /></CustomerRoute>} />
          <Route path="/customer/cart"      element={<CustomerRoute><Cart {...sharedProps} {...counts} /></CustomerRoute>} />
          <Route path="/customer/wishlist"  element={<CustomerRoute><Wishlist {...sharedProps} {...counts} /></CustomerRoute>} />
          <Route path="/customer/payment"   element={<CustomerRoute><Payment {...sharedProps} {...counts} /></CustomerRoute>} />
          <Route path="/customer/orders"    element={<CustomerRoute><MyOrders {...sharedProps} {...counts} /></CustomerRoute>} />
          <Route path="/customer/payments"   element={<CustomerRoute><CustomerPayments {...counts} /></CustomerRoute>} />
          <Route path="/customer/returns"    element={<CustomerRoute><CustomerReturns {...counts} /></CustomerRoute>} />
          <Route path="/customer/profile"   element={<CustomerRoute><Profile {...counts} /></CustomerRoute>} />
          <Route path="/customer/ai"        element={<CustomerRoute><CustomerAI {...counts} products={products} /></CustomerRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
