// Loaded in the <head> of every screen in design/screens.
//
// Picks the stylesheets for ?p=<proposal> (default: current), loads the
// proposal's structure.js (markup changes), applies proposal options from the
// query (?topbar=pages → <html data-topbar="pages">), exposes a small API the
// review board drives, and live-reloads when a screen is opened on its own.
(function () {
  // Proposals that have shipped, oldest first. "current" is the baseline mock
  // (app.css, parts.js) plus these, so the board shows the app as it is now.
  // Add a proposal here when it ships (see README, step 6).
  var SHIPPED = ['moredesign-studio'];

  var script = document.currentScript;
  var designRoot = new URL('../', script.src);
  var params = new URLSearchParams(location.search);
  var proposal = params.get('p') || 'current';
  var html = document.documentElement;

  var layers = SHIPPED.slice();
  if (proposal !== 'current' && layers.indexOf(proposal) < 0) layers.push(proposal);

  var sheets = ['tokens/current.css', 'shared/web.css', 'shared/app.css'];
  layers.forEach(function (id) {
    ['fonts.css', 'tokens.css', 'components.css', 'tweaks.css'].forEach(function (file) {
      sheets.push('proposals/' + id + '/' + file);
    });
  });
  // Parser-inserted so the first paint already has the right styles.
  sheets.forEach(function (href) {
    document.write('<link rel="stylesheet" data-design="' + href + '" href="' + new URL(href, designRoot).href + '">');
  });
  // Structure changes: the last layer wins (each sets window.__proposalStructure).
  layers.forEach(function (id) {
    document.write('<script src="' + new URL('proposals/' + id + '/structure.js', designRoot).href + '"><\/script>');
  });

  html.dataset.proposal = proposal;
  html.dataset.web = params.get('web') || 'light';
  params.forEach(function (value, key) {
    if (key !== 'p' && key !== 'web' && /^[a-z][a-z0-9-]*$/.test(key)) html.dataset[key] = value;
  });
  if (params.get('still') === '1') html.classList.add('still');

  function reloadCss(files) {
    var links = document.querySelectorAll('link[data-design]');
    links.forEach(function (link) {
      var name = link.getAttribute('data-design');
      if (files && !files.some(function (f) { return f === name; })) return;
      var url = new URL(link.href);
      url.searchParams.set('v', Date.now());
      var next = link.cloneNode();
      next.href = url.href;
      next.onload = next.onerror = function () { link.remove(); };
      link.after(next);
    });
  }

  function onChange(files) {
    var cssOnly = files.every(function (f) { return /\.css$/.test(f) && f.indexOf('screens/') !== 0; });
    if (cssOnly) reloadCss(files);
    else location.reload();
  }

  window.__design = {
    proposal: proposal,
    /** Set (or with an empty value, clear) CSS custom properties on :root. */
    applyTweaks: function (vars) {
      Object.keys(vars).forEach(function (name) {
        if (vars[name]) html.style.setProperty(name, vars[name]);
        else html.style.removeProperty(name);
      });
    },
    clearTweaks: function () { html.removeAttribute('style'); },
    setWeb: function (value) { html.dataset.web = value; },
    setOption: function (key, value) { html.dataset[key] = value; },
    token: function (name) { return getComputedStyle(html).getPropertyValue(name).trim(); },
    onChange: onChange,
  };

  var standalone = window.top === window;
  if (standalone && /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && window.EventSource) {
    new EventSource(new URL('__live', designRoot)).onmessage = function (event) {
      onChange(JSON.parse(event.data));
    };
  }
})();
