import { useEffect, useState, type ReactNode } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { CircuitBoard, Cpu, Hammer, Menu, Radar, X } from "lucide-react";
import {
  capacitorGuide,
  converterGuide,
  diodeGuide,
  icGuide,
  modules,
  mosfetGuide,
  potGuide,
  projects,
  relayGuide,
  resistorGuide,
  sensors,
  transistorGuide,
} from "../data";
import {
  CapacitorIcon,
  ConverterIcon,
  DiodeIcon,
  IcIcon,
  MosfetIcon,
  PotIcon,
  RelayIcon,
  ResistorIcon,
  TransistorIcon,
} from "./illustrations";

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
  count: number;
}

const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "Sensors & Boards",
    items: [
      { to: "/sensors", label: "Sensors", icon: <Radar size={18} strokeWidth={1.75} aria-hidden />, count: sensors.length },
      { to: "/modules", label: "Modules", icon: <CircuitBoard size={18} strokeWidth={1.75} aria-hidden />, count: modules.length },
    ],
  },
  {
    title: "Components",
    items: [
      { to: "/resistors", label: "Resistors", icon: <ResistorIcon />, count: resistorGuide.values.length },
      { to: "/capacitors", label: "Capacitors", icon: <CapacitorIcon />, count: capacitorGuide.values.length },
      { to: "/potentiometers", label: "Potentiometers", icon: <PotIcon />, count: potGuide.values.length },
      { to: "/diodes", label: "Diodes", icon: <DiodeIcon />, count: diodeGuide.types.length },
      { to: "/transistors", label: "Transistors", icon: <TransistorIcon />, count: transistorGuide.types.length },
      { to: "/mosfets", label: "MOSFETs", icon: <MosfetIcon />, count: mosfetGuide.types.length },
      { to: "/relays", label: "Relays", icon: <RelayIcon />, count: relayGuide.types.length },
      { to: "/ics", label: "ICs", icon: <IcIcon />, count: icGuide.types.length },
    ],
  },
  {
    title: "Power",
    items: [
      { to: "/converters", label: "DC-DC Converters", icon: <ConverterIcon />, count: converterGuide.popularModules.length },
    ],
  },
  {
    title: "Build",
    items: [{ to: "/projects", label: "Nano Projects", icon: <Hammer size={18} strokeWidth={1.75} aria-hidden />, count: projects.length }],
  },
];

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-8 items-center justify-center rounded-md bg-teal-700 text-white">
        <Cpu size={18} strokeWidth={2} aria-hidden />
      </span>
      <div className="leading-tight">
        <div className="text-sm font-semibold text-zinc-900">IoT Guide</div>
        <div className="text-xs text-zinc-500">Learn with sensors</div>
      </div>
    </div>
  );
}

function SidebarNav() {
  return (
    <nav className="flex flex-col gap-5" aria-label="Main">
      {NAV_GROUPS.map((group) => (
        <div key={group.title}>
          <div className="mb-1.5 px-3 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">{group.title}</div>
          <div className="flex flex-col gap-1">
            {group.items.map(({ to, label, icon, count }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors lg:py-2 ${
                    isActive ? "bg-teal-50 text-teal-800" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  }`
                }
              >
                {icon}
                <span className="flex-1">{label}</span>
                <span className="font-mono text-xs text-zinc-400">{count}</span>
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

function SidebarFooter() {
  return (
    <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600">
      <div className="font-medium text-zinc-800">Starting board</div>
      <p className="mt-1">All wiring is written for the Arduino Nano first. ESP32 comes next.</p>
    </div>
  );
}

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the mobile drawer and scroll to top whenever the page changes.
  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="min-h-dvh">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col gap-6 overflow-y-auto border-r border-zinc-200 bg-white p-4 lg:flex">
        <Brand />
        <SidebarNav />
        <div className="mt-auto">
          <SidebarFooter />
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-4 lg:hidden">
        <Brand />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex size-10 items-center justify-center rounded-md border border-zinc-200 text-zinc-700 hover:bg-zinc-100"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <button type="button" className="absolute inset-0 bg-zinc-900/40" aria-label="Close menu" onClick={() => setOpen(false)} />
          <aside role="dialog" aria-modal="true" aria-label="Menu" className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col gap-6 overflow-y-auto border-r border-zinc-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <Brand />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex size-10 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>
            <SidebarNav />
            <div className="mt-auto">
              <SidebarFooter />
            </div>
          </aside>
        </div>
      )}

      <main className="lg:pl-60">
        <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
