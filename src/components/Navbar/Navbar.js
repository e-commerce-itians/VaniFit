import "./Navbar.css";
import { observer } from "../../observer";
import { signOut } from "firebase/auth";
const componentID = "navbar";

export default function Navbar() {
  observer(componentID, compLoaded);
  return /*html*/ `
    <div component="${componentID}">
      <nav class="navbar">
        <input type="checkbox" id="mobile-menu-toggle" />
        <label for="mobile-menu-toggle" class="hamburger-menu">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </label>
        <div class="navbar-logo">
          <a href="/" data-link
            >${App.title}</a
          >
        </div>
        <div class="search-container">
          <input
            type="text"
            placeholder="Search for products, brands and more"
          />
          <button type="submit" class="btn btn-dark">
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
        <div class="navbar-links">
          <div class="nav-item">
            <a href="#" class="nav-link">
              <i class="fa-solid fa-heart"></i>
              Wishlist
            </a>
          </div>
          <div class="nav-item">
            <a href="#" class="nav-link">
              <i class="fa-solid fa-cart-shopping"></i>
              Cart
              <span
                style="background-color: #FF9900; color: #131921; border-radius:50%; padding: 2px 6px; font-size: 0.7rem; margin-left: 5px; font-weight: bold;"
                >1</span
              >
            </a>
          </div>
          ${
            !App.firebase.user.email
              ? /*html*/ `
                <div class="nav-item">
                    <a href="/login" class="nav-link" data-link>
                        Login
                    </a>
                </div>
                <div class="nav-item">
                    <a href="/register" class="nav-link" data-link>
                        Register
                    </a>
                </div>`
              : ""
          }
        </div>

        ${
          App.firebase.user.email
            ? /*html*/ `
            <div class="user-profile">
                <input type="checkbox" id="user-dropdown-toggle">
                <label for="user-dropdown-toggle" class="user-profile-trigger">
                    <div class="avatar">
                        <i class="fa-solid fa-user"></i>
                    </div>
                    <span class="username">Logged in as,  ${App.firebase.user.email}
                    </span> <i class="fa-solid fa-angle-down"></i>
                </label>
                <div class="dropdown-content">
                    <a href="/profile" data-link>Profile</a>
                    <a href="/" data-link id="logoutBtn">Logout</a>
                </div>
            </div>`
            : ""
        }
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
        App.navigator("/");
      } catch (error) {
        console.error(error);
      }
    });
  }
};
