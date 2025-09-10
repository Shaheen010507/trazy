/*import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
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

onSnapshot(doc(db, "orders", orderId), (snap) => {
  if (!snap.exists()) return;
  const data = snap.data();
  if(data.status === "accepted") {
    statusEl.textContent = "Your order is being processed!";
  } else if(data.status === "delivered") {
    statusEl.textContent = "Your order has been delivered!";
  } else {
    statusEl.textContent = "Order pending...";
  }
});
/*--------new

document.getElementById("orderForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentItem) return alert("Product not loaded!");

  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const payment = document.getElementById("payment").value;

  try {
    // ---------------- Razorpay Options ----------------
    if (payment === "upi" || payment === "card") {
      const options = {
        key: "YOUR_RAZORPAY_KEY", // Get this from Razorpay Dashboard
        amount: currentItem.price * 100, // in paise
        currency: "INR",
        name: "Your Shop Name",
        description: currentItem.name,
        prefill: {
          name: name,
          email: "", // optional
          contact: "" // optional
        },
        theme: { color: "#4f46e5" },
        handler: async function(response) {
          // Razorpay payment successful
          await addDoc(collection(db, "orders"), {
            customerName: name,
            address: address,
            paymentMethod: payment,
            paymentStatus: "success",
            shopId: shopId,
            item: {
              id: currentItem.id,
              name: currentItem.name,
              price: currentItem.price
            },
            status: "processing",
            razorpayPaymentId: response.razorpay_payment_id,
            createdAt: serverTimestamp()
          });
          alert("Payment successful! Order placed.");
          window.location.href = "shop.html";
        },
        modal: {
          ondismiss: function() {
            alert("Payment cancelled.");
          }
        }
      };

      const rzp = new Razorpay(options);
      rzp.open();
      return;
    }

    // ---------------- Cash on Delivery ----------------
    if (payment === "cash") {
      await addDoc(collection(db, "orders"), {
        customerName: name,
        address: address,
        paymentMethod: payment,
        paymentStatus: "pending",
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
      window.location.href = "shop.html";
    }

  } catch (err) {
    console.error(err);
    alert("Error placing order: " + err.message);
  }
});
*/
/*
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { 
  getFirestore, doc, getDoc, collection, addDoc, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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

const params = new URLSearchParams(window.location.search);
const shopId = params.get("shopId");
const itemId = params.get("itemId");

const productNameEl = document.getElementById("productName");
const productPriceEl = document.getElementById("productPrice");

let currentItem = null;

// Load product from Firestore
async function loadProduct() {
  if (!shopId || !itemId) {
    alert("Invalid product data!");
    window.history.back();
    return;
  }

  const itemSnap = await getDoc(doc(db, "shops", shopId, "items", itemId));
  if (!itemSnap.exists()) {
    productNameEl.innerText = "Product not found!";
    return;
  }

  currentItem = itemSnap.data();
  currentItem.id = itemId;

  productNameEl.innerText = currentItem.name;
  productPriceEl.innerText = "₹" + currentItem.price;
}

loadProduct();

// Get Razorpay Key ID of the shop
async function getShopRazorpayKey(shopId) {
  const shopSnap = await getDoc(doc(db, "shops", shopId));
  if (!shopSnap.exists()) throw new Error("Shop not found");
  return shopSnap.data().razorpayKeyId; // fetch key ID
}

// Handle order submission
document.getElementById("orderForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentItem) return alert("Product not loaded!");

  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const payment = document.getElementById("payment").value;

  try {
    // ---------------- Razorpay Payments ----------------
    if (payment === "upi" || payment === "card") {
      const razorpayKeyId = await getShopRazorpayKey(shopId);

      const options = {
        key: razorpayKeyId,
        amount: currentItem.price * 100, // in paise
        currency: "INR",
        name: "Your Shop Name",
        description: currentItem.name,
        prefill: { name, email: "", contact: "" },
        theme: { color: "#4f46e5" },
        handler: async function(response) {
          await addDoc(collection(db, "orders"), {
            customerName: name,
            address,
            paymentMethod: payment,
            paymentStatus: "success",
            shopId,
            item: { id: currentItem.id, name: currentItem.name, price: currentItem.price },
            status: "processing",
            razorpayPaymentId: response.razorpay_payment_id,
            createdAt: serverTimestamp()
          });
          alert("Payment successful! Order placed.");
          window.location.href = "shop.html";
        },
        modal: {
          ondismiss: function() { alert("Payment cancelled."); }
        }
      };

      const rzp = new Razorpay(options);
      rzp.open();
      return;
    }

    // ---------------- Cash on Delivery ----------------
    if (payment === "cash") {
      await addDoc(collection(db, "orders"), {
        customerName: name,
        address,
        paymentMethod: payment,
        paymentStatus: "pending",
        shopId,
        item: { id: currentItem.id, name: currentItem.name, price: currentItem.price },
        status: "pending",
        createdAt: serverTimestamp()
      });
      alert("Order placed successfully!");
      window.location.href = "shop.html";
    }

  } catch (err) {
    console.error(err);
    alert("Error placing order: " + err.message);
  }
});*/

