import { observer } from "../../observer";
import "./Shop.css";
import { collection, getDocs } from "firebase/firestore";
import productCard from "../../components/productCard/productCard";
const componentID = "shop";

export default function Shop() {
  observer(componentID, compLoaded);
  return /*html*/ `
    <div component="${componentID}" class="container my-5">
      <div class="row g-4">
        <div class="col-md-3">
          <div class="filter-sidebar p-4 rounded-4 bg-white shadow-sm">
            <h4 class="fw-bold mb-4">Filters</h4>
            
            <div class="filter-section mb-4">
              <h5 class="fs-5 fw-semibold mb-3">Colors</h5>
              <div id="color-filter-circles" class="color-circles-group"></div>
            </div>
            
            <div class="filter-section mb-4">
              <h5 class="fs-5 fw-semibold mb-3">Price</h5>
              <div class="price-slider double-range-slider position-relative">
                <input type="range" class="form-range custom-range" id="price-min" min="0" max="1000" step="10" value="0" oninput="updateDoubleRange()">
                <input type="range" class="form-range custom-range" id="price-max" min="0" max="1000" step="10" value="1000" oninput="updateDoubleRange()">
                <div class="d-flex justify-content-between mt-2">
                  <span class="price-value" id="price-min-value">$0</span>
                  <span class="price-value" id="price-max-value">$1000</span>
                </div>
              </div>
            </div>
            
            <div class="filter-section mb-4">
              <h5 class="fs-5 fw-semibold mb-3">Size</h5>
              <div class="size-buttons d-flex flex-wrap gap-2">
                <input type="checkbox" class="btn-check filter-size" id="size-xs" value="XS">
                <label class="btn btn-outline-dark rounded-pill px-3 py-1" for="size-xs">XS</label>
                
                <input type="checkbox" class="btn-check filter-size" id="size-s" value="S">
                <label class="btn btn-outline-dark rounded-pill px-3 py-1" for="size-s">S</label>
                
                <input type="checkbox" class="btn-check filter-size" id="size-m" value="M">
                <label class="btn btn-outline-dark rounded-pill px-3 py-1" for="size-m">M</label>
                
                <input type="checkbox" class="btn-check filter-size" id="size-l" value="L">
                <label class="btn btn-outline-dark rounded-pill px-3 py-1" for="size-l">L</label>
                
                <input type="checkbox" class="btn-check filter-size" id="size-xl" value="XL">
                <label class="btn btn-outline-dark rounded-pill px-3 py-1" for="size-xl">XL</label>
              </div>
            </div>
            
            <button id="apply-filters" class="btn btn-dark w-100 py-2 rounded-pill">Apply Filters</button>
          </div>
        </div>
        <div class="col-md-9">
          <h1 class="fw-bold mb-4">Shop Collection</h1>
          <div id="product-list" class="row">
          </div>
        </div>
      </div>
    </div>
  `;
}

const compLoaded = async () => {
  const productList = document.querySelector("#product-list");
  const colorFilterContainer = document.getElementById("color-filter-circles");
  let allColors = {};
  let allProducts = [];

  getDocs(collection(App.firebase.db, "products"))
    .then((querySnapshot) => {
      // Collect all products and colors
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        allProducts.push({ ...data, productID: doc.id });
        if (Array.isArray(data.colors)) {
          data.colors.forEach((color) => {
            if (color.name && color.hex) {
              allColors[color.name] = color.hex;
            }
          });
        }
      });

      // Render color filter circles
      if (colorFilterContainer) {
        colorFilterContainer.innerHTML = Object.entries(allColors)
          .map(
            ([name, hex]) => `
              <button class="color-circle-btn" title="${name}" data-color="${name}" style="background:${hex}"></button>
            `
          )
          .join("");
      }

      // Color selection logic
      let selectedColor = null;
      colorFilterContainer.querySelectorAll(".color-circle-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          colorFilterContainer.querySelectorAll(".color-circle-btn").forEach((b) => b.classList.remove("selected"));
          btn.classList.add("selected");
          selectedColor = btn.getAttribute("data-color");
        });
      });

      // Initial render of all products
      renderProducts(allProducts);

      // Add event listeners for filter functionality
      setupFilterEvents(allProducts);
    })
    .catch((error) => {
      console.log(error);
    });
};

function renderProducts(products) {
  const productList = document.querySelector("#product-list");
  productList.innerHTML = "";
  products.forEach((product) => {
    const renderCard = /*html*/ `
      <div class="col-md-4 mb-4">
        <a href="/product/${product.productID}" class="product-link" data-link>
          <div class="product-card minimal-card bg-white rounded-4 shadow-sm p-4 d-flex flex-column align-items-start h-100">
            <div class="w-100 d-flex justify-content-center mb-3">
              <img src="${product.colors[0].image_urls[0]}" class="product-image minimal-img rounded-3" alt="${product.name}">
            </div>
            <div class="w-100">
              <div class="fw-semibold fs-6 mb-1 text-dark">${product.name}</div>
              <div class="d-flex align-items-center mb-2 star-rating-minimal">
                <span class="text-warning me-1">
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star-half-alt"></i>
                  <i class="far fa-star"></i>
                </span>
                <span class="text-muted small">3.5/5</span>
              </div>
              <div class="fw-bold fs-4 text-dark mb-3">$${product.price}</div>
              <button class="btn btn-dark w-100 minimal-add-to-cart">Add to Cart</button>
            </div>
          </div>
        </a>
      </div>
    `;
    productList.innerHTML += renderCard;
  });
}

const setupFilterEvents = (allProducts) => {
  // Update price slider display
  window.updateDoubleRange = () => {
    const minValue = document.getElementById('price-min').value;
    const maxValue = document.getElementById('price-max').value;
    document.getElementById('price-min-value').textContent = `$${minValue}`;
    document.getElementById('price-max-value').textContent = `$${maxValue}`;
  };
  
  // Apply filters button
  const applyButton = document.getElementById('apply-filters');
  if (applyButton) {
    applyButton.addEventListener('click', () => {
      // Get selected color
      const selectedColorBtn = document.querySelector('.color-circle-btn.selected');
      const selectedColor = selectedColorBtn ? selectedColorBtn.getAttribute('data-color') : null;
      // Get selected sizes
      const selectedSizes = Array.from(document.querySelectorAll('.filter-size:checked')).map(el => el.value);
      // Get selected price
      const priceMin = parseInt(document.getElementById('price-min').value);
      const priceMax = parseInt(document.getElementById('price-max').value);
      // Filter products
      const filtered = allProducts.filter(product => {
        // Color filter
        let colorMatch = true;
        if (selectedColor) {
          colorMatch = product.colors.some(c => c.name === selectedColor);
        }
        // Size filter (OR logic, case-insensitive)
        let sizeMatch = true;
        if (selectedSizes.length > 0) {
          const productSizes = Array.isArray(product.sizes) ? product.sizes.map(s => s.toUpperCase()) : [];
          sizeMatch = selectedSizes.some(size => productSizes.includes(size.toUpperCase()));
        }
        // Price filter
        let priceMatch = true;
        if (!isNaN(priceMin) && !isNaN(priceMax)) {
          priceMatch = product.price >= priceMin && product.price <= priceMax;
        }
        return colorMatch && sizeMatch && priceMatch;
      });
      renderProducts(filtered);
    });
  }
};
