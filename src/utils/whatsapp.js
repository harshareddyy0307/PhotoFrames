/**
 * Formats order information and returns the target URL to send details via WhatsApp
 * @param {Object} order - The completed order details
 * @param {Array} items - The list of cart items
 */
export const openWhatsAppOrder = (order) => {
  const phone = '917989856610';
  
  // Format items text
  const itemsText = order.items.map((item, index) => {
    const photoIndicator = item.customImage ? '📸 [Custom Photo Uploaded]' : '🖼️ [Default Image]';
    return `${index + 1}. *${item.name}*\n` +
           `   - Size: ${item.size}\n` +
           `   - Qty: ${item.quantity}\n` +
           `   - Price: ₹${item.price} each\n` +
           `   - Photo: ${photoIndicator}\n`;
  }).join('\n');

  // Format delivery address text
  const addressText = 
    `*Address:* ${order.customer.address}\n` +
    `*City:* ${order.customer.city} - ${order.customer.pincode}\n` +
    `*Landmark:* ${order.customer.landmark || 'None'}`;

  // Full formatted text template with premium structure and emojis
  const message = 
`✨ *NEW PHOTO FRAME ORDER* ✨
----------------------------------
🆔 *Order ID:* ${order.id}
📅 *Date:* ${new Date(order.date).toLocaleDateString()}

👤 *CUSTOMER DETAILS*
*Name:* ${order.customer.name}
*Phone:* ${order.customer.phone}

📍 *DELIVERY DETAILS*
${addressText}

📦 *ITEMS ORDERED*
${itemsText}

----------------------------------
💰 *BILLING SUMMARY*
*Subtotal:* ₹${order.subtotal}
*Delivery Charges:* ₹${order.delivery}
*GRAND TOTAL:* ₹${order.total}

🚀 Please confirm this order! Thank you for shopping with us!`;

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};
