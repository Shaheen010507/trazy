/*import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, onSnapshot, doc, getDocs, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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

const ownerEmailEl = document.getElementById("ownerEmail");
const signOutBtn = document.getElementById("signOutBtn");
const itemForm = document.getElementById("itemForm");
const itemName = document.getElementById("itemName");
const itemPrice = document.getElementById("itemPrice");
const itemAvailable = document.getElementById("itemAvailable");
const editItemId = document.getElementById("editItemId");
const itemsTbody = document.getElementById("itemsTbody");
const ordersContainer = document.getElementById("ordersContainer");

let ownerId, shopId;

onAuthStateChanged(auth, user=>{
  if(user){
    ownerEmailEl.textContent = user.email;
    loadOwnerDetails(user.uid);
  } else window.location.href="../login.html";
});

signOutBtn.addEventListener("click", ()=> signOut(auth));

async function loadOwnerDetails(uid){
  ownerId = uid;
  const ownersCol = collection(db,"owners");
  const ownersSnap = await getDocs(ownersCol);
  ownersSnap.forEach(docu=>{
    if(docu.data().email === auth.currentUser.email){
      shopId = docu.id;
      loadItems(shopId);
      loadOrders(shopId);
    }
  });
}

// Items
itemForm.addEventListener("submit", async e=>{
  e.preventDefault();
  if(editItemId.value){
    await updateDoc(doc(db,"shops",shopId,"items",editItemId.value),{
      name:itemName.value,
      price:parseFloat(itemPrice.value),
      available:itemAvailable.checked
    });
  } else {
    await addDoc(collection(db,"shops",shopId,"items"),{
      name:itemName.value,
      price:parseFloat(itemPrice.value),
      available:itemAvailable.checked,
      createdAt:serverTimestamp()
    });
  }
  itemForm.reset();
  editItemId.value="";
});

function loadItems(shopId){
  const itemsCol = collection(db,"shops",shopId,"items");
  onSnapshot(itemsCol, snapshot=>{
    itemsTbody.innerHTML="";
    snapshot.forEach(docu=>{
      const data = docu.data();
      const tr = document.createElement("tr");
      tr.innerHTML=`<td>${data.name}</td><td>${data.price}</td><td>${data.available?"Yes":"No"}</td>
      <td><button onclick="editItem('${docu.id}','${data.name}',${data.price},${data.available})">Edit</button>
      <button onclick="deleteItem('${docu.id}')">Delete</button></td>`;
      itemsTbody.appendChild(tr);
    });
  });
}

window.editItem=(id,name,price,available)=>{
  editItemId.value=id;
  itemName.value=name;
  itemPrice.value=price;
  itemAvailable.checked=available;
};
window.deleteItem=async id=> await deleteDoc(doc(db,"shops",shopId,"items",id));

// Orders FCFS
async function loadOrders(shopId){
  const ordersCol = collection(db,"orders");
  onSnapshot(ordersCol, async snapshot=>{
    ordersContainer.innerHTML="";
    for(const docu of snapshot.docs){
      const order = docu.data();
      if(order.shopId!==shopId) continue;
      let deliveryName = "Not Assigned";
      if(order.deliveryId){
        const deliverySnap = await getDocs(query(collection(db,"delivery"), where("__name__","==",order.deliveryId)));
        if(!deliverySnap.empty) deliveryName = deliverySnap.docs[0].data().fullname;
      }
      const div = document.createElement("div");
      div.innerHTML=`
        <p><strong>Order ID:</strong> ${docu.id}</p>
        <p>User: ${order.customerName}</p>
        <p>Food: ${order.item.name}</p>
        <p>Amount: ₹${order.item.price}</p>
        <p>Place: ${order.address}</p>
        <p>Status: ${order.status}</p>
        <p>Delivery: ${deliveryName}</p>`;
      ordersContainer.appendChild(div);
    }
  });
}
*/



