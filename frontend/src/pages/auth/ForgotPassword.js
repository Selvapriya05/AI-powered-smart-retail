import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Loader2, ArrowLeft, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword({ email });
      setSent(true);
      toast.success('Reset link sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email');
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
          <ShoppingCart size={32} color="#6366f1" />
          <span>SmartRetail</span>
        </div>

        {sent ? (
          <div className="success-state">
            <div className="success-icon"><Mail size={40} color="#6366f1" /></div>
            <h2 className="auth-title">Check Your Email</h2>
            <p className="auth-subtitle">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <Link to="/login" className="btn-primary" style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem' }}>
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <h2 className="auth-title">Forgot Password?</h2>
            <p className="auth-subtitle">Enter your email to receive a reset link</p>

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
                />
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <Loader2 size={20} className="spin" /> : 'Send Reset Link'}
              </button>
            </form>

            <p className="auth-switch">
              <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                <ArrowLeft size={16} /> Back to Login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
