import { observer } from "/src/observer";
import "./Sidebar.css";
const componentID = "dashboard-sidebar";

export default function Sidebar() {
  observer(componentID, compLoaded);
  return /*html*/ `
    <div component="${componentID}" id="${componentID}" class="${componentID}">
        <h2>Admin Panel</h2>
        <button id="productListBtn">Product List</button>
        <button id="addProductBtn">Add Product</button>
    </div>
    `;
}

//Javascript code to be executed once the home component is loaded
const compLoaded = () => {};
