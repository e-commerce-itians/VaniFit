import { doc, getDoc } from "firebase/firestore";
import { observer } from "../../observer";
import { validateData } from "../../utils/userManagement";
import "./Cart.css";
const componentID = "cart";

export default async function Cart() {
  observer(componentID, compLoaded);
  return /*html*/ `
    <div component="${componentID}" class="container my-5 fadeUp">
      <div class="container py-5">
        <h1 class="mb-4">Your Cart</h1>
        <div class="row">
          <div class="col-md-8">
            <div id="cart-items-container"></div>
          </div>

          <div class="col-md-4">
            <div class="order-summary">
              <h3 class="mb-4">Order Summary</h3>

              <div id="orderSummary">
                ${
                  App.firebase.user.email
                    ? `
                <form id="customerInfoForm" class="customer-info mb-4 p-3 bg-light rounded" novalidate>
                  <h5 class="mb-3 fw-bold border-bottom pb-2">Customer Information</h5>
                  <div class="mb-3">
                    <p class="small text-muted">Full Name</p>
                    <input class="form-control rounded-0 border-top-0 border-start-0 border-end-0 border-dark bg-light px-0 overflow-hidden" id="customerName" value="${
                      App.firebase.user.displayName || ""
                    }" readonly>
                  </div>
                  <div class="mb-3">
                    <p class="small text-muted">Phone Number</p>
                    <input class="form-control rounded-0 border-top-0 border-start-0 border-end-0 border-dark bg-light px-0 overflow-hidden" id="customerPhone" value="${
                      App.firebase.user.phoneNumber || "Not Provided"
                    }" readonly>
                  </div>
                  <div class="mb-3">
                    <p class="small text-muted">Address</p>
                    <input class="form-control rounded-0 border-top-0 border-start-0 border-end-0 border-dark bg-light px-0 overflow-hidden" id="customerAddress" value="${
                      App.firebase.user.address || "Not Provided"
                    }">
                    <div class="invalid-feedback" id="customerAddressError"></div>
                  </div>
                </form>

                <div class="payment-method mb-4">
  <h5 class="mb-3 fw-bold border-bottom pb-2">Payment Method</h5>
  <div class="payment-options">
    <div class="form-check p-0 border rounded mb-2 payment-option" style="cursor:pointer">
      <input class="form-check-input" type="radio" name="paymentMethod" id="cod" value="COD" checked>
      <label class="form-check-label d-flex align-items-center rounded p-2" for="cod" style="cursor:pointer">
        <i class="fas fa-money-bill-wave me-3"></i>
        <div>
          <div class="fw-medium">Cash on Delivery (COD)</div>
          <div class="small text-muted d-none d-lg-block">Pay when you receive your order</div>
        </div>
      </label>
    </div>
    <div class="form-check p-0 border rounded payment-option" style="cursor:pointer">
      <input class="form-check-input" type="radio" name="paymentMethod" id="creditCard" value="Credit Card">
      <label class="form-check-label d-flex align-items-center rounded p-2" for="creditCard" style="cursor:pointer">
        <i class="far fa-credit-card me-3"></i>
        <div>
          <div class="fw-medium">Credit Card Payment</div>
          <div class="small text-muted d-none d-lg-block">Secure payment with Stripe</div>
        </div>
      </label>
    </div>
  </div>
