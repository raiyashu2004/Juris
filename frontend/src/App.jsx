import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ChatPage from "./pages/ChatPage";
import DocumentAnalyzer from "./pages/DocumentAnalyzer";
import LegalResearch from "./pages/LegalResearch";
import CaseFinder from "./pages/CaseFinder";
import DraftGenerator from "./pages/DraftGenerator";
import MyDocuments from "./pages/MyDocuments";
import Templates from "./pages/Templates";
import SavedResearch from "./pages/SavedResearch";
import Settings from "./pages/Settings";

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [page, setPage] = useState("dashboard");
  const [authView, setAuthView] = useState("landing");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-spin text-primary">
          <span className="material-symbols-outlined text-4xl">autorenew</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (authView === "login") return <LoginPage onNavigate={setAuthView} />;
    if (authView === "register") return <RegisterPage onNavigate={setAuthView} />;
    return <LandingPage onNavigate={setAuthView} />;
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <DashboardPage onNavigate={setPage} />;
      case "chat": return <ChatPage />;
      case "doc": return <DocumentAnalyzer />;
      case "research": return <LegalResearch />;
      case "cases": return <CaseFinder />;
      case "draft": return <DraftGenerator />;
      case "documents": return <MyDocuments />;
      case "templates": return <Templates />;
      case "saved": return <SavedResearch />;
      case "settings": return <Settings />;
      default: return <DashboardPage onNavigate={setPage} />;
    }
  };

  const isFullScreenPage = page === "chat" || page === "doc";

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col md:flex-row antialiased selection:bg-primary-container selection:text-on-primary">
      <Sidebar activePage={page} onNavigate={(p) => { setPage(p); setIsMobileMenuOpen(false); }} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      
      <main className="flex-1 md:ml-64 flex flex-col items-center min-h-screen overflow-x-hidden overflow-y-auto">
        <Header activePage={page} onNavigate={setPage} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        
        {isFullScreenPage ? (
          <div className="w-full flex-1 flex flex-col h-[calc(100vh-80px)] md:h-screen">
            {renderPage()}
          </div>
        ) : (
          <div className="w-full flex-1 flex flex-col items-center p-0">
            <div className="w-full max-w-[720px] px-margin py-12 md:py-24 flex-1">
              {renderPage()}
            </div>
            <footer className="w-full border-t border-outline-variant py-gutter px-margin flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto bg-surface mt-auto">
              <div className="font-label-sm text-label-sm font-bold text-primary mb-4 md:mb-0">
                © 2026 Juris Legal Systems. All Rights Reserved.
              </div>
              <div className="flex gap-6 font-citation text-citation text-secondary">
                <a className="hover:text-primary hover:underline transition-opacity duration-200" href="#">Terms of Service</a>
                <a className="hover:text-primary hover:underline transition-opacity duration-200" href="#">Privacy Protocol</a>
                <a className="hover:text-primary hover:underline transition-opacity duration-200" href="#">Institutional Access</a>
              </div>
            </footer>
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
