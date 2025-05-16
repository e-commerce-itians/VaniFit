import { firebaseApp, firebaseAuth, firebaseAnalytics } from "./utils/Firebase";
import Signin from "./utils/Signin";
import Signup from "./utils/Signup";

window.App = {
  title: "Shop",

  firebase: {
    app: firebaseApp,
    auth: firebaseAuth,
    analytics: firebaseAnalytics,
    signIn: Signin,
    signUp: Signup,
  },
};
