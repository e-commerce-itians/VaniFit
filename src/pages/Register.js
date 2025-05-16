import { createUserWithEmailAndPassword } from "firebase/auth"; // Remove validatePassword as it's not a direct Firebase method
import { observer } from "../observer";
import { getAuth } from "firebase/auth"; // Import getAuth

const componentID = "register";

export default function Register() {
  observer(componentID, compLoaded);
  return /*html*/ `
    <div component="${componentID}">
      <div class="container">
        <div class="row justify-content-center align-items-center mt-5">
          <div class="bg-body-tertiary p-5 col-12 col-md-10 col-lg-8 rounded-4 shadow-sm">
            <form id="registerForm" novalidate> <h2 class="mb-4 text-center">Register Account</h2> <div class="mb-3">
                <label for="email" class="form-label">Email<span class="text-danger">*</span></label>
                <input
                  type="email"
                  id="email"
                  class="form-control"
                  placeholder="user@example.com"
                  required
                />
                <div class="invalid-feedback" id="invalid-email-feedback">
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
                <div class="invalid-feedback" id="invalid-password-feedback">
                </div>
              </div>
              <div class="mb-3">
                <label for="confirm-password" class="form-label">Confirm Password<span class="text-danger">*</span></label>
                <input
                  type="password"
                  id="confirmPassword"
                  class="form-control"
                  placeholder="confirm password"
                  required
                />
                <div class="invalid-feedback" id="invalid-confirm-password-feedback">
                </div>
              </div>
              <div class="mb-3">
                <button type="submit" class="btn btn-primary">Register</button>
              </div>
              <div class="text-center">
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
  const form = document.querySelector("#registerForm");
  const emailInput = form.querySelector("#email");
  const passwordInput = form.querySelector("#password");
  const confirmPasswordInput = form.querySelector("#confirmPassword");

  const invalidEmailFeedback = document.querySelector(
    "#invalid-email-feedback"
  );
  const invalidPasswordFeedback = document.querySelector(
    "#invalid-password-feedback"
  );
  const invalidConfirmPasswordFeedback = document.querySelector(
    "#invalid-confirm-password-feedback"
  );

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) => password.length >= 6;

  const setValidationFeedback = (
    inputElement,
    feedbackElement,
    isValid,
    message = ""
  ) => {
    if (isValid) {
      inputElement.classList.remove("is-invalid");
      inputElement.classList.add("is-valid");
    } else {
      inputElement.classList.remove("is-valid");
      inputElement.classList.add("is-invalid");
      feedbackElement.textContent = message;
    }
  };

  emailInput.addEventListener("input", () => {
    const email = emailInput.value.trim();
    if (email === "") {
      setValidationFeedback(
        emailInput,
        invalidEmailFeedback,
        false,
        "Email is required."
      );
    } else if (!isValidEmail(email)) {
      setValidationFeedback(
        emailInput,
        invalidEmailFeedback,
        false,
        "Please enter a valid email address."
      );
    } else {
      setValidationFeedback(emailInput, invalidEmailFeedback, true);
    }
  });

  passwordInput.addEventListener("input", () => {
    const password = passwordInput.value;
    if (password === "") {
      setValidationFeedback(
        passwordInput,
        invalidPasswordFeedback,
        false,
        "Password is required."
      );
    } else if (!isValidPassword(password)) {
      setValidationFeedback(
        passwordInput,
        invalidPasswordFeedback,
        false,
        "Password must be at least 6 characters long."
      );
    } else {
      setValidationFeedback(passwordInput, invalidPasswordFeedback, true);
    }

    if (confirmPasswordInput.value !== "") {
      const confirmPassword = confirmPasswordInput.value;
      setValidationFeedback(
        confirmPasswordInput,
        invalidConfirmPasswordFeedback,
        password === confirmPassword,
        "Passwords do not match."
      );
    }
  });

  confirmPasswordInput.addEventListener("input", () => {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    if (confirmPassword === "") {
      setValidationFeedback(
        confirmPasswordInput,
        invalidConfirmPasswordFeedback,
        false,
        "Please confirm your password."
      );
    } else {
      setValidationFeedback(
        confirmPasswordInput,
        invalidConfirmPasswordFeedback,
        password === confirmPassword,
        "Passwords do not match."
      );
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    let formIsValid = true;

    if (email === "") {
      setValidationFeedback(
        emailInput,
        invalidEmailFeedback,
        false,
        "Email is required."
      );
      formIsValid = false;
    } else if (!isValidEmail(email)) {
      setValidationFeedback(
        emailInput,
        invalidEmailFeedback,
        false,
        "Please enter a valid email address."
      );
      formIsValid = false;
    } else {
      setValidationFeedback(emailInput, invalidEmailFeedback, true);
    }

    if (password === "") {
      setValidationFeedback(
        passwordInput,
        invalidPasswordFeedback,
        false,
        "Password is required."
      );
      formIsValid = false;
    } else if (!isValidPassword(password)) {
      setValidationFeedback(
        passwordInput,
        invalidPasswordFeedback,
        false,
        "Password must be at least 6 characters long."
      );
      formIsValid = false;
    } else {
      setValidationFeedback(passwordInput, invalidPasswordFeedback, true);
    }

    if (confirmPassword === "") {
      setValidationFeedback(
        confirmPasswordInput,
        invalidConfirmPasswordFeedback,
        false,
        "Please confirm your password."
      );
      formIsValid = false;
    } else if (password !== confirmPassword) {
      setValidationFeedback(
        confirmPasswordInput,
        invalidConfirmPasswordFeedback,
        false,
        "Passwords do not match."
      );
      formIsValid = false;
    } else {
      setValidationFeedback(
        confirmPasswordInput,
        invalidConfirmPasswordFeedback,
        true
      );
    }

    if (!formIsValid) {
      form.classList.add("was-validated");
      return;
    }

    Array.from(form.elements).forEach((item) => (item.disabled = true));
    form.classList.add("was-validated");

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      App.navigator("/");
    } catch (error) {
      Array.from(form.elements).forEach((item) => (item.disabled = false));
      let errorMessage = "An unknown error occurred. Please try again.";
      alert(errorMessage);
      form.classList.add("was-validated");
    }
  });
};
