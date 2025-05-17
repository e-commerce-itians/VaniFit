import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";

export default function layout(view) {
  return `
        ${Navbar()}
        ${view}
        ${Footer()}
    `;
}
