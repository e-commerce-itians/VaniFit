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
      <h1 id="logo-font" class="fw-bold">Find Clothes<br>That Matches Your Style</h1>
      <p class="text-muted">
        Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
      </p>
      <a href="#" class="btn btn-dark btn-lg mt-3">Shop Now</a>

      <!-- Stats -->
      <div class="row mt-4 text-center">
        <div class="col-4">
          <h5 class="mb-0">200+</h5>
          <small class="text-muted">Brands</small>
        </div>
        <div class="col-4">
          <h5 class="mb-0">2,000+</h5>
          <small class="text-muted">Products</small>
        </div>
        <div class="col-4">
          <h5 class="mb-0">30,000+</h5>
          <small class="text-muted">Customers</small>
        </div>
      </div>
    </div>

    <!-- Image Section -->
    <div class="col-md-6 text-center mt-4 mt-md-0">
      <img src="images/hero.jpg" class="img-fluid" alt="Models">
    </div>
  </div>
</section>

<!-- Brand Logos -->
<div class="bg-black text-white py-3">
  <div class="container d-flex flex-wrap justify-content-center gap-4">
    <span class="fw-bold">VERSACE</span>
    <span class="fw-bold">ZARA</span>
    <span class="fw-bold">GUCCI</span>
    <span class="fw-bold">PRADA</span>
    <span class="fw-bold">Calvin Klein</span>
  </div>
</div>


  `;
}

//Javascript code to be executed once the home component is loaded
const compLoaded = () => { };
