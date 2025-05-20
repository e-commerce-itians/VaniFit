import "./Navbar.css";
import { observer } from "../../observer";
import { signOut } from "firebase/auth";
const componentID = "navbar";

export default function Navbar() {
  observer(componentID, compLoaded);
  return /*html*/ `
    <div component="${componentID}">
    <!-- Top Black Bar -->
    ${
      !App.firebase.user.email
        ? `<div class="bg-black py-2 d-none d-lg-block">
        <div class="container text-center text-white">
            <span>Sign up and get 20% off to your first order. <a href="/register" class="text-white fw-bold" data-link>Sign Up Now</a></span>
        </div>
    </div>`
        : ""
    }

    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg bg-white shadow-sm">
        <div class="container">
            <a class="navbar-brand fw-bold" href="/" data-link>${App.title}</a>
            
            <!-- Mobile Toggle Button -->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
                <span class="navbar-toggler-icon"></span>
            </button>
            
            <!-- Navbar Content -->
            <div class="collapse navbar-collapse" id="navbarContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link" href="/shop" data-link>Shop</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/shop/male" data-link>Men</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/shop/female" data-link>Women</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/shop/children" data-link>Kids</a>
                    </li>
                </ul>
                
                <!-- Search Bar - Visible on larger screens -->
                <form class="d-none d-lg-flex mx-4 flex-grow-1">
                    <div class="input-group bg-light rounded-pill">
                        <span class="input-group-text bg-transparent border-0 ps-3">
                            <i class="fas fa-search text-muted"></i>
                        </span>
                        <input type="text" class="form-control bg-transparent border-0" placeholder="Search for products...">
                    </div>
                </form>
                
                <!-- Icons -->
                <div class="d-flex align-items-center">

                    <!-- User Dropdown -->
                    <div class="dropdown me-2">
                        <a class="nav-link dropdown-toggle user-dropdown" href="#" role="button" data-bs-toggle="dropdown">
                             ${
                               App.firebase.user.email
                                 ? `<i class="fas fa-user me-2"></i>${App.firebase.user.email}`
                                 : `<i class="fas fa-user me-2"></i>Login/Register`
                             }
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end">
                            ${
                              !App.firebase.user.email
                                ? `
                              <li><h6 class="dropdown-header">Account</h6></li>
                              <li><a class="dropdown-item" href="/login" data-link><i class="fas fa-sign-in-alt me-2"></i>Login</a></li>
                              <li><a class="dropdown-item" href="/register" data-link><i class="fas fa-user-plus me-2"></i>Register</a></li>
                              `
                                : ""
                            }
                            ${
                              App.firebase.user.email
                                ? `
                              <li><a class="dropdown-item" href="/profile" data-link><i class="fas fa-user-circle me-2"></i>My Account</a></li>
                              <li><a class="dropdown-item" href="/wishlist" data-link><i class="fas fa-heart me-2"></i>Wishlist</a></li>
                              <li><a class="dropdown-item" href="/orders" data-link><i class="fas fa-history me-2"></i>Order History</a></li>
                              <li><hr class="dropdown-divider"></li>
                              <li><a class="dropdown-item" id="logoutBtn" href="#" data-link><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>`
                                : ""
                            }
                        </ul>
                    </div>

                    <a href="/cart" class="nav-link px-2 position-relative" data-link>
                        <i class="fas fa-shopping-cart"></i>
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" id="cartNavbar">
                            ${App.updateCartCounter()}
                        </span>
                    </a>
                    
                </div>
            </div>
            
            <!-- Mobile Search - Visible only on small screens -->
            <form class="d-lg-none mt-3 w-100">
                <div class="input-group bg-light rounded-pill">
                    <span class="input-group-text bg-transparent border-0 ps-3">
                        <i class="fas fa-search text-muted"></i>
                    </span>
                    <input type="text" class="form-control bg-transparent border-0" placeholder="Search for products...">
                </div>
            </form>
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
        App.navigator("/");
      } catch (error) {}
    });
  }
};
