import { useState } from "react";
import { BookOpen, Check, Code, Layers, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { optocouplerGuide } from "../data";
import { PageHeader, Section } from "../components/ui";
import CodeBlock from "../components/CodeBlock";

const { purpose, whenToUse, basics, types, commonParts, examples } = optocouplerGuide;

export default function OptocouplersPage() {
  const [inputSignal, setInputSignal] = useState<"LOW" | "HIGH">("LOW");
  const isLedOn = inputSignal === "HIGH";
  const selectedExample = examples[0];

  return (
    <>
      <PageHeader
        title="Optocouplers"
        description="The optical barrier. Transmit control signals across 5,000V of physical galvanic isolation using an infrared LED and phototransistor."
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
        <Section title="Where & When You Need an Optocoupler" icon={<ShieldCheck size={18} />}>
          <p className="mb-4 text-sm text-zinc-600">
            Real-world circuit scenarios requiring optical isolation between microcontrollers and high-voltage loads.
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

        {/* INTERACTIVE OPTICAL ISOLATION SIMULATOR */}
        <Section
          title="Interactive Optical Isolation Simulator"
          icon={<Sparkles size={18} />}
          aside={
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Arduino Pin:</span>
              <button
                type="button"
                onClick={() => setInputSignal((s) => (s === "LOW" ? "HIGH" : "LOW"))}
                className={`rounded-md px-3 py-1 text-xs font-bold transition-colors ${
                  isLedOn ? "bg-teal-700 text-white" : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                {inputSignal} ({isLedOn ? "5V Active" : "0V Idle"})
              </button>
            </div>
          }
        >
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Diagram */}
            <div className="flex flex-col items-center justify-center rounded-md border border-zinc-200 bg-zinc-900 p-6 text-white">
              <div className="mb-3 text-xs tracking-wider text-zinc-400 uppercase font-mono">
                Inside PC817 (Zero Copper Connection)
              </div>
              <div className="flex w-full max-w-sm items-center justify-between">
                {/* Input LED Side */}
                <div className="flex flex-col items-center rounded-md border border-zinc-700 bg-zinc-800 p-3">
                  <span className="text-[11px] text-zinc-400">MCU 5V Side</span>
                  <div
                    className={`mt-2 flex size-12 items-center justify-center rounded-full border text-xs font-bold transition-colors ${
                      isLedOn
                        ? "border-amber-400 bg-amber-500/30 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                        : "border-zinc-700 bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    IR LED
                  </div>
                  <span className="mt-2 font-mono text-[11px] text-zinc-300">
                    {isLedOn ? "Glows (ON)" : "Dark (OFF)"}
                  </span>
                </div>

                {/* Optical Light Beam */}
                <div className="flex flex-1 flex-col items-center px-2">
                  <span className="text-[10px] text-zinc-500">Photons</span>
                  <div
                    className={`my-1 h-1 w-full rounded transition-all duration-300 ${
                      isLedOn ? "bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)]" : "bg-zinc-800"
                    }`}
                  />
                  <span className="text-[10px] text-teal-400 font-mono">5000V Isolation</span>
                </div>

                {/* Output Phototransistor Side */}
                <div className="flex flex-col items-center rounded-md border border-zinc-700 bg-zinc-800 p-3">
                  <span className="text-[11px] text-zinc-400">24V / High Power</span>
                  <div
                    className={`mt-2 flex size-12 items-center justify-center rounded-full border text-xs font-bold transition-colors ${
                      isLedOn
                        ? "border-teal-400 bg-teal-500/30 text-teal-300"
                        : "border-zinc-700 bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    Photo-Tx
                  </div>
                  <span className="mt-2 font-mono text-[11px] text-zinc-300">
                    {isLedOn ? "Conducts (LOW)" : "Open (HIGH)"}
                  </span>
                </div>
              </div>
            </div>

            {/* Explanation & Electrical State */}
            <div className="flex flex-col justify-between rounded-md border border-teal-200 bg-teal-50/60 p-5">
              <div>
                <div className="text-xs font-semibold text-teal-800 uppercase">Live Output State</div>
                <div className="mt-1 text-2xl font-bold text-teal-950">
                  {isLedOn ? "Load Circuit Switched ON" : "Load Circuit Disconnected"}
                </div>
                <p className="mt-2 text-xs text-teal-900 leading-relaxed">
                  Notice that the high-voltage side and the Arduino side do NOT share a common Ground wire. If lightning strikes or a 240V AC motor shorts to ground, the high voltage cannot enter your Arduino or destroy your computer&apos;s USB port.
                </p>
              </div>

              <div className="mt-4 border-t border-teal-200 pt-3 text-xs text-teal-900">
                <span className="font-semibold">CTR Ratio: </span>
                Typical PC817 CTR is ~100%, meaning 10mA into the input LED allows up to 10mA to flow through the phototransistor to ground.
              </div>
            </div>
          </div>
        </Section>

        {/* CORE BASICS */}
        <Section title="Optocoupler Fundamentals" icon={<BookOpen size={18} />}>
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
        <Section title="Optocoupler Categories" icon={<Layers size={18} />}>
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

        {/* COMMON PARTS TABLE */}
        <Section title="Popular Optocoupler Chips" icon={<Check size={18} />}>
          <div className="overflow-x-auto rounded-md border border-zinc-200 bg-white">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200 bg-zinc-50 font-semibold text-zinc-700">
                <tr>
                  <th className="px-4 py-2.5">Part #</th>
                  <th className="px-4 py-2.5">Channels</th>
                  <th className="px-4 py-2.5">Package</th>
                  <th className="px-4 py-2.5">Isolation Voltage</th>
                  <th className="px-4 py-2.5">Max Output Voltage</th>
                  <th className="px-4 py-2.5">Typical Use</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {commonParts.map((p) => (
                  <tr key={p.part} className="hover:bg-zinc-50">
                    <td className="px-4 py-2.5 font-bold text-teal-800 font-mono">{p.part}</td>
                    <td className="px-4 py-2.5 text-zinc-700">{p.channels}</td>
                    <td className="px-4 py-2.5 text-zinc-600 font-mono">{p.package}</td>
                    <td className="px-4 py-2.5 text-emerald-800 font-medium">{p.isolation}</td>
                    <td className="px-4 py-2.5 text-zinc-700">{p.vceMax}</td>
                    <td className="px-4 py-2.5 text-zinc-600">{p.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* EXAMPLE CODE */}
        {selectedExample && (
          <Section title={selectedExample.title} icon={<Code size={18} />}>
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
                <CodeBlock lines={Array.isArray(selectedExample.code) ? selectedExample.code : selectedExample.code.split("\n")} filename="optocoupler_input.ino" />
              </div>
            </div>
          </Section>
        )}
      </div>
    </>
  );
}
