import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDuzBpeML-DAjCqeF3Z5iX6H_0oZR7v3dg",
  authDomain: "trazy-2142e.firebaseapp.com",
  projectId: "trazy-2142e",
  storageBucket: "trazy-2142e.firebasestorage.app",
  messagingSenderId: "4891427196",
  appId: "1:4891427196:web:b8a9b5d0e05232c25124f9"
};

// 🔧 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 🔘 Add listener to login button
const button = document.getElementById("login");

button.addEventListener("click", function (event) {
  event.preventDefault();

  // 📥 Fetch email and password from inputs
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const username = document.getElementById("username").value;

  // 🔐 Sign in using Firebase Auth
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      alert("Welcome back, " + username + "!");
      window.location.href = "index.html"; // Redirect after login
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert("Login Failed: " + errorMessage);
    });
});
