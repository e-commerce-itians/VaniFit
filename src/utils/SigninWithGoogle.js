// SigninWithGoogle.js
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseAuth } from "./Firebase";

export default async function SigninWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(firebaseAuth, provider);
        // The signed-in user info and token
        return result.user;
    } catch (error) {
        throw error;
    }
}
