---
title: "Med Embed Leaderboard"
permalink: /internal/med-embed/
sitemap: false
robots: noindex, nofollow
search: false
layout: bare
---
<style>
  :root {
    --bg: #0f1419;
    --panel: #1a2332;
    --text: #e7ecf3;
    --muted: #9aa7b8;
    --accent: #3d8bfd;
    --border: #2a3648;
    --danger: #ff7b72;
  }
  * { box-sizing: border-box; }
  html, body {
    margin: 0;
    min-height: 100%;
    background: radial-gradient(1200px 600px at 10% -10%, #1b2a44, var(--bg));
    color: var(--text);
    font-family: "IBM Plex Sans", "Segoe UI", sans-serif;
  }
  .gate {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 1.5rem;
  }
  .card {
    width: min(420px, 100%);
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 1.6rem 1.5rem 1.4rem;
    box-shadow: 0 20px 50px rgba(0,0,0,0.35);
  }
  .card h1 {
    margin: 0 0 0.35rem;
    font-size: 1.35rem;
    letter-spacing: -0.02em;
  }
  .card p {
    margin: 0 0 1.1rem;
    color: var(--muted);
    line-height: 1.45;
    font-size: 0.95rem;
  }
  label {
    display: block;
    font-size: 0.8rem;
    color: var(--muted);
    margin-bottom: 0.35rem;
  }
  input {
    width: 100%;
    background: #141c28;
    color: var(--text);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 0.65rem 0.8rem;
    font-size: 1rem;
  }
  input:focus {
    outline: 2px solid rgba(61,139,253,0.45);
    border-color: var(--accent);
  }
  button {
    margin-top: 0.85rem;
    width: 100%;
    background: var(--accent);
    color: #fff;
    border: 0;
    border-radius: 8px;
    padding: 0.7rem 1rem;
    font-size: 0.95rem;
    font-weight: 650;
    cursor: pointer;
  }
  button:hover { filter: brightness(1.06); }
  .err {
    min-height: 1.25rem;
    margin-top: 0.7rem;
    color: var(--danger);
    font-size: 0.88rem;
  }
  .meta {
    margin-top: 0.9rem;
    font-size: 0.78rem;
    color: var(--muted);
  }
</style>

<div class="gate" id="me-gate">
  <div class="card">
    <h1>Med Embed Leaderboard</h1>
    <p>Private lab ranking. Enter the shared passphrase to open the full board.</p>
    <label for="me-pass">Passphrase</label>
    <input id="me-pass" type="password" autocomplete="current-password" autofocus />
    <button id="me-unlock" type="button">Unlock</button>
    <div class="err" id="me-err"></div>
    <div class="meta">Unlisted · noindex · encrypted payload</div>
  </div>
</div>

<script>
(async function () {
  const STORAGE_KEY = "med_embed_lb_unlocked_v1";
  const payloadUrl = "{{ '/assets/data/med-embed.enc.json' | relative_url }}";

  function b64ToBytes(b64) {
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  async function deriveKey(passphrase, salt, iterations) {
    const enc = new TextEncoder();
    const baseKey = await crypto.subtle.importKey(
      "raw", enc.encode(passphrase), "PBKDF2", false, ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
      baseKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );
  }

  async function decryptHtml(passphrase, payload) {
    const salt = b64ToBytes(payload.salt);
    const nonce = b64ToBytes(payload.nonce);
    const ct = b64ToBytes(payload.ct || payload.ciphertext);
    const key = await deriveKey(passphrase, salt, payload.iter || 200000);
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: nonce }, key, ct);
    return new TextDecoder().decode(plain);
  }

  function showHtml(html) {
    // Replace the whole document so the board is full-bleed (no theme chrome / iframe).
    document.open();
    document.write(html);
    document.close();
  }

  async function tryUnlock(passphrase, { persist }) {
    const err = document.getElementById("me-err");
    if (err) err.textContent = "";
    try {
      const res = await fetch(payloadUrl + "?t=" + Date.now());
      if (!res.ok) throw new Error("Could not load encrypted payload (" + res.status + ")");
      const payload = await res.json();
      const html = await decryptHtml(passphrase, payload);
      if (persist) sessionStorage.setItem(STORAGE_KEY, passphrase);
      showHtml(html);
    } catch (e) {
      if (err) err.textContent = "Unlock failed — check passphrase.";
      console.warn(e);
    }
  }

  document.getElementById("me-unlock").addEventListener("click", () => {
    tryUnlock(document.getElementById("me-pass").value || "", { persist: true });
  });
  document.getElementById("me-pass").addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") document.getElementById("me-unlock").click();
  });

  const cached = sessionStorage.getItem(STORAGE_KEY);
  if (cached) tryUnlock(cached, { persist: false });
})();
</script>
