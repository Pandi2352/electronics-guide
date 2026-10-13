import type { ReactNode } from "react";
import type { BandColor } from "../types";

/** A through-hole resistor with its colour bands; 5-band parts get the blue metal-film body. */
export function ResistorDrawing({ bands, className = "" }: { bands: BandColor[]; className?: string }) {
  const five = bands.length === 5;
  const xs = five ? [56, 70, 84, 98, 140] : [60, 76, 92, 140];
  return (
    <svg viewBox="0 0 200 56" className={className} role="img" aria-label={`Resistor with bands ${bands.map((b) => b.name).join(", ")}`}>
      <line x1="0" y1="28" x2="200" y2="28" stroke="#a1a1aa" strokeWidth="3" strokeLinecap="round" />
      <rect x="40" y="9" width="120" height="38" rx="14" fill={five ? "#a9c9ec" : "#e7d3ab"} stroke="#0000001f" />
      {bands.map((b, i) => (
        <rect key={i} x={xs[i]} y="9" width="9" height="38" fill={b.hex} stroke={b.name === "White" ? "#d4d4d8" : "none"} />
      ))}
    </svg>
  );
}

/** Simple drawings of the four common capacitor types. */
/** `label` is what is printed on the part (e.g. "103" or "10µF"); defaults to a typical marking. */
export function CapacitorDrawing({ type, label, voltage, className = "" }: { type: string; label?: string; voltage?: string; className?: string }) {
  const legs = (longLeft = false) => (
    <>
      <line x1="48" y1="62" x2="48" y2={longLeft ? 98 : 90} stroke="#a1a1aa" strokeWidth="3" strokeLinecap="round" />
      <line x1="72" y1="62" x2="72" y2={longLeft ? 90 : 98} stroke="#a1a1aa" strokeWidth="3" strokeLinecap="round" />
    </>
  );
  const font = { fontFamily: "IBM Plex Mono, monospace", fontWeight: 600, textAnchor: "middle" as const };

  switch (type) {
    case "ceramic":
      return (
        <svg viewBox="0 0 120 100" className={className} role="img" aria-label={`Ceramic disc capacitor marked ${label ?? "104"}`}>
          {legs()}
          <circle cx="60" cy="40" r="28" fill="#e9a23b" stroke="#0000001f" />
          <text x="60" y="46" fontSize="16" fill="#3b2405" {...font}>{label ?? "104"}</text>
        </svg>
      );
    case "electrolytic":
      return (
        <svg viewBox="0 0 120 100" className={className} role="img" aria-label="Electrolytic capacitor with a negative stripe on the left">
          {legs(false)}
          <rect x="34" y="6" width="52" height="58" rx="8" fill="#1e3a8a" />
          <rect x="34" y="6" width="14" height="58" fill="#cbd5e1" />
          <text x="41" y="28" fontSize="14" fill="#1e3a8a" {...font}>−</text>
          <text x="41" y="48" fontSize="14" fill="#1e3a8a" {...font}>−</text>
          <text x="68" y="34" fontSize="9" fill="#e0e7ff" {...font}>{label ?? "100µF"}</text>
          <text x="68" y="46" fontSize="9" fill="#e0e7ff" {...font}>{voltage ?? "25V"}</text>
          <text x="40" y="99" fontSize="10" fill="#71717a" {...font}>−</text>
          <text x="80" y="99" fontSize="10" fill="#71717a" {...font}>+</text>
        </svg>
      );
    case "film":
      return (
        <svg viewBox="0 0 120 100" className={className} role="img" aria-label="Box film capacitor marked 2A104J">
          {legs()}
          <rect x="26" y="14" width="68" height="48" rx="6" fill="#15803d" />
          <text x="60" y="43" fontSize="13" fill="#dcfce7" {...font}>2A104J</text>
        </svg>
      );
    case "tantalum":
      return (
        <svg viewBox="0 0 120 100" className={className} role="img" aria-label="Tantalum capacitor with the positive side marked">
          {legs(true)}
          <path d="M60 8 C84 8 90 30 86 46 C82 62 38 62 34 46 C30 30 36 8 60 8 Z" fill="#eab308" />
          <text x="60" y="40" fontSize="13" fill="#422006" {...font}>106</text>
          <text x="40" y="99" fontSize="10" fill="#71717a" {...font}>+</text>
          <text x="38" y="30" fontSize="14" fill="#422006" {...font}>+</text>
        </svg>
      );
    default:
      return null;
  }
}

/** Sidebar icon: a resistor zig-zag (lucide has no resistor icon). */
export function ResistorIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 12h3l1.5-4 3 8 3-8 3 8 3-8 1.5 4h3" />
    </svg>
  );
}

