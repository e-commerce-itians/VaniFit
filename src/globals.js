import { firebaseApp, firebaseAuth, firebaseAnalytics } from "./utils/Firebase";
import Signin from "./utils/Signin";
import Signup from "./utils/Signup";
import Signout from "./utils/Signout";

// Global vars accessble anywhere in any componenet
window.App = {
  title: "Shop", //Navbar title

  firebase: {
    app: firebaseApp, //firebase app init
    auth: firebaseAuth, //firebase auth init
    analytics: firebaseAnalytics, //firebase analytics init
    signIn: Signin, //sign-in function
    signUp: Signup, //sign-up function
    signOut: Signout, //sign-out function
    user: {}, //user data once logged in
  },
};
