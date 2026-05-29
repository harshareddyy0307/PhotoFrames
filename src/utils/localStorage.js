// Local Storage keys
const PRODUCTS_KEY = 'ms_products';
const ORDERS_KEY = 'ms_orders';

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

// Seed products if not already initialized
export const initializeData = () => {
  if (!localStorage.getItem(PRODUCTS_KEY)) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(DEFAULT_PRODUCTS));
  }
  if (!localStorage.getItem(ORDERS_KEY)) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify([]));
  }
};

// Products Operations
export const getProducts = () => {
  initializeData();
  try {
    return JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || DEFAULT_PRODUCTS;
  } catch (error) {
    console.error('Error reading products', error);
    return DEFAULT_PRODUCTS;
  }
};

export const saveProducts = (products) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

// Orders Operations
export const getOrders = () => {
  initializeData();
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
  } catch (error) {
    console.error('Error reading orders', error);
    return [];
  }
};

export const saveOrders = (orders) => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

export const addOrder = (order) => {
  const orders = getOrders();
  const newOrder = {
    ...order,
    id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
    date: new Date().toISOString(),
    status: 'Pending'
  };
  orders.unshift(newOrder); // Add to beginning of list
  saveOrders(orders);
  return newOrder;
};

// Compression Utility: Client-Side Image Resizer
// Resizes files to maximum 800px on either dimension and compresses to 0.7 JPEG quality
// Renders the file as a lightweight base64 string fit for localStorage
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

        // Convert canvas image to Base64 (JPG format with 0.6 quality for micro size)
        const base64 = canvas.toDataURL('image/jpeg', 0.6);
        resolve(base64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};