/** Sidebar icon: two capacitor plates. */
export function CapacitorIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
      <path d="M2 12h8M10 5v14M14 5v14M14 12h8" />
    </svg>
  );
}

/** A knob whose pointer turns through the usual 270° of a rotary pot. `position` is 0–1. */
export function KnobDrawing({ position, className = "" }: { position: number; className?: string }) {
  const angle = -135 + 270 * position;
  const ticks = Array.from({ length: 11 }, (_, i) => -135 + i * 27);
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label={`Knob turned to ${Math.round(position * 100)}%`}>
      {ticks.map((t) => (
        <line key={t} x1="60" y1="8" x2="60" y2="15" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" transform={`rotate(${t} 60 60)`} />
      ))}
      <circle cx="60" cy="60" r="40" fill="#27272a" />
      <circle cx="60" cy="60" r="32" fill="#3f3f46" />
      <g transform={`rotate(${angle} 60 60)`}>
        <line x1="60" y1="60" x2="60" y2="30" stroke="#5eead4" strokeWidth="5" strokeLinecap="round" />
      </g>
      <circle cx="60" cy="60" r="5" fill="#18181b" />
    </svg>
  );
}

/** A rotary pot seen from the front with its three legs labelled for the Nano. */
export function PotWiringDrawing({ className = "" }: { className?: string }) {
  const font = { fontFamily: "IBM Plex Sans, sans-serif", textAnchor: "middle" as const };
  const legs = [
    { x: 70, pin: "1", to: "GND", color: "#52525b" },
    { x: 120, pin: "2", to: "A0", color: "#b45309" },
    { x: 170, pin: "3", to: "5V", color: "#be123c" },
  ];
  return (
    <svg viewBox="0 0 240 200" className={className} role="img" aria-label="Potentiometer pins: 1 to GND, 2 (wiper) to A0, 3 to 5V">
      <rect x="112" y="6" width="16" height="34" rx="3" fill="#a1a1aa" />
      <circle cx="120" cy="82" r="50" fill="#d4d4d8" stroke="#a1a1aa" strokeWidth="2" />
      <circle cx="120" cy="82" r="22" fill="#e4e4e7" stroke="#a1a1aa" />
      <text x="120" y="87" fontSize="13" fontWeight="600" fill="#3f3f46" {...font}>B10K</text>
      {legs.map((l) => (
        <g key={l.pin}>
          <line x1={l.x} y1="122" x2={l.x} y2="160" stroke="#a1a1aa" strokeWidth="4" strokeLinecap="round" />
          <text x={l.x} y="178" fontSize="12" fill="#71717a" {...font}>pin {l.pin}</text>
          <text x={l.x} y="195" fontSize="14" fontWeight="700" fill={l.color} {...font}>{l.to}</text>
        </g>
      ))}
    </svg>
  );
}

