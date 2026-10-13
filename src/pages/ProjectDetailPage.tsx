import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, Clock, Code, Cpu, ListOrdered, Package, Radar, Rocket, TriangleAlert } from "lucide-react";
import { moduleById, projectById, projects, sensorBySku } from "../data";
import { Badge, CategoryIcon, LevelBadge, Section, WireIcon } from "../components/ui";
import CodeBlock from "../components/CodeBlock";
import { pinTone } from "../lib/format";
import NotFoundPage from "./NotFoundPage";
import type { Project } from "../types";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const project = id ? projectById.get(id) : undefined;
  if (!project) return <NotFoundPage what="project" />;

  const board = moduleById.get(project.board);
  const index = projects.indexOf(project);
  const prev = projects[index - 1];
  const next = projects[index + 1];

  return (
    <div className="flex flex-col gap-5">
      <Link to="/projects" className="inline-flex w-fit items-center gap-1.5 rounded-md text-sm font-medium text-zinc-600 hover:text-teal-700">
        <ArrowLeft size={16} aria-hidden /> All projects
      </Link>

      <div className="rounded-md border border-zinc-200 bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <LevelBadge level={project.level} />
          <Badge>
            <Clock size={12} aria-hidden /> {project.time}
          </Badge>
          {board && (
            <Badge tone="teal">
              <Cpu size={12} aria-hidden /> {board.name}
            </Badge>
          )}
        </div>
        <h1 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">{project.title}</h1>
        <p className="mt-2 max-w-3xl text-sm text-zinc-600 sm:text-base">{project.summary}</p>
      </div>

      {project.safety && (
        <div className="flex gap-3 rounded-md border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
          <TriangleAlert size={18} className="mt-0.5 shrink-0 text-rose-600" aria-hidden />
          <div>
            <div className="font-semibold">Safety first</div>
            <p className="mt-0.5">{project.safety}</p>
          </div>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Side column comes first on phones: you need the parts before the steps. */}
        <div className="flex flex-col gap-5 lg:order-2">
          <Section title="Sensors used" icon={<Radar size={16} />}>
            <ul className="flex flex-col gap-2">
              {project.sensors.map((sku) => {
                const s = sensorBySku.get(sku);
                if (!s) return null;
                return (
                  <li key={sku}>
                    <Link to={`/sensors/${sku}`} className="flex items-center gap-3 rounded-md border border-zinc-200 p-2.5 hover:border-teal-600">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-teal-50 text-teal-700">
                        <CategoryIcon category={s.category} size={18} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-zinc-900">{s.name}</span>
                        <span className="block text-xs text-zinc-500">{s.purpose}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Section>

          <Section title="Other parts" icon={<Package size={16} />}>
            <ul className="flex flex-col gap-1.5 text-sm text-zinc-700">
              <li className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-md bg-teal-600" aria-hidden />
                {board?.name ?? "Board"} + USB cable
              </li>
              {project.parts.map((part) => (
                <li key={part} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-md bg-teal-600" aria-hidden />
                  {part}
                </li>
              ))}
            </ul>
            {project.libraries.length > 0 && (
              <div className="mt-4 border-t border-zinc-100 pt-3">
                <div className="mb-1.5 text-xs font-medium text-zinc-500">Libraries (Tools → Manage Libraries)</div>
                <ul className="flex flex-col gap-1 font-mono text-xs text-zinc-800">
                  {project.libraries.map((lib) => (
                    <li key={lib}>{lib}</li>
                  ))}
                </ul>
              </div>
            )}
          </Section>

          <Section title="What you'll learn" icon={<BookOpen size={16} />}>
            <div className="flex flex-wrap gap-1.5">
              {project.concepts.map((c) => (
                <Badge key={c} tone="violet" className="whitespace-normal">
                  {c}
                </Badge>
              ))}
            </div>
          </Section>
        </div>

        <div className="flex min-w-0 flex-col gap-5 lg:order-1 lg:col-span-2">
          <Section title="Wiring" icon={<WireIcon size={16} />}>
            <div className="-mx-4 overflow-x-auto px-4">
              <table className="w-full min-w-[22rem] text-sm">
                <thead>
                  <tr className="text-left text-xs text-zinc-500">
                    <th className="pb-2 font-medium">Part</th>
                    <th className="pb-2 font-medium">Pin</th>
                    <th className="pb-2 font-medium">{board?.name ?? "Board"}</th>
                  </tr>
                </thead>
                <tbody>
                  {project.wiring.map((r, i) => (
                    <tr key={i} className="border-t border-zinc-100 align-top">
                      <td className="py-2 pr-3 text-zinc-800">{r.part}</td>
                      <td className="py-2 pr-3 font-mono text-xs text-zinc-700">{r.pin}</td>
                      <td className="py-2">
                        <Badge tone={pinTone(r.to)} className="font-mono whitespace-normal">
                          {r.to}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Steps" icon={<ListOrdered size={16} />}>
            <ol className="flex flex-col gap-3">
              {project.steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-zinc-700">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-teal-700 text-xs font-semibold text-white">{i + 1}</span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </Section>

          <Section title="Code" icon={<Code size={16} />}>
            <CodeBlock lines={project.code} filename={`${project.id}.ino`} />
          </Section>

          <Section title="Take it further" icon={<Rocket size={16} />}>
            <ul className="flex flex-col gap-2 text-sm text-zinc-700">
              {project.extensions.map((e) => (
                <li key={e} className="flex gap-2">
                  <ArrowRight size={15} className="mt-0.5 shrink-0 text-teal-700" aria-hidden />
                  {e}
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </div>

      <nav className="grid grid-cols-2 gap-3" aria-label="Other projects">
        {prev ? <NeighbourLink project={prev} dir="prev" /> : <span />}
        {next && <NeighbourLink project={next} dir="next" />}
      </nav>
    </div>
  );
}

function NeighbourLink({ project, dir }: { project: Project; dir: "prev" | "next" }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className={`flex items-center gap-3 rounded-md border border-zinc-200 bg-white p-3 hover:border-teal-600 ${dir === "next" ? "flex-row-reverse text-right" : ""}`}
    >
      {dir === "prev" ? <ArrowLeft size={16} className="shrink-0 text-zinc-400" /> : <ArrowRight size={16} className="shrink-0 text-zinc-400" />}
      <div className="min-w-0">
        <div className="text-xs text-zinc-500">{dir === "prev" ? "Previous" : "Next"}</div>
        <div className="truncate text-sm font-medium text-zinc-900">{project.title}</div>
      </div>
    </Link>
  );
}
