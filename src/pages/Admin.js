import "../styles/Admin.css";
import { observer } from "../observer";
import {
  Shirt,
  TShirt,
  Pants,
  Shoes,
  Hoodie,
  Jacket,
} from "../components/ProductClasses";
const componentID = "Admin";

export default function Admin() {
  observer(componentID, compLoaded);
  return /*html*/ `
   <form id="newProductForm">
    <h2>Add New Product</h2>

    <label for="productName">Product Name</label>
    <input type="text" id="productName" name="productName" required>

    <label for="description">Description</label>
    <textarea id="description" name="description" rows="4" required></textarea>

    <label for="price">Price ($)</label>
    <input type="number" id="price" name="price" step="0.01" min="0" required>

    <label for="category">Category</label>
    <select id="category" name="category" required>
      <option value="">Select a category</option>
      <option value="shirts">Shirts</option>
      <option value="hoodies">Hoodies</option>
      <option value="pants">Pants</option>
      <option value="jackets">Jackets</option>
      <option value="shoes">Shoes</option>
      <option value="t-shirt">T-Shirt</option>
    </select>

    <label for="brand">Brand Name</label>
    <input type="text" id="brand" name="brand" required>

    <label for="tags">Tags (comma-separated)</label>
    <input type="text" id="tags" name="tags" placeholder="e.g. summer, casual, cotton">

    <label for="colors">Colors (comma-separated)</label>
    <input type="text" id="colors" name="colors" placeholder="e.g. red, blue, black">

    <button type="submit">Add Product</button>
  </form>
    `;
}

//Javascript code to be executed once the home component is loaded
const compLoaded = () => {
  const productNameInput = document.getElementById("productName");
  const descriptionInput = document.getElementById("description");
  const priceInput = document.getElementById("price");
  const categorySelect = document.getElementById("category");
  const brandInput = document.getElementById("brand");
  const tagsInput = document.getElementById("tags");
  const colorsInput = document.getElementById("colors");
  const form = document.getElementsByTagName("newProductForm");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("clicked");
  });
};
