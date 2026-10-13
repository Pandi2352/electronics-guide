import { useState } from "react";
import { BookOpen, Check, Code, ShieldCheck, Zap } from "lucide-react";
import { diodeGuide } from "../data";
import { Badge, PageHeader, Section } from "../components/ui";
import CodeBlock from "../components/CodeBlock";
import { DiodeDrawing } from "../components/illustrations";
import { pinTone } from "../lib/format";

const { purpose, whenToUse, basics, types, commonParts, examples } = diodeGuide;

export default function DiodesPage() {
  const [biasMode, setBiasMode] = useState<"forward" | "reverse">("forward");
  const [selectedType, setSelectedType] = useState<string>("rectifier");
  const [exampleId, setExampleId] = useState(examples[0]?.id ?? "");

  const activeType = types.find((t) => t.id === selectedType) ?? types[0];
  const selectedExample = examples.find((e) => e.id === exampleId) ?? examples[0];

  return (
    <>
      <PageHeader
        title="Diodes"
        description="A one-way valve for electricity. Protect your Arduino from back-EMF spikes and reversed batteries."
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
        <Section title="Where & When You Need a Diode" icon={<ShieldCheck size={18} />}>
          <p className="mb-4 text-sm text-zinc-600">
            Encountering any of these scenarios in your project? Here is exactly why and where to place a diode.
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

        {/* INTERACTIVE BIAS SIMULATOR */}
        <Section
          title="Interactive Diode Gate Simulator"
          icon={<Zap size={16} />}
          aside={
            <div className="flex flex-wrap gap-1.5">
              {types.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedType(t.id)}
                  className={`rounded-md px-2 py-0.5 text-xs font-medium transition-colors ${
                    selectedType === t.id ? "bg-teal-700 text-white" : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  {t.name.split(" ")[0]}
                </button>
              ))}
            </div>
          }
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)]">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-100 p-2">
                <span className="text-xs font-medium text-zinc-700">Voltage applied across diode:</span>
                <div className="flex rounded-md border border-zinc-200 bg-white p-0.5">
                  <button
                    type="button"
                    onClick={() => setBiasMode("forward")}
                    className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                      biasMode === "forward" ? "bg-teal-700 text-white" : "text-zinc-600 hover:bg-zinc-100"
                    }`}
                  >
                    Forward Bias (+ to Anode)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBiasMode("reverse")}
                    className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                      biasMode === "reverse" ? "bg-rose-700 text-white" : "text-zinc-600 hover:bg-zinc-100"
                    }`}
                  >
                    Reverse Bias (+ to Cathode)
                  </button>
                </div>
              </div>

              <div className="rounded-md border border-zinc-200 bg-white p-6">
                <DiodeDrawing type={selectedType} className="mx-auto w-full max-w-sm" />
                <div className="mt-4 flex justify-between text-xs font-mono text-zinc-500">
                  <span>Anode (+) {biasMode === "forward" ? "CONNECTED TO +5V" : "CONNECTED TO GND"}</span>
                  <span>Cathode (-) {biasMode === "forward" ? "CONNECTED TO GND" : "CONNECTED TO +5V"}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-4">
              <div
                className={`rounded-md border p-4 transition-colors ${
                  biasMode === "forward" ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">Diode State</span>
                  <Badge tone={biasMode === "forward" ? "green" : "rose"}>
                    {biasMode === "forward" ? "GATE OPEN (Conducting)" : "GATE CLOSED (Blocking)"}
                  </Badge>
                </div>
                <div className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">
                  {biasMode === "forward" ? (
                    <span className="text-emerald-950">Current Flows Freely</span>
                  ) : (
                    <span className="text-rose-950">Current is Completely Blocked</span>
                  )}
                </div>
                <p className="mt-1 text-sm text-zinc-600">
                  {biasMode === "forward"
                    ? `Current flows from Anode to Cathode. The diode takes a small toll of ~${activeType.voltageDrop} forward voltage drop.`
                    : "Electricity tries to flow backwards into the Cathode stripe, but the internal depletion zone widens and shuts the gate. Leakage current is virtually zero."}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-md border border-zinc-200 bg-white p-2.5">
                    <span className="text-zinc-500">Forward Drop (Vf)</span>
                    <div className="mt-0.5 font-mono font-bold text-zinc-900">{activeType.voltageDrop}</div>
                  </div>
                  <div className="rounded-md border border-zinc-200 bg-white p-2.5">
                    <span className="text-zinc-500">Reverse Leakage</span>
                    <div className="mt-0.5 font-mono font-bold text-emerald-700">&lt; 5 µA (Negligible)</div>
                  </div>
                </div>
              </div>

              <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600">
                <span className="font-semibold text-zinc-800">Physical Identification: </span>
                Look for the printed silver or black painted band on the body. The band ALWAYS indicates the <strong>Cathode (-)</strong> lead where current exits.
              </div>
            </div>
          </div>
        </Section>

        {/* DIODE TYPES */}
        <div>
          <h2 className="mb-1 text-lg font-semibold">Diode Families & Types</h2>
          <p className="mb-4 text-sm text-zinc-600">Pick the right diode technology for your circuit requirements.</p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {types.map((t) => (
              <li key={t.id} className="flex flex-col rounded-md border border-zinc-200 bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-zinc-900">{t.name}</span>
                  <Badge tone={t.id === "schottky" ? "green" : t.id === "zener" ? "amber" : "neutral"}>
                    {t.voltageDrop}
                  </Badge>
                </div>
                <p className="mt-2 text-xs text-zinc-600">{t.looks}</p>

                <dl className="mt-3 space-y-1 text-xs border-t border-zinc-100 pt-2.5">
                  <div className="flex justify-between">
                    <dt className="text-zinc-500">Max Current:</dt>
                    <dd className="font-mono font-medium text-zinc-800">{t.maxCurrent}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-zinc-500">Switching Speed:</dt>
                    <dd className="font-mono font-medium text-zinc-800">{t.speed}</dd>
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
                  <th className="pb-2 font-medium">Type</th>
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
          <Section title="Arduino Example Circuits" icon={<Code size={16} />}>
            <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4" role="group" aria-label="Example">
              {examples.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  aria-pressed={e.id === selectedExample.id}
                  onClick={() => setExampleId(e.id)}
                  className={`shrink-0 rounded-md border px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                    e.id === selectedExample.id ? "border-teal-700 bg-teal-700 text-white" : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                  }`}
                >
                  {e.title}
                </button>
              ))}
            </div>
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
