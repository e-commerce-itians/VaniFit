import { observer } from "../../observer";
import "./Cart.css";
const componentID = "cart";

export default async function Cart() {
  observer(componentID, compLoaded);
  return /*html*/ `
    <div component="${componentID}" class="container my-5">
      <div class="container py-5">
        <h1 class="mb-4">YOUR CART</h1>

        <div class="row">
          <div class="col-md-8">
            <div id="cart-items-container"></div>
          </div>

          <div class="col-md-4">
            <div class="order-summary">
              <h3 class="mb-4">Order Summary</h3>

              <div id="orderSummary">
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

                <div class="promo-input" style="display:none">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Add promo code"
                  />
                  <button class="btn btn-outline-dark">Apply</button>
                </div>

                <button id="checkout-btn" class="btn btn-dark w-100 mt-3">
                  Go to Checkout →
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
  let cart = App.getCart();
  const cartContainer = document.getElementById("cart-items-container");
  const summaryContainer = document.getElementById("orderSummary");

  function renderCart() {
    cartContainer.innerHTML = "";
    let subtotal = 0;
    let totalDiscount = 0;
    let totalSavings = 0;

    summaryContainer.style.display = "block";
    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty</p>";
      summaryContainer.innerHTML = `<p class="text-muted text-center">Your cart’s feeling a little lonely!</p>`;
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

    document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById("discount").textContent = `-$${discount.toFixed(
      2
    )}`;
    document.getElementById("savings").textContent = `$${savings.toFixed(2)}`;
    document.getElementById("total").textContent = `$${total.toFixed(2)}`;
  }

  // Initialize
  renderCart();

  document
    .getElementById("checkout-btn")
    .addEventListener("click", function () {
      window.location.href = "checkout.html";
    });
};