</div>`
                    : ``
                }

                <div class="summary-details">
                  <div class="summary-row">
                    <span>Subtotal</span>
                    <span id="subtotal">$0</span>
                  </div>

                  <div class="summary-row">
                    <span>Discounts</span>
                    <span id="discount">-$0</span>
                  </div>

                  <div class="summary-row savings-row">
                    <span>You saved</span>
                    <span id="savings">$0</span>
                  </div>

                  <div class="summary-row total-row">
                    <span>Total</span>
                    <span id="total">$0</span>
                  </div>
                </div>

                <div class="promo-input" style="display:none">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Add promo code"
                  />
                  <button class="btn btn-outline-dark">Apply</button>
                </div>
                ${
                  App.firebase.user.email
                    ? `<button id="checkout-btn" class="btn btn-dark w-100 mt-3">Place Order</button>`
                    : `<a href="/login" class="btn btn-dark w-100 mt-3" data-link><i class="fa-solid fa-lock me-1"></i> Login to checkout</a>`
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

const compLoaded = async () => {
  let cart = App.getCart();
  const cartContainer = document.querySelector("#cart-items-container");
  const summaryContainer = document.querySelector("#orderSummary");
  const nameInput = document.querySelector("#customerName");
  const phoneInput = document.querySelector("#customerPhone");
  const addressInput = document.querySelector("#customerAddress");
  const addressError = document.querySelector("#customerAddressError");

  function renderCart() {
    cartContainer.innerHTML = "";
    let subtotal = 0;
    let totalDiscount = 0;
    let totalSavings = 0;

    summaryContainer.style.display = "block";
    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty</p>";
      summaryContainer.innerHTML = `<p class="text-muted text-center">Your cart's feeling a little lonely!</p>`;
      updateOrderSummary(0, 0, 0);
      return;
    }

    cart.forEach((item) => {
      const originalPrice = item.price;
      const discountedPrice =
        item.discount > 0
          ? originalPrice * (1 - item.discount / 100)
          : originalPrice;
      const itemDiscount = originalPrice - discountedPrice;
      const itemTotal = discountedPrice * item.quantity;

      subtotal += originalPrice * item.quantity;
      totalDiscount += itemDiscount * item.quantity;
      totalSavings += itemDiscount * item.quantity;

      const itemHTML = `
                <div class="cart-item" data-product-id="${
                  item.productId
                }" data-size="${item.selectedSize}" data-color="${
        item.selectedColor
      }">
                    <div class="d-flex justify-content-between">
                        <div>
                            <div class="item-title">${item.name}</div>
                            <div class="item-details mt-1">
                                Size: ${item.selectedSize}<br>
                                Color: ${item.selectedColor}
                            </div>
                            <div class="mt-2">
                                ${
                                  item.discount > 0
                                    ? `
                                    <span class="original-price">$${originalPrice.toFixed(
                                      2
                                    )}</span>
                                `
                                    : ""
                                }
                                <div class="item-price">$${discountedPrice.toFixed(
                                  2
                                )}</div>
                            </div>
                            <div class="quantity-control">
                                <button class="decrement">-</button>
                                <input type="number" value="${
                                  item.quantity
                                }" min="1" max="${item.max}">
                                <button class="increment">+</button>
                            </div>
                            ${
                              item.quantity >= item.max
                                ? `
                                <div class="max-limit">Maximum ${item.max} in stock</div>
                            `
                                : ""
                            }
                            <div class="remove-item">Remove</div>
                        </div>
                        <div>
                            <img src="${
                              item.image
                            }" width="80" height="80" style="object-fit: cover;">
                        </div>
                    </div>
                </div>
            `;

      cartContainer.insertAdjacentHTML("beforeend", itemHTML);
    });

    updateOrderSummary(subtotal, totalDiscount, totalSavings);
    setupEventListeners();
  }

  function setupEventListeners() {
    // Quantity controls
    document.querySelectorAll(".quantity-control button").forEach((button) => {
      button.addEventListener("click", function () {
        const input = this.parentElement.querySelector("input");
        const max = parseInt(input.max);
        let newValue = parseInt(input.value);

        if (this.classList.contains("increment")) {
          newValue = Math.min(max, newValue + 1);
        } else {
          newValue = Math.max(1, newValue - 1);
        }

        input.value = newValue;
        updateCartItem(this.closest(".cart-item"), newValue);
      });
    });

    // Manual input validation
    document.querySelectorAll(".quantity-control input").forEach((input) => {
      input.addEventListener("change", function () {
        const max = parseInt(this.max);
        let newValue = parseInt(this.value);

        if (isNaN(newValue)) newValue = 1;
        newValue = Math.min(max, Math.max(1, newValue));

        this.value = newValue;
        updateCartItem(this.closest(".cart-item"), newValue);
      });
    });

    // Remove items
    document.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", function () {
        removeCartItem(this.closest(".cart-item"));
      });
    });
  }

  function updateCartItem(itemElement, newQuantity) {
    const productId = itemElement.dataset.productId;
    const size = itemElement.dataset.size;
    const color = itemElement.dataset.color;

    const itemIndex = cart.findIndex(
      (item) =>
        item.productId === productId &&
        item.selectedSize === size &&
        item.selectedColor === color
    );

    if (itemIndex !== -1) {
      cart[itemIndex].quantity = newQuantity;
      App.saveCart(cart);
      renderCart(); // Re-render instead of reloading
    }
  }

  function removeCartItem(itemElement) {
    const productId = itemElement.dataset.productId;
    const size = itemElement.dataset.size;
    const color = itemElement.dataset.color;

    cart = cart.filter(
      (item) =>
        !(
          item.productId === productId &&
          item.selectedSize === size &&
          item.selectedColor === color
        )
    );

    App.saveCart(cart);
    renderCart(); // Re-render instead of reloading
  }

  function updateOrderSummary(subtotal, discount, savings) {
    const total = subtotal - discount;

    const subtotalElem = document.getElementById("subtotal");
    const discountElem = document.getElementById("discount");
    const savingsElem = document.getElementById("savings");
    const totalElem = document.getElementById("total");

    if (subtotalElem) subtotalElem.textContent = `$${subtotal.toFixed(2)}`;
    if (discountElem) discountElem.textContent = `-$${discount.toFixed(2)}`;
    if (savingsElem) savingsElem.textContent = `$${savings.toFixed(2)}`;
    if (totalElem) totalElem.textContent = `$${total.toFixed(2)}`;
  }

  // Initialize
  renderCart();

  const checkoutBtn = document.getElementById("checkout-btn");
  // if user data is incomplete, disable place order
  if (
    !App.firebase.user ||
    !App.firebase.user.phoneNumber ||
    !App.firebase.user.address
  ) {
    checkoutBtn.disabled = true;
  }

  // allow user to change address during checkout feature
  const customerInfoForm = document.querySelector("#customerInfoForm");
  // user shouldn't submit the form it's used for validation
  customerInfoForm.addEventListener("submit", (e) => {
    e.preventDefault();
  });
  // validate address dynamically
  addressInput.addEventListener("input", () => {
    validateData(addressInput.value, addressInput, addressError, "address");
  });

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {
      // Validate customer info
      const name = nameInput.value.trim();
      const phone = phoneInput.value.trim();
      const address = addressInput.value.trim();
      const paymentMethod = document.querySelector(
        'input[name="paymentMethod"]:checked'
      ).value;

      if (!name || !address || !phone) {
        alert("Please fill in all customer information fields");
        return;
      }

      const total = Number(
        document.getElementById("total").textContent.replace("$", "")
      );

      // Prepare order data
      const orderData = {
        customer: { name, address, phone },
        paymentMethod,
        items: cart,
        subtotal: document.getElementById("subtotal").textContent,
        discount: document.getElementById("discount").textContent,
        total: document.getElementById("total").textContent,
        timestamp: new Date().toISOString(),
      };

      checkoutBtn.disabled = true;
      checkoutBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Checking out...`;
      if (paymentMethod === "Credit Card") {
        // Process credit card payment via Stripe
        stripe(total, orderData);
      } else {
        // Process COD order
        processCODOrder(orderData);
      }
    });
  }

  async function processCODOrder(orderData) {
    try {
      localStorage.setItem("pendingOrder", JSON.stringify(orderData));
      App.navigator("/orders/success");
    } catch (error) {
      console.error("Error processing COD order:", error);
    }
  }

  async function stripe(price, orderData) {
    try {
      const response = await fetch("https://adel.dev/scripts/stripe.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: price,
          name: App.title,
          secertKey:
            "sk_test_51RQUeBR6Vx60GccVjxM25syN5gooDpXXIqnCsMI4e5c4TGPmohrgAFGR5ea6TnPwYIMbjsZRsUp1bRcGETr8HWt100YMf0mwe9",
          onSuccess: window.location.origin + "/orders/success",
          onCancel: window.location.origin + "/cart",
        }),
      });

      const data = await response.json();
      if (data.url) {
        localStorage.setItem("pendingOrder", JSON.stringify(orderData));
        window.location.href = data.url;
      } else {
        alert("Error: " + (data.error || "Unable to process payment"));
      }
    } catch (error) {
      console.error("Stripe error:", error);
      alert("There was an error processing your payment. Please try again.");
    }
  }
};
