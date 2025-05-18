import { observer } from "../../observer";
import "./Cart.css";
const componentID = "cart";

export default async function Cart() {
    observer(componentID, compLoaded);
    return /*html*/ `
<div component="${componentID}">
      Welcome to Cart Page <br>
      <a href="/" data-link>Go to home</a> 
    </div>
    `;
}
const compLoaded = () => {
};
