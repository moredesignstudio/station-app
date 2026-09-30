#!/usr/bin/env node
// Design review server: serves design/ with live reload, and lets the review
// board save token tweaks back into a proposal folder.
//
//   yarn design            # http://localhost:4477
//   PORT=5000 yarn design
//
// No dependencies. Binds to 127.0.0.1 only.

import { createServer } from 'node:http';
import { readFile, writeFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import { dirname, extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const repo = resolve(root, '..');
const port = Number(process.env.PORT || 4477);

// URL prefix → folder on disk. First match wins.
const mounts = [
  ['/brand/', join(repo, 'brand')],
  ['/app-static/', join(repo, 'packages/app/src/static')],
  ['/', root],
];

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.otf': 'font/otf',
  '.ttf': 'font/ttf',
};

const clients = new Set();

function resolvePath(pathname) {
  for (const [prefix, dir] of mounts) {
    if (!pathname.startsWith(prefix)) continue;
    const file = resolve(dir, '.' + pathname.slice(prefix.length - 1));
    return file === dir || file.startsWith(dir + sep) ? file : null;
  }
  return null;
}

async function serveFile(res, pathname) {
  let file = resolvePath(pathname);
  if (!file) return send(res, 403, 'Forbidden');
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, {
      'Content-Type': types[extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(body);
  } catch {
    send(res, 404, 'Not found');
  }
}

function send(res, status, text) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(text);
}

// POST /__save/<proposal>/tweaks.css — the board's "Save" button.
async function saveTweaks(req, res, proposal) {
  const dir = join(root, 'proposals', proposal);
  try {
    if (!(await stat(dir)).isDirectory()) throw new Error();
  } catch {
    return send(res, 404, `No proposal named ${proposal}`);
  }
  let body = '';
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 64 * 1024) return send(res, 413, 'Too large');
  }
  await writeFile(join(dir, 'tweaks.css'), body);
  send(res, 200, 'Saved');
}

// Server-sent events: the top-level page listens and relays to its frames.
function live(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-store',
    Connection: 'keep-alive',
  });
  res.write('retry: 1000\n\n');
  clients.add(res);
  req.on('close', () => clients.delete(res));
}

let pending = new Set();
let timer = null;
watch(root, { recursive: true }, (_event, filename) => {
  if (!filename || filename.split(sep).some(part => part.startsWith('.') && part !== '.studio')) return;
  pending.add(filename.split(sep).join('/'));
  clearTimeout(timer);
  timer = setTimeout(() => {
    const files = [...pending];
    pending = new Set();
    for (const res of clients) res.write(`data: ${JSON.stringify(files)}\n\n`);
  }, 60);
});

const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const pathname = decodeURIComponent(url.pathname);
  if (pathname === '/__live') return live(req, res);
  const save = pathname.match(/^\/__save\/([a-z0-9-]+)\/tweaks\.css$/);
  if (save && req.method === 'POST') return saveTweaks(req, res, save[1]);
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed');
  serveFile(res, pathname);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Design review board: http://localhost:${port}/`);
});
