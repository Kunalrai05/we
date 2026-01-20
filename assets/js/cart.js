/* =========================
CART SYSTEM + ENQUIRY ENGINE
(NO ALERTS / PREMIUM UX)
========================= */

const CART_KEY = "ressiniq-cart";

/* =========================
BASIC CART
========================= */
function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartCount();
}

/* =========================
ADD / UPDATE CART
========================= */
function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(p => p.id === product.id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price || null,
      type: product.type || "physical",
      images: product.images || [],
      qty: 1
    });
  }

  saveCart(cart);
  updateCartCount();
  showToast("Added to cart");
}

function updateQty(id, delta) {
  const cart = getCart();
  const item = cart.find(p => p.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
    return;
  }

  saveCart(cart);
  updateCartCount();
}

function removeFromCart(id) {
  const cart = getCart().filter(p => p.id !== id);
  saveCart(cart);
  updateCartCount();
  showToast("Item removed");
}

/* =========================
ENQUIRY MESSAGE BUILDER
========================= */
function buildQueryMessage() {
  const cart = getCart();
  if (!cart.length) return "";

  let msg = "Hi RESSINIQ 👋\n\n";
  msg += "I’m interested in the following products:\n\n";

  cart.forEach(p => {
    msg += `• ${p.name}`;
    msg += p.price ? ` — ₹${p.price}` : " — Price on enquiry";
    msg += ` × ${p.qty}\n`;
  });

  msg += "\nPlease let me know availability and next steps.\n\nThanks!";
  return msg;
}

/* =========================
SEND TO INSTAGRAM
========================= */
function sendInstagramQuery() {
  const message = buildQueryMessage();
  if (!message) {
    showToast("Cart is empty");
    return;
  }

  navigator.clipboard.writeText(message).then(() => {
    showToast("Message copied. Opening Instagram…");
    window.open("https://www.instagram.com/ressiniq/", "_blank");
  });
}

/* =========================
SEND EMAIL
========================= */
function sendEmailQuery() {
  const message = buildQueryMessage();
  if (!message) {
    showToast("Cart is empty");
    return;
  }

  const body = encodeURIComponent(message);
  window.location.href =
    `mailto:ressiniq@gmail.com?subject=Product Enquiry – RESSINIQ&body=${body}`;
}

/* =========================
CART COUNT INDICATOR
========================= */
function updateCartCount() {
  const el = document.getElementById("cartCount");
  if (!el) return;

  const cart = getCart();
  const total = cart.reduce((sum, i) => sum + i.qty, 0);

  el.textContent = total;
  el.classList.toggle("hidden", total === 0);
}

document.addEventListener("DOMContentLoaded", updateCartCount);
