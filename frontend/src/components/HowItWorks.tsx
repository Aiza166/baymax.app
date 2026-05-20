const steps = [
  { num: 1, title: "Build Your Resume", desc: "Start with a clean profile or upload an existing PDF." },
  { num: 2, title: "Check ATS Fit", desc: "Compare your resume with the role and reveal missing keywords." },
  { num: 3, title: "Practise Interviews", desc: "Use guided feedback to improve weak areas before applying." },
  { num: 4, title: "Scout Jobs", desc: "Review market-aligned opportunities for Pakistan's early tech talent." },
  { num: 5, title: "Plan the Roadmap", desc: "Use the CSP-inspired planner to sequence learning tasks into a 90-day path." },
];
const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <span className="text-baymax-red font-mono-label text-xs uppercase tracking-widest">How It Works</span>
        <h2 className="font-syne font-extrabold text-3xl md:text-5xl text-foreground mt-3 mb-4">From Resume to Roadmap in Five Steps</h2>
        <p className="text-muted-foreground text-lg mb-16">Baymax.app combines five focused agents with a technical roadmap engine behind the planner.</p>
        <div className="grid md:grid-cols-5 gap-6">
          {steps.map((s, i) => (
            <div key={s.num} className="relative">
              {i < steps.length - 1 && <div className="hidden md:block absolute top-12 left-1/2 w-full h-px bg-gradient-to-r from-baymax-red/40 to-transparent" />}
              <div className="glass-card rounded-2xl p-6 relative z-10 h-full">
                <div className="w-14 h-14 rounded-2xl bg-baymax-red mx-auto mb-5 flex items-center justify-center font-syne font-extrabold text-xl text-white btn-red-glow">{s.num}</div>
                <h3 className="font-syne font-bold text-lg text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default HowItWorks;
