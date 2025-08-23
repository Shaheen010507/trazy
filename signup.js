// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Firebase configuration
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

// Signup button
document.getElementById("signupBtn").addEventListener("click", async (event) => {
  event.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmpassword").value;
  const role = document.getElementById("role").value;

  if (!fullname || !username || !email || !password || !confirmPassword || !role) {
    alert("Please fill all fields.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Save extra details in Firestore
    await setDoc(doc(db, "users", uid), {
      fullname: fullname,
      username: username,
      email: email,
      role: role,
      createdAt: new Date()
    });

    // Redirect based on role
    if (role === "user") {
      window.location.href = "users/user.html";
    } else if (role === "owner") {
      window.location.href = "owner/owner.html";
    } else if (role === "delivery") {
      window.location.href = "delivery/delivery.html";
    } else {
      alert("Unknown role. Contact admin.");
    }
  } catch (error) {
    alert(error.message);
  }
});
