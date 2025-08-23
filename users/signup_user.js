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

// Handle signup
document.getElementById("userSignupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullname = document.getElementById("fullname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmpassword").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save in Firestore under "users"
    await setDoc(doc(db, "users", user.uid), {
      fullname,
      email,
      role: "user",
      createdAt: new Date()
    });

    alert("User account created successfully!");
    window.location.href = "user.html";
  } catch (error) {
    alert(error.message);
  }
});
