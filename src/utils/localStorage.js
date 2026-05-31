// Local Storage keys
const PRODUCTS_KEY = 'ms_products';
const ORDERS_KEY = 'ms_orders';
const USERS_KEY = 'ms_users';
const PROMOS_KEY = 'ms_promo_codes';
const STAFF_KEY = 'ms_staff_members';

const DEFAULT_STAFF = [
  {
    id: 'st-1',
    name: 'Harshavardhan Reddy',
    employeeId: 'EMP-9901',
    role: 'Manager',
    phone: '7989856610',
    email: 'harsha@framecraft.com',
    username: 'staff1',
    password: 'MTIzNA==', // '1234' Base64 encoded
    branch: 'Visakhapatnam Main',
    status: 'Active',
    lastLogin: '2026-05-30T14:22:10.000Z'
  },
  {
    id: 'st-2',
    name: 'Vijay Kumar',
    employeeId: 'EMP-9902',
    role: 'Designer',
    phone: '9876543210',
    email: 'vijay@framecraft.com',
    username: 'designer1',
    password: 'MTIzNDU2', // '123456' Base64 encoded
    branch: 'Visakhapatnam Sub',
    status: 'Active',
    lastLogin: '2026-05-30T10:15:30.000Z'
  },
  {
    id: 'st-3',
    name: 'Rahul Sen',
    employeeId: 'EMP-9903',
    role: 'Printer',
    phone: '8765432109',
    email: 'rahul@framecraft.com',
    username: 'printer1',
    password: 'MTIzNDU2', // '123456' Base64 encoded
    branch: 'Visakhapatnam Main',
    status: 'Active',
    lastLogin: null
  },
  {
    id: 'st-4',
    name: 'Anjali Shah',
    employeeId: 'EMP-9904',
    role: 'Packager',
    phone: '7654321098',
    email: 'anjali@framecraft.com',
    username: 'packager1',
    password: 'MTIzNDU2', // '123456' Base64 encoded
    branch: 'Visakhapatnam Sub',
    status: 'Inactive',
    lastLogin: null
  }
];



// Seed default customer account for portals testing
const DEFAULT_USER = {
  id: 'USR-827491',
  name: 'Harsha Reddy',
  email: 'customer@gmail.com',
  password: 'password',
  phone: '917989856610',
  address: 'Flat 402, Aditya Heights',
  city: 'Visakhapatnam',
  pincode: '530003',
  landmark: 'Near Rama Temple'
};

const DEFAULT_PROMOS = [
  {
    id: 'pr-1',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    expiryDate: '2026-12-31',
    minOrderValue: 500,
    maxDiscountLimit: 200,
    usageLimit: 100,
    usageCount: 12,
    status: 'Active'
  },
  {
    id: 'pr-2',
    code: 'FESTIVE250',
    discountType: 'fixed',
    discountValue: 250,
    expiryDate: '2026-12-31',
    minOrderValue: 1200,
    maxDiscountLimit: 250,
    usageLimit: 50,
    usageCount: 4,
    status: 'Active'
  },
  {
    id: 'pr-3',
    code: 'EXPIRED50',
    discountType: 'percentage',
    discountValue: 50,
    expiryDate: '2025-01-01',
    minOrderValue: 0,
    maxDiscountLimit: 500,
    usageLimit: 10,
    usageCount: 10,
    status: 'Active'
  },
  {
    id: 'pr-4',
    code: 'INACTIVE100',
    discountType: 'fixed',
    discountValue: 100,
    expiryDate: '2026-12-31',
    minOrderValue: 500,
    maxDiscountLimit: 100,
    usageLimit: 20,
    usageCount: 0,
    status: 'Inactive'
  }
];


