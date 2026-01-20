/* =====================================================
RESSINIQ ADMIN — SINGLE SOURCE OF TRUTH
FULL CMS CONTROL • NO HTML/CSS CHANGES
===================================================== */

const PASSWORD = "ressiniq-admin";

/* =========================
STATE
========================= */
let db = {
  categories: [
    { id: "resin", name: "Resin" },
    { id: "wood", name: "Wood" },
    { id: "custom", name: "Custom" },
    { id: "digital", name: "Digital" }
  ],
  products: []
};

/* =========================
AUTH
========================= */
loginBtn.onclick = () => {
  if (adminPassword.value === PASSWORD) {
    sessionStorage.setItem("admin-auth", "true");
    init();
  } else alert("Wrong password");
};

logoutBtn.onclick = () => {
  sessionStorage.clear();
  location.reload();
};

if (sessionStorage.getItem("admin-auth")) init();

/* =========================
INIT
========================= */
function init() {
  loginSection.style.display = "none";
  dashboard.classList.remove("hidden");
  loadDB();
  renderAll();
}

/* =========================
STORAGE
========================= */
function loadDB() {
  const saved = localStorage.getItem("ressiniq-cms-db");
  if (saved) db = JSON.parse(saved);
}

function saveDB() {
  localStorage.setItem("ressiniq-cms-db", JSON.stringify(db));
}

/* =========================
RENDER
========================= */
function renderAll() {
  renderCategorySelect();
  renderProductList();
}

/* =========================
CATEGORIES — FULL CONTROL
========================= */
function renderCategorySelect() {
  productCategory.innerHTML = "";
  db.categories.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.name;
    productCategory.appendChild(opt);
  });
}

window.manageCategories = () => {
  let msg = "CATEGORIES:\n\n";
  db.categories.forEach(c => (msg += `${c.id} → ${c.name}\n`));
  msg += "\nType:\nadd:Name\nedit:id:New Name\ndel:id";

  const input = prompt(msg);
  if (!input) return;

  const [action, a, b] = input.split(":");

  if (action === "add" && a) {
    const id = a.toLowerCase().replace(/\s+/g, "-");
    if (db.categories.some(c => c.id === id)) return alert("Category exists");
    db.categories.push({ id, name: a });
  }

  if (action === "edit" && a && b) {
    const cat = db.categories.find(c => c.id === a);
    if (!cat) return alert("Not found");
    cat.name = b;
  }

  if (action === "del" && a) {
    if (db.products.some(p => p.category === a))
      return alert("Category in use");
    db.categories = db.categories.filter(c => c.id !== a);
  }

  saveDB();
  renderAll();
};

/* =========================
PRODUCT LIST
========================= */
function renderProductList() {
  adminProducts.innerHTML = "";

  if (!db.products.length) {
    adminProducts.innerHTML = "<p class='muted'>No products added.</p>";
    return;
  }

  db.products.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "admin-item";
    div.innerHTML = `
      <div>
        <strong>${p.name}</strong><br>
        <span class="muted">${p.category} · ${p.status}</span>
      </div>
      <div>
        <button onclick="moveProduct(${i},-1)">↑</button>
        <button onclick="moveProduct(${i},1)">↓</button>
        <button onclick="previewProduct('${p.id}')">Preview</button>
        <button onclick="editProduct('${p.id}')">Edit</button>
        <button onclick="deleteProduct('${p.id}')">Delete</button>
      </div>
    `;
    adminProducts.appendChild(div);
  });
}

/* =========================
REORDER
========================= */
window.moveProduct = (i, dir) => {
  const j = i + dir;
  if (j < 0 || j >= db.products.length) return;
  [db.products[i], db.products[j]] = [db.products[j], db.products[i]];
  saveDB();
  renderProductList();
};

/* =========================
FORM SUBMIT — MULTI IMAGE SAFE
========================= */
productForm.onsubmit = e => {
  e.preventDefault();

  const images = productImages.value
    .split("\n")
    .map(i => i.trim())
    .filter(Boolean)
    .map(p => `assets/images/${p.split(/[/\\]/).pop()}`);

  const product = {
    id: productId.value || Date.now().toString(),
    name: productName.value.trim(),
    category: productCategory.value,
    status: productStatus.value,
    images,
    description: productDescription.value.trim()
  };

  if (!product.name) return alert("Name required");

  const i = db.products.findIndex(p => p.id === product.id);
  i >= 0 ? (db.products[i] = product) : db.products.push(product);

  saveDB();
  productForm.reset();
  productId.value = "";
  renderProductList();
};

/* =========================
EDIT / DELETE
========================= */
window.editProduct = id => {
  const p = db.products.find(x => x.id === id);
  if (!p) return;

  productId.value = p.id;
  productName.value = p.name;
  productCategory.value = p.category;
  productStatus.value = p.status;
  productImages.value = p.images.join("\n");
  productDescription.value = p.description;
};

window.deleteProduct = id => {
  if (!confirm("Delete product?")) return;
  db.products = db.products.filter(p => p.id !== id);
  saveDB();
  renderProductList();
};

/* =========================
PREVIEW (PUBLIC CARD)
========================= */
window.previewProduct = id => {
  const p = db.products.find(x => x.id === id);
  if (!p) return;

  const w = window.open("", "", "width=420,height=520");
  w.document.body.style.fontFamily = "system-ui";
  w.document.body.innerHTML = `
    ${p.images[0] ? `<img src="${p.images[0]}" style="width:100%;border-radius:12px">` : ""}
    <h3>${p.name}</h3>
    <p>${p.category}</p>
  `;
};

/* =========================
EXPORT — VALIDATED & SAFE
========================= */
window.exportJSON = () => {
  const errors = [];

  db.products.forEach(p => {
    if (!p.name) errors.push(`Missing name: ${p.id}`);
    if (!p.category) errors.push(`Missing category: ${p.name}`);
    if (!db.categories.find(c => c.id === p.category))
      errors.push(`Invalid category: ${p.name}`);
    if (p.images.some(i => i.includes(":\\")))
      errors.push(`Invalid image path: ${p.name}`);
  });

  if (errors.length) {
    alert("Fix before export:\n\n" + errors.join("\n"));
    return;
  }

  const exportData = {
    categories: db.categories.map(c => c.name),
    products: db.products
  };

  navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
  alert("Exported.\nPaste into assets/data/products.json");
};
