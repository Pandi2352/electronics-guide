import sensorsJson from "./sensors.json";
import modulesJson from "./modules.json";
import projectsJson from "./projects.json";
import resistorsJson from "./resistors.json";
import capacitorsJson from "./capacitors.json";
import potentiometersJson from "./potentiometers.json";
import relaysJson from "./relays.json";
import diodesJson from "./diodes.json";
import transistorsJson from "./transistors.json";
import mosfetsJson from "./mosfets.json";
import icsJson from "./ics.json";
import convertersJson from "./converters.json";
import type {
  BoardModule,
  CapacitorGuide,
  ConverterGuide,
  DiodeGuide,
  IcGuide,
  Level,
  MosfetGuide,
  PotGuide,
  Project,
  RelayGuide,
  ResistorGuide,
  Sensor,
  TransistorGuide,
} from "../types";

export const LEVELS: { id: Level; label: string; hint: string }[] = [
  { id: "low", label: "Low", hint: "Beginner" },
  { id: "medium", label: "Medium", hint: "Intermediate" },
  { id: "high", label: "High", hint: "Advanced" },
];

const LEVEL_IDS = new Set<string>(LEVELS.map((l) => l.id));
const DIFFICULTIES = new Set(["Easy", "Medium", "Hard"]);
const PIN_TYPES = new Set(["power", "ground", "digital", "analog", "control"]);
const MODULE_STATUSES = new Set(["focus", "ready", "soon"]);

type Obj = Record<string, unknown>;

const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === "string" && v.trim() !== "";
const isStrArr = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === "string");

/** Checks the shape of the JSON files so a typo shows a readable message instead of a broken page. */
function validate(sensors: unknown, modules: unknown, projects: unknown): string[] {
  const errors: string[] = [];
  const err = (where: string, msg: string) => errors.push(`${where}: ${msg}`);

  const moduleIds = new Set<string>();
  if (!Array.isArray(modules)) {
    err("modules.json", "must be an array");
  } else {
    modules.forEach((m, i) => {
      const at = `modules.json[${i}]${isObj(m) && isStr(m.id) ? ` (${m.id})` : ""}`;
      if (!isObj(m)) return err(at, "must be an object");
      for (const key of ["id", "name", "family", "summary"]) if (!isStr(m[key])) err(at, `"${key}" must be a non-empty string`);
      if (isStr(m.id)) {
        if (moduleIds.has(m.id)) err(at, `duplicate id "${m.id}"`);
        moduleIds.add(m.id);
      }
      if (!MODULE_STATUSES.has(m.status as string)) err(at, `"status" must be one of focus, ready, soon`);
      for (const key of ["specs", "buses"]) {
        const list = m[key];
        if (!Array.isArray(list) || !list.every((x) => isObj(x) && isStr(x.label) && isStr(x.value)))
          err(at, `"${key}" must be a list of { label, value }`);
      }
      for (const key of ["bestFor", "notes"]) if (!isStrArr(m[key])) err(at, `"${key}" must be a list of strings`);
      const pinout = m.pinout;
      if (!isObj(pinout)) err(at, `"pinout" must have "left" and "right" lists`);
      else
        for (const side of ["left", "right"]) {
          const pins = pinout[side];
          if (!Array.isArray(pins)) {
            err(at, `"pinout.${side}" must be a list`);
            continue;
          }
          pins.forEach((p, j) => {
            if (!isObj(p) || !isStr(p.name) || !PIN_TYPES.has(p.type as string) || !isStrArr(p.tags))
              err(at, `pinout.${side}[${j}] needs name, type (power/ground/digital/analog/control) and tags`);
          });
        }
    });
  }

  const skus = new Set<string>();
  if (!Array.isArray(sensors)) {
    err("sensors.json", "must be an array");
  } else {
    sensors.forEach((s, i) => {
      const at = `sensors.json[${i}]${isObj(s) && isStr(s.sku) ? ` (${s.sku})` : ""}`;
      if (!isObj(s)) return err(at, "must be an object");
      for (const key of ["sku", "name", "category", "purpose", "interface", "voltage", "summary", "tip"])
        if (!isStr(s[key])) err(at, `"${key}" must be a non-empty string`);
      if (isStr(s.sku)) {
        if (skus.has(s.sku)) err(at, `duplicate sku "${s.sku}"`);
        skus.add(s.sku);
      }
      if (!DIFFICULTIES.has(s.difficulty as string)) err(at, `"difficulty" must be Easy, Medium or Hard`);
      if (s.essential !== undefined && typeof s.essential !== "boolean") err(at, `"essential" must be true or false`);
      if (!isStrArr(s.useCases)) err(at, `"useCases" must be a list of strings`);
      if (s.library !== null && !isStr(s.library)) err(at, `"library" must be a string or null`);

      if (!isObj(s.wiring)) err(at, `"wiring" must be an object keyed by module id`);
      else
        for (const [moduleId, rows] of Object.entries(s.wiring)) {
          if (!moduleIds.has(moduleId)) err(at, `wiring uses unknown module "${moduleId}" (not in modules.json)`);
          if (!Array.isArray(rows) || !rows.every((r) => isObj(r) && isStr(r.pin) && isStr(r.to)))
            err(at, `wiring["${moduleId}"] must be a list of { pin, to }`);
        }

      if (!Array.isArray(s.projects)) err(at, `"projects" must be a list`);
      else
        s.projects.forEach((p, j) => {
          if (!isObj(p) || !LEVEL_IDS.has(p.level as string) || !isStr(p.title) || !isStr(p.description) || !isStrArr(p.parts))
            err(at, `projects[${j}] needs level (low/medium/high), title, description and parts`);
        });
    });
  }

  const projectIds = new Set<string>();
  if (!Array.isArray(projects)) {
    err("projects.json", "must be an array");
  } else {
    projects.forEach((p, i) => {
      const at = `projects.json[${i}]${isObj(p) && isStr(p.id) ? ` (${p.id})` : ""}`;
      if (!isObj(p)) return err(at, "must be an object");
      for (const key of ["id", "title", "board", "summary", "time"]) if (!isStr(p[key])) err(at, `"${key}" must be a non-empty string`);
      if (isStr(p.id)) {
        if (projectIds.has(p.id)) err(at, `duplicate id "${p.id}"`);
        projectIds.add(p.id);
      }
      if (!LEVEL_IDS.has(p.level as string)) err(at, `"level" must be low, medium or high`);
      if (isStr(p.board) && !moduleIds.has(p.board)) err(at, `board "${p.board}" is not in modules.json`);
      if (!isStrArr(p.sensors) || p.sensors.length === 0) err(at, `"sensors" must list at least one SKU`);
      else for (const sku of p.sensors) if (!skus.has(sku)) err(at, `sensor "${sku}" is not in sensors.json`);
      for (const key of ["parts", "libraries", "concepts", "steps", "code", "extensions"])
        if (!isStrArr(p[key])) err(at, `"${key}" must be a list of strings`);
      if (!Array.isArray(p.wiring) || !p.wiring.every((r) => isObj(r) && isStr(r.part) && isStr(r.pin) && isStr(r.to)))
        err(at, `"wiring" must be a list of { part, pin, to }`);
      if (p.safety !== undefined && !isStr(p.safety)) err(at, `"safety" must be a string when present`);
    });
  }

  return errors;
}

