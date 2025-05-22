export function showOrderDetails(order, customerEmail) {
  // Create modal HTML
  const modalHTML = /*html*/ `
    <div class="order-details-modal" id="orderDetailsModal">
      <div class="order-details-content">
        <div class="order-details-header">
          <h3>Order Details - #${order.orderId}</h3>
          <button class="close-modal-btn" onclick="document.getElementById('orderDetailsModal').classList.remove('show')">&times;</button>
        </div>
        <div class="order-details-body">
          <div class="order-info-section">
            <h4>Customer Information</h4>
            <div class="info-grid">
              <div class="info-item">
                <label>Email</label>
                <span>${customerEmail}</span>
              </div>
              <div class="info-item">
                <label>Phone</label>
                <span>${order.customer.phone}</span>
              </div>
              <div class="info-item">
                <label>Address</label>
                <span>${order.customer.address}</span>
              </div>
            </div>
          </div>

          <div class="order-info-section">
            <h4>Order Information</h4>
            <div class="info-grid">
              <div class="info-item">
                <label>Order Date</label>
                <span>${new Date(order.createdAt).toLocaleString()}</span>
              </div>
              <div class="info-item">
                <label>Status</label>
                <span>${
                  order.status.charAt(0).toUpperCase() + order.status.slice(1)
                }</span>
              </div>
              <div class="info-item">
                <label>Payment Method</label>
                <span>${order.paymentMethod}</span>
              </div>
              <div class="info-item">
                <label>Last Updated</label>
                <span>${
                  order.lastUpdated
                    ? new Date(order.lastUpdated).toLocaleString()
                    : "N/A"
                }</span>
              </div>
            </div>
          </div>

          <div class="order-info-section">
            <h4>Order Items</h4>
            <div class="table-responsive">
              <table class="order-items-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Color</th>
                    <th>Size</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.items
                    .map(
                      (item) => /*html*/ `
                    <tr>
                      <td>${item.name}</td>
                      <td>${item.selectedColor}</td>
                      <td>${item.selectedSize}</td>
                      <td>${item.quantity}</td>
                      <td>${item.price}</td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="order-total">
          Total: ${order.total}
        </div>
      </div>
    </div>
  `;

  // Remove existing modal if it exists
  const existingModal = document.getElementById("orderDetailsModal");
  if (existingModal) {
    existingModal.remove();
  }

  // Add modal to the document
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Show modal
  setTimeout(() => {
    document.getElementById("orderDetailsModal").classList.add("show");
  }, 10);

  // Add click event to close modal when clicking outside
  const modal = document.getElementById("orderDetailsModal");

  // Function to close modal
  const closeModal = () => {
    modal.classList.remove("show");
    setTimeout(() => modal.remove(), 300); // Remove after animation
  };

  // Close on outside click
  modal.addEventListener("click", (e) => {
    if (e.target.classList.contains("order-details-modal")) {
      closeModal();
    }
  });

  // Close on X button click
  const closeBtn = modal.querySelector(".close-modal-btn");
  closeBtn.onclick = closeModal;

  // Close on ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });
}
