import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, Cpu, Network, TriangleAlert } from "lucide-react";
import { moduleById } from "../data";
import { Badge, BoardIcon, Section, StatusBadge } from "../components/ui";
import type { Tone } from "../lib/format";
import NotFoundPage from "./NotFoundPage";
import type { Pin, PinType } from "../types";

const PIN_TONE: Record<PinType, Tone> = {
  power: "rose",
  ground: "neutral",
  digital: "sky",
  analog: "amber",
  control: "violet",
};

const LEGEND: { type: PinType; label: string }[] = [
  { type: "power", label: "Power" },
  { type: "ground", label: "Ground" },
  { type: "digital", label: "Digital" },
  { type: "analog", label: "Analog" },
  { type: "control", label: "Control" },
];

export default function ModuleDetailPage() {
  const { id } = useParams();
  const board = id ? moduleById.get(id) : undefined;
  if (!board) return <NotFoundPage what="module" />;

  return (
    <div className="flex flex-col gap-5">
      <Link to="/modules" className="inline-flex w-fit items-center gap-1.5 rounded-md text-sm font-medium text-zinc-600 hover:text-teal-700">
        <ArrowLeft size={16} aria-hidden /> All modules
      </Link>

      <div className="rounded-md border border-zinc-200 bg-white p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-teal-50 text-teal-700 sm:size-12">
            <BoardIcon size={22} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-zinc-500">{board.family}</span>
              <StatusBadge status={board.status} />
            </div>
            <h1 className="mt-1.5 text-xl font-semibold tracking-tight sm:text-2xl">{board.name}</h1>
            <p className="mt-2 max-w-3xl text-sm text-zinc-600 sm:text-base">{board.summary}</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {board.bestFor.map((b) => (
            <span key={b} className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-700">
              <Check size={13} className="text-teal-700" aria-hidden /> {b}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Section title="Specifications" icon={<Cpu size={16} />}>
          <dl className="divide-y divide-zinc-100 text-sm">
            {board.specs.map((s) => (
              <div key={s.label} className="flex justify-between gap-4 py-2 first:pt-0 last:pb-0">
                <dt className="shrink-0 text-zinc-500">{s.label}</dt>
                <dd className="text-right font-medium text-zinc-900">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Section>
        <div className="flex flex-col gap-5">
          <Section title="Buses & interrupts" icon={<Network size={16} />}>
            <dl className="flex flex-col gap-3 text-sm">
              {board.buses.map((b) => (
                <div key={b.label}>
                  <dt className="text-xs font-medium text-zinc-500">{b.label}</dt>
                  <dd className="mt-0.5 font-mono text-xs text-zinc-800">{b.value}</dd>
                </div>
              ))}
            </dl>
          </Section>
          <Section title="Good to know" icon={<TriangleAlert size={16} />}>
            <ul className="flex flex-col gap-2.5 text-sm text-zinc-700">
              {board.notes.map((n) => (
                <li key={n} className="flex gap-2.5">
                  <span className="mt-2 size-1.5 shrink-0 rounded-md bg-teal-600" aria-hidden />
                  {n}
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </div>

      <Section
        title="Pinout"
        icon={<BoardIcon size={16} />}
        aside={
          <div className="hidden flex-wrap gap-1.5 sm:flex">
            {LEGEND.map((l) => (
              <Badge key={l.type} tone={PIN_TONE[l.type]}>
                {l.label}
              </Badge>
            ))}
          </div>
        }
      >
        <div className="mb-4 flex flex-wrap gap-1.5 sm:hidden">
          {LEGEND.map((l) => (
            <Badge key={l.type} tone={PIN_TONE[l.type]}>
              {l.label}
            </Badge>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-[1fr_auto_1fr] sm:gap-4">
          <PinColumn pins={board.pinout.left} side="left" />
          <div className="hidden w-28 flex-col items-center rounded-md border border-teal-900 bg-teal-800 py-3 text-teal-100 sm:flex">
            <div className="rounded-md border border-teal-600 bg-teal-900 px-3 py-1.5 font-mono text-[10px] tracking-wide">USB</div>
            <div className="my-auto flex flex-col items-center gap-1 text-center">
              <span className="flex size-14 items-center justify-center rounded-md border border-teal-600 bg-zinc-900 font-mono text-[9px] leading-tight text-zinc-300">
                MCU
              </span>
              <span className="mt-2 px-2 text-[11px] leading-tight font-medium">{board.name}</span>
            </div>
          </div>
          <PinColumn pins={board.pinout.right} side="right" />
        </div>
        <p className="mt-4 text-xs text-zinc-500">Pins run top to bottom with the USB connector at the top.</p>
      </Section>
    </div>
  );
}

function PinColumn({ pins, side }: { pins: Pin[]; side: "left" | "right" }) {
  return (
    <ul className="flex min-w-0 flex-col justify-around gap-1">
      {pins.map((p, i) => (
        <li key={`${p.name}-${i}`} className={`flex min-h-6 items-center gap-2 ${side === "left" ? "sm:flex-row-reverse" : ""}`}>
          <Badge tone={PIN_TONE[p.type]} className="w-14 shrink-0 justify-center font-mono">
            {p.name}
          </Badge>
          <span className={`flex min-w-0 flex-wrap gap-x-1 leading-tight ${side === "left" ? "sm:justify-end" : ""}`}>
            {p.tags.map((t) => (
              <span key={t} className="text-[11px] text-zinc-500">
                {t}
              </span>
            ))}
          </span>
        </li>
      ))}
    </ul>
  );
}
