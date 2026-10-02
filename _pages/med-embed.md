---
title: "Med Embed Leaderboard"
permalink: /internal/med-embed/
sitemap: false
robots: noindex, nofollow
search: false
author_profile: false
layout: single
classes: wide
---

<style>
  .me-gate { max-width: 28rem; margin: 2rem auto; padding: 1.5rem; border: 1px solid #ddd; border-radius: 10px; }
  .me-gate label { display: block; font-weight: 600; margin-bottom: 0.4rem; }
  .me-gate input { width: 100%; padding: 0.55rem 0.7rem; font-size: 1rem; box-sizing: border-box; }
  .me-gate button { margin-top: 0.75rem; padding: 0.55rem 1rem; font-weight: 600; cursor: pointer; }
  .me-gate .err { color: #b00020; margin-top: 0.6rem; min-height: 1.2rem; }
  .me-gate .hint { color: #666; font-size: 0.9rem; margin-top: 0.75rem; }
  #me-frame-wrap { display: none; }
  #me-frame { width: 100%; min-height: 80vh; border: 1px solid #ddd; border-radius: 8px; background: #0f1419; }
</style>

<div id="me-gate" class="me-gate">
  <p>Private lab leaderboard (not linked from the site). Enter the shared passphrase to view.</p>
  <label for="me-pass">Passphrase</label>
  <input id="me-pass" type="password" autocomplete="current-password" />
  <button id="me-unlock" type="button">Unlock</button>
  <div class="err" id="me-err"></div>
  <p class="hint">This page is <code>noindex</code> and omitted from navigation. Scores are stored encrypted in the repo.</p>
</div>

<div id="me-frame-wrap">
  <iframe id="me-frame" title="Med Embed Leaderboard"></iframe>
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
    const ct = b64ToBytes(payload.ct);
    const key = await deriveKey(passphrase, salt, payload.iter || 200000);
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: nonce }, key, ct);
    return new TextDecoder().decode(plain);
  }

  function showHtml(html) {
    document.getElementById("me-gate").style.display = "none";
    document.getElementById("me-frame-wrap").style.display = "block";
    const frame = document.getElementById("me-frame");
    frame.srcdoc = html;
  }

  async function tryUnlock(passphrase, { persist }) {
    const err = document.getElementById("me-err");
    err.textContent = "";
    try {
      const res = await fetch(payloadUrl + "?t=" + Date.now());
      if (!res.ok) throw new Error("Could not load encrypted payload (" + res.status + ")");
      const payload = await res.json();
      const html = await decryptHtml(passphrase, payload);
      if (persist) sessionStorage.setItem(STORAGE_KEY, passphrase);
      showHtml(html);
    } catch (e) {
      err.textContent = "Unlock failed — check passphrase.";
      console.warn(e);
    }
  }

  document.getElementById("me-unlock").addEventListener("click", () => {
    const pass = document.getElementById("me-pass").value || "";
    tryUnlock(pass, { persist: true });
  });
  document.getElementById("me-pass").addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") document.getElementById("me-unlock").click();
  });

  const cached = sessionStorage.getItem(STORAGE_KEY);
  if (cached) tryUnlock(cached, { persist: false });
})();
</script>
