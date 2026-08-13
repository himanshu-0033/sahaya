// Lightweight stand-in for an AI sentiment call: flags a check-in when a
// submitted word matches a curated risk lexicon, or when mood is very low.
// Swap `flagCheckIn` for a real OpenAI call later without touching callers.
const RISK_WORDS = new Set([
  "hopeless",
  "hopelessness",
  "dark",
  "darkness",
  "trapped",
  "empty",
  "worthless",
  "numb",
  "alone",
  "lonely",
  "tired",
  "exhausted",
  "hurt",
  "hurting",
  "pain",
  "suicidal",
  "suicide",
  "dying",
  "die",
  "death",
  "scared",
  "afraid",
  "panic",
  "anxious",
  "overwhelmed",
  "broken",
  "crying",
  "give up",
  "giving up",
  "nothing",
  "invisible",
]);

export function flagCheckIn(responses, averageMood) {
  const hasRiskWord = responses.some((r) => RISK_WORDS.has(r.word.trim().toLowerCase()));
  return hasRiskWord || averageMood <= 1.5;
}