/*import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { 
  getFirestore, collection, addDoc, updateDoc, deleteDoc, onSnapshot, doc, getDocs, query, where, serverTimestamp 
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// DOM elements
const ownerEmailEl = document.getElementById("ownerEmail");
const signOutBtn = document.getElementById("signOutBtn");
const itemForm = document.getElementById("itemForm");
const itemName = document.getElementById("itemName");
const itemPrice = document.getElementById("itemPrice");
const itemAvailable = document.getElementById("itemAvailable");
const editItemId = document.getElementById("editItemId");
const itemsTbody = document.getElementById("itemsTbody");
const comingOrdersTbody = document.getElementById("comingOrdersTbody");

let ownerId, shopId;

// Auth listener
onAuthStateChanged(auth, user => {
  if(user){
    ownerEmailEl.textContent = user.email;
    loadOwnerDetails(user.uid);
  } else window.location.href="../login.html";
});

// Sign out
signOutBtn.addEventListener("click", () => signOut(auth));

// Load owner/shop info
async function loadOwnerDetails(uid){
  ownerId = uid;
  const ownersCol = collection(db,"owners");
  const ownersSnap = await getDocs(ownersCol);
  ownersSnap.forEach(docu => {
    if(docu.data().email === auth.currentUser.email){
      shopId = docu.id;
      loadItems(shopId);
      loadOrders(shopId);
    }
  });
}

// ---------------- ITEMS ----------------

// Add / edit item
itemForm.addEventListener("submit", async e => {
  e.preventDefault();
  if(editItemId.value){
    await updateDoc(doc(db,"shops",shopId,"items",editItemId.value), {
      name: itemName.value,
      price: parseFloat(itemPrice.value),
      available: itemAvailable.checked
    });
  } else {
    await addDoc(collection(db,"shops",shopId,"items"), {
      name: itemName.value,
      price: parseFloat(itemPrice.value),
      available: itemAvailable.checked,
      createdAt: serverTimestamp()
    });
  }
  itemForm.reset();
  editItemId.value="";
});

// Load items
function loadItems(shopId){
  const itemsCol = collection(db,"shops",shopId,"items");
  onSnapshot(itemsCol, snapshot => {
    itemsTbody.innerHTML = "";
    snapshot.forEach(docu => {
      const data = docu.data();
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${data.name}</td>
        <td>₹${data.price.toFixed(2)}</td>
        <td>${data.available ? "Yes" : "No"}</td>
        <td>
          <button onclick="editItem('${docu.id}','${data.name}',${data.price},${data.available})">Edit</button>
          <button onclick="deleteItem('${docu.id}')">Delete</button>
        </td>
      `;
      itemsTbody.appendChild(tr);
    });
  });
}

window.editItem = (id,name,price,available) => {
  editItemId.value = id;
  itemName.value = name;
  itemPrice.value = price;
  itemAvailable.checked = available;
};

window.deleteItem = async id => await deleteDoc(doc(db,"shops",shopId,"items",id));

// ---------------- ORDERS ----------------

async function loadOrders(shopId){
  const ordersCol = collection(db,"orders");

  onSnapshot(ordersCol, async snapshot => {
    comingOrdersTbody.innerHTML = ""; // clear previous table rows

    for(const docu of snapshot.docs){
      const order = docu.data();
      if(order.shopId !== shopId) continue;

      // Get delivery name if assigned
      let deliveryName = "Not Assigned";
      if(order.deliveryId){
        const deliverySnap = await getDocs(
          query(collection(db,"delivery"), where("__name__","==",order.deliveryId))
        );
        if(!deliverySnap.empty) deliveryName = deliverySnap.docs[0].data().fullname;
      }

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${docu.id}</td>
        <td>${order.customerName}</td>
        <td>${order.item.name}</td>
        <td>₹${order.item.price.toFixed(2)}</td>
        <td>${order.address}</td>
        <td><span class="status ${order.status.toLowerCase()}">${order.status}</span></td>
        <td>${deliveryName}</td>
      `;
      comingOrdersTbody.appendChild(tr);
    }
  });
}*/


// owner.js - Updated with Accept/Reject, broadcast to deliveryRequests, owner auto-reject (5 min),
// and delivery-request expiry (5 min) fallback.
//
// NOTE: This is client-side logic. For fully-reliable timeouts even if browser closed,
// use Cloud Functions. This code implements robust client-side checks and immediate aging checks.

