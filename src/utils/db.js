import { supabase } from './supabase';

// --------------------------------------------------
// MAPPING HELPERS
// --------------------------------------------------

const mapProductToCamel = (p) => {
  if (!p) return null;
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: Number(p.price),
    description: p.description,
    sizes: p.sizes,
    sizePrices: p.size_prices,
    image: p.image,
    featured: p.featured,
    stock: p.stock
  };
};

const mapProductToDb = (p) => {
  if (!p) return null;
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    description: p.description,
    sizes: p.sizes,
    size_prices: p.sizePrices,
    image: p.image,
    featured: p.featured,
    stock: p.stock
  };
};

const mapPromoToCamel = (p) => {
  if (!p) return null;
  return {
    id: p.id,
    code: p.code,
    discountType: p.discount_type,
    discountValue: Number(p.discount_value),
    expiryDate: p.expiry_date,
    minOrderValue: Number(p.min_order_value),
    maxDiscountLimit: p.max_discount_limit ? Number(p.max_discount_limit) : null,
    usageLimit: p.usage_limit,
    usageCount: p.usage_count,
    status: p.status
  };
};

const mapPromoToDb = (p) => {
  if (!p) return null;
  const dbObj = {};
  if (p.id !== undefined) dbObj.id = p.id;
  if (p.code !== undefined) dbObj.code = p.code;
  if (p.discountType !== undefined) dbObj.discount_type = p.discountType;
  if (p.discountValue !== undefined) dbObj.discount_value = p.discountValue;
  if (p.expiryDate !== undefined) dbObj.expiry_date = p.expiryDate;
  if (p.minOrderValue !== undefined) dbObj.min_order_value = p.minOrderValue;
  if (p.maxDiscountLimit !== undefined) dbObj.max_discount_limit = p.maxDiscountLimit;
  if (p.usageLimit !== undefined) dbObj.usage_limit = p.usageLimit;
  if (p.usageCount !== undefined) dbObj.usage_count = p.usageCount;
  if (p.status !== undefined) dbObj.status = p.status;
  return dbObj;
};

const mapStaffToCamel = (s) => {
  if (!s) return null;
  return {
    id: s.id,
    name: s.name,
    employeeId: s.employee_id,
    role: s.role,
    phone: s.phone,
    email: s.email,
    username: s.username,
    password: s.password,
    branch: s.branch,
    status: s.status,
    lastLogin: s.last_login
  };
};

// --------------------------------------------------
// PRODUCTS OPERATIONS
// --------------------------------------------------

export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return (data || []).map(mapProductToCamel);
};

export const saveProducts = async (products) => {
  // Sync arrays to DB
  const { data: existing, error: fetchErr } = await supabase.from('products').select('id');
  if (fetchErr) throw fetchErr;
  
  const existingIds = existing ? existing.map(p => p.id) : [];
  const currentIds = products.map(p => p.id);
  const toDelete = existingIds.filter(id => !currentIds.includes(id));
  
  if (toDelete.length > 0) {
    const { error: delErr } = await supabase.from('products').delete().in('id', toDelete);
    if (delErr) throw delErr;
  }
  
  if (products.length > 0) {
    const dbProducts = products.map(mapProductToDb);
    const { error: upsertErr } = await supabase.from('products').upsert(dbProducts);
    if (upsertErr) throw upsertErr;
  }
};

// --------------------------------------------------
// ORDERS OPERATIONS
// --------------------------------------------------

export const getOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('date', { ascending: false });
    
  if (error) throw error;
  return data || [];
};

export const addOrder = async (order) => {
  const newOrder = {
    ...order,
    id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
    date: new Date().toISOString(),
    status: 'Pending'
  };
  
  const { data, error } = await supabase
    .from('orders')
    .insert([newOrder])
    .select();
    
  if (error) throw error;
  return data[0];
};

export const deleteOrder = async (orderId) => {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', orderId);
  if (error) throw error;
};

export const updateOrderStatus = async (orderId, status) => {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);
  if (error) throw error;
};

// For backward compatibility but safe
export const saveOrders = async (orders) => {
  const { data: existing, error: fetchErr } = await supabase.from('orders').select('id');
  if (fetchErr) throw fetchErr;
  
  const existingIds = existing ? existing.map(o => o.id) : [];
  const currentIds = orders.map(o => o.id);
  const toDelete = existingIds.filter(id => !currentIds.includes(id));
  
  if (toDelete.length > 0) {
    const { error: delErr } = await supabase.from('orders').delete().in('id', toDelete);
    if (delErr) throw delErr;
  }
  
  if (orders.length > 0) {
    const { error: upsertErr } = await supabase.from('orders').upsert(orders);
    if (upsertErr) throw upsertErr;
  }
};

// --------------------------------------------------
// PROMO CODES OPERATIONS
// --------------------------------------------------

export const getPromos = async () => {
  const { data, error } = await supabase
    .from('promo_codes')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return (data || []).map(mapPromoToCamel);
};

