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
        <!-- Cart Items will be dynamically inserted here -->
        <div id="cart-items-container"></div>
    </div>
    
    <div class="col-md-4">
        <div class="order-summary">
            <h3 class="mb-4">Order Summary</h3>
            
            <div class="summary-row">
                <span>Subtotal</span>
                <span id="subtotal">$0</span>
            </div>
            
            <div class="summary-row">
                <span>Discount (-20%)</span>
                <span id="discount">-$0</span>
            </div>
            
            <div class="summary-row">
                <span>Delivery Fee</span>
                <span id="delivery">$15</span>
            </div>
            
            <div class="summary-row total-row">
                <span>Total</span>
                <span id="total">$0</span>
            </div>
            
            <div class="promo-input">
                <input type="text" class="form-control" placeholder="Add promo code">
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
    `;
}
const compLoaded = () => {
  // Get cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartContainer = document.getElementById("cart-items-container");
  let subtotal = 0;

  // Display cart items
  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty</p>";
    updateOrderSummary(0);
    return;
  }

  // Render cart items
  cart.forEach((item) => {
    const product = {
      name: item.name,
      price: item.price,
      image: item.image,
    };

    subtotal += product.price * item.quantity;

    const itemHTML = `
            <div class="cart-item">
                <div class="d-flex justify-content-between">
                    <div>
                        <div class="item-title">${product.name}</div>
                        <div class="item-details mt-1">
                            Size: ${item.selectedSize}<br>
                            Color: ${item.selectedColor}
                        </div>
                        <div class="item-price mt-2">$${product.price}</div>
                    </div>
                    <div>
                        <img src="${product.image}" width="80" height="80" style="object-fit: cover;">
                    </div>
                </div>
            </div>
        `;

    cartContainer.insertAdjacentHTML("beforeend", itemHTML);
  });

  // Update order summary
  updateOrderSummary(subtotal);

  // Checkout button
  document
    .getElementById("checkout-btn")
    .addEventListener("click", function () {
      // In a real app, this would redirect to checkout
      alert("Proceeding to checkout");
    });

  function updateOrderSummary(subtotal) {
    const discount = subtotal * 0.2;
    const delivery = 15;
    const total = subtotal - discount + delivery;

    document.getElementById("subtotal").textContent = `$${subtotal}`;
    document.getElementById("discount").textContent = `-$${discount}`;
    document.getElementById("total").textContent = `$${total}`;
  }
};
