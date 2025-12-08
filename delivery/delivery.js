// -----------------------------
// Firebase Config (YOUR CONFIG)
// -----------------------------
/*import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
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
*/


/*import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { 
  getAuth, onAuthStateChanged, signOut 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { 
  getFirestore, collection, query, where, onSnapshot, doc, updateDoc, getDocs, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

// UI elements
const deliveryEmail = document.getElementById("deliveryEmail");
const signOutBtn = document.getElementById("signOutBtn");
const newOrdersTbody = document.getElementById("newOrders");
const myOrdersTbody = document.getElementById("myOrders");

let deliveryId = null;

// Auth check
onAuthStateChanged(auth, user => {
  if(!user) {
    window.location.href = "../login.html";
    return;
  }
  deliveryEmail.innerText = user.email;
  getDeliveryId(user.email);
});

// Sign out
signOutBtn.addEventListener("click", () => signOut(auth));

// Get delivery Firestore ID
async function getDeliveryId(email) {
  const snap = await getDocs(collection(db, "delivery"));
  snap.forEach(d => {
    if(d.data().email === email){
      deliveryId = d.id;
      startFCFSListener();
    }
  });
}

// -------------------- FCFS Orders Listener --------------------
function startFCFSListener() {
  const ordersRef = collection(db, "orders");

  onSnapshot(ordersRef, snapshot => {
    newOrdersTbody.innerHTML = "";
    myOrdersTbody.innerHTML = "";

    snapshot.forEach(async docu => {
      const order = docu.data();

      if(order.deliveryId && order.deliveryId !== deliveryId) return;

      // Assigned to this delivery boy
      if(order.deliveryId === deliveryId){
        addMyOrderRow(docu.id, order);
        return;
      }

      // Unassigned order
      if(!order.deliveryId){
        addAvailableOrderRow(docu.id, order);
      }
    });
  });
}

// -------------------- Add row for Available Orders --------------------
function addAvailableOrderRow(orderId, order){
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${orderId}</td>
    <td>${order.customerName}</td>
    <td>${order.item.name}</td>
    <td>₹${order.item.price}</td>
    <td>${order.address}</td>
    <td><button class="acceptBtn">ACCEPT</button></td>
  `;

  newOrdersTbody.appendChild(tr);

  tr.querySelector(".acceptBtn").addEventListener("click", () => {
    acceptOrder(orderId);
  });
}

// -------------------- Add row for My Orders --------------------
function addMyOrderRow(orderId, order){
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${orderId}</td>
    <td>${order.customerName}</td>
    <td>${order.item.name}</td>
    <td>₹${order.item.price}</td>
    <td>${order.status}</td>
    <td><button class="deliverBtn">MARK DELIVERED</button></td>
  `;

  myOrdersTbody.appendChild(tr);

  tr.querySelector(".deliverBtn").addEventListener("click", () => {
    markDelivered(orderId);
  });
}

// -------------------- Accept Order --------------------
async function acceptOrder(orderId){
  try{
    await updateDoc(doc(db,"orders",orderId), {
      deliveryId: deliveryId,
      status: "Accepted by Delivery",
      acceptedTime: serverTimestamp()
    });
    alert("Order Accepted Successfully!");
  }
  catch(err){
    alert("Someone else accepted this order first!");
  }
}

// -------------------- Mark Order Delivered --------------------
async function markDelivered(orderId){
  await updateDoc(doc(db,"orders",orderId), {
    status: "Delivered",
    deliveredTime: serverTimestamp()
  });
  alert("Order marked as Delivered!");
}

*/



// delivery.js - listens to deliveryRequests (pending) and uses a Firestore transaction to claim (FCFS).
// Also listens to orders assigned to this delivery partner (deliveryId == this delivery doc id).

// import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
// import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
// import {
//   getFirestore, collection, query, where, onSnapshot, doc, updateDoc, getDocs, runTransaction, serverTimestamp
// } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// // ---------- Firebase config ----------
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

// // ---------- DOM ----------
// const deliveryEmail = document.getElementById("deliveryEmail");
// const signOutBtn = document.getElementById("signOutBtn");
// const newOrdersTbody = document.getElementById("newOrders");
// const myOrdersTbody = document.getElementById("myOrders");

