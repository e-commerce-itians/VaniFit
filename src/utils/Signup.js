import { createUserWithEmailAndPassword } from "firebase/auth";

export default async function Signup(e) {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;
  try {
    const userCredential = await createUserWithEmailAndPassword(
      App.firebase.auth,
      email,
      password
    );
    alert("User registered: " + userCredential.user.email);
  } catch (error) {
    alert("Error: " + error.message);
  }
}
