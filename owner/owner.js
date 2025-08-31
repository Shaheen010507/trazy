/*import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, serverTimestamp,
  collection, addDoc, onSnapshot, updateDoc, deleteDoc
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const shopTitle = document.getElementById("shopTitle");
const ownerEmailEl = document.getElementById("ownerEmail");
const signOutBtn = document.getElementById("signOutBtn");
const itemForm = document.getElementById("itemForm");
const itemsTbody = document.getElementById("itemsTbody");

let CURRENT_UID = null;
let ITEMS_REF = null;

// Helper to escape HTML
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// Auth & Role Check
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Please log in as an owner.");
    window.location.href = "../login.html";
    return;
  }

  CURRENT_UID = user.uid;
  ownerEmailEl.textContent = user.email || "";

  // Verify owner role
  const ownerDoc = await getDoc(doc(db, "owners", CURRENT_UID));
  if (!ownerDoc.exists()) {
    alert("Access denied: not an owner account.");
    await signOut(auth);
    window.location.href = "../login.html";
    return;
  }

  // Ensure shop document exists
  const shopRef = doc(db, "shops", CURRENT_UID);
  const shopSnap = await getDoc(shopRef);
  if (!shopSnap.exists()) {
    await setDoc(shopRef, {
      shopname: ownerDoc.data().shopname || "Your Shop",
      ownerName: ownerDoc.data().fullname || "",
      email: user.email || "",
      createdAt: serverTimestamp()
    }, { merge: true });
  }

  // Set shop title
  const shopData = (await getDoc(shopRef)).data();
  shopTitle.textContent = shopData?.shopname || "Your Shop";

  // Items reference
  ITEMS_REF = collection(db, "shops", CURRENT_UID, "items");

  // Live snapshot of items
  onSnapshot(ITEMS_REF, (snap) => {
    itemsTbody.innerHTML = "";
    snap.forEach(d => {
      const it = d.data();
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(it.name)}</td>
        <td>₹ ${Number(it.price || 0).toFixed(2)}</td>
        <td>${it.available ? "Yes" : "No"}</td>
        <td class="actions">
          <button class="btn ghost" data-edit="${d.id}">Edit</button>
          <button class="btn ghost" data-del="${d.id}">Delete</button>
        </td>
      `;
      itemsTbody.appendChild(tr);
    });
  });
});

// Add / Update item
itemForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!ITEMS_REF) return;

  const name = document.getElementById("itemName").value.trim();
  const price = parseFloat(document.getElementById("itemPrice").value);
  const available = document.getElementById("itemAvailable").checked;
  const editId = document.getElementById("editItemId").value;

  if (!name || isNaN(price)) {
    alert("Please enter a valid name and price.");
    return;
  }

  try {
    if (editId) {
      await updateDoc(doc(ITEMS_REF, editId), { name, price, available });
      document.getElementById("saveBtn").textContent = "Save Item";
    } else {
      await addDoc(ITEMS_REF, { name, price, available, createdAt: serverTimestamp() });
    }
    itemForm.reset();
    document.getElementById("itemAvailable").checked = true;
    document.getElementById("editItemId").value = "";
  } catch (err) {
    console.error(err);
    alert("Error saving item: " + err.message);
  }
});

// Edit/Delete buttons
itemsTbody.addEventListener("click", async (e) => {
  const editId = e.target.getAttribute("data-edit");
  const delId = e.target.getAttribute("data-del");

  if (editId) {
    const snap = await getDoc(doc(ITEMS_REF, editId));
    if (snap.exists()) {
      const it = snap.data();
      document.getElementById("itemName").value = it.name || "";
      document.getElementById("itemPrice").value = it.price || 0;
      document.getElementById("itemAvailable").checked = !!it.available;
      document.getElementById("editItemId").value = editId;
      document.getElementById("saveBtn").textContent = "Update Item";
    }
  }

  if (delId) {
    if (confirm("Delete this item?")) {
      try { await deleteDoc(doc(ITEMS_REF, delId)); }
      catch (err) { alert("Error deleting: " + err.message); }
    }
  }
});

// Sign out
signOutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "../login.html";
});
*/
/*import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, serverTimestamp,
  collection, addDoc, onSnapshot, updateDoc, deleteDoc
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const shopTitle = document.getElementById("shopTitle");
const ownerEmailEl = document.getElementById("ownerEmail");
const signOutBtn = document.getElementById("signOutBtn");
const itemForm = document.getElementById("itemForm");
const itemsTbody = document.getElementById("itemsTbody");
const ordersContainer = document.getElementById("ordersContainer");

let CURRENT_UID = null;
let ITEMS_REF = null;

// Escape HTML
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

// Auth check
onAuthStateChanged(auth, async (user) => {
  if (!user) { window.location.href = "../login.html"; return; }
  CURRENT_UID = user.uid;
  ownerEmailEl.textContent = user.email || "";

  const ownerDoc = await getDoc(doc(db, "owners", CURRENT_UID));
  if (!ownerDoc.exists()) { await signOut(auth); window.location.href = "../login.html"; return; }

  // Ensure shop doc
  const shopRef = doc(db, "shops", CURRENT_UID);
  if (!(await getDoc(shopRef)).exists()) {
    await setDoc(shopRef, { shopname: ownerDoc.data().shopname || "Your Shop", createdAt: serverTimestamp() });
  }
  shopTitle.textContent = (await getDoc(shopRef)).data().shopname;

  ITEMS_REF = collection(db, "shops", CURRENT_UID, "items");

  // Live items
  onSnapshot(ITEMS_REF, snap => {
    itemsTbody.innerHTML = "";
    snap.forEach(d => {
      const it = d.data();
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(it.name)}</td>
        <td>₹ ${Number(it.price || 0).toFixed(2)}</td>
        <td>${it.available ? "Yes" : "No"}</td>
        <td>
          <button data-edit="${d.id}">Edit</button>
          <button data-del="${d.id}">Delete</button>
        </td>
      `;
      itemsTbody.appendChild(tr);
    });
  });

  // Live orders
  const ordersQuery = collection(db, "orders");
  onSnapshot(ordersQuery, snap => {
    ordersContainer.innerHTML = "";
    snap.forEach(docSnap => {
      const o = docSnap.data();
      if (o.shopId !== CURRENT_UID) return;
      const orderId = docSnap.id;
      const div = document.createElement("div");
      div.innerHTML = `
        <h4>${o.item.name}</h4>
        <p><b>Customer:</b> ${o.customerName}</p>
        <p><b>Address:</b> ${o.address}</p>
        <p><b>Payment:</b> ${o.paymentMethod}</p>
        <p><b>Status:</b> <span id="status-${orderId}">${o.status}</span></p>
        <button id="accept-${orderId}">Accept</button>
        <button id="reject-${orderId}">Reject</button>
        <hr>
      `;
      ordersContainer.appendChild(div);

      document.getElementById(`accept-${orderId}`).onclick = async () => {
        await updateDoc(doc(db, "orders", orderId), { status: "accepted" });
      };
      document.getElementById(`reject-${orderId}`).onclick = async () => {
        await updateDoc(doc(db, "orders", orderId), { status: "rejected" });
      };
    });
  });
});

// Item form
itemForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!ITEMS_REF) return;

  const name = document.getElementById("itemName").value.trim();
  const price = parseFloat(document.getElementById("itemPrice").value);
  const available = document.getElementById("itemAvailable").checked;
  const editId = document.getElementById("editItemId").value;

  if (!name || isNaN(price)) { alert("Enter valid name and price"); return; }

  try {
    if (editId) { await updateDoc(doc(ITEMS_REF, editId), { name, price, available }); }
    else { await addDoc(ITEMS_REF, { name, price, available, createdAt: serverTimestamp() }); }
    itemForm.reset();
    document.getElementById("editItemId").value = "";
  } catch (err) { console.error(err); alert(err.message); }
});

// Edit/delete buttons
itemsTbody.addEventListener("click", async (e) => {
  const editId = e.target.getAttribute("data-edit");
  const delId = e.target.getAttribute("data-del");

  if (editId) {
    const snap = await getDoc(doc(ITEMS_REF, editId));
    if (snap.exists()) {
      const it = snap.data();
      document.getElementById("itemName").value = it.name;
      document.getElementById("itemPrice").value = it.price;
      document.getElementById("itemAvailable").checked = !!it.available;
      document.getElementById("editItemId").value = editId;
    }
  }
  if (delId) { if (confirm("Delete item?")) await deleteDoc(doc(ITEMS_REF, delId)); }
});

// Sign out
signOutBtn.addEventListener("click", async () => { await signOut(auth); window.location.href = "../login.html"; });
*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, doc, getDoc, setDoc, serverTimestamp, addDoc, onSnapshot, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

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
const db = getFirestore(app);
const auth = getAuth(app);

// ---------------- DOM Elements ----------------
const shopTitle = document.getElementById("shopTitle");
const ownerEmailEl = document.getElementById("ownerEmail");
const signOutBtn = document.getElementById("signOutBtn");
const itemForm = document.getElementById("itemForm");
const itemsTbody = document.getElementById("itemsTbody");
const ordersContainer = document.getElementById("ordersContainer"); // Make sure your HTML has this div

let CURRENT_UID = null;
let ITEMS_REF = null;

// ---------------- Auth ----------------
onAuthStateChanged(auth, async (user) => {
  if (!user) return window.location.href = "../login.html";
  CURRENT_UID = user.uid;
  ownerEmailEl.textContent = user.email || "";

  // Ensure shop exists
  const shopRef = doc(db, "shops", CURRENT_UID);
  const shopSnap = await getDoc(shopRef);
  if (!shopSnap.exists()) {
    await setDoc(shopRef, {
      shopname: "My Shop",
      ownerName: user.email,
      createdAt: serverTimestamp()
    });
  }

  shopTitle.textContent = (await getDoc(shopRef)).data()?.shopname || "My Shop";

  ITEMS_REF = collection(db, "shops", CURRENT_UID, "items");

  // Load items live
  onSnapshot(ITEMS_REF, (snap) => {
    itemsTbody.innerHTML = "";
    snap.forEach(d => {
      const it = d.data();
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${it.name}</td>
        <td>₹${Number(it.price).toFixed(2)}</td>
        <td>${it.available ? "Yes" : "No"}</td>
        <td>
          <button data-edit="${d.id}">Edit</button>
          <button data-del="${d.id}">Delete</button>
        </td>
      `;
      itemsTbody.appendChild(tr);
    });
  });

  // Load Orders live
  const ordersQuery = collection(db, "orders");
  onSnapshot(ordersQuery, (snap) => {
    ordersContainer.innerHTML = "";
    snap.forEach(docSnap => {
      const order = docSnap.data();
      if (order.shopId !== CURRENT_UID) return; // only this shop's orders
      const orderId = docSnap.id;

      const div = document.createElement("div");
      div.classList.add("order-item");
      div.innerHTML = `
        <h3>${order.item.name}</h3>
        <p><b>Customer:</b> ${order.customerName}</p>
        <p><b>Address:</b> ${order.address}</p>
        <p><b>Payment:</b> ${order.paymentMethod}</p>
        <p><b>Status:</b> <span id="status-${orderId}">${order.status}</span></p>
        <button id="accept-${orderId}">Accept</button>
        <button id="reject-${orderId}">Reject</button>
        <hr>
      `;
      ordersContainer.appendChild(div);

      // Accept/Reject
      document.getElementById(`accept-${orderId}`).addEventListener("click", async () => {
        await updateDoc(doc(db, "orders", orderId), { status: "accepted" });
        document.getElementById(`status-${orderId}`).innerText = "accepted";
      });
      document.getElementById(`reject-${orderId}`).addEventListener("click", async () => {
        await updateDoc(doc(db, "orders", orderId), { status: "rejected" });
        document.getElementById(`status-${orderId}`).innerText = "rejected";
      });
    });
  });
});

// ---------------- Add / Update Item ----------------
itemForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("itemName").value.trim();
  const price = parseFloat(document.getElementById("itemPrice").value);
  const available = document.getElementById("itemAvailable").checked;
  const editId = document.getElementById("editItemId").value;

  if (!name || isNaN(price)) return alert("Enter valid name & price");

  if (editId) await updateDoc(doc(ITEMS_REF, editId), { name, price, available });
  else await addDoc(ITEMS_REF, { name, price, available, createdAt: serverTimestamp() });

  itemForm.reset();
  document.getElementById("itemAvailable").checked = true;
  document.getElementById("editItemId").value = "";
});

// ---------------- Sign Out ----------------
signOutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "../login.html";
});