/** Simple drawings of the common potentiometer types. */
export function PotDrawing({ type, className = "" }: { type: string; className?: string }) {
  const leg = (x: number, y1 = 70, y2 = 92) => <line key={x} x1={x} y1={y1} x2={x} y2={y2} stroke="#a1a1aa" strokeWidth="3" strokeLinecap="round" />;
  const svg = (label: string, children: ReactNode) => (
    <svg viewBox="0 0 120 100" className={className} role="img" aria-label={label}>
      {children}
    </svg>
  );
  switch (type) {
    case "rotary":
      return svg("Rotary potentiometer", <>
        {[44, 60, 76].map((x) => leg(x))}
        <circle cx="60" cy="46" r="28" fill="#d4d4d8" stroke="#a1a1aa" strokeWidth="2" />
        <rect x="54" y="4" width="12" height="28" rx="2" fill="#a1a1aa" />
        <circle cx="60" cy="46" r="10" fill="#e4e4e7" stroke="#a1a1aa" />
      </>);
    case "slide":
      return svg("Slide potentiometer", <>
        {[22, 38, 98].map((x) => leg(x, 62, 86))}
        <rect x="10" y="34" width="100" height="28" rx="4" fill="#3f3f46" />
        <rect x="18" y="45" width="84" height="6" rx="3" fill="#18181b" />
        <rect x="56" y="18" width="16" height="40" rx="3" fill="#e4e4e7" stroke="#a1a1aa" />
      </>);
    case "trimmer":
      return svg("Trimmer potentiometer", <>
        {[46, 60, 74].map((x) => leg(x, 72, 92))}
        <rect x="32" y="20" width="56" height="52" rx="6" fill="#2563eb" />
        <circle cx="60" cy="46" r="16" fill="#e5e7eb" />
        <path d="M52 46h16M60 38v16" stroke="#6b7280" strokeWidth="3" strokeLinecap="round" />
      </>);
    case "multiturn":
      return svg("Multi-turn trimmer", <>
        {[48, 60, 72].map((x) => leg(x, 76, 94))}
        <rect x="36" y="14" width="48" height="62" rx="4" fill="#1d4ed8" />
        <circle cx="72" cy="24" r="7" fill="#d4a017" />
        <path d="M68 24h8" stroke="#7c5e10" strokeWidth="2" strokeLinecap="round" />
        <text x="54" y="56" fontSize="10" fill="#dbeafe" fontFamily="IBM Plex Mono, monospace" textAnchor="middle">3296</text>
      </>);
    case "dual":
      return svg("Dual-gang potentiometer", <>
        {[40, 54, 68].map((x) => leg(x, 66, 90))}
        {[56, 70, 84].map((x) => leg(x, 70, 94))}
        <rect x="34" y="38" width="56" height="30" rx="4" fill="#a1a1aa" />
        <rect x="30" y="30" width="56" height="30" rx="4" fill="#d4d4d8" stroke="#a1a1aa" />
        <rect x="52" y="4" width="12" height="28" rx="2" fill="#a1a1aa" />
      </>);
    case "digital":
      return svg("Digital potentiometer chip", <>
        {[38, 52, 66, 80].map((x) => <g key={x}>{leg(x, 22, 10)}{leg(x, 74, 88)}</g>)}
        <rect x="28" y="22" width="64" height="52" rx="4" fill="#27272a" />
        <circle cx="38" cy="32" r="3" fill="#52525b" />
        <text x="60" y="54" fontSize="10" fill="#e4e4e7" fontFamily="IBM Plex Mono, monospace" textAnchor="middle">X9C103</text>
      </>);
    default:
      return null;
  }
}

/** Sidebar icon: resistor with an arrow, the potentiometer symbol. */
export function PotIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 15h3l1.5-4 3 8 3-8 3 8 3-8 1.5 4h3" />
      <path d="M12 2v7M9.5 6.5 12 9l2.5-2.5" />
    </svg>
  );
}

/** Sidebar icon: electrical relay symbol (coil + switch contact). */
export function RelayIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="14" width="7" height="6" rx="1" />
      <path d="M6.5 14v-4M6.5 4v3" />
      <path d="M13 5h4M13 19h4" />
      <path d="M13 12h2l4-4" />
      <circle cx="13" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

/**
 * Interactive diagram of a 1-channel relay module:
 * Shows the coil, moving armature (COM snapping between NC and NO), status LEDs, and a connected test lamp.
 */
