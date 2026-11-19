// Rotlicht-Schalter für alle Unterseiten: färbt die Seite wie die App nachts rot.
// Es wird nichts gespeichert (keine Cookies, kein Browser-Speicher) – beim nächsten Aufruf ist es wieder aus.
(function () {
  var knoepfe = document.querySelectorAll('[data-rotlicht]');
  knoepfe.forEach(function (k) {
    k.addEventListener('click', function () {
      var an = !document.body.classList.contains('rot');
      document.body.classList.toggle('rot', an);
      knoepfe.forEach(function (x) { x.setAttribute('aria-pressed', an ? 'true' : 'false'); });
    });
  });
})();
