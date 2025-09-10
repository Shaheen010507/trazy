import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, doc, collection, updateDoc, onSnapshot, query, where } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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
const db = getFirestore();

const deliveryEmailEl = document.getElementById("deliveryEmail");
const signOutBtn = document.getElementById("signOutBtn");
const assignedOrders = document.getElementById("assignedOrders");

let deliveryId;

onAuthStateChanged(auth, user => {
  if(user){
    deliveryEmailEl.textContent = user.email;
    loadDeliveryDetails(user.uid);
  } else { window.location.href = "login.html"; }
});

signOutBtn.addEventListener("click", () => signOut(auth));

function loadDeliveryDetails(uid){
  const deliveryRef = doc(db, "delivery", uid);
  deliveryId = uid;

  // Listen for status changes
  onSnapshot(deliveryRef, snap => {
    const data = snap.data();
    document.querySelectorAll('input[name="status"]').forEach(r => r.checked = (r.value === data.status));
  });

  // Listen to assigned orders
  const ordersQuery = query(collection(db, "orders"), where("deliveryId","==",uid));
  onSnapshot(ordersQuery, snap => {
    assignedOrders.innerHTML = "";
    snap.forEach(docu => {
      const order = docu.data();
      const div = document.createElement("div");
      div.className = "orderCard";
      div.innerHTML = `
        <p>Order ID: ${docu.id}</p>
        <p>User: ${order.customerName}</p>
        <p>Food: ${order.item.name}</p>
        <p>Amount: ₹${order.item.price}</p>
        <p>Place: ${order.address}</p>
        <p>Status: ${order.status}</p>
        <button onclick="markDelivered('${docu.id}')">Mark Delivered</button>
      `;
      assignedOrders.appendChild(div);
    });
  });

  document.querySelectorAll('input[name="status"]').forEach(radio => {
    radio.addEventListener("change", async e => {
      await updateDoc(deliveryRef, { status: e.target.value });
    });
  });
}

window.markDelivered = async function(orderId){
  await updateDoc(doc(db, "orders", orderId), { status: "delivered" });
  await updateDoc(doc(db, "delivery", deliveryId), { status: "free" });
}






/*import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, doc, collection, updateDoc, onSnapshot, query, where } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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
const db = getFirestore();

const deliveryEmailEl = document.getElementById("deliveryEmail");
const signOutBtn = document.getElementById("signOutBtn");
const assignedOrders = document.getElementById("assignedOrders");

let deliveryId;

onAuthStateChanged(auth, user => {
  if(user){
    deliveryEmailEl.textContent = user.email;
    loadDeliveryDetails(user.uid);
  } else { window.location.href = "login.html"; }
});

signOutBtn.addEventListener("click", () => signOut(auth));

function loadDeliveryDetails(uid){
  const deliveryRef = doc(db, "delivery", uid);
  deliveryId = uid;

  onSnapshot(deliveryRef, snap => {
    const data = snap.data();
    document.querySelectorAll('input[name="status"]').forEach(r => r.checked = (r.value === data.status));
  });

  const ordersQuery = query(collection(db, "orders"), where("deliveryId","==",uid));
  onSnapshot(ordersQuery, snap => {
    assignedOrders.innerHTML = "";
    snap.forEach(docu => {
      const order = docu.data();
      const div = document.createElement("div");
      div.className = "orderCard";
      div.innerHTML = `
        <p>Order ID: ${docu.id}</p>
        <p>User: ${order.customerName}</p>
        <p>Food: ${order.item.name}</p>
        <p>Amount: ₹${order.item.price}</p>
        <p>Place: ${order.address}</p>
        <p>Status: ${order.status}</p>
        <button onclick="markDelivered('${docu.id}')">Mark Delivered</button>
      `;
      assignedOrders.appendChild(div);
    });
  });

  document.querySelectorAll('input[name="status"]').forEach(radio => {
    radio.addEventListener("change", async e => {
      await updateDoc(deliveryRef, { status: e.target.value });
    });
  });
}

window.markDelivered = async function(orderId){
  await updateDoc(doc(db, "orders", orderId), { status: "delivered" });
  await updateDoc(doc(db, "delivery", deliveryId), { status: "free" });
}
*/