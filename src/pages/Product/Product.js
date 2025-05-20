import "./Product.css";
import Getdata from "../../utils/getData";
import { observer } from "../../observer";
import { doc, getDoc } from "firebase/firestore";
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
              <img style="height: 400px;" id="imgContainer">
            </div>
            <div class="row justify-content-around text-center">
              <div class="col-4">
                <img
                  class="bg-light rounded-3 mb-3"
                  style="height: 100px;"
                  id="imgFront"
                >
              </div>
              <div class="col-4">
                <img
                  class="bg-light rounded-3 mb-3"
                  style="height: 100px;"
                  id="imgSide"
                >
              </div>
              <div class="col-4">
                <img
                  class="bg-light rounded-3 mb-3"
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
        <ul class="nav nav-tabs border-0 justify-content-center">
          <li class="nav-item">
            <li class="nav-item me-1">
              <a class="nav-link text-muted" href="#">Product Details</a>
            </li>
            <a class="nav-link active text-dark fw-bold" href="#"
              >Rating & Reviews</a
            >
          </li>
          <li class="nav-item ms-1">
            <a class="nav-link text-muted" href="#">FAQs</a>
          </li>
        </ul>

        <hr class="mt-0" />

        <div class="d-flex justify-content-between mb-4">
          <h4 class="fw-bold">
            All Reviews <span class="text-muted">(1)</span>
          </h4>
          <div class="d-flex gap-2">
            <button class="btn btn-light rounded-pill">
              <i class="bi bi-funnel"></i>
            </button>
            <button class="btn btn-light rounded-pill">
              Latest <i class="bi bi-chevron-down"></i>
            </button>
            <button class="btn btn-dark rounded-pill">Write a Review</button>
          </div>
        </div>

        <!-- Reviews -->
        <div class="row">

          <div class="col-md-6 mb-4">
            <div class="card p-4">
              <div class="d-flex text-warning mb-3">
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-half"></i>
              </div>
              <div class="mb-3">
                <div class="d-flex align-items-center">
                  <h6 class="fw-bold mb-0 me-2">Samantha D.</h6>
                  <span class="badge bg-success rounded-circle p-1"
                    ><i class="bi bi-check"></i
                  ></span>
                </div>
                <p class="text-muted">
                  "I absolutely love this t-shirt! The design is unique and the
                  fabric feels so comfortable. As a fellow designer, I
                  appreciate the attention to detail. It's become my favorite
                  go-to shirt."
                </p>
              </div>
              <div class="d-flex justify-content-between text-muted">
                <small>Posted on August 14, 2023</small>
                <i class="bi bi-three-dots-vertical"></i>
              </div>
            </div>
          </div>

        </div>

        <div class="text-center my-5">
          <button class="btn btn-outline-dark rounded-pill px-5">
            Load More Reviews
          </button>
        </div>
      </div>

      <!-- You Might Also Like -->
      <div class="container my-5">
        <h2 class="text-center fw-bold mb-5">YOU MIGHT ALSO LIKE</h2>

        <div class="row">
        
          <div class="col-md-3 mb-4">
            <div class="card border-0">
              <div class="bg-light rounded-3" style="height: 300px;"></div>
              <div class="card-body">
                <h5 class="card-title fw-bold">Polo with Contrast Trims</h5>
                <div class="d-flex text-warning mb-2">
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star"></i>
                  <span class="text-dark ms-2">4.0/5</span>
                </div>
                <div class="d-flex align-items-center">
                  <h5 class="fw-bold me-2">$212</h5>
                  <h5 class="fw-bold text-decoration-line-through text-muted">
                    $242
                  </h5>
                  <span class="badge bg-danger bg-opacity-10 text-danger ms-2"
                    >-30%</span
                  >
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `;
}

//Javascript code to be executed once the home component is loaded
const compLoaded = async (id) => {
  App.cartAdd("123", "M", "red", 2);

  await getDoc(doc(App.firebase.db, "products", id))
    .then((res) => {
      let data = res.exists() ? res.data() : null;
      console.log(data);
      if (data) {
        const productTitle = document.querySelector("#productTitle");
        const productPrice = document.querySelector("#productPrice");
        const productDesc = document.querySelector("#productDesc");
        const productReview = document.querySelector("#productReview");

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

        //Product Review
        if (data.avgReview) {
          productReview.innerHTML = getStarRating(data.avgReview);
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
        App.navigator("/");
      }
    })
    .catch((error) => {});

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

    imgIds.forEach((id) => {
      const img = document.getElementById(id);
      if (img) {
        img.style.cursor = "pointer"; // optional: show pointer cursor
        img.addEventListener("click", () => {
          imgContainer.src = img.src;
        });
      }
    });
    document.querySelector("#imgFront").click();
  }
};
