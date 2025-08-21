let sessionNumber = 0; // track progression
let currentData1 = [];
let currentData2 = [];

// Load JSON files
async function loadData() {
  const res1 = await fetch("data/numbers-1.json");
  currentData1 = await res1.json();

  const res2 = await fetch("data/numbers-2.json");
  currentData2 = await res2.json();
}

// Helper: random pick
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

// Ratios for progression
const ratios = [
  { old: 1.0, next: 0.0 },
  { old: 0.8, next: 0.2 },
  { old: 0.6, next: 0.4 },
  { old: 0.4, next: 0.6 },
  { old: 0.2, next: 0.8 },
  { old: 0.0, next: 1.0 }
];

// Generate a session of 10 questions
function generateSession(sessionNum) {
  const ratio = ratios[Math.min(sessionNum, ratios.length - 1)];

  const oldCount = Math.round(10 * ratio.old);
  const newCount = 10 - oldCount;

  const oldQs = sample(currentData1, oldCount);
  const newQs = sample(currentData2, newCount);

  return [...oldQs, ...newQs];
}

// Render quiz
function startQuiz() {
  const questions = generateSession(sessionNumber);
  const container = document.getElementById("quiz");
  container.innerHTML = "";

  questions.forEach(q => {
    const div = document.createElement("div");
    const label = document.createElement("label");
    label.textContent = `${q.en} → `;
    const input = document.createElement("input");
    input.dataset.answer = q.es;
    div.appendChild(label);
    div.appendChild(input);
    container.appendChild(div);
  });

  const btn = document.createElement("button");
  btn.textContent = "Submit";
  btn.onclick = () => checkAnswers(questions);
  container.appendChild(btn);
}

// Check answers
function checkAnswers(questions) {
  const inputs = document.querySelectorAll("#quiz input");
  let correct = 0;

  inputs.forEach(input => {
    if (input.value.trim().toLowerCase() === input.dataset.answer.toLowerCase()) {
      correct++;
      input.style.borderColor = "green";
    } else {
      input.style.borderColor = "red";
    }
  });

  const result = document.getElementById("result");
  result.textContent = `You got ${correct} / ${questions.length}`;

  if (correct === questions.length) {
    sessionNumber++;
    result.textContent += " ✅ Perfect! Next set unlocked.";
  }
}

// Load data when page starts
loadData();



