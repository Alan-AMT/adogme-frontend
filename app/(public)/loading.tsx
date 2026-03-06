export default function Loading() {
  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center px-6 py-16">
      <div className="flex items-center gap-3">
        <div className="h-3 w-3 animate-pulse rounded-full bg-zinc-300" />
        <div className="h-3 w-3 animate-pulse rounded-full bg-zinc-300" />
        <div className="h-3 w-3 animate-pulse rounded-full bg-zinc-300" />
        <span className="ml-2 text-sm text-zinc-600">Cargando…</span>
      </div>
    </div>
  );
}
