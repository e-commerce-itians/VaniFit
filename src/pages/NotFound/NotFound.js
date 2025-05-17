import "./NotFound.css";
import { observer } from "../../observer";
const componentID = "notfound";

export default function NotFound() {
  observer(componentID, compLoaded);
  return `
  <h1>404 not found</h1>
  `;
}

//Javascript code to be executed once the home component is loaded
const compLoaded = () => {};