// Standard high-quality placeholder images from Unsplash (curated elegant designs)
const DEFAULT_PRODUCTS = [
  {
    id: 'p1',
    name: 'Elegant Walnut Frame',
    category: 'Photo Frames',
    price: 899,
    description: 'Premium solid walnut wood frame with a classic satin finish. Perfect for family portraits.',
    sizes: ['6x8', '8x10', '12x12'],
    sizePrices: { '6x8': 699, '8x10': 899, '12x12': 1199 },
    image: 'https://images.unsplash.com/photo-1544273677-c433136021d4?auto=format&fit=crop&w=600&q=80',
    featured: true
  },
  {
    id: 'p2',
    name: 'Minimalist Black Border',
    category: 'Photo Frames',
    price: 699,
    description: 'Modern slim black matte wood frame. Enhances contemporary artwork and black-and-white photos.',
    sizes: ['6x8', '8x10', '12x12'],
    sizePrices: { '6x8': 499, '8x10': 699, '12x12': 999 },
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80',
    featured: false
  },
  {
    id: 'p3',
    name: 'Heart Collage Custom Frame',
    category: 'Customized Frames',
    price: 1499,
    description: 'Beautiful heart-shaped mosaic collage. Personalize with your memorable photographs.',
    sizes: ['8x10', '12x12', '16x20'],
    sizePrices: { '8x10': 1199, '12x12': 1499, '16x20': 1999 },
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    featured: true
  },
  {
    id: 'p4',
    name: 'Name-Letter Shadowbox',
    category: 'Customized Frames',
    price: 1799,
    description: 'Stunning shadowbox spelling initials and adorned with your miniature pictures.',
    sizes: ['12x12', '16x20'],
    sizePrices: { '12x12': 1799, '16x20': 2399 },
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
    featured: true
  },
  {
    id: 'p5',
    name: 'Love Story Memory Box',
    category: 'Gifts',
    price: 1299,
    description: 'Handcrafted wooden memory shadow box with glowing LED fairy lights and custom photos.',
    sizes: ['8x10', '12x12'],
    sizePrices: { '8x10': 999, '12x12': 1299 },
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    featured: false
  },
  {
    id: 'p6',
    name: 'Eternal Rose Custom Frame',
    category: 'Gifts',
    price: 1999,
    description: 'A preserved gold foil rose enclosed in an elegant standing glass frame with customized engraving.',
    sizes: ['6x8', '8x10'],
    sizePrices: { '6x8': 1699, '8x10': 1999 },
    image: 'https://images.unsplash.com/photo-1494959764136-6be9eb3c261e?auto=format&fit=crop&w=600&q=80',
    featured: true
  },
  {
    id: 'p7',
    name: 'Photo Calendar Wood Block',
    category: 'Others',
    price: 999,
    description: 'Desktop wooden block calendar with interchangeable high-grade photo sheets for every month.',
    sizes: ['6x8'],
    sizePrices: { '6x8': 999 },
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80',
    featured: false
  },
  {
    id: 'p8',
    name: 'Acrylic Standee Block',
    category: 'Others',
    price: 1199,
    description: 'Double-sided crystal clear frameless acrylic standee block. Stands elegantly on any desk.',
    sizes: ['6x8', '8x10'],
    sizePrices: { '6x8': 899, '8x10': 1199 },
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    featured: false
  }
];

// Sample orders to populate portal dynamically if empty
const SAMPLE_ORDERS = [
  {
    id: 'ORD-827491',
    date: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    status: 'Pending',
    customer: {
      name: 'Harsha Reddy',
      phone: '917989856610',
      address: 'Flat 402, Aditya Heights',
      city: 'Visakhapatnam',
      pincode: '530003',
      landmark: 'Near Rama Temple'
    },
    items: [
      {
        id: 'p1',
        name: 'Elegant Walnut Frame',
        price: 899,
        size: '8x10',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1544273677-c433136021d4?auto=format&fit=crop&w=600&q=80',
        customImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNkOTc3MDYiLz48dGV4dCB4PSI1MCIgeT0iNTUiIGZvbnQtc2l6ZT0iMTAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzAyMDYxNyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q1VTVE9NIFBPUlRSQUlUPC90ZXh0Pjwvc3ZnPg=='
      }
    ],
    subtotal: 899,
    delivery: 99,
    total: 998
  },
  {
    id: 'ORD-582914',
    date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    status: 'Completed',
    customer: {
      name: 'Vijay Kumar',
      phone: '919876543210',
      address: 'Door No 12-4-5, MVP Colony',
      city: 'Visakhapatnam',
      pincode: '530017',
      landmark: 'Opposite Petrol Bunk'
    },
    items: [
      {
        id: 'p6',
        name: 'Eternal Rose Custom Frame',
        price: 1999,
        size: '6x8',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1494959764136-6be9eb3c261e?auto=format&fit=crop&w=600&q=80',
        customImage: null
      }
    ],
    subtotal: 1999,
    delivery: 0,
    total: 1999
  }
];

