import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

const KEYWORDS =
  "void|int|long|float|double|bool|byte|char|const|unsigned|static|volatile|enum|return|if|else|for|while|switch|case|break|default|true|false|uint8_t|int16_t|HIGH|LOW|INPUT|OUTPUT|INPUT_PULLUP";

// Comments, strings, #directives, keywords, numbers: enough colour to read Arduino code easily.
const TOKEN = new RegExp(`(\\/\\/.*$)|("(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*')|(#\\w+)|\\b(${KEYWORDS})\\b|\\b(0x[0-9A-Fa-f]+|\\d+(?:\\.\\d+)?)\\b`, "g");

function highlight(line: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of line.matchAll(TOKEN)) {
    const start = m.index ?? 0;
    if (start > last) out.push(line.slice(last, start));
    const [text, comment, str, directive, keyword] = m;
    const cls = comment ? "text-zinc-500" : str ? "text-amber-300" : directive ? "text-rose-300" : keyword ? "text-sky-300" : "text-emerald-300";
    out.push(
      <span key={start} className={cls}>
        {text}
      </span>,
    );
    last = start + text.length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for browsers that block the clipboard API (e.g. plain http on a phone).
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

export default function CodeBlock({ lines, filename = "sketch.ino" }: { lines: string[]; filename?: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    if (await copyText(lines.join("\n"))) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <div className="overflow-hidden rounded-md border border-zinc-800 bg-zinc-950">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-800 px-3 py-2">
        <span className="font-mono text-xs text-zinc-400">
          {filename} <span className="text-zinc-600">· {lines.length} lines</span>
        </span>
        <button
          type="button"
          onClick={onCopy}
          className={`inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium transition-colors ${
            copied ? "border-emerald-700 bg-emerald-900/40 text-emerald-300" : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          }`}
        >
          {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
          {copied ? "Copied" : "Copy code"}
        </button>
      </div>
      <pre className="overflow-x-auto py-3 font-mono text-[12.5px] leading-relaxed text-zinc-100">
        <code className="grid min-w-max">
          {lines.map((line, i) => (
            <span key={i} className="flex">
              <span className="w-10 shrink-0 pr-3 text-right text-zinc-600 select-none">{i + 1}</span>
              <span className="pr-4">{line ? highlight(line) : " "}</span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
