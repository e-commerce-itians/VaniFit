import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { observer } from "../../observer";
import {
  firebaseAuthErrors,
  validateData,
  validatePasswordConfirmation,
  createUserDocument,
  updateUserDocument,
} from "../../utils/userManagement";
import "./Register.css";

const componentID = "register";

export default function Register() {
  observer(componentID, compLoaded);
  return /*html*/ `
    <div component="${componentID}">
      <div class="container my-5">
        <div class="row justify-content-center align-items-center">
          <div
            id="registerError"
            class="alert alert-danger text-center d-none"
            role="alert"
          ></div>
        </div>
        <div class="row justify-content-center align-items-center">
          <div
            class="register-card bg-body-secondary col-10 col-md-7 col-lg-5 m-3 p-4 rounded-4 shadow"
          >
            <form id="registerForm" novalidate autocomplete="on">
              <h2 class="mb-4 text-center fw-bold register-title">Create Account</h2>
              <div class="mb-3 position-relative">
                <label for="firstName" class="form-label fw-semibold"
                  >First Name<span class="text-danger">*</span></label
                >
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  class="form-control register-input"
                  placeholder="John"
                  required
                />
                <div class="invalid-feedback" id="firstNameError"></div>
              </div>
              <div class="mb-3 position-relative">
                <label for="lastName" class="form-label fw-semibold"
                  >Last Name<span class="text-danger">*</span></label
                >
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  class="form-control register-input"
                  placeholder="Doe"
                  required
                />
                <div class="invalid-feedback" id="lastNameError"></div>
              </div>
              <div class="mb-3 position-relative">
                <label for="email" class="form-label fw-semibold"
                  >Email<span class="text-danger">*</span></label
                >
                <input
                  type="email"
                  name="email"
                  id="email"
                  class="form-control register-input"
                  placeholder="user@example.com"
                  required
                />
                <div class="invalid-feedback" id="emailError"></div>
              </div>
              <div class="mb-3 position-relative">
                <label for="password" class="form-label fw-semibold"
                  >Password<span class="text-danger">*</span></label
                >
                <input
                  type="password"
                  name="password"
                  id="password"
                  class="form-control register-input"
                  placeholder="Enter your password"
                  required
                />
                <div class="invalid-feedback" id="passwordError"></div>
              </div>
              <div class="mb-3 position-relative">
                <label for="confirm-password" class="form-label fw-semibold"
                  >Confirm Password<span class="text-danger">*</span></label
                >
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  class="form-control register-input"
                  placeholder="Confirm password"
                  required
                />
                <div class="invalid-feedback" id="confirmPasswordError"></div>
              </div>
              <div class="mb-3 position-relative">
                <label for="phone" class="form-label fw-semibold"
                  >Phone Number<span class="text-danger">*</span></label
                >
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  class="form-control register-input"
                  placeholder="+20 123-4567-890"
                  required
                />
                <div class="invalid-feedback" id="phoneError"></div>
              </div>
              <div class="mb-3 position-relative">
                <label for="address" class="form-label fw-semibold"
                  >Address<span class="text-danger">*</span></label
                >
                <input
                  type="text"
                  name="address"
                  id="address"
                  class="form-control register-input"
                  placeholder="123 Main Street, City, State, ZIP"
                  required
                />
                <div class="invalid-feedback" id="addressError"></div>
              </div>
              <div class="mb-3 d-flex flex-column gap-2">
                <button
                  type="submit"
                  id="registerBtn"
                  class="btn btn-dark d-block w-100 my-2 register-btn"
                >
                  <i class="fa-solid fa-envelope me-1"></i>
                  <span class="d-none d-sm-inline">Register with Email</span>
                </button>
              </div>
              <div class="text-center mt-3">
                <span class="text-muted">
                  Already have an account?
                  <a href="./login" class="text-decoration-underline" data-link>Login</a>
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
  // block register page page for registered user
  if (App.firebase.user.uid) {
    App.navigator("/");
    return;
  }

  const form = document.querySelector("#registerForm");
  const firstNameInput = document.querySelector("#firstName");
  const lastNameInput = document.querySelector("#lastName");
  const emailInput = document.querySelector("#email");
  const passwordInput = document.querySelector("#password");
  const confirmPasswordInput = document.querySelector("#confirmPassword");
  const phoneInput = document.querySelector("#phone");
  const addressInput = document.querySelector("#address");

  const firstNameError = document.querySelector("#firstNameError");
  const lastNameError = document.querySelector("#lastNameError");
  const emailError = document.querySelector("#emailError");
  const passwordError = document.querySelector("#passwordError");
  const confirmPasswordError = document.querySelector("#confirmPasswordError");
  const phoneError = document.querySelector("#phoneError");
  const addressError = document.querySelector("#addressError");
  const registerError = document.querySelector("#registerError");

  const registerBtn = document.querySelector("#registerBtn");

  // event listeners
  firstNameInput.addEventListener("input", () => {
    validateData(
      firstNameInput.value.trim(),
      firstNameInput,
      firstNameError,
      "name"
    );
  });

  lastNameInput.addEventListener("input", () => {
    validateData(
      lastNameInput.value.trim(),
      lastNameInput,
      lastNameError,
      "name"
    );
  });

  emailInput.addEventListener("input", () => {
    validateData(emailInput.value.trim(), emailInput, emailError, "email");
  });

  passwordInput.addEventListener("input", () => {
    validateData(passwordInput.value, passwordInput, passwordError, "password");
  });

  confirmPasswordInput.addEventListener("input", () => {
    validatePasswordConfirmation(
      passwordInput.value,
      confirmPasswordInput.value,
      confirmPasswordInput,
      confirmPasswordError
    );
  });

  phoneInput.addEventListener("input", () => {
    validateData(phoneInput.value, phoneInput, phoneError, "phone");
  });

  addressInput.addEventListener("input", () => {
    validateData(addressInput.value, addressInput, addressError, "address");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const phone = phoneInput.value;
    const address = addressInput.value;

    // repeat validation for submission case
    const formIsValid =
      validateData(firstName, firstNameInput, firstNameError, "name") &&
      validateData(lastName, lastNameInput, lastNameError, "name") &&
      validateData(email, emailInput, emailError, "email") &&
      validateData(password, passwordInput, passwordError, "password") &&
      validatePasswordConfirmation(
        password,
        confirmPassword,
        confirmPasswordInput,
        confirmPasswordError
      ) &&
      validateData(phone, phoneInput, phoneError, "phone") &&
      validateData(address, addressInput, addressError, "address");

    if (!formIsValid) return;

    // disable inputs and create spinner effect while resolving
    Array.from(form.elements).forEach((item) => (item.disabled = true));
    form.classList.add("was-validated");
    registerBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Signing up...`;

    // additional form data not added to auth but added to firestore
    const data = { phoneNumber: phone, address: address };
    // create new user and copy with the added form information to firestore
    createUserWithEmailAndPassword(App.firebase.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return createUserDocument(user);
      })
      .then((user) => {
        return updateUserDocument(user, data);
      })
      .then((user) => {
        updateProfile(user, {
          displayName: `${firstName} ${lastName}`,
        });
      })
      .then(() => {
        App.navigator("/");
      })
      .catch((error) => {
        // reset the form state
        Array.from(form.elements).forEach((item) => (item.disabled = false));
        form.classList.remove("was-validated");
        registerBtn.innerHTML = `<i class="fa-solid fa-envelope mx-1"></i><span class="d-none d-sm-inline">Register with Email</span>`;
        registerError.textContent =
          firebaseAuthErrors[error.code] || firebaseAuthErrors["default"];
        registerError.classList.remove("d-none");
      });
  });
};
