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
setText("totalAttempts", getNum("totalAttempts"));
setText("quizCount", QUIZZES.length);

if (false) {
  window.getDocs(window.collection(window.db, "attempts")).then(snapshot => {
    const attempts = snapshot.docs.map(doc => doc.data());
    const total = attempts.length;
    const emails = new Set(attempts.map(a => a.email).filter(Boolean));
    const avg = total ? Math.round(attempts.reduce((sum, a) => sum + Number(a.score || 0), 0) / total) : 0;

    setText("totalAttempts", total);
    setText("completedCount", total);
    setText("bestScore", total ? `${avg}% avg` : "—");
  });
}setText("totalAttempts", getNum("totalAttempts"));
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
