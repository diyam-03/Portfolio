/* The Archive of What-Ifs · floor-plan landing behaviour */
(function () {
  'use strict';

  var lobby = document.getElementById('lobby');
  var plane = document.getElementById('plane');
  if (!lobby || !plane) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var small = window.innerWidth < 820;

  /* ---------- floating dust motes ---------- */
  var motes = document.getElementById('motes');
  if (motes && !reduce) {
    for (var i = 0; i < 24; i++) {
      var m = document.createElement('span');
      m.className = 'mote';
      m.style.left = (Math.random() * 100).toFixed(1) + '%';
      m.style.top = (40 + Math.random() * 60).toFixed(1) + '%';
      m.style.setProperty('--s', (2 + Math.random() * 4).toFixed(1) + 'px');
      m.style.animationDuration = (9 + Math.random() * 10).toFixed(1) + 's';
      m.style.animationDelay = (-Math.random() * 14).toFixed(1) + 's';
      motes.appendChild(m);
    }
  }

  /* ---------- 3D tilt: pointer parallax + gentle idle sway ---------- */
  var baseRx = small ? 46 : 54;
  var baseRz = small ? -6 : -11;
  var cur = { rx: baseRx, rz: baseRz, sc: 1 };
  var px = 0, py = 0;
  var visible = true;
  var diving = false;
  var decos = Array.prototype.slice.call(lobby.querySelectorAll('.deco'));
  var t0 = performance.now();

  function apply() {
    plane.style.setProperty('--rx', cur.rx.toFixed(2));
    plane.style.setProperty('--rz', cur.rz.toFixed(2));
    plane.style.setProperty('--sc', cur.sc.toFixed(3));
  }
  apply();

  if (!reduce) {
    if (finePointer) {
      lobby.addEventListener('pointermove', function (e) {
        var r = lobby.getBoundingClientRect();
        px = (e.clientX - r.left) / r.width - 0.5;
        py = (e.clientY - r.top) / r.height - 0.5;
      });
      lobby.addEventListener('pointerleave', function () { px = 0; py = 0; });
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: 0 }).observe(lobby);
    }
    (function frame(t) {
      if (visible) {
        var s = (t - t0) / 1000;
        var tx = (diving ? 30 : baseRx) - py * 8 + Math.sin(s * 0.6) * 1.5;
        var tz = baseRz + px * 10 + Math.cos(s * 0.45) * 2;
        var ts = diving ? 1.3 : 1;
        cur.rx += (tx - cur.rx) * 0.08;
        cur.rz += (tz - cur.rz) * 0.08;
        cur.sc += (ts - cur.sc) * 0.1;
        apply();
        decos.forEach(function (el, idx) {
          var d = 10 + idx * 6;
          el.style.translate = (-px * d).toFixed(1) + 'px ' + (-py * d).toFixed(1) + 'px';
        });
      }
      requestAnimationFrame(frame);
    })(t0);
  } else {
    var walker = lobby.querySelector('.walker');
    if (walker) walker.remove();
  }

  /* ---------- click a room: dive in, then scroll there ---------- */
  Array.prototype.forEach.call(lobby.querySelectorAll('a[href^="#"]'), function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      if (reduce) { target.scrollIntoView(); return; }
      diving = true;
      setTimeout(function () {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(function () { diving = false; }, 900);
      }, 380);
    });
  });
})();
