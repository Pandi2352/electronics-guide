import { useState } from "react";
import { BookOpen, Calculator, Flame, Layers, ShieldCheck, TriangleAlert, Zap } from "lucide-react";
import { regulatorGuide } from "../data";
import { Badge, PageHeader, Section } from "../components/ui";
import CodeBlock from "../components/CodeBlock";

const { purpose, whenToUse, basics, types, popularRegulators, examples } = regulatorGuide;

export default function RegulatorsPage() {
  const [vin, setVin] = useState<number>(12);
  const [vout, setVout] = useState<number>(3.3);
  const [currentMa, setCurrentMa] = useState<number>(300);

  const currentAmps = currentMa / 1000;
  const voltageDrop = Math.max(0, vin - vout);
  const powerWastedWatts = voltageDrop * currentAmps;
  const usefulPowerWatts = vout * currentAmps;
  const efficiency = vin > vout ? Math.round((vout / vin) * 100) : 0;

  const needsHeatsink = powerWastedWatts > 0.5;
  const shouldRecommendBuck = powerWastedWatts > 2.0;

  const selectedExample = examples[0];

  return (
    <>
      <PageHeader
        title="Voltage Regulators (LDOs)"
        description="Zero-noise linear voltage regulation. Drop battery or wall voltage down to steady 3.3V or 5V without switching ripple."
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
        <Section title="Where & When You Need a Linear Regulator" icon={<ShieldCheck size={18} />}>
          <p className="mb-4 text-sm text-zinc-600">
            Real-world circuit scenarios where linear LDOs provide the cleanest power for your electronics.
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

        {/* INTERACTIVE HEAT & EFFICIENCY CALCULATOR */}
        <Section title="Interactive Heat Dissipation & Efficiency Calculator" icon={<Calculator size={18} />}>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-4 rounded-md border border-zinc-200 bg-zinc-50 p-4">
              <div>
                <label className="text-xs font-semibold text-zinc-700">
                  Input Voltage ($V_{"{in}"}$): <span className="font-mono text-teal-700">{vin}V DC</span>
                </label>
                <div className="mt-1 flex gap-1.5">
                  {[5, 9, 12, 15, 24].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setVin(v)}
                      className={`rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
                        vin === v ? "bg-teal-700 text-white" : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      {v}V
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700">
                  Desired Output Voltage ($V_{"{out}"}$): <span className="font-mono text-teal-700">{vout}V</span>
                </label>
                <div className="mt-1 flex gap-1.5">
                  {[3.3, 5.0, 9.0].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setVout(v)}
                      className={`rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
                        vout === v ? "bg-teal-700 text-white" : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      {v}V
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700">
                  Load Current Draw: <span className="font-mono text-teal-700">{currentMa} mA</span>
                </label>
                <input
                  type="range"
                  min={50}
                  max={1000}
                  step={50}
                  value={currentMa}
                  onChange={(e) => setCurrentMa(Number(e.target.value))}
                  className="mt-2 h-2 w-full cursor-pointer accent-teal-700"
                />
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-md border border-zinc-200 bg-white p-5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">Power Efficiency</span>
                  <Badge tone={efficiency > 60 ? "green" : efficiency > 35 ? "amber" : "rose"}>
                    {efficiency}% Efficient
                  </Badge>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-zinc-900 font-mono">
                    {powerWastedWatts.toFixed(2)} W
                  </span>
                  <span className="text-xs font-semibold text-rose-700 flex items-center gap-1">
                    <Flame size={14} /> Wasted as pure Heat!
                  </span>
                </div>

                <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
                  Formula: $P_{"{diss}"} = (V_{"{in}"} - V_{"{out}"}) \times I = ({vin}V - {vout}V) \times {currentAmps.toFixed(2)}A = {powerWastedWatts.toFixed(2)}W$.
                  Useful power delivered to load: {usefulPowerWatts.toFixed(2)}W.
                </p>
              </div>

              {shouldRecommendBuck ? (
                <div className="mt-4 flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-900">
                  <TriangleAlert size={16} className="mt-0.5 shrink-0 text-rose-600" />
                  <div>
                    <strong>Warning: Extreme Heat Generation!</strong> Over 2 Watts wasted as heat. The regulator will burn fingers or shut down thermally. Use a <strong>DC-DC Buck Converter</strong> instead!
                  </div>
                </div>
              ) : needsHeatsink ? (
                <div className="mt-4 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                  <TriangleAlert size={16} className="mt-0.5 shrink-0 text-amber-600" />
                  <div>
                    <strong>Aluminum Heatsink Required:</strong> Dissipating over 0.5 Watts will cause bare TO-220 or SOT-223 chips to reach 70°C+.
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900">
                  <strong>Safe & Cool:</strong> Less than 0.5 Watts dissipated. The regulator will run lukewarm without a heatsink.
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* CORE BASICS */}
        <Section title="Regulator Fundamentals" icon={<BookOpen size={18} />}>
          <div className="grid gap-4 sm:grid-cols-3">
            {basics.map((b) => (
              <div key={b.title} className="rounded-md border border-zinc-200 bg-white p-4">
                <h3 className="font-semibold text-zinc-900">{b.title}</h3>
                <p className="mt-2 text-xs text-zinc-600 leading-relaxed">{b.text}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* TYPES OVERVIEW */}
        <Section title="Regulator Types" icon={<Layers size={18} />}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {types.map((t) => (
              <div key={t.id} className="flex flex-col rounded-md border border-zinc-200 bg-white p-4">
                <h3 className="font-semibold text-zinc-900">{t.name}</h3>
                <p className="mt-2 text-xs text-zinc-600 leading-relaxed">{t.summary}</p>
                <div className="mt-auto pt-3 border-t border-zinc-100 text-[11px] text-zinc-500">
                  <span className="font-medium text-zinc-700">Best for: </span>
                  {t.applications}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* POPULAR REGULATORS TABLE */}
        <Section title="Popular Voltage Regulator ICs" icon={<ShieldCheck size={18} />}>
          <div className="overflow-x-auto rounded-md border border-zinc-200 bg-white">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200 bg-zinc-50 font-semibold text-zinc-700">
                <tr>
                  <th className="px-4 py-2.5">Part #</th>
                  <th className="px-4 py-2.5">Output Voltage</th>
                  <th className="px-4 py-2.5">Max Input</th>
                  <th className="px-4 py-2.5">Max Current</th>
                  <th className="px-4 py-2.5">Dropout Voltage</th>
                  <th className="px-4 py-2.5">Package</th>
                  <th className="px-4 py-2.5">Typical Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {popularRegulators.map((p) => (
                  <tr key={p.part} className="hover:bg-zinc-50">
                    <td className="px-4 py-2.5 font-bold text-teal-800 font-mono">{p.part}</td>
                    <td className="px-4 py-2.5 font-medium text-zinc-900">{p.vout}</td>
                    <td className="px-4 py-2.5 text-zinc-600 font-mono">{p.vinMax}</td>
                    <td className="px-4 py-2.5 text-zinc-700">{p.maxCurrent}</td>
                    <td className="px-4 py-2.5 text-emerald-800 font-medium">{p.dropout}</td>
                    <td className="px-4 py-2.5 text-zinc-600">{p.package}</td>
                    <td className="px-4 py-2.5 text-zinc-600">{p.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* EXAMPLE CIRCUIT */}
        {selectedExample && (
          <Section title={selectedExample.title} icon={<Zap size={18} />}>
            <p className="mb-4 text-sm text-zinc-600">{selectedExample.description}</p>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
              <div className="flex flex-col gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-xs font-semibold text-zinc-900">Breadboard Wiring</div>
                <ul className="flex flex-col gap-2 text-xs">
                  {selectedExample.wiring.map((w, idx) => (
                    <li key={idx} className="flex flex-col rounded border border-zinc-200 bg-white p-2">
                      <div className="flex items-center gap-1.5 font-mono text-zinc-800">
                        <span className="font-semibold text-teal-700">{w.from}</span>
                        <span>→</span>
                        <span className="font-semibold text-teal-700">{w.to}</span>
                      </div>
                      {w.note && <span className="mt-1 text-[11px] text-zinc-500">{w.note}</span>}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <CodeBlock lines={Array.isArray(selectedExample.code) ? selectedExample.code : selectedExample.code.split("\n")} filename="regulator_circuit.ino" />
              </div>
            </div>
          </Section>
        )}
      </div>
    </>
  );
}
