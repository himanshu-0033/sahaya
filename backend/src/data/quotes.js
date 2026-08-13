export const QUOTES_BY_BAND = {
  low: [
    "This feeling is real, but it isn't permanent. Be gentle with yourself today.",
    "You don't have to carry everything alone. Reach out to someone you trust.",
    "Rest is productive too. Give yourself permission to slow down.",
  ],
  mid: [
    "Small steps still move you forward. Notice one thing that went right today.",
    "It's okay to feel in-between. Not every day needs to be your best.",
    "Steady is underrated. You're doing better than you think.",
  ],
  high: [
    "Carry this energy forward — write down what made today good.",
    "You're on a roll. Let yourself enjoy this moment fully.",
    "Great days are worth celebrating. Treat yourself kindly.",
  ],
};

export function bandForMood(averageMood) {
  if (averageMood <= 2) return "low";
  if (averageMood <= 3.5) return "mid";
  return "high";
}

export function pickQuote(averageMood) {
  const band = bandForMood(averageMood);
  const options = QUOTES_BY_BAND[band];
  return options[Math.floor(Math.random() * options.length)];
}
