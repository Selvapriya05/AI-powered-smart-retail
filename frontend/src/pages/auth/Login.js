import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, User, Shield, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [selectedRole, setSelectedRole] = useState('CUSTOMER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to correct dashboard
  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') navigate('/admin/dashboard', { replace: true });
      else navigate('/customer/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Enter email and password'); return; }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Invalid email or password');
        return;
      }

      // Warn if role doesn't match selection but still allow login
      if (data.role !== selectedRole) {
        toast(`Logged in as ${data.role === 'ADMIN' ? 'Admin' : 'Customer'}`, { icon: 'ℹ️' });
      }

      login(data);
      toast.success('Welcome, ' + data.fullName + '!');

      if (data.role === 'ADMIN') navigate('/admin/dashboard', { replace: true });
      else navigate('/customer/dashboard', { replace: true });

    } catch (err) {
      toast.error('Cannot connect to server. Make sure backend is running on port 8080.');
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

      <div className="auth-card">
        <div className="auth-logo">
          <ShoppingBag size={30} color="#6366f1" />
          <span>SmartRetail</span>
        </div>

        <h2 className="auth-title">Sign In</h2>
        <p className="auth-subtitle">Select your role and sign in</p>

        {/* Role Selector */}
        <div className="role-selector">
          <button
            type="button"
            className={`role-btn ${selectedRole === 'CUSTOMER' ? 'active' : ''}`}
            onClick={() => setSelectedRole('CUSTOMER')}
          >
            <User size={18} /> <span>Customer</span>
          </button>
          <button
            type="button"
            className={`role-btn ${selectedRole === 'ADMIN' ? 'active' : ''}`}
            onClick={() => setSelectedRole('ADMIN')}
          >
            <Shield size={18} /> <span>Admin</span>
          </button>
        </div>

        <div className={`role-badge ${selectedRole === 'ADMIN' ? 'admin' : 'customer'}`}>
          {selectedRole === 'ADMIN' ? '🛡️ Signing in as Administrator' : '🛍️ Signing in as Customer'}
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
                autoComplete="current-password"
              />
              <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="forgot-link">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button
            type="submit"
            className={`btn-primary ${selectedRole === 'ADMIN' ? 'btn-admin' : ''}`}
            disabled={loading}
          >
            {loading
              ? <Loader2 size={20} className="spin" />
              : `Sign In as ${selectedRole === 'ADMIN' ? 'Admin' : 'Customer'}`
            }
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
}
