const cartItemsEl = document.getElementById("cartItems");
const cartSummary = document.getElementById("cartSummary");
const sendInsta = document.getElementById("sendInsta");
const sendEmail = document.getElementById("sendEmail");

function renderCart() {
  const cart = getCart();
  cartItemsEl.innerHTML = "";

  if (!cart.length) {
    cartItemsEl.innerHTML = "<p class='muted'>Your cart is empty.</p>";
    cartSummary.classList.add("hidden");
    updateCartCount();
    return;
  }

  cartSummary.classList.remove("hidden");

  cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <img src="${item.images[0] || ""}" alt="${item.name}">
      <div class="cart-info">
        <strong>${item.name}</strong>
        <span class="muted">${item.category}</span>
        <span>${item.price ? `₹${item.price}` : "Price on enquiry"}</span>

        <div class="cart-qty">
          <button onclick="changeQty('${item.id}', -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty('${item.id}', 1)">+</button>
        </div>
      </div>
      <button class="remove-btn" onclick="removeItem('${item.id}')">✕</button>
    `;

    cartItemsEl.appendChild(div);
  });

  updateCartCount();
}

function changeQty(id, delta) {
  updateQty(id, delta);
  renderCart();
}

function removeItem(id) {
  removeFromCart(id);
  renderCart();
}

sendInsta.onclick = () => openCartQueryModal(buildQueryMessage());
sendEmail.onclick = () => openCartQueryModal(buildQueryMessage());

renderCart();
