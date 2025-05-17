import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

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

export async function googleSignin() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(App.firebase.auth, provider);
    // The signed-in user info and token
    return result.user;
  } catch (error) {
    throw error;
  }
}
