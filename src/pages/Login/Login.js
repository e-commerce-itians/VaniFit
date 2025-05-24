import { signInWithEmailAndPassword } from "firebase/auth";
import { observer } from "../../observer";
import {
  firebaseAuthErrors,
  signInWithGoogle,
  validateData,
} from "../../utils/userManagement";
import "./Login.css";

const componentID = "login";

export default function Login() {
  observer(componentID, compLoaded);
  return /*html*/ `
    <div component="${componentID}">
      <div class="container my-5">
        <div class="row justify-content-center align-items-center mt-5">
          <div
            id="loginError"
            class="alert alert-danger mb-2 text-center d-none col-10 col-md-7 col-lg-5 animate__animated animate__fadeInDown"
            role="alert"
          ></div>
        </div>
        <div class="row justify-content-center align-items-center">
          <div
            class="login-card bg-body-secondary col-10 col-md-7 col-lg-5 m-3 p-4 rounded-4 shadow animate__animated animate__fadeInUp"
          >
            <form id="loginForm" novalidate autocomplete="on">
              <h2 class="mb-4 text-center fw-bold login-title animate__animated animate__fadeIn">Welcome Back</h2>
              <div class="mb-3 position-relative">
                <label for="email" class="form-label fw-semibold"
                  >Email<span class="text-danger ms-1">*</span></label
                >
                <input
                  type="email"
                  name="email"
                  id="email"
                  class="form-control login-input"
                  placeholder="user@example.com"
                  required
                />
                <div class="invalid-feedback" id="emailError"></div>
              </div>
              <div class="mb-3 position-relative">
                <label for="password" class="form-label fw-semibold"
                  >Password<span class="text-danger ms-1">*</span></label
                >
                <input
                  type="password"
                  name="password"
                  id="password"
                  class="form-control login-input"
                  placeholder="Enter your password"
                  required
                />
                <div class="invalid-feedback" id="passwordError"></div>
              </div>
              <div class="mb-3 d-flex flex-column gap-2">
                <button
                  type="submit"
                  id="loginBtn"
                  class="btn btn-dark d-block w-100 my-2 login-btn animate__animated animate__pulse"
                >
                  <i class="fa-solid fa-envelope me-1"></i>
                  <span class="d-none d-sm-inline">Login with Email</span>
                </button>
                <div class="or-divider my-2 text-center text-muted">or</div>
                <button
                  type="button"
                  id="signInWithGoogleBtn"
                  class="btn btn-outline-dark d-block w-100 my-2 login-btn animate__animated animate__pulse"
                >
                  <i class="fa-brands fa-google me-1"></i>
                  <span class="d-none d-sm-inline">Login with Google</span>
                </button>
              </div>
              <div class="text-center mt-3">
                <span class="text-muted">
                  Don't have an account?
                  <a
                    href="./register"
                    class="text-decoration-underline"
                    data-link
                    >Signup</a
                  >
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
}

const compLoaded = () => {
  // block login page page for registered user
  if (App.firebase.user.uid) {
    App.navigator("/");
    return;
  }

  const loginForm = document.querySelector("#loginForm");
  const emailInput = document.querySelector("#email");
  const passwordInput = document.querySelector("#password");

  const emailError = document.querySelector("#emailError");
  const passwordError = document.querySelector("#passwordError");
  const loginError = document.querySelector("#loginError");

  const loginBtn = document.querySelector("#loginBtn");
  const signInWithGoogleBtn = document.querySelector("#signInWithGoogleBtn");

  // change google signin button styling while waiting for response
  signInWithGoogleBtn.addEventListener("click", async () => {
    signInWithGoogleBtn.disabled = true;
    signInWithGoogleBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Signing in...`;
    try {
      Array.from(loginForm.elements).forEach((item) => (item.disabled = true));
      loginForm.classList.add("was-validated");
      await signInWithGoogle();
      App.navigator("/");
    } catch (error) {
      Array.from(loginForm.elements).forEach((item) => (item.disabled = false));
      loginForm.classList.remove("was-validated");
      loginError.textContent =
        firebaseAuthErrors[error.code] || firebaseAuthErrors["default"];
      loginError.classList.remove("d-none");
    }
    signInWithGoogleBtn.disabled = false;
    signInWithGoogleBtn.innerHTML = `<i class="fa-brands fa-google mx-1"></i><span class="d-none d-sm-inline">Login with Google</span>`;
  });

  // event listeners
  emailInput.addEventListener("input", () => {
    validateData(emailInput.value.trim(), emailInput, emailError, "email");
  });

  passwordInput.addEventListener("input", () => {
    validateData(passwordInput.value, passwordInput, passwordError, "password");
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    const formIsValid =
      validateData(email, emailInput, emailError, "email") &&
      validateData(password, passwordInput, passwordError, "password");

    if (!formIsValid) return;

    Array.from(loginForm.elements).forEach((item) => (item.disabled = true));
    loginForm.classList.add("was-validated");
    loginBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Logging in...`;

    signInWithEmailAndPassword(App.firebase.auth, email, password)
      .then(() => {
        App.navigator("/");
      })
      .catch((error) => {
        // enable inputs and update error state
        Array.from(e.target.elements).forEach(
          (item) => (item.disabled = false)
        );
        loginForm.classList.remove("was-validated");
        loginBtn.innerHTML = `<i class="fa-solid fa-envelope mx-1"></i><span class="d-none d-sm-inline">Login with Email</span>`;
        loginError.textContent =
          firebaseAuthErrors[error.code] || firebaseAuthErrors["default"];
        loginError.classList.remove("d-none");
      });
  });
};
