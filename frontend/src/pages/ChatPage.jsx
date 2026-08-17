import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { callGemini, extractCitations, LEGAL_SYSTEM, QUICK_QS, DOMAINS } from "../utils";

function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
    </span>
  );
}

function CitationPill({ label, type }) {
  const icons = { constitution: "📜", judgment: "⚖️", statute: "📋" };
  return (
    <a href="#" className="inline-flex items-center gap-1 font-citation text-citation text-primary hover:bg-parchment-mid px-2 py-1 border border-primary/20 transition-colors">
      <span className="text-[14px]">{icons[type] || "📌"}</span>
      {label}
    </a>
  );
}

const defaultMsgs = [{
  role: "ai",
  text: "Namaskar. I am JurisAI — your professional AI legal assistant for Indian law.\n\nI provide research assistance on Constitutional, Criminal, Civil, Family, Property, and Labour law with precise citations from the Constitution and Supreme Court and High Court judgments.\n\nPlease state your legal query below.",
  done: true
}];

export default function ChatPage() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [msgs, setMsgs] = useState(defaultMsgs);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [domain, setDomain] = useState("All");
  const bot = useRef(null);
  const textareaRef = useRef(null);

  // Load sessions from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("chat_sessions");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSessions(parsed);
        if (parsed.length > 0) {
          setActiveSessionId(parsed[0].id);
          setMsgs(parsed[0].msgs || defaultMsgs);
        } else {
          startNewChat();
        }
      } catch (e) {
        startNewChat();
      }
    } else {
      startNewChat();
    }
  }, []);

  // Save active session whenever msgs change
  useEffect(() => {
    if (!activeSessionId || msgs === defaultMsgs && sessions.length === 0) return;
    setSessions(prev => {
      const updated = prev.map(s => s.id === activeSessionId ? { ...s, msgs } : s);
      localStorage.setItem("chat_sessions", JSON.stringify(updated));
      return updated;
    });
  }, [msgs, activeSessionId]);

  useEffect(() => {
    bot.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
      if (input === "") textareaRef.current.style.height = "56px";
    }
  }, [input]);

  const startNewChat = () => {
    const newId = crypto.randomUUID();
    const initSession = { id: newId, title: "New Chat", msgs: defaultMsgs, timestamp: Date.now() };
    setSessions(prev => [initSession, ...prev]);
    setActiveSessionId(newId);
    setMsgs(defaultMsgs);
    setDomain("All");
  };

  const loadSession = (id) => {
    const session = sessions.find(s => s.id === id);
    if (session) {
      setActiveSessionId(id);
      setMsgs(session.msgs || defaultMsgs);
      setDomain("All");
    }
  };

  const send = async (q) => {
    const txt = (q || input).trim();
    if (!txt || busy) return;
    setInput("");
    
    if (msgs.length <= 1) {
      setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, title: txt.slice(0, 30) + (txt.length > 30 ? "..." : "") } : s));
    }

    const history = msgs.slice(1).map(m => ({ role: m.role, text: m.text }));
    setMsgs(p => [...p, { role: "user", text: txt }, { role: "ai", text: "", done: false }]);
    setBusy(true);
    
    try {
      const ctx = domain !== "All" ? `\n[Domain: ${domain} law]` : "";
      await callGemini(LEGAL_SYSTEM, txt + ctx, s => {
        setMsgs(p => { const c = [...p]; c[c.length - 1] = { ...c[c.length - 1], text: s }; return c; });
      }, history);
      setMsgs(p => { const c = [...p]; c[c.length - 1] = { ...c[c.length - 1], done: true }; return c; });
    } catch (e) {
      setMsgs(p => { const c = [...p]; c[c.length - 1] = { ...c[c.length - 1], text: "Error: " + e.message, done: true }; return c; });
    }
    setBusy(false);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full w-full relative overflow-hidden">
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative h-full min-w-0 overflow-hidden">
        {/* Domain Selector Tab Row */}
        <div className="border-b border-outline-variant/30 bg-surface/80 backdrop-blur-sm shrink-0">
          <div className="max-w-[720px] mx-auto w-full px-margin md:px-0">
            <div className="flex gap-4 md:gap-8 pt-6 overflow-x-auto custom-scrollbar">
              {DOMAINS.map(d => (
                <button 
                  key={d}
                  className={`pb-4 font-label-sm text-label-sm uppercase tracking-widest whitespace-nowrap transition-colors border-b-2 ${domain === d ? "text-primary border-primary font-bold" : "text-secondary hover:text-primary border-transparent"}`}
                  onClick={() => setDomain(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto w-full scroll-smooth pb-48 custom-scrollbar">
          <div className="max-w-[720px] mx-auto w-full px-margin md:px-0 py-8 flex flex-col gap-6">
            {msgs.map((m, i) => (
              <div key={i} className={`flex w-full ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`${m.role === "user" ? "max-w-[85%] bg-parchment-deep border border-outline-variant/30 p-6" : "max-w-[100%] bg-surface border border-primary/10 p-6 md:p-8"}`}>
                  {m.role === "ai" && (
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-outline-variant/20">
                      <span className="material-symbols-outlined text-primary text-[24px]">gavel</span>
                      <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">Juris AI Analysis</span>
                    </div>
                  )}
                  
                  <div className="font-body-md text-body-md text-on-surface leading-relaxed">
                    {m.role === "ai" && !m.done && !m.text ? (
                      <LoadingDots />
                    ) : m.role === "user" ? (
                      <p className="font-body-lg text-body-lg text-primary">{m.text}</p>
                    ) : (
                      <div className="prose prose-sm max-w-none [&_h1]:font-headline-md [&_h1]:text-primary [&_h2]:font-headline-md [&_h2]:text-primary [&_h3]:font-headline-md [&_h3]:text-primary [&_strong]:text-primary [&_a]:text-primary [&_a]:underline [&_li]:text-on-surface [&_p]:text-on-surface [&_ul]:list-disc [&_ol]:list-decimal">
                        <ReactMarkdown>{m.text}</ReactMarkdown>
                      </div>
                    )}
                  </div>

                  {m.role === "ai" && m.done && m.text && extractCitations(m.text).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-outline-variant/20">
                      {extractCitations(m.text).map((t, j) => (
                        <CitationPill key={j} {...t} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={bot} />

            {/* Suggested queries shown when no user messages yet */}
            {msgs.length <= 1 && (
              <div className="mt-4">
                <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest text-xs mb-4 block">Suggested Queries</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {QUICK_QS.map((q, i) => (
                    <button
                      key={i}
                      className="text-left p-4 border border-outline-variant/30 bg-parchment-mid hover:border-primary/40 hover:bg-parchment-deep transition-colors group"
                      onClick={() => { setDomain(q.domain.charAt(0).toUpperCase() + q.domain.slice(1)); send(q.q); }}
                    >
                      <span className="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors">{q.icon} {q.q}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 w-full bg-surface border-t-2 border-primary pt-4 pb-8 px-margin z-30 shadow-[0_-10px_40px_rgba(253,252,251,0.9)]">
          <div className="max-w-[720px] mx-auto w-full relative">
            <form className="flex items-end gap-4" onSubmit={(e) => { e.preventDefault(); send(); }}>
              <div className="flex-1 relative group">
                <label htmlFor="research-query" className="absolute -top-3 left-4 bg-surface px-1 font-label-sm text-label-sm uppercase tracking-widest text-primary z-10">
                  Legal Query
                </label>
                <textarea 
                  id="research-query"
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                  className="w-full bg-parchment-mid border border-primary focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md text-primary p-4 resize-none transition-shadow group-hover:bg-parchment-deep shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] rounded-none custom-scrollbar" 
                  placeholder="State your legal query… (Shift+Enter for new line)" 
                  rows={1} 
                  style={{ minHeight: '56px', maxHeight: '160px' }}
                />
              </div>
              <button 
                type="submit" 
                className={`h-[56px] px-6 border border-primary flex items-center justify-center font-label-sm text-label-sm uppercase tracking-widest shrink-0 transition-colors ${busy || !input.trim() ? "bg-surface-variant text-secondary cursor-not-allowed" : "bg-primary text-on-primary hover:bg-surface hover:text-primary"}`}
                disabled={busy || !input.trim()}
              >
                <span className="material-symbols-outlined mr-2">send</span>
                Send
              </button>
            </form>
            <div className="mt-2 flex justify-between items-center px-1">
              <span className="font-citation text-citation text-secondary text-xs">Informational only — not a substitute for qualified legal advice</span>
              <div className="flex gap-4">
                <button className="text-secondary hover:text-primary transition-colors" title="Attach Document"><span className="material-symbols-outlined text-[18px]">attach_file</span></button>
                <button className="text-secondary hover:text-primary transition-colors" title="New Chat" onClick={startNewChat}><span className="material-symbols-outlined text-[18px]">add_comment</span></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Chat History */}
      <aside className="hidden lg:flex w-72 border-l border-outline-variant/30 bg-surface flex-col shrink-0 overflow-y-auto custom-scrollbar">
        <div className="p-6 border-b border-outline-variant/30 sticky top-0 bg-surface z-10 flex justify-between items-center">
          <h3 className="font-headline-md text-headline-md text-primary text-xl">Chat History</h3>
          <button className="text-secondary hover:text-primary transition-colors p-1" onClick={startNewChat} title="New Chat">
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
        </div>
        <div className="flex-1 p-4 space-y-2">
          {sessions.map(s => (
            <div 
              key={s.id} 
              className={`group cursor-pointer p-3 border transition-all flex items-center gap-3 ${s.id === activeSessionId ? "border-primary/20 bg-parchment-deep" : "border-transparent hover:border-primary/20 hover:bg-parchment-mid"}`}
              onClick={() => loadSession(s.id)}
            >
              <span className="material-symbols-outlined text-[16px] text-secondary shrink-0">chat_bubble_outline</span>
              <span className="font-body-md text-body-md text-primary text-sm truncate">{s.title}</span>
            </div>
          ))}
        </div>
      </aside>
      
    </div>
  );
}
