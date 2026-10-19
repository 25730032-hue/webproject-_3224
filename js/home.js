/* 홈 (index.html): 오늘의 영화 + 나의 시네마 바로가기 */
(function () {
  'use strict';
  const C = window.Cinepick;
  const esc = C.esc;
  const m = C.dailyMovie();

  const card = document.getElementById('todayMovie');
  if (card && m) {
    card.innerHTML = `${C.poster(m, 'candidate-poster')}<div class="candidate-info"><div class="eyebrow">TODAY'S PICK · ${m.year}</div><h3 style="margin:0 0 4px;font-size:15px;letter-spacing:-.03em">${esc(m.title)}</h3><div class="candidate-meta">${esc(m.genre)} · ${m.runtime}분</div><p>${esc(m.overview)}</p><div class="candidate-tags"><span>${esc(m.moods[0])}</span><span>${esc(m.tone)}</span><span>${esc(m.food)}</span></div><a class="btn primary" href="${C.PAGES}recommend.html?step=4&amp;movie=${encodeURIComponent(m.id)}">오늘은 이 영화 보기</a></div>`;
  }
  const t = document.getElementById('ticketCount');
  const b = document.getElementById('savedCount');
  if (t) t.textContent = `발권한 영화 ${C.tickets().length}편`;
  if (b) b.textContent = `저장한 영화 ${C.bookmarks().length}편`;
})();
