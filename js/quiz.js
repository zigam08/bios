
const questions = window.quizData || [];
let current = 0;
let answers = Array(questions.length).fill(null);

const quizEl = document.getElementById('quiz');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progress = document.getElementById('progress');
const progressBar = document.getElementById('progress-bar');
const scoreLive = document.getElementById('score-live');
const resultEl = document.getElementById('result');
const restartBtn = document.getElementById('restart');

function score() {
  return answers.reduce((sum, answer, i) => sum + (answer === questions[i].correct ? 1 : 0), 0);
}
function render() {
  const item = questions[current];
  progress.textContent = `Vprašanje ${current + 1} / ${questions.length}`;
  progressBar.style.width = `${((current + 1) / questions.length) * 100}%`;
  scoreLive.textContent = `${score()} točk`;
  prevBtn.disabled = current === 0;
  nextBtn.textContent = current === questions.length - 1 ? 'Zaključi kviz' : 'Naprej';

  quizEl.innerHTML = `
    <div class="question">
      <div class="question-number">VPRAŠANJE ${current + 1}</div>
      <h2>${item.q}</h2>
      <div class="answers">
        ${item.a.map((answer, i) => `<button class="answer ${answers[current] === i ? 'selected' : ''}" data-index="${i}">${String.fromCharCode(65+i)}) ${answer}</button>`).join('')}
      </div>
    </div>`;
  document.querySelectorAll('.answer').forEach(btn => {
    btn.addEventListener('click', () => {
      answers[current] = Number(btn.dataset.index);
      render();
    });
  });
}
nextBtn.addEventListener('click', () => {
  if (answers[current] === null) {
    alert('Najprej izberi odgovor.');
    return;
  }
  if (current < questions.length - 1) {
    current++;
    render();
  } else {
    finish();
  }
});
prevBtn.addEventListener('click', () => {
  if (current > 0) {
    current--;
    render();
  }
});
function finish() {
  const points = score();
  const percent = Math.round(points / questions.length * 100);
  quizEl.hidden = true;
  document.querySelector('.quiz-actions').hidden = true;
  resultEl.hidden = false;
  resultEl.innerHTML = `<h2>${points} / ${questions.length}</h2><p>Uspešnost: <strong>${percent}%</strong></p><p>${percent >= 90 ? 'Odlično! BIOS res dobro poznaš.' : percent >= 70 ? 'Zelo dobro! Še malo vaje in boš obvladal vse.' : percent >= 50 ? 'Dobro, vendar lahko znanje še izboljšaš.' : 'Ponovi gradivo in poskusi še enkrat.'}</p>`;
  restartBtn.hidden = false;
}
restartBtn.addEventListener('click', () => {
  current = 0;
  answers = Array(questions.length).fill(null);
  quizEl.hidden = false;
  document.querySelector('.quiz-actions').hidden = false;
  resultEl.hidden = true;
  restartBtn.hidden = true;
  render();
});
render();
