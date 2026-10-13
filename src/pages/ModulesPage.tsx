import { Link } from "react-router-dom";
import { ShieldCheck, Zap } from "lucide-react";
import { modules, sensors } from "../data";
import { BoardIcon, PageHeader, Section, StatusBadge } from "../components/ui";

const KEY_SPECS = ["Microcontroller", "Clock", "Logic level", "Wireless"];

const MODULE_WHEN_TO_USE = [
  {
    scenario: "Breadboard Prototyping & 5V Sensor Interfacing",
    why: "Perfect DIP footprint for solderless breadboards with native 5V I/O logic that directly drives most hobby sensors without requiring voltage level shifters.",
    recommended: "Arduino Nano (ATmega328P, 5V, 16 MHz)",
  },
  {
    scenario: "Cloud IoT, Wi-Fi Web Servers & Bluetooth Telemetry",
    why: "When your project needs to publish sensor telemetry to MQTT, run an HTTP dashboard, or pair with a smartphone app over BLE.",
    recommended: "ESP32 (Dual-core 240 MHz, Wi-Fi & BLE, 3.3V)",
  },
  {
    scenario: "Fast DSP, PIO State Machines & Dual-Core Multitasking",
    why: "Dual ARM Cortex-M0+ cores and hardware Programmable I/O (PIO) let you generate custom hardware bus protocols with zero CPU overhead.",
    recommended: "Raspberry Pi Pico (RP2040, 133 MHz, 3.3V)",
  },
];

export default function ModulesPage() {
  return (
    <>
      <PageHeader title="Modules" description="Boards the sensors connect to. Start with the Arduino Nano; more boards will be added over time." />

      <div className="mb-6 flex flex-col gap-6">
        {/* PURPOSE - MAIN ON TOP */}
        <div className="rounded-md border border-teal-200 bg-teal-50 p-5">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-teal-800 uppercase">
            <Zap size={16} className="text-teal-700" /> Core Purpose
          </div>
          <p className="mt-2 text-base font-medium leading-relaxed text-teal-950 sm:text-lg">
            Microcontroller boards are the computing brain of every IoT system. They execute your embedded firmware instructions, sample physical sensor values in microsecond loops, make autonomous decisions, control power actuators like relays and MOSFETs, and transmit telemetry to the cloud.
          </p>
        </div>

        {/* WHERE & WHEN TO USE - MAIN ON TOP */}
        <Section title="Where & When You Need Each Board" icon={<ShieldCheck size={18} />}>
          <p className="mb-4 text-sm text-zinc-600">
            Choose the right microcontroller family based on project voltage, processing needs, and wireless requirements.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MODULE_WHEN_TO_USE.map((item) => (
              <div key={item.scenario} className="flex flex-col rounded-md border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-teal-700 text-xs font-bold text-white">
                    !
                  </span>
                  <h3 className="font-semibold text-zinc-900 leading-snug">{item.scenario}</h3>
                </div>
                <p className="mt-2.5 text-xs text-zinc-600 leading-relaxed">{item.why}</p>
                <div className="mt-auto pt-3 border-t border-zinc-200/60 text-xs">
                  <span className="font-semibold text-teal-800">Best match: </span>
                  <span className="font-mono text-zinc-800">{item.recommended}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {modules.map((m) => {
          const wired = sensors.filter((s) => s.wiring[m.id]).length;
          return (
            <li key={m.id}>
              <Link to={`/modules/${m.id}`} className="group flex h-full flex-col rounded-md border border-zinc-200 bg-white p-5 transition-colors hover:border-teal-600">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex size-10 items-center justify-center rounded-md bg-teal-50 text-teal-700">
                    <BoardIcon size={20} />
                  </span>
                  <StatusBadge status={m.status} />
                </div>
                <div className="mt-4 text-xs text-zinc-500">{m.family}</div>
                <h2 className="text-lg font-semibold text-zinc-900 group-hover:text-teal-800">{m.name}</h2>
                <p className="mt-1.5 line-clamp-3 text-sm text-zinc-600">{m.summary}</p>

                <dl className="mt-4 flex flex-col gap-1.5 border-t border-zinc-100 pt-4 text-sm">
                  {KEY_SPECS.map((label) => {
                    const spec = m.specs.find((s) => s.label.startsWith(label));
                    return spec ? (
                      <div key={label} className="flex justify-between gap-3">
                        <dt className="text-zinc-500">{label}</dt>
                        <dd className="text-right font-medium text-zinc-800">{spec.value}</dd>
                      </div>
                    ) : null;
                  })}
                </dl>
                <div className="mt-auto pt-4 text-xs text-zinc-500">
                  {wired > 0 ? `Wiring ready for ${wired} sensors` : "Sensor wiring coming soon"}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
