import { observer } from "/src/observer";
import ProductList from "../ProductList/ProductList";
import "./EditProduct.css";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import MessageDialog from "../MessageDialog/MessageDialog";
import "../MessageDialog/MessageDialog.css";
import {
  ImageUploader,
  setupImageUploader,
} from "/src/components/ImageUploader/ImageUploader.js";
import "/src/components/ImageUploader/ImageUploader.css";

const componentID = "EditProduct";

export default function EditProduct(productId) {
  observer(componentID, () => compLoaded(productId));

  return /*html*/ `
    <div component="${componentID}" id="${componentID}" class="${componentID}">
      <div class="edit-product-header">
        <h2>Edit Product</h2>
        <button id="backToList" class="back-btn">Back to List</button>
      </div>
      
      <div id="productLoading" class="loading-indicator">Loading product...</div>
      <form id="editProductForm" style="display: none;">
        <div class="form-grid">
          <div class="form-group">
            <label for="productName">Product Name</label>
            <input type="text" id="productName" name="productName" required>
          </div>

          <div class="form-group">
            <label for="brand">Brand Name</label>
            <input type="text" id="brand" name="brand" required>
          </div>

          <div class="form-group">
            <label for="price">Price (USD)</label>
            <input type="number" id="price" name="price" step="0.01" min="0" required>
          </div>

          <div class="form-group">
            <label for="discount">Discount (%)</label>
            <input type="number" id="discount" name="discount" min="0" max="100" step="1" placeholder="0">
          </div>

          <div class="form-group">
            <label for="category">Category</label>
            <select id="category" name="category" required disabled>
              <option value="shirts">Shirts</option>
              <option value="hoodies">Hoodies</option>
              <option value="pants">Pants</option>
              <option value="jackets">Jackets</option>
              <option value="shoes">Shoes</option>
              <option value="t-shirt">T-Shirt</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="gender">Gender</label>
            <select id="gender" name="gender" required>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unisex">Unisex</option>
              <option value="children">Children</option>
            </select>
          </div>

          <div class="form-group full-width">
            <label for="description">Description</label>
            <textarea id="description" name="description" rows="4" required></textarea>
          </div>

          <div class="form-group full-width">
            <label for="tags">Tags</label>
            <input type="text" id="tags" name="tags" placeholder="Enter tags separated by commas">
          </div>
        </div>

        <div class="section-header">
          <h3>Colors and Sizes</h3>
          <button type="button" id="addColorBtn" class="secondary-button">Add Color</button>
        </div>
        
        <div id="colorsContainer"></div>

        <button type="submit" class="save-btn">Save Changes</button>
      </form>
    </div>
  `;
}

