(function(){
  const cache = new Map();
  async function loadFeed(mode){
    if(cache.has(mode)) return cache.get(mode);
    try{
      const response = await fetch(`/data/${mode}_feed.json`, {cache:'no-store'});
      const data = await response.json();
      cache.set(mode, Array.isArray(data) ? data : []);
      return cache.get(mode);
    }catch(_){
      cache.set(mode, []);
      return [];
    }
  }
  function pad(value){
    return String(Math.max(0, Number(value) || 0)).padStart(2, '0');
  }
  function renderTicker(items){
    const track = document.getElementById('newsTrack');
    if(!track) return;
    const source = items.length ? items : [{t:'Signal warming up. Fresh drops incoming.'}];
    const row = source.map(item => `<span class="news-item">${item.t}</span>`).join('<span class="news-sep">•</span>');
    track.innerHTML = `<div class="news-track__inner">${row}<span class="news-sep">•</span>${row}</div>`;
  }
  function renderPanels(activeMode){
    const panelLeft = document.querySelector('#newsPanelLeft .panel-value');
    if(panelLeft){
      panelLeft.textContent = activeMode === 'buzz' ? 'Buzz Arena' : 'Biz Arena';
    }
    const pulse = document.getElementById('newsPulse');
    if(pulse){
      const counts = window.JA && window.JA.getPlayCounts ? window.JA.getPlayCounts() : {biz:0,buzz:0};
      pulse.textContent = `${pad(counts.biz)} · ${pad(counts.buzz)}`;
    }
  }
  async function hydrate(activeMode){
    const [bizFeed, buzzFeed] = await Promise.all([loadFeed('biz'), loadFeed('buzz')]);
    const combined = activeMode === 'buzz'
      ? [...buzzFeed, ...bizFeed]
      : [...bizFeed, ...buzzFeed];
    renderTicker(combined);
    renderPanels(activeMode);
  }
  document.addEventListener('DOMContentLoaded', () => {
    const mode = (window.JA && window.JA.getMode && window.JA.getMode()) || 'biz';
    hydrate(mode);
  });
  document.addEventListener('ja-modechange', (event) => {
    const nextMode = event.detail && event.detail.mode ? event.detail.mode : 'biz';
    hydrate(nextMode);
  });
  document.addEventListener('ja-playcount', () => {
    const mode = (window.JA && window.JA.getMode && window.JA.getMode()) || 'biz';
    renderPanels(mode);
  });
})();
