import { observer } from "../observer";
const componentID = "home";

export default async function Home() {
  observer(componentID, compLoaded);
  return `
      <div component="${componentID}">
        Home Page <br>
        <a href="/about" data-link>Go to about</a> 
        <div id="counter">0</div>
        <button class="btn btn-success" id="counterBtn">Counter</button>
      </div>
  `;
}

//Javascript code to be executed once the home component is loaded
const compLoaded = () => {
  const counterText = document.querySelector("#counter");
  const counterBtn = document.querySelector("#counterBtn");
  counterBtn.addEventListener("click", () => {
    counterText.innerText = Number(counterText.innerText) + 1;
  });
};
