import type { BandColor } from "../types";

const trim = (n: number) => Number(n.toPrecision(3)).toString();

/** 100000 → "100 000": space grouping, as used in electronics datasheets. */
const group = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 2 }).replace(/,/g, " ");

/** 4700 → "4.7 kΩ", 1000000 → "1 MΩ". */
export function formatOhms(ohms: number): string {
  if (ohms >= 1e6) return `${trim(ohms / 1e6)} MΩ`;
  if (ohms >= 1e3) return `${trim(ohms / 1e3)} kΩ`;
  return `${trim(ohms)} Ω`;
}

/** The same capacitance in pF, nF and µF; `best` is the easiest one to read. */
export function formatFarads(pf: number): { best: string; pf: string; nf: string; uf: string } {
  const pfText = `${group(pf)} pF`;
  const nfText = `${trim(pf / 1e3)} nF`;
  const ufText = `${trim(pf / 1e6)} µF`;
  const best = pf >= 1e6 ? ufText : pf >= 1e3 ? nfText : pfText;
  return { best, pf: pfText, nf: nfText, uf: ufText };
}

/**
 * Colour bands for a resistance: 4-band = 2 digits + multiplier + gold (±5%),
 * 5-band = 3 digits + multiplier + brown (±1%).
 */
export function bandsFor(ohms: number, bands: 4 | 5, colors: BandColor[]): BandColor[] | null {
  const digits = bands === 4 ? 2 : 3;
  let exp = Math.floor(Math.log10(ohms)) - (digits - 1);
  let mantissa = Math.round(ohms / 10 ** exp);
  if (mantissa >= 10 ** digits) {
    mantissa /= 10;
    exp += 1;
  }
  const byDigit = (d: number) => colors.find((c) => c.digit === d);
  const sig = String(mantissa).padStart(digits, "0").split("").map((d) => byDigit(Number(d)));
  const mult = colors.find((c) => c.multiplier === exp);
  const tol = colors.find((c) => c.tolerance === (bands === 4 ? 5 : 1));
  const all = [...sig, mult, tol];
  return all.every(Boolean) ? (all as BandColor[]) : null;
}

/** Value in ohms from chosen digit colours and multiplier colour. */
export function ohmsFromBands(digits: BandColor[], multiplier: BandColor): number {
  const base = Number(digits.map((d) => d.digit ?? 0).join(""));
  return Number((base * 10 ** (multiplier.multiplier ?? 0)).toPrecision(6));
}

export type CapCodeResult =
  | { ok: true; pf: number; digits: string; zeros: number | null; tolerance: string | null; explain: string }
  | { ok: false; message: string };

/** Reads ceramic/film codes like "104", "104J", "22", "2A104J" (voltage prefix is ignored). */
export function readCapCode(raw: string, letters: { letter: string; tolerance: string }[]): CapCodeResult {
  const text = raw.trim().toUpperCase().replace(/\s+/g, "");
  if (!text) return { ok: false, message: "Type the code printed on the capacitor, e.g. 104." };
  const m = text.match(/^(?:\d[A-Z])?(\d{1,3})([A-Z])?$/);
  if (!m) return { ok: false, message: "Use 1–3 digits with an optional letter, e.g. 104 or 473K." };
  const [, num, letter] = m;
  const tolerance = letter ? (letters.find((l) => l.letter === letter)?.tolerance ?? `unknown letter "${letter}"`) : null;

  if (num.length < 3) {
    const pf = Number(num);
    return { ok: true, pf, digits: num, zeros: null, tolerance, explain: `Two digits or fewer is the value itself: ${pf} pF.` };
  }
  const digits = num.slice(0, 2);
  const third = Number(num[2]);
  // 8 and 9 are special: ×0.01 and ×0.1.
  const factor = third === 8 ? 0.01 : third === 9 ? 0.1 : 10 ** third;
  if (third === 6 || third === 7) return { ok: false, message: `A third digit of ${third} isn't used on capacitors. Check the marking again.` };
  const pf = Number((Number(digits) * factor).toPrecision(6));
  const explain =
    third >= 8
      ? `${digits} × ${factor} = ${pf} pF (a third digit of ${third} means × ${factor}).`
      : `${digits} followed by ${third} zero${third === 1 ? "" : "s"} = ${group(pf)} pF.`;
  return { ok: true, pf, digits, zeros: third >= 8 ? null : third, tolerance, explain };
}

const LIGHT_BANDS = new Set(["Yellow", "White", "Gold", "Silver", "Grey", "Orange"]);

/** True for band colours that need dark text or an outline to stay visible. */
export const isLightBand = (name: string) => LIGHT_BANDS.has(name);

export type PotMarkingResult =
  | { ok: true; ohms: number; taper: string | null; explain: string }
  | { ok: false; message: string };

/** Reads pot markings like "B10K", "A500K", "1M", "10K" or trimmer codes like "103". */
export function readPotMarking(raw: string): PotMarkingResult {
  const text = raw.trim().toUpperCase().replace(/\s+|Ω|OHMS?/g, "");
  if (!text) return { ok: false, message: "Type what is printed on the pot, e.g. B10K or 103." };
  const m = text.match(/^([ABC])?(\d+(?:\.\d+)?)([KM])?$/);
  if (!m) return { ok: false, message: "Use a taper letter and value (B10K, A100K) or a 3-digit code (103)." };
  const [, taper = null, num, unit] = m;

  // Three plain digits = trimmer code: two digits + number of zeros.
  if (!unit && /^\d{3}$/.test(num)) {
    const zeros = Number(num[2]);
    const ohms = Number(num.slice(0, 2)) * 10 ** zeros;
    return { ok: true, ohms, taper, explain: `Code ${num}: ${num.slice(0, 2)} followed by ${zeros} zero${zeros === 1 ? "" : "s"} = ${group(ohms)} Ω.` };
  }
  const ohms = Number(num) * (unit === "K" ? 1e3 : unit === "M" ? 1e6 : 1);
  const unitText = unit === "K" ? " × 1000" : unit === "M" ? " × 1 000 000" : "";
  return { ok: true, ohms, taper, explain: `${num}${unit ?? ""} = ${num}${unitText} = ${group(ohms)} Ω.` };
}
