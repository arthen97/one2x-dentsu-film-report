
(() => {
  const cards = [...document.querySelectorAll('.film-card')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const input = document.getElementById('search');
  const counter = document.getElementById('result-count');
  const empty = document.getElementById('empty');
  let group = 'all';
  function update() {
    const query = input.value.trim().toLocaleLowerCase();
    let count = 0;
    cards.forEach(card => {
      const matches = (group === 'all' || card.dataset.group === group) && (!query || card.dataset.search.includes(query));
      card.hidden = !matches;
      if (matches) count++;
      else card.querySelector('video').pause();
    });
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === group)));
    counter.textContent = `显示 ${count} / ${cards.length} 条参考`;
    empty.hidden = count !== 0;
  }
  filters.forEach(button => button.addEventListener('click', () => { group = button.dataset.filter; update(); }));
  input.addEventListener('input', update);
  document.querySelectorAll('[data-open-film]').forEach(link => link.addEventListener('click', () => { group = 'all'; input.value = ''; update(); }));
  document.querySelectorAll('video').forEach(video => video.addEventListener('play', () => { document.querySelectorAll('video').forEach(other => { if (other !== video) other.pause(); }); }));
  if (location.hash) { const target = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (target?.classList.contains('film-card')) { group = 'all'; update(); } }
})();
