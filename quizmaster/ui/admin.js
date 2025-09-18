(function(){
  const packIdEl = document.getElementById('packId');
  const packModeEl = document.getElementById('packMode');
  const packVersionEl = document.getElementById('packVersion');
  const autoIdsEl = document.getElementById('autoIds');

  const questionForm = document.getElementById('questionForm');
  const questionIdEl = document.getElementById('questionId');
  const questionTypeEl = document.getElementById('questionType');
  const questionCategoryEl = document.getElementById('questionCategory');
  const questionDifficultyEl = document.getElementById('questionDifficulty');
  const questionTextEl = document.getElementById('questionText');
  const answerIndexEl = document.getElementById('answerIndex');
  const questionExplainEl = document.getElementById('questionExplain');
  const pictureFieldsEl = document.getElementById('pictureFields');
  const imagePathEl = document.getElementById('imagePath');
  const imageAltEl = document.getElementById('imageAlt');
  const choiceInputs = Array.from(document.querySelectorAll('.choice-input'));

  const statusEl = document.getElementById('status');
  const tableBody = document.querySelector('#questionsTable tbody');
  const validateBtn = document.getElementById('validatePack');
  const exportBtn = document.getElementById('exportPack');
  const clearBtn = document.getElementById('clearPack');
  const resetBtn = document.getElementById('resetQuestion');

  const state = {
    questions: [],
    editingIndex: null
  };

  function setStatus(msg, tone = 'info') {
    statusEl.textContent = msg;
    statusEl.dataset.tone = tone;
  }

  function togglePictureFields(){
    if(questionTypeEl.value === 'picture_mcq'){
      pictureFieldsEl.classList.remove('hidden');
      if(!imageAltEl.value){
        imageAltEl.value = 'Portrait photo.';
      }
    } else {
      pictureFieldsEl.classList.add('hidden');
    }
  }

  function resetQuestionForm(){
    questionForm.reset();
    choiceInputs.forEach((input, idx)=>{
      input.value = '';
      input.placeholder = `Choice ${String.fromCharCode(65 + idx)}`;
    });
    questionTypeEl.value = 'mcq';
    questionDifficultyEl.value = 'easy';
    answerIndexEl.value = 0;
    imageAltEl.value = 'Portrait photo.';
    state.editingIndex = null;
    togglePictureFields();
  }

  function collectChoices(){
    return choiceInputs.map(input => input.value.trim());
  }

  function ensureQuestionId(baseMode){
    if(questionIdEl.value.trim()) return questionIdEl.value.trim();
    if(!autoIdsEl.checked) return '';
    const prefix = `${baseMode}-`;
    let counter = state.questions.length + 1;
    let candidate = `${prefix}${counter}`;
    const existing = new Set(state.questions.map(q => q.id));
    while(existing.has(candidate)){
      counter += 1;
      candidate = `${prefix}${counter}`;
    }
    questionIdEl.value = candidate;
    return candidate;
  }

  function buildQuestionFromForm(){
    const id = ensureQuestionId(packModeEl.value);
    const question = {
      id,
      type: questionTypeEl.value,
      category: questionCategoryEl.value.trim(),
      difficulty: questionDifficultyEl.value,
      question: questionTextEl.value.trim(),
      choices: collectChoices(),
      answer_index: Number(answerIndexEl.value),
      explain: questionExplainEl.value.trim()
    };
    if(question.type === 'picture_mcq'){
      question.image = imagePathEl.value.trim();
      question.alt = imageAltEl.value.trim();
    }
    return question;
  }

  function validateQuestion(question, idx){
    const errors = [];
    const required = ['id','type','category','difficulty','question','choices','answer_index'];
    required.forEach(key => {
      if(question[key] === undefined || question[key] === null || (typeof question[key] === 'string' && !question[key].trim())){
        errors.push(`#${idx + 1} missing ${key}`);
      }
    });
    if(!['mcq','picture_mcq'].includes(question.type)){
      errors.push(`#${idx + 1} invalid type`);
    }
    if(!['easy','medium','hard'].includes(question.difficulty)){
      errors.push(`#${idx + 1} invalid difficulty`);
    }
    if(!Array.isArray(question.choices) || question.choices.length !== 4){
      errors.push(`#${idx + 1} must have exactly four choices`);
    } else {
      question.choices.forEach((choice, choiceIdx) => {
        if(!choice || !choice.toString().trim()){
          errors.push(`#${idx + 1} choice ${choiceIdx} is empty`);
        }
      });
    }
    if(Number.isNaN(question.answer_index) || question.answer_index < 0 || question.answer_index > 3){
      errors.push(`#${idx + 1} answer_index must be 0-3`);
    }
    if(question.type === 'picture_mcq'){
      if(!question.image || !question.image.startsWith('/assets/people/')){
        errors.push(`#${idx + 1} image must start with /assets/people/`);
      }
      if(question.alt !== 'Portrait photo.'){
        errors.push(`#${idx + 1} alt must be "Portrait photo."`);
      }
    }
    return errors;
  }

  function validatePackData(pack){
    const errors = [];
    if(!pack.pack_id){ errors.push('pack_id required'); }
    if(!['biz','buzz'].includes(pack.mode)){
      errors.push('mode must be biz or buzz');
    }
    if(!pack.version){ errors.push('version required'); }
    if(!Array.isArray(pack.questions) || !pack.questions.length){
      errors.push('questions array required');
    } else {
      pack.questions.forEach((question, idx) => {
        errors.push(...validateQuestion(question, idx));
      });
    }
    return errors;
  }

  function renderTable(){
    tableBody.innerHTML = '';
    state.questions.forEach((question, idx) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${idx + 1}</td>
        <td>${question.id}</td>
        <td>${question.type}</td>
        <td>${question.category}</td>
        <td>${question.difficulty}</td>
        <td>${question.question}</td>
        <td>
          <button type="button" class="action-btn" data-action="edit" data-idx="${idx}">Edit</button>
          <button type="button" class="action-btn" data-action="delete" data-idx="${idx}">Delete</button>
        </td>`;
      tableBody.appendChild(row);
    });
  }

  function fillForm(question){
    questionIdEl.value = question.id;
    questionTypeEl.value = question.type;
    questionCategoryEl.value = question.category;
    questionDifficultyEl.value = question.difficulty;
    questionTextEl.value = question.question;
    answerIndexEl.value = question.answer_index;
    questionExplainEl.value = question.explain || '';
    choiceInputs.forEach((input, idx) => { input.value = question.choices[idx] || ''; });
    if(question.type === 'picture_mcq'){
      imagePathEl.value = question.image || '';
      imageAltEl.value = question.alt || 'Portrait photo.';
    } else {
      imagePathEl.value = '';
      imageAltEl.value = 'Portrait photo.';
    }
    togglePictureFields();
  }

  questionTypeEl.addEventListener('change', togglePictureFields);

  questionForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const packMode = packModeEl.value;
    const question = buildQuestionFromForm();
    const errors = validateQuestion(question, state.editingIndex ?? state.questions.length);
    if(errors.length){
      setStatus(errors.join('; '), 'error');
      return;
    }
    if(state.editingIndex !== null){
      state.questions[state.editingIndex] = question;
      setStatus(`Updated question ${question.id}.`, 'info');
    } else {
      state.questions.push(question);
      setStatus(`Added question ${question.id}.`, 'info');
    }
    renderTable();
    state.editingIndex = null;
    if(autoIdsEl.checked){
      questionIdEl.value = '';
    }
  });

  resetBtn.addEventListener('click', () => {
    resetQuestionForm();
    setStatus('Question form reset.', 'info');
  });

  tableBody.addEventListener('click', (event) => {
    const target = event.target;
    if(!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    if(!action) return;
    const idx = Number(target.dataset.idx);
    if(Number.isNaN(idx)) return;
    if(action === 'edit'){
      const question = state.questions[idx];
      state.editingIndex = idx;
      fillForm(question);
      setStatus(`Editing question ${question.id}.`, 'info');
    } else if(action === 'delete'){
      const [removed] = state.questions.splice(idx, 1);
      renderTable();
      setStatus(`Deleted question ${removed.id}.`, 'info');
      if(state.editingIndex === idx){
        resetQuestionForm();
      }
    }
  });

  validateBtn.addEventListener('click', () => {
    const pack = getPack();
    const errors = validatePackData(pack);
    if(errors.length){
      setStatus(`Validation errors: ${errors.join('; ')}`, 'error');
    } else {
      setStatus(`Pack valid with ${pack.questions.length} questions.`, 'success');
    }
  });

  function getPack(){
    return {
      pack_id: packIdEl.value.trim(),
      mode: packModeEl.value,
      version: packVersionEl.value.trim(),
      questions: state.questions.map(q => ({...q}))
    };
  }

  exportBtn.addEventListener('click', () => {
    const pack = getPack();
    const errors = validatePackData(pack);
    if(errors.length){
      setStatus(`Fix before export: ${errors.join('; ')}`, 'error');
      return;
    }
    const blob = new Blob([JSON.stringify(pack, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pack.pack_id}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setStatus(`Exported ${pack.pack_id}.json`, 'success');
  });

  clearBtn.addEventListener('click', () => {
    if(!state.questions.length) return;
    if(!confirm('Remove all questions from this pack?')) return;
    state.questions = [];
    state.editingIndex = null;
    renderTable();
    resetQuestionForm();
    setStatus('Cleared pack questions.', 'info');
  });

  packModeEl.addEventListener('change', () => {
    if(autoIdsEl.checked && !packIdEl.value){
      packIdEl.value = `${packModeEl.value}-r1`;
    }
  });

  // Initialize defaults
  packIdEl.value = 'biz-r1';
  packVersionEl.value = 'r1';
  togglePictureFields();
  setStatus('Ready. Add questions and export JSON when finished.', 'info');
})();
