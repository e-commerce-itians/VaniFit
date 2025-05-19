import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { observer } from "../../observer";
import { firebaseAuthErrors, validateData } from "../../utils/validation";

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

  const firstNameError = document.querySelector("#firstNameError");
  const lastNameError = document.querySelector("#lastNameError");
  const emailError = document.querySelector("#emailError");
  const passwordError = document.querySelector("#passwordError");
  const confirmPasswordError = document.querySelector("#confirmPasswordError");
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
    validateData(
      passwordInput.value,
      confirmPasswordInput.value,
      confirmPasswordInput,
      confirmPasswordError,
      "confirm password"
    );
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // repeat validation for submission case
    const formIsValid =
      validateData(firstName, firstNameInput, firstNameError, "name") &&
      validateData(lastName, lastNameInput, lastNameError, "name") &&
      validateData(email, emailInput, emailError, "email") &&
      validateData(password, passwordInput, passwordError, "password") &&
      validateData(
        password,
        confirmPassword,
        confirmPasswordInput,
        confirmPasswordError,
        "confirm password"
      );

    if (!formIsValid) {
      form.classList.remove("was-validated");
      return;
    }

    // disable inputs and create spinner effect while resolving
    Array.from(form.elements).forEach((item) => (item.disabled = true));
    form.classList.add("was-validated");
    registerBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Signing up...`;

    await createUserWithEmailAndPassword(App.firebase.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return updateProfile(user, {
          displayName: `${firstName} ${lastName}`,
        });
      })
      .then(() => {
        App.navigator("/");
      })
      .catch((error) => {
        // enable inputs and update error state
        Array.from(form.elements).forEach((item) => (item.disabled = false));
        form.classList.remove("was-validated");
        registerBtn.innerHTML = `<i class="fa-solid fa-envelope mx-1"></i><span class="d-none d-sm-inline">Register with Email</span>`;
        registerError.textContent =
          firebaseAuthErrors[error.code] || firebaseAuthErrors["default"];
        registerError.classList.remove("d-none");
      });
  });
};
