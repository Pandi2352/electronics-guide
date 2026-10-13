import { useState } from "react";
import { ArrowDownUp, BookOpen, Calculator, Code, Flame, Gauge, Sparkles, Zap } from "lucide-react";
import { converterGuide } from "../data";
import { Badge, PageHeader, Section } from "../components/ui";
import CodeBlock from "../components/CodeBlock";
import { ConverterDrawing } from "../components/illustrations";
import { pinTone } from "../lib/format";

const { purpose, whenToUse, basics, types, popularModules, examples } = converterGuide;

export default function ConvertersPage() {
  const [vin, setVin] = useState<number>(12);
  const [vout, setVout] = useState<number>(5);
  const [currentMa, setCurrentMa] = useState<number>(500);

  const selectedExample = examples[0];

  // Calculations
  const isBuck = vin > vout + 1.2;
  const isBoost = vin < vout - 0.5;
  const isBuckBoost = !isBuck && !isBoost;

  const currentAmps = currentMa / 1000;
  // If linear regulator were used:
  const linearWasteWatts = vin > vout ? (vin - vout) * currentAmps : 0;
  const linearEfficiency = vin > vout ? Math.round((vout / vin) * 100) : 0;
  // Switch-mode DC-DC:
  const dcdcEfficiency = isBuck ? 92 : 88;
  const outputPowerWatts = vout * currentAmps;

  return (
    <>
      <PageHeader
        title="DC-DC Converters"
        description="High-efficiency voltage conversion. Step voltage down (Buck) or up (Boost) without wasting battery power as blisteringly hot heat."
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
        <Section title="Where & When You Need a DC-DC Converter" icon={<ArrowDownUp size={18} />}>
          <p className="mb-4 text-sm text-zinc-600">
            Real-world power challenges in Arduino and IoT systems and the right converter topology for each.
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

        {/* INTERACTIVE CONVERTER TOPOLOGY & EFFICIENCY CALCULATOR */}
        <Section title="Interactive Topology & Efficiency Calculator" icon={<Calculator size={16} />}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)]">
            <div className="flex flex-col gap-4">
              <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4 space-y-4">
                {/* Vin input */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-zinc-700">
                    <span>Input Voltage (Vin):</span>
                    <span className="font-mono font-bold text-teal-800">{vin.toFixed(1)} V</span>
                  </div>
                  <input
                    type="range"
                    min={3}
                    max={24}
                    step={0.5}
                    value={vin}
                    onChange={(e) => setVin(Number(e.target.value))}
                    className="mt-2 h-2 w-full cursor-pointer accent-teal-700"
                  />
                  <div className="mt-1 flex justify-between text-[11px] text-zinc-500">
                    <span>3.7V (18650 Battery)</span>
                    <span>12V (Car / Wall adapter)</span>
                    <span>24V</span>
                  </div>
                </div>

                {/* Vout input */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-zinc-700">
                    <span>Desired Output Voltage (Vout):</span>
                    <span className="font-mono font-bold text-teal-800">{vout.toFixed(1)} V</span>
                  </div>
                  <div className="mt-2 flex gap-2">
                    {[3.3, 5.0, 9.0, 12.0].map((v) => (
                      <button
                        key={v}
                        type="button"
                        aria-pressed={vout === v}
                        onClick={() => setVout(v)}
                        className={`flex-1 rounded-md py-1.5 font-mono text-xs font-semibold transition-colors ${
                          vout === v ? "bg-teal-700 text-white" : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100"
                        }`}
                      >
                        {v.toFixed(1)}V
                      </button>
                    ))}
                  </div>
                </div>

                {/* Current load */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-zinc-700">
                    <span>Load Current (Iout):</span>
                    <span className="font-mono font-bold text-teal-800">{currentMa} mA ({currentAmps.toFixed(2)} A)</span>
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={2000}
                    step={50}
                    value={currentMa}
                    onChange={(e) => setCurrentMa(Number(e.target.value))}
                    className="mt-2 h-2 w-full cursor-pointer accent-teal-700"
                  />
                </div>
              </div>

              <div className="rounded-md border border-zinc-200 bg-white p-4">
                <ConverterDrawing className="mx-auto w-full max-w-xs" />
              </div>
            </div>

            {/* Live Recommendation & Comparison */}
            <div className="flex flex-col justify-between gap-4">
              <div className="rounded-md border border-teal-200 bg-teal-50 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold tracking-wider text-teal-800 uppercase">Recommended Topology</span>
                  <Badge tone={isBuck ? "teal" : isBoost ? "amber" : "violet"}>
                    {isBuck ? "STEP-DOWN (BUCK)" : isBoost ? "STEP-UP (BOOST)" : "BUCK-BOOST"}
                  </Badge>
                </div>
                <div className="mt-2 text-2xl font-bold tracking-tight text-teal-950">
                  {isBuck && "You need a Buck (Step-Down) Converter"}
                  {isBoost && "You need a Boost (Step-Up) Converter"}
                  {isBuckBoost && "You need a Buck-Boost / SEPIC Converter"}
                </div>
                <p className="mt-1 text-xs text-teal-900 leading-relaxed">
                  {isBuck && `Because Vin (${vin.toFixed(1)}V) is higher than Vout (${vout.toFixed(1)}V), a Step-Down module like the LM2596 or MP1584 will chop voltage efficiently.`}
                  {isBoost && `Because Vin (${vin.toFixed(1)}V) is lower than Vout (${vout.toFixed(1)}V), a Step-Up module like the MT3608 will boost the voltage using magnetic inductive energy.`}
                  {isBuckBoost && `Because Vin (${vin.toFixed(1)}V) and Vout (${vout.toFixed(1)}V) are close, an automatic Buck-Boost (XL6009) ensures steady regulation.`}
                </p>

                {/* Efficiency vs Linear Heat Comparison */}
                <div className="mt-4 rounded-md border border-teal-300 bg-white p-3 space-y-2 text-xs">
                  <div className="font-semibold text-zinc-900 flex items-center justify-between">
                    <span>Power Comparison for this load:</span>
                    <span className="text-zinc-500 font-mono">Load: {outputPowerWatts.toFixed(2)} W</span>
                  </div>

                  <div className="flex items-center justify-between text-emerald-800 font-medium">
                    <span className="flex items-center gap-1">
                      <Sparkles size={13} /> DC-DC Switch-Mode:
                    </span>
                    <span className="font-mono">~{dcdcEfficiency}% Efficient (Runs Cool)</span>
                  </div>

                  {vin > vout && (
                    <div className="flex items-center justify-between text-rose-700 font-medium border-t border-zinc-100 pt-2">
                      <span className="flex items-center gap-1">
                        <Flame size={13} /> Old Linear Regulator (7805):
                      </span>
                      <span className="font-mono text-right">
                        {linearEfficiency}% Eff. · {linearWasteWatts.toFixed(2)}W WASTED AS HEAT!
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Blue Trimmer Rule Box */}
              <div className="rounded-md border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900">
                <div className="font-bold flex items-center gap-1.5">
                  <Gauge size={14} className="text-amber-700" /> The Blue Multi-Turn Trimmer Screw Rule:
                </div>
                <p className="mt-1 leading-relaxed">
                  Right out of the box, turning the tiny brass screw 1–2 times seems to do nothing. These are 25-turn potentiometers! You must turn the screw <strong>10 to 15 full turns counter-clockwise</strong> with a multimeter connected before the voltage begins dropping.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* CONVERTER TOPOLOGIES */}
        <div>
          <h2 className="mb-1 text-lg font-semibold">Converter Topologies</h2>
          <p className="mb-4 text-sm text-zinc-600">The 3 fundamental switch-mode conversion architectures.</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {types.map((t) => (
              <div key={t.id} className="flex flex-col rounded-md border border-zinc-200 bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-sm text-zinc-900">{t.name}</span>
                  <Badge tone={t.id === "buck" ? "teal" : t.id === "boost" ? "amber" : "violet"}>
                    {t.typicalEfficiency}
                  </Badge>
                </div>
                <p className="mt-2 text-xs font-mono text-zinc-700">{t.voltageRelation}</p>
                <p className="mt-1 text-xs text-zinc-500">{t.heatDissipation}</p>
                <div className="mt-3 border-t border-zinc-100 pt-2.5 text-xs text-zinc-600">
                  <span className="font-semibold text-teal-800">Typical Uses: </span>
                  {t.uses.join(" · ")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* POPULAR MODULES BREAKDOWN */}
        <div>
          <h2 className="mb-1 text-lg font-semibold">Popular Off-the-Shelf Modules</h2>
          <p className="mb-4 text-sm text-zinc-600">The most common pre-assembled DC-DC boards available in Arduino kits.</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {popularModules.map((m) => (
              <div key={m.name} className="flex flex-col rounded-md border border-zinc-200 bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-sm text-zinc-900">{m.name}</span>
                  <Badge tone={m.topology.includes("Buck") ? "teal" : "amber"}>{m.topology}</Badge>
                </div>
                <dl className="mt-3 space-y-1 text-xs border-t border-zinc-100 pt-2.5">
                  <div className="flex justify-between">
                    <dt className="text-zinc-500">Input Range:</dt>
                    <dd className="font-mono text-zinc-800">{m.inputRange}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-zinc-500">Output Range:</dt>
                    <dd className="font-mono text-zinc-800">{m.outputRange}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-zinc-500">Max Current:</dt>
                    <dd className="font-mono font-semibold text-teal-800">{m.maxCurrent}</dd>
                  </div>
                </dl>
                <div className="mt-3 border-t border-zinc-100 pt-2.5 text-xs text-zinc-600">
                  <span className="font-semibold text-zinc-700">Best for: </span>
                  {m.whenToUse}
                </div>
              </div>
            ))}
          </div>
        </div>

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
          <Section title="Step-By-Step Multimeter Calibration Guide" icon={<Code size={16} />}>
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
