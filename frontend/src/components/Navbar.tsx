import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };
  const navItems = [["how-it-works", "How It Works"], ["features", "Agents"], ["pricing", "Challenge Demo"]];
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-[20px] border-b border-baymax-red"
          : "border-b border-transparent"
      }`}
      style={{ background: scrolled ? "rgba(8,8,8,0.85)" : "transparent" }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => scrollTo("hero")} className="flex items-center gap-2 font-syne font-bold text-xl text-foreground">
          <span className="w-8 h-8 rounded-lg bg-baymax-red flex items-center justify-center text-sm font-bold">B</span>
          Baymax.app
        </button>
        <div className="hidden md:flex items-center gap-8">
          {navItems.map(([id, label]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/PROJECT_REPORT.md"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Project Report
          </a>
          <button
            onClick={() => scrollTo("dashboard")}
            className="bg-baymax-red text-foreground font-syne font-bold text-sm px-5 py-2 rounded-lg btn-red-glow transition-all"
          >
            Open Career Dashboard
          </button>
        </div>
        <button className="md:hidden text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t border-border px-6 py-4 space-y-3" style={{ background: "rgba(8,8,8,0.95)" }}>
          {navItems.map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)} className="block text-sm text-muted-foreground">
              {label}
            </button>
          ))}
          <a href="/PROJECT_REPORT.md" className="block text-sm text-muted-foreground">Project Report</a>
          <button onClick={() => scrollTo("dashboard")} className="bg-baymax-red text-foreground font-syne font-bold text-sm px-5 py-2 rounded-lg w-full">
            Open Career Dashboard
          </button>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
