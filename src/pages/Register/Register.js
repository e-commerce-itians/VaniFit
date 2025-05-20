import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { observer } from "../../observer";
import {
  firebaseAuthErrors,
  validateData,
  validatePasswordConfirmation,
  createUserDocument,
  updateUserDocument,
} from "../../utils/userManagement";

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
            class="bg-body-secondary col-10 col-md-7 col-lg-5 m-3 p-4 rounded-4"
          >
            <form id="registerForm" novalidate>
              <h2 class="mb-4 text-center">Register</h2>
              <div class="mb-3">
                <label for="firstName" class="form-label"
                  >First Name<span class="text-danger">*</span></label
                >
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  class="form-control"
                  placeholder="John"
                  required
                />
                <div class="invalid-feedback" id="firstNameError"></div>
              </div>
              <div class="mb-3">
                <label for="lastName" class="form-label"
                  >Last Name<span class="text-danger">*</span></label
                >
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  class="form-control"
                  placeholder="Doe"
                  required
                />
                <div class="invalid-feedback" id="lastNameError"></div>
              </div>
              <div class="mb-3">
                <label for="email" class="form-label"
                  >Email<span class="text-danger">*</span></label
                >
                <input
                  type="email"
                  name="email"
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
                  name="password"
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
                  name="confirmPassword"
                  id="confirmPassword"
                  class="form-control"
                  placeholder="confirm password"
                  required
                />
                <div class="invalid-feedback" id="confirmPasswordError"></div>
              </div>
              <div class="mb-3">
                <label for="phone" class="form-label"
                  >Phone Number<span class="text-danger">*</span></label
                >
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  class="form-control"
                  placeholder="+20 123-4567-890"
                  required
                />
                <div class="invalid-feedback" id="phoneError"></div>
              </div>
              <div class="mb-3">
                <label for="address" class="form-label"
                  >Address<span class="text-danger">*</span></label
                >
                <input
                  type="text"
                  name="address"
                  id="address"
                  class="form-control"
                  placeholder="123 Main Street, City, State, ZIP"
                  required
                />
                <div class="invalid-feedback" id="addressError"></div>
              </div>
              <div class="mb-3">
                <button
                  type="submit"
                  id="registerBtn"
                  class="btn btn-dark d-block w-100 my-2"
                >
                  <i class="fa-solid fa-envelope me-1"></i
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
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
}

const compLoaded = () => {
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

  form.addEventListener("submit", async (e) => {
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
    await createUserWithEmailAndPassword(App.firebase.auth, email, password)
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
          photoURL: "#",
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
