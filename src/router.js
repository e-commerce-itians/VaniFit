import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

const routes = {
  "/": Home,
  "/login": Login,
  "/register": Register,
  "/about": About,
  "/profile": Profile,
};

export default function router() {
  const view = routes[location.pathname] || NotFound;
  document.getElementById("app").innerHTML = view();

  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    const linkPath = new URL(link.href).pathname;
    const currentPath = window.location.pathname;

    if (linkPath === currentPath) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}
