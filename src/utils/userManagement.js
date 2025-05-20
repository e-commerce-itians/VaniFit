import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { collection } from "firebase/firestore";

// firebase error messages
const formErrors = {
  email: "invalid email format.",
  password: "passwords are at least 6 characters length.",
  "password confirmation": "password confirmation must match password.",
  name: "names must be alphabetic with 3 to 32 characters length.",
  phone: "invalid phone number format.",
  address: "invalid address format.",
};

const isValid = {
  email: isValidEmail,
  password: isValidPassword,
  name: isValidName,
  phone: isValidPhone,
  address: isValidAddress,
};

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
  "auth/invalid-credential": "Incorrect username or password",
  "auth/requires-recent-login":
    "This action requires a recent login. Please log in again.",
  "auth/user-disabled":
    "This account has been disabled. Please contact support.",
  default: "An unknown error occurred. Please try again.",
};

// check credentials validity
function isValidName(name) {
  const regex = /^[a-zA-Z\p{L}'\-\s]+$/u.test(name);
  const nameLength = name.length >= 3 && name.length <= 32;
  return regex && nameLength;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
  return password.length >= 6;
}

function isValidPhone(phone) {
  return /^\+?[\d\s\-\(\)]+$/.test(phone);
}

function isValidAddress(address) {
  return address.length < 10;
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

export function validateData(data, dataInput, dataError, dataType = "default") {
  // flag for submission case
  let formValid = true;
  // check for empty or invalid input
  if (data == "") {
    setValidationFeedback(
      dataInput,
      dataError,
      false,
      `${dataType} is required.`
    );
    formValid = false;
  } else if (!isValid[dataType](data)) {
    setValidationFeedback(dataInput, dataError, false, formErrors[dataType]);
    formValid = false;
  } else {
    setValidationFeedback(dataInput, dataError, true);
  }
  return formValid;
}

// handling password confirmation case to compared to password
export function validatePasswordConfirmation(
  password,
  confirmPassword,
  confirmPasswordInput,
  confirmPasswordError
) {
  let formValid = true;
  if (confirmPassword == "") {
    setValidationFeedback(
      confirmPasswordInput,
      confirmPasswordError,
      false,
      `password confirmation is required.`
    );
    formValid = false;
  } else if (!isValidPassword(confirmPassword)) {
    setValidationFeedback(
      confirmPasswordInput,
      confirmPasswordError,
      false,
      "passwords are at least 6 characters length."
    );
    formValid = false;
  } else if (password !== confirmPassword) {
    setValidationFeedback(
      confirmPasswordInput,
      confirmPasswordError,
      false,
      "passwords do not match."
    );
    formValid = false;
  } else {
    setValidationFeedback(confirmPasswordInput, confirmPasswordError, true);
  }
  return formValid;
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  // return user with its information
  await signInWithPopup(App.firebase.auth, provider)
    .then((userCredential) => {
      return userCredential.user;
    })
    .catch((error) => {
      throw error;
    });
}

// copy auth user data to firestore
export async function createUserDocument(user) {
  const userRef = App.firebase.db.collection("users").doc(user.uid);

  const doc = await user.get();

  if (!doc.exists) {
    await userRef.set({
      uid: userRef.uid,
      email: userRef.email,
    });
    console.log("User document created in Firestore.");
  } else {
    console.log("User document already exists.");
  }
}
