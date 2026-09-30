// Structure + interactions for the More Design studio skin.
//
// Replaces the 50px dock with a Slack-like frame: a full-width top bar that
// holds the native traffic lights, a labelled rail, and the web app framed as
// a rounded card. The top bar's center shows one of four ideas (board option
// "top bar"). Behaviours below are the proposed motion, playable on the board.

window.__proposalStructure = function (parts, h) {
  var app = function (item) { return h.apps[item.app]; };
  var label = function (item) { return item.label || item.app; };

  function railItem(item, data) {
    var a = app(item);
    var badge = item.badge === true ? '<span class="badge dot"></span>'
      : item.badge ? '<span class="badge">' + item.badge + '</span>' : '';
    var cls = 'rail-item' + (item.avatar ? ' account' : '') + (data.active === item.id ? ' active' : '') + (data.hover === item.id ? ' hover' : '');
    var face = item.avatar ? h.avatar(item.avatar) : h.glyph(item.app);
    // Two stacked layers, the filtered one and the color one, so color can
    // fade in and out smoothly (a filter like url(#duotone) can't be tweened).
    return '<button class="' + cls + '" data-id="' + item.id + '" style="--app-color:' + a.color + '" title="' + a.name + (item.account ? ' · ' + item.account : '') + '">' +
      '<span class="glow"></span>' +
      '<span class="icon"><span class="layer mono">' + face + '</span><span class="layer color">' + face + '</span></span>' +
      badge +
      '<span class="label">' + label(item) + '</span>' +
    '</button>';
  }

  function topbar() {
    var gmail = h.apps.gmail;
    return '<header class="topbar">' +
      '<div class="lights"><i></i><i></i><i></i></div>' +
      '<div class="tb tb-pages">' +
        '<span class="puck"></span>' +
        '<a class="on">inbox</a><a>brand review — v3</a><a>proofs</a><a>workshop recap</a>' +
        '<span class="tb-add">' + h.icon('plus') + '</span>' +
      '</div>' +
      '<div class="tb tb-title">' +
        '<span class="dot" style="background:' + gmail.color + '"></span>' +
        '<span>gmail</span><i>/</i><span>hello@studio.example</span><i>/</i><b>inbox</b>' +
        '<span class="progress"></span>' +
      '</div>' +
      // Chosen: today's content, set like "where you are" (plain text and slashes).
      '<div class="tb tb-today">' +
        '<span><b>3</b> unread</span><i>/</i>' +
        '<span class="event"><span class="dot" style="background:' + h.apps.calendar.color + '"></span>brainstorm · 14:00</span><i>/</i>' +
        '<span class="focus-pill"><span class="switch"></span>focus</span>' +
        '<span class="progress"></span>' +
      '</div>' +
      '<div class="tb tb-glow">' +
        '<span class="ambient"></span>' +
        '<span class="wordmark">more mail</span>' +
      '</div>' +
      '<div class="tb-paused">focus · notifications paused</div>' +
    '</header>';
  }

  // Filters for the inactive-icon options (html[data-inactive]).
  var defs = '<svg class="defs" width="0" height="0" aria-hidden="true">' +
    '<filter id="onebit" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0"/><feComponentTransfer>' +
    '<feFuncR type="discrete" tableValues="0 1"/><feFuncG type="discrete" tableValues="0 1"/><feFuncB type="discrete" tableValues="0 1"/></feComponentTransfer></filter>' +
    '<filter id="duotone" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0"/><feComponentTransfer>' +
    '<feFuncR type="table" tableValues="0.063 0.973"/><feFuncG type="table" tableValues="0.051 0.976"/><feFuncB type="table" tableValues="0.118 0.98"/></feComponentTransfer></filter>' +
    '</svg>';

  parts.dock = function (data) {
    return defs + topbar() +
      '<nav class="rail">' +
        '<div class="rail-brand"><img alt="more mail" src="' + new URL('../brand/more-mail-icon.png', h.base).href + '"></div>' +
        '<div class="rail-items">' + h.dock.map(function (item) { return railItem(item, data); }).join('') + '</div>' +
        '<div class="rail-bottom">' +
          '<button class="round add" title="Add apps">' + h.icon('plus') + '</button>' +
          '<button class="round moon" title="Focus mode"><svg viewBox="0 0 24 24"><path d="M14.5 3.5a8.5 8.5 0 1 0 6 14.5A7 7 0 0 1 14.5 3.5Z"/></svg></button>' +
          '<button class="round bell" title="Notifications">' + h.icon('notification') + '<span class="badge dot"></span></button>' +
        '</div>' +
      '</nav>';
  };
};

