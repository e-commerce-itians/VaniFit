import About from "./pages/About";
import Home from "./pages/Home";

const routes = {
  "/": Home,
  "/about": About,
};

export default function router() {
  const view = routes[location.pathname] || (() => `<h1>404 Not Found</h1>`);
  document.getElementById("app").innerHTML = view();
}
