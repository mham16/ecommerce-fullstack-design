import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FiMinus, FiPlus, FiTrash2, FiArrowLeft, FiShoppingBag, FiTruck } from 'react-icons/fi';
import './Cart.css';

export default function Cart() {
  const { cartItems, removeFromCart, updateQty, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();

  const shipping = cartTotal >= 50 ? 0 : 9.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  if (cartItems.length === 0) return (
    <div className="cart-empty">
      <div className="container">
        <div className="empty-state">
          <FiShoppingBag style={{ fontSize: 64, color: 'var(--gray-300)' }} />
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything yet</p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/products')}>
            Start Shopping
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <span className="cart-count-badge">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="cart-grid">
          {/* Items */}
          <div className="cart-items-col">
            <div className="cart-items-header">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Subtotal</span>
              <button className="btn btn-outline btn-sm" onClick={clearCart}>Clear All</button>
            </div>

            {cartItems.map(item => (
              <div className="cart-item card" key={item._id}>
                <div className="ci-product">
                  <img
                    src={item.image || `https://via.placeholder.com/80?text=${encodeURIComponent(item.name)}`}
                    alt={item.name}
                    className="ci-img"
                  />
                  <div className="ci-info">
                    <Link to={`/products/${item._id}`} className="ci-name">{item.name}</Link>
                    <span className="ci-cat">{item.category}</span>
                    {item.stock < 5 && <span className="ci-low-stock">Only {item.stock} left!</span>}
                  </div>
                </div>

                <div className="ci-price">${item.price.toFixed(2)}</div>

                <div className="ci-qty">
                  <div className="qty-control">
                    <button onClick={() => updateQty(item._id, item.quantity - 1)}><FiMinus /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQty(item._id, item.quantity + 1)}><FiPlus /></button>
                  </div>
                </div>

                <div className="ci-subtotal">${(item.price * item.quantity).toFixed(2)}</div>

                <button className="ci-remove" onClick={() => removeFromCart(item._id)}>
                  <FiTrash2 />
                </button>
              </div>
            ))}

            <div className="cart-actions">
              <button className="btn btn-outline" onClick={() => navigate('/products')}>
                <FiArrowLeft /> Continue Shopping
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="cart-summary-col">
            <div className="cart-summary card">
              <h3 className="summary-title">Order Summary</h3>

              <div className="summary-rows">
                <div className="summary-row">
                  <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'free' : ''}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="summary-row">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              {cartTotal < 50 && (
                <div className="free-shipping-note">
                  <FiTruck />
                  <span>Add <strong>${(50 - cartTotal).toFixed(2)}</strong> more for FREE shipping!</span>
                </div>
              )}

              <div className="summary-divider" />

              <div className="summary-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}
                onClick={() => navigate('/checkout')}>
                Proceed to Checkout
              </button>

              <div className="summary-security">
                🔒 Secure checkout · SSL encrypted
              </div>

              {/* Coupon */}
              <div className="coupon-section">
                <div className="summary-divider" />
                <h4>Have a coupon?</h4>
                <div className="coupon-form">
                  <input className="form-control" placeholder="Enter coupon code" />
                  <button className="btn btn-outline">Apply</button>
                </div>
              </div>
            </div>

            {/* Payment methods */}
            <div className="payment-methods card">
              <h4>We Accept</h4>
              <div className="payment-icons">
                <span>💳 Visa</span>
                <span>💳 Mastercard</span>
                <span>📱 PayPal</span>
                <span>🏦 Bank</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
