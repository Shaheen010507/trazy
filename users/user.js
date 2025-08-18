import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

// Firebase config
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
const db = getFirestore(app);
const auth = getAuth(app);

// Load shops
const shopsContainer = document.getElementById("shopsContainer");

async function loadShops() {
  shopsContainer.innerHTML = ""; // Clear loading text

  try {
    const querySnapshot = await getDocs(collection(db, "shops"));
    if (querySnapshot.empty) {
      shopsContainer.innerHTML = "<p>No shops available.</p>";
      return;
    }

    querySnapshot.forEach((doc) => {
      const shop = doc.data();
      const shopCard = document.createElement("div");
      shopCard.classList.add("shop-card");

      shopCard.innerHTML = `
        <h3>${shop.name || "Unnamed Shop"}</h3>
        <p>${shop.description || "No description available."}</p>
        <p><strong>Location:</strong> ${shop.location || "Unknown"}</p>
        <button class="view-btn" onclick="viewShop('${doc.id}')">View Menu</button>
      `;

      shopsContainer.appendChild(shopCard);
    });
  } catch (error) {
    console.error("Error fetching shops:", error);
    shopsContainer.innerHTML = "<p>Error loading shops.</p>";
  }
}

window.viewShop = function(shopId) {
  localStorage.setItem("selectedShopId", shopId);
  window.location.href = "shop.html";
};

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  }).catch((error) => {
    console.error("Logout error:", error);
  });
});

loadShops();
// 🌿 Relaxing background color changer

const colors = ["#A8DADC", "#F1FAEE", "#FFE6A7", "#E9D8FD", "#D0F4DE"]; 
// light teal, off-white, cream yellow, lavender, mint green
const textFor = { 
  "#A8DADC": "#003049", 
  "#F1FAEE": "#1D3557", 
  "#FFE6A7": "#5B4636", 
  "#E9D8FD": "#3C096C", 
  "#D0F4DE": "#2B2D42" 
};
let i = 0;

function applyBg() {
  const c = colors[i];
  document.body.style.backgroundColor = c;   
  document.body.style.color = textFor[c];    
  i = (i + 1) % colors.length;
}
applyBg();
setInterval(applyBg, 4000); // slower change: every 4s