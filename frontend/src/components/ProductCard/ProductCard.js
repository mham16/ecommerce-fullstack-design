import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiEye, FiStar } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

const Stars = ({ rating = 0, count = 0 }) => (
  <div className="pc-stars">
    {[1,2,3,4,5].map(i => (
      <FiStar key={i} className={i <= Math.round(rating) ? 'filled' : ''} />
    ))}
    <span>({count})</span>
  </div>
);

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div className="product-card">
      <div className="pc-image-wrap">
        {discount && <span className="pc-badge-discount">-{discount}%</span>}
        {product.stock === 0 && <span className="pc-badge-oos">Out of Stock</span>}
        <img
          src={product.image || `https://via.placeholder.com/300x300?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
          className="pc-image"
          loading="lazy"
        />
        <div className="pc-actions">
          <button
            className="pc-action-btn"
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            title="Add to cart"
          >
            <FiShoppingCart />
          </button>
          <Link to={`/products/${product._id}`} className="pc-action-btn" title="Quick view">
            <FiEye />
          </Link>
          <button className="pc-action-btn" title="Add to wishlist">
            <FiHeart />
          </button>
        </div>
      </div>

      <div className="pc-body">
        <div className="pc-category">{product.category}</div>
        <Link to={`/products/${product._id}`} className="pc-name">{product.name}</Link>
        <Stars rating={product.rating} count={product.numReviews} />
        <div className="pc-price-row">
          <span className="pc-price">${product.price?.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="pc-original">${product.originalPrice?.toFixed(2)}</span>
          )}
        </div>
        <button
          className="pc-add-btn btn btn-primary"
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
        >
          <FiShoppingCart size={14} />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
