import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SearchX, ShieldCheck, Zap } from "lucide-react";
import { LEVELS, projects, sensorBySku } from "../data";
import { PageHeader, Section } from "../components/ui";
import Dropdown from "../components/Dropdown";
import ProjectCard from "../components/ProjectCard";
import type { Level, Project } from "../types";

const LEVEL_TABS: { id: "" | Level; label: string; hint?: string }[] = [{ id: "", label: "All" }, ...LEVELS];

const PROJECT_WHEN_TO_USE = [
  {
    scenario: "Level 1: Fundamentals & Basic I/O",
    why: "Master digital/analog pin reading, avoid floating pins with pull-ups, and get comfortable with serial console debugging.",
    recommended: "LDR Automatic Night Light, HC-SR04 Distance Ruler, Touch Sensor Switch",
  },
  {
    scenario: "Level 2: Automated Control & Drivers",
    why: "Connect physical inputs to active actuators (buzzers, relays, servo motors) using conditional thresholds and hysteresis.",
    recommended: "Smart Soil Moisture Feeder, Intruder Alarm Buzzer, Servo Sun Tracker",
  },
  {
    scenario: "Level 3: Multi-Sensor Instruments & Displays",
    why: "Integrate multiple I2C/SPI sensors simultaneously, display live graphs on OLED screens, and manage power budgets.",
    recommended: "OLED Weather Dashboard, 6-DOF Gesture Controller, Air Quality Logger",
  },
];

// Only sensors that actually appear in a project are offered in the filter.
const SENSOR_OPTIONS = [
  { value: "", label: "Any sensor" },
  ...[...new Set(projects.flatMap((p) => p.sensors))]
    .map((sku) => ({ value: sku, label: sensorBySku.get(sku)?.name ?? sku }))
    .sort((a, b) => a.label.localeCompare(b.label)),
];

function matches(p: Project, q: string) {
  if (!q) return true;
  const hay = [p.title, p.summary, ...p.concepts, ...p.parts, ...p.sensors.map((s) => sensorBySku.get(s)?.name ?? s)].join(" ").toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .every((w) => hay.includes(w));
}

export default function ProjectsPage() {
  const [params, setParams] = useSearchParams();
  const level = (params.get("level") ?? "") as "" | Level;
  const q = params.get("q") ?? "";
  const sensor = params.get("sensor") ?? "";

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  // Level counts follow the other filters so the tabs never promise more than they show.
  const base = useMemo(() => projects.filter((p) => (!sensor || p.sensors.includes(sensor)) && matches(p, q.trim())), [q, sensor]);
  const list = level ? base.filter((p) => p.level === level) : base;
  const countFor = (id: "" | Level) => (id ? base.filter((p) => p.level === id).length : base.length);

  return (
    <>
      <PageHeader
        title="Nano Projects"
        description={`${projects.length} complete builds for the Arduino Nano, each with wiring, steps and full code. Pick a level and start building.`}
      />

      <div className="mb-6 flex flex-col gap-6">
        {/* PURPOSE - MAIN ON TOP */}
        <div className="rounded-md border border-teal-200 bg-teal-50 p-5">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-teal-800 uppercase">
            <Zap size={16} className="text-teal-700" /> Core Purpose
          </div>
          <p className="mt-2 text-base font-medium leading-relaxed text-teal-950 sm:text-lg">
            Complete, end-to-end builds that take you from raw electronic components to fully working IoT devices. Each project provides full breadboard diagrams, component lists, and tested Arduino C++ code with line-by-line explanations.
          </p>
        </div>

        {/* WHERE & WHEN TO USE - MAIN ON TOP */}
        <Section title="Where & When to Build Each Project Level" icon={<ShieldCheck size={18} />}>
          <p className="mb-4 text-sm text-zinc-600">
            Pick your starting point based on what embedded skills you want to learn next.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PROJECT_WHEN_TO_USE.map((item) => (
              <div key={item.scenario} className="flex flex-col rounded-md border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-teal-700 text-xs font-bold text-white">
                    !
                  </span>
                  <h3 className="font-semibold text-zinc-900 leading-snug">{item.scenario}</h3>
                </div>
                <p className="mt-2.5 text-xs text-zinc-600 leading-relaxed">{item.why}</p>
                <div className="mt-auto pt-3 border-t border-zinc-200/60 text-xs">
                  <span className="font-semibold text-teal-800">Projects: </span>
                  <span className="font-mono text-zinc-800">{item.recommended}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0" role="group" aria-label="Level">
        {LEVEL_TABS.map((t) => {
          const active = level === t.id;
          return (
            <button
              key={t.id || "all"}
              type="button"
              aria-pressed={active}
              onClick={() => setParam("level", t.id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-md border px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                active ? "border-teal-700 bg-teal-700 text-white" : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
              }`}
            >
              {t.label}
              {t.hint && <span className={active ? "text-teal-100" : "text-zinc-500"}>· {t.hint}</span>}
              <span className={`rounded-md px-1.5 text-xs ${active ? "bg-teal-800 text-teal-50" : "bg-zinc-100 text-zinc-600"}`}>{countFor(t.id)}</span>
            </button>
          );
        })}
      </div>

      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search projects</span>
          <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setParam("q", e.target.value)}
            placeholder="Search projects, parts or skills…"
            className="h-10 w-full rounded-md border border-zinc-200 bg-white pr-3 pl-9 text-base placeholder:text-zinc-400 hover:border-zinc-300 md:h-9 md:text-sm"
          />
        </label>
        <Dropdown label="Sensor" value={sensor} options={SENSOR_OPTIONS} onChange={(v) => setParam("sensor", v)} align="end" className="md:w-64" />
      </div>

      <div className="mb-3 flex min-h-8 items-center justify-between text-sm text-zinc-500">
        <span>
          Showing <span className="font-medium text-zinc-800">{list.length}</span> of {projects.length}
        </span>
        {(level || q || sensor) && (
          <button type="button" onClick={() => setParams({}, { replace: true })} className="rounded-md px-2 py-1 font-medium text-teal-700 hover:bg-teal-50">
            Clear filters
          </button>
        )}
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center rounded-md border border-dashed border-zinc-300 bg-white px-4 py-14 text-center">
          <SearchX size={28} className="text-zinc-400" aria-hidden />
          <p className="mt-3 font-medium text-zinc-800">No projects match these filters</p>
          <p className="mt-1 text-sm text-zinc-500">Try another level or clear the filters.</p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((p) => (
            <li key={p.id}>
              <ProjectCard project={p} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
