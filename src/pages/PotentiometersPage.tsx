import { useState } from "react";
import { BookOpen, Code, Gauge, Layers, ListOrdered, ScanText, ShieldCheck, Zap } from "lucide-react";
import { potGuide } from "../data";
import { Badge, PageHeader, Section, WireIcon } from "../components/ui";
import Dropdown from "../components/Dropdown";
import CodeBlock from "../components/CodeBlock";
import { KnobDrawing, PotDrawing, PotWiringDrawing } from "../components/illustrations";
import { formatOhms, readPotMarking } from "../lib/components";
import { pinTone } from "../lib/format";

const { purpose, whenToUse, tapers, types, values, examples } = potGuide;
const VALUE_OPTIONS = values.map((v) => ({ value: String(v.ohms), label: formatOhms(v.ohms) }));
const MARKING_EXAMPLES = ["B10K", "B5K", "A100K", "B1M", "103", "503", "202"];
const SUPPLY = 5;

export default function PotentiometersPage() {
  const [position, setPosition] = useState(50);
  const [potOhms, setPotOhms] = useState("10000");
  const [marking, setMarking] = useState("B10K");
  const [exampleId, setExampleId] = useState(examples[0]?.id ?? "");

  const total = Number(potOhms);
  const p = position / 100;
  const volts = SUPPLY * p;
  const reading = Math.round(p * 1023);
  const milliamps = (SUPPLY / total) * 1000;

  const result = readPotMarking(marking);
  const taper = result.ok && result.taper ? tapers.find((t) => t.letter === result.taper) : undefined;
  const known = result.ok ? values.find((v) => v.ohms === result.ohms) : undefined;
  const example = examples.find((e) => e.id === exampleId) ?? examples[0];

  return (
    <>
      <PageHeader title="Potentiometers" description="A resistor with a knob. Turn it, read it on the Nano, and learn which pot to use for what." />

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
        <Section title="Where & When You Need a Potentiometer" icon={<ShieldCheck size={18} />}>
          <p className="mb-4 text-sm text-zinc-600">
            Real-world circuit scenarios where variable resistance and analog calibration are required.
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

        <Section
          title="Try the knob"
          icon={<Gauge size={16} />}
          aside={<Dropdown label="Pot value" value={potOhms} options={VALUE_OPTIONS} onChange={setPotOhms} size="sm" align="end" className="w-full sm:w-32" />}
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
            <div className="flex flex-col items-center gap-4 rounded-md border border-zinc-200 bg-zinc-50 p-4">
              <KnobDrawing position={p} className="w-40" />
              <label className="w-full">
                <span className="sr-only">Knob position</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={position}
                  onChange={(e) => setPosition(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer accent-teal-700"
                />
              </label>
              <div className="flex w-full justify-between text-xs text-zinc-500">
                <span>Fully left</span>
                <span className="font-medium text-zinc-800">{position}% turned</span>
                <span>Fully right</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-zinc-200 bg-zinc-200 sm:grid-cols-4">
                {[
                  { label: "Voltage on A0", value: `${volts.toFixed(2)} V` },
                  { label: "analogRead(A0)", value: String(reading) },
                  { label: "Pin 1 ↔ wiper", value: formatOhms(Math.max(total * p, 0.01)) },
                  { label: "Wiper ↔ pin 3", value: formatOhms(Math.max(total * (1 - p), 0.01)) },
                ].map((r) => (
                  <div key={r.label} className="bg-white px-3 py-3">
                    <div className="text-xs text-zinc-500">{r.label}</div>
                    <div className="mt-0.5 font-mono text-lg font-semibold text-zinc-900">{r.value}</div>
                  </div>
                ))}
              </div>

              <div>
                <div className="mb-1.5 flex justify-between text-xs font-medium">
                  <span className="text-zinc-600">Pin 1 · GND (0 V)</span>
                  <span className="text-amber-700">Wiper → A0</span>
                  <span className="text-rose-700">Pin 3 · 5V</span>
                </div>
                <div className="relative h-8 overflow-hidden rounded-md border border-zinc-300 bg-zinc-100">
                  <div className="absolute inset-y-0 left-0 bg-teal-600/80" style={{ width: `${position}%` }} />
                  <div className="absolute inset-y-0 w-1 bg-amber-500" style={{ left: `calc(${position}% - 2px)` }} />
                </div>
                <p className="mt-2 text-sm text-zinc-600">
                  The track is {formatOhms(total)} from end to end. The wiper splits it in two, so A0 sees {volts.toFixed(2)} V, which the Nano reads as{" "}
                  <span className="font-mono font-semibold text-zinc-900">{reading}</span> out of 1023.
                </p>
              </div>

              <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700">
                <span className="font-semibold">Current through the track: </span>
                {milliamps >= 1 ? `${milliamps.toFixed(1)} mA` : `${(milliamps * 1000).toFixed(0)} µA`}, whatever the knob position. A bigger pot wastes less current, but above 10 kΩ the
                Nano's readings get a little noisier.
              </div>
            </div>
          </div>
        </Section>

        <div className="grid gap-5 lg:grid-cols-2">
          <Section title="Wiring to the Nano" icon={<WireIcon size={16} />}>
            <PotWiringDrawing className="mx-auto w-full max-w-xs" />
            <table className="mt-4 w-full text-sm">
              <tbody>
                {[
                  { pin: "Pin 1 (left)", to: "GND", why: "One end of the track at 0 V" },
                  { pin: "Pin 2 (middle)", to: "A0", why: "The wiper: any voltage from 0 to 5 V" },
                  { pin: "Pin 3 (right)", to: "5V", why: "The other end of the track at 5 V" },
                ].map((r) => (
                  <tr key={r.pin} className="border-t border-zinc-100 align-top">
                    <td className="py-2 pr-3 font-medium text-zinc-800">{r.pin}</td>
                    <td className="py-2 pr-3">
                      <Badge tone={pinTone(r.to)} className="font-mono">
                        {r.to}
                      </Badge>
                    </td>
                    <td className="py-2 text-zinc-600">{r.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-zinc-500">Swap pins 1 and 3 if turning right makes the number go down.</p>
          </Section>

          <Section title="Marking reader" icon={<ScanText size={16} />}>
            <label htmlFor="pot-marking" className="text-sm font-semibold text-zinc-900">
              What is printed on the pot?
            </label>
            <input
              id="pot-marking"
              value={marking}
              onChange={(e) => setMarking(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              placeholder="e.g. B10K"
              className="mt-2 h-12 w-full rounded-md border border-zinc-200 bg-white px-3 font-mono text-xl tracking-wider uppercase placeholder:text-zinc-300 hover:border-zinc-300"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {MARKING_EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setMarking(ex)}
                  aria-pressed={marking.toUpperCase() === ex}
                  className={`rounded-md border px-2.5 py-1.5 font-mono text-xs font-medium transition-colors ${
                    marking.toUpperCase() === ex ? "border-teal-700 bg-teal-700 text-white" : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                  }`}
                >
                  {ex}
                </button>
              ))}
            </div>
            <div className="mt-4" aria-live="polite">
              {result.ok ? (
                <div className="rounded-md border border-teal-200 bg-teal-50 p-4">
                  <div className="text-3xl font-semibold tracking-tight text-teal-950">
                    {formatOhms(result.ohms)}
                    {taper && <span className="ml-2 text-lg font-medium text-teal-800">{taper.name}</span>}
                  </div>
                  <p className="mt-1 text-sm text-teal-900">{result.explain}</p>
                  {taper && (
                    <p className="mt-1 text-sm text-teal-900">
                      {taper.letter} = {taper.meaning}
                    </p>
                  )}
                  {known && (
                    <p className="mt-3 border-t border-teal-200 pt-3 text-sm text-teal-900">
                      <span className="font-semibold">Common use: </span>
                      {known.purpose}
                    </p>
                  )}
                </div>
              ) : (
                <div className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-600">{result.message}</div>
              )}
            </div>
          </Section>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <Section title="How to read the marking" icon={<ListOrdered size={16} />}>
            <ol className="flex flex-col gap-3">
              {potGuide.howToRead.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-zinc-700">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-teal-700 text-xs font-semibold text-white">{i + 1}</span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700">{potGuide.example}</p>
          </Section>

          <Section title="Taper letters" icon={<Layers size={16} />}>
            <ul className="flex flex-col gap-3">
              {tapers.map((t) => (
                <li key={t.letter} className="flex gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-zinc-900 font-mono text-base font-semibold text-white">{t.letter}</span>
                  <div className="text-sm">
                    <div className="font-semibold text-zinc-900">{t.name}</div>
                    <div className="text-zinc-600">{t.meaning}</div>
                    <div className="mt-0.5 text-xs text-zinc-500">Used for: {t.use}</div>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">{potGuide.taperNote}</p>
          </Section>
        </div>

        <div>
          <h2 className="mb-1 text-lg font-semibold">Types of potentiometer</h2>
          <p className="mb-4 text-sm text-zinc-600">How to recognise each one and when to use it.</p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {types.map((t) => (
              <li key={t.id} className="flex flex-col rounded-md border border-zinc-200 bg-white p-4">
                <PotDrawing type={t.id} className="h-20 w-24" />
                <h3 className="mt-3 font-semibold text-zinc-900">{t.name}</h3>
                <p className="mt-1 text-sm text-zinc-600">{t.looks}</p>
                <dl className="mt-3 space-y-1.5 text-xs">
                  <div>
                    <dt className="font-medium text-zinc-500">Range</dt>
                    <dd className="text-zinc-800">{t.range}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-zinc-500">Used for</dt>
                    <dd className="text-zinc-800">{t.uses.join(" · ")}</dd>
                  </div>
                </dl>
                <div className="mt-auto pt-4">
                  <p className="rounded-md border border-zinc-200 bg-zinc-50 p-2.5 text-xs text-zinc-700">{t.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <Section title="The basics" icon={<BookOpen size={16} />}>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {potGuide.basics.map((b) => (
              <div key={b.title} className="rounded-md border border-zinc-200 bg-zinc-50 p-3.5">
                <h3 className="text-sm font-semibold text-zinc-900">{b.title}</h3>
                <p className="mt-1 text-sm text-zinc-600">{b.text}</p>
              </div>
            ))}
          </div>
        </Section>

        <div>
          <h2 className="mb-1 text-lg font-semibold">Common values</h2>
          <p className="mb-4 text-sm text-zinc-600">The {values.length} pot values you will see most, and what each is good for.</p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {values.map((v) => (
              <li key={v.ohms} className="flex flex-col rounded-md border border-zinc-200 bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xl font-semibold tracking-tight">{formatOhms(v.ohms)}</span>
                  {v.ohms === 10000 && <Badge tone="teal">Best for Arduino</Badge>}
                </div>
                <p className="mt-2 text-sm text-zinc-800">{v.purpose}</p>
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
                    onClick={() => {
                      setPotOhms(String(v.ohms));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="rounded-md border border-zinc-200 px-2.5 py-1.5 text-xs font-medium text-teal-700 hover:border-teal-600 hover:bg-teal-50"
                  >
                    Try this value
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {example && (
          <Section title="Arduino examples" icon={<Code size={16} />}>
            <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4" role="group" aria-label="Example">
              {examples.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  aria-pressed={e.id === example.id}
                  onClick={() => setExampleId(e.id)}
                  className={`shrink-0 rounded-md border px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                    e.id === example.id ? "border-teal-700 bg-teal-700 text-white" : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                  }`}
                >
                  {e.title}
                </button>
              ))}
            </div>
            <p className="text-sm text-zinc-700">{example.description}</p>
            <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
              <div>
                <div className="mb-2 text-xs font-medium text-zinc-500">Parts: {["Arduino Nano", ...example.parts].join(" · ")}</div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-zinc-500">
                      <th className="pb-2 font-medium">Part</th>
                      <th className="pb-2 font-medium">Pin</th>
                      <th className="pb-2 font-medium">Nano</th>
                    </tr>
                  </thead>
                  <tbody>
                    {example.wiring.map((r, i) => (
                      <tr key={i} className="border-t border-zinc-100 align-top">
                        <td className="py-2 pr-2 text-zinc-800">{r.part}</td>
                        <td className="py-2 pr-2 text-xs text-zinc-600">{r.pin}</td>
                        <td className="py-2">
                          <Badge tone={pinTone(r.to)} className="font-mono whitespace-normal">
                            {r.to}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="min-w-0">
                <CodeBlock lines={example.code} filename={`${example.id}.ino`} />
              </div>
            </div>
          </Section>
        )}
      </div>
    </>
  );
}
