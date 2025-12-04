// -----------------------------
// Firebase Config (YOUR CONFIG)
// -----------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc, 
  getDocs, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// 🔥 Your Firebase Credentials
const firebaseConfig = {
  apiKey: "AIzaSyDuzBpeML-DAjCqeF3Z5iX6H_0oZR7v3dg",
  authDomain: "trazy-2142e.firebaseapp.com",
  projectId: "trazy-2142e",
  storageBucket: "trazy-2142e.firebasestorage.app",
  messagingSenderId: "4891427196",
  appId: "1:4891427196:web:b8a9b5d0e05232c25124f9"
};

// Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// -----------------------------
// UI REFERENCES
// -----------------------------
const deliveryEmail = document.getElementById("deliveryEmail");
const signOutBtn = document.getElementById("signOutBtn");
const newOrders = document.getElementById("newOrders");
const myOrders = document.getElementById("myOrders");

let deliveryId = null; // logged-in delivery partner

// -----------------------------
// AUTH CHECK
// -----------------------------
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "../login.html";
    return;
  }

  deliveryEmail.innerText = user.email;
  findDeliveryId(user.email);
});

// -----------------------------
// Get Delivery Man Firestore ID
// -----------------------------
async function findDeliveryId(email) {
  const snap = await getDocs(collection(db, "delivery"));

  snap.forEach((d) => {
    if (d.data().email === email) {
      deliveryId = d.id;   // delivery firestore ID
      startFCFSListener();
    }
  });
}

// -----------------------------
// LOGOUT
// -----------------------------
signOutBtn.addEventListener("click", () => signOut(auth));

// ----------------------------------------------------
// 🔥 FCFS ORDER LISTENING SYSTEM
// ----------------------------------------------------
function startFCFSListener() {
  const ordersRef = collection(db, "orders");

  onSnapshot(ordersRef, (snapshot) => {
    newOrders.innerHTML = "";
    myOrders.innerHTML = "";

    snapshot.forEach((docu) => {
      const order = docu.data();

      // ❌ If someone else accepted → hide from this delivery boy
      if (order.deliveryId && order.deliveryId !== deliveryId) return;

      // ✔ If *this* delivery boy accepted → show in My Orders
      if (order.deliveryId === deliveryId) {
          showMyOrder(docu.id, order);
          return;
      }

      // ✔ Unassigned → show in Available Orders
      if (!order.deliveryId) {
          showAvailableOrder(docu.id, order);
      }
    });
  });
}

// ----------------------------------------------------
// SHOW NEW UNASSIGNED ORDERS
// ----------------------------------------------------
function showAvailableOrder(orderId, order) {
  const div = document.createElement("div");
  div.className = "order-card";

  div.innerHTML = `
    <p><strong>Order ID:</strong> ${orderId}</p>
    <p>User: ${order.customerName}</p>
    <p>Food: ${order.item.name}</p>
    <p>Amount: ₹${order.item.price}</p>
    <p>Address: ${order.address}</p>
    <button class="acceptBtn" data-id="${orderId}">ACCEPT</button>
  `;

  newOrders.appendChild(div);

  div.querySelector(".acceptBtn").addEventListener("click", () => {
    acceptOrder(orderId);
  });
}

// ----------------------------------------------------
// 🔥 FCFS ACCEPT ORDER → ONLY FIRST BOY GETS IT
// ----------------------------------------------------
async function acceptOrder(orderId) {
  const orderRef = doc(db, "orders", orderId);

  try {
    await updateDoc(orderRef, {
      deliveryId: deliveryId,
      status: "Accepted by Delivery",
      acceptedTime: serverTimestamp()
    });

    alert("Order Accepted Successfully!");
  } 
  catch (err) {
    alert("Someone else accepted first!");
  }
}

// ----------------------------------------------------
// SHOW ORDERS ASSIGNED TO THIS DELIVERY MAN
// ----------------------------------------------------
function showMyOrder(orderId, order) {
  const div = document.createElement("div");
  div.className = "order-card my-order";

  div.innerHTML = `
    <p><strong>Order ID:</strong> ${orderId}</p>
    <p>User: ${order.customerName}</p>
    <p>Food: ${order.item.name}</p>
    <p>Amount: ₹${order.item.price}</p>
    <p>Status: ${order.status}</p>
    <button class="deliverBtn" data-id="${orderId}">MARK DELIVERED</button>
  `;

  myOrders.appendChild(div);

  div.querySelector(".deliverBtn").addEventListener("click", () => {
    markDelivered(orderId);
  });
}

// ----------------------------------------------------
// DELIVERY MAN MARK ORDER AS DELIVERED
// ----------------------------------------------------
async function markDelivered(orderId) {
  await updateDoc(doc(db, "orders", orderId), {
    status: "Delivered",
    deliveredTime: serverTimestamp()
  });

  alert("Order marked as Delivered!");
}
