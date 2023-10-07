// Select Elements
let countSpan = document.querySelector(".quiz-info .count span");

let bulletsArea = document.querySelector(".bullets .spans");

let qArea = document.querySelector(".quiz-area");

let ansArea = document.querySelector(".answers-area");

let submitButton = document.querySelector(".submit-button");

let bullets = document.querySelector(".bullets");

let results = document.querySelector(".results");

let countDownElement = document.querySelector(".countdown");

let currentIndex = 0;

let rightAnswers = 0;

let countDownInterval;

function getQuestions() {
  //
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    //
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);

      let questionsObject = JSON.parse(this.responseText);

      let qCount = questionsObject.length;

      // Create Bullets And Set Questions Count

      createBullets(qCount);

      // Add Question Data
      addQuestionData(questionsObject[currentIndex], qCount);

      countDown(30, qCount);

      // Click On Submit
      submitButton.onclick = () => {
        // Get Right Answer
        let rightAns = questionsObject[currentIndex].right_answer;

        // console.log(rightAns);

        // Increase Index
        currentIndex++;

        checkAnswer(rightAns, qCount);

        // Remove Previous Questions

        qArea.innerHTML = "";

        ansArea.innerHTML = "";

        // Add Next Question
        addQuestionData(questionsObject[currentIndex], qCount);

        // Handle Bullets Classes
        handleBullets();

        // Stop Countdown
        clearInterval(countDownInterval);

        // Start Countdown
        countDown(30, qCount);

        // Show Results
        showResults(qCount);
      };
    }
  };

  myRequest.open("GET", "html_questions.json", true);
  myRequest.send();
}

getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;

  // Create Spans
  for (let i = 0; i < num; i++) {
    let span = document.createElement("span");

    if (i == 0) {
      span.className = "on";
    }

    bulletsArea.appendChild(span);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    // Create H2 Element
    let h2 = document.createElement("h2");

    let Q = document.createTextNode(obj.title + " ?");

    h2.appendChild(Q);

    qArea.appendChild(h2);

    // Add Answers

    for (let i = 1; i < 5; i++) {
      //
      let answerDiv = document.createElement("div");

      answerDiv.className = `answer`;

      let radioButton = document.createElement("input");

      radioButton.setAttribute("type", "Radio");

      radioButton.setAttribute("name", "question");

      radioButton.setAttribute("id", `answer_${i}`);

      radioButton.dataset.answer = obj[`answer_${i}`];

      if (i == 1) {
        radioButton.setAttribute("checked", "");
      }

      let answerLabel = document.createElement("label");

      answerLabel.htmlFor = `answer_${i}`;

      let answerLabelText = document.createTextNode(obj[`answer_${i}`]);

      answerLabel.appendChild(answerLabelText);

      answerDiv.appendChild(radioButton);

      answerDiv.appendChild(answerLabel);

      ansArea.appendChild(answerDiv);
    }
  }
}

function checkAnswer(right_answer, qCount) {
  let answers = document.getElementsByName("question");

  console.log(answers);

  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }

  if (theChoosenAnswer === right_answer) {
    rightAnswers++;
    console.log("Good Answer");
  }
}

function handleBullets() {
  let bulletsSpan = document.querySelectorAll(".bullets .spans span");

  let arrayOfSpans = Array.from(bulletsSpan);

  arrayOfSpans.forEach((span, index) => {
    if (index == currentIndex) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResults;

  if (currentIndex === count) {
    qArea.remove();
    ansArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      results.innerHTML = `<span class = "good">Good</span> You Answered ${rightAnswers} Answers From ${count}`;
    } else if (rightAnswers === count) {
      results.innerHTML = `<span class = "perfect">Perfect</span> You Answered ${rightAnswers} Answers From ${count}`;
    } else if (rightAnswers < count / 2) {
      results.innerHTML = `<span class = "bad">Bad</span> You Answered ${rightAnswers} Answers From ${count}`;
    }
  }
}

function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countDownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countDownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countDownInterval);

        submitButton.click();
      }
    }, 1000);
  }
}
