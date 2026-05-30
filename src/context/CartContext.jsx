import React, { createContext, useContext, useState, useEffect } from 'react';
import { authenticateUser, registerUser, updateUserProfile } from '../utils/localStorage';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const storedCart = localStorage.getItem('ms_cart');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch {
      return [];
    }
  });

  const [currentView, setView] = useState('home');
  const [viewParams, setViewParams] = useState({});

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem('ms_current_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const navigate = (viewName, params = {}) => {
    setView(viewName);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginCustomer = (email, password) => {
    const user = authenticateUser(email, password);
    setCurrentUser(user);
    sessionStorage.setItem('ms_current_user', JSON.stringify(user));
    return user;
  };

  const signupCustomer = (userData) => {
    const newUser = registerUser(userData);
    setCurrentUser(newUser);
    sessionStorage.setItem('ms_current_user', JSON.stringify(newUser));
    return newUser;
  };

  const logoutCustomer = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('ms_current_user');
    navigate('home');
  };

  const updateProfile = (fields) => {
    if (currentUser) {
      const updated = updateUserProfile(currentUser.id, fields);
      setCurrentUser(updated);
      sessionStorage.setItem('ms_current_user', JSON.stringify(updated));
      return updated;
    }
  };

  useEffect(() => {
    localStorage.setItem('ms_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, size, quantity, customImage = null) => {
    setCart((prevCart) => {
      // Find if item with same ID, size, and customImage already exists
      const existingItemIndex = prevCart.findIndex(
        (item) => 
          item.id === product.id && 
          item.size === size && 
          item.customImage === customImage
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        return [
          ...prevCart,
          {
            cartItemId: `${product.id}-${size}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: size,
            quantity: quantity,
            customImage: customImage // base64 string
          }
        ];
      }
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Flat shipping charge of ₹99. Free delivery on orders above ₹1499!
  const deliveryCharges = subtotal > 1499 || subtotal === 0 ? 0 : 99;
  const grandTotal = subtotal + deliveryCharges;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        totalItemsCount,
        deliveryCharges,
        grandTotal,
        currentView,
        navigate,
        viewParams,
        currentUser,
        loginCustomer,
        signupCustomer,
        logoutCustomer,
        updateProfile
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
