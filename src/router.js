import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";

const routes = {
  "/": Home,
  "/login": Login,
  "/register": Register,
  "/about": About,
};

export default function router() {
  const view = routes[location.pathname] || NotFound;
  document.getElementById("app").innerHTML = view();
}
