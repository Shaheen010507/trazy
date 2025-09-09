/*import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, query, where, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// --- Firebase config ---
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

// --- Containers ---
const ongoingList = document.getElementById("ongoing-orders");
const receivedList = document.getElementById("received-orders");

// --- Load Orders ---
function loadOrders(userId) {
  const ordersRef = collection(db, "orders");
  const q = query(ordersRef, where("userId", "==", userId), orderBy("createdAt", "desc"));

  // Real-time updates
  onSnapshot(q, (snapshot) => {
    ongoingList.innerHTML = "";
    receivedList.innerHTML = "";

    if (snapshot.empty) {
      ongoingList.innerHTML = "<p>No orders found.</p>";
      return;
    }

    snapshot.forEach((doc) => {
      const order = doc.data();
      const li = document.createElement("li");
      li.className = "order-item";
      li.innerHTML = `
        <strong>${order.item.name}</strong> - ₹${order.item.price} <br>
        Status: <span class="status">${order.status}</span> <br>
        Address: ${order.address} <br>
        Payment: ${order.paymentMethod} <br>
        <small>${order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : ""}</small>
      `;

      if (order.status === "delivered") {
        receivedList.appendChild(li);
      } else {
        ongoingList.appendChild(li);
      }
    });
  });
}

// --- Use Firebase Auth to get current user ---
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadOrders(user.uid); // dynamically load orders for this user
  } else {
    // Not logged in, redirect to login page
    window.location.href = "../login.html";
  }
});
*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, query, where, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// --- Firebase config ---
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

// --- Containers ---
const ongoingList = document.getElementById("ongoing-orders");
const receivedList = document.getElementById("received-orders");

// --- Render Order Item ---
function renderOrder(order) {
  const li = document.createElement("li");
  li.className = "order-item";

  li.innerHTML = `
    <strong>${order.item?.name || "Unknown Item"}</strong> - ₹${order.item?.price || "0"} <br>
    <b>Status:</b> <span class="status">${order.status}</span> <br>
    <b>Address:</b> ${order.address || "N/A"} <br>
    <b>Payment:</b> ${order.paymentMethod || "N/A"} <br>
    <small>${order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : ""}</small>
  `;

  return li;
}

// --- Load Orders ---
function loadOrders(userId) {
  const ordersRef = collection(db, "orders");
  const q = query(
    ordersRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  onSnapshot(q, (snapshot) => {
    ongoingList.innerHTML = "";
    receivedList.innerHTML = "";

    let ongoingCount = 0;
    let receivedCount = 0;

    snapshot.forEach((doc) => {
      const order = doc.data();
      const li = renderOrder(order);

      if (order.status?.toLowerCase() === "delivered") {
        receivedList.appendChild(li);
        receivedCount++;
      } else {
        ongoingList.appendChild(li);
        ongoingCount++;
      }
    });

    // If no orders, show message
    if (ongoingCount === 0) {
      ongoingList.innerHTML = "<p>No ongoing orders found.</p>";
    }
    if (receivedCount === 0) {
      receivedList.innerHTML = "<p>No received products yet.</p>";
    }
  });
}

// --- Auth State Listener ---
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadOrders(user.uid);
  } else {
    window.location.href = "../login.html";
  }
});
