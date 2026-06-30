import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/user/context/ThemeProvider";

const NAV_LINKS = [
  { label: "Films", href: "#films" },
  { label: "Séances", href: "#films" },
  { label: "Tarifs", href: "#tarifs" },
  { label: "À propos", href: "#experience" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  return (
    <nav
      className="fixed inset-x-0 top-0 z-[60] border-b transition-[background-color,backdrop-filter,border-color,box-shadow] duration-[400ms]"
      style={{
        backgroundColor: scrolled
          ? theme === "dark"
            ? "rgba(7,11,28,0.74)"
            : "rgba(249,249,249,0.8)"
          : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderColor: scrolled ? "var(--border)" : "transparent",
        boxShadow: scrolled ? "0 8px 36px rgba(0,0,0,0.28)" : "none",
      }}
    >
      <div className="mx-auto flex max-w-[1320px] items-center gap-10 px-8 py-[18px]">
        <a href="#top" className="flex items-center gap-[11px] text-[var(--text)]">
          <span
            className="h-[34px] w-[34px] shrink-0 rounded-full"
            style={{
              background: "radial-gradient(circle at 35% 30%, #5E94CE, #17286D)",
              boxShadow: "0 0 22px rgba(58,110,165,0.5)",
            }}
          />
          <span className="font-['Sora'] text-[19px] font-bold tracking-[0.04em]">
            BAOBAB
            <span className="font-light text-[var(--accent2)]"> CINÉMA</span>
          </span>
        </a>

        <div className="ml-2 hidden items-center gap-[30px] md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="navlink text-[14.5px] font-medium text-[var(--muted)] transition-colors hover:text-[var(--text)]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3.5">
          <button
            type="button"
            onClick={() => setSearchOpen((open) => !open)}
            aria-label="Rechercher"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text)] transition-transform active:scale-95"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Changer de thème"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text)] transition-transform active:scale-95"
          >
            {theme === "dark" ? (
              <Sun className="h-[18px] w-[18px]" />
            ) : (
              <Moon className="h-[18px] w-[18px]" />
            )}
          </button>

          <Button
            asChild
            variant="outline"
            className="hidden rounded-full border-[var(--border)] bg-transparent px-[18px] text-[var(--text)] hover:bg-white/5 hover:text-[var(--text)] sm:inline-flex"
          >
            <Link to="/connexion">Connexion</Link>
          </Button>

          <Button
            asChild
            className="rounded-full bg-[var(--accent)] px-5 font-['Sora'] font-semibold text-white shadow-[0_8px_26px_rgba(58,110,165,0.32)] transition-all hover:-translate-y-0.5 hover:bg-[var(--accent2)] hover:shadow-[0_12px_34px_rgba(58,110,165,0.5)]"
          >
            <Link to="/inscription">S'inscrire</Link>
          </Button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-[var(--border)] px-8 py-3" style={{ backgroundColor: "var(--bg)" }}>
          <div className="mx-auto flex max-w-[1320px] items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface2)] px-5 py-1">
            <Search className="h-[18px] w-[18px] text-[var(--muted)]" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Rechercher un film, un genre, un réalisateur…"
              className="w-full bg-transparent py-3 text-[15px] text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none"
            />
          </div>
        </div>
      )}
    </nav>
  );
}
