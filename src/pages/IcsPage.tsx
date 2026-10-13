import { useState } from "react";
import { BookOpen, Check, Code, Cpu, Layers, Sparkles, Zap } from "lucide-react";
import { icGuide } from "../data";
import { Badge, PageHeader, Section } from "../components/ui";
import CodeBlock from "../components/CodeBlock";
import { IcDrawing } from "../components/illustrations";
import { pinTone } from "../lib/format";

const { purpose, whenToUse, basics, types, commonParts, examples } = icGuide;

export default function IcsPage() {
  const [selectedPinCount, setSelectedPinCount] = useState<number>(16);
  const selectedExample = examples[0];

  return (
    <>
      <PageHeader
        title="Integrated Circuits (ICs)"
        description="Complete micro-circuits in a single chip. Overcome pin limits, drive motor arrays, and expand analog inputs."
      />

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
        <Section title="Where & When You Need an IC" icon={<Cpu size={18} />}>
          <p className="mb-4 text-sm text-zinc-600">
            Common Arduino hardware limits and the exact companion chip that solves each one.
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

        {/* INTERACTIVE DIP PACKAGE ORIENTATION VIEWER */}
        <Section title="Interactive DIP Package Pinout Guide" icon={<Layers size={16} />}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)]">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-100 p-2">
                <span className="text-xs font-medium text-zinc-700">DIP Package Pin Count:</span>
                <div className="flex rounded-md border border-zinc-200 bg-white p-0.5">
                  {([8, 14, 16] as const).map((count) => (
                    <button
                      key={count}
                      type="button"
                      aria-pressed={selectedPinCount === count}
                      onClick={() => setSelectedPinCount(count)}
                      className={`rounded-md px-3 py-1 font-mono text-xs font-semibold transition-colors ${
                        selectedPinCount === count ? "bg-teal-700 text-white" : "text-zinc-600 hover:bg-zinc-100"
                      }`}
                    >
                      DIP-{count}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-md border border-zinc-200 bg-white p-6">
                <IcDrawing
                  pins={selectedPinCount}
                  label={selectedPinCount === 8 ? "NE555" : selectedPinCount === 14 ? "74HC04" : "74HC595"}
                  className="mx-auto w-full max-w-xs"
                />
                <div className="mt-4 text-center text-xs text-zinc-500">
                  Notch faces UP. Pin 1 is top-left, counting counter-clockwise around the chip body.
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-4">
              <div className="rounded-md border border-teal-200 bg-teal-50 p-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900 uppercase">
                  <Sparkles size={14} className="text-teal-700" /> Golden Rule for Any IC
                </div>
                <h3 className="mt-1 text-base font-bold text-teal-950">Add a 100 nF Decoupling Capacitor!</h3>
                <p className="mt-1 text-xs text-teal-900 leading-relaxed">
                  Inside every IC, hundreds of internal transistors switch on and off in nanoseconds, drawing brief current spikes from the power supply. Without a local <strong>100 nF (104) ceramic capacitor</strong> placed right between the chip&apos;s VCC and GND pins, your microcontroller may experience mysterious resets and glitchy readings.
                </p>

                <div className="mt-3 border-t border-teal-200/80 pt-2.5 text-xs text-teal-950">
                  <span className="font-bold">Never Leave CMOS Inputs Floating: </span>
                  Unused inputs on 74HC series chips behave like sensitive radio antennas. If not used, tie them firmly to 5V or GND.
                </div>
              </div>

              <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600">
                <span className="font-semibold text-zinc-800">Pin Counting Rule: </span>
                Start at <strong>Pin 1</strong> (marked with a dot or left of the notch), count down the left side (pins 1 to {selectedPinCount / 2}), cross to the bottom right, and count up the right side (pins {selectedPinCount / 2 + 1} to {selectedPinCount}).
              </div>
            </div>
          </div>
        </Section>

        {/* IC FAMILIES */}
        <div>
          <h2 className="mb-1 text-lg font-semibold">Specialized IC Families</h2>
          <p className="mb-4 text-sm text-zinc-600">Explore the main categories of companion chips.</p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {types.map((t) => (
              <li key={t.id} className="flex flex-col rounded-md border border-zinc-200 bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-zinc-900">{t.name}</span>
                  <Badge tone="teal">{t.package}</Badge>
                </div>
                <p className="mt-2 text-xs text-zinc-600">{t.looks}</p>
                <dl className="mt-3 space-y-1 text-xs border-t border-zinc-100 pt-2.5">
                  <div className="flex justify-between">
                    <dt className="text-zinc-500">Interface:</dt>
                    <dd className="font-medium text-zinc-800">{t.interface}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-zinc-500">Output Rating:</dt>
                    <dd className="font-mono font-medium text-zinc-800">{t.maxOutput}</dd>
                  </div>
                </dl>
                <div className="mt-3 border-t border-zinc-100 pt-2.5">
                  <div className="text-[11px] font-semibold text-emerald-800">Best Uses:</div>
                  <ul className="mt-1 space-y-0.5 text-xs text-zinc-600">
                    {t.uses.map((u) => (
                      <li key={u} className="flex items-start gap-1">
                        <Check size={12} className="mt-0.5 shrink-0 text-emerald-600" />
                        <span>{u}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* COMMON PARTS LOOKUP TABLE */}
        <Section title="Common Part Numbers Quick Reference" icon={<BookOpen size={16} />}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-zinc-500 border-b border-zinc-200">
                  <th className="pb-2 font-medium">Part Number</th>
                  <th className="pb-2 font-medium">Category</th>
                  <th className="pb-2 font-medium">Primary Function</th>
                  <th className="pb-2 font-medium">Where & When to Use It</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {commonParts.map((p) => (
                  <tr key={p.part}>
                    <td className="py-2.5 pr-3 font-mono font-bold text-teal-800">{p.part}</td>
                    <td className="py-2.5 pr-3 text-xs">{p.type}</td>
                    <td className="py-2.5 pr-3 font-mono text-xs text-zinc-600">{p.function}</td>
                    <td className="py-2.5 text-xs text-zinc-700">{p.whenToUse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* THE BASICS */}
        <Section title="The Basics" icon={<BookOpen size={16} />}>
          <div className="grid gap-3 sm:grid-cols-2">
            {basics.map((b) => (
              <div key={b.title} className="rounded-md border border-zinc-200 bg-zinc-50 p-3.5">
                <h3 className="text-sm font-semibold text-zinc-900">{b.title}</h3>
                <p className="mt-1 text-sm text-zinc-600">{b.text}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ARDUINO EXAMPLES */}
        {selectedExample && (
          <Section title="Arduino Example Circuit" icon={<Code size={16} />}>
            <p className="text-sm text-zinc-700">{selectedExample.description}</p>
            <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
              <div>
                <div className="mb-2 text-xs font-medium text-zinc-500">
                  Parts: {selectedExample.parts.join(" · ")}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-zinc-500">
                        <th className="pb-2 font-medium">Part</th>
                        <th className="pb-2 font-medium">Pin</th>
                        <th className="pb-2 font-medium">Connects to</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedExample.wiring.map((r, i) => (
                        <tr key={i} className="border-t border-zinc-100 align-top">
                          <td className="py-2 pr-2 text-zinc-800">{r.part}</td>
                          <td className="py-2 pr-2 font-mono text-xs text-zinc-600">{r.pin}</td>
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
              </div>
              <div className="min-w-0">
                <CodeBlock lines={selectedExample.code} filename={`${selectedExample.id}.ino`} />
              </div>
            </div>
          </Section>
        )}
      </div>
    </>
  );
}
