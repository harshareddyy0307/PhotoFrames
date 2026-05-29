import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ChevronRight, Plus, Minus, Info } from 'lucide-react';

export default function Cart() {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    subtotal, 
    deliveryCharges, 
    grandTotal, 
    navigate 
  } = useCart();

  const FREE_SHIPPING_THRESHOLD = 1499;
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;
  const freeShippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center gap-6">
        <div className="p-6 bg-slate-900 rounded-full text-amber-500 shadow-xl border border-white/5 animate-bounce">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight font-display">
          Your Shopping Cart is Empty
        </h2>
        <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
          Looks like you haven't added any custom photo frames or premium gifts yet. Start exploring and preserve your precious memories today!
        </p>
        <button
          onClick={() => navigate('home')}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider rounded-xl hover-scale shadow-lg shadow-amber-500/25 transition-all"
        >
          Go Back Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-display">
          Your Cart
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Review your selected frames, upload references, and proceed to secure checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Items List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Free Shipping Progress Indicator */}
          <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-300">
              {amountToFreeShipping > 0 ? (
                <span className="flex items-center gap-1.5">
                  <Info size={14} className="text-amber-400" />
                  Add <span className="text-amber-400">₹{amountToFreeShipping}</span> more for <span className="text-emerald-400 font-bold">FREE SHIPPING</span>
                </span>
              ) : (
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  🎉 Congratulations! Your order qualifies for FREE Delivery!
                </span>
              )}
              <span>{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500" 
                style={{ width: `${freeShippingProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Items Container */}
          <div className="flex flex-col gap-3">
            {cart.map((item) => (
              <div 
                key={item.cartItemId}
                className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:border-white/10"
              >
                {/* Product Frame Info */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  {/* Thumb Preview (Default vs Uploaded Base64) */}
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 bg-slate-900">
                    <img 
                      src={item.customImage || item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                    {item.customImage && (
                      <span className="absolute bottom-1 right-1 bg-amber-500 text-slate-950 text-[8px] font-black px-1 py-0.5 rounded shadow">
                        CUSTOM
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white leading-tight truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-amber-400 font-semibold mt-1">
                      ₹{item.price} each
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-semibold text-gray-400 uppercase bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                        Size: {item.size}
                      </span>
                      {item.customImage ? (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                          📸 Attached
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-gray-500 bg-white/5 px-2 py-0.5 rounded-md">
                          Stock Art
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantitative Stepper and Delete Trigger */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t border-white/5 pt-3 sm:pt-0 sm:border-none">
                  {/* Quantity controls */}
                  <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-white/5">
                    <button 
                      onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      className="p-1.5 text-gray-400 hover:text-white rounded-md transition-all"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-white">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      className="p-1.5 text-gray-400 hover:text-white rounded-md transition-all"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Subtotal of single product */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-extrabold text-white w-16 text-right">
                      ₹{item.price * item.quantity}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="p-2 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all"
                      title="Delete item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Billing Invoice Summary */}
        <div className="glass-panel p-6 rounded-2xl border border-amber-500/15 shadow-xl flex flex-col gap-6">
          <h2 className="text-lg font-bold text-white tracking-tight font-display border-b border-white/10 pb-3">
            Billing Summary
          </h2>

          <div className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between text-xs font-medium text-gray-300">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-medium text-gray-300">
              <span>Subtotal Taxes (GST 0%)</span>
              <span>Included</span>
            </div>
            <div className="flex items-center justify-between text-xs font-medium text-gray-300">
              <span>Delivery Charges</span>
              {deliveryCharges === 0 ? (
                <span className="text-emerald-400 font-bold uppercase">Free</span>
              ) : (
                <span>₹{deliveryCharges}</span>
              )}
            </div>
            <div className="border-t border-white/10 my-2 pt-3.5 flex items-center justify-between text-sm font-black text-white uppercase tracking-wider">
              <span>Grand Total</span>
              <span className="text-amber-400 text-base">₹{grandTotal}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('checkout')}
            className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover-scale shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
          >
            <span>Proceed to Checkout</span>
            <ChevronRight size={16} />
          </button>

          <button
            onClick={() => navigate('home')}
            className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-extrabold uppercase border border-white/5 transition-all text-center"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
