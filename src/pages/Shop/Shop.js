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
        <div class="col-lg-3 col-md-4">
          <div class="filter-sidebar">
            <h4 class="fw-bold mb-4">Filters</h4>
            
            <div class="filter-section">
              <h5>Category</h5>
              <div id="category-filter" class="category-buttons">
                <button class="btn btn-outline-dark rounded-pill category-btn active" data-category="">
                  All Categories
                </button>
                <!-- Dynamic category buttons will be inserted here -->
              </div>
            </div>
            
            <div class="filter-section">
              <h5>Colors</h5>
              <div id="color-filter-circles" class="color-circles-group"></div>
            </div>
            
            <div class="filter-section">
              <h5>Price</h5>
              <div class="price-slider">
                <input type="range" class="form-range custom-range" id="price-range" min="0" max="1000" step="1" value="1000">
                <div class="d-flex justify-content-between mt-3 align-items-center">
                  <span class="price-value" id="price-range-min">$0</span>
                  <span class="text-muted" style="font-size:1rem;">to</span>
                  <span class="price-value" id="price-range-max">$1000</span>
                </div>
              </div>
            </div>
            
            <div class="filter-section">
              <h5>Size</h5>
              <div class="size-buttons">
                <!-- Dynamic size buttons will be inserted here -->
              </div>
            </div>
            
            <div class="filter-buttons">
              <button id="clear-filters" class="btn btn-outline-dark rounded-pill">Clear</button>
              <button id="apply-filters" class="btn btn-dark rounded-pill">Apply</button>
            </div>
          </div>
        </div>
        <div class="col-lg-9 col-md-8">
          <h1 class="fw-bold mb-4">Shop Collection</h1>
          <div id="product-list" class="row">
            ${renderProductPlaceholders(6)}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderProductPlaceholders(count) {
  let placeholders = '';
  for (let i = 0; i < count; i++) {
    placeholders += /*html*/ `
      <div class="col-md-4 mb-4">
        <div class="product-card minimal-card skeleton">
          <div class="w-100 d-flex justify-content-center mb-3 position-relative">
            <div class="skeleton-img"></div>
          </div>
          <div class="w-100">
            <div class="skeleton-text" style="width: 80%; height: 24px; margin-bottom: 8px;"></div>
            <div class="skeleton-text" style="width: 60%; height: 20px; margin-bottom: 12px;"></div>
            <div class="skeleton-text" style="width: 40%; height: 24px; margin-bottom: 12px;"></div>
            <div class="skeleton-text" style="width: 70%; height: 36px; margin-bottom: 8px;"></div>
            <div class="skeleton-text" style="width: 100%; height: 40px;"></div>
          </div>
        </div>
      </div>
    `;
  }
  return placeholders;
}

