import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { getOrders } from '../utils/db';
import { 
  User, Mail, Phone, MapPin, Landmark, Home, 
  Package, Calendar, CheckCircle2, Clock, XCircle, 
  ChevronDown, ChevronUp, Save, LogOut, ShoppingBag, 
  AlertCircle, ShieldAlert 
} from 'lucide-react';

export default function Profile() {
  const { currentUser, updateProfile, logoutCustomer, navigate } = useCart();
  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Profile Form States
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    landmark: ''
  });

  const [formErrors, setFormErrors] = useState({});

  // Fetch orders matching current user
  useEffect(() => {
    if (currentUser) {
      // Set initial form details
      setFormData({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        city: currentUser.city || '',
        pincode: currentUser.pincode || '',
        landmark: currentUser.landmark || ''
      });

      // Fetch user's orders
      getOrders().then(allOrders => {
        const filtered = allOrders.filter(o => 
          o.user_id === currentUser.id || 
          o.customer?.email?.toLowerCase() === currentUser.email?.toLowerCase() || 
          o.customer?.phone === currentUser.phone
        );
        setOrders(filtered);
      }).catch(err => {
        console.error("Failed to load user orders:", err);
      });
    }
  }, [currentUser]);

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      errors.phone = 'Enter a valid 10-digit mobile number';
    }

    if (!formData.address.trim()) errors.address = 'Street address is required';
    if (!formData.city.trim()) errors.city = 'City name is required';

    const pincodeRegex = /^\d{6}$/;
    if (!formData.pincode.trim()) {
      errors.pincode = 'Pincode is required';
    } else if (!pincodeRegex.test(formData.pincode.trim())) {
      errors.pincode = 'Enter a valid 6-digit postal pincode';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Update Profile Callback
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (validateForm()) {
      try {
        await updateProfile(formData);
        setSuccessMessage('Shipping profile coordinates updated successfully!');
        
        // Hide success message after 4 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 4000);
      } catch (err) {
        setErrorMessage(err.message || 'Failed to update profile coordinates.');
      }
    }
  };

  // Toggle order expansion
  const toggleOrder = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // Redirect if not signed in
  if (!currentUser) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center flex flex-col items-center justify-center gap-6">
        <div className="p-4 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20 shadow-xl">
          <ShieldAlert size={48} className="stroke-[2]" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight font-display">Authentication Required</h2>
        <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
          You need to sign in or register to access the Customer Account dashboard, shipping templates, and order ledgers.
        </p>
        <button
          onClick={() => navigate('auth')}
          className="px-6 py-3 bg-amber-500 text-slate-950 font-extrabold text-xs uppercase tracking-widest rounded-xl hover-scale cursor-pointer"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  // Get status color coding
  const getStatusDetails = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return {
          icon: CheckCircle2,
          bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
          label: 'Completed'
        };
      case 'cancelled':
        return {
          icon: XCircle,
          bg: 'bg-red-500/10 border-red-500/20 text-red-400',
          label: 'Cancelled'
        };
      default:
        return {
          icon: Clock,
          bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
          label: 'Pending Review'
        };
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-display">
            Customer Dashboard
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage your default shipping profile and audit past frame purchases.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right hidden sm:block">
            <span className="text-xs font-bold text-gray-300">{currentUser.name}</span>
            <span className="text-[10px] text-gray-500 font-semibold">{currentUser.email}</span>
          </div>
          
          <button
            onClick={logoutCustomer}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 text-gray-400 hover:text-red-400 text-xs font-bold uppercase tracking-wider transition-all hover-scale cursor-pointer"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-center text-xs font-bold max-w-3xl mx-auto w-full leading-normal">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center text-xs font-bold max-w-3xl mx-auto w-full leading-normal">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Left 2 Cols: Shipping Form Profile Editor */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 shadow-2xl flex flex-col gap-6">
          <div className="border-b border-white/5 pb-4">
            <h2 className="text-lg font-bold text-white tracking-tight font-display flex items-center gap-2">
              <User size={18} className="text-amber-500" /> Default Shipping Profile
            </h2>
            <p className="text-[10px] text-gray-400 mt-1">
              Save your details here to auto-fill input coordinates during upcoming checkouts.
            </p>
          </div>

          <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4 text-xs font-semibold text-gray-300">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <User size={11} className="text-amber-400" /> Contact Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Receiver name"
                className="w-full px-4 py-2.5 rounded-xl glass-input focus:outline-none"
              />
              {formErrors.name && <p className="text-[10px] text-red-400 font-bold">{formErrors.name}</p>}
            </div>

            {/* Email (Readonly for reference) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-505 font-bold uppercase tracking-wider flex items-center gap-1">
                <Mail size={11} className="text-gray-500" /> Email Coordinate
              </label>
              <input
                type="email"
                value={currentUser.email}
                disabled
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/5 text-gray-500 font-semibold cursor-not-allowed opacity-80"
              />
              <span className="text-[9px] text-gray-600 font-medium italic">Account reference identifier cannot be changed.</span>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Phone size={11} className="text-amber-400" /> WhatsApp Mobile
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="10-digit mobile"
                className="w-full px-4 py-2.5 rounded-xl glass-input focus:outline-none"
              />
              {formErrors.phone && <p className="text-[10px] text-red-400 font-bold">{formErrors.phone}</p>}
            </div>

            {/* Street Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Home size={11} className="text-amber-400" /> Street Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows="2"
                placeholder="House No, Apartment/Street Name..."
                className="w-full px-4 py-2.5 rounded-xl glass-input focus:outline-none resize-none"
              ></textarea>
              {formErrors.address && <p className="text-[10px] text-red-400 font-bold">{formErrors.address}</p>}
            </div>

            {/* City & Pincode Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <MapPin size={11} className="text-amber-400" /> City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Visakhapatnam"
                  className="w-full px-4 py-2.5 rounded-xl glass-input focus:outline-none"
                />
                {formErrors.city && <p className="text-[10px] text-red-400 font-bold">{formErrors.city}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <MapPin size={11} className="text-amber-400" /> Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="530003"
                  className="w-full px-4 py-2.5 rounded-xl glass-input focus:outline-none"
                />
                {formErrors.pincode && <p className="text-[10px] text-red-400 font-bold">{formErrors.pincode}</p>}
              </div>
            </div>

            {/* Landmark */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Landmark size={11} className="text-amber-400" /> Landmark (Optional)
              </label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleInputChange}
                placeholder="Near Rama Temple"
                className="w-full px-4 py-2.5 rounded-xl glass-input focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-3 py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover-scale shadow-lg shadow-amber-500/10 cursor-pointer"
            >
              <Save size={14} />
              <span>Update Coordinates</span>
            </button>
          </form>
        </div>

        {/* Right 3 Cols: Order Ledger History */}
        <div className="lg:col-span-3 flex flex-col gap-6 w-full">
          <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-2xl flex flex-col gap-6">
            <div className="border-b border-white/5 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight font-display flex items-center gap-2">
                  <Package size={18} className="text-amber-500" /> My Order Ledger
                </h2>
                <p className="text-[10px] text-gray-400 mt-1">
                  Chronological history of frames compiled and placed via WhatsApp checkout.
                </p>
              </div>

              <span className="px-2.5 py-1 text-[10px] font-extrabold bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full">
                {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="py-12 px-4 text-center flex flex-col items-center gap-4">
                <div className="p-4 bg-white/5 text-gray-400 rounded-full border border-white/5">
                  <ShoppingBag size={32} className="stroke-[1.5]" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-extrabold text-white">No Placed Orders Found</h3>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                    You haven't completed any custom framing orders yet. Explore our designer templates!
                  </p>
                </div>
                <button
                  onClick={() => navigate('home')}
                  className="mt-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider rounded-xl hover-scale transition-all cursor-pointer"
                >
                  Start Customizing
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map((order) => {
                  const isExpanded = !!expandedOrders[order.id];
                  const StatusInfo = getStatusDetails(order.status);
                  const StatusIcon = StatusInfo.icon;
                  
                  return (
                    <div 
                      key={order.id} 
                      className={`glass-panel rounded-2xl border border-white/5 transition-all overflow-hidden ${
                        isExpanded ? 'ring-1 ring-amber-500/20 shadow-amber-500/5' : ''
                      }`}
                    >
                      {/* Order Summary Summary Bar */}
                      <div 
                        onClick={() => toggleOrder(order.id)}
                        className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors select-none"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] text-gray-505 font-bold uppercase tracking-wider">Order Ref</span>
                            <span className="text-sm font-extrabold text-amber-400 truncate">{order.id}</span>
                          </div>

                          <div className="flex flex-col hidden sm:flex">
                            <span className="text-[10px] text-gray-505 font-bold uppercase tracking-wider">Date</span>
                            <span className="text-xs text-gray-300 font-semibold">{new Date(order.date).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex flex-col text-right">
                            <span className="text-[10px] text-gray-505 font-bold uppercase tracking-wider">Total</span>
                            <span className="text-xs font-extrabold text-white">₹{order.total}</span>
                          </div>

                          {/* Status */}
                          <div className={`px-2.5 py-1 text-[10px] font-extrabold border rounded-full flex items-center gap-1.5 ${StatusInfo.bg}`}>
                            <StatusIcon size={10} className="stroke-[3]" />
                            <span>{StatusInfo.label}</span>
                          </div>

                          <div className="text-gray-500">
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                        </div>
                      </div>

                      {/* Expandable Order Breakdown */}
                      {isExpanded && (
                        <div className="border-t border-white/5 bg-slate-950/60 p-4 sm:p-5 flex flex-col gap-5 text-xs text-gray-300">
                          {/* Shipping coordinates overview */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-white/5 pb-4">
                            <div>
                              <h4 className="text-[10px] text-gray-550 font-extrabold uppercase tracking-wider flex items-center gap-1">
                                <Calendar size={11} /> Detailed Timestamp
                              </h4>
                              <p className="mt-1 text-gray-300 font-semibold">
                                {new Date(order.date).toLocaleString(undefined, { 
                                  dateStyle: 'medium', 
                                  timeStyle: 'short' 
                                })}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-[10px] text-gray-550 font-extrabold uppercase tracking-wider flex items-center gap-1">
                                <MapPin size={11} /> Shipment Destination
                              </h4>
                              <div className="mt-1 text-gray-300 font-semibold flex flex-col gap-0.5">
                                <p className="text-white font-extrabold">{order.customer.name} ({order.customer.phone})</p>
                                <p>{order.customer.address}</p>
                                <p>{order.customer.city} - {order.customer.pincode}</p>
                                {order.customer.landmark && <p className="italic text-gray-400 text-[11px]">Lndmrk: {order.customer.landmark}</p>}
                              </div>
                            </div>
                          </div>

                          {/* Items Breakdown list */}
                          <div className="flex flex-col gap-3">
                            <h4 className="text-[10px] text-gray-550 font-extrabold uppercase tracking-wider">Itemized Cart Specs ({order.items.length})</h4>
                            <div className="flex flex-col gap-3">
                              {order.items.map((item, index) => (
                                <div key={index} className="bg-slate-900/60 p-3 rounded-xl border border-white/5 flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="relative group flex-shrink-0">
                                      <img 
                                        src={item.customImage || item.image} 
                                        alt={item.name} 
                                        className="w-12 h-12 object-cover rounded border border-white/10"
                                      />
                                      {item.customImage && (
                                        <span className="absolute -top-1.5 -left-1.5 bg-amber-500 text-slate-950 text-[8px] font-black uppercase tracking-wider px-1 rounded border border-slate-950">
                                          Custom
                                        </span>
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <h5 className="font-extrabold text-white truncate">{item.name}</h5>
                                      <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
                                        <span>Size: <strong className="text-gray-300">{item.size}</strong></span>
                                        <span>•</span>
                                        <span>Qty: <strong className="text-gray-300">{item.quantity}</strong></span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="text-right flex flex-col items-end">
                                    <span className="font-extrabold text-white">₹{item.price * item.quantity}</span>
                                    <span className="text-[9px] text-gray-500 mt-0.5">₹{item.price} each</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Invoice Billing breakdown */}
                          <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5 flex flex-col gap-2 mt-1">
                            <div className="flex justify-between text-gray-400 font-semibold">
                              <span>Cart Subtotal</span>
                              <span>₹{order.subtotal}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 font-semibold">
                              <span>Shipping & Delivery Fee</span>
                              {order.delivery === 0 ? (
                                <span className="text-emerald-400 font-extrabold uppercase text-[10px]">Free Delivery</span>
                              ) : (
                                <span>₹{order.delivery}</span>
                              )}
                            </div>
                            <div className="border-t border-white/5 mt-1 pt-2 flex justify-between font-black uppercase text-white tracking-wider">
                              <span>Grand Total Amount</span>
                              <span className="text-amber-400 text-sm">₹{order.total}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