// import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
// import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
// import {
//   getFirestore, collection, addDoc, updateDoc, deleteDoc, onSnapshot, doc, getDoc, getDocs, query, where, serverTimestamp
// } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
// // ---- NOTIFICATION SENDER (CALLS YOUR NODE SERVER) ----
// async function sendNotificationToAllDeliveryBoys(orderId, itemName) {
//   try {
//     // Get all delivery guys from Firestore
//     const snap = await getDocs(collection(db, "delivery"));
//     const tokens = [];

//     snap.forEach(doc => {
//       const data = doc.data();
//       if (data.fcmToken) tokens.push(data.fcmToken);
//     });

//     if (tokens.length === 0) {
//       console.warn("No delivery tokens found.");
//       return;
//     }

//     // Send notification to each delivery boy
//     for (const token of tokens) {
//       await fetch("http://127.0.0.1:3000/sendNotification", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({
//     tokens: tokens,  // must be ARRAY
//     title: "New Order Available",
//     body: `A new order is waiting: ${itemName}`,
//     orderId: orderId
//   })
// });
//     }

//     console.log("Notifications sent to all delivery boys.");
//   } catch (err) {
//     console.error("Error sending notifications:", err);
//   }
// }

// // ---------- Firebase config (same as other files) ----------
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
// const ownerEmailEl = document.getElementById("ownerEmail");
// const signOutBtn = document.getElementById("signOutBtn");
// const itemForm = document.getElementById("itemForm");
// const itemName = document.getElementById("itemName");
// const itemPrice = document.getElementById("itemPrice");
// const itemAvailable = document.getElementById("itemAvailable");
// const editItemId = document.getElementById("editItemId");
// const itemsTbody = document.getElementById("itemsTbody");
// const comingOrdersTbody = document.getElementById("comingOrdersTbody");

// let ownerId = null;
// let shopId = null;

// // TIMEOUTS
// const OWNER_RESPONSE_TIMEOUT_MS = 5 * 60 * 1000;       // 5 minutes owner auto-reject
// const DELIVERY_RESPONSE_TIMEOUT_MS = 5 * 60 * 1000;    // 5 minutes for deliveries to accept

// // Keep track of timers to avoid multiple timers for same order
// const ownerTimers = new Map();
// const deliveryRequestTimers = new Map();

// // ---------- Auth listener ----------
// onAuthStateChanged(auth, user => {
//   if (!user) {
//     window.location.href = "../login.html";
//     return;
//   }
//   ownerEmailEl.textContent = user.email;
//   loadOwnerDetails(user.uid);
// });

// // Sign out
// if (signOutBtn) signOutBtn.addEventListener("click", () => signOut(auth));

// // ---------- Load owner/shop ----------
// async function loadOwnerDetails(uid) {
//   ownerId = uid;
//   const ownersSnap = await getDocs(collection(db, "owners"));
//   ownersSnap.forEach(d => {
//     if (d.data().email === auth.currentUser.email) {
//       shopId = d.id;
//       loadItems(shopId);
//       listenOrders(shopId);
//     }
//   });
// }

// // ---------- Items CRUD (unchanged) ----------
// itemForm.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   if (!shopId) return alert("Shop not ready.");

//   if (editItemId.value) {
//     await updateDoc(doc(db, "shops", shopId, "items", editItemId.value), {
//       name: itemName.value,
//       price: parseFloat(itemPrice.value),
//       available: itemAvailable.checked
//     });
//   } else {
//     await addDoc(collection(db, "shops", shopId, "items"), {
//       name: itemName.value,
//       price: parseFloat(itemPrice.value),
//       available: itemAvailable.checked,
//       createdAt: serverTimestamp()
//     });
//   }

//   itemForm.reset();
//   editItemId.value = "";
// });

