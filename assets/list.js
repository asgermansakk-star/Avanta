// Vanta Stock Scores · filters and sorts the static ledger on the front page (works without JS too).
(function () {
  const $ = id => document.getElementById(id);
  const ol = $('list'); if (!ol) return;
  const items = [...ol.querySelectorAll('li[data-name]')];
  const total = items.length;
  const num = (li, k, dflt) => { const v = li.dataset[k]; return v === '' || v == null ? dflt : parseFloat(v); };
  const sorters = {
    score: (a, b) => num(b, 'score', 0) - num(a, 'score', 0),
    upside: (a, b) => num(b, 'upside', -9) - num(a, 'upside', -9),
    peg: (a, b) => num(a, 'peg', 99) - num(b, 'peg', 99),
    name: (a, b) => a.dataset.name.localeCompare(b.dataset.name)
  };
  const empty = document.createElement('li'); empty.className = 'empty';
  empty.textContent = 'No company matches. Clear the search or pick another industry.';

  // remember controls per visitor (optional convenience)
  const KEY = 'vanta-list';
  try { const s = JSON.parse(localStorage.getItem(KEY) || '{}');
    if (s.sort) $('sort').value = s.sort; if (s.ind) $('ind').value = s.ind; if (s.only) $('only70').checked = true; } catch (e) {}

  function render() {
    const q = $('q').value.trim().toLowerCase(), ind = $('ind').value, only = $('only70').checked, sort = $('sort').value;
    try { localStorage.setItem(KEY, JSON.stringify({ sort, ind, only })); } catch (e) {}
    const sorted = [...items].sort(sorters[sort] || sorters.score);
    let shown = 0;
    sorted.forEach(li => {
      const ok = (!q || li.dataset.name.toLowerCase().includes(q) || li.dataset.ind.toLowerCase().includes(q))
        && (!ind || li.dataset.ind === ind) && (!only || li.dataset.zone === '1');
      li.hidden = !ok; if (ok) shown++;
      ol.append(li);
    });
    if (!shown) ol.append(empty); else empty.remove();
    $('count').textContent = shown === total ? total + ' companies' : shown + ' of ' + total + ' companies';
  }
  ['q', 'sort', 'ind', 'only70'].forEach(id => $(id).addEventListener(id === 'q' ? 'input' : 'change', render));
  render();
})();
