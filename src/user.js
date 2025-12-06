import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js';
import { firebaseConfig } from './config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Check auth state when main.html loads
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    console.log("User is signed in:", user);

    // Update UI or do whatever you need with the user data
    document.getElementById('user-info').textContent = "Username:\t" + user.displayName + "\t||\tEmail:\t" + user.email;
  } else {
    // User is signed out, redirect back to login
    console.log("No user signed in, redirecting to login");
    window.location.assign("auth.html"); // or your login page
  }
});