/**
 * PixelPusher Dashboard Server
 * ?: node server.js
 * ?: http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Path to index.html from the dashboard folder
const INDEX_PATH = path.join(__dirname, '..', 'index.html');
const DASHBOARD_PATH = path.join(__dirname, 'dashboard.html');
const IMG_DIR = path.resolve(__dirname, '..', 'img');
const PORT = 3000;

// img/ prefix ?
function addImgPrefix(filename) {
  if (!filename) return '';
  if (filename.startsWith('img/') || filename.startsWith('http')) return filename;
  return 'img/' + filename;
}
function stripImgPrefix(str) {
  if (!str) return '';
  return str.replace(/^img\//, '');
}

// Read works from index.html and strip img/ prefixes for editing.
function readWorks() {
  const html = fs.readFileSync(INDEX_PATH, 'utf8');
  const match = html.match(/const works=(\[[\s\S]*?\n  \]);/);
  if (!match) throw new Error('Cannot find works array in index.html.');
  try {
    const arr = new Function(`return ${match[1]}`)();
    return arr.map(w => ({
      ...w,
      thumb: stripImgPrefix(w.thumb),
      image: stripImgPrefix(w.image),
    }));
  } catch(e) {
    throw new Error('works ? ?: ' + e.message);
  }
}

// Write works to index.html and add img/ prefixes for site output.
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
    throw new Error('Cannot find works array in index.html.');
  }

  fs.writeFileSync(INDEX_PATH, updated, 'utf8');
}

function readEvents() {
  const html = fs.readFileSync(INDEX_PATH, 'utf8');
  const match = html.match(/const events=(\[[\s\S]*?\n  \]);/);
  if (!match) throw new Error('index.html events    .');
  try {
    const arr = new Function(`return ${match[1]}`)();
    return arr.map(event => ({
      ...event,
      previewImage: stripImgPrefix(event.previewImage),
      infoImage: stripImgPrefix(event.infoImage),
    }));
  } catch(e) {
    throw new Error('events  : ' + e.message);
  }
}

function writeEvents(events) {
  const html = fs.readFileSync(INDEX_PATH, 'utf8');
  const eventsStr = 'const events=[\n' + events.map(event => {
    const previewImage = addImgPrefix(event.previewImage);
    const infoImage = addImgPrefix(event.infoImage);
    return `    {\n      title:${JSON.stringify(event.title||'')},\n      startDate:${JSON.stringify(event.startDate||'')},\n      endDate:${JSON.stringify(event.endDate||'')},\n      titleUrl:${JSON.stringify(event.titleUrl||'')},\n      venue:${JSON.stringify(event.venue||'')},\n      booth:${JSON.stringify(event.booth||'')},\n      items:${JSON.stringify(event.items||'')},\n      salesStatusText:${JSON.stringify(event.salesStatusText||'')},\n      shopButtonLabel:${JSON.stringify(event.shopButtonLabel||'')},\n      shopAvailable:${event.shopAvailable?'true':'false'},\n      shopUrl:${JSON.stringify(event.shopUrl||'')},\n      previewImage:${JSON.stringify(previewImage)},\n      infoImage:${JSON.stringify(infoImage)},\n      thumbnailUrl:${JSON.stringify(event.thumbnailUrl||'')},\n      note:${JSON.stringify(event.note||'')},\n      noticeUrl:${JSON.stringify(event.noticeUrl||'')}\n    }`;
  }).join(',\n') + ',\n  ]';
  const updated = html.replace(/const events=\[[\s\S]*?\n  \];/, eventsStr + ';');
  if (updated === html) throw new Error('events    .');
  fs.writeFileSync(INDEX_PATH, updated, 'utf8');
}
// Type labels used by the dashboard.
const TYPE_LABEL = {
  'illustration': 'Original Artwork',
  'uiux': 'UI/UX Design',
  'graphic': 'Graphic Design'
};

// Default colors by type.
const TYPE_COLOR = {
  'illustration': '#e8e4ec',
  'uiux': '#e4eaee',
  'graphic': '#eee8e4'
};

const server = http.createServer((req, res) => {
  // CORS ? ( ?)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200); res.end(); return;
  }

  if (req.method === 'GET' && req.url.startsWith('/img/')) {
    const pathname = new URL(req.url, `http://localhost:${PORT}`).pathname;
    const filename = decodeURIComponent(pathname.replace(/^\/img\//, ''));
    const filePath = path.resolve(IMG_DIR, filename);
    const relative = path.relative(IMG_DIR, filePath);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      res.writeHead(403); res.end('Forbidden'); return;
    }
    try {
      const ext = path.extname(filePath).toLowerCase();
      const type = ext === '.webp' ? 'image/webp'
        : ext === '.png' ? 'image/png'
        : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg'
        : ext === '.svg' ? 'image/svg+xml'
        : 'application/octet-stream';
      const data = fs.readFileSync(filePath);
      res.writeHead(200, {'Content-Type': type});
      res.end(data);
    } catch(e) {
      res.writeHead(404); res.end('Image not found');
    }
    return;
  }

  // GET / dashboard HTML
  if (req.method === 'GET' && req.url === '/') {
    try {
      const html = fs.readFileSync(DASHBOARD_PATH, 'utf8');
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      res.end(html);
    } catch(e) {
      res.writeHead(500); res.end('Cannot find dashboard.html.');
    }
    return;
  }

  // GET /api/works
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

  if (req.method === 'GET' && req.url === '/api/events') {
    try {
      const events = readEvents();
      res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
      res.end(JSON.stringify({ok: true, events}));
    } catch(e) {
      res.writeHead(500, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({ok: false, error: e.message}));
    }
    return;
  }

  // POST /api/works
  if (req.method === 'POST' && req.url === '/api/works') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const {works} = JSON.parse(body);
        if (!Array.isArray(works)) throw new Error('works must be an array.');
        writeWorks(works);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ok: true}));
        console.log(`[saved] works ${works.length}`);
      } catch(e) {
        console.error('[save error]', e.message);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ok: false, error: e.message}));
      }
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/api/events') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const {events} = JSON.parse(body);
        if (!Array.isArray(events)) throw new Error('events  .');
        writeEvents(events);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ok: true}));
        console.log(`[ ]  ${events.length}`);
      } catch(e) {
        console.error('[ ]', e.message);
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
  console.log('  PixelPusher dashboard started.');
  console.log(`  Open http://localhost:${PORT} in your browser.`);
  console.log('');
  console.log(`  index.html : ${INDEX_PATH}`);
  console.log('');
  console.log('  Press Ctrl+C to stop.');
  console.log('');
});


