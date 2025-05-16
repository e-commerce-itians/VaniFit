import { firebaseApp, firebaseAnalytics } from "./utils/firebase";

window.App = {
  title: "Shop",

  firebase: {
    app: firebaseApp,
    analytics: firebaseAnalytics,
  },
};
