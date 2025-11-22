// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// Add Firebase products that you want to use
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js'
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyAfjGkYuKVHmES-plwEQANUu1wRYxHFsBw",
authDomain: "aplikacija-21276.firebaseapp.com",
projectId: "aplikacija-21276",
storageBucket: "aplikacija-21276.firebasestorage.app",
messagingSenderId: "268238860819",
appId: "1:268238860819:web:da620228aa41aa64bf05e6",
measurementId: "G-HMTTWPWD75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission (page reload)
  
    // Get email and password values from the form
    const email = document.getElementById('email1').value;
    const password = document.getElementById('password1').value;
  
    signUp(email, password); // Call the signUp function with email and password
});

function signUp(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        console.log("User created:", user);
        window.location.assign("main.html");
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error code:", errorCode, "Error message:", errorMessage);
    // ..
    });
};

document.getElementById('signin-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission (page reload)
  
    // Get email and password values from the form
    const email = document.getElementById('email2').value;
    const password = document.getElementById('password2').value;
  
    signIn(email, password); // Call the signUp function with email and password
});

function signIn(email, password) {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log("User signed in:", user);
      window.location.assign("main.html");
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error code:", errorCode, "Error message:", errorMessage);
    });
};
