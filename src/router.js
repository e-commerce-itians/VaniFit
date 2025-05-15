import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const routes = {
  "/": Home,
  "/about": About,
};

export default function router() {
  const view = routes[location.pathname] || NotFound;
  document.getElementById("app").innerHTML = view();
}
