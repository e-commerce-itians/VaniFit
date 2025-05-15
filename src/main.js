import "./style.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";
import router from "./router.js";

window.addEventListener("DOMContentLoaded", router);
window.addEventListener("popstate", router);

document.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    history.pushState(null, "", e.target.href);
    router();
  }
});
