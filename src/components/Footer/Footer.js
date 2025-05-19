import "./Footer.css";
import { observer } from "../../observer";
const componentID = "footer";

export default function Footer() {
  observer(componentID, compLoaded);
  return /*html*/ `<div component="${componentID}">
    <footer>
      <ul class="footer-links">
        <li><a href="#">Conditions of Use</a></li>
        <li><a href="#">Privacy Notice</a></li>
        <li><a href="#">Interest-Based Ads</a></li>
      </ul>
      <p class="copyright">
        &copy; 1996-2025, Amazon.com, Inc, or its affiliates
      </p>
    </footer>
  </div>`;
}

//Javascript code to be executed once the home component is loaded
const compLoaded = () => {};
