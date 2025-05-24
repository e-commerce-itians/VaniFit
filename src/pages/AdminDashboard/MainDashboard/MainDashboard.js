import { observer } from "../../../observer";
import AddProduct from "../AddProduct/AddProduct";
import Sidebar from "../Sidebar/Sidebar";
import ProductList from "../ProductList/ProductList";
import OrderManagement from "../OrderManagement/OrderManagement";
import "./MainDashboard.css";
const componentID = "MainDashboard";

// Main dashboard component
export default function MainDashboard() {
  console.log("MainDashboard component rendering");

  // Define the HTML structure
  const html = /*html*/ `
    <div component="${componentID}" id="${componentID}" class="admin-dashboard">
      <!-- Sidebar -->
      ${Sidebar()}
      <!-- Main Content -->
      <div class="dashboard-content" id="dashboard-content">
        <h1>Welcome to the Admin Dashboard</h1>
        <p>Select an option from the sidebar to get started.</p>
      </div>
    </div>
  `;

  observer(componentID, () => {
    if (App.firebase.user.role !== "admin") {
      App.navigator("/");
      return;
    }
    initDashboard();
  });

  return html;
}

// Initialize dashboard functionality
function initDashboard() {
  const productListBtn = document.querySelector("#productListBtn");
  const addProductBtn = document.querySelector("#addProductBtn");
  const orderManagementBtn = document.querySelector("#orderManagementBtn");
  const mainContent = document.querySelector("#dashboard-content");

  productListBtn.addEventListener("click", () => {
    mainContent.innerHTML = ProductList();
    updateActiveButton("products");
  });

  addProductBtn.addEventListener("click", () => {
    mainContent.innerHTML = AddProduct();
    updateActiveButton("add-product");
  });

  orderManagementBtn.addEventListener("click", () => {
    mainContent.innerHTML = OrderManagement();
    updateActiveButton("orders");
  });

  // Clear any initially active buttons
  updateActiveButton("");
}

// Helper function to update active button state
function updateActiveButton(section) {
  const buttons = document.querySelectorAll(
    '[component="dashboard-sidebar"] button'
  );
  buttons.forEach((button) => button.classList.remove("active"));

  // Only set active state if a valid section is provided
  if (section) {
    switch (section) {
      case "products":
        document.getElementById("productListBtn").classList.add("active");
        break;
      case "add-product":
        document.getElementById("addProductBtn").classList.add("active");
        break;
      case "orders":
        document.getElementById("orderManagementBtn").classList.add("active");
        break;
    }
  }
}
