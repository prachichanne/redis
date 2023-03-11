

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: "AIzaSyDCfB0G8xpKPiAkGUKOyM8PhgkQ-CXnCkA",
    authDomain: "loginuser-68d6a.firebaseapp.com",
    databaseURL: "https://loginuser-68d6a-default-rtdb.firebaseio.com",
    projectId: "loginuser-68d6a",
    storageBucket: "loginuser-68d6a.appspot.com",
    messagingSenderId: "120405919052",
    appId: "1:120405919052:web:9729ca081e3dfe2bb5fbe9"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
var auth = firebase.auth();
const db = firebase.firestore();
