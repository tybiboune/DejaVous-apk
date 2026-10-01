# Déjà Vous — Android downloads

Public releases of Déjà Vous, a card game for couples. This repository contains no source tree: it only hosts the
[releases](https://github.com/tybiboune/DejaVous-apk/releases), each providing

- `deja-vous.apk` — the signed Android app ([download the latest](https://github.com/tybiboune/DejaVous-apk/releases/latest/download/deja-vous.apk))
- `update.json` — used by the in-app updater
- `SHA256SUMS` — checksums of the files above

Install a new APK over the previous signed release, without uninstalling, to keep your games and vault. Android asks you to confirm the installation. The app checks for updates on its own; only signed APKs with the same key can update an installed copy. Update checks send no answers, names or vault content.

The maintained source repository is private.
