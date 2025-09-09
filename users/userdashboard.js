import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDuzBpeML-DAjCqeF3Z5iX6H_0oZR7v3dg",
  authDomain: "trazy-2142e.firebaseapp.com",
  projectId: "trazy-2142e",
  storageBucket: "trazy-2142e.firebasestorage.app",
  messagingSenderId: "4891427196",
  appId: "1:4891427196:web:b8a9b5d0e05232c25124f9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userEmail = user.email;
    console.log("Logged in user:", userEmail);

    await loadOrderHistory(userEmail);
  } else {
    console.log("Not logged in, redirecting...");
    window.location.href = "login.html";
  }
});

async function loadOrderHistory(userEmail) {
  const ordersRef = collection(db, "orders");
  const q = query(ordersRef, where("customerEmail", "==", userEmail));

  const querySnapshot = await getDocs(q);

  const orders = [];
  querySnapshot.forEach((doc) => {
    orders.push({ id: doc.id, ...doc.data() });
  });

  displayOrders(orders);
}

function displayOrders(orders) {
  const container = document.getElementById("order-history");

  if (orders.length === 0) {
    container.innerHTML = "<p>You haven’t placed any orders yet.</p>";
    return;
  }

  let html = `
    <table border="1" style="width: 100%; text-align: left; margin-top: 20px;">
      <tr>
        <th>Food Name</th>
        <th>Price (₹)</th>
        <th>Payment Method</th>
        <th>Status</th>
        <th>Order Date</th>
      </tr>
  `;

  orders.forEach(order => {
    html += `
      <tr>
        <td>${order.item.name}</td>
        <td>${order.item.price}</td>
        <td>${order.paymentMethod}</td>
        <td>${order.status}</td>
        <td>${order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleString() : 'N/A'}</td>
      </tr>
    `;
  });

  html += "</table>";

  container.innerHTML = html;
}
