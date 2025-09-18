(function(){
  const cache = new Map();
  async function loadPack(mode){
    const key = mode === 'buzz' ? 'buzz' : 'biz';
    if(cache.has(key)) return cache.get(key);
    const url = `/content/compiled/pack.${key}.json`;
    const response = await fetch(url, {cache:'no-store'});
    if(!response.ok) throw new Error(`Failed to load ${url}`);
    const data = await response.json();
    cache.set(key, data);
    return data;
  }
  window.QuizMaster = window.QuizMaster || {};
  window.QuizMaster.load = loadPack;
})();
