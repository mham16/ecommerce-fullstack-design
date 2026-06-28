import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card card">
          <div className="auth-header">
            <Link to="/" className="auth-logo">🛒 BrandStore</Link>
            <h2>Welcome Back</h2>
            <p>Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-icon-wrap">
                <FiMail className="input-icon" />
                <input
                  type="email"
                  className="form-control"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label>Password</label>
                <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
              </div>
              <div className="input-icon-wrap">
                <FiLock className="input-icon" />
                <input
                  type={showPw ? 'text' : 'password'}
                  className="form-control"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg auth-btn" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : 'Sign In'}
            </button>
          </form>

          <div className="auth-divider"><span>or</span></div>

          <div className="social-btns">
            <button className="social-btn">🌐 Continue with Google</button>
            <button className="social-btn">🍎 Continue with Apple</button>
          </div>

          <p className="auth-footer">
            Don't have an account? <Link to="/signup" className="auth-link">Create one</Link>
          </p>
        </div>

        <div className="auth-info">
          <div className="auth-info-card">
            <h3>🔒 Demo Admin Access</h3>
            <p>Email: <strong>admin@test.com</strong></p>
            <p>Password: <strong>admin123</strong></p>
          </div>
          <div className="auth-info-card">
            <h3>👤 Demo User Access</h3>
            <p>Email: <strong>user@test.com</strong></p>
            <p>Password: <strong>user123</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
