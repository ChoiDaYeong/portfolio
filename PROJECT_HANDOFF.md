# PixelPusher Portfolio 작업 맥락 정리

이 문서는 새 Codex 채팅에서 바로 이어 작업할 수 있도록 현재 사이트 구조, 주요 의사결정, 수정 이력, 검증 방법을 정리한 인수인계 메모입니다.

## 프로젝트 개요

- 작업 폴더: `H:\Homepage`
- 메인 페이지: `index.html`
- 로컬 대시보드: `dashboard/dashboard.html`
- 대시보드 서버: `dashboard/server.js`
- 이미지 폴더: `img/`
- 배포 방식: 정적 사이트, GitHub Pages 사용 예정
- 사이트 언어: 국문 사이트. 사용자-facing 문구는 한국어를 유지해야 함.

## 사이트 목적

이 포트폴리오 사이트는 B2C와 B2B 방문자를 한 페이지에서 모두 받는 것이 목적입니다.

- B2C 방문자: 좋아하는 작가의 최신 행사 참가 정보, 굿즈/통판 여부, SNS 링크, 작품 이미지를 빠르게 확인
- B2B 방문자: 외주 문의, 협업 제안, 굿즈 입점 제안, 연락 방법을 빠르게 확인

첫 화면 또는 짧은 스크롤 안에서 최근 행사 정보와 대표 작업물이 드러나는 방향으로 설계했습니다.

## 현재 랜딩 페이지 구조

초기 캐러셀 중심 구조에서 12-grid 랜딩 구조로 변경했습니다.

- `#landing`
  - 좌측 `landing-info`: 3칸
    - 로고
    - 주요 링크 버튼
  - 우측 `landing-gallery`: 9칸
    - 대표 작업물 썸네일 그리드
    - 클릭 시 라이트박스 열림

모바일에서는:

- 랜딩 정보 영역과 갤러리가 세로로 쌓임
- 갤러리는 2열 2행으로 대표 4개만 표시
- `landing-links` 버튼은 1024px 이하에서 100% 폭

중간 Gallery 섹션은 현재 비활성화/제거된 상태입니다. 갤러리 기능 자체는 랜딩 갤러리와 라이트박스로 흡수했습니다.

## Events 섹션 구조

Events 섹션은 최신 행사 정보를 빠르게 보여주는 것이 목표입니다.

현재 기본 설계:

- 다음 행사 예정 정보가 없으면 2열
  - 행사 정보 텍스트
  - 행사 썸네일/공지 링크
- 다음 행사 예정 정보가 있으면 3열
  - 행사 정보 텍스트
  - 썸네일/공지 링크
  - Next Schedule

주요 필드:

- 행사 이름
- 행사 기간
- 제목 링크
- 장소
- ITEMS
- STATUS
- 구매하기 버튼 활성화 여부
- 구매하기 링크
- 썸네일
- 썸네일 링크

Venue와 Booth는 분리하지 않고 Venue에 합쳐서 표기합니다.
예: `KINTEX (부스 A-12)`

Status는 버튼보다 정보 설명에 집중합니다.

- 예: `현장 판매 후 통판 예정`
- 예: `통판 진행 중 (~26. 7. 31.)`

버튼은 상태에 따라 바뀝니다.

- disabled 상태: `통판 예정`
- available 상태: `구매하기`

행사 썸네일은 갤러리 오버레이가 아니라 링크 이동을 우선합니다. 보통 인스타 공지로 이동하는 흐름을 상정했습니다.

## Contact 섹션 문구

국문 유지가 중요합니다.

상단 문구:

```html
외주 문의, 협업·굿즈 입점 제안을 편하게 보내주세요.
혹은 <a>메일 주소를 직접 복사</a>해서 보내셔도 됩니다.
확인 후 가능한 범위와 일정에 대해 답변드립니다.
```

폼 placeholder:

- 성함: `개인 또는 회사명을 작성해주세요.`
- 납기 기한: `없을 경우 비워주세요.`
- 내용: `작업 종류, 사용처, 예산 범위가 정해져 있다면 함께 알려주세요.`

Contact 하단 `contact-links`:

- 데스크톱에서는 4개 버튼이 한 줄에 동일한 폭으로 표시
- 모바일에서는 1열로 쌓이도록 수정됨
- 관련 CSS:
  - 전역: `#contact-links .links-row{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));...}`
  - 모바일: `#contact-links .links-row{grid-template-columns:1fr;}`

## 버튼 디자인 규칙

버튼 hover 디자인은 `.form-submit` 기준으로 통일했습니다.

공통 방향:

- 글자 크기: `0.8em`
- padding 기준: `12px 28px`
- hover:
  - background: `var(--accent)`
  - border-color: `var(--accent)`
  - color: `var(--bg)`
- transition:
  - border-color `0.3s`
  - background-color `0.6s`
  - color `0.3s`

단, `contact-links` 버튼은 4열 한 줄 유지를 위해 padding을 `12px 0`으로 조정했습니다.

## 라이트박스

랜딩 갤러리 작업물을 클릭하면 라이트박스가 열립니다.

주요 변경:

- 이전/다음 아이콘은 원형 화살표 SVG 심볼 사용
- `.lb-img-wrap` width는 `auto`
- `.lb-nav` 배경과 border 제거
- `.lb-nav svg`는 `36px x 36px`
- 모바일에서는 nav 버튼 숨김

