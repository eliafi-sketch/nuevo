/* -------------------------
   NUMBERS QUIZ
--------------------------*/
let numberSession = 0;
let numberQuestions = [];

async function loadNumberData() {
  const res1 = await fetch("data/numbers-1.json");
  const pool1 = await res1.json();
  const res2 = await fetch("data/numbers-2.json");
  const pool2 = await res2.json();

  numberQuestions = [pool1, pool2];
}

function startNumberQuiz() {
  const questions = [...numberQuestions[0]]; // just first pool to demo
  runQuiz(questions, "Numbers quiz complete! 🎉");
}


/* -------------------------
   HISTORY YEARS QUIZ
--------------------------*/
let yearQuestions = [];

async function loadYearData() {
  const res = await fetch("data/years.json");
  yearQuestions = await res.json();
}

function startYearQuiz() {
  runQuiz(yearQuestions, "History years quiz complete! 🎉");
}


/* -------------------------
   GENERIC QUIZ ENGINE
   (used by both quizzes)
--------------------------*/
let currentIndex = 0;
let currentQuestions = [];
let awaitingNext = false;
let endMessage = "";

function runQuiz(qs, message) {
  currentQuestions = shuffle(qs);
  currentIndex = 0;
  awaitingNext = false;
  endMessage = message;
  showQuestion();
}

function showQuestion() {
  const container = document.getElementById("quiz");
  container.innerHTML = "";

  const q = currentQuestions[currentIndex];

  const label = document.createElement("p");
  label.textContent = q.q ? q.q : `Translate: ${q.en}`;
  container.appendChild(label);

  const input = document.createElement("input");
  input.id = "answerBox";
  input.placeholder = "Type in Spanish...";
  container.appendChild(input);

  const feedback = document.createElement("p");
  feedback.id = "feedback";
  container.appendChild(feedback);

  const btn = document.createElement("button");
  btn.id = "submitBtn";
  btn.textContent = "Submit";
  btn.onclick = handleAnswer;
  container.appendChild(btn);

  input.focus();
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") handleAnswer();
  });
}

function handleAnswer() {
  const input = document.getElementById("answerBox");
  const feedback = document.getElementById("feedback");
  const btn = document.getElementById("submitBtn");

  const q = currentQuestions[currentIndex];

  if (!awaitingNext) {
    if (input.value.trim().toLowerCase() === q.es.toLowerCase()) {
      feedback.textContent = "✅ Correct!";
      feedback.style.color = "green";
    } else {
      feedback.textContent = `❌ Wrong (Correct: ${q.es})`;
      feedback.style.color = "red";
    }
    btn.textContent = "Next";
    awaitingNext = true;
  } else {
    currentIndex++;
    if (currentIndex < currentQuestions.length) {
      awaitingNext = false;
      showQuestion();
    } else {
      endQuiz();
    }
  }
}

function endQuiz() {
  const container = document.getElementById("quiz");
  container.innerHTML = `<p>${endMessage}</p>`;
}

// Utility shuffle
function shuffle(array) {
  return array.map(v => ({ v, r: Math.random() }))
              .sort((a, b) => a.r - b.r)
              .map(obj => obj.v);
}

// Load data
loadNumberData();
loadYearData();


// Load questions on page load
loadYearData();

