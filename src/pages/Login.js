import { signInWithEmailAndPassword } from "firebase/auth";
import { observer } from "../observer";
import SigninWithGoogle from "../utils/SigninWithGoogle";
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
              <div class="mb-3 text-center">
                <button type="button" id="google-signin-btn" class="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2">
                  <span class="bg-white rounded-circle d-flex align-items-center justify-content-center me-2" style="width:28px;height:28px;">
                    <svg width="20" height="20" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.68 2.36 30.74 0 24 0 14.82 0 6.73 5.06 2.69 12.44l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.59C43.98 37.13 46.1 31.3 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.65c-1.13-3.36-1.13-6.99 0-10.35l-7.98-6.2C.7 16.1 0 19.01 0 22c0 2.99.7 5.9 1.97 8.55l8.7-6.9z"/><path fill="#EA4335" d="M24 44c6.74 0 12.42-2.23 16.56-6.07l-7.19-5.59c-2.01 1.35-4.59 2.16-7.37 2.16-6.38 0-11.87-3.63-14.33-8.91l-8.7 6.9C6.73 42.94 14.82 48 24 48z"/></g></svg>
                  </span>
                  <span>Sign in with Google</span>
                </button>
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
  const googleBtn = document.getElementById("google-signin-btn");
  if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
      googleBtn.disabled = true;
      googleBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Signing in...';
      try {
        await SigninWithGoogle();
        App.navigator("/");
      } catch (error) {
        alert(error.message);
      }
      googleBtn.disabled = false;
      googleBtn.innerHTML = `<span class="bg-white rounded-circle d-flex align-items-center justify-content-center me-2" style="width:28px;height:28px;"><svg width=\"20\" height=\"20\" viewBox=\"0 0 48 48\"><g><path fill=\"#4285F4\" d=\"M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.68 2.36 30.74 0 24 0 14.82 0 6.73 5.06 2.69 12.44l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z\"/><path fill=\"#34A853\" d=\"M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.59C43.98 37.13 46.1 31.3 46.1 24.55z\"/><path fill=\"#FBBC05\" d=\"M10.67 28.65c-1.13-3.36-1.13-6.99 0-10.35l-7.98-6.2C.7 16.1 0 19.01 0 22c0 2.99.7 5.9 1.97 8.55l8.7-6.9z\"/><path fill=\"#EA4335\" d=\"M24 44c6.74 0 12.42-2.23 16.56-6.07l-7.19-5.59c-2.01 1.35-4.59 2.16-7.37 2.16-6.38 0-11.87-3.63-14.33-8.91l-8.7 6.9C6.73 42.94 14.82 48 24 48z\"/></g></svg></span><span>Sign in with Google</span>`;
    });
  }

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
