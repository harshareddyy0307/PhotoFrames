import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import OrderForm from '../components/OrderForm';
import { addOrder } from '../utils/localStorage';
import { openWhatsAppOrder } from '../utils/whatsapp';
import { ClipboardCheck, Sparkles, CheckCircle2, ChevronRight, Home } from 'lucide-react';

export default function Checkout() {
  const { cart, subtotal, deliveryCharges, grandTotal, clearCart, navigate } = useCart();
  const [completedOrder, setCompletedOrder] = useState(null);

  // If cart is empty and no order is completed, redirect home
  if (cart.length === 0 && !completedOrder) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center flex flex-col items-center justify-center gap-6">
        <span className="text-4xl">🛒</span>
        <h2 className="text-xl font-bold text-white">Your Cart is Empty</h2>
        <p className="text-xs text-gray-400">Add frames to your cart before proceeding to checkout.</p>
        <button
          onClick={() => navigate('home')}
          className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover-scale"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  const handleFormSubmit = (customerDetails) => {
    // 1. Compile full order details
    const orderData = {
      customer: customerDetails,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        size: item.size,
        quantity: item.quantity,
        customImage: item.customImage // Contains compressed Base64 string!
      })),
      subtotal,
      delivery: deliveryCharges,
      total: grandTotal
    };

    // 2. Save order to Local Storage (so Staff & Admin panels can view it)
    const finalizedOrder = addOrder(orderData);

    // 3. Trigger WhatsApp redirection API
    openWhatsAppOrder(finalizedOrder);

    // 4. Set state to render the Thank You visual screen
    setCompletedOrder(finalizedOrder);

    // 5. Clear global cart
    clearCart();
  };

  // Thank You Screen
  if (completedOrder) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center gap-6">
        <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 animate-pulse-glow shadow-xl">
          <CheckCircle2 size={56} className="stroke-[2.5]" />
        </div>
        
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black text-white font-display">
            Order Sent to WhatsApp!
          </h1>
          <p className="text-sm text-gray-400 max-w-md leading-relaxed mx-auto">
            Your customized order has been compiled and redirected to WhatsApp for verification. The store staff will review your printing specifications shortly.
          </p>
        </div>

        {/* Order Card Detail */}
        <div className="w-full glass-panel p-5 rounded-2xl border border-white/5 text-left flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Order Reference</p>
              <h3 className="text-base font-extrabold text-amber-400 mt-0.5">{completedOrder.id}</h3>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Date Created</p>
              <h3 className="text-xs text-white mt-0.5">{new Date(completedOrder.date).toLocaleDateString()}</h3>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold text-gray-300">Deliver To:</h4>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5 flex flex-col gap-1 text-xs">
              <p className="font-bold text-white">{completedOrder.customer.name}</p>
              <p className="text-gray-400">{completedOrder.customer.phone}</p>
              <p className="text-gray-400">{completedOrder.customer.address}, {completedOrder.customer.city} - {completedOrder.customer.pincode}</p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-3 text-sm font-black uppercase text-white">
            <span>Amount Details</span>
            <span className="text-amber-400">₹{completedOrder.total}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mt-2">
          <button
            onClick={() => navigate('home')}
            className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover-scale"
          >
            <Home size={14} />
            <span>Go Back Shopping</span>
          </button>
          
          <button
            onClick={() => navigate('staff')}
            className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover-scale"
          >
            <span>Staff Portal Login</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-display">
          Checkout Details
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Complete your delivery details. We will compile the cart and redirect to WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Order Form */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 shadow-xl flex flex-col gap-6">
          <h2 className="text-lg font-bold text-white tracking-tight font-display border-b border-white/5 pb-3">
            Shipping Information
          </h2>
          <OrderForm onSubmit={handleFormSubmit} />
        </div>

        {/* Right Side: Cart Summary Invoice */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col gap-6">
          <h2 className="text-base font-bold text-white tracking-tight font-display border-b border-white/5 pb-3">
            Order Items ({cart.length})
          </h2>

          <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.cartItemId} className="flex items-center gap-3 justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <img 
                    src={item.customImage || item.image} 
                    alt={item.name} 
                    className="w-10 h-10 object-cover rounded border border-white/10 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Size: {item.size} × {item.quantity}</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-white">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 pt-4 flex flex-col gap-2.5">
            <div className="flex justify-between text-xs font-semibold text-gray-400">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-xs font-semibold text-gray-400">
              <span>Delivery</span>
              {deliveryCharges === 0 ? (
                <span className="text-emerald-400 font-bold uppercase text-[10px]">Free</span>
              ) : (
                <span>₹{deliveryCharges}</span>
              )}
            </div>
            <div className="border-t border-white/5 mt-1.5 pt-3.5 flex justify-between text-sm font-black text-white uppercase tracking-wider">
              <span>Total Price</span>
              <span className="text-amber-400">₹{grandTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
