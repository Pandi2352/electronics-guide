import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";

export interface DropdownOption<T extends string = string> {
  value: T;
  label: string;
}

interface DropdownProps<T extends string> {
  /** Accessible name, e.g. "Interface". */
  label: string;
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  /** Which edge of the button the menu lines up with. */
  align?: "start" | "end";
  size?: "md" | "sm";
  className?: string;
}

export default function Dropdown<T extends string>({ label, value, options, onChange, align = "start", size = "md", className = "" }: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();

  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const selected = options[selectedIndex];

  const openMenu = (index = selectedIndex) => {
    setActive(index);
    setOpen(true);
  };

  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) buttonRef.current?.focus();
  };

  const choose = (index: number) => {
    const option = options[index];
    if (option) onChange(option.value);
    close();
  };

  // Move focus into the list when it opens so arrow keys work right away.
  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  // Keep the highlighted option visible in long lists.
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  // Close when tapping or clicking anywhere else.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const onButtonKeyDown = (e: KeyboardEvent) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      openMenu();
    }
  };

  const onListKeyDown = (e: KeyboardEvent) => {
    const last = options.length - 1;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((i) => Math.min(last, i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((i) => Math.max(0, i - 1));
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(last);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        choose(active);
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        close(false);
        break;
      default:
        // Jump to the next option starting with the typed letter.
        if (e.key.length === 1) {
          const key = e.key.toLowerCase();
          const order = [...options.keys()].map((k) => (active + 1 + k) % options.length);
          const hit = order.find((i) => options[i].label.toLowerCase().startsWith(key));
          if (hit !== undefined) setActive(hit);
        }
    }
  };

  const height = size === "sm" ? "h-9 sm:h-8 text-xs" : "h-10 md:h-9 text-sm";

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={`${label}: ${selected?.label ?? ""}`}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={onButtonKeyDown}
        className={`flex w-full items-center justify-between gap-2 rounded-md border bg-white px-3 font-medium text-zinc-700 transition-colors ${height} ${
          open ? "border-teal-600" : "border-zinc-200 hover:border-zinc-300"
        }`}
      >
        <span className="truncate">{selected?.label}</span>
        <ChevronDown size={16} className={`shrink-0 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          tabIndex={-1}
          aria-label={label}
          aria-activedescendant={`${id}-opt-${active}`}
          onKeyDown={onListKeyDown}
          className={`absolute top-full z-30 mt-1 max-h-72 min-w-full overflow-y-auto rounded-md border border-zinc-200 bg-white p-1 focus-visible:outline-none ${
            align === "end" ? "right-0" : "left-0"
          }`}
        >
          {options.map((o, i) => {
            const isSelected = o.value === value;
            return (
              <li
                key={o.value}
                id={`${id}-opt-${i}`}
                data-index={i}
                role="option"
                aria-selected={isSelected}
                onPointerMove={() => setActive(i)}
                onClick={() => choose(i)}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-md px-2.5 py-2 text-sm whitespace-nowrap md:py-1.5 ${
                  i === active ? "bg-zinc-100 text-zinc-900" : "text-zinc-700"
                } ${isSelected ? "font-semibold text-teal-800" : ""}`}
              >
                {o.label}
                {isSelected && <Check size={15} className="text-teal-700" aria-hidden />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
