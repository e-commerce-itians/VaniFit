import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { observer } from "../../observer";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "../../utils/loginRegister";

import "./Register.css";

const componentID = "register";

export default function Register() {
  observer(componentID, compLoaded);
  return /*html*/ `
    <div component="${componentID}">
      <div class="container">
        <div class="row justify-content-center align-items-center mt-5">
          <div
            class="bg-body-tertiary p-5 col-12 col-md-10 col-lg-8 rounded-4 shadow-sm"
          >
            <form id="registerForm" novalidate>
              <h2 class="mb-4 text-center">Register</h2>
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
                <label for="confirm-password" class="form-label"
                  >Confirm Password<span class="text-danger">*</span></label
                >
                <input
                  type="password"
                  id="confirmPassword"
                  class="form-control"
                  placeholder="confirm password"
                  required
                />
                <div class="invalid-feedback" id="confirmPasswordError"></div>
              </div>
              <div class="mb-3">
                <button
                  type="submit"
                  id="registerBtn"
                  class="btn d-block w-100 my-2"
                >
                  <i class="fa-solid fa-envelope mx-1"></i
                  ><span class="d-none d-sm-inline">Register with Email</span>
                </button>
              </div>
              <div class="text-center">
                <span class="text-muted">
                  Already have an account?
                  <a href="./login" class="text-decoration-underline" data-link
                    >Login</a
                  >
                </span>
              </div>
              <div
                id="registerError"
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
  const form = document.querySelector("#registerForm");
  const emailInput = document.querySelector("#email");
  const passwordInput = document.querySelector("#password");
  const confirmPasswordInput = document.querySelector("#confirmPassword");

  const emailError = document.querySelector("#emailError");
  const passwordError = document.querySelector("#passwordError");
  const confirmPasswordError = document.querySelector("#confirmPasswordError");
  const registerError = document.querySelector("#registerError");

  const registerBtn = document.querySelector("#registerBtn");

  // event listeners
  emailInput.addEventListener("input", () => {
    validateEmail(emailInput.value.trim(), emailInput, emailError);
  });

  passwordInput.addEventListener("input", () => {
    validatePassword(passwordInput.value, passwordInput, passwordError);
  });

  confirmPasswordInput.addEventListener("input", () => {
    validateConfirmPassword(
      passwordInput.value,
      confirmPasswordInput.value,
      confirmPasswordInput,
      confirmPasswordError
    );
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    const formIsValid =
      validateEmail(email, emailInput, emailError) &&
      validatePassword(password, passwordInput, passwordError) &&
      validateConfirmPassword(
        password,
        confirmPassword,
        confirmPasswordInput,
        confirmPasswordError
      );

    if (!formIsValid) {
      form.classList.add("was-validated");
      return;
    }

    // disable inputs and create spinner effect while resolving
    Array.from(form.elements).forEach((item) => (item.disabled = true));
    form.classList.add("was-validated");
    registerBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Signing up...`;

    try {
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth, email, password);
      App.navigator("/");
    } catch (error) {
      // enable inputs and update error state
      Array.from(form.elements).forEach((item) => (item.disabled = false));
      form.classList.add("was-validated");
      registerBtn.innerHTML = `<i class="fa-solid fa-envelope mx-1"></i><span class="d-none d-sm-inline">Register with Email</span>`;
      registerError.textContent = `Invalid email or password`;
      registerError.classList.remove("d-none");
    }
  });
};
