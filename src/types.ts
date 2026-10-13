export type Level = "low" | "medium" | "high";
export type Difficulty = "Easy" | "Medium" | "Hard";

export interface WiringRow {
  pin: string;
  to: string;
}

export interface ProjectIdea {
  level: Level;
  title: string;
  description: string;
  parts: string[];
}

export interface Sensor {
  sku: string;
  name: string;
  category: string;
  /** One short, plain-English line: what the sensor is for. */
  purpose: string;
  /** Part of the must-have starter set shown by the "Must-have" filter. */
  essential?: boolean;
  interface: string;
  difficulty: Difficulty;
  voltage: string;
  summary: string;
  useCases: string[];
  /** Keyed by module id from modules.json, e.g. "arduino-nano". */
  wiring: Record<string, WiringRow[]>;
  tip: string;
  library: string | null;
  projects: ProjectIdea[];
  image?: string;
}

export type PinType = "power" | "ground" | "digital" | "analog" | "control";

export interface Pin {
  name: string;
  type: PinType;
  tags: string[];
}

export interface LabelValue {
  label: string;
  value: string;
}

export type ModuleStatus = "focus" | "ready" | "soon";

export interface BoardModule {
  id: string;
  name: string;
  family: string;
  status: ModuleStatus;
  summary: string;
  specs: LabelValue[];
  buses: LabelValue[];
  pinout: { left: Pin[]; right: Pin[] };
  bestFor: string[];
  notes: string[];
}

export interface ProjectWiringRow {
  part: string;
  pin: string;
  to: string;
}

export interface Project {
  id: string;
  title: string;
  level: Level;
  /** Module id from modules.json, e.g. "arduino-nano". */
  board: string;
  summary: string;
  time: string;
  /** SKUs from sensors.json. */
  sensors: string[];
  parts: string[];
  libraries: string[];
  concepts: string[];
  wiring: ProjectWiringRow[];
  steps: string[];
  /** Arduino sketch, one entry per line. */
  code: string[];
  extensions: string[];
  safety?: string;
}

export interface TitleText {
  title: string;
  text: string;
}

export interface BandColor {
  name: string;
  hex: string;
  digit: number | null;
  /** Power of ten, e.g. 2 = ×100, -1 = ×0.1. */
  multiplier: number | null;
  /** Percent, e.g. 5 = ±5%. */
  tolerance: number | null;
}

export interface ResistorValue {
  ohms: number;
  purpose: string;
  uses: string[];
}

export interface WhenToUseItem {
  scenario: string;
  why: string;
  recommended: string;
}

export interface ResistorGuide {
  purpose: string;
  whenToUse: WhenToUseItem[];
  basics: TitleText[];
  howToRead: string[];
  example: string;
  mnemonic: string;
  colors: BandColor[];
  values: ResistorValue[];
}

export interface CapacitorType {
  id: string;
  name: string;
  polarized: boolean;
  range: string;
  marking: string;
  looks: string;
  uses: string[];
  note: string;
}

export interface CapacitorValue {
  /** Value in picofarads. */
  pf: number;
  /** Printed ceramic code, e.g. "104"; null when the value is printed in full. */
  code: string | null;
  /** A CapacitorType id. */
  type: string;
  voltage: string;
  purpose: string;
  uses: string[];
}

export interface CapacitorGuide {
  purpose: string;
  whenToUse: WhenToUseItem[];
  basics: TitleText[];
  howToRead: string[];
  example: string;
  letters: { letter: string; tolerance: string }[];
  types: CapacitorType[];
  values: CapacitorValue[];
}

export interface PotTaper {
  letter: string;
  name: string;
  meaning: string;
  use: string;
}

export interface PotType {
  id: string;
  name: string;
  looks: string;
  range: string;
  uses: string[];
  note: string;
}

export interface PotExample {
  id: string;
  title: string;
  description: string;
  parts: string[];
  wiring: ProjectWiringRow[];
  code: string[];
}

export interface PotGuide {
  purpose: string;
  whenToUse: WhenToUseItem[];
  basics: TitleText[];
  howToRead: string[];
  example: string;
  tapers: PotTaper[];
  taperNote: string;
  types: PotType[];
  values: ResistorValue[];
  examples: PotExample[];
}

export interface RelayTerminal {
  name: string;
  abbr: string;
  meaning: string;
  use: string;
}

export interface RelayType {
  id: string;
  name: string;
  technology: string;
  isolation: string;
  switchingSpeed: string;
  maxCurrent: string;
  looks: string;
  pros: string[];
  cons: string[];
  uses: string[];
  note: string;
}

export interface RelayModule {
  id: string;
  name: string;
  channels: number;
  trigger: string;
  coilVoltage: string;
  contactRating: string;
  purpose: string;
  uses: string[];
}

export interface RelayExample {
  id: string;
  title: string;
  description: string;
  triggerType: "active-low" | "active-high";
  parts: string[];
  wiring: ProjectWiringRow[];
  code: string[];
}

export interface RelayGuide {
  purpose: string;
  whenToUse: WhenToUseItem[];
  basics: TitleText[];
  safety: string;
  terminals: RelayTerminal[];
  types: RelayType[];
  modules: RelayModule[];
  jdVccGuide: TitleText;
  examples: RelayExample[];
}

