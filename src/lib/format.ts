export type Tone = "neutral" | "teal" | "green" | "amber" | "rose" | "sky" | "violet";

/** Colours a board pin by what it is: power, ground, analog, digital. */
export function pinTone(target: string): Tone {
  const t = target.trim().toUpperCase();
  if (t.startsWith("GND")) return "neutral";
  if (/^(5V|3\.3V|3V3|VIN|12V)/.test(t)) return "rose";
  if (/^A\d/.test(t)) return "amber";
  if (/^D\d/.test(t)) return "sky";
  return "violet";
}
