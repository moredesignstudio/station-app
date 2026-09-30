// The review board: every screen in manifest.json, rendered live for the
// current app and the selected proposal, with flip / split comparison, a
// token tweak panel, contrast checks and the proposal's notes.

import { PAIRS, parseColor, runChecks } from './contrast.mjs';

const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
const isLocal = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);

const manifest = await (await fetch('manifest.json', { cache: 'no-store' })).json();
const params = new URLSearchParams(location.search);
const proposalIds = manifest.proposals.map(p => p.id);

const state = {
  proposal: proposalIds.includes(params.get('p')) ? params.get('p') : params.get('p') === 'current' ? 'current' : proposalIds[0] || 'current',
  view: params.get('view') || 'proposal',
  web: params.get('web') || 'light',
  zoom: params.get('zoom') || 'fit',
  screen: params.get('screen') || null,
  panel: params.get('panel') || null,
  motion: params.get('motion') !== 'off',
  options: {},
  tweaks: {},
};

const proposalOptions = () => (manifest.proposals.find(p => p.id === state.proposal) || {}).options || [];
function loadOptions() {
  state.options = {};
  for (const o of proposalOptions()) {
    const wanted = params.get(`o-${o.id}`);
    state.options[o.id] = o.choices.some(c => c.id === wanted) ? wanted : o.choices[0].id;
  }
}
loadOptions();

const hasProposal = () => state.proposal !== 'current';
const proposalTitle = () => manifest.proposals.find(p => p.id === state.proposal)?.title || state.proposal;
const effectiveView = () => (hasProposal() ? state.view : 'current');

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === null || value === false) continue;
    if (key.startsWith('on')) node.addEventListener(key.slice(2), value);
    else if (key === 'style') node.style.cssText = value;
    else node.setAttribute(key, value === true ? '' : value);
  }
  node.append(...children.flat().filter(c => c !== null && c !== undefined));
  return node;
}

function saveUrl() {
  const q = new URLSearchParams({ p: state.proposal, view: state.view, web: state.web });
  if (state.zoom !== 'fit') q.set('zoom', state.zoom);
  if (state.screen) q.set('screen', state.screen);
  if (state.panel) q.set('panel', state.panel);
  if (!state.motion) q.set('motion', 'off');
  for (const [k, v] of Object.entries(state.options)) q.set(`o-${k}`, v);
  history.replaceState(null, '', `?${q}`);
}

// Unsaved tweaks survive a reload of the board (per proposal, per tab).
const tweakKey = () => `design-tweaks:${state.proposal}`;
function loadTweaks() {
  try { state.tweaks = JSON.parse(sessionStorage.getItem(tweakKey()) || '{}'); } catch { state.tweaks = {}; }
}
function storeTweaks() {
  try { sessionStorage.setItem(tweakKey(), JSON.stringify(state.tweaks)); } catch { /* private mode */ }
}

function notice(html) {
  const box = $('#notice');
  box.innerHTML = html || '';
  box.hidden = !html;
}

// ————————————————————————————————— Canvas

const frames = side => $$(`.frame[data-side="${side}"] iframe`);
const firstLoaded = side => frames(side).find(f => f.contentWindow?.__design);

function frameSrc(screen, side) {
  const q = new URLSearchParams({ p: side === 'current' ? 'current' : state.proposal, web: state.web });
  if (side !== 'current') for (const [k, v] of Object.entries(state.options)) q.set(k, v);
  if (!state.motion) q.set('still', '1');
  return `${screen.file}?${q}`;
}

function renderCanvas() {
  const canvas = $('#canvas');
  canvas.replaceChildren();
  const screens = state.screen ? manifest.screens.filter(s => s.id === state.screen) : manifest.screens;
  if (state.screen) {
    canvas.append(el('p', {}, el('button', { class: 'screen-title', onclick: () => focusScreen(null) }, '← all screens')));
  }
  const sides = hasProposal() ? ['current', 'proposal'] : ['current'];
  for (const screen of screens) {
    canvas.append(el('section', { class: 'screen', 'data-id': screen.id },
      el('header', {},
        el('button', { class: 'screen-title', onclick: () => focusScreen(screen.id), title: 'Show only this screen' }, screen.title),
        el('span', { class: 'dim' }, `${screen.width} × ${screen.height}${screen.note ? ` · ${screen.note}` : ''}`),
        el('button', { class: 'replay', title: 'Replay this screen', onclick: () => replay(screen.id) }, 'replay ↻'),
        el('a', { href: frameSrc(screen, hasProposal() ? 'proposal' : 'current'), target: '_blank' }, 'open 1:1 ↗'),
      ),
      el('div', { class: 'stage', style: `--w:${screen.width};--h:${screen.height};--scale:0.5` },
        sides.map(side => el('figure', { class: 'frame', 'data-side': side },
          el('figcaption', {}, side === 'current' ? 'current app' : proposalTitle()),
          el('div', { class: 'scaler' },
            el('iframe', { src: frameSrc(screen, side), title: `${screen.title} · ${side}`, onload: event => frameLoaded(event.target, side) }),
          ),
        )),
      ),
    ));
  }
  layout();
}

