import { observer } from "/src/observer";

const componentID = "MessageDialog";

export default function MessageDialog(
  message,
  type = "success", // Can be "success" or "error"
  onClose,
  isLoading = false // Loading state
) {
  observer(componentID, () => compLoaded(message, type, onClose, isLoading));

  return /*html*/ `
    <div component="${componentID}" class="${componentID}" id="messageDialogOverlay">
      <div class="message-dialog-container ${type}-dialog">
        <div class="message-dialog-header">
          <h3>${
            isLoading ? "Processing" : type === "success" ? "Success" : "Error"
          }</h3>
          ${
            !isLoading
              ? '<button id="closeDialogBtn" class="close-btn">&times;</button>'
              : ""
          }
        </div>
        <div class="message-dialog-content">
          ${
            isLoading
              ? `<div class="spinner-container">
              <div class="spinner"></div>
              <p>${message || "Please wait..."}</p>
             </div>`
              : `<div class="message-icon ${type}-icon">
              ${
                type === "success"
                  ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z" fill="currentColor"/></svg>'
                  : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" fill="currentColor"/></svg>'
              }
            </div>
            <p class="message-text">${message}</p>`
          }
        </div>
        <div class="message-dialog-actions">
          <button id="confirmBtn" class="confirm-btn ${type}-btn" ${
    isLoading ? "disabled" : ""
  }>
            ${isLoading ? "Please wait..." : "OK"}
          </button>
        </div>
      </div>
    </div>
  `;
}

// JavaScript code to be executed once the component is loaded
const compLoaded = (message, type, onClose, isLoading) => {
  // Only add event listeners if not in loading state
  const closeBtn = document.getElementById("closeDialogBtn");
  if (closeBtn) {
    closeBtn.addEventListener("click", handleClose);
  }

  const confirmBtn = document.getElementById("confirmBtn");
  confirmBtn.addEventListener("click", handleClose);

  document
    .getElementById("messageDialogOverlay")
    .addEventListener("click", handleOverlayClick);

  // Handle close action
  function handleClose() {
    if (isLoading) return; // Prevent closing while loading
    removeDialog();
    if (typeof onClose === "function") {
      onClose();
    }
  }

  // Handle clicking outside the dialog
  function handleOverlayClick(event) {
    if (
      !isLoading &&
      event.target === document.getElementById("messageDialogOverlay")
    ) {
      handleClose();
    }
  }

  // Remove the dialog from DOM
  function removeDialog() {
    const dialog = document.getElementById("messageDialogOverlay");
    if (dialog) {
      dialog.remove();
    }
  }

  // Add keydown event to handle Escape key
  document.addEventListener("keydown", function escapeHandler(e) {
    if (e.key === "Escape") {
      handleClose();
      document.removeEventListener("keydown", escapeHandler);
    }
  });
};
