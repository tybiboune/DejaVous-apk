# Déjà Vous — Android downloads

Public releases and the [promotional website](https://tybiboune.github.io/DejaVous-apk/) for Déjà Vous, a game for couples. The website lives in `docs/`; the Android app source stays private. Each [release](https://github.com/tybiboune/DejaVous-apk/releases) provides

- `deja-vous.apk` — the signed Android app ([download the latest](https://github.com/tybiboune/DejaVous-apk/releases/latest/download/deja-vous.apk))
- `update.json` — used by the in-app updater
- `SHA256SUMS` — checksums of the files above

Install a new APK over the previous signed release, without uninstalling, to keep your games and vault. Android asks you to confirm the installation. The app checks for updates on its own; only signed APKs with the same key can update an installed copy. Update checks send no answers, names or vault content.

The maintained source repository is private.
