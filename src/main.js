import "./style.css";
import Test1 from "./js/Test1";
import Test2 from "./js/Test2";

const test = new Test1("product1", "shoes");

document.querySelector("#app").innerHTML = `
  <div>
    ${test.printDetails()}
  </div>
`;