export function RelaySimulatorDrawing({
  energized,
  loadWire = "no",
  className = "",
}: {
  energized: boolean;
  loadWire?: "no" | "nc";
  className?: string;
}) {
  const font = { fontFamily: "IBM Plex Mono, monospace", fontWeight: 600, textAnchor: "middle" as const };
  const sans = { fontFamily: "IBM Plex Sans, sans-serif" };

  // When COM connects to the chosen wire, current flows and the bulb turns on!
  const bulbOn = (loadWire === "no" && energized) || (loadWire === "nc" && !energized);

  return (
    <svg viewBox="0 0 420 220" className={className} role="img" aria-label={`Relay module ${energized ? "energized (ON)" : "de-energized (OFF)"}`}>
      {/* PCB base */}
      <rect x="10" y="10" width="230" height="200" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="2" />
      <circle cx="24" cy="24" r="5" fill="#0f172a" stroke="#475569" />
      <circle cx="226" cy="24" r="5" fill="#0f172a" stroke="#475569" />
      <circle cx="24" cy="196" r="5" fill="#0f172a" stroke="#475569" />
      <circle cx="226" cy="196" r="5" fill="#0f172a" stroke="#475569" />

      {/* Blue Songle relay case */}
      <rect x="65" y="24" width="160" height="110" rx="4" fill="#1d4ed8" stroke="#1e40af" strokeWidth="2" />
      <text x="145" y="46" fontSize="11" fill="#ffffff" {...font}>SONGLE</text>
      <text x="145" y="60" fontSize="9" fill="#bfdbfe" {...font}>SRD-05VDC-SL-C</text>
      <text x="145" y="74" fontSize="7.5" fill="#93c5fd" {...font}>10A 250VAC · 10A 30VDC</text>

      {/* Internal schematic window */}
      <rect x="75" y="80" width="140" height="46" rx="3" fill="#172554" stroke="#3b82f6" strokeWidth="1" />
      
      {/* Coil symbol with magnetic field lines */}
      <g transform="translate(85, 90)">
        <rect x="0" y="0" width="28" height="24" rx="2" fill={energized ? "#22c55e" : "#334155"} />
        <path d="M4 6h20M4 12h20M4 18h20" stroke={energized ? "#ffffff" : "#64748b"} strokeWidth="1.5" />
        {energized && (
          <path d="M-4 12c-2-6 0-10 4-10M32 2c4 4 4 14 0 20" stroke="#86efac" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
        )}
      </g>
      <text x="99" y="122" fontSize="7" fill={energized ? "#86efac" : "#94a3b8"} {...font}>COIL</text>

      {/* Armature switch */}
      <circle cx="140" cy="102" r="3" fill="#f8fafc" />
      {/* Armature blade: points to NC (top) when de-energized, or snaps to NO (bottom) when energized */}
      <line
        x1="140"
        y1="102"
        x2="175"
        y2={energized ? 112 : 92}
        stroke={energized ? "#38bdf8" : "#e2e8f0"}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Fixed contacts */}
      <circle cx="178" cy="92" r="3" fill={!energized ? "#38bdf8" : "#64748b"} />
      <text x="194" y="94" fontSize="8" fill="#cbd5e1" {...font}>NC</text>
      <circle cx="178" cy="112" r="3" fill={energized ? "#38bdf8" : "#64748b"} />
      <text x="194" y="115" fontSize="8" fill="#cbd5e1" {...font}>NO</text>

      {/* Screw Terminal Block on left (NO, COM, NC) */}
      <rect x="18" y="32" width="38" height="92" rx="4" fill="#047857" stroke="#065f46" strokeWidth="1.5" />
      {[
        { y: 46, label: "NC", pin: "nc" },
        { y: 78, label: "COM", pin: "com" },
        { y: 110, label: "NO", pin: "no" },
      ].map((term) => (
        <g key={term.label}>
          <circle cx="37" cy={term.y} r="8" fill="#0f172a" />
          <circle cx="37" cy={term.y} r="5" fill="#94a3b8" />
          <line x1="34" y1={term.y} x2="40" y2={term.y} stroke="#334155" strokeWidth="1.5" />
          <text x="37" y={term.y + 3} fontSize="8" fill="#f8fafc" {...font}>{term.label}</text>
        </g>
      ))}

      {/* Terminal labels outside block */}
      <text x="12" y="49" fontSize="9" fill="#94a3b8" fontFamily="IBM Plex Mono, monospace" fontWeight={600} textAnchor="end">NC</text>
      <text x="12" y="81" fontSize="9" fill="#38bdf8" fontFamily="IBM Plex Mono, monospace" fontWeight={600} textAnchor="end">COM</text>
      <text x="12" y="113" fontSize="9" fill="#94a3b8" fontFamily="IBM Plex Mono, monospace" fontWeight={600} textAnchor="end">NO</text>

      {/* LED indicators */}
      <g transform="translate(70, 150)">
        {/* Power LED (Red) */}
        <circle cx="10" cy="10" r="5" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
        <circle cx="10" cy="10" r="2" fill="#fca5a5" />
        <text x="10" y="24" fontSize="7" fill="#cbd5e1" {...font}>PWR</text>

        {/* Status LED (Green) */}
        <circle
          cx="38"
          cy="10"
          r="5"
          fill={energized ? "#22c55e" : "#14532d"}
          stroke={energized ? "#86efac" : "#052e16"}
          strokeWidth="1"
        />
        {energized && <circle cx="38" cy="10" r="2" fill="#bbf7d0" />}
        <text x="38" y="24" fontSize="7" fill={energized ? "#86efac" : "#64748b"} {...font}>IN</text>
      </g>

      {/* Input pins on bottom right */}
      <rect x="155" y="152" width="70" height="36" rx="3" fill="#0f172a" stroke="#334155" />
      {[
        { x: 172, label: "VCC", color: "#f43f5e" },
        { x: 190, label: "GND", color: "#64748b" },
        { x: 208, label: "IN", color: "#38bdf8" },
      ].map((pin) => (
        <g key={pin.label}>
          <circle cx={pin.x} cy="164" r="3.5" fill="#e2e8f0" stroke="#94a3b8" />
          <text x={pin.x} y="179" fontSize="7" fill={pin.color} {...font}>{pin.label}</text>
        </g>
      ))}

      {/* External Test Load Circuit (Bulb & Power Source) */}
      <g transform="translate(260, 20)">
        <rect x="0" y="0" width="150" height="180" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
        <text x="75" y="22" fontSize="11" fontWeight="600" fill="#0f172a" textAnchor="middle" style={sans}>External Circuit</text>

        {/* Lamp Bulb */}
        <g transform="translate(75, 75)">
          {/* Bulb Glow */}
          {bulbOn && (
            <circle cx="0" cy="0" r="32" fill="#fef08a" opacity="0.45" />
          )}
          <circle cx="0" cy="0" r="20" fill={bulbOn ? "#fde047" : "#e2e8f0"} stroke={bulbOn ? "#eab308" : "#94a3b8"} strokeWidth="2" />
          {/* Filament */}
          <path
            d="M-8 8 L-4 -4 L0 4 L4 -4 L8 8"
            fill="none"
            stroke={bulbOn ? "#ca8a04" : "#64748b"}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Base */}
          <rect x="-8" y="20" width="16" height="8" rx="2" fill="#94a3b8" />
        </g>
        
        {/* Status text */}
        <text
          x="75"
          y="125"
          fontSize="12"
          fontWeight="700"
          fill={bulbOn ? "#15803d" : "#64748b"}
          textAnchor="middle"
          style={sans}
        >
          {bulbOn ? "LOAD IS ON" : "LOAD IS OFF"}
        </text>
        <text x="75" y="142" fontSize="9" fill="#64748b" textAnchor="middle" style={sans}>
          Connected to {loadWire.toUpperCase()}
        </text>
        <text x="75" y="160" fontSize="9" fill={bulbOn ? "#047857" : "#b91c1c"} textAnchor="middle" style={sans}>
          Circuit {bulbOn ? "CLOSED (Current flows)" : "OPEN (No current)"}
        </text>
      </g>
    </svg>
  );
}