const compLoaded = async () => {
  const productList = document.querySelector("#product-list");
  const colorFilterContainer = document.getElementById("color-filter-circles");
  let allColors = {};
  let allProducts = [];
  let allCategories = new Set();
  let selectedColor = null;

  // Show loading state
  productList.innerHTML = renderProductPlaceholders(6);

  getDocs(collection(App.firebase.db, "products"))
    .then((querySnapshot) => {
      // Collect all products, colors, and sizes
      let prices = [];
      let allSizesOrdered = [];
      let allSizesSeen = new Set();
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        allProducts.push({ ...data, productID: doc.id });
        if (Array.isArray(data.colors)) {
          data.colors.forEach((color) => {
            if (color.name && color.hex) {
              allColors[color.name] = color.hex;
            }
            // Collect sizes from each color's sizes object
            if (color.sizes && typeof color.sizes === 'object') {
              Object.keys(color.sizes).forEach(size => {
                if (!allSizesSeen.has(size)) {
                  allSizesOrdered.push(size);
                  allSizesSeen.add(size);
                }
              });
            }
          });
        }
        if (typeof data.price === 'number') {
          prices.push(data.price);
        }
        if (data.category) {
          allCategories.add(data.category);
        }
      });

      // Set dynamic price range
      const minPrice = prices.length ? Math.min(...prices) : 0;
      const maxPrice = prices.length ? Math.max(...prices) : 1000;
      const priceRangeInput = document.getElementById('price-range');
      if (priceRangeInput) {
        priceRangeInput.min = minPrice;
        priceRangeInput.max = maxPrice;
        priceRangeInput.value = maxPrice;
        document.getElementById('price-range-min').textContent = `$${minPrice}`;
        document.getElementById('price-range-max').textContent = `$${maxPrice}`;
      }

      // Render dynamic size filter
      const sizeButtonsContainer = document.querySelector('.size-buttons');
      if (sizeButtonsContainer) {
        // Use the order and case as they appear in the data
        sizeButtonsContainer.innerHTML = allSizesOrdered.map(size => `
          <input type="checkbox" class="btn-check filter-size" id="size-${size}" value="${size}">
          <label class="btn btn-outline-dark rounded-pill px-3 py-1" for="size-${size}">${size}</label>
        `).join('');

        // Add change event listeners to size checkboxes
        sizeButtonsContainer.querySelectorAll('.filter-size').forEach(checkbox => {
          checkbox.addEventListener('change', () => {
            // Trigger filter apply when size selection changes
            document.getElementById('apply-filters').click();
          });
        });
      }

      // Render color filter circles
      if (colorFilterContainer) {
        colorFilterContainer.innerHTML = Object.entries(allColors)
          .map(
            ([name, hex]) => `
              <button class="color-circle-btn" title="${name}" data-color="${name}" style="background:${hex}; position:relative;">
                <span class="color-checkmark">&#10003;</span>
              </button>
            `
          )
          .join("");
      }

      // Color selection logic
      colorFilterContainer.querySelectorAll(".color-circle-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const isSelected = btn.classList.contains("selected");
          // Deselect all
          colorFilterContainer.querySelectorAll(".color-circle-btn").forEach((b) => b.classList.remove("selected"));
          if (!isSelected) {
            // Select this if it was not already selected
            btn.classList.add("selected");
            selectedColor = btn.getAttribute("data-color");
          } else {
            // Unselect if it was already selected
            selectedColor = null;
          }
          // Trigger filter apply when color is selected/deselected
          document.getElementById('apply-filters').click();
        });
      });

      // Initial render of all products
      renderProducts(allProducts);

      // Populate category filter buttons
      const categoryFilter = document.getElementById("category-filter");
      if (categoryFilter) {
        const categoryButtons = Array.from(allCategories).map(cat => `
          <button class="btn btn-outline-dark rounded-pill px-3 py-2 category-btn" data-category="${cat}">
            ${cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        `).join('');
        
        // Insert after the "All Categories" button
        const allCategoriesBtn = categoryFilter.querySelector('.category-btn[data-category=""]');
        if (allCategoriesBtn) {
          allCategoriesBtn.insertAdjacentHTML('afterend', categoryButtons);
        }

        // Add click handlers for category buttons
        categoryFilter.querySelectorAll('.category-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryFilter.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            // Trigger filter apply
            document.getElementById('apply-filters').click();
          });
        });
      }

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
          <div class="product-card minimal-card">
            <div class="w-100 d-flex justify-content-center mb-3 position-relative">
              ${product.discount ? `
                <div class="discount-badge">-${product.discount}%</div>
              ` : ''}
              <img src="${product.colors[0].image_urls[0]}" class="minimal-img" alt="${product.name}">
            </div>
            <div class="w-100">
              <div class="product-name">${product.name}</div>
              <div class="star-rating-minimal">
                <span class="text-warning">
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star-half-alt"></i>
                  <i class="far fa-star"></i>
                </span>
                <span class="rating-text">3.5/5</span>
              </div>
              <div class="price-container">
                ${product.discount ? `
                  <div class="original-price">$${product.price}</div>
                  <div class="discounted-price">$${Math.round(product.price * (1 - product.discount/100))}</div>
                ` : `
                  <div class="regular-price">$${product.price}</div>
                `}
              </div>
              <div class="color-dots-container">
                ${product.colors.map(color => `
                  <span class="color-dot" title="${color.name}" style="background:${color.hex};"></span>
                `).join('')}
              </div>
              <button class="minimal-add-to-cart">Add to Cart</button>
            </div>
          </div>
        </a>
      </div>
    `;
    productList.innerHTML += renderCard;
  });
}

const setupFilterEvents = (allProducts) => {
  // Update price slider display and trigger filter
  window.updatePriceRange = () => {
    const rangeInput = document.getElementById('price-range');
    const min = parseInt(rangeInput.min);
    const max = parseInt(rangeInput.max);
    const value = parseInt(rangeInput.value);
    
    // Update display values
    document.getElementById('price-range-min').textContent = `$${min}`;
    document.getElementById('price-range-max').textContent = `$${value}`;
    
    // Trigger filter apply when price changes
    document.getElementById('apply-filters').click();
  };
  
  // Add input event listener to price range slider
  const priceRangeInput = document.getElementById('price-range');
  if (priceRangeInput) {
    priceRangeInput.addEventListener('input', updatePriceRange);
  }
  
  // Clear filters button
  const clearButton = document.getElementById('clear-filters');
  if (clearButton) {
    clearButton.addEventListener('click', () => {
      // Clear color selection
      document.querySelectorAll('.color-circle-btn').forEach(btn => btn.classList.remove('selected'));
      
      // Reset price range to max
      const priceRangeInput = document.getElementById('price-range');
      if (priceRangeInput) {
        const maxPrice = parseInt(priceRangeInput.max);
        priceRangeInput.value = maxPrice;
        document.getElementById('price-range-min').textContent = `$${priceRangeInput.min}`;
        document.getElementById('price-range-max').textContent = `$${maxPrice}`;
      }
      
      // Clear size selections
      document.querySelectorAll('.filter-size').forEach(checkbox => checkbox.checked = false);
      
      // Reset category selection
      const categoryFilter = document.getElementById('category-filter');
      if (categoryFilter) {
        categoryFilter.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        categoryFilter.querySelector('.category-btn[data-category=""]').classList.add('active');
      }
      
      // Re-render all products
      renderProducts(allProducts);
    });
  }
  
  // Apply filters button
  const applyButton = document.getElementById('apply-filters');
  if (applyButton) {
    applyButton.addEventListener('click', () => {
      // Get selected color
      const selectedColorBtn = document.querySelector('.color-circle-btn.selected');
      const currentSelectedColor = selectedColorBtn ? selectedColorBtn.getAttribute('data-color') : null;
      
      // Get selected sizes
      const selectedSizes = Array.from(document.querySelectorAll('.filter-size:checked')).map(el => el.value);
      
      // Get selected price
      const priceRangeInput = document.getElementById('price-range');
      const priceMax = parseInt(priceRangeInput.value);
      
      // Get selected category
      const selectedCategory = document.querySelector('.category-btn.active')?.getAttribute('data-category') || '';

      const isDefaultFilters =
        !currentSelectedColor &&
        selectedSizes.length === 0 &&
        (isNaN(priceMax) || priceMax === parseInt(priceRangeInput.max)) &&
        (!selectedCategory || selectedCategory === "");

      if (isDefaultFilters) {
        renderProducts(allProducts);
        return;
      }

      // Filter products
      const filtered = allProducts.filter(product => {
        // Color filter
        let colorMatch = true;
        if (currentSelectedColor) {
          colorMatch = product.colors.some(c => c.name.toLowerCase() === currentSelectedColor.toLowerCase());
        }

        // Size filter
        let sizeMatch = true;
        if (selectedSizes.length > 0) {
          sizeMatch = false;
          // Check if any color has any of the selected sizes in stock (original case)
          for (const color of product.colors) {
            if (color.sizes && typeof color.sizes === 'object') {
              const hasSizeInStock = selectedSizes.some(size => {
                return color.sizes[size] && color.sizes[size] > 0;
              });
              if (hasSizeInStock) {
                sizeMatch = true;
                break;
              }
            }
          }
        }

        // Price filter
        let priceMatch = true;
        if (!isNaN(priceMax)) {
          const finalPrice = product.discount 
            ? Math.round(product.price * (1 - product.discount/100))
            : product.price;
          priceMatch = finalPrice <= priceMax;
        }

        // Category filter
        let categoryMatch = true;
        if (selectedCategory && selectedCategory !== "") {
          categoryMatch = (product.category || "").toLowerCase() === selectedCategory.toLowerCase();
        }

        return colorMatch && sizeMatch && priceMatch && categoryMatch;
      });

      renderProducts(filtered);
    });
  }
};
