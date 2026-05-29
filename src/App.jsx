import React from 'react';
import { useCart } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Staff from './pages/Staff';
import Admin from './pages/Admin';
import { Sparkles, MessageCircle } from 'lucide-react';

export default function App() {
  const { currentView } = useCart();

  // Route switcher
  const renderPageView = () => {
    switch (currentView) {
      case 'home':
        return <Home />;
      case 'cart':
        return <Cart />;
      case 'checkout':
        return <Checkout />;
      case 'staff':
        return <Staff />;
      case 'admin':
        return <Admin />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Floating Sparkle Top bar Decoration */}
      <div className="w-full bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-500/20 py-2.5 px-4 text-center text-[10px] font-bold uppercase tracking-widest text-amber-400 border-b border-white/5 flex items-center justify-center gap-1.5">
        <Sparkles size={12} className="animate-spin duration-1000" /> 
        <span>Exclusive Offer: Free subtotals shipping for orders above ₹1499!</span>
        <Sparkles size={12} className="animate-spin duration-1000" />
      </div>

      {/* Main Floating Navigation Bar */}
      <header className="py-6">
        <Navbar />
      </header>

      {/* Main Dynamic View Content */}
      <main className="flex-1 pb-16">
        {renderPageView()}
      </main>

      {/* Premium Dark Theme Footer */}
      <footer className="glass-panel border-t border-white/5 py-12 mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black tracking-tight font-display bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              FrameCraft
            </span>
            <span className="text-[10px] text-gray-500 font-semibold border-l border-white/10 pl-2">
              Premium Customized Frames
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-amber-400 transition-colors"
            >
              Back to Top
            </button>
            <span className="text-gray-700">•</span>
            <span className="text-gray-500">Demo Account: staff1 / 1234</span>
            <span className="text-gray-700">•</span>
            <span>Made with E-commerce Excellence</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
