import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function About() {
  return `
      ${Navbar()}
      About Page <br>
      <a href="/" data-link>Go to home</a> 
      ${Footer()}
    `;
}
