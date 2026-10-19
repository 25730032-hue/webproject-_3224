/* 영화 추천 흐름 (recommend.html)
 * 기분 선택 → 후보 목록 / 랜덤 추첨 → 추천 결과 → 확정 · 티켓 발권
 */
(function () {
  'use strict';
  const C = window.Cinepick;
  const esc = C.esc;
  const byId = C.byId;
  const ws = document.getElementById('workspace');
  const $ = sel => document.querySelector(sel);

  const fresh = () => ({ step: 1, mood: null, movie: null, lastMovieId: null, spinning: false, showWheel: false, lvUp: null });
  let state = fresh();
  let spinTimer = null;

  const candidates = () => C.movies.filter(m => !state.mood || m.moods.includes(state.mood));
  const persist = () => C.flow.set({ step: state.step, mood: state.mood, movieId: state.movie ? state.movie.id : null });

  /* ---------- 진입 상태 복원 ----------
   * ?new=1                  → 처음부터
   * ?movie=ID&step=4|5      → 특정 영화의 결과 / 확정 화면 (홈 · 나의영화에서 진입)
   * 그 외                   → 세션에 저장된 진행 상태 복원 */
  function init() {
    const p = C.params;
    const saved = C.flow.get() || {};
    const movie = byId(p.get('movie'));
    if (p.get('new') === '1') {
      C.flow.clear();
    } else if (movie) {
      state.movie = movie;
      state.lastMovieId = movie.id;
      state.mood = saved.mood && movie.moods.includes(saved.mood) ? saved.mood : movie.moods[0];
      state.step = p.get('step') === '5' ? 5 : 4;
    } else {
      state.mood = saved.mood || null;
      state.movie = saved.movieId ? (byId(saved.movieId) || null) : null;
      state.lastMovieId = state.movie ? state.movie.id : null;
      state.step = [1, 3, 4, 5].includes(saved.step) ? saved.step : 1;
      if (state.step === 3 && !state.mood) state.step = 1;
      if ((state.step === 4 || state.step === 5) && !state.movie) state.step = state.mood ? 3 : 1;
    }
    try { history.replaceState(null, '', location.pathname); } catch (e) { /* 일부 환경에서는 무시 */ }
    render();
  }

  function setStep(step) {
    if (step === 3 && !state.mood) { C.showToast('먼저 지금의 기분을 선택해 주세요.'); step = 1; }
    if ((step === 4 || step === 5) && !state.movie) { C.showToast('먼저 영화를 선택해 주세요.'); step = state.mood ? 3 : 1; }
    if (step !== 5) state.lvUp = null;
    state.step = step;
    render();
  }

  function render() {
    clearTimeout(spinTimer);
    state.spinning = false;
    persist();
    ({ 1: renderMood, 3: renderCandidates, 4: renderResult, 5: renderConfirmed })[state.step]();
    window.scrollTo(0, 0);
  }

  /* ---------- 1. 기분 선택 ---------- */
  function renderMood() {
    ws.innerHTML = C.header('STEP 01 / CINEPICK', '지금 기분은?', '지금의 기분과 가장 가까운 하나를 골라주세요.', '선택 1개') +
      `<div class="content"><div class="section-row"><h3>오늘 밤의 무드</h3><span>MOOD FILTER · 단일 선택</span></div><div class="mood-grid">${C.moods.map(m => `<button type="button" class="mood-card ${state.mood === m.name ? 'selected' : ''}" data-mood="${esc(m.name)}" aria-pressed="${state.mood === m.name}"><span class="checkmark" aria-hidden="true">✓</span><span class="mood-icon" aria-hidden="true">${m.icon}</span><strong>${esc(m.name)}</strong><small>${esc(m.desc)}</small></button>`).join('')}</div><div class="selection-summary">${state.mood ? C.chip('선택한 기분', esc(state.mood)) : '<span class="chip">아직 선택하지 않았어요</span>'}</div><div class="callout"><strong>작은 팁</strong> · 정확한 감정을 고르기 어려우면, 지금 보고 싶은 분위기에 가까운 것을 골라도 좋아요.</div><div class="actions"><button type="button" class="btn primary" id="toCandidates" ${state.mood ? '' : 'disabled'}>조건에 맞는 영화 보기 <span aria-hidden="true">→</span></button></div></div>`;
    ws.querySelectorAll('[data-mood]').forEach(b => b.addEventListener('click', () => {
      state.mood = b.dataset.mood; state.movie = null; state.lastMovieId = null;
      persist();
      renderMood();
      const again = ws.querySelector(`[data-mood="${state.mood}"]`);
      if (again) again.focus();
    }));
    $('#toCandidates').addEventListener('click', () => { state.showWheel = false; setStep(3); });
  }

  /* ---------- 2. 후보 목록 / 랜덤 추첨 ---------- */
  function renderCandidates() {
    const list = candidates();
    if (!list.length) { renderNoCandidates(); return; }
    if (!state.showWheel) {
      ws.innerHTML = C.header('STEP 02 / CINEPICK', '조건에 맞는 영화가 모였어요', '목록에서 직접 선택하거나, 결정이 어렵다면 랜덤 추첨에 맡겨보세요.', '후보 ' + list.length + '편') +
        `<div class="content"><div class="selection-summary">${C.chip('기분', esc(state.mood || '전체'))}${C.chip('후보', list.length + '편')}</div><div class="divider"></div><div class="section-row"><h3>지금 볼 수 있는 영화</h3><span>조건에 맞는 후보만 표시</span></div><div class="candidate-list">${list.map(m => `<article class="candidate-card">${C.poster(m, 'candidate-poster')}<div class="candidate-info"><h4>${esc(m.title)}</h4><div class="candidate-meta">${m.year} · ${esc(m.genre)} · ${m.runtime}분</div><p>${esc(m.overview)}</p><div class="candidate-tags"><span>${esc(m.moods.includes(state.mood) ? state.mood : m.moods[0])}</span><span>${esc(m.tone)}</span><span>${esc(m.food)}</span></div></div><button type="button" class="btn primary candidate-pick" data-pick-movie="${m.id}">이 영화 선택</button></article>`).join('')}</div><div class="callout"><strong>선택 방법</strong> · 마음에 드는 영화를 바로 선택하거나, 랜덤 추첨으로 한 편을 골라보세요.</div><div class="actions"><button type="button" class="btn" id="editConditions">← 기분 다시 선택</button><button type="button" class="btn primary" id="openWheel">랜덤으로 한 편 고르기</button></div></div>`;
      ws.querySelectorAll('[data-pick-movie]').forEach(b => b.addEventListener('click', () => {
        const picked = byId(b.dataset.pickMovie);
        if (!picked) return;
        state.movie = picked; state.lastMovieId = picked.id;
        setStep(4);
      }));
      $('#editConditions').addEventListener('click', () => setStep(1));
      $('#openWheel').addEventListener('click', () => { state.showWheel = true; renderCandidates(); window.scrollTo(0, 0); });
      return;
    }
    ws.innerHTML = C.header('STEP 02 / CINEPICK', '운명에 맡겨볼까요?', '선택한 기분에 맞는 영화 중 하나를 무작위로 추천해요.', '후보 ' + list.length + '편') +
      `<div class="content"><div class="wheel-layout"><div class="wheel-wrap"><div class="random-draw-card" id="drawCard"><div class="random-draw-icon" aria-hidden="true">🎬</div><h3>오늘의 랜덤 픽</h3><p>고민은 잠시 내려놓고<br>후보 영화 중 한 편을 골라보세요.</p></div></div><div class="wheel-panel"><div class="eyebrow">YOUR CONDITIONS</div><h3>이번 밤의 후보</h3><p>선택한 기분에 맞는 영화만 후보에 포함돼요.</p><div class="condition-list"><div class="condition-line"><span>현재 기분</span><strong>${esc(state.mood)}</strong></div><div class="condition-line"><span>추천 후보</span><strong>${list.length}편</strong></div></div><div class="candidate-count">${list.length}<small> MOVIES IN THE LIST</small></div><p>버튼을 누르면 후보 중 한 편을 무작위로 선택해요.</p><div class="spin-note" id="spinNote" aria-live="polite"></div><button type="button" class="btn primary full" id="spinButton">랜덤으로 영화 고르기</button><button type="button" class="btn full" id="backCandidates" style="margin-top:8px">← 후보 목록으로 돌아가기</button><button type="button" class="btn full" id="editConditions" style="margin-top:8px">기분 다시 선택</button></div></div></div>`;
    $('#spinButton').addEventListener('click', spin);
    $('#backCandidates').addEventListener('click', () => { state.showWheel = false; renderCandidates(); window.scrollTo(0, 0); });
    $('#editConditions').addEventListener('click', () => setStep(1));
  }

  function spin() {
    if (state.spinning) return;
    const list = candidates();
    if (!list.length) { renderNoCandidates(); return; }
    let pool = list.filter(m => m.id !== state.lastMovieId);
    if (!pool.length) pool = list;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    state.spinning = true;
    const card = $('#drawCard'), button = $('#spinButton'), note = $('#spinNote');
    if (button) { button.disabled = true; button.textContent = '영화를 고르는 중…'; }
    if (note) note.textContent = '후보 목록에서 영화를 무작위로 선택하고 있어요.';
    if (card) card.classList.add('spinning');
    spinTimer = setTimeout(() => {
      state.spinning = false;
      state.movie = pick; state.lastMovieId = pick.id;
      setStep(4);
    }, 3000);
  }

  /* ---------- 3. 추천 결과 ---------- */
  function posterMarkup(m) {
    return `<div class="poster"><span class="poster-kicker">TONIGHT'S PICK · ${m.year}</span><span class="poster-title">${esc(m.title)}</span><span class="poster-foot">${esc(m.en)}<br>A CINEPICK PICK</span></div>`;
  }
  function renderResult() {
    const m = state.movie;
    ws.innerHTML = C.header('STEP 03 / CINEPICK', '오늘의 추천 영화', '천천히 살펴보고 마음에 들면 확정하세요. 다른 영화가 궁금하면 언제든 다시 추천받을 수 있어요.', '추천 결과') +
      `<div class="content"><div class="result-layout"><div>${posterMarkup(m)}</div><div class="result-info"><div class="eyebrow">WE PICKED FOR YOU</div><h3>${esc(m.title)}</h3><p class="subline">${m.year} · ${esc(m.genre)} · ${m.runtime}분</p><div class="tags"><span class="tag">${esc(m.moods.includes(state.mood) ? state.mood : m.moods[0])}</span><span class="tag">${esc(m.tone)}</span><span class="tag">${esc(m.food)}</span></div><p class="overview">${esc(m.overview)}</p><div class="actions" style="justify-content:stretch"><button type="button" class="btn grow" id="tryAgain">다른 영화 추천 ↻</button><button type="button" class="btn grow" id="bmBtn">${C.bmLabel(m)}</button><button type="button" class="btn primary grow" id="confirmMovie">이 영화로 확정 ✓</button></div><div class="callout">시간 제한 없이 영화를 살펴볼 수 있어요. 마음에 드는 영화를 선택하거나 다른 영화를 추천받아 보세요.</div></div></div></div>`;
    $('#tryAgain').addEventListener('click', () => {
      state.step = 3; state.showWheel = true;
      render();
      setTimeout(spin, 20);
    });
    $('#bmBtn').addEventListener('click', e => C.toggleBm(m, e.currentTarget));
    $('#confirmMovie').addEventListener('click', () => setStep(5));
  }

  /* ---------- 4. 확정 · 티켓 발권 ---------- */
  function issueTicket(m) {
    const all = C.tickets();
    if (C.issuedToday(m)) { C.showToast('오늘 이미 발권한 영화예요.'); return; }
    const t = { ticketId: 't_' + Date.now().toString(36), movieId: m.id, savedDate: C.todayStr(), memo: '' };
    const before = C.lvInfo(all.length), after = C.lvInfo(all.length + 1);
    const ok = C.saveTickets([t, ...all]);
    state.lvUp = after.lv > before.lv ? after : null;
    C.showToast(ok ? '티켓을 발권했어요!' : C.STORAGE_FAIL_MSG);
    renderConfirmed();
  }
  function renderConfirmed() {
    const m = state.movie;
    const t = C.issuedToday(m);
    const stub = t ? `<div class="ticket-stub"><div class="k">MATCHING TICKET</div><div class="t">${esc(m.title)}</div><div class="d"><span>${esc(t.savedDate)}</span><span>No. ${esc(t.ticketId)}</span></div></div>` : '';
    const up = state.lvUp ? `<div class="lvup" role="status"><b>LEVEL UP! Lv.${state.lvUp.lv}</b><span>도장 10개 완성 · ${esc(state.lvUp.name)}</span></div>` : '';
    ws.innerHTML = C.header('STEP 04 / CINEPICK', '선택 완료. 이제 감상할 시간!', '영화를 확정했어요. 티켓을 발권하면 도장이 한 칸 채워져요.', t ? '티켓 발권 완료' : '영화 확정') +
      `<div class="content"><div class="confirm-banner">${C.poster(m, 'confirm-icon')}<div><div class="eyebrow">TONIGHT'S MOVIE</div><h3>${esc(m.title)}</h3><p>${m.year} · ${esc(m.genre)} · ${m.runtime}분</p><p style="margin-top:6px">야식 페어링 · ${esc(m.food)}</p></div></div>${up}${stub}<div class="actions" style="justify-content:stretch;margin-top:0"><button type="button" class="btn primary grow" id="issueTicket" ${t ? 'disabled' : ''}>${t ? '발권 완료 ✓' : '매칭 티켓 발권 ✦'}</button><button type="button" class="btn grow" id="watchMovie">감상 서비스 선택 ↗</button><button type="button" class="btn grow" id="bmBtn">${C.bmLabel(m)}</button></div><div class="callout"><strong>감상 준비</strong> · OTT 서비스 연결은 데모 단계예요. 서비스를 선택하면 공식 사이트로 이동하고, 영화 제목은 직접 검색해 주세요.</div><div class="actions"><button type="button" class="btn" id="moreMovie">새 영화 추천하기</button><a class="btn primary" href="${C.PAGES}movies.html">티켓북 보기 →</a></div></div>`;
    $('#issueTicket').addEventListener('click', () => issueTicket(m));
    $('#watchMovie').addEventListener('click', () => C.openWatchModal(m));
    $('#bmBtn').addEventListener('click', e => C.toggleBm(m, e.currentTarget));
    $('#moreMovie').addEventListener('click', () => { state.movie = null; state.lastMovieId = null; state.mood = null; setStep(1); });
  }

  /* ---------- 예외: 후보 0건 ---------- */
  function renderNoCandidates() {
    ws.innerHTML = C.header('HELP / CINEPICK', '막히는 순간에도, 다음 선택은 있어요.', '예상 가능한 예외 상황에서 바로 복구할 수 있도록 준비했어요.', 'HELP / RECOVERY') + '<div class="content" id="recoveryBox"></div>';
    C.renderRecovery($('#recoveryBox'), [
      { id: 'noCandidates', icon: '⌕', title: '조건에 맞는 영화가 없어요', desc: `${esc(state.mood || '선택한 기분')}에 맞는 후보가 없어요. 다른 기분을 골라보세요.`, button: '조건 다시 설정', action: () => { state.mood = null; setStep(1); } }
    ], { label: '← 처음으로 돌아가기', action: () => { state.mood = null; setStep(1); } });
  }

  init();
})();
