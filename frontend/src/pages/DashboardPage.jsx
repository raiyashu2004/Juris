import { useAuth } from "../context/AuthContext";

const STATS = [
  { label: "Articles", value: "448" },
  { label: "SC Judgments", value: "50k+" },
  { label: "Central Acts", value: "200+" },
  { label: "High Courts", value: "25" },
];

const ACTIONS = [
  { id: "chat", label: "Chat with JurisAI" },
  { id: "doc", label: "Document Analyzer" },
  { id: "research", label: "Legal Research" },
  { id: "cases", label: "Case Finder" },
  { id: "draft", label: "Draft Generator" },
];

export default function DashboardPage({ onNavigate }) {
  const { user } = useAuth();

  return (
    <div className="w-full">
      {/* Ledger Stat Strip */}
      <section className="mb-16 border-t-2 border-b-2 border-primary py-8 flex flex-wrap justify-between items-center gap-8">
        {STATS.map((stat, i) => (
          <div key={i} className="flex flex-col items-center flex-1 min-w-[120px]">
            <span className="font-display-lg text-display-lg text-primary mb-2">{stat.value}</span>
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest border-t border-primary pt-2 w-full text-center">
              {stat.label}
            </span>
          </div>
        ))}
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="font-headline-md text-headline-md text-primary mb-6">Quick Actions</h2>
        <ul className="flex flex-col border-t border-primary">
          {ACTIONS.map((action) => (
            <li 
              key={action.id}
              className="border-b border-outline-variant py-4 flex items-center justify-between hover:bg-parchment-mid transition-colors cursor-pointer group px-2"
              onClick={() => onNavigate(action.id)}
            >
              <span className="font-body-lg text-body-lg text-on-surface group-hover:text-primary transition-colors">
                {action.label}
              </span>
              <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors">
                arrow_forward
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
