// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Get DOM elements
  const ongoingList = document.getElementById("ongoing-orders");
  const receivedList = document.getElementById("received-orders");
  const totalSpentEl = document.getElementById("total-spent");

  // Check if elements exist
  if (!ongoingList || !receivedList || !totalSpentEl) {
    console.error("One or more DOM elements not found. Check your HTML IDs!");
    return;
  }


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

  // Listen for logged-in user
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      console.log("No user logged in");
      window.location.href = "login.html";
      return;
    }

    // Query orders for current user
    const q = query(collection(db, "orders"), where("userId", "==", user.uid));

    // Listen to changes in real-time
    onSnapshot(q, (snapshot) => {
      // Clear lists before re-rendering
      ongoingList.innerHTML = "";
      receivedList.innerHTML = "";
      let totalSpent = 0;

      snapshot.forEach((doc) => {
        const order = doc.data();

        // Safety check: Make sure order.item exists
        if (!order.item || !order.item.name || order.item.price === undefined) {
          console.warn("Order missing item details:", order);
          return;
        }

        // Create list item
        const li = document.createElement("li");
        li.textContent = `${order.item.name} - ₹${order.item.price} | ${order.status} | ${order.createdAt}`;

        if (order.status.toLowerCase() === "delivered") {
          totalSpent += order.item.price;
          receivedList.appendChild(li);
        } else {
          ongoingList.appendChild(li);
        }
      });

      // Update total spent
      totalSpentEl.textContent = "Total Spent: ₹" + totalSpent;
    }, (error) => {
      console.error("Error fetching orders:", error);
    });
  });
});
