import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Firebase Config
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

// DOM
const shopsContainer = document.getElementById("shopsContainer");

// Load Shops
async function loadShops() {
  shopsContainer.innerHTML = "";
  try {
    const querySnapshot = await getDocs(collection(db, "shops"));
    if(querySnapshot.empty){
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
    document.querySelectorAll(".view-btn").forEach(btn => {
      btn.addEventListener("click", (e)=>{
        const shopId = e.target.getAttribute("data-id");
        localStorage.setItem("selectedShopId", shopId);
        window.location.href = "shop.html";
      });
    });
  } catch(err){
    console.error("Error fetching shops:", err);
    shopsContainer.innerHTML = "<p>Error loading shops.</p>";
  }
}
loadShops();

// Logout
const logoutBtn = document.getElementById("logoutBtn");
if(logoutBtn){
  logoutBtn.addEventListener("click", () => {
    signOut(auth).then(()=> window.location.href="../login.html")
    .catch(err=> console.error("Logout error:", err));
  });
}

// BG Changer
const colors = ["#A8DADC", "#F1FAEE", "#FFE6A7", "#E9D8FD", "#D0F4DE"];
const textFor = { "#A8DADC":"#003049", "#F1FAEE":"#1D3557", "#FFE6A7":"#5B4636", "#E9D8FD":"#3C096C", "#D0F4DE":"#2B2D42"};
let i = 0;
function applyBg(){
  const c = colors[i];
  document.body.style.backgroundColor = c;
  document.body.style.color = textFor[c];
  i = (i+1)%colors.length;
}
applyBg();
setInterval(applyBg,4000);

// Cart System
let cartItems = JSON.parse(localStorage.getItem("cart"))||[];
function updateCartCount(){
  const badge = document.getElementById("cartCount");
  if(badge) badge.innerText = cartItems.length;
}
updateCartCount();

function addToCart(item){
  cartItems.push(item);
  localStorage.setItem("cart",JSON.stringify(cartItems));
  updateCartCount();
  alert(`${item.name} added to cart!`);
}
window.addToCart = addToCart;

function checkout(){
  const user = auth.currentUser;
  if(!user){ alert("Please login first!"); return;}
  if(cartItems.length===0){ alert("Your cart is empty!"); return;}
  // Save order to Firestore for FCFS
  addDoc(collection(db,"orders"),{
    userId: user.uid,
    items: cartItems,
    status: "pending",
    timestamp: new Date().toISOString(),
    deliveryId: null
  }).then(()=>{
    alert("Order placed successfully!");
    cartItems = [];
    localStorage.removeItem("cart");
    updateCartCount();
    window.location.href="orderhistory.html";
  }).catch(err=>alert("Failed to place order: "+err.message));
}

window.checkout = checkout;
window.goToCart = ()=>window.location.href="cart.html";
