import { observer } from "/src/observer";
import { deleteProduct as delProd } from "/src/utils/DeleteProduct";
import "./ProductList.css";
import { collection, getDocs } from "firebase/firestore";

const componentID = "ProductList";

export default function ProductList() {
  // Call observer after component is rendered
  observer(componentID, () => {
    setTimeout(() => {
      compLoaded();
    }, 0);
  });

  return /*html*/ `
    <div component="${componentID}" id="${componentID}" class="${componentID}">
      <h2>Products</h2>
      <div class="product-list-container">
        <div class="product-list-header">
          <div class="product-search">
            <input type="text" id="productSearchInput" placeholder="Search products...">
          </div>
          <button id="refreshProductsBtn" class="refresh-btn">Refresh</button>
        </div>
        
        <div id="productsLoading" class="loading-indicator">
          <p>Loading products...</p>
        </div>
        
        <div id="productsError" class="error-message" style="display: none;">
          <p>Error loading products. Please try again.</p>
        </div>
        
        <table class="products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="productsTableBody">
            <!-- Products will be loaded here -->
          </tbody>
        </table>
        
        <div id="noProductsMessage" class="no-data-message" style="display: none;">
          <p>No products found.</p>
        </div>
      </div>
    </div>
  `;
}

// JavaScript code to be executed once the component is loaded
const compLoaded = () => {
  // Fetch and display products
  fetchProducts();

  // Add event listeners
  const refreshBtn = document.getElementById("refreshProductsBtn");
  refreshBtn.addEventListener("click", () => {
    fetchProducts();
  });

  const searchInput = document.getElementById("productSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", filterProducts);
  }
};

// Fetch products from Firestore
async function fetchProducts() {
  try {
    showLoadingIndicator();

    const productsCollection = collection(App.firebase.db, "products");
    const productsSnapshot = await getDocs(productsCollection);

    const products = [];
    productsSnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    renderProducts(products);
    hideLoadingIndicator();
  } catch (error) {
    console.error("Error fetching products:", error);
    showErrorMessage();
  }
}

// Render products to the table
function renderProducts(products) {
  const tableBody = document.getElementById("productsTableBody");
  const noProductsMessage = document.getElementById("noProductsMessage");

  if (!tableBody) return;

  if (products.length === 0) {
    tableBody.innerHTML = "";
    if (noProductsMessage) noProductsMessage.style.display = "block";
    return;
  }

  if (noProductsMessage) noProductsMessage.style.display = "none";

  tableBody.innerHTML = products
    .map((product) => {
      const firstImageUrl =
        product.colors?.[0]?.image_urls?.[0] ||
        "/assets/images/placeholder.png";
      return `
    <tr data-product-id="${product.id}">
      <td>
        <img src="${firstImageUrl}" 
             alt="${product.name}" 
             class="product-thumbnail">
      </td>
      <td>${product.name || "Unnamed Product"}</td>
      <td>${product.category || "Uncategorized"}</td>
      <td>$${product.price ? product.price.toFixed(2) : "0.00"}</td>
      <td>${calculateTotalStock(product) || 0}</td>
      <td class="actions-cell">
        <button class="edit-btn" id="edit-btn" data-id="${
          product.id
        }"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="delete-btn" id="delte-btn" data-id="${
          product.id
        }"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>
  `;
    })
    .join("");

  // Add event listeners to action buttons
  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const productId = e.target.getAttribute("data-id");
      editProduct(productId);
    });
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const productId = e.target.getAttribute("data-id");
      confirmDeleteProduct(productId);
    });
  });
}

// Filter products based on search input
function filterProducts() {
  const searchInput = document.getElementById("productSearchInput");
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";

  const rows = document.querySelectorAll("#productsTableBody tr");

  rows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchTerm) ? "" : "none";
  });
}

// Edit product function
function editProduct(productId) {
  console.log(`Edit product with ID: ${productId}`);
  // Implement navigation to edit product page or show edit modal
  // Example: window.location.href = `/admin/edit-product/${productId}`;
}

// Delete product confirmation
function confirmDeleteProduct(productId) {
  if (confirm("Are you sure you want to delete this product?")) {
    deleteProduct(productId);
  }
}

// Delete product from Firestore
async function deleteProduct(productId) {
  delProd(productId);
  // After successful deletion, refresh the product list
  fetchProducts();
}

// Add this helper function to calculate total stock across all colors and sizes
function calculateTotalStock(product) {
  return (
    product.colors?.reduce((total, color) => {
      return (
        total +
        Object.values(color.sizes || {}).reduce((sum, stock) => sum + stock, 0)
      );
    }, 0) || 0
  );
}

// UI Helper functions
function showLoadingIndicator() {
  const loadingIndicator = document.getElementById("productsLoading");
  const errorMessage = document.getElementById("productsError");

  if (loadingIndicator) loadingIndicator.style.display = "block";
  if (errorMessage) errorMessage.style.display = "none";
}

function hideLoadingIndicator() {
  const loadingIndicator = document.getElementById("productsLoading");
  if (loadingIndicator) loadingIndicator.style.display = "none";
}

function showErrorMessage() {
  const loadingIndicator = document.getElementById("productsLoading");
  const errorMessage = document.getElementById("productsError");

  if (loadingIndicator) loadingIndicator.style.display = "none";
  if (errorMessage) errorMessage.style.display = "block";
}
