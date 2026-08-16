const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Returns true if the request was a CORS preflight and has already been responded to.
export function applyCors(req, res) {
  const origin = req.headers.origin;
  const allowOrigin = allowedOrigins.length === 0 ? "*" : allowedOrigins.includes(origin) ? origin : "";

  if (allowOrigin) res.setHeader("Access-Control-Allow-Origin", allowOrigin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }
  return false;
}
