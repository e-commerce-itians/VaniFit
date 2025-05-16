import "../styles/NotFound.css";

export default function NotFound() {
  return `
  <div class="not-found-container">
    <h1>404 Page Requested Not Found</h1>
    <button><a href="/" data-link>Back To Home</a></button>
  </div>
  `;
}
