import { signInWithEmailAndPassword } from "firebase/auth";
import { observer } from "../../observer";
import {
  googleSignin,
  validateEmail,
  validatePassword,
} from "../../utils/loginRegisterUtils";

const componentID = "login";

export default function Login() {
  observer(componentID, compLoaded);
  return /*html*/ `
    <div component="${componentID}">
      <div class="container">
        <div class="row justify-content-center align-items-center mt-5">
          <div
            class="bg-body-secondary col-10 col-md-7 col-lg-5 m-3 p-4 rounded-4"
          >
            <form id="loginForm" novalidate>
              <h2 class="mb-4 text-center">Login</h2>
              <div class="mb-3">
                <label for="email" class="form-label"
                  >Email<span class="text-danger">*</span></label
                >
                <input
                  type="email"
                  id="email"
                  class="form-control"
                  placeholder="user@example.com"
                  required
                />
                <div class="invalid-feedback" id="emailError"></div>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label"
                  >Password<span class="text-danger">*</span></label
                >
                <input
                  type="password"
                  id="password"
                  class="form-control"
                  placeholder="enter your password"
                  required
                />
                <div class="invalid-feedback" id="passwordError"></div>
              </div>
              <div class="mb-3">
                <button
                  type="submit"
                  id="loginBtn"
                  class="btn btn-primary d-block w-100 my-2"
                >
                  <i class="fa-solid fa-envelope mx-1"></i>
                  <span class="d-none d-sm-inline">Login with Email</span>
                </button>
                <button
                  type="button"
                  id="googleSigninBtn"
                  class="btn btn-primary d-block w-100 my-2"
                >
                  <i class="fa-brands fa-google mx-1"></i>
                  <span class="d-none d-sm-inline">Login with Google</span>
                </button>
              </div>
              <div class="text-center">
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
              <div
                id="loginError"
                class="alert alert-danger mt-2 text-center d-none"
                role="alert"
              ></div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
}

const compLoaded = () => {
  const errors = {
    "auth/invalid-credentials": "Invalid credentials",
    "auth/invalid-email": "Invalid email address.",
    "auth/user-disabled": "Your account has been disabled.",
    "auth/user-not-found": "No user found with this email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/email-already-in-use": "Email is already in use.",
    "auth/weak-password": "Your password is too weak.",
    "auth/too-many-requests": "Too many attempts. Try again later.",
    "auth/network-request-failed":
      "Network error. Please check your internet connection.",
    "auth/internal-error":
      "An unexpected error occurred. Please try again later.",
  };

  const form = document.querySelector("#loginForm");
  const emailInput = document.querySelector("#email");
  const passwordInput = document.querySelector("#password");

  const emailError = document.querySelector("#emailError");
  const passwordError = document.querySelector("#passwordError");
  const loginError = document.querySelector("#loginError");

  const loginBtn = document.querySelector("#loginBtn");
  const googleBtn = document.querySelector("#googleSigninBtn");

  // change google signin button styling while waiting for response
  if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
      googleBtn.disabled = true;
      googleBtn.innerHTML =
        '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Signing in...';
      try {
        await googleSignin();
        App.navigator("/");
      } catch (error) {
        loginError.textContent =
          errors[error.message.toString()] || "An unknown error occurred";
        loginError.classList.remove("d-none");
      }
      googleBtn.disabled = false;
      googleBtn.innerHTML = `<i class="fa-brands fa-google mx-1"></i><span class="d-none d-sm-inline">Login with Google</span>`;
    });
  }

  // event listeners
  emailInput.addEventListener("input", () => {
    validateEmail(emailInput.value.trim(), emailInput, emailError);
  });

  passwordInput.addEventListener("input", () => {
    validatePassword(passwordInput.value, passwordInput, passwordError);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    const formIsValid =
      validateEmail(email, emailInput, emailError) &&
      validatePassword(password, passwordInput, passwordError);

    if (!formIsValid) {
      form.classList.add("was-validated");
      return;
    }

    Array.from(form.elements).forEach((item) => (item.disabled = true));
    form.classList.add("was-validated");
    loginBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Logging in...`;

    try {
      await signInWithEmailAndPassword(App.firebase.auth, email, password);
      App.navigator("/");
    } catch (error) {
      Array.from(e.target.elements).forEach((item) => (item.disabled = false));
      form.classList.add("was-validated");
      loginBtn.innerHTML = `<i class="fa-solid fa-envelope mx-1"></i><span class="d-none d-sm-inline">Login with Email</span>`;
      loginError.textContent =
        errors[error.message.toString()] || "An unknown error occurred";
      loginError.classList.remove("d-none");
    }
  });
};
