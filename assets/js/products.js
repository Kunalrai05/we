/* =========================
FILE: assets/js/products.js
========================= */

fetch("assets/data/products.json")
  .then(res => res.json())
  .then(data => {
    const productsGrid = document.getElementById("productsGrid");
    const filters = document.getElementById("categoryFilters");
    const categoryGrid = document.getElementById("categoryGrid");

    let activeCategory = "all";

    /* =========================
    CATEGORY SHOWCASE
    ========================= */
    function renderCategoryShowcase() {
      categoryGrid.innerHTML = "";

      data.categories.forEach(cat => {
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
          productsGrid.scrollIntoView({ behavior: "smooth", block: "start" });
        };

        categoryGrid.appendChild(card);
      });
    }

    /* =========================
    FILTER BUTTONS
    ========================= */
    function renderFilters() {
      filters.innerHTML = `
        <button class="filter active" data-cat="all">All</button>
      `;

      data.categories.forEach(cat => {
        filters.innerHTML += `
          <button class="filter" data-cat="${cat.id}">
            ${cat.name}
          </button>
        `;
      });

      filters.querySelectorAll(".filter").forEach(btn => {
        btn.onclick = () => {
          activeCategory = btn.dataset.cat;
          updateFilterUI(activeCategory);
          renderProducts();
        };
      });
    }

    function updateFilterUI(categoryId) {
      filters.querySelectorAll(".filter").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.cat === categoryId);
      });
    }

    /* =========================
    PRODUCTS
    ========================= */
    function renderProducts() {
      productsGrid.innerHTML = "";

      data.products
        .filter(p => p.status === "live")
        .filter(p => activeCategory === "all" || p.category === activeCategory)
        .forEach(p => {
          const card = document.createElement("a");
          card.href = `product.html?id=${p.id}`;
          card.className = "card product-card parallax-card";
          card.innerHTML = `
            <img src="${p.images[0]}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p class="muted">
              ${data.categories.find(c => c.id === p.category)?.name || ""}
            </p>
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
  });
{
  "categories": [
    "Resin",
    "Wood",
    "Custom",
    "Digital"
  ],
  "products": [
    {
      "id": "1768895271372",
      "name": "fvdsv",
      "category": "Resin",
      "status": "live",
      "images": [
        "\"D:\\RESSINIQ\\assets\\images\\intro-logo.jpg\""
      ],
      "description": "efgdf"
    }
  ]
}