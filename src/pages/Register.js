import { createUserWithEmailAndPassword } from "firebase/auth";
import { observer } from "../observer";
const componentID = "register";

export default function Register() {
  observer(componentID, compLoaded);
  return /*html*/ `
    <div component="${componentID}">
      <div class="container">
        <div class="row justify-content-center align-items-center mt-5">
          <div class="bg-body-tertiary p-5 col-10 col-lg-8 rounded-4">
            <form id="registerForm">
              <div class="mb-3">
                <label for="email" class="form-label"
                  >Email address</label
                >
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  aria-describedby="emailHelp"
                />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label"
                  >Password</label
                >
                <input
                  type="password"
                  class="form-control"
                  id="password"
                />
              </div>
              <div class="mb-3">
                <label for="repassword" class="form-label"
                  >Re-Password</label
                >
                <input
                  type="password"
                  class="form-control"
                  id="repassword"
                />
              </div>
              <button type="submit" class="btn btn-primary">
                Create account
              </button>

              <div class="mt-2 text-center">
                <span
                  >Already have account? <a href="./login" data-link>Login</a></span
                >
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    `;
}

const compLoaded = () => {
  const registerForm = document.querySelector("#registerForm");
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    Array.from(e.target.elements).forEach((el) => (el.disabled = true));
    try {
      const userCredential = await createUserWithEmailAndPassword(
        App.firebase.auth,
        email,
        password
      );
      App.navigator("/");
    } catch (error) {
      Array.from(e.target.elements).forEach((el) => (el.disabled = false));
      alert("Error: " + error.message);
    }
  });
};
