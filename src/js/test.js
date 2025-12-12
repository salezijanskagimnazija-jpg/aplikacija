let test = {
    1: {
        question: "Question 1?",
        answers: {
            a: "Answer A",
            b: "Answer B",
            c: "Answer C",
            d: "Answer D",
        },
        correct_answer: "a",
    },
};

let start_test = function() {
    console.log("Starting test.")
    for (let question_index in test) {
        console.log(question_index);
        console.log("Full question object:", test[question_index]); // Debug: see the whole object

        let template = document.getElementById("question_template");
        let clone = template.content.cloneNode(true);

        let question_form = clone.querySelector(".question_form");
        question_form.id = "question_1";

        let question_title = clone.querySelector(".question_title");
        question_title.innerHTML = "Question " + question_index;

        let question_question = clone.querySelector(".question_question");
        question_question.innerHTML = test[question_index].question;

        document.body.appendChild(clone);
    }
};

document.getElementById("start-btn").addEventListener("click", start_test);