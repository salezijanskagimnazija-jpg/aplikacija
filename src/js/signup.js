// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// Add Firebase products that you want to use
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js';
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
// https://firebase.google.com/docs/web/setup#available-libraries

import { firebaseConfig } from './config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();

// Initialize auth providers
const google = new GoogleAuthProvider();

const db = getFirestore(app);
console.log("Firestore initialized:", db.app.options.projectId);

// Attaches an event listener to all buttons
let method = null;
document.querySelectorAll('.method-btn').forEach(button => {
    button.addEventListener('click', function() {
        method = this.getAttribute('data-method');
        
        // console.log("Selected method:", method);
        displayMethod(method, "signin");
    });
});

document.querySelector(".back-btn").addEventListener("click", () => {
    event.preventDefault();

    window.location.reload();
});

document.querySelector(".signin-btn").addEventListener("click", () => {
    event.preventDefault();

    document.querySelector(".signin-btn").classList.add("hidden");

    document.getElementById('email-form').removeEventListener('submit', signupListener);
    displayMethod("email", "signin");
});

document.querySelector(".signup-btn").addEventListener("click", () => {
    event.preventDefault();

    document.querySelector(".signup-btn").classList.add("hidden");

    document.getElementById('email-form').removeEventListener('submit', signinListener);
    displayMethod("email", "signup");
});

function displayMethod(method, action) {
    console.log("Hiding methods...");
    // hides available methods
    document.querySelector('.methods-container').classList.add('hidden');

    console.log("Displaying form...");

    if (method == "google") {
        googleLogin();
    } else {
        emailLogin(action);
    }
}

let googleLogin = function() {
    console.log("Chosen provider is Google. Opening popup...")
    signInWithPopup(auth, google)
    .then((result) => {
        const user = result.user;
        console.log("Google user signed in:", user);
        
        // Get Google profile data
        const displayName = user.displayName || "";
        const email = user.email;
        const photoURL = user.photoURL || "";
        
        // Extract first/last name from displayName
        let firstName = "";
        let lastName = "";
        if (displayName) {
            const nameParts = displayName.split(' ');
            firstName = nameParts[0] || "";
            lastName = nameParts.slice(1).join(' ') || "";
        }
        
        // Generate username from email
        const username = email.split('@')[0];
        
        // Update Firebase profile
        updateProfile(auth.currentUser, {
            displayName: username, // or use displayName if you prefer
            photoURL: photoURL
        }).then(() => {
            // Save to Firestore
            const userRef = doc(db, "users", user.uid);
            return setDoc(userRef, {
                username: username,
                first: firstName,
                last: lastName,
                email: email,
                photoURL: photoURL,
                provider: "google",
                createdAt: new Date()
            });
        }).then(() => {
            console.log("Google user data saved to Firestore");
            window.location.assign("main.html");
        }).catch((error) => {
            console.error("Error saving Google user data:", error);
        });
    }).catch((error) => {
        console.error("Google sign-in error:", error);
        // Optionally: go back to methods selection
        document.querySelector('.methods-container').classList.remove('hidden');
        document.querySelector(".userdata-container").classList.add('hidden');
    });
}

let emailLogin = function(action) {
    console.log("Chosen email.")
        // shows selected method container
        if (action == "signin") {
            console.log("Preparing email signin...");

            let form = document.getElementById("form-container");
            form.classList.remove("hidden");

            document.getElementById("form-header").innerHTML = "Sign IN";
            document.getElementById("email-form").classList.remove("hidden");

            document.querySelector(".signup-btn").classList.remove("hidden");

            document.querySelector(".back-btn").classList.remove("hidden");

            document.getElementById('email-form').addEventListener('submit', signinListener);
        } else if (action == "signup") {
            console.log("Preparing email signup...");

            let form = document.getElementById("form-container");
            form.classList.remove("hidden");

            document.getElementById("form-header").innerHTML = "Sign UP";
            document.getElementById("email-form").classList.remove("hidden");

            document.querySelector(".signin-btn").classList.remove("hidden");

            document.querySelector(".back-btn").classList.remove("hidden");

            document.getElementById('email-form').addEventListener('submit', signupListener);
        } 
}

let signinListener = function(event) {
    event.preventDefault(); // Prevent the default form submission (page reload)

    // Get email and password values from the form
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signIn(email, password); // Call the signUp function with email and password
}

let signupListener = function(event) {
    event.preventDefault(); // Prevent the default form submission (page reload)
  
    // Get email and password values from the form
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    signUp(email, password); // Call the signUp function with email and password
};


function signUp(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        console.log("User created:", user);
        
        // get the users username
        document.getElementById('email-form').classList.add('hidden');
        document.querySelector('.signin-btn').classList.add('hidden');

        document.getElementById('names-form').classList.remove('hidden');

        document.getElementById('email-form').removeEventListener('submit', signupListener);

        document.getElementById('names-form').addEventListener('submit', async function(event) {
            event.preventDefault();

            const username = document.getElementById('username').value;
            console.log("Username entered:", username);
            updateProfile(auth.currentUser, {
                displayName: username,
            }).then(() => {
                console.log("Username set to: ", auth.currentUser.displayName);
            }).catch((error) => {
                console.error("Error updating profile:", error);
            });

            let name = document.getElementById('name').value;
            let surname = document.getElementById('surname').value;

            console.log("Name:", name, "Surname:", surname);

            console.log("User UID:", user.uid);
            const strinf = String(user.uid);
            const userRef = doc(db, "users", strinf);

            // Add user details to Firestore
            setDoc(userRef, {
                first: name,
                last: surname,
            })
            .then((userRef) => {
                console.log("Document written with ID: ", user.uid);
                window.location.assign("main.html");
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
        
        // ...
        });
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error code:", errorCode, "Error message:", errorMessage);
    // ..
    });
};


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