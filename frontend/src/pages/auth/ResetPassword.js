import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingCart, Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await authAPI.resetPassword({ token, newPassword: form.newPassword });
      setSuccess(true);
      toast.success('Password reset successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <p style={{ color: '#ef4444', textAlign: 'center' }}>Invalid reset link.</p>
          <Link to="/forgot-password" className="btn-primary" style={{ display: 'block', textAlign: 'center', marginTop: '1rem' }}>
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

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

        {success ? (
          <div className="success-state">
            <div className="success-icon"><CheckCircle size={40} color="#22c55e" /></div>
            <h2 className="auth-title">Password Reset!</h2>
            <p className="auth-subtitle">Redirecting to login...</p>
          </div>
        ) : (
          <>
            <h2 className="auth-title">Reset Password</h2>
            <p className="auth-subtitle">Enter your new password</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>New Password</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={form.newPassword}
                    onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                    required
                    minLength={6}
                    className="form-input"
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  required
                  className="form-input"
                />
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <Loader2 size={20} className="spin" /> : 'Reset Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