// Seed products and orders locally
export const initializeDataLocal = () => {
  if (!localStorage.getItem(PRODUCTS_KEY)) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(DEFAULT_PRODUCTS));
  }
  const storedOrders = localStorage.getItem(ORDERS_KEY);
  if (!storedOrders || JSON.parse(storedOrders).length === 0) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(SAMPLE_ORDERS));
  } else {
    // Proactive auto-repair: if existing local storage orders are missing product thumbnail images
    try {
      const parsedOrders = JSON.parse(storedOrders);
      let updated = false;
      const repairedOrders = parsedOrders.map(order => {
        const repairedItems = order.items.map(item => {
          if (!item.image) {
            const matchingProd = DEFAULT_PRODUCTS.find(p => p.id === item.id);
            if (matchingProd) {
              updated = true;
              return { ...item, image: matchingProd.image };
            }
          }
          return item;
        });
        return { ...order, items: repairedItems };
      });
      if (updated) {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(repairedOrders));
      }
    } catch (e) {
      console.error("Auto-repair of stored orders failed:", e);
    }
  }
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify([DEFAULT_USER]));
  }
  if (!localStorage.getItem(PROMOS_KEY)) {
    localStorage.setItem(PROMOS_KEY, JSON.stringify(DEFAULT_PROMOS));
  }
  if (!localStorage.getItem(STAFF_KEY)) {
    localStorage.setItem(STAFF_KEY, JSON.stringify(DEFAULT_STAFF));
  }
};

// Syncing seeder helper
export const initializeData = () => {
  initializeDataLocal();
};

// Products Operations (Synchronous)
export const getProducts = () => {
  initializeDataLocal();
  try {
    const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || DEFAULT_PRODUCTS;
    
    // Proactive auto-upgrade: Ensure all products have sizePrices populated
    let upgraded = false;
    const upgradedProducts = products.map(product => {
      if (!product.sizePrices || Object.keys(product.sizePrices).length === 0) {
        const sizes = product.sizes || ['8x10'];
        const basePrice = Number(product.price) || 899;
        const sizePrices = {};
        
        sizes.forEach((size, index) => {
          if (size.toLowerCase().includes('6x8')) {
            sizePrices[size] = Math.round(basePrice * 0.77);
          } else if (size.toLowerCase().includes('8x10')) {
            sizePrices[size] = basePrice;
          } else if (size.toLowerCase().includes('12x12')) {
            sizePrices[size] = Math.round(basePrice * 1.33);
          } else if (size.toLowerCase().includes('16x20')) {
            sizePrices[size] = Math.round(basePrice * 1.66);
          } else {
            if (index === 0 && sizes.length > 1) {
              sizePrices[size] = Math.round(basePrice * 0.77);
            } else if (index === sizes.length - 1 && sizes.length > 1) {
              sizePrices[size] = Math.round(basePrice * 1.33);
            } else {
              sizePrices[size] = basePrice;
            }
          }
        });
        
        upgraded = true;
        return { ...product, sizePrices };
      }
      return product;
    });
    
    if (upgraded) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(upgradedProducts));
      return upgradedProducts;
    }
    
    return products;
  } catch {
    return DEFAULT_PRODUCTS;
  }
};

export const saveProducts = (products) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

// Orders Operations (Synchronous)
export const getOrders = () => {
  initializeDataLocal();
  try {
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    // Ensure sorted latest to oldest
    return orders.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch {
    return [];
  }
};

export const saveOrders = (orders) => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

// Add single Order (Synchronous)
export const addOrder = (order) => {
  const newOrder = {
    ...order,
    id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
    date: new Date().toISOString(),
    status: 'Pending'
  };

  const localOrders = getOrders();
  localOrders.unshift(newOrder);
  saveOrders(localOrders);

  return newOrder;
};

// Compression Utility: Client-Side Image Resizer
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

        // Convert canvas image to Base64 (JPG format with 0.5 quality for micro size)
        const base64 = canvas.toDataURL('image/jpeg', 0.5);
        resolve(base64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

// Users Account Operations (Synchronous)
export const getUsers = () => {
  initializeDataLocal();
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [DEFAULT_USER];
  } catch {
    return [DEFAULT_USER];
  }
};

export const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const registerUser = (user) => {
  const users = getUsers();
  
  // Check duplicate email
  const emailExists = users.some(u => u.email.toLowerCase() === user.email.toLowerCase());
  if (emailExists) {
    throw new Error('Email is already registered. Please sign in!');
  }

  const newUser = {
    ...user,
    id: 'USR-' + Math.floor(100000 + Math.random() * 900000)
  };

  users.push(newUser);
  saveUsers(users);
  return newUser;
};

export const authenticateUser = (email, password) => {
  const users = getUsers();
  const user = users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    throw new Error('Invalid email or password. Please try again.');
  }

  return user;
};

