// Example vocab pool
const pools = {
  1: [
    { en: "nation", es: "nación" },
    { en: "convention", es: "convención" },
    { en: "education", es: "educación" },
    { en: "communication", es: "comunicación" },
    { en: "organization", es: "organización" }
  ]
};

// Show questions in the page
function showSession(sessionQs) {
  const container = document.getElementById("quiz");
  container.innerHTML = ""; // clear old questions

  sessionQs.forEach(q => {
    const div = document.createElement("div");
    div.textContent = q.en + " → ?";
    container.appendChild(div);
  });
}

// Generate one simple session of 5 questions
function generateSession(poolId) {
  return pools[poolId];
}

// Run first session
let session = generateSession(1);
showSession(session);
