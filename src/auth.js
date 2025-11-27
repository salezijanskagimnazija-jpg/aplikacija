const methodClass = {
    "email": ".email-signin-container",
}

document.querySelectorAll('.method-btn').forEach(button => {
    button.addEventListener('click', function() {
        const method = this.getAttribute('data-method');
        
        // console.log("Selected method:", method);
        displayMethod(method);
    });
});

function displayMethod(method) {
    // hides available methods
    document.querySelector('.methods-container').classList.add('hidden');;

    // shows selected method container
    document.querySelector(methodClass[method]).removeAttribute('hidden');
}