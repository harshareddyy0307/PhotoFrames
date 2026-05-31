import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, X, Plus, Minus, Trash2, ChevronRight, ShoppingCart } from 'lucide-react';

export default function MiniCartPopup() {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    subtotal, 
    totalItemsCount, 
    navigate 
  } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);

  // Close popup if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Proactive visual trigger: Open the drawer automatically when an item is added to the cart
  const prevCountRef = useRef(totalItemsCount);
  useEffect(() => {
    if (totalItemsCount > prevCountRef.current && totalItemsCount > 0) {
      setIsOpen(true);
    }
    prevCountRef.current = totalItemsCount;
  }, [totalItemsCount]);

  // Don't render floating pill if cart is completely empty
  if (cart.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[999]" ref={popupRef}>
      {/* Pop-up Cart Drawer */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl p-4 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-250 select-none">
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
                <ShoppingCart size={14} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-white">Your Cart ({totalItemsCount} items)</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Cart Item Rows */}
          <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
            {cart.map((item) => (
              <div 
                key={item.cartItemId} 
                className="flex items-center justify-between gap-3 bg-white/5 hover:bg-white/10 p-2 rounded-xl border border-white/5 transition-all"
              >
                {/* Thumb preview */}
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 bg-slate-950">
                  <img 
                    src={item.customImage || item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                  {item.customImage && (
                    <span className="absolute bottom-0.5 right-0.5 bg-amber-500 text-slate-950 text-[7px] font-black px-0.5 rounded shadow">
                      CUSTOM
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate leading-tight">{item.name}</h4>
                  <p className="text-[10px] text-amber-500 font-extrabold mt-0.5">₹{item.price} each</p>
                  <p className="text-[9px] text-gray-400 mt-0.5 font-medium uppercase tracking-wider">Size: {item.size}</p>
                </div>

                {/* Steppers & Subtotals */}
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-xs font-extrabold text-white">₹{item.price * item.quantity}</span>
                  <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-white/5">
                    <button 
                      onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      className="p-1 text-gray-400 hover:text-white rounded transition-colors cursor-pointer"
                    >
                      <Minus size={10} />
                    </button>
                    <span className="w-5 text-center text-[10px] font-black text-white">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      className="p-1 text-gray-400 hover:text-white rounded transition-colors cursor-pointer"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                </div>

                {/* Remove button */}
                <button 
                  onClick={() => removeFromCart(item.cartItemId)}
                  className="p-1.5 text-red-400/80 hover:text-red-400 bg-red-500/5 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer self-start"
                  title="Remove item"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary & Checkout CTA */}
          <div className="flex flex-col gap-3 pt-3 border-t border-white/5">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-300">
              <span>Cart Subtotal:</span>
              <span className="text-amber-400 font-black text-sm">₹{subtotal}</span>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigate('cart');
                  setIsOpen(false);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 hover:text-white text-xs font-bold text-center transition-all cursor-pointer"
              >
                View Full Cart
              </button>
              <button
                onClick={() => {
                  navigate('checkout');
                  setIsOpen(false);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1 transition-all hover-scale shadow-lg shadow-amber-500/10 cursor-pointer"
              >
                <span>Checkout</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Trigger Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 border cursor-pointer hover:scale-105 active:scale-95 ${
          isOpen
            ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-amber-500/20'
            : 'bg-slate-900/90 text-amber-400 border-white/10 hover:border-amber-500/50 hover:bg-slate-900 shadow-black/80'
        }`}
      >
        <div className="relative">
          <ShoppingBag size={16} />
          {totalItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[8px] font-black text-white border border-slate-950 animate-bounce">
              {totalItemsCount}
            </span>
          )}
        </div>
        <span className="text-xs font-black uppercase tracking-widest">
          {isOpen ? 'Close' : `Cart (₹${subtotal})`}
        </span>
      </button>
    </div>
  );
}
