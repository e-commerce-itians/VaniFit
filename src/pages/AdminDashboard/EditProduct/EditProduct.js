import Getdata from "../../../utils/getData";
import { observer } from "../../../observer";
const componentID = "EditProduct";

export default async function EditProduct(id) {
  observer(componentID, () => {
    compLoaded(id);
  });
  return /*html*/ `
   <div component="${componentID}" id="${componentID}">
     <div id="product" class="m-5">
      loading...
     </div>
   </div>
  `;
}

//Javascript code to be executed once the home component is loaded
const compLoaded = async (id) => {
  const product = await Getdata("products", id);
  document.querySelector("#EditProduct").innerHTML = product.brand;
};
