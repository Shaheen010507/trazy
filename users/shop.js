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
    // 🔥 include the item ID
    const item = { id: itemDoc.id, ...itemDoc.data() };

    // Create a card for each menu item
    const card = document.createElement("div");
    card.classList.add("menu-item");

    // Image
    const img = document.createElement("img");
    img.src = item.image || "https://via.placeholder.com/150?text=No+Image";
    img.alt = item.name;
    card.appendChild(img);

    // Item details
    const details = document.createElement("div");
    details.classList.add("item-details");

    const name = document.createElement("h3");
    name.textContent = item.name || "Unnamed Item";
    details.appendChild(name);

    const price = document.createElement("p");
    price.textContent = `₹${item.price || "N/A"}`;
    details.appendChild(price);

    card.appendChild(details);

    // 🔥 open popup with full item info
    card.addEventListener("click", () => openPopup(item));

    menuEl.appendChild(card);
  });
}

loadShop();

// ==================== Popup Section ==================== //
const popup = document.createElement("div");
popup.id = "itemPopup";
popup.style.display = "none"; // initially hidden
popup.innerHTML = `
  <div class="popup-content">
    <span id="closePopup">&times;</span>
    <img id="popupImage" src="" alt="Food Image">
    <h2 id="popupName"></h2>
    <p id="popupPrice"></p>
    <div class="popup-actions">
      <button id="addToCartBtn">Add to Cart</button>
      <button id="buyNowBtn">Buy Now</button>
    </div>
  </div>
`;
document.body.appendChild(popup);

// Function to open popup with item data
function openPopup(item) {
  document.getElementById("popupImage").src = item.image || "https://via.placeholder.com/200";
  document.getElementById("popupName").innerText = item.name || "Unnamed Item";
  document.getElementById("popupPrice").innerText = `₹${item.price || "N/A"}`;

  // Add actions
  document.getElementById("addToCartBtn").onclick = () => {
    alert(`${item.name} added to cart!`);
    closePopup();
  };

  document.getElementById("buyNowBtn").onclick = () => {
    // 🔥 Pass shopId and itemId in URL
    window.location.href = `order.html?shopId=${shopId}&itemId=${item.id}`;
  };

  popup.style.display = "flex";
}

// Close popup function
function closePopup() {
  popup.style.display = "none";
}

document.getElementById("closePopup").onclick = closePopup;
window.onclick = (event) => {
  if (event.target === popup) closePopup();
};
