import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import '../Login/Auth.css';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      toast.success('Account created! Welcome aboard!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
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
            <h2>Create Account</h2>
            <p>Join thousands of happy shoppers</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-icon-wrap">
                <FiUser className="input-icon" />
                <input type="text" className="form-control" placeholder="John Doe"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-icon-wrap">
                <FiMail className="input-icon" />
                <input type="email" className="form-control" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="input-icon-wrap">
                <FiLock className="input-icon" />
                <input type={showPw ? 'text' : 'password'} className="form-control" placeholder="Min. 6 characters"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-icon-wrap">
                <FiLock className="input-icon" />
                <input type={showPw ? 'text' : 'password'} className="form-control" placeholder="Repeat password"
                  value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required />
              </div>
            </div>

            <label className="form-group" style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" required style={{ marginTop: 2 }} />
              <span style={{ fontSize: 13, color: 'var(--gray-600)' }}>
                I agree to the <Link to="/terms" className="auth-link">Terms of Service</Link> and{' '}
                <Link to="/privacy" className="auth-link">Privacy Policy</Link>
              </span>
            </label>

            <button type="submit" className="btn btn-primary btn-lg auth-btn" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : 'Create Account'}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
