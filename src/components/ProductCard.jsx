import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { compressImage } from '../utils/localStorage';
import { Upload, Check, ShoppingCart, Plus, Minus, Image as ImageIcon, Trash2 } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const stock = product.stock !== undefined ? product.stock : 25;
  const isOutOfStock = stock === 0;

  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '8x10');
  const [quantity, setQuantity] = useState(isOutOfStock ? 0 : 1);
  const [customImage, setCustomImage] = useState(null); // Base64 string
  const [uploading, setUploading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const compressedBase64 = await compressImage(file);
      setCustomImage(compressedBase64);
    } catch (err) {
      console.error('Failed to compress image:', err);
      alert('Error uploading and compressing image. Please try a different photo.');
    } finally {
      setUploading(false);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, quantity, customImage);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  const handleRemovePhoto = (e) => {
    e.stopPropagation();
    setCustomImage(null);
  };

  const isCustomizedCategory = product.category === 'Customized Frames';

  return (
    <div className="glass-panel-premium flex flex-col h-full rounded-2xl overflow-hidden shadow-xl border border-white/5">
      {/* Product Image and Category Tag */}
      <div className="relative aspect-square w-full bg-slate-900 overflow-hidden group">
        <img 
          src={product.image} 
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full bg-black/60 text-amber-400 border border-amber-500/30 backdrop-blur-md">
          {product.category}
        </div>
      </div>

      {/* Product Details */}
      <div className="flex-1 p-5 flex flex-col justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
            {product.name}
          </h3>
          <p className="text-xl font-extrabold text-amber-400 mt-1">
            ₹{product.price}
          </p>
          <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Size Selection */}
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
            Select Size
          </label>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                disabled={isOutOfStock}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isOutOfStock
                    ? 'bg-slate-950 text-gray-600 border border-white/5 cursor-not-allowed'
                    : selectedSize === size
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 border-amber-500 cursor-pointer'
                      : 'bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Photo Upload Box */}
        <div className="relative">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2 flex items-center justify-between">
            <span>Upload Custom Photo</span>
            {isCustomizedCategory && (
              <span className="text-[10px] text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full uppercase">
                Required
              </span>
            )}
          </label>

          {customImage ? (
            /* Uploaded Preview State */
            <div className="flex items-center gap-3 p-2 bg-slate-950/80 rounded-xl border border-amber-500/30">
              <img 
                src={customImage} 
                alt="Upload preview" 
                className="w-12 h-12 object-cover rounded-lg border border-white/10"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-300 truncate">Photo attached</p>
                <p className="text-[10px] text-emerald-400 font-bold">Ready to print</p>
              </div>
              <button 
                onClick={handleRemovePhoto}
                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                title="Remove photo"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ) : (
            /* Empty Upload State */
            <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 transition-all ${
              isOutOfStock
                ? 'border-white/5 bg-slate-950/20 text-gray-600 cursor-not-allowed'
                : uploading 
                  ? 'border-amber-500/30 bg-slate-950/50 cursor-pointer' 
                  : 'border-white/10 hover:border-amber-500/50 bg-white/5 hover:bg-white/10 cursor-pointer'
            }`}>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading || isOutOfStock}
                className="hidden" 
              />
              {uploading ? (
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[10px] font-semibold text-gray-400">Compressing...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <Upload size={18} className={isOutOfStock ? "text-gray-700" : "text-gray-400"} />
                  <span className={`text-xs font-medium ${isOutOfStock ? "text-gray-600" : "text-gray-300"}`}>
                    {isOutOfStock ? "Customization disabled" : "Choose photo to print"}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {isOutOfStock ? "Sold out" : "Supports JPG, PNG"}
                  </span>
                </div>
              )}
            </label>
          )}
        </div>

        {/* Stock Status Indicator Banner */}
        <div className="mt-2">
          {isOutOfStock ? (
            <div className="text-[10px] text-red-400 font-extrabold uppercase tracking-wider bg-red-500/10 border border-red-500/15 py-2 px-3 rounded-xl text-center leading-normal">
              ⚠️ Out of stock / Sold out
            </div>
          ) : stock <= 5 ? (
            <div className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider bg-amber-500/10 border border-amber-500/15 py-2 px-3 rounded-xl text-center leading-normal animate-pulse-glow">
              🔥 Only {stock} frames left in stock!
            </div>
          ) : null}
        </div>

        {/* Quantity and Actions */}
        <div className="flex items-center gap-3 mt-1">
          {/* Quantity Selector */}
          <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-white/5">
            <button 
              type="button"
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              disabled={isOutOfStock}
              className={`p-2 rounded-lg transition-all ${
                isOutOfStock ? 'text-gray-700 cursor-not-allowed' : 'text-gray-400 hover:text-white cursor-pointer'
              }`}
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-sm font-bold text-white">
              {quantity}
            </span>
            <button 
              type="button"
              onClick={() => setQuantity(prev => Math.min(stock, prev + 1))}
              disabled={isOutOfStock || quantity >= stock}
              className={`p-2 rounded-lg transition-all ${
                isOutOfStock || quantity >= stock ? 'text-gray-700 cursor-not-allowed' : 'text-gray-400 hover:text-white cursor-pointer'
              }`}
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Add To Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || (isCustomizedCategory && !customImage)}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              added 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                : isOutOfStock
                  ? 'bg-slate-900 border border-white/5 text-gray-600 cursor-not-allowed'
                  : isCustomizedCategory && !customImage
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5'
                    : 'bg-amber-500 text-slate-950 hover-scale shadow-lg shadow-amber-500/10 active:scale-95 cursor-pointer font-bold'
            }`}
          >
            {added ? (
              <>
                <Check size={16} className="stroke-[3]" />
                <span>Added to Cart!</span>
              </>
            ) : isOutOfStock ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingCart size={16} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
