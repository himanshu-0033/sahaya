import { useEffect, useRef, useState } from "react";

const DURATION = 10; // seconds
const RADIUS = 34;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function CountdownRing({ onComplete, resetKey }) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(performance.now());
  const frameRef = useRef();

  useEffect(() => {
    startRef.current = performance.now();
    setElapsed(0);

    function tick(now) {
      const secs = (now - startRef.current) / 1000;
      if (secs >= DURATION) {
        setElapsed(DURATION);
        onComplete?.();
        return;
      }
      setElapsed(secs);
      frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  const progress = elapsed / DURATION;
  const offset = CIRCUMFERENCE * (1 - progress);

  return (
    <svg width="84" height="84" viewBox="0 0 84 84" className="countdown-ring">
      <circle cx="42" cy="42" r={RADIUS} className="countdown-track" />
      <circle
        cx="42"
        cy="42"
        r={RADIUS}
        className="countdown-progress"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
      />
      <text x="42" y="47" textAnchor="middle" className="countdown-text">
        {Math.max(0, Math.ceil(DURATION - elapsed))}
      </text>
    </svg>
  );
}
