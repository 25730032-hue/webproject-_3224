/* 둘러보기 (browse.html): 예시 리뷰 목록과 상세 모달 */
(function () {
  'use strict';
  const C = window.Cinepick;
  const esc = C.esc;
  const ws = document.getElementById('workspace');

  function render() {
    const list = [...C.reviews].filter(r => C.byId(r.movieId)).sort((a, b) => b.id - a.id);
    ws.innerHTML = `<div class="browse-screen">
      <div class="browse-heading"><div><div class="eyebrow">둘러보기 · COMMUNITY REVIEWS</div><h2>다른 사용자들의<br>별점과 감상평</h2></div><span class="status-pill">${list.length}개 리뷰</span></div>
      <p class="browse-subtitle">별점과 감상평을 보고 지금 끌리는 영화를 찾아보세요. 리뷰 카드를 누르면 전체 감상평을 볼 수 있어요.</p>
      <div class="review-list">${list.map(r => {
        const m = C.byId(r.movieId);
        return `<button type="button" class="review-card" data-review-id="${r.id}" aria-label="${esc(m.title)} 감상평 자세히 보기">${C.poster(m, 'review-poster')}<div><h3>${esc(m.title)}</h3><div class="review-meta">${esc(r.user)} · ${esc(r.date)}</div><div class="review-stars"><span aria-hidden="true">★</span> ${r.rating.toFixed(1)} <span class="of">/ 5.0</span></div><p class="review-excerpt">${esc(r.review)}</p><div class="review-open-hint">감상평 전체 보기 →</div></div></button>`;
      }).join('')}</div>
      <p class="review-disclaimer">※ 여러 사용자 콘셉트로 구성한 예시 리뷰입니다. 실제 사용자 계정이나 실시간 리뷰와 연결되지는 않습니다.</p>
    </div>`;
    ws.querySelectorAll('[data-review-id]').forEach(btn => btn.addEventListener('click', () => openDetail(Number(btn.dataset.reviewId))));
  }

  function openDetail(reviewId) {
    const r = C.reviews.find(x => x.id === reviewId);
    if (!r) return;
    const m = C.byId(r.movieId);
    if (!m) return;
    const root = C.openModal(`<div class="modal" role="dialog" aria-modal="true" aria-labelledby="reviewModalTitle"><div class="eyebrow">COMMUNITY REVIEW</div><div class="review-detail-top">${C.poster(m, 'review-detail-poster')}<div><h3 id="reviewModalTitle">${esc(m.title)}</h3><div class="review-meta">${m.year} · ${esc(m.genre)} · ${m.runtime}분</div><div class="review-stars"><span aria-hidden="true">★</span> ${r.rating.toFixed(1)} <span class="of">/ 5.0</span></div><div class="review-meta" style="margin-top:5px">${esc(r.user)} · ${esc(r.date)}</div></div></div><h4 style="font-size:14px;margin:0 0 9px">${esc(r.title)}</h4><div class="review-quote">${esc(r.review)}</div><p style="margin-top:14px;line-height:1.6">${esc(m.overview)}</p><div class="modal-actions"><button type="button" class="btn" id="closeReviewModal">닫기</button><button type="button" class="btn primary" id="saveReviewedMovie">영화 보관 ☆</button></div></div>`);
    root.querySelector('#closeReviewModal').addEventListener('click', C.closeModal);
    root.querySelector('#saveReviewedMovie').addEventListener('click', () => {
      const b = C.bookmarks();
      if (b.includes(m.id)) { C.showToast('이미 보관한 영화예요.'); return; }
      const ok = C.saveBm([...b, m.id]);
      C.showToast(ok ? '나의 영화에 보관했어요.' : C.STORAGE_FAIL_MSG);
    });
  }

  render();
})();