function layout() {
  const canvas = $('#canvas');
  const style = getComputedStyle(canvas);
  const availW = canvas.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
  const availH = canvas.clientHeight - 90;
  const cols = effectiveView() === 'split' ? 2 : 1;
  for (const stage of $$('.stage')) {
    const w = Number(stage.style.getPropertyValue('--w'));
    const h = Number(stage.style.getPropertyValue('--h'));
    const fit = Math.min(1, (availW - (cols - 1) * 20) / (w * cols), availH / h);
    stage.style.setProperty('--scale', (state.zoom === 'fit' ? fit : Number(state.zoom)).toFixed(4));
  }
}

async function frameLoaded(iframe, side) {
  const api = iframe.contentWindow?.__design;
  if (!api) return;
  api.setWeb(state.web);
  if (side === 'proposal') api.applyTweaks(state.tweaks);
  scheduleRefresh();
  await iframe.contentDocument.fonts.ready;
  const failed = [...iframe.contentDocument.fonts].filter(f => f.status === 'error').map(f => f.family.replace(/"/g, ''));
  if (failed.length) {
    notice(`Fonts failed to load: <b>${[...new Set(failed)].join(', ')}</b>. Run <code>yarn design:pull</code> to fetch the studio fonts into <code>design/.studio</code>.`);
  }
}

function replay(id) {
  const sections = id ? $$(`.screen[data-id="${id}"]`) : $$('.screen');
  for (const s of sections) for (const f of $$('iframe', s)) f.src = f.src;
}

function setMotion(on) {
  state.motion = on;
  saveUrl();
  syncToolbar();
  for (const f of $$('iframe')) f.contentDocument?.documentElement.classList.toggle('still', !on);
  if (on) replay();
}

function renderOptions() {
  const box = $('#options');
  box.replaceChildren(...(hasProposal() ? proposalOptions() : []).map(o => {
    const select = el('select', { 'aria-label': o.title }, o.choices.map(c => el('option', { value: c.id }, c.title)));
    select.value = state.options[o.id];
    select.addEventListener('change', () => {
      state.options[o.id] = select.value;
      saveUrl();
      for (const f of frames('proposal')) f.contentWindow?.__design?.setOption(o.id, select.value);
      for (const a of $$('.screen > header a')) a.href = a.href.replace(new RegExp(`${o.id}=[\\w-]+`), `${o.id}=${select.value}`);
    });
    return el('label', {}, o.title, select);
  }));
}

function focusScreen(id) {
  state.screen = id;
  saveUrl();
  renderCanvas();
}

// ————————————————————————————————— Toolbar

function syncToolbar() {
  document.body.dataset.view = effectiveView();
  for (const b of $$('[data-view]', $('.toolbar'))) {
    b.setAttribute('aria-pressed', String(effectiveView() === b.dataset.view));
    b.disabled = !hasProposal();
  }
  for (const b of $$('[data-web]', $('.toolbar'))) b.setAttribute('aria-pressed', String(state.web === b.dataset.web));
  for (const b of $$('button[data-panel]', $('.toolbar'))) b.setAttribute('aria-pressed', String(state.panel === b.dataset.panel));
  $('#motion').setAttribute('aria-pressed', String(state.motion));
  $('#zoom').value = state.zoom;
  $('#panel').hidden = !state.panel;
  for (const s of $$('section[data-panel]', $('#panel'))) s.hidden = s.dataset.panel !== state.panel;
  layout();
}

function setView(view) {
  if (!hasProposal()) return;
  state.view = view;
  saveUrl();
  syncToolbar();
}

function setWeb(web) {
  state.web = web;
  saveUrl();
  syncToolbar();
  for (const f of $$('iframe')) f.contentWindow?.__design?.setWeb(web);
  for (const a of $$('.screen > header a')) a.href = a.href.replace(/web=\w+/, `web=${web}`);
}

function setPanel(panel) {
  state.panel = state.panel === panel ? null : panel;
  saveUrl();
  syncToolbar();
  refreshPanels();
}

function setProposal(id) {
  state.proposal = id;
  loadTweaks();
  loadOptions();
  renderOptions();
  notice('');
  saveUrl();
  syncToolbar();
  renderCanvas();
  renderNotes();
}

function initToolbar() {
  const select = $('#proposal');
  for (const p of manifest.proposals) select.append(el('option', { value: p.id }, p.title));
  select.append(el('option', { value: 'current' }, 'current app only'));
  select.value = state.proposal;
  select.addEventListener('change', () => setProposal(select.value));
  $('#motion').addEventListener('click', () => setMotion(!state.motion));
  $('#replay').addEventListener('click', () => replay());
  $('#zoom').addEventListener('change', event => { state.zoom = event.target.value; saveUrl(); layout(); });
  for (const b of $$('[data-view]', $('.toolbar'))) b.addEventListener('click', () => setView(b.dataset.view));
  for (const b of $$('[data-web]', $('.toolbar'))) b.addEventListener('click', () => setWeb(b.dataset.web));
  for (const b of $$('button[data-panel]', $('.toolbar'))) b.addEventListener('click', () => setPanel(b.dataset.panel));

  document.addEventListener('keydown', event => {
    if (event.target.closest('input, select, textarea') || event.metaKey || event.ctrlKey || event.altKey) return;
    const key = event.key.toLowerCase();
    if (key === 'c') setView(effectiveView() === 'current' ? 'proposal' : 'current');
    else if (key === 's') setView(effectiveView() === 'split' ? 'proposal' : 'split');
    else if (key === 'w') setWeb(state.web === 'light' ? 'dark' : 'light');
    else if (key === 't') setPanel('tweak');
    else if (key === 'k') setPanel('checks');
    else if (key === 'n') setPanel('notes');
    else if (key === 'm') setMotion(!state.motion);
    else if (key === 'r') replay();
    else if (key === 'escape' && state.screen) focusScreen(null);
    else return;
    event.preventDefault();
  });
  new ResizeObserver(layout).observe($('#canvas'));
}

// ————————————————————————————————— Tweak panel

const GROUP_ORDER = ['surface', 'text', 'accent', 'status', 'fill', 'border', 'radius', 'font', 'shadow'];
const COLLAPSED = new Set(['kbd', 'traffic', 'transition', 'layout']);
let tokenNames = null;
let savedValues = {};

const parseRoot = css => {
  const vars = new Map();
  for (const block of css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/:root\s*\{([^}]*)\}/g)) {
    for (const decl of block[1].split(';')) {
      const m = decl.match(/^\s*(--[\w-]+)\s*:\s*([\s\S]+?)\s*$/);
      if (m) vars.set(m[1], m[2]);
    }
  }
  return vars;
};

