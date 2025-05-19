import "./Footer.css";
import { observer } from "../../observer";
const componentID = "footer";

export default function Footer() {
  observer(componentID, compLoaded);
  return /*html*/ ` <div component="${componentID}">
    <!-- Newsletter -->
    <div class="bg-dark text-white py-5 mb-5">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h2 class="fw-bold">STAY UP TO DATE ABOUT OUR LATEST OFFERS</h2>
        </div>
        <div class="col-md-6">
          <div class="mb-3">
            <div class="input-group rounded-pill">
              <span class="input-group-text bg-white border-0">
                <i class="fas fa-envelope text-muted"></i>
              </span>
              <input
                type="email"
                class="form-control border-0"
                placeholder="Enter your email address"
              />
            </div>
          </div>
          <button class="btn btn-light rounded-pill w-100">
            Subscribe to Newsletter
          </button>
        </div>
      </div>
    </div>
    </div>

    <!-- Footer -->
    <div class="container my-5">
    <div class="row">
      <div class="col-md-3 mb-4">
        <h3 class="fw-bold mb-3">${App.title}</h3>
        <p class="text-muted">
          We have clothes that suits your style and which you're proud to
          wear. From women to men.
        </p>
        <div class="d-flex gap-3">
          <a href="#" class="text-dark"><i class="fab fa-twitter"></i></a>
          <a href="#" class="text-dark"><i class="fab fa-facebook-f"></i></a>
          <a href="#" class="text-dark"><i class="fab fa-instagram"></i></a>
          <a href="#" class="text-dark"><i class="fab fa-github"></i></a>
        </div>
      </div>

      <div class="col-md-2 mb-4">
        <h6 class="text-uppercase fw-bold mb-3">Company</h6>
        <ul class="list-unstyled text-muted">
          <li class="mb-2"><a href="#" class="text-muted text-decoration-none">About</a></li>
          <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Features</a></li>
          <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Works</a></li>
          <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Career</a></li>
        </ul>
      </div>

      <div class="col-md-2 mb-4">
        <h6 class="text-uppercase fw-bold mb-3">Help</h6>
        <ul class="list-unstyled text-muted">
          <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Customer Support</a></li>
          <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Delivery Details</a></li>
          <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Terms & Conditions</a></li>
          <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Privacy Policy</a></li>
        </ul>
      </div>

      <div class="col-md-2 mb-4">
        <h6 class="text-uppercase fw-bold mb-3">FAQ</h6>
        <ul class="list-unstyled text-muted">
          <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Account</a></li>
          <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Manage Deliveries</a></li>
          <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Orders</a></li>
          <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Payments</a></li>
        </ul>
      </div>

      <div class="col-md-3 mb-4">
        <h6 class="text-uppercase fw-bold mb-3">Resources</h6>
        <ul class="list-unstyled text-muted">
          <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Free eBooks</a></li>
          <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Development Tutorial</a></li>
          <li class="mb-2"><a href="#" class="text-muted text-decoration-none">How to - Blog</a></li>
          <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Youtube Playlist</a></li>
        </ul>
      </div>
    </div>

    <hr />

    <div class="d-flex flex-column flex-md-row justify-content-between align-items-center">
      <p class="text-muted mb-3 mb-md-0">&copy; 2025 ${App.title} All rights reserved</p>
      <div class="d-flex gap-2">
        <i class="fab fa-cc-visa fa-2x text-muted"></i>
        <i class="fab fa-cc-mastercard fa-2x text-muted"></i>
        <i class="fab fa-cc-paypal fa-2x text-muted"></i>
        <i class="fab fa-cc-apple-pay fa-2x text-muted"></i>
        <i class="fab fa-google-pay fa-2x text-muted"></i>
      </div>
    </div>
    </div>
  </div>`;
}

//Javascript code to be executed once the home component is loaded
const compLoaded = () => {};
