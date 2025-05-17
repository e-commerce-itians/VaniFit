import { signInWithEmailAndPassword } from "firebase/auth";
import { observer } from "../../observer";
const componentID = "login";

export default function Login() {
  observer(componentID, compLoaded);
  return /*html*/ `
    <div component="${componentID}">
      <div class="container">
        <div class="row justify-content-center align-items-center mt-5">
          <div class="bg-body-tertiary p-5 col-12 col-md-10 col-lg-8 rounded-4 shadow-sm">
            <form id="login-form" class="was-validated" novalidate>
              <h2 class="mb-4 text-center">Login</h2>
              <div class="mb-3">
                <label for="email" class="form-label">Email<span class="text-danger">*</span></label>
                <input
                  type="email"
                  id="email"
                  class="form-control"
                  placeholder="user@example.com"
                  required
                />
                <div class="invalid-feedback">
                  Please enter a valid email address.
                </div>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password<span class="text-danger">*</span></label>
                <input
                  type="password"
                  id="password"
                  class="form-control"
                  placeholder="enter your password"
                  required
                />
                <div class="invalid-feedback">
                  Please enter your password.
                </div>
              </div>
              <div class="mb-3">
                <button type="submit" class="btn btn-primary">Login</button>
              </div>
              <div class="text-center">
                <span class="text-muted">
                  Don't have an account?
                  <a href="./register" class="text-decoration-underline" data-link>Signup</a>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    `;
}

const compLoaded = () => {
  const form = document.querySelector("#login-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    Array.from(e.target.elements).forEach((item) => (item.disabled = true));
    try {
      const userCredential = await signInWithEmailAndPassword(
        App.firebase.auth,
        email,
        password
      );
      App.navigator("/");
    } catch (error) {
      Array.from(e.target.elements).forEach((item) => (item.disabled = false));
      alert(error.message);
    }
  });
};
