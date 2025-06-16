import {
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  limit,
  query,
  where,
  updateDoc,
  arrayUnion,
  setDoc,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { observer } from "../../observer";
import ProductCard from "../../components/Productcard/ProductCard";
import Modal from "bootstrap/js/dist/modal";
import "./Product.css";
const componentID = "product";

export default async function Product({ id }) {
  observer(componentID, () => {
    compLoaded(id);
  });
  return /*html*/ `
    <div component="${componentID}">
      <!-- Breadcrumb -->
      <div class="container mt-5">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <a href="#" class="text-decoration-none text-muted">Home</a>
            </li>
            <li class="breadcrumb-item">
              <a href="/shop" class="text-decoration-none text-muted" data-link
                >Shop</a
              >
            </li>
            <li class="breadcrumb-item">
              <a
                href="#"
                class="text-decoration-none text-muted"
                id="productCategory"
                data-link
              >
                ...
              </a>
            </li>
            <li
              class="breadcrumb-item active"
              aria-current="page"
              id="productGender"
            >
              ...
            </li>
          </ol>
        </nav>
      </div>

      <!-- Product Section -->
      <div class="container my-5">
        <div class="row">
          <!-- Product Images -->
          <div class="col-md-4 mb-2 mb-lg-0">
            <div class="mb-3 text-center bg-light rounded-3">
              <p class="col-12 placeholder-glow" id="imgPlaceholder">
                <span
                  class="placeholder col-12 rounded-3"
                  style="height: 400px;width: 100%;"
                ></span>
              </p>
              <img
                class="rounded-3"
                style="height: 400px;width: 100%;object-fit: cover;display:none;"
                id="imgContainer"
              />
            </div>
            <div class="row justify-content-around text-center">
              <div class="col-4">
                <img
                  class="rounded-3 mb-3"
                  style="height: 100px;width: 100%;object-fit: cover;display:none;"
                  id="imgFront"
                />
              </div>
              <div class="col-4">
                <img
                  class="rounded-3 mb-3"
                  style="height: 100px;width: 100%;object-fit: cover;display:none;"
                  id="imgSide"
                />
              </div>
              <div class="col-4">
                <img
                  class="rounded-3 mb-3"
                  style="height: 100px;width: 100%;object-fit: cover;display:none;"
                  id="imgBack"
                />
              </div>
            </div>
          </div>

          <!-- Product Details -->
          <div class="col-md-8">
            <h1 class="fw-bold" id="productTitle">
              <p class="d-block col-12 placeholder-glow">
                <span class="placeholder col-4"></span>
              </p>
            </h1>

            <div class="d-flex align-items-center mb-3" id="productReview">
              <p class="d-block col-12 placeholder-glow">
                <span class="placeholder col-1"></span>
              </p>
            </div>

            <div class="d-flex align-items-center mb-3">
              <h3 class="fw-bold me-3" id="productPrice"></h3>
              <h3
                class="fw-bold text-decoration-line-through text-muted"
                id="discountOldPrice"
              ></h3>
              <span
                class="badge bg-danger bg-opacity-10 text-danger ms-2"
                id="discountPrecentage"
              ></span>
            </div>

            <hr />

            <h6 class="text-muted mb-3">Available Colors</h6>
            <div class="d-flex gap-2 mb-4" id="productColors">
              <p class="d-block col-12 placeholder-glow">
                <span class="placeholder col-6"></span>
              </p>
            </div>
            <h6 class="text-muted mb-3">Available Size</h6>
            <div id="stockAlert" class="d-none badge bg-danger text-danger bg-opacity-10 mb-3"></div>
            <div class="d-flex gap-2 mb-4" id="displaySizes">
              <p class="d-block col-12 placeholder-glow">
                <span class="placeholder col-6"></span>
              </p>
            </div>

            <hr />
            <div class="text-danger d-block mb-3" id="cartError"></div>
            <div class="d-flex align-items-center mb-5">
              <div class="btn-group me-3" role="group">
                <button class="btn btn-light" id="decrement-btn">-</button>
                <button class="btn btn-light" id="quantity-display">1</button>
                <button class="btn btn-light" id="increment-btn">+</button>
              </div>
              <button class="btn btn-dark rounded-pill px-5" id="add-to-cart">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Tabs -->
      <div class="container my-5">
        <ul
          class="nav nav-tabs border-0 justify-content-center"
          id="myTab"
          role="tablist"
        >
          <li class="nav-item me-1" role="presentation">
            <button
              class="nav-link text-muted"
              id="product-tab"
              data-bs-toggle="tab"
              data-bs-target="#product"
              type="button"
              role="tab"
            >
              Product Details
            </button>
          </li>
          <li class="nav-item me-1" role="presentation">
            <button
              class="nav-link text-muted active"
              id="reviews-tab"
              data-bs-toggle="tab"
              data-bs-target="#reviews"
              type="button"
              role="tab"
              aria-selected="true"
            >
              Rating & Reviews
            </button>
          </li>
          <li class="nav-item ms-1" role="presentation">
            <button
              class="nav-link text-muted"
              id="faqs-tab"
              data-bs-toggle="tab"
              data-bs-target="#faqs"
              type="button"
              role="tab"
            >
              FAQs
            </button>
          </li>
        </ul>

        <hr class="mt-0" />

        <!-- Tab content -->
        <div class="tab-content" id="myTabContent">
          <!-- Product Details Tab -->
          <div
            class="tab-pane fade"
            id="product"
            role="tabpanel"
            aria-labelledby="product-tab"
          >
            <h4 class="fw-bold">Product Details</h4>
            <div id="productDesc" class="p-5">
              <p class="d-block col-12 placeholder-glow">
                <span class="placeholder col-2"></span>
              </p>
            </div>
          </div>

          <!-- Reviews Tab (active by default) -->
          <div
            class="tab-pane fade show active"
            id="reviews"
            role="tabpanel"
            aria-labelledby="reviews-tab"
          >
            <div class="d-flex justify-content-between mb-4">
              <h4 class="fw-bold">
                All Reviews <span class="text-muted" id="reviewsCount"></span>
              </h4>
              <div class="d-flex gap-2">
                <div class="dropdown">
                  <button
                    class="btn btn-light rounded-pill p-2 dropdown-toggle"
                    id="sortReviewsBtn"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Latest
                  </button>
                  <ul class="dropdown-menu" aria-labelledby="sortReviewsBtn">
                    <li>
                      <a class="dropdown-item" href="#" data-sort="latest"
                        >Latest
                      </a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="#" data-sort="oldest"
                        >Oldest
                      </a>
                    </li>
                    <li><hr class="dropdown-divider" /></li>
                    <li>
                      <a class="dropdown-item" href="#" data-sort="highest"
                        >Highest
                      </a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="#" data-sort="lowest"
                        >Lowest
                      </a>
                    </li>
                  </ul>
                </div>
                ${
                  App.firebase.user.email
                    ? `
                      <button
                        class="btn btn-dark rounded-pill p-2"
                        id="writeReviewBtn"
                        data-product-id="${id}"
                      >
                        Write a Review
                      </button>`
                    : `
                <button
                  class="btn btn-dark rounded-pill p-2 px-3"
                  id="writeReviewBtn"
                  data-product-id="${id}"
                disabled>
                 <i class="fa-solid fa-lock me-2"></i>Login to write a review
                </button>`
                }
              </div>
            </div>

            <!-- Reviews -->
            <div class="row" id="reviewsContainer">
              <p class="d-block col-12 text-center my-5 placeholder-glow">
                <span class="placeholder col-8" style="height:20px;"></span>
              </p>
            </div>
          </div>

          <!-- FAQs Tab -->
          <div
            class="tab-pane fade"
            id="faqs"
            role="tabpanel"
            aria-labelledby="faqs-tab"
          >
            <h4 class="fw-bold mb-4">
              Frequently asked question
              <span class="text-muted" id="reviewsCount"></span>
            </h4>
            <div class="accordion accordion-flush border-0" id="faqAccordion">
              <!-- Size & Fit -->
              <div class="accordion-item border-0 mb-3">
                <h2 class="accordion-header">
                  <button
                    class="accordion-button bg-light rounded-3 collapsed px-4 py-3"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#sizeFit"
                  >
                    <i class="bi bi-rulers me-3"></i> Size & Fit
                  </button>
                </h2>
                <div
                  id="sizeFit"
                  class="accordion-collapse collapse px-4"
                  data-bs-parent="#faqAccordion"
                >
                  <div class="accordion-body px-0 pt-3">
                    <h5 class="fw-semibold mb-1">
                      How do I choose the right size?
                    </h5>
                    <p class="text-muted">
                      We provide detailed size charts for each product. Measure
                      yourself and compare with our measurements for the best
                      fit. When in doubt between two sizes, we recommend sizing
                      up.
                    </p>

                    <h5 class="fw-semibold mt-4 mb-1">
                      Are your sizes true to standard sizing?
                    </h5>
                    <p class="text-muted">
                      Most of our items follow standard sizing, but some styles
                      may run small or large. Check the product description for
                      specific fit notes (like "runs small" or "oversized fit").
                    </p>

                    <h5 class="fw-semibold mt-4 mb-1">
                      What if the item doesn't fit?
                    </h5>
                    <p class="text-muted">
                      We offer free returns within 30 days for unworn items with
                      tags attached. See our Returns Policy for details.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Materials & Care -->
              <div class="accordion-item border-0 mb-3">
                <h2 class="accordion-header">
                  <button
                    class="accordion-button bg-light rounded-3 collapsed px-4 py-3"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#materialsCare"
                  >
                    <i class="bi bi-water me-3"></i> Materials & Care
                  </button>
                </h2>
                <div
                  id="materialsCare"
                  class="accordion-collapse collapse px-4"
                  data-bs-parent="#faqAccordion"
                >
                  <div class="accordion-body px-0 pt-3">
                    <h5 class="fw-semibold mb-1">
                      What materials are your clothes made from?
                    </h5>
                    <p class="text-muted">
                      We use a variety of high-quality materials including
                      organic cotton, linen, polyester blends, and sustainable
                      fabrics. Each product page lists the exact material
                      composition.
                    </p>

                    <h5 class="fw-semibold mt-4 mb-1">
                      How should I care for my garments?
                    </h5>
                    <p class="text-muted">
                      Care instructions are listed on each product page and on
                      the garment's care label. As a general rule:
                    </p>
                    <ul class="text-muted">
                      <li>Wash dark colors inside out in cold water</li>
                      <li>Hang dry when possible to preserve fabric</li>
                      <li>Iron on appropriate setting for the fabric</li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Shipping -->
              <div class="accordion-item border-0 mb-3">
                <h2 class="accordion-header">
                  <button
                    class="accordion-button bg-light rounded-3 collapsed px-4 py-3"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#shipping"
                  >
                    <i class="bi bi-truck me-3"></i> Shipping
                  </button>
                </h2>
                <div
                  id="shipping"
                  class="accordion-collapse collapse px-4"
                  data-bs-parent="#faqAccordion"
                >
                  <div class="accordion-body px-0 pt-3">
                    <h5 class="fw-semibold mb-1">Where do you ship to?</h5>
                    <p class="text-muted">
                      We currently ship to all 50 U.S. states and offer
                      international shipping to select countries. During
                      checkout, you'll see available shipping options for your
                      location.
                    </p>

                    <h5 class="fw-semibold mt-4 mb-1">
                      How long does shipping take?
                    </h5>
                    <p class="text-muted">
                      <span class="d-block mb-1"
                        ><span class="fw-medium">Standard shipping:</span> 3-5
                        business days</span
                      >
                      <span class="d-block mb-1"
                        ><span class="fw-medium">Express shipping:</span> 1-2
                        business days</span
                      >
                      <span class="d-block"
                        ><span class="fw-medium">International:</span> 7-14
                        business days</span
                      >
                    </p>

                    <h5 class="fw-semibold mt-4 mb-1">
                      Do you offer free shipping?
                    </h5>
                    <p class="text-muted">
                      Yes! Free standard shipping on all orders over $50. We
                      also offer free returns within the U.S.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Returns -->
              <div class="accordion-item border-0 mb-3">
                <h2 class="accordion-header">
                  <button
                    class="accordion-button bg-light rounded-3 collapsed px-4 py-3"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#returns"
                  >
                    <i class="bi bi-arrow-left-right me-3"></i> Returns &
                    Exchanges
                  </button>
                </h2>
                <div
                  id="returns"
                  class="accordion-collapse collapse px-4"
                  data-bs-parent="#faqAccordion"
                >
                  <div class="accordion-body px-0 pt-3">
                    <h5 class="fw-semibold mb-1">What's your return policy?</h5>
                    <p class="text-muted">
                      We accept returns within 30 days of delivery. Items must
                      be unworn, unwashed, with tags attached and in original
                      packaging. Final sale items cannot be returned.
                    </p>

                    <h5 class="fw-semibold mt-4 mb-1">
                      How do I return an item?
                    </h5>
                    <div class="d-flex flex-column gap-2 text-muted">
                      <div class="d-flex align-items-start">
                        <span class="badge bg-dark rounded-circle me-2 mt-1"
                          >1</span
                        >
                        <span>Log in to your account</span>
                      </div>
                      <div class="d-flex align-items-start">
                        <span class="badge bg-dark rounded-circle me-2 mt-1"
                          >2</span
                        >
                        <span>Go to "My Orders" and select the item</span>
                      </div>
                      <div class="d-flex align-items-start">
                        <span class="badge bg-dark rounded-circle me-2 mt-1"
                          >3</span
                        >
                        <span>Print the prepaid return label</span>
                      </div>
                      <div class="d-flex align-items-start">
                        <span class="badge bg-dark rounded-circle me-2 mt-1"
                          >4</span
                        >
                        <span>Pack the item securely and attach the label</span>
                      </div>
                      <div class="d-flex align-items-start">
                        <span class="badge bg-dark rounded-circle me-2 mt-1"
                          >5</span
                        >
                        <span>Drop at any UPS location</span>
                      </div>
                    </div>

                    <h5 class="fw-semibold mt-4 mb-1">
                      How long do refunds take?
                    </h5>
                    <p class="text-muted">
                      Once we receive your return, processing takes 3-5 business
                      days. Your bank may take additional 2-5 days to post the
                      credit.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Sustainability -->
              <div class="accordion-item border-0 mb-3">
                <h2 class="accordion-header">
                  <button
                    class="accordion-button bg-light rounded-3 collapsed px-4 py-3"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#sustainability"
                  >
                    <i class="bi bi-leaf me-3"></i> Sustainability
                  </button>
                </h2>
                <div
                  id="sustainability"
                  class="accordion-collapse collapse px-4"
                  data-bs-parent="#faqAccordion"
                >
                  <div class="accordion-body px-0 pt-3">
                    <h5 class="fw-semibold">
                      Are your clothes ethically made?
                    </h5>
                    <p class="text-muted">
                      Yes! We partner with factories that pay fair wages and
                      provide safe working conditions. All our suppliers must
                      meet our strict Code of Conduct.
                    </p>

                    <h5 class="fw-semibold mt-4">
                      Do you use sustainable materials?
                    </h5>
                    <p class="text-muted">
                      We're committed to sustainability. Over 60% of our
                      collection uses eco-friendly materials like organic
                      cotton, recycled polyester, and Tencel™. Look for the leaf
                      icon on product pages.
                    </p>

                    <h5 class="fw-semibold mt-4">
                      What are you doing to reduce waste?
                    </h5>
                    <p class="text-muted">
                      We use minimal packaging made from recycled materials,
                      donate unsold inventory, and have a garment recycling
                      program for worn-out clothes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- You Might Also Like -->
      <div class="container my-5">
        <h2 class="text-center fw-bold mb-5">YOU MIGHT ALSO LIKE</h2>
        <div class="row" id="moreProducts">
          <p class="d-block col-12 placeholder-glow text-center">
            <span class="placeholder col-8" style="height:20px;"></span>
          </p>
        </div>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <div
      class="modal fade"
      id="imagePreviewModal"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content bg-transparent border-0">
          <div class="modal-body text-center p-0">
            <img
              id="modalImage"
              src=""
              class="img-fluid rounded-4"
              alt="Preview"
            />
          </div>
          <button
            type="button"
            class="btn-close btn-close-white position-absolute top-0 end-0 m-3"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>

    <!-- Review Modal -->
    <div
    class="modal fade"
    id="reviewModal"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Write a Review</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form id="reviewForm">
            <div class="alert alert-danger d-none" id="errorMessage" role="alert">
             
            </div>
            <div class="mb-3">
              <label for="reviewRating" class="form-label"
                >Rating</label
              >
              <select class="form-select" id="reviewRating" required>
                <option value="" selected disabled>
                  Select rating
                </option>
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very Good</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="reviewMessage" class="form-label"
                >Review</label
              >
              <textarea
                class="form-control"
                id="reviewMessage"
                rows="3"
                required
                placeholder="Share your thoughts about this product..."
              ></textarea>
            </div>
            <div class="d-grid gap-2">
              <button
                type="submit"
                class="btn btn-dark"
                id="submitReviewBtn"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  `;
}

//Javascript code to be executed once the home component is loaded
const compLoaded = async (id) => {
  // Initialize product state
  window.selectedItem = {
    productID: id,
    color: null,
    size: null,
    name: "",
    image: "",
    price: 0,
    max: 0,
  };

  // Quantity management
  let currentQuantity = 1;
  let maxQuantity = 0;

  // All our html elements we need to work on
  const elements = {
    quantity: document.getElementById("quantity-display"),
    cartError: document.getElementById("cartError"),
    incrementBtn: document.getElementById("increment-btn"),
    decrementBtn: document.getElementById("decrement-btn"),
    addToCartBtn: document.getElementById("add-to-cart"),
    imgContainer: document.getElementById("imgContainer"),
    modal: new Modal(document.getElementById("imagePreviewModal")),
    modalImage: document.getElementById("modalImage"),
    modalElement: document.getElementById("imagePreviewModal"),
    productReview: document.querySelector("#productReview"),
    reviewsContainer: document.querySelector("#reviewsContainer"),
    productTitle: document.querySelector("#productTitle"),
    productPrice: document.querySelector("#productPrice"),
    productDesc: document.querySelector("#productDesc"),
    discountOldPrice: document.querySelector("#discountOldPrice"),
    discountPrecentage: document.querySelector("#discountPrecentage"),
    productColors: document.querySelector("#productColors"),
    productGender: document.querySelector("#productGender"),
    productCategory: document.querySelector("#productCategory"),
    stockAlert: document.querySelector("#stockAlert"),
    displaySizes: document.getElementById("displaySizes"),
    moreProducts: document.querySelector("#moreProducts"),
    reviewsCount: document.getElementById("reviewsCount"),
    imgPlaceholder: document.querySelector("#imgPlaceholder"),
    imgFront: document.getElementById("imgFront"),
    imgSide: document.getElementById("imgSide"),
    imgBack: document.getElementById("imgBack"),
  };

  // Image modal handling
  elements.imgContainer.addEventListener("click", () => {
    elements.modalImage.src = elements.imgContainer.src;
    elements.modal.show();
  });

  elements.modalElement.addEventListener("click", (e) => {
    if (e.target !== elements.modalImage) elements.modal.hide();
  });

  function findCartItem(cart, productID, size, color) {
    return cart.find(
      (item) =>
        item.productId === productID &&
        item.selectedSize === size &&
        item.selectedColor === color
    );
  }

  function updateCartItem(
    productID,
    size,
    color,
    quantity,
    name,
    image,
    price,
    discount,
    max,
    category
  ) {
    const cart = App.getCart();
    const existingItem = findCartItem(cart, productID, size, color);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        productId: productID,
        selectedSize: size,
        selectedColor: color,
        quantity: quantity,
        name: name,
        image: image,
        price: price,
        discount: discount,
        max,
        category,
      });
    }

    App.saveCart(cart);
    return cart;
  }

  // Main product loading function
  async function loadProduct() {
    try {
      const productDoc = await getDoc(doc(App.firebase.db, "products", id));
      if (!productDoc.exists()) {
        App.navigator("/product-doesnt-exist");
        return;
      }

      const data = productDoc.data();
      updateProductDetails(data);
      await loadProductReviews(id);
      loadRelatedProducts(data, id);
    } catch (error) {
      console.error("Product loading error:", error);
      App.navigator("/");
    }
  }

  function updateProductDetails(data) {
    // Basic info
    if (elements.productTitle)
      elements.productTitle.textContent = data.name || "";
    if (elements.productGender)
      elements.productGender.textContent = data.category || "";
    if (elements.productCategory)
      elements.productCategory.href = `/shop/${data.gender}`;
    elements.productCategory.textContent = data.gender || "";
    if (elements.productDesc)
      elements.productDesc.textContent = data.description || "";

    // Pricing
    if (elements.productPrice) {
      if (data.discount) {
        elements.discountOldPrice.textContent = `${data.price}$`;
        const discountedPrice = data.price - (data.price * data.discount) / 100;
        elements.productPrice.textContent = `${discountedPrice}$`;
        elements.discountPrecentage.textContent = `-${data.discount}%`;
      } else {
        elements.productPrice.textContent = `${data.price}$`;
        elements.discountOldPrice.textContent = "";
        elements.discountPrecentage.textContent = "";
      }
    }

    // Colors and images
    if (data.colors?.length > 0) {
      elements.productColors.innerHTML = generateColorButtons(data.colors);
      setupColorSelection(data.colors);
    }

    //update selected item
    window.selectedItem.name = data.name;
    window.selectedItem.price = data.price;
    window.selectedItem.discount = data.discount;
    window.selectedItem.category = data.category;
  }

  async function loadProductReviews(productId) {
    try {
      const reviewsQuery = query(
        collection(App.firebase.db, "reviews", productId, "userReviews"),
        orderBy("createdAt", "desc") // Newest first
      );

      const querySnapshot = await getDocs(reviewsQuery);
      const reviews = [];

      querySnapshot.forEach((doc) => {
        reviews.push({ id: doc.id, ...doc.data() });
      });

      if (reviews.length > 0) {
        renderProductReviews(reviews);
        const avgRating = calculateAverageRating(reviews);
        elements.productReview.innerHTML = createStarRating(avgRating);
      } else {
        elements.productReview.innerHTML = "";
        elements.reviewsContainer.innerHTML = `<span class="mt-3 text-center d-block">No reviews available</span>`;
      }
    } catch (error) {
      console.error("Reviews loading error:", error);
      elements.reviewsContainer.innerHTML = "Error loading reviews";
    }
  }

  function renderProductReviews(reviews) {
    elements.reviewsContainer.innerHTML = "";
    if (elements.reviewsCount)
      elements.reviewsCount.textContent = `(${reviews.length})`;

    reviews.forEach((review) => {
      const reviewHTML = `
      <div class="col-md-6 mb-4">
        <div class="card p-4 h-100">
          ${createReviewStars(review.rate)}
          <div class="mb-3">
            <div class="d-flex align-items-center">
              <h6 class="fw-bold mb-0 me-2">${review.displayName}</h6>
              <span class="badge bg-success rounded-circle p-1">
                <i class="bi bi-check"></i>
              </span>
            </div>
            <p class="text-muted mt-2">${review.message}</p>
          </div>
          <div class="d-flex justify-content-between text-muted">
            <small>Posted on ${formatReviewDate(review.createdAt)}</small>
          </div>
        </div>
      </div>
    `;
      elements.reviewsContainer.insertAdjacentHTML("beforeend", reviewHTML);
    });
  }

  async function loadRelatedProducts(currentProduct, currentProductID) {
    if (!elements.moreProducts || !currentProduct) return;

    try {
      const productsRef = collection(App.firebase.db, "products");
      let relatedProducts = [];
      const maxResults = 4; // Number of related products to show

      //Try to get products with same category AND same gender first
      if (currentProduct.category && currentProduct.gender) {
        const strictQuery = query(
          productsRef,
          where("category", "==", currentProduct.category),
          where("gender", "==", currentProduct.gender),
          where(documentId(), "!=", currentProductID),
          limit(maxResults)
        );
        const strictSnapshot = await getDocs(strictQuery);
        strictSnapshot.forEach((doc) => relatedProducts.push(doc));
      }

      // Display results
      if (relatedProducts.length > 0) {
        elements.moreProducts.innerHTML = "";
        relatedProducts.forEach((doc) => {
          const data = doc.data();
          elements.moreProducts.innerHTML += ProductCard(
            doc.id,
            data.name,
            data.price,
            data.discount,
            data.colors[0]?.image_urls[0] || "",
            data.colors
          );
        });
      } else {
        elements.moreProducts.innerHTML = `<span class="mx-auto col-12 text-center">No related products available</span>`;
      }
    } catch (error) {
      console.error("Related products error:", error);
      elements.moreProducts.innerHTML = `<span class="mx-auto col-12 text-center">Error loading related products</span>`;
    }
  }

  // Color and size selection
  function generateColorButtons(colors) {
    return colors
      .map(
        (color, index) => `
    <button class="btn rounded-circle color-btn"
            data-index="${index}"
            style="width:32px; height:32px; background-color:${color.hex}"
            title="${color.name}">
    </button>
  `
      )
      .join("");
  }

  function setupColorSelection(colors) {
    document.querySelectorAll(".color-btn").forEach((button) => {
      button.addEventListener("click", () => {
        document
          .querySelectorAll(".color-btn")
          .forEach((btn) => btn.classList.remove("selected"));
        button.classList.add("selected");

        const color = colors[button.dataset.index];
        window.selectedItem.color = color.name;
        window.selectedItem.image = color.image_urls[0];

        // Update product images
        [elements.imgFront, elements.imgSide, elements.imgBack].forEach(
          (img, i) => {
            if (img) {
              img.style.display = "block";
              img.src = color.image_urls[i] || "";
              img.onerror = () => (img.style.display = "none");
            }
          }
        );

        // Update available sizes
        elements.displaySizes.innerHTML = generateSizeButtons(color.sizes);
        setupSizeSelection();
        setupImageClickHandlers();
        document.querySelector("#imgFront")?.click();
        document.querySelector(".size-btn:not([disabled])")?.click();
      });
    });

    document.querySelector(".color-btn")?.click();
  }

  function generateSizeButtons(sizes) {
    return Object.entries(sizes)
      .map(
        ([size, quantity]) => `
    <button class="btn btn-outline-secondary rounded-pill size-btn" 
            data-size="${size}" 
            data-quantity="${quantity}"
            ${quantity <= 0 ? "disabled" : ""}>
      ${size}${quantity <= 0 ? " (Out of stock)" : ""}
    </button>
  `
      )
      .join("");
  }

  function setupSizeSelection() {
    document.querySelectorAll(".size-btn").forEach((button) => {
      button.addEventListener("click", () => {
        document
          .querySelectorAll(".size-btn")
          .forEach((btn) => btn.classList.remove("selected"));
        button.classList.add("selected");

        window.selectedItem.size = button.dataset.size;
        maxQuantity = parseInt(button.dataset.quantity) || 0;

        if (maxQuantity <= 5) {
          stockAlert.innerText = `Low stock, Only ${maxQuantity} items left`;
          stockAlert.classList.remove("d-none");
        } else {
          stockAlert.innerText = ``;
          stockAlert.classList.add("d-none");
        }

        window.selectedItem.max = maxQuantity;
        currentQuantity = 1;
        updateQuantityDisplay();
      });
    });
  }

  function setupImageClickHandlers() {
    [elements.imgFront, elements.imgSide, elements.imgBack].forEach((img) => {
      if (img) {
        img.style.cursor = "pointer";
        img.addEventListener("click", () => {
          if (elements.imgPlaceholder)
            elements.imgPlaceholder.style.display = "none";
          elements.imgContainer.src = img.src;
          elements.imgContainer.style.display = "block";
        });
      }
    });
  }

  // Quantity controls
  function updateQuantityDisplay() {
    elements.quantity.textContent = currentQuantity;
    elements.decrementBtn.disabled = currentQuantity <= 1;
    elements.incrementBtn.disabled = currentQuantity >= maxQuantity;
  }

  elements.incrementBtn.addEventListener("click", () => {
    if (currentQuantity < maxQuantity) {
      currentQuantity++;
      updateQuantityDisplay();
    }
  });

  elements.decrementBtn.addEventListener("click", () => {
    if (currentQuantity > 1) {
      currentQuantity--;
      updateQuantityDisplay();
    }
  });

  // Cart functionality
  elements.addToCartBtn.addEventListener("click", () => {
    if (!validateSelection()) return;
    cartError.innerText = "";
    const {
      productID,
      color,
      size,
      name,
      image,
      price,
      discount,
      max,
      category,
    } = window.selectedItem;
    const cart = App.getCart();
    const existingItem = findCartItem(cart, productID, size, color);
    const currentInCart = existingItem ? existingItem.quantity : 0;
    const proposedTotal = currentInCart + currentQuantity;

    // Check against max quantity
    if (proposedTotal > maxQuantity) {
      const remaining = maxQuantity - currentInCart;
      const message =
        remaining > 0
          ? `You can only add ${remaining} more items of this product. (${currentInCart} already in cart)`
          : `You've reached the maximum quantity (${maxQuantity}) of this product in your cart`;

      cartError.innerText = message;
      return;
    }

    // Update cart in localStorage
    updateCartItem(
      productID,
      size,
      color,
      currentQuantity,
      name,
      image,
      price,
      discount,
      max,
      category
    );

    // Visual feedback
    showCartSuccessFeedback();
    resetQuantity();
    App.updateCartCounter();
  });

  function validateSelection() {
    if (!window.selectedItem.size) {
      cartError.innerText = "Please select a size";
      return false;
    }
    if (!window.selectedItem.color) {
      cartError.innerText = "Please select a color";
      return false;
    }
    return true;
  }

  function showCartSuccessFeedback() {
    elements.addToCartBtn.innerHTML = `
    <span class="me-2"><span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Adding ${currentQuantity} item(s)</span>
  `;
    elements.addToCartBtn.disabled = true;
    elements.addToCartBtn.classList.remove("btn-dark");
    elements.addToCartBtn.classList.add("btn-success");

    setTimeout(() => {
      elements.addToCartBtn.innerHTML = `
      <span class="me-2">✓ Added ${currentQuantity} item(s)</span>
    `;
    }, 1000);

    setTimeout(() => {
      elements.addToCartBtn.innerHTML = "Add to Cart";
      elements.addToCartBtn.disabled = false;
      elements.addToCartBtn.classList.remove("btn-success");
      elements.addToCartBtn.classList.add("btn-dark");
    }, 2000);
  }

  function resetQuantity() {
    currentQuantity = 1;
    updateQuantityDisplay();
  }

  // Rating helpers
  function calculateAverageRating(reviews) {
    if (!reviews?.length) return 0;
    const validRates = reviews
      .map((r) => Number(r.rate))
      .filter((rate) => !isNaN(rate));
    return validRates.length
      ? validRates.reduce((a, b) => a + b, 0) / validRates.length
      : 0;
  }

  function createStarRating(rating) {
    rating = Math.min(5, Math.max(0, rating));
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;

    return `
    <div class="d-flex text-warning me-2">
      ${'<i class="bi bi-star-fill"></i>'.repeat(full)}
      ${half ? '<i class="bi bi-star-half"></i>' : ""}
      ${'<i class="bi bi-star"></i>'.repeat(empty)}
    </div>
    <span>${rating.toFixed(1)}/5</span>
  `;
  }

  function createReviewStars(rate) {
    rate = parseFloat(rate);
    const fullStars = Math.floor(rate);
    const halfStar = rate % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return `
    <div class="d-flex text-warning mb-3">
      ${'<i class="bi bi-star-fill"></i>'.repeat(fullStars)}
      ${halfStar ? '<i class="bi bi-star-half"></i>' : ""}
      ${'<i class="bi bi-star"></i>'.repeat(emptyStars)}
    </div>
  `;
  }

  function formatReviewDate(timestamp) {
    if (!timestamp?.seconds) return "Unknown date";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // Review functionality
  const reviewModal = new Modal(document.getElementById("reviewModal"));
  const reviewForm = document.getElementById("reviewForm");
  const writeReviewBtn = document.getElementById("writeReviewBtn");
  const submitReviewBtn = document.getElementById("submitReviewBtn");

  if (writeReviewBtn) {
    writeReviewBtn.addEventListener("click", () => {
      if (!App.firebase.user) {
        App.navigator("/login");
        return;
      }
      reviewModal.show();
    });
  }

  if (reviewForm) {
    reviewForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      //Remove error message
      const errorMessage = document.querySelector("#errorMessage");
      if (errorMessage) {
        errorMessage.classList.add("d-none");
      }

      const rating = parseFloat(document.getElementById("reviewRating").value);
      const message = document.getElementById("reviewMessage").value.trim();
      const productId = writeReviewBtn.dataset.productId;

      // Client-side validation
      if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
        errorMessage.classList.remove("d-none");
        errorMessage.innerHTML = "Rating should be from 1 to 5.";
        return;
      }

      if (!message || message.length < 10 || message.length > 1000) {
        errorMessage.classList.remove("d-none");
        errorMessage.innerHTML =
          "Review message must be between 10-1000 characters";
        return;
      }

      // HTML tag validation (same regex as Firebase rules)
      const htmlTagRegex = /<[^>]+>/;
      if (htmlTagRegex.test(message)) {
        errorMessage.classList.remove("d-none");
        errorMessage.innerHTML = "HTML tags are not allowed in reviews";
        return;
      }

      try {
        submitReviewBtn.disabled = true;
        submitReviewBtn.innerHTML = `
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Submitting...
            `;

        // Check if user already has a review for this product
        const userReviewQuery = query(
          collection(App.firebase.db, "reviews", productId, "userReviews"),
          where("uid", "==", App.firebase.user.uid),
          limit(1)
        );

        const querySnapshot = await getDocs(userReviewQuery);
        const existingReview = querySnapshot.docs[0];

        if (existingReview) {
          // Update existing review
          await updateDoc(existingReview.ref, {
            rate: rating,
            message: message,
            updatedAt: serverTimestamp(),
          });
        } else {
          // Create new review
          const newReview = {
            uid: App.firebase.user.uid,
            displayName: App.firebase.user.displayName,
            rate: rating,
            message: message,
            productId: productId,
            createdAt: serverTimestamp(),
          };

          await addDoc(
            collection(App.firebase.db, "reviews", productId, "userReviews"),
            newReview
          );
        }

        // Success feedback
        submitReviewBtn.innerHTML = "✓ Submitted!";
        setTimeout(() => {
          reviewModal.hide();
          reviewForm.reset();
          submitReviewBtn.disabled = false;
          submitReviewBtn.innerHTML = "Submit Review";
          loadProductReviews(productId);
        }, 1000);
      } catch (error) {
        console.error("Error submitting review:", error);
        submitReviewBtn.disabled = false;
        submitReviewBtn.innerHTML = "Submit Review";
        errorMessage.classList.remove("d-none");
        errorMessage.innerHTML = "Failed to submit review. Please try again.";
      }
    });
  }

  // Sorting functionality
  const sortReviewsBtn = document.getElementById("sortReviewsBtn");
  let currentSortMethod = "latest"; // Default sort method

  if (sortReviewsBtn) {
    // Handle dropdown item clicks
    document.querySelectorAll("[data-sort]").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        currentSortMethod = e.target.dataset.sort;

        // Update button text
        const dropdownTextMap = {
          latest: "Latest ",
          oldest: "Oldest ",
          highest: "Highest ",
          lowest: "Lowest ",
        };
        sortReviewsBtn.innerHTML = `${dropdownTextMap[currentSortMethod]}`;

        // Reload reviews with new sort method
        loadProductReviews(id);
      });
    });
  }

  // Render Reviews
  function renderProductReviews(reviews) {
    // Sort reviews based on current method
    const sortedReviews = [...reviews].sort((a, b) => {
      switch (currentSortMethod) {
        case "latest":
          return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
        case "oldest":
          return (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0);
        case "highest":
          return (parseFloat(b.rate) || 0) - (parseFloat(a.rate) || 0);
        case "lowest":
          return (parseFloat(a.rate) || 0) - (parseFloat(b.rate) || 0);
        default:
          return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
      }
    });

    elements.reviewsContainer.innerHTML = "";
    if (elements.reviewsCount)
      elements.reviewsCount.textContent = `(${sortedReviews.length})`;

    sortedReviews.forEach((review) => {
      const reviewHTML = `
    <div class="col-md-6 mb-4">
      <div class="card p-4 h-100">
        ${createReviewStars(review.rate)}
        <div class="mb-3">
          <div class="d-flex align-items-center">
            <h6 class="fw-bold mb-0 me-2">${review.displayName}</h6>
            <span class="badge bg-success rounded-circle p-1">
              <i class="bi bi-check"></i>
            </span>
          </div>
          <p class="text-muted mt-2">${review.message}</p>
        </div>
        <div class="d-flex justify-content-between text-muted">
          <small>Posted on ${formatReviewDate(review.createdAt)}</small>
          <small>Rating: ${review.rate}/5</small>
        </div>
      </div>
    </div>
    `;
      elements.reviewsContainer.insertAdjacentHTML("beforeend", reviewHTML);
    });
  }

  // Initialize
  setTimeout(() => {
    loadProduct();
    updateQuantityDisplay();
  }, 500);
};
