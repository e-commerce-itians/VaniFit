import "./NotFound.css";
import { observer } from "../../observer";
const componentID = "notfound";

export default function NotFound() {
  observer(componentID, compLoaded);
  return /*html*/ `
    <div
      class="container d-flex flex-column justify-content-center align-items-center error-container text-center p-5"
    >
      <div class="error-code"><h1>404 Not Found</h1></div>
      <div class="error-message mb-4">
        Oops! The page you're looking for doesn't exist.
      </div>
      <button class="btn btn-dark">
        <a href="/" data-link>Go Back Home</a>
      </button>
    </div>
  `;
}

const compLoaded = () => {};
