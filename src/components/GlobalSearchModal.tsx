import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CircuitBoard,
  Hammer,
  Radar,
  Search,
  X,
  Zap,
} from "lucide-react";
import { modules, projects, sensors } from "../data";
import { Badge } from "./ui";
import type { Tone } from "../lib/format";

export interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Sensors" | "Components" | "Projects" | "Boards";
  path: string;
  keywords: string;
  tag?: string;
  tone?: Tone;
  image?: string;
}

// Built-in discrete components & power modules indexed for quick bench access
const COMPONENT_SEARCH_ITEMS: SearchItem[] = [
  {
    id: "comp-resistors",
    title: "Resistors & Colour Code Calculator",
    subtitle: "Decode 4/5 band resistors, E12 standard values, LED current limiting & pull-ups",
    category: "Components",
    path: "/resistors",
    keywords: "resistor resistance ohm colour band calculator pull-up pull-down divider tolerance e12 220 10k 330 1k 4k7",
    tag: "Passive",
    tone: "teal",
  },
  {
    id: "comp-capacitors",
    title: "Capacitors & 3-Digit Code Reader",
    subtitle: "Decode 104/102 markings, ceramic vs electrolytic, decoupling & bulk filtering",
    category: "Components",
    path: "/capacitors",
    keywords: "capacitor farad microfarad picofarad 104 103 102 ceramic electrolytic decoupling filter bypass 22pf",
    tag: "Passive",
    tone: "teal",
  },
  {
    id: "comp-potentiometers",
    title: "Potentiometers & Variable Resistors",
    subtitle: "Interactive knob dial, B10K linear vs audio log tapers, trimmers & wipers",
    category: "Components",
    path: "/potentiometers",
    keywords: "potentiometer pot trimmer knob variable resistor b10k a100k wiper analog calibration 103 503",
    tag: "Passive",
    tone: "teal",
  },
  {
    id: "comp-diodes",
    title: "Diodes & Flyback Protection",
    subtitle: "One-way gate, 1N4007 flyback suppression, Schottky, Zener voltage regulation",
    category: "Components",
    path: "/diodes",
    keywords: "diode rectifier flyback back-emf 1n4007 1n4148 1n5819 schottky zener polarity reverse protection bias",
    tag: "Semiconductor",
    tone: "amber",
  },
  {
    id: "comp-transistors",
    title: "Transistors (BJT) & Current Amplification",
    subtitle: "NPN/PNP low-side switching, 2N2222, BC547, base resistor formula (Rb)",
    category: "Components",
    path: "/transistors",
    keywords: "transistor bjt npn pnp 2n2222 bc547 tip120 base collector emitter current switch saturation",
    tag: "Semiconductor",
    tone: "amber",
  },
  {
    id: "comp-mosfets",
    title: "MOSFETs & High-Power PWM Switching",
    subtitle: "Logic-level gate drive (IRLZ44N, IRLB8721), 10k pull-down rule, PWM LED dimming",
    category: "Components",
    path: "/mosfets",
    keywords: "mosfet logic level irlz44n irlb8721 irf520 gate drain source pwm high current motor switch rds",
    tag: "Semiconductor",
    tone: "amber",
  },
  {
    id: "comp-relays",
    title: "Relays & High Voltage AC Switching",
    subtitle: "Galvanic isolation, COM/NO/NC terminals, 5V coil, JD-VCC optocoupler jumper",
    category: "Components",
    path: "/relays",
    keywords: "relay mains 240v ac isolation com no nc optocoupler jd-vcc active-low coil high voltage",
    tag: "Electromechanical",
    tone: "rose",
  },
  {
    id: "comp-ics",
    title: "Integrated Circuits (ICs) & Pin Expansion",
    subtitle: "74HC595 shift register, ULN2003 darlington array, L293D dual H-bridge, NE555 timer",
    category: "Components",
    path: "/ics",
    keywords: "ic chip 74hc595 shift register uln2003 l293d ne555 dip pinout h-bridge motor driver timing expansion",
    tag: "IC",
    tone: "sky",
  },
  {
    id: "comp-converters",
    title: "DC-DC Converters (Buck & Boost)",
    subtitle: "Switch-mode power efficiency, LM2596 step-down, MT3608 step-up, heat reduction",
    category: "Components",
    path: "/converters",
    keywords: "dc-dc converter buck boost step-down step-up lm2596 mt3608 xl6009 efficiency regulator power heat",
    tag: "Power",
    tone: "green",
  },
  // Famous ICs & parts indexed individually for instant direct hits:
  {
    id: "part-74hc595",
    title: "74HC595 8-Bit Shift Register",
    subtitle: "Turn 3 Arduino digital pins into 8 outputs for LEDs, displays & relays",
    category: "Components",
    path: "/ics",
    keywords: "74hc595 shift register ser rclk srclk expansion serial to parallel",
    tag: "IC",
    tone: "sky",
  },
  {
    id: "part-l293d",
    title: "L293D Dual H-Bridge Motor Driver",
    subtitle: "Bi-directional DC motor control with forward, reverse & braking",
    category: "Components",
    path: "/ics",
    keywords: "l293d h-bridge dc motor driver bidirectional pwm enable",
    tag: "IC",
    tone: "sky",
  },
  {
    id: "part-ne555",
    title: "NE555 Precision Timer IC",
    subtitle: "Classic 8-pin DIP timer for astable pulse generation and monostable delays",
    category: "Components",
    path: "/ics",
    keywords: "ne555 555 timer pulse clock astable monostable oscillator pwm",
    tag: "IC",
    tone: "sky",
  },
  {
    id: "part-lm2596",
    title: "LM2596 Step-Down (Buck) Converter",
    subtitle: "Efficiently drop 7V–35V down to steady 5V without wasting power as heat",
    category: "Components",
    path: "/converters",
    keywords: "lm2596 buck step-down converter power supply 12v to 5v trimmer",
    tag: "Power",
    tone: "green",
  },
  {
    id: "part-irlz44n",
    title: "IRLZ44N Logic-Level N-Channel MOSFET",
    subtitle: "Full turn-on at 3.3V/5V logic — prevents high heat during heavy motor/LED loads",
    category: "Components",
    path: "/mosfets",
    keywords: "irlz44n logic level mosfet n-channel gate 5v 3.3v switch",
    tag: "Semiconductor",
    tone: "amber",
  },
];

