/*import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
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
*/




// import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
// import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
// import { getFirestore, collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// // -------- Firebase Config --------
// const firebaseConfig = {
//   apiKey: "AIzaSyDuzBpeML-DAjCqeF3Z5iX6H_0oZR7v3dg",
//   authDomain: "trazy-2142e.firebaseapp.com",
//   projectId: "trazy-2142e",
//   storageBucket: "trazy-2142e.firebasestorage.app",
//   messagingSenderId: "4891427196",
//   appId: "1:4891427196:web:b8a9b5d0e05232c25124f9"
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// const userNameEl = document.getElementById("userName");
// const logoutBtn = document.getElementById("logoutBtn");
// const orderHistoryEl = document.getElementById("order-history");

// let ordersChart = null;

// // -------- Logout --------
// logoutBtn.addEventListener("click", () => signOut(auth));

// // -------- Auth Listener --------
// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     userNameEl.textContent = user.email;
//     loadOrders(user.email);
//   } else {
//     window.location.href = "../login.html";
//   }
// });

// // -------- Load Orders & Live Status --------
// function loadOrders(userEmail) {
//   const ordersRef = collection(db, "orders");
//   const q = query(ordersRef, where("customerEmail", "==", userEmail));

//   onSnapshot(q, (snapshot) => {
//     const orders = [];
//     snapshot.forEach(doc => orders.push({ id: doc.id, ...doc.data() }));

//     displayOrders(orders);
//     displayOrderChart(orders);
//   });
// }

// // -------- Display Orders in Table --------
// function displayOrders(orders) {
//   if (orders.length === 0) {
//     orderHistoryEl.innerHTML = "<p>You haven’t placed any orders yet.</p>";
//     return;
//   }

//   let html = `
//     <table>
//       <tr>
//         <th>Food</th>
//         <th>Price (₹)</th>
//         <th>Payment</th>
//         <th>Status</th>
//         <th>Order Date</th>
//         <th>Order ID</th>
//       </tr>
//   `;

//   orders.forEach(o => {
//     const dateStr = o.createdAt ? new Date(o.createdAt.seconds * 1000).toLocaleString() : "N/A";
//     html += `
//   <tr>
//     <td>${o.item.name}</td>
//     <td>${o.item.price}</td>
//     <td>${o.paymentMethod || "N/A"}</td>
//     <td>${o.status}</td>
//     <td>${dateStr}</td>
//     <td>${o.id}</td>
//     <td>
//       ${o.status === "delivered" && !o.rated 
//         ? `<button class="rate-btn" onclick="openRatingPopup('${o.id}', '${o.shopId}', '${o.item.id}')">Rate</button>`
//         : o.rated 
//           ? `⭐ ${o.rating}/5`
//           : `—`
//       }
//     </td>
//   </tr>
// `;

//   });

//   html += "</table>";
//   orderHistoryEl.innerHTML = html;
// }

// // -------- Display Chart of Monthly Spending --------
// function displayOrderChart(orders) {
//   const monthlyData = {};
//   orders.forEach(o => {
//     if (!o.createdAt) return;
//     const d = new Date(o.createdAt.seconds * 1000);
//     const key = `${d.getMonth()+1}-${d.getFullYear()}`;
//     monthlyData[key] = (monthlyData[key] || 0) + Number(o.item.price);
//   });

//   const labels = Object.keys(monthlyData).sort((a,b)=>{
//     const [m1,y1] = a.split("-").map(Number);
//     const [m2,y2] = b.split("-").map(Number);
//     return y1 !== y2 ? y1 - y2 : m1 - m2;
//   });

//   const data = labels.map(l => monthlyData[l]);

//   if (ordersChart) ordersChart.destroy(); // destroy old chart
//   const ctx = document.getElementById("ordersChart").getContext("2d");

