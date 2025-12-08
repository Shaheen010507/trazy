// firebase-messaging-sw.js  (place this at the web root: /firebase-messaging-sw.js)
importScripts("https://www.gstatic.com/firebasejs/12.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDuzBpeML-DAjCqeF3Z5iX6H_0oZR7v3dg",
  authDomain: "trazy-2142e.firebaseapp.com",
  projectId: "trazy-2142e",
  storageBucket: "trazy-2142e.firebasestorage.app",
  messagingSenderId: "4891427196",
  appId: "1:4891427196:web:b8a9b5d0e05232c25124f9"
});

const messaging = firebase.messaging();

// When a background message arrives, show a notification
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const title = (payload.notification && payload.notification.title) || 'New Message';
  const options = {
    body: (payload.notification && payload.notification.body) || '',
    icon: '/logo.png', // ensure /logo.png exists at root or change path
    data: payload.data || {}
  };
  self.registration.showNotification(title, options);
});
