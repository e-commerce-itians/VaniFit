import { collection, getDocs } from "firebase/firestore";
import EditProduct from "../EditProduct/EditProduct";
import DeleteDialog from "./DeleteDialog";
import { observer } from "/src/observer";
import "./ProductList.css";
import "./DeleteDialog.css"; // Import the CSS for the dialog

const componentID = "ProductList";

export default function ProductList() {
  // Directly call observer without setTimeout to avoid race conditions
  observer(componentID, compLoaded);

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
              <th>Discount</th>
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
  // Immediately fetch products when loaded
  fetchProducts();

  // Add event listeners
  const refreshBtn = document.getElementById("refreshProductsBtn");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      fetchProducts();
    });
  }

  const searchInput = document.getElementById("productSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", filterProducts);
  }

  // Remove the productListReady event handler as it's causing issues
  // Just use the normal observer pattern
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

// Add proper event delegation for edit and delete buttons
function addActionListeners() {
  // Use event delegation for better reliability
  document
    .getElementById("productsTableBody")
    ?.addEventListener("click", (e) => {
      // Find the closest button if we clicked on an icon inside the button
      const button = e.target.closest(".edit-btn, .delete-btn");
      if (!button) return;

      const productId = button.getAttribute("data-id");
      if (!productId) return;

      if (button.classList.contains("edit-btn")) {
        editProduct(productId);
      } else if (button.classList.contains("delete-btn")) {
        confirmDeleteProduct(productId);
      }
    });
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

      // Create styled discount tag with different classes based on value
      const hasDiscount = product.discount && product.discount > 0;
      const discountClass = hasDiscount
        ? "discount-tag"
        : "discount-tag no-discount";
      const discountDisplay = hasDiscount ? `${product.discount}%` : "0%";

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
      <td><span class="${discountClass}">${discountDisplay}</span></td>
      <td>${calculateTotalStock(product) || 0}</td>
      <td class="actions-cell">
        <button class="edit-btn" data-id="${product.id}" title="Edit Product">
          <i class="fa-solid fa-pen-to-square" data-id="${product.id}"></i>
        </button>
        <button class="delete-btn" data-id="${
          product.id
        }" title="Delete Product">
          <i class="fa-solid fa-trash" data-id="${product.id}"></i>
        </button>
      </td>
    </tr>
  `;
    })
    .join("");

  // Use the dedicated function for event listeners
  addActionListeners();
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
  const contentContainer = document.querySelector(".dashboard-content");
  contentContainer.innerHTML = EditProduct(productId);
}

// Delete product confirmation
function confirmDeleteProduct(productId) {
  // Get the product name
  const productRow = document.querySelector(
    `tr[data-product-id="${productId}"]`
  );
  const productName = productRow
    ? productRow.querySelector("td:nth-child(2)").textContent
    : "";

  // Create dialog container if it doesn't exist
  const dialogContainer = document.createElement("div");
  dialogContainer.id = "deleteDialogContainer";
  document.body.appendChild(dialogContainer);

  // Render the delete dialog
  dialogContainer.innerHTML = DeleteDialog(
    productId,
    productName,
    // Cancel callback
    () => {
      // Dialog will remove itself
    },
    // Success callback
    () => {
      fetchProducts(); // Refresh the product list after successful deletion
    }
  );
}

// Helper function to calculate total stock across all colors and sizes
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
