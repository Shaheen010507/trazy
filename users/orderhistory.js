
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

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
const auth = getAuth();

const orderList = document.getElementById("order-list");
orderList.innerHTML = "<p>Loading your orders...</p>";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    orderList.innerHTML = "<p>Please log in to view your orders.</p>";
    return;
  }

  try {
    const currentCustomerName = user.displayName || user.email;
    const ordersRef = collection(db, "orders");

    // Fetch orders without orderBy
    const q = query(
      ordersRef,
      where("customerName", "==", currentCustomerName)
    );

    const querySnapshot = await getDocs(q);
    orderList.innerHTML = "";

    if (querySnapshot.empty) {
      orderList.innerHTML = "<p>No orders found.</p>";
      return;
    }

    // Convert snapshot to array
    const orders = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      data.id = doc.id;
      orders.push(data);
    });

    // Sort orders manually by timestamp descending
    orders.sort((a, b) => {
      const t1 = a.timestamp ? a.timestamp.toMillis() : 0;
      const t2 = b.timestamp ? b.timestamp.toMillis() : 0;
      return t2 - t1; // descending
    });

    // Display orders
    orders.forEach(order => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("order-item");

      let itemsHTML = "";
      order.items?.forEach(item => {
        itemsHTML += `<li>${item.name} x ${item.quantity} = ₹${item.price * item.quantity}</li>`;
      });

      const statusClass = order.status || "Pending";

      itemDiv.innerHTML = `
        <h3>Order ID: ${order.id}</h3>
        <ul>${itemsHTML}</ul>
        <p><span class="status ${statusClass}">${statusClass}</span></p>
        <p><b>Payment:</b> ${order.paymentMode || "N/A"}</p>
        <p><b>Date:</b> ${order.timestamp?.toDate().toLocaleString() || "N/A"}</p>
        <p><b>Total:</b> ₹${order.totalAmount || 0}</p>
      `;

      orderList.appendChild(itemDiv);
    });

  } catch (error) {
    console.error("Error fetching orders:", error);
    orderList.innerHTML = "<p>Error loading orders. Check console.</p>";
  }
});
