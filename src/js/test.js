// test class
class Test {
    // Static property to hold the single instance
    static #instance = null;

    constructor(time, questions) {
        // If an instance already exists, return it
        if (Test.#instance) {
            return Test.#instance;
        };

        // Otherwise initialize normally
        this.time = time;
        this.questions = questions;

        // Bind methods to preserve 'this' context
        this.generate = this.generate.bind(this);
        this.timer = this.timer.bind(this);
        this.time_over = this.time_over.bind(this);

        // Save this instance for future checks
        Test.#instance = this;

        this.generate();
        this.timer(this.time_over);
    };

    static instanceExists() {
        return Test.#instance !== null;
    };

    // function for dynamically generating test questions
    generate = function() {
        console.log("Generating test...");

        // loops over all the questions in the test object
        for (let question_index in this.questions) {

            const question_data = this.questions[question_index];
            const template = document.getElementById("question_template");
            const clone = template.content.cloneNode(true);
            const form = clone.querySelector(".question_form");
            const title = clone.querySelector(".question_title");
            const question = clone.querySelector(".question_question");

            form.id = "question_" + question_index;
            title.textContent = "Question " + question_index;
            question.innerHTML = question_data.question;

            const labels = clone.querySelectorAll(".question_answer");
            for (let i = 0; i < labels.length; i++) {
                clone.getElementById("qn" + i).setAttribute("name", "question_" + question_index);
                labels[i].textContent = question_data.answers[i];
            }

            document.body.appendChild(clone);
        };
    };

    // function that creates and manages the timer
    timer = function(time_over) {
        console.log("Starting timer.")

        let total_time = this.time;

        let minutes = Math.floor(total_time/60);
        let seconds = total_time%60;
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        console.log("Remaining time: " + minutes + ":" + seconds);

        let timer = document.getElementById("timer");
        timer.innerHTML = minutes +":" + seconds;

        timer.classList.remove("hidden");

        let timer_interval = setInterval(function() {
            total_time--;
            minutes = Math.floor(total_time/60);
            seconds = total_time%60;
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            console.log("Remaining time: " + minutes + ":" + seconds);

            timer = document.getElementById("timer");
            timer.innerHTML = minutes + ":" + seconds;

            if (total_time <= 0) {
                time_over(timer_interval);
            }
        }, 1000)
    }

    // function that executes when the time runs out
    time_over = function(timer_interval) {
        console.log("Time's up!")

        console.log("Disabling radios...")
        let radios = document.querySelectorAll('input[type="radio"');
        for (let i = 0; i < radios.length; i++) {
            radios[i].disabled = true;
        }

        console.log("Calculating score...");
        // checks answers
        let selected_value = null;
        let correct_answers = 0;
        for (let question_iterator = 1; question_iterator <= Object.keys(this.questions).length; question_iterator++) {
            let radios = document.querySelectorAll("input[name=question_" + question_iterator + "]"); 
            console.log("Question: " + question_iterator)
            console.log(radios);
            selected_value = null;
            for (let radio_iterator = 0; radio_iterator < radios.length; radio_iterator++) {
                console.log(radios[radio_iterator])
                if (radios[radio_iterator].checked) {
                    console.log(radios[radio_iterator] + " was checked");
                    selected_value = radios[radio_iterator].value;
                }
            }

            console.log("Selected:" + selected_value + " for question number " + question_iterator)
            correct_answers += (selected_value == this.questions[question_iterator].correct_answer);
        }

        let score = correct_answers + "/" + Object.keys(this.questions).length;
        console.log("Correct answers: " + score);

        console.log("Displaying score...");
        document.getElementById("score").innerHTML = score;
        document.getElementById("score-container").classList.remove("hidden");
        // ends the timer
        clearInterval(timer_interval);
    };
};

async function fetch_data(test_index) {
    console.log("Fetching data...")

    let path = "data/test" + test_index + ".json";
    console.log("Test path is: " + path)
    
    let test_data = await fetch(path)
        .then(response => response.json())
        .then(data => {
        let test = data["test"];
        console.log("Fetched: ")
        console.log(test);
        return test
    });

    return test_data;
};

// main function that runs when the test is started
async function start_test() {
    // hide existing button
    document.getElementById("start-btn").setAttribute("hidden", true);

    // start function only if no under Test instance exists
    if (Test.instanceExists()) {
        console.log("An instance of Test already exists...");
    } else {
        console.log("Retrieving test index...")
        let test_index = localStorage.getItem("test_index");

        console.log("Starting test " + test_index + "...");

        let test_data = await fetch_data(test_index);

        console.log("Fetching over:")
        console.log(test_data);

        console.log("Creating the new Test object...")
        const _test = new Test(test_data["time"], test_data["questions"]);
    };
};

document.getElementById("start-btn").addEventListener("click", start_test);