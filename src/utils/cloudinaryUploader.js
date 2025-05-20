
/**
 * Uploads an image to Cloudinary
 * 
 * @param {File} file - The file object to upload
 * @param {string} preset - The upload preset name (create this in your Cloudinary dashboard)
 * @param {function} progressCallback - Optional callback for upload progress
 * @returns {Promise<string>} - URL of the uploaded image
 */

export async function uploadToCloudinary(file, preset, progressCallback = null) {
  const CLOUD_NAME = 'dbymxe1wb';
  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  
  // Create form data for upload
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', preset);
  
  try {
    // Use XMLHttpRequest instead of fetch to track upload progress
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // Set up progress tracking if callback provided
      if (progressCallback && typeof progressCallback === 'function') {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            progressCallback(percentComplete);
          }
        };
      }
      
      xhr.open('POST', UPLOAD_URL, true);
      
      xhr.onload = function() {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          // Return the secure URL of the uploaded image
          resolve(response.secure_url);
        } else {
          // Get detailed error message from response
          let errorMessage = 'Upload failed';
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            errorMessage = `Upload failed: ${errorResponse.error?.message || 'Unknown error'}`;
            console.error('Cloudinary error response:', errorResponse);
          } catch (e) {
            console.error('Raw response:', xhr.responseText);
          }
          reject(new Error(errorMessage));
        }
      };
      
      xhr.onerror = function() {
        reject(new Error('Network error occurred. Please check your internet connection.'));
      };
      
      xhr.send(formData);
    });
    
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}
