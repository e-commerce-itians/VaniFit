import "./Product.css";
import Getdata from "../../utils/Getdata";
import { observer } from "../../observer";
const componentID = "product";

export default async function Product({ id }) {
  observer(componentID, compLoaded);
  return /*html*/ `
   <div component="${componentID}">
     <div id="product" class="m-5">
      loading...
     </div>
   </div>
  `;
}

//Javascript code to be executed once the home component is loaded
const compLoaded = async () => {
  const product = await Getdata("products", "d07YRTLeQejlGWkSn9Im");
  document.querySelector("#product").innerHTML = product.brand;
};
