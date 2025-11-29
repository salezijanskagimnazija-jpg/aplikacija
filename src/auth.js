const methodClass = {
    email: {
        signin: "email-signin-container",
        signup: "email-signup-container",
    },
}

let method = null;
document.querySelectorAll('.method-btn').forEach(button => {
    button.addEventListener('click', function() {
        method = this.getAttribute('data-method');
        
        // console.log("Selected method:", method);
        displayMethod(method, "signin");
    });
});

function displayMethod(method, action) {
    // hides available methods
    document.querySelector('.methods-container').classList.add('hidden');;

    // hides any previous open forms
    document.querySelectorAll(".method-form-container").forEach(container => {
        container.classList.add('hidden');
    });

    // shows selected method container
    document.getElementById(methodClass[method][action]).classList.remove('hidden');
}

document.getElementById('back-btn').addEventListener('click', function() {
    event.preventDefault();

    window.location.reload();
});

document.getElementById('signup-btn').addEventListener('click', function() {
    event.preventDefault();

    displayMethod(method, "signup");
});

document.getElementById('signin-btn').addEventListener('click', function() {
    event.preventDefault();

    displayMethod(method, "signin");
});