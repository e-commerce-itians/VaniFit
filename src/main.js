import "./style.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";
import Navbar from "./components/Navbar";
import Card from "./components/Card";

const navbar = new Navbar();
const card = new Card();

document.querySelector("#app").innerHTML = `
  ${navbar.Render()}
  <div class="row justify-content-center mt-5">
   ${card.Render()}
  </div>
`;
