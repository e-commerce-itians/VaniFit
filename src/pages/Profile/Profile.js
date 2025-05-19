import { observer } from "../../observer";
const componentID = "profile";

export default function Profile() {
  observer(componentID, compLoaded);
  return /*html*/ `
    <div class="m-5">
      <h1>Profile Page</h1>
      <br>Email: ${App.firebase.user.email}
      <br>uid: ${App.firebase.user.uid}
      <br>accessToken: ${App.firebase.user.accessToken}
    </div>
    `;
}

//Javascript code to be executed once the home component is loaded
const compLoaded = () => {
  console.log(App.firebase);
};
