import { useState } from "react";
import { X, PhoneCall, CheckCircle } from "lucide-react";

export default function CallModal({ onClose }) {
  const [step, setStep] = useState("form");
  const [topic, setTopic] = useState("");
  const [time, setTime] = useState("morning");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep("success");
      // Auto close after 3 seconds
      setTimeout(() => {
        onClose();
      }, 3000);
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        {step === "form" ? (
          <>
            <div className="modal-header">
              <div className="modal-icon-wrapper">
                <PhoneCall size={24} className="modal-icon" />
              </div>
              <h2>Schedule a Consultation</h2>
              <p>Request a call back from one of our verified legal experts to discuss your issue in detail.</p>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Briefly describe your legal issue</label>
                <textarea 
                  placeholder="e.g., I need help reviewing a commercial lease agreement..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="form-group">
                <label>Preferred Time Slot</label>
                <select value={time} onChange={(e) => setTime(e.target.value)}>
                  <option value="morning">Morning (9 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                  <option value="evening">Evening (4 PM - 8 PM)</option>
                </select>
              </div>

              <button type="submit" className="modal-submit-btn" disabled={loading || !topic.trim()}>
                {loading ? (
                  <span className="loading-dots"><span /><span /><span /></span>
                ) : (
                  "Request Call Back"
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="modal-success">
            <CheckCircle size={56} color="#10B981" style={{ marginBottom: 16 }} />
            <h2>Request Submitted!</h2>
            <p>An expert legal advisor will call you during your preferred time slot to discuss your case.</p>
          </div>
        )}
      </div>
    </div>
  );
}
