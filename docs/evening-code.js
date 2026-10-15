// The "evening code": four characters that carry what the site demo left open (the sealed fourth round, the promise, the first card)
// into the app, where the same code opens that sealed round first. No server, nothing personal: 20 bits, 10 of them a checksum.
// SAME FILE in the app repository (www/js/evening-code.js): keep both identical.
export const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // 32 symbols, no 0/O, no 1/I
// The sealed fourth round: a "who of us two" card, level 2 or 3, always played first in the app with this code. [fr, en, level]
export const SEALED = [
  ['Qui de nous deux a le plus envie de rejouer notre premier baiser ?', 'Which of us most wants to replay our first kiss?', 2],
  ['Qui craquerait le premier si l’autre lui chuchotait à l’oreille, là, maintenant ?', 'Who would give in first if the other whispered in their ear, right now?', 3],
  ['Qui a déjà imaginé une soirée à deux sans jamais oser la proposer ?', 'Who has already imagined an evening for two without ever daring to suggest it?', 2],
  ['Qui garde un souvenir de nous qu’il n’a jamais raconté ?', 'Who keeps a memory of us they have never told?', 2],
  ['Qui ferait le premier pas ce soir, si les téléphones s’éteignaient ?', 'Who would make the first move tonight if the phones switched off?', 3],
  ['Qui est le plus doué pour faire semblant de ne pas regarder l’autre ?', 'Who is best at pretending not to look at the other?', 2],
  ['Qui a le plus de mal à cacher qu’il a envie de l’autre ?', 'Who finds it hardest to hide wanting the other?', 3],
  ['Qui proposerait le premier un pari dont le gage se joue en tête-à-tête ?', 'Who would be first to suggest a bet whose forfeit is played one-on-one?', 3]
];
const check = n => { let h = (n * 2654435761) >>> 0; h ^= h >>> 15; return (h ^ 0x2c5) & 1023; };
// { sealed: 0..7, card: 0..2, promise: 0..2, matches: 0..3 } -> 'K7Q2'
export function encodeEvening({ sealed = 0, card = 0, promise = 0, matches = 0 }) {
  const data = ((sealed & 7) << 7) | ((card & 3) << 5) | ((promise & 3) << 3) | ((matches & 3) << 1); // 10 bits (the last one spare)
  const n = (data << 10) | check(data);
  let out = ''; for (let i = 3; i >= 0; i--) out += ALPHABET[(n >> (i * 5)) & 31];
  return out;
}
// 'k7q2' / 'K7Q2' -> the same object, or null for a mistyped code
export function decodeEvening(text) {
  const s = String(text ?? '').toUpperCase().replace(/[\s-]/g, '').replace(/O/g, '0').replace(/I/g, '1');
  if (!/^[2-9A-HJ-NP-Z]{4}$/.test(s)) return null;
  let n = 0; for (const c of s) n = (n << 5) | ALPHABET.indexOf(c);
  const data = n >> 10;
  if (check(data) !== (n & 1023) || data & 1) return null;
  const v = { sealed: (data >> 7) & 7, card: (data >> 5) & 3, promise: (data >> 3) & 3, matches: (data >> 1) & 3 };
  return v.card > 2 || v.promise > 2 || v.matches > 2 ? null : v;
}
