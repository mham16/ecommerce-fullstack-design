import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    setCartItems(prev => {
      const existing = prev.find(i => i._id === product._id);
      if (existing) {
        toast.info('Quantity updated');
        return prev.map(i =>
          i._id === product._id
            ? { ...i, quantity: Math.min(i.quantity + qty, product.stock) }
            : i
        );
      }
      toast.success('Added to cart!');
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(i => i._id !== id));
    toast.info('Removed from cart');
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCartItems(prev =>
      prev.map(i => i._id === id ? { ...i, quantity: qty } : i)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
