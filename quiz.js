// Pools of numbers
const pools = {
  1: Array.from({ length: 10 }, (_, i) => i + 1),   // 1–10
  2: Array.from({ length: 10 }, (_, i) => i + 11),  // 11–20
};

// Ratios for progression (old pool vs next pool)
const ratios = [
  { old: 1.0, next: 0.0 }, // 10 old
  { old: 0.8, next: 0.2 }, // 8 old, 2 new
  { old: 0.6, next: 0.4 },
  { old: 0.4, next: 0.6 },
  { old: 0.2, next: 0.8 },
  { old: 0.0, next: 1.0 }  // all new
];

let sessionNumber = 0; // track progression

// Random sampler
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

// Shuffle utility
function shuffle(array) {
  return array.map(v => ({ v, r: Math.random() }))
              .sort((a, b) => a.r - b.r)
              .map(obj => obj.v);
}

// Generate a quiz session
function generateSession(sessionNum) {
  const ratio = ratios[Math.min(sessionNum, ratios.length - 1)];

  const oldCount = Math.round(10 * ratio.old);
  const newCount = 10 - oldCount;

  const oldQs = sample(pools[1], oldCount);
  const newQs = sample(pools[2], newCount);

  return shuffle([...oldQs, ...newQs]);
}

// Render quiz
function startQuiz() {
  const questions = generateSession(sessionNumber);
  const container = document.getElementById("quiz");
  container.innerHTML = "";

  questions.forEach(num => {
    const input = document.createElement("input");
    input.placeholder = `Spanish for ${num}`;
    input.dataset.answer = num; // expected answer (just for demo)
    container.appendChild(input);
    container.appendChild(document.createElement("br"));
  });

  const btn = document.createElement("button");
  btn.textContent = "Submit";
  btn.onclick = () => checkAnswers(container, questions);
  container.appendChild(btn);
}

// Check answers (simple — expects same number typed in)
function checkAnswers(container, questions) {
  const inputs = container.querySelectorAll("input");
  let correct = 0;

  inputs.forEach(input => {
    if (input.value.trim() === input.dataset.answer) {
      correct++;
      input.style.borderColor = "green";
    } else {
      input.style.borderColor = "red";
    }
  });

  const result = document.getElementById("result");
  result.textContent = `You got ${correct} / ${questions.length} correct`;

  if (correct === questions.length) {
    sessionNumber++;
    result.textContent += " ✅ Perfect! Next set unlocked.";
  }
}


