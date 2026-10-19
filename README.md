# 시네픽 (Cinepick)

기분에 맞는 영화를 고르고 티켓북에 기록하는 영화 추천 웹 앱입니다.

## API 사용
- TMDB API의 인기 영화 목록을 불러옵니다.
- 제목, 원제, 개봉 연도, 장르, 줄거리, 포스터 이미지를 표시합니다.
- TMDB 연결에 실패하면 앱에 포함된 예시 영화 목록으로 동작합니다.

## 실행
`index.html`을 브라우저에서 열거나 GitHub Pages로 배포할 수 있습니다. 브라우저 보안 정책에 따라 로컬 파일에서 API 요청이 제한될 수 있으므로, GitHub Pages에서 테스트하는 것을 권장합니다.

## 보안 주의
현재는 브라우저에서 직접 API를 호출하는 학습용 구성이라 API 키가 소스 코드에 포함됩니다. 공개 저장소에 올릴 때는 키가 노출됩니다. 공개 배포 전에는 서버 프록시/서버리스 함수에서 키를 보관하거나, TMDB 키를 재발급하고 사용 제한을 설정하세요.

## 출처
Movie data and images are provided by The Movie Database (TMDB). This product uses the TMDB API but is not endorsed or certified by TMDB.
