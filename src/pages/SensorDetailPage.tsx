import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Hammer, Lightbulb, Package, Wrench } from "lucide-react";
import { LEVELS, moduleById, modules, projectsBySensor, sensorBySku, sensors } from "../data";
import { Badge, CategoryIcon, DifficultyBadge, LevelBadge, Section, WireIcon } from "../components/ui";
import { pinTone } from "../lib/format";
import Dropdown from "../components/Dropdown";
import ProjectCard from "../components/ProjectCard";
import NotFoundPage from "./NotFoundPage";
import type { Sensor, WiringRow } from "../types";

/** Uno shares the Nano's ATmega328P pin numbers, so Nano wiring can be reused there. */
function wiringFor(sensor: Sensor, moduleId: string): { rows: WiringRow[]; borrowedFrom?: string } | null {
  const own = sensor.wiring[moduleId];
  if (own) return { rows: own };
  const nano = sensor.wiring["arduino-nano"];
  const usesA6A7 = nano?.some((r) => /\bA[67]\b/.test(r.to));
  if (moduleId === "arduino-uno" && nano && !usesA6A7) return { rows: nano, borrowedFrom: "Arduino Nano" };
  return null;
}

export default function SensorDetailPage() {
  const { sku } = useParams();
  const sensor = sku ? sensorBySku.get(sku) : undefined;
  const [boardId, setBoardId] = useState("arduino-nano");

  if (!sensor) return <NotFoundPage what="sensor" />;

  const index = sensors.indexOf(sensor);
  const prev = sensors[index - 1];
  const next = sensors[index + 1];
  const board = moduleById.get(boardId) ?? modules[0];
  const wiring = board ? wiringFor(sensor, board.id) : null;
  const nanoProjects = projectsBySensor.get(sensor.sku) ?? [];

  const facts = [
    { label: "Interface", value: sensor.interface },
    { label: "Voltage", value: sensor.voltage },
    { label: "Library", value: sensor.library ?? "None needed" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <Link to="/sensors" className="inline-flex w-fit items-center gap-1.5 rounded-md text-sm font-medium text-zinc-600 hover:text-teal-700">
        <ArrowLeft size={16} aria-hidden /> All sensors
      </Link>

      {/* Header */}
      <div className="rounded-md border border-zinc-200 bg-white p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          {sensor.image ? (
            <div className="relative size-16 shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-zinc-50 p-1 sm:size-20">
              <img
                src={sensor.image}
                alt={sensor.name}
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-teal-50 text-teal-700 sm:size-12">
              <CategoryIcon category={sensor.category} size={22} />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-zinc-500">{sensor.sku}</span>
              <Link to={`/sensors?cat=${encodeURIComponent(sensor.category)}`} className="rounded-md">
                <Badge tone="teal">{sensor.category}</Badge>
              </Link>
              <DifficultyBadge difficulty={sensor.difficulty} />
            </div>
            <h1 className="mt-1.5 text-xl font-semibold tracking-tight sm:text-2xl">{sensor.name}</h1>
            <p className="mt-1 font-medium text-teal-800">{sensor.purpose}</p>
            <p className="mt-2 max-w-3xl text-sm text-zinc-600 sm:text-base">{sensor.summary}</p>
          </div>
        </div>
        <dl className="mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-zinc-200 bg-zinc-200 sm:grid-cols-3">
          {facts.map((f) => (
            <div key={f.label} className="bg-zinc-50 px-3 py-2.5">
              <dt className="text-xs text-zinc-500">{f.label}</dt>
              <dd className="mt-0.5 text-sm font-medium break-words text-zinc-900">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Section title="Use cases" icon={<Check size={16} />}>
            <ul className="flex flex-col gap-2">
              {sensor.useCases.map((u) => (
                <li key={u} className="flex items-start gap-2.5 text-sm text-zinc-700">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-teal-50 text-teal-700">
                    <Check size={13} strokeWidth={2.5} aria-hidden />
                  </span>
                  {u}
                </li>
              ))}
            </ul>
          </Section>
        </div>

        <div className="lg:col-span-3">
          <Section
            title="Wiring"
            icon={<WireIcon size={16} />}
            aside={
              <Dropdown
                label="Board"
                size="sm"
                align="end"
                value={board?.id ?? ""}
                options={modules.map((m) => ({ value: m.id, label: m.name }))}
                onChange={setBoardId}
                className="w-full sm:w-44"
              />
            }
          >
            {wiring && wiring.rows.length > 0 ? (
              <>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-zinc-500">
                      <th className="pb-2 font-medium">Sensor pin</th>
                      <th className="pb-2 font-medium">{board?.name} pin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wiring.rows.map((r, i) => (
                      <tr key={i} className="border-t border-zinc-100">
                        <td className="py-2 pr-3 align-top font-mono text-xs break-words text-zinc-800">{r.pin}</td>
                        <td className="py-2">
                          <Badge tone={pinTone(r.to)} className="font-mono whitespace-normal">
                            {r.to}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {wiring.borrowedFrom && (
                  <p className="mt-3 text-xs text-zinc-500">The {board?.name} uses the same pins as the {wiring.borrowedFrom}.</p>
                )}
              </>
            ) : wiring ? (
              <p className="text-sm text-zinc-600">No direct wiring needed. This part is used together with another sensor (see the tip below).</p>
            ) : (
              <p className="text-sm text-zinc-600">
                Wiring for the {board?.name} hasn't been added yet. Switch to the Arduino Nano to see the pins.
              </p>
            )}
          </Section>
        </div>
      </div>

      <div className="flex gap-3 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <Lightbulb size={18} className="mt-0.5 shrink-0 text-amber-600" aria-hidden />
        <div>
          <div className="font-semibold">Tip</div>
          <p className="mt-0.5">{sensor.tip}</p>
        </div>
      </div>

      <Section title="Project ideas" icon={<Wrench size={16} />}>
        <div className="grid gap-3 md:grid-cols-3">
          {LEVELS.map((level) =>
            sensor.projects
              .filter((p) => p.level === level.id)
              .map((p) => (
                <article key={`${level.id}-${p.title}`} className="flex flex-col rounded-md border border-zinc-200 bg-zinc-50 p-4">
                  <LevelBadge level={p.level} />
                  <h3 className="mt-3 font-semibold text-zinc-900">{p.title}</h3>
                  <p className="mt-1 text-sm text-zinc-600">{p.description}</p>
                  <div className="mt-auto pt-4">
                    <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                      <Package size={13} aria-hidden /> Extra parts
                    </div>
                    {p.parts.length ? (
                      <div className="flex flex-wrap gap-1.5">
                        {p.parts.map((part) => (
                          <span key={part} className="rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-xs text-zinc-700">
                            {part}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-500">Just the sensor and the board</span>
                    )}
                  </div>
                </article>
              )),
          )}
        </div>
      </Section>

      {nanoProjects.length > 0 && (
        <Section title="Full Nano projects with this sensor" icon={<Hammer size={16} />}>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {nanoProjects.map((p) => (
              <li key={p.id}>
                <ProjectCard project={p} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <nav className="grid grid-cols-2 gap-3" aria-label="Other sensors">
        {prev ? <NeighbourLink sensor={prev} dir="prev" /> : <span />}
        {next && <NeighbourLink sensor={next} dir="next" />}
      </nav>
    </div>
  );
}

function NeighbourLink({ sensor, dir }: { sensor: Sensor; dir: "prev" | "next" }) {
  return (
    <Link
      to={`/sensors/${sensor.sku}`}
      className={`flex items-center gap-3 rounded-md border border-zinc-200 bg-white p-3 hover:border-teal-600 ${dir === "next" ? "flex-row-reverse text-right" : ""}`}
    >
      {dir === "prev" ? <ArrowLeft size={16} className="text-zinc-400" /> : <ArrowRight size={16} className="text-zinc-400" />}
      <div className="min-w-0">
        <div className="text-xs text-zinc-500">{dir === "prev" ? "Previous" : "Next"}</div>
        <div className="truncate text-sm font-medium text-zinc-900">{sensor.name}</div>
      </div>
    </Link>
  );
}
