import { signInWithEmailAndPassword } from "firebase/auth";

export default async function Signin(e) {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;
  try {
    const userCredential = await signInWithEmailAndPassword(
      App.firebase.auth,
      email,
      password
    );
    alert("Logged in as: " + userCredential.user.email);
  } catch (error) {
    alert("Login failed: " + error.message);
  }
}
