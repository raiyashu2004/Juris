export default function LegalResearch() {
  return (
    <div className="flex-1 flex h-full overflow-hidden w-full relative">
      {/* Library Panel */}
      <aside className="w-80 border-r border-primary/20 bg-parchment-mid flex flex-col hidden lg:flex h-full shrink-0">
        <div className="p-margin border-b border-primary/20">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[18px]">search</span>
            <input 
              className="w-full bg-parchment-deep border border-primary text-primary font-label-sm text-label-sm py-2 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-secondary/60 uppercase" 
              placeholder="SEARCH LIBRARY..." 
              type="text" 
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          <div>
            <h3 className="font-label-sm text-label-sm text-primary mb-3 px-2 border-b-2 border-primary pb-1 uppercase tracking-widest">Primary Sources</h3>
            <ul className="space-y-1">
              <li>
                <a className="block px-2 py-2 bg-parchment-deep border-l-2 border-primary text-primary font-body-md text-body-md hover:bg-parchment-deep transition-colors flex justify-between items-center group" href="#">
                  <span>Constitution of India</span>
                  <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
                </a>
              </li>
              <li>
                <a className="block px-2 py-2 text-secondary hover:text-primary hover:bg-parchment-deep/50 font-body-md text-body-md transition-colors border-b border-primary/10" href="#">
                  Central Acts
                </a>
              </li>
              <li>
                <a className="block px-2 py-2 text-secondary hover:text-primary hover:bg-parchment-deep/50 font-body-md text-body-md transition-colors border-b border-primary/10" href="#">
                  Rules & Regulations
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-label-sm text-label-sm text-primary mb-3 px-2 border-b-2 border-primary pb-1 uppercase tracking-widest">Jurisprudence</h3>
            <ul className="space-y-1">
              <li>
                <a className="block px-2 py-2 text-secondary hover:text-primary hover:bg-parchment-deep/50 font-body-md text-body-md transition-colors border-b border-primary/10" href="#">
                  Supreme Court Judgments
                </a>
              </li>
              <li>
                <a className="block px-2 py-2 text-secondary hover:text-primary hover:bg-parchment-deep/50 font-body-md text-body-md transition-colors border-b border-primary/10" href="#">
                  High Court Precedents
                </a>
              </li>
              <li>
                <a className="block px-2 py-2 text-secondary hover:text-primary hover:bg-parchment-deep/50 font-body-md text-body-md transition-colors border-b border-primary/10" href="#">
                  Tribunal Orders
                </a>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      {/* Document View */}
      <section className="flex-1 overflow-y-auto bg-surface relative flex justify-center pb-24 custom-scrollbar">
        <div className="w-full">
          {/* Document Toolbar */}
          <div className="sticky top-0 w-full bg-surface/95 backdrop-blur-sm border-b border-primary/20 py-3 px-margin flex justify-between items-center z-10">
            <div className="flex items-center gap-4">
              <span className="font-label-sm text-label-sm text-secondary bg-status-reviewed text-primary px-2 py-1 border border-primary/20 uppercase tracking-widest">Verified Text</span>
              <span className="font-citation text-citation text-secondary">Updated: Jan 2024</span>
            </div>
            <div className="flex items-center gap-3">
              <button aria-label="Bookmark" className="p-2 text-secondary hover:text-primary transition-colors border border-transparent hover:border-primary/20 bg-parchment-mid">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>bookmark</span>
              </button>
              <button aria-label="Share" className="p-2 text-secondary hover:text-primary transition-colors border border-transparent hover:border-primary/20 bg-parchment-mid">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>share</span>
              </button>
              <button aria-label="Print" className="p-2 text-secondary hover:text-primary transition-colors border border-transparent hover:border-primary/20 bg-parchment-mid">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>print</span>
              </button>
            </div>
          </div>
          
          {/* Document Content */}
          <article className="w-full max-w-[720px] mx-auto px-margin py-12">
            <header className="mb-12 text-center border-b-2 border-primary pb-8">
              <h2 className="font-display-lg text-display-lg text-primary mb-4 uppercase">The Constitution of India</h2>
              <p className="font-headline-md text-headline-md text-secondary italic">Part III</p>
              <p className="font-label-sm text-label-sm text-primary mt-6 tracking-[0.2em] uppercase">Fundamental Rights</p>
            </header>
            
            <div className="space-y-12">
              {/* Article Block */}
              <section className="relative group">
                <div className="absolute -left-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                  <button className="text-secondary hover:text-primary bg-parchment-mid border border-primary/20 p-1" title="Add Note">
                    <span className="material-symbols-outlined text-[16px]">edit_note</span>
                  </button>
                  <button className="text-secondary hover:text-primary bg-parchment-mid border border-primary/20 p-1" title="View Citations">
                    <span className="material-symbols-outlined text-[16px]">format_quote</span>
                  </button>
                </div>
                <h3 className="font-headline-md text-headline-md text-primary mb-4 flex items-baseline gap-4">
                  <span className="font-label-sm text-label-sm text-secondary">12.</span>
                  Definition.
                </h3>
                <div className="font-body-lg text-body-lg text-on-surface leading-relaxed pl-8 border-l border-primary/10">
                  <p>In this Part, unless the context otherwise requires, "the State" includes the Government and Parliament of India and the Government and the Legislature of each of the States and all local or other authorities within the territory of India or under the control of the Government of India.</p>
                </div>
              </section>

              <div className="w-full h-px bg-primary/10"></div>

              {/* Article Block */}
              <section className="relative group">
                <div className="absolute -left-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                  <button className="text-secondary hover:text-primary bg-parchment-mid border border-primary/20 p-1" title="Add Note">
                    <span className="material-symbols-outlined text-[16px]">edit_note</span>
                  </button>
                  <button className="text-secondary hover:text-primary bg-parchment-mid border border-primary/20 p-1" title="View Citations">
                    <span className="material-symbols-outlined text-[16px]">format_quote</span>
                  </button>
                </div>
                <h3 className="font-headline-md text-headline-md text-primary mb-4 flex items-baseline gap-4">
                  <span className="font-label-sm text-label-sm text-secondary">13.</span>
                  Laws inconsistent with or in derogation of the fundamental rights.
                </h3>
                <div className="font-body-lg text-body-lg text-on-surface leading-relaxed pl-8 border-l border-primary/10 space-y-4">
                  <p>(1) All laws in force in the territory of India immediately before the commencement of this Constitution, in so far as they are inconsistent with the provisions of this Part, shall, to the extent of such inconsistency, be void.</p>
                  <p>(2) The State shall not make any law which takes away or abridges the rights conferred by this Part and any law made in contravention of this clause shall, to the extent of the contravention, be void.</p>
                  
                  <div className="mt-6 bg-parchment-mid p-4 border border-primary/20">
                    <h4 className="font-label-sm text-label-sm text-primary uppercase mb-2">Key Precedent</h4>
                    <p className="font-citation text-citation text-secondary">
                      <a className="underline hover:text-primary transition-colors" href="#">Kesavananda Bharati v. State of Kerala (1973) 4 SCC 225</a> - Established the Basic Structure Doctrine, limiting the amending power under Art. 368.
                    </p>
                  </div>
                </div>
              </section>

              <div className="w-full h-px bg-primary/10"></div>

              {/* Article Block */}
              <section className="relative group">
                <div className="absolute -left-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                  <button className="text-secondary hover:text-primary bg-parchment-mid border border-primary/20 p-1" title="Add Note">
                    <span className="material-symbols-outlined text-[16px]">edit_note</span>
                  </button>
                  <button className="text-secondary hover:text-primary bg-parchment-mid border border-primary/20 p-1" title="View Citations">
                    <span className="material-symbols-outlined text-[16px]">format_quote</span>
                  </button>
                </div>
                <div className="mb-4">
                  <h4 className="font-label-sm text-label-sm text-primary mt-6 tracking-[0.2em] uppercase mb-4 text-center border-y border-primary/10 py-2">Right to Equality</h4>
                </div>
                <h3 className="font-headline-md text-headline-md text-primary mb-4 flex items-baseline gap-4">
                  <span className="font-label-sm text-label-sm text-secondary">14.</span>
                  Equality before law.
                </h3>
                <div className="font-body-lg text-body-lg text-on-surface leading-relaxed pl-8 border-l border-primary/10">
                  <p>The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.</p>
                </div>
              </section>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
