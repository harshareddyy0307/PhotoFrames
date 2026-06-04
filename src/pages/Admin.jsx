import React, { useState, useEffect, useCallback } from 'react';
import { 
  getProducts, saveProducts, 
  getOrders, deleteOrder, 
  getPromos, addPromo, updatePromo, deletePromo, 
  getStaff, addStaff, updateStaff, deleteStaff 
} from '../utils/db';
import { supabase } from '../utils/supabase';
import { Plus, Edit2, Trash2, DollarSign, ShoppingCart, Loader2, Users, User, FolderOpen, Save, ShieldAlert, Award, Lock, ChevronRight, LogOut, Ticket, Eye, EyeOff, RefreshCw } from 'lucide-react';


export default function Admin() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'orders', 'products', 'staff'

  // Admin Security & Authentication Session State
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('ms_admin_auth') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsLoggedIn(true);
      setLoginError('');
      sessionStorage.setItem('ms_admin_auth', 'true');
    } else {
      setLoginError('Invalid administrator credentials');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('ms_admin_auth');
  };

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
    image: '',
    stock: '25'
  });

  // Orders and metrics state
  const [orders, setOrders] = useState([]);
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  });

  // Promo code states
  const [promos, setPromos] = useState([]);
  const [showPromoForm, setShowPromoForm] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  
  // Promo Code Form fields
  const [promoFormData, setPromoFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    expiryDate: '',
    minOrderValue: '0',
    maxDiscountLimit: '',
    usageLimit: '100',
    status: 'Active'
  });
  
  // Promo list filter/search/pagination state
  const [promoSearchQuery, setPromoSearchQuery] = useState('');
  const [promoStatusFilter, setPromoStatusFilter] = useState('All'); // 'All', 'Active', 'Inactive', 'Expired'
  const [promoCurrentPage, setPromoCurrentPage] = useState(1);
  const promosPerPage = 5;

  // Staff management states
  const [staff, setStaff] = useState([]);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  
  const [staffFormData, setStaffFormData] = useState({
    name: '',
    employeeId: '',
    role: 'Designer',
    phone: '',
    email: '',
    username: '',
    password: '',
    branch: 'Visakhapatnam Main',
    status: 'Active'
  });
  
  const [showResetPassModal, setShowResetPassModal] = useState(false);
  const [resetPassStaff, setResetPassStaff] = useState(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  
  const [staffSearchQuery, setStaffSearchQuery] = useState('');
  const [staffRoleFilter, setStaffRoleFilter] = useState('All');
  const [staffStatusFilter, setStaffStatusFilter] = useState('All');
  const [staffCurrentPage, setStaffCurrentPage] = useState(1);
  const staffsPerPage = 5;
  
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const refreshAllData = useCallback(async () => {
    try {
      const [ordersData, productsData, promosData, staffData] = await Promise.all([
        getOrders(),
        getProducts(),
        getPromos(),
        getStaff()
      ]);
      
      setOrders(ordersData);
      setProducts(productsData);
      setPromos(promosData);
      setStaff(staffData);

      const pending = ordersData.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length;
      const completed = ordersData.filter(o => o.status === 'Completed').length;
      const revenue = ordersData
        .filter(o => o.status === 'Completed')
        .reduce((sum, o) => sum + o.total, 0);
      setMetrics({
        totalOrders: ordersData.length,
        pendingOrders: pending,
        completedOrders: completed,
        totalRevenue: revenue
      });
    } catch (e) {
      console.error("Failed to refresh admin panel data:", e);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      refreshAllData();

      // Subscribe to changes on orders table
      const channel = supabase
        .channel('admin-orders-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders'
          },
          (payload) => {
            console.log('Realtime change received in Admin:', payload);
            refreshAllData();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isLoggedIn, refreshAllData]);

  // Open Staff Form to Add
  const handleAddStaffClick = () => {
    setEditingStaff(null);
    setStaffFormData({
      name: '',
      employeeId: 'EMP-' + Math.floor(1000 + Math.random() * 9000),
      role: 'Designer',
      phone: '',
      email: '',
      username: '',
      password: '',
      branch: 'Visakhapatnam Main',
      status: 'Active'
    });
    setShowStaffForm(true);
  };

  // Open Staff Form to Edit
  const handleEditStaffClick = (member) => {
    setEditingStaff(member);
    setStaffFormData({
      name: member.name,
      employeeId: member.employeeId,
      role: member.role,
      phone: member.phone,
      email: member.email,
      username: member.username,
      password: '', // Kept empty for editing safety (unless resetting)
      branch: member.branch || 'Visakhapatnam Main',
      status: member.status
    });
    setShowStaffForm(true);
  };

  // Submit Staff Form
  const handleStaffFormSubmit = async (e) => {
    e.preventDefault();
    if (!staffFormData.username.trim() || !staffFormData.name.trim()) return;
    
    const staffData = {
      name: staffFormData.name.trim(),
      employeeId: staffFormData.employeeId,
      role: staffFormData.role,
      phone: staffFormData.phone.trim(),
      email: staffFormData.email.trim(),
      username: staffFormData.username.trim().toLowerCase(),
      branch: staffFormData.branch,
      status: staffFormData.status
    };
    
    // If adding, supply password, else keep previous password
    if (!editingStaff) {
      staffData.password = staffFormData.password.trim() || '123456';
    }
    
    try {
      if (editingStaff) {
        await updateStaff(editingStaff.id, staffData);
      } else {
        await addStaff(staffData);
      }
      
      const updatedStaff = await getStaff();
      setStaff(updatedStaff);
      setShowStaffForm(false);
      setEditingStaff(null);
    } catch (err) {
      console.error(err);
      alert('Failed to save staff member details: ' + (err.message || err));
    }
  };

  // Toggle active/inactive instantly for staff
  const handleToggleStaffStatus = async (member) => {
    const newStatus = member.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await updateStaff(member.id, { status: newStatus });
      const updatedStaff = await getStaff();
      setStaff(updatedStaff);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Staff account
  const handleDeleteStaff = async (staffId) => {
    if (window.confirm('Are you sure you want to permanently delete this staff member account?')) {
      try {
        await deleteStaff(staffId);
        const updatedStaff = await getStaff();
        setStaff(updatedStaff);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Open Reset Pass Modal
  const handleOpenResetPass = (member) => {
    setResetPassStaff(member);
    setNewPasswordInput('');
    setShowResetPassModal(true);
  };

  // Submit Reset Pass Form
  const handleResetPassSubmit = async (e) => {
    e.preventDefault();
    if (!newPasswordInput.trim()) return;
    
    try {
      await updateStaff(resetPassStaff.id, { password: newPasswordInput.trim() });
      const updatedStaff = await getStaff();
      setStaff(updatedStaff);
      setShowResetPassModal(false);
      alert(`Password reset successfully for ${resetPassStaff.name}!`);
      setResetPassStaff(null);
    } catch (err) {
      console.error(err);
      alert('Failed to reset staff password: ' + (err.message || err));
    }
  };

  // Auto Generate Password
  const handleAutoGeneratePassword = () => {
    const pass = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit PIN
    setNewPasswordInput(pass);
  };

  // Eye toggle decrypt visualizer
  const togglePasswordVisibility = (staffId) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [staffId]: !prev[staffId]
    }));
  };

  // Open Promo form to Add
  const handleAddPromoClick = () => {
    setEditingPromo(null);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 30);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    setPromoFormData({
      code: '',
      discountType: 'percentage',
      discountValue: '15',
      expiryDate: tomorrowStr,
      minOrderValue: '500',
      maxDiscountLimit: '150',
      usageLimit: '50',
      status: 'Active'
    });
    setShowPromoForm(true);
  };

  // Open Promo form to Edit
  const handleEditPromoClick = (promo) => {
    setEditingPromo(promo);
    setPromoFormData({
      code: promo.code,
      discountType: promo.discountType,
      discountValue: promo.discountValue.toString(),
      expiryDate: promo.expiryDate,
      minOrderValue: (promo.minOrderValue || 0).toString(),
      maxDiscountLimit: (promo.maxDiscountLimit || '').toString(),
      usageLimit: (promo.usageLimit || 100).toString(),
      status: promo.status
    });
    setShowPromoForm(true);
  };

  // Auto Generate Promo Code
  const handleAutoGeneratePromo = () => {
    const prefixes = ['SAVE', 'CRAFT', 'DEAL', 'WELCOME', 'FESTIVE', 'SUPER', 'DISCOUNT', 'LOVE'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = Math.floor(100 + Math.random() * 900);
    const generatedCode = `${randomPrefix}${randomNum}`;
    
    setPromoFormData(prev => ({
      ...prev,
      code: generatedCode
    }));
  };

  // Submit Promo Form
  const handlePromoFormSubmit = async (e) => {
    e.preventDefault();
    if (!promoFormData.code.trim()) return;
    
    const formattedCode = promoFormData.code.trim().toUpperCase();
    const valNum = parseFloat(promoFormData.discountValue) || 0;
    const minOrderNum = parseFloat(promoFormData.minOrderValue) || 0;
    const maxLimitNum = promoFormData.maxDiscountLimit ? parseFloat(promoFormData.maxDiscountLimit) : null;
    const usageLimitNum = parseInt(promoFormData.usageLimit) || 100;
    
    const promoData = {
      code: formattedCode,
      discountType: promoFormData.discountType,
      discountValue: valNum,
      expiryDate: promoFormData.expiryDate,
      minOrderValue: minOrderNum,
      maxDiscountLimit: maxLimitNum,
      usageLimit: usageLimitNum,
      status: promoFormData.status
    };
    
    try {
      if (editingPromo) {
        await updatePromo(editingPromo.id, promoData);
      } else {
        await addPromo(promoData);
      }
      
      const promosList = await getPromos();
      setPromos(promosList);
      setShowPromoForm(false);
      setEditingPromo(null);
    } catch (err) {
      console.error(err);
      alert('Failed to save promo code: ' + (err.message || err));
    }
  };

  // Delete Promo Code
  const handleDeletePromo = async (promoId) => {
    if (window.confirm('Are you sure you want to permanently delete this promo code?')) {
      try {
        await deletePromo(promoId);
        const promosList = await getPromos();
        setPromos(promosList);
      } catch (err) {
        console.error(err);
        alert('Failed to delete promo code: ' + (err.message || err));
      }
    }
  };

  // Toggle active/inactive instantly
  const handleTogglePromoStatus = async (promo) => {
    const newStatus = promo.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await updatePromo(promo.id, { status: newStatus });
      const promosList = await getPromos();
      setPromos(promosList);
    } catch (err) {
      console.error(err);
      alert('Failed to update promo code status: ' + (err.message || err));
    }
  };

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
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80', // default Unsplash
      stock: '25'
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
      sizes: product.sizePrices && Object.keys(product.sizePrices).length > 0
        ? Object.entries(product.sizePrices).map(([size, price]) => `${size}:${price}`).join(', ')
        : product.sizes.join(', '),
      description: product.description,
      image: product.image,
      stock: (product.stock !== undefined ? product.stock : 25).toString()
    });
    setShowProductForm(true);
  };

  // Submit Product Form
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const priceNum = parseFloat(formData.price) || 0;
    const stockNum = parseInt(formData.stock) >= 0 ? parseInt(formData.stock) : 25;

    const sizesArray = [];
    const sizePricesObj = {};

    formData.sizes.split(',').forEach((s, index) => {
      const parts = s.split(':');
      const sizeName = parts[0].trim();
      if (sizeName.length > 0) {
        sizesArray.push(sizeName);
        if (parts[1]) {
          const sizePrice = parseFloat(parts[1].trim());
          if (!isNaN(sizePrice)) {
            sizePricesObj[sizeName] = sizePrice;
          }
        }
      }
    });

    // Backfill any sizes that didn't have explicit colons
    sizesArray.forEach((size, index) => {
      if (sizePricesObj[size] === undefined) {
        if (size.toLowerCase().includes('6x8')) {
          sizePricesObj[size] = Math.round(priceNum * 0.77);
        } else if (size.toLowerCase().includes('8x10')) {
          sizePricesObj[size] = priceNum;
        } else if (size.toLowerCase().includes('12x12')) {
          sizePricesObj[size] = Math.round(priceNum * 1.33);
        } else if (size.toLowerCase().includes('16x20')) {
          sizePricesObj[size] = Math.round(priceNum * 1.66);
        } else {
          if (index === 0 && sizesArray.length > 1) {
            sizePricesObj[size] = Math.round(priceNum * 0.77);
          } else if (index === sizesArray.length - 1 && sizesArray.length > 1) {
            sizePricesObj[size] = Math.round(priceNum * 1.33);
          } else {
            sizePricesObj[size] = priceNum;
          }
        }
      }
    });

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
            sizePrices: sizePricesObj,
            description: formData.description,
            image: formData.image,
            stock: stockNum
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
        sizePrices: sizePricesObj,
        description: formData.description,
        image: formData.image,
        stock: stockNum
      };
      updatedProducts = [newProduct, ...products];
    }

    try {
      await saveProducts(updatedProducts);
      setProducts(updatedProducts);
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (err) {
      console.error(err);
      alert('Failed to save product: ' + (err.message || err));
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product from the inventory?')) {
      const updated = products.filter(p => p.id !== productId);
      try {
        await saveProducts(updated);
        setProducts(updated);
      } catch (err) {
        console.error(err);
        alert('Failed to delete product: ' + (err.message || err));
      }
    }
  };

  // Adjust Stock Level Inline
  const handleStockAdjust = async (productId, change) => {
    const updated = products.map(p => {
      if (p.id === productId) {
        const currentStock = p.stock !== undefined ? p.stock : 25;
        const newStock = Math.max(0, currentStock + change);
        return { ...p, stock: newStock };
      }
      return p;
    });
    try {
      await saveProducts(updated);
      setProducts(updated);
    } catch (err) {
      console.error(err);
      alert('Failed to adjust stock level: ' + (err.message || err));
    }
  };

  // Guarded Admin Login Screen Render
  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 flex flex-col justify-center min-h-[500px]">
        <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl flex flex-col gap-6 animate-scale-up">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="p-4 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
              <Lock size={32} />
            </div>
            <h2 className="text-2xl font-black text-white font-display mt-2">Admin Security</h2>
            <p className="text-xs text-gray-400">Log in with master credentials to configure inventory catalogs.</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Admin Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-semibold focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Access Passcode</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-semibold focus:outline-none"
              />
            </div>

            {loginError && <p className="text-[10px] text-red-400 font-extrabold">{loginError}</p>}

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover-scale cursor-pointer"
            >
              <span>Unlock Admin Panel</span>
              <ChevronRight size={14} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filter and paginate promo codes
  const filteredPromos = promos.filter(promo => {
    const matchesSearch = promo.code.toLowerCase().includes(promoSearchQuery.toLowerCase());
    
    const isExpired = new Date(promo.expiryDate) < new Date(new Date().setHours(0, 0, 0, 0));
    
    if (promoStatusFilter === 'Active') {
      return matchesSearch && promo.status === 'Active' && !isExpired;
    } else if (promoStatusFilter === 'Inactive') {
      return matchesSearch && promo.status === 'Inactive';
    } else if (promoStatusFilter === 'Expired') {
      return matchesSearch && isExpired;
    }
    return matchesSearch;
  });

  const totalPagesPromos = Math.ceil(filteredPromos.length / promosPerPage);
  const paginatedPromos = filteredPromos.slice(
    (promoCurrentPage - 1) * promosPerPage,
    promoCurrentPage * promosPerPage
  );

  // Filter and paginate staff members
  const filteredStaff = staff.filter(member => {
    const query = staffSearchQuery.toLowerCase();
    const matchesSearch = 
      member.name.toLowerCase().includes(query) ||
      member.employeeId.toLowerCase().includes(query) ||
      member.username.toLowerCase().includes(query);
      
    const matchesRole = staffRoleFilter === 'All' || member.role === staffRoleFilter;
    const matchesStatus = staffStatusFilter === 'All' || member.status === staffStatusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPagesStaff = Math.ceil(filteredStaff.length / staffsPerPage);
  const paginatedStaff = filteredStaff.slice(
    (staffCurrentPage - 1) * staffsPerPage,
    staffCurrentPage * staffsPerPage
  );

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

        <button
          onClick={handleLogout}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-extrabold uppercase tracking-wider border border-red-500/20 flex items-center gap-1.5 transition-all hover-scale cursor-pointer"
        >
          <LogOut size={14} />
          <span>Lock Console</span>
        </button>
      </div>
      {/* Tab Selector Links */}
      <div className="flex gap-2 bg-slate-950 p-1 rounded-xl border border-white/5 self-start sm:self-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'dashboard'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'text-gray-400 hover:text-white'
            }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'orders'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'text-gray-400 hover:text-white'
            }`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'products'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'text-gray-400 hover:text-white'
            }`}
        >
          Inventory
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'staff'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'text-gray-400 hover:text-white'
            }`}
        >
          Staff Accounts
        </button>
        <button
          onClick={() => setActiveTab('promos')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'promos'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'text-gray-400 hover:text-white'
            }`}
        >
          Promo Codes
        </button>
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
                <p className="text-[10px] text-gray-500 mt-1">Stored in database</p>
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
                    <th className="p-4">Stock Level</th>
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
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1.5 max-w-[280px]">
                          {product.sizes.map((size) => {
                            const sizePrice = product.sizePrices ? product.sizePrices[size] : null;
                            return (
                              <span 
                                key={size}
                                className="bg-slate-950 border border-white/5 text-gray-300 px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 font-mono hover:border-amber-500/20 transition-all"
                              >
                                <span className="text-gray-400">{size}:</span>
                                <span className="text-amber-400 font-black">₹{sizePrice || product.price}</span>
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleStockAdjust(product.id, -1)}
                            className="p-1 rounded bg-white/5 border border-white/10 hover:border-amber-500/20 text-gray-400 hover:text-white transition-colors cursor-pointer w-6 h-6 flex items-center justify-center font-bold text-xs"
                            title="Decrease Stock"
                          >
                            -
                          </button>
                          <span className={`w-8 text-center font-extrabold ${(product.stock !== undefined ? product.stock : 25) <= 5
                              ? 'text-red-400'
                              : 'text-gray-200'
                            }`}>
                            {product.stock !== undefined ? product.stock : 25}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleStockAdjust(product.id, 1)}
                            className="p-1 rounded bg-white/5 border border-white/10 hover:border-amber-500/20 text-gray-400 hover:text-white transition-colors cursor-pointer w-6 h-6 flex items-center justify-center font-bold text-xs"
                            title="Increase Stock"
                          >
                            +
                          </button>
                        </div>
                      </td>
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Sizes */}
                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Sizes & Prices (comma-separated)</label>
                        <input
                          type="text"
                          name="sizes"
                          value={formData.sizes}
                          onChange={handleInputChange}
                          required
                          placeholder="6x8:699, 8x10:899, 12x12:1199"
                          className="px-4 py-2.5 rounded-xl glass-input focus:outline-none"
                        />
                        <span className="text-[9px] text-amber-500/80 font-semibold leading-normal">
                          * Format as "Size:Price" (e.g. 6x8:699) to set size pricing. Simple sizes will scale proportionally from base price.
                        </span>
                      </div>

                      {/* Stock level */}
                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Stock Qty (Units)</label>
                        <input
                          type="number"
                          name="stock"
                          value={formData.stock}
                          onChange={handleInputChange}
                          required
                          min="0"
                          placeholder="25"
                          className="px-4 py-2.5 rounded-xl glass-input focus:outline-none"
                        />
                      </div>
                    </div></div>

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

      {/* C. Staff Management Tab */}
      {activeTab === 'staff' && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-bold text-white font-display">Staff Management Dashboard</h2>
            <button
              onClick={handleAddStaffClick}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl hover-scale flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/10 self-start sm:self-auto"
            >
              <Plus size={14} className="stroke-[2.5]" />
              <span>Add Staff Member</span>
            </button>
          </div>

          {/* Search, Filter controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/40 p-4 rounded-2xl border border-white/5">
            <div>
              <input
                type="text"
                placeholder="Search by name, EMP ID, username..."
                value={staffSearchQuery}
                onChange={(e) => {
                  setStaffSearchQuery(e.target.value);
                  setStaffCurrentPage(1);
                }}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-semibold focus:outline-none"
              />
            </div>
            <div>
              <select
                value={staffRoleFilter}
                onChange={(e) => {
                  setStaffRoleFilter(e.target.value);
                  setStaffCurrentPage(1);
                }}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-slate-900 text-white">All Roles/Designations</option>
                <option value="Manager" className="bg-slate-900 text-white">Manager</option>
                <option value="Designer" className="bg-slate-900 text-white">Designer</option>
                <option value="Printer" className="bg-slate-900 text-white">Printer</option>
                <option value="Packager" className="bg-slate-900 text-white">Packager</option>
              </select>
            </div>
            <div>
              <select
                value={staffStatusFilter}
                onChange={(e) => {
                  setStaffStatusFilter(e.target.value);
                  setStaffCurrentPage(1);
                }}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-slate-900 text-white">All Statuses</option>
                <option value="Active" className="bg-slate-900 text-white">Active</option>
                <option value="Inactive" className="bg-slate-900 text-white">Inactive</option>
              </select>
            </div>
          </div>

          {/* Staff List Table */}
          <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-white/5 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Staff Name & EMP ID</th>
                    <th className="p-4">Secure Credentials</th>
                    <th className="p-4">Role / Branch</th>
                    <th className="p-4">Contact Info</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-semibold">
                  {paginatedStaff.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                        No Staff Accounts Found
                      </td>
                    </tr>
                  ) : (
                    paginatedStaff.map((member) => {
                      let decryptedPassword = '';
                      try {
                        decryptedPassword = window.atob(member.password);
                      } catch {
                        decryptedPassword = member.password;
                      }
                      const isVisible = !!visiblePasswords[member.id];
                      
                      return (
                        <tr key={member.id} className="hover:bg-white/5 transition-all">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                                <User size={16} />
                              </div>
                              <div>
                                <h4 className="font-extrabold text-white text-sm">{member.name}</h4>
                                <p className="text-[10px] text-amber-500 font-black mt-0.5">{member.employeeId}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-gray-300">
                            <p className="text-gray-400 font-semibold">User: <span className="font-bold text-white font-mono">{member.username}</span></p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-[10px] text-gray-500">Pass:</span>
                              <span className="font-bold text-gray-300 tracking-widest font-mono">
                                {isVisible ? decryptedPassword : '••••••••'}
                              </span>
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility(member.id)}
                                className="p-1 hover:bg-white/5 text-gray-500 hover:text-white rounded transition-colors cursor-pointer"
                                title={isVisible ? 'Hide Password' : 'Show Decrypted Password'}
                              >
                                {isVisible ? <EyeOff size={12} /> : <Eye size={12} />}
                              </button>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="bg-indigo-500/15 border border-indigo-500/25 px-2.5 py-0.5 rounded-full text-indigo-400 text-[9px] font-black uppercase">
                              {member.role}
                            </span>
                            <p className="text-[10px] text-gray-500 font-normal mt-1">{member.branch}</p>
                          </td>
                          <td className="p-4 text-gray-400">
                            <p>{member.email}</p>
                            <p className="text-[10px] text-gray-500 font-normal mt-0.5">{member.phone}</p>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleToggleStaffStatus(member)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border cursor-pointer transition-all hover:scale-105 ${
                                member.status === 'Active'
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                                  : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                              }`}
                              title="Click to toggle status"
                            >
                              {member.status}
                            </button>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOpenResetPass(member)}
                                className="p-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg transition-all cursor-pointer"
                                title="Reset/Regenerate Password"
                              >
                                <Lock size={12} />
                              </button>
                              <button
                                onClick={() => handleEditStaffClick(member)}
                                className="p-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg transition-all cursor-pointer"
                                title="Edit Staff Member"
                              >
                                <Edit2 size={12} />
                              </button>
                              {member.id !== 'st-1' && (
                                <button
                                  onClick={() => handleDeleteStaff(member.id)}
                                  className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all cursor-pointer"
                                  title="Delete Staff Account"
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Staff Pagination Controls */}
          {totalPagesStaff > 1 && (
            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                Page {staffCurrentPage} of {totalPagesStaff}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setStaffCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={staffCurrentPage === 1}
                  className="px-3 py-1.5 bg-slate-900 border border-white/5 hover:border-white/10 text-gray-400 hover:text-white rounded-lg text-[10px] font-bold uppercase disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  Previous
                </button>
                <button
                  onClick={() => setStaffCurrentPage(prev => Math.min(totalPagesStaff, prev + 1))}
                  disabled={staffCurrentPage === totalPagesStaff}
                  className="px-3 py-1.5 bg-slate-900 border border-white/5 hover:border-white/10 text-gray-400 hover:text-white rounded-lg text-[10px] font-bold uppercase disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}


      {/* D. Orders Tab */}
      {activeTab === 'orders' && (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white font-display">Customer Orders</h2>
            <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-gray-300 text-xs font-semibold">
              Total: {orders.length} Orders
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {orders.length === 0 ? (
              <div className="glass-panel rounded-2xl p-12 text-center border border-white/5 flex flex-col items-center justify-center gap-4">
                <span className="text-4xl">📭</span>
                <p className="text-sm font-semibold text-gray-300">No orders registered in the Database yet.</p>
              </div>
            ) : (
              <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-950/80 border-b border-white/5 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-4">Order ID & Date</th>
                        <th className="p-4">Customer Details</th>
                        <th className="p-4">Products Ordered</th>
                        <th className="p-4">Grand Total</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-semibold">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-white/5 transition-all">
                          <td className="p-4">
                            <span className="text-amber-400 font-black tracking-wider block bg-amber-500/10 px-2.5 py-1 rounded-md text-center max-w-[110px] border border-amber-500/10">
                              {order.id}
                            </span>
                            <span className="text-[10px] text-gray-500 block mt-1.5 font-normal">
                              {new Date(order.date).toLocaleString()}
                            </span>
                          </td>
                          <td className="p-4">
                            <h4 className="font-bold text-white text-sm">{order.customer.name}</h4>
                            <p className="text-gray-400 font-normal mt-0.5">{order.customer.phone}</p>
                            <p className="text-[10px] text-gray-500 font-normal mt-1 leading-normal max-w-[200px]">
                              {order.customer.address}, {order.customer.city} - {order.customer.pincode}
                              {order.customer.landmark && <span className="block text-amber-500/80">LM: {order.customer.landmark}</span>}
                            </p>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col gap-1">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <span className="text-[10px] text-gray-400 font-sans">
                                    • {item.name} ({item.size}) <span className="text-amber-500 font-extrabold font-sans">x{item.quantity}</span>
                                  </span>
                                  {item.customImage && (
                                    <span className="text-[8px] font-black text-emerald-400 bg-emerald-500/10 px-1 rounded">📸 PHOTO</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 text-amber-400 font-extrabold text-sm">₹{order.total}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${order.status === 'Completed'
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                : order.status === 'Processing'
                                  ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                                  : order.status === 'Cancelled'
                                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                              }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={async () => {
                                if (window.confirm(`Are you sure you want to permanently delete order ${order.id} from the database?`)) {
                                  try {
                                    await deleteOrder(order.id);
                                    const updated = orders.filter(o => o.id !== order.id);
                                    setOrders(updated);
                                    
                                    // Recalculate metrics on deletion
                                    const pending = updated.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length;
                                    const completed = updated.filter(o => o.status === 'Completed').length;
                                    const revenue = updated
                                      .filter(o => o.status === 'Completed')
                                      .reduce((sum, o) => sum + o.total, 0);
                                    
                                    setMetrics({
                                      totalOrders: updated.length,
                                      pendingOrders: pending,
                                      completedOrders: completed,
                                      totalRevenue: revenue
                                    });
                                  } catch (err) {
                                    console.error(err);
                                    alert('Failed to delete order: ' + (err.message || err));
                                  }
                                }
                              }}
                              className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all cursor-pointer"
                              title="Delete Order Record"
                            >
                              <Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* E. Promo Codes Tab */}
      {activeTab === 'promos' && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-bold text-white font-display">Promo Code Generator</h2>
            <button
              onClick={handleAddPromoClick}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl hover-scale flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/10 self-start sm:self-auto"
            >
              <Plus size={14} className="stroke-[2.5]" />
              <span>Create Promo Code</span>
            </button>
          </div>

          {/* Search, Filter controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/40 p-4 rounded-2xl border border-white/5">
            <div className="sm:col-span-2">
              <input
                type="text"
                placeholder="Search promo codes..."
                value={promoSearchQuery}
                onChange={(e) => {
                  setPromoSearchQuery(e.target.value);
                  setPromoCurrentPage(1);
                }}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-semibold focus:outline-none"
              />
            </div>
            <div>
              <select
                value={promoStatusFilter}
                onChange={(e) => {
                  setPromoStatusFilter(e.target.value);
                  setPromoCurrentPage(1);
                }}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-slate-900 text-white">All Statuses</option>
                <option value="Active" className="bg-slate-900 text-white">Active & Ongoing</option>
                <option value="Inactive" className="bg-slate-900 text-white">Inactive</option>
                <option value="Expired" className="bg-slate-900 text-white">Expired</option>
              </select>
            </div>
          </div>

          {/* Promos List Table */}
          <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-white/5 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4">Promo Code Details</th>
                    <th className="p-4">Discount Settings</th>
                    <th className="p-4">Expiry Date</th>
                    <th className="p-4">Min Order / Max Discount</th>
                    <th className="p-4">Usage Stats</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-semibold">
                  {paginatedPromos.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                        No Promo Codes Found
                      </td>
                    </tr>
                  ) : (
                    paginatedPromos.map((promo) => {
                      const isExpired = new Date(promo.expiryDate) < new Date(new Date().setHours(0, 0, 0, 0));
                      return (
                        <tr key={promo.id} className="hover:bg-white/5 transition-all">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                                <Ticket size={16} />
                              </div>
                              <div>
                                <h4 className="font-extrabold text-white text-sm tracking-wide uppercase">{promo.code}</h4>
                                <p className="text-[10px] text-gray-500 font-normal mt-0.5">ID: {promo.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-amber-400 font-black text-sm uppercase">
                            {promo.discountType === 'percentage' 
                              ? `${promo.discountValue}% Off` 
                              : `₹${promo.discountValue} Off`}
                          </td>
                          <td className="p-4 text-gray-300">
                            <span className={isExpired ? 'text-red-400 line-through' : ''}>
                              {new Date(promo.expiryDate).toLocaleDateString()}
                            </span>
                            {isExpired && (
                              <span className="ml-1.5 bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase">
                                Expired
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-gray-400">
                            <p>Min Order: ₹{promo.minOrderValue || 0}</p>
                            <p className="text-[10px] text-gray-500 font-normal mt-0.5">
                              Max Cap: {promo.maxDiscountLimit ? `₹${promo.maxDiscountLimit}` : 'No limit'}
                            </p>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col gap-1.5 w-32">
                              <div className="flex justify-between text-[10px]">
                                <span className="text-gray-400">{promo.usageCount || 0} / {promo.usageLimit} used</span>
                              </div>
                              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className="bg-amber-500 h-1.5 rounded-full" 
                                  style={{ width: `${Math.min(100, ((promo.usageCount || 0) / promo.usageLimit) * 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleTogglePromoStatus(promo)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border cursor-pointer transition-all hover:scale-105 ${
                                promo.status === 'Active' && !isExpired
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                                  : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                              }`}
                              title="Click to toggle status"
                            >
                              {promo.status === 'Active' && !isExpired ? 'Active' : promo.status === 'Inactive' ? 'Inactive' : 'Expired'}
                            </button>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEditPromoClick(promo)}
                                className="p-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg transition-all cursor-pointer"
                                title="Edit Promo Code"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                onClick={() => handleDeletePromo(promo.id)}
                                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all cursor-pointer"
                                title="Delete Promo Code"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Promo Pagination Controls */}
          {totalPagesPromos > 1 && (
            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                Page {promoCurrentPage} of {totalPagesPromos}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPromoCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={promoCurrentPage === 1}
                  className="px-3 py-1.5 bg-slate-900 border border-white/5 hover:border-white/10 text-gray-400 hover:text-white rounded-lg text-[10px] font-bold uppercase disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPromoCurrentPage(prev => Math.min(totalPagesPromos, prev + 1))}
                  disabled={promoCurrentPage === totalPagesPromos}
                  className="px-3 py-1.5 bg-slate-900 border border-white/5 hover:border-white/10 text-gray-400 hover:text-white rounded-lg text-[10px] font-bold uppercase disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* F. Add/Edit Promo Modal */}
      {showPromoForm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-white/10 rounded-3xl w-full max-w-lg p-6 sm:p-8 flex flex-col gap-6 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white font-display flex items-center gap-1.5">
                  <Ticket size={20} className="text-amber-500" />
                  {editingPromo ? 'Edit Promo Code' : 'Create Promo Code'}
                </h3>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {editingPromo ? `Modify configurations of coupon: ${editingPromo.code}` : 'Add a new custom coupon with specific values.'}
                </p>
              </div>
              <button
                onClick={() => setShowPromoForm(false)}
                className="p-1.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePromoFormSubmit} className="flex flex-col gap-4 text-xs font-semibold text-gray-300">
              {/* Promo Code & AutoGen Button */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Promo Code Name</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoFormData.code}
                    onChange={(e) => setPromoFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    required
                    placeholder="E.g. WELCOME50"
                    className="flex-1 px-4 py-2.5 rounded-xl glass-input focus:outline-none uppercase text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAutoGeneratePromo}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer hover-scale"
                  >
                    Auto Gen
                  </button>
                </div>
              </div>

              {/* Discount Type & Discount Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Discount Type</label>
                  <select
                    value={promoFormData.discountType}
                    onChange={(e) => setPromoFormData(prev => ({ ...prev, discountType: e.target.value }))}
                    className="px-4 py-2.5 rounded-xl glass-input focus:outline-none cursor-pointer"
                  >
                    <option value="percentage" className="bg-slate-900 text-white">Percentage (%)</option>
                    <option value="fixed" className="bg-slate-900 text-white">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    Discount Value {promoFormData.discountType === 'percentage' ? '(%)' : '(₹)'}
                  </label>
                  <input
                    type="number"
                    value={promoFormData.discountValue}
                    onChange={(e) => setPromoFormData(prev => ({ ...prev, discountValue: e.target.value }))}
                    required
                    min="1"
                    max={promoFormData.discountType === 'percentage' ? '100' : '10000'}
                    placeholder={promoFormData.discountType === 'percentage' ? '15' : '150'}
                    className="px-4 py-2.5 rounded-xl glass-input focus:outline-none"
                  />
                </div>
              </div>

              {/* Expiry Date & Usage Limit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Expiry Date</label>
                  <input
                    type="date"
                    value={promoFormData.expiryDate}
                    onChange={(e) => setPromoFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                    required
                    className="px-4 py-2.5 rounded-xl glass-input focus:outline-none cursor-pointer text-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Usage Limit</label>
                  <input
                    type="number"
                    value={promoFormData.usageLimit}
                    onChange={(e) => setPromoFormData(prev => ({ ...prev, usageLimit: e.target.value }))}
                    required
                    min="1"
                    placeholder="100"
                    className="px-4 py-2.5 rounded-xl glass-input focus:outline-none"
                  />
                </div>
              </div>

              {/* Min Order Value & Max Discount Limit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Minimum Order Value (₹)</label>
                  <input
                    type="number"
                    value={promoFormData.minOrderValue}
                    onChange={(e) => setPromoFormData(prev => ({ ...prev, minOrderValue: e.target.value }))}
                    required
                    min="0"
                    placeholder="500"
                    className="px-4 py-2.5 rounded-xl glass-input focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    value={promoFormData.maxDiscountLimit}
                    onChange={(e) => setPromoFormData(prev => ({ ...prev, maxDiscountLimit: e.target.value }))}
                    placeholder="Leave empty for no cap"
                    disabled={promoFormData.discountType === 'fixed'}
                    className="px-4 py-2.5 rounded-xl glass-input focus:outline-none disabled:opacity-40"
                  />
                </div>
              </div>

              {/* Status Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Initial Status</label>
                <select
                  value={promoFormData.status}
                  onChange={(e) => setPromoFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="px-4 py-2.5 rounded-xl glass-input focus:outline-none cursor-pointer"
                >
                  <option value="Active" className="bg-slate-900 text-white">Active</option>
                  <option value="Inactive" className="bg-slate-900 text-white">Inactive</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowPromoForm(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase tracking-widest transition-all cursor-pointer hover-scale shadow-lg shadow-amber-500/10 text-center"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* G. Add/Edit Staff Modal */}
      {showStaffForm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-white/10 rounded-3xl w-full max-w-lg p-6 sm:p-8 flex flex-col gap-6 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white font-display flex items-center gap-1.5">
                  <User size={20} className="text-amber-500" />
                  {editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}
                </h3>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {editingStaff ? `Configure access settings for: ${editingStaff.name}` : 'Create a new staff portal login with role permissions.'}
                </p>
              </div>
              <button
                onClick={() => setShowStaffForm(false)}
                className="p-1.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleStaffFormSubmit} className="flex flex-col gap-4 text-xs font-semibold text-gray-300">
              {/* Full Name & Employee ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    value={staffFormData.name}
                    onChange={(e) => setStaffFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    placeholder="Your Full Name"
                    className="px-4 py-2.5 rounded-xl glass-input focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Employee ID</label>
                  <input
                    type="text"
                    value={staffFormData.employeeId}
                    onChange={(e) => setStaffFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                    required
                    placeholder="EMP-9999"
                    className="px-4 py-2.5 rounded-xl glass-input focus:outline-none text-white font-mono"
                  />
                </div>
              </div>

              {/* Role & Branch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Role/Designation</label>
                  <select
                    value={staffFormData.role}
                    onChange={(e) => setStaffFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="px-4 py-2.5 rounded-xl glass-input focus:outline-none cursor-pointer"
                  >
                    <option value="Manager" className="bg-slate-900 text-white">Manager (Unrestricted)</option>
                    <option value="Designer" className="bg-slate-900 text-white">Designer (Read-only)</option>
                    <option value="Printer" className="bg-slate-900 text-white">Printer (Print & Update)</option>
                    <option value="Packager" className="bg-slate-900 text-white">Packager (Pack & Dispatch)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Branch/Department</label>
                  <input
                    type="text"
                    value={staffFormData.branch}
                    onChange={(e) => setStaffFormData(prev => ({ ...prev, branch: e.target.value }))}
                    required
                    placeholder="Visakhapatnam Main"
                    className="px-4 py-2.5 rounded-xl glass-input focus:outline-none"
                  />
                </div>
              </div>

              {/* Contact Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    value={staffFormData.email}
                    onChange={(e) => setStaffFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    placeholder="employee@framecraft.com"
                    className="px-4 py-2.5 rounded-xl glass-input focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Phone Number</label>
                  <input
                    type="text"
                    value={staffFormData.phone}
                    onChange={(e) => setStaffFormData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                    placeholder="91xxxxxxxxxx"
                    className="px-4 py-2.5 rounded-xl glass-input focus:outline-none"
                  />
                </div>
              </div>

              {/* Username & Initial Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Username</label>
                  <input
                    type="text"
                    value={staffFormData.username}
                    onChange={(e) => setStaffFormData(prev => ({ ...prev, username: e.target.value.toLowerCase() }))}
                    required
                    disabled={!!editingStaff}
                    placeholder="E.g. kiran1"
                    className="px-4 py-2.5 rounded-xl glass-input focus:outline-none disabled:opacity-50 text-white font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    {editingStaff ? 'Password (Managed via Reset Button)' : 'Initial Password'}
                  </label>
                  <input
                    type="password"
                    value={staffFormData.password}
                    onChange={(e) => setStaffFormData(prev => ({ ...prev, password: e.target.value }))}
                    required={!editingStaff}
                    disabled={!!editingStaff}
                    placeholder={editingStaff ? '••••••••' : 'Enter login passcode'}
                    className="px-4 py-2.5 rounded-xl glass-input focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Status Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Initial Status</label>
                <select
                  value={staffFormData.status}
                  onChange={(e) => setStaffFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="px-4 py-2.5 rounded-xl glass-input focus:outline-none cursor-pointer"
                >
                  <option value="Active" className="bg-slate-900 text-white">Active</option>
                  <option value="Inactive" className="bg-slate-900 text-white">Inactive</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowStaffForm(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase tracking-widest transition-all cursor-pointer hover-scale shadow-lg shadow-amber-500/10 text-center"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* H. Reset Password Modal */}
      {showResetPassModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-white/10 rounded-3xl w-full max-w-sm p-6 flex flex-col gap-6 shadow-2xl animate-scale-up">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white font-display flex items-center gap-1.5">
                  <Lock size={18} className="text-amber-500" />
                  <span>Reset Password</span>
                </h3>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Regenerate login credentials securely for: <span className="font-bold text-white">{resetPassStaff?.name}</span>
                </p>
              </div>
              <button
                onClick={() => setShowResetPassModal(false)}
                className="p-1.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleResetPassSubmit} className="flex flex-col gap-4 text-xs font-semibold text-gray-300">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">New Password / Passcode</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    required
                    placeholder="E.g. 582914"
                    className="flex-1 px-4 py-2.5 rounded-xl glass-input focus:outline-none text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAutoGeneratePassword}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer hover-scale"
                  >
                    Auto Gen
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowResetPassModal(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase tracking-widest transition-all cursor-pointer hover-scale shadow-lg shadow-amber-500/10 text-center"
                >
                  Confirm Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
