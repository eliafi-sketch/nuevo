let sessionNumber = 0; 
let currentData1 = [];
let currentData2 = [];
let questions = [];
let currentIndex = 0;
let awaitingNext = false; // toggle between checking vs next

// Load JSON files
async function loadData() {
  const res1 = await fetch("data/numbers-1.json");
  currentData1 = await res1.json();

  const res2 = await fetch("data/numbers-2.json");
  currentData2 = await res2.json();
}

// Ratios for progression
const ratios = [
  { old: 1.0, next: 0.0 },
  { old: 0.8, next: 0.2 },
  { old: 0.6, next: 0.4 },
  { old: 0.4, next: 0.6 },
  { old: 0.2, next: 0.8 },
  { old: 0.0, next: 1.0 }
];

// Random sample
function sample(array, n) {
  const copy = [...array];
  const result = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy[idx]);
    copy.splice(idx, 1);
  }
  return result;
}

// Generate 10-question session
function generateSession(sessionNum) {
  const ratio = ratios[Math.min(sessionNum, ratios.length - 1)];
  const oldCount = Math.round(10 * ratio.old);
  const newCount = 10 - oldCount;

  const oldQs = sample(currentData1, oldCount);
  const newQs = sample(currentData2, newCount);

  return shuffle([...oldQs, ...newQs]);
}

// Shuffle
function shuffle(array) {
  return array.map(v => ({ v, r: Math.random() }))
              .sort((a, b) => a.r - b.r)
              .map(obj => obj.v);
}

// Start a new quiz session
function startQuiz() {
  questions = generateSession(sessionNumber);
  currentIndex = 0;
  awaitingNext = false;
  showQuestion();
}

// Show current question
function showQuestion() {
  const container = document.getElementById("quiz");
  container.innerHTML = "";

  const q = questions[currentIndex];

  const label = document.createElement("p");
  label.textContent = `Translate: ${q.en}`;
  container.appendChild(label);

  const input = document.createElement("input");
  input.id = "answerBox";
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

  // allow Enter key to submit
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") handleAnswer();
  });
}

// Handle submit/next logic
function handleAnswer() {
  const input = document.getElementById("answerBox");
  const feedback = document.getElementById("feedback");
  const btn = document.getElementById("submitBtn");

  const q = questions[currentIndex];

  if (!awaitingNext) {
    // Check answer
    if (input.value.trim().toLowerCase() === q.es.toLowerCase()) {
      feedback.textContent = "✅ Correct!";
      feedback.style.color = "green";
    } else {
      feedback.textContent = `❌ Wrong (Answer: ${q.es})`;
      feedback.style.color = "red";
    }
    btn.textContent = "Next";
    awaitingNext = true;
  } else {
    // Move to next question
    currentIndex++;
    if (currentIndex < questions.length) {
      awaitingNext = false;
      showQuestion();
    } else {
      endSession();
    }
  }
}

// End of session
function endSession() {
  const container = document.getElementById("quiz");
  container.innerHTML = "<p>Session complete! 🎉</p>";

  sessionNumber++; // unlock next progression
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Start Next Session";
  nextBtn.onclick = startQuiz;
  container.appendChild(nextBtn);
}

// Load the data once the page starts
loadData();

let yearQuestions = [];
let currentIndex = 0;
let awaitingNext = false;

// Load JSON data
async function loadYearData() {
  const res = await fetch("data/years.json");
  yearQuestions = await res.json();
}

// Start quiz
function startQuiz() {
  currentIndex = 0;
  awaitingNext = false;
  showYearQuestion();
}

// Show one question
function showYearQuestion() {
  const container = document.getElementById("quiz");
  container.innerHTML = "";

  const q = yearQuestions[currentIndex];

  const label = document.createElement("p");
  label.textContent = q.q;
  container.appendChild(label);

  const input = document.createElement("input");
  input.id = "answerBox";
  input.placeholder = "Type year in Spanish...";
  container.appendChild(input);

  const feedback = document.createElement("p");
  feedback.id = "feedback";
  container.appendChild(feedback);

  const btn = document.createElement("button");
  btn.id = "submitBtn";
  btn.textContent = "Submit";
  btn.onclick = handleYearAnswer;
  container.appendChild(btn);

  input.focus();
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") handleYearAnswer();
  });
}

// Handle answer check
function handleYearAnswer() {
  const input = document.getElementById("answerBox");
  const feedback = document.getElementById("feedback");
  const btn = document.getElementById("submitBtn");

  const q = yearQuestions[currentIndex];

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
    if (currentIndex < yearQuestions.length) {
      awaitingNext = false;
      showYearQuestion();
    } else {
      endYearQuiz();
    }
  }
}

// End of quiz
function endYearQuiz() {
  const container = document.getElementById("quiz");
  container.innerHTML = "<p>Quiz complete! 🎉</p>";
}

// Load questions on page load
loadYearData();

