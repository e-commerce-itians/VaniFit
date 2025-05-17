import { observer } from "../../observer";
import { collection, getDocs } from "firebase/firestore";
import "./ProductList.css";
import EditProduct from "./EditProduct";
const componentID = "ProductList";

export default function ProductList() {
  // Return the HTML first
  const html = /*html*/ `
    <div component="${componentID}" id="${componentID}">
      <div class="product-controls">
        <div class="search-container">
          <input type="text" id="product-search" placeholder="Search products...">
          <button id="search-button">
            <i class="fas fa-search"></i>
          </button>
        </div>
        <button id="refresh-button" class="refresh-btn">
          <i class="fas fa-sync-alt"></i> Refresh
        </button>
      </div>
      <div id="products-container" class="products-container">
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    </div>
  `;

  // Set up the observer after returning the HTML
  setTimeout(() => {
    observer(componentID, compLoaded);
  }, 0);

  return html;
}

//Javascript code to be executed once the component is loaded
const compLoaded = async () => {
  try {
    // Set up search functionality
    const searchInput = document.getElementById("product-search");
    const searchButton = document.getElementById("search-button");

    if (searchButton) {
      searchButton.addEventListener("click", () => {
        if (searchInput) {
          performSearch(searchInput.value);
        }
      });
    }

    if (searchInput) {
      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          performSearch(searchInput.value);
        }
      });
    }

    // Set up refresh button
    const refreshButton = document.getElementById("refresh-button");
    if (refreshButton) {
      refreshButton.addEventListener("click", () => {
        fetchProducts();
      });
    }

    // Initial product fetch
    await fetchProducts();
  } catch (error) {
    console.error("Error initializing ProductList:", error);
    const productsContainer = document.querySelector("#products-container");
    if (productsContainer) {
      productsContainer.innerHTML = `
        <div class="error-message">
          <p>Error initializing products. Please try again later.</p>
        </div>
      `;
    }
  }
};

// Function to fetch products
const fetchProducts = async (searchTerm = "") => {
  const productsContainer = document.querySelector("#products-container");

  if (!productsContainer) {
    console.error("Products container not found");
    return;
  }

  // Show loading spinner
  productsContainer.innerHTML = `
    <div class="loading-spinner">
      <div class="spinner"></div>
      <p>Loading products...</p>
    </div>
  `;

  try {
    const querySnapshot = await getDocs(
      collection(App.firebase.db, "products")
    );

    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Fetched products:", products);

    // Filter products if search term is provided
    const filteredProducts = searchTerm
      ? products.filter(
          (product) =>
            product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase())
        )
      : products;

    // Create HTML for products
    let productsHTML = "";

    if (filteredProducts.length === 0) {
      productsHTML = `
        <div class="no-products">
          <i class="fas fa-box-open" style="font-size: 36px; margin-bottom: 15px;"></i>
          <p>${
            searchTerm
              ? "No products matching your search."
              : "No products found."
          }</p>
        </div>
      `;
    } else {
      productsHTML = '<div class="products-grid">';
      filteredProducts.forEach((product) => {
        productsHTML += `
          <div class="product-card" data-id="${product.id}">
            <h3>${product.name || "Unnamed Product"}</h3>
            ${
              product.imageUrl
                ? `<img src="${product.imageUrl}" alt="${
                    product.name || "Product"
                  }">`
                : `<div class="placeholder-image" style="height: 180px; background: #f0f0f0; display: flex; align-items: center; justify-content: center;">
                     <i class="fas fa-image" style="font-size: 36px; color: #aaa;"></i>
                   </div>`
            }
            <p class="price">${
              product.price ? `$${product.price}` : "Price not available"
            }</p>
            <p class="description">${
              product.description || "No description available"
            }</p>
            <div class="card-actions">
              <button class="edit-product-btn" data-id="${product.id}">
                <i class="fas fa-edit"></i> Edit
              </button>
              <button class="delete-product-btn" data-id="${product.id}">
                <i class="fa-solid fa-trash"></i> Delete
              </button>
            </div>
          </div>
        `;
      });
      productsHTML += "</div>";
    }

    // Set the HTML content
    productsContainer.innerHTML = productsHTML;

    // Add event listeners to the buttons
    document.querySelectorAll(".view-details-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const productId = e.target.closest("button").getAttribute("data-id");
        console.log(`View details for product ${productId}`);
        // Navigation logic here
      });
    });

    // Add event listeners to edit buttons
    document.querySelectorAll(".edit-product-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const productId = e.target.closest("button").getAttribute("data-id");
        console.log(`Edit product ${productId}`);
        // Call EditProduct component with the product ID
        loadEditProduct(productId);
      });
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    productsContainer.innerHTML = `
      <div class="error-message">
        <p>Error loading products. Please try again later.</p>
        <p><small>${error.message}</small></p>
      </div>
    `;
  }
};

// Function to perform product search
const performSearch = (searchTerm) => {
  console.log("Searching for:", searchTerm);
  fetchProducts(searchTerm);
};

// Function to load the EditProduct component
const loadEditProduct = (productId) => {
  // This function should navigate to the EditProduct component/page
  // and pass the productId as a parameter
  console.log("Loading EditProduct with product ID:", productId);

  // Example implementation:
  // If using a router:
  EditProduct(productId);

  // Or if using a component-based approach:
  // const contentContainer = document.getElementById("content-container");
  // contentContainer.innerHTML = EditProduct(productId);
};
