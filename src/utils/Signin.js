import { signInWithEmailAndPassword } from "firebase/auth";

export default async function Signin(e) {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;
  Array.from(e.target.elements).forEach((el) => (el.disabled = true));
  try {
    const userCredential = await signInWithEmailAndPassword(
      App.firebase.auth,
      email,
      password
    );
    alert("Logged in as: " + userCredential.user.email);
    App.navigator("/");
  } catch (error) {
    Array.from(e.target.elements).forEach((el) => (el.disabled = false));
    alert("Login failed: " + error.message);
  }
}