// function loadItems(shopIdParam) {
//   onSnapshot(collection(db, "shops", shopIdParam, "items"), snapshot => {
//     itemsTbody.innerHTML = "";
//     snapshot.forEach(d => {
//       const data = d.data();
//       const tr = document.createElement("tr");
//       tr.innerHTML = `
//         <td>${escapeHtml(data.name)}</td>
//         <td>₹${Number(data.price || 0).toFixed(2)}</td>
//         <td>${data.available ? "Yes" : "No"}</td>
//         <td>
//           <button onclick="editItem('${d.id}','${escapeJs(data.name)}',${data.price},${!!data.available})">Edit</button>
//           <button onclick="deleteItem('${d.id}')">Delete</button>
//         </td>
//       `;
//       itemsTbody.appendChild(tr);
//     });
//   });
// }

// window.editItem = (id, name, price, available) => {
//   editItemId.value = id;
//   itemName.value = name;
//   itemPrice.value = price;
//   itemAvailable.checked = available;
// };

// window.deleteItem = async (id) => {
//   await deleteDoc(doc(db, "shops", shopId, "items", id));
// };

// // ---------- Orders listener (owner view) ----------
// function listenOrders(shopIdParam) {
//   // listen to all orders for this shop
//   onSnapshot(collection(db, "orders"), async (snap) => {
//     comingOrdersTbody.innerHTML = "";
//     for (const d of snap.docs) {
//       const order = d.data();
//       const orderId = d.id;

//       if (order.shopId !== shopIdParam) continue;

//       // If order is pending (no status or 'Pending'), enforce owner auto-reject if old
//       const status = (order.status || "Pending").toString();

//       // immediate age-check: if createdAt older than OWNER_RESPONSE_TIMEOUT_MS and still pending, mark auto-rejected
//       if ((status.toLowerCase() === "pending" || status.toLowerCase() === "pendingowner") && order.createdAt) {
//         const created = order.createdAt.toDate();
//         const age = Date.now() - created.getTime();
//         if (age >= OWNER_RESPONSE_TIMEOUT_MS) {
//           try {
//             await updateDoc(doc(db, "orders", orderId), {
//               status: "OwnerAutoRejected",
//               ownerAction: "auto_reject",
//               ownerActionAt: serverTimestamp()
//             });
//             continue; // skip showing this order (status changed)
//           } catch (err) {
//             console.warn("Auto reject attempt failed:", err);
//           }
//         } else {
//           // schedule a timer only if not scheduled
//           if (!ownerTimers.has(orderId)) {
//             const remaining = OWNER_RESPONSE_TIMEOUT_MS - age;
//             const t = setTimeout(async () => {
//               try {
//                 // double-check current status
//                 const snapNow = await getDoc(doc(db, "orders", orderId));
//                 const curr = snapNow.exists() ? snapNow.data() : null;
//                 if (curr && (!curr.status || curr.status.toLowerCase() === "pending" || curr.status.toLowerCase() === "pendingowner")) {
//                   await updateDoc(doc(db, "orders", orderId), {
//                     status: "OwnerAutoRejected",
//                     ownerAction: "auto_reject",
//                     ownerActionAt: serverTimestamp()
//                   });
//                 }
//               } catch (e) { console.warn("Owner auto-reject timer failed:", e); }
//               ownerTimers.delete(orderId);
//             }, remaining);
//             ownerTimers.set(orderId, t);
//           }
//         }
//       }

//       // prepare delivery name
//       let deliveryName = "Not Assigned";
//       if (order.deliveryId) {
//         try {
//           const ds = await getDocs(query(collection(db, "delivery"), where("__name__", "==", order.deliveryId)));
//           if (!ds.empty) deliveryName = ds.docs[0].data().fullname || deliveryName;
//         } catch (e) { console.warn(e); }
//       }

//       // Build row
//       const tr = document.createElement("tr");
//       const statusLabel = escapeHtml(status);
//       let actionHtml = "";
//       const sLower = status.toLowerCase();

//       // Show Accept/Reject only if owner action pending
//       if (sLower === "pending" || sLower === "pendingowner") {
//         actionHtml = `
//           <button class="btn btn-accept owner-accept" data-id="${orderId}">Accept</button>
//           <button class="btn btn-reject owner-reject" data-id="${orderId}">Reject</button>
//         `;
//       } else {
//         actionHtml = `<small>${statusLabel}</small>`;
//       }

