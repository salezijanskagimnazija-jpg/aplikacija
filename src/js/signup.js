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

/** Attaches an event listener to all buttons in the methods form. */
let init_methods_form = function() {
    let method = null;
    document.querySelectorAll('.method-btn').forEach(button => {
        button.addEventListener('click', function() {
            method = this.getAttribute('data-method');
            
            // console.log("Selected method:", method);
            displayMethod(method, "signin");
        });
    });
};
init_methods_form();

/** hides the loading text when everything is loaded and displays the methods container */
let stop_loading_screen = function() {
    document.querySelector(".loading").classList.add("hidden");
    document.querySelector(".methods-container").classList.remove("hidden");
};
stop_loading_screen();

/** Initialize all buttons with their event handlers. */
let init_buttons = function() {
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
};
init_buttons();

/** 
 * Displays the selected method. 
 * @param {string} method   - The chosen method
 * @param {string} action   - The chosen action
 */
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

/** 
 * Update firebase profile.
 * @param {string} username     - User's desired username
 * @param {string} photoURL     - User's desired photo URL
 * @param {user} user           - firebase user object
 * @param {string} firstName    - User's first name
 * @param {string} lastName     - User's last name
 * @param {string} email        - User's email
 */
let update_firebase_profile = function(username, photoURL, user, 
    firstName, lastName, email
)   {
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
}
/** Handle google popup login. */
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
        
        update_firebase_profile(username, photoURL, user, firstName, lastName, email);

    }).catch((error) => {
        console.error("Google sign-in error:", error);
        // Optionally: go back to methods selection
        document.querySelector('.methods-container').classList.remove('hidden');
        document.querySelector(".userdata-container").classList.add('hidden');
    });
}

/** Prepares the email signin form. */
function prepare_email_signin() {
    let form = document.getElementById("form-container");
    form.classList.remove("hidden");

    document.getElementById("form-header").innerHTML = "Sign IN";
    document.getElementById("email-form").classList.remove("hidden");

    document.querySelector(".signup-btn").classList.remove("hidden");

    document.querySelector(".back-btn").classList.remove("hidden");

    document.getElementById('email-form').addEventListener('submit', signinListener);
};

/** Prepares the email signup form. */
function prepare_email_signup() {
    let form = document.getElementById("form-container");
    form.classList.remove("hidden");

    document.getElementById("form-header").innerHTML = "Sign UP";
    document.getElementById("email-form").classList.remove("hidden");

    document.querySelector(".signin-btn").classList.remove("hidden");

    document.querySelector(".back-btn").classList.remove("hidden");

    document.getElementById('email-form').addEventListener('submit', signupListener);
};

/**
 * Handles login with email method.
 * @param {string} action   - Chosen email login action.
 */
let emailLogin = function(action) {
    console.log("Chosen email method.")
    // shows selected method container
    if (action == "signin") {
        console.log("Preparing email signin...");
        prepare_email_signin();
    } else if (action == "signup") {
        console.log("Preparing email signup...");
        prepare_email_signup();
    } 
}

/**
 * Read email and password and then sign in user.
 * @param {event} event         - yeah idk
 */
let signinListener = function(event) {
    event.preventDefault(); // Prevent the default form submission (page reload)

    // Get email and password values from the form
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signIn(email, password); // Call the signUp function with email and password
}

/**
 * Read email and password and then signup user.
 * @param {event} event 
 */
let signupListener = function(event) {
    event.preventDefault(); // Prevent the default form submission (page reload)
  
    // Get email and password values from the form
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    signUp(email, password); // Call the signUp function with email and password
};

/**
 * create firebase user with firebase sdk
 * @param {string} email 
 * @param {string} password 
 */
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

            let name = document.getElementById('name').value;
            let surname = document.getElementById('surname').value;

            console.log("Name:", name, "Surname:", surname);

            update_firebase_profile(username, null, user, name, surname, email);
        });
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error code:", errorCode, "Error message:", errorMessage);
    });
};

/**
 * Sign in user using firebase sdk.
 * @param {string} email 
 * @param {string} password 
 */
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