export interface DiodeType {
  id: string;
  name: string;
  voltageDrop: string;
  maxCurrent: string;
  speed: string;
  looks: string;
  pros: string[];
  cons: string[];
  uses: string[];
}

export interface DiodeCommonPart {
  part: string;
  type: string;
  rating: string;
  whenToUse: string;
}

export interface DiodeGuide {
  purpose: string;
  whenToUse: WhenToUseItem[];
  basics: TitleText[];
  types: DiodeType[];
  commonParts: DiodeCommonPart[];
  examples: RelayExample[];
}

export interface TransistorType {
  id: string;
  name: string;
  polarity: string;
  switchingType: string;
  trigger: string;
  maxCurrent: string;
  looks: string;
  pros: string[];
  cons: string[];
  uses: string[];
}

export interface TransistorCommonPart {
  part: string;
  type: string;
  rating: string;
  whenToUse: string;
}

export interface TransistorGuide {
  purpose: string;
  whenToUse: WhenToUseItem[];
  basics: TitleText[];
  types: TransistorType[];
  commonParts: TransistorCommonPart[];
  examples: RelayExample[];
}

export interface MosfetType {
  id: string;
  name: string;
  gateThreshold: string;
  rdsOn: string;
  maxCurrent: string;
  looks: string;
  pros: string[];
  cons: string[];
  uses: string[];
}

export interface MosfetCommonPart {
  part: string;
  type: string;
  rating: string;
  whenToUse: string;
}

export interface MosfetGuide {
  purpose: string;
  whenToUse: WhenToUseItem[];
  basics: TitleText[];
  types: MosfetType[];
  commonParts: MosfetCommonPart[];
  examples: RelayExample[];
}

export interface IcType {
  id: string;
  name: string;
  package: string;
  interface: string;
  maxOutput: string;
  looks: string;
  pros: string[];
  cons: string[];
  uses: string[];
}

export interface IcCommonPart {
  part: string;
  type: string;
  function: string;
  whenToUse: string;
}

export interface IcGuide {
  purpose: string;
  whenToUse: WhenToUseItem[];
  basics: TitleText[];
  types: IcType[];
  commonParts: IcCommonPart[];
  examples: RelayExample[];
}

export interface ConverterType {
  id: string;
  name: string;
  voltageRelation: string;
  typicalEfficiency: string;
  heatDissipation: string;
  looks: string;
  pros: string[];
  cons: string[];
  uses: string[];
}

export interface ConverterModule {
  name: string;
  topology: string;
  inputRange: string;
  outputRange: string;
  maxCurrent: string;
  whenToUse: string;
}

export interface ConverterGuide {
  purpose: string;
  whenToUse: WhenToUseItem[];
  basics: TitleText[];
  types: ConverterType[];
  popularModules: ConverterModule[];
  examples: RelayExample[];
}

export interface InductorType {
  id: string;
  name: string;
  summary: string;
  applications: string;
}

export interface InductorPart {
  value: string;
  code: string;
  current: string;
  package: string;
  purpose: string;
}

export interface ComponentWiringRow {
  from: string;
  to: string;
  note?: string;
}

export interface ComponentExample {
  id: string;
  title: string;
  description: string;
  difficulty?: string;
  parts: string[];
  wiring: ComponentWiringRow[];
  code: string | string[];
}

export interface InductorGuide {
  purpose: string;
  whenToUse: WhenToUseItem[];
  basics: TitleText[];
  types: InductorType[];
  commonParts: InductorPart[];
  examples: ComponentExample[];
}

export interface OptocouplerType {
  id: string;
  name: string;
  summary: string;
  applications: string;
}

export interface OptocouplerPart {
  part: string;
  channels: number;
  package: string;
  isolation: string;
  vceMax: string;
  purpose: string;
}

export interface OptocouplerGuide {
  purpose: string;
  whenToUse: WhenToUseItem[];
  basics: TitleText[];
  types: OptocouplerType[];
  commonParts: OptocouplerPart[];
  examples: ComponentExample[];
}

export interface BuzzerType {
  id: string;
  name: string;
  summary: string;
  applications: string;
}

export interface BuzzerPart {
  type: string;
  voltage: string;
  current: string;
  frequency: string;
  decibels: string;
  control: string;
}

export interface BuzzerGuide {
  purpose: string;
  whenToUse: WhenToUseItem[];
  basics: TitleText[];
  types: BuzzerType[];
  commonParts: BuzzerPart[];
  examples: ComponentExample[];
}

export interface RegulatorType {
  id: string;
  name: string;
  summary: string;
  applications: string;
}

export interface RegulatorPart {
  part: string;
  vout: string;
  vinMax: string;
  maxCurrent: string;
  dropout: string;
  package: string;
  purpose: string;
}

export interface RegulatorGuide {
  purpose: string;
  whenToUse: WhenToUseItem[];
  basics: TitleText[];
  types: RegulatorType[];
  popularRegulators: RegulatorPart[];
  examples: ComponentExample[];
}



