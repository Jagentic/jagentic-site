(function(){
  const VALID_MODES = new Set(['biz','buzz']);

  function parseCounts(){
    try{
      const raw = localStorage.getItem('playCounts');
      if(!raw) return {biz:0, buzz:0};
      const data = JSON.parse(raw);
      return {biz:Number(data.biz)||0, buzz:Number(data.buzz)||0};
    }catch(_){
      return {biz:0, buzz:0};
    }
  }

  function storeCounts(counts){
    localStorage.setItem('playCounts', JSON.stringify(counts));
  }

  function resolveInitialMode(){
    const params = new URLSearchParams(location.search);
    const urlMode = params.get('mode');
    const lastMode = localStorage.getItem('lastMode');
    const preferMost = localStorage.getItem('preferMostPlayed');
    const useMostPlayed = preferMost === null ? true : preferMost === 'true';
    const counts = parseCounts();

    if(urlMode && VALID_MODES.has(urlMode)){
      return urlMode;
    }
    if(lastMode && VALID_MODES.has(lastMode)){
      return lastMode;
    }
    if(useMostPlayed && counts.biz !== counts.buzz){
      return counts.buzz > counts.biz ? 'buzz' : 'biz';
    }
    return 'biz';
  }

  function updateTabs(mode){
    const links = document.querySelectorAll('.mode-tabs [data-mode]');
    links.forEach(link => {
      const isActive = link.dataset.mode === mode;
      link.classList.toggle('active', isActive);
      link.setAttribute('aria-selected', String(isActive));
      link.setAttribute('tabindex', isActive ? '0' : '-1');
    });
  }

  function updateStageLabel(mode){
    const label = document.getElementById('stageLabel');
    if(!label) return;
    label.textContent = mode === 'buzz' ? 'Millionaire · XL Stage · BUZZ' : 'Millionaire · XL Stage · BIZ';
  }

  function applyMode(mode){
    updateTabs(mode);
    updateStageLabel(mode);
    document.documentElement.setAttribute('data-mode', mode);
  }

  let mode = resolveInitialMode();
  localStorage.setItem('lastMode', mode);
  applyMode(mode);

  window.JA = window.JA || {};
  window.JA.getMode = () => mode;
  window.JA.setMode = (nextMode) => {
    if(!VALID_MODES.has(nextMode)) return;
    mode = nextMode;
    localStorage.setItem('lastMode', nextMode);
    applyMode(mode);
    document.dispatchEvent(new CustomEvent('ja-modechange', {detail:{mode: nextMode}}));
  };
  window.JA.incrementPlayCount = (modeKey) => {
    if(!VALID_MODES.has(modeKey)) return;
    const updated = parseCounts();
    updated[modeKey] = (updated[modeKey] || 0) + 1;
    storeCounts(updated);
    document.dispatchEvent(new CustomEvent('ja-playcount', {detail:{counts: updated}}));
  };
  window.JA.getPlayCounts = () => parseCounts();

  document.addEventListener('DOMContentLoaded', () => {
    updateTabs(mode);
    updateStageLabel(mode);
    const links = document.querySelectorAll('.mode-tabs [data-mode]');
    links.forEach(link => {
      link.addEventListener('click', () => {
        const targetMode = link.dataset.mode;
        if(VALID_MODES.has(targetMode)){
          localStorage.setItem('lastMode', targetMode);
        }
      });
    });
  });
})();
