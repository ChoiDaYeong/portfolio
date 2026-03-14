/**
 * PixelPusher Dashboard Server
 * 실행: node server.js
 * 접속: http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// index.html 경로 (dashboard 폴더의 상위 폴더)
const INDEX_PATH = path.join(__dirname, '..', 'index.html');
const DASHBOARD_PATH = path.join(__dirname, 'dashboard.html');
const PORT = 3000;

// img/ prefix 헬퍼
function addImgPrefix(filename) {
  if (!filename) return '';
  if (filename.startsWith('img/') || filename.startsWith('http')) return filename;
  return 'img/' + filename;
}
function stripImgPrefix(str) {
  if (!str) return '';
  return str.replace(/^img\//, '');
}

// works 배열을 index.html에서 파싱 (thumb/image의 img/ prefix 제거해서 반환)
function readWorks() {
  const html = fs.readFileSync(INDEX_PATH, 'utf8');
  const match = html.match(/const works=(\[[\s\S]*?\n  \]);/);
  if (!match) throw new Error('index.html에서 works 배열을 찾을 수 없습니다.');
  try {
    const arr = new Function(`return ${match[1]}`)();
    return arr.map(w => ({
      ...w,
      thumb: stripImgPrefix(w.thumb),
      image: stripImgPrefix(w.image),
    }));
  } catch(e) {
    throw new Error('works 파싱 실패: ' + e.message);
  }
}

// works 배열을 index.html에 저장 (thumb/image에 img/ prefix 자동 추가)
function writeWorks(works) {
  const html = fs.readFileSync(INDEX_PATH, 'utf8');

  const worksStr = 'const works=[\n' + works.map(w => {
    const tags = w.shopUrl ? '["able-shop"]' : '[]';
    const thumb = addImgPrefix(w.thumb);
    const image = addImgPrefix(w.image);
    return `    {title:${JSON.stringify(w.title)},sub:${JSON.stringify(w.sub)},year:${JSON.stringify(w.year)},type:${JSON.stringify(w.type)},color:${JSON.stringify(w.color)},\n     thumb:${JSON.stringify(thumb)},image:${JSON.stringify(image)},tags:${tags},shopUrl:${JSON.stringify(w.shopUrl||'')},\n     desc:${JSON.stringify(w.desc||'')}}`;
  }).join(',\n') + ',\n  ]';

  const updated = html.replace(/const works=\[[\s\S]*?\n  \];/, worksStr + ';');

  if (updated === html) {
    throw new Error('works 배열을 찾을 수 없습니다. index.html 구조를 확인해주세요.');
  }

  fs.writeFileSync(INDEX_PATH, updated, 'utf8');
}

// slideData 파싱 (img/ prefix 제거)
function readSlides() {
  const html = fs.readFileSync(INDEX_PATH, 'utf8');
  const match = html.match(/const slideData=(\[[\s\S]*?\]);/);
  if (!match) throw new Error('slideData를 찾을 수 없습니다.');
  try {
    const arr = new Function(`return ${match[1]}`)();
    return arr.map(s => ({
      ...s,
      image: stripImgPrefix(s.image),
    }));
  } catch(e) {
    throw new Error('slideData 파싱 실패: ' + e.message);
  }
}

// slideData 저장 (img/ prefix 자동 추가)
function writeSlides(slides) {
  const html = fs.readFileSync(INDEX_PATH, 'utf8');
  const slidesStr = 'const slideData=[\n' + slides.map(s => {
    const image = addImgPrefix(s.image);
    return `    {image:${JSON.stringify(image)},color:${JSON.stringify(s.color||'#ede8e0')}}`;
  }).join(',\n') + ',\n  ]';
  const updated = html.replace(/const slideData=\[[\s\S]*?\];/, slidesStr + ';');
  if (updated === html) throw new Error('slideData를 찾을 수 없습니다.');
  fs.writeFileSync(INDEX_PATH, updated, 'utf8');
}
// 카테고리 타입 → 라벨 매핑
const TYPE_LABEL = {
  'illustration': 'Original Artwork',
  'uiux': 'UI/UX Design',
  'graphic': 'Graphic Design'
};

// 기본 배경색 (카테고리별)
const TYPE_COLOR = {
  'illustration': '#e8e4ec',
  'uiux': '#e4eaee',
  'graphic': '#eee8e4'
};

const server = http.createServer((req, res) => {
  // CORS 허용 (로컬 전용)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200); res.end(); return;
  }

  // GET /  → 대시보드 HTML 반환
  if (req.method === 'GET' && req.url === '/') {
    try {
      const html = fs.readFileSync(DASHBOARD_PATH, 'utf8');
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      res.end(html);
    } catch(e) {
      res.writeHead(500); res.end('dashboard.html을 찾을 수 없습니다.');
    }
    return;
  }

  // GET /api/works  → 현재 works 배열 반환
  if (req.method === 'GET' && req.url === '/api/works') {
    try {
      const works = readWorks();
      res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
      res.end(JSON.stringify({ok: true, works}));
    } catch(e) {
      res.writeHead(500, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({ok: false, error: e.message}));
    }
    return;
  }

  // GET /api/slides  → 현재 slideData 반환
  if (req.method === 'GET' && req.url === '/api/slides') {
    try {
      const slides = readSlides();
      res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
      res.end(JSON.stringify({ok: true, slides}));
    } catch(e) {
      res.writeHead(500, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({ok: false, error: e.message}));
    }
    return;
  }

  // POST /api/works  → works 배열 저장
  if (req.method === 'POST' && req.url === '/api/works') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const {works} = JSON.parse(body);
        if (!Array.isArray(works)) throw new Error('works가 배열이 아닙니다.');
        writeWorks(works);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ok: true}));
        console.log(`[저장 완료] 갤러리 ${works.length}개 작품`);
      } catch(e) {
        console.error('[저장 오류]', e.message);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ok: false, error: e.message}));
      }
    });
    return;
  }

  // POST /api/slides  → slideData 저장
  if (req.method === 'POST' && req.url === '/api/slides') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const {slides} = JSON.parse(body);
        if (!Array.isArray(slides)) throw new Error('slides가 배열이 아닙니다.');
        writeSlides(slides);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ok: true}));
        console.log(`[저장 완료] 캐러셀 ${slides.length}개 슬라이드`);
      } catch(e) {
        console.error('[저장 오류]', e.message);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ok: false, error: e.message}));
      }
    });
    return;
  }

  res.writeHead(404); res.end('Not found');
});

server.listen(PORT, () => {
  console.log('');
  console.log('  PixelPusher 대시보드가 시작되었습니다.');
  console.log(`  브라우저에서 http://localhost:${PORT} 를 열어주세요.`);
  console.log('');
  console.log(`  index.html 경로: ${INDEX_PATH}`);
  console.log('');
  console.log('  종료하려면 Ctrl+C 를 누르세요.');
  console.log('');
});
