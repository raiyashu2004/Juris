import { useState, useEffect } from "react";

const PROTOCOL_DOCUMENTS = {
  "citation-accuracy": {
    badge: "PROTOCOL § 101 · CITATION VERIFICATION",
    title: "Official Law Reporter & Citation Accuracy Standard",
    subtitle: "Dual-Stage Judicial Verification Architecture for Supreme Court & High Court Precedents",
    sections: [
      {
        heading: "1. Primary Law Verification Guarantee",
        content: "Every precedent returned by Juris is strictly cross-referenced against authoritative Indian case law repositories including Supreme Court Reports (SCR), Supreme Court Cases (SCC), All India Reporter (AIR), and official High Court e-filing repositories. Volume, case title, judgment date, and coram details are verified before citation generation."
      },
      {
        heading: "2. Zero-Hallucination Policy",
        content: "If an algorithmic search does not produce a verifiable case number, citation, and bench judgment, the system explicitly disclaims rather than generating hallucinated citations. We prioritize practitioner trust above speculative responses."
      },
      {
        heading: "3. Ratio Decidendi Extraction",
        content: "Our vector parsing isolates operative rulings and ratio decidendi from incidental commentary (obiter dicta), giving practitioners courtroom-ready citations with bench strength and overruling history."
      }
    ]
  },
  "bare-acts-scope": {
    badge: "PROTOCOL § 102 · STATUTORY REPOSITORY",
    title: "Bare Acts & Central Legislative Scope",
    subtitle: "Comprehensive Coverage Across 200+ Central Acts, Codes, and State Amendments",
    sections: [
      {
        heading: "1. New Criminal Codes (2023–2024)",
        content: "Full-text statutory index of the Bharatiya Nyaya Sanhita (BNS 2023), Bharatiya Nagarik Suraksha Sanhita (BNSS 2023), and Bharatiya Sakshya Adhiniyam (BSA 2023), complete with cross-walk comparison tables to IPC, CrPC, and IEA."
      },
      {
        heading: "2. Constitutional & Foundational Codes",
        content: "Complete text and judicial interpretation of the Constitution of India, Code of Civil Procedure (CPC 1908), Indian Contract Act 1872, Transfer of Property Act 1882, and Specific Relief Act."
      },
      {
        heading: "3. Corporate & Regulatory Legislation",
        content: "Indexed coverage of the Commercial Courts Act 2015, Arbitration and Conciliation Act 1996, Digital Personal Data Protection (DPDP) Act 2023, Insolvency and Bankruptcy Code (IBC 2016), and Negotiable Instruments Act (Section 138)."
      }
    ]
  },
  "bar-council-ethics": {
    badge: "PROTOCOL § 103 · BAR COUNCIL ETHICS",
    title: "Bar Council of India Ethics & Compliance Standard",
    subtitle: "Strict Conformity with the Advocates Act, 1961 and Bar Council of India Rules",
    sections: [
      {
        heading: "1. Rule 36 Compliance (Non-Solicitation)",
        content: "Juris operates strictly as an internal research and drafting apparatus for enrolled advocates and in-house counsel. The platform does not advertise legal services, solicit clients, or provide direct consumer representation."
      },
      {
        heading: "2. Advocate-Client Privilege (Section 126 / BSA S. 132)",
        content: "Communications, uploaded briefs, and drafted petitions within Juris are treated as privileged work product under statutory professional secrecy standards. No uploaded data is exposed or transferred."
      },
      {
        heading: "3. Augmenting Practitioner Judgment",
        content: "Juris is an augmentative research tool. The final legal interpretation, filing strategy, and court representation remain exclusively the prerogative and responsibility of the practicing advocate."
      }
    ]
  },
  "terms-of-service": {
    badge: "LEGAL § 201 · TERMS OF SERVICE",
    title: "Practitioner Terms of Service & Software License",
    subtitle: "Standard Software License Agreement for Legal Practitioners and Chambers",
    sections: [
      {
        heading: "1. Scope of License",
        content: "Juris grants users a revocable, non-exclusive license to access computational statutory research, document analysis, and drafting acceleration for professional legal preparation."
      },
      {
        heading: "2. Practitioner Responsibility",
        content: "All AI-generated summaries, clause inspections, and draft filings must be independently reviewed and verified by an advocate before submission to any court, tribunal, or arbitration panel."
      },
      {
        heading: "3. Data Sovereignty & Portability",
        content: "Chambers retain 100% intellectual property ownership of uploaded documents and derived briefs. You may export or permanently delete your vault dockets at any time."
      }
    ]
  },
  "privacy-protocol": {
    badge: "LEGAL § 202 · PRIVACY PROTOCOL",
    title: "Privacy Protocol & Vault Security Standard",
    subtitle: "Enterprise-Grade Confidentiality and Fiduciary Data Protection",
    sections: [
      {
        heading: "1. Zero Model Training on Client Briefs",
        content: "We enforce a strict zero-retention policy for machine learning training. Your case briefs, contracts, and confidential party identities are NEVER used to train foundational AI models."
      },
      {
        heading: "2. Cryptographic Security Standards",
        content: "All documents and docket metadata are protected by AES-256 encryption at rest and TLS 1.3 encryption in transit, with dedicated tenant isolation."
      },
      {
        heading: "3. Right to Complete Deletion",
        content: "Deleting a matter from your workspace immediately and permanently destroys all associated vector embeddings and text chunks across our database."
      }
    ]
  },
  "statutory-disclaimer": {
    badge: "LEGAL § 203 · STATUTORY DISCLAIMER",
    title: "Statutory Disclaimer & Limitations",
    subtitle: "Statutory Clarification Under the Advocates Act, 1961",
    sections: [
      {
        heading: "1. Not Formal Legal Counsel",
        content: "Juris is an automated computational intelligence software and does not constitute a law firm or a formal legal opinion under the Advocates Act, 1961. Use of Juris does not establish an attorney-client relationship."
      },
      {
        heading: "2. Independent Judicial Discretion",
        content: "Judicial decisions depend on evolving bench precedents, local court rules, and procedural nuances. Practitioners must exercise independent professional due diligence."
      },
      {
        heading: "3. Limitation of Liability",
        content: "Juris Systems shall not be liable for any court outcome, filing procedural defect, or litigation strategy derived from automated research outputs."
      }
    ]
  }
};

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

