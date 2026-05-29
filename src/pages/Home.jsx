import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../utils/localStorage';
import { Search, SlidersHorizontal, ShieldCheck, Truck, Sparkles, MessageCircleHeart } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'low-high', 'high-low'

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const categories = ['All', 'Photo Frames', 'Customized Frames', 'Gifts', 'Others'];

  // Filter and Sort Logic
  const filteredProducts = products
    .filter((product) => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'low-high') return a.price - b.price;
      if (sortBy === 'high-low') return b.price - a.price;
      return 0; // fallback default
    });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-12">
      {/* 1. Stunning Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl p-8 sm:p-12 md:p-16 flex flex-col items-start justify-center min-h-[380px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-slate-950 to-slate-950">
        {/* Glow effect */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 max-w-xl flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} /> Preserving Your Golden Moments
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight font-display tracking-tight">
            Premium <span className="shimmer-text font-black">Customized Photo Frames</span> for Every Occasion
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            Turn your digital files into spectacular, print-ready custom wooden blocks, name Letter collages, acrylic panels, and elegant walnut portrait frames. Handcrafted with love and delivered directly.
          </p>
          <div className="flex flex-wrap gap-3 mt-2">
            <button 
              onClick={() => {
                const element = document.getElementById('catalog');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all hover-scale shadow-lg shadow-amber-500/20 active:scale-95"
            >
              Explore Products
            </button>
            <a 
              href="https://wa.me/917989856610"
              target="_blank" 
              rel="noreferrer"
              className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-extrabold text-xs uppercase tracking-wider border border-white/10 transition-all hover-scale active:scale-95 flex items-center gap-2"
            >
              <MessageCircleHeart size={16} className="text-amber-400" /> WhatsApp Support
            </a>
          </div>
        </div>
      </div>

      {/* 2. Interactive Navigation Filters & Catalog Section */}
      <div id="catalog" className="flex flex-col gap-6 scroll-mt-24">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-extrabold tracking-tight text-white font-display">
            Browse Our Collection
          </h2>
          <p className="text-xs text-gray-400">
            Select a category, search by name, or upload a photo to customize your frames instantly.
          </p>
        </div>

        {/* Filters Controls Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Tabs Scroll Box */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 font-bold'
                    : 'bg-white/5 border border-white/5 text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search and Sort controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs font-medium focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <SlidersHorizontal size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-9 pr-8 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-gray-300 text-xs font-semibold focus:outline-none focus:border-amber-500 cursor-pointer appearance-none"
              >
                <option value="featured">Sort: Featured</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-12 text-center border border-white/5 flex flex-col items-center justify-center gap-4">
            <span className="text-4xl">🔍</span>
            <p className="text-sm font-semibold text-gray-300">No products found matching your filters.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-amber-500/10 text-amber-400 font-bold text-xs rounded-xl border border-amber-500/30 hover:bg-amber-500/20"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* 3. Luxury Trust Features Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-white/10 pt-12">
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-start gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <Truck size={24} />
          </div>
          <div>
            <h4 className="text-base font-bold text-white font-display">Free Shipping</h4>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Enjoy flat zero-delivery charges on all customization orders with basket totals above ₹1499.
            </p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-start gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="text-base font-bold text-white font-display">Premium Printing</h4>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              We apply advanced lab-grade sublimation on wooden bases to ensure colors look stunning.
            </p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-start gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <MessageCircleHeart size={24} />
          </div>
          <div>
            <h4 className="text-base font-bold text-white font-display">WhatsApp Verification</h4>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Every single checkout compiles an automated text payload to the owner for personalized shipping checks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