/** Simple drawings of the common relay types. */
export function RelayDrawing({ type, className = "" }: { type: string; className?: string }) {
  const font = { fontFamily: "IBM Plex Mono, monospace", fontWeight: 600, textAnchor: "middle" as const };
  const svg = (label: string, children: ReactNode) => (
    <svg viewBox="0 0 120 100" className={className} role="img" aria-label={label}>
      {children}
    </svg>
  );

  switch (type) {
    case "electromechanical":
      return svg("Electromechanical Relay", <>
        <rect x="20" y="18" width="80" height="64" rx="4" fill="#1d4ed8" stroke="#1e40af" strokeWidth="2" />
        <rect x="14" y="32" width="10" height="36" rx="2" fill="#047857" />
        <text x="60" y="44" fontSize="11" fill="#ffffff" {...font}>SONGLE</text>
        <text x="60" y="58" fontSize="8" fill="#93c5fd" {...font}>5V DC</text>
        <text x="60" y="70" fontSize="7" fill="#bfdbfe" {...font}>10A 250VAC</text>
      </>);
    case "ssr":
      return svg("Solid State Relay", <>
        <rect x="22" y="14" width="76" height="72" rx="4" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
        <rect x="30" y="24" width="60" height="24" rx="2" fill="#dc2626" />
        <text x="60" y="39" fontSize="10" fill="#ffffff" {...font}>SSR-25DA</text>
        <circle cx="36" cy="70" r="4" fill="#94a3b8" />
        <circle cx="84" cy="70" r="4" fill="#94a3b8" />
        <text x="60" y="74" fontSize="8" fill="#a1a1aa" {...font}>AC LOAD</text>
      </>);
    case "reed":
      return svg("Reed Relay", <>
        <rect x="16" y="28" width="88" height="44" rx="6" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
        {/* Glass tube inside */}
        <rect x="24" y="36" width="72" height="28" rx="14" fill="#bae6fd" opacity="0.6" />
        <line x1="32" y1="50" x2="56" y2="50" stroke="#0f172a" strokeWidth="2" />
        <line x1="62" y1="50" x2="88" y2="50" stroke="#0f172a" strokeWidth="2" />
        <line x1="56" y1="50" x2="62" y2="47" stroke="#0f172a" strokeWidth="2" />
        <text x="60" y="86" fontSize="8" fill="#475569" {...font}>REED</text>
      </>);
    case "latching":
      return svg("Latching Relay", <>
        <rect x="20" y="18" width="80" height="64" rx="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
        <rect x="30" y="28" width="60" height="20" rx="2" fill="#475569" />
        <text x="60" y="42" fontSize="9" fill="#f8fafc" {...font}>BISTABLE</text>
        <path d="M40 60h40M45 56l-5 4 5 4M75 56l5 4-5 4" stroke="#0f172a" strokeWidth="1.5" fill="none" />
        <text x="60" y="74" fontSize="8" fill="#64748b" {...font}>PULSE SET</text>
      </>);
    case "mosfet-module":
      return svg("MOSFET Module", <>
        <rect x="18" y="20" width="84" height="60" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
        {/* TO-220 Transistor */}
        <rect x="44" y="30" width="32" height="34" rx="2" fill="#0f172a" />
        <rect x="48" y="25" width="24" height="8" rx="1" fill="#cbd5e1" />
        <text x="60" y="50" fontSize="8" fill="#38bdf8" {...font}>IRF520</text>
        <rect x="22" y="32" width="14" height="36" rx="2" fill="#15803d" />
        <rect x="84" y="32" width="14" height="36" rx="2" fill="#15803d" />
      </>);
    default:
      return null;
  }
}

