(function(){
  const QUESTION_TIME = 60;
  const DEFAULT_MODE = 'biz';
  const questionTextEl = document.getElementById('questionText');
  const choicesEls = Array.from(document.querySelectorAll('.choice'));
  const choiceTextEls = choicesEls.map(choice => choice.querySelector('.text'));
  const timeEl = document.getElementById('time');
  const progressEl = document.getElementById('progress-text');
  const summaryEl = document.getElementById('summary');
  const scoreEl = document.getElementById('score');
  const totalEl = document.getElementById('total');
  const explanationsListEl = document.getElementById('explanationsList');
  const playAgainBtn = document.getElementById('playAgainBtn');
  const exportBtn = document.getElementById('exportResultsBtn');
  const clearBtn = document.getElementById('clearLocalBtn');
  const fiftyBtn = document.getElementById('lifeline5050');
  const skipBtn = document.getElementById('lifelineSkip');
  const mediaFigure = document.getElementById('questionMedia');
  const mediaImg = document.getElementById('questionImage');
  const mediaNote = document.getElementById('questionMediaNote');
  const MEDIA_FALLBACK_MSG = 'Portrait preview unavailable.';

  const state = {
    mode: DEFAULT_MODE,
    packId: '',
    questions: [],
    index: 0,
    score: 0,
    remaining: QUESTION_TIME,
    timerId: null,
    locked: false,
    answers: [],
    lifelines: { fifty: false, skip: false },
    questionStart: 0
  };

  function hideMedia(){
    if(!mediaFigure) return;
    mediaFigure.classList.add('hidden');
    mediaFigure.classList.remove('fallback');
    mediaFigure.setAttribute('aria-hidden', 'true');
    mediaFigure.dataset.state = 'hidden';
    if(mediaImg){
      mediaImg.removeAttribute('src');
      mediaImg.alt = '';
    }
    if(mediaNote){
      mediaNote.hidden = true;
      mediaNote.textContent = MEDIA_FALLBACK_MSG;
    }
  }

  function showMedia(){
    if(!mediaFigure) return;
    mediaFigure.classList.remove('hidden');
    mediaFigure.classList.remove('fallback');
    mediaFigure.setAttribute('aria-hidden', 'false');
    mediaFigure.dataset.state = 'image';
    if(mediaNote){
      mediaNote.hidden = true;
      mediaNote.textContent = MEDIA_FALLBACK_MSG;
    }
  }

  function applyMediaFallback(message){
    if(!mediaFigure) return;
    const note = message || MEDIA_FALLBACK_MSG;
    mediaFigure.classList.remove('hidden');
    mediaFigure.classList.add('fallback');
    mediaFigure.setAttribute('aria-hidden', 'false');
    mediaFigure.dataset.state = 'fallback';
    if(mediaImg){
      mediaImg.removeAttribute('src');
      mediaImg.alt = '';
    }
    if(mediaNote){
      mediaNote.hidden = false;
      mediaNote.textContent = note;
    }
  }

  if(mediaImg){
    mediaImg.addEventListener('load', () => {
      if(mediaFigure){
        mediaFigure.classList.remove('fallback');
        mediaFigure.classList.remove('hidden');
        mediaFigure.setAttribute('aria-hidden', 'false');
        mediaFigure.dataset.state = 'image';
      }
      if(mediaNote){
        mediaNote.hidden = true;
      }
    });
    mediaImg.addEventListener('error', () => {
      applyMediaFallback(MEDIA_FALLBACK_MSG);
    });
  }

  function hideSummary(){
    summaryEl.classList.add('hidden');
  }

  function showSummary(){
    summaryEl.classList.remove('hidden');
  }

  function resetStateForRun(){
    state.index = 0;
    state.score = 0;
    state.answers = [];
    state.lifelines = { fifty: false, skip: false };
    state.locked = false;
    updateLifelineButtons();
    hideSummary();
    updateProgress();
  }

  function updateProgress(){
    const total = state.questions.length || 1;
    const current = Math.min(state.index + 1, total);
    progressEl.textContent = `Q ${current} / ${total}`;
    totalEl.textContent = total;
    scoreEl.textContent = state.score;
  }

  function updateTimerDisplay(){
    timeEl.textContent = String(state.remaining);
  }

  function clearTimer(){
    if(state.timerId){
      clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function startTimer(){
    clearTimer();
    state.remaining = QUESTION_TIME;
    updateTimerDisplay();
    state.timerId = setInterval(() => {
      state.remaining -= 1;
      if(state.remaining <= 0){
        state.remaining = 0;
        updateTimerDisplay();
        clearTimer();
        handleTimeout();
      } else {
        updateTimerDisplay();
      }
    }, 1000);
  }

  function resetChoiceStyles(){
    choicesEls.forEach(choice => {
      choice.disabled = false;
      choice.classList.remove('correct', 'wrong', 'eliminated');
    });
  }

  function updateLifelineButtons(){
    fiftyBtn.disabled = state.lifelines.fifty;
    fiftyBtn.setAttribute('aria-pressed', String(state.lifelines.fifty));
    skipBtn.disabled = state.lifelines.skip;
    skipBtn.setAttribute('aria-pressed', String(state.lifelines.skip));
  }

  function updateMedia(question){
    if(question.type === 'picture_mcq' && question.image){
      showMedia();
      if(mediaImg){
        if(mediaImg.src !== question.image){
          mediaImg.src = question.image;
        } else if(mediaFigure){
          mediaFigure.dataset.state = mediaFigure.dataset.state || 'image';
        }
        mediaImg.alt = question.alt || 'Portrait photo.';
      }
      if(mediaNote){
        mediaNote.hidden = true;
      }
    } else {
      hideMedia();
    }
  }

  function renderQuestion(){
    const question = state.questions[state.index];
    if(!question){
      finishQuiz();
      return;
    }
    state.locked = false;
    questionTextEl.textContent = question.question;
    questionTextEl.dataset.type = question.type;
    questionTextEl.dataset.category = question.category;
    updateMedia(question);
    resetChoiceStyles();
    choicesEls.forEach((choice, idx) => {
      const text = question.choices[idx] ?? '';
      choice.dataset.index = idx;
      choiceTextEls[idx].textContent = text;
    });
    updateProgress();
    state.questionStart = performance.now();
    startTimer();
  }

  function recordAnswer(entry){
    state.answers.push(entry);
  }

  function lockChoices(){
    state.locked = true;
    choicesEls.forEach(choice => choice.disabled = true);
  }

  function evaluateSelection(selectedIdx, reason){
    const question = state.questions[state.index];
    const correctIdx = Number(question.answer_index);
    const elapsed = Math.round(Math.max(0, (performance.now() - state.questionStart) / 1000));
    const selectedButton = typeof selectedIdx === 'number' ? choicesEls[selectedIdx] : null;
    const correctButton = choicesEls[correctIdx];
    if(selectedButton && selectedIdx === correctIdx){
      selectedButton.classList.add('correct');
    } else {
      if(selectedButton){ selectedButton.classList.add('wrong'); }
      correctButton.classList.add('correct');
    }
    const entry = {
      id: question.id,
      mode: state.mode,
      pack_id: state.packId,
      correct: selectedIdx === correctIdx,
      selected: selectedIdx,
      correct_index: correctIdx,
      reason,
      elapsed_seconds: elapsed,
      question: question.question,
      choices: question.choices,
      type: question.type,
      image: question.image || null,
      explanation: question.explain || ''
    };
    if(entry.correct){
      state.score += 1;
    }
    recordAnswer(entry);
    scoreEl.textContent = state.score;
  }

  function nextQuestion(){
    state.index += 1;
    if(state.index >= state.questions.length){
      finishQuiz();
    } else {
      renderQuestion();
    }
  }

  function handleAnswer(selectedIdx){
    if(state.locked) return;
    clearTimer();
    lockChoices();
    evaluateSelection(selectedIdx, 'answered');
    updateProgress();
    setTimeout(() => nextQuestion(), 1000);
  }

  function handleTimeout(){
    if(state.locked) return;
    lockChoices();
    evaluateSelection(null, 'timeout');
    updateProgress();
    setTimeout(() => nextQuestion(), 1000);
  }

  function performSkip(){
    if(state.locked || state.lifelines.skip) return;
    state.lifelines.skip = true;
    updateLifelineButtons();
    clearTimer();
    const question = state.questions[state.index];
    const elapsed = Math.round(Math.max(0, (performance.now() - state.questionStart) / 1000));
    recordAnswer({
      id: question.id,
      mode: state.mode,
      pack_id: state.packId,
      correct: false,
      selected: null,
      correct_index: Number(question.answer_index),
      reason: 'skipped',
      elapsed_seconds: elapsed,
      question: question.question,
      choices: question.choices,
      type: question.type,
      image: question.image || null,
      explanation: question.explain || ''
    });
    state.index += 1;
    if(state.index >= state.questions.length){
      finishQuiz();
    } else {
      renderQuestion();
    }
  }

  function performFifty(){
    if(state.locked || state.lifelines.fifty) return;
    const question = state.questions[state.index];
    const correctIdx = Number(question.answer_index);
    const wrongIndices = [0,1,2,3].filter(idx => idx !== correctIdx);
    for(let i = wrongIndices.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [wrongIndices[i], wrongIndices[j]] = [wrongIndices[j], wrongIndices[i]];
    }
    wrongIndices.slice(0, 2).forEach(idx => {
      const btn = choicesEls[idx];
      btn.disabled = true;
      btn.classList.add('eliminated');
    });
    state.lifelines.fifty = true;
    updateLifelineButtons();
  }

  function finishQuiz(){
    clearTimer();
    state.locked = true;
    updateProgress();
    renderSummary();
    showSummary();
  }

  function renderSummary(){
    scoreEl.textContent = state.score;
    totalEl.textContent = state.questions.length;
    explanationsListEl.innerHTML = '';
    state.answers.forEach((answer, idx) => {
      const li = document.createElement('li');
      const question = answer.question;
      const correctChoice = answer.choices[answer.correct_index];
      const summaryText = document.createElement('p');
      summaryText.textContent = `${idx + 1}. ${question}`;
      const detail = document.createElement('p');
      detail.className = 'explanation-text';
      detail.textContent = `Correct: ${correctChoice}. ${answer.explanation}`;
      li.appendChild(summaryText);
      li.appendChild(detail);
      explanationsListEl.appendChild(li);
    });
  }

  function exportResults(){
    if(!state.answers.length) return;
    const payload = {
      exported_at: new Date().toISOString(),
      mode: state.mode,
      pack_id: state.packId,
      score: state.score,
      total: state.questions.length,
      answers: state.answers
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.packId || state.mode}-results.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function clearLocalData(){
    if(!confirm('Clear local play history and preferences?')) return;
    localStorage.removeItem('playCounts');
    localStorage.removeItem('lastMode');
    localStorage.removeItem('quizResults');
    alert('Local quiz data cleared.');
  }

  function bindEvents(){
    choicesEls.forEach(choice => {
      choice.addEventListener('click', (event) => {
        const idx = Number(event.currentTarget.dataset.index);
        if(Number.isInteger(idx)){
          handleAnswer(idx);
        }
      });
      choice.addEventListener('keyup', (event) => {
        if(event.key === 'Enter' || event.key === ' '){
          event.preventDefault();
          const idx = Number(event.currentTarget.dataset.index);
          if(Number.isInteger(idx)){
            handleAnswer(idx);
          }
        }
      });
    });
    fiftyBtn.addEventListener('click', performFifty);
    skipBtn.addEventListener('click', performSkip);
    playAgainBtn.addEventListener('click', () => {
      resetStateForRun();
      renderQuestion();
    });
    exportBtn.addEventListener('click', exportResults);
    clearBtn.addEventListener('click', clearLocalData);
  }

  async function boot(){
    try{
      state.mode = (window.JA && window.JA.getMode && window.JA.getMode()) || DEFAULT_MODE;
      window.JA && window.JA.setMode && window.JA.setMode(state.mode);
      const pack = await window.QuizMaster.load(state.mode);
      state.packId = pack.pack_id || `${state.mode}-pack`;
      state.questions = Array.isArray(pack.questions) ? pack.questions.slice() : [];
      if(!state.questions.length){
        questionTextEl.textContent = 'Quiz pack is empty. Please seed questions.';
        resetChoiceStyles();
        choicesEls.forEach(choice => { choice.disabled = true; choice.querySelector('.text').textContent = '—'; });
        return;
      }
      window.JA && window.JA.incrementPlayCount && window.JA.incrementPlayCount(state.mode);
      resetStateForRun();
      renderQuestion();
    } catch (error){
      console.error(error);
      questionTextEl.textContent = 'Unable to load quiz pack. Check compiled JSON files.';
      resetChoiceStyles();
      choicesEls.forEach(choice => { choice.disabled = true; choice.querySelector('.text').textContent = '—'; });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindEvents();
    hideSummary();
    boot();
  });
})();
