import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronRight, LayoutGrid, List, Search, SearchX, ShieldCheck, Star, Zap } from "lucide-react";
import { categories, interfaces, sensors } from "../data";
import { Badge, CategoryIcon, DifficultyBadge, PageHeader, Section } from "../components/ui";
import Dropdown from "../components/Dropdown";
import type { Sensor } from "../types";

const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const MUST_HAVE_COUNT = sensors.filter((s) => s.essential).length;
const INTERFACE_OPTIONS = [{ value: "", label: "All interfaces" }, ...interfaces.map((i) => ({ value: i, label: i }))];
const DIFFICULTY_OPTIONS = [{ value: "", label: "Any difficulty" }, ...DIFFICULTIES.map((d) => ({ value: d, label: d }))];

const SENSOR_WHEN_TO_USE = [
  {
    scenario: "Environmental & Weather Stations",
    why: "Monitor ambient temperature, relative humidity, barometric altitude, and air quality in greenhouses, terrariums, or weather stations.",
    recommended: "DHT22 (temp/humidity), BMP280 (pressure), BME680 (gas/climate)",
  },
  {
    scenario: "Proximity, Obstacle & Fluid Level Sensing",
    why: "Detect approaching objects, prevent robot collisions with walls, or calculate water levels in storage tanks without touching the liquid.",
    recommended: "HC-SR04 (ultrasonic 2cm–4m), VL53L0X (laser Time-of-Flight up to 2m)",
  },
  {
    scenario: "Security, Intrusion & Room Occupancy",
    why: "Trigger automatic lighting, alarm buzzers, or display wake-ups when humans or warm bodies move through a room or corridor.",
    recommended: "HC-SR501 (PIR infrared motion), RCWL-0516 (microwave radar through walls)",
  },
  {
    scenario: "Orientation, Tilt, Balance & Vibration",
    why: "Measure 3-axis acceleration and rotation for self-balancing robots, flight controllers, game controllers, or machinery shake alarms.",
    recommended: "MPU-6050 (6-axis gyro/accel), SW-420 (piezo vibration switch)",
  },
  {
    scenario: "Light Intensity, Flame & Sound Detection",
    why: "Detect day/night transitions for solar trackers, fire emergencies with IR wavelengths, or acoustic clap/noise triggers.",
    recommended: "LDR Photoresistor (light), Flame Sensor (760nm–1100nm IR), Sound Detector",
  },
];

type View = "cards" | "list";
const VIEW_KEY = "sensors-view";

// The chosen view is a per-browser preference; storage can be blocked, so fall back to cards.
function readView(): View {
  try {
    return localStorage.getItem(VIEW_KEY) === "list" ? "list" : "cards";
  } catch {
    return "cards";
  }
}

function saveView(view: View) {
  try {
    localStorage.setItem(VIEW_KEY, view);
  } catch {
    /* ignore */
  }
}

function matches(s: Sensor, q: string) {
  if (!q) return true;
  const hay = [s.sku, s.name, s.purpose, s.category, s.interface, s.summary, ...s.useCases, ...s.projects.map((p) => p.title)]
    .join(" ")
    .toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .every((word) => hay.includes(word));
}


