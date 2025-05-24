import { observer } from "../../observer";
import "./Footer.css";
const componentID = "footer";

export default function Footer() {
  observer(componentID, compLoaded);
  return /*html*/ ` <div component="${componentID}" class="footer-main-bg">
    <div class="footer-newsletter-card mb-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6 mb-4 mb-md-0">
            <h2 class="fw-bold">Stay up to date with our latest offers</h2>
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
    <div class="container">
      <div class="row">
        <div class="col-md-3 mb-4">
          <h3 class="fw-bold mb-3">${App.title}</h3>
          <p class="text-muted">
            We have clothes that suits your style and which you're proud to
            wear. From women to men.
          </p>
          <div class="footer-socials d-flex gap-3 mt-3">
            <a href="#" onclick="event.preventDefault()"
              ><i class="fab fa-twitter"></i
            ></a>
            <a href="#" onclick="event.preventDefault()"
              ><i class="fab fa-facebook-f"></i
            ></a>
            <a href="#" onclick="event.preventDefault()"
              ><i class="fab fa-instagram"></i
            ></a>
            <a href="#" onclick="event.preventDefault()"
              ><i class="fab fa-github"></i
            ></a>
          </div>
        </div>

        <div class="col-md-2 mb-4">
          <h6 class="footer-section-title">Company</h6>
          <ul class="footer-link-list list-unstyled">
            <li class="mb-2">
              <a href="#" onclick="event.preventDefault()">About</a>
            </li>
            <li class="mb-2">
              <a href="#" onclick="event.preventDefault()">Features</a>
            </li>
            <li class="mb-2">
              <a href="#" onclick="event.preventDefault()">Works</a>
            </li>
            <li class="mb-2">
              <a href="#" onclick="event.preventDefault()">Career</a>
            </li>
          </ul>
        </div>

        <div class="col-md-2 mb-4">
          <h6 class="footer-section-title">Help</h6>
          <ul class="footer-link-list list-unstyled">
            <li class="mb-2">
              <a href="#" onclick="event.preventDefault()">Customer Support</a>
            </li>
            <li class="mb-2">
              <a href="#" onclick="event.preventDefault()">Delivery Details</a>
            </li>
            <li class="mb-2">
              <a href="#" onclick="event.preventDefault()"
                >Terms & Conditions</a
              >
            </li>
            <li class="mb-2">
              <a href="#" onclick="event.preventDefault()">Privacy Policy</a>
            </li>
          </ul>
        </div>

        <div class="col-md-2 mb-4">
          <h6 class="footer-section-title">FAQ</h6>
          <ul class="footer-link-list list-unstyled">
            <li class="mb-2">
              <a href="#" onclick="event.preventDefault()">Account</a>
            </li>
            <li class="mb-2">
              <a href="#" onclick="event.preventDefault()">Manage Deliveries</a>
            </li>
            <li class="mb-2">
              <a href="#" onclick="event.preventDefault()">Orders</a>
            </li>
            <li class="mb-2">
              <a href="#" onclick="event.preventDefault()">Payments</a>
            </li>
          </ul>
        </div>

        <div class="col-md-3 mb-4">
          <h6 class="footer-section-title">Resources</h6>
          <ul class="footer-link-list list-unstyled">
            <li class="mb-2">
              <a href="#" onclick="event.preventDefault()">Free eBooks</a>
            </li>
            <li class="mb-2">
              <a href="#" onclick="event.preventDefault()"
                >Development Tutorial</a
              >
            </li>
            <li class="mb-2">
              <a href="#" onclick="event.preventDefault()">How to - Blog</a>
            </li>
            <li class="mb-2">
              <a href="#" onclick="event.preventDefault()">Youtube Playlist</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="mb-3 mb-md-0">&copy; 2025 ${App.title} All rights reserved</p>
        <div class="footer-payments d-flex gap-2">
          <i class="fab fa-cc-visa"></i>
          <i class="fab fa-cc-mastercard"></i>
          <i class="fab fa-cc-paypal"></i>
          <i class="fab fa-cc-apple-pay"></i>
          <i class="fab fa-google-pay"></i>
        </div>
      </div>
    </div>
  </div>`;
}

//Javascript code to be executed once the home component is loaded
const compLoaded = () => {};
