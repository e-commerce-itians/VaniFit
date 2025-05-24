import { observer } from "../../../observer";
import AddProduct from "../AddProduct/AddProduct";
import Sidebar from "../Sidebar/Sidebar";
import ProductList from "../ProductList/ProductList";
import OrderManagement from "../OrderManagement/OrderManagement";
import Overview from "../Overview/Overview";
import "./MainDashboard.css";
const componentID = "MainDashboard";

// Main dashboard component
export default function MainDashboard() {
  // Define the HTML structure
  const html = /*html*/ `
    <div component="${componentID}" id="${componentID}" class="admin-dashboard">
      <!-- Sidebar -->
      ${Sidebar()}
      <!-- Main Content -->
      <div class="dashboard-content" id="dashboard-content">
        ${Overview()}
      </div>
    </div>
  `;

  observer(componentID, () => {
    if (App.firebase.user.role !== "admin") {
      App.navigator("/");
      return;
    }
    initDashboard();
    // Manually trigger Overview component initialization since it's loaded by default
    initializeOverview();
  });

  return html;
}

// Initialize dashboard functionality
function initDashboard() {
  const overviewBtn = document.querySelector("#overviewBtn");
  const productListBtn = document.querySelector("#productListBtn");
  const addProductBtn = document.querySelector("#addProductBtn");
  const orderManagementBtn = document.querySelector("#orderManagementBtn");
  const mainContent = document.querySelector("#dashboard-content");

  overviewBtn.addEventListener("click", () => {
    mainContent.innerHTML = Overview();
    updateActiveButton("overview");
    // Initialize Overview component after DOM update
    setTimeout(initializeOverview, 0);
  });

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

  // Set Overview as active by default
  updateActiveButton("overview");
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
      case "overview":
        document.getElementById("overviewBtn").classList.add("active");
        break;
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

// Function to manually initialize Overview component
async function initializeOverview() {
  // Import and execute the Overview component's initialization logic
  const { initializeOverviewData } = await import("../Overview/Overview.js");
  if (initializeOverviewData) {
    initializeOverviewData();
  }
}