window.__proposalReady = function () {
  var html = document.documentElement;
  var $ = function (sel, el) { return (el || document).querySelector(sel); };
  var $$ = function (sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); };
  var restart = function (el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };

  // Rail: click to switch app. The glow blooms, the old one fades, the page swaps.
  $$('.rail-item').forEach(function (item) {
    item.addEventListener('click', function () {
      if (item.classList.contains('active')) return;
      $$('.rail-item.active').forEach(function (other) { other.classList.remove('active', 'arrive'); });
      item.classList.add('active');
      restart(item, 'arrive');
      var content = $('.content');
      if (content) restart(content, 'swap');
      var badge = $('.badge', item);
      if (badge) badge.classList.add('read');
    });
  });

  // Moving highlight ("puck") that glides between hovered rows / pills.
  function puck(container, rowSel, cls) {
    if (!container) return;
    var p = document.createElement('span');
    p.className = cls;
    container.prepend(p);
    $$(rowSel, container).forEach(function (row) {
      row.addEventListener('mouseenter', function () {
        p.style.transform = 'translateY(' + row.offsetTop + 'px)';
        p.style.height = row.offsetHeight + 'px';
        p.classList.add('on');
      });
    });
    container.addEventListener('mouseleave', function () { p.classList.remove('on'); });
  }
  $$('.subdock-list').forEach(function (list) { puck(list, '.subdock-item', 'row-puck'); });
  $$('.subdock-item, .qs-item').forEach(function (row, i) { row.style.setProperty('--i', i); });

  // Top bar "pages": the milk puck slides to the clicked page.
  var pages = $('.tb-pages');
  if (pages) {
    var pk = $('.puck', pages);
    var place = function (a, instant) {
      if (instant) pk.style.transition = 'none';
      pk.style.width = a.offsetWidth + 'px';
      pk.style.transform = 'translateX(' + a.offsetLeft + 'px)';
      if (instant) { void pk.offsetWidth; pk.style.transition = ''; }
    };
    var settle = function () { var on = $('a.on', pages); if (on) place(on, true); };
    if (document.fonts) document.fonts.ready.then(settle); else settle();
    $$('a', pages).forEach(function (a) {
      a.addEventListener('click', function () {
        $$('a', pages).forEach(function (x) { x.classList.remove('on'); });
        a.classList.add('on');
        place(a);
        restart($('.content'), 'swap');
      });
    });
  }

  // Toggles: the knob squashes and stretches as it travels.
  $$('.toggle').forEach(function (t) {
    t.addEventListener('click', function () {
      t.classList.toggle('on');
      restart(t, 'flip');
    });
  });

  // Focus mode: badges turn to quiet rings, the top bar says so.
  var moon = $('.rail .moon');
  var focusPill = $('.focus-pill');
  var setFocus = function () { html.classList.toggle('focus'); };
  if (moon) moon.addEventListener('click', setFocus);
  if (focusPill) focusPill.addEventListener('click', setFocus);

  // Demo on the main window: a new Slack message arrives. The icon bleeds
  // into color for a moment and the badge pops.
  if (document.body.dataset.demo === 'new-mail') {
    setTimeout(function () {
      var slack = $('.rail-item[data-id="slack"]');
      if (!slack) return;
      var badge = $('.badge', slack);
      badge.textContent = '2';
      restart(badge, 'pop');
      restart(slack, 'bleed');
    }, 1600);
  }
};
