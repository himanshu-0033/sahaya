import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Reward() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!state) {
      navigate("/checkin", { replace: true });
      return;
    }
    const t = setTimeout(() => setVisible(true), 150);
    return () => clearTimeout(t);
  }, [state, navigate]);

  if (!state) return null;

  const { quote, qrDataUrl, streak } = state;

  return (
    <div className={`screen reward ${visible ? "in" : ""}`}>
      <div className="confetti" aria-hidden="true" />
      <h2>Nicely done ✨</h2>
      <p className="streak-badge">{streak}-day streak</p>

      <blockquote className="quote-card">{quote}</blockquote>

      <div className="qr-card">
        <img src={qrDataUrl} alt="Your daily reward QR code" width={180} height={180} />
        <p>Show this at the counter for today's Dinner Pass</p>
      </div>

      <button className="btn-primary" onClick={() => navigate("/journal")}>
        View my journal
      </button>
    </div>
  );
}
