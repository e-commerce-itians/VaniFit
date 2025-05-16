import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

export default function layout(view) {
  return `
        ${Navbar()}
        ${view}
        ${Footer()}
    `;
}
