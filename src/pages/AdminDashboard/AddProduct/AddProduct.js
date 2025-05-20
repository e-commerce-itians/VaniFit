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
    <h2> Add a New Product </h2>
    
    <label for="productName">Product Name</label>
    <input type="text" id="productName" name="productName" required>

    <label for="description">Description</label>
    <textarea id="description" name="description" rows="4" required></textarea>

    <label for="price">Price (EGP)</label>
    <input type="number" id="price" name="price" step="0.01" min="0" required>

    <label for="discount">Discount (%)</label>
    <input type="number" id="discount" name="discount" min="0" max="100" step="1" placeholder="0">

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
    
    <label for="gender">Gender</label>
    <select id="gender" name="gender" required>
      <option disabled selected>Select a gender</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="unisex">Unisex</option>
      <option value="children">Children</option>
    </select>

    <label for="brand">Brand Name</label>
    <input type="text" id="brand" name="brand" required>


    <label for="tags">Tags (comma-separated)</label>
    <input type="text" id="tags" name="tags" placeholder="e.g. summer, casual, cotton">

    <!-- Color and Size Management -->
    <div class="section-header">
      <h3>Colors and Sizes</h3>
      <button type="button" id="addColorBtn" class="secondary-button">Add Color</button>
    </div>
    
    <div id="colorsContainer">
      <!-- Color sections will be added here dynamically -->
      <div class="no-colors-message">Click "Add Color" to add product colors, images, and sizes.</div>
    </div>

    <button type="submit" class="add-product-btn">Add Product</button>
  </form>
  </div>
    `;
}

//Javascript code to be executed once the home component is loaded
const compLoaded = () => {
  // Add discount input to the list of form elements
  const productNameInput = document.getElementById("productName");
  const descriptionInput = document.getElementById("description");
  const priceInput = document.getElementById("price");
  const discountInput = document.getElementById("discount"); // Add this line
  const categorySelect = document.getElementById("category");
  const brandInput = document.getElementById("brand");
  const tagsInput = document.getElementById("tags");
  const form = document.getElementById("newProductForm");
  const addColorBtn = document.getElementById("addColorBtn");
  const colorsContainer = document.getElementById("colorsContainer");

  // Track colors for easier management
  const colorSections = [];
  let colorCounter = 0;

  // Function to add a new color section
  function addColorSection() {
    // Remove no colors message if it exists
    const noColorsMsg = colorsContainer.querySelector(".no-colors-message");
    if (noColorsMsg) noColorsMsg.remove();

    const colorId = `color-${colorCounter++}`;
    const colorSection = document.createElement("div");
    colorSection.className = "color-section";
    colorSection.dataset.colorId = colorId;

    const selectedCategory = categorySelect.value;

    colorSection.innerHTML = `
      <div class="color-header">
        <h4>Color Details</h4>
        <button type="button" class="remove-color-btn danger-button">Remove</button>
      </div>
      
      <label for="${colorId}-name">Color Name</label>
      <input type="text" id="${colorId}-name" name="${colorId}-name" required 
             placeholder="e.g., Red, Blue, Black">
      
      <label for="${colorId}-hex">Color Hex Code</label>
      <div class="color-picker-container">
        <input type="text" id="${colorId}-hex" name="${colorId}-hex" 
               placeholder="#RRGGBB" pattern="^#([A-Fa-f0-9]{6})$">
        <input type="color" id="${colorId}-picker" class="color-picker">
      </div>
      
      <div class="image-urls-section">
        <h5>Product Images (3 required)</h5>
        <div class="image-url-inputs">
          <div class="image-url-group">
            <label for="${colorId}-img1">Front Image URL</label>
            <input type="url" id="${colorId}-img1" name="${colorId}-img1" required 
                   placeholder="https://example.com/image1.jpg">
          </div>
          <div class="image-url-group">
            <label for="${colorId}-img2">Side Image URL</label>
            <input type="url" id="${colorId}-img2" name="${colorId}-img2" required
                   placeholder="https://example.com/image2.jpg">
          </div>
          <div class="image-url-group">
            <label for="${colorId}-img3">Back Image URL</label>
            <input type="url" id="${colorId}-img3" name="${colorId}-img3" required
                   placeholder="https://example.com/image3.jpg">
          </div>
        </div>
      </div>
      
      <div class="sizes-section">
        <div class="sizes-header">
          <h5>Available Sizes</h5>
          <button type="button" class="add-size-btn secondary-button">Add Size</button>
        </div>
        <div class="sizes-container" id="${colorId}-sizes">
          <!-- Size inputs will be added here dynamically -->
          <div class="size-row">
            <select class="size-select" required>
              ${getSizeOptionsByCategory(selectedCategory)}
            </select>
            <input type="number" class="stock-input" min="0" required placeholder="Stock" value="0">
            <button type="button" class="remove-size-btn danger-button">✕</button>
          </div>
        </div>
      </div>
    `;

    colorsContainer.appendChild(colorSection);
    colorSections.push(colorId);

    // Setup event listeners for this color section
    setupColorSectionEvents(colorSection);
  }

  // Function to set up events for a color section
  function setupColorSectionEvents(colorSection) {
    // Color picker sync
    const hexInput = colorSection.querySelector('input[id$="-hex"]');
    const colorPicker = colorSection.querySelector('input[type="color"]');

    colorPicker.addEventListener("input", () => {
      R;
      hexInput.value = colorPicker.value;
    });

    hexInput.addEventListener("input", () => {
      if (/^#([A-Fa-f0-9]{6})$/.test(hexInput.value)) {
        colorPicker.value = hexInput.value;
      }
    });

    // Remove color button
    const removeColorBtn = colorSection.querySelector(".remove-color-btn");
    removeColorBtn.addEventListener("click", () => {
      colorSection.remove();
      const colorId = colorSection.dataset.colorId;
      const index = colorSections.indexOf(colorId);
      if (index > -1) {
        colorSections.splice(index, 1);
      }

      // Show no colors message if no colors remain
      if (colorSections.length === 0) {
        colorsContainer.innerHTML = `<div class="no-colors-message">Click "Add Color" to add product colors, images, and sizes.</div>`;
      }
    });

    // Add size button
    const addSizeBtn = colorSection.querySelector(".add-size-btn");
    const sizesContainer = colorSection.querySelector(".sizes-container");

    addSizeBtn.addEventListener("click", () => {
      addSizeRow(sizesContainer);
    });

    // Remove size buttons for initial size row
    const initialRemoveSizeBtn = colorSection.querySelector(".remove-size-btn");
    initialRemoveSizeBtn.addEventListener("click", function () {
      if (sizesContainer.querySelectorAll(".size-row").length > 1) {
        this.closest(".size-row").remove();
      }
    });
  }

  // Function to add a new size row
  function addSizeRow(sizesContainer) {
    const sizeRow = document.createElement("div");
    sizeRow.className = "size-row";

    const selectedCategory = document.getElementById("category").value;

    sizeRow.innerHTML = `
      <select class="size-select" required>
        ${getSizeOptionsByCategory(selectedCategory)}
      </select>
      <input type="number" class="stock-input" min="0" required placeholder="Stock" value="0">
      <button type="button" class="remove-size-btn danger-button">✕</button>
    `;

    sizesContainer.appendChild(sizeRow);

    const removeSizeBtn = sizeRow.querySelector(".remove-size-btn");
    removeSizeBtn.addEventListener("click", function () {
      sizeRow.remove();
    });
  }

  // Function to get size options based on category
  function getSizeOptionsByCategory(category) {
    if (!category || category === "Select a category") {
      return `
        <option value="" disabled selected>Select Size</option>
        <option value="onesize">One Size</option>
      `;
    }

    switch (category.toLowerCase()) {
      case "shoes":
        return `
          <option value="" disabled selected>Select Size</option>
          <option value="35">35</option>
          <option value="36">36</option>
          <option value="37">37</option>
          <option value="38">38</option>
          <option value="39">39</option>
          <option value="40">40</option>
          <option value="41">41</option>
          <option value="42">42</option>
          <option value="43">43</option>
          <option value="44">44</option>
          <option value="45">45</option>
          <option value="46">46</option>
        `;
      case "shirts":
      case "t-shirt":
      case "hoodies":
      case "jackets":
      case "pants":
      default:
        return `
          <option value="" disabled selected>Select Size</option>
          <option value="XXS">XXS</option>
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
          <option value="XXL">XXL</option>
          <option value="3XL">3XL</option>
          <option value="4XL">4XL</option>
        `;
    }
  }

  // Add Color button event listener
  addColorBtn.addEventListener("click", addColorSection);

  // Add category change event listener to update size options
  categorySelect.addEventListener("change", function () {
    const selectedCategory = this.value;

    // Update size options in existing color sections
    document.querySelectorAll(".color-section").forEach((section) => {
      section.querySelectorAll(".size-row").forEach((row) => {
        const currentSelect = row.querySelector(".size-select");
        const currentValue = currentSelect.value;

        // Save current selection
        currentSelect.innerHTML = getSizeOptionsByCategory(selectedCategory);

        // Try to restore previous selection if it exists in new options
        if (currentValue) {
          const optionExists = Array.from(currentSelect.options).some(
            (option) => option.value === currentValue
          );
          if (optionExists) {
            currentSelect.value = currentValue;
          }
        }
      });
    });
  });

  // Form submission handler
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    // Parse form values
    const name = productNameInput.value.trim();
    const desc = descriptionInput.value.trim();
    const price = parseFloat(priceInput.value);
    const discount = parseFloat(discountInput.value) || 0;
    const category = categorySelect.value;
    const gender = document.getElementById("gender").value;
    const brand = brandInput.value.trim();
    const tags = tagsInput.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    // Collect color data
    const colors = [];
    const colorSections = document.querySelectorAll(".color-section");

    if (colorSections.length === 0) {
      alert("Please add at least one color.");
      return;
    }

    for (const section of colorSections) {
      const colorId = section.dataset.colorId;
      const colorName = document.getElementById(`${colorId}-name`).value;
      const colorHex = document.getElementById(`${colorId}-hex`).value;

      // Get image URLs
      const imageUrls = [
        document.getElementById(`${colorId}-img1`).value,
        document.getElementById(`${colorId}-img2`).value,
        document.getElementById(`${colorId}-img3`).value,
      ];

      // Get sizes
      const sizes = {};
      const sizeRows = section.querySelectorAll(".size-row");

      let hasSizes = false;
      for (const row of sizeRows) {
        const sizeSelect = row.querySelector(".size-select");
        const stockInput = row.querySelector(".stock-input");

        if (sizeSelect.value && stockInput.value) {
          sizes[sizeSelect.value] = parseInt(stockInput.value);
          hasSizes = true;
        }
      }

      if (!hasSizes) {
        alert(`Please add at least one size for color "${colorName}".`);
        return;
      }

      colors.push({
        name: colorName,
        hex: colorHex,
        image_urls: imageUrls,
        sizes: sizes,
      });
    }

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

    // Add gender to the product
    productInstance.setGender(gender);

    // Add discount to the product
    productInstance.setDiscount(discount);

    // Add colors data to the product
    productInstance.setColors(colors);

    try {
      // Add the product to Firestore
      const docRef = await addDoc(collection(App.firebase.db, "products"), {
        ...productInstance, // Spread class properties
        createdAt: new Date(),
      });

      console.log("Product added with ID:", docRef.id);
      alert("Product added successfully!");
      form.reset();
      // Clear color sections
      colorsContainer.innerHTML = `<div class="no-colors-message">Click "Add Color" to add product colors, images, and sizes.</div>`;
    } catch (error) {
      console.error("Error adding product to Firestore:", error);
      alert(`Error adding product: ${error.message}`);
    }
  });
};
