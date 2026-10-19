/* 도움말 (help.html): 막혔을 때 바로 복구할 수 있는 예외 상황 안내 */
(function () {
  'use strict';
  const C = window.Cinepick;
  const ws = document.getElementById('workspace');

  ws.innerHTML = C.header('HELP / CINEPICK', '막히는 순간에도, 다음 선택은 있어요.', '예상 가능한 예외 상황에서 바로 복구할 수 있도록 준비했어요.', 'HELP / RECOVERY') + '<div class="content" id="recoveryBox"></div>';

  const flow = C.flow.get() || {};
  const movie = flow.movieId ? C.byId(flow.movieId) : null;

  C.renderRecovery(document.getElementById('recoveryBox'), [
    { id: 'noCandidates', icon: '⌕', title: '조건에 맞는 영화가 없어요', desc: '선택한 기분에 맞는 후보가 없을 땐 다른 기분을 골라보세요.', button: '기분 다시 선택', action: () => { window.location.href = C.PAGES + 'recommend.html?new=1'; } },
    { id: 'ott', icon: '↗', title: '감상 서비스를 찾지 못했어요', desc: '서비스 앱에서 영화 제목을 직접 검색해보세요. 이 프로토타입은 OTT별 제공 여부를 조회하지 않아요.', button: '감상 서비스 선택', action: () => (movie ? C.openWatchModal(movie) : C.showToast('먼저 영화를 추천받아 주세요.')) },
    { id: 'storage', icon: '▣', title: '기록을 저장하지 못했어요', desc: '브라우저 저장이 제한되어 있을 수 있어요. 이 경우에도 추천 흐름은 계속 이용할 수 있지만, 페이지를 벗어나면 기록이 사라질 수 있어요.', button: '저장 안내 보기', action: () => C.showToast('브라우저의 사이트 데이터 저장 설정을 확인해 주세요.') }
  ], { label: '← 마이페이지로 돌아가기', action: () => { window.location.href = C.PAGES + 'mypage.html'; } });
})();
