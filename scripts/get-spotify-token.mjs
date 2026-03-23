/**
 * get-spotify-token.mjs
 * Steps:
 * 1. Paste your Client ID and Client Secret below
 * 2. Run: node scripts/get-spotify-token.mjs
 * 3. Open the printed URL in browser, click Agree
 * 4. Browser redirects to example.com — copy the full URL from address bar
 * 5. Paste it back into the terminal prompt
 */

import * as readline from "readline/promises";

// ── FILL THESE IN ──────────────────────────────────────────
const CLIENT_ID     = "428973559e6845f5a57993aa39766f9b";
const CLIENT_SECRET = "073e398aaf474f1bae799b3cf9180de0";
const REDIRECT_URI  = "https://example.com/callback";
// ───────────────────────────────────────────────────────────

const SCOPES = "user-read-currently-playing user-read-playback-state";

const authUrl =
  "https://accounts.spotify.com/authorize" +
  "?client_id=" + CLIENT_ID +
  "&response_type=code" +
  "&redirect_uri=" + encodeURIComponent(REDIRECT_URI) +
  "&scope=" + encodeURIComponent(SCOPES);

console.log("\n─────────────────────────────────────────────────────");
console.log("🎵  STEP 1 — Open this URL in your browser:\n");
console.log(authUrl);
console.log("\n─────────────────────────────────────────────────────");
console.log("🔗  STEP 2 — After clicking Agree, browser will go to");
console.log("    example.com (may show error — that is OK!)");
console.log("    Copy the FULL URL from the address bar.\n");
console.log("    Example: https://example.com/callback?code=AQDxxx...\n");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const pasted = await rl.question("📋  Paste the full redirect URL here:\n> ");
rl.close();

let code;
try {
  const url = new URL(pasted.trim());
  code = url.searchParams.get("code");
  if (!code) throw new Error("No 'code' param found.");
} catch (err) {
  console.error("\n❌  Could not parse URL:", err.message);
  process.exit(1);
}

const basic = Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64");

const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
  method: "POST",
  headers: {
    "Authorization":  "Basic " + basic,
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams({
    grant_type:   "authorization_code",
    code:         code,
    redirect_uri: REDIRECT_URI,
  }),
});

const data = await tokenRes.json();

if (data.error) {
  console.error("\n❌  Token error:", data.error_description || data.error);
  process.exit(1);
}

console.log("\n─────────────────────────────────────────────────────");
console.log("✅  SUCCESS! Run these commands:\n");
console.log("supabase secrets set SPOTIFY_CLIENT_ID=" + CLIENT_ID);
console.log("supabase secrets set SPOTIFY_CLIENT_SECRET=" + CLIENT_SECRET);
console.log("supabase secrets set SPOTIFY_REFRESH_TOKEN=" + data.refresh_token);
console.log("\nThen deploy:");
console.log("supabase functions deploy spotify-now-playing");
console.log("─────────────────────────────────────────────────────\n");
