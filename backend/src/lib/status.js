export function statusFor(user, todayCheckIn) {
  if (!todayCheckIn) return "missed";
  if (todayCheckIn.aiSentimentFlag) return "concerning";
  return "stable";
}