// let deliveryDocId = null; // document id in delivery collection for this logged-in partner

// onAuthStateChanged(auth, async (user) => {
//   if (!user) {
//     window.location.href = "../login.html";
//     return;
//   }
//   deliveryEmail.innerText = user.email;
//   // find delivery doc by email
//   const dsnap = await getDocs(query(collection(db, "delivery"), where("email", "==", user.email)));
//   if (!dsnap.empty) {
//     deliveryDocId = dsnap.docs[0].id;
//   } else {
//     console.warn("No delivery profile found for:", user.email);
//   }
//   listenDeliveryRequests();
//   listenAssignedOrders();
// });

// if (signOutBtn) signOutBtn.addEventListener("click", () => signOut(auth));

// // ---------- Listen to deliveryRequests (pending) ----------
// function listenDeliveryRequests() {
//   const q = query(collection(db, "deliveryRequests"), where("status", "==", "pending"));
//   onSnapshot(q, snapshot => {
//     newOrdersTbody.innerHTML = "";
//     snapshot.forEach(docu => {
//       const r = docu.data();
//       const id = docu.id;
//       const tr = document.createElement("tr");
//       tr.innerHTML = `
//         <td>${escapeHtml(id)}</td>
//         <td>${escapeHtml(r.customerName || "")}</td>
//         <td>${escapeHtml(r.item?.name || "")}</td>
//         <td>${escapeHtml(r.otp || "—")}</td>
//         <td>₹${Number(r.item?.price || 0)}</td>
//         <td>${escapeHtml(r.address || "")}</td>
//         <td><button class="btn btn-accept" data-req="${id}">Accept</button></td>
//       `;
//       newOrdersTbody.appendChild(tr);
//     });

//     // attach listeners
//     document.querySelectorAll(".btn-accept").forEach(b => {
//       b.addEventListener("click", async (e) => {
//         const reqId = e.target.dataset.req;
//         await tryAcceptDeliveryRequest(reqId);
//       });
//     });
//   }, err => {
//     console.error("deliveryRequests snapshot error:", err);
//   });
// }

// // ---------- FCFS accept using runTransaction ----------
// async function tryAcceptDeliveryRequest(reqId) {
//   if (!deliveryDocId) return alert("Delivery profile not found. Add your delivery profile in Firestore.");
//   const reqRef = doc(db, "deliveryRequests", reqId);
//   try {
//     await runTransaction(db, async (tx) => {
//       const reqSnap = await tx.get(reqRef);
//       if (!reqSnap.exists()) throw "Request not found";
//       const req = reqSnap.data();
//       if (req.status !== "pending") throw "Already taken or expired";

//       // assign request to this delivery partner
//       tx.update(reqRef, {
//         status: "assigned",
//         assignedTo: deliveryDocId,
//          otp: req.otp, 
//         assignedAt: serverTimestamp()
//       });

//       // update the corresponding orders doc atomically
//       const orderRef = doc(db, "orders", req.orderId);
//       tx.update(orderRef, {
//         deliveryId: deliveryDocId,
//         status: "AcceptedByDelivery",
//          otp: req.otp, 
//         deliveryAssignedAt: serverTimestamp()
//       });

//       // optionally set delivery partner status busy
//       const delRef = doc(db, "delivery", deliveryDocId);
//       tx.update(delRef, { status: "busy", lastAssignedAt: serverTimestamp() });
//     });

//     alert("You accepted the delivery. Check My Orders.");
//   } catch (err) {
//     console.error("Accept transaction error:", err);
//     alert("Could not accept. Likely already assigned or expired.");
//   }
// }

// // ---------- Listen to assigned orders where deliveryId == this deliveryDocId ----------
// function listenAssignedOrders() {
//   if (!deliveryDocId) return;
//   const q = query(collection(db, "orders"), where("deliveryId", "==", deliveryDocId));
//   onSnapshot(q, snap => {
//     myOrdersTbody.innerHTML = "";
//     snap.forEach(d => {
//       const o = d.data();
//       const id = d.id;
//       const tr = document.createElement("tr");
//       tr.innerHTML = `
//         <td>${escapeHtml(id)}</td>
//         <td>${escapeHtml(o.customerName || "")}</td>
//         <td>${escapeHtml(o.item?.name || "")}</td>
//         <td>${escapeHtml(o.otp || "—")}</td>
//         <td>₹${Number(o.item?.price || 0)}</td>
//         <td>${escapeHtml(o.status || "")}</td>
//         <td><button class="btn btn-deliver" data-order="${id}">Mark Delivered</button></td>
//       `;
//       myOrdersTbody.appendChild(tr);
//     });