/** Sidebar icon: Diode symbol (triangle pointing to bar). */
export function DiodeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polygon points="6 6 15 12 6 18 6 6" fill="currentColor" fillOpacity="0.2" />
      <line x1="15" y1="6" x2="15" y2="18" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="15" y1="12" x2="22" y2="12" />
    </svg>
  );
}

/** Sidebar icon: BJT Transistor symbol (Base, Collector, Emitter with arrow). */
export function TransistorIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <line x1="3" y1="12" x2="9" y2="12" />
      <line x1="9" y1="7" x2="9" y2="17" />
      <line x1="9" y1="10" x2="16" y2="6" />
      <line x1="9" y1="14" x2="16" y2="18" />
      <polyline points="13 18 16 18 16 15" />
    </svg>
  );
}

/** Sidebar icon: MOSFET power symbol. */
export function MosfetIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <line x1="3" y1="12" x2="8" y2="12" />
      <line x1="8" y1="7" x2="8" y2="17" />
      <line x1="11" y1="7" x2="11" y2="9" />
      <line x1="11" y1="11" x2="11" y2="13" />
      <line x1="11" y1="15" x2="11" y2="17" />
      <line x1="11" y1="8" x2="17" y2="8" />
      <line x1="17" y1="8" x2="17" y2="5" />
      <line x1="11" y1="16" x2="17" y2="16" />
      <line x1="17" y1="16" x2="17" y2="19" />
    </svg>
  );
}

/** Sidebar icon: Integrated Circuit (DIP chip with pins). */
export function IcIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="6" y="4" width="12" height="16" rx="2" />
      <path d="M10 4a2 2 0 0 0 4 0" />
      <line x1="2" y1="8" x2="6" y2="8" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="2" y1="16" x2="6" y2="16" />
      <line x1="18" y1="8" x2="22" y2="8" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="18" y1="16" x2="22" y2="16" />
    </svg>
  );
}

/** Sidebar icon: DC-DC step converter (Inductor / voltage transformation). */
export function ConverterIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 14l3-4 4 4 3-4" />
      <circle cx="7" cy="14" r="1" fill="currentColor" />
      <circle cx="17" cy="10" r="1" fill="currentColor" />
    </svg>
  );
}

/** Physical Diode Illustration: Cylinder with silver cathode stripe. */
export function DiodeDrawing({ type = "rectifier", className = "" }: { type?: string; className?: string }) {
  const isZener = type === "zener" || type === "fast-switching";
  return (
    <svg viewBox="0 0 200 60" className={className} role="img" aria-label="Diode illustration showing Anode and Cathode">
      {/* Wire leads */}
      <line x1="10" y1="30" x2="60" y2="30" stroke="#a1a1aa" strokeWidth="3" strokeLinecap="round" />
      <line x1="140" y1="30" x2="190" y2="30" stroke="#a1a1aa" strokeWidth="3" strokeLinecap="round" />
      {/* Diode body */}
      <rect
        x="60"
        y="14"
        width="80"
        height="32"
        rx="6"
        fill={isZener ? "#ea580c" : "#18181b"}
        stroke="#27272a"
        strokeWidth="1.5"
      />
      {/* Cathode stripe */}
      <rect
        x="120"
        y="14"
        width="14"
        height="32"
        fill={isZener ? "#09090b" : "#e4e4e7"}
      />
      {/* Labels */}
      <text x="35" y="48" fontSize="10" fill="#71717a" fontFamily="IBM Plex Mono, monospace" textAnchor="middle">Anode (+)</text>
      <text x="165" y="48" fontSize="10" fill="#0284c7" fontFamily="IBM Plex Mono, monospace" textAnchor="middle">Cathode (-)</text>
    </svg>
  );
}