/*
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { 
  getFirestore, doc, getDoc, collection, addDoc, serverTimestamp 
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
const db = getFirestore(app);

// Get shopId & itemId from URL
const params = new URLSearchParams(window.location.search);
const shopId = params.get("shopId");
const itemId = params.get("itemId");

const productNameEl = document.getElementById("productName");
const productPriceEl = document.getElementById("productPrice");

let currentItem = null;

// ---------------- Load product from Firestore ----------------
async function loadProduct() {
  if (!shopId || !itemId) {
    alert("Invalid product data!");
    window.history.back();
    return;
  }

  const itemRef = doc(db, "shops", shopId, "items", itemId);
  const itemSnap = await getDoc(itemRef);

  if (!itemSnap.exists()) {
    productNameEl.innerText = "Product not found!";
    return;
  }

  currentItem = itemSnap.data();
  currentItem.id = itemId;

  productNameEl.innerText = currentItem.name;
  productPriceEl.innerText = "₹" + currentItem.price;
}

await loadProduct();

// ---------------- Handle Order Submit ----------------
document.getElementById("orderForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentItem) return alert("Product not loaded!");

  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const payment = document.getElementById("payment").value;

  try {
    // Fetch shop document to get Razorpay key
    const shopSnap = await getDoc(doc(db, "shops", shopId));
    if (!shopSnap.exists()) {
      alert("Shop not found!");
      return;
    }

    const shopData = shopSnap.data();
    const razorpayKeyId = shopData.razorpayKeyId; // Must be set in Firestore

    // ---------------- Razorpay Payment ----------------
    if (payment === "upi" || payment === "card") {
      if (!razorpayKeyId) {
        alert("This shop has not set up payments yet.");
        return;
      }

      const options = {
        key: razorpayKeyId,
        amount: currentItem.price * 100, // amount in paise
        currency: "INR",
        name: shopData.shopname || "Shop",
        description: currentItem.name,
        prefill: { name: name },
        theme: { color: "#4f46e5" },
        handler: async function(response) {
          // Save successful payment order in Firestore
          await addDoc(collection(db, "orders"), {
            customerName: name,
            address: address,
            paymentMethod: payment,
            paymentStatus: "success",
            shopId: shopId,
            item: {
              id: currentItem.id,
              name: currentItem.name,
              price: currentItem.price
            },
            status: "processing",
            razorpayPaymentId: response.razorpay_payment_id,
            createdAt: serverTimestamp()
          });
          alert("Payment successful! Order placed.");
          window.location.href = "shop.html";
        },
        modal: { ondismiss: () => alert("Payment cancelled.") }
      };

      const rzp = new Razorpay(options);
      rzp.open();
      return;
    }

    // ---------------- Cash on Delivery ----------------
    if (payment === "cash") {
      await addDoc(collection(db, "orders"), {
        customerName: name,
        address: address,
        paymentMethod: payment,
        paymentStatus: "pending",
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
      window.location.href = "shop.html";
    }

  } catch (err) {
    console.error(err);
    alert("Error placing order: " + err.message);
  }
});
*/





/*

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { 
  getFirestore, doc, getDoc, collection, addDoc, serverTimestamp
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
const db = getFirestore(app);

const params = new URLSearchParams(window.location.search);
const shopId = params.get("shopId");
const itemId = params.get("itemId");

const productNameEl = document.getElementById("productName");
const productPriceEl = document.getElementById("productPrice");

let currentItem = null;
let shopData = null;

// ---------------- Load product and shop ----------------
async function loadData() {
  if (!shopId || !itemId) {
    alert("Invalid product data!");
    window.history.back();
    return;
  }

  // Load shop data
  const shopSnap = await getDoc(doc(db, "shops", shopId));
  if (!shopSnap.exists()) {
    alert("Shop not found!");
    window.history.back();
    return;
  }
  shopData = shopSnap.data();

  // Load item
  const itemSnap = await getDoc(doc(db, "shops", shopId, "items", itemId));
  if (!itemSnap.exists()) {
    productNameEl.innerText = "Product not found!";
    return;
  }
  currentItem = itemSnap.data();
  currentItem.id = itemId;

  productNameEl.innerText = currentItem.name;
  productPriceEl.innerText = "₹" + currentItem.price;
}

await loadData();

// ---------------- Handle order submit ----------------
document.getElementById("orderForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentItem || !shopData) return;

  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const payment = document.getElementById("payment").value;

  try {
    // ---------------- Razorpay Payment ----------------
    if (payment === "upi" || payment === "card") {
      if (!shopData.razorpay_key_id) {
        alert("This shop has not set up payments yet.");
        return;
      }

      const options = {
        key: shopData.razorpay_key_id, // Shop-specific key
        amount: currentItem.price * 100, // in paise
        currency: "INR",
        name: shopData.shopname || "Shop",
        description: currentItem.name,
        prefill: { name, email: "", contact: "" },
        theme: { color: "#4f46e5" },
        handler: async function(response) {
          // Payment successful → save order
          await addDoc(collection(db, "orders"), {
            customerName: name,
            address,
            paymentMethod: payment,
            paymentStatus: "success",
            shopId,
            item: {
              id: currentItem.id,
              name: currentItem.name,
              price: currentItem.price
            },
            status: "processing",
            razorpayPaymentId: response.razorpay_payment_id,
            createdAt: serverTimestamp()
          });
          alert("Payment successful! Order placed.");
          window.location.href = "shop.html";
        },
        modal: {
          ondismiss: function() { alert("Payment cancelled."); }
        }
      };

      const rzp = new Razorpay(options);
      rzp.open();
      return;
    }

    // ---------------- Cash on Delivery ----------------
    if (payment === "cash") {
      await addDoc(collection(db, "orders"), {
        customerName: name,
        address,
        paymentMethod: payment,
        paymentStatus: "pending",
        shopId,
        item: {
          id: currentItem.id,
          name: currentItem.name,
          price: currentItem.price
        },
        status: "pending",
        createdAt: serverTimestamp()
      });
      alert("Order placed successfully!");
      window.location.href = "shop.html";
    }

  } catch (err) {
    console.error("Error placing order:", err);
    alert("Error placing order: " + err.message);
  }
});
*/