const STATS = [
  { value: "100+", label: "Legal Professionals" },
  { value: "10k+", label: "Judgments Indexed" },
  { value: "93.4%", label: "Citation Accuracy" },
  { value: "25", label: "High Courts Covered" },
];

export default function LandingPage({ onNavigate }) {
  const [activeDocKey, setActiveDocKey] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveDocKey(null);
      }
    };
    if (activeDocKey) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [activeDocKey]);

  const activeDoc = activeDocKey ? PROTOCOL_DOCUMENTS[activeDocKey] : null;
  return (
    <div className="bg-background text-on-background font-body-md text-body-md antialiased min-h-screen flex flex-col">
      {/* ── Navbar ──────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 h-16 border-b border-outline-variant bg-surface-container-lowest/95 backdrop-blur-md z-50">
        <div className="max-w-[1400px] h-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 flex justify-between items-center">
          <div 
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img 
              src="/juris_app_icon_dark.png" 
              alt="Juris Logo" 
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-md shadow-sm border border-primary/20 transition-transform group-hover:scale-105"
            />
            <h1 className="font-display-lg text-[24px] sm:text-[26px] text-primary tracking-tight font-bold">Juris</h1>
          </div>
          
          <div className="hidden md:flex items-center gap-8 lg:gap-10 font-label-sm text-xs uppercase tracking-widest text-secondary font-medium">
            <a href="#features" className="hover:text-primary transition-colors py-1">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors py-1">How It Works</a>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              className="font-label-sm text-xs text-secondary uppercase tracking-wider hover:text-primary transition-colors px-2 sm:px-3 py-2 cursor-pointer font-medium" 
              onClick={() => onNavigate("login")}
            >
              Log In
            </button>
            <button 
              className="bg-primary text-on-primary font-label-sm text-xs uppercase tracking-wider px-3.5 sm:px-4 py-2 border border-primary hover:bg-surface-container-highest hover:text-primary transition-all duration-200 flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-sm active:translate-y-px font-medium"
              onClick={() => onNavigate("register")}
            >
              Get Started <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 mt-16">
        {/* ── Gazette Front-Page Masthead Hero ──────────────── */}
        <section className="border-b-2 border-primary bg-surface relative overflow-hidden">
          {/* Top Newspaper Nameplate Header */}
          <div className="border-b-2 border-primary bg-surface py-6 px-4 md:px-margin text-center">
            <div className="max-w-[1400px] mx-auto flex flex-col items-center">
              <div className="font-label-sm text-[11px] text-secondary uppercase tracking-[0.25em] mb-2 flex items-center gap-3">
                <span className="w-6 h-px bg-primary/40"></span>
                <span>AUTHENTIC CITATION ARCHIVE & CASE RESEARCH SYSTEM</span>
                <span className="w-6 h-px bg-primary/40"></span>
              </div>
              <h1 className="font-display-lg text-[36px] sm:text-[54px] md:text-[68px] leading-none text-primary uppercase tracking-[-0.02em] mb-3">
                THE JURIS LEGAL GAZETTE
              </h1>
              <div className="w-full border-t border-b border-primary/30 py-1.5 flex flex-wrap justify-between items-center text-[11px] font-label-sm text-secondary uppercase tracking-widest px-2 gap-2">
                <span>VOL. XXVI · ISSUE NO. 8</span>
                <span className="hidden sm:inline">SUPREME COURT & HIGH COURTS OF INDIA</span>
                <span>NEW DELHI · MON, AUG 18, 2026</span>
                <span className="hidden md:inline">EDITION: PRACTITIONER</span>
              </div>
            </div>
          </div>

          {/* 3-Column Newspaper Grid Layout */}
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* ── Left Column: Statutory Digest (col-span-3) ── */}
            <div className="lg:col-span-3 p-6 bg-parchment-mid border-b-2 lg:border-b-0 lg:border-r-2 border-primary flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b-2 border-primary pb-2 mb-6">
                  <h3 className="font-label-sm text-xs font-bold text-primary uppercase tracking-widest">
                    I. STATUTORY DIGEST
                  </h3>
                  <span className="font-citation text-[10px] text-secondary bg-surface px-1.5 py-0.5 border border-primary/20">LIVE</span>
                </div>

                <div className="space-y-6">
                  <article className="group cursor-pointer" onClick={() => onNavigate("register")}>
                    <div className="font-citation text-[11px] text-secondary mb-1">BNSS § 35 · PROCEDURAL COMPLIANCE</div>
                    <h4 className="font-headline-md text-base text-primary font-bold leading-snug group-hover:underline">
                      Mandatory Electronic Record Verification Guidelines
                    </h4>
                    <p className="font-body-md text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                      Standard operating procedures for digital evidence chain of custody across district magistrate courts.
                    </p>
                  </article>

                  <div className="w-full h-px bg-primary/20"></div>

                  <article className="group cursor-pointer" onClick={() => onNavigate("register")}>
                    <div className="font-citation text-[11px] text-secondary mb-1">DPDP ACT 2023 · DATA REPOSITORIES</div>
                    <h4 className="font-headline-md text-base text-primary font-bold leading-snug group-hover:underline">
                      Fiduciary Standards for Law Vaults
                    </h4>
                    <p className="font-body-md text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                      Statutory encryption compliance thresholds for advocate chambers handling client disclosures.
                    </p>
                  </article>

                  <div className="w-full h-px bg-primary/20"></div>

                  <article className="group cursor-pointer" onClick={() => onNavigate("register")}>
                    <div className="font-citation text-[11px] text-secondary mb-1">COMMERCIAL COURTS ACT · S. 12A</div>
                    <h4 className="font-headline-md text-base text-primary font-bold leading-snug group-hover:underline">
                      Pre-Institution Mediation Mandate
                    </h4>
                    <p className="font-body-md text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                      High Court reaffirmation on mandatory pre-suit mediation in suits not seeking urgent interim relief.
                    </p>
                  </article>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-primary/20 bg-surface p-3 border border-primary/20">
                <div className="font-label-sm text-[10px] text-secondary uppercase tracking-widest mb-1">Statutory Coverage</div>
                <div className="font-label-sm text-xs text-primary font-bold">200+ Central Acts & Codes Indexed</div>
              </div>
            </div>

            {/* ── Center Column: Lead Story & Action Terminal (col-span-6) ── */}
            <div className="lg:col-span-6 p-6 sm:p-8 md:p-10 bg-surface flex flex-col justify-between">
              <div>
                <div className="font-label-sm text-xs text-secondary uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary"></span>
                  <span>LEAD DISPATCH · PRACTITIONER INTELLIGENCE</span>
                </div>

                <h2 className="font-display-lg text-[32px] sm:text-[44px] md:text-[52px] leading-[1.05] text-primary uppercase mb-4 tracking-[-0.02em]">
                  COURT-VERIFIED LEGAL INTELLIGENCE FOR THE INDIAN ADVOCATE.
                </h2>

                <p className="font-headline-md text-[17px] sm:text-[20px] text-secondary italic mb-6 leading-relaxed">
                  “Zero fabricated citations. Decades of Supreme Court ratios, clause-level risk inspection, and court-formatted petitions in seconds.”
                </p>

                {/* 2-Column Newspaper Article Prose */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-body-md text-on-surface-variant leading-relaxed pb-6 border-b border-primary/20">
                  <p>
                    <span className="font-display-lg text-2xl text-primary float-left mr-1.5 leading-none">E</span>ngineered specifically for the Indian courtroom, Juris cross-examines complex factual briefs against 50,000+ judgments and the Constitution with absolute fidelity to Bar Council standards.
                  </p>
                  <p>
                    From urgent anticipatory bail applications under Section 438 CrPC to 60-page commercial lease risk diagnostics, receive immediate ratio decidendi with exact verified volume and page citations.
                  </p>
                </div>
              </div>

              {/* Research Terminal Action Card */}
              <div className="mt-6 bg-parchment-deep border-2 border-primary p-4 sm:p-5 shadow-[4px_4px_0px_rgba(4,22,39,0.12)]">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-label-sm text-[11px] font-bold text-primary uppercase tracking-wider">
                    ENTER LEGAL MATTER / STATUTORY QUERY
                  </span>
                  <span className="font-citation text-[10px] text-secondary">READY</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input 
                    type="text" 
                    readOnly
                    value="Draft anticipatory bail on grounds of parity and lack of custodial interrogation necessity..."
                    className="flex-1 bg-surface border border-primary/40 p-3 font-body-md text-xs text-primary focus:outline-none cursor-default"
                  />
                  <button 
                    className="bg-primary text-on-primary font-label-sm text-xs uppercase tracking-widest px-6 py-3 border border-primary hover:bg-surface hover:text-primary transition-all font-bold shrink-0 flex items-center justify-center gap-2"
                    onClick={() => onNavigate("register")}
                  >
                    RESEARCH DOCKET
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mt-3 pt-2.5 border-t border-primary/15 items-center">
                  <span className="font-label-sm text-[10px] text-secondary uppercase">Quick Docket:</span>
                  <button className="font-citation text-[11px] text-primary bg-surface px-2 py-0.5 border border-primary/20 hover:border-primary" onClick={() => onNavigate("register")}>
                    S.438 Bail Grounds
                  </button>
                  <button className="font-citation text-[11px] text-primary bg-surface px-2 py-0.5 border border-primary/20 hover:border-primary" onClick={() => onNavigate("register")}>
                    Art. 21 Habeas Corpus
                  </button>
                  <button className="font-citation text-[11px] text-primary bg-surface px-2 py-0.5 border border-primary/20 hover:border-primary" onClick={() => onNavigate("register")}>
                    S.138 Cheque Notice
                  </button>
                </div>
              </div>
            </div>

            {/* ── Right Column: Landmark Precedents (col-span-3) ── */}
            <div className="lg:col-span-3 p-6 bg-parchment-mid border-t-2 lg:border-t-0 lg:border-l-2 border-primary flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b-2 border-primary pb-2 mb-6">
                  <h3 className="font-label-sm text-xs font-bold text-primary uppercase tracking-widest">
                    II. LANDMARK PRECEDENTS
                  </h3>
                  <span className="font-citation text-[10px] text-secondary bg-surface px-1.5 py-0.5 border border-primary/20">INDEX</span>
                </div>

                <div className="space-y-6">
                  <article className="group cursor-pointer" onClick={() => onNavigate("register")}>
                    <div className="font-citation text-[11px] text-secondary mb-1">AIR 1973 SC 1461 · 13-JUDGE BENCH</div>
                    <h4 className="font-headline-md text-base text-primary font-bold leading-snug group-hover:underline">
                      Kesavananda Bharati v. State of Kerala
                    </h4>
                    <p className="font-body-md text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                      Established Basic Structure doctrine; parliamentary amendment powers under Art. 368 are not absolute.
                    </p>
                  </article>

                  <div className="w-full h-px bg-primary/20"></div>

                  <article className="group cursor-pointer" onClick={() => onNavigate("register")}>
                    <div className="font-citation text-[11px] text-secondary mb-1">(2017) 10 SCC 1 · 9-JUDGE BENCH</div>
                    <h4 className="font-headline-md text-base text-primary font-bold leading-snug group-hover:underline">
                      K.S. Puttaswamy v. Union of India
                    </h4>
                    <p className="font-body-md text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                      Unanimous recognition of the Right to Privacy as an intrinsic fundamental right under Article 21.
                    </p>
                  </article>

                  <div className="w-full h-px bg-primary/20"></div>

                  <article className="group cursor-pointer" onClick={() => onNavigate("register")}>
                    <div className="font-citation text-[11px] text-secondary mb-1">(2020) 5 SCC 1 · 5-JUDGE BENCH</div>
                    <h4 className="font-headline-md text-base text-primary font-bold leading-snug group-hover:underline">
                      Sushila Aggarwal v. State (NCT of Delhi)
                    </h4>
                    <p className="font-body-md text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                      Anticipatory bail protection should not be invariably limited to a fixed time frame.
                    </p>
                  </article>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-primary/20 bg-surface p-3 border border-primary/20">
                <div className="font-label-sm text-[10px] text-secondary uppercase tracking-widest mb-1">Precedent Database</div>
                <div className="font-label-sm text-xs text-primary font-bold">50,000+ Supreme Court & HC Rulings</div>
              </div>
            </div>

          </div>
        </section>

        {/* ── Stats Ledger Strip ─────────────────────────── */}
        <section className="border-b-2 border-primary bg-parchment-mid divide-y-2 md:divide-y-0 md:divide-x-2 divide-primary flex flex-col md:flex-row">
          {STATS.map((s, i) => (
            <div key={i} className="flex-1 py-8 px-6 flex flex-col items-center text-center">
              <div className="font-display-lg text-[42px] text-primary mb-1">{s.value}</div>
              <div className="font-label-sm text-xs text-secondary uppercase tracking-[0.2em]">{s.label}</div>
            </div>
          ))}
        </section>

        {/* ── Features / Research Apparatus ─────────────────── */}
        <section id="features" className="border-b-2 border-primary bg-surface py-20 px-4 md:px-margin">
          <div className="max-w-[1400px] mx-auto">
            {/* Section Masthead Header */}
            <div className="border-b-2 border-primary pb-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="font-label-sm text-xs text-secondary uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary"></span>
                  <span>SECTION III · RESEARCH APPARATUS</span>
                </div>
                <h2 className="font-display-lg text-[36px] md:text-[48px] text-primary uppercase">
                  Institutional Apparatus for the Bar
                </h2>
              </div>
              <p className="font-body-md text-sm text-secondary max-w-md">
                Six dedicated research modules built specifically for Supreme Court, High Court, and Tribunal practice.
              </p>
            </div>
            
            {/* Gazette Columnar Feature Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t-2 border-l-2 border-primary">
              {FEATURES.map((f, i) => (
                <div key={i} className="border-b-2 border-r-2 border-primary p-8 bg-surface hover:bg-parchment-mid transition-colors group flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="material-symbols-outlined text-[32px] text-primary group-hover:scale-105 transition-transform">{f.icon}</span>
                      <span className="font-citation text-xs text-secondary">§ 0{i + 1}</span>
                    </div>
                    <h3 className="font-headline-md text-xl text-primary font-bold mb-3">{f.title}</h3>
                    <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">{f.desc}</p>
                  </div>
                  <div 
                    className="mt-8 pt-4 border-t border-primary/20 flex justify-between items-center text-xs font-label-sm text-secondary uppercase tracking-wider group-hover:text-primary cursor-pointer"
                    onClick={() => setActiveDocKey("citation-accuracy")}
                  >
                    <span>Verified Protocol</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Workflow / Court Procedure ─────────────────────── */}
        <section id="how-it-works" className="border-b-2 border-primary bg-parchment-mid py-20 px-4 md:px-margin">
          <div className="max-w-[1400px] mx-auto">
            <div className="border-b-2 border-primary pb-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="font-label-sm text-xs text-secondary uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary"></span>
                  <span>SECTION IV · PROCEDURAL SEQUENCE</span>
                </div>
                <h2 className="font-display-lg text-[36px] md:text-[48px] text-primary uppercase">
                  3-Stage Research Protocol
                </h2>
              </div>
              <p className="font-body-md text-sm text-secondary max-w-md">
                From factual submission to verified petition-ready ratios and citations.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-primary bg-surface divide-y-2 md:divide-y-0 md:divide-x-2 divide-primary">
              {STEPS.map((s, i) => (
                <div key={i} className="p-8 md:p-10 flex flex-col justify-between hover:bg-parchment-deep transition-colors">
                  <div>
                    <div className="flex items-center justify-between border-b border-primary/20 pb-4 mb-6">
                      <span className="font-label-sm text-xs font-bold text-primary uppercase tracking-widest">
                        STAGE {s.num}
                      </span>
                      <span className="font-citation text-xs text-secondary">PHASE {i + 1}</span>
                    </div>
                    <h3 className="font-headline-md text-2xl text-primary font-bold mb-4">{s.title}</h3>
                    <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">{s.desc}</p>
                  </div>
                  <div className="mt-12 font-citation text-xs text-secondary flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary"></span>
                    <span>Automated Precedent Alignment</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ── Institutional Enrolment CTA ────────────────────── */}
        <section className="bg-primary text-on-primary py-20 px-4 md:px-margin text-center relative overflow-hidden border-b-2 border-primary">
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="font-label-sm text-xs text-on-primary-container uppercase tracking-[0.25em] mb-4">
              ENROLMENT OPEN · ADVOCATES & RESEARCHERS
            </div>
            <h2 className="font-display-lg text-[38px] sm:text-[52px] md:text-[60px] leading-tight mb-6 uppercase">
              Begin Your Legal Research Docket Today
            </h2>
            <p className="font-body-lg text-base md:text-lg text-on-primary-container max-w-2xl mx-auto mb-10 leading-relaxed">
              Gain immediate access to verified bare acts, ratio decidendi extraction, and precision contract risk analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="bg-surface text-primary font-label-sm text-xs uppercase tracking-widest px-8 py-4 border-2 border-surface hover:bg-primary hover:text-on-primary transition-colors font-bold flex items-center justify-center gap-2"
                onClick={() => onNavigate("register")}
              >
                CREATE PRACTITIONER ACCOUNT
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
              <button 
                className="bg-transparent text-on-primary font-label-sm text-xs uppercase tracking-widest px-8 py-4 border-2 border-on-primary hover:bg-surface hover:text-primary transition-colors font-bold"
                onClick={() => onNavigate("login")}
              >
                COUNSEL SIGN IN
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ── Gazette Colophon Footer ──────────────────────────── */}
      <footer className="bg-surface border-t-2 border-primary py-12 px-4 md:px-margin">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between gap-12">
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-3">
              <img 
                src="/juris_app_icon_dark.png" 
                alt="Juris Logo" 
                className="w-8 h-8 object-contain rounded-md border border-primary/30"
              />
              <h2 className="font-display-lg text-[24px] sm:text-[26px] text-primary uppercase tracking-tight">
                THE JURIS LEGAL GAZETTE
              </h2>
            </div>
            <p className="font-body-md text-xs text-secondary leading-relaxed mb-4">
              An authoritative computational legal research system for Indian jurisprudence. Built strictly on verified Supreme Court judgments, High Court precedents, and Central bare acts.
            </p>
            <div className="font-label-sm text-[11px] text-primary font-bold uppercase tracking-wider">
              NEW DELHI · MUMBAI · BENGALURU
            </div>
          </div>
          
          <div className="flex flex-wrap gap-12 font-label-sm text-xs uppercase tracking-wider">
            <div className="flex flex-col gap-3">
              <span className="text-primary font-bold border-b border-primary/30 pb-1 mb-1">Sections</span>
              <a href="#features" className="text-secondary hover:text-primary transition-colors">Apparatus (§ III)</a>
              <a href="#how-it-works" className="text-secondary hover:text-primary transition-colors">Sequence (§ IV)</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-primary font-bold border-b border-primary/30 pb-1 mb-1">Protocols</span>
              <button 
                type="button" 
                onClick={() => setActiveDocKey("citation-accuracy")} 
                className="text-left text-secondary hover:text-primary hover:underline transition-all cursor-pointer"
              >
                Citation Accuracy
              </button>
              <button 
                type="button" 
                onClick={() => setActiveDocKey("bare-acts-scope")} 
                className="text-left text-secondary hover:text-primary hover:underline transition-all cursor-pointer"
              >
                Bare Acts Scope
              </button>
              <button 
                type="button" 
                onClick={() => setActiveDocKey("bar-council-ethics")} 
                className="text-left text-secondary hover:text-primary hover:underline transition-all cursor-pointer"
              >
                Bar Council Ethics
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-primary font-bold border-b border-primary/30 pb-1 mb-1">Legal</span>
              <button 
                type="button" 
                onClick={() => setActiveDocKey("terms-of-service")} 
                className="text-left text-secondary hover:text-primary hover:underline transition-all cursor-pointer"
              >
                Terms of Service
              </button>
              <button 
                type="button" 
                onClick={() => setActiveDocKey("privacy-protocol")} 
                className="text-left text-secondary hover:text-primary hover:underline transition-all cursor-pointer"
              >
                Privacy Protocol
              </button>
              <button 
                type="button" 
                onClick={() => setActiveDocKey("statutory-disclaimer")} 
                className="text-left text-secondary hover:text-primary hover:underline transition-all cursor-pointer"
              >
                Statutory Disclaimer
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto mt-12 pt-6 border-t border-primary/20 flex flex-col sm:flex-row justify-between items-center text-xs font-citation text-secondary gap-4">
          <p>© 2026 Juris Legal Systems. All rights reserved.</p>
          <p className="text-[11px]">DISCLAIMER: Juris is a legal intelligence tool and does not constitute formal legal counsel under the Advocates Act, 1961.</p>
        </div>
      </footer>

      {/* ── Gazette Protocol & Legal Modal Dialog ───────────────── */}
      {activeDoc && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-primary/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveDocKey(null)}
        >
          <div 
            className="bg-surface border-2 border-primary max-w-2xl w-full max-h-[85vh] flex flex-col shadow-[8px_8px_0px_rgba(4,22,39,0.35)] relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Gazette Masthead Header */}
            <div className="border-b-2 border-primary bg-parchment-deep p-5 flex items-start justify-between gap-4">
              <div>
                <div className="font-citation text-[11px] font-bold text-secondary uppercase tracking-wider mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary"></span>
                  <span>{activeDoc.badge}</span>
                </div>
                <h3 className="font-display-lg text-2xl sm:text-3xl text-primary uppercase font-bold leading-tight">
                  {activeDoc.title}
                </h3>
                <p className="font-body-md text-xs text-on-surface-variant italic mt-1">
                  {activeDoc.subtitle}
                </p>
              </div>

              <button 
                type="button"
                onClick={() => setActiveDocKey(null)}
                className="p-1.5 border border-primary/40 bg-surface hover:bg-primary hover:text-on-primary text-primary transition-colors cursor-pointer shrink-0"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined text-[20px] block">close</span>
              </button>
            </div>

            {/* Modal Document Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-surface">
              {activeDoc.sections.map((sec, idx) => (
                <div key={idx} className="border-b border-primary/15 pb-4 last:border-b-0 last:pb-0">
                  <h4 className="font-headline-md text-base text-primary font-bold mb-2">
                    {sec.heading}
                  </h4>
                  <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    {sec.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Modal Footer Controls */}
            <div className="border-t-2 border-primary bg-parchment-mid p-4 px-6 flex flex-wrap items-center justify-between gap-3">
              <div className="font-citation text-[11px] text-secondary">
                AUTHENTICATED DISPATCH · JURIS GAZZETTE
              </div>
              <div className="flex items-center gap-3">
                <button 
                  type="button"
                  onClick={() => setActiveDocKey(null)}
                  className="font-label-sm text-xs uppercase tracking-wider px-4 py-2 border border-primary/40 hover:bg-surface text-primary transition-colors cursor-pointer font-bold"
                >
                  DISMISS
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setActiveDocKey(null);
                    onNavigate("register");
                  }}
                  className="bg-primary text-on-primary font-label-sm text-xs uppercase tracking-wider px-4 py-2 border border-primary hover:bg-surface hover:text-primary transition-colors cursor-pointer font-bold flex items-center gap-1.5"
                >
                  ENROL NOW
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
