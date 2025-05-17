import "./AddPoduct.css";
import { observer } from "../../../observer";
import { Shirt, TShirt, Pants, Shoes, Hoodie, Jacket } from "../ProductClasses";
import { collection, addDoc } from "firebase/firestore";
const componentID = "AddProduct";

export default function AddProduct() {
  observer(componentID, compLoaded);
  return /*html*/ `
<div component="${componentID}">
   <form id="newProductForm">

    <label for="productName">Product Name</label>
    <input type="text" id="productName" name="productName" required>

    <label for="description">Description</label>
    <textarea id="description" name="description" rows="4" required></textarea>

    <label for="price">Price ($)</label>
    <input type="number" id="price" name="price" step="0.01" min="0" required>

    <label for="category">Category</label>
    <select id="category" name="category" required>
      <option disabled selected>Select a category</option>
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

    <button type="submit">Add Product</button>
  </form>
  </div>
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
  const form = document.getElementById("newProductForm");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    // Parse form values
    const name = productNameInput.value.trim();
    const desc = descriptionInput.value.trim();
    const price = parseFloat(priceInput.value);
    const category = categorySelect.value;
    const brand = brandInput.value.trim();
    const tags = tagsInput.value.split(",").map((tag) => tag.trim());

    // Create appropriate subclass instance
    let productInstance;

    switch (category.toLowerCase()) {
      case "shirts":
        productInstance = new Shirt(name, desc, price, category, brand, tags);
        break;
      case "t-shirt":
        productInstance = new TShirt(name, desc, price, category, brand, tags);
        break;
      case "pants":
        productInstance = new Pants(name, desc, price, category, brand, tags);
        break;
      case "shoes":
        productInstance = new Shoes(name, desc, price, category, brand, tags);
        break;
      case "hoodies":
        productInstance = new Hoodie(name, desc, price, category, brand, tags);
        break;
      case "jackets":
        productInstance = new Jacket(name, desc, price, category, brand, tags);
        break;
      default:
        console.error("Unknown product category:", category);
        return;
    }

    try {
      // Add the product to Firestore
      const docRef = await addDoc(collection(App.firebase.db, "products"), {
        ...productInstance, // Spread class properties
        createdAt: new Date(),
      });

      console.log("Product added with ID:", docRef.id);
      form.reset();
    } catch (error) {
      console.error("Error adding product to Firestore:", error);
    }
  });
};
