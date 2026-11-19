/* Hilfe-Center carpd.de/hilfe
   Alle Texte kommen aus hilfe/inhalte.json (dieselbe Datei kann später die App anzeigen).
   Angezeigt wird nur, was dort "status": "ok" hat.
   Der KI-Assistent „Frag CarpD“ fragt die Server-Funktion frag-carpd bei Supabase –
   der Schlüssel für die KI liegt nur dort, nie hier auf der Webseite. */
(function () {
  'use strict';

  var SERVER = 'https://pajfamucnxdhnhrekykr.supabase.co/functions/v1/swift-processor';
  var main = document.getElementById('inhalt');
  var daten = null;
  var sprache = startSprache();

  // ---------- Sprache ----------
  function startSprache() {
    var u = new URLSearchParams(location.search).get('lang');
    if (u === 'de' || u === 'en') return u;
    try { var g = localStorage.getItem('carpd_sprache'); if (g === 'de' || g === 'en') return g; } catch (e) {}
    return (navigator.language || 'de').slice(0, 2).toLowerCase() === 'de' ? 'de' : (['fr', 'it', 'pl', 'cs', 'sk', 'sl', 'hu', 'hr'].indexOf((navigator.language || '').slice(0, 2)) >= 0 ? 'en' : 'de');
  }
  var T = {
    de: { titel: 'Wie können wir helfen?', unter: 'Anleitung, Kostenlos & Pro und über 70 Fragen rund um CarpD.', suchen: 'Suche, z. B. Spots, Offline, Konto löschen …', ki: 'Frag CarpD – unser KI-Assistent', bereiche: 'Themen', haeufig: 'Häufige Fragen', alleFragen: 'Alle Fragen ansehen', anleitung: 'Anleitung', anleitungUnter: 'CarpD von A bis Z – jede Funktion mit Schritten und Praxis-Tipp.', faq: 'Fragen & Antworten', alle: 'Alle', pro: 'Kostenlos & Pro', proUnter: 'Was die kostenlose Version kann – und was CarpD Pro dazu bringt.', funktion: 'Funktion', frei: 'Kostenlos', start: 'Hilfe', so: 'So geht’s', tipp: 'Praxis-Tipp', medien: 'Clip/Screenshot folgt', treffer: function (n) { return n === 1 ? '1 Treffer' : n + ' Treffer'; }, keine: 'Nichts gefunden. Frag einfach den Assistenten – oder schreib uns an ', zurueck: '← Zurück', weiter: 'Weiter →', mehr: 'Mehr dazu', hallo: 'Hi! Ich bin der CarpD-Assistent. Frag mich alles zur App – kurz und ehrlich. Bitte tipp keine persönlichen Daten ein. Tight Lines!', beispiele: ['Sind meine Spots sicher?', 'Was kostet CarpD Pro?', 'Funktioniert CarpD ohne Netz?', 'Wie lösche ich mein Konto?'], denkt: 'Moment …', fehler: 'Gerade komme ich nicht an meine Antworten. Versuch es gleich nochmal – oder schreib an ', vorschau: 'Die KI ist gerade nicht erreichbar – das habe ich in der Hilfe gefunden:', nichtsGefunden: 'Dazu habe ich leider nichts in der Hilfe gefunden. Schreib uns gern an ', limit: 'Für heute sind genug Fragen gestellt. Morgen geht’s weiter – oder schreib uns an ', langsam: 'Nicht so schnell 🙂 Warte kurz und frag dann nochmal – oder schreib uns an ', pause: 'Der Assistent macht gerade Pause. Die Antworten findest du auch in der Suche – oder schreib uns an ', hoert: 'Ich höre zu … loslassen zum Senden.', mikroAus: 'Mikrofon nicht erlaubt – du kannst die Frage auch tippen.', vorlesen: 'Vorlesen', stopp: 'Stopp' },
    en: { titel: 'How can we help?', unter: 'Guide, free & Pro, and more than 70 questions about CarpD.', suchen: 'Search, e.g. swims, offline, delete account …', ki: 'Ask CarpD – our AI assistant', bereiche: 'Topics', haeufig: 'Common questions', alleFragen: 'See all questions', anleitung: 'Guide', anleitungUnter: 'CarpD from A to Z – every feature with steps and a practical tip.', faq: 'Questions & answers', alle: 'All', pro: 'Free & Pro', proUnter: 'What the free version does – and what CarpD Pro adds.', funktion: 'Feature', frei: 'Free', start: 'Help', so: 'How it works', tipp: 'Practical tip', medien: 'Clip/screenshot coming soon', treffer: function (n) { return n === 1 ? '1 result' : n + ' results'; }, keine: 'Nothing found. Just ask the assistant – or write to us at ', zurueck: '← Back', weiter: 'Next →', mehr: 'More', hallo: 'Hi! I’m the CarpD assistant. Ask me anything about the app – short and honest. Please don’t type in personal data. Tight Lines!', beispiele: ['Are my swims safe?', 'How much is CarpD Pro?', 'Does CarpD work offline?', 'How do I delete my account?'], denkt: 'One moment …', fehler: 'I can’t reach my answers right now. Try again in a moment – or write to ', vorschau: 'The AI isn’t reachable right now – this is what I found in the help:', nichtsGefunden: 'Sorry, I couldn’t find anything about that in the help. Feel free to write to us at ', limit: 'That’s enough questions for today. Back tomorrow – or write to us at ', langsam: 'Not so fast 🙂 Wait a moment and ask again – or write to us at ', pause: 'The assistant is taking a break. You can find the answers in the search too – or write to us at ', hoert: 'Listening … release to send.', mikroAus: 'Microphone not allowed – you can type your question instead.', vorlesen: 'Read aloud', stopp: 'Stop' }
  };
  function t(k) { return T[sprache][k]; }
  function txt(o) { return o ? (o[sprache] || o.de) : ''; }

  function spracheSetzen(neu) {
    sprache = neu;
    try { localStorage.setItem('carpd_sprache', neu); } catch (e) {}
    document.documentElement.lang = neu;
    document.getElementById('sprachwahl').textContent = neu === 'de' ? 'EN' : 'DE';
    document.title = (neu === 'de' ? 'Hilfe & FAQ' : 'Help & FAQ') + ' – CarpD';
    document.querySelectorAll('[data-de]').forEach(function (el) { el.innerHTML = el.getAttribute('data-' + neu); });
    document.querySelectorAll('[data-de-ph]').forEach(function (el) { el.placeholder = el.getAttribute('data-' + neu + '-ph'); });
    document.querySelectorAll('[data-de-label]').forEach(function (el) { el.setAttribute('aria-label', el.getAttribute('data-' + neu + '-label')); });
    if (daten) zeigen();
    chatBegruessen(true);
  }
  document.getElementById('sprachwahl').addEventListener('click', function () { spracheSetzen(sprache === 'de' ? 'en' : 'de'); });

  // ---------- Hilfsmittel ----------
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function norm(s) { return String(s).toLowerCase().replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss').replace(/[–—’']/g, ' '); }
  var ok = function (x) { return x.status === 'ok'; };
  function anleitungen() { return daten.anleitung.filter(ok); }
  function fragen() { return daten.faq.filter(ok); }
  function finde(id) {
    if (id === 'vergleich') return { art: 'pro', titel: t('pro'), ziel: '#/pro' };
    var a = daten.anleitung.filter(function (x) { return x.id === id && ok(x); })[0];
    if (a) return { art: 'anleitung', titel: txt(a).titel, ziel: '#/anleitung/' + a.id };
    var f = daten.faq.filter(function (x) { return x.id === id && ok(x); })[0];
    if (f) return { art: 'faq', titel: txt(f).f, ziel: '#/frage/' + f.id };
    return null;
  }
  function linkLeiste(ids) {
    var l = (ids || []).map(finde).filter(Boolean);
    if (!l.length) return '';
    return '<div class="mehr-links">' + l.map(function (x) { return '<a href="' + x.ziel + '">' + esc(x.titel) + '</a>'; }).join('') + '</div>';
  }
  function markieren(text, woerter) {
    var h = esc(text);
    if (!woerter.length) return h;
    // Treffer hervorheben (ohne Rücksicht auf Umlaute nur, wenn genau so geschrieben)
    woerter.forEach(function (w) { if (w.length < 2) return; h = h.replace(new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark>$1</mark>'); });
    return h;
  }
  var ICON = {
    buch: '<path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H19v17H7.5A2.5 2.5 0 0 0 5 21.5zM5 21.5A2.5 2.5 0 0 1 7.5 19H19v3H7.5A2.5 2.5 0 0 1 5 21.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    stern: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    schloss: '<rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="currentColor" stroke-width="2"/>',
    wolke: '<path d="M7 18.5a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 8.6a4.5 4.5 0 0 1-.5 9.9z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    crew: '<circle cx="9" cy="8" r="3.2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17" cy="9" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 19.5c.6-3.3 3-5 6-5s5.4 1.7 6 5M15.5 14.6c2.6-.3 4.7 1.2 5.3 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    karte: '<rect x="3" y="5.5" width="18" height="13" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 10h18" stroke="currentColor" stroke-width="2"/>'
  };
  var SUCH_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="m15.5 15.5 5 5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';

  // ---------- Suche (findet auch Wortteile, Umlaute egal) ----------
  function suchen(q) {
    var woerter = norm(q).split(/\s+/).filter(function (w) { return w.length > 1; });
    if (!woerter.length) return [];
    var treffer = [];
    function pruefen(art, x, titel, rest) {
      var t1 = norm(titel), t2 = norm(rest);
      var punkte = 0;
      for (var i = 0; i < woerter.length; i++) {
        var w = woerter[i];
        if (t1.indexOf(w) >= 0) punkte += 3; else if (t2.indexOf(w) >= 0) punkte += 1; else return;
      }
      treffer.push({ art: art, x: x, punkte: punkte });
    }
    fragen().forEach(function (f) { var s = txt(f); pruefen('faq', f, s.f, s.a); });
    anleitungen().forEach(function (a) { var s = txt(a); pruefen('anleitung', a, s.titel, s.was + ' ' + s.schritte.join(' ') + ' ' + s.tipp); });
    treffer.sort(function (a, b) { return b.punkte - a.punkte; });
    return treffer;
  }

  // ---------- Bausteine ----------
  function frageHtml(f, woerter, offen) {
    var s = txt(f);
    return '<details class="frage" id="frage-' + f.id + '"' + (offen ? ' open' : '') + '><summary>' + markieren(s.f, woerter || []) + '</summary><div class="antwort"><p>' + markieren(s.a, woerter || []) + '</p>' + linkLeiste(f.links) + '</div></details>';
  }
  function kopf(mitSuche) {
    return '<div class="hilfe-kopf"><div class="breite schmal"><h1>' + esc(t('titel')) + '</h1><p>' + esc(t('unter')) + '</p>' +
      (mitSuche ? '<form class="suche" id="suchForm" role="search"><input id="suchFeld" type="search" placeholder="' + esc(t('suchen')) + '" aria-label="' + esc(t('suchen')) + '" autocomplete="off">' + SUCH_ICON + '</form>' : '') +
      '<div class="ki-start"><button class="knopf" type="button" data-chat-oeffnen>' + esc(t('ki')) + '</button></div></div></div>';
  }
  function brot(teile) {
    return '<div class="brotkrumen"><a href="#/">' + esc(t('start')) + '</a>' + teile.map(function (p) { return ' › ' + (p[1] ? '<a href="' + p[1] + '">' + esc(p[0]) + '</a>' : esc(p[0])); }).join('') + '</div>';
  }

  // ---------- Seiten ----------
  function seiteStart() {
    var kacheln = daten.kacheln.map(function (k) {
      return '<a class="kachel" href="' + k.ziel + '"><div class="icon"><svg viewBox="0 0 24 24" aria-hidden="true">' + (ICON[k.icon] || '') + '</svg></div><div><b>' + esc(txt(k).titel) + '</b><span>' + esc(txt(k).text) + '</span></div></a>';
    }).join('');
    var haeufig = daten.startFaq.map(function (id) { return daten.faq.filter(function (f) { return f.id === id && ok(f); })[0]; }).filter(Boolean).map(function (f) { return frageHtml(f); }).join('');
    main.innerHTML = '<div class="hilfe-kopf"><div class="breite schmal"><h1>' + esc(t('titel')) + '</h1><p>' + esc(t('unter')) + '</p><div id="chatPlatz"></div>' +
      '<div class="abschnitt-titel such-titel">' + esc(sprache === 'de' ? 'Oder selbst suchen' : 'Or search yourself') + '</div><form class="suche" id="suchForm" role="search"><input id="suchFeld" type="search" placeholder="' + esc(t('suchen')) + '" aria-label="' + esc(t('suchen')) + '" autocomplete="off">' + SUCH_ICON + '</form></div></div>' +
      '<div class="breite schmal"><div id="suchErgebnis"></div><div id="startInhalt"><div class="kacheln">' + kacheln + '</div><div class="abschnitt-titel">' + esc(t('haeufig')) + '</div>' + haeufig + '<p style="margin-top:14px"><a class="knopf leer" href="#/faq">' + esc(t('alleFragen')) + '</a></p></div></div>';
    var feld = document.getElementById('suchFeld');
    var q = decodeURIComponent((location.hash.split('?q=')[1] || ''));
    if (q) { feld.value = q; suchAnzeigen(q); }
    feld.addEventListener('input', function () { suchAnzeigen(feld.value); });
    document.getElementById('suchForm').addEventListener('submit', function (e) { e.preventDefault(); feld.blur(); });
  }
  function suchAnzeigen(q) {
    var box = document.getElementById('suchErgebnis'), start = document.getElementById('startInhalt');
    if (!q || q.trim().length < 2) { box.innerHTML = ''; start.hidden = false; return; }
    var woerter = norm(q).split(/\s+/).filter(function (w) { return w.length > 1; });
    var roh = q.trim().split(/\s+/);
    var tr = suchen(q);
    start.hidden = true;
    if (!tr.length) { box.innerHTML = '<div class="abschnitt-titel">' + esc(t('treffer')(0)) + '</div><p class="leer-hinweis">' + esc(t('keine')) + '<a href="mailto:' + daten.kontakt + '">' + daten.kontakt + '</a>.</p>'; return; }
    box.innerHTML = '<div class="abschnitt-titel">' + esc(t('treffer')(tr.length)) + '</div>' + tr.slice(0, 25).map(function (r) {
      if (r.art === 'faq') return frageHtml(r.x, roh, false);
      var s = txt(r.x);
      return '<a class="zeile" href="#/anleitung/' + r.x.id + '"><div>' + markieren(s.titel, roh) + '<small>' + esc(t('anleitung')) + ' · ' + esc(s.was.slice(0, 90)) + '…</small></div><span class="pfeil">›</span></a><div style="height:10px"></div>';
    }).join('');
    void woerter;
  }
  function seiteAnleitung() {
    var html = brot([[t('anleitung')]]) + '<h1 class="seite-titel">' + esc(t('anleitung')) + '</h1><p class="neben">' + esc(t('anleitungUnter')) + '</p>';
    daten.bereiche.forEach(function (b) {
      var eintraege = anleitungen().filter(function (a) { return a.bereich === b.id; });
      if (!eintraege.length) return;
      html += '<div class="abschnitt-titel">' + esc(txt(b)) + '</div><div class="liste">' + eintraege.map(function (a) {
        return '<a class="zeile" href="#/anleitung/' + a.id + '"><div>' + esc(txt(a).titel) + '</div><span class="pfeil">›</span></a>';
      }).join('') + '</div>';
    });
    main.innerHTML = '<div class="breite schmal">' + html + '</div>';
  }
  function seiteAnleitungEinzeln(id) {
    var alle = anleitungen();
    var i = alle.map(function (a) { return a.id; }).indexOf(id);
    if (i < 0) return seiteAnleitung();
    var a = alle[i], s = txt(a);
    var bereich = daten.bereiche.filter(function (b) { return b.id === a.bereich; })[0];
    var vor = alle[i - 1], nach = alle[i + 1];
    main.innerHTML = '<div class="breite schmal anleitung-seite">' + brot([[t('anleitung'), '#/anleitung'], [txt(bereich)]]) +
      '<h1 class="seite-titel">' + esc(s.titel) + '</h1><p class="was">' + esc(s.was) + '</p>' +
      '<div class="abschnitt-titel">' + esc(t('so')) + '</div><ol class="schritte">' + s.schritte.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol>' +
      '<div class="tipp"><b>' + esc(t('tipp')) + ':</b> ' + esc(s.tipp) + '</div>' +
      '<div class="medien" aria-hidden="true">▶ ' + esc(t('medien')) + '</div>' +
      '<div class="weiter-nav">' + (vor ? '<a class="knopf leer" href="#/anleitung/' + vor.id + '">' + esc(t('zurueck')) + '</a>' : '<span></span>') + (nach ? '<a class="knopf leer" href="#/anleitung/' + nach.id + '">' + esc(t('weiter')) + '</a>' : '') + '</div></div>';
  }
  function seiteFaq(thema, offenId) {
    var themen = '<div class="themen"><a href="#/faq" class="' + (!thema ? 'aktiv' : '') + '">' + esc(t('alle')) + '</a>' + daten.themen.map(function (th) { return '<a href="#/faq/' + th.id + '" class="' + (thema === th.id ? 'aktiv' : '') + '">' + esc(txt(th)) + '</a>'; }).join('') + '</div>';
    var html = '';
    daten.themen.forEach(function (th) {
      if (thema && thema !== th.id) return;
      var liste = fragen().filter(function (f) { return f.thema === th.id; });
      if (!liste.length) return;
      html += '<div class="abschnitt-titel">' + esc(txt(th)) + '</div>' + liste.map(function (f) { return frageHtml(f, [], f.id === offenId); }).join('');
    });
    main.innerHTML = '<div class="breite schmal">' + brot([[t('faq')]]) + '<h1 class="seite-titel">' + esc(t('faq')) + '</h1>' + themen + html + '</div>';
    if (offenId) { var el = document.getElementById('frage-' + offenId); if (el) setTimeout(function () { el.scrollIntoView({ block: 'center' }); }, 30); }
  }
  function seitePro() {
    var v = daten.vergleich;
    var zeilen = v.gruppen.map(function (g) {
      return '<tr class="gruppe"><td colspan="3">' + esc(txt(g)) + '</td></tr>' + g.zeilen.filter(ok).map(function (z) {
        var s = txt(z);
        function zelle(w) { return w === '✓' ? '<span class="ja" aria-label="ja">✓</span>' : w === '–' ? '<span class="nein" aria-label="nein">–</span>' : esc(w); }
        return '<tr><td>' + esc(s.funktion) + '</td><td>' + zelle(s.frei) + '</td><td class="pro">' + zelle(s.pro) + '</td></tr>';
      }).join('');
    }).join('');
    main.innerHTML = '<div class="breite schmal">' + brot([[t('pro')]]) + '<h1 class="seite-titel">' + esc(t('pro')) + '</h1><p class="neben">' + esc(t('proUnter')) + '</p><div class="hinweis preis-hinweis">' + esc(txt(v.preise)) + '</div>' +
      '<table class="tabelle"><thead><tr><th>' + esc(t('funktion')) + '</th><th>' + esc(t('frei')) + '</th><th class="pro">Pro</th></tr></thead><tbody>' + zeilen + '</tbody></table>' +
      '<div class="abschnitt-titel">' + esc(t('faq')) + '</div>' + fragen().filter(function (f) { return f.thema === 'abo'; }).map(function (f) { return frageHtml(f); }).join('') + '</div>';
  }

  function zeigen() {
    var h = location.hash.replace(/^#\/?/, '');
    var teile = h.split('?')[0].split('/');
    if (teile[0] === 'anleitung' && teile[1]) seiteAnleitungEinzeln(teile[1]);
    else if (teile[0] === 'anleitung') seiteAnleitung();
    else if (teile[0] === 'faq') seiteFaq(teile[1] || null, null);
    else if (teile[0] === 'frage') { var f = daten.faq.filter(function (x) { return x.id === teile[1]; })[0]; seiteFaq(null, f ? f.id : null); }
    else if (teile[0] === 'pro') seitePro();
    else seiteStart();
    main.querySelectorAll('[data-chat-oeffnen]').forEach(function (b) { b.addEventListener('click', chatOeffnen); });
    chatPlatzieren();
    if (teile[0] !== 'frage') window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', zeigen);

  // ---------- Assistent ----------
  var chat = document.getElementById('chat'), chatKnopf = document.getElementById('chatKnopf');
  var verlauf = document.getElementById('chatVerlauf'), form = document.getElementById('chatForm'), feld = document.getElementById('chatFeld');
  var gespraech = []; // { role, content } – nur die letzten Wechsel gehen mit
  var begruesst = false, wartet = false;

  // Auf der Startseite steht der Chat oben in der Seite, sonst schwebt er unten rechts
  function chatPlatzieren() {
    var platz = document.getElementById('chatPlatz');
    if (beobachter) { beobachter.disconnect(); beobachter = null; }
    if (platz) {
      platz.appendChild(chat);
      chat.classList.add('eingebettet');
      chat.hidden = false;
      document.getElementById('chatZu').hidden = true;
      chatBegruessen(false);
      // Knopf unten rechts nur zeigen, wenn der große Chat oben nicht mehr zu sehen ist
      if ('IntersectionObserver' in window) {
        beobachter = new IntersectionObserver(function (e) { chatKnopf.hidden = e[0].isIntersecting; }, { threshold: 0.15 });
        beobachter.observe(chat);
      } else chatKnopf.hidden = false;
    } else {
      document.body.appendChild(chat);
      chat.classList.remove('eingebettet');
      chat.hidden = true; chatKnopf.hidden = false;
      document.getElementById('chatZu').hidden = false;
    }
  }
  var beobachter = null;
  function chatOeffnen() {
    if (chat.classList.contains('eingebettet')) { chat.scrollIntoView({ behavior: 'smooth', block: 'center' }); setTimeout(function () { feld.focus({ preventScroll: true }); }, 400); return; }
    chat.hidden = false; chatKnopf.hidden = true; chatKnopf.setAttribute('aria-expanded', 'true');
    chatBegruessen(false);
    setTimeout(function () { feld.focus(); }, 50);
  }
  function chatSchliessen() { chat.hidden = true; chatKnopf.hidden = false; chatKnopf.setAttribute('aria-expanded', 'false'); stillsein(); }
  chatKnopf.addEventListener('click', chatOeffnen);
  document.getElementById('chatZu').addEventListener('click', chatSchliessen);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !chat.hidden && !chat.classList.contains('eingebettet')) chatSchliessen(); });

  function chatBegruessen(neu) {
    if (begruesst && !neu) return;
    if (neu && gespraech.length) return; // laufendes Gespräch nicht löschen
    begruesst = true;
    verlauf.innerHTML = '';
    blase('bot', t('hallo'), [], false);
    var v = document.createElement('div'); v.className = 'vorschlaege';
    t('beispiele').forEach(function (b) { var k = document.createElement('button'); k.type = 'button'; k.textContent = b; k.addEventListener('click', function () { fragen_(b); }); v.appendChild(k); });
    verlauf.appendChild(v);
  }
  function blase(wer, text, links, mitLautsprecher) {
    var b = document.createElement('div'); b.className = 'blase ' + wer;
    b.innerHTML = esc(text).replace(/\n/g, '<br>');
    if (wer === 'bot' && links && links.length) b.insertAdjacentHTML('beforeend', linkLeiste(links));
    if (wer === 'bot' && mitLautsprecher && 'speechSynthesis' in window) {
      var fuss = document.createElement('div'); fuss.className = 'blase-fuss';
      var l = document.createElement('button'); l.type = 'button'; l.className = 'lautsprecher'; l.setAttribute('aria-label', t('vorlesen'));
      l.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4zM15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      l.addEventListener('click', function () { if (l.classList.contains('spricht')) stillsein(); else vorlesen(text, l); });
      fuss.appendChild(l); fuss.insertAdjacentHTML('beforeend', '<span>' + esc(sprache === 'de' ? 'KI-Antwort, ohne Gewähr' : 'AI answer, no guarantee') + '</span>');
      b.appendChild(fuss);
      b._lautsprecher = l;
    }
    if (wer === 'bot') {
      // Antworten mit dem App-Icon davor
      var huelle = document.createElement('div'); huelle.className = 'bot-zeile';
      huelle.innerHTML = '<img src="../apple-touch-icon.png" alt="" width="30" height="30">';
      huelle.appendChild(b); b._huelle = huelle;
      verlauf.appendChild(huelle);
    } else verlauf.appendChild(b);
    verlauf.scrollTop = verlauf.scrollHeight;
    return b;
  }
  function frageSprache(q) {
    // Antwort in der Sprache der Frage: einfache Erkennung, sonst Seitensprache
    var n = ' ' + q.toLowerCase() + ' ';
    var de = (n.match(/ (ich|ist|und|wie|was|der|die|das|kann|mein|meine|nicht|gibt|wo|warum|kostet|ohne|mit) /g) || []).length;
    var en = (n.match(/ (i|is|and|how|what|the|can|my|not|does|do|where|why|cost|without|with|are) /g) || []).length;
    return de > en ? 'de' : en > de ? 'en' : sprache;
  }
  var FUELL = ['sind','ist','meine','mein','meinen','ich','wie','was','wo','wann','warum','kann','man','der','die','das','den','dem','ein','eine','einen','und','oder','mit','fur','bei','auf','in','im','zu','es','gibt','habe','hab','du','ihr','euch','are','is','my','the','a','an','how','what','where','when','why','can','i','do','does','to','of','in','on','for','and','or','it','you','your','there'];
  var AEHNLICH = { sicher: ['geschutzt', 'geheim', 'privat'], safe: ['protected', 'secret', 'private'], kosten: ['kostet', 'preis', 'pro'], kostet: ['preis', 'pro'], cost: ['price', 'pro'], netz: ['offline', 'ohne netz'], offline: ['ohne netz', 'without signal'], internet: ['netz', 'signal'], loschen: ['loschen', 'delete'], handy: ['handy', 'phone'], geld: ['kostet', 'preis'] };
  function suchenLocker(q) {
    var woerter = norm(q).replace(/[?!.,]/g, ' ').split(/\s+/).filter(function (w) { return w.length > 1 && FUELL.indexOf(w) < 0; });
    if (!woerter.length) return [];
    var tr = [];
    function pruefen(art, x, titel, rest) {
      var t1 = norm(titel), t2 = norm(rest), p = 0;
      woerter.forEach(function (w) {
        var formen = [w, w.length > 5 ? w.slice(0, w.length - 2) : w].concat(AEHNLICH[w] || []);
        var best = 0;
        formen.forEach(function (f) { if (t1.indexOf(f) >= 0) best = Math.max(best, 3); else if (t2.indexOf(f) >= 0) best = Math.max(best, 1); });
        p += best;
      });
      if (p >= Math.min(3, woerter.length)) tr.push({ art: art, x: x, punkte: p + (art === 'faq' ? 0.5 : 0) });
    }
    fragen().forEach(function (f) { var s = txt(f); pruefen('faq', f, s.f, s.a); });
    anleitungen().forEach(function (a) { var s = txt(a); pruefen('anleitung', a, s.titel, s.was + ' ' + s.tipp); });
    tr.sort(function (a, b) { return b.punkte - a.punkte; });
    return tr;
  }
  function lokaleAntwort(q) {
    var tr = suchenLocker(q).slice(0, 3);
    if (!tr.length) return { antwort: t('nichtsGefunden') + daten.kontakt + '.', links: [] };
    var erste = tr[0];
    var text = erste.art === 'faq' ? txt(erste.x).a : txt(erste.x).was;
    return { antwort: t('vorschau') + '\n\n' + text, links: tr.map(function (r) { return r.x.id; }) };
  }
  function fragen_(q) {
    q = String(q || '').trim().slice(0, 300);
    if (!q || wartet) return;
    if (form.website.value) return; // Spam-Falle
    var v = verlauf.querySelector('.vorschlaege'); if (v) v.remove();
    blase('ich', q);
    feld.value = '';
    wartet = true;
    var denkt = blase('bot', t('denkt')); denkt.classList.add('tippt');
    var fs = frageSprache(q);
    var timeout = new Promise(function (_, nein) { setTimeout(function () { nein(new Error('zeit')); }, 30000); });
    Promise.race([fetch(SERVER, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ frage: q, sprache: fs, verlauf: gespraech.slice(-6) }) }), timeout])
      .then(function (r) {
        if (r.status === 429) return r.json().catch(function () { return {}; }).then(function (x) { return { antwort: (x.grund === 'minute' ? t('langsam') : x.grund === 'monat' ? t('pause') : t('limit')) + daten.kontakt + '.', links: [], limit: true }; });
        if (r.status === 404 || r.status >= 500) throw new Error('server');
        return r.json();
      })
      .catch(function () { return lokaleAntwort(q); })
      .then(function (d) {
        denkt._huelle.remove();
        var b = blase('bot', d.antwort || (t('fehler') + daten.kontakt), d.links || [], true);
        if (!d.limit) { gespraech.push({ role: 'user', content: q }); gespraech.push({ role: 'assistant', content: d.antwort || '' }); }
        if (document.getElementById('autoVorlesen').checked && b._lautsprecher) vorlesen(d.antwort, b._lautsprecher);
        wartet = false;
      });
  }
  form.addEventListener('submit', function (e) { e.preventDefault(); fragen_(feld.value); });

  // ---------- Vorlesen (Stimme des Geräts) ----------
  var stimmen = [];
  function stimmenLaden() { stimmen = window.speechSynthesis ? speechSynthesis.getVoices() : []; }
  if ('speechSynthesis' in window) {
    stimmenLaden(); speechSynthesis.onvoiceschanged = stimmenLaden;
    document.getElementById('vorlesenSchalter').hidden = false;
    try { document.getElementById('autoVorlesen').checked = localStorage.getItem('carpd_vorlesen') === 'an'; } catch (e) {}
    document.getElementById('autoVorlesen').addEventListener('change', function (e) { try { localStorage.setItem('carpd_vorlesen', e.target.checked ? 'an' : 'aus'); } catch (x) {} });
  }
  function besteStimme(lang) {
    var passend = stimmen.filter(function (v) { return v.lang && v.lang.toLowerCase().indexOf(lang) === 0; });
    if (!passend.length) return null;
    var gut = /(premium|enhanced|natural|neural|siri|google|anna|helena|petra|markus|daniel|samantha|serena|moira|karen)/i;
    var land = lang === 'de' ? /^de-de/i : /^en-(gb|us)/i;
    passend.sort(function (a, b) { return punkte(b) - punkte(a); });
    function punkte(v) { return (v.localService ? 8 : 0) + (gut.test(v.name) ? 4 : 0) + (land.test(v.lang) ? 2 : 0); } // Stimmen auf dem Gerät zuerst – Online-Stimmen schicken den Text an Google o. Ä.
    return passend[0];
  }
  var aktiverKnopf = null;
  function vorlesen(text, knopf) {
    if (!('speechSynthesis' in window)) return;
    stillsein();
    var lang = frageSprache(text) || sprache;
    var u = new SpeechSynthesisUtterance(text.replace(/\n+/g, ' '));
    var s = besteStimme(lang); if (s) u.voice = s;
    u.lang = s ? s.lang : (lang === 'de' ? 'de-DE' : 'en-GB');
    u.rate = 0.95; u.pitch = 1;
    aktiverKnopf = knopf; knopf.classList.add('spricht'); knopf.setAttribute('aria-label', t('stopp'));
    u.onend = u.onerror = function () { knopf.classList.remove('spricht'); knopf.setAttribute('aria-label', t('vorlesen')); };
    speechSynthesis.speak(u);
  }
  function stillsein() { if ('speechSynthesis' in window) speechSynthesis.cancel(); if (aktiverKnopf) aktiverKnopf.classList.remove('spricht'); }

  // ---------- Spracheingabe: gedrückt halten zum Sprechen ----------
  var Erkennung = window.SpeechRecognition || window.webkitSpeechRecognition;
  var mikro = document.getElementById('mikro'), hoerHinweis = document.getElementById('hoerHinweis');
  if (Erkennung) {
    mikro.hidden = false;
    var erk = null, text = '', aktiv = false;
    var start = function (e) {
      e.preventDefault();
      if (aktiv || wartet) return;
      stillsein();
      erk = new Erkennung();
      erk.lang = sprache === 'de' ? 'de-DE' : 'en-GB';
      erk.interimResults = true; erk.continuous = true; erk.maxAlternatives = 1;
      text = ''; aktiv = true;
      erk.onresult = function (ev) { var s = ''; for (var i = 0; i < ev.results.length; i++) s += ev.results[i][0].transcript; text = s; feld.value = s; };
      erk.onerror = function (ev) { if (ev.error === 'not-allowed' || ev.error === 'service-not-allowed') { hoerHinweis.textContent = t('mikroAus'); hoerHinweis.hidden = false; } };
      erk.onend = function () { aktiv = false; mikro.classList.remove('hoert'); hoerHinweis.hidden = true; if (text.trim()) fragen_(text); };
      try { erk.start(); mikro.classList.add('hoert'); hoerHinweis.textContent = t('hoert'); hoerHinweis.hidden = false; } catch (x) { aktiv = false; }
    };
    var stopp = function () { if (erk && aktiv) erk.stop(); };
    mikro.addEventListener('pointerdown', start);
    mikro.addEventListener('pointerup', stopp);
    mikro.addEventListener('pointerleave', stopp);
    mikro.addEventListener('pointercancel', stopp);
    mikro.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    // Tastatur: Leertaste/Enter gedrückt halten
    mikro.addEventListener('keydown', function (e) { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) start(e); });
    mikro.addEventListener('keyup', function (e) { if (e.key === ' ' || e.key === 'Enter') stopp(); });
  }

  // ---------- Start ----------
  fetch('inhalte.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (d) {
    daten = d;
    spracheSetzen(sprache);
    if (new URLSearchParams(location.search).get('frag') === '1') chatOeffnen();
  }).catch(function () {
    main.innerHTML = '<div class="breite schmal" style="padding:40px 20px">Die Hilfe konnte nicht geladen werden. Schreib uns an <a href="mailto:info@carpd.de">info@carpd.de</a>.</div>';
  });
})();
