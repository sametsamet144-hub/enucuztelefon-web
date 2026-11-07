export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-slate-500">
        <div className="h-10 w-10 rounded-full border-4 border-slate-200 border-t-sky-500 animate-spin" />
        <span className="text-sm font-semibold">Veriler yükleniyor...</span>
      </div>
    </div>
  );
}
