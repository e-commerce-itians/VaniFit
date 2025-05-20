import { observer } from "/src/observer";
import { deleteProduct as delProd } from "/src/utils/deleteProduct";

const componentID = "DeleteDialog";

export default function DeleteDialog(
  productId,
  productName,
  onCancel,
  onSuccess
) {
  observer(componentID, () =>
    compLoaded(productId, productName, onCancel, onSuccess)
  );

  return /*html*/ `
    <div component="${componentID}" class="${componentID}" id="deleteDialogOverlay">
      <div class="delete-dialog-container">
        <div class="delete-dialog-header">
          <h3>Confirm Deletion</h3>
          <button id="closeDialogBtn" class="close-btn">&times;</button>
        </div>
        <div class="delete-dialog-content">
          <p>Are you sure you want to delete this product?</p>
          <p class="product-name">"${productName || "Unnamed Product"}"</p>
          <p class="warning-text">This action cannot be undone.</p>
        </div>
        <div class="delete-dialog-actions">
          <button id="cancelDeleteBtn" class="cancel-btn">Cancel</button>
          <button id="confirmDeleteBtn" class="delete-btn">Delete</button>
        </div>
      </div>
    </div>
  `;
}

// JavaScript code to be executed once the component is loaded
const compLoaded = (productId, productName, onCancel, onSuccess) => {
  // Add event listeners for all buttons
  document
    .getElementById("closeDialogBtn")
    .addEventListener("click", handleCancel);
  document
    .getElementById("cancelDeleteBtn")
    .addEventListener("click", handleCancel);
  document
    .getElementById("confirmDeleteBtn")
    .addEventListener("click", handleConfirm);
  document
    .getElementById("deleteDialogOverlay")
    .addEventListener("click", handleOverlayClick);

  // Handle cancel action (from X button or Cancel button)
  function handleCancel() {
    removeDialog();
    if (typeof onCancel === "function") {
      onCancel();
    }
  }

  // Handle confirmation action
  function handleConfirm() {
    // Delete the product
    try {
      delProd(productId);
      removeDialog();
      if (typeof onSuccess === "function") {
        onSuccess();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product: " + error.message);
    }
  }

  // Handle clicking outside the dialog
  function handleOverlayClick(event) {
    if (event.target === document.getElementById("deleteDialogOverlay")) {
      handleCancel();
    }
  }

  // Remove the dialog from DOM
  function removeDialog() {
    const dialog = document.getElementById("deleteDialogOverlay");
    if (dialog) {
      dialog.remove();
    }
  }

  // Add keydown event to handle Escape key
  document.addEventListener("keydown", function escapeHandler(e) {
    if (e.key === "Escape") {
      handleCancel();
      document.removeEventListener("keydown", escapeHandler);
    }
  });
};
