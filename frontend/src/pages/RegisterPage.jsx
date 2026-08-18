import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const BAR_COUNCILS = [
  "Bar Council of Delhi",
  "Bar Council of Maharashtra & Goa",
  "Bar Council of Tamil Nadu",
  "Bar Council of Karnataka",
  "Bar Council of Uttar Pradesh",
  "Bar Council of West Bengal",
  "Bar Council of Rajasthan",
  "Bar Council of Gujarat",
  "Bar Council of Kerala",
  "Bar Council of Madhya Pradesh",
  "Bar Council of Telangana",
  "Bar Council of Andhra Pradesh",
  "Bar Council of Punjab & Haryana",
  "Bar Council of Bihar",
  "Bar Council of Odisha",
  "Bar Council of Jharkhand",
  "Bar Council of Assam, Nagaland, Meghalaya, Manipur, Tripura, Mizoram & Arunachal Pradesh",
  "Bar Council of Chhattisgarh",
  "Bar Council of Himachal Pradesh",
  "Bar Council of Uttarakhand",
  "Bar Council of Jammu & Kashmir",
];

const SPECIALIZATIONS = [
  "Constitutional Law",
  "Criminal Law",
  "Civil Law",
  "Corporate Law",
  "Family Law",
  "Property Law",
  "Labour & Employment Law",
  "Tax Law",
  "Intellectual Property Law",
  "Banking & Finance Law",
  "Environmental Law",
  "Cyber Law",
  "Immigration Law",
  "International Law",
  "General Practice",
];

export default function RegisterPage({ onNavigate }) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    barCouncilId: "",
    stateBarCouncil: "",
    specialization: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const validate = () => {
    if (!form.fullName.trim()) return "Please enter your full name.";
    if (!form.email.trim()) return "Please enter your email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Please enter a valid email address.";
    if (!form.password) return "Please create a password.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    if (!form.agreeTerms) return "Please agree to the Terms of Service.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    const result = await register(form);
    if (!result.success) {
      setError(result.error);
      setLoading(false);
    } else if (result.message) {
      alert(result.message);
      setLoading(false);
      onNavigate("login");
    }
  };

  return (
    <div className="min-h-screen flex bg-background font-body-md text-on-background">
      {/* Left: Form */}
      <div className="flex-1 flex flex-col p-8 md:p-16 bg-surface-container-lowest overflow-y-auto">
        <div className="w-full max-w-xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12 cursor-pointer group" onClick={() => onNavigate("landing")}>
            <img 
              src="/juris_app_icon_dark.png" 
              alt="Juris Logo" 
              className="w-10 h-10 object-contain rounded-md shadow-sm border border-primary/20 transition-transform group-hover:scale-105"
            />
            <span className="font-display-lg text-[26px] text-primary tracking-tight font-bold">Juris</span>
          </div>

          <h1 className="font-headline-lg text-[32px] text-primary mb-2">Create your account</h1>
          <p className="font-body-md text-secondary mb-8">Join thousands of legal professionals using Juris</p>

          {error && (
            <div className="border border-error bg-error-container p-4 mb-6">
              <span className="font-body-md text-error">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-label-sm text-primary uppercase">Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Adv. Aarav Sharma"
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                className="border border-outline-variant bg-surface p-3 text-body-md focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-label-sm text-primary uppercase">Email Address *</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="border border-outline-variant bg-surface p-3 text-body-md focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-primary uppercase">Bar Council Reg. No.</label>
                <input
                  type="text"
                  placeholder="e.g. D/1234/2020"
                  value={form.barCouncilId}
                  onChange={(e) => update("barCouncilId", e.target.value)}
                  className="border border-outline-variant bg-surface p-3 text-body-md focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-primary uppercase">State Bar Council</label>
                <select
                  value={form.stateBarCouncil}
                  onChange={(e) => update("stateBarCouncil", e.target.value)}
                  className="border border-outline-variant bg-surface p-3 text-body-md focus:border-primary focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Select...</option>
                  {BAR_COUNCILS.map((bc) => (
                    <option key={bc} value={bc}>{bc}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-label-sm text-primary uppercase">Specialization</label>
              <select
                value={form.specialization}
                onChange={(e) => update("specialization", e.target.value)}
                className="border border-outline-variant bg-surface p-3 text-body-md focus:border-primary focus:outline-none transition-colors appearance-none cursor-pointer"
              >
                <option value="">Select your area of practice...</option>
                {SPECIALIZATIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-primary uppercase">Password *</label>
                <div className="relative border border-outline-variant bg-surface focus-within:border-primary transition-colors flex">
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    className="flex-1 bg-transparent p-3 text-body-md focus:outline-none"
                  />
                  <button type="button" className="p-3 text-secondary hover:text-primary flex items-center" onClick={() => setShowPw(!showPw)}>
                    <span className="material-symbols-outlined text-[20px]">{showPw ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-sm text-label-sm text-primary uppercase">Confirm Password *</label>
                <div className="relative border border-outline-variant bg-surface focus-within:border-primary transition-colors flex">
                  <input
                    type={showCpw ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChange={(e) => update("confirmPassword", e.target.value)}
                    className="flex-1 bg-transparent p-3 text-body-md focus:outline-none"
                  />
                  <button type="button" className="p-3 text-secondary hover:text-primary flex items-center" onClick={() => setShowCpw(!showCpw)}>
                    <span className="material-symbols-outlined text-[20px]">{showCpw ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer mt-2">
              <input
                type="checkbox"
                checked={form.agreeTerms}
                onChange={(e) => update("agreeTerms", e.target.checked)}
                className="w-4 h-4 border-outline-variant bg-surface text-primary focus:ring-0 focus:ring-offset-0"
              />
              <span className="font-body-md text-on-surface-variant">
                I agree to the <a href="#" className="text-primary underline">Terms of Service</a> and <a href="#" className="text-primary underline">Privacy Policy</a>
              </span>
            </label>

            <button type="submit" className="bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-wider p-4 border border-primary hover:bg-surface-container-highest hover:text-primary transition-colors flex justify-center items-center gap-2 mt-4" disabled={loading}>
              {loading ? "Creating account…" : "Create Account"}
              {!loading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
            </button>
          </form>

          <p className="font-body-md text-secondary mt-8 text-center pb-12">
            Already have an account?{" "}
            <button className="text-primary hover:underline underline-offset-4" onClick={() => onNavigate("login")}>Log in</button>
          </p>
        </div>
      </div>

      {/* Right: Branded Panel */}
      <div className="hidden lg:flex flex-1 bg-primary border-l border-outline-variant p-16 flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        
        <div className="relative z-10 max-w-lg">
          <span className="material-symbols-outlined text-[48px] text-on-primary mb-8">gavel</span>
          <h2 className="font-display-lg text-[48px] text-on-primary leading-tight mb-6">Your AI Legal Research Partner</h2>
          <p className="font-body-lg text-on-primary-container mb-12">Access India's most comprehensive AI-powered legal research platform with verified citations.</p>
          
          <div className="flex flex-col gap-6">
            {[
              "Constitution & 50,000+ SC judgments",
              "Document risk analysis with AI",
              "Anti-hallucination — no fabricated citations",
              "Legal drafting with proper court format"
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
