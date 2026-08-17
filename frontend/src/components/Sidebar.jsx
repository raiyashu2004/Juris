import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { id: "dashboard", label: "Home", icon: "home" },
  { id: "chat", label: "Gavel", icon: "gavel" },
  { id: "doc", label: "Scroll", icon: "description" },
  { id: "research", label: "Ledger", icon: "menu_book" },
  { id: "saved", label: "Archive", icon: "inventory_2" }
];

export default function Sidebar({ activePage, onNavigate, isMobileMenuOpen, setIsMobileMenuOpen }) {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-primary/20 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <nav className={`${isMobileMenuOpen ? "flex" : "hidden"} md:flex h-full w-64 flex-col border-r-2 border-primary bg-parchment-mid fixed left-0 top-0 z-50 py-8 px-4 transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="mb-12">
          <h1 className="font-headline-lg text-headline-lg text-primary uppercase tracking-tight">Juris</h1>
          <p className="font-label-sm text-label-sm text-secondary mt-1">Legal Research Suite</p>
        </div>
        
        <button 
          className="bg-primary text-on-primary font-body-md text-body-md py-3 px-4 mb-8 flex items-center justify-center gap-2 hover:bg-primary-container transition-colors"
          onClick={() => onNavigate("chat")}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>add</span>
          New Draft
        </button>
        
        <ul className="flex flex-col space-y-4">
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <li key={item.id}>
                <button
                  className={`w-full flex items-center gap-3 py-2 pl-4 transition-colors font-headline-md text-headline-md text-left ${isActive ? "text-primary border-l-2 border-primary italic opacity-90" : "text-secondary hover:bg-parchment-deep border-l-2 border-transparent"}`}
                  onClick={() => onNavigate(item.id)}
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                    {item.icon}
                  </span>
                  <span className="font-label-sm text-label-sm">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
        
        <div className="mt-auto pt-8 border-t border-outline-variant opacity-80 flex items-center justify-between gap-3 group cursor-pointer" onClick={logout} title="Log out">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-primary text-on-primary flex items-center justify-center font-display-lg text-xl flex-shrink-0">
              {user?.fullName?.charAt(0) || "U"}
            </div>
            <div className="overflow-hidden">
              <p className="font-label-sm text-label-sm text-primary truncate w-[130px]">{user?.fullName || "User"}</p>
              <p className="font-label-sm text-[10px] text-secondary group-hover:text-error transition-colors uppercase">Log Out</p>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
