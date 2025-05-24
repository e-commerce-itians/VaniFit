import { doc, getDoc } from "firebase/firestore";
import { observer } from "../../observer";
import { validateData, updateUserDocument } from "../../utils/userManagement";
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
                <h5 class="mb-0">Edit Basic Information</h5>
              </div>
              <div class="card-body">
                <div
                  id="missingInfoError"
                  class="alert alert-danger text-center d-none"
                  role="alert"
                >
                  Your account is not complete, Please fill incomplete data to
                  be able to order.
                </div>
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
                    class="btn btn-dark d-block w-100 my-2"
                    id="updateProfileBtn"
                  >
                    <i class="fa-solid fa-save me-1"></i> Save Changes
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
                <h5 class="mb-0">Account Settings</h5>
              </div>
              <div class="card-body">
                <p class="card-text">
                  Manage your password and other account options.
                </p>
                <button
                  type="button"
                  class="btn btn-dark d-block w-100 my-2"
                  data-link
                  style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;"
                  onclick="event.preventDefault(); App.navigator('/account');"
                >
                  <i class="fa-solid fa-key me-1"></i>Change Account Settings
                </button>
              </div>
            </div>
            <div id="recentOrders" class="card profile-section-card mb-4">
              <div class="card-header bg-white py-3">
                <h5 class="mb-0">Recent Orders</h5>
              </div>
              <div
                id="recentOrdersContainer"
                class="card-body d-flex flex-column align-items-center"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

const compLoaded = async () => {
  // block profile page for unregistered user
  if (!App.firebase.user.uid) {
    App.navigator("/login");
    return;
  }

  const missingInfoError = document.querySelector("#missingInfoError");
  const profileUpdateForm = document.querySelector("#profileUpdateForm");
  const phoneInput = document.querySelector("#phone");
  const addressInput = document.querySelector("#address");
  const phoneError = document.querySelector("#phoneError");
  const addressError = document.querySelector("#addressError");
  const profileUpdateSuccess = document.querySelector("#profileUpdateSuccess");
  const profileUpdateError = document.querySelector("#profileUpdateError");
  const updateProfileBtn = document.querySelector("#updateProfileBtn");

  const recentOrders = document.querySelector("#recentOrders");
  const recentOrdersContainer = document.querySelector(
    "#recentOrdersContainer"
  );

  // helper function to update the dom
  function renderOrderItem(item) {
    const itemContainer = document.createElement("div");
    const itemImgContainer = document.createElement("div");
    const itemInfoContainer = document.createElement("div");
    const itemImg = document.createElement("img");
    const itemName = document.createElement("p");
    const itemPrice = document.createElement("p");

    itemImgContainer.classList.add(
      "w-25",
      "ratio",
      "ratio-1x1",
      "overflow-hidden"
    );
    itemContainer.classList.add("d-flex", "w-75");
    itemInfoContainer.classList.add("p-3");
    itemName.textContent = item.name;
    itemPrice.textContent = `${item.price}$`;
    itemImg.classList.add(
      "img-thumbnail",
      "w-100",
      "h-100",
      "object-fit-cover"
    );
    itemImg.src = item.image;
    itemImg.alt = "product";

    itemImgContainer.append(itemImg);
    itemInfoContainer.append(itemName, itemPrice);
    itemContainer.append(itemImgContainer, itemInfoContainer);
    recentOrders.appendChild(itemContainer);
  }

  try {
    // fetch order items and render list
    const orderRef = doc(App.firebase.db, "orders", App.firebase.user.uid);
    const orderData = (await getDoc(orderRef)).data();
    // list most order history with 20 items max
    let itemsCount = 0;
    orderData.orderList.forEach((order) => {
      order.items.forEach((item) => {
        if (itemsCount < 20) {
          renderOrderItem(item);
          itemsCount++;
        }
      });
    });
  } catch (error) {
    // remove recentOrders section if the user has no orders
    recentOrders.classList.add("d-none");
  }

  // get current user from firestore
  const userRef = doc(App.firebase.db, "users", App.firebase.user.uid);
  const userData = (await getDoc(userRef)).data();

  // if user doesn't exist in firestore revert to home
  if (!userData) {
    App.navigator("/");
    return;
  }

  // inform user about missing data
  if (!userData.phoneNumber || !userData.address) {
    missingInfoError.classList.remove("d-none");
  }

  if (userData.phoneNumber) phoneInput.value = userData.phoneNumber;
  if (userData.address) addressInput.value = userData.address;

  // event listeners
  phoneInput.addEventListener("input", () => {
    validateData(phoneInput.value, phoneInput, phoneError, "phone");
  });

  addressInput.addEventListener("input", () => {
    validateData(addressInput.value, addressInput, addressError, "address");
  });

  profileUpdateForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const phone = phoneInput.value;
    const address = addressInput.value;

    const formIsValid =
      validateData(phone, phoneInput, phoneError, "phone") &&
      validateData(address, addressInput, addressError, "address");

    if (!formIsValid) return;

    // modify UI until data is updated in database
    Array.from(e.target.elements).forEach((item) => (item.disabled = true));
    profileUpdateForm.classList.add("was-validated");
    updateProfileBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Updating...`;
    // add form data to firestore
    const data = { phoneNumber: phone, address: address };
    // update phone number and update ui
    try {
      await updateUserDocument(App.firebase.user, data);
      // reset ui to initial state on success
      Array.from(e.target.elements).forEach((item) => (item.disabled = false));
      profileUpdateForm.classList.remove("was-validated");
      updateProfileBtn.innerHTML = `<i class="fas fa-save me-1"></i> Save Changes`;
      profileUpdateSuccess.classList.remove("d-none");
      missingInfoError.classList.add("d-none");
    } catch (error) {
      // enable inputs and update error state
      Array.from(e.target.elements).forEach((item) => (item.disabled = false));
      profileUpdateForm.classList.remove("was-validated");
      updateProfileBtn.innerHTML = `<i class="fas fa-save me-1"></i> Save Changes`;
      profileUpdateError.classList.remove("d-none");
      profileUpdateError.textContent = error;
    }
  });
};
