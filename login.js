// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc 
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ---------------- Email/Password Login ----------------
document.getElementById("loginBtn").addEventListener("click", async (event) => {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Check across all collections
    let role = null;

    const userSnap = await getDoc(doc(db, "users", uid));
    if (userSnap.exists()) {
      role = "user";
    }

    const ownerSnap = await getDoc(doc(db, "owners", uid));
    if (ownerSnap.exists()) {
      role = "owner";
    }

    const deliverySnap = await getDoc(doc(db, "delivery", uid));
    if (deliverySnap.exists()) {
      role = "delivery";
    }

    if (role) {
      redirectByRole(role);
    } else {
      alert("No account found. Please sign up first.");
    }
  } catch (error) {
    alert(error.message);
  }
});

// ---------------- Forgot Password ----------------
document.getElementById("forgotPasswordBtn").addEventListener("click", async () => {
  const email = prompt("Enter your email for password reset:");
  if (!email) return;

  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent! Check your inbox.");
  } catch (error) {
    alert(error.message);
  }
});

// ---------------- Google Sign-In ----------------
window.signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Default: save Google user in "users" collection
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(docRef, { email: user.email });
    }

    redirectByRole("user"); // Google sign-in always treated as "user"
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    alert(error.message);
  }
};

function redirectByRole(role) {
  if (role === "user") {
    window.location.href = "users/user.html";
  } else if (role === "owner") {
    window.location.href = "owner/owner.html";
  } else if (role === "delivery") {
    window.location.href = "delivery/delivery.html";
  } else {
    alert("Role not found. Contact admin.");
  }
}
