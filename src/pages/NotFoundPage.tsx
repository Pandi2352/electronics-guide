import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";

export default function NotFoundPage({ what = "page" }: { what?: string }) {
  return (
    <div className="flex flex-col items-center rounded-md border border-dashed border-zinc-300 bg-white px-4 py-16 text-center">
      <SearchX size={28} className="text-zinc-400" aria-hidden />
      <h1 className="mt-3 text-lg font-semibold">This {what} doesn't exist</h1>
      <p className="mt-1 text-sm text-zinc-500">The link may be old, or the item was renamed in the JSON data.</p>
      <div className="mt-5 flex gap-2">
        <Link to="/sensors" className="rounded-md bg-teal-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-800">
          Browse sensors
        </Link>
        <Link to="/modules" className="rounded-md border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100">
          Browse modules
        </Link>
      </div>
    </div>
  );
}
