import { useState } from "react";
import { ArrowLeft, Upload, Bell, Phone, ChevronDown, LogOut, User, Settings, Menu, FileText, Scale, Bookmark } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import CallModal from "./CallModal";

const PAGE_TITLES = {
  dashboard: { title: "Dashboard", subtitle: null },
  chat: { title: "Chat with JurisAI", subtitle: "AI Legal Research Assistant" },
  doc: { title: "Document Analysis", subtitle: null },
  research: { title: "Legal Research", subtitle: "Search Indian law databases" },
  cases: { title: "Case Finder", subtitle: "Find relevant precedents" },
  draft: { title: "Draft Generator", subtitle: "AI-assisted legal drafting" },
  documents: { title: "My Documents", subtitle: "Manage your uploaded files" },
  templates: { title: "Templates", subtitle: "Legal document templates" },
  saved: { title: "Saved Research", subtitle: "Your bookmarked research" },
  settings: { title: "Settings", subtitle: "Account & preferences" },
};

export default function Header({ activePage, onNavigate, docName, setIsMobileMenuOpen }) {
  const { user, logout, getInitials } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, title: "Document Analysis Complete: Lease Agreement", time: "10 mins ago", read: false, type: "blue", icon: <FileText size={16} /> },
    { id: 2, title: "New SC Judgment matching 'Article 21'", time: "2 hours ago", read: false, type: "yellow", icon: <Scale size={16} /> },
    { id: 3, title: "NDA_Draft.docx saved to My Documents", time: "1 day ago", read: true, type: "green", icon: <Bookmark size={16} /> }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const pageInfo = PAGE_TITLES[activePage] || PAGE_TITLES.dashboard;

  const displayName = user?.fullName || "User";
  const initials = getInitials();

  return (
    <header className="header-bar">
      <div className="header-left">
        <button 
          className="header-mobile-menu-btn" 
          onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(true)}
        >
          <Menu size={20} />
        </button>
        {activePage !== "dashboard" && (
          <button
            className="header-back-btn"
            onClick={() => onNavigate("dashboard")}
            id="header-back"
          >
            <ArrowLeft size={16} />
          </button>
        )}
        <div className="header-title">
          <h1>{pageInfo.title}</h1>
          {(docName || pageInfo.subtitle) && (
            <p>{docName || pageInfo.subtitle}</p>
          )}
        </div>
      </div>

      <div className="header-right">
        {activePage === "doc" && (
          <button className="header-upload-btn" id="header-upload">
            <Upload size={15} />
            Upload New Document
          </button>
        )}

        <button className="header-icon-btn" id="header-phone" onClick={() => setShowCallModal(true)}>
          <Phone size={17} />
        </button>

        <div className="header-avatar-wrapper">
          <button 
            className="header-icon-btn" 
            id="header-notifications"
            onClick={() => { setShowNotifications(!showNotifications); setShowDropdown(false); }}
          >
            <Bell size={17} />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <>
              <div className="dropdown-overlay" onClick={() => setShowNotifications(false)} />
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h3>Notifications</h3>
                  {unreadCount > 0 && (
                    <button className="notifications-mark-read" onClick={markAllRead}>
                      Mark all as read
                    </button>
                  )}
                </div>
                {notifications.length > 0 ? (
                  <div className="notifications-list">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`notification-item ${!notif.read ? 'unread' : ''}`}
                        onClick={() => markAsRead(notif.id)}
                      >
                        <div className={`notification-icon ${notif.type}`}>
                          {notif.icon}
                        </div>
                        <div className="notification-content">
                          <p className="notification-title">{notif.title}</p>
                          <p className="notification-time">{notif.time}</p>
                        </div>
                        {!notif.read && <div className="notification-unread-dot" />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="notifications-empty">
                    <Bell size={32} color="#CBD5E1" style={{ margin: "0 auto 12px" }} />
                    You have no new notifications
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* User Avatar Dropdown */}
        <div className="header-avatar-wrapper">
          <button
            className="header-avatar"
            id="header-avatar"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="header-avatar-circle">{initials}</div>
            <span className="header-avatar-name">{displayName}</span>
            <ChevronDown size={14} color="#94A3B8" style={{ transition: "transform 0.2s", transform: showDropdown ? "rotate(180deg)" : "none" }} />
          </button>

          {showDropdown && (
            <>
              <div className="dropdown-overlay" onClick={() => setShowDropdown(false)} />
              <div className="header-dropdown">
                <div className="header-dropdown-header">
                  <div className="header-avatar-circle" style={{ width: 40, height: 40, fontSize: 15 }}>{initials}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B" }}>{displayName}</div>
                    <div style={{ fontSize: 12, color: "#94A3B8" }}>{user?.email || ""}</div>
                  </div>
                </div>
                <div className="header-dropdown-divider" />
                <button className="header-dropdown-item" onClick={() => { setShowDropdown(false); onNavigate("settings"); }}>
                  <User size={16} />
                  My Profile
                </button>
                <button className="header-dropdown-item" onClick={() => { setShowDropdown(false); onNavigate("settings"); }}>
                  <Settings size={16} />
                  Settings
                </button>
                <div className="header-dropdown-divider" />
                <button className="header-dropdown-item logout" onClick={() => { setShowDropdown(false); logout(); }}>
                  <LogOut size={16} />
                  Log Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      {showCallModal && <CallModal onClose={() => setShowCallModal(false)} />}
    </header>
  );
}
