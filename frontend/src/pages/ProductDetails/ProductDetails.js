import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import {
  FiShoppingCart, FiHeart, FiStar, FiShare2, FiTruck,
  FiShield, FiRefreshCw, FiMinus, FiPlus, FiChevronRight
} from 'react-icons/fi';
import './ProductDetails.css';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data);
        const relRes = await axios.get(`/api/products?category=${res.data.category}&limit=4`);
        setRelated(relRes.data.products?.filter(p => p._id !== id) || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="spinner-wrap" style={{ minHeight: '60vh' }}><div className="spinner" /></div>;
  if (!product) return (
    <div className="empty-state" style={{ minHeight: '60vh' }}>
      <div style={{ fontSize: 60 }}>😕</div>
      <h3>Product not found</h3>
      <button className="btn btn-primary" onClick={() => navigate('/products')}>Browse Products</button>
    </div>
  );

  const images = product.images?.length ? product.images : [product.image || `https://via.placeholder.com/500?text=${encodeURIComponent(product.name)}`];
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  return (
    <div className="product-details">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight size={12} />
          <Link to="/products">Products</Link>
          <FiChevronRight size={12} />
          <Link to={`/products?category=${product.category}`}>{product.category}</Link>
          <FiChevronRight size={12} />
          <span>{product.name}</span>
        </div>

        {/* Main */}
        <div className="pd-grid">
          {/* Images */}
          <div className="pd-images">
            <div className="pd-main-img-wrap">
              {discount && <span className="pd-discount">-{discount}%</span>}
              <img
                src={images[activeImg]}
                alt={product.name}
                className="pd-main-img"
              />
            </div>
            {images.length > 1 && (
              <div className="pd-thumbs">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    className={`pd-thumb ${activeImg === i ? 'active' : ''}`}
                    onClick={() => setActiveImg(i)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="pd-info">
            <div className="pd-category">{product.category}</div>
            <h1 className="pd-name">{product.name}</h1>

            {/* Rating */}
            <div className="pd-rating-row">
              <div className="stars">
                {[1,2,3,4,5].map(i => (
                  <FiStar key={i} className={i <= Math.round(product.rating || 0) ? 'filled' : ''} />
                ))}
              </div>
              <span className="pd-rating-count">({product.numReviews || 0} reviews)</span>
              <span className={`pd-stock ${product.stock > 0 ? 'in' : 'out'}`}>
                {product.stock > 0 ? `✓ In Stock (${product.stock})` : '✗ Out of Stock'}
              </span>
            </div>

            {/* Price */}
            <div className="pd-price-row">
              <span className="pd-price">${product.price?.toFixed(2)}</span>
              {product.originalPrice && <>
                <span className="pd-original">${product.originalPrice?.toFixed(2)}</span>
                <span className="pd-save badge badge-danger">Save {discount}%</span>
              </>}
            </div>

            <p className="pd-desc">{product.description}</p>

            <div className="pd-divider" />

            {/* Quantity */}
            <div className="pd-qty-row">
              <label>Quantity:</label>
              <div className="qty-control">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}><FiMinus /></button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}><FiPlus /></button>
              </div>
              <span className="qty-note">{product.stock} available</span>
            </div>

            {/* Actions */}
            <div className="pd-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => { addToCart(product, qty); }}
                disabled={product.stock === 0}
              >
                <FiShoppingCart /> Add to Cart
              </button>
              <button className="btn btn-outline btn-lg"
                onClick={() => { addToCart(product, qty); navigate('/cart'); }}
                disabled={product.stock === 0}
              >
                Buy Now
              </button>
              <button className="btn btn-outline" style={{ padding: '12px' }}><FiHeart /></button>
              <button className="btn btn-outline" style={{ padding: '12px' }}><FiShare2 /></button>
            </div>

            {/* Features */}
            <div className="pd-features">
              <div className="pd-feature"><FiTruck /><span>Free Delivery over $50</span></div>
              <div className="pd-feature"><FiShield /><span>2 Year Warranty</span></div>
              <div className="pd-feature"><FiRefreshCw /><span>30 Day Returns</span></div>
            </div>

            {/* Meta */}
            <div className="pd-meta">
              <div><strong>SKU:</strong> {product._id?.slice(-8).toUpperCase()}</div>
              <div><strong>Category:</strong> {product.category}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="pd-tabs card" style={{ marginTop: 32 }}>
          <div className="tabs-header">
            {['description', 'specifications', 'reviews'].map(tab => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="tabs-body">
            {activeTab === 'description' && (
              <div className="tab-content">
                <h3>Product Description</h3>
                <p>{product.description}</p>
                <ul>
                  <li>High quality materials</li>
                  <li>Durable and long-lasting</li>
                  <li>Suitable for all ages</li>
                  <li>Easy to use and maintain</li>
                </ul>
              </div>
            )}
            {activeTab === 'specifications' && (
              <div className="tab-content">
                <h3>Specifications</h3>
                <table className="specs-table">
                  <tbody>
                    <tr><td>Brand</td><td>BrandStore</td></tr>
                    <tr><td>Category</td><td>{product.category}</td></tr>
                    <tr><td>Price</td><td>${product.price}</td></tr>
                    <tr><td>Stock</td><td>{product.stock} units</td></tr>
                    <tr><td>Rating</td><td>{product.rating || 0}/5</td></tr>
                    {product.specifications && Object.entries(product.specifications).map(([k, v]) => (
                      <tr key={k}><td>{k}</td><td>{v}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="tab-content">
                <h3>Customer Reviews</h3>
                <div className="reviews-summary">
                  <div className="rating-big">{product.rating?.toFixed(1) || '0.0'}</div>
                  <div>
                    <div className="stars">{'⭐'.repeat(Math.round(product.rating || 0))}</div>
                    <div style={{ color: 'var(--gray-500)', fontSize: 13 }}>{product.numReviews || 0} reviews</div>
                  </div>
                </div>
                <p style={{ color: 'var(--gray-500)', marginTop: 20 }}>No reviews yet. Be the first to review!</p>
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <h2 className="section-title">Related Products</h2>
            <div className="related-grid">
              {related.slice(0, 4).map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
