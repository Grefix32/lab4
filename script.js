/* ---------- Завдання 1 ---------- */
function round2(x) { return Math.round(x * 100) / 100; }
function fahrChanged() {
  const v = parseFloat(document.getElementById('fahr').value.replace(',', '.'));
  document.getElementById('cels').value = isNaN(v) ? '' : round2(5 / 9 * (v - 32));
}
function celsChanged() {
  const v = parseFloat(document.getElementById('cels').value.replace(',', '.'));
  document.getElementById('fahr').value = isNaN(v) ? '' : round2(v * 9 / 5 + 32);
}

/* ---------- Спільні функції для завдань 2 і 3 ---------- */
function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = rnd(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function mk(tag, props, parent) {
  const el = document.createElement(tag);
  Object.assign(el, props || {});
  if (parent) parent.appendChild(el);
  return el;
}
function scoreText(s) {
  const pct = s.total ? Math.round(s.right / s.total * 100) : 0;
  return `Загальний рахунок ${pct}% (${s.right} правильних відповідей з ${s.total})`;
}

/* ---------- Завдання 2 ---------- */
function initTask2(containerId) {
  const box = document.getElementById(containerId);
  const s = { right: 0, total: 0, a: 0, b: 0, answered: false };

  const score = mk('div', {}, box);
  const nextBtn = mk('button', { textContent: 'наступне завдання' }, mk('div', { className: 'row' }, box));
  const line = mk('div', { className: 'row' }, box);
  const question = mk('span', {}, line);
  const input = mk('input', { type: 'text', size: 12 }, line);
  line.appendChild(document.createTextNode(' '));
  const checkBtn = mk('button', { textContent: 'перевірити' }, line);
  const result = mk('div', { className: 'row' }, box);

  function newTask() {
    s.a = rnd(2, 9); s.b = rnd(2, 9); s.answered = false;
    question.textContent = `${s.a} × ${s.b} = `;
    input.value = ''; input.disabled = false; checkBtn.disabled = false;
    result.textContent = ''; result.className = 'row';
    score.textContent = scoreText(s);
    input.focus();
  }
  function check() {
    if (s.answered || input.value.trim() === '') return;
    s.answered = true; s.total++;
    const correct = s.a * s.b;
    if (parseInt(input.value, 10) === correct) {
      s.right++; result.textContent = 'Правильно!'; result.className = 'row ok';
    } else {
      result.textContent = `Помилка, правильна відповідь «${correct}»`; result.className = 'row err';
    }
    input.disabled = true; checkBtn.disabled = true;
    score.textContent = scoreText(s);
  }
  nextBtn.onclick = newTask;
  checkBtn.onclick = check;
  input.onkeydown = e => { if (e.key === 'Enter') check(); };
  newTask();
}

/* ---------- Завдання 3 ---------- */
function initTask3(containerId) {
  const box = document.getElementById(containerId);
  const s = { right: 0, total: 0, correct: 0 };
  const name = 'answer_' + containerId;

  const score = mk('div', {}, box);
  const nextBtn = mk('button', { textContent: 'наступне завдання' }, mk('div', { className: 'row' }, box));
  const question = mk('div', { className: 'row' }, box);
  const options = mk('div', {}, box);
  const result = mk('div', { className: 'row' }, box);

  function newTask() {
    const a = rnd(2, 9), b = rnd(2, 9);
    s.correct = a * b;
    const set = new Set([s.correct]);
    while (set.size < 4) {
      const w = rnd(0, 1) ? a * rnd(2, 9) : s.correct + rnd(-10, 10);
      if (w > 0) set.add(w);
    }
    question.textContent = `${a} × ${b} =`;
    options.innerHTML = '';
    result.textContent = ''; result.className = 'row';
    score.textContent = scoreText(s);
    shuffle([...set]).forEach((val, i) => {
      const lab = mk('label', {}, mk('div', {}, options));
      const r = mk('input', { type: 'radio', name: name, value: val }, lab);
      lab.appendChild(document.createTextNode(' ' + val));
      r.onchange = () => check(parseInt(r.value, 10));
    });
  }
  function check(val) {
    s.total++;
    options.querySelectorAll('input').forEach(r => r.disabled = true); // лише одна спроба
    if (val === s.correct) {
      s.right++; result.textContent = 'Правильно!'; result.className = 'row ok';
    } else {
      result.textContent = `Помилка, правильна відповідь «${s.correct}»`; result.className = 'row err';
    }
    score.textContent = scoreText(s);
  }
  nextBtn.onclick = newTask;
  newTask();
}

/* ---------- Завдання 4 ---------- */
// Варіант 16 — футбольні команди
let imagesArray = [
  { path: 'images/001.jpg', title: 'Барселона',          description: 'Іспанія, Ла Ліга' },
  { path: 'images/002.jpg', title: 'Реал Мадрид',        description: 'Іспанія, Ла Ліга' },
  { path: 'images/003.jpg', title: 'Манчестер Юнайтед',  description: 'Англія, Прем’єр-ліга' },
  { path: 'images/004.jpg', title: 'Баварія',            description: 'Німеччина, Бундесліга' },
  { path: 'images/005.jpg', title: 'Динамо Київ',        description: 'Україна, Прем’єр-ліга' }
];

// Запасна картинка, якщо файл не знайдено
function placeholder(text) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="300">
    <rect width="100%" height="100%" fill="#e8e3c8"/>
    <text x="50%" y="50%" font-size="32" text-anchor="middle" fill="#666" font-family="Arial">${text}</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function initPhotoRotator(divId, images) {
  const root = document.getElementById(divId);
  root.innerHTML = '';
  root.classList.add('rot');
  let cur = 0;

  const back = mk('a', { href: '#', textContent: 'Назад' }, mk('div', { className: 'nav' }, root));
  back.parentNode.style.gridColumn = '1';
  const head = mk('div', { className: 'head' }, root);
  const mid = mk('div', { className: 'mid' }, root);
  const img = mk('img', {}, mid);
  const foot = mk('div', { className: 'foot' }, root);
  const fwd = mk('a', { href: '#', textContent: 'Вперед' }, mk('div', { className: 'nav' }, root));
  fwd.parentNode.style.gridColumn = '3';
  const titleEl = mk('b', {}, foot);
  const descEl = mk('div', {}, foot);

  function show() {
    const it = images[cur];
    head.textContent = `Фотографія ${cur + 1} з ${images.length}`;
    img.onerror = () => { img.onerror = null; img.src = placeholder(it.title); };
    img.src = it.path; img.alt = it.title;
    titleEl.textContent = it.title;
    descEl.textContent = it.description;
    // visibility (а не display) — щоб макет не «стрибав»
    back.style.visibility = cur === 0 ? 'hidden' : 'visible';
    fwd.style.visibility = cur === images.length - 1 ? 'hidden' : 'visible';
  }
  back.onclick = e => { e.preventDefault(); if (cur > 0) { cur--; show(); } };
  fwd.onclick = e => { e.preventDefault(); if (cur < images.length - 1) { cur++; show(); } };
  show();
}

/* ---------- Завдання 5 ---------- */
// Шрифт 3×5 пікселі
const FONT = {
  0: ['111','101','101','101','111'], 1: ['010','110','010','010','111'],
  2: ['111','001','111','100','111'], 3: ['111','001','111','001','111'],
  4: ['101','101','111','001','001'], 5: ['111','100','111','001','111'],
  6: ['111','100','111','101','111'], 7: ['111','001','010','010','010'],
  8: ['111','101','111','101','111'], 9: ['111','101','111','001','111']
};

function initCaptcha(containerId, digitsCount) {
  const box = document.getElementById(containerId);
  box.innerHTML = '';
  let code = '';
  for (let i = 0; i < digitsCount; i++) code += rnd(0, 9);

  mk('div', { textContent: 'Введіть число', className: 'row' }, box);
  const cap = mk('div', { className: 'cap' }, box);
  for (const ch of code) {
    const d = mk('span', { className: 'digit' }, cap);
    FONT[ch].forEach(rowStr => {
      const line = mk('span', { className: 'line' }, d);
      for (const bit of rowStr) mk('span', { className: 'px' + (bit === '1' ? ' on' : '') }, line);
    });
  }
  mk('br', {}, box);
  const input = mk('input', { type: 'text', maxLength: digitsCount, size: digitsCount + 4 }, box);
  const msg = mk('div', { className: 'row' }, box);

  input.oninput = () => {
    if (input.value.length < digitsCount) { msg.textContent = ''; return; }
    if (input.value === code) { msg.textContent = 'Правильно'; msg.className = 'row ok'; }
    else { msg.textContent = 'Помилка'; msg.className = 'row err'; }
  };
}

/* ---------- Запуск ---------- */
initTask2('t2');
initTask3('t3');
initPhotoRotator('rotator', imagesArray);
initCaptcha('captcha', 4);
