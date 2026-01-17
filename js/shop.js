console.log("SHOP.JS LOADED");

const API_URL = "/products";
let allProducts = [];

async function loadProducts() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch products");

    allProducts = await res.json();
    renderProducts(allProducts);
  } catch (err) {
    console.error("Failed to load products:", err);
  }
}

function renderProducts(products) {
  const container = document.getElementById("product-grid");
  if (!container) {
    console.error("product-grid element not found");
    return;
  }

  container.innerHTML = "";

  const countEl = document.getElementById("product-count");
  if (countEl) countEl.innerText = products.length;

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="image-wrapper">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <h3>${product.name}</h3>
      <p class="price">$${product.price}</p>
      <button onclick="deleteProduct(${product.id})">Delete</button>
    `;

    container.appendChild(card);
  });
}

async function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  loadProducts();
}

async function addProduct() {
  const name = document.getElementById("name").value.trim();
  const price = Number(document.getElementById("price").value);
  const image = document.getElementById("image").value.trim();
  const description = document.getElementById("description").value.trim();

  if (!name || !price || !image || !description) {
    alert("Please fill in all fields");
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, image, description })
    });

    if (!res.ok) throw new Error("Failed to add product");

    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("image").value = "";
    document.getElementById("description").value = "";

    loadProducts();
  } catch (err) {
    console.error(err);
    alert("Error adding product. Check console.");
  }
}

function toggleAdmin() {
  const panel = document.getElementById("admin-panel");
  if (!panel) return;

  panel.style.display =
    panel.style.display === "none" ? "block" : "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const sortFilter = document.getElementById("sort-filter");

  if (sortFilter) {
    sortFilter.addEventListener("change", function () {
      let sorted = [...allProducts];

      if (this.value === "Price: Low to High") {
        sorted.sort((a, b) => a.price - b.price);
      } else if (this.value === "Price: High to Low") {
        sorted.sort((a, b) => b.price - a.price);
      }

      renderProducts(sorted);
    });
  }

  loadProducts();
});
