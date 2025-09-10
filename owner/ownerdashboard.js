/*import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, collection, query, where, onSnapshot, doc, getDocs } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

const ownerEmailEl = document.getElementById("ownerEmail");
const signOutBtn = document.getElementById("signOutBtn");
const totalOrdersEl = document.getElementById("totalOrders");
const deliveredOrdersEl = document.getElementById("deliveredOrders");
const pendingOrdersEl = document.getElementById("pendingOrders");
const ordersContainer = document.getElementById("ordersContainer");

let shopId;

// ---------------- Auth ----------------
onAuthStateChanged(auth, async user => {
  if (user) {
    ownerEmailEl.textContent = user.email;
    await loadShopId(user.uid);
    if (shopId) loadOrders(shopId);
  } else {
    window.location.href = "login.html";
  }
});

signOutBtn.addEventListener("click", () => signOut(auth));

// ---------------- Load Shop ----------------
async function loadShopId(uid) {
  const ownersSnap = await getDocs(collection(db, "owners"));
  ownersSnap.forEach(docu => {
    const data = docu.data();
    if (data.email === auth.currentUser.email) {
      shopId = docu.id;
    }
  });
}

// ---------------- Load Orders ----------------
function loadOrders(shopId) {
  const ordersQuery = query(collection(db, "orders"), where("shopId", "==", shopId));

  onSnapshot(ordersQuery, snapshot => {
    let total = 0, delivered = 0, pending = 0;
    let ordersData = [];

    ordersContainer.innerHTML = "";

    snapshot.forEach(docu => {
      const order = docu.data();
      ordersData.push(order);

      total++;
      if(order.status === "delivered") delivered++;
      else pending++;

      const div = document.createElement("div");
      div.innerHTML = `
        <p>Order ID: ${docu.id}</p>
        <p>User: ${order.customerName}</p>
        <p>Food: ${order.item.name}</p>
        <p>Amount: ₹${order.item.price}</p>
        <p>Status: ${order.status}</p>
        <p>Delivery Man: ${order.deliveryId || "Not Assigned"}</p>
      `;
      ordersContainer.appendChild(div);
    });

    totalOrdersEl.textContent = total;
    deliveredOrdersEl.textContent = delivered;
    pendingOrdersEl.textContent = pending;

    drawChart(ordersData);
  });
}

// ---------------- Sales Chart ----------------
function drawChart(orders) {
  const monthlyData = {};
  orders.forEach(order => {
    if (!order.createdAt) return;
    const date = new Date(order.createdAt.seconds * 1000);
    const monthYear = `${date.getMonth()+1}-${date.getFullYear()}`;
    if(!monthlyData[monthYear]) monthlyData[monthYear] = 0;
    monthlyData[monthYear] += Number(order.item.price);
  });

  const labels = Object.keys(monthlyData).sort((a,b) => {
    const [m1, y1] = a.split('-').map(Number);
    const [m2, y2] = b.split('-').map(Number);
    return y1 !== y2 ? y1 - y2 : m1 - m2;
  });

  const data = labels.map(l => monthlyData[l]);

  const ctx = document.getElementById('salesChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels.map(l => l.replace('-', '/')),
      datasets: [{
        label: 'Sales (₹)',
        data: data,
        backgroundColor: 'rgba(231, 76, 60, 0.7)',
        borderColor: 'rgba(192, 57, 43, 1)',
        borderWidth: 1
      }]
    },
    options: { responsive: true }
  });
}
*/



import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, collection, query, where, onSnapshot, getDocs } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

const ownerEmailEl = document.getElementById("ownerEmail");
const signOutBtn = document.getElementById("signOutBtn");
const totalOrdersEl = document.getElementById("totalOrders");
const deliveredOrdersEl = document.getElementById("deliveredOrders");
const pendingOrdersEl = document.getElementById("pendingOrders");
const ordersContainer = document.getElementById("ordersContainer");

let shopId;

