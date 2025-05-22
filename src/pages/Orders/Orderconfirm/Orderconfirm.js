import { observer } from "../../../observer";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import "./Orderconfirm.css";
const componentID = "orderconfirm";

export default function Orderconfirm(status) {
  observer(componentID, () => {
    compLoaded(status);
  });
  return /*html*/ `
    <div component="${componentID}" class="p-5">
      <div class="container d-flex justify-content-center align-items-center min-vh-75">
        <div class="success-card card p-4 p-md-5 text-center">
          <div class="card-body">
            <div class="success-icon-order">
              <i class="fas fa-check-circle"></i>
            </div>
            <h1 class="card-title mb-3">Order Placed Successfully!</h1>
            <p class="card-text text-muted mb-4">
              Thank you for your purchase. Your order has been confirmed and
              will be processed shortly.
            </p>

            <div class="order-details mb-4 text-start" id="orderDetails">
                    <div class="row">
                    <div class="col-md-6 mb-3">
                    <h6 class="text-muted">Order Number</h6>
                    <p class="fw-bold">
                    <h5 class="card-title placeholder-glow">
                    <span class="placeholder col-6"></span>
                  </h5>
                    </p>
                    </div>
                    <div class="col-md-6 mb-3">
                    <h6 class="text-muted">Date</h6>
                    <p class="fw-bold">
                    <h5 class="card-title placeholder-glow">
                    <span class="placeholder col-5"></span>
                  </h5>
                    </p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                    <h6 class="text-muted">Total Amount</h6>
                    <p class="fw-bold">
                    <h5 class="card-title placeholder-glow">
                    <span class="placeholder col-4"></span>
                  </h5>
                  </p>
                    </div>
                    <div class="col-md-6 mb-3">
                    <h6 class="text-muted">Payment Method</h6>
                    <p class="fw-bold">
                    <h5 class="card-title placeholder-glow">
                    <span class="placeholder col-6"></span>
                  </h5>
                    </p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12 mb-3">
                    <h6 class="text-muted">Shipping Address</h6>
                    <p class="fw-bold">
                    <h5 class="card-title placeholder-glow">
                    <span class="placeholder col-8"></span>
                  </h5>
                    </p>
                    </div>
                </div>
            </div>

            <p class="mb-4" id="confirmationEmail">
            </p>

            <div class="d-grid gap-3 d-md-flex justify-content-md-center">
              <a href="/orders" class="btn btn-track btn-primary" data-link>
                <i class="fas fa-truck me-2"></i> Track Your Order
              </a>
              <a href="/shop" class="btn btn-outline-secondary btn-shop" data-link>
                <i class="fas fa-shopping-bag me-2"></i> Continue Shopping
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

const compLoaded = async (status) => {
  try {
    // Get the pending order from localStorage
    const pendingOrder = JSON.parse(localStorage.getItem("pendingOrder"));

    if (!pendingOrder) {
      App.navigator("/");
      return;
    }

    // Generate a unique order ID
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Prepare the order data for Firebase
    const orderData = {
      ...pendingOrder,
      orderId,
      status: "processing",
      userId: App.firebase.user.uid,
      createdAt: new Date().toISOString(),
    };

    // Save to Firebase
    await saveOrderToFirebase(orderData);

    // Update the UI with actual order data
    updateOrderUI(orderData);

    // Clear the pending order from localStorage
    localStorage.removeItem("pendingOrder");
    App.clearCart();
  } catch (error) {
    console.error("Error processing order:", error);
  }
};

async function saveOrderToFirebase(orderData) {
  try {
    // Reference to user's order document in orders collection
    const orderDocRef = doc(App.firebase.db, "orders", App.firebase.user.uid);

    // Get current order document
    const orderDocSnap = await getDoc(orderDocRef);

    if (orderDocSnap.exists()) {
      // Document exists - update the orderList array
      await updateDoc(orderDocRef, {
        orderList: arrayUnion(orderData),
      });
    } else {
      // Document doesn't exist - create new with this order
      await setDoc(orderDocRef, {
        userId: App.firebase.user.uid,
        orderList: [orderData],
      });
    }

    console.log("Order saved successfully to Firebase");
  } catch (error) {
    console.error("Error saving order to Firebase:", error);
    throw error;
  }
}

function updateOrderUI(orderData) {
  // Format the date
  const orderDate = new Date(orderData.timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Update order details
  document.getElementById("orderDetails").innerHTML = `
    <div class="row">
      <div class="col-md-6 mb-3">
        <h6 class="text-muted">Order Number</h6>
        <p class="fw-bold">${orderData.orderId}</p>
      </div>
      <div class="col-md-6 mb-3">
        <h6 class="text-muted">Date</h6>
        <p class="fw-bold">${orderDate}</p>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 mb-3">
        <h6 class="text-muted">Total Amount</h6>
        <p class="fw-bold">${orderData.total}</p>
      </div>
      <div class="col-md-6 mb-3">
        <h6 class="text-muted">Payment Method</h6>
        <p class="fw-bold">${orderData.paymentMethod}</p>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12 mb-3">
        <h6 class="text-muted">Shipping Address</h6>
        <p class="fw-bold">
          ${orderData.customer.address}
        </p>
      </div>
    </div>
  `;

  // Update confirmation email
  document.getElementById("confirmationEmail").innerHTML = `
    A confirmation email has been sent to <strong>${App.firebase.user.email}</strong>
  `;
}