//       tr.innerHTML = `
//         <td>${escapeHtml(orderId)}</td>
//         <td>${escapeHtml(order.customerName || "")}</td>
//         <td>${escapeHtml(order.item?.name || "")}</td>
//         <td>₹${Number(order.item?.price || 0).toFixed(2)}</td>
//         <td>${escapeHtml(order.otp || "—")}</td>
//         <td>${escapeHtml(order.address || "")}</td>
//         <td><span class="badge status-${sLower}">${statusLabel}</span></td>
//         <td>${escapeHtml(deliveryName)}</td>
//         <td>${actionHtml}</td>
//       `;

//       comingOrdersTbody.appendChild(tr);
//     }

//     // attach listeners (delegate style or re-bind)
//     document.querySelectorAll(".owner-accept").forEach(btn => {
//       btn.onclick = async (e) => {
//         const id = btn.dataset.id;
//         await ownerAcceptOrder(id);
//       };
//     });
//     document.querySelectorAll(".owner-reject").forEach(btn => {
//       btn.onclick = async (e) => {
//         const id = btn.dataset.id;
//         await ownerRejectOrder(id);
//       };
//     });
//   });
// }

// // ---------- Owner Accept ----------
// async function ownerAcceptOrder(orderId) {
//   try {
//     // update order status
//     await updateDoc(doc(db, "orders", orderId), {
//       status: "OwnerAccepted",
//       ownerAccepted: true,
//       ownerAcceptedAt: serverTimestamp()
//     });

//     // cancel owner auto-reject timer if present
//     if (ownerTimers.has(orderId)) {
//       clearTimeout(ownerTimers.get(orderId));
//       ownerTimers.delete(orderId);
//     }

//     // read latest order data
//     const orderSnap = await getDoc(doc(db, "orders", orderId));
//     if (!orderSnap.exists()) {
//       alert("Order not found");
//       return;
//     }
//     const orderData = orderSnap.data();

//     // create a deliveryRequests doc to broadcast to delivery partners
//     const reqRef = await addDoc(collection(db, "deliveryRequests"), {
//       orderId,
//       shopId,
//       item: orderData.item || {},
//       customerName: orderData.customerName || "",
//       customerPhone: orderData.customerPhone || "",
//       address: orderData.address || "",
//       otp: orderData.otp,
//       status: "pending",
//       createdAt: serverTimestamp()
//     });

//     // schedule a fallback timer: if deliveryRequests still pending after DELIVERY_RESPONSE_TIMEOUT_MS => mark order DeliveryNotAvailable
//     if (!deliveryRequestTimers.has(reqRef.id)) {
//       const t = setTimeout(async () => {
//         try {
//           // fetch request
//           const rSnap = await getDoc(doc(db, "deliveryRequests", reqRef.id));
//           const r = rSnap.exists() ? rSnap.data() : null;
//           if (r && r.status === "pending") {
//             // update request and original order
//             await updateDoc(doc(db, "deliveryRequests", reqRef.id), {
//               status: "no_delivery",
//               updatedAt: serverTimestamp()
//             });
//             await updateDoc(doc(db, "orders", orderId), {
//               status: "DeliveryNotAvailable",
//               deliveryRequestId: reqRef.id,
//               deliveryRequestFailedAt: serverTimestamp()
//             });
//           }
//         } catch (e) { console.warn("deliveryRequest fallback failed:", e); }
//         deliveryRequestTimers.delete(reqRef.id);
//       }, DELIVERY_RESPONSE_TIMEOUT_MS);
//       deliveryRequestTimers.set(reqRef.id, t);
//     }
//     await sendNotificationToAllDeliveryBoys(orderId, orderData.item.name);

//     alert("Order accepted and broadcasted to delivery partners.");
//   } catch (err) {
//     console.error("Accept failed:", err);
//     alert("Failed to accept order; see console.");
//   }
// }

