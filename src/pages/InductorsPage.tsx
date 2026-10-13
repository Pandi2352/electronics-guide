import { useState } from "react";
import { Activity, BookOpen, Calculator, Layers, Radio, ShieldCheck, Zap } from "lucide-react";
import { inductorGuide } from "../data";
import { PageHeader, Section } from "../components/ui";
import CodeBlock from "../components/CodeBlock";

const { purpose, whenToUse, basics, types, commonParts, examples } = inductorGuide;

export default function InductorsPage() {
  const [inductanceUh, setInductanceUh] = useState<number>(100);
  const [freqKhz, setFreqKhz] = useState<number>(100);
  const [capUf, setCapUf] = useState<number>(10);

  // Inductive reactance: XL = 2 * pi * f * L
  const lHenries = inductanceUh * 1e-6;
  const fHertz = freqKhz * 1e3;
  const reactanceOhms = 2 * Math.PI * fHertz * lHenries;

  // LC Resonant frequency: f0 = 1 / (2 * pi * sqrt(L * C))
  const cFarads = capUf * 1e-6;
  const resonantFreqHz = 1 / (2 * Math.PI * Math.sqrt(lHenries * cFarads));
  const resonantFreqKhz = resonantFreqHz / 1000;

  const selectedExample = examples[0];

  return (
    <>
      <PageHeader
        title="Inductors"
        description="The magnetic energy reservoir. Choke high-frequency electrical noise, smooth current ripple, and store power in DC-DC converters."
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
        <Section title="Where & When You Need an Inductor" icon={<ShieldCheck size={18} />}>
          <p className="mb-4 text-sm text-zinc-600">
            Real-world circuit scenarios where inductors and ferrite beads solve noise and power issues.
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

        {/* INTERACTIVE REACTANCE & LC RESONANCE CALCULATOR */}
        <Section title="Interactive Inductive Reactance & LC Filter Calculator" icon={<Calculator size={18} />}>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-4 rounded-md border border-zinc-200 bg-zinc-50 p-4">
              <div>
                <label className="text-xs font-semibold text-zinc-700">
                  Inductance: <span className="font-mono text-teal-700">{inductanceUh} µH</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={500}
                  value={inductanceUh}
                  onChange={(e) => setInductanceUh(Number(e.target.value))}
                  className="mt-2 h-2 w-full cursor-pointer accent-teal-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700">
                  AC / Ripple Frequency: <span className="font-mono text-teal-700">{freqKhz} kHz</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={1000}
                  value={freqKhz}
                  onChange={(e) => setFreqKhz(Number(e.target.value))}
                  className="mt-2 h-2 w-full cursor-pointer accent-teal-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700">
                  Paired Filter Capacitor: <span className="font-mono text-teal-700">{capUf} µF</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={capUf}
                  onChange={(e) => setCapUf(Number(e.target.value))}
                  className="mt-2 h-2 w-full cursor-pointer accent-teal-700"
                />
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-md border border-teal-200 bg-teal-50/60 p-5">
              <div>
                <div className="text-xs font-semibold tracking-wider text-teal-800 uppercase">
                  Impedance to Noise (Reactance $X_L$)
                </div>
                <div className="mt-1 text-3xl font-bold text-teal-950">
                  {reactanceOhms > 1000 ? `${(reactanceOhms / 1000).toFixed(2)} kΩ` : `${reactanceOhms.toFixed(1)} Ω`}
                </div>
                <p className="mt-1.5 text-xs text-teal-800">
                  At this frequency, the inductor acts like an invisible barrier of this resistance to noise spikes, while letting pure DC flow with ~0Ω resistance!
                </p>
              </div>

              <div className="mt-4 border-t border-teal-200 pt-3">
                <div className="text-xs font-semibold text-teal-900">LC Resonant Cutoff Frequency ($f_0$):</div>
                <div className="mt-0.5 text-xl font-bold text-teal-950 font-mono">
                  {resonantFreqKhz.toFixed(2)} kHz
                </div>
                <p className="mt-1 text-xs text-teal-800">
                  Frequencies above this cutoff are sharply attenuated at -12 dB per octave.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* CORE BASICS */}
        <Section title="Inductor Fundamentals" icon={<BookOpen size={18} />}>
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
        <Section title="Inductor Types & Packages" icon={<Layers size={18} />}>
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
        <Section title="Popular Inductors in Arduino Hardware" icon={<Activity size={18} />}>
          <div className="overflow-x-auto rounded-md border border-zinc-200 bg-white">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200 bg-zinc-50 font-semibold text-zinc-700">
                <tr>
                  <th className="px-4 py-2.5">Inductance</th>
                  <th className="px-4 py-2.5">Code</th>
                  <th className="px-4 py-2.5">Current Rating</th>
                  <th className="px-4 py-2.5">Package</th>
                  <th className="px-4 py-2.5">Typical Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {commonParts.map((p) => (
                  <tr key={p.value} className="hover:bg-zinc-50">
                    <td className="px-4 py-2.5 font-bold text-teal-800 font-mono">{p.value}</td>
                    <td className="px-4 py-2.5 font-mono text-zinc-600">{p.code}</td>
                    <td className="px-4 py-2.5 text-zinc-700 font-medium">{p.current}</td>
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
          <Section title={selectedExample.title} icon={<Radio size={18} />}>
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
                <CodeBlock lines={Array.isArray(selectedExample.code) ? selectedExample.code : selectedExample.code.split("\n")} filename="inductor_filter.ino" />
              </div>
            </div>
          </Section>
        )}
      </div>
    </>
  );
}
