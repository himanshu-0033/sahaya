import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InkBlot from "../components/InkBlot";
import CountdownRing from "../components/CountdownRing";
import MoodSlider from "../components/MoodSlider";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

const PROMPTS = [
  { id: "inkblot-1", label: "First impression" },
  { id: "inkblot-2", label: "What stands out" },
  { id: "inkblot-3", label: "Right now" },
];

export default function CheckIn() {
  const [step, setStep] = useState(0);
  const [word, setWord] = useState("");
  const [mood, setMood] = useState(3);
  const [responses, setResponses] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { token, setUser, user } = useAuth();
  const navigate = useNavigate();

  const prompt = PROMPTS[step];
  const isLast = step === PROMPTS.length - 1;

  function buildResponse() {
    return { prompt: prompt.label, word: word.trim() || "…", mood };
  }

  async function advance() {
    const next = [...responses, buildResponse()];
    setWord("");
    setMood(3);

    if (!isLast) {
      setResponses(next);
      setStep(step + 1);
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const data = await api.submitCheckIn(next, token);
      setUser({ ...user, streak: data.streak });
      navigate("/reward", { state: { quote: data.checkIn.quote, qrDataUrl: data.qrDataUrl, streak: data.streak } });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="screen checkin">
      <div className="checkin-header">
        <div className="step-dots">
          {PROMPTS.map((p, i) => (
            <span key={p.id} className={`dot ${i <= step ? "filled" : ""}`} />
          ))}
        </div>
        <CountdownRing resetKey={step} onComplete={advance} />
      </div>

      <InkBlot variant={step} />

      <p className="prompt-label">{prompt.label}</p>

      <input
        className="input word-input"
        autoFocus
        placeholder="What is the first word that comes to mind?"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && advance()}
      />

      <MoodSlider value={mood} onChange={setMood} />

      {error && <div className="error-text">{error}</div>}

      <button className="btn-primary" onClick={advance} disabled={submitting}>
        {submitting ? "Saving…" : isLast ? "Finish check-in" : "Next"}
      </button>
    </div>
  );
}
