import { observer } from "../../observer";
import "./Cart.css";
const componentID = "cart";

export default async function Cart() {
  observer(componentID, compLoaded);
  return /*html*/ `
<div component="${componentID}" class="container my-5">
      Welcome to Cart Page <br>
      <a href="/" data-link>Go to home</a> 
    </div>
    `;
}
const compLoaded = () => {};
