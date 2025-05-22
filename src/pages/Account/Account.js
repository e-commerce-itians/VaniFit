import {
  validateData,
  validatePasswordConfirmation,
  changeUserPassword,
  removeUser,
} from "../../utils/userManagement";
import { observer } from "../../observer";
import "./Account.css";

const componentID = "account";

export default function Account() {
  observer(componentID, compLoaded);
  return /*html*/ `
    <div component="${componentID}">
      <div class="container my-5">
        <div class="row justify-content-center">
          <div class="col-md-8 col-lg-7">
            <h1 class="mb-4 text-center">Account Settings</h1>
            <div class="card profile-section-card mb-4">
              <div class="card-header bg-white py-3">
                <h5 class="mb-0">Change Password</h5>
              </div>
              <div class="card-body">
                <form id="changePasswordForm" novalidate>
                  <div class="mb-3">
                    <label for="oldPassword" class="form-label"
                      >Old Password<span class="text-danger ms-1">*</span></label
                    >
                    <input
                      type="password"
                      name="oldPassword"
                      id="oldPassword"
                      class="form-control"
                      placeholder="Enter old password"
                      required
                    />
                    <div class="invalid-feedback" id="oldPasswordError"></div>
                  </div>
                  <div class="mb-3">
                    <label for="newPassword" class="form-label"
                      >New Password<span class="text-danger ms-1">*</span></label
                    >
                    <input
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      class="form-control"
                      placeholder="Enter new password"
                      required
                    />
                    <div class="invalid-feedback" id="newPasswordError"></div>
                  </div>
                  <div class="mb-3">
                    <label for="confirmPassword" class="form-label"
                      >Confirm Password<span class="text-danger ms-1">*</span></label
                    >
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      class="form-control"
                      placeholder="Confirm new password"
                      required
                    />
                    <div
                      class="invalid-feedback"
                      id="confirmPasswordError"
                    ></div>
                  </div>
                  <button
                    type="submit"
                    class="btn btn-dark d-block w-100 my-2"
                    id="changePasswordBtn"
                  >
                    <i class="fa-solid fa-key me-1"></i> Change Password
                  </button>
                  <div
                    id="passwordUpdateSuccess"
                    class="alert alert-success d-none mt-3"
                    role="alert"
                  >
                    Password updated successfully!
                  </div>
                  <div
                    id="passwordUpdateError"
                    class="alert alert-danger d-none mt-3"
                    role="alert"
                  >
                    An Error occurred, Please try again.
                  </div>
                </form>
              </div>
            </div>
            <div class="card profile-section-card mb-4">
              <div class="card-header bg-white py-3">
                <h5 class="mb-0">Delete Account</h5>
              </div>
              <div class="card-body">
                <p class="card-text alert alert-danger">
                  Deleting your account will result in all your data being
                  permanently deleted, this action cannot be undone.
                </p>
                <button
                  id="deleteAccountBtn"
                  type="button"
                  class="btn btn-danger d-block w-100 my-2"
                >
                  <i class="fa-solid fa-trash me-1"></i>Delete Account
                </button>
                <div id="deleteAccountOptions" class="p-3 d-none">
                  <p class="card-text my-2">
                    Are you sure you want to proceed with account deletion?
                  </p>
                  <button id="confirmDeleteBtn" class="btn btn-success w-25">
                    Yes
                  </button>
                  <button id="cancelDeleteBtn" class="btn btn-danger w-25">
                    No
                  </button>
                  <p
                    id="deleteAccountError"
                    class="alert alert-danger my-2 d-none"
                  >
                    An error occurred.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

const compLoaded = () => {
  // block account settings page for unregistered user
  if (!App.firebase.user.uid) {
    App.navigator("/login");
    return;
  }

  const form = document.querySelector("#changePasswordForm");
  const oldPasswordInput = document.querySelector("#oldPassword");
  const newPasswordInput = document.querySelector("#newPassword");
  const confirmPasswordInput = document.querySelector("#confirmPassword");

  const oldPasswordError = document.querySelector("#oldPasswordError");
  const newPasswordError = document.querySelector("#newPasswordError");
  const confirmPasswordError = document.querySelector("#confirmPasswordError");

  const passwordUpdateSuccess = document.querySelector(
    "#passwordUpdateSuccess"
  );
  const passwordUpdateError = document.querySelector("#passwordUpdateError");

  const changePasswordBtn = document.querySelector("#changePasswordBtn");
  const deleteAccountBtn = document.querySelector("#deleteAccountBtn");
  const deleteAccountOptions = document.querySelector("#deleteAccountOptions");
  const confirmDeleteBtn = document.querySelector("#confirmDeleteBtn");
  const cancelDeleteBtn = document.querySelector("#cancelDeleteBtn");
  const deleteAccountError = document.querySelector("#deleteAccountError");

  oldPasswordInput.addEventListener("input", () => {
    validateData(
      oldPasswordInput.value,
      oldPasswordInput,
      oldPasswordError,
      "password"
    );
  });

  newPasswordInput.addEventListener("input", () => {
    validateData(
      newPasswordInput.value,
      newPasswordInput,
      newPasswordError,
      "password"
    );
  });

  confirmPasswordInput.addEventListener("input", () => {
    validatePasswordConfirmation(
      newPasswordInput.value,
      confirmPasswordInput.value,
      confirmPasswordInput,
      confirmPasswordError
    );
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const oldPassword = oldPasswordInput.value;
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    const formIsValid =
      validateData(
        oldPassword,
        oldPasswordInput,
        oldPasswordError,
        "password"
      ) &&
      validateData(
        newPassword,
        newPasswordInput,
        newPasswordError,
        "password"
      ) &&
      validatePasswordConfirmation(
        newPassword,
        confirmPassword,
        confirmPasswordInput,
        confirmPasswordError
      );

    if (!formIsValid) return;

    // modify UI until data is updated in database
    Array.from(e.target.elements).forEach((item) => (item.disabled = true));
    form.classList.add("was-validated");
    changePasswordBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Updating...`;

    changeUserPassword(App.firebase.user, oldPassword, newPassword)
      .then(() => {
        Array.from(e.target.elements).forEach(
          (item) => (item.disabled = false)
        );
        form.classList.remove("was-validated");
        changePasswordBtn.innerHTML = `<i class="fa-solid fa-key me-1"></i> Change Password`;
        passwordUpdateSuccess.classList.remove("d-none");
      })
      .catch((error) => {
        Array.from(e.target.elements).forEach(
          (item) => (item.disabled = false)
        );
        form.classList.remove("was-validated");
        changePasswordBtn.innerHTML = `<i class="fas fa-save me-1"></i> Save Changes`;
        passwordUpdateError.classList.remove("d-none");
        passwordUpdateError.textContent = error;
      });
  });

  // account deletion handling
  deleteAccountBtn.addEventListener("click", () => {
    deleteAccountOptions.classList.remove("d-none");
  });

  cancelDeleteBtn.addEventListener("click", () => {
    deleteAccountOptions.classList.add("d-none");
  });

  confirmDeleteBtn.addEventListener("click", async () => {
    const deletionFlag = await removeUser(App.firebase.user);
    if (deletionFlag) {
      App.navigator("/");
    } else {
      deleteAccountError.classList.remove("d-none");
    }
  });
};
