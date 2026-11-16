
(() => {
 const RAW = window.CINEPICK_RAW || [];
 /* Local JSON catalog: 150 movies */
 const movies = RAW.map(m => ({...m, id:'mov_' + String(m.id).padStart(3,'0'), food:String(m.food||'').trim(), poster:'', source:'J'}));
 const localMovies = [...movies];
 const sourceBadge = m => `<span class="source-flag ${m.source==='A'?'api':'json'}" title="${m.source==='A'?'TMDB API':'로컬 JSON'}">${m.source==='A'?'A':'J'}</span>`;
 /* ===== 아이콘 (SVG · 글꼴/이모지 없이도 항상 보입니다) ===== */
 const svg = (p, cls) => `<svg class="ic${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
 const ICON = {
  check: svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
  close: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
  search: svg('<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>'),
  star: svg('<path d="M12 3.8l2.5 5.1 5.6.8-4 4 .9 5.6-5-2.7-5 2.7.9-5.6-4-4 5.6-.8z"/>', 'starsvg'),
  starOn: svg('<path d="M12 3.8l2.5 5.1 5.6.8-4 4 .9 5.6-5-2.7-5 2.7.9-5.6-4-4 5.6-.8z"/>', 'starsvg f'),
  film: svg('<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 5v14M16 5v14M4 9.5h4M4 14.5h4M16 9.5h4M16 14.5h4"/>'),
  ticket: svg('<path d="M3.5 7h17v3.2a1.8 1.8 0 0 0 0 3.6V17h-17v-3.2a1.8 1.8 0 0 0 0-3.6z"/><path d="M14.5 8v8" stroke-dasharray="1.6 2"/>'),
  bookmark: svg('<path d="M7 4h10v16l-5-3.6L7 20z"/>'),
  bookmarkOn: svg('<path d="M7 4h10v16l-5-3.6L7 20z" fill="currentColor"/>'),
  clock: svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  ext: svg('<path d="M9 6H6v12h12v-3"/><path d="M12 12l7-7M14 5h5v5"/>'),
  save: svg('<path d="M5 4h11l3 3v13H5z"/><path d="M8 4v5h7V4M8 20v-6h8v6"/>'),
  user: svg('<circle cx="12" cy="8.5" r="3.6"/><path d="M5 20c.8-3.6 3.7-5.5 7-5.5s6.2 1.9 7 5.5"/>'),
  bolt: svg('<path d="M13 3L5 13.5h6L10 21l8-10.5h-6z"/>'),
  cloud: svg('<path d="M7.5 18.5a4 4 0 0 1-.6-7.95A5.5 5.5 0 0 1 17.6 9.4a4.55 4.55 0 0 1-.6 9.1z"/>'),
  moon: svg('<path d="M19.5 14.5A8 8 0 1 1 9.5 4.5a6.5 6.5 0 0 0 10 10z"/>'),
  heart: svg('<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.6 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>'),
  umbrella: svg('<path d="M3.5 12a8.5 8.5 0 0 1 17 0z"/><path d="M12 12v6a2 2 0 0 1-4 0"/>'),
  sparkle: svg('<path d="M12 4l1.8 5.2L19 11l-5.2 1.8L12 18l-1.8-5.2L5 11l5.2-1.8z"/>')
 };

 
 async function searchMovieAPI(query){
   const url=new URL('https://api.themoviedb.org/3/search/movie');
   url.searchParams.set('api_key',TMDB_API_KEY); url.searchParams.set('query',query);
   url.searchParams.set('language','ko-KR'); url.searchParams.set('include_adult','false');
   const res=await fetch(url.toString()); if(!res.ok) throw new Error('TMDB '+res.status);
   const data=await res.json();
   const hits=(data.results||[]).filter(r=>r.title||r.original_title);
   return hits.map((r,i)=>{
     const title=r.title||r.original_title, year=Number((r.release_date||'').slice(0,4))||'';
     const genreMap={28:'액션',12:'모험',16:'애니메이션',35:'코미디',80:'범죄',99:'다큐멘터리',18:'드라마',10751:'가족',14:'판타지',36:'역사',27:'공포',10402:'음악',9648:'미스터리',10749:'로맨스',878:'SF',10770:'TV 영화',53:'스릴러',10752:'전쟁',37:'서부'};
     const genres=(r.genre_ids||[]).map(id=>genreMap[id]).filter(Boolean);
     const id='api_'+r.id;
     return {id,title,en:(r.original_title||title).toUpperCase(),year,runtime:null,genre:genres.join(' · ')||'영화',moods:['심심한','센치한'],food:'팝콘',tone:'새로운 영화를 발견하는 밤',overview:r.overview||'줄거리 정보가 없습니다.',poster:r.poster_path?TMDB_IMAGE+r.poster_path:'',source:'A',tmdbId:r.id};
   });
 }

 let apiMovies=[];
 let apiCatalogPromise=null;
 async function loadApiCatalog(){
   if(apiCatalogPromise) return apiCatalogPromise;
   apiCatalogPromise=(async()=>{
     const genreMap={28:'액션',12:'모험',16:'애니메이션',35:'코미디',80:'범죄',99:'다큐멘터리',18:'드라마',10751:'가족',14:'판타지',36:'역사',27:'공포',10402:'음악',9648:'미스터리',10749:'로맨스',878:'SF',10770:'TV 영화',53:'스릴러',10752:'전쟁',37:'서부'};
     const cacheKey='cinepick_tmdb_catalog_150_v3';
     const toMovie=r=>{
       const title=r.title||r.original_title||'제목 정보 없음';
       return {id:'api_'+r.id,title,en:(r.original_title||title).toUpperCase(),year:Number((r.release_date||'').slice(0,4))||'',runtime:Number(r.runtime)||null,genre:(r.genre_ids||[]).map(id=>genreMap[id]).filter(Boolean).join(' · ')||'영화',moods:['심심한','센치한'],food:'팝콘',tone:'새로운 영화를 발견하는 밤',overview:r.overview||'줄거리 정보가 없습니다.',poster:r.poster_path?(String(r.poster_path).startsWith('http')?r.poster_path:TMDB_IMAGE+r.poster_path):'',source:'A',tmdbId:r.id};
     };
     const publish=()=>{
       apiMovies.forEach(m=>{if(!movies.some(x=>x.id===m.id))movies.push(m);});
       const status=document.getElementById('datasetStatus');
       if(status)status.textContent=`총 ${localMovies.length+apiMovies.length}편 · J ${localMovies.length} / A ${apiMovies.length}`;
       if(state.activeTab==='browse')updateBrowse();
     };
     try{
       let cached=[];
       try{cached=JSON.parse(localStorage.getItem(cacheKey)||'[]');}catch(_){}
       if(Array.isArray(cached)&&cached.length>=150&&cached.every(m=>m&&m.id&&m.tmdbId&&m.source==='A')){
         apiMovies=cached.slice(0,150);publish();
       }
       const requests=await Promise.allSettled(Array.from({length:8},(_,i)=>{
         const u=new URL('https://api.themoviedb.org/3/discover/movie');
         u.searchParams.set('api_key',TMDB_API_KEY);u.searchParams.set('language','ko-KR');
         u.searchParams.set('sort_by','popularity.desc');u.searchParams.set('include_adult','false');u.searchParams.set('page',String(i+1));
         return fetch(u.toString()).then(r=>{if(!r.ok)throw new Error('TMDB '+r.status);return r.json();});
       }));
       const raw=requests.filter(x=>x.status==='fulfilled').flatMap(x=>x.value.results||[]);
       const seen=new Set();
       const fresh=raw.filter(r=>(r.title||r.original_title)&&r.id&&!seen.has(r.id)&&seen.add(r.id)).map(toMovie);
       if(fresh.length){
         // Prefer fresh data, but use a valid cache to top up if the API partially failed.
         let prior=[];try{prior=JSON.parse(localStorage.getItem(cacheKey)||'[]');}catch(_){}
         const combined=[...fresh,...(Array.isArray(prior)?prior:[])];
         const ids=new Set();
         apiMovies=combined.filter(m=>m&&m.tmdbId&&!ids.has(m.tmdbId)&&ids.add(m.tmdbId)).slice(0,150);
         publish();
         try{localStorage.setItem(cacheKey,JSON.stringify(apiMovies));}catch(_){}
       }else if(!apiMovies.length){
         const status=document.getElementById('datasetStatus');
         if(status)status.textContent='TMDB API 연결 실패 · 네트워크와 API 키를 확인해 주세요.';
                   if(state.activeTab==='browse')updateBrowse();
       }
       // Enrich runtimes in the background; don't block the 150 movie list.
       let idx=0;
       const workers=Array.from({length:8},async()=>{
         while(idx<apiMovies.length){
           const m=apiMovies[idx++];if(m.runtime||!m.tmdbId)continue;
           try{
             const u=new URL(`https://api.themoviedb.org/3/movie/${m.tmdbId}`);
             u.searchParams.set('api_key',TMDB_API_KEY);u.searchParams.set('language','ko-KR');
             const r=await fetch(u.toString());if(r.ok){const d=await r.json();m.runtime=Number(d.runtime)||null;}
           }catch(_){}
         }
       });
       Promise.all(workers).then(()=>{try{localStorage.setItem(cacheKey,JSON.stringify(apiMovies));}catch(_){}if(state.activeTab==='browse')updateBrowse();});
       return apiMovies;
     }catch(err){
       console.warn('TMDB catalog load failed',err);
               if(state.activeTab==='browse')updateBrowse();
        throw err;
     }
   })();
   return apiCatalogPromise;
 }

 let apiSearchTimer=null, apiSearchToken=0;
 /* ===== 포스터: 이미지가 있으면 이미지, 없거나 실패하면 회색 자리표시자 ===== */
 const TMDB_API_KEY = "b58ad2e4deeca12db6c96c4cc95dfc62";
 const TMDB_IMAGE = 'https://image.tmdb.org/t/p/w500';
 const POSTER_CACHE = 'cinepickPosterCacheV3';
 const phHTML = m => `<span class="ph">${ICON.film}<b>${esc((m && m.title) || '')}</b><small class="poster-status">${m && m.posterStatus === 'loading' ? '포스터 찾는 중…' : m && m.posterStatus === 'error' ? '포스터 연결 실패' : m && m.posterStatus === 'missing' ? '등록된 포스터 없음' : '포스터 준비 중'}</small></span>`;
 const imgHTML = m => `<img class="pimg" src="${esc(m.poster)}" alt="${esc(m.title)} 포스터" loading="lazy" decoding="async">`;
 const posterHTML = m => `<span class="pw" data-pid="${esc((m && m.id) || '')}">${m && m.poster ? imgHTML(m) : phHTML(m)}</span>`;
 function applyPoster(m){
   document.querySelectorAll('.pw').forEach(w => {
     if(w.dataset.pid === String(m.id)) w.innerHTML = m.poster ? imgHTML(m) : phHTML(m);
   });
 }
 document.addEventListener('error', e => {
   const t = e.target;
   if(t && t.tagName === 'IMG' && t.classList.contains('pimg')){
     const w = t.closest('.pw'); if(!w) return;
     const m = byId(w.dataset.pid);
     if(m) { m.poster = ''; m.posterStatus = 'error'; }
     w.innerHTML = phHTML(m || {title:'',posterStatus:'error'});
   }
 }, true);
 const posterTitleKey = value => String(value || '').toLocaleLowerCase('ko-KR').normalize('NFKC').replace(/[^\p{L}\p{N}]/gu, '');
 function loadPosterCache(){
   try {
     const c = JSON.parse(localStorage.getItem(POSTER_CACHE) || '{}');
     localMovies.forEach(m => {
       const saved = c[m.id];
       if(saved && saved.titleKey === posterTitleKey(m.title) && String(saved.year) === String(m.year) && typeof saved.url === 'string' && saved.url.startsWith(TMDB_IMAGE + '/')) m.poster = saved.url;
     });
   } catch(e) { /* 캐시 오류는 무시하고 새로 검색 */ }
 }
 function posterNameMatches(result, aliases){
   const names = [result.title, result.original_title].filter(Boolean).map(posterTitleKey);
   const keys = aliases.map(posterTitleKey).filter(Boolean);
   for(const name of names){
     for(const key of keys){
       if(name === key) return true;
       if(key.length >= 5 && name.length >= 5 && (name.includes(key) || key.includes(name))) return true;
     }
   }
   return false;
 }
 async function searchPoster(m){
   const aliases = [...new Set([m.title, m.en].filter(Boolean))];
   const queries = [];
   if(m.title) queries.push({lang:'ko-KR',q:m.title});
   if(m.en) queries.push({lang:'en-US',q:m.en});
   for(const {lang,q} of queries){
     const url = new URL('https://api.themoviedb.org/3/search/movie');
     url.searchParams.set('api_key', TMDB_API_KEY);
     url.searchParams.set('query', q);
     url.searchParams.set('language', lang);
     url.searchParams.set('include_adult', 'false');
     if(m.year) url.searchParams.set('year', String(m.year));
     const res = await fetch(url.toString());
     if(!res.ok) throw new Error('TMDB ' + res.status);
     const data = await res.json();
     const hits = (data.results || []).filter(r => r.poster_path && posterNameMatches(r, aliases));
     const exactYear = hits.find(r => String((r.release_date || '').slice(0,4)) === String(m.year));
     if(exactYear) return exactYear;
     const nearYear = hits.find(r => { const y = Number((r.release_date || '').slice(0,4)); return y && m.year && Math.abs(y - Number(m.year)) <= 1; });
     if(nearYear) return nearYear;
   }
   return null;
 }
 async function loadTMDBPosters(){
   const pending = localMovies.filter(m => !m.poster);
   const found = {};
   let index = 0, failed = 0, missing = 0;
   const workers = Array.from({length:4}, async () => {
     while(index < pending.length){
       const m = pending[index++];
       m.posterStatus = 'loading';
       try {
         const hit = await searchPoster(m);
         if(hit && hit.poster_path){
           m.poster = TMDB_IMAGE + hit.poster_path;
           m.posterStatus = 'loaded';
           found[m.id] = {url:m.poster, titleKey:posterTitleKey(m.title), year:m.year};
         } else { m.posterStatus = 'missing'; missing++; }
         applyPoster(m);
       } catch(e) {
         m.posterStatus = 'error'; failed++;
         applyPoster(m);
         console.warn('포스터 검색 실패:', m.title, e);
       }
     }
   });
   await Promise.all(workers);
   try {
     const previous = JSON.parse(localStorage.getItem(POSTER_CACHE) || '{}');
     localStorage.setItem(POSTER_CACHE, JSON.stringify({...previous, ...found}));
   } catch(e) { /* 저장 공간이 없어도 현재 화면은 유지 */ }
   const status = document.getElementById('datasetStatus');
   if(status) status.textContent = failed ? `포스터 완료 · ${failed}편 연결 오류` : missing ? `포스터 완료 · ${missing}편 포스터 미등록` : '포스터 모두 확인 완료';
 }

 const moodOptions = [
 {name:'신나는',icon:ICON.bolt,desc:'에너지를 끌어올리고 싶을 때'},
 {name:'지침',icon:ICON.cloud,desc:'편하게 쉬어가고 싶을 때'},
 {name:'센치한',icon:ICON.moon,desc:'감정과 여운에 잠기고 싶을 때'},
 {name:'설레는',icon:ICON.heart,desc:'두근거리는 이야기가 필요할 때'},
 {name:'우울한',icon:ICON.umbrella,desc:'마음을 다독이고 싶을 때'},
 {name:'심심한',icon:ICON.sparkle,desc:'재미있게 기분 전환하고 싶을 때'}
 ];
 const TITLES = ['우유부단 견습생','선택 고민 해결사','룰렛 단골','영화 고르기 달인','시네픽 마스터'];
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
 // 리뷰 예시 22편에 필요한 영화 데이터가 카탈로그에 없으면 보조 데이터로 추가합니다.
 const seededReviewMovies = [{"id": "seed_movie_01", "title": "인터스텔라", "en": "인터스텔라", "year": "", "runtime": null, "genre": "영화", "moods": [], "food": "팝콘", "overview": "인터스텔라 리뷰를 위한 영화 정보입니다.", "poster": "", "source": "J"}, {"id": "seed_movie_02", "title": "라라랜드", "en": "라라랜드", "year": "", "runtime": null, "genre": "영화", "moods": [], "food": "팝콘", "overview": "라라랜드 리뷰를 위한 영화 정보입니다.", "poster": "", "source": "J"}, {"id": "seed_movie_03", "title": "트루먼 쇼", "en": "트루먼 쇼", "year": "", "runtime": null, "genre": "영화", "moods": [], "food": "팝콘", "overview": "트루먼 쇼 리뷰를 위한 영화 정보입니다.", "poster": "", "source": "J"}, {"id": "seed_movie_04", "title": "쇼생크 탈출", "en": "쇼생크 탈출", "year": "", "runtime": null, "genre": "영화", "moods": [], "food": "팝콘", "overview": "쇼생크 탈출 리뷰를 위한 영화 정보입니다.", "poster": "", "source": "J"}, {"id": "seed_movie_05", "title": "인턴", "en": "인턴", "year": "", "runtime": null, "genre": "영화", "moods": [], "food": "팝콘", "overview": "인턴 리뷰를 위한 영화 정보입니다.", "poster": "", "source": "J"}, {"id": "seed_movie_06", "title": "타이타닉", "en": "타이타닉", "year": "", "runtime": null, "genre": "영화", "moods": [], "food": "팝콘", "overview": "타이타닉 리뷰를 위한 영화 정보입니다.", "poster": "", "source": "J"}, {"id": "seed_movie_07", "title": "기생충", "en": "기생충", "year": "", "runtime": null, "genre": "영화", "moods": [], "food": "팝콘", "overview": "기생충 리뷰를 위한 영화 정보입니다.", "poster": "", "source": "J"}, {"id": "seed_movie_08", "title": "벌새", "en": "벌새", "year": "", "runtime": null, "genre": "영화", "moods": [], "food": "팝콘", "overview": "벌새 리뷰를 위한 영화 정보입니다.", "poster": "", "source": "J"}, {"id": "seed_movie_09", "title": "식스 센스", "en": "식스 센스", "year": "", "runtime": null, "genre": "영화", "moods": [], "food": "팝콘", "overview": "식스 센스 리뷰를 위한 영화 정보입니다.", "poster": "", "source": "J"}, {"id": "seed_movie_10", "title": "그랜드 부다페스트 호텔", "en": "그랜드 부다페스트 호텔", "year": "", "runtime": null, "genre": "영화", "moods": [], "food": "팝콘", "overview": "그랜드 부다페스트 호텔 리뷰를 위한 영화 정보입니다.", "poster": "", "source": "J"}, {"id": "seed_movie_11", "title": "7번방의 선물", "en": "7번방의 선물", "year": "", "runtime": null, "genre": "영화", "moods": [], "food": "팝콘", "overview": "7번방의 선물 리뷰를 위한 영화 정보입니다.", "poster": "", "source": "J"}, {"id": "seed_movie_12", "title": "부산행", "en": "부산행", "year": "", "runtime": null, "genre": "영화", "moods": [], "food": "팝콘", "overview": "부산행 리뷰를 위한 영화 정보입니다.", "poster": "", "source": "J"}, {"id": "seed_movie_13", "title": "이터널 선샤인", "en": "이터널 선샤인", "year": "", "runtime": null, "genre": "영화", "moods": [], "food": "팝콘", "overview": "이터널 선샤인 리뷰를 위한 영화 정보입니다.", "poster": "", "source": "J"}, {"id": "seed_movie_14", "title": "탑건: 매버릭", "en": "탑건: 매버릭", "year": "", "runtime": null, "genre": "영화", "moods": [], "food": "팝콘", "overview": "탑건: 매버릭 리뷰를 위한 영화 정보입니다.", "poster": "", "source": "J"}, {"id": "seed_movie_15", "title": "리틀 포레스트", "en": "리틀 포레스트", "year": "", "runtime": null, "genre": "영화", "moods": [], "food": "팝콘", "overview": "리틀 포레스트 리뷰를 위한 영화 정보입니다.", "poster": "", "source": "J"}, {"id": "seed_movie_16", "title": "인셉션", "en": "인셉션", "year": "", "runtime": null, "genre": "영화", "moods": [], "food": "팝콘", "overview": "인셉션 리뷰를 위한 영화 정보입니다.", "poster": "", "source": "J"}, {"id": "seed_movie_17", "title": "헤어질 결심", "en": "헤어질 결심", "year": "", "runtime": null, "genre": "영화", "moods": [], "food": "팝콘", "overview": "헤어질 결심 리뷰를 위한 영화 정보입니다.", "poster": "", "source": "J"}, {"id": "seed_movie_18", "title": "패터슨", "en": "패터슨", "year": "", "runtime": null, "genre": "영화", "moods": [], "food": "팝콘", "overview": "패터슨 리뷰를 위한 영화 정보입니다.", "poster": "", "source": "J"}, {"id": "seed_movie_19", "title": "유전", "en": "유전", "year": "", "runtime": null, "genre": "영화", "moods": [], "food": "팝콘", "overview": "유전 리뷰를 위한 영화 정보입니다.", "poster": "", "source": "J"}, {"id": "seed_movie_20", "title": "위플래쉬", "en": "위플래쉬", "year": "", "runtime": null, "genre": "영화", "moods": [], "food": "팝콘", "overview": "위플래쉬 리뷰를 위한 영화 정보입니다.", "poster": "", "source": "J"}, {"id": "seed_movie_21", "title": "돈 룩 업", "en": "돈 룩 업", "year": "", "runtime": null, "genre": "영화", "moods": [], "food": "팝콘", "overview": "돈 룩 업 리뷰를 위한 영화 정보입니다.", "poster": "", "source": "J"}, {"id": "seed_movie_22", "title": "주토피아", "en": "주토피아", "year": "", "runtime": null, "genre": "영화", "moods": [], "food": "팝콘", "overview": "주토피아 리뷰를 위한 영화 정보입니다.", "poster": "", "source": "J"}];
 seededReviewMovies.forEach(m=>{if(!movies.some(x=>x.title===m.title))movies.push(m);});
 const communityReviews = [{"id": "seed_01", "movieId": "seed_movie_01", "movieTitle": "인터스텔라", "user": "시네픽 관객", "rating": 4.5, "date": "1일 전", "title": "여운이 오래 남는 영화", "review": "잔잔하게 흘러가는 이야기 속에서 예상하지 못한 감정을 느꼈다. 마지막 장면은 한동안 잊지 못할 것 같다.", "likes": 0}, {"id": "seed_02", "movieId": "seed_movie_02", "movieTitle": "라라랜드", "user": "시네픽 관객", "rating": 4.5, "date": "2일 전", "title": "사랑은 타이밍일까", "review": "두 사람의 감정선이 너무 현실적이었다. 사랑이라는 감정이 얼마나 복잡한지 다시 생각하게 됐다.", "likes": 0}, {"id": "seed_03", "movieId": "seed_movie_03", "movieTitle": "트루먼 쇼", "user": "시네픽 관객", "rating": 5.0, "date": "3일 전", "title": "세상을 바라보는 새로운 시선", "review": "화려한 영상미보다 영화가 전달하는 메시지가 더 인상 깊었다. 보고 난 뒤 생각이 많아졌다.", "likes": 0}, {"id": "seed_04", "movieId": "seed_movie_04", "movieTitle": "쇼생크 탈출", "user": "시네픽 관객", "rating": 4.5, "date": "4일 전", "title": "다시 보고 싶은 명작", "review": "처음에는 평범하게 느껴졌지만 후반부로 갈수록 몰입감이 대단했다.", "likes": 0}, {"id": "seed_05", "movieId": "seed_movie_05", "movieTitle": "인턴", "user": "시네픽 관객", "rating": 4.5, "date": "5일 전", "title": "생각보다 훨씬 따뜻한 영화", "review": "작은 친절이 누군가에게 얼마나 큰 의미가 될 수 있는지 보여주는 작품이었다.", "likes": 0}, {"id": "seed_06", "movieId": "seed_movie_06", "movieTitle": "타이타닉", "user": "시네픽 관객", "rating": 5.0, "date": "6일 전", "title": "아름답지만 슬픈 이야기", "review": "아름다운 장면들이 많았지만 그만큼 마음이 아팠다. 엔딩 크레딧이 올라갈 때까지 자리를 뜨기 어려웠다.", "likes": 0}, {"id": "seed_07", "movieId": "seed_movie_07", "movieTitle": "기생충", "user": "시네픽 관객", "rating": 4.5, "date": "7일 전", "title": "인간의 욕망이 만들어낸 결과", "review": "긴장감 있는 전개와 배우들의 연기가 인상적이었다. 인간의 욕심에 대해 생각하게 된다.", "likes": 0}, {"id": "seed_08", "movieId": "seed_movie_08", "movieTitle": "벌새", "user": "시네픽 관객", "rating": 4.5, "date": "8일 전", "title": "현실적인 청춘의 모습", "review": "누구나 한 번쯤 겪었을 고민들이 담겨 있어 공감하면서 봤다.", "likes": 0}, {"id": "seed_09", "movieId": "seed_movie_09", "movieTitle": "식스 센스", "user": "시네픽 관객", "rating": 5.0, "date": "9일 전", "title": "마지막 반전이 모든 것을 바꿨다", "review": "처음부터 다시 보고 싶어지는 영화다. 사소한 장면 하나까지 의미가 있었다.", "likes": 0}, {"id": "seed_10", "movieId": "seed_movie_10", "movieTitle": "그랜드 부다페스트 호텔", "user": "시네픽 관객", "rating": 4.5, "date": "10일 전", "title": "영상미만으로도 충분하다", "review": "색감과 음악, 화면 구성이 정말 아름다웠다. 이야기보다 분위기에 빠져들게 만드는 작품이다.", "likes": 0}, {"id": "seed_11", "movieId": "seed_movie_11", "movieTitle": "7번방의 선물", "user": "시네픽 관객", "rating": 4.5, "date": "11일 전", "title": "웃다가 울게 되는 영화", "review": "유쾌한 장면도 많지만 그 안에 담긴 가족의 이야기가 마음을 울렸다.", "likes": 0}, {"id": "seed_12", "movieId": "seed_movie_12", "movieTitle": "부산행", "user": "시네픽 관객", "rating": 5.0, "date": "12일 전", "title": "끝까지 긴장을 놓을 수 없다", "review": "빠른 전개와 몰입감 덕분에 러닝타임이 길게 느껴지지 않았다.", "likes": 62}, {"id": "seed_13", "movieId": "seed_movie_13", "movieTitle": "이터널 선샤인", "user": "시네픽 관객", "rating": 4.5, "date": "13일 전", "title": "사랑의 또 다른 의미", "review": "사랑이 꼭 함께하는 것만을 의미하지는 않는다는 생각이 들었다.", "likes": 63}, {"id": "seed_14", "movieId": "seed_movie_14", "movieTitle": "탑건: 매버릭", "user": "시네픽 관객", "rating": 4.5, "date": "14일 전", "title": "기대 이상으로 재미있었다", "review": "큰 기대 없이 봤는데 생각보다 훨씬 재미있었다. 연출과 액션 모두 만족스러웠다.", "likes": 64}, {"id": "seed_15", "movieId": "seed_movie_15", "movieTitle": "리틀 포레스트", "user": "시네픽 관객", "rating": 5.0, "date": "15일 전", "title": "가족과 함께 보기 좋은 영화", "review": "따뜻한 분위기와 유쾌한 이야기가 잘 어우러져 부담 없이 즐길 수 있었다.", "likes": 65}, {"id": "seed_16", "movieId": "seed_movie_16", "movieTitle": "인셉션", "user": "시네픽 관객", "rating": 4.5, "date": "16일 전", "title": "이해하기 어렵지만 매력적이다", "review": "한 번 보고 모든 내용을 이해하기는 어려웠다. 하지만 그래서 더 오래 기억에 남는다.", "likes": 66}, {"id": "seed_17", "movieId": "seed_movie_17", "movieTitle": "헤어질 결심", "user": "시네픽 관객", "rating": 4.5, "date": "17일 전", "title": "배우들의 연기가 압도적이다", "review": "인물의 감정이 화면 너머로 그대로 전달됐다. 연기만으로도 충분히 볼 가치가 있는 영화다.", "likes": 67}, {"id": "seed_18", "movieId": "seed_movie_18", "movieTitle": "패터슨", "user": "시네픽 관객", "rating": 5.0, "date": "18일 전", "title": "평범한 하루의 소중함", "review": "특별한 사건이 없어도 일상은 충분히 아름다울 수 있다는 걸 느꼈다.", "likes": 68}, {"id": "seed_19", "movieId": "seed_movie_19", "movieTitle": "유전", "user": "시네픽 관객", "rating": 4.5, "date": "19일 전", "title": "무서운데 계속 보게 된다", "review": "분위기를 조성하는 방식이 뛰어났다. 단순히 놀라게 하는 공포영화와는 달랐다.", "likes": 69}, {"id": "seed_20", "movieId": "seed_movie_20", "movieTitle": "위플래쉬", "user": "시네픽 관객", "rating": 4.5, "date": "20일 전", "title": "꿈을 향해 달려가는 사람들에게", "review": "자신의 꿈을 위해 노력하는 모습이 인상 깊었다. 나도 다시 도전하고 싶어졌다.", "likes": 70}, {"id": "seed_21", "movieId": "seed_movie_21", "movieTitle": "돈 룩 업", "user": "시네픽 관객", "rating": 5.0, "date": "21일 전", "title": "조금은 아쉬웠던 결말", "review": "전반부는 흥미로웠지만 후반부의 전개가 다소 급하게 느껴졌다. 그래도 볼거리는 충분했다.", "likes": 71}, {"id": "seed_22", "movieId": "seed_movie_22", "movieTitle": "주토피아", "user": "시네픽 관객", "rating": 4.5, "date": "22일 전", "title": "사랑스러운 캐릭터들의 향연", "review": "개성 있는 캐릭터와 유머가 매력적이었다. 보는 내내 기분 좋게 웃을 수 있었다.", "likes": 72}];
 const foodEmoji = m => '';
 const foodBadge = m => '';
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
 return `<div class="workspace-head"><div><h3>${title}</h3><p>${description}</p></div><span class="status-pill">${status}</span></div>`;
 }
 function chip(label, value){ return `<span class="chip"><em>${label}</em> ${value}</span>`; }

 function renderMood(){
 workspace.innerHTML = header(1,'지금 기분은?','지금의 기분과 가장 가까운 하나를 골라주세요.','선택 1개') +
 `<div class="content"><div class="section-row"><h4>오늘 밤의 무드</h4><span>하나만 선택</span></div><div class="mood-grid">${moodOptions.map(m => `<button class="mood-card ${state.mood===m.name?'selected':''}" data-mood="${m.name}" aria-pressed="${state.mood===m.name}"><span class="checkmark">${ICON.check}</span><span class="mood-icon">${m.icon}</span><strong>${m.name}</strong><small>${m.desc}</small></button>`).join('')}</div><div class="selection-summary">${state.mood ? chip('선택한 기분', state.mood) : '<span class="chip">아직 선택하지 않았어요</span>'}</div><div class="actions"><button class="btn primary" id="toDuration" ${state.mood?'':'disabled'}>룰렛 돌리러 가기</button></div></div>`;
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
 `<div class="content"><div class="selection-summary">${chip('기분', state.mood || '전체')}${chip('후보', candidates.length + '편')}</div><div class="divider"></div><div class="section-row"><h4>지금 볼 수 있는 영화</h4><span>조건에 맞는 후보만 표시</span></div><div class="candidate-list">${candidates.map(m => `<article class="candidate-card"><div class="candidate-poster">${posterHTML(m)}</div><div class="candidate-info"><h4>${m.title}${foodBadge(m)}</h4><div class="candidate-meta">${m.year} · ${m.genre} · ${m.runtime}분</div><p>${m.overview}</p><div class="candidate-tags"><span>${m.moods.includes(state.mood) ? state.mood : m.moods[0]}</span><span>${m.food}</span></div></div><button class="btn primary candidate-pick" data-pick-movie="${m.id}">이 영화 선택</button></article>`).join('')}</div><div class="actions"><button class="btn" id="editConditions">← 조건 수정</button><button class="btn primary" id="openWheel">랜덤으로 한 편 고르기</button></div></div>`;
 workspace.querySelectorAll('[data-pick-movie]').forEach(b => b.addEventListener('click', () => {
 const picked = byId(b.dataset.pickMovie); if(!picked) return;
 state.movie = picked; state.lastMovieId = picked.id; setStep(4);
 }));
 $('#editConditions').addEventListener('click', () => setStep(1));
 $('#openWheel').addEventListener('click', () => { state.showWheel = true; renderWheel(); });
 return;
 }
 const wheelSize = 8, segDeg = 360 / wheelSize;
 const pt = (deg, r) => { const a = deg * Math.PI / 180; return [(r * Math.sin(a)).toFixed(2), (-r * Math.cos(a)).toFixed(2)]; };
 const colors = ['var(--paper)','var(--surface)','var(--soft-red)'];
 const segs = Array.from({length:wheelSize},(_,i)=>{
   const a0=i*segDeg,a1=a0+segDeg,[x0,y0]=pt(a0,96),[x1,y1]=pt(a1,96);
   const fill=colors[i%colors.length];
   return `<path d="M0 0 L${x0} ${y0} A96 96 0 0 1 ${x1} ${y1} Z" style="fill:${fill};stroke:var(--line-strong);stroke-width:1.2"/>`;
 }).join('');
 workspace.innerHTML = header(3,'운명에 맡겨볼까요?','룰렛이 멈춘 영화에 10초 안에 결정해요. 고민은 짧게!','후보 ' + candidates.length + '편') +
 `<div class="content"><div class="wheel-layout"><div class="wheel-wrap"><div class="wheel-pointer" aria-hidden="true"></div><svg class="roulette" id="wheel" viewBox="-100 -100 200 200" role="img" aria-label="후보 영화 ${candidates.length}편 룰렛" style="transform:rotate(${state.wheelRot}deg)"><circle r="98" style="fill:var(--paper);stroke:var(--ink);stroke-width:2"/>${segs}<circle r="14" style="fill:var(--paper);stroke:var(--ink);stroke-width:1.2"/><text text-anchor="middle" dominant-baseline="central" style="font-size:12px"></text></svg></div><div class="wheel-panel"><h4>이번 밤의 후보</h4><p>후보 전체에서 한 편을 무작위로 골라요. 룰렛은 깔끔한 디자인으로 표시돼요.</p><div class="condition-list"><div class="condition-line"><span>현재 기분</span><strong>${state.mood}</strong></div><div class="condition-line"><span>추천 후보</span><strong>${candidates.length}편</strong></div><div class="condition-line"><span>결정 시간</span><strong>10초</strong></div></div><div class="spin-note" id="spinNote"></div><button class="btn primary full" id="spinButton">룰렛 돌리기</button><button class="btn full" id="backCandidates" style="margin-top:8px">후보 보기</button><button class="btn full" id="editConditions" style="margin-top:8px">조건 수정하기</button></div></div></div>`;
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
 const segDeg = 360 / 8;
 const target = Math.floor(Math.random()*8)*segDeg + segDeg/2;
 const jitter = (Math.random() - 0.5) * segDeg * 0.6;
 const base = state.wheelRot;
 state.wheelRot = base + 360 * 5 + ((target - (base % 360)) + 720) % 360 + jitter;
 state.spinning = true;
 const wheel = $('#wheel'), button = $('#spinButton'), note = $('#spinNote');
 button.disabled = true; button.textContent = '룰렛이 도는 중…'; note.textContent = '어떤 영화에 멈출까요?';
 $('#backCandidates').disabled = true; $('#editConditions').disabled = true;
 if(wheel){ void wheel.getBoundingClientRect(); wheel.style.transform = `rotate(${state.wheelRot}deg)`; }
 const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
 spinTimeout = setTimeout(() => { state.spinning = false; state.movie = pick; state.lastMovieId = pick.id; state.fromRoulette = true; note.textContent = `${pick.title}!`; spinTimeout = setTimeout(() => setStep(4), 500); }, reduce ? 300 : 3200);
 }
 function posterMarkup(movie){ return `<div class="poster">${posterHTML(movie)}</div>`; }
 const bmLabel = m => bookmarks().includes(m.id) ? ICON.bookmarkOn + '찜 중' : ICON.bookmark + '찜';
 function toggleBm(m, btn){
 const cur = bookmarks(), has = cur.includes(m.id);
 const ok = saveBm(has ? cur.filter(x => x !== m.id) : [...cur, m.id]);
 if(btn) btn.innerHTML = bmLabel(m);
 showToast(has ? '찜을 해제했어요.' : (ok ? '찜했어요.' : '저장하지 못했어요. 창을 닫기 전까지만 유지돼요.'));
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
 overlay.innerHTML = `<div class="ticket-tear-stage"><h2 class="ticket-tear-title">이 영화로 결정!</h2><p class="ticket-tear-subtitle">오늘의 영화 티켓을 찢어 확정하고 있어요.</p><div class="tear-ticket" aria-hidden="true"><div class="tear-ticket-half tear-ticket-top"><span class="tear-mark">${ICON.film}</span><span class="tear-movie">${esc(m.title)}</span></div><div class="tear-ticket-half tear-ticket-bottom"><span>OFFICIAL PICK</span><span class="tear-code">SP ${ICON.check}</span></div></div></div>`;
 document.body.appendChild(overlay);
 window.setTimeout(() => { overlay.remove(); const lv = state.lvUp; setStep(5); if(lv){ state.lvUp = lv; render(); } }, 1450);
 }
 function renderResult(){
 const m = state.movie;
 if(!m){ state.step = 3; renderWheel(); return; }
 const timed = state.fromRoulette;
 const timerBox = timed ? `<div class="decide-box" id="decideBox" role="timer" aria-live="off"><div class="decide-head"><span>${ICON.clock}결정까지</span><strong><span id="decideNum">${DECIDE_SEC}</span>초</strong></div><div class="decide-track"><div class="decide-bar" id="decideBar"></div></div><p>시간이 끝나면 이 영화로 자동 확정돼요. 다른 영화를 보려면 ‘후보 보기’를 누르세요.</p></div>` : '';
 workspace.innerHTML = header(4,'오늘의 추천 영화', timed ? '룰렛이 골라준 영화예요. 10초 안에 결정해 볼까요?' : '마음에 들면 확정하세요. 다른 영화가 궁금하면 후보를 다시 볼 수 있어요.', timed ? '10초 결정' : '추천 결과') +
 `<div class="content">${timerBox}<div class="result-layout"><div>${posterMarkup(m)}</div><div class="result-info"><h4>${m.title}${foodBadge(m)}</h4><p class="subline">${m.year} · ${m.genre} · ${m.runtime}분</p><div class="tags"><span class="tag">${m.moods.includes(state.mood) ? state.mood : m.moods[0]}</span><span class="tag">${m.food}</span></div><p class="overview">${m.overview}</p><div class="actions" style="justify-content:stretch"><button class="btn" id="showCandidates">후보 보기</button><button class="btn" id="tryAgain">다시 돌리기 ↻</button><button class="btn" id="bmBtn">${bmLabel(m)}</button><button class="btn primary" id="confirmMovie">${ICON.check}이 영화로 확정</button></div></div></div></div>`;
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
 `<div class="content"><div class="confirm-banner"><div class="confirm-icon">${posterHTML(m)}</div><div><h4>${m.title}${foodBadge(m)}</h4><p>${m.year} · ${m.genre} · ${m.runtime}분</p><p style="margin-top:6px">야식 페어링 · ${m.food}</p></div></div>${up}${stub}<div class="actions" style="justify-content:stretch;margin-top:0"><button class="btn primary" id="issueTicket" ${t ? 'disabled' : ''}>${t ? ICON.check + '발권 완료' : ICON.ticket + '매칭 티켓 발권'}</button><button class="btn" id="watchMovie">감상 서비스 선택 ↗</button><button class="btn" id="bmBtn">${bmLabel(m)}</button></div><div class="actions"><button class="btn" id="moreMovie">새 영화 추천하기</button><button class="btn primary" id="toBook">티켓북 보기 →</button></div></div>`;
 $('#issueTicket').addEventListener('click', () => issueTicket(m));
 $('#watchMovie').addEventListener('click', () => openWatchModal(m));
 $('#bmBtn').addEventListener('click', e => toggleBm(m, e.currentTarget));
 $('#moreMovie').addEventListener('click', () => { state.movie = null; state.lastMovieId = null; state.mood = null; setStep(1); });
 $('#toBook').addEventListener('click', () => { state.tab = 'tickets'; setStep(6); });
 }
 const providerServiceUrl = (name, movieTitle) => {
   const n=String(name||'').toLowerCase();
   const services=[
     [/netflix/, 'https://www.netflix.com/'],
     [/disney\s*\+|disney plus/, 'https://www.disneyplus.com/'],
     [/amazon prime|prime video/, 'https://www.primevideo.com/'],
     [/watcha/, 'https://watcha.com/'],
     [/wavve/, 'https://www.wavve.com/'],
     [/tving|티빙/, 'https://www.tving.com/'],
     [/coupang play|쿠팡플레이/, 'https://www.coupangplay.com/'],
     [/apple tv/, 'https://tv.apple.com/'],
     [/u\+ mobile tv|u\+모바일tv/, 'https://www.lguplus.com/'],
     [/google play/, 'https://play.google.com/store/movies'],
     [/youtube/, 'https://www.youtube.com/movies'],
     [/naver series|시리즈온/, 'https://serieson.naver.com/'],
     [/paramount\+/, 'https://www.paramountplus.com/'],
     [/max|hbo max/, 'https://www.max.com/'],
     [/mubi/, 'https://mubi.com/']
   ];
   const hit=services.find(([re])=>re.test(n));
   return hit?hit[1]:'https://www.google.com/search?q='+encodeURIComponent(name+' '+movieTitle+' 공식 서비스');
 };
 let ottReturnMovie=null;
 async function openWatchModal(m){
 ottReturnMovie=m;
 const root=$('#modalRoot');
 root.innerHTML=`<div class="modal-backdrop" id="ottBackdrop"><section class="movie-detail-modal ott-screen" role="dialog" aria-modal="true" aria-label="감상 서비스"><button class="ott-back" id="ottBack">← 영화 정보로 돌아가기</button><div class="ott-movie"><div class="movie-detail-poster">${posterHTML(m)}</div><div><h3>${esc(m.title)}</h3><p>${m.year||'연도 정보 없음'} · 국내 OTT 제공 여부</p></div></div><h3 style="font-size:19px;margin:0 0 5px">어디에서 볼 수 있을까요?</h3><p style="font-size:11px;color:var(--muted);margin:0 0 15px">대한민국 기준 제공 정보입니다. 서비스 버튼을 누르면 해당 OTT 공식 사이트로 이동해요. 영화별 바로가기 지원 여부는 OTT마다 달라요.</p><div id="ottResults"><div class="ott-empty">OTT 제공 정보를 확인하고 있어요…</div></div><p class="review-disclaimer">제공 정보: TMDB Watch Providers · 대한민국(KR)</p></section></div>`;
 const panel=root.querySelector('.movie-detail-modal');
 panel.addEventListener('click',e=>e.stopPropagation());
 const close=()=>{root.innerHTML='';};
 $('#ottBack').addEventListener('click',close);
 $('#ottBackdrop').addEventListener('click',e=>{if(e.target===e.currentTarget)close();});
 const results=$('#ottResults');
 try{
   let tmdbId=m.tmdbId;
   if(!tmdbId && String(m.id).startsWith('api_')) tmdbId=String(m.id).slice(4);
   if(!tmdbId){
     const u=new URL('https://api.themoviedb.org/3/search/movie');
     u.searchParams.set('api_key',TMDB_API_KEY);u.searchParams.set('query',m.title);u.searchParams.set('language','ko-KR');
     if(m.year)u.searchParams.set('year',String(m.year));
     const sr=await fetch(u);if(!sr.ok)throw new Error('검색 실패');
     const sd=await sr.json();const hit=(sd.results||[]).find(x=>!m.year||String((x.release_date||'').slice(0,4))===String(m.year))||(sd.results||[])[0];
     tmdbId=hit&&hit.id;
   }
   if(!tmdbId){results.innerHTML='<div class="ott-empty"><strong>현재 제공 정보가 없습니다.</strong><br>이 영화의 국내 OTT 제공 여부를 찾지 못했어요.</div>';return;}
   const u=new URL(`https://api.themoviedb.org/3/movie/${tmdbId}/watch/providers`);u.searchParams.set('api_key',TMDB_API_KEY);
   const pr=await fetch(u);if(!pr.ok)throw new Error('제공 정보 조회 실패');
   const pd=await pr.json(), kr=pd.results&&pd.results.KR;
   const groups=[['구독으로 감상',kr&&kr.flatrate],['무료 감상',kr&&kr.free],['광고 포함 무료',kr&&kr.ads],['대여',kr&&kr.rent],['구매',kr&&kr.buy]];
   const any=groups.some(g=>g[1]&&g[1].length);
   if(!any){results.innerHTML='<div class="ott-empty"><strong>현재 국내에서 제공 중인 OTT가 없어요.</strong><br>TMDB에 등록된 대한민국 기준 감상 서비스 정보가 없습니다.</div>';return;}
   results.innerHTML=groups.filter(g=>g[1]&&g[1].length).map(([label,items])=>`<h4 class="ott-group-title">${label}</h4><div class="ott-provider-list">${items.map(x=>`<a class="ott-provider" href="${esc(providerServiceUrl(x.provider_name,m.title))}" target="_blank" rel="noopener noreferrer">${x.logo_path?`<img src="https://image.tmdb.org/t/p/w92${esc(x.logo_path)}" alt="">`:''}<span>${esc(x.provider_name)}</span><span style="margin-left:auto;color:var(--muted)">서비스로 이동 ↗</span></a>`).join('')}</div>`).join('');
 }catch(err){results.innerHTML='<div class="ott-empty"><strong>OTT 정보를 불러오지 못했어요.</strong><br>네트워크 연결 후 다시 시도해 주세요.</div>';}
 }

 /* 티켓북: 도장판(10칸) + 레벨 + 티켓 목록(메모 수정/삭제) + 보관 탭 */
 function stampCells(){
 const chrono = tickets().slice().reverse();
 const cur = chrono.slice(Math.floor(chrono.length / 10) * 10);
 return Array.from({length:10}, (_, i) => cur[i]
 ? `<div class="stamp filled"><span class="stamp-mark">${ICON.check}</span><strong>${esc(titleOf(cur[i]))}</strong><small>${esc(cur[i].savedDate)}</small></div>`
 : `<div class="stamp"><span class="stamp-mark">${i + 1}</span><strong>비어 있음</strong></div>`).join('');
 }
 function renderTicketbook(){
 const t = tickets(), b = bookmarks().map(byId).filter(Boolean), L = lvInfo(t.length);
 let body = '';
 if(state.tab === 'tickets'){
 body = `<div class="lvbox"><div class="lvhead"><strong><span class="lvbadge">Lv.${L.lv}</span>${L.name}</strong><span>${L.cur} / 10</span></div><div class="timer-track" style="height:6px"><div class="timer-progress" style="width:${L.cur * 10}%;transition:none"></div></div><p class="lvnote">${t.length > 0 && L.cur === 0 ? '새 레벨 시작! 도장 10개를 다시 모아보세요.' : `다음 레벨까지 ${L.next}개`}</p></div>
 <div class="stamp-head"><h4>우유부단 탈출 도장판</h4><span>총 ${t.length}장 발권</span></div><div class="stamp-grid">${stampCells()}</div>
 <div class="stamp-head"><h4>발권한 티켓</h4><span>최신순</span></div>` +
 (t.length ? `<div class="tlist">${t.map(x => { const m = byId(x.movieId) || {title:'삭제된 영화', poster:''}; return `<div class="tcard"><div class="h"><div class="g">${posterHTML(m)}</div><div><div class="n">${esc(m.title||'제목 정보 없음')}${sourceBadge(m)}${foodBadge(m)}</div><div class="s">${esc(x.savedDate)} · No. ${esc(x.ticketId)}</div></div></div><div class="memo"><input type="text" id="memo-${esc(x.ticketId)}" value="${esc(x.memo || '')}" maxlength="40" placeholder="한 줄 감상 메모" aria-label="${esc(m.title)} 메모"><button class="btn" data-memo="${esc(x.ticketId)}">저장</button><button class="btn danger" data-del="${esc(x.ticketId)}">삭제</button></div><button class="btn" data-review-ticket="${esc(x.movieId)}" style="min-height:0;padding:8px;font-size:11px">${myReviews().some(r => r.movieId === x.movieId) ? '내 리뷰 수정' : '이 영화 리뷰 쓰기'}</button><p class="tmsg" id="mm-${esc(x.ticketId)}"></p></div>`; }).join('')}</div>`
 : `<div class="empty-box"><strong>아직 발권한 티켓이 없어요</strong>룰렛을 돌려 첫 티켓을 만들어보세요.</div>`);
 } else {
 body = b.length ? `<div class="tlist">${b.map(m => `<div class="tcard"><div class="h"><div class="g">${posterHTML(m)}</div><div><div class="n">${m.title}${foodBadge(m)}</div><div class="s">${m.year} · ${m.genre} · ${m.runtime}분</div></div></div><div class="memo"><button class="btn primary" data-pick="${m.id}" style="flex:1">이 영화로 확정</button><button class="btn" data-unbm="${m.id}">찜 해제</button></div></div>`).join('')}</div>`
 : `<div class="empty-box"><strong>찜한 영화가 없어요</strong>영화 상세에서 ‘찜’을 눌러 모아보세요.</div>`;
 }
 workspace.innerHTML = header(6,'내 티켓북','발권한 티켓과 찜한 영화를 한곳에서 관리해요.', `Lv.${L.lv} ${L.name}`) +
 `<div class="content"><div class="tabs" role="tablist"><button role="tab" data-tab="tickets" aria-selected="${state.tab === 'tickets'}">티켓북 ${t.length}</button><button role="tab" data-tab="bookmarks" aria-selected="${state.tab === 'bookmarks'}">찜 ${b.length}</button></div>${body}<div class="actions"><button class="btn primary" id="startAgain">영화 추천받기 →</button></div></div>`;
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
 {id:'noCandidates',icon:ICON.search,title:'조건에 맞는 영화가 없어요',desc:`${state.mood || '선택한 기분'}에 맞는 후보가 없어요. 다른 기분을 골라보세요.`,button:'조건 다시 설정',action:() => setStep(1)},
 
 {id:'ott',icon:ICON.ext,title:'감상 서비스를 찾지 못했어요',desc:'서비스 앱에서 영화 제목을 직접 검색해보세요. TMDB에 등록된 대한민국 OTT 제공 여부를 확인해요.',button:'감상 서비스 선택',action:() => state.movie ? openWatchModal(state.movie) : showToast('먼저 영화를 추천받아 주세요.')},
 {id:'storage',icon:ICON.save,title:'기록을 저장하지 못했어요',desc:'브라우저 저장이 제한되어 있을 수 있어요. 이 경우에도 추천 흐름은 계속 이용할 수 있고, 창을 닫기 전까지는 기록이 유지돼요.',button:'저장 안내 보기',action:() => showToast('브라우저의 사이트 데이터 저장 설정을 확인해 주세요.')}
 ].filter(e => type === 'all' || e.id === type);
 workspace.innerHTML = header(7,'막히는 순간에도, 다음 선택은 있어요.','예상 가능한 예외 상황에서 바로 복구할 수 있도록 준비했어요.','도움말') +
 `<div class="content"><div class="recovery-list">${entries.map(e => `<article class="recovery"><div class="recovery-icon">${e.icon}</div><div><h4>${e.title}</h4><p>${e.desc}</p><button class="btn" data-recovery="${e.id}">${e.button} →</button></div></article>`).join('')}</div><div class="actions"><button class="btn" id="backToApp">← 앱으로 돌아가기</button></div></div>`;
 workspace.querySelectorAll('[data-recovery]').forEach(b => b.addEventListener('click', () => { const e = entries.find(x => x.id === b.dataset.recovery); if(e) e.action(); }));
 $('#backToApp').addEventListener('click', () => setStep(state.movie ? 4 : (state.mood ? 2 : 1)));
 updateNavigation();
 }
 function shuffleMovies(items){
   const a=[...items];
   for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
   return a;
 }
 function tmdbMovieToCard(r){
   const genreMap={28:'액션',12:'모험',16:'애니메이션',35:'코미디',80:'범죄',99:'다큐멘터리',18:'드라마',10751:'가족',14:'판타지',36:'역사',27:'공포',10402:'음악',9648:'미스터리',10749:'로맨스',878:'SF',10770:'TV 영화',53:'스릴러',10752:'전쟁',37:'서부'};
   const title=r.title||r.original_title||'제목 정보 없음';
   return {id:'api_'+r.id,title,en:(r.original_title||title).toUpperCase(),year:Number((r.release_date||'').slice(0,4))||'',runtime:null,genre:(r.genre_ids||[]).map(id=>genreMap[id]).filter(Boolean).join(' · ')||'영화',moods:['심심한','센치한'],food:'팝콘',overview:r.overview||'줄거리 정보가 없습니다.',poster:r.poster_path?TMDB_IMAGE+r.poster_path:'',source:'A',tmdbId:r.id};
 }
 function enableHomeRailDrag(track){
   if(!track || track.dataset.dragReady==='1')return;
   track.dataset.dragReady='1';
   let down=false,startX=0,startScroll=0,moved=false;
   track.addEventListener('pointerdown',e=>{
     if(e.pointerType==='touch'||e.button!==0)return;
           down=true;moved=false;startX=e.clientX;startScroll=track.scrollLeft;
   });
   window.addEventListener('pointermove',e=>{
     if(!down)return;
     const dx=e.clientX-startX;
           if(Math.abs(dx)>4&&!moved){moved=true;track.classList.add('is-dragging');}
      if(moved)track.scrollLeft=startScroll-dx;
   });
   const finish=()=>{
     if(!down)return;
           down=false;track.classList.remove('is-dragging');
     if(moved){
       track.dataset.suppressClick='1';
       setTimeout(()=>{track.dataset.suppressClick='0';},0);
     }
   };
   window.addEventListener('pointerup',finish);
   window.addEventListener('pointercancel',finish);
   track.addEventListener('click',e=>{
     if(track.dataset.suppressClick==='1'){e.preventDefault();e.stopPropagation();track.dataset.suppressClick='0';}
   },true);
 }
 function bindHomeMovieCards(root){
   root.querySelectorAll('[data-home-movie]').forEach(card=>{
     const open=()=>openMovieDetail(card.dataset.homeMovie);
     card.addEventListener('click',open);
     card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
   });
 }
 async function renderHomeCollections(){
   const rankBox=$('#homeRankedMovies'), recentBox=$('#homeRecentMovies');
   if(!rankBox||!recentBox)return;
   // 조회 통계가 없는 초기 버전은 로컬 카탈로그를 랜덤 셔플해 임시 순위로 표시합니다.
   const rankPool=shuffleMovies(localMovies).slice(0,10);
   rankBox.innerHTML=rankPool.map((m,i)=>`<button class="home-rank-card" type="button" data-home-movie="${esc(m.id)}" aria-label="${i+1}위 ${esc(m.title)} 영화 상세 보기"><div class="home-rank-poster">${posterHTML(m)}<span class="home-rank-number">${i+1}</span></div><div class="home-rank-title">${esc(m.title)}</div><p class="home-rank-meta">${esc(m.year||'연도 정보 없음')} · ${esc(m.genre||'영화')}</p></button>`).join('');
   bindHomeMovieCards(rankBox);
   enableHomeRailDrag(rankBox);
   try{
     const url=new URL('https://api.themoviedb.org/3/movie/now_playing');
     url.searchParams.set('api_key',TMDB_API_KEY);
     url.searchParams.set('language','ko-KR');
     url.searchParams.set('region','KR');
     url.searchParams.set('page','1');
     const res=await fetch(url.toString());
     if(!res.ok)throw new Error('TMDB '+res.status);
     const data=await res.json();
     const recent=(data.results||[]).filter(r=>r.title||r.original_title).slice(0,10).map(tmdbMovieToCard);
     recent.forEach(m=>{if(!movies.some(x=>x.id===m.id))movies.push(m);});
     recentBox.innerHTML=recent.length?recent.map(m=>`<button class="home-release-card" type="button" data-home-movie="${esc(m.id)}" aria-label="${esc(m.title)} 영화 상세 보기"><div class="home-release-poster">${posterHTML(m)}<span class="home-release-badge">NEW</span></div><div class="home-release-title">${esc(m.title)}</div><p class="home-release-meta">${esc(m.year||'개봉 연도')} · ${esc(m.genre)}</p></button>`).join(''):'<div class="home-collection-loading">최근 개봉작 정보가 없어요.</div>';
     bindHomeMovieCards(recentBox);
     enableHomeRailDrag(recentBox);
   }catch(err){
     recentBox.innerHTML='<div class="home-collection-loading">최근 개봉작을 불러오지 못했어요. 잠시 후 다시 이용해 주세요.</div>';
     console.warn('TMDB recent releases load failed',err);
   }
 }
 function renderHome(){
 const t = tickets(), b = bookmarks();
 const dayIndex = Math.floor((new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) - new Date(new Date().getFullYear(),0,0)) / 86400000);
 const dailyMovie = localMovies[dayIndex % localMovies.length];
 workspace.innerHTML = `<div class="home-screen">
 <div id="homeSearchPanel" style="display:none">${searchBox('homeQ')}<div id="homeResults"></div></div>
  <div class="home-feature"><h3>지금 기분에 맞는 영화</h3><p>기분을 선택하고 보고 싶은 영화를 골라보세요.</p><button id="homeStart">영화 추천 시작하기 →</button></div>
 <div class="home-section-title">오늘의 영화</div>
 <article class="today-ticket" aria-label="오늘의 추천 영화 티켓">
    <div class="today-ticket-topline"><span class="ticket-brand">CINEPICK <i>·</i> MOVIE TICKET</span><span class="ticket-number">TODAY'S PICK&nbsp; #01</span></div>
    <div class="today-ticket-poster">${posterHTML(dailyMovie)}<span class="ticket-poster-shade"></span><span class="ticket-poster-label">TODAY'S MOVIE</span></div>
    <div class="today-ticket-main">
      <div class="today-ticket-info">
        <div class="ticket-overline">오늘의 추천 영화</div>
        <h3>${esc(dailyMovie.title||"제목 정보 없음")} ${sourceBadge(dailyMovie)}${foodBadge(dailyMovie)}</h3>
        <div class="ticket-meta">${esc(dailyMovie.genre||"장르 정보 없음")} <span>·</span> ${dailyMovie.runtime!=null?esc(dailyMovie.runtime)+"분":"상영시간 정보 없음"}</div>
        <p>${esc(dailyMovie.overview||dailyMovie.description||"영화 소개 정보가 아직 없어요.")}</p>
        <div class="ticket-tags"><span>${esc(Array.isArray(dailyMovie.moods)&&dailyMovie.moods[0]||"분위기 정보 없음")}</span><span>${esc(dailyMovie.food||"음식 정보 없음")}</span></div>
      </div>
      <div class="ticket-side-code" aria-hidden="true"><div class="ticket-barcode"></div><small>CP · ${String(dailyMovie.id||"0001").replace(/[^a-zA-Z0-9]/g,"").slice(-8).toUpperCase()||"0001"}</small></div>
    </div>
    <div class="today-ticket-perforation"><span>ADMIT ONE</span><span class="ticket-perf-line"></span><span>CINEPICK</span></div>
    <div class="today-ticket-footer"><span>YOUR NEXT MOVIE MOMENT</span><button class="btn primary" id="todayMoviePick">이 영화 선택하기 <span aria-hidden="true">→</span></button></div>
  </article>

  <section class="home-collection-section">
    <div class="home-collection-heading"><div><h3>오늘 많이 본 영화</h3><p>실제 조회 데이터가 없어 임시로 랜덤 순서로 보여드려요.</p></div></div>
    <div class="home-collection-track" id="homeRankedMovies"></div>
  </section>
  <section class="home-collection-section">
    <div class="home-collection-heading"><div><h3>최근 개봉작</h3><p>국내 최신 개봉작 10편</p></div></div>
    <div class="home-collection-track" id="homeRecentMovies"></div>
  </section>

 </div>`;
 const hq = $('#homeQ');
 hq.addEventListener('input', () => { state.q = hq.value; renderMovieResults($('#homeResults'), norm(state.q)); });
 workspace.querySelector('[data-clear]').addEventListener('click', () => { state.q = ''; hq.value = ''; hq.focus(); renderMovieResults($('#homeResults'), ''); });
 renderMovieResults($('#homeResults'), norm(state.q || ''));
 renderHomeCollections();
 $('#homeStart').addEventListener('click', () => { state.activeTab='recommend'; state.mood=null; state.movie=null; setStep(1); });
 $('#todayMoviePick').addEventListener('click', () => { state.movie=dailyMovie; state.mood=dailyMovie.moods[0]; state.lastMovieId=dailyMovie.id; setStep(4); });
 $('#homeTickets')?.addEventListener('click', () => { state.tab='tickets'; state.activeTab='recommend'; state.step=6; render(); });
 $('#homeSaved')?.addEventListener('click', () => { state.tab='bookmarks'; state.activeTab='recommend'; state.step=6; render(); });
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
 const matchMovie = (m, q) => !q || [m?.title, m?.en, m?.genre, m?.tone, ...(Array.isArray(m?.moods)?m.moods:[])].some(v => v != null && norm(v).includes(q));
 // TMDB 인물 검색 결과의 출연작을 현재 API 목록과 대조합니다.
 const actorSearchCache=new Map();
 let actorSearchTimer=null,actorSearchSeq=0,actorMatchedIds=new Set(),actorPending=false;
 let actorMovieCards=[];
