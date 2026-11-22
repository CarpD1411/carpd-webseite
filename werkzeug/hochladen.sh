#!/bin/zsh
# Webseite carpd.de auf den IONOS-Webspace hochladen (seit 22.11.2026 – vorher GitHub Pages).
# Lädt alle Dateien hoch, die in Git sind (außer Werkzeug/README/GitHub-Resten). Passwort kommt aus dem
# macOS-Schlüsselbund (Eintrag „CarpD IONOS SFTP“, Konto su1205975) – es steht nirgends in einer Datei.
# Aufruf: werkzeug/hochladen.sh            → alles
#         werkzeug/hochladen.sh a.html b/c  → nur diese Dateien
set -e
cd "$(dirname "$0")/.."
HOST=access-5021898027.webspace-host.com
BENUTZER=su1205975
PW=$(security find-generic-password -a $BENUTZER -s "CarpD IONOS SFTP" -w)
if [ $# -gt 0 ]; then LISTE=("$@"); else LISTE=(${(f)"$(git ls-files | grep -vE '^(\.nojekyll|CNAME|README\.md|\.gitignore|werkzeug/.*|\.githooks/.*)$')"}); fi
BATCH=$(mktemp)
{ echo "cd public"
  for d in ${(u)${LISTE:h}}; do [ "$d" != "." ] && echo "-mkdir $d"; done
  for f in $LISTE; do echo "put \"$PWD/$f\" \"$f\""; done; } > $BATCH
expect -c "
  set timeout 900; log_user 0
  spawn sftp -oBatchMode=no -oStrictHostKeyChecking=accept-new -oPubkeyAuthentication=no -b $BATCH $BENUTZER@$HOST
  expect -re {(?i)password:} { send -- {$PW}; send \"\r\" }
  expect eof; catch wait r; exit [lindex \$r 3]"
rm -f $BATCH
echo "Hochgeladen: ${#LISTE} Datei(en) → https://carpd.de"
