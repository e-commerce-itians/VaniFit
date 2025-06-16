import { sendPasswordResetEmail } from "firebase/auth";
import { observer } from "../../observer";
import { validateData } from "../../utils/userManagement";
import "./ResetPassword.css";

const componentID = "resetPassword";

export default function ResetPassword() {
  observer(componentID, compLoaded);

  return /*html*/ `
    <div component="${componentID}">
      <div class="container my-5">
        <div class="row justify-content-center align-items-center mt-5">
          <div
            id="resetPasswordError"
            class="alert alert-danger mb-2 text-center d-none col-10 col-md-7 col-lg-5 animate__animated animate__fadeInDown"
            role="alert"
          ></div>
        </div>
        <div class="row justify-content-center align-items-center">
          <div
            class="reset-password-card bg-body-secondary col-10 col-md-7 col-lg-5 m-3 p-4 rounded-4 shadow animate__animated animate__fadeInUp"
          >
            <form id="resetPasswordForm" novalidate autocomplete="on">
              <h2 class="mb-4 text-center fw-bold reset-password-title animate__animated animate__fadeIn">Reset Password</h2>
              <div class="mb-3 position-relative">
                <label for="email" class="form-label fw-semibold"
                  >Email<span class="text-danger ms-1">*</span></label
                >
                <input
                  type="email"
                  name="email"
                  id="email"
                  class="form-control reset-password-input"
                  placeholder="user@example.com"
                  required
                />
                <div id="resetMsg" class="d-none my-2 bg-dark-subtle rounded p-2"></div>
                <div class="invalid-feedback" id="emailError"></div>
              </div>
              <div class="mb-3 d-flex flex-column gap-2">
                <button
                  type="submit"
                  id="resetPasswordBtn"
                  class="btn btn-dark d-block w-100 my-2 reset-password-btn animate__animated animate__pulse"
                ><i class="fa-solid fa-lock"></i>
                  <span class="d-none d-sm-inline">Reset Password</span>
                </button>
            </form>
          </div>
        </div>
      </div>
    </div>`;
}

const compLoaded = () => {
  // block login page page for registered user
  if (App.firebase.user.uid) {
    App.navigator("/");
    return;
  }

  const emailInput = document.querySelector("#email");
  const emailError = document.querySelector("#emailError");
  const resetPasswordBtn = document.querySelector("#resetPasswordBtn");
  const resetMsg = document.querySelector("#resetMsg");
  const resetPasswordForm = document.querySelector("#resetPasswordForm");

  emailInput.addEventListener("input", () => {
    validateData(emailInput.value.trim(), emailInput, emailError, "email");
  });

  resetPasswordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    const formIsValid = validateData(email, emailInput, emailError, "email");

    if (!formIsValid) return;

    Array.from(resetPasswordForm.elements).forEach(
      (item) => (item.disabled = true)
    );
    resetPasswordForm.classList.add("was-validated");
    resetPasswordBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...`;

    sendPasswordResetEmail(App.firebase.auth, email)
      .then(() => {
        resetMsg.classList.remove("d-none");
        resetMsg.innerText =
          "If that email is registered, a password reset link will be been sent to your email.";
        resetPasswordBtn.innerHTML = `<i class="fa-solid fa-lock"></i><span class="d-none d-sm-inline">Reset Password</span>`;
      })
      .catch((error) => {
        resetMsg.classList.remove("d-none");
        resetMsg.innerText =
          "Failed to send reset email. Please check the email address.";
      });
  });
};
