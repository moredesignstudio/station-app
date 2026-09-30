// Shared markup for the screens. A screen marks a spot with
//   <div data-part="web"></div>   or   <nav data-part="dock" data-active="gmail-studio"></nav>
// and includes this script at the end of <body>. Keeps the dock and the web
// content identical across screens, so a change lands everywhere at once.
//
// A proposal that changes structure (not just styles) ships a structure.js
// that sets window.__proposalStructure(parts, helpers) to replace parts.
(function () {
  var parts = {};
  var base = new URL('../', document.currentScript.src); // design/

  // ————— Web content (stand-in, not designed) —————
  // Fictional senders and content.
  var mails = [
    ['Aurora Print', 'Proofs for the autumn catalogue', 'Attached are the final proofs, please confirm by', '10:42', true],
    ['Leo Marchetti', 'Brand review — v3 exports', 'Sending the exports for tomorrow, the logo lockups', '09:18', true],
    ['Northwind Studio', 'Workshop recap + next steps', 'Thanks for the session today. Here is what we agreed', '08:03', true],
    ['Ines Duarte', 'Illustrations for onboarding', 'Three directions attached, I like the second one most', 'Yesterday', false],
    ['CI Bot', 'Pipeline #1482 passed', 'main · fix(favicon): point initial icon at the new', 'Yesterday', false],
    ['Analytics', 'Weekly report', '2,314 visitors · +12% compared to last week', 'Sep 28', false],
    ['Hosting Co.', 'Your invoice is ready', 'The invoice for September is available in your', 'Sep 27', false],
    ['Portfolio', 'Your shot is trending', 'more mail — icon exploration got 214 likes this', 'Sep 26', false],
    ['Team Wiki', 'Weekly digest', 'Q4 planning · Studio handbook · Client list were', 'Sep 25', false],
    ['Accounting', 'Invoice FA-2026-0912', 'Hello, please find the invoice for September attached', 'Sep 24', false],
    ['Drive', 'Shared with you: "Pitch deck"', 'A presentation was shared with you', 'Sep 23', false],
    ['Design Tool', 'Your export is ready', 'The export of "Launch post" finished', 'Sep 22', false],
    ['Chat', 'New messages in #more-mail', 'New tray icons are pushed, can you check them', 'Sep 21', false],
  ];

  parts.web = function () {
    return '<div class="web">' +
      '<div class="web-top"><div class="web-logo"><i></i>Webmail</div><div class="web-search">Search mail</div><div class="web-avatar">M</div></div>' +
      '<div class="web-nav"><div class="web-compose">Compose</div>' +
      '<a class="on">Inbox <b>3</b></a><a>Starred</a><a>Snoozed</a><a>Sent</a><a>Drafts <span>2</span></a><a>Clients</a><a>Invoices</a></div>' +
      '<div class="web-main"><div class="web-tools"><i></i><i></i><i></i></div>' +
      mails.map(function (m) {
        return '<div class="web-row' + (m[4] ? ' unread' : '') + '"><span class="from">' + m[0] + '</span>' +
          '<span class="subject">' + m[1] + ' <span>— ' + m[2] + '</span></span><span class="date">' + m[3] + '</span></div>';
      }).join('') +
      '</div></div>';
  };

  // ————— Icons (the app's own, from icons.js) —————
  function icon(name, cls) {
    var def = (window.__icons || {})[name];
    if (!def) return '';
    return '<svg class="i' + (cls ? ' ' + cls : '') + '" viewBox="' + def.viewBox + '">' +
      def.paths.map(function (p) {
        return '<path d="' + p.d + '"' + (p.transform ? ' transform="' + p.transform + '"' : '') + '/>';
      }).join('') + '</svg>';
  }
  parts.icon = function (data) { return icon(data.name, data.cls); };

  // ————— Apps: white glyphs on transparent, like the manifest icons —————
  var glyphs = {
    mail: '<path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11Zm2.2.5L12 12l6.8-5H5.2ZM19 8.6l-6.4 4.7a1 1 0 0 1-1.2 0L5 8.6V17h14V8.6Z"/>',
    calendar: '<path d="M7 3h2v2h6V3h2v2h2.5A1.5 1.5 0 0 1 21 6.5v13a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5v-13A1.5 1.5 0 0 1 4.5 5H7V3ZM5 10v9h14v-9H5Zm2 2h4v4H7v-4Z"/>',
    drive: '<path d="M8.6 3h6.8l6.2 10.8L18.2 20H5.8l-3.4-6.2L8.6 3Zm1.2 2L5 13.8 7 17.5l4.8-8.6-2-3.9Zm4.4 0h-2.3l6.2 11.2 1.2-2.3L14.2 5ZM9 18h8.2l-1.4-2.5H10.4L9 18Z"/>',
    chat: '<path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7l-5 4v-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm3 6.5a1.5 1.5 0 1 0 0 .01V10.5Zm4 0a1.5 1.5 0 1 0 0 .01V10.5Zm4 0a1.5 1.5 0 1 0 0 .01V10.5Z"/>',
    phone: '<path d="M12 2.5a9.5 9.5 0 0 1 0 19c-1.6 0-3.1-.4-4.4-1.1L3 21.5l1.2-4.4A9.5 9.5 0 0 1 12 2.5Zm-2.6 5c-.3 0-.7.1-.9.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.2.2 2 3.1 5 4.2 2.4.9 2.9.7 3.4.7.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3l-2-1c-.3-.1-.5-.1-.7.1l-.9 1.1c-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.6.3-.5c.1-.2 0-.4 0-.5l-.9-2.2c-.2-.5-.5-.5-.7-.5h-.4Z"/>',
    cloud: '<path d="M7.5 19a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18.4 9.1 5 5 0 0 1 17 19H7.5Z"/>',
  };
  var apps = {
    gmail: { name: 'Gmail', glyph: 'mail', color: '#e75a4d' },
    calendar: { name: 'Google Calendar', glyph: 'calendar', color: '#3A82F5' },
    drive: { name: 'Google Drive', glyph: 'drive', color: '#FCCD48' },
    slack: { name: 'Slack', glyph: 'chat', color: '#42C299' },
    whatsapp: { name: 'WhatsApp', glyph: 'phone', color: '#25D366' },
    icloud: { name: 'iCloud Mail', glyph: 'cloud', color: '#3a9df4' },
  };
  // What's in the dock: accounts show their profile picture (instance logo).
  var dock = [
    { id: 'gmail-studio', app: 'gmail', avatar: 'a', account: 'hello@studio.example' },
    { id: 'gmail-personal', app: 'gmail', avatar: 'b', account: 'me@personal.example', badge: 3 },
    { id: 'calendar', app: 'calendar' },
    { id: 'drive', app: 'drive' },
    { id: 'slack', app: 'slack', badge: 1 },
    { id: 'whatsapp', app: 'whatsapp', badge: true },
    { id: 'icloud', app: 'icloud', avatar: 'c', account: 'me@icloud.example' },
  ];

  function glyph(appId) {
    return '<svg viewBox="0 0 24 24">' + glyphs[apps[appId].glyph] + '</svg>';
  }
  function avatar(key) {
    return '<img alt="" src="' + new URL('shared/avatars/' + key + '.svg', base).href + '">';
  }
  parts.glyph = function (data) { return glyph(data.app); };
  parts.appDisc = function (data) {
    return '<span class="img" style="background:' + apps[data.app].color + '">' + glyph(data.app) + '</span>';
  };
  parts.avatar = function (data) { return avatar(data.key); };

  // ————— Dock (as the app draws it today) —————
  // data-active: dock item id · data-hover: dock item id · data-open: "add|notifications"
  parts.dock = function (data) {
    var btn = function (name, extra) {
      return '<div class="dock-btn ' + (extra || '') + '">' + icon(name) + '</div>';
    };
    return '<nav class="dock">' +
      '<div class="dock-top">' +
        '<div class="traffic"><i></i><i></i><i></i></div>' +
        '<div class="dock-nav">' + btn('back') + btn('forward', 'disabled') + '</div>' +
        btn('search', 'big') +
        btn('recent') +
      '</div>' +
      '<div class="dock-apps">' +
        dock.map(function (item) {
          var app = apps[item.app];
          var cls = 'dock-app' + (item.avatar ? ' account' : '') + (data.active === item.id ? ' active' : '') + (data.hover === item.id ? ' hover' : '');
          return '<div class="' + cls + '" data-id="' + item.id + '" style="--app-color:' + app.color + '" title="' + app.name + (item.account ? ' · ' + item.account : '') + '">' +
            '<span class="bg"></span>' +
            '<span class="logo">' + (item.avatar ? avatar(item.avatar) : glyph(item.app)) + '</span>' +
            (item.avatar ? '<span class="mini">' + glyph(item.app) + '</span>' : '') +
            '<span class="indicator"></span>' +
            (item.badge ? '<span class="dot"></span>' : '') + '</div>';
        }).join('') +
      '</div>' +
      '<div class="dock-bottom">' +
        btn('plus', data.open === 'add' ? 'active' : '') +
        btn('bell') +
        btn('notification', data.open === 'notifications' ? 'active' : '').replace('</div>', '<span class="dot"></span></div>') +
      '</div>' +
    '</nav>';
  };

  var helpers = { icon: icon, glyph: glyph, avatar: avatar, apps: apps, dock: dock, base: base };
  window.__parts = parts;
  if (typeof window.__proposalStructure === 'function') window.__proposalStructure(parts, helpers);

  // A slot with a class keeps its element and gets the part inside it
  // (<span class="icon-btn" data-part="icon">); a bare slot is replaced.
  document.querySelectorAll('[data-part]').forEach(function (slot) {
    var render = parts[slot.getAttribute('data-part')];
    if (!render) return;
    if (slot.className) slot.innerHTML = render(slot.dataset);
    else slot.outerHTML = render(slot.dataset);
  });
  if (typeof window.__proposalReady === 'function') window.__proposalReady(helpers);
})();
