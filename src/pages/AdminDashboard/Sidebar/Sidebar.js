import { observer } from "../../../observer";
import "./Sidebar.css";
const componentID = "Sidebar";

export default function Sidebar() {
  observer(componentID, compLoaded);
  return /*html*/ `
    <div component="${componentID}" id="${componentID}" class="sidebar">
        <div class="sidebar-header">
          <h2>Main Panel</h2>
        </div>
        <div class="sidebar-menu">
          <a href="#/admin/productlist" class="sidebar-link active" id="products-link">
            <i class="fas fa-list"></i>
            <span>Product List</span>
          </a>
          <a href="#/admin/add-product" class="sidebar-link" id="add-product-link">
            <i class="fas fa-plus-circle"></i>
            <span>Add Product</span>
          </a>
        </div>
    </div>
    `;
}

//Javascript code to be executed once the home component is loaded
const compLoaded = () => {};
