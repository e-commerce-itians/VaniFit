import "./Product.css";
import Getdata from "../../utils/getData";
import { observer } from "../../observer";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import productCard from "../../components/productCard/productCard";
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
              <a href="#" class="text-decoration-none text-muted">Men</a>
            </li>
            <li class="breadcrumb-item active" aria-current="page">T-shirts</li>
          </ol>
        </nav>
      </div>

      <!-- Product Section -->
      <div class="container my-5">
        <div class="row">
          <!-- Product Images -->
          <div class="col-md-4">
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
            <div class="d-flex gap-2 mb-4" id="displaySizes">
              <p class="d-block col-12 placeholder-glow">
                <span class="placeholder col-6"></span>
              </p>
            </div>

            <hr />

            <div class="d-flex align-items-center mb-5">
              <div class="btn-group me-3" role="group">
                <button class="btn btn-light">-</button>
                <button class="btn btn-light">1</button>
                <button class="btn btn-light">+</button>
              </div>
              <button class="btn btn-dark rounded-pill px-5">
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
                <button class="btn btn-light rounded-pill">
                  Latest <i class="bi bi-chevron-down"></i>
                </button>
                <button class="btn btn-dark rounded-pill">
                  Write a Review
                </button>
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
            <img id="modalImage" src="" class="img-fluid" alt="Preview" />
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
  `;
}

//Javascript code to be executed once the home component is loaded
const compLoaded = async (id) => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  //selected item
  window.selectedItem = {
    productID: id,
    color: null,
    size: null,
  };

  // App.cartAdd(
  //   selectedItem.productID,
  //   selectedItem.size,
  //   selectedItem.color,
  //   selectedItem.quantity
  // );

  const imgContainer = document.getElementById("imgContainer");
  const modal = new bootstrap.Modal(
    document.getElementById("imagePreviewModal")
  );
  const modalImage = document.getElementById("modalImage");
  const modalElement = document.getElementById("imagePreviewModal");

  imgContainer.addEventListener("click", function () {
    modalImage.src = this.src;
    modal.show();
  });

  // Handle clicks on the modal
  modalElement.addEventListener("click", function (e) {
    // Only close if clicking directly on the modal backdrop (not image/content)
    if (e.target !== modalImage) {
      modal.hide();
    }
  });

  //App.cartAdd("123", "M", "red", 2);

  await getDoc(doc(App.firebase.db, "products", id))
    .then(async (res) => {
      const data = res.exists() ? res.data() : null;
      if (data) {
        const productReview = document.querySelector("#productReview");
        const ReviewsContainer = document.querySelector("#reviewsContainer");
        await getDoc(doc(App.firebase.db, "reviews", id))
          .then((reviewsSnap) => {
            const reviewsData = reviewsSnap.exists()
              ? reviewsSnap.data()
              : null;
            //Product Review
            if (reviewsData && reviewsData.reviews) {
              renderReviews(ReviewsContainer, reviewsData.reviews);
              const avgReview = getAverageRate(reviewsData.reviews);
              productReview.innerHTML = getStarRating(avgReview);
            } else {
              productReview.innerHTML = "";
              ReviewsContainer.innerHTML = `<span class="mx-5">No reviews available for this Product</span>`;
            }
          })
          .catch((error) => {
            ReviewsContainer.innerHTML = error;
          });

        const productTitle = document.querySelector("#productTitle");
        const productPrice = document.querySelector("#productPrice");
        const productDesc = document.querySelector("#productDesc");
        const discountOldPrice = document.querySelector("#discountOldPrice");
        const discountPrecentage = document.querySelector(
          "#discountPrecentage"
        );

        const productColors = document.querySelector("#productColors");

        //Product name
        if (productTitle && data.name) {
          productTitle.innerText = data.name;
        }

        //Product Price
        if (productPrice && data.price) {
          if (data.discount) {
            discountOldPrice.innerText = `${data.price}$`;
            data.price = data.price - (data.price * data.discount) / 100;
            discountPrecentage.innerText = `-${data.discount}%`;
          }
          productPrice.innerText = data.price + "$";
        }

        //Product Desc
        if (productDesc && data.description) {
          productDesc.innerText = data.description;
        }

        //Colors
        if (data.colors) {
          productColors.innerHTML = generateColorButtonsHTML(data.colors);
          setupColorButtonEvents(data.colors);
          if (data.colors.length > 0) {
            document.querySelector(".color-btn").click();
          }
        }
      } else {
        //product doesn't exist
        App.navigator("/product-doesnt-exist");
      }
    })
    .catch((error) => {
      console.log(error);
      App.navigator("/");
    });

  //display more products
  const moreProducts = document.querySelector("#moreProducts");

  if (moreProducts) {
    moreProducts.innerHTML = "";
    //Get all products from products collection
    getDocs(collection(App.firebase.db, "products"))
      .then((querySnapshot) => {
        //If success go through each doc
        querySnapshot.forEach((doc) => {
          //Get the product ID
          const productID = doc.id;
          //Get data
          const data = doc.data();
          //Call productCard component
          const renderCard = productCard(
            productID,
            data.name,
            data.price,
            data.discount,
            data.colors[0].image_urls[0],
            data.colors
          );
          //Push into the html
          moreProducts.innerHTML += renderCard;
        });
      })
      .catch((error) => {
        console.log(error);
        moreProducts.innerHTML = `<span class="mx-auto">There is no more available products at the moment</span>`;
      });
  }

  function getAverageRate(reviews) {
    if (!reviews || reviews.length === 0) return 0;

    // Convert all rates to numbers and filter out invalid ones
    const rates = reviews
      .map((r) => Number(r.rate))
      .filter((rate) => !isNaN(rate));

    if (rates.length === 0) return 0;

    const sum = rates.reduce((acc, rate) => acc + rate, 0);
    return sum / rates.length;
  }

  function getStarRating(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.25 && rating % 1 < 0.75 ? 1 : 0;
    const empty = 5 - full - half;

    const stars =
      '<i class="bi bi-star-fill"></i>'.repeat(full) +
      (half ? '<i class="bi bi-star-half"></i>' : "") +
      '<i class="bi bi-star"></i>'.repeat(empty);

    return `<div class="d-flex text-warning me-2">${stars}</div><span>${rating.toFixed(
      1
    )}/5</span>`;
  }

  function generateSizeButtonsHTML(sizes) {
    return Object.keys(sizes)
      .map(
        (size) => `
      <button class="btn btn-outline-secondary rounded-pill size-btn" data-size="${size}">
        ${size}
      </button>
    `
      )
      .join("");
  }

  function generateColorButtonsHTML(colors) {
    return colors
      .map(
        (color, index) => `
      <button
        class="btn rounded-circle color-btn"
        data-index="${index}"
        style="width:32px; height:32px; background-color:${color.hex}"
        title="${color.name}"
      ></button>
    `
      )
      .join("");
  }

  function setupColorButtonEvents(colors) {
    const buttons = document.querySelectorAll(".color-btn");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((btn) => btn.classList.remove("selected"));
        button.classList.add("selected");

        const index = parseInt(button.dataset.index, 10);
        const color = colors[index];

        document.getElementById("imgFront").style.display = "block";
        document.getElementById("imgFront").src = color.image_urls[0] || "";
        document.getElementById("imgSide").style.display = "block";
        document.getElementById("imgSide").src = color.image_urls[1] || "";
        document.getElementById("imgBack").style.display = "block";
        document.getElementById("imgBack").src = color.image_urls[2] || "";

        selectedItem.color = color.name;

        document.getElementById("displaySizes").innerHTML =
          generateSizeButtonsHTML(color.sizes);
        setupSizeButtonEvents();
        setupImageClickEvents();
      });
    });
  }

  function setupSizeButtonEvents() {
    const sizeButtons = document.querySelectorAll(".size-btn");
    sizeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        sizeButtons.forEach((btn) => btn.classList.remove("selected"));
        button.classList.add("selected");
        selectedItem.size = button.innerText;
      });
    });
    document.querySelector(".size-btn").click();
  }

  function setupImageClickEvents() {
    const imgIds = ["imgFront", "imgSide", "imgBack"];
    const imgContainer = document.getElementById("imgContainer");
    const imgPlaceholder = document.querySelector("#imgPlaceholder");

    imgIds.forEach((id) => {
      const img = document.getElementById(id);
      if (img) {
        img.style.cursor = "pointer";
        img.addEventListener("click", () => {
          imgPlaceholder.style.display = "none";
          imgContainer.src = img.src;
          imgContainer.style.display = "block";
        });
      }
    });
    document.querySelector("#imgFront").click();
  }

  function generateStars(rate) {
    rate = parseFloat(rate);
    const fullStars = Math.floor(rate);
    const halfStar = rate % 1 >= 0.25 && rate % 1 < 0.75;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      '<div class="d-flex text-warning mb-3" id="userReview">' +
      '<i class="bi bi-star-fill"></i>'.repeat(fullStars) +
      (halfStar ? '<i class="bi bi-star-half"></i>' : "") +
      '<i class="bi bi-star"></i>'.repeat(emptyStars) +
      "</div>"
    );
  }

  function formatDateFromTimestamp(createdAt) {
    const date = new Date(createdAt.seconds * 1000);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function renderReviews(container, reviews) {
    container.innerHTML = "";
    const reviewsCount = document.getElementById("reviewsCount");
    reviewsCount.innerText = `(${reviews.length})`;
    reviews.forEach((review) => {
      const starsHtml = generateStars(review.rate);
      const formattedDate = formatDateFromTimestamp(review.createdAt);

      const html = `
        <div class="col-md-6 mb-4">
          <div class="card p-4 h-100">
            ${starsHtml}
            <div class="mb-3">
              <div class="d-flex align-items-center">
                <h6 class="fw-bold mb-0 me-2">${review.displayName}</h6>
                <span class="badge bg-success rounded-circle p-1">
                  <i class="bi bi-check"></i>
                </span>
              </div>
              <p class="text-muted mt-2">
                "${review.message}"
              </p>
            </div>
            <div class="d-flex justify-content-between text-muted">
              <small>Posted on ${formattedDate}</small>
            </div>
          </div>
        </div>
      `;
      container.insertAdjacentHTML("beforeend", html);
    });
  }
};
