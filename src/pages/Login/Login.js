import { signInWithEmailAndPassword } from "firebase/auth";
import { observer } from "../observer";
const componentID = "login";

export default function Login() {
  observer(componentID, compLoaded);
  return /*html*/ `
    <div component="${componentID}">
      <div class="container">
        <div class="row justify-content-center align-items-center mt-5">
          <div class="bg-body-tertiary p-5 col-12 col-md-10 col-lg-8 rounded-4 shadow-sm">
            <form id="loginForm" novalidate>
              <h2 class="mb-4 text-center">Login</h2>
              <div class="mb-3">
                <label for="email" class="form-label">Email<span class="text-danger">*</span></label>
                <input
                  type="email"
                  id="email"
                  class="form-control"
                  placeholder="user@example.com"
                  required
                />
                <div class="invalid-feedback" id="email-error">
                </div>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password<span class="text-danger">*</span></label>
                <input
                  type="password"
                  id="password"
                  class="form-control"
                  placeholder="enter your password"
                  required
                />
                <div class="invalid-feedback" id="password-error">
                </div>
              </div>
              <div class="mb-3">
                <button type="submit" class="btn btn-primary">Login</button>
              </div>
              <div class="text-center">
                <span class="text-muted">
                  Don't have an account?
                  <a href="./register" class="text-decoration-underline" data-link>Signup</a>
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
  const form = document.querySelector("#loginForm");
  const emailInput = document.querySelector("#email");
  const passwordInput = document.querySelector("#password");

  const emailError = document.querySelector("#email-error");
  const passwordError = document.querySelector("#password-error");

  // validation functions
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function isValidPassword(password) {
    return password.length >= 6;
  }

  // validation to update form styling and show error message
  function setValidationFeedback(
    inputElement,
    feedbackElement,
    isValid,
    message = ""
  ) {
    if (isValid) {
      inputElement.classList.remove("is-invalid");
      inputElement.classList.add("is-valid");
    } else {
      inputElement.classList.remove("is-valid");
      inputElement.classList.add("is-invalid");
      feedbackElement.textContent = message;
    }
  }

  function validateEmail(email) {
    // flag for form submission case
    let formValid = true;
    // check if email is empty or invalid format
    if (email === "") {
      setValidationFeedback(
        emailInput,
        emailError,
        false,
        "Email is required."
      );
      formValid = false;
    } else if (!isValidEmail(email)) {
      setValidationFeedback(
        emailInput,
        emailError,
        false,
        "Please enter a valid email address."
      );
      formValid = false;
    } else {
      setValidationFeedback(emailInput, emailError, true);
    }
    return formValid;
  }

  function validatePassword(password) {
    // flag for form submission case
    let formValid = true;
    // check for empty or weak password
    if (password === "") {
      setValidationFeedback(
        passwordInput,
        passwordError,
        false,
        "Password is required."
      );
      formValid = false;
    } else if (!isValidPassword(password)) {
      setValidationFeedback(
        passwordInput,
        passwordError,
        false,
        "Password must be at least 6 characters long."
      );
      formValid = false;
    } else {
      setValidationFeedback(passwordInput, passwordError, true);
    }
    return formValid;
  }

  // event listeners
  emailInput.addEventListener("input", () => {
    validateEmail(emailInput.value.trim());
  });

  passwordInput.addEventListener("input", () => {
    validatePassword(passwordInput.value);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    const formIsValid = validateEmail(email) && validatePassword(password);

    if (!formIsValid) {
      form.classList.add("was-validated");
      return;
    }

    Array.from(form.elements).forEach((item) => (item.disabled = true));
    form.classList.add("was-validated");

    try {
      const userCredential = await signInWithEmailAndPassword(
        App.firebase.auth,
        email,
        password
      );
      App.navigator("/");
    } catch (error) {
      Array.from(e.target.elements).forEach((item) => (item.disabled = false));
      alert(error.message);
    }
  });
};
