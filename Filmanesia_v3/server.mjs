import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), 'dist');
const port = Number(process.env.PORT || 3000);
const automationToken = process.env.ARTICLE_AUTOMATION_TOKEN;
let generationInProgress = false;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

function sendJson(response, status, payload) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(payload));
}

function isAuthorized(request, url) {
  const headerToken = request.headers['x-automation-token'];
  const queryToken = url.searchParams.get('token');
  return Boolean(automationToken) && (headerToken === automationToken || queryToken === automationToken);
}

function generateArticle(response) {
  if (generationInProgress) return sendJson(response, 409, { error: 'Article generation already in progress.' });
  generationInProgress = true;
  const child = spawn(process.execPath, ['scripts/generate-article.mjs'], {
    cwd: resolve(fileURLToPath(new URL('.', import.meta.url))),
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  let errorOutput = '';
  child.stdout.on('data', (chunk) => { output += chunk; });
  child.stderr.on('data', (chunk) => { errorOutput += chunk; });
  child.on('close', (code) => {
    generationInProgress = false;
    if (code === 0) return sendJson(response, 200, { ok: true, result: output.trim() });
    return sendJson(response, 500, { ok: false, error: errorOutput.trim() || `Generator exited with code ${code}.` });
  });
}

async function serveStatic(response, pathname) {
  const requested = pathname === '/' ? '/index.html' : pathname;
  const filePath = normalize(join(root, `.${requested}`));
  if (!filePath.startsWith(root + '\\') && filePath !== root) return sendJson(response, 403, { error: 'Forbidden' });
  try {
    const body = await readFile(filePath);
    response.writeHead(200, { 'Content-Type': mimeTypes[extname(filePath)] || 'application/octet-stream' });
    response.end(body);
  } catch {
    const index = await readFile(join(root, 'index.html'));
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(index);
  }
}

createServer((request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
  if (url.pathname === '/health') return sendJson(response, 200, { ok: true });
  if (url.pathname === '/automation/generate') {
    if (request.method !== 'GET' && request.method !== 'POST') return sendJson(response, 405, { error: 'Use GET or POST.' });
    if (!isAuthorized(request, url)) return sendJson(response, 401, { error: 'Unauthorized.' });
    return generateArticle(response);
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') return sendJson(response, 405, { error: 'Method not allowed.' });
  return serveStatic(response, url.pathname);
}).listen(port, '0.0.0.0', () => {
  console.log(`Filmanesia Node server listening on port ${port}`);
});
