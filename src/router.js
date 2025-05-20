import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import NotFound from "./pages/NotFound/NotFound";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Profile from "./pages/Profile/Profile";
import Account from "./pages/Account/Account";
import Product from "./pages/Product/Product";
import layout from "./layout";
import Splash from "./pages/Splash/Splash";
import MainDashboard from "./pages/AdminDashboard/MainDashboard/MainDashboard";
import Cart from "./pages/Cart/Cart";
import Shop from "./pages/Shop/Shop";

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
    path: "/account",
    view: Account,
  },
  {
    path: "/product/:id",
    view: Product,
  },
  {
    path: "/admin",
    view: MainDashboard,
  },
  {
    path: "/cart",
    view: Cart,
  },
  {
    path: "/shop",
    view: Shop,
  },
];

// Export the router function that handles view rendering based on the current path
export default async function router(stp = true) {
  // Determine the view to render based on the current location's pathname
  const currentPath = location.pathname;
  const { view, params } = dynamicRouting(currentPath);

  // Render the selected view inside the element with the ID 'app'
  if (stp) window.scrollTo({ top: 0, behavior: "instant" });
  document.getElementById("app").innerHTML =
    App.authLoaded == true ? layout(await view(params)) : Splash();

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
