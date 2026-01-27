import { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCart(data.cart || { items: [] });
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (productId, quantity = 1) => {
    const data = await cartService.addToCart(productId, quantity);
    setCart(data.cart);
    return data.cart;
  };

  const updateCartItem = async (productId, quantity) => {
    const data = await cartService.updateCartItem(productId, quantity);
    setCart(data.cart);
    return data.cart;
  };

  const removeFromCart = async (productId) => {
    const data = await cartService.removeFromCart(productId);
    setCart(data.cart);
    return data.cart;
  };

  const clearCart = async () => {
    const data = await cartService.clearCart();
    setCart(data.cart);
    return data.cart;
  };

  const cartCount = cart.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const value = {
    cart,
    cartCount,
    loading,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
