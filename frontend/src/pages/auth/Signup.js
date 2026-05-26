import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, User, Shield, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', phone: '', role: 'CUSTOMER',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const setRole = (r) => setForm({ ...form, role: r });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^[0-9]{10}$/.test(form.phone)) { toast.error('Phone must be 10 digits'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (response.ok) {
        login(data);
        toast.success('Account created successfully!');
        if (data.role === 'ADMIN') navigate('/admin/dashboard');
        else navigate('/customer/dashboard');
      } else {
        if (data.errors) Object.values(data.errors).forEach((m) => toast.error(m));
        else toast.error(data.message || 'Registration failed');
      }
    } catch (err) {
      toast.error('Cannot connect to server. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-bg">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      <div className="auth-card auth-card-wide">
        <div className="auth-logo">
          <ShoppingBag size={30} color="#6366f1" />
          <span>SmartRetail</span>
        </div>

        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Select your role and register</p>

        {/* Role Selector */}
        <div className="role-selector">
          <button
            type="button"
            className={`role-btn ${form.role === 'CUSTOMER' ? 'active' : ''}`}
            onClick={() => setRole('CUSTOMER')}
          >
            <User size={18} />
            <span>Customer</span>
          </button>
          <button
            type="button"
            className={`role-btn ${form.role === 'ADMIN' ? 'active' : ''}`}
            onClick={() => setRole('ADMIN')}
          >
            <Shield size={18} />
            <span>Admin</span>
          </button>
        </div>

        {/* Role Badge */}
        <div className={`role-badge ${form.role === 'ADMIN' ? 'admin' : 'customer'}`}>
          {form.role === 'ADMIN' ? '🛡️ Registering as Administrator' : '🛍️ Registering as Customer'}
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="fullName" placeholder="John Doe"
                value={form.fullName} onChange={handleChange} required className="form-input" />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" placeholder="9876543210"
                value={form.phone} onChange={handleChange} required className="form-input" />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange} required className="form-input" />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                className="form-input"
              />
              <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className={`btn-primary ${form.role === 'ADMIN' ? 'btn-admin' : ''}`} disabled={loading}>
            {loading ? <Loader2 size={20} className="spin" /> : `Register as ${form.role === 'ADMIN' ? 'Admin' : 'Customer'}`}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