export const updateUserProfile = (userId, updatedFields) => {
  const users = getUsers();
  const updatedUsers = users.map((u) => {
    if (u.id === userId) {
      return { ...u, ...updatedFields };
    }
    return u;
  });
  saveUsers(updatedUsers);
  
  // Return the newly updated specific user
  return updatedUsers.find(u => u.id === userId);
};

// Promo Codes Operations (Synchronous)
export const getPromos = () => {
  initializeDataLocal();
  try {
    return JSON.parse(localStorage.getItem(PROMOS_KEY)) || DEFAULT_PROMOS;
  } catch {
    return DEFAULT_PROMOS;
  }
};

export const savePromos = (promos) => {
  localStorage.setItem(PROMOS_KEY, JSON.stringify(promos));
};

export const addPromo = (promo) => {
  const promos = getPromos();
  const newPromo = {
    ...promo,
    id: 'pr-' + Math.floor(1000 + Math.random() * 9000),
    usageCount: 0
  };
  promos.push(newPromo);
  savePromos(promos);
  return newPromo;
};

export const updatePromo = (promoId, updatedFields) => {
  const promos = getPromos();
  const updatedPromos = promos.map((p) => {
    if (p.id === promoId) {
      return { ...p, ...updatedFields };
    }
    return p;
  });
  savePromos(updatedPromos);
  return updatedPromos.find(p => p.id === promoId);
};

export const deletePromo = (promoId) => {
  const promos = getPromos();
  const filtered = promos.filter(p => p.id !== promoId);
  savePromos(filtered);
};

export const incrementPromoUsage = (code) => {
  const promos = getPromos();
  const updated = promos.map((p) => {
    if (p.code.toUpperCase() === code.toUpperCase()) {
      return { ...p, usageCount: (p.usageCount || 0) + 1 };
    }
    return p;
  });
  savePromos(updated);
};

// Staff Accounts Operations (Synchronous with Base64 Obfuscation)
export const getStaff = () => {
  initializeDataLocal();
  try {
    return JSON.parse(localStorage.getItem(STAFF_KEY)) || DEFAULT_STAFF;
  } catch {
    return DEFAULT_STAFF;
  }
};

export const saveStaff = (staffList) => {
  localStorage.setItem(STAFF_KEY, JSON.stringify(staffList));
};

export const addStaff = (staffMember) => {
  const staffList = getStaff();
  const encryptedPassword = staffMember.password ? window.btoa(staffMember.password) : window.btoa('123456');
  
  const newStaff = {
    ...staffMember,
    id: 'st-' + Math.floor(1000 + Math.random() * 9000),
    password: encryptedPassword,
    lastLogin: null
  };
  staffList.push(newStaff);
  saveStaff(staffList);
  return newStaff;
};

export const updateStaff = (staffId, updatedFields) => {
  const staffList = getStaff();
  const updatedStaff = staffList.map((st) => {
    if (st.id === staffId) {
      let finalFields = { ...updatedFields };
      // Encrypt password if updated
      if (updatedFields.password && !updatedFields.password.endsWith('==')) {
        finalFields.password = window.btoa(updatedFields.password);
      }
      return { ...st, ...finalFields };
    }
    return st;
  });
  saveStaff(updatedStaff);
  return updatedStaff.find(st => st.id === staffId);
};

export const deleteStaff = (staffId) => {
  const staffList = getStaff();
  const filtered = staffList.filter(st => st.id !== staffId);
  saveStaff(filtered);
};

export const authenticateStaff = (username, password) => {
  const staffList = getStaff();
  const found = staffList.find(st => st.username.toLowerCase() === username.toLowerCase());
  
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
  
  // Update last login
  const updatedStaff = staffList.map(st => {
    if (st.id === found.id) {
      return { ...st, lastLogin: new Date().toISOString() };
    }
    return st;
  });
  saveStaff(updatedStaff);
  
  return found;
};


