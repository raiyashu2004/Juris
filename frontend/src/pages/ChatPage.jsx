import { useState, useRef, useEffect } from "react";

const RECENT_INQUIRIES = [
  { group: "Today", items: [
    { title: "Contract Breach Damages", tag: "Civil", tagColor: "primary", desc: "NY jurisdiction limitations" },
    { title: "Habeas Corpus Precedents", tag: "Criminal", tagColor: "error", desc: "Federal appeals 2020-2023" }
  ]},
  { group: "Yesterday", items: [
    { title: "Equitable Distribution Assets", tag: "Family", tagColor: "tertiary-container", desc: "Hidden offshore accounts" },
    { title: "Summary Judgment Standards", tag: "Civil", tagColor: "primary", desc: "Rule 56 Federal" }
  ]}
];

export default function ChatPage() {
  const [query, setQuery] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
      if (query === "") textareaRef.current.style.height = "56px";
    }
  }, [query]);

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full w-full relative">
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative h-full">
        {/* Domain Selector Tab Row */}
        <div className="border-b border-outline-variant/30 bg-surface/80 backdrop-blur-sm shrink-0">
          <div className="max-w-[720px] mx-auto w-full px-margin md:px-0">
            <div className="flex gap-8 pt-6">
              <button className="pb-4 font-label-sm text-label-sm uppercase tracking-widest text-secondary hover:text-primary transition-colors border-b-2 border-transparent">
                  Criminal
              </button>
              <button className="pb-4 font-label-sm text-label-sm uppercase tracking-widest text-primary border-b-2 border-primary font-bold">
                  Civil
              </button>
              <button className="pb-4 font-label-sm text-label-sm uppercase tracking-widest text-secondary hover:text-primary transition-colors border-b-2 border-transparent">
                  Family
              </button>
            </div>
          </div>
        </div>

        {/* Chat / Research Messages */}
        <div className="flex-1 overflow-y-auto w-full scroll-smooth pb-48 custom-scrollbar">
          <div className="max-w-[720px] mx-auto w-full px-margin md:px-0 py-8 flex flex-col gap-8">
            {/* Intro / Context */}
            <div className="text-center mb-4">
              <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Civil Litigation Assistant</h2>
              <p className="font-body-md text-body-md text-secondary">Query precedents, statutes, and procedural rules.</p>
            </div>

            {/* User Message */}
            <div className="flex justify-end w-full">
              <div className="max-w-[85%] bg-parchment-deep border border-outline-variant/30 p-6 shadow-sm">
                <p className="font-body-lg text-body-lg text-primary">
                  What are the primary defenses against a claim of tortious interference with a business contract under New York state law?
                </p>
              </div>
            </div>

            {/* AI Response */}
            <div className="flex justify-start w-full">
              <div className="max-w-[100%] bg-surface border border-primary/10 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-outline-variant/20">
                  <span className="material-symbols-outlined text-primary text-[24px]">gavel</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">Juris AI Analysis</span>
                </div>
                <div className="space-y-6">
                  <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                    Under New York law, a claim for tortious interference with a contract requires the existence of a valid contract between the plaintiff and a third party, the defendant's knowledge of that contract, the defendant's intentional procurement of the third-party's breach of the contract without justification, an actual breach of the contract, and damages resulting therefrom.
                  </p>
                  <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                    The primary defenses commonly raised against such claims include:
                  </p>
                  
                  <ul className="list-none space-y-4 pl-0">
                    <li className="flex gap-4 border-l border-primary/20 pl-4">
                      <div className="flex-1">
                        <strong className="block font-headline-md text-headline-md text-primary text-lg mb-1">1. Economic Justification</strong>
                        <p className="font-body-md text-body-md text-secondary">A defendant may argue they acted to protect their own existing economic interest. This defense is often successful unless the plaintiff can prove malice or illegality.</p>
                        <div className="mt-2 flex gap-2">
                          <a href="#" className="inline-flex items-center gap-1 font-citation text-citation text-primary hover:bg-parchment-mid px-2 py-1 border border-primary/20 transition-colors">
                            <span className="material-symbols-outlined text-[14px]">menu_book</span>
                            Foster v. Churchill, 87 N.Y.2d 744 (1996)
                          </a>
                        </div>
                      </div>
                    </li>
                    <li className="flex gap-4 border-l border-primary/20 pl-4">
                      <div className="flex-1">
                        <strong className="block font-headline-md text-headline-md text-primary text-lg mb-1">2. Lack of Valid Contract</strong>
                        <p className="font-body-md text-body-md text-secondary">If the underlying contract is voidable, terminable at will, or otherwise unenforceable, the claim for tortious interference generally fails.</p>
                        <div className="mt-2 flex gap-2">
                          <a href="#" className="inline-flex items-center gap-1 font-citation text-citation text-primary hover:bg-parchment-mid px-2 py-1 border border-primary/20 transition-colors">
                            <span className="material-symbols-outlined text-[14px]">menu_book</span>
                            NBT Bancorp Inc. v. Fleet/Norstar Fin. Grp., Inc., 87 N.Y.2d 614 (1996)
                          </a>
                        </div>
                      </div>
                    </li>
                  </ul>

                  <div className="pt-4 border-t border-outline-variant/20 mt-6 bg-parchment-mid p-4 border border-primary/10">
                    <span className="block font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-2">Statutory Reference</span>
                    <p className="font-citation text-citation text-primary bg-surface inline-block px-3 py-1 border border-primary/20 shadow-[2px_2px_0px_rgba(4,22,39,0.1)]">
                      NY CPLR § 214(4) - Statute of Limitations (3 Years)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tactile Search Input Area */}
        <div className="absolute bottom-0 left-0 w-full bg-surface border-t-2 border-primary pt-4 pb-8 px-margin z-30 shadow-[0_-10px_40px_rgba(253,252,251,0.9)]">
          <div className="max-w-[720px] mx-auto w-full relative">
            <form className="flex items-end gap-4" onSubmit={(e) => e.preventDefault()}>
              <div className="flex-1 relative group">
                <label htmlFor="research-query" className="absolute -top-3 left-4 bg-surface px-1 font-label-sm text-label-sm uppercase tracking-widest text-primary z-10">
                  Legal Query
                </label>
                <textarea 
                  id="research-query"
                  ref={textareaRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-parchment-mid border border-primary focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md text-primary p-4 resize-none transition-shadow group-hover:bg-parchment-deep shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] rounded-none custom-scrollbar" 
                  placeholder="Enter specific legal question or citation..." 
                  rows={1} 
                  style={{ minHeight: '56px', maxHeight: '160px' }}
                />
              </div>
              <button type="submit" className="h-[56px] px-6 bg-primary text-on-primary border border-primary hover:bg-surface hover:text-primary transition-colors flex items-center justify-center font-label-sm text-label-sm uppercase tracking-widest shrink-0">
                <span className="material-symbols-outlined mr-2">search</span>
                Search
              </button>
            </form>
            <div className="mt-2 flex justify-between items-center px-1">
              <span className="font-citation text-citation text-secondary text-xs">Press Enter to send, Shift+Enter for new line</span>
              <div className="flex gap-4">
                <button className="text-secondary hover:text-primary transition-colors" title="Attach Document"><span className="material-symbols-outlined text-[18px]">attach_file</span></button>
                <button className="text-secondary hover:text-primary transition-colors" title="Advanced Search"><span className="material-symbols-outlined text-[18px]">tune</span></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Recent History (Hidden on mobile) */}
      <aside className="hidden lg:flex w-72 border-l border-outline-variant/30 bg-surface flex-col shrink-0 overflow-y-auto custom-scrollbar">
        <div className="p-6 border-b border-outline-variant/30 sticky top-0 bg-surface z-10">
          <h3 className="font-headline-md text-headline-md text-primary text-xl">Recent Inquiries</h3>
        </div>
        <div className="flex-1 p-4 space-y-4">
          {RECENT_INQUIRIES.map((group, i) => (
            <div key={i} className="mt-2 first:mt-0">
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest text-xs mb-1 block">
                {group.group}
              </span>
              {group.items.map((item, j) => (
                <div key={j} className="group cursor-pointer mb-2 last:mb-0">
                  <div className="border border-transparent group-hover:border-primary/20 p-3 hover:bg-parchment-mid transition-all">
                    <h4 className="font-headline-md text-headline-md text-primary text-base leading-tight mb-2">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 bg-${item.tagColor}/5 border border-${item.tagColor}/20 font-citation text-citation text-xs text-${item.tagColor}`}>
                        {item.tag}
                      </span>
                      <span className="font-body-md text-body-md text-secondary text-xs truncate">
                        {item.desc}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-outline-variant/30 mt-auto">
          <button className="w-full text-center font-label-sm text-label-sm text-secondary hover:text-primary transition-colors underline decoration-1 underline-offset-4">
            View Complete Archive
          </button>
        </div>
      </aside>
      
    </div>
  );
}
