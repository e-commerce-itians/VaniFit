import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function NotFound() {
  return `
  ${Navbar()}
  <h1>404 not found</h1>
  ${Footer()}
  `;
}
