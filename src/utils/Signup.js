import { createUserWithEmailAndPassword } from "firebase/auth";

export default async function Signup(e) {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;
  Array.from(e.target.elements).forEach((el) => (el.disabled = true));
  try {
    const userCredential = await createUserWithEmailAndPassword(
      App.firebase.auth,
      email,
      password
    );
    alert("User registered: " + userCredential.user.email);
  } catch (error) {
    Array.from(e.target.elements).forEach((el) => (el.disabled = false));
    alert("Error: " + error.message);
  }
}