async function loadTokenNames() {
  const files = ['tokens/current.css', 'shared/app.css'];
  if (hasProposal()) files.push(...['tokens.css', 'components.css'].map(f => `proposals/${state.proposal}/${f}`));
  const names = new Set();
  for (const file of files) {
    const css = await fetch(file, { cache: 'no-store' }).then(r => (r.ok ? r.text() : ''));
    for (const name of parseRoot(css).keys()) names.add(name);
  }
  tokenNames = [...names];
}

function tweakCss(vars) {
  const lines = Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`);
  return `/* Saved from the review board. Fold into tokens.css once the proposal settles. */\n:root {\n${lines.join('\n')}\n}\n`;
}

async function renderTweaks() {
  const list = $('#tweak-list');
  $('#tweak-target').textContent = hasProposal() ? `· ${proposalTitle()}` : '';
  for (const b of $$('.actions button', $('section[data-panel="tweak"]'))) b.disabled = !hasProposal();
  if (!hasProposal()) {
    list.replaceChildren(el('p', { class: 'dim', style: 'padding:14px' }, 'Pick a proposal to tweak its tokens.'));
    return;
  }
  const frame = firstLoaded('proposal');
  if (!frame) return;
  await loadTokenNames();

  // Values as the proposal defines them, without this session's unsaved tweaks.
  const api = frame.contentWindow.__design;
  api.clearTweaks();
  savedValues = Object.fromEntries(tokenNames.map(name => [name, api.token(name)]));
  api.applyTweaks(state.tweaks);

  const groups = new Map();
  for (const name of tokenNames) {
    const group = name.slice(2).split('-')[0];
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(name);
  }
  const ordered = [...groups.keys()].sort((a, b) => {
    const rank = g => (GROUP_ORDER.includes(g) ? GROUP_ORDER.indexOf(g) : COLLAPSED.has(g) ? 100 : 50);
    return rank(a) - rank(b);
  });

  list.replaceChildren(...ordered.map(group => el('details', { open: !COLLAPSED.has(group) },
    el('summary', {}, group),
    groups.get(group).map(tokenRow),
  )));
  updateTweakButtons();
}

function tokenRow(name) {
  const value = state.tweaks[name] ?? savedValues[name] ?? '';
  const color = parseColor(value);
  const row = el('div', { class: `token${name in state.tweaks ? ' changed' : ''}`, 'data-name': name });
  const input = el('input', { class: 'value', value, spellcheck: 'false', 'aria-label': name });
  let timer;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => setTweak(name, input.value.trim()), 120);
  });
  let swatch = el('span');
  if (color || /gradient/.test(value)) {
    const fill = el('i', { style: `background:${value}` });
    const picker = el('input', { type: 'color', 'aria-label': `Pick ${name}` });
    if (color) picker.value = '#' + color.slice(0, 3).map(c => Math.round(c).toString(16).padStart(2, '0')).join('');
    picker.addEventListener('input', () => {
      const [r, g, b] = parseColor(picker.value);
      const alpha = parseColor(input.value)?.[3] ?? 1;
      input.value = alpha < 1 ? `rgba(${r}, ${g}, ${b}, ${alpha})` : picker.value.toUpperCase();
      setTweak(name, input.value);
    });
    swatch = el('label', { class: 'swatch', title: 'Pick a color' }, fill, color ? picker : null);
  }
  row.append(swatch, el('label', { title: name }, name), input);
  return row;
}

function setTweak(name, value) {
  if (!value || value === savedValues[name]) delete state.tweaks[name];
  else state.tweaks[name] = value;
  for (const f of frames('proposal')) f.contentWindow?.__design?.applyTweaks({ [name]: state.tweaks[name] || '' });
  storeTweaks();
  const row = $(`.token[data-name="${name}"]`);
  if (row) {
    row.classList.toggle('changed', name in state.tweaks);
    const fill = $('.swatch i', row);
    if (fill) fill.style.background = value || savedValues[name];
  }
  updateTweakButtons();
  renderChecks();
}

function updateTweakButtons() {
  const count = Object.keys(state.tweaks).length;
  $('#tweak-save').textContent = count ? `Save ${count} to proposal` : 'Save to proposal';
  $('#tweak-save').disabled = !count || !isLocal;
  $('#tweak-copy').disabled = !count;
  $('#tweak-discard').disabled = !count;
}

async function saveTweaks() {
  const file = `proposals/${state.proposal}/tweaks.css`;
  const existing = parseRoot(await fetch(file, { cache: 'no-store' }).then(r => (r.ok ? r.text() : '')));
  for (const [k, v] of Object.entries(state.tweaks)) existing.set(k, v);
  const res = await fetch(`__save/${state.proposal}/tweaks.css`, { method: 'POST', body: tweakCss(Object.fromEntries(existing)) });
  if (!res.ok) return notice(`Saving failed: ${await res.text()}`);
  state.tweaks = {};
  storeTweaks();
  // Live reload swaps in the new tweaks.css; drop the inline copies after it lands.
  setTimeout(() => {
    for (const f of frames('proposal')) f.contentWindow?.__design?.clearTweaks();
    renderTweaks();
  }, 500);
}

function initTweaks() {
  $('#tweak-save').addEventListener('click', saveTweaks);
  $('#tweak-copy').addEventListener('click', () => navigator.clipboard.writeText(tweakCss(state.tweaks)));
  $('#tweak-discard').addEventListener('click', () => {
    state.tweaks = {};
    storeTweaks();
    for (const f of frames('proposal')) f.contentWindow?.__design?.clearTweaks();
    renderTweaks();
    renderChecks();
  });
}

// ————————————————————————————————— Checks

function renderChecks() {
  const getter = side => {
    const api = firstLoaded(side)?.contentWindow.__design;
    return api ? name => api.token(name) : null;
  };
  const cur = getter('current');
  const prop = hasProposal() ? getter('proposal') : null;
  if (!cur) return;
  const a = runChecks(cur);
  const b = prop ? runChecks(prop) : null;
  const failures = (b || a).filter(r => r.pass === false).length;
  const badge = $('#checks-badge');
  badge.textContent = failures ? String(failures) : '✓';
  badge.className = `count ${failures ? 'fail' : 'pass'}`;
  if (state.panel !== 'checks') return;

  const cell = r => (r.skipped
    ? el('td', { class: 'num dim' }, 'n/a')
    : el('td', { class: `num ${r.pass ? 'pass' : 'fail'}`, title: `needs ${r.min}` }, `${r.value.toFixed(2)} ${r.pass ? '✓' : '✗'}`));
  $('#checks-list').replaceChildren(el('table', { class: 'checks' },
    el('tr', {}, el('th', {}, 'pair'), el('th', {}, 'current'), b ? el('th', {}, 'proposal') : null),
    PAIRS.map((pair, i) => el('tr', {},
      el('td', {}, pair.what, el('span', { class: 'pair' }, `${pair.fg} on ${pair.bg} · ≥ ${pair.min}`)),
      cell(a[i]),
      b ? cell(b[i]) : null,
    )),
  ));
}

// ————————————————————————————————— Notes

function markdown(src) {
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const inline = s => esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*\w])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
  const lines = src.split('\n');
  const out = [];
  let para = [];
  const flush = () => { if (para.length) out.push(`<p>${inline(para.join(' '))}</p>`); para = []; };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^```/.test(line)) {
      flush();
      const code = [];
      while (++i < lines.length && !/^```/.test(lines[i])) code.push(lines[i]);
      out.push(`<pre><code>${esc(code.join('\n'))}</code></pre>`);
    } else if (/^#{1,4}\s/.test(line)) {
      flush();
      const level = line.match(/^#+/)[0].length;
      out.push(`<h${level}>${inline(line.slice(level).trim())}</h${level}>`);
    } else if (/^\|/.test(line)) {
      flush();
      const rows = [];
      for (; i < lines.length && /^\|/.test(lines[i]); i++) rows.push(lines[i]);
      i--;
      const cells = row => row.replace(/^\||\|$/g, '').split('|').map(c => inline(c.trim()));
      const [head, , ...body] = rows;
      out.push(`<table><tr>${cells(head).map(c => `<th>${c}</th>`).join('')}</tr>${body.map(r => `<tr>${cells(r).map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`);
    } else if (/^\s*([-*]|\d+\.)\s/.test(line)) {
      flush();
      const ordered = /^\s*\d+\./.test(line);
      const items = [];
      for (; i < lines.length && /^\s*([-*]|\d+\.)\s|^\s{2,}\S/.test(lines[i]); i++) {
        if (/^\s*([-*]|\d+\.)\s/.test(lines[i])) items.push(lines[i].replace(/^\s*([-*]|\d+\.)\s/, ''));
        else items[items.length - 1] += ' ' + lines[i].trim();
      }
      i--;
      const tag = ordered ? 'ol' : 'ul';
      out.push(`<${tag}>${items.map(item => `<li>${inline(item)}</li>`).join('')}</${tag}>`);
    } else if (/^>\s?/.test(line)) {
      flush();
      out.push(`<blockquote>${inline(line.replace(/^>\s?/, ''))}</blockquote>`);
    } else if (/^---+\s*$/.test(line)) {
      flush();
      out.push('<hr>');
    } else if (!line.trim()) {
      flush();
    } else {
      para.push(line.trim());
    }
  }
  flush();
  return out.join('\n');
}

