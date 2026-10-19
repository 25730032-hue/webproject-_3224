/* 시네픽 · 공통 모듈 (모든 페이지에서 가장 먼저 로드)
 * - 데이터 접근, 저장소(localStorage / sessionStorage), 토스트, 모달, 공통 UI 조각
 */
(function () {
  'use strict';
  const C = (window.Cinepick = {});
  const CFG = window.CINEPICK_CONFIG || {};

  C.moods = CFG.moods || [];
  C.levelTitles = CFG.levelTitles || ['시네픽 마스터'];
  C.services = CFG.services || [];
  C.movies = window.CINEPICK_MOVIES || [];
  C.reviews = window.CINEPICK_REVIEWS || [];
  C.params = new URLSearchParams(window.location.search);
  // 페이지 위치에 따른 경로: 루트(index.html)는 '', pages/ 안의 페이지는 '../' (각 HTML의 data-root 속성)
  C.ROOT = document.documentElement.dataset.root || '';
  C.PAGES = C.ROOT ? '' : 'pages/';
  C.POSTER_FALLBACK = C.ROOT + 'asset/poster-missing.svg';

  C.byId = id => C.movies.find(m => m.id === id);
  C.esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- 저장소 ----------
   * 티켓(savedTickets)과 보관(bookmarkedIds)은 localStorage, 추천 진행 상태(flow)는 sessionStorage.
   * 브라우저 저장이 막혀 있어도 같은 페이지 안에서는 메모리로 계속 동작합니다. */
  const memStore = { savedTickets: [], bookmarkedIds: [], flow: null };
  const getLocal = () => window.localStorage;
  const getSession = () => window.sessionStorage;
  function read(getStore, key) {
    try {
      const v = getStore().getItem(key);
      return v ? JSON.parse(v) : memStore[key];
    } catch (e) { return memStore[key]; }
  }
  function write(getStore, key, val) {
    memStore[key] = val;
    try { getStore().setItem(key, JSON.stringify(val)); return true; } catch (e) { return false; }
  }
  C.tickets = () => read(getLocal, 'savedTickets');
  C.saveTickets = v => write(getLocal, 'savedTickets', v);
  C.bookmarks = () => read(getLocal, 'bookmarkedIds');
  C.saveBm = v => write(getLocal, 'bookmarkedIds', v);
  C.flow = {
    get: () => read(getSession, 'flow'),
    set: v => write(getSession, 'flow', v),
    clear: () => write(getSession, 'flow', null)
  };
  C.STORAGE_FAIL_MSG = '저장하지 못했어요. 이 페이지를 벗어나면 기록이 사라질 수 있어요.';

  /* ---------- 날짜 · 레벨 ---------- */
  C.todayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };
  C.issuedToday = m => C.tickets().find(t => t.movieId === m.id && t.savedDate === C.todayStr());
  C.lvInfo = total => {
    const lv = Math.floor(total / 10) + 1;
    return { lv, cur: total % 10, next: 10 - (total % 10), name: C.levelTitles[Math.min(lv, C.levelTitles.length) - 1] };
  };
  C.titleOf = t => (C.byId(t.movieId) || { title: '삭제된 영화' }).title;
  C.dailyMovie = () => {
    const now = new Date();
    const dayIndex = Math.floor((new Date(now.getFullYear(), now.getMonth(), now.getDate()) - new Date(now.getFullYear(), 0, 0)) / 86400000);
    return C.movies[dayIndex % C.movies.length];
  };

  /* ---------- 공통 UI 조각 ---------- */
  C.header = (eyebrow, title, desc, status) =>
    `<div class="workspace-head"><div><div class="eyebrow">${eyebrow}</div><h2>${title}</h2><p>${desc}</p></div><span class="status-pill">${status}</span></div>`;
  C.chip = (label, value) => `<span class="chip"><em>${label}</em> ${value}</span>`;
  C.poster = (m, cls) => {
    const src = m ? C.ROOT + m.posterImage : C.POSTER_FALLBACK;
    const alt = m ? `${C.esc(m.title)} 포스터` : '';
    return `<img class="${cls || ''}" src="${C.esc(src)}" alt="${alt}" loading="lazy" onerror="this.onerror=null;this.src='${C.POSTER_FALLBACK}'">`;
  };
  C.bmLabel = m => (C.bookmarks().includes(m.id) ? '보관 중 ★' : '보관 ☆');
  C.toggleBm = (m, btn) => {
    const cur = C.bookmarks();
    const has = cur.includes(m.id);
    const ok = C.saveBm(has ? cur.filter(x => x !== m.id) : [...cur, m.id]);
    if (btn) btn.textContent = C.bmLabel(m);
    C.showToast(has ? '보관을 해제했어요.' : (ok ? '보관함에 담았어요.' : C.STORAGE_FAIL_MSG));
  };

  /* ---------- 토스트 ---------- */
  let toastTimer = null;
  C.showToast = message => {
    let el = document.getElementById('toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast'; el.className = 'toast'; el.setAttribute('role', 'status');
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
  };

  /* ---------- 모달 ---------- */
  let lastFocus = null;
  function modalRoot() {
    let root = document.getElementById('modalRoot');
    if (!root) { root = document.createElement('div'); root.id = 'modalRoot'; document.body.appendChild(root); }
    return root;
  }
  function onKey(e) { if (e.key === 'Escape') C.closeModal(); }
  C.closeModal = () => {
    modalRoot().innerHTML = '';
    document.removeEventListener('keydown', onKey);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    lastFocus = null;
  };
  C.openModal = html => {
    const root = modalRoot();
    lastFocus = document.activeElement;
    root.innerHTML = `<div class="modal-backdrop" id="modalBackdrop">${html}</div>`;
    root.querySelector('#modalBackdrop').addEventListener('click', e => { if (e.target.id === 'modalBackdrop') C.closeModal(); });
    document.addEventListener('keydown', onKey);
    const first = root.querySelector('button');
    if (first) first.focus();
    return root;
  };
  C.openWatchModal = m => {
    const root = C.openModal(`<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><div class="eyebrow">READY TO WATCH</div><h3 id="modalTitle">어디에서 감상할까요?</h3><p>현재 프로토타입은 OTT 보유 여부를 조회하지 않아요. 서비스를 고르면 공식 사이트로 이동합니다.</p><div class="service-list">${C.services.map((s, i) => `<button type="button" data-service="${i}">${C.esc(s.name)} ↗</button>`).join('')}</div><div class="modal-actions"><button type="button" class="btn" id="closeModal">닫기</button></div></div>`);
    root.querySelector('#closeModal').addEventListener('click', C.closeModal);
    root.querySelectorAll('[data-service]').forEach(b => b.addEventListener('click', () => {
      const s = C.services[Number(b.dataset.service)];
      C.closeModal();
      C.showToast(`‘${m.title}’을 검색해서 이용 가능 여부를 확인해 주세요.`);
      window.open(s.url, '_blank', 'noopener,noreferrer');
    }));
  };

  /* ---------- 예외 상황 카드 ---------- */
  C.renderRecovery = (container, entries, back) => {
    container.innerHTML = `<div class="recovery-list">${entries.map(e => `<article class="recovery"><div class="recovery-icon" aria-hidden="true">${e.icon}</div><div><h3 style="margin:0 0 4px;font-size:13px">${e.title}</h3><p>${e.desc}</p><button type="button" class="btn" data-recovery="${e.id}">${e.button} →</button></div></article>`).join('')}</div>${back ? `<div class="actions"><button type="button" class="btn" id="backToApp">${back.label}</button></div>` : ''}`;
    container.querySelectorAll('[data-recovery]').forEach(b => b.addEventListener('click', () => {
      const e = entries.find(x => x.id === b.dataset.recovery);
      if (e) e.action();
    }));
    if (back) container.querySelector('#backToApp').addEventListener('click', back.action);
  };
})();
