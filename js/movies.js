/* 나의영화 (movies.html): 티켓북(도장판 · 레벨 · 티켓 목록) + 보관 탭 */
(function () {
  'use strict';
  const C = window.Cinepick;
  const esc = C.esc;
  const ws = document.getElementById('workspace');
  const state = { tab: C.params.get('tab') === 'bookmarks' ? 'bookmarks' : 'tickets', delId: null };

  function stampCells() {
    const chrono = C.tickets().slice().reverse();
    const cur = chrono.slice(Math.floor(chrono.length / 10) * 10);
    return Array.from({ length: 10 }, (_, i) => cur[i]
      ? `<div class="stamp filled"><span class="stamp-mark" aria-hidden="true">✦</span><strong>${esc(C.titleOf(cur[i]))}</strong><small>${esc(cur[i].savedDate)}</small></div>`
      : `<div class="stamp"><span class="stamp-mark" aria-hidden="true">${i + 1}</span><strong>비어 있음</strong></div>`).join('');
  }

  function ticketsBody(t, L) {
    return `<div class="lvbox"><div class="lvhead"><strong><span class="lvbadge">Lv.${L.lv}</span>${esc(L.name)}</strong><span>${L.cur} / 10</span></div><div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="10" aria-valuenow="${L.cur}" aria-label="다음 레벨까지 진행도"><div class="progress-bar" style="width:${L.cur * 10}%"></div></div><p class="lvnote">${t.length > 0 && L.cur === 0 ? '새 레벨 시작! 도장 10개를 다시 모아보세요.' : `다음 레벨까지 ${L.next}개`}</p></div>
      <div class="stamp-head"><h3>우유부단 탈출 도장판</h3><span>총 ${t.length}장 발권</span></div><div class="stamp-grid">${stampCells()}</div>
      <div class="stamp-head"><h3>발권한 티켓</h3><span>최신순</span></div>` +
      (t.length
        ? `<div class="tlist">${t.map(x => {
            const m = C.byId(x.movieId);
            const name = m ? m.title : '삭제된 영화';
            return `<div class="tcard"><div class="h">${C.poster(m, 'tposter')}<div><div class="n">${esc(name)}</div><div class="s">${esc(x.savedDate)} · No. ${esc(x.ticketId)}</div></div></div><div class="memo"><input type="text" id="memo-${esc(x.ticketId)}" value="${esc(x.memo || '')}" maxlength="40" placeholder="한 줄 감상 메모" aria-label="${esc(name)} 메모"><button type="button" class="btn" data-memo="${esc(x.ticketId)}">저장</button><button type="button" class="btn danger" data-del="${esc(x.ticketId)}">삭제</button></div><p class="tmsg" id="mm-${esc(x.ticketId)}" role="status"></p></div>`;
          }).join('')}</div>`
        : '<div class="empty-box"><strong>아직 발권한 티켓이 없어요</strong>영화를 추천받아 첫 티켓을 만들어보세요.</div>');
  }

  function bookmarksBody(b) {
    return b.length
      ? `<div class="tlist">${b.map(m => `<div class="tcard"><div class="h">${C.poster(m, 'tposter')}<div><div class="n">${esc(m.title)}</div><div class="s">${m.year} · ${esc(m.genre)} · ${m.runtime}분</div></div></div><div class="memo"><a class="btn primary grow" href="${C.PAGES}recommend.html?step=5&amp;movie=${encodeURIComponent(m.id)}">이 영화로 확정</a><button type="button" class="btn" data-unbm="${m.id}">보관 해제</button></div></div>`).join('')}</div>`
      : '<div class="empty-box"><strong>보관한 영화가 없어요</strong>추천 결과에서 ‘보관 ☆’를 눌러 모아보세요.</div>';
  }

  function render() {
    const t = C.tickets();
    const b = C.bookmarks().map(C.byId).filter(Boolean);
    const L = C.lvInfo(t.length);
    ws.innerHTML = C.header('MY MOVIES / CINEPICK', '내 티켓북', '발권한 티켓과 보관한 영화를 한곳에서 관리해요.', `Lv.${L.lv} ${esc(L.name)}`) +
      `<div class="content"><div class="tabs" role="tablist"><button type="button" role="tab" data-tab="tickets" aria-selected="${state.tab === 'tickets'}">티켓북 ${t.length}</button><button type="button" role="tab" data-tab="bookmarks" aria-selected="${state.tab === 'bookmarks'}">보관 ${b.length}</button></div>${state.tab === 'tickets' ? ticketsBody(t, L) : bookmarksBody(b)}<div class="actions"><a class="btn primary" href="${C.PAGES}recommend.html?new=1">영화 추천받기 →</a></div></div>`;

    ws.querySelectorAll('[data-tab]').forEach(x => x.addEventListener('click', () => { state.tab = x.dataset.tab; state.delId = null; render(); }));

    ws.querySelectorAll('[data-memo]').forEach(x => x.addEventListener('click', () => {
      const id = x.dataset.memo;
      const all = C.tickets();
      const tk = all.find(y => y.ticketId === id);
      const inp = document.getElementById('memo-' + id);
      const msg = document.getElementById('mm-' + id);
      if (tk && inp) {
        tk.memo = inp.value.trim();
        const ok = C.saveTickets(all);
        if (msg) msg.textContent = ok ? '메모를 저장했어요.' : '저장하지 못했어요.';
      }
    }));

    ws.querySelectorAll('[data-del]').forEach(x => x.addEventListener('click', () => {
      const id = x.dataset.del;
      if (state.delId === id) {
        C.saveTickets(C.tickets().filter(y => y.ticketId !== id));
        state.delId = null;
        render();
        C.showToast('티켓을 삭제했어요. 도장도 함께 줄어들어요.');
      } else {
        state.delId = id;
        ws.querySelectorAll('[data-del]').forEach(y => {
          const on = y.dataset.del === id;
          y.classList.toggle('on', on);
          y.textContent = on ? '정말 삭제' : '삭제';
        });
      }
    }));

    ws.querySelectorAll('[data-unbm]').forEach(x => x.addEventListener('click', () => {
      C.saveBm(C.bookmarks().filter(id => id !== x.dataset.unbm));
      render();
    }));
  }

  render();
})();