async function renderNotes() {
  const box = $('#notes');
  if (!hasProposal()) {
    box.innerHTML = '<p class="dim">No proposal selected. The screens show the app as it is in code (<code>tokens/current.css</code>).</p>';
    return;
  }
  const res = await fetch(`proposals/${state.proposal}/notes.md`, { cache: 'no-store' });
  box.innerHTML = res.ok ? markdown(await res.text()) : '<p class="dim">This proposal has no notes.md yet.</p>';
}

// ————————————————————————————————— Refresh + live reload

let refreshTimer;
function scheduleRefresh() {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(refreshPanels, 150);
}

function refreshPanels() {
  renderChecks();
  if (state.panel === 'tweak') renderTweaks();
}

if (isLocal) {
  new EventSource('__live').onmessage = event => {
    const files = JSON.parse(event.data);
    if (files.some(f => f === 'index.html' || f === 'manifest.json' || f.startsWith('shared/board') || f === 'shared/contrast.mjs')) {
      location.reload();
      return;
    }
    if (files.some(f => f.endsWith('notes.md'))) renderNotes();
    for (const f of $$('iframe')) f.contentWindow?.__design?.onChange(files);
    setTimeout(refreshPanels, 400);
  };
}

loadTweaks();
initToolbar();
renderOptions();
initTweaks();
syncToolbar();
renderCanvas();
renderNotes();