async function compLoaded(productId) {
  const form = document.getElementById("editProductForm");
  const loadingIndicator = document.getElementById("productLoading");
  const backBtn = document.getElementById("backToList");

  // Setup back button
  backBtn.addEventListener("click", () => {
    const dashboardContent = document.querySelector(".dashboard-content");
    dashboardContent.innerHTML = ProductList();
    // No need for custom events that could cause infinite loading
  });

  try {
    // Fetch product data
    const productDoc = await getDoc(
      doc(App.firebase.db, "products", productId)
    );
    if (!productDoc.exists()) {
      throw new Error("Product not found");
    }

    const product = productDoc.data();

    // Fill form with product data
    form.productName.value = product.name;
    form.description.value = product.description;
    form.price.value = product.price;
    form.discount.value = product.discount || 0;
    form.category.value = product.category;
    form.brand.value = product.brand;
    form.gender.value = product.gender || "unisex";
    form.tags.value = product.tags?.join(", ") || "";

    // Setup colors with the product category
    setupColorSection(product.colors || [], product.category);

    // Show form and hide loading
    loadingIndicator.style.display = "none";
    form.style.display = "block";

    // Handle form submission
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      try {
        // Show loading dialog before starting the update
        document.body.insertAdjacentHTML(
          "beforeend",
          MessageDialog("Updating product...", "success", null, true)
        );

        const updatedProduct = {
          name: form.productName.value.trim(),
          description: form.description.value.trim(),
          price: parseFloat(form.price.value),
          discount: parseFloat(form.discount.value) || 0,
          brand: form.brand.value.trim(),
          gender: form.gender.value,
          tags: form.tags.value
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag),
          colors: getColorsData(),
        };

        await updateDoc(
          doc(App.firebase.db, "products", productId),
          updatedProduct
        );

        // Remove loading dialog
        document.getElementById("messageDialogOverlay")?.remove();

        // Show success dialog
        const dashboardContent = document.querySelector(".dashboard-content");

        // Append the success dialog to the body to make it a modal
        document.body.insertAdjacentHTML(
          "beforeend",
          MessageDialog("Product updated successfully!", "success", () => {
            // Return to product list after dialog is closed
            dashboardContent.innerHTML = ProductList();
          })
        );
      } catch (error) {
        console.error("Error updating product:", error);

        // Show error dialog instead of alert
        document.body.insertAdjacentHTML(
          "beforeend",
          MessageDialog(`Failed to update product: ${error.message}`, "error")
        );
      }
    });
  } catch (error) {
    console.error("Error:", error);
    loadingIndicator.textContent = "Error loading product: " + error.message;

    // Show error dialog
    document.body.insertAdjacentHTML(
      "beforeend",
      MessageDialog(`Error loading product: ${error.message}`, "error", () => {
        // Return to product list after dialog is closed
        const dashboardContent = document.querySelector(".dashboard-content");
        dashboardContent.innerHTML = ProductList();
      })
    );
  }
}

function setupColorSection(existingColors, category) {
  // Reuse color section code from AddProduct with pre-filled data
  const colorsContainer = document.getElementById("colorsContainer");
  const addColorBtn = document.getElementById("addColorBtn");

  // Add existing colors
  existingColors.forEach((color) => addColorSection(color, category));

  // Setup add new color functionality
  addColorBtn.addEventListener("click", () => addColorSection());
}

let colorCounter = 0;

function addColorSection(existingColor = null, category) {
  const colorId = `color-${colorCounter++}`;
  const colorSection = document.createElement("div");
  colorSection.className = "color-section";
  colorSection.dataset.colorId = colorId;

  colorSection.innerHTML = `
    <div class="color-header">
      <h4>Color Details</h4>
      <button type="button" class="remove-color-btn danger-button">Remove</button>
    </div>
    
    <label for="${colorId}-name">Color Name</label>
    <input type="text" id="${colorId}-name" name="${colorId}-name" required 
           placeholder="e.g., Red, Blue, Black" value="${
             existingColor?.name || ""
           }">
    
    <label for="${colorId}-hex">Color Hex Code</label>
    <div class="color-picker-container">
      <input type="text" id="${colorId}-hex" name="${colorId}-hex" 
             placeholder="#RRGGBB" pattern="^#([A-Fa-f0-9]{6})$" value="${
               existingColor?.hex || ""
             }">
      <input type="color" id="${colorId}-picker" class="color-picker" value="${
    existingColor?.hex || "#000000"
  }">
    </div>
    
    <div class="image-urls-section">
      <h5>Product Images (3 required)</h5>
      <div class="image-url-inputs">
        <div class="image-url-group">
          <label>Front Image</label>
          ${ImageUploader(
            `${colorId}-img1-file`,
            `${colorId}-img1-preview`,
            `${colorId}-img1-progress`,
            `${colorId}-img1-upload`,
            `${colorId}-img1-clear`
          )}
          <input type="hidden" id="${colorId}-img1" name="${colorId}-img1" required 
                 value="${existingColor?.image_urls?.[0] || ""}">
        </div>
        <div class="image-url-group">
          <label>Side Image</label>
          ${ImageUploader(
            `${colorId}-img2-file`,
            `${colorId}-img2-preview`,
            `${colorId}-img2-progress`,
            `${colorId}-img2-upload`,
            `${colorId}-img2-clear`
          )}
          <input type="hidden" id="${colorId}-img2" name="${colorId}-img2" required
                 value="${existingColor?.image_urls?.[1] || ""}">
        </div>
        <div class="image-url-group">
          <label>Back Image</label>
          ${ImageUploader(
            `${colorId}-img3-file`,
            `${colorId}-img3-preview`,
            `${colorId}-img3-progress`,
            `${colorId}-img3-upload`,
            `${colorId}-img3-clear`
          )}
          <input type="hidden" id="${colorId}-img3" name="${colorId}-img3" required
                 value="${existingColor?.image_urls?.[2] || ""}">
        </div>
      </div>
    </div>
    
    <div class="sizes-section">
      <div class="sizes-header">
        <h5>Available Sizes</h5>
        <button type="button" class="add-size-btn secondary-button">Add Size</button>
      </div>
      <div class="sizes-container" id="${colorId}-sizes">
        ${generateSizeRows(existingColor?.sizes, category)}
      </div>
    </div>
  `;

  colorsContainer.appendChild(colorSection);
  setupColorSectionEvents(colorSection);
}

