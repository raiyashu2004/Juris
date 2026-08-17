import { useState } from "react";

const FEATURES = [
  { icon: "psychiatry", title: "Smart Legal Research", desc: "Stop scrolling through endless search results. Get direct, plain-English answers backed strictly by Indian case law and bare acts." },
  { icon: "find_in_page", title: "Contract Risk Analysis", desc: "Upload a lease or employment agreement. We'll instantly flag one-sided clauses and missing protections before your client signs." },
  { icon: "manage_search", title: "Precedent Search", desc: "Finding the right ratio decidendi is hard. Just describe your case facts, and we'll pull up the most relevant Supreme Court judgments." },
  { icon: "history_edu", title: "Drafting Assistant", desc: "Drafting an anticipatory bail application? Let us handle the standard formatting and citations so you can focus on the arguments." },
  { icon: "verified_user", title: "Verified Citations Only", desc: "We know fake citations can ruin a case. If we don't have a verified source for a legal claim, we simply won't give it to you." },
  { icon: "menu_book", title: "Built on Bare Acts", desc: "Trained exclusively on the Indian Constitution, major penal codes (IPC/BNS), civil codes, and decades of high court rulings." },
];

const STEPS = [
  { num: "01", title: "Bring your problem", desc: "Upload a messy contract for review, or just type out the facts of a property dispute you're currently handling." },
  { num: "02", title: "We hit the books", desc: "Juris scans through thousands of Indian statutes and precedents in seconds to find what actually applies to your facts." },
  { num: "03", title: "Build your case", desc: "Get actionable insights, highlighted risk clauses, and exactly formatted citations to drop straight into your petition." },
];

const TESTIMONIALS = [
  { name: "Adv. Priya Sharma", role: "Delhi High Court", text: "Manually reviewing a 50-page commercial lease used to eat up my entire weekend. Now I just run it through the analyzer to catch the worst clauses, giving me a massive head start." },
  { name: "Rajesh Iyer", role: "Corporate Counsel, Mumbai", text: "Finding the exact legal precedent for an obscure property dispute is usually a nightmare. This actually understands the context of what I'm looking for and pulls up directly applicable SC judgments." },
  { name: "Adv. Meera Patel", role: "Criminal Defense, Gujarat", text: "I was extremely skeptical about an AI making up fake cases. But the fact that it strictly limits itself to verified bare acts is a huge relief. It saves me hours on initial bail drafts." },
];

const STATS = [
  { value: "100+", label: "Legal Professionals" },
  { value: "10k+", label: "Judgments Indexed" },
  { value: "93.4%", label: "Citation Accuracy" },
  { value: "25", label: "High Courts Covered" },
];