function buildSearchIndex(): SearchItem[] {
  const sensorItems: SearchItem[] = sensors.map((s) => ({
    id: `sensor-${s.sku}`,
    title: `${s.name} (${s.sku})`,
    subtitle: `${s.category} · ${s.purpose}`,
    category: "Sensors",
    path: `/sensors/${s.sku}`,
    keywords: [
      s.sku,
      s.name,
      s.purpose,
      s.category,
      s.interface,
      s.summary,
      ...s.useCases,
      ...s.projects.map((p) => p.title),
    ].join(" "),
    tag: s.sku,
    tone: "teal",
    image: s.image,
  }));

  const boardItems: SearchItem[] = modules.map((m) => ({
    id: `module-${m.id}`,
    title: `${m.name} (${m.family})`,
    subtitle: m.summary,
    category: "Boards",
    path: `/modules/${m.id}`,
    keywords: [m.name, m.family, m.summary, ...m.specs.map((sp) => `${sp.label} ${sp.value}`)].join(" "),
    tag: m.family,
    tone: "sky",
  }));

  const projectItems: SearchItem[] = projects.map((p) => ({
    id: `project-${p.id}`,
    title: p.title,
    subtitle: `${p.level.toUpperCase()} · ${p.summary}`,
    category: "Projects",
    path: `/projects/${p.id}`,
    keywords: [p.title, p.summary, p.level, ...p.concepts, ...p.parts, ...p.sensors].join(" "),
    tag: `Level: ${p.level}`,
    tone: p.level === "low" ? "green" : p.level === "medium" ? "amber" : "rose",
  }));

  return [...sensorItems, ...COMPONENT_SEARCH_ITEMS, ...boardItems, ...projectItems];
}

const SEARCH_INDEX = buildSearchIndex();

const CATEGORY_FILTERS = ["All", "Sensors", "Components", "Projects", "Boards"] as const;
type CategoryFilter = (typeof CATEGORY_FILTERS)[number];

const POPULAR_QUICK_PICKS = [
  "sensor-DHT22",
  "sensor-HC-SR04",
  "sensor-MPU-6050",
  "comp-resistors",
  "comp-mosfets",
  "part-74hc595",
  "part-lm2596",
  "comp-relays",
];

