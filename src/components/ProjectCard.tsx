import { Link } from "react-router-dom";
import { Clock, ListOrdered } from "lucide-react";
import { sensorBySku } from "../data";
import { LevelBadge } from "./ui";
import type { Project } from "../types";

export default function ProjectCard({ project: p }: { project: Project }) {
  return (
    <Link to={`/projects/${p.id}`} className="group flex h-full flex-col rounded-md border border-zinc-200 bg-white p-3.5 transition-colors hover:border-teal-600 sm:p-4">
      <div className="flex items-center justify-between gap-2">
        <LevelBadge level={p.level} />
        <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
          <Clock size={13} aria-hidden /> {p.time}
        </span>
      </div>
      <h3 className="mt-3 leading-snug font-semibold text-zinc-900 group-hover:text-teal-800">{p.title}</h3>
      <p className="mt-1 line-clamp-3 text-sm text-zinc-600">{p.summary}</p>
      <div className="mt-auto pt-4">
        <div className="flex flex-wrap gap-1.5">
          {p.sensors.map((sku) => (
            <span key={sku} className="rounded-md border border-teal-200 bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-800">
              {sensorBySku.get(sku)?.name ?? sku}
            </span>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-1.5 border-t border-zinc-100 pt-3 text-xs text-zinc-500">
          <ListOrdered size={13} aria-hidden /> {p.steps.length} steps · wiring · full code
        </div>
      </div>
    </Link>
  );
}
