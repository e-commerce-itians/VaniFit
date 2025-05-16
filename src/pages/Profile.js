export default function Profile() {
  console.log(App.firebase.user);
  return `
    <div class="m-5">
      <h1>Profile Page</h1>
      <br>Email: ${App.firebase.user.email}
      <br>uid: ${App.firebase.user.uid}
      <br>accessToken: ${App.firebase.user.accessToken}
    </div>
    `;
}
