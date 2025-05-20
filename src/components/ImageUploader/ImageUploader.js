// ImageUploader.js - Reusable image upload component

import { uploadToCloudinary } from "/src/utils/cloudinaryUploader.js";

/**
 * A reusable image upload component for use with Cloudinary
 *
 * @param {string} inputId - Unique ID for the file input
 * @param {string} imagePreviewId - ID for the image preview element
 * @param {string} progressId - ID for the progress bar element
 * @param {function} onUploadComplete - Callback function when upload is complete, receives URL
 * @returns {string} HTML markup for the component
 */
export function ImageUploader(
  inputId,
  imagePreviewId,
  progressId,
  uploadButtonId,
  clearButtonId
) {
  return /*html*/ `
    <div class="image-uploader">
      <div class="image-preview-container">
        <img id="${imagePreviewId}" class="image-preview" src="" style="display: none;">
        <div id="${progressId}" class="upload-progress" style="display: none;">
          <div class="progress-bar"></div>
          <div class="progress-text">0%</div>
        </div>
      </div>
      <div class="upload-actions">
        <input type="file" id="${inputId}" class="file-input" accept="image/*" style="display: none;">
        <button type="button" id="${uploadButtonId}" class="upload-btn">Upload Image</button>
        <button type="button" id="${clearButtonId}" class="clear-btn" style="display: none;">Clear</button>
      </div>
      <input type="hidden" id="${inputId}-url" name="${inputId}-url">
    </div>
  `;
}

/**
 * Sets up event listeners for the image uploader
 *
 * @param {string} inputId - ID of the file input
 * @param {string} imagePreviewId - ID of the image preview
 * @param {string} progressId - ID of the progress container
 * @param {string} uploadPreset - Cloudinary upload preset name
 * @param {function} onUploadComplete - Callback when upload completes
 */
export function setupImageUploader(
  inputId,
  imagePreviewId,
  progressId,
  uploadButtonId,
  clearButtonId,
  uploadPreset,
  onUploadComplete
) {
  const fileInput = document.getElementById(inputId);
  const imagePreview = document.getElementById(imagePreviewId);
  const progressContainer = document.getElementById(progressId);
  const progressBar = progressContainer.querySelector(".progress-bar");
  const progressText = progressContainer.querySelector(".progress-text");
  const uploadButton = document.getElementById(uploadButtonId);
  const clearButton = document.getElementById(clearButtonId);
  const hiddenUrlInput = document.getElementById(`${inputId}-url`);

  // Connect upload button to file input
  uploadButton.addEventListener("click", () => {
    fileInput.click();
  });

  // Clear button functionality
  clearButton.addEventListener("click", () => {
    imagePreview.style.display = "none";
    imagePreview.src = "";
    clearButton.style.display = "none";
    uploadButton.style.display = "inline-block";
    hiddenUrlInput.value = "";

    if (typeof onUploadComplete === "function") {
      onUploadComplete("", inputId);
    }
  });

  // Handle file selection
  fileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Show progress bar
      progressContainer.style.display = "flex";
      uploadButton.disabled = true;

      // Create progress callback
      const updateProgress = (percent) => {
        progressBar.style.width = percent + "%";
        progressText.textContent = percent + "%";
      };

      // Upload image
      const uploadedUrl = await uploadToCloudinary(
        file,
        uploadPreset,
        updateProgress
      );

      // Update preview
      imagePreview.src = uploadedUrl;
      imagePreview.style.display = "block";
      hiddenUrlInput.value = uploadedUrl;

      // Hide progress, show clear button
      progressContainer.style.display = "none";
      clearButton.style.display = "inline-block";
      uploadButton.style.display = "none";
      uploadButton.disabled = false;

      // Call completion callback
      if (typeof onUploadComplete === "function") {
        onUploadComplete(uploadedUrl, inputId);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      progressContainer.style.display = "none";
      uploadButton.disabled = false;
      alert("Upload failed: " + error.message);
    }
  });

  // Initialize with existing URL if available
  if (hiddenUrlInput.value) {
    imagePreview.src = hiddenUrlInput.value;
    imagePreview.style.display = "block";
    clearButton.style.display = "inline-block";
    uploadButton.style.display = "none";
  }
}
