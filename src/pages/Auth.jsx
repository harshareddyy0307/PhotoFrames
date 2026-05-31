import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Lock, Mail, User, Phone, MapPin, Landmark, Home, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Auth() {
  const { loginCustomer, signupCustomer, navigate } = useCart();
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup fields
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    city: '',
    pincode: '',
    landmark: ''
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateLogin = () => {
    const tempErrors = {};
    if (!loginEmail.trim()) tempErrors.loginEmail = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(loginEmail)) tempErrors.loginEmail = 'Enter a valid email address';

    if (!loginPassword) tempErrors.loginPassword = 'Password is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const validateSignup = () => {
    const tempErrors = {};
    if (!signupData.name.trim()) tempErrors.name = 'Full name is required';

    if (!signupData.email.trim()) tempErrors.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(signupData.email)) tempErrors.email = 'Enter a valid email address';

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!signupData.phone.trim()) tempErrors.phone = 'Phone number is required';
    else if (!phoneRegex.test(signupData.phone.trim())) tempErrors.phone = 'Enter a valid 10-digit mobile number';

    if (!signupData.password) tempErrors.password = 'Password is required';
    else if (signupData.password.length < 6) tempErrors.password = 'Password should be at least 6 characters';

    if (!signupData.address.trim()) tempErrors.address = 'Street address is required';
    if (!signupData.city.trim()) tempErrors.city = 'City name is required';

    const pincodeRegex = /^\d{6}$/;
    if (!signupData.pincode.trim()) tempErrors.pincode = 'Pincode is required';
    else if (!pincodeRegex.test(signupData.pincode.trim())) tempErrors.pincode = 'Enter a valid 6-digit postal pincode';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setSubmitError('');

    if (validateLogin()) {
      try {
        loginCustomer(loginEmail, loginPassword);
        navigate('home');
      } catch (err) {
        setSubmitError(err.message);
      }
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setSubmitError('');

    if (validateSignup()) {
      try {
        signupCustomer(signupData);
        navigate('home');
      } catch (err) {
        setSubmitError(err.message);
      }
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 flex flex-col justify-center min-h-[550px]">
      <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl flex flex-col gap-6">

        {/* Toggle Switch */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-white/5 self-center">
          <button
            onClick={() => {
              setActiveTab('login');
              setErrors({});
              setSubmitError('');
            }}
            className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeTab === 'login'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setActiveTab('signup');
              setErrors({});
              setSubmitError('');
            }}
            className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeTab === 'signup'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            Register
          </button>
        </div>

        {/* Branding header */}
        <div className="text-center flex flex-col items-center gap-1.5">
          <h2 className="text-2xl font-black text-white font-display tracking-tight">
            {activeTab === 'login' ? 'Welcome Back!' : 'Create Customer Account'}
          </h2>
          <p className="text-xs text-gray-400">
            {activeTab === 'login'
              ? 'Log in to access your pre-filled shipping data and track past orders.'
              : 'Sign up to register your shipping address for seamless WhatsApp ordering.'}
          </p>
        </div>

        {submitError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-center text-xs font-bold leading-normal">
            {submitError}
          </div>
        )}

        {/* LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 text-xs font-semibold text-gray-300">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Mail size={12} className="text-amber-400" /> Email Address
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="customer@gmail.com"
                className="w-full px-4 py-2.5 rounded-xl glass-input focus:outline-none"
              />
              {errors.loginEmail && <p className="text-[10px] text-red-400 font-bold">{errors.loginEmail}</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Lock size={12} className="text-amber-400" /> Password Code
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl glass-input focus:outline-none"
              />
              {errors.loginPassword && <p className="text-[10px] text-red-400 font-bold">{errors.loginPassword}</p>}
            </div>

            <button
              type="submit"
              className="w-full mt-3 py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all hover-scale cursor-pointer"
            >
              <span>Sign In</span>
              <ArrowRight size={14} />
            </button>
          </form>
        )}

        {/* SIGNUP FORM */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="flex flex-col gap-4 text-xs font-semibold text-gray-300">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <User size={12} className="text-amber-400" /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={signupData.name}
                  onChange={handleSignupChange}
                  placeholder="Your Name"
                  className="w-full px-4 py-2.5 rounded-xl glass-input focus:outline-none"
                />
                {errors.name && <p className="text-[10px] text-red-400 font-bold">{errors.name}</p>}
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Mail size={12} className="text-amber-400" /> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  placeholder="Enter Your Email Address"
                  className="w-full px-4 py-2.5 rounded-xl glass-input focus:outline-none"
                />
                {errors.email && <p className="text-[10px] text-red-400 font-bold">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Phone size={12} className="text-amber-400" /> Contact Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={signupData.phone}
                  onChange={handleSignupChange}
                  placeholder="Enter Your Phone Number"
                  className="w-full px-4 py-2.5 rounded-xl glass-input focus:outline-none"
                />
                {errors.phone && <p className="text-[10px] text-red-400 font-bold">{errors.phone}</p>}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Lock size={12} className="text-amber-400" /> Password Code
                </label>
                <input
                  type="password"
                  name="password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  placeholder="Min 6 characters"
                  className="w-full px-4 py-2.5 rounded-xl glass-input focus:outline-none"
                />
                {errors.password && <p className="text-[10px] text-red-400 font-bold">{errors.password}</p>}
              </div>
            </div>

            {/* Street Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Home size={12} className="text-amber-400" /> Shipping Street Address
              </label>
              <textarea
                name="address"
                value={signupData.address}
                onChange={handleSignupChange}
                rows="2"
                placeholder="House No, Apartment/Street Name..."
                className="w-full px-4 py-2.5 rounded-xl glass-input focus:outline-none resize-none"
              ></textarea>
              {errors.address && <p className="text-[10px] text-red-400 font-bold">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* City */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <MapPin size={12} className="text-amber-400" /> City
                </label>
                <input
                  type="text"
                  name="city"
                  value={signupData.city}
                  onChange={handleSignupChange}
                  placeholder="Enter Your City Name"
                  className="w-full px-4 py-2.5 rounded-xl glass-input focus:outline-none"
                />
                {errors.city && <p className="text-[10px] text-red-400 font-bold">{errors.city}</p>}
              </div>

              {/* Pincode */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <MapPin size={12} className="text-amber-400" /> Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={signupData.pincode}
                  onChange={handleSignupChange}
                  placeholder="530003"
                  className="w-full px-4 py-2.5 rounded-xl glass-input focus:outline-none"
                />
                {errors.pincode && <p className="text-[10px] text-red-400 font-bold">{errors.pincode}</p>}
              </div>
            </div>

            {/* Landmark */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Landmark size={12} className="text-amber-400" /> Landmark (Optional)
              </label>
              <input
                type="text"
                name="landmark"
                value={signupData.landmark}
                onChange={handleSignupChange}
                placeholder="Near Rama Temple"
                className="w-full px-4 py-2.5 rounded-xl glass-input focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-3 py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all hover-scale cursor-pointer"
            >
              <span>Create Account & Log In</span>
              <ArrowRight size={14} />
            </button>
          </form>
        )}

        <div className="border-t border-white/5 pt-4 text-center">
        </div>

      </div>
    </div>
  );
}
