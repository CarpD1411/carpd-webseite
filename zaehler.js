/* CarpD-Besucherzähler: ohne Cookies, ohne Speichern auf dem Gerät. Schickt beim Öffnen einer Seite einmal:
   Seite, Seitensprache, Browsersprache, Herkunft (utm_source/utm_medium/kanal), verweisende Domain, Handy ja/nein.
   Nur auf carpd.de (nicht in der Vorschau). Server: Supabase-Funktion „zaehler“ (EU). Siehe Datenschutz 3. */
(function () {
  'use strict';
  if (!/(^|\.)carpd\.de$/.test(location.hostname) || navigator.webdriver) return;
  try {
    var u = new URLSearchParams(location.search);
    var von = '';
    try { von = document.referrer ? new URL(document.referrer).hostname : ''; } catch (e) {}
    if (von === location.hostname) von = '';
    var daten = JSON.stringify({
      seite: location.pathname,
      sprache: (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0 ? 'en' : 'de',
      bs: (navigator.language || '').slice(0, 5),
      quelle: u.get('utm_source') || '',
      medium: u.get('utm_medium') || '',
      kanal: u.get('kanal') || '',
      von: von,
      handy: /Mobi|Android|iPhone/i.test(navigator.userAgent)
    });
    var ziel = 'https://pajfamucnxdhnhrekykr.supabase.co/functions/v1/clever-function';
    if (navigator.sendBeacon) navigator.sendBeacon(ziel, new Blob([daten], { type: 'text/plain' }));
    else fetch(ziel, { method: 'POST', body: daten, keepalive: true, headers: { 'Content-Type': 'text/plain' } });
  } catch (e) { /* Zähler darf die Seite nie stören */ }
})();