## 대시보드 구조

로컬 대시보드는 `dashboard/server.js`를 실행해서 사용합니다.

```powershell
node dashboard/server.js
```

이후 브라우저에서:

```text
http://localhost:3000/dashboard/
```

대시보드 목적:

- 랜딩 갤러리용 works 데이터 수정
- 이벤트 데이터 수정
- 이미지 경로 미리보기
- 저장 시 `index.html` 안의 데이터 배열을 갱신

현재 대시보드는 별도 JSON 파일이 아니라 `index.html` 내부의 JS 배열을 읽고 씁니다.

- `const works=[ ... ];`
- `const events=[ ... ];`

서버 API:

- `GET /api/works`
- `POST /api/works`
- `GET /api/events`
- `POST /api/events`
- `/img/...` 정적 이미지 서빙

주의:

- `dashboard/server.js`는 정규식으로 `index.html` 안의 `works/events` 배열을 찾아 교체합니다.
- 따라서 배열 선언 형태가 크게 바뀌면 대시보드 저장이 깨질 수 있습니다.
- 비정기 업데이트용 개인 포트폴리오라면 이 구조는 유지해도 충분히 합리적입니다.
- 개선한다면 백업 파일 생성보다 저장 전후 검증을 추가하는 쪽이 더 낫습니다. Git으로 revert 가능하므로 `index.html.bak` 같은 파일은 만들 필요가 없습니다.

## 권장 검증 방식

작업 후 최소 검증:

```powershell
node -e "const fs=require('fs'); const html=fs.readFileSync('index.html','utf8'); const script=html.match(/<script>([\s\S]*)<\/script>/)?.[1]||''; new Function(script); console.log('script ok');"
```

대시보드 서버 문법 검증:

```powershell
node --check dashboard/server.js
```

대시보드 HTML 스크립트 검증:

```powershell
node -e "const fs=require('fs'); const html=fs.readFileSync('dashboard/dashboard.html','utf8'); const script=html.match(/<script>([\s\S]*)<\/script>/)?.[1]||''; new Function(script); console.log('dashboard script ok');"
```

로컬 API 확인:

```powershell
node dashboard/server.js
```

다른 터미널에서:

```powershell
Invoke-WebRequest -Uri 'http://localhost:3000/api/works' -UseBasicParsing
Invoke-WebRequest -Uri 'http://localhost:3000/api/events' -UseBasicParsing
Invoke-WebRequest -Uri 'http://localhost:3000/img/01.webp' -UseBasicParsing
```

## 인코딩 주의

이 프로젝트는 한국어 텍스트가 많습니다.

PowerShell `Get-Content` 출력에서 한글이 깨져 보일 수 있습니다. 이 현상만으로 파일이 실제로 깨졌다고 판단하면 안 됩니다.

권장:

- 실제 파일은 UTF-8 기준으로 읽기
- Node `fs.readFileSync(path, 'utf8')`로 확인
- 브라우저 화면으로 최종 확인
- 한글 문구를 수정할 때는 PowerShell here-string으로 쓰지 말고 `apply_patch`를 사용

이전 작업 중 Contact 문구가 영어로 바뀐 적이 있었고, 사용자가 강하게 문제를 지적했습니다. 국문 사이트라는 점을 항상 우선해야 합니다.

## 현재 작업 직전/직후 상태

가장 최근 수정:

- `index.html`
  - 모바일 해상도에서 `comm-center` 하위 `#contact-links .links-row`가 4열로 유지되던 문제 수정
  - `@media(max-width:640px)` 안에 `#contact-links .links-row{grid-template-columns:1fr;}` 추가

현재 `git status --short` 기준으로는 이 수정 때문에 `index.html`이 변경 상태일 수 있습니다.

## 다음에 해볼 만한 개선

필수는 아니지만, 구조 안정성을 더 올리고 싶다면 다음 정도가 적절합니다.

1. 대시보드 저장 전 검증
   - `const works`와 `const events`를 찾지 못하면 저장 중단
   - 저장 전후 항목 개수 비교

2. 저장 후 검증
   - `index.html` 내부 `<script>`를 `new Function()`으로 파싱
   - `/api/works`, `/api/events` 재호출 성공 여부 확인

3. 대시보드 오류 메시지 개선
   - 저장 실패 시 “어느 배열을 찾지 못했는지” 표시
   - 이미지 미리보기 실패 시 실제 요청 경로 표시

4. 데이터 분리 검토
   - 업데이트가 잦아지면 `data/works.json`, `data/events.json`로 분리 가능
   - 현재처럼 비정기 업데이트라면 굳이 분리하지 않아도 됨

## 작업 시 성향 메모

- 사용자는 시각적 레이아웃과 실제 방문자 관점의 사용성을 중요하게 봅니다.
- “기술적으로 더 깔끔함”보다 “운영할 때 부담이 없는가”가 중요합니다.
- 불필요한 백업 파일, 과한 구조 변경, 영어 문구 전환은 피해야 합니다.
- 변경 후에는 데스크톱/모바일 레이아웃이 실제로 의도대로 보이는지 확인하는 것이 좋습니다.