export default function SensorsPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const cat = params.get("cat") ?? "";
  const iface = params.get("iface") ?? "";
  const diff = params.get("diff") ?? "";
  const must = params.get("must") === "1";

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const list = useMemo(
    () =>
      sensors.filter(
        (s) =>
          (!must || s.essential) &&
          (!cat || s.category === cat) &&
          (!iface || s.interface === iface) &&
          (!diff || s.difficulty === diff) &&
          matches(s, q.trim()),
      ),
    [must, q, cat, iface, diff],
  );

  const hasFilters = Boolean(must || q || cat || iface || diff);

  const [view, setView] = useState<View>(readView);
  const changeView = (v: View) => {
    setView(v);
    saveView(v);
  };

  return (
    <>
      <PageHeader
        title="Sensors"
        description={`${sensors.length} sensors with use cases, Arduino Nano wiring and project ideas for each level.`}
        actions={
          <button
            type="button"
            onClick={() => setParam("must", must ? "" : "1")}
            aria-pressed={must}
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 text-sm font-semibold transition-colors md:h-9 ${
              must ? "border-amber-500 bg-amber-400 text-amber-950" : "border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
            }`}
          >
            <Star size={16} className={must ? "fill-amber-950" : "fill-amber-400 text-amber-500"} aria-hidden />
            {must ? "Showing must-have sensors" : "Must-have sensors"}
            <span className={`rounded-md px-1.5 text-xs ${must ? "bg-amber-950/10" : "bg-white"}`}>{MUST_HAVE_COUNT}</span>
          </button>
        }
      />

      <div className="mb-6 flex flex-col gap-6">
        {/* PURPOSE - MAIN ON TOP */}
        <div className="rounded-md border border-teal-200 bg-teal-50 p-5">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-teal-800 uppercase">
            <Zap size={16} className="text-teal-700" /> Core Purpose
          </div>
          <p className="mt-2 text-base font-medium leading-relaxed text-teal-950 sm:text-lg">
            Sensors act as the sensory organs of your microcontroller. They convert real-world physical conditions—such as temperature, humidity, sound, motion, proximity, light, and barometric pressure—into electrical voltages or digital data packets that code running on your Arduino or ESP32 can understand and trigger actions from.
          </p>
        </div>

        {/* WHERE & WHEN TO USE - MAIN ON TOP */}
        <Section title="Where & When You Need Sensors" icon={<ShieldCheck size={18} />}>
          <p className="mb-4 text-sm text-zinc-600">
            Real-world project scenarios and the exact sensor type engineered to measure each condition.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SENSOR_WHEN_TO_USE.map((item) => (
              <div key={item.scenario} className="flex flex-col rounded-md border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-teal-700 text-xs font-bold text-white">
                    !
                  </span>
                  <h3 className="font-semibold text-zinc-900 leading-snug">{item.scenario}</h3>
                </div>
                <p className="mt-2.5 text-xs text-zinc-600 leading-relaxed">{item.why}</p>
                <div className="mt-auto pt-3 border-t border-zinc-200/60 text-xs">
                  <span className="font-semibold text-teal-800">Recommended: </span>
                  <span className="font-mono text-zinc-800">{item.recommended}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {must && (
        <p className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Start with these {MUST_HAVE_COUNT}. Together they teach every basic way a sensor talks to the Nano: digital, analog, timing pulses, I2C, 1-Wire and the DHT protocol.
        </p>
      )}

      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search sensors</span>
          <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setParam("q", e.target.value)}
            placeholder="Search by name, SKU or use case…"
            className="h-10 w-full rounded-md border border-zinc-200 bg-white pr-3 pl-9 text-base placeholder:text-zinc-400 hover:border-zinc-300 md:h-9 md:text-sm"
          />
        </label>
        <div className="flex gap-2">
          <Dropdown label="Interface" value={iface} options={INTERFACE_OPTIONS} onChange={(v) => setParam("iface", v)} className="min-w-0 flex-1 md:w-44 md:flex-none" />
          <Dropdown label="Difficulty" value={diff} options={DIFFICULTY_OPTIONS} onChange={(v) => setParam("diff", v)} align="end" className="min-w-0 flex-1 md:w-40 md:flex-none" />
          <ViewSwitch view={view} onChange={changeView} />
        </div>
      </div>

      <div className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
        <CategoryChip active={!cat} onClick={() => setParam("cat", "")} label="All" count={sensors.length} />
        {categories.map((c) => (
          <CategoryChip
            key={c.name}
            active={cat === c.name}
            onClick={() => setParam("cat", cat === c.name ? "" : c.name)}
            label={c.name}
            count={c.count}
            category={c.name}
          />
        ))}
      </div>

      <div className="mb-3 flex min-h-8 items-center justify-between text-sm text-zinc-500">
        <span>
          Showing <span className="font-medium text-zinc-800">{list.length}</span> of {sensors.length}
        </span>
        {hasFilters && (
          <button type="button" onClick={() => setParams({}, { replace: true })} className="rounded-md px-2 py-1 font-medium text-teal-700 hover:bg-teal-50">
            Clear filters
          </button>
        )}
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center rounded-md border border-dashed border-zinc-300 bg-white px-4 py-14 text-center">
          <SearchX size={28} className="text-zinc-400" aria-hidden />
          <p className="mt-3 font-medium text-zinc-800">No sensors match these filters</p>
          <p className="mt-1 text-sm text-zinc-500">Try a shorter search or clear the filters.</p>
        </div>
      ) : (
        view === "cards" ? (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((s) => (
              <li key={s.sku}>
                <SensorCard sensor={s} />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="divide-y divide-zinc-200 overflow-hidden rounded-md border border-zinc-200 bg-white">
            {list.map((s) => (
              <li key={s.sku}>
                <SensorRow sensor={s} />
              </li>
            ))}
          </ul>
        )
      )}
    </>
  );
}

function CategoryChip({ active, onClick, label, count, category }: { active: boolean; onClick: () => void; label: string; count: number; category?: string }) {
  const ref = useRef<HTMLButtonElement>(null);

  // On phones the chips scroll sideways; keep the selected one in view.
  useEffect(() => {
    if (active) ref.current?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [active]);

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors md:px-2.5 md:py-1 ${
        active ? "border-teal-700 bg-teal-700 text-white" : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
      }`}
    >
      {category && <CategoryIcon category={category} size={14} />}
      {label}
      <span className={active ? "text-teal-100" : "text-zinc-400"}>{count}</span>
    </button>
  );
}

