// Local Storage keys
const PRODUCTS_KEY = 'ms_products';
const ORDERS_KEY = 'ms_orders';
const USERS_KEY = 'ms_users';

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

// Standard high-quality placeholder images from Unsplash (curated elegant designs)
const DEFAULT_PRODUCTS = [
  {
    id: 'p1',
    name: 'Elegant Walnut Frame',
    category: 'Photo Frames',
    price: 899,
    description: 'Premium solid walnut wood frame with a classic satin finish. Perfect for family portraits.',
    sizes: ['6x8', '8x10', '12x12'],
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
};

// Syncing seeder helper
export const initializeData = () => {
  initializeDataLocal();
};

// Products Operations (Synchronous)
export const getProducts = () => {
  initializeDataLocal();
  try {
    return JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || DEFAULT_PRODUCTS;
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
