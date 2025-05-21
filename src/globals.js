import { firebaseApp, firebaseAuth, firebasedb } from "./utils/firebase.js";
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
  clearCart: () => {
    localStorage.setItem("cart", JSON.stringify([]));
    App.updateCartCounter();
  },

  getCart: () => {
    try {
      const cart = localStorage.getItem("cart");
      if (!cart) return [];
      const parsedCart = JSON.parse(cart);
      if (Array.isArray(parsedCart)) {
        return parsedCart.filter(
          (item) => item && typeof item === "object" && !Array.isArray(item)
        );
      }
      return [];
    } catch (e) {
      console.error("Error parsing cart data, returning empty cart", e);
      return [];
    }
  },

  saveCart: (cart) => {
    const safeCart = Array.isArray(cart)
      ? cart.filter(
          (item) => item && typeof item === "object" && !Array.isArray(item)
        )
      : [];

    localStorage.setItem("cart", JSON.stringify(safeCart));
    App.updateCartCounter();
  },

  updateCartCounter: () => {
    const cart = App.getCart();
    const totalItems = cart.reduce((sum, item) => {
      const quantity = typeof item.quantity === "number" ? item.quantity : 0;
      return sum + quantity;
    }, 0);

    const navbarCounter = document.querySelector("#cartNavbar");
    if (navbarCounter) {
      navbarCounter.textContent = totalItems;
    }
    return totalItems;
  },
};
