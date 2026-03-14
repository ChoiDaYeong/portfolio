# PixelPusher 갤러리 대시보드

포트폴리오 갤러리를 관리하는 로컬 전용 대시보드입니다.
index.html의 works 배열을 GUI로 편집할 수 있습니다.

## 폴더 구조

```
portfolio/
├── index.html          ← 포트폴리오 메인 페이지
├── img/                ← 이미지 파일 저장 폴더
│   ├── matilda_thumb.webp
│   ├── matilda.webp
│   └── ...
└── dashboard/
    ├── server.js       ← 로컬 서버
    ├── dashboard.html  ← 대시보드 UI
    ├── package.json
    └── README.md
```

## 시작하기

1. 터미널에서 dashboard 폴더로 이동합니다.

```
cd dashboard
```

2. 서버를 실행합니다.

```
node server.js
```

3. 브라우저에서 접속합니다.

```
http://localhost:3000
```

4. 종료할 때는 터미널에서 Ctrl+C 를 누릅니다.

## 이미지 파일 관리

- 이미지는 portfolio/img/ 폴더에 저장합니다.
- 대시보드 입력란에는 파일명만 입력합니다. (경로 불필요)
- 예: `matilda_thumb.webp`

## 저장 방법

- 편집 후 반드시 우측 상단 **index.html 저장** 버튼을 눌러야 반영됩니다.
- 저장 전 변경사항은 브라우저를 닫으면 사라집니다.

## 주의사항

- 이 대시보드는 로컬에서만 동작합니다. (인터넷 연결 불필요)
- 외부에 노출되지 않도록 GitHub에 올리되, 방문자가 접근할 수 없는 환경에서만 실행하세요.
- index.html을 직접 수정하지 않고 대시보드를 통해 관리하는 것을 권장합니다.