function validateComponents(resistors: unknown, capacitors: unknown, pots: unknown): string[] {
  const errors: string[] = [];
  const err = (where: string, msg: string) => errors.push(`${where}: ${msg}`);
  const isNumOrNull = (v: unknown) => v === null || typeof v === "number";
  const checkBasics = (file: string, g: Obj) => {
    if (!Array.isArray(g.basics) || !g.basics.every((b) => isObj(b) && isStr(b.title) && isStr(b.text))) err(file, `"basics" must be a list of { title, text }`);
    if (!isStrArr(g.howToRead)) err(file, `"howToRead" must be a list of strings`);
    if (!isStr(g.example)) err(file, `"example" must be a string`);
  };

  if (!isObj(resistors)) err("resistors.json", "must be an object");
  else {
    checkBasics("resistors.json", resistors);
    if (!isStr(resistors.mnemonic)) err("resistors.json", `"mnemonic" must be a string`);
    if (!Array.isArray(resistors.colors)) err("resistors.json", `"colors" must be a list`);
    else
      resistors.colors.forEach((c, i) => {
        if (!isObj(c) || !isStr(c.name) || !/^#[0-9a-f]{6}$/i.test(String(c.hex)) || !isNumOrNull(c.digit) || !isNumOrNull(c.multiplier) || !isNumOrNull(c.tolerance))
          err(`resistors.json colors[${i}]`, "needs name, hex (#rrggbb), digit, multiplier and tolerance (numbers or null)");
      });
    if (!Array.isArray(resistors.values)) err("resistors.json", `"values" must be a list`);
    else
      resistors.values.forEach((v, i) => {
        if (!isObj(v) || typeof v.ohms !== "number" || v.ohms <= 0 || !isStr(v.purpose) || !isStrArr(v.uses))
          err(`resistors.json values[${i}]`, "needs ohms (> 0), purpose and uses");
      });
  }

  if (!isObj(capacitors)) err("capacitors.json", "must be an object");
  else {
    checkBasics("capacitors.json", capacitors);
    if (!Array.isArray(capacitors.letters) || !capacitors.letters.every((l) => isObj(l) && isStr(l.letter) && isStr(l.tolerance)))
      err("capacitors.json", `"letters" must be a list of { letter, tolerance }`);
    const typeIds = new Set<string>();
    if (!Array.isArray(capacitors.types)) err("capacitors.json", `"types" must be a list`);
    else
      capacitors.types.forEach((t, i) => {
        if (!isObj(t) || !isStr(t.id) || !isStr(t.name) || typeof t.polarized !== "boolean" || !isStr(t.range) || !isStr(t.marking) || !isStr(t.looks) || !isStrArr(t.uses) || !isStr(t.note))
          err(`capacitors.json types[${i}]`, "needs id, name, polarized, range, marking, looks, uses and note");
        else typeIds.add(t.id);
      });
    if (!Array.isArray(capacitors.values)) err("capacitors.json", `"values" must be a list`);
    else
      capacitors.values.forEach((v, i) => {
        const at = `capacitors.json values[${i}]`;
        if (!isObj(v) || typeof v.pf !== "number" || v.pf <= 0 || !(v.code === null || isStr(v.code)) || !isStr(v.voltage) || !isStr(v.purpose) || !isStrArr(v.uses))
          err(at, "needs pf (> 0), code (string or null), type, voltage, purpose and uses");
        else if (!typeIds.has(String(v.type))) err(at, `type "${String(v.type)}" is not one of the listed types`);
      });
  }
  if (!isObj(pots)) err("potentiometers.json", "must be an object");
  else {
    const f = "potentiometers.json";
    checkBasics(f, pots);
    if (!isStr(pots.taperNote)) err(f, `"taperNote" must be a string`);
    if (!Array.isArray(pots.tapers) || !pots.tapers.every((t) => isObj(t) && isStr(t.letter) && isStr(t.name) && isStr(t.meaning) && isStr(t.use)))
      err(f, `"tapers" must be a list of { letter, name, meaning, use }`);
    if (!Array.isArray(pots.types) || !pots.types.every((t) => isObj(t) && isStr(t.id) && isStr(t.name) && isStr(t.looks) && isStr(t.range) && isStrArr(t.uses) && isStr(t.note)))
      err(f, `"types" must be a list of { id, name, looks, range, uses, note }`);
    if (!Array.isArray(pots.values) || !pots.values.every((v) => isObj(v) && typeof v.ohms === "number" && v.ohms > 0 && isStr(v.purpose) && isStrArr(v.uses)))
      err(f, `"values" must be a list of { ohms, purpose, uses }`);
    if (!Array.isArray(pots.examples)) err(f, `"examples" must be a list`);
    else
      pots.examples.forEach((e, i) => {
        if (!isObj(e) || !isStr(e.id) || !isStr(e.title) || !isStr(e.description) || !isStrArr(e.parts) || !isStrArr(e.code) ||
            !Array.isArray(e.wiring) || !e.wiring.every((r) => isObj(r) && isStr(r.part) && isStr(r.pin) && isStr(r.to)))
          err(`${f} examples[${i}]`, "needs id, title, description, parts, wiring { part, pin, to } and code");
      });
  }
  return errors;
}

function validateRelays(relays: unknown): string[] {
  const errors: string[] = [];
  const err = (where: string, msg: string) => errors.push(`${where}: ${msg}`);
  const f = "relays.json";

  if (!isObj(relays)) {
    err(f, "must be an object");
    return errors;
  }
  if (!Array.isArray(relays.basics) || !relays.basics.every((b) => isObj(b) && isStr(b.title) && isStr(b.text))) {
    err(f, `"basics" must be a list of { title, text }`);
  }
  if (!isStr(relays.safety)) err(f, `"safety" must be a string`);
  if (!Array.isArray(relays.terminals) || !relays.terminals.every((t) => isObj(t) && isStr(t.name) && isStr(t.abbr) && isStr(t.meaning) && isStr(t.use))) {
    err(f, `"terminals" must be a list of { name, abbr, meaning, use }`);
  }
  if (!isObj(relays.jdVccGuide) || !isStr(relays.jdVccGuide.title) || !isStr(relays.jdVccGuide.text)) {
    err(f, `"jdVccGuide" must be { title, text }`);
  }
  if (!Array.isArray(relays.types) || !relays.types.every((t) => isObj(t) && isStr(t.id) && isStr(t.name) && isStr(t.technology) && isStr(t.looks) && isStrArr(t.pros) && isStrArr(t.cons) && isStrArr(t.uses) && isStr(t.note))) {
    err(f, `"types" must be a list of relay types with id, name, technology, looks, pros, cons, uses, note`);
  }
  if (!Array.isArray(relays.modules) || !relays.modules.every((m) => isObj(m) && isStr(m.id) && isStr(m.name) && typeof m.channels === "number" && isStr(m.trigger) && isStr(m.coilVoltage) && isStr(m.contactRating) && isStr(m.purpose) && isStrArr(m.uses))) {
    err(f, `"modules" must be a list of modules with id, name, channels, trigger, coilVoltage, contactRating, purpose, uses`);
  }
  if (!Array.isArray(relays.examples)) err(f, `"examples" must be a list`);
  else {
    relays.examples.forEach((e, i) => {
      if (!isObj(e) || !isStr(e.id) || !isStr(e.title) || !isStr(e.description) || !isStrArr(e.parts) || !isStrArr(e.code) ||
          !Array.isArray(e.wiring) || !e.wiring.every((r) => isObj(r) && isStr(r.part) && isStr(r.pin) && isStr(r.to)))
        err(`${f} examples[${i}]`, "needs id, title, description, parts, wiring { part, pin, to } and code");
    });
  }
  return errors;
}

function validateGuideFiles(
  diodes: unknown,
  transistors: unknown,
  mosfets: unknown,
  ics: unknown,
  converters: unknown,
): string[] {
  const errors: string[] = [];
  const err = (where: string, msg: string) => errors.push(`${where}: ${msg}`);
  const files: [string, unknown][] = [
    ["diodes.json", diodes],
    ["transistors.json", transistors],
    ["mosfets.json", mosfets],
    ["ics.json", ics],
    ["converters.json", converters],
  ];

  for (const [name, data] of files) {
    if (!isObj(data)) {
      err(name, "must be an object");
      continue;
    }
    if (!isStr(data.purpose)) err(name, `"purpose" must be a non-empty string`);
    if (!Array.isArray(data.whenToUse) || !data.whenToUse.every((w) => isObj(w) && isStr(w.scenario) && isStr(w.why))) {
      err(name, `"whenToUse" must be a list of { scenario, why, recommended }`);
    }
    if (!Array.isArray(data.basics) || !data.basics.every((b) => isObj(b) && isStr(b.title) && isStr(b.text))) {
      err(name, `"basics" must be a list of { title, text }`);
    }
    if (!Array.isArray(data.types)) err(name, `"types" must be a list`);
    if (!Array.isArray(data.examples)) err(name, `"examples" must be a list`);
  }
  return errors;
}

export const dataErrors = [
  ...validate(sensorsJson, modulesJson, projectsJson),
  ...validateComponents(resistorsJson, capacitorsJson, potentiometersJson),
  ...validateRelays(relaysJson),
  ...validateGuideFiles(diodesJson, transistorsJson, mosfetsJson, icsJson, convertersJson),
];

const ok = dataErrors.length === 0;
export const sensors: Sensor[] = ok ? (sensorsJson as unknown as Sensor[]) : [];
export const modules: BoardModule[] = ok ? (modulesJson as unknown as BoardModule[]) : [];
export const projects: Project[] = ok ? (projectsJson as unknown as Project[]) : [];
export const resistorGuide = resistorsJson as unknown as ResistorGuide;
export const capacitorGuide = capacitorsJson as unknown as CapacitorGuide;
export const potGuide = potentiometersJson as unknown as PotGuide;
export const relayGuide = relaysJson as unknown as RelayGuide;
export const diodeGuide = diodesJson as unknown as DiodeGuide;
export const transistorGuide = transistorsJson as unknown as TransistorGuide;
export const mosfetGuide = mosfetsJson as unknown as MosfetGuide;
export const icGuide = icsJson as unknown as IcGuide;
export const converterGuide = convertersJson as unknown as ConverterGuide;

export const sensorBySku = new Map(sensors.map((s) => [s.sku, s]));
export const moduleById = new Map(modules.map((m) => [m.id, m]));
export const projectById = new Map(projects.map((p) => [p.id, p]));

/** Nano projects that use a given sensor SKU. */
export const projectsBySensor = new Map<string, Project[]>();
for (const p of projects)
  for (const sku of p.sensors) projectsBySensor.set(sku, [...(projectsBySensor.get(sku) ?? []), p]);

/** Categories in first-seen order, with how many sensors each has. */
export const categories: { name: string; count: number }[] = [];
for (const s of sensors) {
  const found = categories.find((c) => c.name === s.category);
  if (found) found.count++;
  else categories.push({ name: s.category, count: 1 });
}

export const interfaces = [...new Set(sensors.map((s) => s.interface))].sort();