/** Physical TO-92 Transistor Package Drawing with labeled legs. */
export function TransistorDrawing({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 140" className={className} role="img" aria-label="TO-92 Transistor with Emitter, Base, Collector leads">
      {/* TO-92 Body (half cylinder with flat face) */}
      <path d="M40 30 C40 10, 120 10, 120 30 L120 54 L40 54 Z" fill="#27272a" stroke="#18181b" strokeWidth="2" />
      <rect x="40" y="50" width="80" height="12" rx="2" fill="#3f3f46" />
      <text x="80" y="40" fontSize="11" fill="#e4e4e7" fontFamily="IBM Plex Mono, monospace" fontWeight="600" textAnchor="middle">2N2222</text>
      {/* Leads: 1=Emitter, 2=Base, 3=Collector */}
      {[
        { x: 55, name: "E", full: "Emitter" },
        { x: 80, name: "B", full: "Base" },
        { x: 105, name: "C", full: "Collector" },
      ].map((lead) => (
        <g key={lead.name}>
          <line x1={lead.x} y1="62" x2={lead.x} y2="110" stroke="#a1a1aa" strokeWidth="3" strokeLinecap="round" />
          <circle cx={lead.x} cy="116" r="8" fill="#f4f4f5" stroke="#71717a" />
          <text x={lead.x} y="119" fontSize="9" fontWeight="700" fill="#18181b" fontFamily="IBM Plex Mono, monospace" textAnchor="middle">{lead.name}</text>
          <text x={lead.x} y="134" fontSize="8" fill="#71717a" fontFamily="IBM Plex Sans, sans-serif" textAnchor="middle">{lead.full}</text>
        </g>
      ))}
    </svg>
  );
}

/** Physical TO-220 Power MOSFET Package Drawing. */
export function MosfetDrawing({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 150" className={className} role="img" aria-label="TO-220 Power MOSFET with Gate, Drain, Source leads">
      {/* Metal Heatsink Tab with mounting hole */}
      <rect x="44" y="8" width="72" height="34" rx="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
      <circle cx="80" cy="22" r="7" fill="#64748b" />
      {/* Plastic Case */}
      <rect x="40" y="38" width="80" height="42" rx="3" fill="#18181b" stroke="#09090b" strokeWidth="2" />
      <text x="80" y="62" fontSize="10" fill="#38bdf8" fontFamily="IBM Plex Mono, monospace" fontWeight="700" textAnchor="middle">IRLZ44N</text>
      {/* Leads: 1=Gate, 2=Drain, 3=Source */}
      {[
        { x: 55, name: "G", full: "Gate" },
        { x: 80, name: "D", full: "Drain" },
        { x: 105, name: "S", full: "Source" },
      ].map((lead) => (
        <g key={lead.name}>
          <line x1={lead.x} y1="80" x2={lead.x} y2="120" stroke="#a1a1aa" strokeWidth="3" strokeLinecap="round" />
          <circle cx={lead.x} cy="126" r="8" fill="#f4f4f5" stroke="#71717a" />
          <text x={lead.x} y="129" fontSize="9" fontWeight="700" fill="#18181b" fontFamily="IBM Plex Mono, monospace" textAnchor="middle">{lead.name}</text>
          <text x={lead.x} y="144" fontSize="8" fill="#71717a" fontFamily="IBM Plex Sans, sans-serif" textAnchor="middle">{lead.full}</text>
        </g>
      ))}
    </svg>
  );
}

/** Physical DIP IC Drawing showing Notch and Pin 1 orientation. */
export function IcDrawing({ pins = 16, label = "74HC595", className = "" }: { pins?: number; label?: string; className?: string }) {
  return (
    <svg viewBox="0 0 180 130" className={className} role="img" aria-label="DIP Integrated Circuit showing pin 1 notch">
      {/* Chip Body */}
      <rect x="45" y="16" width="90" height="96" rx="4" fill="#18181b" stroke="#27272a" strokeWidth="2" />
      {/* Notch at top */}
      <path d="M80 16 a10 10 0 0 0 20 0" fill="#09090b" stroke="#27272a" />
      {/* Pin 1 dimple */}
      <circle cx="56" cy="30" r="3" fill="#3f3f46" />
      <text x="90" y="68" fontSize="11" fill="#f4f4f5" fontFamily="IBM Plex Mono, monospace" fontWeight="700" textAnchor="middle">{label}</text>
      {/* Pins on left and right */}
      {[28, 44, 60, 76, 92].map((y, i) => (
        <g key={y}>
          <rect x="25" y={y - 4} width="20" height="8" rx="2" fill="#a1a1aa" />
          <rect x="135" y={y - 4} width="20" height="8" rx="2" fill="#a1a1aa" />
          <text x="18" y={y + 3} fontSize="8" fill="#71717a" fontFamily="IBM Plex Mono, monospace">{i + 1}</text>
          <text x="158" y={y + 3} fontSize="8" fill="#71717a" fontFamily="IBM Plex Mono, monospace">{pins - i}</text>
        </g>
      ))}
    </svg>
  );
}

