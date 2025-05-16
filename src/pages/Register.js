export default function Register() {
  return `
    <div class="container">
      <div class="row justify-content-center align-items-center mt-5">
        <div class="bg-body-tertiary p-5 col-10 col-lg-8 rounded-4">
          <form onsubmit="App.firebase.signUp(event)">
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
              <div id="emailHelp" class="form-text">
                We'll never share your email with anyone else.
              </div>
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
    `;
}
