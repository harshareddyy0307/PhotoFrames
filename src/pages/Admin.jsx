import React, { useState, useEffect } from 'react';
import { getProducts, saveProducts, getOrders } from '../utils/localStorage';
import { Plus, Edit2, Trash2, DollarSign, ShoppingCart, Loader2, Users, FolderOpen, Save, ShieldAlert, Award } from 'lucide-react';

export default function Admin() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'products', 'staff'

  // Products state
  const [products, setProducts] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form fields state
  const [formData, setFormData] = useState({
    name: '',
    category: 'Photo Frames',
    price: '',
    sizes: '6x8, 8x10, 12x12',
    description: '',
    image: ''
  });

  // Orders and metrics state
  const [orders, setOrders] = useState([]);
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    setProducts(getProducts());
    const ords = getOrders();
    setOrders(ords);

    // Calculate metrics
    const pending = ords.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length;
    const completed = ords.filter(o => o.status === 'Completed').length;
    const revenue = ords
      .filter(o => o.status === 'Completed')
      .reduce((sum, o) => sum + o.total, 0);

    setMetrics({
      totalOrders: ords.length,
      pendingOrders: pending,
      completedOrders: completed,
      totalRevenue: revenue
    });
  }, [activeTab]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Open Form to Add
  const handleAddClick = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Photo Frames',
      price: '',
      sizes: '6x8, 8x10, 12x12',
      description: '',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80' // default Unsplash
    });
    setShowProductForm(true);
  };

  // Open Form to Edit
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      sizes: product.sizes.join(', '),
      description: product.description,
      image: product.image
    });
    setShowProductForm(true);
  };

  // Submit Product Form
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const sizesArray = formData.sizes
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const priceNum = parseFloat(formData.price) || 0;

    let updatedProducts;

    if (editingProduct) {
      // Edit mode
      updatedProducts = products.map((p) => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: formData.name,
            category: formData.category,
            price: priceNum,
            sizes: sizesArray,
            description: formData.description,
            image: formData.image
          };
        }
        return p;
      });
    } else {
      // Add mode
      const newProduct = {
        id: 'p-' + Math.floor(1000 + Math.random() * 9000),
        name: formData.name,
        category: formData.category,
        price: priceNum,
        sizes: sizesArray,
        description: formData.description,
        image: formData.image
      };
      updatedProducts = [newProduct, ...products];
    }

    setProducts(updatedProducts);
    saveProducts(updatedProducts);
    setShowProductForm(false);
    setEditingProduct(null);
  };

  // Delete Product
  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product from the inventory?')) {
      const updated = products.filter(p => p.id !== productId);
      setProducts(updated);
      saveProducts(updated);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Admin Header */}
      <div className="border-b border-white/5 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-display">
            Admin Panel
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage product catalogs, track dashboard KPIs, and view staff accounts.
          </p>
        </div>

        {/* Tab Selector Links */}
        <div className="flex gap-2 bg-slate-950 p-1 rounded-xl border border-white/5 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'products'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Inventory
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'staff'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Staff Accounts
          </button>
        </div>
      </div>

      {/* TABS CONTENT */}

      {/* A. Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="flex flex-col gap-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center justify-between shadow-xl">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Sales</p>
                <h3 className="text-2xl font-black text-white mt-1">₹{metrics.totalRevenue}</h3>
                <p className="text-[10px] text-emerald-400 mt-1 font-semibold">From completed orders</p>
              </div>
              <div className="p-3.5 bg-amber-500/10 text-amber-400 rounded-xl">
                <DollarSign size={24} />
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center justify-between shadow-xl">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Orders</p>
                <h3 className="text-2xl font-black text-white mt-1">{metrics.totalOrders}</h3>
                <p className="text-[10px] text-gray-500 mt-1">Stored locally</p>
              </div>
              <div className="p-3.5 bg-amber-500/10 text-amber-400 rounded-xl">
                <ShoppingCart size={24} />
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center justify-between shadow-xl">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Pending Orders</p>
                <h3 className="text-2xl font-black text-amber-400 mt-1">{metrics.pendingOrders}</h3>
                <p className="text-[10px] text-amber-500/50 mt-1 font-semibold">Requires assembly</p>
              </div>
              <div className="p-3.5 bg-amber-500/15 text-amber-400 rounded-xl">
                <Loader2 size={24} className="animate-spin" />
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center justify-between shadow-xl">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Completed Orders</p>
                <h3 className="text-2xl font-black text-emerald-400 mt-1">{metrics.completedOrders}</h3>
                <p className="text-[10px] text-emerald-400/50 mt-1 font-semibold">Ready or Shipped</p>
              </div>
              <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <Award size={24} />
              </div>
            </div>
          </div>

          {/* Quick instructions and state notes */}
          <div className="glass-panel-premium p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col gap-3">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-1.5">
              <ShieldAlert size={16} className="text-amber-500" /> Database-Free Storage Systems
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              This system is fully autonomous and operates using client-side **Local Storage**. Adding default frames, placing customized reference checkout payloads, and status modifications apply instantly to the active web browser.
            </p>
          </div>
        </div>
      )}

      {/* B. Products Tab */}
      {activeTab === 'products' && (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white font-display">Inventory Catalog</h2>
            <button
              onClick={handleAddClick}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl hover-scale flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/10"
            >
              <Plus size={14} className="stroke-[2.5]" />
              <span>Add Product</span>
            </button>
          </div>

          {/* Inventory Table List */}
          <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-white/5 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Item Details</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Base Price</th>
                    <th className="p-4">Available Sizes</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-semibold">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-white/5 transition-all">
                      <td className="p-4 flex items-center gap-3">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-12 h-12 object-cover rounded border border-white/10"
                        />
                        <div>
                          <h4 className="font-bold text-white text-sm">{product.name}</h4>
                          <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1 max-w-[240px] font-normal">{product.description}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-gray-300 text-[10px]">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-4 text-amber-400 font-extrabold text-sm">₹{product.price}</td>
                      <td className="p-4 text-gray-400">{product.sizes.join(', ')}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="p-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg transition-all"
                            title="Edit Product"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                            title="Delete Product"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add / Edit Product Modal Form */}
          {showProductForm && (
            <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl max-w-lg w-full flex flex-col gap-5 relative animate-scale-up">
                <h3 className="text-lg font-bold text-white font-display border-b border-white/5 pb-2">
                  {editingProduct ? 'Edit Product Details' : 'Add New Product'}
                </h3>

                <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 text-xs font-semibold text-gray-300">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Product Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Premium Canvas Frame"
                        className="px-4 py-2.5 rounded-xl glass-input focus:outline-none"
                      />
                    </div>

                    {/* Price */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Base Price (₹)</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        placeholder="999"
                        className="px-4 py-2.5 rounded-xl glass-input focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Category */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-gray-300 focus:outline-none focus:border-amber-500 cursor-pointer"
                      >
                        <option value="Photo Frames">Photo Frames</option>
                        <option value="Customized Frames">Customized Frames</option>
                        <option value="Gifts">Gifts</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>

                    {/* Sizes */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Sizes (comma-separated)</label>
                      <input
                        type="text"
                        name="sizes"
                        value={formData.sizes}
                        onChange={handleInputChange}
                        required
                        placeholder="6x8, 8x10, 12x12"
                        className="px-4 py-2.5 rounded-xl glass-input focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Image URL */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Product Image URL</label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      required
                      placeholder="https://images.unsplash.com/..."
                      className="px-4 py-2.5 rounded-xl glass-input focus:outline-none"
                    />
                  </div>

                  {/* Description */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows="3"
                      placeholder="Detailed product descriptions..."
                      className="px-4 py-2.5 rounded-xl glass-input focus:outline-none resize-none"
                    ></textarea>
                  </div>

                  <div className="flex gap-3 mt-2">
                    <button
                      type="submit"
                      className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all hover-scale"
                    >
                      <Save size={14} />
                      <span>Save Changes</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProductForm(false);
                        setEditingProduct(null);
                      }}
                      className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-bold uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* C. Staff Accounts Tab */}
      {activeTab === 'staff' && (
        <div className="flex flex-col gap-6">
          <h2 className="text-lg font-bold text-white font-display">Staff Portal Access Accounts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Staff Accounts Card */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col gap-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-3">
                <Users size={16} className="text-amber-500" /> Active Staff Logins
              </h3>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Account ID</p>
                  <p className="text-sm font-bold text-white mt-0.5">staff1</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Password Code</p>
                  <p className="text-sm font-bold text-amber-400 mt-0.5">1234</p>
                </div>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed mt-1">
                These credentials are pre-configured locally in the application stack to allow instant order administration. Staff members logging in with this account will be able to review, contact, and download custom sublimation print uploads.
              </p>
            </div>

            {/* Admin Policy Summary */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col gap-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-3">
                <FolderOpen size={16} className="text-amber-500" /> Administration Instructions
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                As the admin, your product additions, edits, and deletions instantly propagate to the catalog listing on the customer side. Ensure images use high-quality hosted HTTPS URLs (e.g. from Unsplash or image clouds) for optimal loading times.
              </p>
              <div className="bg-amber-500/10 text-amber-400 p-3.5 rounded-xl border border-amber-500/15 text-[10px] leading-relaxed font-bold">
                ⚠️ IMPORTANT: Avoid clearing browser cookies or local data blocks unless you have exported/noted your custom inventory, as Local Storage is bound directly to the active web browser.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
