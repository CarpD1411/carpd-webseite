/* CarpD-Gründerpreis – Abschnitt + Formular für carpd.de (Startseite) und carpd.de/gruender/.
 *
 * ┌─────────────────────────────────────────────────────────────────────────────────────────┐
 * │  ALLE WERTE HIER ÄNDERN (Preise, Fristen, Plätze, Gratismonat) – sonst nirgends.          │
 * └─────────────────────────────────────────────────────────────────────────────────────────┘
 */
var GRUENDER = {
  testPlaetze: 200,             // so viele Testangler-Plätze (muss zu GRENZE in der Server-Funktion passen)
  testBis: '2026-12-31',        // letzter Tag der Testangler-Anmeldung
  wechselAb: '2027-01-01',      // ab diesem Tag (oder wenn die Testangler voll sind) ist der Gründerpreis die Hauptaktion
  launch: '2027-03-01',         // Start in den Stores
  gruenderBis: '2027-03-15',    // letzter Tag, an dem man den Gründerpreis abschließen kann (Warteliste)
  gratisMonat: true,            // Gründer-Abo startet mit 1 Monat gratis
  preise: {
    // Deutschland (Euro)
    de: { gruender: '39,99 €', jahr: '49,99 €', monat: '5,99 €', monatImJahr: '71,88 €' },
    // England (Pfund) – umgerechnet am 20.11.2026 (Kurs ca. 0,86 £/€, in England 20 % statt 19 % Steuer),
    // so dass nach Steuer mindestens so viel übrig bleibt wie in Deutschland. null = „Preis in £ folgt“.
    en: { gruender: '£34.99', jahr: '£44.99', monat: '£4.99', monatImJahr: '£59.88' }
  },
  server: 'https://pajfamucnxdhnhrekykr.supabase.co/functions/v1/warteliste'
};

