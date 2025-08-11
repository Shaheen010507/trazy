import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDuzBpeML-DAjCqeF3Z5iX6H_0oZR7v3dg",
  authDomain: "trazy-2142e.firebaseapp.com",
  projectId: "trazy-2142e",
  storageBucket: "trazy-2142e.firebasestorage.app",
  messagingSenderId: "4891427196",
  appId: "1:4891427196:web:b8a9b5d0e05232c25124f9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const button = document.getElementById("submit");

button.addEventListener("click", async function (event) {
  event.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  const role = prompt("Enter role: user / seller / delivery").toLowerCase();

  // Basic role validation
  if (!["user", "seller", "delivery"].includes(role)) {
    alert("Invalid role! Please enter: user, seller, or delivery");
    return;
  }

  try {
    // Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save extra user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      fullname: fullname,
      username: username,
      email: email,
      role: role
    });

    alert("Account created successfully!");

    // Redirect based on role
    if (role === "user") {
      window.location.href = "user.html";
    } else if (role === "seller") {
      window.location.href = "seller.html";
    } else if (role === "delivery") {
      window.location.href = "delivery.html";
    }

  } catch (error) {
    alert(error.message);
  }
});