export default function LandingPage({ onNavigate }) {
  return (
    <div className="bg-background text-on-background font-body-md text-body-md antialiased min-h-screen flex flex-col">
      {/* ── Navbar ──────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 h-16 border-b border-outline-variant bg-surface-container-lowest flex justify-between items-center px-lg z-50">
        <div className="flex items-center gap-md">
          <h1 className="font-display-lg text-[24px] text-primary tracking-tight">Juris</h1>
          <span className="font-label-sm text-[10px] text-secondary uppercase tracking-widest border border-outline-variant px-2 py-0.5 hidden md:block">Legal Interface</span>
        </div>
        
        <div className="hidden md:flex items-center gap-xl font-label-sm text-label-sm uppercase tracking-wider text-secondary">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
          <a href="#testimonials" className="hover:text-primary transition-colors">Testimonials</a>
        </div>

        <div className="flex items-center gap-4">
          <button 
            className="font-label-sm text-label-sm text-secondary uppercase tracking-wider hover:text-primary transition-colors" 
            onClick={() => onNavigate("login")}
          >
            Log In
          </button>
          <button 
            className="bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-wider px-4 py-2 border border-primary hover:bg-surface-container-highest hover:text-primary transition-colors flex items-center gap-2"
            onClick={() => onNavigate("register")}
          >
            Get Started <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 mt-16">
        {/* ── Hero ───────────────────────────────────── */}
        <section className="border-b-2 border-primary px-4 md:px-margin pt-16 pb-20 flex flex-col items-center text-center bg-surface relative overflow-hidden">
          {/* Subtle archival watermark / ledger lines */}
          <div className="absolute inset-0 pointer-events-none opacity-40" style={{ backgroundImage: "linear-gradient(#e4e2e3 1px, transparent 1px), linear-gradient(90deg, #e4e2e3 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
          
          <div className="relative z-10 max-w-5xl flex flex-col items-center">
            {/* Masthead Volume Bar */}
            <div className="border-y border-primary/30 py-2 px-6 mb-8 flex items-center gap-4 text-xs font-label-sm text-secondary uppercase tracking-[0.2em]">
              <span className="w-2 h-2 bg-primary"></span>
              <span>GAZETTE ARCHIVE · CITATION ENGINE · NEW DELHI</span>
              <span className="w-2 h-2 bg-primary"></span>
            </div>
            
            {/* Authoritative Editorial Headline */}
            <h1 className="font-display-lg text-[40px] sm:text-[56px] md:text-[72px] leading-[1.05] text-primary tracking-[-0.03em] uppercase mb-6">
              EVERY RATIO DECIDENDI.<br/>
              <span className="font-serif italic font-normal text-secondary lowercase font-headline-lg">without the</span> UNVERIFIED CITATIONS.
            </h1>
            
            <p className="font-body-lg text-[18px] md:text-[21px] text-on-surface-variant max-w-3xl mb-10 leading-relaxed">
              An authoritative research intelligence built for the Indian Bar. Instant clause-by-clause contract analysis, precision precedent lookup, and court-compliant drafting across 50,000+ Supreme Court and High Court judgments.
            </p>
            
            {/* Interactive Research Docket Preview Card */}
            <div className="w-full max-w-3xl bg-parchment-mid border-2 border-primary p-4 sm:p-6 mb-8 text-left shadow-[6px_6px_0px_rgba(4,22,39,0.15)]">
              <div className="flex items-center justify-between border-b border-primary/20 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-primary"></span>
                  <span className="font-label-sm text-xs text-primary font-bold uppercase tracking-widest">RESEARCH DOCKET · QUERY TERMINAL</span>
                </div>
                <span className="font-citation text-xs text-secondary bg-surface px-2 py-0.5 border border-primary/10">INDIAN LAW SCOPE ONLY</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 bg-surface border border-primary/30 p-3.5 flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary text-[20px]">search</span>
                  <input 
                    type="text"
                    readOnly
                    value="Limitation for anticipatory bail under S.438 CrPC vs S.482 BNSS in economic offences..."
                    className="w-full bg-transparent font-body-md text-sm text-primary focus:outline-none cursor-default"
                  />
                </div>
                <button 
                  className="bg-primary text-on-primary font-label-sm text-xs uppercase tracking-widest px-6 py-3.5 border border-primary hover:bg-surface hover:text-primary transition-all shrink-0 flex items-center justify-center gap-2 font-bold"
                  onClick={() => onNavigate("register")}
                >
                  RUN QUERY
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>

              {/* Sample Precedent Tags */}
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-primary/10">
                <span className="font-label-sm text-[11px] text-secondary uppercase tracking-wider mr-1">Active Precedents:</span>
                <span className="font-citation text-xs text-primary bg-surface px-2.5 py-1 border border-primary/20 hover:border-primary transition-colors cursor-pointer" onClick={() => onNavigate("register")}>
                  📜 Art. 21 (Right to Liberty)
                </span>
                <span className="font-citation text-xs text-primary bg-surface px-2.5 py-1 border border-primary/20 hover:border-primary transition-colors cursor-pointer" onClick={() => onNavigate("register")}>
                  ⚖️ Gurbaksh Singh Sibbia (AIR 1980)
                </span>
                <span className="font-citation text-xs text-primary bg-surface px-2.5 py-1 border border-primary/20 hover:border-primary transition-colors cursor-pointer" onClick={() => onNavigate("register")}>
                  📋 Sushila Aggarwal (2020)
                </span>
              </div>
            </div>

            {/* Quick trust metrics line */}
            <div className="flex flex-wrap justify-center items-center gap-6 font-label-sm text-xs text-secondary uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-primary text-[16px]">verified</span> 100% Verified Bare Acts</span>
              <span className="hidden sm:inline text-primary/30">|</span>
              <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-primary text-[16px]">gavel</span> 25 High Courts Indexed</span>
              <span className="hidden sm:inline text-primary/30">|</span>
              <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-primary text-[16px]">security</span> Anti-Hallucination Protocol</span>
            </div>
          </div>
        </section>

        {/* ── Stats Bar ──────────────────────────────── */}
        <section className="border-b border-outline-variant bg-surface-bright divide-y md:divide-y-0 md:divide-x divide-outline-variant flex flex-col md:flex-row">
          {STATS.map((s, i) => (
            <div key={i} className="flex-1 py-8 px-6 flex flex-col items-center text-center">
              <div className="font-headline-lg text-[40px] text-primary mb-2">{s.value}</div>
              <div className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </section>

        {/* ── Features ───────────────────────────────── */}
        <section id="features" className="border-b border-outline-variant bg-surface-container-lowest">
          <div className="px-margin py-20 max-w-[1400px] mx-auto">
            <div className="mb-16 border-l-4 border-primary pl-6">
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">Features</span>
              <h2 className="font-display-lg text-[48px] text-primary mt-2">Everything You Need.</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-4 max-w-2xl">Powerful AI tools designed specifically for Indian legal professionals.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-outline-variant">
              {FEATURES.map((f, i) => (
                <div key={i} className="border-b border-r border-outline-variant p-8 hover:bg-surface-container-low transition-colors group">
                  <span className="material-symbols-outlined text-[32px] text-primary mb-6 group-hover:scale-110 transition-transform">{f.icon}</span>
                  <h3 className="font-headline-md text-[24px] text-primary mb-4">{f.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ───────────────────────────── */}
        <section id="how-it-works" className="border-b border-outline-variant bg-surface-bright">
          <div className="px-margin py-20 max-w-[1400px] mx-auto">
            <div className="mb-16 border-l-4 border-primary pl-6">
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">Workflow</span>
              <h2 className="font-display-lg text-[48px] text-primary mt-2">3 Simple Steps.</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {STEPS.map((s, i) => (
                <div key={i} className="flex flex-col relative">
                  <div className="font-label-sm text-[80px] leading-none text-surface-container-highest font-bold mb-4">{s.num}</div>
                  <h3 className="font-headline-md text-[24px] text-primary mb-4">{s.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ───────────────────────────── */}
        <section id="testimonials" className="border-b border-outline-variant bg-surface-container-lowest">
          <div className="px-margin py-20 max-w-[1400px] mx-auto">
            <div className="mb-16 border-l-4 border-primary pl-6">
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">Testimonials</span>
              <h2 className="font-display-lg text-[48px] text-primary mt-2">Trusted by Professionals.</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="border border-outline-variant p-8 bg-background flex flex-col">
                  <div className="flex gap-1 mb-6 text-primary">
                    <span className="material-symbols-outlined" data-weight="fill">star</span>
                    <span className="material-symbols-outlined" data-weight="fill">star</span>
                    <span className="material-symbols-outlined" data-weight="fill">star</span>
                    <span className="material-symbols-outlined" data-weight="fill">star</span>
                    <span className="material-symbols-outlined" data-weight="fill">star</span>
                  </div>
                  <p className="font-body-lg text-body-lg italic text-on-surface mb-8 flex-1">"{t.text}"</p>
                  <div className="border-t border-outline-variant pt-4">
                    <div className="font-label-sm text-[14px] font-bold text-primary">{t.name}</div>
                    <div className="font-label-sm text-[12px] text-secondary uppercase tracking-wider">{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────── */}
        <section className="bg-primary text-on-primary py-24 text-center px-margin border-b-8 border-secondary">
          <h2 className="font-display-lg text-[56px] mb-6">Start Your Legal Research Today</h2>
          <p className="font-body-lg text-on-primary-container max-w-2xl mx-auto mb-10">Join 100+ legal professionals who trust Juris for accurate, cited legal research.</p>
          <button 
            className="bg-surface-container-lowest text-primary font-label-sm text-[14px] uppercase tracking-wider px-8 py-4 border border-transparent hover:bg-surface-container-high transition-colors inline-flex items-center gap-2"
            onClick={() => onNavigate("register")}
          >
            Create Free Account
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────── */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant py-12 px-margin">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between gap-12">
          <div className="max-w-sm">
            <h1 className="font-display-lg text-[24px] text-primary tracking-tight mb-4">Juris</h1>
            <p className="font-body-md text-secondary">AI-powered legal research assistant for Indian law. Providing verified, cited legal information to advocates, law students, and citizens.</p>
          </div>
          
          <div className="flex gap-16 font-label-sm text-label-sm uppercase tracking-wider">
            <div className="flex flex-col gap-4">
              <span className="text-primary font-bold mb-2">Product</span>
              <a href="#features" className="text-secondary hover:text-primary">Features</a>
              <a href="#how-it-works" className="text-secondary hover:text-primary">Workflow</a>
              <a href="#testimonials" className="text-secondary hover:text-primary">Testimonials</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-primary font-bold mb-2">Legal</span>
              <a href="#" className="text-secondary hover:text-primary">Privacy Policy</a>
              <a href="#" className="text-secondary hover:text-primary">Terms of Service</a>
              <a href="#" className="text-secondary hover:text-primary">Disclaimer</a>
            </div>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto mt-12 pt-8 border-t border-outline-variant text-center md:text-left">
          <p className="font-citation text-citation text-secondary">© 2025 Juris. All rights reserved. Not a substitute for qualified legal advice.</p>
        </div>
      </footer>
    </div>
  );
}
