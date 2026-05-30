import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Home, Users, Settings, Menu, X, Frame, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const { totalItemsCount, currentView, navigate, currentUser, logoutCustomer } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'cart', label: 'Cart', icon: ShoppingBag, badge: totalItemsCount },
  ];

  const handleNavClick = (viewId) => {
    navigate(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-4 z-50 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="glass-panel rounded-2xl px-6 py-4 shadow-xl border border-white/10 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="p-2 bg-amber-500 rounded-lg text-slate-950 transition-transform group-hover:rotate-12 duration-300">
            <Frame size={22} className="stroke-[2.5]" />
          </div>
          <span className="text-xl font-bold tracking-tight font-display bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
            FrameCraft
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover-scale relative cursor-pointer ${
                  isActive 
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-lg shadow-amber-500/20' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span className={`ml-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold ${
                    isActive ? 'bg-slate-950 text-amber-400' : 'bg-amber-500 text-slate-950 animate-bounce'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Customer Auth / Profile Actions */}
          <div className="h-6 w-px bg-white/10 mx-2"></div>

          {currentUser ? (
            <div className="relative group py-2">
              <button
                onClick={() => handleNavClick('profile')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover-scale relative border cursor-pointer ${
                  currentView === 'profile'
                    ? 'bg-amber-500 text-slate-950 border-amber-500 font-semibold shadow-lg shadow-amber-500/20' 
                    : 'border-amber-500/30 text-amber-400 bg-amber-500/5 hover:bg-amber-500/10'
                }`}
              >
                <User size={16} />
                <span className="truncate max-w-[95px]">Hi, {currentUser.name.split(' ')[0]}</span>
              </button>
              
              {/* Dropdown Menu on Hover */}
              <div className="absolute right-0 mt-1 w-48 rounded-xl bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl p-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <button
                  onClick={() => handleNavClick('profile')}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                >
                  <User size={14} className="text-amber-400" />
                  <span>My Profile & Orders</span>
                </button>
                <button
                  onClick={() => {
                    logoutCustomer();
                    handleNavClick('home');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2 border-t border-white/5 mt-1 pt-2 cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('auth')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover-scale relative border border-white/10 cursor-pointer ${
                currentView === 'auth'
                  ? 'bg-amber-500 text-slate-950 font-semibold border-amber-500 shadow-lg shadow-amber-500/20' 
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <User size={16} className="text-amber-400" />
              <span>Sign In</span>
            </button>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 mx-2">
          <div className="glass-panel rounded-2xl p-4 border border-white/10 shadow-2xl flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/25' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-xs font-bold ${
                      isActive ? 'bg-slate-950 text-amber-400' : 'bg-amber-500 text-slate-950'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="h-px bg-white/10 my-2"></div>

            {currentUser ? (
              <>
                <button
                  onClick={() => handleNavClick('profile')}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all border cursor-pointer ${
                    currentView === 'profile'
                      ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                      : 'border-amber-500/25 text-amber-400 bg-amber-500/5'
                  }`}
                >
                  <User size={18} />
                  <span>Hi, {currentUser.name} (Dashboard)</span>
                </button>
                <button
                  onClick={() => {
                    logoutCustomer();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-white/5 transition-all cursor-pointer"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNavClick('auth')}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium border border-white/10 transition-all cursor-pointer ${
                  currentView === 'auth'
                    ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <User size={18} className="text-amber-400" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