//     // attach mark delivered buttons
//     document.querySelectorAll(".btn-deliver").forEach(b => {
//       b.addEventListener("click", async (e) => {
//         const orderId = e.target.dataset.order;
//         try {
//           await updateDoc(doc(db, "orders", orderId), { status: "Delivered", deliveredAt: serverTimestamp() });
//           // mark delivery partner free
//           if (deliveryDocId) await updateDoc(doc(db, "delivery", deliveryDocId), { status: "free", lastDeliveredAt: serverTimestamp() });
//         } catch (err) {
//           console.error("Mark delivered failed:", err);
//           alert("Failed to mark delivered.");
//         }
//       });
//     });
//   }, err => console.error("assigned orders snapshot error:", err));
// }

// // ---------- helpers ----------
// function escapeHtml(str) {
//   if (typeof str !== "string") return str;
//   return str.replace(/[&<>"'`]/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":"&#39;", "`":"&#96;"}[m]));
// }








import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  getFirestore, collection, query, where, onSnapshot, doc, updateDoc, getDocs, runTransaction, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getMessaging, getToken, onMessage } 
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging.js";

// ---------- Firebase config ----------
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
const messaging = getMessaging(app);

// ---------- DOM ----------
const deliveryEmail = document.getElementById("deliveryEmail");
const signOutBtn = document.getElementById("signOutBtn");
const newOrdersTbody = document.getElementById("newOrders");
const myOrdersTbody = document.getElementById("myOrders");

let deliveryDocId = null;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "../login.html";
    return;
  }
  deliveryEmail.innerText = user.email;

  const dsnap = await getDocs(query(collection(db, "delivery"), where("email", "==", user.email)));
  if (!dsnap.empty) {
    deliveryDocId = dsnap.docs[0].id;
    setupFCMToken(deliveryDocId);

  } else {
    console.warn("No delivery profile found for:", user.email);
  }

  listenDeliveryRequests();
  listenAssignedOrders();
});

if (signOutBtn) signOutBtn.addEventListener("click", () => signOut(auth));