export const addPromo = async (promo) => {
  const newPromo = {
    id: 'pr-' + Math.floor(1000 + Math.random() * 9000),
    code: promo.code.toUpperCase(),
    discount_type: promo.discountType,
    discount_value: promo.discountValue,
    expiry_date: promo.expiryDate,
    min_order_value: promo.minOrderValue || 0,
    max_discount_limit: promo.maxDiscountLimit || null,
    usage_limit: promo.usageLimit || null,
    usage_count: 0,
    status: promo.status || 'Active'
  };
  
  const { data, error } = await supabase
    .from('promo_codes')
    .insert([newPromo])
    .select();
    
  if (error) throw error;
  return mapPromoToCamel(data[0]);
};

export const updatePromo = async (promoId, updatedFields) => {
  const dbFields = mapPromoToDb(updatedFields);
  delete dbFields.id; // ensure ID is not in update
  
  const { data, error } = await supabase
    .from('promo_codes')
    .update(dbFields)
    .eq('id', promoId)
    .select();
    
  if (error) throw error;
  return mapPromoToCamel(data[0]);
};

export const deletePromo = async (promoId) => {
  const { error } = await supabase
    .from('promo_codes')
    .delete()
    .eq('id', promoId);
  if (error) throw error;
};

export const incrementPromoUsage = async (code) => {
  const { data: promo, error: fetchErr } = await supabase
    .from('promo_codes')
    .select('id, usage_count')
    .eq('code', code.toUpperCase())
    .maybeSingle();
    
  if (fetchErr || !promo) return;
  
  await supabase
    .from('promo_codes')
    .update({ usage_count: (promo.usage_count || 0) + 1 })
    .eq('id', promo.id);
};

// --------------------------------------------------
// STAFF OPERATIONS
// --------------------------------------------------

export const getStaff = async () => {
  const { data, error } = await supabase
    .from('staff_members')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return (data || []).map(mapStaffToCamel);
};

export const addStaff = async (staffMember) => {
  const encryptedPassword = staffMember.password ? window.btoa(staffMember.password) : window.btoa('123456');
  
  const newStaff = {
    id: 'st-' + Math.floor(1000 + Math.random() * 9000),
    name: staffMember.name,
    employee_id: staffMember.employeeId,
    role: staffMember.role,
    phone: staffMember.phone,
    email: staffMember.email,
    username: staffMember.username,
    password: encryptedPassword,
    branch: staffMember.branch,
    status: staffMember.status || 'Active',
    last_login: null
  };
  
  const { data, error } = await supabase
    .from('staff_members')
    .insert([newStaff])
    .select();
    
  if (error) throw error;
  return mapStaffToCamel(data[0]);
};

export const updateStaff = async (staffId, updatedFields) => {
  const dbFields = {};
  if (updatedFields.name !== undefined) dbFields.name = updatedFields.name;
  if (updatedFields.employeeId !== undefined) dbFields.employee_id = updatedFields.employeeId;
  if (updatedFields.role !== undefined) dbFields.role = updatedFields.role;
  if (updatedFields.phone !== undefined) dbFields.phone = updatedFields.phone;
  if (updatedFields.email !== undefined) dbFields.email = updatedFields.email;
  if (updatedFields.username !== undefined) dbFields.username = updatedFields.username;
  if (updatedFields.branch !== undefined) dbFields.branch = updatedFields.branch;
  if (updatedFields.status !== undefined) dbFields.status = updatedFields.status;
  if (updatedFields.lastLogin !== undefined) dbFields.last_login = updatedFields.lastLogin;
  
  if (updatedFields.password !== undefined) {
    if (!updatedFields.password.endsWith('==')) {
      dbFields.password = window.btoa(updatedFields.password);
    } else {
      dbFields.password = updatedFields.password;
    }
  }
  
  const { data, error } = await supabase
    .from('staff_members')
    .update(dbFields)
    .eq('id', staffId)
    .select();
    
  if (error) throw error;
  return mapStaffToCamel(data[0]);
};

export const deleteStaff = async (staffId) => {
  const { error } = await supabase
    .from('staff_members')
    .delete()
    .eq('id', staffId);
  if (error) throw error;
};

export const authenticateStaff = async (username, password) => {
  const { data: found, error } = await supabase
    .from('staff_members')
    .select('*')
    .eq('username', username)
    .maybeSingle();

  if (error) throw error;
  if (!found) {
    throw new Error('Staff username not registered.');
  }
  
  if (found.status !== 'Active') {
    throw new Error('This staff account is currently inactive.');
  }
  
  let decryptedPass = '';
  try {
    decryptedPass = window.atob(found.password);
  } catch {
    decryptedPass = found.password;
  }
  
  if (decryptedPass !== password) {
    throw new Error('Incorrect password. Please try again.');
  }
  
  const lastLogin = new Date().toISOString();
  await supabase
    .from('staff_members')
    .update({ last_login: lastLogin })
    .eq('id', found.id);
    
  return mapStaffToCamel({ ...found, last_login: lastLogin });
};

// --------------------------------------------------
// IMAGE COMPRESSION UTILITY
// --------------------------------------------------

export const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const base64 = canvas.toDataURL('image/jpeg', 0.5);
        resolve(base64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};
