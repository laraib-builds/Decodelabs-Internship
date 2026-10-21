(() => {
  'use strict';

  // ---------- Data ----------
  const TRACKS = [
    { id: 'foundations', code: 'CS', name: 'Foundations', level: 'Beginner', color: '#2A4DFF',
      blurb: 'How computers work, plus the tools every developer uses daily.',
      resources: [
        { title: 'CS50x', url: 'https://cs50.harvard.edu/x/', note: 'Harvard’s intro course with problem sets.' },
        { title: 'Teach Yourself CS', url: 'https://teachyourselfcs.com/', note: 'A map of what to study and why.' },
        { title: 'The Missing Semester', url: 'https://missing.csail.mit.edu/', note: 'Terminal, Git and editors, taught properly.' }
      ] },
    { id: 'web', code: 'Wb', name: 'Web development', level: 'Beginner', color: '#0E8F80',
      blurb: 'Build pages and apps that run in any browser.',
      resources: [
        { title: 'The Odin Project', url: 'https://www.theodinproject.com/', note: 'Project-based full-stack path.' },
        { title: 'MDN Learn Web Development', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development', note: 'The reference for HTML, CSS and JavaScript.' },
        { title: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn', note: 'Short exercises with certificates.' }
      ] },
    { id: 'security', code: 'Sc', name: 'Cybersecurity', level: 'Beginner', color: '#C2410C',
      blurb: 'Learn how systems get attacked by practising on safe targets.',
      resources: [
        { title: 'TryHackMe Pre-Security', url: 'https://tryhackme.com/', note: 'Guided rooms in the browser. Free tier available.' },
        { title: 'OverTheWire: Bandit', url: 'https://overthewire.org/wargames/bandit/', note: 'Linux command-line puzzles.' },
        { title: 'PortSwigger Web Security Academy', url: 'https://portswigger.net/web-security', note: 'Free labs on real web vulnerabilities.' }
      ] },
    { id: 'dsa', code: 'DS', name: 'Data structures and algorithms', level: 'Intermediate', color: '#5B3FD6',
      blurb: 'Write faster, cleaner code and prepare for technical interviews.',
      resources: [
        { title: 'VisuAlgo', url: 'https://visualgo.net/', note: 'Animated diagrams of each structure.' },
        { title: 'NeetCode Roadmap', url: 'https://neetcode.io/roadmap', note: 'Practice problems in a sensible order.' },
        { title: 'MIT 6.006 Algorithms', url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/', note: 'Full lectures and notes.' }
      ] },
    { id: 'ai', code: 'AI', name: 'AI and machine learning', level: 'Intermediate', color: '#B4235A',
      blurb: 'Understand how models learn, then train your own.',
      resources: [
        { title: 'Google ML Crash Course', url: 'https://developers.google.com/machine-learning/crash-course', note: 'Short lessons with interactive exercises.' },
        { title: 'fast.ai Practical Deep Learning', url: 'https://course.fast.ai/', note: 'Code first, theory after.' },
        { title: 'Neural Networks: Zero to Hero', url: 'https://karpathy.ai/zero-to-hero.html', note: 'Andrej Karpathy builds a language model from scratch.' }
      ] },
    { id: 'systems', code: 'Sy', name: 'Systems programming', level: 'Intermediate', color: '#8A6A00',
      blurb: 'See what happens below your code: memory, processes and networks.',
      resources: [
        { title: 'Nand to Tetris', url: 'https://www.nand2tetris.org/', note: 'Build a computer from logic gates up.' },
        { title: 'Operating Systems: Three Easy Pieces', url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/', note: 'A free book on how operating systems work.' },
        { title: 'Beej’s Guide to Network Programming', url: 'https://beej.us/guide/bgnet/', note: 'Sockets in C, explained plainly.' }
      ] }
  ];

  // ---------- State ----------
  const KEY = 'trackpath-done-v1';
  let done = new Set();
  let level = 'all';
  try { done = new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch (e) { /* storage blocked: start empty */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify([...done])); } catch (e) { /* ignore */ } };

  // ---------- Elements ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const grid = $('#trackGrid');
  const status = $('#status');
  const chips = document.querySelectorAll('.chip');
  const total = TRACKS.reduce((sum, t) => sum + t.resources.length, 0);

  // ---------- Rendering ----------
  const resourceItem = (t, r, i) => `
    <li>
      <input type="checkbox" id="${t.id}-${i}" aria-label="Mark ${r.title} as done">
      <div><a href="${r.url}" target="_blank" rel="noopener noreferrer">${r.title}</a><small>${r.note}</small></div>
    </li>`;

  const card = (t) => `
    <article class="card" id="track-${t.id}" style="--tc:${t.color}">
      <div class="card-top"><span class="tile" aria-hidden="true">${t.code}</span><span class="pill">${t.level}</span></div>
      <h3>${t.name}</h3>
      <p class="blurb">${t.blurb}</p>
      <p class="count" data-count="${t.id}"></p>
      <button class="toggle" type="button" aria-expanded="false" aria-controls="list-${t.id}">Show resources</button>
      <ul class="res" id="list-${t.id}" hidden>${t.resources.map((r, i) => resourceItem(t, r, i)).join('')}</ul>
    </article>`;

  function render() {
    const list = TRACKS.filter((t) => level === 'all' || t.level === level);
    grid.innerHTML = list.map(card).join('');
    status.textContent = `Showing ${list.length} ${list.length === 1 ? 'track' : 'tracks'}`;
    updateProgress();
  }

  function updateProgress() {
    grid.querySelectorAll('input[type="checkbox"]').forEach((box) => {
      box.checked = done.has(box.id);
      box.closest('li').classList.toggle('done', box.checked);
    });
    TRACKS.forEach((t) => {
      const el = $(`[data-count="${t.id}"]`);
      if (!el) return;
      const k = t.resources.filter((_, i) => done.has(`${t.id}-${i}`)).length;
      el.textContent = `${k} of ${t.resources.length} done`;
    });
    const pct = Math.round((done.size / total) * 100);
    $('#doneNum').textContent = done.size;
    $('#totalNum').textContent = total;
    $('#bar').style.width = pct + '%';
    $('.meter').setAttribute('aria-valuenow', pct);
  }

  function setOpen(btn, open) {
    btn.setAttribute('aria-expanded', open);
    btn.textContent = open ? 'Hide resources' : 'Show resources';
    document.getElementById(btn.getAttribute('aria-controls')).hidden = !open;
  }

  function setLevel(next) {
    level = next;
    chips.forEach((c) => c.setAttribute('aria-pressed', c.dataset.level === level));
    render();
  }

  // ---------- Events ----------
  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.toggle');
    if (btn) setOpen(btn, btn.getAttribute('aria-expanded') !== 'true');
  });

  grid.addEventListener('change', (e) => {
    if (!e.target.matches('input[type="checkbox"]')) return;
    e.target.checked ? done.add(e.target.id) : done.delete(e.target.id);
    save();
    updateProgress();
  });

  chips.forEach((c) => c.addEventListener('click', () => setLevel(c.dataset.level)));

  document.querySelector('[data-open]').addEventListener('click', (e) => {
    setLevel('all');
    const target = $(`#track-${e.currentTarget.dataset.open}`);
    const btn = $('.toggle', target);
    setOpen(btn, true);
    target.scrollIntoView({ block: 'center' });
    btn.focus({ preventScroll: true });
  });

  $('#reset').addEventListener('click', () => {
    if (done.size && confirm('Clear all ticked resources?')) {
      done.clear();
      save();
      updateProgress();
    }
  });

  $('#year').textContent = new Date().getFullYear();
  render();
})();
