const demoPoints = [
  "Free to try during the challenge demo",
  "Built for students, fresh graduates, and early tech talent in Pakistan",
  "No paid plans, subscriptions, or enterprise claims in this submission",
  "Demo-safe fallbacks help voters understand the flow even if an AI API is temporarily unavailable",
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <span className="text-baymax-red font-mono-label text-xs uppercase tracking-widest">Challenge Demo</span>
        <h2 className="font-syne font-extrabold text-3xl md:text-5xl text-foreground mt-3 mb-4">Built for Students, Free to Try</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
          Baymax.app is presented as a Women in AI Accelerator Build Challenge demo: a focused, accessible career coach for Pakistan's early tech talent.
        </p>
        <div className="glass-card rounded-3xl p-8 md:p-10 text-left max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <p className="text-sm font-mono uppercase tracking-widest text-baymax-red mb-2">Student Access</p>
              <h3 className="font-syne font-extrabold text-2xl text-foreground">Challenge demo version</h3>
            </div>
            <div className="text-left md:text-right">
              <p className="font-syne font-extrabold text-4xl text-foreground">Free</p>
              <p className="text-sm text-muted-foreground">for evaluation and testing</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {demoPoints.map((point) => (
              <div key={point} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-muted-foreground">
                <span className="text-baymax-red font-bold mr-2">✓</span>{point}
              </div>
            ))}
          </div>
          <button
            onClick={() => document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" })}
            className="mt-8 w-full md:w-auto bg-baymax-red text-foreground font-syne font-bold px-7 py-3 rounded-lg btn-red-glow transition-all"
          >
            Open Career Dashboard
          </button>
        </div>
      </div>
    </section>
  );
};
export default Pricing;
