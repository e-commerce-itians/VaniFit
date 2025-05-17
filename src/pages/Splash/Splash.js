import { observer } from "../../observer";
import "./Splash.css";
const componentID = "splash";

export default function Splash() {
  observer(componentID, compLoaded);
  return /*html*/ `
    <div class="splash-spinner-container">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    `;
}

//Javascript code to be executed once the home component is loaded
const compLoaded = () => {};
