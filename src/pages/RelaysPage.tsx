import { useState } from "react";
import { BookOpen, Check, Code, Power, ShieldAlert, ShieldCheck, Sparkles, TriangleAlert, Zap } from "lucide-react";
import { relayGuide } from "../data";
import { Badge, PageHeader, Section } from "../components/ui";
import CodeBlock from "../components/CodeBlock";
import { RelayDrawing, RelaySimulatorDrawing } from "../components/illustrations";
import { pinTone } from "../lib/format";

const { purpose, whenToUse, basics, safety, terminals, types, modules, jdVccGuide, examples } = relayGuide;

export default function RelaysPage() {
  const [triggerMode, setTriggerMode] = useState<"active-low" | "active-high">("active-low");
  const [pinSignal, setPinSignal] = useState<"LOW" | "HIGH">("HIGH"); // default HIGH for active-low is OFF
  const [loadWire, setLoadWire] = useState<"no" | "nc">("no");
  const [exampleId, setExampleId] = useState(examples[0]?.id ?? "");

  // Energized calculation based on active-low vs active-high trigger
  const isEnergized = triggerMode === "active-low" ? pinSignal === "LOW" : pinSignal === "HIGH";
  const isBulbLit = (loadWire === "no" && isEnergized) || (loadWire === "nc" && !isEnergized);
  const selectedExample = examples.find((e) => e.id === exampleId) ?? examples[0];

  const togglePin = () => {
    setPinSignal((prev) => (prev === "LOW" ? "HIGH" : "LOW"));
  };

  return (
    <>
      <PageHeader
        title="Relays"
        description="An electrically operated switch. Safely control high-power motors, valves, and lamps from your Arduino Nano."
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
        <Section title="Where & When You Need a Relay" icon={<ShieldCheck size={18} />}>
          <p className="mb-4 text-sm text-zinc-600">
            Real-world circuit scenarios requiring complete galvanic isolation and high-power AC/DC switching.
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

        {/* Safety Banner */}
        <div className="flex gap-3 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <TriangleAlert size={20} className="mt-0.5 shrink-0 text-amber-600" aria-hidden />
          <div>
            <div className="font-semibold text-amber-950">High Voltage Safety</div>
            <p className="mt-0.5 text-amber-900">{safety}</p>
          </div>
        </div>

        {/* Interactive Relay Simulator */}
        <Section
          title="Interactive Relay Simulator"
          icon={<Power size={16} />}
          aside={
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Module trigger:</span>
              <div className="flex rounded-md border border-zinc-200 p-0.5" role="group" aria-label="Trigger mode">
                {(["active-low", "active-high"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    aria-pressed={triggerMode === mode}
                    onClick={() => {
                      setTriggerMode(mode);
                      // keep relay in off state initially when toggling trigger mode
                      setPinSignal(mode === "active-low" ? "HIGH" : "LOW");
                    }}
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                      triggerMode === mode ? "bg-teal-700 text-white" : "text-zinc-600 hover:bg-zinc-100"
                    }`}
                  >
                    {mode === "active-low" ? "Active-LOW (Standard)" : "Active-HIGH"}
                  </button>
                ))}
              </div>
            </div>
          }
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            <div className="flex flex-col gap-4">
              <div className="overflow-hidden rounded-md border border-zinc-200 bg-zinc-900 p-2 sm:p-4">
                <RelaySimulatorDrawing energized={isEnergized} loadWire={loadWire} className="mx-auto w-full max-w-lg" />
              </div>

              {/* Controls bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-zinc-600">Arduino Pin D7:</span>
                  <button
                    type="button"
                    onClick={togglePin}
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-xs font-bold transition-colors ${
                      pinSignal === "LOW" ? "bg-sky-600 text-white" : "bg-zinc-200 text-zinc-800 hover:bg-zinc-300"
                    }`}
                  >
                    digitalWrite(7, {pinSignal})
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-zinc-600">Load wire to:</span>
                  <div className="flex rounded-md border border-zinc-200 bg-white p-0.5">
                    {(["no", "nc"] as const).map((w) => (
                      <button
                        key={w}
                        type="button"
                        aria-pressed={loadWire === w}
                        onClick={() => setLoadWire(w)}
                        className={`rounded-md px-2.5 py-1 text-xs font-semibold uppercase transition-colors ${
                          loadWire === w ? "bg-teal-700 text-white" : "text-zinc-600 hover:bg-zinc-100"
                        }`}
                      >
                        {w} ({w === "no" ? "Normally Open" : "Normally Closed"})
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Status Feedback Card */}
            <div className="flex flex-col justify-between gap-4">
              <div className={`rounded-md border p-4 transition-colors ${isEnergized ? "border-emerald-200 bg-emerald-50" : "border-zinc-200 bg-zinc-50"}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">Coil State</span>
                  <Badge tone={isEnergized ? "green" : "neutral"}>
                    {isEnergized ? "ENERGIZED (Active)" : "DE-ENERGIZED (Idle)"}
                  </Badge>
                </div>
                <div className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">
                  {isEnergized ? (
                    <span className="text-emerald-950 flex items-center gap-2">
                      <Sparkles size={20} className="text-emerald-600" /> Relay is ON (Clicked!)
                    </span>
                  ) : (
                    <span className="text-zinc-700">Relay is OFF</span>
                  )}
                </div>
                <p className="mt-1 text-sm text-zinc-600">
                  {triggerMode === "active-low"
                    ? `Pin D7 is ${pinSignal}. Since this module is Active-LOW, a ${pinSignal} signal ${isEnergized ? "energizes" : "releases"} the electromagnet coil.`
                    : `Pin D7 is ${pinSignal}. Since this module is Active-HIGH, a ${pinSignal} signal ${isEnergized ? "energizes" : "releases"} the electromagnet coil.`}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-md border border-zinc-200 bg-white p-2.5">
                    <span className="text-zinc-500">COM ↔ NO</span>
                    <div className={`mt-0.5 font-bold ${isEnergized ? "text-emerald-700" : "text-zinc-600"}`}>
                      {isEnergized ? "CONNECTED (Closed)" : "OPEN (Disconnected)"}
                    </div>
                  </div>
                  <div className="rounded-md border border-zinc-200 bg-white p-2.5">
                    <span className="text-zinc-500">COM ↔ NC</span>
                    <div className={`mt-0.5 font-bold ${!isEnergized ? "text-emerald-700" : "text-zinc-600"}`}>
                      {!isEnergized ? "CONNECTED (Closed)" : "OPEN (Disconnected)"}
                    </div>
                  </div>
                </div>

                <div className="mt-3 border-t border-zinc-200/60 pt-3 text-xs text-zinc-600">
                  <span className="font-semibold text-zinc-800">Load Result: </span>
                  {isBulbLit ? (
                    <span className="text-emerald-800 font-medium">Circuit is complete! External bulb receives power and illuminates.</span>
                  ) : (
                    <span className="text-zinc-600">Circuit is broken. External bulb remains unpowered.</span>
                  )}
                </div>
              </div>

              <div className="rounded-md border border-zinc-200 bg-white p-3.5 text-xs text-zinc-600">
                <div className="font-semibold text-zinc-800">Why Active-LOW?</div>
                <p className="mt-1">
                  Microcontroller pins like the ATmega328P can sink more current reliably than they can source. Active-LOW optocouplers connect the opto LED to VCC and let the pin pull it to GND.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* Terminal Blocks Guide (COM, NO, NC) */}
        <div>
          <h2 className="mb-1 text-lg font-semibold">Contact Terminals (COM, NO, NC)</h2>
          <p className="mb-4 text-sm text-zinc-600">The three screw terminals for wiring your high-power load circuit.</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {terminals.map((t) => (
              <div key={t.abbr} className="flex flex-col rounded-md border border-zinc-200 bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-base font-bold text-teal-800">{t.abbr}</span>
                  <Badge tone={t.abbr === "COM" ? "teal" : t.abbr === "NO" ? "green" : "amber"}>{t.name}</Badge>
                </div>
                <p className="mt-2 text-sm text-zinc-800">{t.meaning}</p>
                <div className="mt-auto pt-3 border-t border-zinc-100 text-xs text-zinc-600">
                  <span className="font-semibold text-zinc-700">Best for: </span>
                  {t.use}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Opto-Isolation & JD-VCC Guide */}
        <Section title="Full Opto-Isolation (JD-VCC Jumper)" icon={<ShieldAlert size={16} />}>
          <div className="flex flex-col gap-3 text-sm text-zinc-700 sm:flex-row sm:items-start">
            <div className="rounded-md border border-teal-200 bg-teal-50 p-4 sm:w-1/3">
              <div className="font-semibold text-teal-950">{jdVccGuide.title}</div>
              <p className="mt-1 text-xs text-teal-900">
                Found on 2-channel, 4-channel, and 8-channel Arduino relay modules.
              </p>
            </div>
            <div className="flex-1 rounded-md border border-zinc-200 bg-white p-4">
              <p className="leading-relaxed">{jdVccGuide.text}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-zinc-700">
                  <strong>Jumper ON:</strong> Arduino 5V powers both optocoupler & relay coil (simplest).
                </span>
                <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-zinc-700">
                  <strong>Jumper OFF:</strong> Arduino 5V powers optocoupler only; external 5V adapter powers coils (safest for 4+ relays).
                </span>
              </div>
            </div>
          </div>
        </Section>

        {/* Types of Relays */}
        <div>
          <h2 className="mb-1 text-lg font-semibold">Types of Relays</h2>
          <p className="mb-4 text-sm text-zinc-600">Choose the right relay mechanism for your project and load type.</p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {types.map((t) => (
              <li key={t.id} className="flex flex-col rounded-md border border-zinc-200 bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <RelayDrawing type={t.id} className="h-20 w-24" />
                  <Badge tone={t.id === "ssr" ? "rose" : t.id === "mosfet-module" ? "sky" : "teal"}>{t.switchingSpeed}</Badge>
                </div>
                <h3 className="mt-3 font-semibold text-zinc-900">{t.name}</h3>
                <p className="mt-1 text-xs text-zinc-500">{t.technology}</p>
                <div className="mt-3 space-y-1.5 text-xs">
                  <div>
                    <span className="font-medium text-zinc-500">Max rating: </span>
                    <span className="font-mono font-medium text-zinc-800">{t.maxCurrent}</span>
                  </div>
                  <div>
                    <span className="font-medium text-zinc-500">Isolation: </span>
                    <span className="text-zinc-700">{t.isolation}</span>
                  </div>
                  <div>
                    <span className="font-medium text-zinc-500">Good for: </span>
                    <span className="text-zinc-700">{t.uses.join(" · ")}</span>
                  </div>
                </div>

                <div className="mt-3 border-t border-zinc-100 pt-3">
                  <div className="text-[11px] font-semibold text-emerald-800">Pros:</div>
                  <ul className="mt-0.5 space-y-0.5 text-xs text-zinc-600">
                    {t.pros.map((p) => (
                      <li key={p} className="flex items-start gap-1.5">
                        <Check size={12} className="mt-0.5 shrink-0 text-emerald-600" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-3">
                  <p className="rounded-md border border-zinc-200 bg-zinc-50 p-2.5 text-xs text-zinc-700">{t.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Common Modules */}
        <div>
          <h2 className="mb-1 text-lg font-semibold">Common Breakout Modules</h2>
          <p className="mb-4 text-sm text-zinc-600">Pre-assembled modules available in Arduino beginner kits.</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {modules.map((m) => (
              <div key={m.id} className="flex flex-col rounded-md border border-zinc-200 bg-white p-3.5">
                <div className="flex items-center justify-between gap-1">
                  <Badge tone="teal">{m.channels} {m.channels === 1 ? "Channel" : "Channels"}</Badge>
                  <span className="font-mono text-[11px] text-zinc-400">{m.trigger}</span>
                </div>
                <h3 className="mt-2.5 font-semibold text-zinc-900 leading-snug">{m.name}</h3>
                <p className="mt-1 text-xs text-zinc-600">{m.purpose}</p>
                <dl className="mt-3 space-y-1 text-xs border-t border-zinc-100 pt-2.5">
                  <div>
                    <dt className="text-zinc-500">Coil:</dt>
                    <dd className="font-medium text-zinc-800">{m.coilVoltage}</dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500">Rating:</dt>
                    <dd className="font-medium text-zinc-800">{m.contactRating}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>

        {/* The Basics */}
        <Section title="The Basics" icon={<BookOpen size={16} />}>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {basics.map((b) => (
              <div key={b.title} className="rounded-md border border-zinc-200 bg-zinc-50 p-3.5">
                <h3 className="text-sm font-semibold text-zinc-900">{b.title}</h3>
                <p className="mt-1 text-sm text-zinc-600">{b.text}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Arduino Examples */}
        {selectedExample && (
          <Section title="Arduino Examples" icon={<Code size={16} />}>
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
                  Parts: {["Arduino Nano", ...selectedExample.parts].join(" · ")}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[20rem] text-sm">
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
