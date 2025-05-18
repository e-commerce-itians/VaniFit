import { observer } from "../../../observer";
import AddProduct from "../AddProduct/AddProduct";
import "./MainDashboard.css";
import Sidebar from "../Sidebar/Sidebar";
import ProductList from "../ProductList/ProductList";
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
    setTimeout(() => {
      initDashboard();
    }, 0);
  });

  return html;
}

// Initialize dashboard functionality
function initDashboard() {
  const productListBtn = document.querySelector("#productListBtn");
  const addProductBtn = document.querySelector("#addProductBtn");
  const mainContent = document.querySelector("#dashboard-content");
  productListBtn.addEventListener("click", () => {
    mainContent.innerHTML = ProductList();
  });

  addProductBtn.addEventListener("click", () => {
    mainContent.innerHTML = AddProduct();
  });
}
