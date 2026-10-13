import { useState } from "react";
import { BookOpen, Check, Code, ShieldAlert, Sliders, TriangleAlert, Zap } from "lucide-react";
import { mosfetGuide } from "../data";
import { Badge, PageHeader, Section } from "../components/ui";
import CodeBlock from "../components/CodeBlock";
import { MosfetDrawing } from "../components/illustrations";
import { pinTone } from "../lib/format";

const { purpose, whenToUse, basics, types, commonParts, examples } = mosfetGuide;

export default function MosfetsPage() {
  const [pwmDuty, setPwmDuty] = useState<number>(100);
  const selectedExample = examples[0];
  const dutyPercent = Math.round((pwmDuty / 255) * 100);
  const isConducting = pwmDuty > 10;

  return (
    <>
      <PageHeader
        title="MOSFETs"
        description="Voltage-controlled high-power switch. Control massive 5A–50A currents and high-speed PWM LED dimming with zero control power."
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

        {/* LOGIC-LEVEL CRITICAL WARNING */}
        <div className="flex gap-3 rounded-md border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
          <TriangleAlert size={20} className="mt-0.5 shrink-0 text-rose-600" aria-hidden />
          <div>
            <div className="font-semibold text-rose-950">The #1 Beginner Trap: Always Use Logic-Level MOSFETs!</div>
            <p className="mt-0.5 text-rose-900 leading-relaxed">
              Standard power MOSFETs (like the ubiquitous <strong>IRF520</strong> or <strong>IRFZ44N</strong>) need <strong>10V</strong> at the Gate to turn on fully. When fed 5V or 3.3V directly from an Arduino pin, they stay in high-resistance linear mode and can rapidly overheat under heavy loads. Always choose <strong>Logic-Level MOSFETs</strong> (such as <strong>IRLZ44N</strong> or <strong>IRLB8721</strong> with an &quot;L&quot; in the name), which turn fully on at 3.3V–4.5V!
            </p>
          </div>
        </div>

        {/* WHERE & WHEN TO USE - MAIN ON TOP */}
        <Section title="Where & When You Need a MOSFET" icon={<ShieldAlert size={18} />}>
          <p className="mb-4 text-sm text-zinc-600">
            Why engineers choose a MOSFET over mechanical relays or BJT transistors for high-power switching.
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
                  <span className="font-semibold text-teal-800">Recommendation: </span>
                  <span className="font-mono text-zinc-800">{item.recommended}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* INTERACTIVE PWM GATE SIMULATOR */}
        <Section title="Interactive PWM Dimming & Gate Simulator" icon={<Sliders size={16} />}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)]">
            <div className="flex flex-col gap-4">
              <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex items-center justify-between text-xs font-medium text-zinc-700">
                  <span>PWM Duty Cycle (analogWrite value):</span>
                  <span className="font-mono font-bold text-teal-800">{pwmDuty} / 255 ({dutyPercent}%)</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={255}
                  value={pwmDuty}
                  onChange={(e) => setPwmDuty(Number(e.target.value))}
                  className="mt-3 h-2 w-full cursor-pointer accent-teal-700"
                />
                <div className="mt-2 flex justify-between text-[11px] text-zinc-500">
                  <span>0 (Fully OFF)</span>
                  <span>128 (50% Power)</span>
                  <span>255 (Full 100% ON)</span>
                </div>
              </div>

              <div className="rounded-md border border-zinc-200 bg-white p-6">
                <MosfetDrawing className="mx-auto w-full max-w-xs" />
                <div className="mt-4 flex justify-between text-xs font-mono text-zinc-500">
                  <span>Pin 1: Gate (Control)</span>
                  <span>Pin 2: Drain (Load -)</span>
                  <span>Pin 3: Source (GND)</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-4">
              <div
                className={`rounded-md border p-4 transition-colors ${
                  isConducting ? "border-emerald-200 bg-emerald-50" : "border-zinc-200 bg-zinc-50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">Channel State</span>
                  <Badge tone={isConducting ? "green" : "neutral"}>
                    {isConducting ? `CONDUCTING (${dutyPercent}% Power)` : "CUTOFF (OFF)"}
                  </Badge>
                </div>
                <div className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">
                  {isConducting ? (
                    <span className="text-emerald-950">R_DS(on) ~22 mΩ (Minimal Heat)</span>
                  ) : (
                    <span className="text-zinc-700">Channel Open (Zero Current)</span>
                  )}
                </div>
                <p className="mt-1 text-sm text-zinc-600">
                  {isConducting
                    ? `Gate is driven by Arduino PWM. During the HIGH pulses, Drain-Source resistance plummets to ~0.022 Ω, letting full 12V power through with negligible heat.`
                    : "Gate voltage is 0V (held by the 10kΩ pull-down resistor). The Drain-to-Source channel is fully closed."}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-md border border-zinc-200 bg-white p-2.5">
                    <span className="text-zinc-500">Static Gate Current</span>
                    <div className="mt-0.5 font-mono font-bold text-emerald-700">0.000 mA (Pure voltage)</div>
                  </div>
                  <div className="rounded-md border border-zinc-200 bg-white p-2.5">
                    <span className="text-zinc-500">PWM Switching Speed</span>
                    <div className="mt-0.5 font-mono font-bold text-zinc-900">&lt; 100 Nanoseconds</div>
                  </div>
                </div>
              </div>

              <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600">
                <span className="font-semibold text-zinc-800">Essential Wiring Tip: </span>
                Always connect a <strong>100Ω resistor</strong> in series with the Gate to absorb microsecond capacitive inrush spikes, and a <strong>10kΩ resistor</strong> from Gate to GND so the pin never floats during reboot.
              </div>
            </div>
          </div>
        </Section>

        {/* MOSFET TYPES */}
        <div>
          <h2 className="mb-1 text-lg font-semibold">MOSFET Families</h2>
          <p className="mb-4 text-sm text-zinc-600">Compare N-Channel and P-Channel options.</p>
          <ul className="grid gap-3 sm:grid-cols-3">
            {types.map((t) => (
              <li key={t.id} className="flex flex-col rounded-md border border-zinc-200 bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-zinc-900">{t.name}</span>
                  <Badge tone={t.id === "n-channel-logic" ? "green" : t.id === "p-channel-logic" ? "amber" : "neutral"}>
                    {t.rdsOn}
                  </Badge>
                </div>
                <p className="mt-2 text-xs text-zinc-600">{t.gateThreshold}</p>
                <dl className="mt-3 space-y-1 text-xs border-t border-zinc-100 pt-2.5">
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