function SensorCard({ sensor: s }: { sensor: Sensor }) {
  return (
    <Link
      to={`/sensors/${s.sku}`}
      className="group flex h-full flex-col rounded-md border border-zinc-200 bg-white p-3.5 transition-colors hover:border-teal-600 sm:p-4"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-teal-50 text-teal-700">
          <CategoryIcon category={s.category} size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs text-zinc-500">{s.sku}</span>
            {s.essential && <MustHaveMark />}
          </div>
          <h3 className="leading-snug font-semibold text-zinc-900 group-hover:text-teal-800">{s.name}</h3>
        </div>
      </div>
      <p className="mt-3 text-sm text-zinc-700">{s.purpose}</p>
      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-4">
        <Badge>{s.interface}</Badge>
        <DifficultyBadge difficulty={s.difficulty} />
        <span className="ml-auto text-xs text-zinc-500">{s.projects.length} ideas</span>
      </div>
    </Link>
  );
}

function ViewSwitch({ view, onChange }: { view: View; onChange: (v: View) => void }) {
  const options = [
    { id: "cards" as const, label: "Card view", icon: LayoutGrid },
    { id: "list" as const, label: "List view", icon: List },
  ];
  return (
    <div className="flex shrink-0 rounded-md border border-zinc-200 bg-white p-0.5" role="group" aria-label="View">
      {options.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          aria-pressed={view === id}
          aria-label={label}
          title={label}
          className={`flex size-9 items-center justify-center rounded-md transition-colors md:size-8 ${
            view === id ? "bg-teal-700 text-white" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
          }`}
        >
          <Icon size={16} aria-hidden />
        </button>
      ))}
    </div>
  );
}

function SensorRow({ sensor: s }: { sensor: Sensor }) {
  return (
    <Link to={`/sensors/${s.sku}`} className="group flex items-center gap-3 px-3 py-3 transition-colors hover:bg-zinc-50 sm:px-4">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-teal-50 text-teal-700">
        <CategoryIcon category={s.category} size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <h3 className="font-semibold text-zinc-900 group-hover:text-teal-800">{s.name}</h3>
          <span className="hidden font-mono text-xs text-zinc-400 sm:inline">{s.sku}</span>
          {s.essential && <MustHaveMark />}
        </div>
        <p className="text-sm text-zinc-600">{s.purpose}</p>
      </div>
      <div className="hidden w-32 shrink-0 md:block">
        <Badge>{s.interface}</Badge>
      </div>
      <div className="hidden w-16 shrink-0 sm:block">
        <DifficultyBadge difficulty={s.difficulty} />
      </div>
      <ChevronRight size={16} className="shrink-0 text-zinc-400 group-hover:text-teal-700" aria-hidden />
    </Link>
  );
}

function MustHaveMark() {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] font-medium text-amber-800" title="Must-have sensor">
      <Star size={11} className="fill-amber-400 text-amber-500" aria-hidden />
      Must-have
    </span>
  );
}
