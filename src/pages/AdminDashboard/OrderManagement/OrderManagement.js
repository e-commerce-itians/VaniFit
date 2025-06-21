import { observer } from "../../../observer";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import "./OrderManagement.css";
import "./OrderDetailsModal.css";
import { showOrderDetails } from "./OrderDetailsModal";

const componentID = "ordermanagement";

export default function OrderManagement() {
  observer(componentID, () => {
    loadOrders();
  });

  return /*html*/ `
    <div component="${componentID}" class="order-management">
      <h2>Order Management</h2>
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">Order ID</th>
              <th scope="col">Customer</th>
              <th scope="col">Date</th>
              <th scope="col">Total</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody id="ordersTableBody">
            <tr>
              <td colspan="6" class="text-center">
                <div class="py-4">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <p class="mt-2 text-muted">Loading orders...</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

async function loadOrders() {
  try {
    // Check if user is admin
    if (!App.firebase.user || App.firebase.user.role !== "admin") {
      document.getElementById("ordersTableBody").innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-danger">You don't have permission to view orders.</td>
        </tr>
      `;
      return;
    }

    // Create a loading message
    document.getElementById("ordersTableBody").innerHTML = `
      <tr>
        <td colspan="6" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p>Loading orders...</p>
        </td>
      </tr>
    `;

    const ordersCollection = collection(App.firebase.db, "orders");
    const ordersSnapshot = await getDocs(ordersCollection);
    const orders = [];

    // Collect all orders from each user's document
    ordersSnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.orderList && Array.isArray(userData.orderList)) {
        orders.push(
          ...userData.orderList.map((order) => ({
            ...order,
            documentId: doc.id, // Store the document ID for updates
          }))
        );
      }
    });

    // Sort orders by date (most recent first)
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    updateOrdersTable(orders);
  } catch (error) {
    console.error("Error loading orders:", error);
    document.getElementById("ordersTableBody").innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-danger">Error loading orders. Please try again.</td>
      </tr>
    `;
  }
}

async function updateOrdersTable(orders) {
  const tableBody = document.getElementById("ordersTableBody");
  if (!orders.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center">No orders found</td>
      </tr>
    `;
    return;
  }

  // First, fetch all customer emails from users collection
  const customerEmails = await Promise.all(
    orders.map(async (order) => {
      try {
        // Get customer email from users collection using userId
        const userRef = doc(App.firebase.db, "users", order.userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          return userSnap.data().email || "Email not found";
        } else {
          return "User not found";
        }
      } catch (error) {
        console.error(
          `Error fetching user data for order ${order.orderId}:`,
          error
        );
        return "Error loading email";
      }
    })
  );

  // Then render the table with the fetched emails
  tableBody.innerHTML = orders
    .map(
      (order, index) => `
    <tr>
      <td>${order.orderId}</td>
      <td>${customerEmails[index]}</td>
      <td>${new Date(order.createdAt).toLocaleDateString()}</td>
      <td>${order.total.slice(1)} EGP</td>
      <td>
        <select 
          class="form-select form-select-sm status-select" 
          data-document-id="${order.documentId}"
          data-order-id="${order.orderId}"
          value="${order.status}"
        >
          <option value="processing" ${
            order.status === "processing" ? "selected" : ""
          }>Processing</option>
          <option value="shipped" ${
            order.status === "shipped" ? "selected" : ""
          }>Shipped</option>
          <option value="on-the-way" ${
            order.status === "on-the-way" ? "selected" : ""
          }>On the way</option>
          <option value="delivered" ${
            order.status === "delivered" ? "selected" : ""
          }>Delivered</option>
          <option value="cancelled" ${
            order.status === "cancelled" ? "selected" : ""
          }>Cancelled</option>
        </select>
      </td>
      <td>
        <button 
          class="btn btn-sm btn-info view-order-btn"
          data-order-id="${order.orderId}"
        >
          View Details
        </button>
      </td>
    </tr>
  `
    )
    .join("");

  // Add event listeners for status changes
  document.querySelectorAll(".status-select").forEach((select) => {
    select.addEventListener("change", handleStatusChange);
  });

  // Add event listeners for view details buttons
  document.querySelectorAll(".view-order-btn").forEach((button) => {
    button.addEventListener("click", handleViewDetails);
  });
}

async function handleStatusChange(event) {
  const select = event.target;
  const documentId = select.dataset.documentId;
  const orderId = select.dataset.orderId;
  const newStatus = select.value;

  try {
    select.disabled = true;

    // Get the document
    const orderDocRef = doc(App.firebase.db, "orders", documentId);
    const orderDoc = await getDoc(orderDocRef);
    const orderData = orderDoc.data();

    // Find and update the specific order in the orderList array
    const updatedOrderList = orderData.orderList.map((order) => {
      if (order.orderId === orderId) {
        return {
          ...order,
          status: newStatus,
          lastUpdated: new Date().toISOString(),
        };
      }
      return order;
    });

    // Update the document
    await updateDoc(orderDocRef, {
      orderList: updatedOrderList,
    });

    // Visual feedback
    select.classList.add("bg-success", "text-white");
    setTimeout(() => {
      select.classList.remove("bg-success", "text-white");
      select.disabled = false;
    }, 1000);
  } catch (error) {
    console.error("Error updating order status:", error);
    select.disabled = false;
    select.classList.add("bg-danger", "text-white");
    setTimeout(() => {
      select.classList.remove("bg-danger", "text-white");
      // Revert to previous value
      select.value = select.getAttribute("value");
    }, 1000);
  }
}

async function handleViewDetails(event) {
  const button = event.target;
  const orderId = button.dataset.orderId;
  const originalText = button.innerHTML;

  // Reset function to restore button state
  const resetButton = () => {
    button.disabled = false;
    button.innerHTML = originalText;
  };

  try {
    // Disable button and show loading state
    button.disabled = true;
    button.innerHTML = `
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Loading...
    `;

    // Find the order in the table row
    const row = button.closest("tr");
    const email = row.cells[1].textContent;

    // Get the full order details from Firestore
    const ordersCollection = collection(App.firebase.db, "orders");
    const ordersSnapshot = await getDocs(ordersCollection);
    let fullOrderData = null;

    // Find the specific order in the orders collection
    for (const doc of ordersSnapshot.docs) {
      const userData = doc.data();
      if (userData.orderList && Array.isArray(userData.orderList)) {
        const foundOrder = userData.orderList.find(
          (o) => o.orderId === orderId
        );
        if (foundOrder) {
          fullOrderData = { ...foundOrder, documentId: doc.id };
          break;
        }
      }
    }

    if (!fullOrderData) {
      throw new Error("Order not found");
    }

    // Get user details from users collection
    const userRef = doc(App.firebase.db, "users", fullOrderData.userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      fullOrderData.customer = {
        ...fullOrderData.customer,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: email,
      };
    }

    // Show the modal
    showOrderDetails(fullOrderData, email);
  } catch (error) {
    console.error("Error showing order details:", error);
    App.showToast("Error loading order details. Please try again.", "error");
  } finally {
    // Always reset button state, whether there was success or error
    resetButton();
  }
}
