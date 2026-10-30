// Shop settings. `api` is the address of the Unleashed server (the Cloudflare Worker described in UNLEASHED.md of the private repository).
// While it is empty the buy buttons stay off and say the shop opens soon: nothing can be bought by mistake.
// `turnstile` is the public site key of the Cloudflare Turnstile widget that guards the forms (its secret is on the server only).
export const STORE = { api: 'https://api.dejanous.love', turnstile: '0x4AAAAAAFs3gChXtG0Gndf9', play: 'https://play.google.com/store/apps/details?id=fr.dejavous.app', apk: 'https://github.com/tybiboune/DejaVous-apk/releases/latest/download/deja-vous.apk', sums: 'https://github.com/tybiboune/DejaVous-apk/releases/latest/download/SHA256SUMS' };
