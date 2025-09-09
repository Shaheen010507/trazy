import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  collection, 
  addDoc, 
  serverTimestamp,
  onSnapshot   
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js"; // ✅ Import Auth

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
const auth = getAuth(app);  // ✅ Auth Initialized

const params = new URLSearchParams(window.location.search);
const shopId = params.get("shopId");
const itemId = params.get("itemId");

const productNameEl = document.getElementById("productName");
const productPriceEl = document.getElementById("productPrice");
const statusEl = document.getElementById("orderStatus");

let currentItem = null;

async function loadProduct() {
  if (!shopId || !itemId) {
    alert("Invalid product data!");
    window.history.back();
    return;
  }

  const itemRef = doc(db, "shops", shopId, "items", itemId);
  const snap = await getDoc(itemRef);

  if (!snap.exists()) {
    productNameEl.innerText = "Product not found!";
    return;
  }

  currentItem = snap.data();
  currentItem.id = itemId;

  productNameEl.innerText = currentItem.name;
  productPriceEl.innerText = "₹" + currentItem.price;
}
loadProduct();

document.getElementById("orderForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!currentItem) {
    alert("Product not loaded correctly!");
    return;
  }

  const user = auth.currentUser;

  if (!user) {
    alert("You must be logged in to place an order.");
    window.location.href = "login.html";
    return;
  }

  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const payment = document.getElementById("payment").value;

  try {
    const docRef = await addDoc(collection(db, "orders"), {
      customerName: name,
      customerEmail: user.email,  // ✅ Store email here
      address: address,
      paymentMethod: payment,
      shopId: shopId,
      item: {
        id: currentItem.id,
        name: currentItem.name,
        price: currentItem.price
      },
      status: "pending",
      createdAt: serverTimestamp()
    });

    alert("Order placed successfully!");

    trackOrderStatus(docRef.id);

    setTimeout(() => {
      window.location.href = "thankyou.html";
    }, 2000);

  } catch (error) {
    console.error("Error placing order:", error);
    alert("Failed to place order. Try again.");
  }
});

function trackOrderStatus(orderId) {
  const orderRef = doc(db, "orders", orderId);

  onSnapshot(orderRef, (snap) => {
    if (!snap.exists()) return;
    const data = snap.data();

    if (data.status === "accepted") {
      statusEl.textContent = "✅ Your order is being processed!";
    } else if (data.status === "delivered") {
      statusEl.textContent = "🎉 Your order has been delivered!";
    } else {
      statusEl.textContent = "⏳ Order pending...";
    }
  });
}
