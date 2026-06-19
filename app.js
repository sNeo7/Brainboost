import { db, collection, getDocs } from "./firebase.js";
function getNum(key) {
  return parseInt(localStorage.getItem(key) || "0", 10);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function quizAttempts(id) {
  return getNum(`attempts_${id}`);
}

function renderHome() {
  setText("quizCount", QUIZZES.length);

  getDocs(collection(db, "attempts")).then(snapshot => {
    const attempts = snapshot.docs.map(doc => doc.data());

    const totalTaken = attempts.length;
    const users = new Set(attempts.map(a => a.email).filter(Boolean)).size;
    const averageScore = totalTaken
      ? Math.round(attempts.reduce((sum, a) => sum + Number(a.score || 0), 0) / totalTaken)
      : 0;

    setText("totalAttempts", totalTaken);
    setText("completedCount", users);
    setText("bestScore", totalTaken ? `${averageScore}% avg` : "—");
  });

  const grid = document.getElementById("quizGrid");
  if (!grid) return;

  grid.innerHTML = QUIZZES.map(quiz => `
    <article class="quiz-card">
      <div class="quiz-card-top">
        <span class="tag">${quiz.category}</span>
        <span class="difficulty">${quiz.difficulty}</span>
      </div>
      <h3>${quiz.title}</h3>
      <p>${quiz.description}</p>
      <div class="quiz-meta">
        <span>${quiz.questions.length} questions</span>
        <span>${quizAttempts(quiz.id)} attempts</span>
      </div>
      <a class="button primary full" href="quiz.html?id=${quiz.id}">Start test</a>
    </article>
  `).join("");
}

renderHome();