// TMDB가 한글 이름을 못 찾는 경우를 대비한 해외 배우 한글→영문 이름표 (자주 검색되는 배우 위주)
const ACTOR_ALIASES={'톰크루즈':'Tom Cruise','톰행크스':'Tom Hanks','브래드피트':'Brad Pitt','레오나르도디카프리오':'Leonardo DiCaprio','디카프리오':'Leonardo DiCaprio','조니뎁':'Johnny Depp','로버트다우니주니어':'Robert Downey Jr.','로다주':'Robert Downey Jr.','스칼렛요한슨':'Scarlett Johansson','스칼렛조핸슨':'Scarlett Johansson','크리스헴스워스':'Chris Hemsworth','크리스에반스':'Chris Evans','크리스프랫':'Chris Pratt','마크러팔로':'Mark Ruffalo','휴잭맨':'Hugh Jackman','라이언레이놀즈':'Ryan Reynolds','라이언고슬링':'Ryan Gosling','엠마스톤':'Emma Stone','엠마왓슨':'Emma Watson','제니퍼로렌스':'Jennifer Lawrence','안젤리나졸리':'Angelina Jolie','나탈리포트만':'Natalie Portman','앤해서웨이':'Anne Hathaway','메릴스트립':'Meryl Streep','샌드라불럭':'Sandra Bullock','니콜키드먼':'Nicole Kidman','케이트윈슬렛':'Kate Winslet','마고로비':'Margot Robbie','젠데이아':'Zendaya','티모시샬라메':'Timothée Chalamet','플로렌스퓨':'Florence Pugh','다니엘크레이그':'Daniel Craig','키아누리브스':'Keanu Reeves','덴젤워싱턴':'Denzel Washington','모건프리먼':'Morgan Freeman','사무엘잭슨':'Samuel L. Jackson','새뮤얼잭슨':'Samuel L. Jackson','맷데이먼':'Matt Damon','벤애플렉':'Ben Affleck','크리스찬베일':'Christian Bale','크리스천베일':'Christian Bale','앤서니홉킨스':'Anthony Hopkins','안소니홉킨스':'Anthony Hopkins','잭니콜슨':'Jack Nicholson','알파치노':'Al Pacino','로버트드니로':'Robert De Niro','윌스미스':'Will Smith','조지클루니':'George Clooney','제이크질렌할':'Jake Gyllenhaal','톰홀랜드':'Tom Holland','톰하디':'Tom Hardy','베네딕트컴버배치':'Benedict Cumberbatch','이안맥켈런':'Ian McKellen','일라이저우드':'Elijah Wood','다니엘래드클리프':'Daniel Radcliffe','헨리카빌':'Henry Cavill','가도갓':'Gal Gadot','갤가돗':'Gal Gadot','마이클패스벤더':'Michael Fassbender','조슈브롤린':'Josh Brolin','엘리자베스올슨':'Elizabeth Olsen','브리라슨':'Brie Larson','안야테일러조이':'Anya Taylor-Joy','헤일리스테인펠드':'Hailee Steinfeld','마동석':'Don Lee','성룡':'Jackie Chan','재키찬':'Jackie Chan','이연걸':'Jet Li','양조위':'Tony Leung Chiu-wai','주윤발':'Chow Yun-fat','유덕화':'Andy Lau','금성무':'Takeshi Kaneshiro','기무라타쿠야':'Takuya Kimura','와타나베켄':'Ken Watanabe','히로세스즈':'Suzu Hirose','야마시타토모히사':'Tomohisa Yamashita'};
function actorQueryVariants(query){
  const raw=String(query||'').trim(), tight=raw.replace(/\s+/g,'');
  const k=norm(raw), out=[raw];
  if(tight!==raw)out.push(tight);
  if(ACTOR_ALIASES[k])out.push(ACTOR_ALIASES[k]);
  else if(k.length>=3){ // 일부만 입력해도(예: '톰 크루') 이름표에서 찾기
    for(const key of Object.keys(ACTOR_ALIASES)){ if(key.startsWith(k)){ out.push(ACTOR_ALIASES[key]); break; } }
  }
  return [...new Set(out)];
}
async function fetchPeople(name,lang){
  const u=new URL('https://api.themoviedb.org/3/search/person');
  u.searchParams.set('api_key',TMDB_API_KEY);u.searchParams.set('query',name);u.searchParams.set('language',lang);u.searchParams.set('include_adult','false');
  const r=await fetch(u);if(!r.ok)return [];
  return (await r.json()).results||[];
}
async function searchActorMovieIds(query){
  if(actorSearchCache.has(query))return actorSearchCache.get(query);
  const variants=actorQueryVariants(query);
  const lists=await Promise.all(variants.map(v=>fetchPeople(v,'ko-KR').catch(()=>[])));
  const seenP=new Set(),people=[];
  lists.forEach(list=>{
    const acting=list.filter(p=>p.known_for_department==='Acting');
    (acting.length?acting:list).slice(0,3).forEach(p=>{if(!seenP.has(p.id)){seenP.add(p.id);people.push(p);}});
  });
  const top=people.slice(0,3);
  if(!top.length&&!variants.length)throw new Error('인물 검색 실패');
  const byTmdb=new Map();
  await Promise.all(top.map(async person=>{
    const cu=new URL(`https://api.themoviedb.org/3/person/${person.id}/movie_credits`);
    cu.searchParams.set('api_key',TMDB_API_KEY);cu.searchParams.set('language','ko-KR');
    try{
      const cr=await fetch(cu);if(!cr.ok)return;const d=await cr.json();
      (d.cast||[]).filter(m=>m&&m.id&&(m.title||m.original_title)).sort((x,y)=>(y.popularity||0)-(x.popularity||0)).slice(0,40)
        .forEach(m=>{if(!byTmdb.has(m.id))byTmdb.set(m.id,tmdbMovieToCard(m));});
    }catch(_){}
  }));
  const cards=[...byTmdb.values()].slice(0,80);
  actorSearchCache.set(query,cards);return cards;
}
function scheduleActorSearch(q){
  clearTimeout(actorSearchTimer);const seq=++actorSearchSeq;
  actorMatchedIds=new Set();actorMovieCards=[];actorPending=!!q;
  if(!q)return;
  actorSearchTimer=setTimeout(async()=>{
    try{
      const cards=await searchActorMovieIds(q);if(seq!==actorSearchSeq)return;
      cards.forEach(m=>{if(!movies.some(x=>x.id===m.id))movies.push(m);});
      actorMovieCards=cards;actorMatchedIds=new Set(cards.map(m=>Number(m.tmdbId)));
    }catch(_){if(seq!==actorSearchSeq)return;actorMatchedIds=new Set();actorMovieCards=[];}
    actorPending=false;if(state.activeTab==='browse')updateBrowse();
  },150);
}

