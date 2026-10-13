import { useEffect, useRef, useState } from "react";
import { BookOpen, Check, Code, Play, ShieldCheck, Square, Volume2, Zap } from "lucide-react";
import { buzzerGuide } from "../data";
import { Badge, PageHeader, Section } from "../components/ui";
import CodeBlock from "../components/CodeBlock";

const { purpose, whenToUse, basics, commonParts, examples } = buzzerGuide;

const NOTES = [
  { name: "C4 (262 Hz)", freq: 262 },
  { name: "D4 (294 Hz)", freq: 294 },
  { name: "E4 (330 Hz)", freq: 330 },
  { name: "F4 (349 Hz)", freq: 349 },
  { name: "G4 (392 Hz)", freq: 392 },
  { name: "A4 (440 Hz)", freq: 440 },
  { name: "B4 (494 Hz)", freq: 494 },
  { name: "C5 (523 Hz)", freq: 523 },
];

export default function BuzzersPage() {
  const [activeBeeping, setActiveBeeping] = useState(false);
  const [playingFreq, setPlayingFreq] = useState<number | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  const stopSound = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch {}
      oscRef.current = null;
    }
    setActiveBeeping(false);
    setPlayingFreq(null);
  };

  const playTone = (frequency: number) => {
    stopSound();
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.type = "square"; // Buzzer-like square wave
      osc.frequency.setValueAtTime(frequency, audioCtxRef.current.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtxRef.current.currentTime); // Soft pleasant volume
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();
      oscRef.current = osc;
      setPlayingFreq(frequency);
    } catch {}
  };

  const toggleActiveBuzzer = () => {
    if (activeBeeping) {
      stopSound();
    } else {
      playTone(2300); // Fixed 2.3 kHz active buzzer pitch
      setActiveBeeping(true);
    }
  };

  useEffect(() => {
    return () => {
      stopSound();
    };
  }, []);

  const selectedExample = examples[0];

  return (
    <>
      <PageHeader
        title="Buzzers"
        description="Acoustic transducers for alarms, beeps, and melodies. Master the critical difference between Active and Passive buzzers."
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
        <Section title="Where & When You Need a Buzzer" icon={<ShieldCheck size={18} />}>
          <p className="mb-4 text-sm text-zinc-600">
            Learn which buzzer type fits your project scenario so you avoid silent or distorted audio.
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

        {/* INTERACTIVE BUZZER AUDIO SYNTHESIZER */}
        <Section title="Interactive Active vs Passive Audio Simulator" icon={<Volume2 size={18} />}>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Active Buzzer Simulator */}
            <div className="flex flex-col justify-between rounded-md border border-zinc-200 bg-zinc-50 p-5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-wider text-zinc-500 uppercase">Mode 1: Active Buzzer</span>
                  <Badge tone={activeBeeping ? "rose" : "neutral"}>
                    {activeBeeping ? "digitalWrite(HIGH)" : "digitalWrite(LOW)"}
                  </Badge>
                </div>
                <h3 className="mt-2 text-base font-bold text-zinc-900">Fixed-Pitch 2.3 kHz Beep</h3>
                <p className="mt-1 text-xs text-zinc-600 leading-relaxed">
                  Has an internal circuit. Simply applying 5V triggers a loud continuous warning sound. You cannot change its musical pitch.
                </p>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleActiveBuzzer}
                  className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-bold text-white transition-colors ${
                    activeBeeping ? "bg-rose-600 hover:bg-rose-700" : "bg-teal-700 hover:bg-teal-800"
                  }`}
                >
                  {activeBeeping ? <Square size={14} /> : <Play size={14} />}
                  {activeBeeping ? "Stop Alarm Beep" : "Test 5V Beep"}
                </button>
                {activeBeeping && <span className="animate-pulse text-xs text-rose-700 font-mono font-medium">BEEPING!</span>}
              </div>
            </div>

            {/* Passive Buzzer Simulator */}
            <div className="flex flex-col justify-between rounded-md border border-teal-200 bg-teal-50/60 p-5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-wider text-teal-800 uppercase">Mode 2: Passive Buzzer</span>
                  <Badge tone="teal">tone(pin, freq)</Badge>
                </div>
                <h3 className="mt-2 text-base font-bold text-teal-950">Musical Tone Frequency Generator</h3>
                <p className="mt-1 text-xs text-teal-900 leading-relaxed">
                  Pure magnetic diaphragm. Click different musical frequencies below to synthesize real notes on the fly:
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {NOTES.map((n) => {
                  const isCurrent = playingFreq === n.freq;
                  return (
                    <button
                      key={n.name}
                      type="button"
                      onClick={() => playTone(n.freq)}
                      className={`rounded-md px-2.5 py-1 text-xs font-mono font-semibold transition-colors ${
                        isCurrent
                          ? "bg-teal-700 text-white shadow-xs"
                          : "border border-teal-300 bg-white text-teal-900 hover:bg-teal-100"
                      }`}
                    >
                      {n.name}
                    </button>
                  );
                })}
              </div>

              {playingFreq && (
                <div className="mt-4 flex items-center justify-between border-t border-teal-200 pt-3 text-xs">
                  <span className="text-teal-900">Playing: <strong className="font-mono">{playingFreq} Hz</strong></span>
                  <button type="button" onClick={stopSound} className="text-xs text-rose-700 font-semibold hover:underline">
                    Stop Note
                  </button>
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* CORE BASICS */}
        <Section title="Buzzer Fundamentals" icon={<BookOpen size={18} />}>
          <div className="grid gap-4 sm:grid-cols-3">
            {basics.map((b) => (
              <div key={b.title} className="rounded-md border border-zinc-200 bg-white p-4">
                <h3 className="font-semibold text-zinc-900">{b.title}</h3>
                <p className="mt-2 text-xs text-zinc-600 leading-relaxed">{b.text}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* COMMON PARTS TABLE */}
        <Section title="Buzzer Comparison Matrix" icon={<Check size={18} />}>
          <div className="overflow-x-auto rounded-md border border-zinc-200 bg-white">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200 bg-zinc-50 font-semibold text-zinc-700">
                <tr>
                  <th className="px-4 py-2.5">Category</th>
                  <th className="px-4 py-2.5">Voltage</th>
                  <th className="px-4 py-2.5">Current</th>
                  <th className="px-4 py-2.5">Sound Frequency</th>
                  <th className="px-4 py-2.5">Decibels</th>
                  <th className="px-4 py-2.5">How to Control in Code</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {commonParts.map((p) => (
                  <tr key={p.type} className="hover:bg-zinc-50">
                    <td className="px-4 py-2.5 font-bold text-teal-800">{p.type}</td>
                    <td className="px-4 py-2.5 text-zinc-700 font-mono">{p.voltage}</td>
                    <td className="px-4 py-2.5 text-zinc-600">{p.current}</td>
                    <td className="px-4 py-2.5 text-zinc-700">{p.frequency}</td>
                    <td className="px-4 py-2.5 text-emerald-800 font-medium">{p.decibels}</td>
                    <td className="px-4 py-2.5 font-mono text-zinc-700">{p.control}</td>
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
                <CodeBlock lines={Array.isArray(selectedExample.code) ? selectedExample.code : selectedExample.code.split("\n")} filename="buzzer_melody.ino" />
              </div>
            </div>
          </Section>
        )}
      </div>
    </>
  );
}
