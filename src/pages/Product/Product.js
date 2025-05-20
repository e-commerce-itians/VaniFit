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
              <a href="#" class="text-decoration-none text-muted">Shop</a>
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
                <span class="placeholder col-12 rounded-3" style="height: 400px;width: 100%;"></span>
              </p>
              <img class="rounded-3" style="height: 400px;width: 100%;object-fit: cover;display:none;" id="imgContainer">
            </div>
            <div class="row justify-content-around text-center">
              <div class="col-4">
                <img
                  class="rounded-3 mb-3"
                  style="height: 100px;"
                  id="imgFront"
                >
              </div>
              <div class="col-4">
                <img
                  class="rounded-3 mb-3"
                  style="height: 100px;"
                  id="imgSide"
                >
              </div>
              <div class="col-4">
                <img
                  class="rounded-3 mb-3"
                  style="height: 100px;"
                  id="imgBack"
                >
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
              <h3 class="fw-bold me-3" id="productPrice">
              </h3>
              <h3 class="fw-bold text-decoration-line-through text-muted" id="discountOldPrice">
              </h3>
              <span class="badge bg-danger bg-opacity-10 text-danger ms-2"
              id="discountPrecentage"></span
              >
            </div>

            <div class="text-muted mb-4" id="productDesc">
              <p class="d-block col-12 placeholder-glow">
                <span class="placeholder col-2"></span>
              </p>
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
  <ul class="nav nav-tabs border-0 justify-content-center" id="myTab" role="tablist">
    <li class="nav-item me-1" role="presentation">
      <button class="nav-link text-muted" id="product-tab" data-bs-toggle="tab" data-bs-target="#product" type="button" role="tab">Product Details</button>
    </li>
    <li class="nav-item me-1" role="presentation">
      <button class="nav-link active text-dark fw-bold" id="reviews-tab" data-bs-toggle="tab" data-bs-target="#reviews" type="button" role="tab" aria-selected="true">Rating & Reviews</button>
    </li>
    <li class="nav-item ms-1" role="presentation">
      <button class="nav-link text-muted" id="faqs-tab" data-bs-toggle="tab" data-bs-target="#faqs" type="button" role="tab">FAQs</button>
    </li>
  </ul>

  <hr class="mt-0" />

  <!-- Tab content -->
  <div class="tab-content" id="myTabContent">
    <!-- Product Details Tab -->
    <div class="tab-pane fade" id="product" role="tabpanel" aria-labelledby="product-tab">
      <!-- Product details content goes here -->
    </div>
    
    <!-- Reviews Tab (active by default) -->
    <div class="tab-pane fade show active" id="reviews" role="tabpanel" aria-labelledby="reviews-tab">
      <div class="d-flex justify-content-between mb-4">
        <h4 class="fw-bold">
          All Reviews <span class="text-muted" id="reviewsCount"></span>
        </h4>
        <div class="d-flex gap-2">
          <button class="btn btn-light rounded-pill">
            Latest <i class="bi bi-chevron-down"></i>
          </button>
          <button class="btn btn-dark rounded-pill">Write a Review</button>
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
    <div class="tab-pane fade" id="faqs" role="tabpanel" aria-labelledby="faqs-tab">
      <!-- FAQs content goes here -->
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
  `;
}

//Javascript code to be executed once the home component is loaded
const compLoaded = async (id) => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
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

        document.getElementById("imgFront").src = color.image_urls[0] || "";
        document.getElementById("imgSide").src = color.image_urls[1] || "";
        document.getElementById("imgBack").src = color.image_urls[2] || "";

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
          <div class="card p-4">
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
