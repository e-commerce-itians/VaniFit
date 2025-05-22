import { onAuthStateChanged } from "firebase/auth";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";
import "../node_modules/@fortawesome/fontawesome-free/css/all.min.css";
import "../node_modules/bootstrap-icons/font/bootstrap-icons.min.css";
import "@fortawesome/fontawesome-free";
import "./globals.js";
import router from "./router.js";
import "./style.css";
import { doc, getDoc } from "firebase/firestore";

// Run the router once the initial HTML document has been completely loaded and parsed
window.addEventListener("DOMContentLoaded", router);

// Run the router whenever the user navigates using the browser's back/forward buttons
window.addEventListener("popstate", router);

// Run router when user login state changes
onAuthStateChanged(App.firebase.auth, async (user) => {
  if (user) {
    //User is logged in
    App.firebase.user = user;
    await getDoc(doc(App.firebase.db, "roles", user.uid)).then((res) => {
      let data = res.exists() ? res.data() : null;
      if (data && data.admin === true) {
        App.firebase.user.role = "admin";
      }
    });

    await getDoc(doc(App.firebase.db, "users", user.uid)).then((res) => {
      let data = res.exists() ? res.data() : null;
      if (data) {
        App.firebase.user.address = data.address || ``;
        App.firebase.user.phoneNumber = data.phoneNumber || ``;
      }
    });
    App.userCartGet();
  } else {
    //User is not logged in
    App.firebase.user = {};
  }
  App.authLoaded = true;
  router(false);
});

// Delegate click events on elements with the 'data-link' attribute for client-side routing
document.addEventListener("click", (e) => {
  // Check if the clicked element matches the selector '[data-link]'
  const anchor = e.target.closest("[data-link]");
  if (anchor) {
    // Prevent the default browser behavior of navigating to the link
    e.preventDefault();

    // Update the browser's history stack with the new URL without reloading the page
    history.pushState(null, "", anchor.href);

    // Invoke the router to update the view based on the new URL
    router();
  }
});
