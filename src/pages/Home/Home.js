import { observer } from "../../observer";
const componentID = "home";

export default async function Home() {
  observer(componentID, compLoaded);
  return /*html*/ `
      <div component="${componentID}">
        Home Page <br>
        <a href="/about" data-link>Go to about</a>
        <br>
        <a href="/product/d07YRTLeQejlGWkSn9Im" data-link>Go to product 1 (test)</a>  
      </div>
  `;
}

//Javascript code to be executed once the home component is loaded
const compLoaded = () => {};