/** DC-DC Converter Module Board Illustration. */
export function ConverterDrawing({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 130" className={className} role="img" aria-label="DC-DC Buck Converter Module">
      {/* PCB Base */}
      <rect x="15" y="15" width="170" height="100" rx="6" fill="#1e3a8a" stroke="#1d4ed8" strokeWidth="2" />
      {/* Toroidal/Wirewound Inductor */}
      <circle cx="65" cy="65" r="24" fill="#3f3f46" stroke="#d97706" strokeWidth="4" />
      <circle cx="65" cy="65" r="10" fill="#1e3a8a" />
      {/* Blue Multi-Turn Potentiometer Trimmer */}
      <rect x="110" y="32" width="46" height="30" rx="3" fill="#0284c7" stroke="#0369a1" />
      <circle cx="145" cy="47" r="5" fill="#d97706" stroke="#b45309" strokeWidth="1" />
      <line x1="142" y1="47" x2="148" y2="47" stroke="#78350f" strokeWidth="1.5" />
      {/* Solder Pads */}
      <rect x="20" y="22" width="12" height="12" rx="2" fill="#e2e8f0" />
      <text x="26" y="44" fontSize="7" fill="#93c5fd" fontFamily="IBM Plex Mono, monospace" textAnchor="middle">IN+</text>
      <rect x="20" y="96" width="12" height="12" rx="2" fill="#e2e8f0" />
      <text x="26" y="93" fontSize="7" fill="#93c5fd" fontFamily="IBM Plex Mono, monospace" textAnchor="middle">IN-</text>
      <rect x="168" y="22" width="12" height="12" rx="2" fill="#e2e8f0" />
      <text x="174" y="44" fontSize="7" fill="#93c5fd" fontFamily="IBM Plex Mono, monospace" textAnchor="middle">OUT+</text>
      <rect x="168" y="96" width="12" height="12" rx="2" fill="#e2e8f0" />
      <text x="174" y="93" fontSize="7" fill="#93c5fd" fontFamily="IBM Plex Mono, monospace" textAnchor="middle">OUT-</text>
      {/* Control IC */}
      <rect x="112" y="74" width="28" height="24" rx="2" fill="#18181b" />
      <text x="126" y="89" fontSize="7" fill="#f8fafc" fontFamily="IBM Plex Mono, monospace" textAnchor="middle">LM2596</text>
    </svg>
  );
}

/** Sidebar icon: Inductor coil symbol. */
export function InductorIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 13h2a2 2 0 1 1 4 0 2 2 0 1 1 4 0 2 2 0 1 1 4 0 2 2 0 1 1 4 0h2" />
    </svg>
  );
}

/** Sidebar icon: Optocoupler (isolated optical barrier). */
export function OptocouplerIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="4" y="4" width="6" height="16" rx="2" />
      <rect x="14" y="4" width="6" height="16" rx="2" />
      <path d="M10 10l2 2-2 2" />
      <line x1="1" y1="8" x2="4" y2="8" />
      <line x1="1" y1="16" x2="4" y2="16" />
      <line x1="20" y1="8" x2="23" y2="8" />
      <line x1="20" y1="16" x2="23" y2="16" />
    </svg>
  );
}

/** Sidebar icon: Buzzer / Speaker acoustic sounder. */
export function BuzzerIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polygon points="10 6 5 9 2 9 2 15 5 15 10 18 10 6" fill="currentColor" fillOpacity="0.15" />
      <path d="M14 9a4 4 0 0 1 0 6" />
      <path d="M17.5 6.5a8 8 0 0 1 0 11" />
    </svg>
  );
}

/** Sidebar icon: 3-pin Linear Voltage Regulator (TO-220 / LDO). */
export function RegulatorIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="5" y="5" width="14" height="11" rx="2" />
      <rect x="7" y="2" width="10" height="3" rx="1" fill="currentColor" fillOpacity="0.2" />
      <line x1="8" y1="16" x2="8" y2="22" />
      <line x1="12" y1="16" x2="12" y2="22" />
      <line x1="16" y1="16" x2="16" y2="22" />
    </svg>
  );
}



