import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import { firebaseConfig } from './config.js';

const app = initializeApp(firebaseConfig);

let test_handler = function (test_index) {
    localStorage.setItem("test_index", test_index);
    window.location.assign("./test.html");
}

let test_btns = document.querySelectorAll(".test-btn");

for (let i = 0; i < test_btns.length; i++) {
    test_btns[i].addEventListener("click", function() {
        test_handler(i)
    });
}