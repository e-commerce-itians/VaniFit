import { firebaseApp, firebaseAuth, firebaseAnalytics } from "./utils/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import Signin from "./utils/Signin";
import Signup from "./utils/Signup";
import Signout from "./utils/Signout";
import router from "./router.js";
import Setdata from "./utils/Setdata.js";
import Getdata from "./utils/Getdata.js";

// Global vars accessble anywhere in any componenet
window.App = {
  title: "Shop", //Navbar title
  navigator: (href) => {
    history.pushState(null, "", href);
    router();
  }, //Change page internally

  firebase: {
    app: firebaseApp, //firebase app init
    auth: firebaseAuth, //firebase auth init
    analytics: firebaseAnalytics, //firebase analytics init
    signIn: Signin, //sign-in function
    signUp: Signup, //sign-up function
    signOut: Signout, //sign-out function
    setData: Setdata,
    getData: Getdata,
    user: {}, //user data once logged in
  },
};

// Function to get user login status
onAuthStateChanged(App.firebase.auth, (user) => {
  if (user) {
    //User is logged in
    App.firebase.user = user;
  } else {
    //User is not logged in
    App.firebase.user = {};
  }
  router();
});
