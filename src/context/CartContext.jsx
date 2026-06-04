import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { getPromos } from '../utils/db';


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

  // Promo code states
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');


  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem('ms_current_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Track auth changes dynamically
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          const userObj = {
            id: session.user.id,
            email: session.user.email,
            ...profile
          };
          setCurrentUser(userObj);
          sessionStorage.setItem('ms_current_user', JSON.stringify(userObj));
        } catch (e) {
          console.error("Auth state change sync profile failed:", e);
        }
      } else {
        setCurrentUser(null);
        sessionStorage.removeItem('ms_current_user');
      }
    });
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const navigate = (viewName, params = {}) => {
    setView(viewName);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginCustomer = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;

    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileErr) throw profileErr;

    const userObj = {
      id: data.user.id,
      email: data.user.email,
      ...profile
    };
    setCurrentUser(userObj);
    sessionStorage.setItem('ms_current_user', JSON.stringify(userObj));
    return userObj;
  };

  const signupCustomer = async (userData) => {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password
    });
    if (error) throw error;
    if (!data.user) throw new Error('Registration failed.');

    const profileData = {
      id: data.user.id,
      name: userData.name,
      phone: userData.phone,
      address: userData.address,
      city: userData.city,
      pincode: userData.pincode,
      landmark: userData.landmark
    };

    const { error: profileErr } = await supabase
      .from('profiles')
      .insert([profileData]);

    if (profileErr) throw profileErr;

    const userObj = {
      id: data.user.id,
      email: userData.email,
      ...profileData
    };
    setCurrentUser(userObj);
    sessionStorage.setItem('ms_current_user', JSON.stringify(userObj));
    return userObj;
  };

  const logoutCustomer = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    sessionStorage.removeItem('ms_current_user');
    navigate('home');
  };

  const updateProfile = async (fields) => {
    if (currentUser) {
      const { error } = await supabase
        .from('profiles')
        .update(fields)
        .eq('id', currentUser.id);

      if (error) throw error;

      const updatedObj = { ...currentUser, ...fields };
      setCurrentUser(updatedObj);
      sessionStorage.setItem('ms_current_user', JSON.stringify(updatedObj));
      return updatedObj;
    }
  };

  useEffect(() => {
    localStorage.setItem('ms_cart', JSON.stringify(cart));
  }, [cart]);

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Dynamic promo auto-reevaluator
  useEffect(() => {
    if (appliedPromo) {
      if (subtotal < appliedPromo.minOrderValue) {
        setAppliedPromo(null);
        setPromoSuccess('');
        setPromoError(`Promo ${appliedPromo.code} removed because order fell below ₹${appliedPromo.minOrderValue}.`);
      }
    }
  }, [subtotal, appliedPromo]);

  const applyPromo = async (codeString) => {
    setPromoError('');
    setPromoSuccess('');

    if (!codeString || !codeString.trim()) {
      setPromoError('Please enter a promo code.');
      return;
    }

    try {
      const promos = await getPromos();
      const foundPromo = promos.find(p => p.code.toUpperCase() === codeString.trim().toUpperCase());

      if (!foundPromo) {
        setPromoError('Invalid Promo Code');
        return;
      }

      if (foundPromo.status !== 'Active') {
        setPromoError('This promo code is inactive.');
        return;
      }

      // Check expiry
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expiry = new Date(foundPromo.expiryDate);
      expiry.setHours(0, 0, 0, 0);
      if (expiry < today) {
        setPromoError('This promo code has expired.');
        return;
      }

      // Check usage limits
      if (foundPromo.usageLimit && foundPromo.usageCount >= foundPromo.usageLimit) {
        setPromoError('This promo code usage limit has been reached.');
        return;
      }

      // Check min order value requirement
      if (subtotal < foundPromo.minOrderValue) {
        setPromoError(`Minimum order value of ₹${foundPromo.minOrderValue} required to apply this code.`);
        return;
      }

      setAppliedPromo(foundPromo);
      setPromoSuccess('Promo Applied Successfully');
    } catch (e) {
      setPromoError('Failed to verify promo code.');
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoError('');
    setPromoSuccess('');
  };



  const addToCart = (product, size, quantity, customImage = null, overridePrice = null) => {
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
        newCart[existingItemIndex].quantity += 1;
        return newCart;
      } else {
        return [
          ...prevCart,
          {
            cartItemId: `${product.id}-${size}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            id: product.id,
            name: product.name,
            price: overridePrice !== null ? overridePrice : product.price,
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
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountType === 'percentage') {
      discount = Math.floor((subtotal * appliedPromo.discountValue) / 100);
      if (appliedPromo.maxDiscountLimit && discount > appliedPromo.maxDiscountLimit) {
        discount = appliedPromo.maxDiscountLimit;
      }
    } else {
      discount = appliedPromo.discountValue;
    }
    // Cap discount to subtotal
    if (discount > subtotal) {
      discount = subtotal;
    }
  }

  // Flat shipping charge of ₹99. Free delivery on orders above ₹1499!
  const deliveryCharges = subtotal > 1499 || subtotal === 0 ? 0 : 99;
  const grandTotal = Math.max(0, subtotal - discount + deliveryCharges);


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
        discount,
        grandTotal,
        appliedPromo,
        promoError,
        promoSuccess,
        applyPromo,
        removePromo,
        setPromoError,
        setPromoSuccess,
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
