import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../components/ProductCard/ProductCard';
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiHeadphones } from 'react-icons/fi';
import './Home.css';

const CATEGORIES = [
  { name: 'Electronics', icon: '📱', color: '#e3f2fd' },
  { name: 'Clothing', icon: '👗', color: '#fce4ec' },
  { name: 'Home & Garden', icon: '🏡', color: '#e8f5e9' },
  { name: 'Sports', icon: '⚽', color: '#fff3e0' },
  { name: 'Beauty', icon: '💄', color: '#f3e5f5' },
  { name: 'Books', icon: '📚', color: '#e0f7fa' },
  { name: 'Toys', icon: '🧸', color: '#fff8e1' },
  { name: 'Automotive', icon: '🚗', color: '#e8eaf6' },
];

const FEATURES = [
  { icon: <FiTruck />, title: 'Free Shipping', desc: 'On orders over $50' },
  { icon: <FiShield />, title: 'Secure Payment', desc: '100% protected' },
  { icon: <FiRefreshCw />, title: 'Easy Returns', desc: '30 day return policy' },
  { icon: <FiHeadphones />, title: '24/7 Support', desc: 'Always here to help' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [f, l] = await Promise.all([
          axios.get('/api/products?featured=true&limit=8'),
          axios.get('/api/products?sort=newest&limit=8'),
        ]);
        setFeatured(f.data.products || []);
        setLatest(l.data.products || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-main">
              <div className="hero-badge">🔥 Latest trending</div>
              <h1 className="hero-title">
                Latest Trending<br />
                <span>Electronic Items</span>
              </h1>
              <p className="hero-desc">
                Discover the best deals on electronics, fashion, home goods and more.
                Shop thousands of products at unbeatable prices.
              </p>
              <div className="hero-btns">
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/products')}>
                  Shop Now <FiArrowRight />
                </button>
                <button className="btn btn-outline btn-lg" onClick={() => navigate('/products?deals=true')}>
                  View Deals
                </button>
              </div>
              <div className="hero-stats">
                <div><strong>50K+</strong><span>Products</span></div>
                <div><strong>10K+</strong><span>Sellers</span></div>
                <div><strong>2M+</strong><span>Customers</span></div>
              </div>
            </div>

            <div className="hero-side">
              <div className="hero-card card">
                <div className="hero-card-inner">
                  <span className="hero-card-emoji">🎧</span>
                  <div>
                    <div className="hero-card-cat">Electronics</div>
                    <div className="hero-card-name">Premium Headphones</div>
                    <div className="hero-card-price">From $49.99</div>
                  </div>
                </div>
              </div>
              <div className="hero-card card" style={{ background: 'var(--teal)', color: 'white' }}>
                <div className="hero-card-inner">
                  <span className="hero-card-emoji">📱</span>
                  <div>
                    <div className="hero-card-cat" style={{ color: 'rgba(255,255,255,0.8)' }}>Phones</div>
                    <div className="hero-card-name" style={{ color: 'white' }}>Latest Smartphones</div>
                    <div className="hero-card-price" style={{ color: 'white' }}>From $199.99</div>
                  </div>
                </div>
              </div>
              <div className="hero-card card" style={{ background: 'var(--primary)', color: 'white' }}>
                <div className="hero-card-inner">
                  <span className="hero-card-emoji">💻</span>
                  <div>
                    <div className="hero-card-cat" style={{ color: 'rgba(255,255,255,0.8)' }}>Laptops</div>
                    <div className="hero-card-name" style={{ color: 'white' }}>Pro Laptops</div>
                    <div className="hero-card-price" style={{ color: 'white' }}>From $699.99</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-bar">
        <div className="container">
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div className="feature-item" key={i}>
                <div className="feature-icon">{f.icon}</div>
                <div>
                  <div className="feature-title">{f.title}</div>
                  <div className="feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="home-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <Link
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                key={cat.name}
                className="category-card"
                style={{ background: cat.color }}
              >
                <span className="cat-icon">{cat.icon}</span>
                <span className="cat-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="home-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <Link to="/products?featured=true" className="btn btn-outline btn-sm">
              View All <FiArrowRight />
            </Link>
          </div>
          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : (
            <div className="products-grid">
              {featured.length ? featured.map(p => (
                <ProductCard key={p._id} product={p} />
              )) : (
                <div className="empty-state">
                  <p>No featured products yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Banner */}
      <section className="promo-banner">
        <div className="container">
          <div className="promo-grid">
            <div className="promo-card blue">
              <div>
                <div className="promo-badge">Limited Offer</div>
                <h3>Consumer<br />Electronics Sale</h3>
                <p>Up to 50% off on selected items</p>
                <Link to="/products?category=Electronics" className="btn btn-primary">
                  Shop Now <FiArrowRight />
                </Link>
              </div>
              <span className="promo-icon">📱</span>
            </div>
            <div className="promo-card teal">
              <div>
                <div className="promo-badge">New Arrivals</div>
                <h3>Home &<br />Outdoor Items</h3>
                <p>Fresh styles for your living space</p>
                <Link to="/products?category=Home+%26+Garden" className="btn btn-primary">
                  Shop Now <FiArrowRight />
                </Link>
              </div>
              <span className="promo-icon">🏡</span>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Products */}
      <section className="home-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">New Arrivals</h2>
            <Link to="/products?sort=newest" className="btn btn-outline btn-sm">
              View All <FiArrowRight />
            </Link>
          </div>
          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : (
            <div className="products-grid">
              {latest.length ? latest.map(p => (
                <ProductCard key={p._id} product={p} />
              )) : (
                <div className="empty-state"><p>No products yet.</p></div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Send to suppliers */}
      <section className="suppliers-banner">
        <div className="container">
          <div className="suppliers-content">
            <div>
              <h3>An easy way to send requests to all suppliers</h3>
              <p>Connect directly with thousands of verified suppliers worldwide</p>
              <button className="btn btn-primary btn-lg">Get Started <FiArrowRight /></button>
            </div>
            <div className="suppliers-img">🌍📦🤝</div>
          </div>
        </div>
      </section>
    </div>
  );
}