const stars = n => Array.from({length:5}, (_, i) => i < Math.round(n) ? ICON.starOn : ICON.star).join('');

 function renderMovieResults(box, q){
 if(!box) return;
 if(!q){box.innerHTML='<div class="search-hint">영화 제목이나 배우 이름으로 검색해 보세요.</div>';return;}
 const token=++apiSearchToken;clearTimeout(apiSearchTimer);
 const localHit=localMovies.filter(m=>matchMovie(m,q));
 box.innerHTML='<div class="empty-box"><strong>검색 중…</strong></div>';
 apiSearchTimer=setTimeout(async()=>{
   let results=[],failed=false;
   let actorCards=[];
   const [apiRes,actorRes]=await Promise.allSettled([searchMovieAPI(q),searchActorMovieIds(q)]);
   if(apiRes.status==='fulfilled')results=apiRes.value;else failed=true;
   if(actorRes.status==='fulfilled')actorCards=actorRes.value;else if(apiRes.status!=='fulfilled')failed=true;
   if(token!==apiSearchToken||!box.isConnected)return;
   [...results,...actorCards].forEach(m=>{if(!movies.some(x=>x.id===m.id))movies.push(m);});
   const mKey=m=>norm(m.title||'')+'|'+(parseInt(m.year,10)||'');
   const lk=new Set(localHit.map(mKey)),found=localHit.slice(0,20);
   [...results.slice(0,12),...actorCards.slice(0,30)].forEach(m=>{const k=mKey(m);if(lk.has(k))return;lk.add(k);found.push(m);});
   const mineNow=myReviews();
   box.innerHTML=found.length?`<div class="home-section-title">검색 결과 ${found.length}편</div>${failed?'<div class="search-hint">TMDB 연결에 실패해 내장 영화만 보여드려요.</div>':''}<div class="tlist" style="margin-top:0">${found.map(m=>{const has=mineNow.some(r=>r.movieId===m.id);return `<div class="tcard"><div class="h"><div class="g">${posterHTML(m)}</div><div style="min-width:0"><div class="n">${esc(m.title)}${sourceBadge(m)}</div><div class="s">${m.year||'연도 정보 없음'} · ${esc(m.genre||'영화')} · ${m.runtime?m.runtime+'분':'상영시간 정보 없음'}</div></div></div><div class="memo"><button class="btn primary" data-write="${esc(m.id)}" style="flex:1">${has?'내 리뷰 수정':'리뷰 쓰기'}</button><button class="btn" data-bm-search="${esc(m.id)}">${bmLabel(m)}</button></div></div>`;}).join('')}</div>`:`<div class="empty-box"><strong>검색 결과가 없어요</strong>${failed?'TMDB 연결도 실패했어요.':''}</div>`;
   box.querySelectorAll('[data-write]').forEach(b=>b.addEventListener('click',()=>openReviewEditor(b.dataset.write)));
   box.querySelectorAll('[data-bm-search]').forEach(b=>b.addEventListener('click',e=>toggleBm(byId(b.dataset.bmSearch),e.currentTarget)));
 },300);
}
const searchBox = id => `<div class="search-box"><span aria-hidden="true">${ICON.search}</span><input type="search" id="${id}" placeholder="영화 검색하고 리뷰 남기기 (제목·장르·기분)" value="${esc(state.q || '')}" aria-label="영화 검색" autocomplete="off"><button class="search-clear" data-clear="${id}" aria-label="검색어 지우기">${ICON.close}</button></div>`;
 function refreshSearch(){ if(state.activeTab === 'browse') updateBrowse(); else if(state.activeTab === 'home') renderMovieResults($('#homeResults'), norm(state.q || '')); }
 function renderReviewTab(){
 const all=communityReviews.map(r=>({...r,seeded:true}));
 const likesKey='cinepickReviewLikes';
 const getLikes=()=>{try{return JSON.parse(localStorage.getItem(likesKey)||'{}')}catch(_){return {}}};
 const modeOptions=[['recent','최근 리뷰'],['popular','인기 리뷰'],['movie','영화 별 리뷰']];
 workspace.innerHTML=`<div class="browse-screen">
 <div class="browse-heading"><div><h2>리뷰</h2></div></div>
 <p class="browse-subtitle" id="reviewCategoryDesc">가장 최근에 등록된 감상을 먼저 만나보세요.</p>
 <div class="review-filter-row">
   <label class="review-filter-wrap"><span class="sr-only">리뷰 정렬</span><select id="reviewMode" aria-label="리뷰 필터">${modeOptions.map(([v,t])=>`<option value="${v}">${t}</option>`).join('')}</select><span class="review-filter-arrow">⌄</span></label>
   <div id="reviewMovieSearchWrap" class="review-movie-search" hidden><input id="reviewMovieSearch" type="search" placeholder="영화 제목 검색" aria-label="영화 제목 검색"></div>
 </div>
 <div class="review-list" id="reviewTabList"></div>
 <p class="review-disclaimer">영화에 대한 감상을 나누고, 마음에 드는 리뷰에 좋아요를 남겨보세요.</p>
 </div>`;
 const listEl=$('#reviewTabList'), modeEl=$('#reviewMode'), searchWrap=$('#reviewMovieSearchWrap'), searchEl=$('#reviewMovieSearch'), descEl=$('#reviewCategoryDesc');
 function card(r,currentLikes){
   const movieTitle=r.movieTitle||'미지정 영화', n=Number(currentLikes[r.id]??r.likes??0);
   return `<article class="review-card review-editorial-card"><div class="review-editorial-copy">
     <h3>${esc(r.title)}</h3><p class="review-excerpt">${esc(r.review)}</p>
     <div class="review-editorial-movie">${esc(movieTitle)}</div>
     <div class="review-meta">${esc(r.date)} · ${esc(r.user)}</div>
     <div class="review-card-actions"><button class="review-like ${currentLikes[r.id+'_on']?'liked':''}" data-like="${r.id}" type="button" aria-label="좋아요">${currentLikes[r.id+'_on']?'♥':'♡'} <span>${n}</span></button><button class="review-open-hint" data-review-id="${r.id}" type="button">리뷰 자세히 보기 →</button></div>
   </div></article>`;
 }
 function paint(){
   const mode=modeEl.value, currentLikes=getLikes();
   searchWrap.hidden=mode!=='movie';
   let rows=[];
   if(mode==='popular'){
     descEl.textContent='좋아요를 가장 많이 받은 리뷰부터 보여드립니다.';
     rows=all.filter(r=>Number(currentLikes[r.id]??r.likes??0)>=50)
       .sort((a,b)=>Number(currentLikes[b.id]??b.likes??0)-Number(currentLikes[a.id]??a.likes??0));
     listEl.innerHTML=rows.length?rows.map(r=>card(r,currentLikes)).join(''):'<div class="empty-box"><strong>아직 인기 리뷰가 없어요</strong></div>';
   }else if(mode==='movie'){
     descEl.textContent='영화 제목을 검색하거나 영화별로 모아볼 수 있습니다.';
     const q=norm(searchEl.value||'');
     rows=all.filter(r=>!q||norm(r.movieTitle||'').includes(q))
       .sort((a,b)=>(a.movieTitle||'').localeCompare(b.movieTitle||'','ko'));
     const groups=new Map();
     rows.forEach(r=>{const name=r.movieTitle||'영화 제목 미등록';if(!groups.has(name))groups.set(name,[]);groups.get(name).push(r);});
     listEl.innerHTML=groups.size?[...groups.entries()].map(([name,reviews])=>`<section class="movie-review-group"><h3 class="movie-review-group-title">${esc(name)} <span>${reviews.length}개</span></h3>${reviews.map(r=>card(r,currentLikes)).join('')}</section>`).join(''):'<div class="empty-box"><strong>검색 결과가 없어요</strong><p>다른 영화 제목으로 검색해 보세요.</p></div>';
   }else{
     descEl.textContent='가장 최근에 등록된 감상을 먼저 만나보세요.';
     rows=all.slice(0,11);
     listEl.innerHTML=rows.map(r=>card(r,currentLikes)).join('');
   }
   listEl.querySelectorAll('[data-like]').forEach(btn=>btn.addEventListener('click',()=>{
     const id=btn.dataset.like, current=getLikes(), row=all.find(r=>r.id===id);
     const wasOn=!!current[id+'_on'];
     current[id]=Math.max(0,Number(current[id]??row?.likes??0)+(wasOn?-1:1));
     current[id+'_on']=!wasOn;
     try{localStorage.setItem(likesKey,JSON.stringify(current))}catch(_){}
     paint();
   }));
   listEl.querySelectorAll('[data-review-id]').forEach(btn=>btn.addEventListener('click',()=>{
     const r=all.find(x=>x.id===btn.dataset.reviewId);if(!r)return;
     const movieTitle=r.movieTitle||'영화 제목 미등록',root=$('#modalRoot');
     root.innerHTML=`<div class="modal-backdrop" id="seedReviewBackdrop"><div class="modal" role="dialog" aria-modal="true"><button class="detail-x" id="closeSeedReview">×</button><div class="review-meta">${esc(movieTitle)}</div><h3>${esc(r.title)}</h3><div class="review-quote">${esc(r.review)}</div><p class="review-meta">${esc(r.date)} · ${esc(r.user)}</p><div class="modal-actions"><button class="btn primary" id="closeSeedReview2">닫기</button></div></div></div>`;
     const close=()=>root.innerHTML='';$('#closeSeedReview').onclick=close;$('#closeSeedReview2').onclick=close;$('#seedReviewBackdrop').addEventListener('click',e=>{if(e.target.id==='seedReviewBackdrop')close()});
   }));
 }
 modeEl.addEventListener('change',()=>{if(modeEl.value!=='movie')searchEl.value='';paint()});
 searchEl.addEventListener('input',paint);paint();
 }
 let browseApplied={q:'',genre:'',year:'',runtime:''};
