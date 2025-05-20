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

  cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [],
  cartAdd: (productId, selectedSize, selectedColor, quantity) => {
    // Retrieve current cart from localStorage or initialize empty array
    let cart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
    // Check if the item already exists in the cart with same size and color
    const existingItemIndex = cart.findIndex(
      (item) =>
        item.productId === productId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );
    if (existingItemIndex !== -1) {
      // If item exists, update the quantity
      cart[existingItemIndex].quantity += quantity;
    } else {
      // If item doesn't exist, add it as a new item
      const newItem = {
        productId,
        selectedSize,
        selectedColor,
        quantity,
      };
      cart.push(newItem);
    }
    // Save the updated cart back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    //Update navbar cart
    document.querySelector("#cartNavbar").innerText = cart.length;
  },
};
