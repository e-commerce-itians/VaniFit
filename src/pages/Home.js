import Navbar from "../components/Navbar";

export default function Home() {
  return `
      ${Navbar()}
      Home Page <br>
      <a href="/about" data-link>Go to about</a> 
    `;
}