// Function to get size options based on category
function getSizeOptionsByCategory(category) {
  if (!category) {
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

// Function to generate size rows with the appropriate options for the category
function generateSizeRows(existingSizes = {}, category) {
  const sizes = Object.entries(existingSizes);
  if (sizes.length === 0) {
    return `
      <div class="size-row">
        <select class="size-select" required>
          ${getSizeOptionsByCategory(category)}
        </select>
        <input type="number" class="stock-input" min="0" required placeholder="Stock" value="0">
        <button type="button" class="remove-size-btn danger-button">✕</button>
      </div>
    `;
  }

  return sizes
    .map(
      ([size, stock]) => `
    <div class="size-row">
      <select class="size-select" required>
        ${getSizeOptionsWithSelected(category, size)}
      </select>
      <input type="number" class="stock-input" min="0" required placeholder="Stock" value="${stock}">
      <button type="button" class="remove-size-btn danger-button">✕</button>
    </div>
  `
    )
    .join("");
}

// Helper function to generate size options with a selected value
function getSizeOptionsWithSelected(category, selectedSize) {
  const options = getSizeOptionsByCategory(category);
  // Replace the selected attribute in the option matching the selectedSize
  return options.replace(
    `value="${selectedSize}"`,
    `value="${selectedSize}" selected`
  );
}

// Add event delegation for dynamic elements
function setupColorSectionEvents(colorSection) {
  // Remove color section
  colorSection
    .querySelector(".remove-color-btn")
    .addEventListener("click", () => {
      colorSection.remove();
    });

  // Color picker integration
  const hexInput = colorSection.querySelector('input[type="text"][id$="-hex"]');
  const colorInput = colorSection.querySelector('input[type="color"]');

  hexInput.addEventListener("input", () => {
    colorInput.value = hexInput.value;
  });

  colorInput.addEventListener("input", () => {
    hexInput.value = colorInput.value;
  });

  // Setup image uploaders
  const colorId = colorSection.dataset.colorId;

  // Front image uploader
  setupImageUploader(
    `${colorId}-img1-file`,
    `${colorId}-img1-preview`,
    `${colorId}-img1-progress`,
    `${colorId}-img1-upload`,
    `${colorId}-img1-clear`,
    App.cloudinary.UPLOAD_PRESET,
    (url) => {
      document.getElementById(`${colorId}-img1`).value = url;

      // If there's a URL, set the preview image
      if (url) {
        const imgPreview = document.getElementById(`${colorId}-img1-preview`);
        imgPreview.src = url;
        imgPreview.style.display = "block";
      }
    }
  );

  // Side image uploader
  setupImageUploader(
    `${colorId}-img2-file`,
    `${colorId}-img2-preview`,
    `${colorId}-img2-progress`,
    `${colorId}-img2-upload`,
    `${colorId}-img2-clear`,
    App.cloudinary.UPLOAD_PRESET,
    (url) => {
      document.getElementById(`${colorId}-img2`).value = url;

      // If there's a URL, set the preview image
      if (url) {
        const imgPreview = document.getElementById(`${colorId}-img2-preview`);
        imgPreview.src = url;
        imgPreview.style.display = "block";
      }
    }
  );

  // Back image uploader
  setupImageUploader(
    `${colorId}-img3-file`,
    `${colorId}-img3-preview`,
    `${colorId}-img3-progress`,
    `${colorId}-img3-upload`,
    `${colorId}-img3-clear`,
    App.cloudinary.UPLOAD_PRESET,
    (url) => {
      document.getElementById(`${colorId}-img3`).value = url;

      // If there's a URL, set the preview image
      if (url) {
        const imgPreview = document.getElementById(`${colorId}-img3-preview`);
        imgPreview.src = url;
        imgPreview.style.display = "block";
      }
    }
  );

  // Initialize image previews if URLs exist
  const img1 = document.getElementById(`${colorId}-img1`).value;
  const img2 = document.getElementById(`${colorId}-img2`).value;
  const img3 = document.getElementById(`${colorId}-img3`).value;

  if (img1) {
    const preview1 = document.getElementById(`${colorId}-img1-preview`);
    preview1.src = img1;
    preview1.style.display = "block";
    document.getElementById(`${colorId}-img1-clear`).style.display =
      "inline-block";
    document.getElementById(`${colorId}-img1-upload`).style.display = "none";
  }

  if (img2) {
    const preview2 = document.getElementById(`${colorId}-img2-preview`);
    preview2.src = img2;
    preview2.style.display = "block";
    document.getElementById(`${colorId}-img2-clear`).style.display =
      "inline-block";
    document.getElementById(`${colorId}-img2-upload`).style.display = "none";
  }

  if (img3) {
    const preview3 = document.getElementById(`${colorId}-img3-preview`);
    preview3.src = img3;
    preview3.style.display = "block";
    document.getElementById(`${colorId}-img3-clear`).style.display =
      "inline-block";
    document.getElementById(`${colorId}-img3-upload`).style.display = "none";
  }

  // Add size functionality
  colorSection.querySelector(".add-size-btn").addEventListener("click", () => {
    const sizesContainer = colorSection.querySelector(".sizes-container");
    const sizeRow = document.createElement("div");
    sizeRow.className = "size-row";

    const category = document.getElementById("category").value;

    sizeRow.innerHTML = `
      <select class="size-select" required>
        ${getSizeOptionsByCategory(category)}
      </select>
      <input type="number" class="stock-input" min="0" required placeholder="Stock" value="0">
      <button type="button" class="remove-size-btn danger-button">✕</button>
    `;
    sizesContainer.appendChild(sizeRow);

    // Setup remove size button
    sizeRow.querySelector(".remove-size-btn").addEventListener("click", () => {
      sizeRow.remove();
    });
  });
}

// Function to collect color data from the form
function getColorsData() {
  const colors = [];
  document.querySelectorAll(".color-section").forEach((section) => {
    const colorId = section.dataset.colorId;

    const colorData = {
      name: document.getElementById(`${colorId}-name`).value,
      hex: document.getElementById(`${colorId}-hex`).value,
      image_urls: [
        document.getElementById(`${colorId}-img1`).value,
        document.getElementById(`${colorId}-img2`).value,
        document.getElementById(`${colorId}-img3`).value,
      ],
      sizes: {},
    };

    // Collect sizes data
    section.querySelectorAll(".size-row").forEach((row) => {
      const size = row.querySelector(".size-select").value;
      const stock = parseInt(row.querySelector(".stock-input").value);
      if (size && !isNaN(stock)) {
        colorData.sizes[size] = stock;
      }
    });

    colors.push(colorData);
  });

  return colors;
}
