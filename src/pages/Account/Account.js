import { observer } from "../../observer";

const componentID = "account";

export default function Account() {
  observer(componentID, compLoaded);
  return /*html*/ `
    <div component="${componentID}">
      <div class="container my-5">
        <div class="row justify-content-center">
          <div class="col-md-8 col-lg-7">
            <h1 class="mb-4 text-center">My Profile</h1>
            <div class="card profile-section-card mb-4">
              <div class="card-header bg-white py-3">
                <h5 class="mb-0">Edit Basic Information</h5>
              </div>
              <div class="card-body">
                <form id="changePasswordForm" novalidate>
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
                    <i class="fa-solid fa-save me-1"></i> Save Changes
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
                <p class="card-text">
                  Deleting your account will result in all your data being permanatly deleted, this action cannot be undone.
                </p>
                <button
                  type="button"
                  class="btn btn-danger me-2 mb-2"
                >
                  <a href="./account" data-link>
                    <i class="fa-solid fa-trash me-1"></i>Delete Account
                  </a>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

const compLoaded = () => {};
