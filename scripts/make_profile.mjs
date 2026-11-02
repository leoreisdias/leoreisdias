import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as icons from 'simple-icons';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, '..', 'assets', 'profile');
mkdirSync(outDir, { recursive: true });

const fontData = (path) => readFileSync(join(here, 'node_modules', path)).toString('base64');
const vt323 = fontData('@fontsource/vt323/files/vt323-latin-400-normal.woff2');
const pressStart = fontData('@fontsource/press-start-2p/files/press-start-2p-latin-400-normal.woff2');

const INK = '#141238';
const PAPER = '#f6efe0';
const GOLD = '#ffcc4d';
const PINK = '#ff8fb3';
const MINT = '#6fe3b4';

const VT_ADVANCE = 0.4;
const DIALOG_FONT = 30;
const CHAR_WIDTH = DIALOG_FONT * VT_ADVANCE;

const esc = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function seeded(seed) {
  let state = seed;

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function pct(seconds, total) {
  return `${((seconds / total) * 100).toFixed(3)}%`;
}

function pixels(grid, palette, x, y, size) {
  const byColor = new Map();

  grid.forEach((row, rowIndex) => {
    let col = 0;

    while (col < row.length) {
      const key = row[col];
      let end = col + 1;

      while (end < row.length && row[end] === key) end += 1;

      if (palette[key]) {
        const segment = `M${x + col * size} ${y + rowIndex * size}h${(end - col) * size}v${size}h-${(end - col) * size}z`;
        byColor.set(palette[key], (byColor.get(palette[key]) ?? '') + segment);
      }

      col = end;
    }
  });

  return [...byColor].map(([fill, d]) => `<path fill="${fill}" d="${d}"/>`).join('');
}

function svg({ width, height, label, css = '', body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(label)}"><title>${esc(label)}</title><style>@font-face{font-family:PS;src:url(data:font/woff2;base64,${pressStart}) format('woff2')}@font-face{font-family:VT;src:url(data:font/woff2;base64,${vt323}) format('woff2')}path,rect,polygon{shape-rendering:crispEdges}text{white-space:pre}.ps{font-family:PS,ui-monospace,Menlo,monospace}.vt{font-family:VT,ui-monospace,Menlo,monospace}@keyframes bl{50%{opacity:0}}.bl{animation:bl 1s steps(1) infinite}${css}@media (prefers-reduced-motion:reduce){*{animation:none!important}}</style>${body}</svg>`;
}

function write(name, content) {
  writeFileSync(join(outDir, name), content);
  console.log(`${name.padEnd(32)} ${(content.length / 1024).toFixed(1)} KB`);
}

const SKIN = { S: '#efbd94', s: '#d3946b' };
const HERO_PALETTE = {
  ...SKIN,
  H: '#2b1a15',
  h: '#553325',
  B: '#3a241c',
  E: '#17102a',
  T: '#4b5163',
  t: '#363b4b',
  P: '#2c3d73',
  F: '#f4efe6',
  L: GOLD,
  l: '#d9962c',
};

const HERO_TOP = [
  '....HHHHHHHH....',
  '...HHHHHHHHHH...',
  '..HHHhhHHHHHHH..',
  '..HHhHHSSSSSSH..',
  '..HHHHSSSSSSSS..',
  '..HHHSSSESSESS..',
  '..HHHSSSESSESS..',
  '..HHHSSSSSSSSs..',
  '..HHHSBSSSSSBS..',
  '..HHHSBBBBBBBB..',
  '..HHH.BBBBBBB...',
  '..HH...BBBBB....',
  '....TTTTTTTT....',
  '...TTTTTTSSLLL..',
  '...tTTTTTSSLlL..',
  '...tTTTTTTTLLL..',
  '....TTTTTTT.....',
  '....PPPPPPP.....',
];
const HERO_STEP_A = [...HERO_TOP, '...PPP..PPP.....', '..FFF....FFF....'];
const HERO_STEP_B = [...HERO_TOP, '.....PPPPP......', '.....FFFFF......'];

const KUMO_PALETTE = { W: '#ffffff', w: '#cfd0ff', E: '#2a1f5c', C: '#ff9db8' };
const KUMO = [
  '.....WWWW.....',
  '..WWWWWWWWW...',
  '.WWWWWWWWWWWW.',
  'WWWEWWWWWEWWWW',
  'WWWEWWWWWEWWWW',
  'WCCWWWEEWWWCCW',
  '.WWWWWWWWWWWw.',
  '..wwwWWWwwww..',
];

const FACE = [
  '....HHHHHHHH....',
  '..HHHHHHHHHHHH..',
  '.HHHHhhHHHHHHHH.',
  '.HHhHSSSSSSSHHH.',
  'HHHSSSSSSSSSSHHH',
  'HHHSSSSSSSSSSHHH',
  'HHHSEESSSSEESHHH',
  'HHHSEESSSSEESHHH',
  'HHHSSSSssSSSSHHH',
  'HHHSSSSssSSSSHHH',
  'HHHBSSSSSSSSBHHH',
  'HHHBBBBBBBBBBHHH',
  'HHHBBBBBBBBBBHHH',
  'HH.BBBBBBBBBB.HH',
  'H...BBBBBBBB...H',
  '...TTTTTTTTTT...',
];

const BUG_PALETTE = { R: '#ff5a5f', r: '#b02a4a', K: '#20163f', E: '#ffffff' };
const BUG_A = ['...KK.KK...', '..RRRRRRR..', '.RrRRrRRrR.', 'ERERRRRRRRK', '.RRrRRrRRR.', '..K.K.K.K..'];
const BUG_B = ['...KK.KK...', '..RRRRRRR..', '.RrRRrRRrR.', 'ERERRRRRRRK', '.RRrRRrRRR.', '.K.K.K.K...'];

function heightPath(width, base, waves, step, bottom) {
  const columns = Math.ceil(width / step);
  let d = '';

  for (let col = 0; col < columns; col += 1) {
    const phase = (col / columns) * Math.PI * 2;
    const offset = waves.reduce((sum, [amp, freq, shift]) => sum + amp * Math.sin(phase * freq + shift), 0);
    const y = Math.round((base + offset) / step) * step;
    d += `M${col * step} ${y}h${step}V${bottom}h-${step}z`;
  }

  return d;
}

function looped(content, width, cssClass) {
  return `<g class="${cssClass}"><g>${content}</g><g transform="translate(${width} 0)">${content}</g></g>`;
}

function worldTree(cx, baseY) {
  const random = seeded(7);
  const cell = 4;
  const blobs = [
    [0, -112, 54],
    [-44, -86, 40],
    [44, -86, 40],
    [-26, -132, 34],
    [28, -134, 32],
    [-74, -70, 26],
    [74, -70, 26],
  ];
  const shades = ['#ffd3e1', '#ffb0cb', '#ff8fb3', '#e4689b', '#b84a8c'];
  const byColor = new Map();

  for (let gy = -180; gy < -36; gy += cell) {
    for (let gx = -108; gx < 108; gx += cell) {
      const inside = blobs.some(([bx, by, r]) => (gx - bx) ** 2 + (gy - by) ** 2 < r ** 2 * (0.9 + random() * 0.14));

      if (!inside) continue;

      const light = (gx * 0.45 - gy * 0.6 - 62) / 62 + (random() - 0.5) * 0.5;
      const shade = shades[Math.max(0, Math.min(4, Math.round(2 - light * 1.6)))];
      byColor.set(shade, (byColor.get(shade) ?? '') + `M${cx + gx} ${baseY + gy}h${cell}v${cell}h-${cell}z`);
    }
  }

  const crown = [...byColor].map(([fill, d]) => `<path fill="${fill}" d="${d}"/>`).join('');
  const bark = '#3d2348';
  const barkLight = '#5f3660';
  const trunk =
    `<path fill="${bark}" d="M${cx - 12} ${baseY - 70}h24v70h12v8h-48v-8h12z"/>` +
    `<path fill="${bark}" d="M${cx - 44} ${baseY - 76}h8v4h8v4h8v4h8v8h-8v-4h-8v-4h-8v-4h-8zM${cx + 36} ${baseY - 76}h8v8h-8v4h-8v4h-8v4h-8v-8h8v-4h8v-4h8z"/>` +
    `<path fill="${barkLight}" d="M${cx + 4} ${baseY - 66}h6v62h-6z"/>`;

  return trunk + crown;
}

function smallTree(x, y, color) {
  return `<path fill="#2a1c45" d="M${x + 12} ${y + 28}h8v16h-8z"/><path fill="${color}" d="M${x + 8} ${y}h16v4h4v4h4v16h-4v4h-24v-4h-4v-16h4v-4h4z"/>`;
}

function buildHero() {
  const W = 846;
  const H = 452;
  const SCENE = 304;
  const GROUND = 264;
  const SPRITE_X = 216;
  const SPRITE_SCALE = 4;
  const SPRITE_Y = GROUND - 20 * SPRITE_SCALE + 4;
  const WORLD = 20;
  const WALK = 10;
  const SPEED = W / WALK;
  const random = seeded(99);

  const bands = ['#1a1342', '#27185a', '#3f1f74', '#6a2a80', '#a43a7f', '#de586f', '#f98e5e', '#ffc06a'];
  const sky = bands
    .map((color, index) => `<rect y="${index * 34}" width="${W}" height="${index === bands.length - 1 ? SCENE : 34}" fill="${color}"/>`)
    .join('');

  let stars = '';
  for (let index = 0; index < 46; index += 1) {
    const x = Math.round((random() * W) / 4) * 4;
    const y = Math.round((random() * 130) / 4) * 4;
    const size = random() > 0.8 ? 4 : 2;
    stars += `<rect class="tw" x="${x}" y="${y}" width="${size}" height="${size}" fill="#fff" style="animation-delay:-${(random() * 3).toFixed(2)}s"/>`;
  }

  const sunCx = 612;
  const sunCy = 196;
  let sunD = '';
  let glowD = '';
  for (let gy = -76; gy <= 76; gy += 4) {
    for (let gx = -76; gx <= 76; gx += 4) {
      const distance = Math.hypot(gx, gy);
      if (distance < 48) sunD += `M${sunCx + gx} ${sunCy + gy}h4v4h-4z`;
      else if (distance < 66) glowD += `M${sunCx + gx} ${sunCy + gy}h4v4h-4z`;
    }
  }
  const sun = `<path class="glow" fill="#ffe29a" opacity=".35" d="${glowD}"/><path fill="#fff1bd" d="${sunD}"/>`;

  const cloudGrid = ['....WWWW........', '..WWWWWWWW.WWW..', '.WWWWWWWWWWWWWW.', 'WWWWWWWWWWWWWWWW', '.wwwwwwwwwwwwww.'];
  const cloudsFar = [
    [40, 62],
    [300, 134],
    [560, 58],
    [720, 118],
  ]
    .map(([x, y]) => pixels(cloudGrid, { W: '#ffb9c9', w: '#e07fa6' }, x, y, 4))
    .join('');
  const cloudsNear = [
    [130, 176],
    [470, 150],
    [790, 186],
  ]
    .map(([x, y]) => pixels(cloudGrid, { W: '#ffe3d6', w: '#ff9fb0' }, x, y, 6))
    .join('');

  const mountains = `<path fill="#51307f" d="${heightPath(W, 190, [[34, 2, 0.4], [18, 5, 1.2], [8, 11, 2]], 8, SCENE)}"/>`;
  const hills = `<path fill="#2c2c6e" d="${heightPath(W, 232, [[14, 3, 1], [7, 7, 0.2]], 4, SCENE)}"/>${worldTree(620, 244)}${smallTree(120, 200, '#3b6b7d')}${smallTree(330, 208, '#2f8a78')}`;

  let groundD = `M0 ${GROUND}h${W}v${SCENE - GROUND}H0z`;
  let dirt = '';
  let tufts = '';
  const groundRandom = seeded(5);
  for (let x = 0; x < W; x += 4) {
    if (groundRandom() > 0.5) tufts += `M${x} ${GROUND - 4}h4v4h-4z`;
    if (groundRandom() > 0.82) dirt += `M${x} ${GROUND + 16 + Math.floor(groundRandom() * 5) * 4}h8v4h-8z`;
  }
  const ground =
    `<path fill="#6b3f4f" d="${groundD}"/><path fill="#8a5560" d="${dirt}"/>` +
    `<path fill="#46c28b" d="M0 ${GROUND}h${W}v8H0z"/><path fill="#2f9a74" d="M0 ${GROUND + 8}h${W}v4H0z"/><path fill="#46c28b" d="${tufts}"/>`;

  const flagGrid = ['PGGGGG.', 'PGGGGGG', 'PGGGGG.', 'P......', 'P......', 'P......', 'P......', 'P......', 'K......'];
  const flag = pixels(flagGrid, { P: PAPER, G: GOLD, K: '#20163f' }, 0, GROUND - 36, 4);

  const stompX = SPRITE_X + 18;
  const crossing = (startX, endX) => (startX - endX) / SPEED;
  const flagPass = crossing(520, stompX);
  const flagReset = WORLD - crossing(860, 520);
  const flagTrack = `@keyframes flag{0%{transform:translateX(520px)}${pct(crossing(520, -40), WORLD)}{transform:translateX(-40px)}${pct(crossing(520, -40) + 0.001, WORLD)}{transform:translateX(860px)}${pct(flagReset, WORLD)}{transform:translateX(860px)}100%{transform:translateX(520px)}}.flag{transform:translateX(-100px);animation:flag ${WORLD}s linear infinite}`;

  const bugTrack = (id, enter) => {
    const hit = enter + crossing(860, stompX);
    const css = `@keyframes bg${id}{0%,${pct(enter, WORLD)}{transform:translateX(860px)}${pct(hit, WORLD)},100%{transform:translateX(${stompX}px)}}@keyframes bo${id}{0%,${pct(hit, WORLD)}{opacity:1}${pct(hit + 0.01, WORLD)},99%{opacity:0}100%{opacity:1}}.bg${id}{transform:translateX(-100px);animation:bg${id} ${WORLD}s linear infinite}.bo${id}{animation:bo${id} ${WORLD}s steps(1) infinite}`;
    const art = `<g class="wa">${pixels(BUG_A, BUG_PALETTE, 0, GROUND - 22, 4)}</g><g class="wb">${pixels(BUG_B, BUG_PALETTE, 0, GROUND - 22, 4)}</g>`;
    return { hit, css, art: `<g class="bg${id}"><g class="bo${id}">${art}</g></g>` };
  };
  const bug1 = bugTrack(1, 0.4);
  const bug2 = bugTrack(2, 8.9);

  const jump = (hit) => [
    `${pct(hit - 0.52, WORLD)}{transform:translateY(0)}`,
    `${pct(hit - 0.26, WORLD)}{transform:translateY(-68px)}`,
    `${pct(hit, WORLD)}{transform:translateY(-14px)}`,
    `${pct(hit + 0.14, WORLD)}{transform:translateY(-32px)}`,
    `${pct(hit + 0.3, WORLD)}{transform:translateY(0)}`,
  ];
  const jumpCss = `@keyframes jump{0%{transform:translateY(0)}${jump(bug1.hit).join('')}${jump(bug2.hit).join('')}100%{transform:translateY(0)}}.jump{animation:jump ${WORLD}s linear infinite}`;

  const popups = [
    { at: flagPass, text: 'WAYPOINT SAVED', color: GOLD },
    { at: bug1.hit, text: 'BUG FIXED +50 XP', color: MINT },
    { at: bug2.hit, text: 'BUG FIXED +50 XP', color: MINT },
  ];
  let popupCss = '';
  let popupBody = '';
  popups.forEach((popup, index) => {
    popupCss += `@keyframes pop${index}{0%,${pct(popup.at, WORLD)}{opacity:0;transform:translateY(8px)}${pct(popup.at + 0.08, WORLD)}{opacity:1;transform:translateY(0)}${pct(popup.at + 1.2, WORLD)}{opacity:1;transform:translateY(-10px)}${pct(popup.at + 1.5, WORLD)},100%{opacity:0;transform:translateY(-12px)}}.pop${index}{opacity:0;animation:pop${index} ${WORLD}s steps(14) infinite}`;
    popupBody += `<text class="ps pop${index} out" x="${SPRITE_X + 28}" y="180" font-size="12" fill="${popup.color}" text-anchor="middle">${popup.text}</text>`;
  });

  const levelAt = WORLD - 2.6;
  const levelCss = `@keyframes lvl{0%,${pct(levelAt, WORLD)}{opacity:0;transform:translateY(0)}${pct(levelAt + 0.1, WORLD)}{opacity:1;transform:translateY(-6px)}${pct(levelAt + 0.25, WORLD)}{transform:translateY(0)}${pct(levelAt + 2.2, WORLD)}{opacity:1;transform:translateY(0)}${pct(levelAt + 2.3, WORLD)},100%{opacity:0}}.lvl{opacity:0;animation:lvl ${WORLD}s linear infinite}`;

  const xpStops = [
    [flagPass, 0.2],
    [bug1.hit, 0.55],
    [bug2.hit, 1],
  ];
  let xpKeys = '0%{transform:scaleX(0)}';
  let previous = 0;
  xpStops.forEach(([at, value]) => {
    xpKeys += `${pct(at, WORLD)}{transform:scaleX(${previous})}${pct(at + 0.25, WORLD)}{transform:scaleX(${value})}`;
    previous = value;
  });
  xpKeys += `${pct(levelAt + 2.3, WORLD)}{transform:scaleX(1)}${pct(levelAt + 2.4, WORLD)},100%{transform:scaleX(0)}`;
  const xpCss = `@keyframes xp{${xpKeys}}.xp{transform:scaleX(.55);animation:xp ${WORLD}s linear infinite}`;

  const title = 'LEO REIS';
  const titleSize = 40;
  const titleStart = (W - title.length * titleSize) / 2;
  const titleBody = [...title]
    .map((char, index) =>
      char === ' '
        ? ''
        : `<g class="wave" style="animation-delay:${(index * 0.12).toFixed(2)}s"><text class="ps out-lg" x="${titleStart + index * titleSize}" y="112" font-size="${titleSize}" fill="${PAPER}">${char}</text></g>`,
    )
    .join('');

  const hud =
    `<text class="ps out" x="24" y="34" font-size="12" fill="${PAPER}">LEO</text><text class="ps out" x="24" y="56" font-size="12" fill="${GOLD}">LV 5+</text>` +
    `<text class="ps out" x="130" y="34" font-size="12" fill="${PAPER}">XP</text><rect x="130" y="44" width="124" height="14" fill="${INK}"/><rect x="130" y="44" width="124" height="14" fill="none" stroke="${PAPER}" stroke-width="2"/><g transform="translate(133 47)"><rect class="xp" width="118" height="8" fill="${MINT}"/></g>` +
    `<text class="ps out" x="822" y="34" font-size="12" fill="${PAPER}" text-anchor="end">WORLD</text><text class="ps out" x="822" y="56" font-size="12" fill="${GOLD}" text-anchor="end">BRAZIL</text>`;

  let petals = '';
  for (let index = 0; index < 16; index += 1) {
    const x = 240 + Math.round((random() * 640) / 4) * 4;
    const y = -10 + Math.round((random() * 90) / 2) * 2;
    const duration = (6 + random() * 5).toFixed(1);
    petals += `<rect class="pt" x="${x}" y="${y}" width="4" height="4" fill="${index % 3 === 0 ? '#ffd3e1' : PINK}" style="animation-duration:${duration}s;animation-delay:-${(random() * 10).toFixed(1)}s"/>`;
  }

  const walker =
    `<g class="jump"><g class="wa">${pixels(HERO_STEP_A, HERO_PALETTE, SPRITE_X, SPRITE_Y, SPRITE_SCALE)}</g>` +
    `<g class="wb"><g transform="translate(0 -4)">${pixels(HERO_STEP_B, HERO_PALETTE, SPRITE_X, SPRITE_Y + 4, SPRITE_SCALE)}</g></g></g>`;
  const kumo = `<g class="bob">${pixels(KUMO, KUMO_PALETTE, 148, 200, 4)}</g>`;

  const pages = [
    ["Hi, I'm *Leo!* Senior Software Engineer, building frontends", 'and product-facing systems, close to design and product.'],
    ['Lately: *AI-assisted workflows.* Human-in-the-loop, tools,', 'feedback loops, and a spec before the first line of code.'],
    ['I treat *DX as seriously as UX,* and I want interfaces that', 'feel guided, like *games, anime and cinematics.*'],
  ];
  const PAGE = 8;
  const DIALOG = PAGE * pages.length;
  const TEXT_X = 130;
  const CPS = 42;
  let dialogCss = '';
  let dialogBody = '';

  pages.forEach((lines, pageIndex) => {
    const pageStart = pageIndex * PAGE;
    const pageEnd = pageStart + PAGE;
    dialogCss += `@keyframes pg${pageIndex}{0%{opacity:0}${pageStart ? `${pct(pageStart, DIALOG)}{opacity:0}` : ''}${pct(pageStart + 0.001, DIALOG)}{opacity:1}${pct(pageEnd - 0.001, DIALOG)}{opacity:1}${pct(pageEnd, DIALOG)}{opacity:0}100%{opacity:0}}.pg${pageIndex}{opacity:${pageIndex === 0 ? 1 : 0};animation:pg${pageIndex} ${DIALOG}s steps(1) infinite}`;

    let cursor = pageStart + 0.2;
    let content = '';

    lines.forEach((line, lineIndex) => {
      const plain = line.replace(/\*/g, '');
      const typing = plain.length / CPS;
      const travel = plain.length * CHAR_WIDTH + 2;
      const id = `c${pageIndex}${lineIndex}`;
      const baseline = 370 + lineIndex * 38;
      const marked = esc(line).replace(/\*(.+?)\*/g, `<tspan fill="${GOLD}">$1</tspan>`);

      dialogCss += `@keyframes ${id}{0%,${pct(cursor, DIALOG)}{transform:translateX(0);animation-timing-function:steps(${plain.length})}${pct(cursor + typing, DIALOG)},100%{transform:translateX(${travel}px)}}.${id}{transform:translateX(${travel}px);animation:${id} ${DIALOG}s linear infinite}`;
      content += `<text class="vt" x="${TEXT_X}" y="${baseline}" font-size="${DIALOG_FONT}" fill="${PAPER}">${marked}</text><rect class="${id}" x="${TEXT_X - 2}" y="${baseline - 26}" width="${W}" height="36" fill="${INK}"/>`;
      cursor += typing + 0.25;
    });

    dialogBody += `<g class="pg${pageIndex}">${content}</g>`;
  });

  const facePalette = HERO_PALETTE;
  const faceX = 26;
  const faceY = 334;
  const faceScale = 5;
  const eyeLids = `<g class="blink"><path fill="${SKIN.S}" d="M${faceX + 4 * faceScale} ${faceY + 6 * faceScale}h${2 * faceScale}v${2 * faceScale}h-${2 * faceScale}zM${faceX + 10 * faceScale} ${faceY + 6 * faceScale}h${2 * faceScale}v${2 * faceScale}h-${2 * faceScale}z"/></g>`;
  const mouth = `<path fill="#fff" d="M${faceX + 6 * faceScale} ${faceY + 11 * faceScale}h${4 * faceScale}v${faceScale}h-${4 * faceScale}z"/><path class="talk" fill="#7d2f46" d="M${faceX + 6 * faceScale} ${faceY + 11 * faceScale}h${4 * faceScale}v${2 * faceScale}h-${4 * faceScale}z"/>`;
  const portrait = `<rect x="18" y="326" width="96" height="96" fill="#2a2466"/><rect x="18" y="326" width="96" height="96" fill="none" stroke="${GOLD}" stroke-width="2"/>${pixels(FACE, facePalette, faceX, faceY, faceScale)}${eyeLids}${mouth}`;

  const frame = `<path fill="none" stroke="${PAPER}" stroke-width="4" d="M6 ${SCENE + 6}H${W - 6}V${H - 6}H6z"/>`;
  const indicator = `<path class="bl" fill="${GOLD}" d="M${W - 42} ${H - 34}h16v4h-4v4h-8v-4h-4z"/>`;

  const css =
    `.tw{animation:tw 3s steps(3) infinite}@keyframes tw{50%{opacity:.15}}` +
    `.glow{animation:glow 3.2s steps(4) infinite}@keyframes glow{50%{opacity:.7}}` +
    `@keyframes sc{to{transform:translateX(-${W}px)}}` +
    `.s1{animation:sc 90s steps(423) infinite}.s2{animation:sc 60s steps(423) infinite}.s3{animation:sc 52s steps(423) infinite}.s4{animation:sc 32s steps(423) infinite}.s5{animation:sc ${WALK}s steps(423) infinite}` +
    `.wa{animation:wa .44s steps(1) infinite}@keyframes wa{50%{opacity:0}}` +
    `.wb{opacity:0;animation:wb .44s steps(1) infinite}@keyframes wb{50%{opacity:1}}` +
    `.bob{animation:bob 2.2s ease-in-out infinite}@keyframes bob{50%{transform:translateY(-12px)}}` +
    `.wave{animation:wave 2.4s ease-in-out infinite}@keyframes wave{0%,40%,100%{transform:translateY(0)}20%{transform:translateY(-10px)}}` +
    `.pt{animation:pt 8s linear infinite}@keyframes pt{0%{transform:translate(0,0);opacity:0}8%{opacity:1}85%{opacity:1}100%{transform:translate(-240px,270px);opacity:0}}` +
    `.out,.out-lg{paint-order:stroke;stroke:#1a1342;stroke-linejoin:round}.out{stroke-width:4px}.out-lg{stroke-width:9px}` +
    `.blink{opacity:0;animation:blink 4.2s steps(1) infinite}@keyframes blink{0%,94%{opacity:0}95%,100%{opacity:1}}` +
    `.talk{animation:talk .3s steps(1) infinite}@keyframes talk{50%{opacity:0}}` +
    flagTrack +
    bug1.css +
    bug2.css +
    jumpCss +
    popupCss +
    levelCss +
    xpCss +
    dialogCss;

  const body =
    `<defs><clipPath id="scene"><rect width="${W}" height="${SCENE}"/></clipPath><clipPath id="round"><rect width="${W}" height="${H}" rx="12"/></clipPath></defs>` +
    `<g clip-path="url(#round)"><rect width="${W}" height="${H}" fill="${INK}"/><g clip-path="url(#scene)">` +
    sky +
    stars +
    sun +
    looped(cloudsFar, W, 's1') +
    looped(mountains, W, 's2') +
    looped(cloudsNear, W, 's3') +
    looped(hills, W, 's4') +
    petals +
    looped(ground, W, 's5') +
    `<g class="flag">${flag}</g>` +
    bug1.art +
    bug2.art +
    kumo +
    walker +
    popupBody +
    titleBody +
    `<text class="ps out" x="${W / 2}" y="146" font-size="13" fill="${GOLD}" text-anchor="middle">SENIOR SOFTWARE ENGINEER</text>` +
    `<g class="lvl"><text class="ps out-lg" x="${W / 2}" y="210" font-size="26" fill="${MINT}" text-anchor="middle">LEVEL UP!</text></g>` +
    hud +
    `</g>` +
    portrait +
    dialogBody +
    frame +
    indicator +
    `</g>`;

  write(
    'hero.svg',
    svg({
      width: W,
      height: H,
      css,
      label:
        "A pixel-art RPG opening starring Leo Reis, Senior Software Engineer from Brazil. Leo walks through a dawn landscape past a blossoming world tree, with Kumo the cloud floating alongside, stomping bugs and saving waypoints. A dialog box reads: Hi, I'm Leo, building frontends and product-facing systems, close to design and product. Lately: AI-assisted workflows, human-in-the-loop, tools, feedback loops, and a spec before the first line of code. I treat DX as seriously as UX, and I want interfaces that feel guided, like games, anime and cinematics.",
      body,
    }),
  );
}

function tile({ name, width, height, label, title, description, accent, background, css, art, titleSize = 15 }) {
  const margin = 4;
  const innerW = width - margin * 2;
  const innerH = height - margin * 2;
  const panelY = innerH - (description.length * 22 + titleSize + 36);
  const descriptionBody = description
    .map((line, index) => `<text class="vt" x="16" y="${panelY + titleSize + 42 + index * 22}" font-size="22" fill="#d8d3ea">${esc(line)}</text>`)
    .join('');

  const body =
    `<defs><clipPath id="c"><rect width="${innerW}" height="${innerH}" rx="10"/></clipPath></defs>` +
    `<g transform="translate(${margin} ${margin})"><g clip-path="url(#c)">` +
    `<rect width="${innerW}" height="${innerH}" fill="${background}"/>` +
    art(innerW, panelY) +
    `<rect y="${panelY}" width="${innerW}" height="${innerH - panelY}" fill="${INK}"/><rect y="${panelY}" width="${innerW}" height="4" fill="${accent}"/>` +
    `<text class="ps" x="16" y="${panelY + titleSize + 20}" font-size="${titleSize}" fill="${accent}">${esc(title)}</text>` +
    descriptionBody +
    `</g></g>`;

  write(name, svg({ width, height, label, css, body }));
}

function buildLogbookTile() {
  const lineWidths = [
    [136, 96, 128, 72, 120],
    [120, 130, 84, 112],
  ];
  const STEP = 0.5;
  const total = 7;
  let css = `.fl{animation:fl ${total}s steps(1) infinite}@keyframes fl{0%,82%{opacity:0}83%,91%{opacity:1}92%,100%{opacity:0}}.sp{animation:sp 1.6s steps(3) infinite}@keyframes sp{50%{opacity:.1}}`;
  let lines = '';
  let order = 0;

  lineWidths.forEach((widths, column) => {
    widths.forEach((width, row) => {
      const id = `l${order}`;
      const at = 0.3 + order * STEP;
      const x = column === 0 ? 62 : 222;
      const y = 44 + row * 18;
      css += `@keyframes ${id}{0%,${pct(at, total)}{transform:scaleX(0);animation-timing-function:steps(${Math.round(width / 6)})}${pct(at + STEP * 0.9, total)},${pct(total - 1.3, total)}{transform:scaleX(1)}${pct(total - 1.29, total)},100%{transform:scaleX(0)}}.${id}{animation:${id} ${total}s linear infinite}`;
      lines += `<g transform="translate(${x} ${y})"><rect class="${id}" width="${width}" height="6" fill="${column === 1 && row === 1 ? PINK : '#5b4a87'}"/></g>`;
      order += 1;
    });
  });

  tile({
    name: 'tile-logbook.svg',
    width: 423,
    height: 268,
    label: 'LogBook for Devs: a system to register, organize and refine what I learn. Not a blog, more like a thinking system.',
    title: 'LOGBOOK FOR DEVS',
    description: ['A system to register, organize and refine', 'what I learn. Not a blog: a thinking system.'],
    accent: GOLD,
    background: '#2a1f5c',
    css,
    art: (w, h) => {
      const sparkles = [
        [24, 30],
        [392, 26],
        [380, 110],
        [30, 118],
      ]
        .map(([x, y], index) => `<path class="sp" style="animation-delay:-${index * 0.5}s" fill="${GOLD}" d="M${x} ${y - 4}h4v4h4v4h-4v4h-4v-4h-4v-4h4z"/>`)
        .join('');
      return (
        `<rect width="${w}" height="${h}" fill="#2a1f5c"/>${sparkles}` +
        `<path fill="#8a4a2f" d="M44 26h328v128H44z"/><path fill="#f6efe0" d="M52 30h154v118H52zM212 30h152v118H212z"/><path fill="#d9cfb8" d="M204 30h8v118h-8z"/>` +
        `<path fill="#ff5a5f" d="M336 18h14v28l-7-6-7 6z"/>` +
        lines +
        `<path class="fl" fill="#fffbef" d="M212 30h76v118h-76z"/>`
      );
    },
  });
}

function buildYggdrasilTile() {
  const total = 8;
  const branches = [
    { d: 'M210 136V100H70V70', label: 'feat/spells', lx: 70, ly: 50, color: PINK, at: 0.5 },
    { d: 'M210 116H290V84', label: 'fix/portal', lx: 290, ly: 62, color: MINT, at: 1.8 },
    { d: 'M210 84H190V40', label: 'chore/realm', lx: 190, ly: 20, color: GOLD, at: 3.1 },
  ];
  let css = '';
  let art = '';

  branches.forEach((branch, index) => {
    css += `@keyframes b${index}{0%,${pct(branch.at, total)}{stroke-dashoffset:1}${pct(branch.at + 0.9, total)},${pct(total - 0.6, total)}{stroke-dashoffset:0}${pct(total - 0.3, total)},100%{stroke-dashoffset:1}}.b${index}{stroke-dasharray:1;stroke-dashoffset:0;animation:b${index} ${total}s steps(14) infinite}`;
    css += `@keyframes n${index}{0%,${pct(branch.at + 0.85, total)}{opacity:0}${pct(branch.at + 0.9, total)},${pct(total - 0.5, total)}{opacity:1}${pct(total - 0.49, total)},100%{opacity:0}}.n${index}{animation:n${index} ${total}s steps(1) infinite}`;
    const match = branch.d.match(/(\d+)$/);
    const tipY = Number(match?.[1] ?? 0);
    art +=
      `<path class="b${index}" pathLength="1" d="${branch.d}" fill="none" stroke="${branch.color}" stroke-width="6" stroke-linecap="square"/>` +
      `<g class="n${index}"><path fill="${branch.color}" d="M${branch.lx - 8} ${tipY - 16}h16v8h8v16h-8v8h-16v-8h-8v-16h8z"/><path fill="#fff" opacity=".45" d="M${branch.lx - 8} ${tipY - 8}h8v8h-8z"/><text class="vt" x="${branch.lx + 22}" y="${tipY + 2}" font-size="19" fill="#fff">${branch.label}</text></g>`;
  });

  css += `.tr{stroke-dasharray:1;stroke-dashoffset:0}`;

  tile({
    name: 'tile-yggdrasil.svg',
    width: 423,
    height: 268,
    label: 'yggdrasil-worktree: Git worktree orchestration CLI. A world tree growing a new branch per worktree.',
    title: 'YGGDRASIL-WORKTREE',
    titleSize: 15,
    description: ['Git worktree orchestration CLI. Connects', 'your branches into isolated realms.'],
    accent: MINT,
    background: '#10343f',
    css,
    art: (w, h) =>
      `<rect width="${w}" height="${h}" fill="#10343f"/>` +
      `<path fill="#1a4a50" d="M0 148h${w}v30H0z"/><path fill="#46c28b" d="M0 146h${w}v6H0z"/>` +
      art +
      `<path fill="none" stroke="${PAPER}" stroke-width="10" stroke-linecap="square" d="M210 150V84"/>` +
      `<text class="vt" x="222" y="144" font-size="19" fill="#ffffff">main</text>` +
      `<text class="vt" x="16" y="28" font-size="22" fill="${MINT}">$ yggtree</text><rect class="bl" x="100" y="12" width="10" height="20" fill="${MINT}"/>`,
  });
}

function buildCurrencyTile() {
  const steps = ['R$ 0,01', 'R$ 0,12', 'R$ 1,23', 'R$ 12,34', 'R$ 123,45', 'R$ 1.234,56'];
  const stepTime = 0.7;
  const hold = 2.4;
  const total = steps.length * stepTime + hold;
  let css = '.co{animation:co 1.4s steps(4) infinite}@keyframes co{50%{transform:translateY(-8px)}}';
  let values = '';

  steps.forEach((value, index) => {
    const start = index * stepTime;
    const end = index === steps.length - 1 ? total : start + stepTime;
    css += `@keyframes v${index}{0%,${pct(start, total)}{opacity:0}${pct(start + 0.001, total)},${pct(end - 0.001, total)}{opacity:1}${pct(end, total)},100%{opacity:0}}.v${index}{opacity:${index === steps.length - 1 ? 1 : 0};animation:v${index} ${total}s steps(1) infinite}`;
    values += `<text class="vt v${index}" x="224" y="84" font-size="38" fill="${INK}" text-anchor="end">${value}</text>`;
  });

  const coin = (x, y, delay) =>
    `<g class="co" style="animation-delay:-${delay}s"><path fill="${GOLD}" d="M${x + 4} ${y}h12v4h4v12h-4v4h-12v-4h-4v-12h4z"/><path fill="#d9962c" d="M${x + 8} ${y + 4}h4v12h-4z"/></g>`;

  tile({
    name: 'tile-currency.svg',
    width: 282,
    height: 240,
    label: 'react-currency-mask: currency input handling with strong BRL support. A value being typed into a masked input.',
    title: 'CURRENCY-MASK',
    titleSize: 13,
    description: ['React currency inputs with', 'strong BRL support.'],
    accent: GOLD,
    background: '#123e2f',
    css,
    art: (w, h) =>
      `<rect width="${w}" height="${h}" fill="#123e2f"/>${coin(30, 14, 0)}${coin(120, 10, 0.4)}${coin(216, 16, 0.8)}` +
      `<rect x="24" y="52" width="226" height="44" fill="${PAPER}"/><path fill="none" stroke="${GOLD}" stroke-width="4" d="M24 52h226v44H24z"/>${values}<rect class="bl" x="232" y="60" width="4" height="28" fill="${INK}"/>`,
  });
}

function buildAtlasTile() {
  const stops = [
    { x: 36, y: 104, label: 'grill' },
    { x: 100, y: 62, label: 'spec' },
    { x: 168, y: 96, label: 'build' },
    { x: 234, y: 58, label: 'verify' },
  ];
  const hold = 1.1;
  const hop = 0.35;
  const total = stops.length * (hold + hop);
  const pinAt = ({ x, y }) => `translate(${x - 7}px,${y - 19}px)`;
  const inkColor = '#4a2f1f';
  const routeColor = '#b3472f';

  let pinKeys = '';
  stops.forEach((stop, index) => {
    const arrive = index * (hold + hop);
    pinKeys += `${pct(arrive, total)},${pct(arrive + hold, total)}{transform:${pinAt(stop)}}`;
  });
  pinKeys += `100%{transform:${pinAt(stops[0])}}`;

  let route = '';
  stops.slice(1).forEach((stop, index) => {
    const from = stops[index];
    const dots = Math.floor(Math.hypot(stop.x - from.x, stop.y - from.y) / 12);

    for (let dot = 1; dot < dots; dot += 1) {
      const x = Math.round((from.x + ((stop.x - from.x) * dot) / dots) / 2) * 2;
      const y = Math.round((from.y + ((stop.y - from.y) * dot) / dots) / 2) * 2;
      route += `M${x - 2} ${y - 2}h4v4h-4z`;
    }
  });

  const markers = stops
    .map(({ x, y, label }, index) => {
      const isLast = index === stops.length - 1;
      const marker = isLast
        ? pixels(['#...#', '.#.#.', '..#..', '.#.#.', '#...#'], { '#': routeColor }, x - 10, y - 10, 4)
        : `<rect x="${x - 4}" y="${y - 4}" width="8" height="8" fill="${inkColor}"/>`;

      return `${marker}<text class="vt" x="${x}" y="${y + 24}" font-size="19" fill="${inkColor}" text-anchor="middle">${label}</text>`;
    })
    .join('');

  const pin = pixels(['.RRRR.', 'RRWWRR', 'RRWWRR', 'RRRRRR', '.RRRR.', '..RR..', '..RR..'], { R: '#e0403f', W: '#fff' }, -2, 0, 3);

  tile({
    name: 'tile-atlas.svg',
    width: 282,
    height: 240,
    label: 'Logbook Atlas: my stack of skills, rules, hooks and agents for AI workflows. A pin hops across a treasure map from grill to spec, build and verify. You are here. Probably.',
    title: 'LOGBOOK ATLAS',
    titleSize: 13,
    description: ['Skills, rules, hooks and', 'agents for my AI workflows.'],
    accent: PINK,
    background: '#ecd9ab',
    css: `@keyframes pin{${pinKeys}}.pin{transform:${pinAt(stops[stops.length - 1])};animation:pin ${total}s steps(5) infinite}`,
    art: (w, h) =>
      `<rect width="${w}" height="${h}" fill="#ecd9ab"/>` +
      `<path fill="#dcc48d" d="M90 0h3v${h}h-3zM182 0h3v${h}h-3zM0 ${Math.round(h / 2)}h${w}v3H0z"/>` +
      `<text class="vt" x="14" y="27" font-size="20" fill="${inkColor}">You are here. Probably.</text>` +
      `<path fill="${routeColor}" d="${route}"/>${markers}<g class="pin">${pin}</g>`,
  });
}

function buildFieldKitTile() {
  const rows = ['config', 'prompts', 'automation'];
  const total = 6;
  let css = '';
  let art = '';

  rows.forEach((label, index) => {
    const onAt = 0.6 + index * 1.2;
    const y = 14 + index * 30;
    css += `@keyframes m${index}{0%,${pct(onAt, total)}{opacity:0}${pct(onAt + 0.05, total)},${pct(total - 0.5, total)}{opacity:1}${pct(total - 0.49, total)},100%{opacity:0}}.m${index}{animation:m${index} ${total}s steps(1) infinite}`;
    art +=
      `<rect x="128" y="${y}" width="20" height="20" fill="#1c2a44"/><path fill="none" stroke="${PAPER}" stroke-width="2" d="M128 ${y}h20v20h-20z"/>` +
      `<g class="m${index}">${pixels(['....#', '...#.', '#.#..', '.#...'], { '#': MINT }, 130, y + 4, 3)}</g>` +
      `<text class="vt" x="158" y="${y + 17}" font-size="23" fill="${PAPER}">${label}</text>`;
  });

  const pack = [
    '...BBBBBB...',
    '..B......B..',
    '.BBBBBBBBBB.',
    'BOOOOOOOOOOB',
    'BOOOOOOOOOOB',
    'BOOOGGGGOOOB',
    'BOOOGGGGOOOB',
    'BOOOOOOOOOOB',
    'BooooooooooB',
    'BooooooooooB',
    '.BBBBBBBBBB.',
  ];

  css += '.pk{animation:pk 1.6s steps(2) infinite}@keyframes pk{50%{transform:translateY(-6px)}}';

  tile({
    name: 'tile-fieldkit.svg',
    width: 282,
    height: 240,
    label: 'ai-field-kit: tooling and setup for real-world AI-assisted development workflows. A backpack beside a checklist being ticked.',
    title: 'AI-FIELD-KIT',
    titleSize: 13,
    description: ['Tooling and setup for real', 'AI-assisted dev workflows.'],
    accent: '#7cc7ff',
    background: '#1c3a63',
    css,
    art: (w, h) =>
      `<rect width="${w}" height="${h}" fill="#1c3a63"/><g class="pk">${pixels(pack, { B: '#20163f', O: '#ff9a4a', o: '#d9702c', G: GOLD }, 22, 18, 7)}</g>${art}`,
  });
}

function buildInventory() {
  const W = 846;
  const H = 240;
  const items = [
    ['siReact', 'REACT', 'Main weapon. Rarely leaves the belt.'],
    ['siNextdotjs', 'NEXT.JS', 'Full-stack blade. Forged for shipping.'],
    ['siTanstack', 'TANSTACK START', 'Freshly looted. Very promising stats.'],
    ['siVite', 'VITE', 'Speed potion. Takes effect instantly.'],
    ['siTypescript', 'TYPESCRIPT', 'Armor. Blocks most undefined attacks.'],
    ['siNodedotjs', 'NODE.JS', 'Trusty mount for backend territories.'],
    ['siPostgresql', 'POSTGRES', 'Relational tome. Remembers everything.'],
    ['siMongodb', 'MONGODB', 'Leafy spellbook. Schema optional.'],
    ['siDocker', 'DOCKER', 'Portable base camp. Works on my machine.'],
    ['siLinux', 'LINUX', 'Home turf for servers.'],
    ['siApple', 'MACOS', 'Daily driver. The workshop itself.'],
  ];
  const overrides = { siNextdotjs: '#ffffff', siTanstack: '#ffd0a8', siApple: '#ffffff', siPostgresql: '#7fb0e8' };
  const SLOT = 64;
  const GAP = 10;
  const startX = (W - (items.length * SLOT + (items.length - 1) * GAP)) / 2;
  const slotY = 66;
  const hold = 2.2;
  const total = hold * items.length;
  let slots = '';
  let descriptions = '';
  let cursorKeys = '';
  let css = '';

  items.forEach(([key, name, flavor], index) => {
    const x = startX + index * (SLOT + GAP);
    const start = index * hold;
    const end = start + hold;
    const icon = icons[key];
    const color = overrides[key] ?? `#${icon.hex}`;

    slots +=
      `<rect x="${x}" y="${slotY}" width="${SLOT}" height="${SLOT}" fill="#241c58"/><path fill="none" stroke="#4d3f96" stroke-width="3" d="M${x} ${slotY}h${SLOT}v${SLOT}H${x}z"/>` +
      `<g transform="translate(${x + 14} ${slotY + 14}) scale(1.5)"><path fill="${color}" style="shape-rendering:auto" d="${icon.path}"/></g>`;

    cursorKeys += `${pct(start, total)}{transform:translateX(${x}px)}`;
    css += `@keyframes d${index}{0%,${pct(start, total)}{opacity:0}${pct(start + 0.001, total)},${pct(end - 0.001, total)}{opacity:1}${pct(end, total)},100%{opacity:0}}.d${index}{opacity:${index === 0 ? 1 : 0};animation:d${index} ${total}s steps(1) infinite}`;
    descriptions += `<g class="d${index}"><text class="ps" x="28" y="178" font-size="14" fill="${GOLD}">${esc(name)}</text><text class="vt" x="28" y="210" font-size="26" fill="${PAPER}">${esc(flavor)}</text></g>`;
  });

  cursorKeys += `100%{transform:translateX(${startX + (items.length - 1) * (SLOT + GAP)}px)}`;
  css += `@keyframes cur{${cursorKeys}}.cur{transform:translateX(${startX}px);animation:cur ${total}s steps(1) infinite}`;

  const cursor = `<g class="cur"><path fill="none" stroke="${GOLD}" stroke-width="5" d="M-3 ${slotY - 3}h${SLOT + 6}v${SLOT + 6}h-${SLOT + 6}z"/><path class="bob2" fill="${GOLD}" d="M24 ${slotY - 22}h16v4h-4v4h-8v-4h-4z"/></g>`;
  css += '.bob2{animation:bob2 .8s steps(2) infinite}@keyframes bob2{50%{transform:translateY(4px)}}';

  write(
    'inventory.svg',
    svg({
      width: W,
      height: H,
      css,
      label: `RPG inventory listing the stack: ${items.map(([, name]) => name).join(', ')}.`,
      body:
        `<defs><clipPath id="r"><rect width="${W}" height="${H}" rx="12"/></clipPath></defs><g clip-path="url(#r)"><rect width="${W}" height="${H}" fill="${INK}"/>` +
        `<path fill="none" stroke="${PAPER}" stroke-width="4" d="M6 6H${W - 6}V${H - 6}H6z"/>` +
        `<text class="ps" x="28" y="34" font-size="14" fill="${PAPER}">INVENTORY</text><text class="ps" x="${W - 28}" y="34" font-size="11" fill="#9a93c7" text-anchor="end">11 / 99</text>` +
        slots +
        cursor +
        descriptions +
        `</g>`,
    }),
  );
}

function buildFooter() {
  const W = 846;
  const H = 168;
  const random = seeded(21);
  let stars = '';

  for (let index = 0; index < 34; index += 1) {
    const x = Math.round((random() * W) / 4) * 4;
    const y = Math.round((random() * 90) / 4) * 4;
    stars += `<rect class="tw" x="${x}" y="${y}" width="2" height="2" fill="#fff" style="animation-delay:-${(random() * 3).toFixed(2)}s"/>`;
  }

  const FIRE_X = 372;
  const FIRE_Y = 96;
  const fireA = ['....R.....', '...RR..R..', '..RROR.RR.', '.RROOORRR.', '.ROOYYOOR.', '.ROYYYYOR.', '..OYYYYO..'];
  const fireB = ['.....R....', '.R..RR....', '.RR.ROR...', '.RRROOORR.', '.ROOYYOOR.', '.ROYYYYOR.', '..OYYYYO..'];
  const firePalette = { R: '#ff5a5f', O: '#ff9a4a', Y: '#ffe29a' };
  const logs = ['BB.......BB', '.BBB...BBB.', '...BBBBB...'];

  const sitting = [
    ...HERO_TOP.slice(0, 16),
    '...TTTTTTTT.....',
    '...PPPPPPPPPPP..',
    '...PPPPPPPPPPFF.',
  ];

  const body =
    `<defs><clipPath id="r"><rect width="${W}" height="${H}" rx="12"/></clipPath></defs><g clip-path="url(#r)">` +
    `<rect width="${W}" height="${H}" fill="#1a1342"/><rect y="70" width="${W}" height="40" fill="#27185a"/>${stars}` +
    `<path fill="#2c2c6e" d="${heightPath(W, 104, [[10, 3, 1], [6, 7, 0.4]], 8, 128)}"/>` +
        `<rect y="128" width="${W}" height="40" fill="#2a1c45"/><rect y="128" width="${W}" height="6" fill="#2f9a74"/><path class="halo" fill="${GOLD}" opacity=".5" d="M${FIRE_X - 36} 128h112v6h-112z"/>` +
    `<g class="wa">${pixels(fireA, firePalette, FIRE_X, FIRE_Y, 4)}</g><g class="wb">${pixels(fireB, firePalette, FIRE_X, FIRE_Y, 4)}</g>` +
    pixels(logs, { B: '#6b3f2f' }, FIRE_X - 2, FIRE_Y + 26, 4) +
    pixels(sitting, HERO_PALETTE, 300, 71, 3) +
    `<g class="bob">${pixels(KUMO, KUMO_PALETTE, 452, 86, 3)}</g>` +
    `<text class="vt" x="${W / 2}" y="36" font-size="28" fill="${PAPER}" text-anchor="middle">Still figuring things out, one commit at a time.</text>` +
    `<text class="ps bl" x="${W - 24}" y="156" font-size="11" fill="${GOLD}" text-anchor="end">GAME SAVED</text>` +
    `<text class="ps" x="24" y="156" font-size="11" fill="#9a93c7">TO BE CONTINUED...</text></g>`;

  write(
    'footer.svg',
    svg({
      width: W,
      height: H,
      label: 'Leo and Kumo the cloud resting at a campfire save point. Still figuring things out, one commit at a time.',
      css:
        `.tw{animation:tw 3s steps(3) infinite}@keyframes tw{50%{opacity:.15}}` +
        `.wa{animation:wa .5s steps(1) infinite}@keyframes wa{50%{opacity:0}}.wb{opacity:0;animation:wb .5s steps(1) infinite}@keyframes wb{50%{opacity:1}}` +
        `.bob{animation:bob 2.6s ease-in-out infinite}@keyframes bob{50%{transform:translateY(-6px)}}` +
        `.halo{animation:halo 1.2s steps(3) infinite}@keyframes halo{50%{opacity:.85}}`,
      body,
    }),
  );
}

buildHero();
buildLogbookTile();
buildYggdrasilTile();
buildCurrencyTile();
buildAtlasTile();
buildFieldKitTile();
buildInventory();
buildFooter();
