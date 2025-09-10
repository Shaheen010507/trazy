/*mport { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, collection, getDocs, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDuzBpeML-DAjCqeF3Z5iX6H_0oZR7v3dg",
  authDomain: "trazy-2142e.firebaseapp.com",
  projectId: "trazy-2142e",
  storageBucket: "trazy-2142e.firebasestorage.app",
  messagingSenderId: "4891427196",
  appId: "1:4891427196:web:b8a9b5d0e05232c25124f9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

const ownerEmailEl = document.getElementById("ownerEmail");
const signOutBtn = document.getElementById("signOutBtn");
const totalOrdersEl = document.getElementById("totalOrders");
const deliveredOrdersEl = document.getElementById("deliveredOrders");
const pendingOrdersEl = document.getElementById("pendingOrders");
const activeDeliveryEl = document.getElementById("activeDelivery");
const deliveryListEl = document.getElementById("deliveryList");
const deliveryChartEl = document.getElementById("deliveryChart");

onAuthStateChanged(auth, async user => {
  if(!user) return window.location.href = "login.html";
  ownerEmailEl.textContent = user.email;

  loadDeliveryDashboard();
});

signOutBtn.addEventListener("click", () => signOut(auth));

async function loadDeliveryDashboard() {
  // ---------------- Orders Summary ----------------
  const ordersSnap = await getDocs(collection(db, "orders"));
  let total = 0, delivered = 0, pending = 0;
  const monthlyData = {};

  ordersSnap.forEach(docu => {
    const data = docu.data();
    total++;
    if(data.status === "delivered") delivered++;
    else pending++;

    if(data.createdAt) {
      const date = data.createdAt.seconds ? new Date(data.createdAt.seconds * 1000) : new Date();
      const key = `${date.getMonth()+1}-${date.getFullYear()}`;
      monthlyData[key] = (monthlyData[key] || 0) + 1;
    }
  });

  totalOrdersEl.textContent = total;
  deliveredOrdersEl.textContent = delivered;
  pendingOrdersEl.textContent = pending;

  // ---------------- Delivery Men List ----------------
  const deliverySnap = await getDocs(collection(db, "delivery"));
  let activeCount = 0;
  deliveryListEl.innerHTML = "";

  deliverySnap.forEach(docu => {
    const data = docu.data();
    if(data.status === "free") activeCount++;
    const div = document.createElement("div");
    div.innerHTML = `<p><strong>Name:</strong> ${data.fullname || "N/A"} | <strong>Status:</strong> ${data.status}</p>`;
    deliveryListEl.appendChild(div);
  });

  activeDeliveryEl.textContent = activeCount;

  // ---------------- Delivery Orders Chart ----------------
  const labels = Object.keys(monthlyData).sort((a,b) => {
    const [m1,y1] = a.split("-").map(Number);
    const [m2,y2] = b.split("-").map(Number);
    return y1!==y2 ? y1-y2 : m1-m2;
  });
  const data = labels.map(l => monthlyData[l]);

  new Chart(deliveryChartEl, {
    type: 'bar',
    data: {
      labels: labels.map(l=> { const [m,y]=l.split("-"); return `${m}/${y}`; }),
      datasets: [{
        label: 'Orders per Month',
        data: data,
        backgroundColor: 'rgba(46, 204, 113, 0.7)',
        borderColor: 'rgba(39, 174, 96,1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive:true,
      scales: {
        y: { beginAtZero:true, title:{ display:true, text:'Number of Orders'} },
        x: { title:{ display:true, text:'Month-Year'} }
      }
    }
  });
}

*/




import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Firebase Config
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

const deliveryEmailEl = document.getElementById("deliveryEmail");
const signOutBtn = document.getElementById("signOutBtn");
const totalOrdersEl = document.getElementById("totalOrders");
const deliveredOrdersEl = document.getElementById("deliveredOrders");
const pendingOrdersEl = document.getElementById("pendingOrders");
const ordersContainer = document.getElementById("ordersContainer");

let deliveryId;

// Auth
onAuthStateChanged(auth, user => {
  if (user) {
    deliveryEmailEl.textContent = user.email;
    deliveryId = user.uid;
    loadOrders();
  } else {
    window.location.href = "login.html";
  }
});

signOutBtn.addEventListener("click", () => signOut(auth));

// Load Orders assigned to this delivery person
function loadOrders() {
  const ordersQuery = query(collection(db, "orders"), where("deliveryId", "==", deliveryId));

  onSnapshot(ordersQuery, snapshot => {
    let total = 0, delivered = 0, pending = 0;
    let ordersData = [];
    ordersContainer.innerHTML = "";

    snapshot.forEach(doc => {
      const order = doc.data();
      ordersData.push(order);

      total++;
      if(order.status === "delivered") delivered++;
      else pending++;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${doc.id}</td>
        <td>${order.customerName}</td>
        <td>${order.item.name}</td>
        <td>${order.item.price}</td>
        <td>${order.status}</td>
      `;
      ordersContainer.appendChild(tr);
    });

    totalOrdersEl.textContent = total;
    deliveredOrdersEl.textContent = delivered;
    pendingOrdersEl.textContent = pending;

    drawDailyChart(ordersData);
    drawMonthlyChart(ordersData);
  });
}

// Daily Chart
function drawDailyChart(orders) {
  const dailyData = {};
  orders.forEach(order => {
    if(!order.createdAt) return;
    const date = new Date(order.createdAt.seconds*1000);
    const dayKey = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
    dailyData[dayKey] = (dailyData[dayKey] || 0) + Number(order.item.price);
  });

  const labels = Object.keys(dailyData).sort((a,b) => {
    const [d1,m1,y1] = a.split('-').map(Number);
    const [d2,m2,y2] = b.split('-').map(Number);
    return y1!==y2?y1-y2:m1!==m2?m1-m2:d1-d2;
  });
  const values = labels.map(l => dailyData[l]);

  const ctx = document.getElementById('dailyChart').getContext('2d');
  new Chart(ctx, { type:'bar', data:{ labels: labels.map(l=>l.replace(/-/g,'/')), datasets:[{ label:'Daily Delivery Amount (₹)', data:values, backgroundColor:'rgba(52,152,219,0.7)', borderColor:'rgba(41,128,185,1)', borderWidth:1 }] }, options:{ responsive:true, scales:{ y:{ beginAtZero:true }}}});
}

// Monthly Chart
function drawMonthlyChart(orders) {
  const monthlyData = {};
  orders.forEach(order => {
    if(!order.createdAt) return;
    const date = new Date(order.createdAt.seconds*1000);
    const monthKey = `${date.getMonth()+1}-${date.getFullYear()}`;
    monthlyData[monthKey] = (monthlyData[monthKey] || 0) + Number(order.item.price);
  });

  const labels = Object.keys(monthlyData).sort((a,b)=>{
    const [m1,y1]=a.split('-').map(Number);
    const [m2,y2]=b.split('-').map(Number);
    return y1!==y2?y1-y2:m1-m2;
  });
  const values = labels.map(l=>monthlyData[l]);

  const ctx = document.getElementById('monthlyChart').getContext('2d');
  new Chart(ctx, { type:'bar', data:{ labels: labels.map(l=>l.replace('-', '/')), datasets:[{ label:'Monthly Delivery Amount (₹)', data:values, backgroundColor:'rgba(231,76,60,0.7)', borderColor:'rgba(192,57,43,1)', borderWidth:1 }] }, options:{ responsive:true, scales:{ y:{ beginAtZero:true }}}});
}
