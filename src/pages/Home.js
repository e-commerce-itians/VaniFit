import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  return `
      ${Navbar()}
      Home Page <br>
      <a href="/about" data-link>Go to about</a> 
      ${Footer()}
    `;
}
