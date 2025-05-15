import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

// Define a mapping of URL paths to their corresponding view components
const routes = {
  "/": Home,
  "/login": Login,
  "/register": Register,
  "/about": About,
  "/profile": Profile,
};

// Export the router function that handles view rendering based on the current path
export default function router() {
  // Determine the view to render based on the current location's pathname
  // If the path is not found in the routes object, render the NotFound component
  const view = routes[location.pathname] || NotFound;

  // Render the selected view inside the element with the ID 'app'
  document.getElementById("app").innerHTML = view();

  // Update navigation links to reflect the active route
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    const linkPath = new URL(link.href).pathname;
    const currentPath = window.location.pathname;

    // Add 'active' class to the link if it matches the current path
    if (linkPath === currentPath) {
      link.classList.add("active");
    } else {
      // Otherwise, remove the 'active' class
      link.classList.remove("active");
    }
  });
}
