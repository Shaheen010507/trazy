/*import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, doc, collection, addDoc, updateDoc, deleteDoc, onSnapshot, query, where, serverTimestamp, getDocs } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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

onAuthStateChanged(auth, user => {
  if(user) {
    ownerEmailEl.textContent = user.email;
    loadOwnerDetails(user.uid);
  } else {
    window.location.href = "login.html";
  }
});

signOutBtn.addEventListener("click", () => signOut(auth));

async function loadOwnerDetails(uid) {
  ownerId = uid;
  const ownerDoc = await getDocs(collection(db, "owners"));
  ownerDoc.forEach(docu => {
    if(docu.data().email === auth.currentUser.email){
      shopId = docu.data().shopName ? docu.id : null;
      loadItems(shopId);
      loadOrders(shopId);
    }
  });
}

itemForm.addEventListener("submit", async e => {
  e.preventDefault();
  if(editItemId.value) {
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

function loadItems(shopId){
  const itemsCol = collection(db, "shops", shopId, "items");
  onSnapshot(itemsCol, snapshot => {
    itemsTbody.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${data.name}</td>
        <td>${data.price}</td>
        <td>${data.available ? "Yes" : "No"}</td>
        <td>
          <button onclick="editItem('${doc.id}','${data.name}',${data.price},${data.available})">Edit</button>
          <button onclick="deleteItem('${doc.id}')">Delete</button>
        </td>
      `;
      itemsTbody.appendChild(tr);
    });
  });
}

window.editItem = function(id,name,price,available){
  editItemId.value = id;
  itemName.value = name;
  itemPrice.value = price;
  itemAvailable.checked = available;
}

window.deleteItem = async function(id){
  await deleteDoc(doc(db, "shops", shopId, "items", id));
}

// Orders
async function loadOrders(shopId){
  const ordersCol = collection(db, "orders");
  onSnapshot(ordersCol, snapshot => {
    ordersContainer.innerHTML = "";
    snapshot.forEach(async docu => {
      const order = docu.data();
      if(order.shopId === shopId){
        const orderDiv = document.createElement("div");
        const deliveryMen = await getDeliveryMen();
        let deliveryOptions = "<option value=''>Select Delivery Man</option>";
        deliveryMen.forEach(d => {
          deliveryOptions += `<option value='${d.id}'>${d.fullname}</option>`;
        });
        orderDiv.innerHTML = `
          <p>Order ID: ${docu.id}</p>
          <p>User: ${order.customerName}</p>
          <p>Food: ${order.item.name}</p>
          <p>Amount: ₹${order.item.price}</p>
          <p>Place: ${order.address}</p>
          <p>Status: ${order.status}</p>
          <select onchange="assignDelivery('${docu.id}', this.value)">
            ${deliveryOptions}
          </select>
        `;
        ordersContainer.appendChild(orderDiv);
      }
    });
  });
}

async function getDeliveryMen(){
  const delSnap = await getDocs(collection(db, "delivery"));
  let freeMen = [];
  delSnap.forEach(docu => {
    if(docu.data().status === "free") freeMen.push({id: docu.id, ...docu.data()});
  });
  return freeMen;
}

window.assignDelivery = async function(orderId, deliveryId){
  if(!deliveryId) return;
  await updateDoc(doc(db, "orders", orderId), { deliveryId, status: "out-for-delivery" });
  await updateDoc(doc(db, "delivery", deliveryId), { status: "busy" });
}*/



import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, doc, collection, addDoc, updateDoc, deleteDoc, onSnapshot, query, where, serverTimestamp, getDocs } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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

onAuthStateChanged(auth, user => {
  if(user) {
    ownerEmailEl.textContent = user.email;
    loadOwnerDetails(user.uid);
  } else {
    window.location.href = "../login.html";
  }
});

signOutBtn.addEventListener("click", () => signOut(auth));

async function loadOwnerDetails(uid) {
  ownerId = uid;
  const ownersCol = collection(db, "owners");
  const ownersSnap = await getDocs(ownersCol);
  ownersSnap.forEach(docu => {
    if(docu.data().email === auth.currentUser.email){
      shopId = docu.id;
      loadItems(shopId);
      loadOrders(shopId);
    }
  });
}

itemForm.addEventListener("submit", async e => {
  e.preventDefault();
  if(editItemId.value) {
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

function loadItems(shopId){
  const itemsCol = collection(db, "shops", shopId, "items");
  onSnapshot(itemsCol, snapshot => {
    itemsTbody.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${data.name}</td>
        <td>${data.price}</td>
        <td>${data.available ? "Yes" : "No"}</td>
        <td>
          <button onclick="editItem('${doc.id}','${data.name}',${data.price},${data.available})">Edit</button>
          <button onclick="deleteItem('${doc.id}')">Delete</button>
        </td>
      `;
      itemsTbody.appendChild(tr);
    });
  });
}

window.editItem = function(id,name,price,available){
  editItemId.value = id;
  itemName.value = name;
  itemPrice.value = price;
  itemAvailable.checked = available;
}

window.deleteItem = async function(id){
  await deleteDoc(doc(db, "shops", shopId, "items", id));
}

// Orders
async function loadOrders(shopId){
  const ordersCol = collection(db, "orders");
  onSnapshot(ordersCol, snapshot => {
    ordersContainer.innerHTML = "";
    snapshot.forEach(async docu => {
      const order = docu.data();
      if(order.shopId === shopId){
        const orderDiv = document.createElement("div");

        // Delivery men options
        const deliveryMenSnap = await getDocs(collection(db, "delivery"));
        let deliveryOptions = "<option value=''>Select Delivery Man</option>";
        deliveryMenSnap.forEach(d => {
          const dData = d.data();
          if(dData.status === "free") deliveryOptions += `<option value='${d.id}'>${dData.fullname}</option>`;
          if(d.id === order.deliveryId) deliveryOptions += `<option value='${d.id}' selected>${dData.fullname}</option>`;
        });

        orderDiv.innerHTML = `
          <p>Order ID: ${docu.id}</p>
          <p>User: ${order.customerName}</p>
          <p>Food: ${order.item.name}</p>
          <p>Amount: ₹${order.item.price}</p>
          <p>Place: ${order.address}</p>
          <p>Status: ${order.status}</p>
          <select onchange="assignDelivery('${docu.id}', this.value)">
            ${deliveryOptions}
          </select>
        `;
        ordersContainer.appendChild(orderDiv);
      }
    });
  });
}

window.assignDelivery = async function(orderId, deliveryId){
  if(!deliveryId) return;
  await updateDoc(doc(db, "orders", orderId), { deliveryId, status: "out-for-delivery" });
  await updateDoc(doc(db, "delivery", deliveryId), { status: "busy" });
}
