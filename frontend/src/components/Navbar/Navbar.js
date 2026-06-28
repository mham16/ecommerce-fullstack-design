import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FiShoppingCart, FiUser, FiHeart, FiSearch, FiMenu, FiX,
  FiChevronDown, FiPackage, FiLogOut, FiSettings
} from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const CATEGORIES = [
  'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books',
  'Toys', 'Beauty', 'Automotive', 'Food', 'Health'
];

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/products?search=${search}&category=${category}`);
    setMobileOpen(false);
  };

  return (
    <nav className="navbar">
      {/* Top bar */}
      <div className="navbar-top">
        <div className="container">
          <span>📦 Free shipping on orders over $50!</span>
          <div style={{ display: 'flex', gap: 16 }}>
            <Link to="/login">Sign In</Link>
            <span>|</span>
            <Link to="/signup">Register</Link>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="navbar-main">
        <div className="container">
          <Link to="/" className="navbar-logo">
            🛒 <span>Brand</span>Store
          </Link>

          <form className="navbar-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select value={category} onChange={e => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button type="submit"><FiSearch /></button>
          </form>

          <div className="navbar-actions">
            {user ? (
              <div className="nav-dropdown">
                <button className="nav-icon-btn">
                  <FiUser />
                  <span>{user.name?.split(' ')[0]}</span>
                  <FiChevronDown size={12} style={{ position: 'absolute', bottom: 2, right: 2 }} />
                </button>
                <div className="nav-dropdown-menu">
                  <Link to="/orders"><FiPackage /> My Orders</Link>
                  {user.role === 'admin' && <Link to="/admin"><FiSettings /> Admin Panel</Link>}
                  <button onClick={logout} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '9px 16px', width: '100%', background: 'none',
                    border: 'none', color: 'var(--danger)', fontSize: 13, cursor: 'pointer'
                  }}>
                    <FiLogOut /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="nav-icon-btn">
                <FiUser />
                <span>Login</span>
              </Link>
            )}

            <Link to="/cart" className="nav-icon-btn">
              <FiShoppingCart />
              {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
              <span>Cart</span>
            </Link>

            <Link to="/wishlist" className="nav-icon-btn">
              <FiHeart />
              <span>Wishlist</span>
            </Link>

            <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {mobileOpen && (
          <div className="container" style={{ paddingTop: 12 }}>
            <form className="navbar-search" onSubmit={handleSearch} style={{ display: 'flex', maxWidth: '100%' }}>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button type="submit"><FiSearch /></button>
            </form>
          </div>
        )}
      </div>

      {/* Category nav */}
      <div className="navbar-bottom">
        <div className="container">
          <NavLink to="/" end className="nav-link">🏠 Home</NavLink>
          <div className="nav-dropdown">
            <NavLink to="/products" className="nav-link">
              Electronics <FiChevronDown size={13} />
            </NavLink>
            <div className="nav-dropdown-menu">
              <Link to="/products?category=Electronics">All Electronics</Link>
              <Link to="/products?category=Electronics&sub=phones">📱 Phones</Link>
              <Link to="/products?category=Electronics&sub=laptops">💻 Laptops</Link>
              <Link to="/products?category=Electronics&sub=cameras">📷 Cameras</Link>
              <Link to="/products?category=Electronics&sub=audio">🎧 Audio</Link>
            </div>
          </div>
          <NavLink to="/products?category=Clothing" className="nav-link">👗 Fashion</NavLink>
          <NavLink to="/products?category=Home+%26+Garden" className="nav-link">🏡 Home</NavLink>
          <NavLink to="/products?category=Sports" className="nav-link">⚽ Sports</NavLink>
          <NavLink to="/products?category=Beauty" className="nav-link">💄 Beauty</NavLink>
          <NavLink to="/products?category=Books" className="nav-link">📚 Books</NavLink>
          <NavLink to="/products?deals=true" className="nav-link deals">🔥 Deals</NavLink>
        </div>
      </div>

      {/* Mobile nav menu */}
      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
        <NavLink to="/" end className="nav-link" onClick={() => setMobileOpen(false)}>🏠 Home</NavLink>
        <NavLink to="/products" className="nav-link" onClick={() => setMobileOpen(false)}>📦 All Products</NavLink>
        <NavLink to="/products?category=Electronics" className="nav-link" onClick={() => setMobileOpen(false)}>📱 Electronics</NavLink>
        <NavLink to="/products?category=Clothing" className="nav-link" onClick={() => setMobileOpen(false)}>👗 Fashion</NavLink>
        <NavLink to="/cart" className="nav-link" onClick={() => setMobileOpen(false)}>🛒 Cart ({cartCount})</NavLink>
        {!user && <NavLink to="/login" className="nav-link" onClick={() => setMobileOpen(false)}>👤 Login</NavLink>}
        {user?.role === 'admin' && <NavLink to="/admin" className="nav-link" onClick={() => setMobileOpen(false)}>⚙️ Admin</NavLink>}
      </div>
    </nav>
  );
}
