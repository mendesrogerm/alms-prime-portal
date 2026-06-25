export function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/5511964073364"
      target="_blank"
      rel="noreferrer"
      aria-label="Falar com a ALMS Prime pelo WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full border border-emerald-200/30 bg-emerald-400 px-5 py-3 text-sm font-black uppercase tracking-wide text-slate-950 shadow-2xl shadow-emerald-950/30 transition hover:-translate-y-1 hover:bg-emerald-300"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-base text-emerald-300">
        W
      </span>
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