// // ---------- Owner Reject ----------
// async function ownerRejectOrder(orderId) {
//   try {
//     // cancel owner timer
//     if (ownerTimers.has(orderId)) {
//       clearTimeout(ownerTimers.get(orderId));
//       ownerTimers.delete(orderId);
//     }

//     await updateDoc(doc(db, "orders", orderId), {
//       status: "RejectedByOwner",
//       ownerAction: "rejected",
//       ownerActionAt: serverTimestamp()
//     });
//     alert("Order rejected.");
//   } catch (err) {
//     console.error("Reject failed:", err);
//     alert("Failed to reject order; see console.");
//   }
// }

// // ---------- helpers ----------
// function escapeHtml(str) {
//   if (typeof str !== "string") return str;
//   return str.replace(/[&<>"'`]/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;", "`":"&#96;"}[m]));
// }
// function escapeJs(s) {
//   if (typeof s !== "string") return s;
//   return s.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/"/g, '\\"');
// }




import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  getFirestore, collection, addDoc, updateDoc, deleteDoc,
  onSnapshot, doc, getDoc, getDocs, query, where, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/*  
=========================================================
   FIXED NOTIFICATION FUNCTION (MAIN ERROR SOLVED)
=========================================================
*/
async function sendNotificationToAllDeliveryBoys(orderId, itemName) {
  try {
    // read all delivery men
    const snap = await getDocs(collection(db, "delivery"));
    const tokens = [];

    snap.forEach(d => {
      const data = d.data();
      if (data.fcmToken) tokens.push(data.fcmToken);
    });

    if (tokens.length === 0) {
      console.warn("No delivery tokens found.");
      return;
    }

    // --- FIXED PART ---
    // send ALL tokens in ONE request (not inside a loop)
    await fetch("http://127.0.0.1:3000/sendNotification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tokens: tokens,   // <--- must be ARRAY
        title: "New Order Available",
        body: `New order: ${itemName}`,
        orderId: orderId
      })
    });

    console.log("Notifications sent to all delivery boys.");
  } catch (err) {
    console.error("Error sending notifications:", err);
  }
}

/*  
=========================================================
   FIREBASE INITIALIZATION
=========================================================
*/
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

/*  
=========================================================
   DOM ELEMENTS
=========================================================
*/
const ownerEmailEl = document.getElementById("ownerEmail");
const signOutBtn = document.getElementById("signOutBtn");
const itemForm = document.getElementById("itemForm");
const itemName = document.getElementById("itemName");
const itemPrice = document.getElementById("itemPrice");
const itemAvailable = document.getElementById("itemAvailable");
const editItemId = document.getElementById("editItemId");
const itemsTbody = document.getElementById("itemsTbody");
const comingOrdersTbody = document.getElementById("comingOrdersTbody");

let ownerId = null;
let shopId = null;

// timeouts
const OWNER_RESPONSE_TIMEOUT_MS = 5 * 60 * 1000;
const DELIVERY_RESPONSE_TIMEOUT_MS = 5 * 60 * 1000;

const ownerTimers = new Map();
const deliveryRequestTimers = new Map();

/*  
=========================================================
   AUTH LISTENER
=========================================================
*/
onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "../login.html";
    return;
  }
  ownerEmailEl.textContent = user.email;
  loadOwnerDetails(user.uid);
});

if (signOutBtn) signOutBtn.addEventListener("click", () => signOut(auth));

/*  
=========================================================
   LOAD OWNER & SHOP DETAILS
=========================================================
*/
async function loadOwnerDetails(uid) {
  ownerId = uid;
  const ownersSnap = await getDocs(collection(db, "owners"));
  ownersSnap.forEach(d => {
    if (d.data().email === auth.currentUser.email) {
      shopId = d.id;
      loadItems(shopId);
      listenOrders(shopId);
    }
  });
}

