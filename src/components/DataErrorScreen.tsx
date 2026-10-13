export default function DataErrorScreen({ errors }: { errors: string[] }) {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="rounded-md border border-rose-200 bg-rose-50 p-5">
        <h1 className="text-lg font-semibold text-rose-900">The data files have problems</h1>
        <p className="mt-1 text-sm text-rose-800">Fix these entries in src/data/*.json and save. The page reloads on its own.</p>
        <ul className="mt-4 flex flex-col gap-1.5 font-mono text-xs text-rose-900">
          {errors.map((e) => (
            <li key={e} className="rounded-md border border-rose-200 bg-white px-3 py-2">
              {e}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
