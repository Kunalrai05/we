/* =========================
FILE: assets/js/products.js
DO NOT EDIT HTML/CSS
========================= */

fetch("assets/data/products.json")
  .then(res => res.json())
  .then(data => {
    const productsGrid = document.getElementById("productsGrid");
    const filters = document.getElementById("categoryFilters");
    const categoryGrid = document.getElementById("categoryGrid");

    if (!productsGrid) return;

    let activeCategory = "all";

    /* =========================
    CATEGORY → IMAGE MAP
    ========================= */
    const CATEGORY_IMAGES = {
      resin: "assets/images/category-resin.jpg",
      wood: "assets/images/category-wood.jpg",
      custom: "assets/images/category-custom.jpg",
      digital: "assets/images/category-digital.jpg"
    };

    /* =========================
    NORMALIZE CATEGORIES
    ========================= */
    const categories = (data.categories || []).map(cat => {
      const id =
        typeof cat === "string"
          ? cat.toLowerCase()
          : String(cat.id).toLowerCase();

      return {
        id,
        name: typeof cat === "string" ? cat : cat.name,
        image: CATEGORY_IMAGES[id]
      };
    });

    /* =========================
    CATEGORY SHOWCASE
    ========================= */
    function renderCategoryShowcase() {
      if (!categoryGrid) return;
      categoryGrid.innerHTML = "";

      categories.forEach(cat => {
        const card = document.createElement("div");
        card.className = "category-card parallax-card";

        card.innerHTML = `
          <img src="${cat.image}" alt="${cat.name}">
          <div class="category-label">${cat.name}</div>
        `;

        card.onclick = () => {
          activeCategory = cat.id;
          updateFilterUI(cat.id);
          renderProducts();
          productsGrid.scrollIntoView({ behavior: "smooth" });
        };

        categoryGrid.appendChild(card);
      });
    }

    /* =========================
    FILTER BUTTONS
    ========================= */
    function renderFilters() {
      if (!filters) return;

      filters.innerHTML = `
        <button class="filter active" data-cat="all">All</button>
      `;

      categories.forEach(cat => {
        const btn = document.createElement("button");
        btn.className = "filter";
        btn.dataset.cat = cat.id;
        btn.textContent = cat.name;

        btn.onclick = () => {
          activeCategory = cat.id;
          updateFilterUI(cat.id);
          renderProducts();
        };

        filters.appendChild(btn);
      });
    }

    function updateFilterUI(catId) {
      if (!filters) return;
      filters.querySelectorAll(".filter").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.cat === catId);
      });
    }

    /* =========================
    PRODUCTS RENDER (FIXED)
    ========================= */
    function renderProducts() {
      productsGrid.innerHTML = "";

      const products = (data.products || [])
        .filter(p => p.status === "live" || !p.status)
        .map(p => ({
          ...p,
          category: String(p.category || "").toLowerCase()
        }))
        .filter(p => activeCategory === "all" || p.category === activeCategory);

      if (!products.length) {
        productsGrid.innerHTML = `
          <p class="muted" style="text-align:center;width:100%;">
            No products available
          </p>
        `;
        return;
      }

      products.forEach(p => {
        const categoryName =
          categories.find(c => c.id === p.category)?.name || "";

        const image =
          Array.isArray(p.images) && p.images[0]
            ? p.images[0]
            : "assets/images/product-default.jpg";

        const card = document.createElement("a");
        card.href = `product.html?id=${p.id}`;
        card.className = "card product-card parallax-card";

        card.innerHTML = `
          <div class="product-image-wrap">
            <img src="${image}" alt="${p.name}">
          </div>
          <div class="product-meta">
            <h3>${p.name}</h3>
            <p class="muted">${categoryName}</p>
          </div>
        `;

        productsGrid.appendChild(card);
      });
    }

    /* =========================
    INIT
    ========================= */
    renderCategoryShowcase();
    renderFilters();
    renderProducts();
  })
  .catch(err => {
    console.error("Products load failed:", err);
  });
