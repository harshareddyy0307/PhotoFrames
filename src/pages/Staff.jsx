import React, { useState, useEffect } from 'react';
import { getOrders, saveOrders } from '../utils/localStorage';
import { Lock, Eye, Download, LogOut, CheckCircle, MessageSquare, Calendar, ChevronRight, User } from 'lucide-react';

export default function Staff() {
  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('ms_staff_auth') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Orders State
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'completed'
  const [selectedPhoto, setSelectedPhoto] = useState(null); // base64 string for Modal
  const [selectedPhotoName, setSelectedPhotoName] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      setOrders(getOrders());
    }
  }, [isLoggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'staff1' && password === '1234') {
      setIsLoggedIn(true);
      setLoginError('');
      sessionStorage.setItem('ms_staff_auth', 'true');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('ms_staff_auth');
  };

  const handleStatusChange = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    });
    setOrders(updatedOrders);
    saveOrders(updatedOrders);
  };

  const handleContactCustomer = (customerName, customerPhone, orderId) => {
    // Format customer phone (strip space and add country code if needed)
    const formattedPhone = customerPhone.startsWith('91') ? customerPhone : `91${customerPhone}`;
    const text = `Hi ${customerName}, this is the team at FrameCraft. We are reaching out regarding your Photo Frame Order *${orderId}*. We have received your custom references!`;
    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Login Screen Render
  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 flex flex-col justify-center min-h-[500px]">
        <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="p-4 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
              <Lock size={32} />
            </div>
            <h2 className="text-2xl font-black text-white font-display mt-2">Staff Login</h2>
            <p className="text-xs text-gray-400">Log in to process custom printing files and update orders.</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="staff1"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-semibold focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-semibold focus:outline-none"
              />
            </div>

            {loginError && <p className="text-[10px] text-red-400 font-extrabold">{loginError}</p>}

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover-scale cursor-pointer"
            >
              <span>Unlock Dashboard</span>
              <ChevronRight size={14} />
            </button>
          </form>

          <p className="text-[10px] text-center text-gray-500">
            Use demo login credentials: <span className="font-bold text-gray-400">staff1 / 1234</span>
          </p>
        </div>
      </div>
    );
  }

  // Filter orders by active / completed tabs
  const activeOrders = orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled');
  const completedOrders = orders.filter(o => o.status === 'Completed' || o.status === 'Cancelled');
  const displayedOrders = activeTab === 'active' ? activeOrders : completedOrders;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Portal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
            Staff Portal
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Review orders, update production states, and extract customer-uploaded Base64 photos.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-extrabold uppercase tracking-wider border border-red-500/20 flex items-center gap-1.5 transition-all hover-scale cursor-pointer"
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>

      {/* Orders List / Workspace */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <h2 className="text-lg font-bold text-white tracking-tight font-display uppercase tracking-wider text-amber-500">
            Orders Supervisor Ledger
          </h2>

          {/* Elegant Tab Switchers */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-white/5 self-start">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-5 py-2.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'active'
                  ? 'bg-amber-500 text-slate-950 shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>Active Orders</span>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                activeTab === 'active' ? 'bg-slate-950 text-amber-400' : 'bg-white/5 text-gray-400'
              }`}>
                {activeOrders.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-5 py-2.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'completed'
                  ? 'bg-amber-500 text-slate-950 shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>Completed / Closed</span>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                activeTab === 'completed' ? 'bg-slate-950 text-amber-400' : 'bg-white/5 text-gray-400'
              }`}>
                {completedOrders.length}
              </span>
            </button>
          </div>
        </div>

        {displayedOrders.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center border border-white/5 flex flex-col items-center justify-center gap-4">
            <span className="text-4xl">📭</span>
            <p className="text-sm font-semibold text-gray-300">
              No {activeTab === 'active' ? 'active' : 'completed'} orders registered inside Local Storage.
            </p>
            <p className="text-xs text-gray-500">Once custom checkouts are completed via WhatsApp, they will sync here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {displayedOrders.map((order) => (
              <div 
                key={order.id}
                className="glass-panel p-5 rounded-2xl border border-white/5 shadow-xl flex flex-col gap-5 transition-all hover:border-white/10"
              >
                {/* 1. Header Information Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full uppercase">
                      {order.id}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(order.date).toLocaleString()}
                    </span>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">Status:</span>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-extrabold focus:outline-none cursor-pointer border ${
                        order.status === 'Completed'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : order.status === 'Processing'
                            ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                            : order.status === 'Cancelled'
                              ? 'bg-red-500/10 border-red-500/30 text-red-400'
                              : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      }`}
                    >
                      <option value="Pending" className="bg-slate-900 text-white">Pending</option>
                      <option value="Processing" className="bg-slate-900 text-white">Processing</option>
                      <option value="Completed" className="bg-slate-900 text-white">Completed</option>
                      <option value="Cancelled" className="bg-slate-900 text-white">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* 2. Customer Delivery / Address Block */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1 flex flex-col gap-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                      <User size={12} className="text-amber-400" /> Customer Info
                    </h4>
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 flex flex-col gap-1 text-xs">
                      <p className="font-extrabold text-white">{order.customer.name}</p>
                      <p className="font-medium text-gray-300">{order.customer.phone}</p>
                      <p className="text-gray-400 mt-1 leading-relaxed">
                        {order.customer.address}, {order.customer.city} - {order.customer.pincode}
                        {order.customer.landmark && <span className="block mt-1 font-bold text-amber-500/80">Landmark: {order.customer.landmark}</span>}
                      </p>

                      <button
                        onClick={() => handleContactCustomer(order.customer.name, order.customer.phone, order.id)}
                        className="mt-3 py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all hover-scale"
                      >
                        <MessageSquare size={12} />
                        <span>Contact Customer</span>
                      </button>
                    </div>
                  </div>

                  {/* 3. Items list with Photo Extractor */}
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Ordered Products Summary
                    </h4>
                    <div className="flex flex-col gap-2 bg-slate-950/40 p-4 rounded-xl border border-white/5">
                      {order.items.map((item, idx) => (
                        <div 
                          key={idx}
                          className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 last:border-none pb-2 last:pb-0"
                        >
                          <div className="flex items-center gap-3">
                            {/* Thumb View */}
                            <div className="w-10 h-10 rounded-md overflow-hidden bg-slate-900 border border-white/10 flex-shrink-0">
                              <img src={item.customImage || item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-white">{item.name}</h5>
                              <p className="text-[10px] text-gray-400 mt-0.5">Size: {item.size} × {item.quantity}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Photo Action Extractor */}
                            {item.customImage ? (
                              <button
                                onClick={() => {
                                  setSelectedPhoto(item.customImage);
                                  setSelectedPhotoName(`${order.customer.name}-${order.id}-${item.size}`);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase flex items-center gap-1 transition-all"
                              >
                                <Eye size={12} />
                                <span>Get Photo</span>
                              </button>
                            ) : (
                              <span className="text-[10px] font-medium text-gray-500 italic bg-white/5 px-2 py-1 rounded">
                                Default Art
                              </span>
                            )}
                            <span className="text-xs font-extrabold text-white w-16 text-right">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        </div>
                      ))}

                      {/* Billing invoice lines */}
                      <div className="border-t border-white/5 mt-3 pt-3 flex items-center justify-between text-xs text-gray-400">
                        <span>Items Subtotal: ₹{order.subtotal} | Delivery: ₹{order.delivery}</span>
                        <span className="text-amber-400 font-extrabold text-sm">Grand Total: ₹{order.total}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Full resolution Photo viewer Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl max-w-xl w-full flex flex-col gap-4 relative animate-scale-up">
            <h3 className="text-lg font-bold text-white font-display pr-12">
              Customer Reference Photo
            </h3>
            
            {/* Direct Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
            >
              ✕
            </button>

            <div className="aspect-square bg-slate-950 rounded-2xl overflow-hidden border border-white/5 relative flex items-center justify-center">
              <img 
                src={selectedPhoto} 
                alt="Full custom spec" 
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Download CTA */}
              <a
                href={selectedPhoto}
                download={`framecraft-${selectedPhotoName}.jpg`}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover-scale"
              >
                <Download size={14} />
                <span>Download Print File</span>
              </a>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-extrabold uppercase tracking-widest"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
