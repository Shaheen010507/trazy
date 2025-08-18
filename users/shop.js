import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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

const shopNameEl = document.getElementById("shopName");
const shopDescriptionEl = document.getElementById("shopDescription");
const shopLocationEl = document.getElementById("shopLocation");
const menuEl = document.getElementById("menu");

const shopId = localStorage.getItem("selectedShopId");

async function loadShop() {
  if (!shopId) {
    shopNameEl.innerText = "No shop selected!";
    return;
  }

  const shopRef = doc(db, "shops", shopId);
  const shopSnap = await getDoc(shopRef);

  if (!shopSnap.exists()) {
    shopNameEl.innerText = "Shop not found!";
    return;
  }

  const shopData = shopSnap.data();
  shopNameEl.innerText = shopData.name || "Unnamed Shop";
  shopDescriptionEl.innerText = shopData.description || "";
  shopLocationEl.innerText = "Location: " + (shopData.location || "Unknown");

  // Load menu items
  const itemsRef = collection(shopRef, "items");
  const itemsSnap = await getDocs(itemsRef);

  if (itemsSnap.empty) {
    menuEl.innerHTML = "<p>No items available.</p>";
    return;
  }

  menuEl.innerHTML = "";
  itemsSnap.forEach((itemDoc) => {
    const item = itemDoc.data();
    const p = document.createElement("p");
    p.textContent = `${item.name} - ₹${item.price}`;
    menuEl.appendChild(p);
  });
}

loadShop();

