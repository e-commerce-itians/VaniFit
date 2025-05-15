import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Profile() {
  return `
    ${Navbar()}
    <h1>Profile Page</h1>
    ${Footer()}
    `;
}