// this is use for testing 

/*import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { 
  getFirestore, doc, getDoc, collection, addDoc, serverTimestamp 
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

// ---------------- Elements ----------------
const params = new URLSearchParams(window.location.search);
const shopId = params.get("shopId");
const itemId = params.get("itemId");

const productNameEl = document.getElementById("productName");
const productPriceEl = document.getElementById("productPrice");
const productDescEl = document.getElementById("productDesc");
const orderForm = document.getElementById("orderForm");

let currentItem = null;
let shopData = null; // To hold Razorpay keys

// ---------------- Load Product & Shop ----------------
async function loadProduct() {
  if (!shopId || !itemId) {
    alert("Invalid product data!");
    window.history.back();
    return;
  }

  // Load item
  const itemRef = doc(db, "shops", shopId, "items", itemId);
  const snap = await getDoc(itemRef);
  if (!snap.exists()) {
    productNameEl.innerText = "Product not found!";
    return;
  }

  currentItem = snap.data();
  currentItem.id = itemId;

  productNameEl.innerText = currentItem.name || "Unnamed Item";
  productPriceEl.innerText = "₹" + (currentItem.price || 0);
  productDescEl.innerText = currentItem.description || "No description available.";

  // Load shop data for Razorpay keys
  const shopRef = doc(db, "shops", shopId);
  const shopSnap = await getDoc(shopRef);
  shopData = shopSnap.exists() ? shopSnap.data() : {};
}

loadProduct();

// ---------------- Handle Order Submit ----------------
orderForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentItem) return alert("Product not loaded!");

  const name = document.getElementById("name").value.trim();
  const address = document.getElementById("address").value.trim();
  const payment = document.getElementById("payment").value;

  if (!name || !address) {
    alert("Please enter all required fields.");
    return;
  }

  try {
    // ---------------- Razorpay Payment ----------------
    if ((payment === "upi" || payment === "card") && shopData?.razorpay_key_id) {
      const options = {
        key: shopData.razorpay_key_id, // fetched from shop
        amount: (currentItem.price || 0) * 100, // in paise
        currency: "INR",
        name: shopData.shopname || "Shop",
        description: currentItem.name,
        prefill: { name, email: "", contact: "" },
        theme: { color: "#4f46e5" },
        handler: async function(response) {
          await addDoc(collection(db, "orders"), {
            customerName: name,
            address: address,
            paymentMethod: payment,
            paymentStatus: "success",
            shopId: shopId,
            item: {
              id: currentItem.id,
              name: currentItem.name,
              price: currentItem.price
            },
            status: "pending",
            razorpayPaymentId: response.razorpay_payment_id,
            createdAt: serverTimestamp()
          });
          alert("Payment successful! Order placed.");
          window.location.href = "shop.html";
        },
        modal: {
          ondismiss: function() {
            alert("Payment cancelled.");
          }
        }
      };

      const rzp = new Razorpay(options);
      rzp.open();
      return;
    }

    // ---------------- Cash on Delivery ----------------
    await addDoc(collection(db, "orders"), {
      customerName: name,
      address: address,
      paymentMethod: payment,
      paymentStatus: payment === "cash" ? "pending" : "failed",
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
    window.location.href = "shop.html";

  } catch (err) {
    console.error("Error placing order:", err);
    alert("Failed to place order: " + err.message);
  }
});

*/

// we remove the card we insert the networking that code this is :

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