interface GlobalSearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function GlobalSearchModal({ open, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();
  const searchInputId = useId();

  // Focus input whenever modal opens
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveCategory("All");
      setSelectedIndex(0);
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [open]);

  // Lock body scroll while modal is visible
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Filter and rank items based on search query and category
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    const words = q ? q.split(/\s+/) : [];

    let pool = SEARCH_INDEX;
    if (activeCategory !== "All") {
      pool = pool.filter((item) => item.category === activeCategory);
    }

    if (!q) {
      // Empty query: return popular quick picks
      const popular = POPULAR_QUICK_PICKS.map((id) => SEARCH_INDEX.find((x) => x.id === id)).filter(
        Boolean
      ) as SearchItem[];
      return activeCategory === "All"
        ? popular
        : pool.slice(0, 8);
    }

    return pool
      .map((item) => {
        const text = `${item.title} ${item.subtitle} ${item.keywords} ${item.tag ?? ""}`.toLowerCase();
        const matchesAll = words.every((w) => text.includes(w));
        if (!matchesAll) return null;

        // Scoring: exact matches in title or SKU score highest
        let score = 0;
        const lowerTitle = item.title.toLowerCase();
        if (lowerTitle.includes(q)) score += 100;
        if (lowerTitle.startsWith(q)) score += 50;
        if (item.tag?.toLowerCase().includes(q)) score += 40;
        if (item.subtitle.toLowerCase().includes(q)) score += 20;

        return { item, score };
      })
      .filter((entry): entry is { item: SearchItem; score: number } => entry !== null)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item);
  }, [query, activeCategory]);

  // Keep selected index in bounds when list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeCategory]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.children[selectedIndex] as HTMLElement | undefined;
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  const selectItem = (item: SearchItem) => {
    onClose();
    navigate(item.path);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredItems.length > 0 ? (prev + 1) % filteredItems.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredItems.length > 0 ? (prev - 1 + filteredItems.length) % filteredItems.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        selectItem(filteredItems[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={searchInputId}
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 md:pt-16"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-zinc-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-md border border-zinc-200 bg-white">
        {/* Top Search Input Box */}
        <div className="flex items-center border-b border-zinc-200 px-4 py-3">
          <Search size={18} className="shrink-0 text-teal-700" aria-hidden="true" />
          <input
            id={searchInputId}
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sensors, components, ICs, DC-DC, formulas, projects (e.g. DHT22, 104, 74HC595, MOSFET)..."
            className="ml-3 flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          ) : (
            <span className="hidden rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-mono text-[10px] text-zinc-500 sm:inline-block">
              ESC to close
            </span>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 border-b border-zinc-100 bg-zinc-50/70 px-4 py-2 text-xs">
          <span className="text-zinc-400 mr-1 font-medium">Filter:</span>
          {CATEGORY_FILTERS.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  active
                    ? "bg-teal-700 text-white"
                    : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2">
          {!query && activeCategory === "All" && (
            <div className="px-3 pt-2 pb-1.5 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
              Popular Quick Picks
            </div>
          )}

          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-md bg-zinc-100 text-zinc-400">
                <Search size={22} />
              </div>
              <p className="mt-3 text-sm font-semibold text-zinc-800">No matching items found</p>
              <p className="mt-1 max-w-sm text-xs text-zinc-500">
                Try searching for a sensor SKU (like <span className="font-mono text-teal-800">DHT22</span> or <span className="font-mono text-teal-800">HC-SR04</span>), a component code (<span className="font-mono text-teal-800">104</span>, <span className="font-mono text-teal-800">B10K</span>), or a chip like <span className="font-mono text-teal-800">74HC595</span>.
              </p>
            </div>
          ) : (
            <ul ref={listRef} className="flex flex-col gap-1" role="listbox">
              {filteredItems.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <li
                    key={item.id}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => selectItem(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`group flex cursor-pointer items-start justify-between gap-3 rounded-md border p-3 transition-colors ${
                      isSelected
                        ? "border-teal-500 bg-teal-50/70"
                        : "border-transparent bg-white hover:border-zinc-200 hover:bg-zinc-50"
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div
                        className={`mt-0.5 flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md border text-xs font-semibold ${
                          isSelected
                            ? "border-teal-300 bg-teal-600 text-white"
                            : "border-zinc-200 bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200"
                        }`}
                      >
                        {item.image ? (
                          <img src={item.image} alt="" className="size-full object-contain p-0.5" />
                        ) : item.category === "Sensors" ? (
                          <Radar size={15} />
                        ) : item.category === "Components" ? (
                          <Zap size={15} />
                        ) : item.category === "Boards" ? (
                          <CircuitBoard size={15} />
                        ) : (
                          <Hammer size={15} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-semibold leading-tight ${
                              isSelected ? "text-teal-950" : "text-zinc-900"
                            }`}
                          >
                            {item.title}
                          </span>
                          {item.tag && (
                            <Badge tone={item.tone ?? "neutral"} className="hidden sm:inline-flex text-[10px] py-0 px-1.5">
                              {item.tag}
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 line-clamp-1 text-xs text-zinc-500 leading-normal">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5 pt-1 text-xs">
                      <span className="hidden sm:inline text-zinc-400 font-mono text-[11px]">
                        {item.category}
                      </span>
                      <ArrowRight
                        size={14}
                        className={`transition-transform ${
                          isSelected ? "text-teal-700 translate-x-0.5" : "text-zinc-300 group-hover:text-zinc-500"
                        }`}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Keyboard hints footer */}
        <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-4 py-2.5 text-xs text-zinc-500">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-zinc-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-zinc-600">
                ↑
              </kbd>
              <kbd className="rounded border border-zinc-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-zinc-600">
                ↓
              </kbd>
              <span>navigate</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-zinc-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-zinc-600">
                ↵
              </kbd>
              <span>select</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-zinc-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-zinc-600">
                esc
              </kbd>
              <span>close</span>
            </span>
          </div>

          <div className="font-mono text-[11px] text-zinc-400">
            {filteredItems.length} {filteredItems.length === 1 ? "result" : "results"}
          </div>
        </div>
      </div>
    </div>
  );
}
