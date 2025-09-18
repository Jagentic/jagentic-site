(async function(){
  const el = document.getElementById('news-ticker');
  if (!el) return;
  try {
    const res = await fetch('news.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('fetch failed');
    const items = await res.json();
    const track = document.createElement('div');
    track.className = 'track';
    for (const it of items) {
      const a = document.createElement('a');
      a.href = it.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = `[${it.source}] ${it.title}`;
      track.appendChild(a);
    }
    el.innerHTML = '';
    el.appendChild(track);
  } catch {
    el.textContent = 'No headlines.';
  }
})();