(function () {
  'use strict';

  // ---------- Texte (Deutsch / Englisch) ----------
  var T = {
    de: {
      titel: 'Keinen Platz mehr bekommen? Sichere dir den Gründerpreis.',
      titelVorn: 'Sichere dir den CarpD-Gründerpreis.',
      einleitung: 'Trag dich vor dem Start in die Warteliste ein und hol dir CarpD Pro dauerhaft günstiger.',
      proJahr: 'im Jahr',
      statt: 'statt',
      monatHinweis: function (p) { return 'regulär ' + p.jahr + ' ab dem Start · oder ' + p.monatImJahr + ' bei monatlicher Zahlung (12 × ' + p.monat + ')'; },
      preisFolgt: 'Preis in £ folgt',
      punkte: ['Solange dein Abo läuft', 'Gründer-Abzeichen in der App', 'Nur für die Warteliste – nur bis zum Launch'],
      gratis: 'Mit 1 Monat gratis zum Start',
      knopf: 'Gründerpreis sichern',
      bedingungen: 'Bedingungen',
      formTitel: 'Gründerpreis sichern',
      email: 'Deine E-Mail-Adresse', emailPh: 'deine@email.de',
      vorname: 'Vorname', optional: '(freiwillig)', vornamePh: 'Max',
      geraet: 'Dein Handy', land: 'Dein Land', de: 'Deutschland', uk: 'England',
      zustimmung: 'Ich möchte Infos zu CarpD und zu meinem Gründerpreis per Mail bekommen (Abmelden jederzeit). Mehr in der <a href="{d}#warteliste">Datenschutzerklärung</a>.',
      senden: 'Gründerpreis sichern',
      klein: 'Du bekommst eine Mail zur Bestätigung. Nur bestätigte E-Mails bekommen den Gründerpreis.',
      danke: 'Du bist dabei! Bitte bestätige noch deine E-Mail. Zum Launch am 01.03.2027 bekommst du deinen Gründerpreis per Mail. Melde dich in der App am besten mit derselben E-Mail an.',
      vorschau: 'Vorschau: Hier würde jetzt die Bestätigungs-Mail verschickt. Es wurde nichts gesendet.',
      fEmail: 'Bitte prüf deine E-Mail-Adresse.',
      fHaken: 'Bitte setz noch das Häkchen.',
      fServer: 'Das hat nicht geklappt. Bitte versuch es später noch einmal.',
      fNetz: 'Keine Verbindung. Bitte versuch es später noch einmal.',
      moment: 'Einen Moment …',
      beendet: 'Die Aktion Gründerpreis ist beendet. Danke an alle Gründer!',
      testVoll: 'Alle Plätze vergeben',
      testBeendet: 'Testangler-Anmeldung beendet',
      testZuText: 'Danke für euer Interesse! Sichere dir jetzt den Gründerpreis.',
      kopfKnopf: 'Gründerpreis sichern',
      datenschutz: 'datenschutz.html'
    },
    en: {
      titel: 'Missed a test spot? Secure the founder price.',
      titelVorn: 'Secure the CarpD founder price.',
      einleitung: 'Join the waiting list before launch and get CarpD Pro for less – for as long as you stay.',
      proJahr: 'per year',
      statt: 'instead of',
      monatHinweis: function (p) { return 'regular ' + p.jahr + ' from launch · or ' + p.monatImJahr + ' when paying monthly (12 × ' + p.monat + ')'; },
      preisFolgt: '£ price coming soon',
      punkte: ['As long as your subscription runs', 'Founder badge in the app', 'Waiting list only – only until launch'],
      gratis: 'Starts with 1 month free',
      knopf: 'Secure founder price',
      bedingungen: 'Terms',
      formTitel: 'Secure founder price',
      email: 'Your email address', emailPh: 'you@email.com',
      vorname: 'First name', optional: '(optional)', vornamePh: 'Sam',
      geraet: 'Your phone', land: 'Your country', de: 'Germany', uk: 'England',
      zustimmung: 'I would like to receive information about CarpD and my founder price by email (unsubscribe at any time). More in the <a href="{d}#warteliste">privacy notice</a>.',
      senden: 'Secure founder price',
      klein: 'You will receive an email to confirm. Only confirmed emails get the founder price.',
      danke: 'You are in! Please confirm your email address. At launch on 1 March 2027 we will email you your founder price. Tip: sign in to the app with the same email address.',
      vorschau: 'Preview: the confirmation email would be sent now. Nothing was sent.',
      fEmail: 'Please check your email address.',
      fHaken: 'Please tick the box.',
      fServer: 'That did not work. Please try again later.',
      fNetz: 'No connection. Please try again later.',
      moment: 'One moment …',
      beendet: 'The founder price offer has ended. Thanks to all founders!',
      testVoll: 'All spots taken',
      testBeendet: 'Test angler sign-up closed',
      testZuText: 'Thanks for your interest! Secure the founder price now.',
      kopfKnopf: 'Secure founder price',
      datenschutz: 'uk/privacy.html'
    }
  };

  // Bedingungen – wörtlich wie vorgegeben (Gratismonat: entschieden JA am 20.11.2026)
  var BEDINGUNGEN = {
    de: {
      titel: 'Gründerpreis CarpD Pro',
      punkte: [
        'CarpD Pro zum Gründerpreis von 39,99 € pro Jahr statt regulär 49,99 € pro Jahr bzw. 5,99 € pro Monat (12 × 5,99 € = 71,88 € im Jahr).',
        'Der Gründerpreis gilt, solange dein Abo ohne Unterbrechung läuft – vorbehaltlich Anpassungen durch App Store bzw. Google Play aufgrund von Steuer- oder Währungsänderungen.',
        'Das Abo verlängert sich nach den Bedingungen von App Store bzw. Google Play, bis du kündigst.',
        'Inklusive Gründerstatus (Abzeichen) in der App, solange das Gründer-Abo aktiv ist.',
        'Kündigst du oder läuft dein Abo aus, entfallen Gründerpreis und Gründerstatus. Ein späteres Abo ist nur zum dann gültigen Normalpreis möglich.',
        'Warteliste: Der Gründerpreis kann nur bis einschließlich 15.03.2027 abgeschlossen werden und nur mit der E-Mail-Adresse, die auf der Warteliste bestätigt wurde.',
        'Testangler: erhalten 1 Jahr CarpD Pro kostenlos. Danach können sie den Gründerpreis ohne Frist abschließen. Das Gratisjahr verlängert sich nicht automatisch und kostet nichts.',
        'Das Gründer-Abo startet mit 1 Monat gratis.',
        'Abschluss, Zahlung und Kündigung laufen über App Store bzw. Google Play. Kündigen kannst du jederzeit in deinen Store-Einstellungen.',
        'Gesetzliche Rechte (z. B. Widerrufsrecht) bleiben unberührt.'
      ]
    },
    en: {
      titel: 'CarpD Pro Founder Price',
      punkte: [
        // Preise in £ aus GRUENDER.preise.en – solange dort null steht, kommt der Hinweis „£ prices follow“
        (function (p) {
          return p.gruender
            ? 'CarpD Pro at the founder price of ' + p.gruender + ' per year instead of the regular ' + p.jahr + ' per year or ' + p.monat + ' per month (12 × ' + p.monat + ' = ' + p.monatImJahr + ' per year).'
            : 'CarpD Pro at a founder price per year in pounds (£), below the regular yearly and monthly price. The exact £ prices will be shown here before launch.';
        })(GRUENDER.preise.en),
        'The founder price applies as long as your subscription runs without interruption – subject to adjustments by the App Store or Google Play due to tax or currency changes.',
        'The subscription renews according to the terms of the App Store or Google Play until you cancel.',
        'Includes founder status (badge) in the app while the founder subscription is active.',
        'If you cancel or your subscription expires, the founder price and founder status end. A later subscription is only available at the regular price at that time.',
        'Waiting list: the founder price can only be purchased until 15 March 2027 (inclusive) and only with the email address confirmed on the waiting list.',
        'Test anglers: receive 1 year of CarpD Pro free of charge. Afterwards they can take the founder price with no deadline. The free year does not renew automatically and costs nothing.',
        'The founder subscription starts with 1 month free.',
        'Purchase, payment and cancellation are handled via the App Store or Google Play. You can cancel at any time in your store settings.',
        'Statutory rights (e.g. right of withdrawal) remain unaffected.'
      ]
    }
  };

  // ---------- Hilfen ----------
  var suche = new URLSearchParams(location.search);
  // Vorschau: auf dem Mac (nicht carpd.de) wird nichts gesendet; ?datum=2027-01-02 und ?voll zum Ausprobieren
  var VORSCHAU = !/(^|\.)carpd\.de$/.test(location.hostname);
  var heute = (VORSCHAU && suche.get('datum')) || new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Berlin' });
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // Kanal: ?kanal=messe / meta / … – sonst entscheidet der Server anhand von utm_source
  var KANAELE = ['landingpage', 'messe', 'meta', 'sonstiges'];
  var kanal = (suche.get('kanal') || '').toLowerCase();
  if (KANAELE.indexOf(kanal) < 0) kanal = '';
  var quelle = (suche.get('utm_source') || (kanal && kanal !== 'landingpage' ? kanal : '') || 'webseite').slice(0, 40);

  // ---------- Abschnitt bauen ----------
  function preisBlock(sp) {
    var t = T[sp], p = GRUENDER.preise[sp];
    if (!p.gruender) return '<p class="gp-preis"><span class="gp-neu">' + esc(t.preisFolgt) + '</span></p>';
    // Bewusst KEIN durchgestrichener Preis (gibt es vor dem Start noch nicht zu kaufen) – „regulär … ab dem Start“ darunter
    return '<p class="gp-preis"><span class="gp-neu">' + esc(p.gruender) + '</span><span class="gp-jahr">' + esc(t.proJahr) + '</span></p>' +
      '<p class="gp-unter">' + esc(t.monatHinweis(p)) + '</p>';
  }

  function bauen(ziel, sp, offen, pfad) {
    var t = T[sp], b = BEDINGUNGEN[sp];
    var vorn = ziel.getAttribute('data-vorn') === 'ja';
    var punkte = t.punkte.concat(GRUENDER.gratisMonat ? [t.gratis] : []);
    ziel.innerHTML =
      '<div class="breite gp">' +
        '<div class="gp-text">' +
          '<p class="gp-marke">Carp<span class="d">D</span> Pro · ' + (sp === 'en' ? 'Founder price' : 'Gründerpreis') + '</p>' +
          '<h2>' + esc(vorn ? t.titelVorn : t.titel) + '</h2>' +
          '<p class="gp-einleitung">' + esc(t.einleitung) + '</p>' +
          preisBlock(sp) +
          '<ul class="gp-punkte">' + punkte.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
          '<details class="gp-bedingungen"><summary>' + esc(t.bedingungen) + '</summary>' +
            '<h3>' + esc(b.titel) + '</h3><ul>' + b.punkte.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
          '</details>' +
        '</div>' +
        '<div class="gp-seite">' +
          '<button class="knopf gp-oeffnen" type="button"' + (offen ? ' hidden' : '') + '>' + esc(t.knopf) + '</button>' +
          '<form class="formular gp-form" novalidate' + (offen ? '' : ' hidden') + '>' +
            '<h3>' + esc(t.formTitel) + '</h3>' +
            '<label class="feld">' + esc(t.email) + '<input type="email" name="email" placeholder="' + esc(t.emailPh) + '" autocomplete="email" required></label>' +
            '<label class="feld">' + esc(t.vorname) + ' <span class="gp-frei">' + esc(t.optional) + '</span><input type="text" name="vorname" maxlength="40" placeholder="' + esc(t.vornamePh) + '" autocomplete="given-name"></label>' +
            '<fieldset><legend>' + esc(t.geraet) + '</legend><div class="handy-wahl">' +
              '<label><input type="radio" name="handy" value="iphone"><span>iPhone</span></label>' +
              '<label><input type="radio" name="handy" value="android"><span>Android</span></label></div></fieldset>' +
            '<fieldset><legend>' + esc(t.land) + '</legend><div class="handy-wahl">' +
              '<label><input type="radio" name="land" value="DE"' + (sp === 'de' ? ' checked' : '') + '><span>' + esc(t.de) + '</span></label>' +
              '<label><input type="radio" name="land" value="UK"' + (sp === 'en' ? ' checked' : '') + '><span>' + esc(t.uk) + '</span></label></div></fieldset>' +
            '<label class="zustimmung"><input type="checkbox" name="zustimmung"><span>' + t.zustimmung.replace('{d}', pfad + t.datenschutz) + '</span></label>' +
            '<input type="text" name="firma" tabindex="-1" autocomplete="off" class="falle" aria-hidden="true">' +
            '<button class="knopf" type="submit">' + esc(t.senden) + '</button>' +
            '<p class="meldung" role="status"></p>' +
            '<p class="klein-text gp-klein">' + esc(t.klein) + '</p>' +
          '</form>' +
        '</div>' +
      '</div>';

    var knopf = ziel.querySelector('.gp-oeffnen'), f = ziel.querySelector('form'), m = ziel.querySelector('.meldung');
    knopf.addEventListener('click', function () { knopf.hidden = true; f.hidden = false; f.email.focus(); });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = f.email.value.trim();
      if (!EMAIL.test(email)) return melden(m, t.fEmail);
      if (!f.zustimmung.checked) return melden(m, t.fHaken);
      if (VORSCHAU) return melden(m, t.vorschau + ' – ' + t.danke, true);
      var b = f.querySelector('button[type=submit]'); b.disabled = true; m.className = 'meldung'; m.textContent = t.moment;
      var wahl = function (n) { var x = f.querySelector('input[name=' + n + ']:checked'); return x ? x.value : null; };
      fetch(GRUENDER.server, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gruender: true, einwilligung: true, email: email, vorname: f.vorname.value.trim(),
          handy: wahl('handy'), land: wahl('land'), kanal: kanal, quelle: quelle, sprache: sp, firma: f.firma.value
        })
      }).then(function (r) { return r.json().then(function (d) { return r.ok && d.ok; }); })
        .then(function (ok) {
          if (ok) { melden(m, t.danke, true); f.reset(); }
          else melden(m, t.fServer);
        })
        .catch(function () { melden(m, t.fNetz); })
        .then(function () { b.disabled = false; });
    });
  }

  function melden(m, text, gut) { m.className = 'meldung'; void m.offsetWidth; m.className = 'meldung zeigen ' + (gut ? 'gut' : 'schlecht'); m.textContent = text; }

  // ---------- Phase bestimmen und Seite umstellen ----------
  // „unten“: Testangler ist Hauptaktion, Gründerpreis klein darunter
  // „vorn“:  Testangler voll ODER ab wechselAb → Gründerpreis oben, Testangler zeigt „Alle Plätze vergeben“
  // „aus“:   nach gruenderBis → nur noch Hinweis „Aktion beendet“
  function phase(voll) {
    if (heute > GRUENDER.gruenderBis) return 'aus';
    if (voll || heute >= GRUENDER.wechselAb) return 'vorn';
    return 'unten';
  }

  function anwenden(ziel, sp, pfad, voll, festOffen) {
    var p = phase(voll), t = T[sp];
    document.documentElement.setAttribute('data-gruender', p);
    if (p === 'aus') {
      ziel.innerHTML = '<div class="breite gp-aus"><p>' + esc(t.beendet) + '</p></div>';
      return;
    }
    ziel.setAttribute('data-vorn', p === 'vorn' || festOffen ? 'ja' : 'nein');
    bauen(ziel, sp, festOffen || p === 'vorn', pfad);

    // Startseite: bei „vorn“ den Abschnitt direkt unter den Start-Bereich holen, Knöpfe umstellen, Testangler schließen
    var test = document.getElementById('test');
    if (p === 'vorn' && test) {
      var start = document.querySelector('.start');
      if (start && start.parentNode) start.parentNode.insertBefore(ziel, start.nextSibling);
      test.classList.add('voll');
      var zuTitel = test.querySelector('.test-zu h3'), zuText = test.querySelector('.test-zu p');
      if (zuTitel) zuTitel.textContent = voll ? t.testVoll : t.testBeendet;
      if (zuText) zuText.textContent = t.testZuText;
      document.querySelectorAll('a[href="#test"]').forEach(function (a) { a.setAttribute('href', '#gruender'); a.textContent = t.kopfKnopf; });
    }
  }

  // ---------- Start ----------
  window.CarpDGruender = {
    starten: function (opt) {
      var ziel = document.getElementById('gruender');
      if (!ziel) return;
      var sp = opt && opt.sprache === 'en' ? 'en' : 'de';
      var pfad = (opt && opt.pfad) || '';
      var festOffen = !!(opt && opt.offen);
      // Vorschau: ?voll tut so, als wären alle Testangler-Plätze weg
      if (VORSCHAU) return anwenden(ziel, sp, pfad, suche.has('voll'), festOffen);
      anwenden(ziel, sp, pfad, false, festOffen);
      // Testangler voll? Server fragen (wie bisher) – dann umschalten
      fetch(GRUENDER.server + '?stand=1&land=' + (sp === 'en' ? 'UK' : 'DE')).then(function (r) { return r.json(); })
        .then(function (d) { if (d && d.voll) anwenden(ziel, sp, pfad, true, festOffen); })
        .catch(function () {});
    }
  };
})();
