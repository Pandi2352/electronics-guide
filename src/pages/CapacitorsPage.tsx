import { useState } from "react";
import { BookOpen, Calculator, Layers, ListOrdered, ShieldCheck, TriangleAlert, Zap } from "lucide-react";
import { capacitorGuide } from "../data";
import { Badge, PageHeader, Section } from "../components/ui";
import { CapacitorDrawing } from "../components/illustrations";
import { formatFarads, readCapCode } from "../lib/components";

const { purpose, whenToUse, types, values, letters } = capacitorGuide;
const typeName = (id: string) => types.find((t) => t.id === id)?.name ?? id;
const EXAMPLES = ["22", "102", "103", "104", "224", "474", "105", "473K", "2A104J"];

type Filter = "all" | string;

export default function CapacitorsPage() {
  const [code, setCode] = useState("104");
  const [filter, setFilter] = useState<Filter>("all");

  const result = readCapCode(code, letters);
  const match = result.ok ? values.find((v) => v.pf === result.pf) : undefined;
  const units = result.ok ? formatFarads(result.pf) : null;

  const usedTypes = types.filter((t) => values.some((v) => v.type === t.id));
  const list = filter === "all" ? values : values.filter((v) => v.type === filter);

  return (
    <>
      <PageHeader title="Capacitors" description="Decode the number printed on a capacitor, learn the types, and see which value to use for what." />

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
        <Section title="Where & When You Need a Capacitor" icon={<ShieldCheck size={18} />}>
          <p className="mb-4 text-sm text-zinc-600">
            Crucial situations where capacitors prevent microcontroller crashes, brownouts, and electrical noise.
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

        <Section title="Code reader" icon={<Calculator size={16} />}>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <label htmlFor="cap-code" className="text-sm font-semibold text-zinc-900">
                Code printed on the capacitor
              </label>
              <input
                id="cap-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                inputMode="text"
                autoComplete="off"
                spellCheck={false}
                placeholder="e.g. 104"
                className="mt-2 h-12 w-full rounded-md border border-zinc-200 bg-white px-3 font-mono text-xl tracking-wider uppercase placeholder:text-zinc-300 hover:border-zinc-300"
              />
              <div className="mt-3 text-xs font-medium text-zinc-500">Try one:</div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => setCode(ex)}
                    aria-pressed={code.toUpperCase() === ex}
                    className={`rounded-md border px-2.5 py-1.5 font-mono text-xs font-medium transition-colors ${
                      code.toUpperCase() === ex ? "border-teal-700 bg-teal-700 text-white" : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                    }`}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            <div aria-live="polite">
              {result.ok && units ? (
                <div className="rounded-md border border-teal-200 bg-teal-50 p-4">
                  <div className="text-xs font-medium text-teal-800">Value</div>
                  <div className="mt-0.5 text-3xl font-semibold tracking-tight text-teal-950">
                    {units.best}
                    {result.tolerance && <span className="ml-2 text-lg font-medium text-teal-800">{result.tolerance}</span>}
                  </div>
                  <p className="mt-1 text-sm text-teal-900">{result.explain}</p>
                  <div className="mt-3 grid grid-cols-3 gap-px overflow-hidden rounded-md border border-teal-200 bg-teal-200 text-center">
                    {[units.pf, units.nf, units.uf].map((u) => (
                      <div key={u} className="bg-white px-1 py-2 font-mono text-xs font-medium text-zinc-800 sm:text-sm">
                        {u}
                      </div>
                    ))}
                  </div>
                  {match && (
                    <p className="mt-3 border-t border-teal-200 pt-3 text-sm text-teal-900">
                      <span className="font-semibold">Common use: </span>
                      {match.purpose}
                    </p>
                  )}
                </div>
              ) : (
                <div className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-600">{!result.ok && result.message}</div>
              )}
            </div>
          </div>
        </Section>

        <div className="grid gap-5 lg:grid-cols-2">
          <Section title="How to read the code" icon={<ListOrdered size={16} />}>
            <ol className="flex flex-col gap-3">
              {capacitorGuide.howToRead.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-zinc-700">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-teal-700 text-xs font-semibold text-white">{i + 1}</span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
            <div className="mt-4 flex items-center gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3">
              <CapacitorDrawing type="ceramic" className="w-16 shrink-0" />
              <p className="text-sm text-zinc-700">{capacitorGuide.example}</p>
            </div>
          </Section>

          <Section title="Tolerance letters" icon={<Layers size={16} />}>
            <p className="mb-3 text-sm text-zinc-600">A letter after the number tells how exact the value is.</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-zinc-500">
                  <th className="pb-2 font-medium">Letter</th>
                  <th className="pb-2 font-medium">Tolerance</th>
                </tr>
              </thead>
              <tbody>
                {letters.map((l) => (
                  <tr key={l.letter} className="border-t border-zinc-100">
                    <td className="py-1.5 font-mono font-semibold">{l.letter}</td>
                    <td className="py-1.5">{l.tolerance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-zinc-500">Example: 473K = 47 000 pF = 47 nF, ±10%.</p>
          </Section>
        </div>

        <div>
          <h2 className="mb-1 text-lg font-semibold">Types of capacitor</h2>
          <p className="mb-4 text-sm text-zinc-600">How to recognise each type, and whether it has a + and − side.</p>
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {types.map((t) => (
              <li key={t.id} className="flex flex-col rounded-md border border-zinc-200 bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <CapacitorDrawing type={t.id} className="h-20 w-24" />
                  {t.polarized ? <Badge tone="rose">Has + and −</Badge> : <Badge tone="green">Any direction</Badge>}
                </div>
                <h3 className="mt-3 font-semibold text-zinc-900">{t.name}</h3>
                <p className="mt-1 text-sm text-zinc-600">{t.looks}</p>
                <dl className="mt-3 space-y-1.5 text-xs">
                  <div>
                    <dt className="font-medium text-zinc-500">Range</dt>
                    <dd className="text-zinc-800">{t.range}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-zinc-500">Marking</dt>
                    <dd className="text-zinc-800">{t.marking}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-zinc-500">Used for</dt>
                    <dd className="text-zinc-800">{t.uses.join(" · ")}</dd>
                  </div>
                </dl>
                <div className="mt-auto pt-4">
                  <div
                    className={`flex gap-2 rounded-md border p-2.5 text-xs ${
                      t.polarized ? "border-rose-200 bg-rose-50 text-rose-900" : "border-zinc-200 bg-zinc-50 text-zinc-700"
                    }`}
                  >
                    {t.polarized && <TriangleAlert size={14} className="mt-0.5 shrink-0 text-rose-600" aria-hidden />}
                    {t.note}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <Section title="The basics" icon={<BookOpen size={16} />}>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {capacitorGuide.basics.map((b) => (
              <div key={b.title} className="rounded-md border border-zinc-200 bg-zinc-50 p-3.5">
                <h3 className="text-sm font-semibold text-zinc-900">{b.title}</h3>
                <p className="mt-1 text-sm text-zinc-600">{b.text}</p>
              </div>
            ))}
          </div>
        </Section>

        <div>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="mb-1 text-lg font-semibold">Common values</h2>
              <p className="text-sm text-zinc-600">The {values.length} values you will meet in Arduino projects and what each one is for.</p>
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Type">
              {[{ id: "all", name: "All" }, ...usedTypes].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={filter === t.id}
                  onClick={() => setFilter(t.id)}
                  className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                    filter === t.id ? "border-teal-700 bg-teal-700 text-white" : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((v) => {
              const u = formatFarads(v.pf);
              const alt = v.pf >= 1e6 ? u.nf : v.pf >= 1e3 ? u.uf : null;
              return (
                <li key={v.pf} className="flex flex-col rounded-md border border-zinc-200 bg-white p-4">
                  <div className="flex items-start gap-3">
                    <CapacitorDrawing type={v.type} label={v.code ?? u.best.replace(" ", "")} voltage={v.voltage} className="h-14 w-16 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xl font-semibold tracking-tight">{u.best}</div>
                      {alt && <div className="text-xs text-zinc-500">= {alt}</div>}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {v.code ? (
                      <Badge tone="teal" className="font-mono">
                        Code {v.code}
                      </Badge>
                    ) : (
                      <Badge>Value printed</Badge>
                    )}
                    <Badge tone={types.find((t) => t.id === v.type)?.polarized ? "rose" : "green"}>{typeName(v.type)}</Badge>
                    <Badge>{v.voltage}</Badge>
                  </div>
                  <p className="mt-3 text-sm text-zinc-800">{v.purpose}</p>
                  <ul className="mt-2 flex flex-col gap-1 text-xs text-zinc-600">
                    {v.uses.map((use) => (
                      <li key={use} className="flex gap-1.5">
                        <span className="mt-1.5 size-1 shrink-0 rounded-md bg-teal-600" aria-hidden />
                        {use}
                      </li>
                    ))}
                  </ul>
                  {v.code && (
                    <div className="mt-auto pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setCode(v.code!);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="rounded-md border border-zinc-200 px-2.5 py-1.5 text-xs font-medium text-teal-700 hover:border-teal-600 hover:bg-teal-50"
                      >
                        Open in code reader
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
