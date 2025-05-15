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
}
