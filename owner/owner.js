import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, serverTimestamp,
  collection, addDoc, onSnapshot, updateDoc, deleteDoc, query, where
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

// Helper to escape HTML
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ------------------- Auth & Owner Check -------------------
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

  // ------------------- Shop Items -------------------
  ITEMS_REF = collection(db, "shops", CURRENT_UID, "items");
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

  // ------------------- Orders Section -------------------
  const ordersRef = collection(db, "orders");
  const ordersQuery = query(ordersRef, where("shopId", "==", CURRENT_UID));

  onSnapshot(ordersQuery, (snapshot) => {
    ordersContainer.innerHTML = "";
    if (snapshot.empty) {
      ordersContainer.innerHTML = "<p>No orders yet.</p>";
    }
    snapshot.forEach(doc => {
      const order = doc.data();
      const div = document.createElement("div");
      div.className = "order-card";
      div.innerHTML = `
        <h3>Order ID: ${doc.id}</h3>
        <p><strong>Customer:</strong> ${escapeHtml(order.customerName)}</p>
        <p><strong>Address:</strong> ${escapeHtml(order.address)}</p>
        <p><strong>Item:</strong> ${escapeHtml(order.item.name)} - ₹${order.item.price}</p>
        <p><strong>Payment:</strong> ${escapeHtml(order.paymentMethod)}</p>
        <p><strong>Status:</strong> <span id="status-${doc.id}">${escapeHtml(order.status)}</span></p>
        <p>
          <button onclick="updateOrderStatus('${doc.id}', 'accepted')">Accept</button>
          <button onclick="updateOrderStatus('${doc.id}', 'delivered')">Delivered</button>
        </p>
      `;
      ordersContainer.appendChild(div);
    });
  });
});

// ------------------- Add / Update Shop Item -------------------
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

// ------------------- Edit / Delete Buttons -------------------
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

// ------------------- Update Order Status -------------------
window.updateOrderStatus = async function(orderId, status) {
  try {
    await updateDoc(doc(db, "orders", orderId), { status });
  } catch (err) {
    console.error(err);
    alert("Error updating order: " + err.message);
  }
}

// ------------------- Sign Out -------------------
signOutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "../login.html";
});

