import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// firebase error messages
export const firebaseAuthErrors = {
  "auth/user-not-found":
    "No account found with this email. Please check your email or register.",
  "auth/wrong-password":
    "The password you entered is incorrect. Please try again.",
  "auth/invalid-email":
    "The email address is not valid. Please enter a valid email.",
  "auth/email-already-in-use":
    "This email address is already registered. Please login or use a different email.",
  "auth/weak-password":
    "The password is too weak. Please use at least 6 characters.",
  "auth/too-many-requests":
    "Too many login attempts. Please try again later or reset your password.",
  "auth/network-request-failed":
    "A network error occurred. Please check your internet connection.",
  "auth/operation-not-allowed":
    "Email/password sign-in is not enabled. Please contact support.",
  "auth/account-exists-with-different-credential":
    "An account already exists with the same email, but signed in differently. Please try logging in with Google or reset your password if you used email/password.",
  "auth/popup-closed-by-user": "Sign-in was cancelled. Please try again.",
  "auth/unauthorized-domain":
    "This domain is not authorized for sign-in. Please contact support.",
  "auth/internal-error":
    "An unexpected authentication error occurred. Please try again.",
  "auth/invalid-credential": "Your session has expired. Please log in again.",
  "auth/requires-recent-login":
    "This action requires a recent login. Please log in again.",
  "auth/user-disabled":
    "This account has been disabled. Please contact support.",
  default: "An unknown error occurred. Please try again.",
};

// check credentials validity
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isValidPassword(password) {
  return password.length >= 6;
}

// validation to update form styling and show error message
function setValidationFeedback(
  inputElement,
  feedbackElement,
  isValid,
  message = ""
) {
  if (isValid) {
    inputElement.classList.remove("is-invalid");
    inputElement.classList.add("is-valid");
  } else {
    inputElement.classList.remove("is-valid");
    inputElement.classList.add("is-invalid");
    feedbackElement.textContent = message;
  }
}

export function validateEmail(email, emailInput, emailError) {
  // flag for form submission case
  let formValid = true;
  // check if email is empty or invalid format
  if (email === "") {
    setValidationFeedback(emailInput, emailError, false, "Email is required.");
    formValid = false;
  } else if (!isValidEmail(email)) {
    setValidationFeedback(
      emailInput,
      emailError,
      false,
      "Please enter a valid email address."
    );
    formValid = false;
  } else {
    setValidationFeedback(emailInput, emailError, true);
  }
  return formValid;
}

export function validatePassword(password, passwordInput, passwordError) {
  let formValid = true;
  // check for empty or weak password
  if (password === "") {
    setValidationFeedback(
      passwordInput,
      passwordError,
      false,
      "Password is required."
    );
    formValid = false;
  } else if (!isValidPassword(password)) {
    setValidationFeedback(
      passwordInput,
      passwordError,
      false,
      "Password must be at least 6 characters long."
    );
    formValid = false;
  } else {
    setValidationFeedback(passwordInput, passwordError, true);
  }
  return formValid;
}

export function validateConfirmPassword(
  password,
  confirmPassword,
  confirmPasswordInput,
  confirmPasswordError
) {
  let formValid = true;
  // check for empty password confirmation or inequality with password
  if (confirmPassword === "") {
    setValidationFeedback(
      confirmPasswordInput,
      confirmPasswordError,
      false,
      "Please confirm your password."
    );
    formValid = false;
  } else if (password !== confirmPassword) {
    setValidationFeedback(
      confirmPasswordInput,
      confirmPasswordError,
      false,
      "Passwords do not match."
    );
    formValid = false;
  } else {
    setValidationFeedback(confirmPasswordInput, confirmPasswordError, true);
  }
  return formValid;
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(App.firebase.auth, provider);
    // The signed-in user info and token
    return result.user;
  } catch (error) {
    throw error;
  }
}