//   ordersChart = new Chart(ctx, {
//     type: 'bar',
//     data: {
//       labels: labels.map(l => { const [m,y]=l.split("-"); return `${m}/${y}` }),
//       datasets: [{
//         label: "Total Spent (₹)",
//         data: data,
//         backgroundColor: "rgba(52,152,219,0.7)",
//         borderColor: "rgba(41,128,185,1)",
//         borderWidth: 1
//       }]
//     },
//     options: {
//       responsive: true,
//       scales: {
//         y: { beginAtZero:true, title:{display:true,text:"Amount (₹)"} },
//         x: { title:{display:true,text:"Month-Year"} }
//       }
//     }
//   });
// }
// // ---- Rating Popup UI ----
// const popup = document.createElement("div");
// popup.id = "ratingPopup";
// popup.style.display = "none";
// popup.style.position = "fixed";
// popup.style.top = "0";
// popup.style.left = "0";
// popup.style.width = "100%";
// popup.style.height = "100%";
// popup.style.background = "rgba(0,0,0,0.6)";
// popup.style.backdropFilter = "blur(3px)";
// popup.style.display = "flex";
// popup.style.justifyContent = "center";
// popup.style.alignItems = "center";
// popup.style.zIndex = "1000";
// popup.innerHTML = `
//   <div style="background:white;padding:20px;border-radius:10px;text-align:center;width:300px;">
//     <h3>Rate Your Order</h3>
//     <div id="stars" style="font-size:30px;cursor:pointer;margin:10px 0;">
//       ★★★★★
//     </div>
//     <button id="submitRatingBtn" style="margin-top:10px;padding:8px 15px;">Submit</button>
//     <button id="closePopupBtn" style="margin-left:10px;padding:8px 15px;">Cancel</button>
//   </div>
// `;
// document.body.appendChild(popup);

// let selectedRating = 0;
// let currentOrder = null;

// // ---- Star click logic ----
// const starsDiv = popup.querySelector("#stars");
// starsDiv.addEventListener("click", (e) => {
//   if (e.target.innerText === "★") {
//     const index = Array.from(starsDiv.textContent).indexOf(e.target.innerText);
//     selectedRating = starsDiv.textContent.indexOf(e.target.innerText) + 1;

//     starsDiv.innerHTML = "★★★★★"
//       .split("")
//       .map((s, i) => (i < selectedRating ? "★" : "☆"))
//       .join("");
//   }
// });

// // ---- Open Popup ----
// window.openRatingPopup = (orderId, shopId, itemId) => {
//   currentOrder = { orderId, shopId, itemId };
//   selectedRating = 0;
//   starsDiv.innerHTML = "☆☆☆☆☆";
//   popup.style.display = "flex";
// };

// // ---- Close Popup ----
// popup.querySelector("#closePopupBtn").onclick = () => {
//   popup.style.display = "none";
// };

// // ---- Submit Rating ----
// import { updateDoc, doc, increment } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// popup.querySelector("#submitRatingBtn").onclick = async () => {
//   if (selectedRating === 0) {
//     alert("Please choose a rating.");
//     return;
//   }

//   const { orderId, shopId, itemId } = currentOrder;

//   // 1. Update order
//   await updateDoc(doc(db, "orders", orderId), {
//     rated: true,
//     rating: selectedRating
//   });

//   // 2. Update food rating summary
//   const itemRef = doc(db, "shops", shopId, "items", itemId);
//   await updateDoc(itemRef, {
//     totalRating: increment(selectedRating),
//     ratingCount: increment(1)
//   });

//   alert("Thank you for your rating!");
//   popup.style.display = "none";
// };






import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  getFirestore, collection, query, where, onSnapshot,
  updateDoc, doc, increment
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ---------------- Firebase ----------------
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

// ---------------- Elements ----------------
const userNameEl = document.getElementById("userName");
const logoutBtn = document.getElementById("logoutBtn");
const orderHistoryEl = document.getElementById("order-history");

// Chart reference
let chartInstance = null;

logoutBtn.onclick = () => signOut(auth);

// ---------------- Auth Listener ----------------
onAuthStateChanged(auth, (user) => {
  if (!user) return (window.location.href = "../login.html");

  userNameEl.textContent = user.email;
  loadOrders(user.email);
});

// ---------------- Load Orders ----------------
function loadOrders(email) {
  const q = query(collection(db, "orders"), where("customerEmail", "==", email));

  onSnapshot(q, (snap) => {
    const orders = [];
    snap.forEach(d => orders.push({ id: d.id, ...d.data() }));

    displayOrders(orders);
    updateMonthlySpendingChart(orders);
  });
}

