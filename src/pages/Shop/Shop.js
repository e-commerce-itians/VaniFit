import { observer } from "../../observer";
import "./Shop.css";
import { collection, getDocs } from "firebase/firestore";
import productCard from "../../components/productCard/productCard";
const componentID = "shop";

// Add these variables at the top of the file, after the imports
const ITEMS_PER_PAGE = 9;
let currentPage = 1;
let filteredProducts = [];

export default function Shop({ gender, page }) {
  observer(componentID, () => {
    compLoaded(gender, page);
  });
  return /*html*/ `
    <div component="${componentID}" class="container my-5">
      <div class="row g-4">
        <div class="col-lg-3 col-md-4">
          <div class="filter-sidebar">
            <h4 class="fw-bold mb-4">Filters</h4>
            
            <div class="filter-section">
              <h5>Gender</h5>
              <div id="gender-filter" class="category-buttons">
                <button class="btn btn-outline-dark rounded-pill gender-btn active" data-gender="">All</button>
                <button class="btn btn-outline-dark rounded-pill gender-btn" data-gender="male">Men</button>
                <button class="btn btn-outline-dark rounded-pill gender-btn" data-gender="female">Women</button>
                <button class="btn btn-outline-dark rounded-pill gender-btn" data-gender="children">Children</button>
                <button class="btn btn-outline-dark rounded-pill gender-btn" data-gender="unisex">Unisex</button>
              </div>
            </div>

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
              <button id="clear-filters" class="btn btn-outline-dark rounded-pill w-100">Clear Filters</button>
              <button id="apply-filters" class="d-none">Apply Filters</button>
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

// Store products in module scope so they're accessible to all functions
let allProducts = [];

function renderProductPlaceholders(count) {
  let placeholders = "";
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

const compLoaded = async (gender, page) => {
  // Reset products array when component loads
  allProducts = [];
  filteredProducts = [];

  // Get initial page from URL
  currentPage = parseInt(page) || 1;

  const productList = document.querySelector("#product-list");
  const colorFilterContainer = document.getElementById("color-filter-circles");
  let allColors = {};
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
            if (color.sizes && typeof color.sizes === "object") {
              Object.keys(color.sizes).forEach((size) => {
                if (!allSizesSeen.has(size)) {
                  allSizesOrdered.push(size);
                  allSizesSeen.add(size);
                }
              });
            }
          });
        }
        if (typeof data.price === "number") {
          prices.push(data.price);
        }
        if (data.category) {
          allCategories.add(data.category);
        }
      });

      // Set dynamic price range
      const minPrice = prices.length ? Math.min(...prices) : 0;
      const maxPrice = prices.length ? Math.max(...prices) : 1000;
      const priceRangeInput = document.getElementById("price-range");
      if (priceRangeInput) {
        priceRangeInput.min = minPrice;
        priceRangeInput.max = maxPrice;
        priceRangeInput.value = maxPrice;
        document.getElementById("price-range-min").textContent = `$${minPrice}`;
        document.getElementById("price-range-max").textContent = `$${maxPrice}`;
      }

      // Render dynamic size filter
      const sizeButtonsContainer = document.querySelector(".size-buttons");
      if (sizeButtonsContainer) {
        // Use the order and case as they appear in the data
        sizeButtonsContainer.innerHTML = allSizesOrdered
          .map(
            (size) => `
          <input type="checkbox" class="btn-check filter-size" id="size-${size}" value="${size}">
          <label class="btn btn-outline-dark rounded-pill px-3 py-1" for="size-${size}">${size}</label>
        `
          )
          .join("");

        // Add change event listeners to size checkboxes
        sizeButtonsContainer
          .querySelectorAll(".filter-size")
          .forEach((checkbox) => {
            checkbox.addEventListener("change", () => {
              // Trigger filter apply when size selection changes
              const applyFiltersBtn = document.getElementById("apply-filters");
              if (applyFiltersBtn) {
                applyFiltersBtn.click();
              } else {
                applyFilters(); // Direct call if button doesn't exist
              }
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
      colorFilterContainer
        .querySelectorAll(".color-circle-btn")
        .forEach((btn) => {
          btn.addEventListener("click", function () {
            const isSelected = btn.classList.contains("selected");
            // Deselect all
            colorFilterContainer
              .querySelectorAll(".color-circle-btn")
              .forEach((b) => b.classList.remove("selected"));
            if (!isSelected) {
              // Select this if it was not already selected
              btn.classList.add("selected");
              selectedColor = btn.getAttribute("data-color");
            } else {
              // Unselect if it was already selected
              selectedColor = null;
            }
            // Trigger filter apply when color is selected/deselected
            const applyFiltersBtn = document.getElementById("apply-filters");
            if (applyFiltersBtn) {
              applyFiltersBtn.click();
            } else {
              applyFilters(); // Direct call if button doesn't exist
            }
          });
        });

      // Populate category filter buttons
      const categoryFilter = document.getElementById("category-filter");
      if (categoryFilter) {
        const categoryButtons = Array.from(allCategories)
          .map(
            (cat) => `
          <button class="btn btn-outline-dark rounded-pill px-3 py-2 category-btn" data-category="${cat}">
            ${cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        `
          )
          .join("");

        // Insert after the "All Categories" button
        const allCategoriesBtn = categoryFilter.querySelector(
          '.category-btn[data-category=""]'
        );
        if (allCategoriesBtn) {
          allCategoriesBtn.insertAdjacentHTML("afterend", categoryButtons);
        }

        // Add click handlers for category buttons
        categoryFilter.querySelectorAll(".category-btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            // Remove active class from all buttons
            categoryFilter
              .querySelectorAll(".category-btn")
              .forEach((b) => b.classList.remove("active"));
            // Add active class to clicked button
            btn.classList.add("active");
            // Apply filters immediately
            applyFilters();
          });
        });
      }

      // Add event listeners for filter functionality
      setupFilterEvents();

      // Check URL parameters and apply initial filters after all setup is done
      const genderFromURL = gender;
      if (genderFromURL) {
        // Set active gender button
        document.querySelectorAll(".gender-btn").forEach((btn) => {
          if (btn.dataset.gender === genderFromURL) {
            btn.classList.add("active");
          } else {
            btn.classList.remove("active");
          }
        });
        // Apply filters for initial gender parameter
        applyFilters();
      } else {
        // Only render all products if no gender filter
        renderProducts(allProducts);
      }

      // Add popstate event listener for browser back/forward navigation
      window.addEventListener("popstate", () => {
        s;
        currentPage = parseInt(page) || 1;
        applyFilters(); // This will re-render with the correct page
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

function renderProducts(products) {
  const productList = document.querySelector("#product-list");
  productList.innerHTML = "";

  // Store filtered products for pagination
  filteredProducts = products;

  // Calculate pagination
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, endIndex);

  // Render current page products
  currentProducts.forEach((product) => {
    const renderCard = /*html*/ `
      <div class="col-md-4 mb-4">
        <a href="/product/${product.productID}" class="product-link" data-link>
          <div class="product-card minimal-card">
            <div class="minimal-img">
              ${
                product.discount
                  ? `
                <div class="discount-badge">-${product.discount}%</div>
              `
                  : ""
              }
              <img src="${product.colors[0].image_urls[0]}" alt="${
      product.name
    }">
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
                ${
                  product.discount
                    ? `
                  <div class="original-price">$${product.price}</div>
                  <div class="discounted-price">$${Math.round(
                    product.price * (1 - product.discount / 100)
                  )}</div>
                `
                    : `
                  <div class="regular-price">$${product.price}</div>
                `
                }
              </div>
              <div class="color-dots-container">
                ${product.colors
                  .map(
                    (color) => `
                  <span class="color-dot" title="${color.name}" style="background:${color.hex};"></span>
                `
                  )
                  .join("")}
              </div>
              <button class="minimal-add-to-cart">Add to Cart</button>
            </div>
          </div>
        </a>
      </div>
    `;
    productList.innerHTML += renderCard;
  });

  // Render pagination
  renderPagination(totalPages);
}

// Add the renderPagination function
function renderPagination(totalPages) {
  const paginationContainer = document.createElement("div");
  paginationContainer.className = "pagination-container";

  // Previous button
  const prevButton = document.createElement("button");
  prevButton.className = "pagination-btn";
  prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
  prevButton.disabled = currentPage === 1;
  prevButton.onclick = () => changePage(currentPage - 1);

  // First page button
  const firstPageButton = document.createElement("button");
  firstPageButton.className = "pagination-btn";
  firstPageButton.textContent = "1";
  firstPageButton.classList.toggle("active", currentPage === 1);
  firstPageButton.onclick = () => changePage(1);

  // Add dots if needed
  const addDots = () => {
    const dots = document.createElement("span");
    dots.className = "pagination-dots";
    dots.textContent = "...";
    return dots;
  };

  // Page numbers
  const pageButtons = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  if (startPage > 1) {
    pageButtons.push(addDots());
  }

  for (let i = startPage; i <= endPage; i++) {
    if (i === 1) continue; // Skip 1 as it's handled separately
    const pageButton = document.createElement("button");
    pageButton.className = "pagination-btn";
    pageButton.textContent = i;
    pageButton.classList.toggle("active", currentPage === i);
    pageButton.onclick = () => changePage(i);
    pageButtons.push(pageButton);
  }

  if (endPage < totalPages) {
    pageButtons.push(addDots());
  }

  // Last page button
  const lastPageButton = document.createElement("button");
  lastPageButton.className = "pagination-btn";
  lastPageButton.textContent = totalPages;
  lastPageButton.classList.toggle("active", currentPage === totalPages);
  lastPageButton.onclick = () => changePage(totalPages);

  // Next button
  const nextButton = document.createElement("button");
  nextButton.className = "pagination-btn";
  nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
  nextButton.disabled = currentPage === totalPages;
  nextButton.onclick = () => changePage(currentPage + 1);

  // Page info
  const pageInfo = document.createElement("span");
  pageInfo.className = "pagination-info";
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(
    currentPage * ITEMS_PER_PAGE,
    filteredProducts.length
  );
  pageInfo.textContent = `Showing ${startItem}-${endItem} of ${filteredProducts.length} items`;

  // Assemble pagination
  paginationContainer.appendChild(prevButton);
  if (totalPages > 1) {
    paginationContainer.appendChild(firstPageButton);
    pageButtons.forEach((button) => paginationContainer.appendChild(button));
    if (totalPages > 1) {
      paginationContainer.appendChild(lastPageButton);
    }
  }
  paginationContainer.appendChild(nextButton);
  paginationContainer.appendChild(pageInfo);

  // Add pagination to the page
  const productList = document.querySelector("#product-list");
  productList.parentElement.appendChild(paginationContainer);
}

// Add the changePage function
function changePage(newPage) {
  if (
    newPage < 1 ||
    newPage > Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  )
    return;

  currentPage = newPage;

  // Update URL without reloading the page
  const url = new URL(window.location.href);
  url.searchParams.set("page", currentPage);
  window.history.pushState({}, "", url);

  // Re-render products with new page
  renderProducts(filteredProducts);

  // Scroll to top of product list
  document
    .querySelector("#product-list")
    .scrollIntoView({ behavior: "smooth" });
}

const applyFilters = () => {
  // Reset to page 1 when filters change
  currentPage = 1;

  // Get selected color
  const selectedColorBtn = document.querySelector(".color-circle-btn.selected");
  const currentSelectedColor = selectedColorBtn
    ? selectedColorBtn.getAttribute("data-color")
    : null;

  // Get selected sizes
  const selectedSizes = Array.from(
    document.querySelectorAll(".filter-size:checked")
  ).map((el) => el.value);

  // Get selected price
  const priceRangeInput = document.getElementById("price-range");
  const priceMax = parseInt(priceRangeInput.value);

  // Get selected category
  const selectedCategory =
    document
      .querySelector(".category-btn.active")
      ?.getAttribute("data-category") || "";

  // Get selected gender
  const selectedGender =
    document.querySelector(".gender-btn.active")?.getAttribute("data-gender") ||
    "";

  const isDefaultFilters =
    !currentSelectedColor &&
    selectedSizes.length === 0 &&
    (isNaN(priceMax) || priceMax === parseInt(priceRangeInput.max)) &&
    (!selectedCategory || selectedCategory === "") &&
    (!selectedGender || selectedGender === "");

  if (isDefaultFilters) {
    renderProducts(allProducts);
    return;
  }

  // Filter products
  const filtered = allProducts.filter((product) => {
    // Gender filter
    let genderMatch = true;
    if (selectedGender) {
      genderMatch = product.gender === selectedGender;
    }

    // Color filter
    let colorMatch = true;
    if (currentSelectedColor) {
      colorMatch = product.colors.some(
        (c) => c.name.toLowerCase() === currentSelectedColor.toLowerCase()
      );
    }

    // Size filter
    let sizeMatch = true;
    if (selectedSizes.length > 0) {
      sizeMatch = false;
      for (const color of product.colors) {
        if (color.sizes && typeof color.sizes === "object") {
          const hasSizeInStock = selectedSizes.some((size) => {
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
        ? Math.round(product.price * (1 - product.discount / 100))
        : product.price;
      priceMatch = finalPrice <= priceMax;
    }

    // Category filter
    let categoryMatch = true;
    if (selectedCategory && selectedCategory !== "") {
      categoryMatch =
        (product.category || "").toLowerCase() ===
        selectedCategory.toLowerCase();
    }

    return (
      colorMatch && sizeMatch && priceMatch && categoryMatch && genderMatch
    );
  });

  renderProducts(filtered);
};

const setupFilterEvents = () => {
  // Add event listeners for gender buttons
  document.querySelectorAll(".gender-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".gender-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Get filter values
      applyFilters();
    });
  });

  // Update price slider display and trigger filter
  window.updatePriceRange = () => {
    const rangeInput = document.getElementById("price-range");
    const min = parseInt(rangeInput.min);
    const max = parseInt(rangeInput.max);
    const value = parseInt(rangeInput.value);

    // Update display values
    document.getElementById("price-range-min").textContent = `$${min}`;
    document.getElementById("price-range-max").textContent = `$${value}`;

    // Apply filters immediately
    applyFilters();
  };

  // Add input event listener to price range slider
  const priceRangeInput = document.getElementById("price-range");
  if (priceRangeInput) {
    priceRangeInput.addEventListener("input", updatePriceRange);
  }

  // Clear filters button
  const clearButton = document.getElementById("clear-filters");
  if (clearButton) {
    clearButton.addEventListener("click", () => {
      // Clear color selection
      document
        .querySelectorAll(".color-circle-btn")
        .forEach((btn) => btn.classList.remove("selected"));

      // Reset price range to max
      const priceRangeInput = document.getElementById("price-range");
      if (priceRangeInput) {
        const maxPrice = parseInt(priceRangeInput.max);
        priceRangeInput.value = maxPrice;
        document.getElementById(
          "price-range-min"
        ).textContent = `$${priceRangeInput.min}`;
        document.getElementById("price-range-max").textContent = `$${maxPrice}`;
      }

      // Clear size selections
      document
        .querySelectorAll(".filter-size")
        .forEach((checkbox) => (checkbox.checked = false));

      // Reset category selection
      const categoryFilter = document.getElementById("category-filter");
      if (categoryFilter) {
        categoryFilter
          .querySelectorAll(".category-btn")
          .forEach((btn) => btn.classList.remove("active"));
        categoryFilter
          .querySelector('.category-btn[data-category=""]')
          .classList.add("active");
      }

      // Re-render all products
      renderProducts(allProducts);
    });
  }

  // Apply filters button
  const applyButton = document.getElementById("apply-filters");
  if (applyButton) {
    applyButton.addEventListener("click", applyFilters);
  }
};
