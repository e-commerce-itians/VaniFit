import {
  firebaseApp,
  firebaseAuth,
  firebaseAnalytics,
  firebasedb,
} from "./utils/Firebase";
import router from "./router.js";
import Setdata from "./utils/Setdata.js";
import Getdata from "./utils/Getdata.js";

// Global vars accessible anywhere in any component
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
    db: firebasedb,
    setData: Setdata,
    getData: Getdata,
    user: {}, //user data once logged in
  },
};
