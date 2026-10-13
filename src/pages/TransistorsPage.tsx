import { useState } from "react";
import { BookOpen, Calculator, Check, Code, Cpu, Power, Zap } from "lucide-react";
import { transistorGuide } from "../data";
import { Badge, PageHeader, Section } from "../components/ui";
import CodeBlock from "../components/CodeBlock";
import { TransistorDrawing } from "../components/illustrations";
import { pinTone } from "../lib/format";

const { purpose, whenToUse, basics, types, commonParts, examples } = transistorGuide;

export default function TransistorsPage() {
  const [baseSignal, setBaseSignal] = useState<"LOW" | "HIGH">("LOW");
  const [loadCurrentMa, setLoadCurrentMa] = useState<number>(150);
  const isTransistorOn = baseSignal === "HIGH";
  const selectedExample = examples[0];

  // Base resistor formula: Rb = (5V - 0.7V) / (I_load / beta_sat), assume beta_sat = 20
  const baseCurrentMa = Math.max(1, loadCurrentMa / 20);
  const calculatedResistorOhms = Math.round(((5.0 - 0.7) / (baseCurrentMa / 1000)));

  return (
    <>
      <PageHeader
        title="Transistors (BJT)"
        description="A current-controlled electronic switch. Control motors, buzzers, and relays that need more than the Arduino's 20 mA limit."
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
        <Section title="Where & When You Need a Transistor" icon={<Cpu size={18} />}>
          <p className="mb-4 text-sm text-zinc-600">
            Real-world circuit scenarios where an Arduino GPIO pin cannot do the job alone.
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

        {/* INTERACTIVE BJT SWITCH SIMULATOR */}
        <Section title="Interactive NPN Switch Simulator" icon={<Power size={16} />}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)]">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-100 p-2">
                <span className="text-xs font-medium text-zinc-700">Arduino Pin D9 Signal:</span>
                <button
                  type="button"
                  onClick={() => setBaseSignal((prev) => (prev === "LOW" ? "HIGH" : "LOW"))}
                  className={`rounded-md px-3 py-1 font-mono text-xs font-bold transition-colors ${
                    isTransistorOn ? "bg-teal-700 text-white" : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300"
                  }`}
                >
                  digitalWrite(9, {baseSignal})
                </button>
              </div>

              <div className="rounded-md border border-zinc-200 bg-white p-6">
                <TransistorDrawing className="mx-auto w-full max-w-xs" />
                <div className="mt-4 flex justify-between text-xs font-mono text-zinc-500">
                  <span>Pin 1: Emitter (GND)</span>
                  <span>Pin 2: Base (via 1kΩ)</span>
                  <span>Pin 3: Collector (Load -)</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-4">
              <div
                className={`rounded-md border p-4 transition-colors ${
                  isTransistorOn ? "border-emerald-200 bg-emerald-50" : "border-zinc-200 bg-zinc-50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">Switch Region</span>
                  <Badge tone={isTransistorOn ? "green" : "neutral"}>
                    {isTransistorOn ? "SATURATION (Switch ON)" : "CUTOFF (Switch OFF)"}
                  </Badge>
                </div>
                <div className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">
                  {isTransistorOn ? (
                    <span className="text-emerald-950">Collector Connected to Ground</span>
                  ) : (
                    <span className="text-zinc-700">Open Circuit (Load is OFF)</span>
                  )}
                </div>
                <p className="mt-1 text-sm text-zinc-600">
                  {isTransistorOn
                    ? "Arduino supplies ~4.3 mA into the Base via a 1kΩ resistor. This saturates the transistor, dropping V_CE to ~0.2V and letting current flow from Collector to Emitter."
                    : "No current flows into the Base (0V). The Collector-to-Emitter junction acts as an open switch with infinite resistance."}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-md border border-zinc-200 bg-white p-2.5">
                    <span className="text-zinc-500">Base Current (Ib)</span>
                    <div className="mt-0.5 font-mono font-bold text-zinc-900">
                      {isTransistorOn ? "~4.3 mA" : "0.0 mA"}
                    </div>
                  </div>
                  <div className="rounded-md border border-zinc-200 bg-white p-2.5">
                    <span className="text-zinc-500">Collector Drop (Vce)</span>
                    <div className="mt-0.5 font-mono font-bold text-emerald-700">
                      {isTransistorOn ? "~0.2 V" : "Supply Voltage"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Base Resistor Calculator */}
              <div className="rounded-md border border-zinc-200 bg-white p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800">
                  <Calculator size={14} className="text-teal-700" /> Base Resistor Quick Calculator
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <label htmlFor="load-ma" className="text-xs text-zinc-600 shrink-0">
                    Load Current:
                  </label>
                  <input
                    id="load-ma"
                    type="number"
                    min={10}
                    max={800}
                    value={loadCurrentMa}
                    onChange={(e) => setLoadCurrentMa(Number(e.target.value))}
                    className="h-8 w-24 rounded-md border border-zinc-200 px-2 font-mono text-xs text-zinc-800"
                  />
                  <span className="text-xs text-zinc-500">mA</span>
                  <div className="ml-auto text-xs font-mono font-semibold text-teal-800">
                    Use: ~{calculatedResistorOhms} Ω (or 1kΩ)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* TRANSISTOR TYPES */}
        <div>
          <h2 className="mb-1 text-lg font-semibold">Transistor Types</h2>
          <p className="mb-4 text-sm text-zinc-600">Understand the difference between NPN, PNP, and Darlington configurations.</p>
          <ul className="grid gap-3 sm:grid-cols-3">
            {types.map((t) => (
              <li key={t.id} className="flex flex-col rounded-md border border-zinc-200 bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-zinc-900">{t.name}</span>
                  <Badge tone={t.id === "npn" ? "teal" : t.id === "darlington" ? "rose" : "amber"}>
                    {t.polarity}
                  </Badge>
                </div>
                <p className="mt-2 text-xs text-zinc-600">{t.switchingType}</p>
                <dl className="mt-3 space-y-1 text-xs border-t border-zinc-100 pt-2.5">
                  <div className="flex justify-between">
                    <dt className="text-zinc-500">Trigger:</dt>
                    <dd className="font-medium text-zinc-800">{t.trigger}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-zinc-500">Max Current:</dt>
                    <dd className="font-mono font-medium text-zinc-800">{t.maxCurrent}</dd>
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
                  <th className="pb-2 font-medium">Polarity</th>
                  <th className="pb-2 font-medium">Rating</th>
                  <th className="pb-2 font-medium">Where & When to Use It</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {commonParts.map((p) => (
                  <tr key={p.part}>
                    <td className="py-2.5 pr-3 font-mono font-bold text-teal-800">{p.part}</td>
                    <td className="py-2.5 pr-3 text-xs">{p.type}</td>
                    <td className="py-2.5 pr-3 font-mono text-xs text-zinc-600">{p.rating}</td>
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
