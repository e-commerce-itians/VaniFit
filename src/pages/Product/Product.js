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
            <div class="mb-3">
              <div class="bg-light rounded-3" style="height: 300px;"></div>
            </div>
            <div class="row">
              <div class="col-4">
                <div
                  class="bg-light rounded-3 mb-3"
                  style="height: 100px;"
                ></div>
              </div>
              <div class="col-4">
                <div
                  class="bg-light rounded-3 mb-3"
                  style="height: 100px;"
                ></div>
              </div>
              <div class="col-4">
                <div
                  class="bg-light rounded-3 mb-3"
                  style="height: 100px;"
                ></div>
              </div>
            </div>
          </div>

          <!-- Product Details -->
          <div class="col-md-8">
            <h1 class="fw-bold" id="productTitle"></h1>

            <div class="d-flex align-items-center mb-3">
              <div class="d-flex text-warning me-2">
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-half"></i>
              </div>
              <span>4.5/5</span>
            </div>

            <div class="d-flex align-items-center mb-3">
              <h3 class="fw-bold me-3" id="productPrice"></h3>
              <h3 class="fw-bold text-decoration-line-through text-muted">
                $300
              </h3>
              <span class="badge bg-danger bg-opacity-10 text-danger ms-2"
                >-40%</span
              >
            </div>

            <p class="text-muted mb-4" id="productDesc">
            </p>

            <hr />

            <h6 class="text-muted mb-3">Select Colors</h6>
            <div class="d-flex gap-2 mb-4">
              <button
                class="btn btn-dark rounded-circle"
                style="width: 40px; height: 40px;"
              ></button>
              <button
                class="btn btn-primary rounded-circle"
                style="width: 40px; height: 40px;"
              ></button>
              <button
                class="btn btn-info rounded-circle"
                style="width: 40px; height: 40px;"
              ></button>
            </div>

            <h6 class="text-muted mb-3">Choose Size</h6>
            <div class="d-flex gap-2 mb-4">
              <button class="btn btn-outline-secondary rounded-pill">
                Small
              </button>
              <button class="btn btn-outline-secondary rounded-pill">
                Medium
              </button>
              <button class="btn btn-dark rounded-pill">Large</button>
              <button class="btn btn-outline-secondary rounded-pill">
                X-Large
              </button>
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
            <a class="nav-link text-muted" href="#">Product Details</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active text-dark fw-bold" href="#"
              >Rating & Reviews</a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link text-muted" href="#">FAQs</a>
          </li>
        </ul>

        <hr class="mt-0" />

        <div class="d-flex justify-content-between mb-4">
          <h4 class="fw-bold">
            All Reviews <span class="text-muted">(451)</span>
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

          <div class="col-md-6 mb-4">
            <div class="card p-4">
              <div class="d-flex text-warning mb-3">
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star"></i>
              </div>
              <div class="mb-3">
                <div class="d-flex align-items-center">
                  <h6 class="fw-bold mb-0 me-2">Ethan R.</h6>
                  <span class="badge bg-success rounded-circle p-1"
                    ><i class="bi bi-check"></i
                  ></span>
                </div>
                <p class="text-muted">
                  "This t-shirt is a must-have for anyone who appreciates good
                  design. The minimalistic yet stylish pattern caught my eye,
                  and the fit is perfect. I can see the designer's touch in
                  every aspect of this shirt."
                </p>
              </div>
              <div class="d-flex justify-content-between text-muted">
                <small>Posted on August 16, 2023</small>
                <i class="bi bi-three-dots-vertical"></i>
              </div>
            </div>
          </div>

          <div class="col-md-6 mb-4">
            <div class="card p-4">
              <div class="d-flex text-warning mb-3">
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star"></i>
              </div>
              <div class="mb-3">
                <div class="d-flex align-items-center">
                  <h6 class="fw-bold mb-0 me-2">Liam K.</h6>
                  <span class="badge bg-success rounded-circle p-1"
                    ><i class="bi bi-check"></i
                  ></span>
                </div>
                <p class="text-muted">
                  "This t-shirt is a fusion of comfort and creativity. The
                  fabric is soft, and the design speaks volumes about the
                  designer's skill. It's like wearing a piece of art that
                  reflects my passion for both design and fashion."
                </p>
              </div>
              <div class="d-flex justify-content-between text-muted">
                <small>Posted on August 18, 2023</small>
                <i class="bi bi-three-dots-vertical"></i>
              </div>
            </div>
          </div>

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
                  <h6 class="fw-bold mb-0 me-2">Alex M.</h6>
                  <span class="badge bg-success rounded-circle p-1"
                    ><i class="bi bi-check"></i
                  ></span>
                </div>
                <p class="text-muted">
                  "The t-shirt exceeded my expectations! The colors are vibrant
                  and the print quality is top-notch. Being a UI/UX designer
                  myself, I'm quite picky about aesthetics, and this t-shirt
                  definitely gets a thumbs up from me."
                </p>
              </div>
              <div class="d-flex justify-content-between text-muted">
                <small>Posted on August 15, 2023</small>
                <i class="bi bi-three-dots-vertical"></i>
              </div>
            </div>
          </div>

          <div class="col-md-6 mb-4">
            <div class="card p-4">
              <div class="d-flex text-warning mb-3">
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star"></i>
              </div>
              <div class="mb-3">
                <div class="d-flex align-items-center">
                  <h6 class="fw-bold mb-0 me-2">Olivia P.</h6>
                  <span class="badge bg-success rounded-circle p-1"
                    ><i class="bi bi-check"></i
                  ></span>
                </div>
                <p class="text-muted">
                  "As a UI/UX enthusiast, I value simplicity and functionality.
                  This t-shirt not only represents those principles but also
                  feels great to wear. It's evident that the designer poured
                  their creativity into making this t-shirt stand out."
                </p>
              </div>
              <div class="d-flex justify-content-between text-muted">
                <small>Posted on August 17, 2023</small>
                <i class="bi bi-three-dots-vertical"></i>
              </div>
            </div>
          </div>

          <div class="col-md-6 mb-4">
            <div class="card p-4">
              <div class="d-flex text-warning mb-3">
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
              </div>
              <div class="mb-3">
                <div class="d-flex align-items-center">
                  <h6 class="fw-bold mb-0 me-2">Ava H.</h6>
                  <span class="badge bg-success rounded-circle p-1"
                    ><i class="bi bi-check"></i
                  ></span>
                </div>
                <p class="text-muted">
                  "I'm not just wearing a t-shirt; I'm wearing a piece of design
                  philosophy. The intricate details and thoughtful layout of the
                  design make this shirt a conversation starter."
                </p>
              </div>
              <div class="d-flex justify-content-between text-muted">
                <small>Posted on August 19, 2023</small>
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

          <div class="col-md-3 mb-4">
            <div class="card border-0">
              <div class="bg-light rounded-3" style="height: 300px;"></div>
              <div class="card-body">
                <h5 class="card-title fw-bold">Gradient Graphic T-shirt</h5>
                <div class="d-flex text-warning mb-2">
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-half"></i>
                  <i class="bi bi-star"></i>
                  <span class="text-dark ms-2">3.5/5</span>
                </div>
                <h5 class="fw-bold">$145</h5>
              </div>
            </div>
          </div>

          <div class="col-md-3 mb-4">
            <div class="card border-0">
              <div class="bg-light rounded-3" style="height: 300px;"></div>
              <div class="card-body">
                <h5 class="card-title fw-bold">Polo with Tipping Details</h5>
                <div class="d-flex text-warning mb-2">
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-half"></i>
                  <span class="text-dark ms-2">4.5/5</span>
                </div>
                <h5 class="fw-bold">$180</h5>
              </div>
            </div>
          </div>

          <div class="col-md-3 mb-4">
            <div class="card border-0">
              <div class="bg-light rounded-3" style="height: 300px;"></div>
              <div class="card-body">
                <h5 class="card-title fw-bold">Black Stripped T-shirt</h5>
                <div class="d-flex text-warning mb-2">
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <span class="text-dark ms-2">5.0/5</span>
                </div>
                <div class="d-flex align-items-center">
                  <h5 class="fw-bold me-2">$120</h5>
                  <h5 class="fw-bold text-decoration-line-through text-muted">
                    $150
                  </h5>
                  <span class="badge bg-danger bg-opacity-10 text-danger ms-2"
                    >-40%</span
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
  await getDoc(doc(App.firebase.db, "products", id))
    .then((res) => {
      let data = res.exists() ? res.data() : null;
      console.log(data);
      if (data) {
        const productTitle = document.querySelector("#productTitle");
        const productPrice = document.querySelector("#productPrice");
        const productDesc = document.querySelector("#productDesc");

        if (productTitle && data.name) {
          productTitle.innerText = data.name;
        }

        if (productPrice && data.price) {
          productPrice.innerText = data.price + "$";
        }

        if (productDesc && data.productDesc) {
          productDesc.innerText = data.description;
        }
      } else {
        App.navigator("/");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
