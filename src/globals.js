import {
  firebaseApp,
  firebaseAuth,
  firebaseAnalytics,
  firebasedb,
} from "./utils/firebase.js";
import router from "./router.js";
import setdata from "./utils/setData.js";
import getdata from "./utils/getData.js";

// Global vars accessible anywhere in any component
window.App = {
  title: "Zeenah", //Navbar title
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
    setData: setdata,
    getData: getdata,
    user: {}, //user data once logged in
  },
  cloudinary: {
    // Cloudinary config, got UPLOAD_PRESET and CLOUD_NAME from cloudinary dashboard
    UPLOAD_PRESET: "lq3wdeku",
    CLOUD_NAME: "dbymxe1wb",
    UPLOAD_URL: "https://api.cloudinary.com/v1_1/dbymxe1wb/image/upload",
  },

  //Shopping cart functions
  getCart: () => {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  },
  saveCart: (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
    App.updateCartCounter();
  },
  updateCartCounter: () => {
    const cart = App.getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const navbarCounter = document.querySelector("#cartNavbar");
    if (navbarCounter) {
      navbarCounter.textContent = totalItems;
    }
    return totalItems || 0;
  },
};
