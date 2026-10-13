# Electronics Guide

> An interactive visual handbook for electronics, sensors, discrete components, power converters, and Arduino Nano builds.

🔗 **Live Site:** [https://electronics-guide.vercel.app/](https://electronics-guide.vercel.app/)

---

## ⚡ Quick Start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in dist/
```

## Data

| File | What it holds |
| --- | --- |
| `src/data/sensors.json` | Only real sensors (no boards, storage, emitters or accessories). Each one: SKU, category, one-line `purpose`, interface, use cases, wiring per board, tip, and project ideas (`low` / `medium` / `high`). |
| `src/data/modules.json` | Boards: specs, buses, pinout, notes. Add new boards here. |
| `src/data/projects.json` | Nano Projects: complete builds by level (`low` / `medium` / `high`) with sensors (SKUs), parts, wiring, steps, the Arduino sketch (one string per line) and extensions. |
| `src/data/resistors.json` | Resistor basics, how-to-read steps, colour bands (digit / multiplier / tolerance) and common values with purpose and uses. |
| `src/data/capacitors.json` | Capacitor basics, code-reading steps, tolerance letters, the 4 types, and common values (stored in pF) with code, voltage and uses. |
| `src/data/potentiometers.json` | Potentiometer basics, marking/taper guide, the 6 types, common values and Arduino example sketches (wiring + code). |
| `src/data/relays.json` | Relay basics, COM/NO/NC terminal guide, JD-VCC opto-isolation, 5 relay types, common breakout boards and Arduino example sketches. |
| `src/data/diodes.json` | Diode purpose, flyback/reverse-polarity scenarios, bias basics, 5 diode types, common parts and Arduino example sketches. |
| `src/data/transistors.json` | BJT purpose, low-side/high-side switching scenarios, base resistor formula, NPN/PNP types, common parts and Arduino sketches. |
| `src/data/mosfets.json` | MOSFET purpose, logic-level gate warning, PWM high-power switching scenarios, 10k pull-down rule, types and PWM dimmer sketches. |
| `src/data/ics.json` | Integrated circuit purpose, pin-expansion and driver scenarios (74HC595, ULN2003, L293D), DIP pinout orientation and sketches. |
| `src/data/converters.json` | DC-DC converter purpose, linear regulator heat comparison, Buck/Boost/SEPIC topologies, multi-turn trimmer rule and modules. |

- Sensor `wiring` is keyed by a module `id` from `modules.json` (e.g. `"arduino-nano"`). To add ESP32 wiring, add an `"esp32-devkit": [...]` list to the sensor.
- Categories and interface filters are built from the sensors themselves, so a new category needs no code change. Only the category icon is mapped in `src/components/ui.tsx` (unknown categories get a default icon).
- `src/data/index.ts` checks both files when the app starts. A missing field, duplicate SKU or unknown module id shows an error screen that names the exact entry.

## UI rules

- No shadows: shadow utilities are removed in `src/index.css`.
- One radius: only `rounded-md` exists in the theme.
