import {
  firebaseApp,
  firebaseAuth,
  firebaseAnalytics,
  firebasedb,
} from "./utils/firebase.js";
import router from "./router.js";
import Setdata from "./utils/setData.js";
import Getdata from "./utils/getData.js";

// Global vars accessible anywhere in any component
window.App = {
  title: "Shop", //Navbar title
  navigator: (href) => {
    history.pushState(null, "", href);
    router();
  }, //Change page internally
  authLoaded: false, //check if user auth has been checked or not

  firebase: {
    app: firebaseApp, //firebase app init
    auth: firebaseAuth, //firebase auth init
    analytics: firebaseAnalytics, //firebase analytics init
    db: firebasedb,
    setData: Setdata,
    getData: Getdata,
    user: {}, //user data once logged in
  },
};