// ---------------- Auth ----------------
onAuthStateChanged(auth, async user => {
  if (user) {
    ownerEmailEl.textContent = user.email;
    await loadShopId();
    if (shopId) loadOrders();
  } else {
    window.location.href = "login.html";
  }
});

signOutBtn.addEventListener("click", () => signOut(auth));

// ---------------- Load Shop ----------------
async function loadShopId() {
  const ownersSnap = await getDocs(collection(db, "owners"));
  ownersSnap.forEach(docu => {
    if (docu.data().email === auth.currentUser.email) shopId = docu.id;
  });
}

// ---------------- Load Orders ----------------
function loadOrders() {
  const ordersQuery = query(collection(db, "orders"), where("shopId", "==", shopId));

  onSnapshot(ordersQuery, snapshot => {
    let total = 0, delivered = 0, pending = 0;
    let ordersData = [];
    ordersContainer.innerHTML = "";

    snapshot.forEach(docu => {
      const order = docu.data();
      ordersData.push(order);

      total++;
      if(order.status === "delivered") delivered++;
      else pending++;

      const div = document.createElement("div");
      div.innerHTML = `
        <p>Order ID: ${docu.id}</p>
        <p>User: ${order.customerName}</p>
        <p>Food: ${order.item.name}</p>
        <p>Amount: ₹${order.item.price}</p>
        <p>Status: ${order.status}</p>
        <p>Delivery Man: ${order.deliveryId || "Not Assigned"}</p>
      `;
      ordersContainer.appendChild(div);
    });

    totalOrdersEl.textContent = total;
    deliveredOrdersEl.textContent = delivered;
    pendingOrdersEl.textContent = pending;

    drawDailyChart(ordersData);
    drawMonthlyChart(ordersData);
  });
}

// ---------------- Daily Sales Chart ----------------
function drawDailyChart(orders) {
  const dailyData = {};
  orders.forEach(order => {
    if (!order.createdAt) return;
    const date = new Date(order.createdAt.seconds * 1000);
    const dayKey = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
    dailyData[dayKey] = (dailyData[dayKey] || 0) + Number(order.item.price);
  });

  const labels = Object.keys(dailyData).sort((a,b) => {
    const [d1,m1,y1] = a.split('-').map(Number);
    const [d2,m2,y2] = b.split('-').map(Number);
    return y1!==y2 ? y1-y2 : m1!==m2 ? m1-m2 : d1-d2;
  });
  const values = labels.map(l => dailyData[l]);

  const ctx = document.getElementById('dailyChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels.map(l => l.replace(/-/g,'/')),
      datasets: [{
        label: 'Daily Sales (₹)',
        data: values,
        backgroundColor: 'rgba(52, 152, 219, 0.7)',
        borderColor: 'rgba(41, 128, 185,1)',
        borderWidth: 1
      }]
    },
    options: { responsive: true, scales: { y: { beginAtZero:true } } }
  });
}

// ---------------- Monthly Sales Chart ----------------
function drawMonthlyChart(orders) {
  const monthlyData = {};
  orders.forEach(order => {
    if (!order.createdAt) return;
    const date = new Date(order.createdAt.seconds * 1000);
    const monthKey = `${date.getMonth()+1}-${date.getFullYear()}`;
    monthlyData[monthKey] = (monthlyData[monthKey] || 0) + Number(order.item.price);
  });

  const labels = Object.keys(monthlyData).sort((a,b) => {
    const [m1,y1] = a.split('-').map(Number);
    const [m2,y2] = b.split('-').map(Number);
    return y1!==y2 ? y1-y2 : m1-m2;
  });
  const values = labels.map(l => monthlyData[l]);

  const ctx = document.getElementById('monthlyChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels.map(l => l.replace('-', '/')),
      datasets: [{
        label: 'Monthly Sales (₹)',
        data: values,
        backgroundColor: 'rgba(231, 76, 60, 0.7)',
        borderColor: 'rgba(192, 57, 43,1)',
        borderWidth: 1
      }]
    },
    options: { responsive: true, scales: { y: { beginAtZero:true } } }
  });
}
