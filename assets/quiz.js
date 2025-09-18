// Simple spaced-repetition quiz. Data at /quiz.json. State in localStorage.
const STATE_KEY = 'jagentic_quiz_state_v1';
const panel = document.getElementById('quiz-panel');
const loadJSON = async (p) => (await fetch(p, { cache:'no-store' })).json();

function render(state) {
  const q = state.queue[state.index];
  panel.innerHTML = `
    <div class="meta">Items: ${state.queue.length} • Correct: ${state.correct} • Wrong: ${state.wrong}
      • <a href="#" id="reset">reset</a></div>
    <div class="q">${q.question}</div>
    <form id="form" class="choices">
      ${q.choices.map((c,i)=>`<label><input type="radio" name="c" value="${i}"> ${c}</label>`).join('')}
      <button id="submit" type="submit">Check</button>
    </form>
    <div id="explain" class="meta"></div>
  `;
  panel.querySelector('#reset').onclick = (e)=>{e.preventDefault(); localStorage.removeItem(STATE_KEY); location.reload();};
  panel.querySelector('#form').onsubmit = (e)=>{
    e.preventDefault();
    const sel = new FormData(e.target).get('c');
    if (sel == null) return;
    const ok = Number(sel) === q.answer;
    panel.querySelector('#explain').textContent = ok ? 'Correct.' : `Wrong. ${q.explain||''}`;
    if (ok) state.correct++;
    else { state.wrong++; state.queue.push(q); } // re-queue wrong
    state.index++;
    if (state.index >= state.queue.length) {
      panel.innerHTML = `<p>Done. Score: ${state.correct}/${state.queue.length}.</p>
        <div class="meta">Refresh or reset to try again.</div>`;
      localStorage.removeItem(STATE_KEY);
    } else {
      localStorage.setItem(STATE_KEY, JSON.stringify(state));
      setTimeout(()=>render(state), 400);
    }
  };
}

(async () => {
  const saved = localStorage.getItem(STATE_KEY);
  const data = await loadJSON('quiz.json');
  const queue = data.items.map((x,i)=>({ ...x, _i:i }));
  const state = saved ? JSON.parse(saved) : { queue, index:0, correct:0, wrong:0 };
  render(state);
})();
