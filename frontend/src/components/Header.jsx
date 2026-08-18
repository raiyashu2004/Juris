export default function Header({ activePage, setIsMobileMenuOpen }) {
  const pageTitles = {
    dashboard: "Juris Masthead",
    chat: "Gavel Draft",
    doc: "Scroll Analysis",
    research: "Ledger Entries",
    cases: "Case Finder",
    draft: "Draft Generator",
    documents: "My Documents",
    templates: "Templates",
    saved: "Archive",
    settings: "Settings",
  };

  return (
    <header className="md:hidden flex justify-between items-center w-full px-margin py-unit h-20 bg-surface border-b-2 border-primary z-30 shrink-0">
      <div className="flex items-center gap-3">
        <button 
          className="text-secondary hover:text-primary transition-colors flex items-center"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
        <img 
          src="/juris_app_icon_dark.png" 
          alt="Juris Logo" 
          className="w-7 h-7 object-contain rounded border border-primary/20"
        />
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold uppercase tracking-tight line-clamp-1">
          {pageTitles[activePage] || "Juris Masthead"}
        </h1>
      </div>
      
      <div className="flex gap-4">
        <button className="text-secondary hover:text-primary transition-colors flex items-center">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </div>
    </header>
  );
}
