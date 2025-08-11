import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { 
  getFirestore, 
  setDoc, 
  doc, 
  getDoc 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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

document.getElementById("submit").addEventListener("click", async (event) => {
  event.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirm-password").value.trim();
  const role = document.getElementById("role").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    // Try creating new account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store extra data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      fullname,
      username,
      role
    });

    alert("Account created successfully!");
    redirectBasedOnRole(role);

  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      // If email exists → try logging in
      try {
        const loginCred = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, "users", loginCred.user.uid));

        if (userDoc.exists()) {
          redirectBasedOnRole(userDoc.data().role);
        } else {
          alert("User data not found.");
        }
      } catch (loginError) {
        alert("Email already registered. Please log in manually.");
        window.location.href = "login.html";
      }
    } else {
      alert(error.message);
    }
  }
});

// Role-based redirect
function redirectBasedOnRole(role) {
  if (role === "") {
    window.location.href = "admin.html";
  } else if (role === "User") {
    window.location.href = "user.html";
  } else {
    window.location.href = "index.html";
  }
}