// ---------- Listen to pending deliveryRequests ----------
function listenDeliveryRequests() {
  const q = query(collection(db, "deliveryRequests"), where("status", "==", "pending"));
  onSnapshot(q, snapshot => {
    newOrdersTbody.innerHTML = "";
    snapshot.forEach(docu => {
      const r = docu.data();
      const id = docu.id;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(id)}</td>
        <td>${escapeHtml(r.customerName || "")}</td>
        <td>${escapeHtml(r.item?.name || "")}</td>

        <!-- FIXED ORDER: Amount comes here -->
        <td>₹${Number(r.item?.price || 0)}</td>

        <!-- Address next -->
        <td>${escapeHtml(r.address || "")}</td>

        <!-- OTP last -->
        <td>${escapeHtml(r.otp || "—")}</td>

        <td><button class="btn btn-accept" data-req="${id}">Accept</button></td>
      `;

      newOrdersTbody.appendChild(tr);
    });

    document.querySelectorAll(".btn-accept").forEach(b => {
      b.addEventListener("click", async (e) => {
        const reqId = e.target.dataset.req;
        await tryAcceptDeliveryRequest(reqId);
      });
    });
  }, err => console.error("deliveryRequests snapshot error:", err));
}

// ---------- FCFS accept using runTransaction ----------
async function tryAcceptDeliveryRequest(reqId) {
  if (!deliveryDocId) return alert("Delivery profile not found.");
  const reqRef = doc(db, "deliveryRequests", reqId);

  try {
    await runTransaction(db, async (tx) => {
      const reqSnap = await tx.get(reqRef);
      if (!reqSnap.exists()) throw "Request not found";
      const req = reqSnap.data();

      if (req.status !== "pending") throw "Already taken";

      tx.update(reqRef, {
        status: "assigned",
        assignedTo: deliveryDocId,
        otp: req.otp,
        assignedAt: serverTimestamp()
      });

      const orderRef = doc(db, "orders", req.orderId);
      tx.update(orderRef, {
        deliveryId: deliveryDocId,
        status: "AcceptedByDelivery",
        otp: req.otp,
        deliveryAssignedAt: serverTimestamp()
      });

      const delRef = doc(db, "delivery", deliveryDocId);
      tx.update(delRef, { status: "busy", lastAssignedAt: serverTimestamp() });
    });

    alert("Delivery accepted.");
  } catch (err) {
    console.error("Accept transaction error:", err);
    alert("Could not accept.");
  }
}

// ---------- Listen to assigned orders ----------
function listenAssignedOrders() {
  if (!deliveryDocId) return;

  const q = query(collection(db, "orders"), where("deliveryId", "==", deliveryDocId));
  onSnapshot(q, snap => {
    myOrdersTbody.innerHTML = "";
    snap.forEach(d => {
      const o = d.data();
      const id = d.id;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(id)}</td>
        <td>${escapeHtml(o.customerName || "")}</td>
        <td>${escapeHtml(o.item?.name || "")}</td>

        <!-- FIXED: show amount here -->
        <td>₹${Number(o.item?.price || 0)}</td>

        <!-- status next -->
        <td>${escapeHtml(o.status || "")}</td>

        <!-- OTP last -->
        <td>${escapeHtml(o.otp || "—")}</td>

        <td><button class="btn btn-deliver" data-order="${id}">Mark Delivered</button></td>
      `;

      myOrdersTbody.appendChild(tr);
    });

    document.querySelectorAll(".btn-deliver").forEach(b => {
      b.addEventListener("click", async (e) => {
        const orderId = e.target.dataset.order;
        try {
          await updateDoc(doc(db, "orders", orderId), { status: "Delivered", deliveredAt: serverTimestamp() });
          if (deliveryDocId) await updateDoc(doc(db, "delivery", deliveryDocId), { status: "free", lastDeliveredAt: serverTimestamp() });
        } catch (err) {
          console.error("Mark delivered failed:", err);
          alert("Failed to mark delivered.");
        }
      });
    });
  }, err => console.error("assigned orders snapshot error:", err));
}

// ---------- helpers ----------
function escapeHtml(str) {
  if (typeof str !== "string") return str;
  return str.replace(/[&<>"'`]/g, (m) => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":"&#39;", "`":"&#96;"
  }[m]));
}
// Put this function into delivery.js (replace your old setupFCMToken)
async function setupFCMToken(deliveryId) {
  try {
    // Ask permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission not granted");
      return;
    }

    // Register service worker at site root -- must exist at /firebase-messaging-sw.js
    let swReg;
    try {
      swReg = await navigator.serviceWorker.register("../firebase-messaging-sw.js");

      console.log("ServiceWorker registered:", swReg);
    } catch (swErr) {
      console.error("ServiceWorker registration failed (check path /firebase-messaging-sw.js):", swErr);
      return;
    }

    // Replace with your actual VAPID public key from Firebase Console -> Cloud Messaging -> Web Push certificates
    const VAPID_KEY = "BKKoaBhEiIVQMydxl_C8BxYUX3pklb2_qTanmqlOw6_gWfSixIxNm1Qt-GvjezLhVG0J5887BB4OaZKFoUF7GG0";

    // Request token with serviceWorkerRegistration - safer and required for background notifications
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swReg
    });

    console.log("FCM Token:", token);

    if (!token) {
      console.warn("No token returned — check VAPID key and service worker.");
      return;
    }

    // Save token to Firestore under the delivery doc
    if (deliveryId) {
      await updateDoc(doc(db, "delivery", deliveryId), { fcmToken: token });
      console.log("Token saved to Firestore for delivery:", deliveryId);
    } else {
      console.warn("deliveryId not provided; token not saved.");
    }

  } catch (err) {
    console.error("setupFCMToken error:", err);
  }
}
