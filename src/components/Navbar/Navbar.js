import "./Navbar.css";
import { observer } from "../../observer";
import { signOut } from "firebase/auth";
const componentID = "navbar";

export default function Navbar() {
  observer(componentID, compLoaded);
  return /*html*/ `
    <div component="${componentID}">
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand" href="/" data-link>${App.title}</a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul
              class="navbar-nav me-auto mb-2 mb-lg-0 justify-content-evenly w-100"
            >
              <li class="nav-item dropdown">
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Shop
                </a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#" data-link>Men</a></li>
                  <li><a class="dropdown-item" href="#">Women</a></li>
                  <li><a class="dropdown-item" href="#">Children</a></li>
                </ul>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link active"
                  aria-current="page"
                  href="#"
                  data-link
                  >On Sale</a
                >
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" data-link>New Arrivals</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" data-link>Brands</a>
              </li>
            </ul>
            <ul class="navbar-nav ">
              ${
                App.firebase.user.email
                  ? /*html*/ `
                  <li class="nav-item me-3">
                    <a id="cartBtn" class="nav-link" aria-current="page" href="/cart" data-link>
                      <i class="fa-solid fa-cart-shopping"></i>
                    </a>
                  </li>
                  <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <span>${App.firebase.user.displayName}</span>
                    </a>
                    <ul class="dropdown-menu">
                      <li><a class="dropdown-item" href="/profile" data-link>Profile</a></li>
                      <li><a id="logoutBtn" class="dropdown-item" href="/login" data-link>Log Out</a></li>
                    </ul>
                  </li>
                `
                  : /*html*/ `
                  <li class="nav-item me-3">
                    <a href="/login" class="nav-link" data-link>Login</a>
                  </li>
                  <li class="nav-item">
                    <a href="/register" class="nav-link" data-link>Register</a>
                  </li>
                `
              }
            </ul>
          </div>
        </div>
      </nav>
    </div>
  `;
}

const compLoaded = () => {
  const logoutBtn = document.querySelector("#logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        await signOut(App.firebase.auth);
        App.navigator("/login");
      } catch (error) {
        console.error(error);
      }
    });
    console.log(App.firebase.user);
  }
};
