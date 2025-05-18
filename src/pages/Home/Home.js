import { observer } from "../../observer";
import "./Home.css"
const componentID = "home";

export default async function Home() {
  observer(componentID, compLoaded);
  return /*html*/ `


<section class="container py-5">
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
</section>
  <a></a>
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



  `;
}

//Javascript code to be executed once the home component is loaded
const compLoaded = () => {};
