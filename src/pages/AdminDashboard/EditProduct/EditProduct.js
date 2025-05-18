import { observer } from "/src/observer";
import "./EditProduct.css";
const componentID = "EditProduct";

export default function EditProduct() {
  observer(componentID, compLoaded);
  return /*html*/ `
    <div component="${componentID}" id="${componentID}" class="${componentID}">
    
    </div>
    `;
}

//Javascript code to be executed once the home component is loaded
const compLoaded = () => {};
