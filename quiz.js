// Run the quiz
function runQuiz(questions, endMessage) {
  let index = 0;
  const quizDiv = document.getElementById("quiz");
  quizDiv.innerHTML = "";

  function askQuestion() {
    if (index >= questions.length) {
      quizDiv.innerHTML = `<p>${endMessage}</p>`;
      return;
    }

    const q = questions[index];
    quizDiv.innerHTML = `
      <p>${q.question}</p>
      <input id="answer" type="text" placeholder="Escribe tu respuesta">
      <button id="submit">Submit</button>
      <p id="feedback"></p>
    `;

    const submitBtn = document.getElementById("submit");
    submitBtn.onclick = () => {
      const userAns = document.getElementById("answer").value.trim().toLowerCase();
      const correctAns = q.answer.toLowerCase();

      const feedback = document.getElementById("feedback");
      if (userAns === correctAns) {
        feedback.textContent = "✅ Correcto!";
      } else {
        feedback.textContent = `❌ Incorrecto. Respuesta correcta: ${q.answer}`;
      }

      index++;
      setTimeout(askQuestion, 1200);
    };
  }

  askQuestion();
}

// Button 1 → Numbers (1–10 etc.)
function startNumberQuiz() {
  fetch('data/numbers-1.json')
    .then(res => res.json())
    .then(data => runQuiz(data, "¡Quiz de Números (1–10) completo! 🎉"));
}

// Button 2 → History Years
function startYearQuiz() {
  fetch('data/history-years.json')
    .then(res => res.json())
    .then(data => runQuiz(data, "¡Quiz de Años Históricos completo! 🎉"));
}

// Button 3 → Quiz de Números (20–100 cultural)
function startTriviaQuiz() {
  fetch('data/numbers-20-100.json')
    .then(res => res.json())
    .then(data => runQuiz(data, "¡Quiz de Números completo! 🎉"));
}
