import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage({ onNavigate }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) { setError("Please enter your email address."); return; }
    if (!password) { setError("Please enter your password."); return; }

    setLoading(true);
    const result = await login(email, password);
    if (!result.success) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background font-body-md text-on-background">
      {/* Left: Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-surface-container-lowest">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12 cursor-pointer" onClick={() => onNavigate("landing")}>
            <div className="h-10 w-10 bg-primary flex items-center justify-center border border-outline-variant">
              <span className="font-display-lg text-on-primary text-xl tracking-tighter">J</span>
            </div>
            <span className="font-display-lg text-[24px] text-primary tracking-tight">Juris</span>
          </div>

          <h1 className="font-headline-lg text-[32px] text-primary mb-2">Welcome back</h1>
          <p className="font-body-md text-secondary mb-8">Log in to access your legal research dashboard</p>

          {error && (
            <div className="border border-error bg-error-container p-4 mb-6">
              <span className="font-body-md text-error">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-label-sm text-primary uppercase">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-outline-variant bg-surface p-3 text-body-md focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="font-label-sm text-label-sm text-primary uppercase">Password</label>
                <a href="#" className="font-label-sm text-[12px] text-secondary hover:text-primary transition-colors">Forgot password?</a>
              </div>
              <div className="relative border border-outline-variant bg-surface focus-within:border-primary transition-colors flex">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent p-3 text-body-md focus:outline-none"
                />
                <button type="button" className="p-3 text-secondary hover:text-primary flex items-center" onClick={() => setShowPw(!showPw)}>
                  <span className="material-symbols-outlined text-[20px]">{showPw ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer mt-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 border-outline-variant bg-surface text-primary focus:ring-0 focus:ring-offset-0"
              />
              <span className="font-body-md text-on-surface-variant">Remember me for 30 days</span>
            </label>

            <button type="submit" className="bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-wider p-4 border border-primary hover:bg-surface-container-highest hover:text-primary transition-colors flex justify-center items-center gap-2 mt-4" disabled={loading}>
              {loading ? "Logging in…" : "Log In"}
              {!loading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
            </button>
          </form>

          <p className="font-body-md text-secondary mt-8 text-center">
            Don't have an account?{" "}
            <button className="text-primary hover:underline underline-offset-4" onClick={() => onNavigate("register")}>Create one</button>
          </p>
        </div>
      </div>

      {/* Right: Branded Panel */}
      <div className="hidden lg:flex flex-1 bg-primary border-l border-outline-variant p-16 flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        
        <div className="relative z-10 max-w-lg">
          <span className="material-symbols-outlined text-[48px] text-on-primary mb-8">shield</span>
          <h2 className="font-display-lg text-[48px] text-on-primary leading-tight mb-6">Secure & Confidential</h2>
          <p className="font-body-lg text-on-primary-container mb-12">Your legal research and documents are protected with enterprise-grade security.</p>
          
          <div className="flex flex-col gap-6">
            {[
              "End-to-end encrypted sessions",
              "No document data stored permanently",
              "Bar Council verified professionals",
              "Compliant with Indian data privacy laws"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-4 text-on-primary-container">
                <span className="material-symbols-outlined text-primary-container">check_circle</span>
                <span className="font-body-md">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
