(() => {
 const RAW = [
 {id:1,title:'리틀 포레스트',en:'LITTLE FOREST',year:2018,runtime:103,genre:'드라마',moods:['지침','우울한','센치한'],food:' 따뜻한 집밥',tone:'쉼이 필요한 밤',overview:'도시 생활에 지쳐 고향으로 돌아온 혜원이 사계절의 음식과 일상을 통해 자신만의 속도를 찾아가는 이야기예요.',poster:''},
 {id:2,title:'싱 스트리트',en:'SING STREET',year:2016,runtime:106,genre:'음악 · 로맨스',moods:['신나는','설레는','심심한'],food:' 피자와 탄산',tone:'기분 전환이 필요한 밤',overview:'음악으로 첫사랑과 꿈을 향해 나아가는 소년의 이야기. 경쾌한 리듬과 청춘의 에너지가 가득해요.',poster:''},
 {id:3,title:'비긴 어게인',en:'BEGIN AGAIN',year:2013,runtime:104,genre:'음악 · 로맨스',moods:['센치한','설레는','지침'],food:' 치즈 플레이트',tone:'잔잔한 여운이 필요한 밤',overview:'뉴욕의 거리에서 음악으로 다시 시작하는 두 사람. 편안하게 흐르는 음악과 따뜻한 위로를 만나보세요.',poster:''},
 {id:4,title:'극한직업',en:'EXTREME JOB',year:2019,runtime:111,genre:'코미디 · 액션',moods:['신나는','심심한'],food:' 치킨과 맥주',tone:'아무 생각 없이 웃고 싶은 밤',overview:'잠복 수사를 위해 치킨집을 운영하게 된 형사들. 빠른 템포와 엉뚱한 상황이 이어지는 코미디예요.',poster:'!'},
 {id:5,title:'인사이드 아웃',en:'INSIDE OUT',year:2015,runtime:95,genre:'애니메이션',moods:['우울한','센치한','신나는'],food:' 팝콘',tone:'내 마음을 들여다보고 싶은 밤',overview:'마음속 감정들의 모험을 따라가며 기쁨과 슬픔이 모두 필요한 이유를 돌아보게 하는 애니메이션이에요.',poster:''},
 {id:6,title:'트루먼 쇼',en:'THE TRUMAN SHOW',year:1998,runtime:103,genre:'드라마 · SF',moods:['심심한','센치한','우울한'],food:' 짭짤한 스낵',tone:'생각할 거리가 필요한 밤',overview:'평범하다고 믿었던 일상이 거대한 세트라면? 익숙한 세계를 새롭게 바라보게 만드는 영화예요.',poster:'◉'},
 {id:7,title:'프란시스 하',en:'FRANCES HA',year:2012,runtime:86,genre:'코미디 · 드라마',moods:['지침','센치한','우울한'],food:' 커피와 쿠키',tone:'내 페이스를 찾고 싶은 밤',overview:'불안정한 스물일곱의 일상 속에서도 자기만의 리듬을 찾아가는 프란시스의 흑백 성장담이에요.',poster:'F'},
 {id:8,title:'원스',en:'ONCE',year:2007,runtime:86,genre:'음악 · 로맨스',moods:['센치한','설레는','지침'],food:' 가벼운 야식',tone:'조용히 음악을 듣고 싶은 밤',overview:'더블린의 거리에서 만난 두 사람이 음악을 통해 서로의 마음을 나누는 소박하고 아름다운 이야기예요.',poster:''},
 {id:9,title:'월터의 상상은 현실이 된다',en:'THE SECRET LIFE OF WALTER MITTY',year:2013,runtime:114,genre:'모험 · 코미디',moods:['신나는','설레는','지침'],food:' 버거와 감자튀김',tone:'일상에서 탈출하고 싶은 밤',overview:'상상 속에서만 모험하던 월터가 진짜 세상으로 나서는 여정. 풍경과 음악이 시원한 용기를 전해줘요.',poster:'↗'},
 {id:10,title:'코코',en:'COCO',year:2017,runtime:105,genre:'애니메이션 · 판타지',moods:['센치한','설레는','우울한'],food:' 멕시칸 스낵',tone:'마음 따뜻해지고 싶은 밤',overview:'음악을 사랑하는 미겔이 기억과 가족의 의미를 찾아 떠나는 모험. 다 보고 나면 마음에 여운이 남아요.',poster:''},
 {id:11,title:'엑시트',en:'EXIT',year:2019,runtime:103,genre:'액션 · 코미디',moods:['신나는','심심한'],food:' 매콤한 야식',tone:'속도감 있는 재미가 필요한 밤',overview:'도심에 퍼진 유독가스 속에서 탈출해야 하는 두 사람. 긴장감과 유머가 이어지는 재난 액션이에요.',poster:'↑'},
 {id:12,title:'비포 선셋',en:'BEFORE SUNSET',year:2004,runtime:80,genre:'로맨스 · 드라마',moods:['센치한','설레는','지침'],food:' 와인 한 잔',tone:'대화와 여운이 필요한 밤',overview:'오랜 시간이 흐른 뒤 파리에서 다시 만난 두 사람이 걷고 대화하며 지나온 마음을 마주하는 작품이에요.',poster:''},
 {id:13,title:'패딩턴',en:'PADDINGTON',year:2014,runtime:95,genre:'가족 · 코미디',moods:['우울한','심심한','설레는'],food:' 샌드위치',tone:'포근한 위로가 필요한 밤',overview:'런던에 도착한 작은 곰 패딩턴이 새로운 가족과 이웃을 만나며 벌어지는 따뜻한 소동이에요.',poster:''},
 {id:14,title:'소울',en:'SOUL',year:2020,runtime:100,genre:'애니메이션 · 판타지',moods:['지침','우울한','센치한'],food:' 따뜻한 차',tone:'삶의 작은 순간을 느끼고 싶은 밤',overview:'꿈과 목적에 대해 고민하던 음악 선생님이 삶을 이루는 사소한 순간의 소중함을 발견해요.',poster:''},
 {id:15,title:'스파이더맨: 뉴 유니버스',en:'SPIDER-MAN: INTO THE SPIDER-VERSE',year:2018,runtime:117,genre:'애니메이션 · 액션',moods:['신나는','심심한'],food:' 피자와 맥주',tone:'에너지를 충전하고 싶은 밤',overview:'새로운 스파이더맨 마일스가 여러 차원의 히어로들과 만나며 자기만의 길을 찾아가요.',poster:''},
 {id:16,title:'마담 프루스트의 비밀정원',en:'ATTILA MARCEL',year:2013,runtime:106,genre:'코미디 · 드라마',moods:['센치한','지침','우울한'],food:' 디저트',tone:'몽글몽글한 기분이 필요한 밤',overview:'말없이 살아온 남자가 이웃의 특별한 정원에서 기억과 감정을 마주하는 동화 같은 이야기예요.',poster:''}
 ];
 const movies = RAW.map(m => ({...m, id:'mov_' + String(m.id).padStart(3,'0')}));
 const moodOptions = [
 {name:'신나는',icon:'',desc:'에너지를 끌어올리고 싶을 때'},
 {name:'지침',icon:'',desc:'편하게 쉬어가고 싶을 때'},
 {name:'센치한',icon:'',desc:'감정과 여운에 잠기고 싶을 때'},
 {name:'설레는',icon:'',desc:'두근거리는 이야기가 필요할 때'},
 {name:'우울한',icon:'',desc:'마음을 다독이고 싶을 때'},
 {name:'심심한',icon:'',desc:'재미있게 기분 전환하고 싶을 때'}
 ];
 const TITLES = ['우유부단 견습생','선택 장애 탈출러','룰렛 단골','영화 고르기 달인','시네픽 마스터'];
 const lvInfo = total => { const lv = Math.floor(total/10) + 1; return {lv, cur: total % 10, next: 10 - total % 10, name: TITLES[Math.min(lv, TITLES.length) - 1]}; };

 const defaultState = {activeTab:'home',step:1,mood:null,maxRuntime:null,movie:null,candidates:[],lastMovieId:null,spinning:false,showWheel:false,wheelRot:0,fromRoulette:false,tab:'tickets',lvUp:null,delId:null};
 let state = {...defaultState};
 let toastTimeout = null, decideTimer = null, spinTimeout = null;
 const $ = sel => document.querySelector(sel);
 const workspace = $('#workspace');
 const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

 /* 저장소: 티켓(savedTickets)과 보관(bookmarkedIds). 저장이 막혀도 창을 닫기 전까지는 메모리로 유지 */
 const mem = {tickets:[], bm:[]};
 function rd(key, fb){ try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : mem[fb]; } catch(e){ return mem[fb]; } }
 function wr(key, fb, val){ mem[fb] = val; try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch(e){ return false; } }
 const tickets = () => rd('savedTickets', 'tickets');
 const bookmarks = () => rd('bookmarkedIds', 'bm');
 const saveTickets = v => wr('savedTickets', 'tickets', v);
 const saveBm = v => wr('bookmarkedIds', 'bm', v);
 const byId = id => movies.find(m => m.id === id);
 // 프로토타입용 예시 리뷰입니다. 실제 다른 사용자 데이터와 연동된 것은 아닙니다.
 const communityReviews = [
 {id:101,movieId:1,user:'밤산책러',rating:4.5,date:'오늘',title:'야식 먹으면서 보기 딱 좋은 영화',review:'잔잔한데 지루하지 않고, 음식이 만들어지는 장면을 보고 있으니 마음까지 편해졌어요. 복잡한 하루 끝에 아무 생각 없이 쉬고 싶을 때 추천해요.'},
 {id:102,movieId:4,user:'치킨무좋아',rating:4.0,date:'어제',title:'친구 없이 혼자 봐도 빵 터짐',review:'전개가 빠르고 웃음 포인트가 계속 나와서 치킨 먹으면서 보기 좋았어요. 깊은 생각 없이 시원하게 웃고 싶은 밤에 잘 맞아요.'},
 {id:103,movieId:3,user:'새벽플레이리스트',rating:4.5,date:'2일 전',title:'음악이 오래 남는 따뜻한 이야기',review:'대사보다 음악과 분위기가 기억에 남았어요. 조금 센치한 밤에 혼자 조용히 보기 좋고, 보고 나서 플레이리스트도 찾아 듣게 됐어요.'},
 {id:104,movieId:6,user:'반전수집가',rating:5.0,date:'3일 전',title:'다 보고 나서 이야기하고 싶어지는 영화',review:'처음에는 가볍게 시작했는데 끝나고 나니 생각할 거리가 많았어요. 결말을 알고 보기보다는 아무 정보 없이 보는 걸 추천합니다.'},
 {id:105,movieId:5,user:'감정은소중해',rating:4.5,date:'4일 전',title:'생각보다 마음을 많이 건드려요',review:'애니메이션이라 편하게 시작했는데 감정을 바라보는 방식이 좋았어요. 괜히 울컥하는 장면이 있어서 혼자 보는 밤에 잘 어울렸습니다.'},
 {id:106,movieId:2,user:'청춘재생중',rating:4.0,date:'지난주',title:'기분 전환이 필요할 때 추천',review:'음악이 신나고 러닝타임도 부담스럽지 않아요. 뭔가 시작하고 싶은 기분이 드는 영화라 주말 밤에 보기 좋았습니다.'},
 {id:107,movieId:1,user:'퇴근후한편',rating:4.0,date:'지난주',title:'편안하게 하루 마무리하기 좋아요',review:'큰 사건이 없어도 인물들이 살아가는 모습을 따라가다 보면 마음이 차분해져요. 늦은 밤에 부담 없이 보기 좋은 작품이었습니다.'},
 {id:108,movieId:4,user:'팝콘대신치킨',rating:4.5,date:'5일 전',title:'웃고 싶을 때 꺼내 보는 영화',review:'캐릭터들이 만들어 내는 상황이 계속 웃겨서 스트레스가 풀렸어요. 혼자 봤는데도 몇 번이나 소리 내서 웃었습니다.'},
 {id:109,movieId:3,user:'새벽감성주의',rating:5.0,date:'6일 전',title:'엔딩 이후에도 여운이 남아요',review:'음악과 장면이 자연스럽게 어우러져서 이야기에 빠져들었어요. 조용한 밤에 집중해서 보면 더 좋을 것 같아요.'},
 {id:110,movieId:5,user:'오늘도힐링중',rating:4.5,date:'1주 전',title:'가볍게 시작했다가 위로받았어요',review:'감정을 표현하는 방식이 귀엽고 섬세해서 좋았어요. 기분이 조금 가라앉은 날 보면 위로가 될 만한 영화예요.'},
 {id:111,movieId:6,user:'결말은비밀',rating:4.5,date:'1주 전',title:'스포일러 없이 보는 걸 추천',review:'초반에 나온 작은 단서들이 뒤에서 연결되는 재미가 있어요. 다 보고 나서 장면들을 다시 떠올리게 되는 영화였습니다.'},
 {id:112,movieId:2,user:'플레이리스트수집가',rating:4.5,date:'2주 전',title:'보고 나면 노래가 계속 생각나요',review:'영화 분위기와 음악이 잘 맞아서 보는 내내 기분이 좋아졌어요. 영화가 끝난 뒤에도 사운드트랙을 찾아 듣게 됐습니다.'}
 ];
 // 리뷰의 movieId를 영화 데이터와 동일한 형식으로 정규화합니다.
 communityReviews.forEach(r => r.movieId = 'mov_' + String(r.movieId).padStart(3, '0'));
 const foodEmoji = m => (m && m.food) ? m.food.split(' ')[0] : '';
 const foodBadge = m => (m && m.food) ? `<span class="food-badge" title="어울리는 음식: ${esc(m.food)}" aria-label="어울리는 음식 ${esc(m.food)}">${foodEmoji(m)}</span>` : '';
 const titleOf = t => (byId(t.movieId) || {title:'삭제된 영화'}).title;
 const todayStr = () => { const d = new Date(); return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`; };
 const issuedToday = m => tickets().find(t => t.movieId === m.id && t.savedDate === todayStr());

 function showToast(message){ const el = $('#toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toastTimeout); toastTimeout = setTimeout(() => el.classList.remove('show'), 2600); }
 function filteredMovies(){ return movies.filter(m => (!state.mood || m.moods.includes(state.mood))); }

 function setStep(step){
 if(step === 2) step = 3;
 if(step === 3 && !state.mood){ showToast('먼저 지금의 기분을 선택해 주세요.'); state.step = 1; render(); return; }
 if((step === 4 || step === 5) && !state.movie){ showToast('먼저 룰렛으로 영화를 추천받아 주세요.'); state.step = state.mood ? 3 : 1; render(); return; }
 if(step !== 5) state.lvUp = null;
 state.delId = null;
 state.step = step;
 state.activeTab = 'recommend';
 render();
 }
 function header(step, title, description, status){
 return `<div class="workspace-head"><div><div class="eyebrow">STEP 0${step} / CINEMA CLUB</div><h3>${title}</h3><p>${description}</p></div><span class="status-pill">${status}</span></div>`;
 }
 function chip(label, value){ return `<span class="chip"><em>${label}</em> ${value}</span>`; }

 function renderMood(){
 workspace.innerHTML = header(1,'지금 기분은?','지금의 기분과 가장 가까운 하나를 골라주세요.','선택 1개') +
 `<div class="content"><div class="section-row"><h4>오늘 밤의 무드</h4><span>MOOD FILTER · 단일 선택</span></div><div class="mood-grid">${moodOptions.map(m => `<button class="mood-card ${state.mood===m.name?'selected':''}" data-mood="${m.name}" aria-pressed="${state.mood===m.name}"><span class="checkmark"></span><span class="mood-icon">${m.icon}</span><strong>${m.name}</strong><small>${m.desc}</small></button>`).join('')}</div><div class="selection-summary">${state.mood ? chip('선택한 기분', state.mood) : '<span class="chip">아직 선택하지 않았어요</span>'}</div><div class="callout"><strong>작은 팁</strong> · 정확한 감정을 고르기 어려우면, 지금 보고 싶은 분위기에 가까운 것을 골라도 좋아요.</div><div class="actions"><button class="btn primary" id="toDuration" ${state.mood?'':'disabled'}>룰렛 돌리러 가기 <span aria-hidden="true"></span></button></div></div>`;
 workspace.querySelectorAll('[data-mood]').forEach(b => b.addEventListener('click', () => { state.mood = b.dataset.mood; state.movie = null; state.candidates = []; state.lastMovieId = null; renderMood(); updateNavigation(); }));
 $('#toDuration').addEventListener('click', () => { state.maxRuntime = null; state.candidates = filteredMovies(); state.showWheel = true; setStep(3); });
 }
 function renderDuration(){
 // 시간 제한 선택 단계는 제거했습니다. 기분 선택 다음에는 후보 목록으로 이동합니다.
 state.maxRuntime = null;
 state.candidates = filteredMovies();
 state.showWheel = false;
 state.step = 3;
 renderWheel();
 }
 function renderWheel(){
 const candidates = filteredMovies(); state.candidates = candidates;
 if(!candidates.length){ renderRecovery('noCandidates'); return; }
 if(!state.showWheel){
 workspace.innerHTML = header(3,'조건에 맞는 영화가 모였어요','목록에서 직접 선택하거나, 결정이 어렵다면 룰렛에 맡겨보세요.','후보 ' + candidates.length + '편') +
 `<div class="content"><div class="selection-summary">${chip('기분', state.mood || '전체')}${chip('후보', candidates.length + '편')}</div><div class="divider"></div><div class="section-row"><h4>지금 볼 수 있는 영화</h4><span>조건에 맞는 후보만 표시</span></div><div class="candidate-list">${candidates.map(m => `<article class="candidate-card"><div class="candidate-poster">${m.poster}</div><div class="candidate-info"><h4>${m.title}${foodBadge(m)}</h4><div class="candidate-meta">${m.year} · ${m.genre} · ${m.runtime}분</div><p>${m.overview}</p><div class="candidate-tags"><span>${m.moods.includes(state.mood) ? state.mood : m.moods[0]}</span><span>${m.tone}</span><span>${m.food}</span></div></div><button class="btn primary candidate-pick" data-pick-movie="${m.id}">이 영화 선택</button></article>`).join('')}</div><div class="callout"><strong>선택 방법</strong> · 마음에 드는 영화를 바로 선택하거나, 랜덤 추첨으로 한 편을 골라보세요.</div><div class="actions"><button class="btn" id="editConditions">← 조건 수정</button><button class="btn primary" id="openWheel">랜덤으로 한 편 고르기</button></div></div>`;
 workspace.querySelectorAll('[data-pick-movie]').forEach(b => b.addEventListener('click', () => {
 const picked = byId(b.dataset.pickMovie); if(!picked) return;
 state.movie = picked; state.lastMovieId = picked.id; setStep(4);
 }));
 $('#editConditions').addEventListener('click', () => setStep(1));
 $('#openWheel').addEventListener('click', () => { state.showWheel = true; renderWheel(); });
 return;
 }
 const wheelSize = candidates.length, segDeg = 360 / wheelSize;
 const colors = ['var(--paper)','var(--surface)','var(--soft-red)'];
 const pt = (deg, r) => { const a = deg * Math.PI / 180; return [(r * Math.sin(a)).toFixed(2), (-r * Math.cos(a)).toFixed(2)]; };
 const short = s => s.length > 6 ? s.slice(0, 5) + '…' : s;
 const segs = candidates.map((m, i) => {
 const a0 = i * segDeg, a1 = a0 + segDeg, [x0,y0] = pt(a0, 96), [x1,y1] = pt(a1, 96), c = a0 + segDeg / 2;
 const fill = colors[(wheelSize % 2 && i === wheelSize - 1 && i % 2 === 0) ? 2 : i % 2];
 const path = wheelSize === 1 ? `<circle r="96" style="fill:${fill}"/>` : `<path d="M0 0 L${x0} ${y0} A96 96 0 ${segDeg > 180 ? 1 : 0} 1 ${x1} ${y1} Z" style="fill:${fill};stroke:var(--line-strong);stroke-width:.6"/>`;
 return path + `<text transform="${c > 180 ? `rotate(${c + 90}) translate(-58 0)` : `rotate(${c - 90}) translate(58 0)`}" text-anchor="middle" dominant-baseline="middle" style="fill:var(--ink);font-size:${wheelSize > 8 ? 7 : 8.5}px;font-weight:800">${foodEmoji(m)} ${esc(short(m.title))}</text>`;
 }).join('');
 workspace.innerHTML = header(3,'운명에 맡겨볼까요?','룰렛이 멈춘 영화에 10초 안에 결정해요. 고민은 짧게!','후보 ' + candidates.length + '편') +
 `<div class="content"><div class="wheel-layout"><div class="wheel-wrap"><div class="wheel-pointer" aria-hidden="true"></div><svg class="roulette" id="wheel" viewBox="-100 -100 200 200" role="img" aria-label="후보 영화 ${candidates.length}편 룰렛" style="transform:rotate(${state.wheelRot}deg)"><circle r="98" style="fill:var(--paper);stroke:var(--ink);stroke-width:2"/>${segs}<circle r="14" style="fill:var(--paper);stroke:var(--ink);stroke-width:1.2"/><text text-anchor="middle" dominant-baseline="central" style="font-size:12px"></text></svg></div><div class="wheel-panel"><div class="eyebrow">YOUR CONDITIONS</div><h4>이번 밤의 후보</h4><p>선택한 기분에 맞는 영화만 룰렛에 올라가요.</p><div class="condition-list"><div class="condition-line"><span>현재 기분</span><strong>${state.mood}</strong></div><div class="condition-line"><span>추천 후보</span><strong>${candidates.length}편</strong></div><div class="condition-line"><span>결정 시간</span><strong>10초</strong></div></div><div class="spin-note" id="spinNote"></div><button class="btn primary full" id="spinButton">룰렛 돌리기</button><button class="btn full" id="backCandidates" style="margin-top:8px">후보 보기</button><button class="btn full" id="editConditions" style="margin-top:8px">조건 수정하기</button></div></div></div>`;
 $('#spinButton').addEventListener('click', spinRoulette);
 $('#backCandidates').addEventListener('click', () => { state.showWheel = false; renderWheel(); });
 $('#editConditions').addEventListener('click', () => setStep(1));
 }
 function spinRoulette(){
 if(state.spinning) return;
 const candidates = filteredMovies();
 if(!candidates.length){ renderRecovery('noCandidates'); return; }
 let pool = candidates.filter(m => m.id !== state.lastMovieId); if(!pool.length) pool = candidates;
 const pick = pool[Math.floor(Math.random() * pool.length)];
 const idx = candidates.indexOf(pick), segDeg = 360 / candidates.length;
 const target = (360 - (idx + 0.5) * segDeg) % 360;
 const jitter = (Math.random() - 0.5) * segDeg * 0.6;
 const base = state.wheelRot;
 state.wheelRot = base + 360 * 5 + ((target - (base % 360)) + 720) % 360 + jitter;
 state.spinning = true;
 const wheel = $('#wheel'), button = $('#spinButton'), note = $('#spinNote');
 button.disabled = true; button.textContent = '룰렛이 도는 중…'; note.textContent = '어떤 영화에 멈출까요?';
 $('#backCandidates').disabled = true; $('#editConditions').disabled = true;
 if(wheel){ void wheel.getBoundingClientRect(); wheel.style.transform = `rotate(${state.wheelRot}deg)`; }
 const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
 spinTimeout = setTimeout(() => { state.spinning = false; state.movie = pick; state.lastMovieId = pick.id; state.fromRoulette = true; note.textContent = ` ${pick.title}!`; spinTimeout = setTimeout(() => setStep(4), 500); }, reduce ? 300 : 3200);
 }
 function posterMarkup(movie){ return `<div class="poster"><span class="poster-kicker">TONIGHT'S PICK · ${movie.year}</span><span class="poster-title">${movie.title}</span><span class="poster-foot">${movie.en}<br>${movie.poster} &nbsp; A CINEMA ROULETTE PICK</span></div>`; }
 const bmLabel = m => bookmarks().includes(m.id) ? '보관 중 ' : '보관 ';
 function toggleBm(m, btn){
 const cur = bookmarks(), has = cur.includes(m.id);
 const ok = saveBm(has ? cur.filter(x => x !== m.id) : [...cur, m.id]);
 if(btn) btn.textContent = bmLabel(m);
 showToast(has ? '보관을 해제했어요.' : (ok ? '보관함에 담았어요.' : '저장하지 못했어요. 창을 닫기 전까지만 유지돼요.'));
 }
 /* 10초 결정 타이머: 룰렛 결과에서만 작동. 시간이 다 되면 그 영화로 자동 확정 */
 const DECIDE_SEC = 10;
 function clearTimers(){ clearInterval(decideTimer); decideTimer = null; }
 function startDecideTimer(m){
 clearTimers();
 const end = Date.now() + DECIDE_SEC * 1000;
 const bar = $('#decideBar'), num = $('#decideNum'), box = $('#decideBox');
 const tick = () => {
 const left = Math.max(0, end - Date.now()), sec = Math.ceil(left / 1000);
 if(bar) bar.style.width = (left / (DECIDE_SEC * 1000) * 100) + '%';
 if(num) num.textContent = sec;
 if(box) box.classList.toggle('urgent', sec <= 3);
 if(left <= 0){ clearTimers(); showToast('시간 끝! 룰렛이 고른 영화로 결정했어요.'); confirmMovie(m); }
 };
 tick(); decideTimer = setInterval(tick, 100);
 }
 function confirmMovie(m){
 clearTimers();
 const confirmBtn = $('#confirmMovie');
 if (confirmBtn){ if(confirmBtn.dataset.confirming === '1') return; confirmBtn.dataset.confirming = '1'; confirmBtn.disabled = true; }
 state.fromRoulette = false;
 state.movie = m;
 issueTicket(m, true);
 const overlay = document.createElement('div');
 overlay.className = 'ticket-tear-overlay';
 overlay.setAttribute('role', 'status');
 overlay.setAttribute('aria-live', 'polite');
 overlay.innerHTML = `<div class="ticket-tear-stage"><div class="ticket-tear-caption">CINEPICK · YOUR PICK</div><h2 class="ticket-tear-title">이 영화로 결정!</h2><p class="ticket-tear-subtitle">오늘의 영화 티켓을 찢어 확정하고 있어요.</p><div class="tear-ticket" aria-hidden="true"><div class="tear-ticket-half tear-ticket-top"><span class="tear-mark"></span><span class="tear-movie">${esc(m.title)}</span></div><div class="tear-ticket-half tear-ticket-bottom"><span>OFFICIAL PICK</span><span class="tear-code">SP · </span></div></div><div class="ticket-tear-foot">좋은 감상 되세요 · ENJOY THE MOVIE</div></div>`;
 document.body.appendChild(overlay);
 window.setTimeout(() => { overlay.remove(); const lv = state.lvUp; setStep(5); if(lv){ state.lvUp = lv; render(); } }, 1450);
 }
 function renderResult(){
 const m = state.movie;
 if(!m){ state.step = 3; renderWheel(); return; }
 const timed = state.fromRoulette;
 const timerBox = timed ? `<div class="decide-box" id="decideBox" role="timer" aria-live="off"><div class="decide-head"><span>⏱ 결정까지</span><strong><span id="decideNum">${DECIDE_SEC}</span>초</strong></div><div class="decide-track"><div class="decide-bar" id="decideBar"></div></div><p>시간이 끝나면 이 영화로 자동 확정돼요. 다른 영화를 보려면 ‘후보 보기’를 누르세요.</p></div>` : '';
 workspace.innerHTML = header(4,'오늘의 추천 영화', timed ? '룰렛이 골라준 영화예요. 10초 안에 결정해 볼까요?' : '마음에 들면 확정하세요. 다른 영화가 궁금하면 후보를 다시 볼 수 있어요.', timed ? '⏱ 10초 결정' : '추천 결과') +
 `<div class="content">${timerBox}<div class="result-layout"><div>${posterMarkup(m)}</div><div class="result-info"><div class="eyebrow">WE PICKED FOR YOU</div><h4>${m.title}${foodBadge(m)}</h4><p class="subline">${m.year} · ${m.genre} · ${m.runtime}분</p><div class="tags"><span class="tag">${m.moods.includes(state.mood) ? state.mood : m.moods[0]}</span><span class="tag">${m.tone}</span><span class="tag">${m.food}</span></div><p class="overview">${m.overview}</p><div class="actions" style="justify-content:stretch"><button class="btn" id="showCandidates">후보 보기 </button><button class="btn" id="tryAgain">다시 돌리기 ↻</button><button class="btn" id="bmBtn">${bmLabel(m)}</button><button class="btn primary" id="confirmMovie">이 영화로 확정 </button></div></div></div></div>`;
 $('#showCandidates').addEventListener('click', () => { clearTimers(); state.fromRoulette = false; state.showWheel = false; if(!state.mood) state.mood = m.moods[0]; setStep(3); });
 $('#tryAgain').addEventListener('click', () => { clearTimers(); if(!state.mood) state.mood = m.moods[0]; state.step = 3; state.showWheel = true; render(); setTimeout(spinRoulette, 60); });
 $('#bmBtn').addEventListener('click', e => toggleBm(m, e.currentTarget));
 $('#confirmMovie').addEventListener('click', () => confirmMovie(m));
 if(timed) startDecideTimer(m);
 updateNavigation();
 }

 function issueTicket(m, silent){
 const all = tickets();
 if(issuedToday(m)){ if(!silent) showToast('오늘 이미 발권한 영화예요.'); return; }
 const t = {ticketId:'t_' + Date.now().toString(36), movieId:m.id, savedDate:todayStr(), memo:''};
 const before = lvInfo(all.length), after = lvInfo(all.length + 1);
 const ok = saveTickets([t, ...all]);
 state.lvUp = after.lv > before.lv ? after : null;
 showToast(ok ? '티켓 발권 완료! 도장 한 칸이 채워졌어요.' : '이 브라우저에는 저장하지 못했어요. 창을 닫기 전까지만 유지돼요.');
 if(!silent) renderConfirmed();
 }
 function renderConfirmed(){
 const m = state.movie;
 if(!m){ state.step = 3; renderWheel(); return; }
 const t = issuedToday(m);
 const stub = t ? `<div class="ticket-stub"><div class="k">MATCHING TICKET</div><div class="t">${m.title}</div><div class="d"><span>${t.savedDate}</span><span>No. ${esc(t.ticketId)}</span></div></div>` : '';
 const up = state.lvUp ? `<div class="lvup" role="status"><b>LEVEL UP! Lv.${state.lvUp.lv}</b><span>도장 10개 완성 · ${state.lvUp.name}</span></div>` : '';
 workspace.innerHTML = header(5,'선택 완료. 이제 감상할 시간!','영화를 확정했어요. 티켓을 발권하면 도장이 한 칸 채워져요.', t ? '티켓 발권 완료' : '영화 확정') +
 `<div class="content"><div class="confirm-banner"><div class="confirm-icon">${m.poster}</div><div><div class="eyebrow">TONIGHT'S MOVIE</div><h4>${m.title}${foodBadge(m)}</h4><p>${m.year} · ${m.genre} · ${m.runtime}분</p><p style="margin-top:6px">야식 페어링 · ${m.food}</p></div></div>${up}${stub}<div class="actions" style="justify-content:stretch;margin-top:0"><button class="btn primary" id="issueTicket" ${t ? 'disabled' : ''}>${t ? '발권 완료 ' : '매칭 티켓 발권 '}</button><button class="btn" id="watchMovie">감상 서비스 선택 ↗</button><button class="btn" id="bmBtn">${bmLabel(m)}</button></div><div class="callout"><strong>감상 준비</strong> · OTT 서비스 연결은 데모 단계예요. 서비스를 선택하면 공식 사이트로 이동하고, 영화 제목은 직접 검색해 주세요.</div><div class="actions"><button class="btn" id="moreMovie">새 영화 추천하기</button><button class="btn primary" id="toBook">티켓북 보기 →</button></div></div>`;
 $('#issueTicket').addEventListener('click', () => issueTicket(m));
 $('#watchMovie').addEventListener('click', () => openWatchModal(m));
 $('#bmBtn').addEventListener('click', e => toggleBm(m, e.currentTarget));
 $('#moreMovie').addEventListener('click', () => { state.movie = null; state.lastMovieId = null; state.mood = null; setStep(1); });
 $('#toBook').addEventListener('click', () => { state.tab = 'tickets'; setStep(6); });
 }
 function openWatchModal(m){
 const root = $('#modalRoot');
 root.innerHTML = `<div class="modal-backdrop" id="backdrop"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><div class="eyebrow">READY TO WATCH</div><h3 id="modalTitle">어디에서 감상할까요?</h3><p>현재 프로토타입은 OTT 보유 여부를 조회하지 않아요. 서비스를 고르면 공식 사이트로 이동합니다.</p><div class="service-list"><button data-url="https://www.netflix.com/">Netflix ↗</button><button data-url="https://watcha.com/">WATCHA ↗</button><button data-url="https://www.wavve.com/">Wavve ↗</button><button data-url="https://www.tving.com/">TVING ↗</button></div><div class="modal-actions"><button class="btn" id="closeModal">닫기</button></div></div></div>`;
 $('#closeModal').addEventListener('click', () => root.innerHTML = '');
 $('#backdrop').addEventListener('click', e => { if(e.target.id === 'backdrop') root.innerHTML = ''; });
 root.querySelectorAll('[data-url]').forEach(b => b.addEventListener('click', () => { const url = b.dataset.url; root.innerHTML = ''; showToast(`‘${m.title}’을 검색해서 이용 가능 여부를 확인해 주세요.`); window.open(url, '_blank', 'noopener,noreferrer'); }));
 }

 /* 티켓북: 도장판(10칸) + 레벨 + 티켓 목록(메모 수정/삭제) + 보관 탭 */
 function stampCells(){
 const chrono = tickets().slice().reverse();
 const cur = chrono.slice(Math.floor(chrono.length / 10) * 10);
 return Array.from({length:10}, (_, i) => cur[i]
 ? `<div class="stamp filled"><span class="stamp-mark"></span><strong>${esc(titleOf(cur[i]))}</strong><small>${esc(cur[i].savedDate)}</small></div>`
 : `<div class="stamp"><span class="stamp-mark">${i + 1}</span><strong>비어 있음</strong></div>`).join('');
 }
 function renderTicketbook(){
 const t = tickets(), b = bookmarks().map(byId).filter(Boolean), L = lvInfo(t.length);
 let body = '';
 if(state.tab === 'tickets'){
 body = `<div class="lvbox"><div class="lvhead"><strong><span class="lvbadge">Lv.${L.lv}</span>${L.name}</strong><span>${L.cur} / 10</span></div><div class="timer-track" style="height:6px"><div class="timer-progress" style="width:${L.cur * 10}%;transition:none"></div></div><p class="lvnote">${t.length > 0 && L.cur === 0 ? '새 레벨 시작! 도장 10개를 다시 모아보세요.' : `다음 레벨까지 ${L.next}개`}</p></div>
 <div class="stamp-head"><h4>우유부단 탈출 도장판</h4><span>총 ${t.length}장 발권</span></div><div class="stamp-grid">${stampCells()}</div>
 <div class="stamp-head"><h4>발권한 티켓</h4><span>최신순</span></div>` +
 (t.length ? `<div class="tlist">${t.map(x => { const m = byId(x.movieId) || {title:'삭제된 영화', poster:'?'}; return `<div class="tcard"><div class="h"><div class="g">${m.poster}</div><div><div class="n">${esc(m.title)}${foodBadge(m)}</div><div class="s">${esc(x.savedDate)} · No. ${esc(x.ticketId)}</div></div></div><div class="memo"><input type="text" id="memo-${esc(x.ticketId)}" value="${esc(x.memo || '')}" maxlength="40" placeholder="한 줄 감상 메모" aria-label="${esc(m.title)} 메모"><button class="btn" data-memo="${esc(x.ticketId)}">저장</button><button class="btn danger" data-del="${esc(x.ticketId)}">삭제</button></div><button class="btn" data-review-ticket="${esc(x.movieId)}" style="min-height:0;padding:8px;font-size:11px">${myReviews().some(r => r.movieId === x.movieId) ? '내 리뷰 수정 ' : '이 영화 리뷰 쓰기 '}</button><p class="tmsg" id="mm-${esc(x.ticketId)}"></p></div>`; }).join('')}</div>`
 : `<div class="empty-box"><strong>아직 발권한 티켓이 없어요</strong>룰렛을 돌려 첫 티켓을 만들어보세요.</div>`);
 } else {
 body = b.length ? `<div class="tlist">${b.map(m => `<div class="tcard"><div class="h"><div class="g">${m.poster}</div><div><div class="n">${m.title}${foodBadge(m)}</div><div class="s">${m.year} · ${m.genre} · ${m.runtime}분</div></div></div><div class="memo"><button class="btn primary" data-pick="${m.id}" style="flex:1">이 영화로 확정</button><button class="btn" data-unbm="${m.id}">보관 해제</button></div></div>`).join('')}</div>`
 : `<div class="empty-box"><strong>보관한 영화가 없어요</strong>추천 결과에서 ‘보관 ’를 눌러 모아보세요.</div>`;
 }
 workspace.innerHTML = header(6,'내 티켓북','발권한 티켓과 보관한 영화를 한곳에서 관리해요.', `Lv.${L.lv} ${L.name}`) +
 `<div class="content"><div class="tabs" role="tablist"><button role="tab" data-tab="tickets" aria-selected="${state.tab === 'tickets'}">티켓북 ${t.length}</button><button role="tab" data-tab="bookmarks" aria-selected="${state.tab === 'bookmarks'}">보관 ${b.length}</button></div>${body}<div class="actions"><button class="btn primary" id="startAgain">영화 추천받기 →</button></div></div>`;
 workspace.querySelectorAll('[data-tab]').forEach(x => x.addEventListener('click', () => { state.tab = x.dataset.tab; state.delId = null; renderTicketbook(); }));
 workspace.querySelectorAll('[data-memo]').forEach(x => x.addEventListener('click', () => {
 const id = x.dataset.memo, all = tickets(), tk = all.find(y => y.ticketId === id), inp = document.getElementById('memo-' + id), msg = document.getElementById('mm-' + id);
 if(tk && inp){ tk.memo = inp.value.trim(); const ok = saveTickets(all); if(msg) msg.textContent = ok ? '메모를 저장했어요.' : '저장하지 못했어요.'; }
 }));
 workspace.querySelectorAll('[data-del]').forEach(x => x.addEventListener('click', () => {
 const id = x.dataset.del;
 if(state.delId === id){ saveTickets(tickets().filter(y => y.ticketId !== id)); state.delId = null; renderTicketbook(); showToast('티켓을 삭제했어요. 도장도 함께 줄어들어요.'); }
 else { state.delId = id; workspace.querySelectorAll('[data-del]').forEach(y => { const on = y.dataset.del === id; y.classList.toggle('on', on); y.textContent = on ? '정말 삭제' : '삭제'; }); }
 }));
 workspace.querySelectorAll('[data-unbm]').forEach(x => x.addEventListener('click', () => { saveBm(bookmarks().filter(id => id !== x.dataset.unbm)); renderTicketbook(); }));
 workspace.querySelectorAll('[data-pick]').forEach(x => x.addEventListener('click', () => { const pm = byId(x.dataset.pick); state.mood = state.mood || pm.moods[0]; confirmMovie(pm); }));
 workspace.querySelectorAll('[data-review-ticket]').forEach(x => x.addEventListener('click', () => openReviewEditor(x.dataset.reviewTicket, renderTicketbook)));
 $('#startAgain').addEventListener('click', () => setStep(state.mood ? 2 : 1));
 }

 function renderRecovery(type = 'all'){
 state.step = 7;
 const entries = [
 {id:'noCandidates',icon:'⌕',title:'조건에 맞는 영화가 없어요',desc:`${state.mood || '선택한 기분'}에 맞는 후보가 없어요. 다른 기분을 골라보세요.`,button:'조건 다시 설정',action:() => setStep(1)},
 
 {id:'ott',icon:'↗',title:'감상 서비스를 찾지 못했어요',desc:'서비스 앱에서 영화 제목을 직접 검색해보세요. 이 프로토타입은 OTT별 제공 여부를 조회하지 않아요.',button:'감상 서비스 선택',action:() => state.movie ? openWatchModal(state.movie) : showToast('먼저 영화를 추천받아 주세요.')},
 {id:'storage',icon:'▣',title:'기록을 저장하지 못했어요',desc:'브라우저 저장이 제한되어 있을 수 있어요. 이 경우에도 추천 흐름은 계속 이용할 수 있고, 창을 닫기 전까지는 기록이 유지돼요.',button:'저장 안내 보기',action:() => showToast('브라우저의 사이트 데이터 저장 설정을 확인해 주세요.')}
 ].filter(e => type === 'all' || e.id === type);
 workspace.innerHTML = header(7,'막히는 순간에도, 다음 선택은 있어요.','예상 가능한 예외 상황에서 바로 복구할 수 있도록 준비했어요.','HELP / RECOVERY') +
 `<div class="content"><div class="recovery-list">${entries.map(e => `<article class="recovery"><div class="recovery-icon">${e.icon}</div><div><h4>${e.title}</h4><p>${e.desc}</p><button class="btn" data-recovery="${e.id}">${e.button} →</button></div></article>`).join('')}</div><div class="actions"><button class="btn" id="backToApp">← 앱으로 돌아가기</button></div></div>`;
 workspace.querySelectorAll('[data-recovery]').forEach(b => b.addEventListener('click', () => { const e = entries.find(x => x.id === b.dataset.recovery); if(e) e.action(); }));
 $('#backToApp').addEventListener('click', () => setStep(state.movie ? 4 : (state.mood ? 2 : 1)));
 updateNavigation();
 }
 function renderHome(){
 const t = tickets(), b = bookmarks();
 const dayIndex = Math.floor((new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) - new Date(new Date().getFullYear(),0,0)) / 86400000);
 const dailyMovie = movies[dayIndex % movies.length];
 workspace.innerHTML = `<div class="home-screen">
 ${searchBox('homeQ')}
 <div id="homeResults"></div>
 <div class="home-greeting" style="margin-top:16px">CINEPICK · 오늘의 영화</div>
 <h2 class="home-title">오늘 밤, 영화 고민은<br>여기서 끝내요.</h2>
 <p style="margin:0;color:var(--muted);font-size:12px">지금 기분에 맞는 영화 한 편을 가볍게 골라보세요.</p>
 <div class="home-feature"><small>YOUR MOOD, ONE MOVIE</small><h3>고민은 짧게,<br>감상은 길게.</h3><p>기분을 선택하면 후보 영화가 쭉 나와요.<br>직접 고르거나 랜덤 추첨으로 결정해 보세요.</p><button id="homeStart">영화 추천 시작하기 →</button></div>
 <div class="home-section-title">오늘의 영화</div>
 <article class="candidate-card today-movie-card"><div class="candidate-poster">${dailyMovie.poster}</div><div class="candidate-info"><div class="eyebrow">TODAY'S PICK · ${dailyMovie.year}</div><h4>${dailyMovie.title}${foodBadge(dailyMovie)}</h4><div class="candidate-meta">${dailyMovie.genre} · ${dailyMovie.runtime}분</div><p>${dailyMovie.overview}</p><div class="candidate-tags"><span>${dailyMovie.moods[0]}</span><span>${dailyMovie.tone}</span><span>${dailyMovie.food}</span></div><button class="btn primary" id="todayMoviePick">오늘은 이 영화 보기</button></div></article>
 <div class="home-section-title">나의 시네마</div>
 <div class="home-shortcuts">
 <button class="home-shortcut" id="homeTickets"><span class="shortcut-icon"></span><strong>나의 티켓북</strong><small>발권한 영화 ${t.length}편</small></button>
 <button class="home-shortcut" id="homeSaved"><span class="shortcut-icon"></span><strong>보관한 영화</strong><small>저장한 영화 ${b.length}편</small></button>
 </div>
 </div>`;
 const hq = $('#homeQ');
 hq.addEventListener('input', () => { state.q = hq.value; renderMovieResults($('#homeResults'), norm(state.q)); });
 workspace.querySelector('[data-clear]').addEventListener('click', () => { state.q = ''; hq.value = ''; hq.focus(); renderMovieResults($('#homeResults'), ''); });
 renderMovieResults($('#homeResults'), norm(state.q || ''));
 $('#homeStart').addEventListener('click', () => { state.activeTab='recommend'; state.mood=null; state.movie=null; setStep(1); });
 $('#todayMoviePick').addEventListener('click', () => { state.movie=dailyMovie; state.mood=dailyMovie.moods[0]; state.lastMovieId=dailyMovie.id; setStep(4); });
 $('#homeTickets').addEventListener('click', () => { state.tab='tickets'; state.activeTab='movies'; render(); });
 $('#homeSaved').addEventListener('click', () => { state.tab='bookmarks'; state.activeTab='movies'; render(); });
 }
 /* 내 리뷰: myReviews에 저장. 영화당 리뷰 1개(다시 쓰면 수정) */
 mem.reviews = [];
 const myReviews = () => rd('myReviews', 'reviews');
 const saveMyReviews = v => wr('myReviews', 'reviews', v);
 const allReviews = () => [
 ...myReviews().map(r => ({...r, user:'나', mine:true})),
 ...[...communityReviews].sort((a,b) => b.id - a.id)
 ];
 const norm = s => String(s).toLowerCase().replace(/\s+/g, '');
 const matchMovie = (m, q) => !q || [m.title, m.en, m.genre, m.tone, ...m.moods].some(v => norm(v).includes(q));
 const stars = n => ''.repeat(Math.round(n)) + ''.repeat(5 - Math.round(n));

 function renderMovieResults(box, q){
 if(!box) return;
 const found = q ? movies.filter(m => matchMovie(m, q)) : [];
 const mine = myReviews();
 box.innerHTML = !q
 ? `<div class="search-hint">검색어를 입력하면 영화가 나와요. 영화를 골라 바로 리뷰를 쓸 수 있어요.</div>`
 : found.length
 ? `<div class="home-section-title">검색 결과 ${found.length}편</div><div class="tlist" style="margin-top:0">${found.map(m => { const has = mine.some(r => r.movieId === m.id); return `<div class="tcard"><div class="h"><div class="g">${m.poster}</div><div style="min-width:0"><div class="n">${esc(m.title)}${foodBadge(m)}</div><div class="s">${m.year} · ${esc(m.genre)} · ${m.runtime}분</div></div></div><div class="memo"><button class="btn primary" data-write="${m.id}" style="flex:1">${has ? '내 리뷰 수정 ' : '리뷰 쓰기 '}</button><button class="btn" data-bm-search="${m.id}">${bmLabel(m)}</button></div></div>`; }).join('')}</div>`
 : `<div class="empty-box"><strong>‘${esc(state.q)}’에 맞는 영화가 없어요</strong>제목 일부나 장르(예: 음악, 코미디)로 다시 검색해 보세요.</div>`;
 box.querySelectorAll('[data-write]').forEach(b => b.addEventListener('click', () => openReviewEditor(b.dataset.write)));
 box.querySelectorAll('[data-bm-search]').forEach(b => b.addEventListener('click', e => toggleBm(byId(b.dataset.bmSearch), e.currentTarget)));
 }
 const searchBox = id => `<div class="search-box"><span aria-hidden="true">⌕</span><input type="search" id="${id}" placeholder="영화 검색하고 리뷰 남기기 (제목·장르·기분)" value="${esc(state.q || '')}" aria-label="영화 검색" autocomplete="off"><button class="search-clear" data-clear="${id}" aria-label="검색어 지우기"></button></div>`;
 function refreshSearch(){ if(state.activeTab === 'browse') updateBrowse(); else if(state.activeTab === 'home') renderMovieResults($('#homeResults'), norm(state.q || '')); }
 function renderBrowse(){
 workspace.innerHTML = `<div class="browse-screen">
 <div class="browse-heading"><div><div class="eyebrow">둘러보기 · SEARCH & REVIEWS</div><h2>영화 찾고<br>리뷰 남기기</h2></div><span class="status-pill" id="reviewCount"></span></div>
 <p class="browse-subtitle">영화 제목·장르·기분으로 검색하고, 본 영화에 별점과 감상평을 남겨보세요.</p>
 ${searchBox('browseQ')}
 <div id="movieResults"></div>
 <div class="home-section-title" id="reviewHeading">감상평</div>
 <div class="review-list" id="reviewList"></div>
 <p class="review-disclaimer">※ ‘나’ 표시가 없는 리뷰는 화면 확인용 예시입니다. 내가 쓴 리뷰는 이 브라우저에만 저장돼요.</p>
 </div>`;
 const input = $('#browseQ');
 input.addEventListener('input', () => { state.q = input.value; updateBrowse(); });
 workspace.querySelector('[data-clear]').addEventListener('click', () => { state.q = ''; input.value = ''; input.focus(); updateBrowse(); });
 updateBrowse();
 }
 function updateBrowse(){
 const q = norm(state.q || '');
 const found = q ? movies.filter(m => matchMovie(m, q)) : [];
 const mine = myReviews();
 renderMovieResults($('#movieResults'), q);
 const list = allReviews().filter(r => { const m = byId(r.movieId); return m && matchMovie(m, q); });
 $('#reviewCount').textContent = list.length + '개 리뷰';
 $('#reviewHeading').textContent = q ? `‘${state.q}’ 감상평 ${list.length}개` : '최근 감상평';
 $('#reviewList').innerHTML = list.length ? list.map(r => { const m = byId(r.movieId); return `<button class="review-card${r.mine ? ' mine' : ''}" data-review-id="${esc(r.id)}" aria-label="${esc(m.title)} 감상평 자세히 보기"><div class="review-poster">${m.poster}</div><div><h3>${esc(m.title)}${foodBadge(m)}</h3><div class="review-meta">${r.mine ? '<span class="mine-badge">나</span>' : esc(r.user) + ' · '}${esc(r.date)}</div><div class="review-stars">${stars(r.rating)} <span style="color:#aaa">${Number(r.rating).toFixed(1)}</span></div><p class="review-excerpt">${esc(r.title ? r.title + ' — ' : '')}${esc(r.review)}</p><div class="review-open-hint">감상평 전체 보기 →</div></div></button>`; }).join('')
 : `<div class="empty-box" style="margin-top:0"><strong>아직 감상평이 없어요</strong>첫 리뷰를 남겨보세요.</div>`;
 workspace.querySelectorAll('[data-review-id]').forEach(btn => btn.addEventListener('click', () => openReviewDetail(btn.dataset.reviewId)));
 }
 function openReviewEditor(movieId, after){
 const m = byId(movieId); if(!m) return;
 const old = myReviews().find(r => r.movieId === movieId);
 let rating = old ? old.rating : 0;
 const root = $('#modalRoot');
 root.innerHTML = `<div class="modal-backdrop" id="editBackdrop"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="editTitle"><div class="eyebrow">${old ? 'EDIT MY REVIEW' : 'WRITE A REVIEW'}</div><div class="review-detail-top"><div class="review-detail-poster">${m.poster}</div><div><h3 id="editTitle">${esc(m.title)}</h3><div class="review-meta">${m.year} · ${esc(m.genre)} · ${m.runtime}분</div></div></div>
 <div class="star-input" role="radiogroup" aria-label="별점">${[1,2,3,4,5].map(n => `<button type="button" role="radio" data-star="${n}" aria-label="${n}점"></button>`).join('')}<span id="starText"></span></div>
 <input class="review-field" id="rvTitle" maxlength="30" placeholder="한 줄 제목 (선택)" value="${esc(old ? old.title || '' : '')}">
 <textarea class="review-field" id="rvBody" maxlength="300" rows="5" placeholder="어떤 밤에 보면 좋을지, 무엇이 기억에 남았는지 적어주세요.">${esc(old ? old.review : '')}</textarea>
 <div class="rv-foot"><span class="tmsg" id="rvMsg" style="color:var(--accent)"></span><span id="rvLen" class="rv-len"></span></div>
 <div class="modal-actions" style="gap:8px"><button class="btn" id="rvCancel">취소</button><button class="btn primary" id="rvSave">${old ? '수정 저장' : '리뷰 등록'}</button></div></div></div>`;
 const paint = () => { root.querySelectorAll('[data-star]').forEach(b => { const on = Number(b.dataset.star) <= rating; b.classList.toggle('on', on); b.setAttribute('aria-checked', String(Number(b.dataset.star) === rating)); }); $('#starText').textContent = rating ? rating + '점' : '별점을 선택하세요'; };
 const body = $('#rvBody'), len = () => $('#rvLen').textContent = body.value.length + ' / 300';
 root.querySelectorAll('[data-star]').forEach(b => b.addEventListener('click', () => { rating = Number(b.dataset.star); paint(); }));
 body.addEventListener('input', len); paint(); len();
 const close = () => root.innerHTML = '';
 $('#rvCancel').addEventListener('click', close);
 $('#editBackdrop').addEventListener('click', e => { if(e.target.id === 'editBackdrop') close(); });
 $('#rvSave').addEventListener('click', () => {
 const text = body.value.trim();
 if(!rating){ $('#rvMsg').textContent = '별점을 선택해 주세요.'; return; }
 if(text.length < 5){ $('#rvMsg').textContent = '감상평을 5자 이상 적어주세요.'; body.focus(); return; }
 const r = {id: old ? old.id : 'r_' + Date.now().toString(36), movieId, rating, title: $('#rvTitle').value.trim(), review: text, date: todayStr()};
 const ok = saveMyReviews([r, ...myReviews().filter(x => x.movieId !== movieId)]);
 close();
 showToast(ok ? (old ? '리뷰를 수정했어요.' : '리뷰를 등록했어요!') : '저장하지 못했어요. 창을 닫기 전까지만 유지돼요.');
 if(after) after(); else refreshSearch();
 });
 setTimeout(() => body.focus(), 30);
 }
 function openReviewDetail(reviewId){
 const r = allReviews().find(x => String(x.id) === String(reviewId)); if(!r) return;
 const m = byId(r.movieId); const root = $('#modalRoot');
 root.innerHTML = `<div class="modal-backdrop" id="reviewBackdrop"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="reviewModalTitle"><div class="eyebrow">${r.mine ? 'MY REVIEW' : 'COMMUNITY REVIEW'}</div><div class="review-detail-top"><div class="review-detail-poster">${m.poster}</div><div><h3 id="reviewModalTitle">${esc(m.title)}</h3><div class="review-meta">${m.year} · ${esc(m.genre)} · ${m.runtime}분</div><div class="review-stars">${stars(r.rating)} <span style="color:#aaa">${Number(r.rating).toFixed(1)} / 5.0</span></div><div class="review-meta" style="margin-top:5px">${esc(r.user)} · ${esc(r.date)}</div></div></div>${r.title ? `<h4 style="font-size:14px;margin:0 0 9px">${esc(r.title)}</h4>` : ''}<div class="review-quote">${esc(r.review)}</div><p style="margin-top:14px;line-height:1.6">${esc(m.overview)}</p><div class="modal-actions" style="gap:8px;flex-wrap:wrap">${r.mine ? '<button class="btn danger" id="delMyReview">삭제</button><button class="btn" id="editMyReview">수정 </button>' : '<button class="btn" id="writeOwn">나도 리뷰 쓰기 </button>'}<button class="btn" id="closeReviewModal">닫기</button><button class="btn primary" id="saveReviewedMovie">${bookmarks().includes(m.id) ? '보관 중 ' : '영화 보관 '}</button></div></div></div>`;
 const close = () => { root.innerHTML = ''; };
 $('#closeReviewModal').addEventListener('click', close);
 $('#reviewBackdrop').addEventListener('click', e => { if(e.target.id === 'reviewBackdrop') close(); });
 $('#saveReviewedMovie').addEventListener('click', e => toggleBm(m, e.currentTarget));
 if(r.mine){
 let armed = false;
 $('#editMyReview').addEventListener('click', () => openReviewEditor(m.id));
 $('#delMyReview').addEventListener('click', e => { if(!armed){ armed = true; e.currentTarget.textContent = '정말 삭제'; e.currentTarget.classList.add('on'); return; } saveMyReviews(myReviews().filter(x => x.id !== r.id)); close(); showToast('리뷰를 삭제했어요.'); refreshSearch(); });
 } else $('#writeOwn').addEventListener('click', () => openReviewEditor(m.id));
 }

 function renderMyPage(){
 const t=tickets(), b=bookmarks(), L=lvInfo(t.length);
 workspace.innerHTML = `<div class="content">
 <div class="eyebrow">MY CINEMA PROFILE</div><h3 style="font-size:25px;letter-spacing:-.05em;margin:5px 0 18px">마이페이지</h3>
 <div class="profile-summary"><div class="profile-avatar">◉</div><div><h4>나의 영화 생활</h4><p>오늘도 영화 한 편, 가볍게 골라봐요.</p></div></div>
 <div class="home-section-title">시네마 기록</div>
 <div class="lvbox"><div class="lvhead"><strong><span class="lvbadge">Lv.${L.lv}</span>${L.name}</strong><span>${L.cur} / 10</span></div><div class="cinema-progress" role="progressbar" aria-label="다음 레벨 영화 기록" aria-valuemin="0" aria-valuemax="10" aria-valuenow="${L.cur}">${Array.from({length:10},(_,i)=>`<span class="cinema-progress-segment ${i<L.cur?'filled':''}"></span>`).join('')}</div><p class="lvnote">영화 한 편을 기록할 때마다 한 칸씩 채워져요 · 다음 레벨까지 ${L.next}개</p></div>
 <div class="profile-row"><span>발권한 영화</span><strong>${t.length}편</strong></div>
 <div class="profile-row"><span>보관한 영화</span><strong>${b.length}편</strong></div>
 <div class="profile-row"><span>서비스 안내</span><span>시네픽 프로토타입</span></div>
 <div class="profile-row"><span>저장 방식</span><span>이 브라우저에 저장</span></div>
 <button class="btn full" id="profileReset" style="margin-top:20px">영화 추천 처음부터 시작</button>
 </div>`;
 $('#profileReset').addEventListener('click', () => { state.mood=null; state.movie=null; state.activeTab='recommend'; setStep(1); });
 }
 function updateAppTabs(){
 document.querySelectorAll('.app-tab').forEach(b=>{
 const tab=b.dataset.appTab;
 const active=tab===state.activeTab;
 b.classList.toggle('active',active);
 if(active) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current');
 });
 }
 function render(){
 clearInterval(decideTimer); decideTimer = null;
 if(state.spinning && state.step !== 3){ clearTimeout(spinTimeout); state.spinning = false; }
 updateNavigation(); updateAppTabs();
 if(state.activeTab==='home') renderHome();
 else if(state.activeTab==='browse') renderBrowse();
 else if(state.activeTab==='mypage') renderMyPage();
 else ({1:renderMood,2:renderDuration,3:renderWheel,4:renderResult,5:renderConfirmed,6:renderTicketbook,7:() => renderRecovery('all')})[state.step]();
 updateAppTabs();
 window.scrollTo(0, 0);
 }
 // 하단 탭은 항상 공통 render() 경로를 통해 화면 전체를 전환합니다.
 // 둘러보기를 누르면 커뮤니티 리뷰 목록을 즉시 렌더링합니다.
 document.querySelectorAll('[data-app-tab]').forEach(b=>b.addEventListener('click',()=>{
 const tab=b.dataset.appTab;
 state.activeTab=tab;
 if(tab==='movies') { state.step=6; state.tab='tickets'; }
 if(tab==='recommend') { if(state.step===6 || state.step===7) state.step=1; if(!state.mood) state.step=1; }
 render();
 }));
 function updateNavigation(){
 document.querySelectorAll('.step-link').forEach(b => {
 const s = Number(b.dataset.step);
 b.classList.toggle('active', s === state.step);
 b.classList.toggle('done', state.step <= 5 && s < state.step);
 if(s === state.step) b.setAttribute('aria-current','step'); else b.removeAttribute('aria-current');
 });
 }
 document.querySelectorAll('.step-link').forEach(b => b.addEventListener('click', () => setStep(Number(b.dataset.step))));
 $('#headerRecords').addEventListener('click', () => { state.tab = 'tickets'; setStep(6); });
 $('#resetApp').addEventListener('click', () => { state = {...defaultState}; $('#modalRoot').innerHTML = ''; render(); showToast('새로운 영화 선택을 시작해요.'); });
 render();
})();
