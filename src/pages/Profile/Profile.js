import { observer } from "../../observer";
const componentID = "profile";

export default function Profile() {
  observer(componentID, compLoaded);
  return /*html*/ `
    <div component=${componentID}>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-8 col-lg-7">
            <h1 class="mb-4 text-center">My Profile</h1>
            <div class="card profile-section-card mb-4">
              <div class="card-body text-center py-4">
                <img
                  id="userProfileAvatar"
                  src="${App.firebase.user.photoURL}"
                  alt="Profile Avatar"
                  class="profile-avatar mb-3"
                />
                <h4 class="card-title mb-1" id="profileDisplayName">
                  ${App.firebase.user.displayName || "Unknown User"}
                </h4>
                <p class="card-text text-muted mb-3" id="profileEmail">
                  ${App.firebase.user.email}
                </p>
              </div>
            </div>

            <div class="card profile-section-card mb-4">
              <div class="card-header bg-white py-3">
                <h5 class="mb-0">
                  <i class="fas fa-edit me-2"></i>Edit Basic Information
                </h5>
              </div>
              <div class="card-body">
                <form id="loginForm" novalidate>
              
              <div class="mb-3">
                <label for="phone" class="form-label"
                  >Phone Number<span class="text-danger">*</span></label
                >
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  class="form-control"
                  placeholder="Enter your phone number"
                  required
                />
                <div class="invalid-feedback" id="emailError"></div>
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
                <div class="invalid-feedback" id="passwordError"></div>
              </div>
              <div class="mb-3">
                <button
                  type="submit"
                  id="loginBtn"
                  class="btn btn-dark d-block w-100 my-2"
                >
                  <i class="fa-solid fa-envelope mx-1"></i>
                  <span class="d-none d-sm-inline">Update Profile</span>
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
                  ></div>
                </form>
              </div>
            </div>

            <div class="card profile-section-card mb-4">
              <div class="card-header bg-white py-3">
                <h5 class="mb-0">
                  <i class="fas fa-cog me-2"></i>Account Settings
                </h5>
              </div>
              <div class="card-body">
                <button
                  type="button"
                  class="btn btn-outline-secondary me-2 mb-2"
                  id="changePasswordBtn"
                >
                  <i class="fas fa-key me-1"></i> Change Password
                </button>
                <button
                  type="button"
                  class="btn btn-outline-danger mb-2"
                  id="deleteAccountBtn"
                >
                  <i class="fas fa-trash-alt me-1"></i> Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

//Javascript code to be executed once the home component is loaded
const compLoaded = () => {
  if (!App.firebase.user.uid) {
    App.navigator("/login");
    return;
  }
  console.log(App.firebase.user.displayName);
};