// ---------------- Display Orders ----------------
function displayOrders(orders) {
  if (!orders.length) {
    orderHistoryEl.innerHTML = "<p>No orders yet.</p>";
    return;
  }

  let html = `
    <table>
      <tr>
        <th>Food</th>
        <th>Price</th>
        <th>Status</th>
        <th>Rate</th>
      </tr>
  `;

  orders.forEach(o => {
    html += `
      <tr>
        <td>${o.item.name}</td>
        <td>${o.item.price}</td>
        <td>${o.status}</td>
        <td>
          ${(o.status === "delivered" && !o.rated)
            ? `<button onclick="openRatingPopup('${o.id}','${o.shopId}','${o.item.id}')">Rate</button>`
            : o.rated
              ? `⭐ ${o.rating}/5`
              : `—`
          }
        </td>
      </tr>
    `;
  });

  html += "</table>";
  orderHistoryEl.innerHTML = html;
}

// ---------------- MONTHLY SPENDING CHART ----------------
// ---------------- MONTHLY SPENDING CHART ----------------
let ordersChart = null;

function updateMonthlySpendingChart(orders) {
  if (!orders.length) return;

  const monthlyData = {};

  orders.forEach(o => {
    if (!o.createdAt) return;

    const date = new Date(o.createdAt.seconds * 1000);
    const key = `${date.getMonth() + 1}-${date.getFullYear()}`;

    monthlyData[key] = (monthlyData[key] || 0) + Number(o.item.price);
  });

  // Sort months
  const labels = Object.keys(monthlyData).sort((a, b) => {
    const [m1, y1] = a.split("-").map(Number);
    const [m2, y2] = b.split("-").map(Number);
    return y1 !== y2 ? y1 - y2 : m1 - m2;
  });

  const data = labels.map(l => monthlyData[l]);

  // Destroy old chart
  if (ordersChart) ordersChart.destroy();

  const ctx = document.getElementById("ordersChart").getContext("2d");

  ordersChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels.map(l => {
        const [m, y] = l.split("-");
        return `${m}/${y}`;
      }),
      datasets: [{
        label: "Total Spending (₹)",
        data: data,
        backgroundColor: "rgba(255,159,64,0.7)",
        borderColor: "rgba(255,99,32,1)",
        borderWidth: 2,
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Amount (₹)" }
        },
        x: {
          title: { display: true, text: "Month / Year" }
        }
      }
    }
  });
}


// ---------------- Rating Popup ----------------
const popup = document.createElement("div");
popup.style.cssText = `
  position: fixed;
  top:0; left:0; width:100%; height:100%;
  background: rgba(0,0,0,0.6);
  display:none;
  justify-content:center;
  align-items:center;
  z-index:1000;
`;

popup.innerHTML = `
  <div style="background:white;padding:20px;border-radius:10px;text-align:center;width:280px;">
    <h3>Rate Your Order</h3>
    <div id="stars" style="font-size:28px;margin:10px;cursor:pointer;">
      <span data-value="1">☆</span>
      <span data-value="2">☆</span>
      <span data-value="3">☆</span>
      <span data-value="4">☆</span>
      <span data-value="5">☆</span>
    </div>
    <button id="submitRatingBtn">Submit</button>
    <button id="closePopupBtn">Cancel</button>
  </div>
`;

document.body.appendChild(popup);

let selectedRating = 0;
let currentOrder = null;

popup.querySelector("#stars").onclick = (e) => {
  if (e.target.tagName !== "SPAN") return;

  selectedRating = Number(e.target.dataset.value);

  [...popup.querySelector("#stars").children].forEach((star, i) => {
    star.textContent = (i < selectedRating ? "★" : "☆");
  });
};

window.openRatingPopup = (orderId, shopId, itemId) => {
  currentOrder = { orderId, shopId, itemId };
  selectedRating = 0;

  [...popup.querySelector("#stars").children].forEach(star => star.textContent = "☆");

  popup.style.display = "flex";
};

popup.querySelector("#closePopupBtn").onclick = () => popup.style.display = "none";

popup.querySelector("#submitRatingBtn").onclick = async () => {
  if (!selectedRating) return alert("Please choose a rating");

  const { orderId, shopId, itemId } = currentOrder;

  await updateDoc(doc(db, "orders", orderId), {
    rated: true,
    rating: selectedRating
  });

  await updateDoc(doc(db, "shops", shopId, "items", itemId), {
    totalRating: increment(selectedRating),
    ratingCount: increment(1)
  });

  alert("Thanks for rating!");
  popup.style.display = "none";
};
