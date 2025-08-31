/*import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  collection, 
  addDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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

const params = new URLSearchParams(window.location.search);
const shopId = params.get("shopId");
const itemId = params.get("itemId");

const productNameEl = document.getElementById("productName");
const productPriceEl = document.getElementById("productPrice");

let currentItem = null; // store loaded product

// ---------------- Load product from Firestore ----------------
async function loadProduct() {
  if (!shopId || !itemId) {
    alert("Invalid product data!");
    window.history.back();
    return;
  }

  const itemRef = doc(db, "shops", shopId, "items", itemId);
  const snap = await getDoc(itemRef);

  if (!snap.exists()) {
    productNameEl.innerText = "Product not found!";
    return;
  }

  currentItem = snap.data();
  currentItem.id = itemId; // include itemId

  productNameEl.innerText = currentItem.name;
  productPriceEl.innerText = "₹" + currentItem.price;
}

loadProduct();

// ---------------- Handle order submit ----------------
document.getElementById("orderForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!currentItem) {
    alert("Product not loaded correctly!");
    return;
  }

  // Get customer input
  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const payment = document.getElementById("payment").value;

  try {
    await addDoc(collection(db, "orders"), {
      customerName: name,
      address: address,
      paymentMethod: payment,
      shopId: shopId,
      item: {
        id: currentItem.id,
        name: currentItem.name,
        price: currentItem.price
      },
      status: "pending",
      createdAt: serverTimestamp()
    });

    alert("Order placed successfully!");
    window.location.href = "shop.html";

  } catch (error) {
    console.error("Error placing order:", error);
    alert("Failed to place order. Try again.");
  }
});
*/
// ---------------- Firebase Setup ----------------
/*import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc,
  orderBy 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ---------------- Config ----------------
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

// ---------------- DOM ----------------
const ordersContainer = document.getElementById("ordersContainer");

// Replace with current logged-in owner/shopId
const currentShopId = "LB6UEWnMquasVsdkwZYbfYyX8wy1"; 

// ---------------- Load Orders in Real-Time ----------------
const ordersQuery = query(
  collection(db, "orders"),
  where("shopId", "==", currentShopId),
  orderBy("createdAt", "desc")
);

onSnapshot(ordersQuery, (snapshot) => {
  ordersContainer.innerHTML = ""; // clear previous list

  if (snapshot.empty) {
    ordersContainer.innerHTML = "<p>No orders yet.</p>";
    return;
  }

  snapshot.forEach((docSnap) => {
    const order = docSnap.data();
    const orderId = docSnap.id;

    const div = document.createElement("div");
    div.classList.add("order-item");

    div.innerHTML = `
      <h3>${order.item.name}</h3>
      <p><b>Customer:</b> ${order.customerName}</p>
      <p><b>Address:</b> ${order.address}</p>
      <p><b>Payment:</b> ${order.paymentMethod}</p>
      <p><b>Status:</b> <span id="status-${orderId}">${order.status}</span></p>
      <button id="accept-${orderId}">Accept</button>
      <button id="reject-${orderId}">Reject</button>
      <hr>
    `;

    ordersContainer.appendChild(div);

    // Accept Button
    document.getElementById(`accept-${orderId}`).addEventListener("click", async () => {
      await updateDoc(doc(db, "orders", orderId), { status: "accepted" });
      document.getElementById(`status-${orderId}`).innerText = "accepted";
    });

    // Reject Button
    document.getElementById(`reject-${orderId}`).addEventListener("click", async () => {
      await updateDoc(doc(db, "orders", orderId), { status: "rejected" });
      document.getElementById(`status-${orderId}`).innerText = "rejected";
    });
  });
});
*/
// ---------------- Firebase Setup ----------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { 
  getFirestore, collection, addDoc, doc, getDoc, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ---------------- Firebase Config ----------------
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

// ---------------- DOM Elements ----------------
const productNameEl = document.getElementById("productName");
const productPriceEl = document.getElementById("productPrice");
const orderForm = document.getElementById("orderForm");

// Get URL params (shopId, itemId)
const params = new URLSearchParams(window.location.search);
const shopId = params.get("shopId");
const itemId = params.get("itemId");

let currentItem = null;

// ---------------- Load Product ----------------
async function loadProduct() {
  if (!shopId || !itemId) {
    alert("Invalid shop or item!");
    window.history.back();
    return;
  }

  const itemRef = doc(db, "shops", shopId, "items", itemId);
  const snap = await getDoc(itemRef);

  if (!snap.exists()) {
    productNameEl.innerText = "Item not found!";
    return;
  }

  currentItem = snap.data();
  currentItem.id = itemId;

  productNameEl.innerText = currentItem.name;
  productPriceEl.innerText = "₹" + currentItem.price.toFixed(2);
}

loadProduct();

// ---------------- Handle Order Form ----------------
orderForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentItem) return alert("Product not loaded!");

  const name = document.getElementById("name").value.trim();
  const address = document.getElementById("address").value.trim();
  const payment = document.getElementById("payment").value;

  if (!name || !address) return alert("Please fill all details!");

  // ---------------- Simulate Payment ----------------
  if (payment === "upi") {
    const confirmUPI = confirm(`Pay ₹${currentItem.price.toFixed(2)} via UPI?`);
    if (!confirmUPI) return alert("Payment cancelled");
  }

  try {
    await addDoc(collection(db, "orders"), {
      customerName: name,
      address,
      paymentMethod: payment,
      shopId,
      item: {
        id: currentItem.id,
        name: currentItem.name,
        price: currentItem.price
      },
      status: "pending",
      createdAt: serverTimestamp()
    });

    alert("Order placed successfully!");
    window.location.href = "user_dashboard.html"; // Redirect to user page

  } catch (err) {
    console.error("Error placing order:", err);
    alert("Failed to place order. Try again.");
  }
});
