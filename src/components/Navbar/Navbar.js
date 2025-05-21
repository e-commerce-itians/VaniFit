import { signOut } from "firebase/auth";
import { collection, getDocs, query } from "firebase/firestore";
import { observer } from "../../observer";
import "./Navbar.css";

const componentID = "navbar";

export default function Navbar() {
  observer(componentID, compLoaded);
  return /*html*/ `
    <div component="${componentID}">
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
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
          >
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
            <div class="m-auto my-3 my-lg-0 flex-grow-1">
              <form
                id="searchForm"
                class="w-100 position-relative"
                role="search"
              >
                <div class="input-group shadow-sm">
                  <span
                    class="input-group-text bg-dark text-white border-0 rounded-start"
                  >
                    <i class="fa-solid fa-search"></i>
                  </span>
                  <input
                    type="text"
                    id="searchInput"
                    class="form-control border-0 rounded-end"
                    placeholder="Search..."
                    aria-label="Search"
                  />
                </div>
                <div
                  id="searchResults"
                  class="position-absolute d-none z-3 w-100 bg-white rounded-bottom"
                ></div>
              </form>
            </div>
            <!-- Icons -->
            <div class="d-flex align-items-center">
              <!-- User Dropdown -->
              <div class="dropdown me-2">
                <a
                  href="#"
                  class="nav-link dropdown-toggle user-dropdown"
                  data-bs-toggle="dropdown"
                  role="button"
                >
                  ${
                    App.firebase.user.email
                      ? `<i class="fas fa-user me-2"></i>${App.firebase.user.displayName}`
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
                              <li><a class="dropdown-item" href="/orders" data-link><i class="fas fa-history me-2"></i>Order History</a></li>
                              <li><hr class="dropdown-divider"></li>
                              <li><a class="dropdown-item" id="logoutBtn" href="#" data-link><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>`
                      : ""
                  }
                </ul>
              </div>
              <a href="/cart" class="nav-link px-2 position-relative" data-link>
                <i class="fas fa-shopping-cart"></i>
                <span
                  class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  id="cartNavbar"
                >
                  ${App.updateCartCounter()}
                </span>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  `;
}

const compLoaded = async () => {
  const searchInput = document.querySelector("#searchInput");
  const searchResults = document.querySelector("#searchResults");
  const logoutBtn = document.querySelector("#logoutBtn");

  const q = query(collection(App.firebase.db, "products"));
  const querySnapshot = await getDocs(q);

  async function performSearch() {
    const searchText = searchInput.value.trim().toLowerCase();
    searchResults.innerHTML = ``;
    if (!searchText) {
      searchResults.classList.add("d-none");
      return;
    }
    try {
      let found = false;

      querySnapshot.forEach((doc) => {
        const product = doc.data();
        const name = product.name?.toLowerCase();

        if (name && name.includes(searchText)) {
          found = true;

          const resultItem = document.createElement("div");
          resultItem.classList.add("search-result-item");
          resultItem.textContent = product.name;

          resultItem.addEventListener("click", () => {
            App.navigator(`/product/${doc.id}`);
          });

          searchResults.appendChild(resultItem);
        }
      });

      if (found) {
        searchResults.classList.add("d-block");
        searchResults.classList.remove("d-none");
      } else {
        searchResults.classList.remove("d-block");
        searchResults.classList.add("d-none");
      }
    } catch (error) {
      searchResults.classList.add("d-none");
    }
  }

  searchInput.addEventListener("input", performSearch);
  searchInput.addEventListener("focus", performSearch);

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        await signOut(App.firebase.auth);
        App.clearCart();
        App.navigator("/");
      } catch (error) {
        App.navigator("/");
      }
    });
  }
};
