// SigninWithGoogle.js
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default async function SigninWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(App.firebase.auth, provider);
    // The signed-in user info and token
    return result.user;
  } catch (error) {
    throw error;
  }
}
