import { useEffect } from "react";
import { Play, X } from "lucide-react";

export default function TrailerModal({ open, onClose, film }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(2,4,14,0.82)] p-8 backdrop-blur-[10px] animate-in fade-in duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[880px] overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_40px_120px_rgba(0,0,0,0.7)] animate-in slide-in-from-bottom-4 duration-500"
      >
        <div className="relative flex aspect-video items-center justify-center bg-[radial-gradient(120%_100%_at_50%_30%,#17286D,#000)]">
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "repeating-linear-gradient(115deg, rgba(168,192,224,.05) 0 2px, transparent 2px 26px)",
            }}
          />
          <span className="relative flex h-[78px] w-[78px] items-center justify-center rounded-full bg-[rgba(249,249,249,0.92)] text-[#0A0F2C] shadow-[0_0_50px_rgba(94,148,206,0.5)]">
            <Play className="h-[30px] w-[30px]" fill="currentColor" />
          </span>
          <span className="absolute bottom-[18px] left-5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[rgba(221,230,240,0.4)]">
            lecteur vidéo — bande-annonce
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 px-7 py-6">
          <div>
            <h3 className="font-['Sora'] text-xl font-semibold text-[var(--text)]">
              {film?.title} — Bande-annonce
            </h3>
            <p className="mt-1.5 text-[13.5px] text-[var(--faint)]">
              {film?.genre} · {film?.runtime} · {film?.year}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text)] transition-colors hover:bg-[var(--surface2)]"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