function renderBrowse(){
  browseApplied={q:state.q||'',genre:'',year:'',runtime:''};
  workspace.innerHTML = `<div class="browse-screen">
  <div class="browse-filter-panel">
    <div class="browse-heading"><div><h2>영화 탐색</h2></div></div>
    <div class="browse-filter-heading"><strong>영화 필터</strong><button class="filter-reset-icon" id="resetBrowseFilters" type="button" aria-label="필터 초기화" title="필터 초기화"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 2.6-6.4L3 8"/><path d="M3 3v5h5"/></svg></button></div>
    <div class="browse-filters">
      <select id="browseGenre" aria-label="장르 필터"><option value="">전체 장르</option></select>
      <select id="browseYear" aria-label="개봉 연도 필터"><option value="">전체 연도</option></select>
      <select id="browseRuntime" aria-label="러닝타임 필터"><option value="">전체 러닝타임</option><option value="short">90분 이하</option><option value="mid">91~120분</option><option value="long">121분 이상</option><option value="unknown">정보 없음</option></select>
    </div>
    <div class="browse-filter-summary" id="filterSummary">장르, 개봉 연도, 러닝타임을 고른 뒤 ‘검색’을 눌러 주세요.</div>
    <div class="browse-search-row">${searchBox('browseQ')}<button class="browse-search-btn" id="browseSearchBtn" type="button">검색</button></div>
  </div>
  <div id="movieResults"><div class="empty-box"><strong>영화 150편을 불러오는 중…</strong><p>불러오기가 끝나면 전체 영화가 먼저 표시됩니다.</p></div></div>
  <div class="home-section-title" id="reviewHeading">사용자 리뷰</div>
  <div class="review-list" id="reviewList"></div>
  <p class="review-disclaimer">※ ‘나’ 표시가 없는 리뷰는 화면 확인용 예시입니다. 내가 쓴 리뷰는 이 브라우저에만 저장돼요.</p>
  </div>`;
  const input = $('#browseQ'); input.placeholder='영화 제목·배우·장르 검색';
  const applyBrowse = () => {
    browseApplied = {q:input.value.trim(), genre:$('#browseGenre').value, year:$('#browseYear').value, runtime:$('#browseRuntime').value};
    state.q = browseApplied.q;
    scheduleActorSearch(norm(browseApplied.q));
    updateBrowse();
  };
  const markPending = () => { const sum=$('#filterSummary'); if(sum) sum.textContent='조건이 바뀌었어요. ‘검색’을 눌러 적용해 주세요.'; };
  $('#browseSearchBtn').addEventListener('click', applyBrowse);
  input.addEventListener('keydown', e => { if(e.key==='Enter'){ e.preventDefault(); applyBrowse(); } });
  input.addEventListener('input', markPending);
  workspace.querySelector('[data-clear]').addEventListener('click', () => { input.value=''; input.focus(); applyBrowse(); });
  ['browseGenre','browseYear','browseRuntime'].forEach(id=>$('#'+id).addEventListener('change',markPending));
  $('#resetBrowseFilters').addEventListener('click',()=>{ input.value=''; ['browseGenre','browseYear','browseRuntime'].forEach(id=>$('#'+id).value=''); applyBrowse(); });
  updateBrowse();
}
function openMovieDetail(movieId){
 const m=byId(movieId); if(!m) return;
 const root=$('#modalRoot');
 const title=esc(m.title||'제목 정보 없음');
 const year=m.year!=null&&m.year!==''?esc(m.year):'연도 정보 없음', genre=esc(m.genre||'장르 정보 없음');
 const runtime=m.runtime!=null&&m.runtime!==''?`${esc(m.runtime)}분`:'상영시간 정보 없음';
 const overview=esc(m.overview||m.description||'줄거리 정보가 없습니다.');
 root.innerHTML=`<div class="modal-backdrop" data-detail-close><section class="movie-detail-modal" role="dialog" aria-modal="true" aria-label="${title} 영화 정보"><button class="detail-x" id="detailClose" aria-label="닫기">×</button><div class="movie-detail-head"><div class="movie-detail-poster">${posterHTML(m)}</div><div><h2 class="movie-detail-title">${title} ${sourceBadge(m)}</h2><div class="movie-detail-meta">${year}<br>${genre}<br>${runtime}</div></div></div><div class="movie-detail-overview">${overview}</div><div class="movie-detail-actions"><button class="btn" id="detailOTT">보러가기 · 감상 서비스</button><button class="btn" id="detailBm" type="button">${bmLabel(m)}</button><button class="btn" id="detailWriteReview">✎ 리뷰 남기기</button><button class="btn primary" id="detailConfirm">${ICON.check} 이 영화로 확정</button></div></section></div>`;
 const panel=root.querySelector('.movie-detail-modal');
 panel.addEventListener('click',e=>e.stopPropagation());
 root.querySelector('[data-detail-close]').addEventListener('click',e=>{if(e.target===e.currentTarget)root.innerHTML='';});
 root.querySelector('#detailClose').addEventListener('click',()=>root.innerHTML='');
 root.querySelector('#detailOTT').addEventListener('click',()=>openWatchModal(m));
 root.querySelector('#detailBm').addEventListener('click',e=>toggleBm(m,e.currentTarget));
root.querySelector('#detailWriteReview').addEventListener('click',()=>openReviewEditor(m.id));
 root.querySelector('#detailConfirm').addEventListener('click',()=>{root.innerHTML='';state.mood=state.mood||(Array.isArray(m.moods)&&m.moods[0])||'기분 전환';confirmMovie(m);});
 }
 function renderBrowseMovies(items, heading){
 const box=$('#movieResults'); if(!box) return;
 if(!items.length){box.innerHTML='<div class="empty-box"><strong>검색 결과가 없습니다</strong><p>다른 제목이나 장르로 검색해 보세요.</p></div>';return;}
 const mineNow=myReviews();
 box.innerHTML=`<div class="home-section-title">${esc(heading)} ${items.length}편</div><div class="browse-movie-list">${items.map(m=>{
   const has=mineNow.some(r=>r.movieId===m.id);
   const title=esc(m.title||'제목 정보 없음'), year=m.year!=null&&m.year!==''?esc(m.year):'연도 정보 없음', genre=esc(m.genre||'장르 정보 없음');
   const runtime=m.runtime!=null && m.runtime!=='' ? `${esc(m.runtime)}분` : '상영시간 정보 없음';
   const overview=esc(m.overview||m.description||'줄거리 정보가 없습니다.');
   return `<article class="browse-movie-card" aria-label="${title} 상세 정보 보기"><button class="browse-heart${bookmarks().includes(m.id)?' on':''}" data-bm-search="${esc(m.id)}" type="button" aria-label="${bookmarks().includes(m.id)?'찜 해제':'찜하기'}" title="${bookmarks().includes(m.id)?'찜 해제':'찜하기'}">${bookmarks().includes(m.id)?'♥':'♡'}</button><div class="browse-movie-poster">${posterHTML(m)}</div><div class="browse-movie-content"><h3>${title} ${sourceBadge(m)}</h3><div class="browse-movie-meta">${year} · ${genre} · ${runtime}</div><p class="browse-movie-overview">${overview}</p><div class="browse-movie-actions"><button class="btn primary" data-write="${esc(m.id)}">${has?'내 리뷰 수정':'리뷰 쓰기'}</button></div></div></article>`;
 }).join('')}</div>`;
 box.querySelectorAll('.browse-movie-card').forEach(card=>{
   card.tabIndex=0; card.setAttribute('role','button');
   card.addEventListener('click',e=>{if(e.target.closest('button'))return;openMovieDetail(card.querySelector('[data-write]')?.dataset.write);});
   card.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!e.target.closest('button')){e.preventDefault();openMovieDetail(card.querySelector('[data-write]')?.dataset.write);}});
 });
 box.querySelectorAll('[data-write]').forEach(b=>b.addEventListener('click',()=>openReviewEditor(b.dataset.write)));
 box.querySelectorAll('[data-bm-search]').forEach(b=>b.addEventListener('click',e=>toggleBm(byId(b.dataset.bmSearch),e.currentTarget)));
 }
 function updateBrowse(){
  if(!$('#movieResults')) return;
  const q=norm(browseApplied.q||'');
  const usingApi=apiMovies.length>0;
  const basePool=usingApi?apiMovies:localMovies;   // 기본 목록: API 150편 (API가 안 불러와지면 JSON 150편)
  const hasFilter=!!(q||browseApplied.genre||browseApplied.year||browseApplied.runtime);
  // 검색·필터: JSON(J) + API(A) + 배우 출연작을 합치고, 같은 영화(제목+연도)는 한 번만 표시
  const mKey=m=>norm(m.title||'')+'|'+(parseInt(m.year,10)||'');
  const seenKeys=new Set(),mergedPool=[];
  [...localMovies,...apiMovies,...(q?actorMovieCards:[])].forEach(m=>{const k=mKey(m);if(seenKeys.has(k))return;seenKeys.add(k);mergedPool.push(m);});
  const allMovies=hasFilter?mergedPool:basePool;
  const genreSel=$('#browseGenre'),yearSel=$('#browseYear');
  const genreOptions=['액션','모험','애니메이션','코미디','범죄','다큐멘터리','드라마','가족','판타지','역사','공포','음악','미스터리','로맨스','SF','TV 영화','스릴러','전쟁','서부'];
  if(genreSel && genreSel.dataset.optionsReady!=='1'){
    const old=genreSel.value;
    genreSel.innerHTML='<option value="">전체 장르</option>'+genreOptions.map(g=>`<option value="${esc(g)}">${esc(g)}</option>`).join('');
    genreSel.value=old;genreSel.dataset.optionsReady='1';
  }
  if(yearSel){
    const old=yearSel.value;
    const years=[...new Set(mergedPool.map(m=>parseInt(m.year,10)).filter(y=>Number.isFinite(y)&&y>1800&&y<2100))].sort((a,b)=>b-a);
    const fallbackYears=Array.from({length:80},(_,i)=>new Date().getFullYear()-i);
    const choices=years.length?years:fallbackYears;
    const signature=choices.join(',');
    if(yearSel.dataset.yearSignature!==signature){
      yearSel.innerHTML='<option value="">전체 연도</option>'+choices.map(y=>`<option value="${y}">${y}년</option>`).join('');
      yearSel.dataset.yearSignature=signature;
      yearSel.value=choices.includes(parseInt(old,10))?String(parseInt(old,10)):'';
    }
  }
  const {genre,year,runtime}=browseApplied;
  // 검색어: 제목·영문제목·장르 (JSON 영화는 분위기도). API 영화의 공통 문구(분위기/톤)는 제외해 엉뚱한 전체 일치를 막습니다.
  const textMatch=m=>!q||[m.title,m.en,m.genre,...(m.source==='J'&&Array.isArray(m.moods)?m.moods:[])].some(v=>v!=null&&norm(v).includes(q));
  const found=allMovies.filter(m=>{
    if(q&&!textMatch(m)&&!(m.tmdbId&&actorMatchedIds.has(Number(m.tmdbId))))return false;
    if(genre&&!String(m.genre||'').split(/[·,]/).map(x=>x.trim()).includes(genre))return false;
    if(year&&parseInt(m.year,10)!==parseInt(year,10))return false;
    const n=Number(m.runtime);
    if(runtime==='short'&&!(n>0&&n<=90))return false;
    if(runtime==='mid'&&!(n>=91&&n<=120))return false;
    if(runtime==='long'&&!(n>=121))return false;
    if(runtime==='unknown'&&n>0)return false;
    return true;
  });
  renderBrowseMovies(found,hasFilter?'검색 결과':'전체 영화');
  const sum=$('#filterSummary');
  const runtimePending=runtime&&allMovies.some(m=>m.source==='A'&&m.runtime==null);
  if(sum)sum.textContent=runtimePending?'러닝타임 정보를 아직 불러오는 중이에요. 잠시 후 다시 ‘검색’을 눌러 주세요.'
    :actorPending?`${found.length}편 일치 · 배우 출연작 검색 중…`
    :hasFilter?`${found.length}편의 영화가 조건에 맞아요.`
    :usingApi?`전체 영화 ${allMovies.length}편을 표시하고 있어요.`
    :`API를 불러오는 중이거나 연결되지 않아 JSON 영화 ${allMovies.length}편을 표시하고 있어요.`;
  const list=allReviews().filter(r=>{const m=byId(r.movieId);return m&&(!q||matchMovie(m,q));});
  const rc=$('#reviewCount'); if(rc) rc.textContent=list.length+'개 리뷰';
  const rh=$('#reviewHeading'); if(rh) rh.textContent=q?`‘${browseApplied.q}’ 감상평 ${list.length}개`:'최근 감상평 (J · JSON 예시 리뷰 포함)';
  $('#reviewList').innerHTML=list.length?list.map(r=>{const m=byId(r.movieId);return `<button class="review-card${r.mine?' mine':''}" data-review-id="${esc(r.id)}" aria-label="${esc(m.title)} 감상평 자세히 보기"><div class="review-poster">${posterHTML(m)}</div><div><h3>${esc(m.title||'제목 정보 없음')}${sourceBadge(m)}${foodBadge(m)}</h3><div class="review-meta">${r.mine?'<span class="mine-badge">나</span>':esc(r.user)+' · '}${esc(r.date)}</div><div class="review-stars">${stars(r.rating)} <span style="color:#aaa">${Number(r.rating).toFixed(1)}</span></div><p class="review-excerpt">${esc(r.title?r.title+' — ':'')}${esc(r.review)}</p><div class="review-open-hint">감상평 전체 보기 →</div></div></button>`;}).join(''):'<div class="empty-box" style="margin-top:0"><strong>아직 감상평이 없어요</strong>첫 리뷰를 남겨보세요.</div>';
  workspace.querySelectorAll('[data-review-id]').forEach(btn=>btn.addEventListener('click',()=>openReviewDetail(btn.dataset.reviewId)));
}
function openReviewEditor(movieId, after){
 const m = byId(movieId); if(!m) return;
 const old = myReviews().find(r => r.movieId === movieId);
 let rating = old ? old.rating : 0;
 const root = $('#modalRoot');
 root.innerHTML = `<div class="modal-backdrop" id="editBackdrop"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="editTitle"><div class="review-detail-top"><div class="review-detail-poster">${posterHTML(m)}</div><div><h3 id="editTitle">${esc(m.title)}</h3><div class="review-meta">${m.year||'연도 미상'} · ${esc(m.genre||'장르 정보 없음')} · ${m.runtime!=null?m.runtime+'분':'상영시간 정보 없음'}</div></div></div>
 <div class="star-input" role="radiogroup" aria-label="별점">${[1,2,3,4,5].map(n => `<button type="button" role="radio" data-star="${n}" aria-label="${n}점">${ICON.star}</button>`).join('')}<span id="starText"></span></div>
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
 root.innerHTML = `<div class="modal-backdrop" id="reviewBackdrop"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="reviewModalTitle" style="position:relative"><button class="detail-x" id="closeReviewModal" aria-label="닫기" title="닫기">×</button><div class="review-detail-top"><div class="review-detail-poster">${posterHTML(m)}</div><div><h3 id="reviewModalTitle">${esc(m.title)} ${sourceBadge(m)}</h3><div class="review-meta">${m.year||'연도 미상'} · ${esc(m.genre||'장르 정보 없음')} · ${m.runtime!=null?m.runtime+'분':'상영시간 정보 없음'}</div><div class="review-stars">${stars(r.rating)} <span style="color:#aaa">${Number(r.rating).toFixed(1)} / 5.0</span></div><div class="review-meta" style="margin-top:5px">${esc(r.user)} · ${esc(r.date)}</div></div></div>${r.title ? `<h4 style="font-size:14px;margin:0 0 9px">${esc(r.title)}</h4>` : ''}<div class="review-quote">${esc(r.review)}</div><p style="margin-top:14px;line-height:1.6">${esc(m.overview)}</p><div class="modal-actions" style="gap:8px;flex-wrap:wrap">${r.mine ? '<button class="btn danger" id="delMyReview">삭제</button><button class="btn" id="editMyReview">수정</button>' : '<button class="btn" id="writeOwn">나도 리뷰 쓰기</button>'}<button class="btn primary" id="saveReviewedMovie">${bmLabel(m)}</button></div></div></div>`;
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
 <h3 style="font-size:25px;letter-spacing:-.05em;margin:5px 0 18px">마이페이지</h3>
 <div class="profile-summary"><div class="profile-avatar">${ICON.user}</div><div><h4>나의 영화 생활</h4><p>오늘도 영화 한 편, 가볍게 골라봐요.</p></div></div>
 <div class="home-section-title">시네마 기록</div>
 <div class="lvbox"><div class="lvhead"><strong><span class="lvbadge">Lv.${L.lv}</span>${L.name}</strong><span>${L.cur} / 10</span></div><div class="cinema-progress" role="progressbar" aria-label="다음 레벨 영화 기록" aria-valuemin="0" aria-valuemax="10" aria-valuenow="${L.cur}">${Array.from({length:10},(_,i)=>`<span class="cinema-progress-segment ${i<L.cur?'filled':''}"></span>`).join('')}</div><p class="lvnote">영화 한 편을 기록할 때마다 한 칸씩 채워져요 · 다음 레벨까지 ${L.next}개</p></div>
 <div class="home-section-title">나의 영화</div><div class="home-shortcuts"><button class="home-shortcut" id="myTickets"><strong>나의 티켓북</strong><small>발권한 영화 ${t.length}편 보기 →</small></button><button class="home-shortcut" id="mySaved"><strong>찜한 영화</strong><small>저장한 영화 ${b.length}편 보기 →</small></button></div>
 <div class="profile-row"><span>서비스 안내</span><span>시네픽 프로토타입</span></div>
 <div class="profile-row"><span>저장 방식</span><span>이 브라우저에 저장</span></div>
 <button class="btn full" id="profileReset" style="margin-top:20px">영화 추천 처음부터 시작</button>
 </div>`;
 $('#profileReset').addEventListener('click', () => { state.mood=null; state.movie=null; state.activeTab='recommend'; setStep(1); });
 $('#myTickets').addEventListener('click', () => { state.activeTab='recommend'; state.step=6; state.tab='tickets'; render(); });
 $('#mySaved').addEventListener('click', () => { state.activeTab='recommend'; state.step=6; state.tab='bookmarks'; render(); });
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
 else if(state.activeTab==='review') renderReviewTab();
 else if(state.activeTab==='mypage') renderMyPage();
 else ({1:renderMood,2:renderDuration,3:renderWheel,4:renderResult,5:renderConfirmed,6:renderTicketbook,7:() => renderRecovery('all')})[state.step]();
 updateAppTabs();
 window.scrollTo(0, 0);
 }
 document.getElementById('homeLogo').addEventListener('click',(event)=>{
   event.preventDefault();
   state.activeTab='home';
   state.q='';
   state.spinning=false;
   const modalRoot=document.getElementById('modalRoot');if(modalRoot)modalRoot.innerHTML='';
   renderHome();
   updateAppTabs();
   window.scrollTo(0,0);
 });
 document.getElementById('headerSearch').addEventListener('click', () => { state.activeTab='browse'; render(); const browseInput=document.getElementById('browseQ'); if(browseInput) browseInput.focus(); });
 // 하단 탭은 항상 공통 render() 경로를 통해 화면 전체를 전환합니다.
 // 둘러보기를 누르면 커뮤니티 리뷰 목록을 즉시 렌더링합니다.
 document.querySelectorAll('[data-app-tab]').forEach(b=>b.addEventListener('click',()=>{
 const tab=b.dataset.appTab;
 state.activeTab=tab;

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
  loadPosterCache();
 render();
 loadApiCatalog().catch(err=>{
   const status=document.getElementById('datasetStatus');
   if(status) status.textContent='API 영화 로딩 실패 · JSON 150편 사용 중';
   console.warn('TMDB catalog load failed',err);
 });

 loadTMDBPosters();
})();
