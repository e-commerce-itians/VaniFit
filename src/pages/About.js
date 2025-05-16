import { observer } from "../observer";
const componentID = "About";

export default function About() {
  observer(componentID, compLoaded);
  return `
      About Page <br>
      <a href="/" data-link>Go to home</a> 
    `;
}

//Javascript code to be executed once the home component is loaded
const compLoaded = () => {};
