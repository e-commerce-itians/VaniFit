import { doc, getDoc, setDoc } from "firebase/firestore";
import { firebaseApp, firebaseAuth, firebasedb } from "./utils/firebase.js";
import router from "./router.js";
import setData from "./utils/setData.js";
import getData from "./utils/getData.js";

// Global vars accessible anywhere in any component
window.App = {
  title: "VaniFit", //Navbar title
  navigator: (href) => {
    history.pushState(null, "", href);
    router();
  }, //Change page internally
  authLoaded: false, //check if user auth has been checked or not

  firebase: {
    app: firebaseApp, //firebase app init
    auth: firebaseAuth, //firebase auth init
    db: firebasedb,
    setData: setData,
    getData: getData,
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
    App.userCartSave();
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

  //User Cart functions
  //called on login
  userCartGet: async () => {
    try {
      if (!App.firebase.user || !App.firebase.user.uid) return;

      const cartRef = doc(App.firebase.db, "carts", App.firebase.user.uid);
      const docSnap = await getDoc(cartRef);

      if (docSnap.exists()) {
        const firestoreCart = docSnap.data().cart || [];
        localStorage.setItem("cart", JSON.stringify(firestoreCart));
      }
    } catch (error) {
      console.error("Error loading cart from Firestore:", error);
    }
    App.updateCartCounter();
    return [];
  },
  //called on logout
  userCartSave: async () => {
    try {
      // Check if user is logged in
      if (!App.firebase.user || !App.firebase.user.uid) {
        console.log("User not logged in, can't save cart to Firestore");
        return;
      }

      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const cartRef = doc(App.firebase.db, "carts", App.firebase.user.uid);
      await setDoc(cartRef, {
        cart: cart,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error("Error saving cart to Firestore:", error);
    }
  },

  chatbotInit: false,
};

//Disable logs in production
const DEBUG_MODE = false;
if (!DEBUG_MODE) {
  // Set DEBUG_MODE to false in production
  console.log = function () {};
  console.warn = function () {};
  console.error = function () {};
  console.info = function () {};
  // Add any other console methods you use
}
