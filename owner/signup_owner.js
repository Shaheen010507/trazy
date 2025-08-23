// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  serverTimestamp, 
  collection 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDuzBpeML-DAjCqeF3Z5iX6H_0oZR7v3dg",
  authDomain: "trazy-2142e.firebaseapp.com",
  projectId: "trazy-2142e",
  storageBucket: "trazy-2142e.firebasestorage.app",
  messagingSenderId: "4891427196",
  appId: "1:4891427196:web:b8a9b5d0e05232c25124f9"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔹 Owner Signup Function
async function signupOwner(fullName, shopName, email, password, confirmPassword) {
  try {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // 1. Create account in Firebase Auth
    const ownerCredential = await createUserWithEmailAndPassword(auth, email, password);
    const owner = ownerCredential.user;

    // 2. Save Owner Data in Firestore
    await setDoc(doc(db, "owners", owner.uid), {
      fullName,
      shopName,
      email,
      role: "owner",
      createdAt: serverTimestamp()
    });

    // 3. Create an empty subcollection for shop items
    await setDoc(doc(collection(db, "owners", owner.uid, "items"), "init"), {
      note: "This is your items subcollection",
      createdAt: serverTimestamp()
    });

    alert("✅ Owner account created successfully!");
    window.location.href = "owner.html"; // redirect

  } catch (error) {
    console.error("Error:", error.message);
    alert("⚠️ " + error.message);
  }
}

// 🔹 Form handling
document.getElementById("ownerSignupForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const fullName = document.getElementById("fullname").value;
  const shopName = document.getElementById("shopname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmpassword").value;

  signupOwner(fullName, shopName, email, password, confirmPassword);
});
