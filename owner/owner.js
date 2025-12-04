import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
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