/*  
=========================================================
   ITEMS CRUD
=========================================================
*/
itemForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!shopId) return alert("Shop not ready.");

  if (editItemId.value) {
    await updateDoc(doc(db, "shops", shopId, "items", editItemId.value), {
      name: itemName.value,
      price: parseFloat(itemPrice.value),
      available: itemAvailable.checked
    });
  } else {
    await addDoc(collection(db, "shops", shopId, "items"), {
      name: itemName.value,
      price: parseFloat(itemPrice.value),
      available: itemAvailable.checked,
      createdAt: serverTimestamp()
    });
  }

  itemForm.reset();
  editItemId.value = "";
});

function loadItems(shopIdParam) {
  onSnapshot(collection(db, "shops", shopIdParam, "items"), snapshot => {
    itemsTbody.innerHTML = "";
    snapshot.forEach(d => {
      const data = d.data();
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(data.name)}</td>
        <td>₹${Number(data.price || 0).toFixed(2)}</td>
        <td>${data.available ? "Yes" : "No"}</td>
        <td>
          <button onclick="editItem('${d.id}','${escapeJs(data.name)}',${data.price},${!!data.available})">Edit</button>
          <button onclick="deleteItem('${d.id}')">Delete</button>
        </td>
      `;
      itemsTbody.appendChild(tr);
    });
  });
}

window.editItem = (id, name, price, available) => {
  editItemId.value = id;
  itemName.value = name;
  itemPrice.value = price;
  itemAvailable.checked = available;
};

window.deleteItem = async (id) => {
  await deleteDoc(doc(db, "shops", shopId, "items", id));
};

/*  
=========================================================
   ORDER LISTENER (UNCHANGED)
=========================================================
*/
function listenOrders(shopIdParam) {

  onSnapshot(collection(db, "orders"), async (snap) => {
    comingOrdersTbody.innerHTML = "";

    for (const d of snap.docs) {
      const order = d.data();
      const orderId = d.id;

      if (order.shopId !== shopIdParam) continue;

      const status = (order.status || "Pending").toString();

      // owner timeout
      if ((status.toLowerCase() === "pending" || status.toLowerCase() === "pendingowner") && order.createdAt) {
        const created = order.createdAt.toDate();
        const age = Date.now() - created.getTime();

        if (age >= OWNER_RESPONSE_TIMEOUT_MS) {
          try {
            await updateDoc(doc(db, "orders", orderId), {
              status: "OwnerAutoRejected",
              ownerAction: "auto_reject",
              ownerActionAt: serverTimestamp()
            });
            continue;
          } catch (err) { console.warn(err); }
        } else if (!ownerTimers.has(orderId)) {
          const remaining = OWNER_RESPONSE_TIMEOUT_MS - age;

          const t = setTimeout(async () => {
            try {
              const snapNow = await getDoc(doc(db, "orders", orderId));
              const curr = snapNow.exists() ? snapNow.data() : null;
              if (curr && (!curr.status || curr.status.toLowerCase() === "pending" || curr.status.toLowerCase() === "pendingowner")) {
                await updateDoc(doc(db, "orders", orderId), {
                  status: "OwnerAutoRejected",
                  ownerAction: "auto_reject",
                  ownerActionAt: serverTimestamp()
                });
              }
            } catch (e) {}
            ownerTimers.delete(orderId);
          }, remaining);

          ownerTimers.set(orderId, t);
        }
      }

      // delivery partner name
      let deliveryName = "Not Assigned";
      if (order.deliveryId) {
        try {
          const ds = await getDocs(query(collection(db, "delivery"), where("__name__", "==", order.deliveryId)));
          if (!ds.empty) deliveryName = ds.docs[0].data().fullname || deliveryName;
        } catch {}
      }

      const tr = document.createElement("tr");
      const sLower = status.toLowerCase();

      let actionHtml = "";
      if (sLower === "pending" || sLower === "pendingowner") {
        actionHtml = `
          <button class="btn btn-accept owner-accept" data-id="${orderId}">Accept</button>
          <button class="btn btn-reject owner-reject" data-id="${orderId}">Reject</button>
        `;
      } else {
        actionHtml = `<small>${status}</small>`;
      }

      tr.innerHTML = `
        <td>${escapeHtml(orderId)}</td>
        <td>${escapeHtml(order.customerName || "")}</td>
        <td>${escapeHtml(order.item?.name || "")}</td>
        <td>₹${Number(order.item?.price || 0).toFixed(2)}</td>
        <td>${escapeHtml(order.otp || "—")}</td>
        <td>${escapeHtml(order.address || "")}</td>
        <td>${status}</td>
        <td>${escapeHtml(deliveryName)}</td>
        <td>${actionHtml}</td>
      `;

      comingOrdersTbody.appendChild(tr);
    }

    // accept
    document.querySelectorAll(".owner-accept").forEach(btn => {
      btn.onclick = async () => {
        await ownerAcceptOrder(btn.dataset.id);
      };
    });

    // reject
    document.querySelectorAll(".owner-reject").forEach(btn => {
      btn.onclick = async () => {
        await ownerRejectOrder(btn.dataset.id);
      };
    });
  });
}

/*  
=========================================================
   OWNER ACCEPT ORDER (UNCHANGED)
=========================================================
*/
async function ownerAcceptOrder(orderId) {
  try {
    await updateDoc(doc(db, "orders", orderId), {
      status: "OwnerAccepted",
      ownerAccepted: true,
      ownerAcceptedAt: serverTimestamp()
    });

    if (ownerTimers.has(orderId)) {
      clearTimeout(ownerTimers.get(orderId));
      ownerTimers.delete(orderId);
    }

    const orderSnap = await getDoc(doc(db, "orders", orderId));
    if (!orderSnap.exists()) {
      alert("Order not found");
      return;
    }

    const orderData = orderSnap.data();

    const reqRef = await addDoc(collection(db, "deliveryRequests"), {
      orderId,
      shopId,
      item: orderData.item || {},
      customerName: orderData.customerName || "",
      customerPhone: orderData.customerPhone || "",
      address: orderData.address || "",
      otp: orderData.otp,
      status: "pending",
      createdAt: serverTimestamp()
    });

    if (!deliveryRequestTimers.has(reqRef.id)) {
      const t = setTimeout(async () => {
        try {
          const rSnap = await getDoc(doc(db, "deliveryRequests", reqRef.id));
          const r = rSnap.exists() ? rSnap.data() : null;
          if (r && r.status === "pending") {
            await updateDoc(doc(db, "deliveryRequests", reqRef.id), {
              status: "no_delivery",
              updatedAt: serverTimestamp()
            });
            await updateDoc(doc(db, "orders", orderId), {
              status: "DeliveryNotAvailable",
              deliveryRequestId: reqRef.id,
              deliveryRequestFailedAt: serverTimestamp()
            });
          }
        } catch (e) {}
        deliveryRequestTimers.delete(reqRef.id);
      }, DELIVERY_RESPONSE_TIMEOUT_MS);

      deliveryRequestTimers.set(reqRef.id, t);
    }

    await sendNotificationToAllDeliveryBoys(orderId, orderData.item.name);

    alert("Order accepted and sent to delivery.");
  } catch (err) {
    console.error("Accept failed:", err);
    alert("Failed to accept order; see console.");
  }
}

/*  
=========================================================
   OWNER REJECT ORDER
=========================================================
*/
async function ownerRejectOrder(orderId) {
  try {
    if (ownerTimers.has(orderId)) {
      clearTimeout(ownerTimers.get(orderId));
      ownerTimers.delete(orderId);
    }

    await updateDoc(doc(db, "orders", orderId), {
      status: "RejectedByOwner",
      ownerAction: "rejected",
      ownerActionAt: serverTimestamp()
    });

    alert("Order rejected.");
  } catch (err) {
    console.error("Reject failed:", err);
    alert("Failed to reject order; see console.");
  }
}

/*  
=========================================================
   HELPERS
=========================================================
*/
function escapeHtml(str) {
  if (typeof str !== "string") return str;
  return str.replace(/[&<>"'`]/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;',
    "'": '&#39;', '`': '&#96;'
  }[m]));
}

function escapeJs(s) {
  if (typeof s !== "string") return s;
  return s.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/"/g, '\\"');
}
