import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Landmark, MapPin, Phone, User, Home, ArrowRight } from 'lucide-react';

export default function OrderForm({ onSubmit }) {
  const { currentUser } = useCart();
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    city: currentUser?.city || '',
    pincode: currentUser?.pincode || '',
    landmark: currentUser?.landmark || ''
  });

  // Watch for active customer updates or logins during session
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        city: currentUser.city || '',
        pincode: currentUser.pincode || '',
        landmark: currentUser.landmark || ''
      });
    }
  }, [currentUser]);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Full name is required';
    else if (formData.name.trim().length < 3) tempErrors.name = 'Name should be at least 3 characters';

    // Validate 10-digit Indian phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.phone.trim()) tempErrors.phone = 'Contact number is required';
    else if (!phoneRegex.test(formData.phone.trim())) tempErrors.phone = 'Enter a valid 10-digit mobile number';

    if (!formData.address.trim()) tempErrors.address = 'Full street address is required';
    if (!formData.city.trim()) tempErrors.city = 'City name is required';

    // Validate 6-digit Indian PIN Code
    const pincodeRegex = /^\d{6}$/;
    if (!formData.pincode.trim()) tempErrors.pincode = 'Pincode is required';
    else if (!pincodeRegex.test(formData.pincode.trim())) tempErrors.pincode = 'Enter a valid 6-digit PIN code';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when editing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Customer Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <User size={12} className="text-amber-400" /> Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-semibold focus:outline-none"
          />
          {errors.name && <p className="text-[10px] text-red-400 font-bold">{errors.name}</p>}
        </div>

        {/* Contact Phone */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <Phone size={12} className="text-amber-400" /> Contact Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="9876543210"
            className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-semibold focus:outline-none"
          />
          {errors.phone && <p className="text-[10px] text-red-400 font-bold">{errors.phone}</p>}
        </div>
      </div>

      {/* Address */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
          <Home size={12} className="text-amber-400" /> Street Address
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows="3"
          placeholder="House No, Apartment/Street Name, Locality..."
          className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-semibold focus:outline-none resize-none"
        ></textarea>
        {errors.address && <p className="text-[10px] text-red-400 font-bold">{errors.address}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* City */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <MapPin size={12} className="text-amber-400" /> City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Visakhapatnam"
            className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-semibold focus:outline-none"
          />
          {errors.city && <p className="text-[10px] text-red-400 font-bold">{errors.city}</p>}
        </div>

        {/* Pincode */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <MapPin size={12} className="text-amber-400" /> Pincode
          </label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="530001"
            className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-semibold focus:outline-none"
          />
          {errors.pincode && <p className="text-[10px] text-red-400 font-bold">{errors.pincode}</p>}
        </div>
      </div>

      {/* Landmark */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
          <Landmark size={12} className="text-amber-400" /> Landmark (Optional)
        </label>
        <input
          type="text"
          name="landmark"
          value={formData.landmark}
          onChange={handleChange}
          placeholder="Near Ganesh Temple"
          className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-semibold focus:outline-none"
        />
      </div>

      {/* Place Order Submit */}
      <button
        type="submit"
        className="w-full mt-2 py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover-scale shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
      >
        <span>Place Order via WhatsApp</span>
        <ArrowRight size={16} />
      </button>
    </form>
  );
}
