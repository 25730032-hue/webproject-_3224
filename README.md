# Cinepick

시네픽 영화 추천 웹앱입니다.

## 폴더 구조

```text
cinepick/
├── index.html       # 메인 HTML
├── asset/           # 이미지·기타 정적 리소스
├── css/
│   └── style.css    # 전체 스타일
├── data/
│   └── movies.js    # 기본 영화 데이터 150편
└── js/
    └── app.js       # 화면 렌더링 및 앱 기능
```

## 실행

`index.html`을 브라우저에서 열거나 GitHub Pages에 배포하면 됩니다.

영화 데이터(`data/movies.js`)를 먼저 불러온 다음 앱 코드(`js/app.js`)가 실행되도록 구성되어 있습니다.
영화 포스터와 TMDB 영화 정보는 기존 코드의 외부 API 연동을 사용합니다.
