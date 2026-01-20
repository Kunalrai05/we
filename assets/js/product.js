/* =========================
FILE: assets/js/product.js
========================= */

fetch("assets/data/products.json")
  .then(res => res.json())
  .then(data => {
    const id = new URLSearchParams(window.location.search).get("id");
    const product = data.products.find(p => p.id === id);

    if (!product) {
      document.body.innerHTML = "<h2>Product not found</h2>";
      return;
    }

    /* CONTENT */
    productName.textContent = product.name;
    productCategory.textContent = product.category;
    productDescription.textContent = product.description || "";
    productPrice.textContent = product.price
      ? `₹${product.price}`
      : "Price on enquiry";

    /* IMAGE NORMALIZATION */
    const normalize = path => {
      if (!path || typeof path !== "string") return null;
      return path
        .replace(/^"+|"+$/g, "")
        .replace(/\\/g, "/")
        .replace(/^.*assets\//, "assets/")
        .trim();
    };

    const images = Array.isArray(product.images)
      ? product.images.map(normalize).filter(Boolean)
      : [];

    const fallback = "assets/images/product-default.jpg";

    mainImage.onerror = () => {
      mainImage.src = fallback;
    };

    mainImage.src = images[0] || fallback;
    thumbnails.innerHTML = "";

    images.forEach((img, i) => {
      const t = document.createElement("img");
      t.src = img;
      t.className = "thumbnail" + (i === 0 ? " active" : "");
      t.onerror = () => t.remove();
      t.onclick = () => {
        document.querySelectorAll(".thumbnail")
          .forEach(el => el.classList.remove("active"));
        t.classList.add("active");
        mainImage.src = img;
      };
      thumbnails.appendChild(t);
    });

    /* QUERY MESSAGE */
    function buildMessage() {
      let msg = "Hi RESSINIQ 👋\n\n";
      msg += "I’m interested in the following product:\n\n";
      msg += `• ${product.name}`;
      if (product.price) msg += ` — ₹${product.price}`;
      msg += "\n\nPlease share details.\n\nThanks!";
      return msg;
    }

    /* PREMIUM QUERY MODAL */
    function openQueryModal(message) {
      const overlay = document.createElement("div");
      overlay.className = "modal-overlay";

      overlay.innerHTML = `
        <div class="modal">
          <h3>Ask a Query</h3>
          <p>Choose how you’d like to contact us.</p>

          <div class="modal-actions">
            <button class="btn primary" id="qInsta">Instagram</button>
            <button class="btn ghost" id="qEmail">Email</button>
            <button class="btn ghost" id="qCancel">Cancel</button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      overlay.querySelector("#qInsta").onclick = () => {
        navigator.clipboard.writeText(message).then(() => {
          window.open("https://www.instagram.com/ressiniq/", "_blank");
          overlay.remove();
        });
      };

      overlay.querySelector("#qEmail").onclick = () => {
        window.location.href =
          `mailto:ressiniq@gmail.com?subject=Product Enquiry – ${product.name}&body=${encodeURIComponent(message)}`;
        overlay.remove();
      };

      overlay.querySelector("#qCancel").onclick = () => overlay.remove();

      overlay.onclick = e => {
        if (e.target === overlay) overlay.remove();
      };
    }

    /* ACTIONS */
    addToCartBtn.onclick = () => addToCart(product);
    askQueryBtn.onclick = () => openQueryModal(buildMessage());
  })
  .catch(err => console.error("Product load failed:", err));
