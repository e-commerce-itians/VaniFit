import {
  GoogleAuthProvider,
  EmailAuthProvider,
  reauthenticateWithPopup,
  reauthenticateWithCredential,
} from "firebase/auth";
import {
  firebaseAuthErrors,
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
            <div id="changePasswordContainer" class="card profile-section-card mb-4 d-none">
              <div class="card-header bg-white py-3">
                <h5 class="mb-0">Change Password</h5>
              </div>
              <div class="card-body">
                <form id="changePasswordForm" novalidate>
                  <div class="mb-3">
                    <label for="oldPassword" class="form-label"
                      >Old Password<span class="text-danger ms-1"
                        >*</span
                      ></label
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
                      >New Password<span class="text-danger ms-1"
                        >*</span
                      ></label
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
                      >Confirm Password<span class="text-danger ms-1"
                        >*</span
                      ></label
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
                    id="passwordUpdateBtn"
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
                </div>
                <form id="checkPasswordForm" class="d-none" novalidate>
                  <div class="p-3">
                    <div class="mb-3">
                      <label for="checkPassword" class="form-label"
                        >Password<span class="text-danger ms-1">*</span></label
                      >
                      <input
                        type="password"
                        name="checkPassword"
                        id="checkPassword"
                        class="form-control"
                        placeholder="Enter your password"
                        required
                      />
                      <div
                      class="invalid-feedback"
                      id="checkPasswordError"
                    ></div>
                      <button
                        type="submit"
                        class="btn btn-dark d-block w-100 my-2"
                        id="passwordUpdateBtn"
                      >
                        Confirm
                      </button>
                      <div
                        id="deleteAccountError"
                        class="alert alert-danger my-2 d-none"
                      >
                      </div>
                    </div>
                  </div>
                </form>
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
  // check if user is google signed in or email/password
  const providerId = App.firebase.user.providerData[0]?.providerId;

  const changePasswordContainer = document.querySelector(
    "#changePasswordContainer"
  );
  const changePasswordForm = document.querySelector("#changePasswordForm");
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
  const passwordUpdateBtn = document.querySelector("#passwordUpdateBtn");

  const deleteAccountBtn = document.querySelector("#deleteAccountBtn");
  const deleteAccountOptions = document.querySelector("#deleteAccountOptions");
  const checkPasswordForm = document.querySelector("#checkPasswordForm");
  const checkPasswordInput = document.querySelector("#checkPassword");
  const checkPasswordError = document.querySelector("#checkPasswordError");
  const confirmDeleteBtn = document.querySelector("#confirmDeleteBtn");
  const cancelDeleteBtn = document.querySelector("#cancelDeleteBtn");
  const deleteAccountError = document.querySelector("#deleteAccountError");

  // for google signed in user hide change password option
  if (providerId === "password") {
    changePasswordContainer.classList.remove("d-none");
  }

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

  changePasswordForm.addEventListener("submit", async (e) => {
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
    // prevent password change if user signed in with google
    if (!formIsValid || providerId === "google.com") return;

    // modify UI until data is updated in database
    Array.from(e.target.elements).forEach((item) => (item.disabled = true));
    changePasswordForm.classList.add("was-validated");
    passwordUpdateBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Updating...`;
    try {
      await changeUserPassword(App.firebase.user, oldPassword, newPassword);
      Array.from(e.target.elements).forEach((item) => (item.disabled = false));
      changePasswordForm.classList.remove("was-validated");
      passwordUpdateBtn.innerHTML = `<i class="fa-solid fa-key me-1"></i> Change Password`;
      passwordUpdateSuccess.classList.remove("d-none");
    } catch (error) {
      Array.from(e.target.elements).forEach((item) => (item.disabled = false));
      changePasswordForm.classList.remove("was-validated");
      passwordUpdateBtn.innerHTML = `<i class="fas fa-save me-1"></i> Save Changes`;
      passwordUpdateError.classList.remove("d-none");
      passwordUpdateError.textContent = error;
    }
  });

  // account deletion handling
  deleteAccountBtn.addEventListener("click", async () => {
    if (providerId === "password") {
      deleteAccountOptions.classList.remove("d-none");
    } else if (providerId === "google.com") {
      try {
        const provider = new GoogleAuthProvider();
        await reauthenticateWithPopup(App.firebase.user, provider);
        await removeUser(App.firebase.user);
      } catch (error) {
        return;
      }
    }
  });

  checkPasswordInput.addEventListener("input", () => {
    validateData(
      checkPasswordInput.value,
      checkPasswordInput,
      checkPasswordError,
      "password"
    );
  });

  confirmDeleteBtn.addEventListener("click", () => {
    checkPasswordForm.classList.remove("d-none");
  });

  // remove check password form when user cancels deletion
  cancelDeleteBtn.addEventListener("click", () => {
    checkPasswordForm.classList.add("d-none");
  });

  // check password to reauthenticate and allow the deletion process
  checkPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const checkPassword = checkPasswordInput.value;
    const formIsValid = validateData(
      checkPassword,
      checkPasswordInput,
      checkPasswordError,
      "password"
    );

    if (!formIsValid) return;

    try {
      const credential = EmailAuthProvider.credential(
        App.firebase.user.email,
        checkPasswordInput.value
      );
      await reauthenticateWithCredential(App.firebase.user, credential);
      await removeUser(App.firebase.user);
      App.navigator("/");
    } catch (error) {
      deleteAccountError.textContent =
        firebaseAuthErrors[error.code] || firebaseAuthErrors["default"];
      deleteAccountError.classList.remove("d-none");
    }
  });
};
