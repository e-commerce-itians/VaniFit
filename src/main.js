import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";
import "./style.css";
import "./globals.js";
import "@fortawesome/fontawesome-free";
import router from "./router.js";
import { onAuthStateChanged } from "firebase/auth";

// Run the router once the initial HTML document has been completely loaded and parsed
window.addEventListener("DOMContentLoaded", router);

// Run the router whenever the user navigates using the browser's back/forward buttons
window.addEventListener("popstate", router);

// Run router when user login state changes
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

// Delegate click events on elements with the 'data-link' attribute for client-side routing
document.addEventListener("click", (e) => {
  // Check if the clicked element matches the selector '[data-link]'
  if (e.target.matches("[data-link]")) {
    // Prevent the default browser behavior of navigating to the link
    e.preventDefault();

    // Update the browser's history stack with the new URL without reloading the page
    history.pushState(null, "", e.target.href);

    // Invoke the router to update the view based on the new URL
    router();
  }
});
