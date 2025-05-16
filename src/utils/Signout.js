import { signOut } from "firebase/auth";

export default async function Signout() {
  await signOut(App.firebase.auth);
  App.navigator("/");
}
