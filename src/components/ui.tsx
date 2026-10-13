import type { ReactNode } from "react";
import {
  Cable, CircuitBoard, Droplets, Flame, Gauge, Hand, HeartPulse, Magnet,
  Move3d, Radar, RadioReceiver, RotateCw, Sun, Thermometer, Volume2, Weight, Zap,
  type LucideIcon,
} from "lucide-react";
import type { Difficulty, Level, ModuleStatus } from "../types";
import type { Tone } from "../lib/format";

const TONES: Record<Tone, string> = {
  neutral: "border-zinc-200 bg-zinc-100 text-zinc-700",
  teal: "border-teal-200 bg-teal-50 text-teal-800",
  green: "border-emerald-200 bg-emerald-50 text-emerald-800",
  amber: "border-amber-200 bg-amber-50 text-amber-800",
  rose: "border-rose-200 bg-rose-50 text-rose-800",
  sky: "border-sky-200 bg-sky-50 text-sky-800",
  violet: "border-violet-200 bg-violet-50 text-violet-800",
};

export function Badge({ tone = "neutral", children, className = "" }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap ${TONES[tone]} ${className}`}>
      {children}
    </span>
  );
}

const LEVEL_TONE: Record<Level, Tone> = { low: "green", medium: "amber", high: "rose" };
const LEVEL_TEXT: Record<Level, string> = { low: "Low · Beginner", medium: "Medium · Intermediate", high: "High · Advanced" };

export function LevelBadge({ level }: { level: Level }) {
  return <Badge tone={LEVEL_TONE[level]}>{LEVEL_TEXT[level]}</Badge>;
}

const DIFFICULTY_TONE: Record<Difficulty, Tone> = { Easy: "green", Medium: "amber", Hard: "rose" };

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return <Badge tone={DIFFICULTY_TONE[difficulty]}>{difficulty}</Badge>;
}

const STATUS: Record<ModuleStatus, { tone: Tone; text: string }> = {
  focus: { tone: "teal", text: "Focus board" },
  ready: { tone: "sky", text: "Ready" },
  soon: { tone: "neutral", text: "Wiring coming soon" },
};

export function StatusBadge({ status }: { status: ModuleStatus }) {
  return <Badge tone={STATUS[status].tone}>{STATUS[status].text}</Badge>;
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Proximity & Distance": Radar,
  "Light & Optical": Sun,
  "Infrared & Remote": RadioReceiver,
  "Temperature & Climate": Thermometer,
  "Water & Soil": Droplets,
  "Gas, Smoke & Fire": Flame,
  "Motion & Orientation": Move3d,
  Touch: Hand,
  Sound: Volume2,
  "Health & Biometric": HeartPulse,
  "Voltage & Current": Zap,
  "Force, Weight & Pressure": Weight,
  "Magnetic & Metal": Magnet,
  "Speed & Rotation": RotateCw,
};

/** Unknown categories from JSON fall back to a generic icon. */
export function CategoryIcon({ category, size = 18 }: { category: string; size?: number }) {
  const Icon = CATEGORY_ICONS[category] ?? Gauge;
  return <Icon size={size} strokeWidth={1.75} aria-hidden />;
}

export function BoardIcon({ size = 18 }: { size?: number }) {
  return <CircuitBoard size={size} strokeWidth={1.75} aria-hidden />;
}

export function WireIcon({ size = 18 }: { size?: number }) {
  return <Cable size={size} strokeWidth={1.75} aria-hidden />;
}

export function PageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-zinc-600">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

export function Section({ title, icon, children, aside }: { title: string; icon?: ReactNode; children: ReactNode; aside?: ReactNode }) {
  return (
    <section className="rounded-md border border-zinc-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-zinc-200 px-4 py-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
          {icon && <span className="text-teal-700">{icon}</span>}
          {title}
        </h2>
        {aside}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}
