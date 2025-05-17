import { observer } from "../../observer";
import AddProduct from "./AddProduct";
import "./MainDashboard.css";
import ProductList from "./ProductList";
const componentID = "MainDashboard";

// Main dashboard component
export default function MainDashboard() {
  // Define the HTML structure
  const html = /*html*/ `
    <div component="${componentID}" id="${componentID}" class="admin-dashboard">
      <!-- Sidebar -->
      <div class="sidebar">
        <div class="sidebar-header">
          <h2>Main Panel</h2>
        </div>
        <div class="sidebar-menu">
          <a href="#/admin/products" class="sidebar-link active" id="products-link">
            <i class="fas fa-list"></i>
            <span>Product List</span>
          </a>
          <a href="#/admin/add-product" class="sidebar-link" id="add-product-link">
            <i class="fas fa-plus-circle"></i>
            <span>Add Product</span>
          </a>
        </div>
      </div>
      
      <!-- Main Content Area -->
      <div class="main-content">
        <div class="content-header">
          <h1 id="page-title">Product Management</h1>
        </div>
        
        <!-- Content container -->
        <div id="content-container">
          <!-- Dynamic content will be loaded here -->
          <div id="loader" class="loader">This is a placeholder, Product List should appear here by default.</div>
        </div>
      </div>
    </div>
  `;

  // Set up the observer after returning the HTML
  setTimeout(() => {
    observer(componentID, initDashboard);
  }, 0);

  return html;
}

// Initialize dashboard functionality
function initDashboard() {
  // Set up event listeners to sidebar links
  document.getElementById("products-link").addEventListener("click", (e) => {
    e.preventDefault();
    setActiveLink("products-link");
    document.getElementById("page-title").textContent = "Product List";
    loadProductList();
  });

  document.getElementById("add-product-link").addEventListener("click", (e) => {
    e.preventDefault();
    setActiveLink("add-product-link");
    document.getElementById("page-title").textContent = "Add New Product";
    loadAddProductForm();
  });
}

// Helper function to set active sidebar link
function setActiveLink(activeId) {
  document.querySelectorAll(".sidebar-link").forEach((link) => {
    link.classList.remove("active");
  });
  document.getElementById(activeId).classList.add("active");
}

// Function to load product list content
async function loadProductList() {
  const contentContainer = document.getElementById("content-container");
  contentContainer.innerHTML = ProductList();
}
// Function to load add product form

function loadAddProductForm() {
  const contentContainer = document.getElementById("content-container");
  contentContainer.innerHTML = AddProduct();
}
