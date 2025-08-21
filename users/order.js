// order.js — handles "Buy Now" checkout + saves order to Firestore

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  addDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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
const form = document.getElementById("orderForm");
const productSummaryEl = document.getElementById("productSummary") || document.getElementById("product-details");

// ---------------- Read item from URL ----------------
const params = new URLSearchParams(location.search);
const shopId = params.get("shopId") || localStorage.getItem("selectedShopId") || null;
const itemId = params.get("itemId");
const fallbackName = params.get("item");
const fallbackPrice = parseFloat(params.get("price") || "0");
const fallbackQty = parseInt(params.get("qty") || "1", 10);

// Initialize item object
let item = {
  id: itemId || null,
  name: escapeHtml(fallbackName || "Selected Item"),
  price: isNaN(fallbackPrice) ? 0 : fallbackPrice,
  image: params.get("img") || ""
};

// Current logged-in user
let currentUser = null;

// ---------------- Load product from Firestore ----------------
async function loadProduct() {
  if (!shopId || !itemId) {
    alert("Error: Product information is missing. Please try again.");
    window.history.back();
    return;
  }

  try {
    const itemRef = doc(db, "shops", shopId, "items", itemId);
    const snap = await getDoc(itemRef);
    if (snap.exists()) {
      const data = snap.data();
      item = {
        id: itemId,
        name: escapeHtml(data.name || "Item"),
        price: Number(data.price) || 0,
        image: data.image || ""
      };
    }
  } catch (e) {
    console.error("Failed to load item:", e);
  } finally {
    renderProduct();
  }
}

// ---------------- Render product info ----------------
function renderProduct() {
  if (!productSummaryEl) return;

  const qtyInput = document.getElementById("quantity");
  const qty = qtyInput ? Number(qtyInput.value || 1) : fallbackQty;
  const total = (Number(item.price) || 0) * qty;

  productSummaryEl.innerHTML = `
    <div style="display:flex; gap:12px; align-items:center;">
      <img src="${item.image || "https://via.placeholder.com/80?text=Food"}"
           alt="${item.name}" style="width:80px;height:80px;border-radius:8px;object-fit:cover;">
      <div>
        <h3 style="margin:0;">${item.name}</h3>
        <div>Price: ₹${Number(item.price).toFixed(2)}</div>
        <div id="calcLine">Quantity: ${qty} • Total: <strong>₹${total.toFixed(2)}</strong></div>
      </div>
    </div>
  `;
}

// ---------------- Live update total when quantity changes ----------------
const qtyInput = document.getElementById("quantity");
if (qtyInput) {
  qtyInput.addEventListener("input", renderProduct);
}

// ---------------- Form Submission ----------------
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("Please log in to place an order.");
      return;
    }

    const name = valById("name") || currentUser.displayName || "";
    const address = valById("address") || "";
    const payment = valById("payment") || "Cash";
    const quantity = parseInt(valById("quantity") || "1", 10);

    const unitPrice = Number(item.price) || 0;
    const total = unitPrice * quantity;

    const order = {
      shopId: shopId,
      itemId: item.id,
      itemName: item.name,
      itemPrice: unitPrice,
      quantity,
      total,
      paymentMethod: payment,
      paymentStatus: payment === "Cash" ? "COD" : "Pending",
      status: "Pending",
      userId: currentUser.uid,
      customerName: name,
      customerEmail: currentUser.email || "",
      address,
      createdAt: serverTimestamp()
    };

    try {
      // 1) Global orders
      const globalRef = await addDoc(collection(db, "orders"), order);

      // 2) Shop-specific orders
      if (shopId) {
        await setDoc(doc(db, "shops", shopId, "orders", globalRef.id), {
          ...order,
          orderId: globalRef.id
        });
      }

      // 3) User-specific orders
      await setDoc(doc(db, "users", currentUser.uid, "orders", globalRef.id), {
        ...order,
        orderId: globalRef.id
      });

      alert("✅ Order placed successfully!");
      window.location.href = "user.html"; // redirect after success
    } catch (err) {
      console.error("Order failed:", err);
      alert("❌ Failed to place order. Please try again.");
    }
  });
}

// ---------------- Auth Listener ----------------
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    const nameInput = document.getElementById("name");
    if (nameInput && !nameInput.value) {
      nameInput.value = user.displayName || "";
    }
  } else {
    currentUser = null;
  }
});

// ---------------- Helpers ----------------
function valById(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}
function escapeHtml(s = "") {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

// ---------------- Init ----------------
loadProduct();
