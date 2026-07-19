const menuToggle = document.getElementById('menuToggle');
const menuClose = document.getElementById('menuClose');
const mobileNav = document.getElementById('mobileNav');

function openNav() {
  mobileNav.hidden = false;
  menuToggle.setAttribute('aria-expanded', 'true');
}

function closeNav() {
  mobileNav.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
}

menuToggle.addEventListener('click', openNav);
menuClose.addEventListener('click', closeNav);

// ---------- Backend config ----------
const API_BASE = 'https://jenworker-api.up.railway.app';
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ---------- Capture modal (Start Free) — injected once per page ----------
const overlay = document.createElement('div');
overlay.className = 'overlay';
overlay.id = 'captureOverlay';
overlay.innerHTML = `
  <div class="modal">
    <h3>Start free</h3>
    <p>No credit card required. We'll send your first lead plan to your inbox.</p>
    <input type="email" id="capEmail" placeholder="you@company.com" aria-label="Email address">
    <button class="btn btn-black btn-block" id="capGo">Create my account</button>
    <p class="msg" id="capMsg"></p>
  </div>`;
document.body.appendChild(overlay);

const capMsg = overlay.querySelector('#capMsg');
const capEmail = overlay.querySelector('#capEmail');
let lastPrompt = '';

function openCapture(prompt) {
  lastPrompt = prompt || '';
  capMsg.textContent = '';
  overlay.classList.add('open');
  capEmail.focus();
}
overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('open'); });

document.querySelectorAll('.cta').forEach((c) =>
  c.addEventListener('click', (e) => {
    e.preventDefault();
    const promptEl = document.getElementById('promptInput');
    openCapture(promptEl ? promptEl.value.trim() : '');
  })
);

overlay.querySelector('#capGo').addEventListener('click', async () => {
  const email = capEmail.value.trim();
  capMsg.textContent = 'Saving…';
  try {
    const r = await fetch(`${API_BASE}/api/leads`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, source: 'jenworker-cta', prompt: lastPrompt }),
    });
    const data = await r.json();
    capMsg.textContent = r.ok ? "You're in — check your inbox." : (data.error || "Couldn't save. Try again.");
    if (r.ok) setTimeout(() => overlay.classList.remove('open'), 1500);
  } catch {
    capMsg.textContent = 'Network error — try again.';
  }
});

// ---------- Chat widget — injected once per page ----------
const chatFab = document.querySelector('.chat-fab');
if (chatFab) {
  const chatPanel = document.createElement('div');
  chatPanel.className = 'chat-panel';
  chatPanel.innerHTML = `
    <div class="chat-head">
      <strong>Jenworker Assistant</strong>
      <button class="chat-close" aria-label="Close chat">&times;</button>
    </div>
    <div class="chat-body">
      <div class="chat-msg bot">Hi! I'm here to help you find your first list of leads. What does your ideal customer look like?</div>
    </div>
    <div class="chat-input-row">
      <input type="text" placeholder="Type a message…" aria-label="Chat message">
      <button type="button">Send</button>
    </div>`;
  document.body.appendChild(chatPanel);

  const chatBody = chatPanel.querySelector('.chat-body');
  const chatInput = chatPanel.querySelector('input');
  const chatSend = chatPanel.querySelector('.chat-input-row button');
  const chatHistory = [{ role: 'assistant', content: chatBody.textContent.trim() }];

  chatFab.addEventListener('click', () => chatPanel.classList.toggle('open'));
  chatPanel.querySelector('.chat-close').addEventListener('click', () => chatPanel.classList.remove('open'));

  async function sendChat() {
    const text = chatInput.value.trim();
    if (!text) return;
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg user';
    userMsg.textContent = text;
    chatBody.appendChild(userMsg);
    chatHistory.push({ role: 'user', content: text });
    chatInput.value = '';
    chatBody.scrollTop = chatBody.scrollHeight;

    const typing = document.createElement('div');
    typing.className = 'chat-msg bot';
    typing.textContent = '…';
    chatBody.appendChild(typing);
    chatBody.scrollTop = chatBody.scrollHeight;

    try {
      const r = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory }),
      });
      const data = await r.json();
      typing.textContent = r.ok ? data.reply : (data.error || "Chat is unavailable right now.");
      if (r.ok) chatHistory.push({ role: 'assistant', content: data.reply });
    } catch {
      typing.textContent = 'Network error — try again.';
    }
    chatBody.scrollTop = chatBody.scrollHeight;
  }
  chatSend.addEventListener('click', sendChat);
  chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendChat(); });
}

// ---------- Hero prompt composer -> POST /api/prospect ----------
const promptInput = document.getElementById('promptInput');
const promptSubmit = document.getElementById('promptSubmit');
const resultEl = document.getElementById('result');
let mode = 'profile';

document.querySelectorAll('.prompt-toolbar .pill, .prompt-toolbar .pill-plain').forEach((pill) => {
  pill.style.cursor = 'pointer';
  pill.addEventListener('click', () => {
    document.querySelectorAll('.prompt-toolbar .pill, .prompt-toolbar .pill-plain').forEach((p) => p.classList.remove('pill-active'));
    pill.classList.add('pill-active');
    mode = pill.textContent.includes('domain') ? 'domain' : 'profile';
    if (promptInput) {
      promptInput.placeholder = mode === 'domain'
        ? 'e.g. yourcompany.com — we’ll infer your ideal customer'
        : 'Find personal financial advisor';
    }
  });
});

function showResult(html) {
  resultEl.style.display = 'block';
  resultEl.innerHTML = html;
}

async function runProspect() {
  const prompt = promptInput.value.trim();
  if (!prompt) return showResult('<p class="err">Describe the lead you want to find first.</p>');
  showResult('<p>Building your lead plan…</p>');
  try {
    const r = await fetch(`${API_BASE}/api/prospect`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prompt, mode }),
    });
    const data = await r.json();
    if (!r.ok) return showResult(`<p class="err">${esc(data.error || 'Something went wrong.')}</p>`);
    const x = data.result;
    showResult(`
      <h3>${esc(x.icp.title)}</h3>
      <p><strong>Industries:</strong> ${x.icp.industries.map(esc).join(', ')}</p>
      <p><strong>Company size:</strong> ${esc(x.icp.company_size)}</p>
      <p><strong>Buying signals:</strong> ${x.icp.signals.map(esc).join('; ')}</p>
      <p><strong>Search plan</strong></p>
      <ol>${x.search_plan.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
      <p><strong>Sample outreach — ${esc(x.sample_outreach.subject)}</strong></p>
      <p>${esc(x.sample_outreach.body)}</p>
      <button class="btn btn-black" id="claimBtn">Get these leads &rarr; Start free</button>
    `);
    document.getElementById('claimBtn').addEventListener('click', () => openCapture(prompt));
  } catch {
    showResult('<p class="err">Network error — try again.</p>');
  }
}

if (promptSubmit && promptInput) {
  promptSubmit.addEventListener('click', runProspect);
  promptInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) runProspect();
  });
}
