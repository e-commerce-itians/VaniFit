import { observer } from "../../observer";
import "./Shop.css";
import { collection, getDocs } from "firebase/firestore";
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

            <div class="text-end">
              <span class="rounded-pill border bg-light-subtle d-inline d-md-none m-2 text-end" id="filterToggleBtn">
                  <i class="fas fa-filter"></i>
              </span>
            </div>
            <div class="d-none d-md-block" id="filterSideBar">
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

  // Sync currentPage with URL on load
  const urlParams = new URLSearchParams(window.location.search);
  currentPage = parseInt(urlParams.get("page")) || 1;

  const productList = document.querySelector("#product-list");
  const colorFilterContainer = document.getElementById("color-filter-circles");
  let allColors = {};
  let allCategories = new Set();
  let selectedColor = null;

  // Toggle
  const filterSideBar = document.querySelector("#filterSideBar");
  document.querySelector("#filterToggleBtn").addEventListener("click", () => {
    filterSideBar.classList.toggle("d-none");
  });

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
        const urlParams = new URLSearchParams(window.location.search);
        currentPage = parseInt(urlParams.get("page")) || 1;
        applyFilters();
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

const renderProducts = (products) => {
  const productList = document.querySelector("#product-list");
  productList.innerHTML = "";

  // Filter based on brand and style
  // Look for filter by style or brand name
  let styleValue = null;
  let brandValue = null;
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  // Get the query parameters
  const searchParams = url.searchParams;
  if (searchParams.has("style")) {
    styleValue = searchParams.get("style");
  }
  if (searchParams.has("brand")) {
    brandValue = searchParams.get("brand");
  }

  // Store filtered products for pagination
  if (styleValue || brandValue) {
    filteredProducts = allProducts.filter((product) => {
      // Brand filter
      let brandMatch = true;
      if (brandValue) {
        brandMatch = product.brand?.toLowerCase() === brandValue.toLowerCase();
      }

      // Style filter
      let styleMatch = true;
      if (styleValue) {
        const styleLower = styleValue.toLowerCase();
        styleMatch =
          product.brand?.toLowerCase().includes(styleLower) ||
          product.tags?.some((tag) => tag.toLowerCase().includes(styleLower)) ||
          product.description?.toLowerCase().includes(styleLower) ||
          product.name?.toLowerCase().includes(styleLower) ||
          product.category?.toLowerCase().includes(styleLower);
      }

      return brandMatch && styleMatch;
    });
  } else {
    filteredProducts = products;
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Render current page products
  currentProducts.forEach((product) => {
    const renderCard = /*html*/ `
      <div class="col-md-4 mb-4">
        <a href="/product/${product.productID}" class="product-link" data-link>
          <div class="product-card minimal-card">
            <div class="minimal-img">
              ${
                product.discount
                  ? `<div class="discount-badge">-${product.discount}%</div>`
                  : ""
              }
              <img src="${product.colors[0].image_urls[0]}" alt="${
      product.name
    }">
            </div>
            <div class="w-100">
              <div class="product-name">${product.name}</div>
              <div class="price-container">
                ${
                  product.discount
                    ? `
                  <div class="original-price">$${product.price}</div>
                  <div class="discounted-price">$${Math.round(
                    product.price * (1 - product.discount / 100)
                  )}</div>
                `
                    : `<div class="regular-price">$${product.price}</div>`
                }
              </div>
              <div class="color-dots-container">
                ${product.colors
                  .map(
                    (color) =>
                      `<span class="color-dot" title="${color.name}" style="background:${color.hex};"></span>`
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

  // Create pagination container if it doesn't exist
  let paginationContainer = document.querySelector(".pagination-container");
  if (!paginationContainer) {
    paginationContainer = document.createElement("div");
    paginationContainer.className =
      "pagination-container mt-4 d-flex justify-content-center";
    productList.parentElement.appendChild(paginationContainer);
  }

  // Render pagination
  renderPagination(totalPages);
};

function renderPagination(totalPages) {
  const paginationContainer = document.querySelector(".pagination-container");
  if (!paginationContainer) return;

  paginationContainer.innerHTML = "";

  // Create pagination wrapper
  const paginationWrapper = document.createElement("div");
  paginationWrapper.className =
    "pagination-wrapper d-flex align-items-center gap-2";

  // Previous button
  const prevButton = document.createElement("button");
  prevButton.className = "btn btn-outline-dark rounded-pill px-3";
  prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
  prevButton.disabled = currentPage === 1;
  prevButton.onclick = () => changePage(currentPage - 1);

  // Next button
  const nextButton = document.createElement("button");
  nextButton.className = "btn btn-outline-dark rounded-pill px-3";
  nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
  nextButton.disabled = currentPage === totalPages;
  nextButton.onclick = () => changePage(currentPage + 1);

  // Page numbers
  const pageNumbers = document.createElement("div");
  pageNumbers.className = "d-flex gap-2";

  // First page
  if (currentPage > 2) {
    const firstPageBtn = document.createElement("button");
    firstPageBtn.className = `btn ${
      currentPage === 1 ? "btn-dark" : "btn-outline-dark"
    } rounded-pill px-3`;
    firstPageBtn.textContent = "1";
    firstPageBtn.onclick = () => changePage(1);
    pageNumbers.appendChild(firstPageBtn);
  }

  // Ellipsis if needed
  if (currentPage > 3) {
    const ellipsis = document.createElement("span");
    ellipsis.className = "px-2";
    ellipsis.textContent = "...";
    pageNumbers.appendChild(ellipsis);
  }

  // Current page and surrounding pages
  for (
    let i = Math.max(1, currentPage - 1);
    i <= Math.min(totalPages, currentPage + 1);
    i++
  ) {
    if (i === 1 && currentPage > 2) continue; // Skip if already added
    const pageBtn = document.createElement("button");
    pageBtn.className = `btn ${
      currentPage === i ? "btn-dark" : "btn-outline-dark"
    } rounded-pill px-3`;
    pageBtn.textContent = i;
    pageBtn.onclick = () => changePage(i);
    pageNumbers.appendChild(pageBtn);
  }

  // Ellipsis if needed
  if (currentPage < totalPages - 2) {
    const ellipsis = document.createElement("span");
    ellipsis.className = "px-2";
    ellipsis.textContent = "...";
    pageNumbers.appendChild(ellipsis);
  }

  // Last page
  if (currentPage < totalPages - 1) {
    const lastPageBtn = document.createElement("button");
    lastPageBtn.className = `btn ${
      currentPage === totalPages ? "btn-dark" : "btn-outline-dark"
    } rounded-pill px-3`;
    lastPageBtn.textContent = totalPages;
    lastPageBtn.onclick = () => changePage(totalPages);
    pageNumbers.appendChild(lastPageBtn);
  }

  // Assemble pagination
  paginationWrapper.appendChild(prevButton);
  paginationWrapper.appendChild(pageNumbers);
  paginationWrapper.appendChild(nextButton);

  // Add page info
  const pageInfo = document.createElement("div");
  pageInfo.className = "ms-3 text-muted";
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(
    currentPage * ITEMS_PER_PAGE,
    filteredProducts.length
  );
  pageInfo.textContent = `Showing ${startItem}-${endItem} of ${filteredProducts.length} items`;

  paginationContainer.appendChild(paginationWrapper);
  paginationContainer.appendChild(pageInfo);
}

function changePage(newPage) {
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  if (newPage < 1 || newPage > totalPages) return;

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
    console.log(product);

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
      // Clear query from window href
      const url = new URL(window.location.href);
      url.search = "";
      window.history.replaceState({}, document.title, url.toString());
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
