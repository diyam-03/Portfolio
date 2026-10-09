/* The Archive of What-Ifs · behaviour */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var hasIO = 'IntersectionObserver' in window;

  /* ---------- reveal on scroll ---------- */
  var reveals = $$('.reveal');
  if (hasIO) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { revealObs.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- floor-plan map highlight ---------- */
  var mapLinks = $$('.map a');
  if (hasIO) {
    var mapObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = e.target.getAttribute('data-room');
        mapLinks.forEach(function (a) { a.classList.toggle('on', a.getAttribute('data-room') === id); });
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    $$('[data-room]').forEach(function (el) {
      if (el.tagName !== 'A') mapObs.observe(el);
    });
  }

  /* ---------- after hours ---------- */
  var nightBtn = $('#nightBtn');
  nightBtn.addEventListener('click', function () {
    var on = document.body.classList.toggle('night');
    nightBtn.setAttribute('aria-pressed', String(on));
    nightBtn.textContent = on ? '☀️ Open hours' : '🌙 After hours';
  });

  /* ---------- audio guide ---------- */
  var synth = window.speechSynthesis;
  var audioBtn = $('#audioBtn');
  var audioOn = false;
  function speak(text) {
    if (!synth || !text) return;
    synth.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95; u.pitch = 1.05;
    synth.speak(u);
  }
  if (!synth) {
    audioBtn.hidden = true;
  } else {
    audioBtn.addEventListener('click', function () {
      audioOn = !audioOn;
      audioBtn.setAttribute('aria-pressed', String(audioOn));
      audioBtn.textContent = audioOn ? '🔇 Stop guide' : '🎧 Audio guide';
      if (audioOn) {
        speak('Audio guide on. Welcome to The Archive of What-Ifs. Keep scrolling and I will describe each exhibit.');
      } else {
        synth.cancel();
      }
    });
    if (hasIO) {
      var audioObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && audioOn) speak(e.target.getAttribute('data-audio'));
        });
      }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
      $$('[data-audio]').forEach(function (el) { audioObs.observe(el); });
    }
  }

  /* ---------- inspect buttons (touch + keyboard) ---------- */
  $$('.inspect').forEach(function (btn) {
    btn.addEventListener('click', function () {
      btn.closest('.exhibit').classList.toggle('open');
    });
  });

  /* ---------- frame tilt (desktop only) ---------- */
  if (window.matchMedia('(hover:hover) and (prefers-reduced-motion:no-preference)').matches) {
    $$('.frame').forEach(function (f) {
      f.addEventListener('pointermove', function (e) {
        var r = f.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        f.style.transform = 'perspective(900px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 6) + 'deg)';
      });
      f.addEventListener('pointerleave', function () { f.style.transform = ''; });
    });
  }

  /* ---------- security guard ---------- */
  var guardEl = $('#guard');
  var guardMsg = $('#guardMsg');
  var guardTimer;
  var guardLines = [
    "Sir/ma'am, please step away from the frame. Also, no butterflies are allowed in this gallery. Management is aware of Diya's concerns.",
    'Touching the rope is a violation of Section 4, Subsection Deterministic.',
    'I have been standing here since 2026. Please just enjoy the art.'
  ];
  var guardIdx = 0;
  function guard(msg) {
    guardMsg.textContent = msg || guardLines[guardIdx++ % guardLines.length];
    guardEl.classList.add('show');
    clearTimeout(guardTimer);
    guardTimer = setTimeout(function () { guardEl.classList.remove('show'); }, 7000);
    if (audioOn) speak(guardMsg.textContent);
  }

  /* ---------- "do not touch" rope ---------- */
  var svg = $('#ropeSvg');
  var rope = $('#rope');
  var knob = $('#knob');
  var hit = $('#hit');
  var rest = { x: 150, y: 60 };
  var cur = { x: rest.x, y: rest.y };
  var dragging = false;
  var moved = 0;
  var tugs = 0;

  function drawRope() {
    rope.setAttribute('d', 'M30 20 Q ' + cur.x + ' ' + (2 * cur.y - 20) + ' 270 20');
    knob.setAttribute('cx', cur.x); knob.setAttribute('cy', cur.y);
    hit.setAttribute('cx', cur.x); hit.setAttribute('cy', cur.y);
  }
  function springBack() {
    var vx = 0, vy = 0;
    (function step() {
      if (dragging) return;
      vx = (vx + (rest.x - cur.x) * 0.12) * 0.78;
      vy = (vy + (rest.y - cur.y) * 0.12) * 0.78;
      cur.x += vx; cur.y += vy;
      drawRope();
      if (Math.abs(vx) + Math.abs(vy) > 0.05 || Math.hypot(rest.x - cur.x, rest.y - cur.y) > 0.3) {
        requestAnimationFrame(step);
      } else {
        cur.x = rest.x; cur.y = rest.y; drawRope();
      }
    })();
  }
  function toSvg(e) {
    var r = svg.getBoundingClientRect();
    return { x: (e.clientX - r.left) * 300 / r.width, y: (e.clientY - r.top) * 110 / r.height };
  }
  hit.addEventListener('pointerdown', function (e) {
    dragging = true; moved = 0;
    hit.setPointerCapture(e.pointerId);
    hit.style.cursor = 'grabbing';
  });
  hit.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    var p = toSvg(e);
    cur.x = Math.max(70, Math.min(230, p.x));
    cur.y = Math.max(28, Math.min(102, p.y));
    moved = Math.max(moved, Math.hypot(cur.x - rest.x, cur.y - rest.y));
    drawRope();
  });
  function release() {
    if (!dragging) return;
    dragging = false;
    hit.style.cursor = 'grab';
    if (moved > 15) { tugs++; if (tugs % 3 === 0) guard(); }
    springBack();
  }
  hit.addEventListener('pointerup', release);
  hit.addEventListener('pointercancel', release);

  /* ---------- staff-only door (butterfly alert) ---------- */
  $('#staff').addEventListener('click', function () {
    var b = document.createElement('span');
    b.className = 'butterfly';
    b.setAttribute('aria-hidden', 'true');
    b.textContent = '🦋';
    document.body.appendChild(b);
    setTimeout(function () { b.remove(); }, 3600);
    guard('BUTTERFLY SIGHTED. Nobody panic. The butterfly is being escorted out. Diya has been informed (and has left the room).');
  });

  /* ---------- guestbook -> pre-filled email ---------- */
  $('#guestbook').addEventListener('submit', function (e) {
    e.preventDefault();
    var name = ($('#gName').value || '').trim() || 'A visitor';
    var msg = ($('#gMsg').value || '').trim();
    var subject = encodeURIComponent('Guestbook entry from ' + name);
    var body = encodeURIComponent(msg + '\n\n— ' + name);
    window.location.href = 'mailto:diyadmehta3616@gmail.com?subject=' + subject + '&body=' + body;
  });

  drawRope();
})();
