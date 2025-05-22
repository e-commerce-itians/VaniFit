import { observer } from "../../../observer";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import "./Orderlist.css";
const componentID = "orderlist";

export default function Orderlist() {
  observer(componentID, compLoaded);
  return /*html*/ `
    <div component="${componentID}" class="container py-5">
      <div class="container py-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="mb-0">My Orders</h1>
        </div>

        <div class="row">
          <div class="col-12">
            <div id="ordersContainer" class="accordion">
              <!-- Orders will be loaded here -->
              <div class="text-center py-5" id="loadingIndicator">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3">Loading your orders...</p>
              </div>
              <div id="noOrdersMessage" class="text-center py-5 d-none">
                <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
                <h4>No orders found</h4>
                <p class="text-muted">You haven't placed any orders yet</p>
                <a href="/" class="btn btn-primary mt-3">Start Shopping</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

const compLoaded = async () => {
  // Load orders when page loads
  await loadOrders();
};

async function loadOrders() {
  try {
    const ordersContainer = document.getElementById("ordersContainer");
    const loadingIndicator = document.getElementById("loadingIndicator");
    const noOrdersMessage = document.getElementById("noOrdersMessage");

    // Show loading, hide other states
    loadingIndicator.classList.remove("d-none");
    noOrdersMessage.classList.add("d-none");
    ordersContainer.innerHTML = "";
    ordersContainer.appendChild(loadingIndicator);

    // Get user's orders document
    const orderDocRef = doc(App.firebase.db, "orders", App.firebase.user.uid);
    const orderDocSnap = await getDoc(orderDocRef);

    // Hide loading indicator
    loadingIndicator.classList.add("d-none");

    if (
      !orderDocSnap.exists() ||
      !orderDocSnap.data().orderList ||
      orderDocSnap.data().orderList.length === 0
    ) {
      noOrdersMessage.classList.remove("d-none");
      return;
    }

    // Get and filter orders
    let orders = orderDocSnap.data().orderList;

    // Sort by date (newest first)
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (orders.length === 0) {
      noOrdersMessage.classList.remove("d-none");
      return;
    }

    // Display orders
    ordersContainer.innerHTML = "You haven't placed any orders yet";
    orders.forEach((order, index) => {
      const orderElement = createOrderElement(order, index);
      ordersContainer.appendChild(orderElement);
    });
  } catch (error) {
    console.error("Error loading orders:", error);
    alert("Failed to load orders. Please try again.");
  }
}

function createOrderElement(order, index) {
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Get status badge class
  let statusBadgeClass;
  switch (order.status) {
    case "processing":
      statusBadgeClass = "bg-primary";
      break;
    case "shipped":
      statusBadgeClass = "bg-info text-dark";
      break;
    case "delivered":
      statusBadgeClass = "bg-success";
      break;
    case "cancelled":
      statusBadgeClass = "bg-danger";
      break;
    default:
      statusBadgeClass = "bg-secondary";
  }

  // Create order items list
  let itemsHtml = "";
  order.items.forEach((item) => {
    itemsHtml += `
      <div class="d-flex align-items-center py-2 border-bottom">
        <img src="${item.image || ""}" 
             class="rounded me-3" 
             width="60" 
             height="60" 
             alt="${item.name}">
        <div class="flex-grow-1">
          <h6 class="mb-1">${item.name}</h6>
          <small class="text-muted">Qty: ${item.quantity} × ${
      item.price
    }</small>
        </div>
        <div class="text-end">
          <strong>${(item.price * item.quantity).toFixed(2)}</strong>
        </div>
      </div>
    `;
  });

  const orderElement = document.createElement("div");
  orderElement.innerHTML = `
    <div class="accordion-item mb-3 border-0 shadow-sm">
      <h2 class="accordion-header" id="heading${index}">
        <button class="accordion-button collapsed py-3" type="button" data-bs-toggle="collapse" 
                data-bs-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">
          <div class="d-flex flex-column flex-md-row w-100">
            <div class="flex-grow-1 text-start">
              <span class="badge ${statusBadgeClass} me-2">${order.status.toUpperCase()}</span>
              <span class="fw-bold">Order #${order.orderId}</span>
            </div>
            <div class="text-md-end mt-2 mt-md-0">
              <span class="text-muted me-3">${orderDate}</span>
              <span class="fw-bold">${order.total}</span>
            </div>
          </div>
        </button>
      </h2>
      <div id="collapse${index}" class="accordion-collapse collapse" aria-labelledby="heading${index}">
        <div class="accordion-body p-0">
          <div class="p-3">
            <div class="row">
              <div class="col-md-6 mb-3 mb-md-0">
                <h6 class="text-muted">Shipping Address</h6>
                <p class="mb-1">${order.customer.name}</p>
                <p class="mb-1">${order.customer.address}</p>
                <p class="mb-0">${order.customer.phone}</p>
              </div>
              <div class="col-md-6">
                <h6 class="text-muted">Payment Method</h6>
                <p class="mb-1">${order.paymentMethod}</p>
                <h6 class="text-muted mt-3">Order Summary</h6>
                <div class="d-flex justify-content-between">
                  <span>Subtotal:</span>
                  <span>${order.subtotal}</span>
                </div>
                <div class="d-flex justify-content-between">
                  <span>Discount:</span>
                  <span>${order.discount}</span>
                </div>
                <div class="d-flex justify-content-between fw-bold mt-2">
                  <span>Total:</span>
                  <span>${order.total}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-light p-3">
            <h6 class="mb-3">Order Items</h6>
            ${itemsHtml}
          </div>
          <div class="p-3 text-end">
            <button class="btn btn-outline-primary me-2" disabled>
              <i class="fas fa-truck me-1"></i> Track Order
            </button>
            <button class="btn btn-outline-danger cancel-order-btn" data-order-id="${
              order.orderId
            }">
              <i class="fas fa-times me-1"></i> Cancel Order
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Add event listener to cancel button
  const cancelBtn = orderElement.querySelector(".cancel-order-btn");
  cancelBtn.addEventListener("click", async () => {
    if (confirm("Are you sure you want to cancel this order?")) {
      try {
        cancelBtn.disabled = true;
        cancelBtn.innerHTML =
          '<i class="fas fa-spinner fa-spin me-1"></i> Cancelling...';

        await cancelOrder(order);

        // Remove the order element from DOM
        orderElement.remove();

        // Check if no orders left
        const ordersContainer = document.getElementById("ordersContainer");
        if (ordersContainer.children.length === 0) {
          document.getElementById("noOrdersMessage").classList.remove("d-none");
        }
      } catch (error) {
        console.error("Error cancelling order:", error);
        alert("Failed to cancel order. Please try again.");
        cancelBtn.disabled = false;
        cancelBtn.innerHTML = '<i class="fas fa-times me-1"></i> Cancel Order';
      }
    }
  });

  return orderElement;
}

async function cancelOrder(order) {
  const orderDocRef = doc(App.firebase.db, "orders", App.firebase.user.uid);

  // Update the document by removing this order from the orderList array
  await updateDoc(orderDocRef, {
    orderList: arrayRemove(order),
  });

  console.log("Order cancelled successfully:", order.orderId);
}
