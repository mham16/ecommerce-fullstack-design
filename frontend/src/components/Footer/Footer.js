import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-newsletter">
        <div className="container">
          <div className="newsletter-content">
            <div>
              <h3>Subscribe to Our Newsletter</h3>
              <p>Get the latest deals and news straight to your inbox</p>
            </div>
            <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Enter your email address" />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </div>

      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link to="/" className="footer-logo">🛒 BrandStore</Link>
              <p>Your one-stop shop for all trending electronic items and more. Quality products at unbeatable prices.</p>
              <div className="footer-socials">
                <a href="#fb" aria-label="Facebook"><FiFacebook /></a>
                <a href="#tw" aria-label="Twitter"><FiTwitter /></a>
                <a href="#ig" aria-label="Instagram"><FiInstagram /></a>
                <a href="#yt" aria-label="YouTube"><FiYoutube /></a>
              </div>
            </div>

            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/products">All Products</Link></li>
                <li><Link to="/products?deals=true">Deals</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Categories</h4>
              <ul>
                <li><Link to="/products?category=Electronics">Electronics</Link></li>
                <li><Link to="/products?category=Clothing">Fashion</Link></li>
                <li><Link to="/products?category=Home+%26+Garden">Home & Garden</Link></li>
                <li><Link to="/products?category=Sports">Sports</Link></li>
                <li><Link to="/products?category=Beauty">Beauty</Link></li>
                <li><Link to="/products?category=Books">Books</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Customer Service</h4>
              <ul>
                <li><Link to="/help">Help Center</Link></li>
                <li><Link to="/returns">Returns & Refunds</Link></li>
                <li><Link to="/shipping">Shipping Info</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Contact Us</h4>
              <ul>
                <li><FiMapPin /> 123 Commerce St, City, 12345</li>
                <li><FiPhone /> +1 (555) 000-0000</li>
                <li><FiMail /> support@brandstore.com</li>
              </ul>
              <div className="footer-payments">
                <span>💳</span><span>💰</span><span>🏦</span><span>📱</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© 2024 BrandStore. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/sitemap">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
