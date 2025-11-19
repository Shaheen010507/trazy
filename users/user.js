import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// ================== FIREBASE CONFIG ==================
const firebaseConfig = {
  apiKey: "AIzaSyDuzBpeML-DAjCqeF3Z5iX6H_0oZR7v3dg",
  authDomain: "trazy-2142e.firebaseapp.com",
  projectId: "trazy-2142e",
  storageBucket: "trazy-2142e.firebasestorage.app",
  messagingSenderId: "4891427196",
  appId: "1:4891427196:web:b8a9b5d0e05232c25124f9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ================== LOAD SHOPS ==================
const shopsContainer = document.getElementById("shopsContainer");

async function loadShops() {
  shopsContainer.innerHTML = "";

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
        <button class="view-btn" data-id="${doc.id}">View Menu</button>
      `;

      shopsContainer.appendChild(shopCard);
    });

    // Event listeners for "View Menu"
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const shopId = e.target.getAttribute("data-id");
        localStorage.setItem("selectedShopId", shopId);
        window.location.href = "shop.html";
      });
    });

  } catch (error) {
    console.error("Error fetching shops:", error);
    shopsContainer.innerHTML = "<p>Error loading shops.</p>";
  }
}
loadShops();

// ================== LOGOUT ==================
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
      window.location.href = "../login.html";
    }).catch((error) => {
      console.error("Logout error:", error);
    });
  });
}

// ================== BG CHANGER ==================
const colors = ["#A8DADC", "#F1FAEE", "#FFE6A7", "#E9D8FD", "#D0F4DE"];
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
setInterval(applyBg, 4000);

// ================== CART SYSTEM ==================
let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

// Update cart badge
function updateCartCount() {
  const badge = document.getElementById("cartCount");
  if (badge) {
    badge.innerText = cartItems.length;
  }
}
updateCartCount();

// Add to cart
function addToCart(item) {
  cartItems.push(item);
  localStorage.setItem("cart", JSON.stringify(cartItems));
  updateCartCount();
  alert(`${item.name} added to cart!`);
}

// Example dummy add
const addToCartBtn = document.getElementById("addToCartBtn");
if (addToCartBtn) {
  addToCartBtn.onclick = () => {
    const demoItem = { name: "Demo Item", price: 50 };
    addToCart(demoItem);
  };
}

// ================== CHECKOUT ==================
async function checkout() {
  const user = auth.currentUser;
  if (!user) {
    alert("Please login first!");
    return;
  }
  if (cartItems.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  try {
    await addDoc(collection(db, "orders"), {
      userId: user.uid,
      items: cartItems,
      timestamp: new Date().toISOString()
    });

    alert("Order placed successfully!");
    cartItems = [];
    localStorage.removeItem("cart");
    updateCartCount();
    window.location.href = "orderhistory.html"; // Go to history page

  } catch (error) {
    console.error("Order error:", error);
    alert("Failed to place order.");
  }
}

// Redirect to cart page
function goToCart() {
  window.location.href = "cart.html";
}

// Expose for buttons
window.addToCart = addToCart;
window.checkout = checkout;
window.goToCart = goToCart;
