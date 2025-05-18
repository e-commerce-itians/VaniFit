import { observer } from "../../observer";
import "./Home.css"
const componentID = "home";

export default async function Home() {
  observer(componentID, compLoaded);
  return /*html*/ `

<div id="hero">
<section class="container py-2">
  <div class="row align-items-center">
    <!-- Text Section -->
    <div class="col-md-6 text-center text-md-start">
      <h1 class="fw-bold">Find Clothes<br>That Matches Your Style</h1>
      <p class="text-muted">
        Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
      </p>
      <a href="#" class="btn btn-dark btn-lg mt-3">Shop Now</a>

      <!-- Stats -->
      <div class="row mt-4 text-center">
        <div class="col-4">
          <h3 class="mb-0">200+</h3>
          <small class="text-muted">Brands</small>
        </div>
        <div class="col-4">
          <h3 class="mb-0">2,000+</h3>
          <small class="text-muted">Products</small>
        </div>
        <div class="col-4">
          <h3 class="mb-0">30,000+</h3>
          <small class="text-muted">Customers</small>
        </div>
      </div>
    </div>

    <!-- Image Section -->
    <div class="col-md-6  mt-4 mt-md-0">
      <img src="images/hero.jpg"  alt="Models">
    </div>
  </div>
  </div>
</section>
<!-- Brand Logos -->
<div class="container-fluid bg-black py-4">
  <div class="d-flex flex-wrap justify-content-center align-items-center gap-5">
    <a href="#" class="text-white fs-3 fw-light text-decoration-none">VERSACE</a>
    <a href="#" class="text-white fs-3 fw-light text-decoration-none">ZARA</a>
    <a href="#" class="text-white fs-3 fw-light text-decoration-none">GUCCI</a>
    <a href="#" class="text-white fs-3 fw-bold text-decoration-none">PRADA</a>
    <a href="#" class="text-white fs-3 fw-light text-decoration-none">Calvin Klein</a>
  </div>
</div>
  <div class="container py-5">

    <!-- New Arrivals Section -->
    <div>
      <h2 class="section-title">NEW ARRIVALS</h2>
      <div id="new-arrivals" class="row g-4 justify-content-center">
        <!-- Placeholder cards -->
        <div class="col-6 col-md-4 col-lg-2">
          <div class="product-card">
            <div class="product-img placeholder-glow"></div>
            <p class="placeholder-glow"><span class="placeholder col-6"></span></p>
            <p class="placeholder-glow"><span class="placeholder col-4"></span></p>
            <p class="placeholder-glow"><span class="placeholder col-3"></span></p>
          </div>
        </div>
                <div class="col-6 col-md-4 col-lg-2">
          <div class="product-card">
            <div class="product-img placeholder-glow"></div>
            <p class="placeholder-glow"><span class="placeholder col-6"></span></p>
            <p class="placeholder-glow"><span class="placeholder col-4"></span></p>
            <p class="placeholder-glow"><span class="placeholder col-3"></span></p>
          </div>
        </div>
                <div class="col-6 col-md-4 col-lg-2">
          <div class="product-card">
            <div class="product-img placeholder-glow"></div>
            <p class="placeholder-glow"><span class="placeholder col-6"></span></p>
            <p class="placeholder-glow"><span class="placeholder col-4"></span></p>
            <p class="placeholder-glow"><span class="placeholder col-3"></span></p>
          </div>
        </div>
                <div class="col-6 col-md-4 col-lg-2">
          <div class="product-card">
            <div class="product-img placeholder-glow"></div>
            <p class="placeholder-glow"><span class="placeholder col-6"></span></p>
            <p class="placeholder-glow"><span class="placeholder col-4"></span></p>
            <p class="placeholder-glow"><span class="placeholder col-3"></span></p>
          </div>
        </div>
                <div class="col-6 col-md-4 col-lg-2">
          <div class="product-card">
            <div class="product-img placeholder-glow"></div>
            <p class="placeholder-glow"><span class="placeholder col-6"></span></p>
            <p class="placeholder-glow"><span class="placeholder col-4"></span></p>
            <p class="placeholder-glow"><span class="placeholder col-3"></span></p>
          </div>
        </div>

      </div>
      <div class="text-center mt-4">
        <button class="btn btn-outline-dark">View All</button>
      </div>
    </div>

    <hr class="my-5" />

    <!-- Top Selling Section -->
    <div>
      <h2 class="section-title">TOP SELLING</h2>
      <div id="top-selling" class="row g-4 justify-content-center">
        <!-- Placeholder cards -->
        <div class="col-6 col-md-4 col-lg-2">
          <div class="product-card">
            <div class="product-img placeholder-glow"></div>
            <p class="placeholder-glow"><span class="placeholder col-6"></span></p>
            <p class="placeholder-glow"><span class="placeholder col-4"></span></p>
            <p class="placeholder-glow"><span class="placeholder col-3"></span></p>
          </div>
        </div>
                <div class="col-6 col-md-4 col-lg-2">
          <div class="product-card">
            <div class="product-img placeholder-glow"></div>
            <p class="placeholder-glow"><span class="placeholder col-6"></span></p>
            <p class="placeholder-glow"><span class="placeholder col-4"></span></p>
            <p class="placeholder-glow"><span class="placeholder col-3"></span></p>
          </div>
        </div>
                <div class="col-6 col-md-4 col-lg-2">
          <div class="product-card">
            <div class="product-img placeholder-glow"></div>
            <p class="placeholder-glow"><span class="placeholder col-6"></span></p>
            <p class="placeholder-glow"><span class="placeholder col-4"></span></p>
            <p class="placeholder-glow"><span class="placeholder col-3"></span></p>
          </div>
        </div>
                <div class="col-6 col-md-4 col-lg-2">
          <div class="product-card">
            <div class="product-img placeholder-glow"></div>
            <p class="placeholder-glow"><span class="placeholder col-6"></span></p>
            <p class="placeholder-glow"><span class="placeholder col-4"></span></p>
            <p class="placeholder-glow"><span class="placeholder col-3"></span></p>
          </div>
        </div>
                <div class="col-6 col-md-4 col-lg-2">
          <div class="product-card">
            <div class="product-img placeholder-glow"></div>
            <p class="placeholder-glow"><span class="placeholder col-6"></span></p>
            <p class="placeholder-glow"><span class="placeholder col-4"></span></p>
            <p class="placeholder-glow"><span class="placeholder col-3"></span></p>
          </div>
        </div>
        
      </div>
      <div class="text-center mt-4">
        <button class="btn btn-outline-dark">View All</button>
      </div>
    </div>
  </div>
    <div class="container rounded-5" id="style-container">
    <h2 class="section-title py-3">BROWSE BY dress STYLE</h2>
    <div class="d-sm-block d-md-block d-lg-flex">
    <a href="#" class=""><img class="ms-5 " src="images/casual.png" class="rounded float-start" alt="..."></a>
    <a href="#" > <img class="ms-5" src="images/formal.png" class="rounded float-start" alt="..."></a>
    </div>
    <div class="d-sm-block d-md-block d-lg-flex">
    <a href="#"> <img class="ms-5 py-4" src="images/party.png" class="rounded float-start" alt="..."></a>
    <a href="#"> <img class="ms-5 py-4" src="images/gym.png" class="rounded float-start" alt="..."></a>
    </div>

    </div>
  `;
}

//Javascript code to be executed once the home component is loaded
const compLoaded = () => {};
