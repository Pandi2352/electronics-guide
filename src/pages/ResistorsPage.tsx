import { useRef, useState } from "react";
import { BookOpen, Calculator, Check, Lightbulb, ListOrdered, Palette, ShieldCheck, Zap } from "lucide-react";
import { resistorGuide } from "../data";
import { PageHeader, Section } from "../components/ui";
import { ResistorDrawing } from "../components/illustrations";
import { bandsFor, formatOhms, isLightBand, ohmsFromBands } from "../lib/components";
import type { BandColor } from "../types";

const { purpose, whenToUse, colors, values } = resistorGuide;
const DIGIT_COLORS = colors.filter((c) => c.digit !== null);
const MULTIPLIER_COLORS = colors.filter((c) => c.multiplier !== null);
const TOLERANCE_COLORS = colors.filter((c) => c.tolerance !== null);

const multiplierText = (exp: number) => {
  const n = 10 ** exp;
  if (n >= 1e9) return `×${n / 1e9}G`;
  if (n >= 1e6) return `×${n / 1e6}M`;
  if (n >= 1e3) return `×${n / 1e3}k`;
  return `×${n}`;
};

type BandCount = 4 | 5;

export default function ResistorsPage() {
  const [count, setCount] = useState<BandCount>(4);
  const [bands, setBands] = useState<BandColor[]>(() => bandsFor(4700, 4, colors)!);
  const calcRef = useRef<HTMLDivElement>(null);

  const digitCount = count - 2;
  const digits = bands.slice(0, digitCount);
  const multiplier = bands[digitCount];
  const tolerance = bands[digitCount + 1];
  const ohms = ohmsFromBands(digits, multiplier);
  const tol = tolerance.tolerance ?? 0;
  const known = values.find((v) => v.ohms === ohms);

  const setBand = (index: number, color: BandColor) => setBands((b) => b.map((x, i) => (i === index ? color : x)));

  const switchCount = (next: BandCount) => {
    if (next === count) return;
    setBands(bandsFor(ohms, next, colors) ?? bandsFor(4700, next, colors)!);
    setCount(next);
  };

  const showInCalculator = (value: number) => {
    setCount(4);
    setBands(bandsFor(value, 4, colors)!);
    calcRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const rows: { label: string; hint: string; options: BandColor[]; index: number }[] = [
    ...digits.map((_, i) => ({
      label: `Band ${i + 1}`,
      hint: `${["1st", "2nd", "3rd"][i]} digit`,
      // A value never starts with zero, so black is not offered for the first band.
      options: i === 0 ? DIGIT_COLORS.filter((c) => c.digit !== 0) : DIGIT_COLORS,
      index: i,
    })),
    { label: `Band ${digitCount + 1}`, hint: "Multiplier (zeros)", options: MULTIPLIER_COLORS, index: digitCount },
    { label: `Band ${digitCount + 2}`, hint: "Tolerance", options: TOLERANCE_COLORS, index: digitCount + 1 },
  ];

  return (
    <>
      <PageHeader title="Resistors" description="Read any colour code in seconds, and learn which value to use for what." />

      <div className="flex flex-col gap-6">
        {/* PURPOSE - MAIN ON TOP */}
        <div className="rounded-md border border-teal-200 bg-teal-50 p-5">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-teal-800 uppercase">
            <Zap size={16} className="text-teal-700" /> Core Purpose
          </div>
          <p className="mt-2 text-base font-medium leading-relaxed text-teal-950 sm:text-lg">
            {purpose}
          </p>
        </div>

        {/* WHERE & WHEN TO USE - MAIN ON TOP */}
        <Section title="Where & When You Need a Resistor" icon={<ShieldCheck size={18} />}>
          <p className="mb-4 text-sm text-zinc-600">
            Crucial roles resistors play to prevent burned-out components and floating microcontroller pins.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {whenToUse.map((item) => (
              <div key={item.scenario} className="flex flex-col rounded-md border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-teal-700 text-xs font-bold text-white">
                    !
                  </span>
                  <h3 className="font-semibold text-zinc-900 leading-snug">{item.scenario}</h3>
                </div>
                <p className="mt-2.5 text-xs text-zinc-600 leading-relaxed">{item.why}</p>
                <div className="mt-auto pt-3 border-t border-zinc-200/60 text-xs">
                  <span className="font-semibold text-teal-800">Use: </span>
                  <span className="font-mono text-zinc-800">{item.recommended}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <div ref={calcRef} className="scroll-mt-20">
          <Section
            title="Colour code calculator"
            icon={<Calculator size={16} />}
            aside={
              <div className="flex rounded-md border border-zinc-200 p-0.5" role="group" aria-label="Number of bands">
                {([4, 5] as const).map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-pressed={count === n}
                    onClick={() => switchCount(n)}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${count === n ? "bg-teal-700 text-white" : "text-zinc-600 hover:bg-zinc-100"}`}
                  >
                    {n} bands
                  </button>
                ))}
              </div>
            }
          >
            <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
              <div className="flex flex-col gap-4">
                <div className="rounded-md border border-zinc-200 bg-zinc-50 px-4 py-6">
                  <ResistorDrawing bands={bands} className="mx-auto w-full max-w-sm" />
                </div>
                <div className="rounded-md border border-teal-200 bg-teal-50 p-4">
                  <div className="text-xs font-medium text-teal-800">Value</div>
                  <div className="mt-0.5 text-3xl font-semibold tracking-tight text-teal-950">
                    {formatOhms(ohms)} <span className="text-lg font-medium text-teal-800">±{tol}%</span>
                  </div>
                  <div className="mt-1 text-sm text-teal-900">
                    Real value is between {formatOhms(ohms * (1 - tol / 100))} and {formatOhms(ohms * (1 + tol / 100))}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {bands.map((b, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 rounded-md border border-teal-200 bg-white px-2 py-0.5 text-xs text-zinc-700">
                        <span className="size-3 rounded-md border border-zinc-300" style={{ background: b.hex }} aria-hidden />
                        {b.name}
                      </span>
                    ))}
                  </div>
                  {known && (
                    <p className="mt-3 border-t border-teal-200 pt-3 text-sm text-teal-900">
                      <span className="font-semibold">Common use: </span>
                      {known.purpose}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {rows.map((row) => (
                  <div key={row.index}>
                    <div className="mb-2 flex items-baseline gap-2">
                      <span className="text-sm font-semibold text-zinc-900">{row.label}</span>
                      <span className="text-xs text-zinc-500">{row.hint}</span>
                      <span className="ml-auto text-xs font-medium text-zinc-700">{bands[row.index].name}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {row.options.map((c) => {
                        const selected = bands[row.index].name === c.name;
                        const meaning =
                          row.index < digitCount ? `${c.digit}` : row.index === digitCount ? multiplierText(c.multiplier!) : `±${c.tolerance}%`;
                        return (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => setBand(row.index, c)}
                            aria-pressed={selected}
                            aria-label={`${c.name}, ${meaning}`}
                            title={`${c.name} = ${meaning}`}
                            className={`flex h-10 min-w-10 items-center justify-center rounded-md border px-1.5 font-mono text-[11px] font-semibold transition-transform ${
                              isLightBand(c.name) ? "border-zinc-300 text-zinc-900" : "border-transparent text-white"
                            } ${selected ? "outline-2 outline-offset-2 outline-teal-600" : "hover:scale-105"}`}
                            style={{ background: c.hex }}
                          >
                            {selected ? <Check size={16} strokeWidth={3} aria-hidden /> : meaning}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <Section title="How to read the bands" icon={<ListOrdered size={16} />}>
            <ol className="flex flex-col gap-3">
              {resistorGuide.howToRead.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-zinc-700">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-teal-700 text-xs font-semibold text-white">{i + 1}</span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
            <div className="mt-4 rounded-md border border-zinc-200 bg-zinc-50 p-3">
              <ResistorDrawing bands={bandsFor(4700, 4, colors)!} className="mx-auto mb-2 w-48" />
              <p className="text-center text-sm text-zinc-700">{resistorGuide.example}</p>
            </div>
            <div className="mt-3 flex gap-2.5 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <Lightbulb size={16} className="mt-0.5 shrink-0 text-amber-600" aria-hidden />
              <p>
                <span className="font-semibold">Memory trick: </span>
                {resistorGuide.mnemonic}
              </p>
            </div>
          </Section>

          <Section title="Colour chart" icon={<Palette size={16} />}>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-zinc-500">
                  <th className="pb-2 font-medium">Colour</th>
                  <th className="pb-2 font-medium">Digit</th>
                  <th className="pb-2 font-medium">Multiplier</th>
                  <th className="pb-2 font-medium">Tolerance</th>
                </tr>
              </thead>
              <tbody>
                {colors.map((c) => (
                  <tr key={c.name} className="border-t border-zinc-100">
                    <td className="py-1.5">
                      <span className="inline-flex items-center gap-2">
                        <span className="h-4 w-6 rounded-md border border-zinc-300" style={{ background: c.hex }} aria-hidden />
                        {c.name}
                      </span>
                    </td>
                    <td className="py-1.5 font-mono">{c.digit ?? "—"}</td>
                    <td className="py-1.5 font-mono">{c.multiplier !== null ? multiplierText(c.multiplier) : "—"}</td>
                    <td className="py-1.5 font-mono">{c.tolerance !== null ? `±${c.tolerance}%` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        </div>

        <Section title="The basics" icon={<BookOpen size={16} />}>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {resistorGuide.basics.map((b) => (
              <div key={b.title} className="rounded-md border border-zinc-200 bg-zinc-50 p-3.5">
                <h3 className="text-sm font-semibold text-zinc-900">{b.title}</h3>
                <p className="mt-1 text-sm text-zinc-600">{b.text}</p>
              </div>
            ))}
          </div>
        </Section>

        <div>
          <h2 className="mb-1 text-lg font-semibold">Common values</h2>
          <p className="mb-4 text-sm text-zinc-600">The {values.length} values you will meet in Arduino kits, what each is for, and its colour bands.</p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {values.map((v) => {
              const four = bandsFor(v.ohms, 4, colors)!;
              const five = bandsFor(v.ohms, 5, colors)!;
              return (
                <li key={v.ohms} className="flex flex-col rounded-md border border-zinc-200 bg-white p-4">
                  <ResistorDrawing bands={four} className="w-full max-w-[200px]" />
                  <div className="mt-3 text-xl font-semibold tracking-tight">{formatOhms(v.ohms)}</div>
                  <dl className="mt-1 space-y-0.5 text-xs text-zinc-500">
                    <div>
                      <dt className="inline font-medium text-zinc-700">4-band: </dt>
                      <dd className="inline">{four.map((b) => b.name).join(" · ")}</dd>
                    </div>
                    <div>
                      <dt className="inline font-medium text-zinc-700">5-band: </dt>
                      <dd className="inline">{five.map((b) => b.name).join(" · ")}</dd>
                    </div>
                  </dl>
                  <p className="mt-3 text-sm text-zinc-800">{v.purpose}</p>
                  <ul className="mt-2 flex flex-col gap-1 text-xs text-zinc-600">
                    {v.uses.map((u) => (
                      <li key={u} className="flex gap-1.5">
                        <span className="mt-1.5 size-1 shrink-0 rounded-md bg-teal-600" aria-hidden />
                        {u}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-4">
                    <button
                      type="button"
                      onClick={() => showInCalculator(v.ohms)}
                      className="rounded-md border border-zinc-200 px-2.5 py-1.5 text-xs font-medium text-teal-700 hover:border-teal-600 hover:bg-teal-50"
                    >
                      Open in calculator
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
