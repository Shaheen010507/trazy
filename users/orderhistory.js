// ---------------- Firebase ----------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Your Firebase config
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

// Function to load orders for a specific customer
async function loadOrders(customerName) {
  const ordersRef = collection(db, "orders");
  const q = query(ordersRef, where("customerName", "==", customerName), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);

  const orderList = document.getElementById("order-list");
  orderList.innerHTML = "";

  if (querySnapshot.empty) {
    orderList.innerHTML = "<p>No orders found.</p>";
    return;
  }

  querySnapshot.forEach((doc) => {
    const order = doc.data();
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${order.item.name}</strong> - ₹${order.item.price} <br>
      Status: ${order.status} <br>
      Address: ${order.address} <br>
      Payment: ${order.paymentMethod} <br>
      <small>${order.createdAt.toDate()}</small>
    `;
    orderList.appendChild(li);
  });
}

// Load for your test user (replace "nithi" with logged-in customer later)
loadOrders("nithi");
