import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Product from "./pages/Product";
import layout from "./layout";
import Spinner from "./pages/Spinner";

// Define a mapping of URL paths to their corresponding view components
const routes = [
  {
    path: "/",
    view: Home,
  },
  {
    path: "/login",
    view: Login,
  },
  {
    path: "/register",
    view: Register,
  },
  {
    path: "/about",
    view: About,
  },
  {
    path: "/profile",
    view: Profile,
  },
  {
    path: "/product/:id",
    view: Product,
  },
];

// Export the router function that handles view rendering based on the current path
export default async function router() {
  // Determine the view to render based on the current location's pathname
  const currentPath = location.pathname;
  const { view, params } = dynamicRouting(currentPath);

  // Render the selected view inside the element with the ID 'app'
  document.getElementById("app").innerHTML = Spinner();
  const renderedView = await view(params);
  document.getElementById("app").innerHTML = layout(renderedView);

  // Update navigation links to reflect the active route
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    const linkPath = new URL(link.href).pathname;
    // Add 'active' class to the link if it matches the current path
    linkPath === currentPath
      ? link.classList.add("active")
      : link.classList.remove("active");
  });
}

// Extract target route and params from the current path name
function dynamicRouting(pathname) {
  // Iterate over each defined route
  for (const route of routes) {
    const paramNames = [];

    // collect the names of dynamic parameters
    const regexPath = route.path.replace(/:([^/]+)/g, (_, key) => {
      paramNames.push(key);
      return "([^/]+)";
    });

    // Create a RegExp object to match the entire pathname
    const regex = new RegExp(`^${regexPath}$`);

    // Test if the given pathname matches the current route
    const match = pathname.match(regex);
    if (match) {
      // Extract the dynamic params from the pathname
      const params = Object.fromEntries(
        paramNames.map((key, i) => [key, match[i + 1]])
      );

      // Return the matched view and extracted params
      return { view: route.view, params };
    }
  }

  // If no route matches, return a NotFound view with empty params
  return { view: NotFound, params: {} };
}
