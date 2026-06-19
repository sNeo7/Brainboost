const params = new URLSearchParams(window.location.search);
const quizId = params.get("id") || "sleep";
const quiz = QUIZZES.find(q => q.id === quizId) || QUIZZES[0];

let email = "";
let current = 0;
let score = 0;
let selected = null;
let review = [];

const emailGate = document.getElementById("emailGate");
const quizPanel = document.getElementById("quizPanel");
const resultPanel = document.getElementById("resultPanel");

document.getElementById("gateTitle").textContent = quiz.title;
document.getElementById("quizTitle").textContent = quiz.title;
document.getElementById("quizCategory").textContent = quiz.category;
document.getElementById("totalQuestions").textContent = quiz.questions.length;

document.getElementById("startBtn").addEventListener("click", startQuiz);
document.getElementById("nextBtn").addEventListener("click", nextQuestion);
document.getElementById("retakeBtn").addEventListener("click", () => {
  window.location.href = `quiz.html?id=${quiz.id}`;
});

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function startQuiz() {
  const input = document.getElementById("emailInput");
  const error = document.getElementById("emailError");
  email = input.value.trim();

  if (!validEmail(email)) {
    error.textContent = "Enter a valid email before starting.";
    return;
  }

  localStorage.setItem("lastEmail", email);
  error.textContent = "";
  emailGate.classList.add("hidden");
  quizPanel.classList.remove("hidden");
  showQuestion();
}

function showQuestion() {
  selected = null;
  const q = quiz.questions[current];
  document.getElementById("currentQuestion").textContent = current + 1;
  document.getElementById("questionText").textContent = q.q;
  document.getElementById("progressFill").style.width = `${(current / quiz.questions.length) * 100}%`;

  const answers = document.getElementById("answers");
  answers.innerHTML = q.options.map((option, index) => `
    <button class="answer" data-index="${index}">${option}</button>
  `).join("");

  document.querySelectorAll(".answer").forEach(btn => {
    btn.addEventListener("click", () => selectAnswer(parseInt(btn.dataset.index, 10), btn));
  });

  document.getElementById("nextBtn").classList.add("hidden");
}

function selectAnswer(index, btn) {
  if (selected !== null) return;

  selected = index;
  const q = quiz.questions[current];
  const correct = index === q.answer;
  if (correct) score++;

  review.push({
    question: q.q,
    chosen: q.options[index],
    correct: q.options[q.answer],
    explanation: q.explanation,
    wasCorrect: correct
  });

  document.querySelectorAll(".answer").forEach(button => {
    const i = parseInt(button.dataset.index, 10);
    if (i === q.answer) button.classList.add("correct");
    if (i === index && i !== q.answer) button.classList.add("wrong");
    button.disabled = true;
  });

  document.getElementById("nextBtn").classList.remove("hidden");
}

function nextQuestion() {
  current++;
  if (current < quiz.questions.length) {
    showQuestion();
  } else {
    finishQuiz();
  }
}

function getNum(key) {
  return parseInt(localStorage.getItem(key) || "0", 10);
}

function finishQuiz() {
  const percentage = Math.round((score / quiz.questions.length) * 100);

if (window.db && window.addDoc && window.collection) {
  window.addDoc(window.collection(window.db, "attempts"), {
    quiz: quiz.title,
    quizId: quiz.id,
    email: email,
    score: percentage,
    date: new Date().toISOString()
  });
}

  const history = JSON.parse(localStorage.getItem("attemptHistory") || "[]");
  history.push({
    quiz: quiz.title,
    quizId: quiz.id,
    email,
    score: percentage,
    date: new Date().toISOString()
  });
  localStorage.setItem("attemptHistory", JSON.stringify(history));

  document.getElementById("progressFill").style.width = "100%";
  quizPanel.classList.add("hidden");
  resultPanel.classList.remove("hidden");

  document.getElementById("scoreNumber").textContent = percentage;
  document.getElementById("resultMessage").textContent =
    percentage >= 80 ? "Strong score. Share it and challenge someone else." :
    percentage >= 50 ? "Decent. Review the explanations and retake it." :
    "Weak result. Review the explanations before pretending you know this.";

  document.getElementById("reviewBox").innerHTML = review.map((item, idx) => `
    <div class="review-item ${item.wasCorrect ? "review-correct" : "review-wrong"}">
      <strong>${idx + 1}. ${item.question}</strong>
      <p>Your answer: ${item.chosen}</p>
      <p>Correct answer: ${item.correct}</p>
      <p class="muted">${item.explanation}</p>
    </div>
  `).join("");
}
