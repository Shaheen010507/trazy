import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import Chart from "https://cdn.jsdelivr.net/npm/chart.js";

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
  displayOrderChart(orders); 
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

function displayOrderChart(orders) {
  const monthlyData = {};

  orders.forEach(order => {
    if (!order.createdAt) return;

    const date = new Date(order.createdAt.seconds * 1000);
    const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;

    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = 0;
    }

    monthlyData[monthYear] += Number(order.item.price);
  });

  const labels = Object.keys(monthlyData).sort((a, b) => {
    const [m1, y1] = a.split('-').map(Number);
    const [m2, y2] = b.split('-').map(Number);
    return y1 !== y2 ? y1 - y2 : m1 - m2;
  });

  const data = labels.map(month => monthlyData[month]);

  const ctx = document.getElementById('ordersChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels.map(l => {
        const [m, y] = l.split('-');
        return `${m}/${y}`;
      }),
      datasets: [{
        label: 'Total Spent (₹) per Month',
        data: data,
        backgroundColor: 'rgba(52, 152, 219, 0.7)',
        borderColor: 'rgba(41, 128, 185, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Amount Spent (₹)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Month-Year'
          }
        }
      }
    }
  });
}
