import { observer } from "../../observer";
import {
  firebaseAuthErrors,
  validateData,
  updateUserDocument,
} from "../../utils/userManagement";
import "./Profile.css";

const componentID = "profile";

export default function Profile() {
  observer(componentID, compLoaded);
  return /*html*/ `
    <div component="${componentID}">
      <div class="container my-5">
        <div class="row justify-content-center">
          <div class="col-md-8 col-lg-7">
            <h1 class="mb-4 text-center">My Profile</h1>
            <div class="card profile-section-card mb-4">
              <div class="card-body text-center py-4">
                <div class="d-flex justify-content-center">
                  <img
                  id="userProfileAvatar"
                  src="${App.firebase.user.photoURL || "/images/avatar.png"}"
                  alt="Avatar"
                  class="rounded-circle my-3 w-50"
                  />
                </div>
                <h4 class="card-title mb-1" id="profileDisplayName">
                  ${App.firebase.user.displayName || "Unknown User"}
                </h4>
                <p class="card-text text-muted mb-3" id="profileEmail">
                  ${App.firebase.user.email || "No Email"}
                </p>
              </div>
            </div>
            <div class="card profile-section-card mb-4">
              <div class="card-header bg-white py-3">
                <h5 class="mb-0">
                 Edit Basic Information
                </h5>
              </div>
              <div class="card-body">
                <form id="profileUpdateForm" novalidate>
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
                  <button
                    type="submit"
                    class="btn btn-primary"
                    id="updateProfileBtn"
                  >
                    <i class="fas fa-save me-1"></i> Save Changes
                  </button>
                  <div
                    id="profileUpdateSuccess"
                    class="alert alert-success d-none mt-3"
                    role="alert"
                  >
                    Profile updated successfully!
                  </div>
                  <div
                    id="profileUpdateError"
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
                <h5 class="mb-0">
                  Account Settings
                </h5>
              </div>
              <div class="card-body">
                <p class="card-text">
                  Manage your password and other account options.
                </p>
                <button
                  type="button"
                  class="btn btn-outline-secondary me-2 mb-2"
                  id="changePasswordBtn"
                >
                  <i class="fa-solid fa-key me-1"></i> Change Password
                </button>
                <button
                  type="button"
                  class="btn btn-outline-danger mb-2"
                  id="deleteAccountBtn"
                >
                  <i class="fa-solid fa-trash me-1"></i> Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

const compLoaded = () => {
  // block profile page for unregistered user
  if (!App.firebase.user.uid) {
    App.navigator("/login");
    return;
  }

  const form = document.querySelector("#profileUpdateForm");
  const phoneInput = document.querySelector("#phone");
  const addressInput = document.querySelector("#address");
  const phoneError = document.querySelector("#phoneError");
  const addressError = document.querySelector("#addressError");
  const profileUpdateSuccess = document.querySelector("#profileUpdateSuccess");
  const profileUpdateError = document.querySelector("#profileUpdateError");
  const updateProfileBtn = document.querySelector("#updateProfileBtn");

  // event listeners

  phoneInput.addEventListener("input", () => {
    validateData(phoneInput.value, phoneInput, phoneError, "phone");
  });
  addressInput.addEventListener("input", () => {
    validateData(addressInput.value, addressInput, addressError, "address");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const phone = phoneInput.value;
    const address = addressInput.value;

    const formIsValid =
      validateData(phone, phoneInput, phoneError, "phone") &&
      validateData(address, addressInput, addressError, "address");

    if (!formIsValid) return;

    // modify UI until data is updated in database
    Array.from(e.target.elements).forEach((item) => (item.disabled = true));
    form.classList.add("was-validated");
    updateProfileBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Updating...`;
    // add form data to firestore
    const data = { phoneNumber: phone, address: address };
    await updateUserDocument(App.firebase.user, data)
      .then(() => {
        Array.from(e.target.elements).forEach(
          (item) => (item.disabled = false)
        );
        form.classList.remove("was-validated");
        updateProfileBtn.innerHTML = `<i class="fas fa-save me-1"></i> Save Changes`;
        profileUpdateSuccess.classList.remove("d-none");
      })
      .catch((error) => {
        // enable inputs and update error state
        Array.from(e.target.elements).forEach(
          (item) => (item.disabled = false)
        );
        form.classList.remove("was-validated");
        updateProfileBtn.innerHTML = `<i class="fas fa-save me-1"></i> Save Changes`;
        profileUpdateError.classList.remove("d-none");
        console.log(error);
      });
  });
};
