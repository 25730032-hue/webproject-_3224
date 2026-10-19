/* 마이페이지 (mypage.html): 시네마 기록 요약 */
(function () {
  'use strict';
  const C = window.Cinepick;
  const ws = document.getElementById('workspace');
  const t = C.tickets();
  const b = C.bookmarks();
  const L = C.lvInfo(t.length);

  ws.innerHTML = `<div class="content">
    <div class="eyebrow">MY CINEMA PROFILE</div>
    <h1 class="page-title">마이페이지</h1>
    <div class="profile-summary"><div class="profile-avatar" aria-hidden="true">◉</div><div><h3>나의 영화 생활</h3><p>오늘도 영화 한 편, 가볍게 골라봐요.</p></div></div>
    <div class="home-section-title">시네마 기록</div>
    <div class="lvbox"><div class="lvhead"><strong><span class="lvbadge">Lv.${L.lv}</span>${C.esc(L.name)}</strong><span>${L.cur} / 10</span></div><div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="10" aria-valuenow="${L.cur}" aria-label="다음 레벨까지 진행도"><div class="progress-bar" style="width:${L.cur * 10}%"></div></div><p class="lvnote">다음 레벨까지 ${L.next}개</p></div>
    <a class="profile-row" href="${C.PAGES}movies.html"><span>발권한 영화</span><strong>${t.length}편</strong></a>
    <a class="profile-row" href="${C.PAGES}movies.html?tab=bookmarks"><span>보관한 영화</span><strong>${b.length}편</strong></a>
    <div class="profile-row"><span>서비스 안내</span><span>시네픽 프로토타입</span></div>
    <div class="profile-row"><span>저장 방식</span><span>이 브라우저에 저장</span></div>
    <a class="profile-row" href="${C.PAGES}help.html"><span>도움말 · 막혔을 때</span><span>›</span></a>
    <a class="btn full" href="${C.PAGES}recommend.html?new=1" style="margin-top:20px">영화 추천 처음부터 시작</a>
  </div>`;
})();
