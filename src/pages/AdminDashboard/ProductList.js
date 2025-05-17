import { observer } from "../../observer";
import { collection, getDocs } from "firebase/firestore";
const componentID = "ProductList";

export default function ProductList() {
  // Return the HTML first
  const html = /*html*/ `
    <div component="${componentID}" id="${componentID}">
      <h1>Product List Page</h1>
      <div id="products-container"></div>
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
    const querySnapshot = await getDocs(
      collection(App.firebase.db, "products")
    );

    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Fetched products:", products);

    // Find the container element
    const productsContainer = document.querySelector("#products-container");

    // Create HTML for products
    let productsHTML = '<div class="products-grid">';

    if (products.length === 0) {
      productsHTML = "<p>No products found</p>";
    } else {
      products.forEach((product) => {
        productsHTML += `
          <div class="product-card" data-id="${product.id}">
            <h3>${product.name || "Unnamed Product"}</h3>
            ${
              product.imageUrl
                ? `<img src="${product.imageUrl}" alt="${
                    product.name || "Product"
                  }">`
                : ""
            }
            <p class="price">${
              product.price ? `$${product.price}` : "Price not available"
            }</p>
            <p class="description">${
              product.description || "No description available"
            }</p>
            <button class="view-details-btn" data-id="${
              product.id
            }">View Details</button>
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
        const productId = e.target.getAttribute("data-id");
        console.log(`View details for product ${productId}`);
        // Add navigation logic here if needed
        // window.location.href = `/product/${productId}`;
      });
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    const productsContainer = document.querySelector("#products-container");
    if (productsContainer) {
      productsContainer.innerHTML =
        "<p>Error loading products. Please try again later.</p>";
    }
  }
};
