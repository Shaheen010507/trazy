import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDuzBpeML-DAjCqeF3Z5iX6H_0oZR7v3dg",
  authDomain: "trazy-2142e.firebaseapp.com",
  projectId: "trazy-2142e",
  storageBucket: "trazy-2142e.appspot.com",
  messagingSenderId: "4891427196",
  appId: "1:4891427196:web:b8a9b5d0e05232c25124f9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const button = document.getElementById("signupBtn");

button.addEventListener("click", async function (event) {
  event.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmpassword = document.getElementById("confirmpassword").value;
  const role = document.getElementById("role").value;

  if (!fullname || !username || !email || !password || !confirmpassword || !role) {
    alert("Please fill all fields");
    return;
  }

  if (password !== confirmpassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      fullname,
      username,
      email,
      role
    });

    alert("Account created successfully!");

    if (role === "user") {
      window.location.href = "..users/user.html";
    } else if (role === "seller") {
      window.location.href = "..owner/owner.html";
    } else if (role === "delivery") {
      window.location.href = "..delivery/delivery.html";
    }

  } catch (error) {
    alert(error.message);
  }
});
