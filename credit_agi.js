// ============================================================
// Supreme Credit Master AGI V15 — Complete JavaScript
// © 2026 RJ Business Solutions | Rick Jefferson | Tijeras, NM
// ============================================================

const STATE = {
  apiKey: '', model: 'gemini-3.1-pro-preview',
  orchestration: 'single',
  temperature: 1.0, maxTokens: 8192, contextTurns: 10,
  streaming: true, ragEnabled: true, autoScroll: true, legalVerify: true,
  thinkingLevel: 'high', thinkingEnabled: true,
  darkMode: true, streamingAbort: null, isStreaming: false,
  messages: [], chatHistory: [], activeChatId: null,
  ragDocs: [], ragChunks: [], ragEmbedIndex: [],
  imageAttachment: null, activeViolations: new Set(),
  clientName: '', clientAddress: '', clientState: '',
  customInstructions: '', selectedLetterType: 'bureau',
  
  // ── Enterprise Infra (V16.0 Ultimate) ──
  INFRA: {
    cloudflare: { accountId: '58250b56ae5b45d940cd6e4b64314c01', zoneId: '18e1ffe3c8a6b6c965860aa0bae60357', accountHash: 'Zubex6PB2rauwMiPzKIrLA' },
    convex: { deployKey: 'prod:wary-ox-827|eyJ2MiI6ImIxZDg1MjZkNGEyNTQzOGE5NmE4MTI4NDkxOWM1M2Y1In0=' },
    clerk: { publishableKey: 'pk_test_c21vb3RoLXBsYXR5cHVzLTcxLmNsZXJrLmFjY291bnRzLmRldiQ' },
    ai_hubs: { huggingFace: true, kaggle: true }
  }
};

const MODELS = [
  { id:'gemini-3.1-pro-preview', label:'3.1 Pro ✦', primary:true },
  { id:'gemini-2.0-flash',       label:'2.0 Flash ⚡' },
  { id:'gemini-3-pro-preview',   label:'3.0 Pro' },
  { id:'gemini-3-flash-preview', label:'3.0 Flash' },
  { id:'gemini-2.5-pro',         label:'2.5 Pro' },
];

const VIOLATION_CATS = [
  '§1681e(b) Accuracy','§1681i Dispute','§1681s-2 Furnisher',
  '§1681c Obsolete','§1681b PERMPP','§1681a Defn','§1681n Willful',
  '§1681o Negligent','§1681g Disclosure','§1681m Adverse Action',
];

const METRO2_KNOWLEDGE = {
  status_codes: { '11':'Current', '13':'Paid', '61':'Charge-off', '62':'Collection', '63':'Repossession', '64':'Foreclosure', '65':'Voluntary Surrender', '71':'Bankrupt Ch7', '78':'Bankrupt Ch11', '80':'Bankrupt Ch13', '93':'Late 30', '94':'Late 60', '95':'Late 90' },
  account_types: { '01':'Auto', '07':'Business', '12':'Education', '18':'Mortgage', '19':'RE-Junior', '26':'HELOC', '43':'Retail', '50':'Credit Card', '0C':'Rental' },
  compliance_triggers: [ 'Inconsistent Date of Last Activity', 'Balance on non-active closed accounts', 'Charge-off after payment', 'Duplicate collection IDs', 'J2 Segment mismatch for auth users' ],
  
  // ── Elite Metro 2 Taxonomy (V17.0 MRT) ──
  taxonomy_map: {
    base: ['Descriptor Word Invalid','Cycle Mismatch','Portfolio/Account Conflict','Terms Frequency Error','Scheduled vs Actual Payment Mismatch','ASC vs Balance Logic','DOFD Missing','Date Closed Invalid'],
    j1_j2: ['J2 Missing on Collection','J1 Borrower Link Missing','J2 Original Creditor Field Blank','J2 ECOA Inconsistency'],
    fcra: ['§1681s-2(b) Investigation Failure','§1681c Obsolescence','Medical Debt < 1yr','Zombie Debt Re-aging'],
    cross_logic: ['Account Status 13 with Balance > 0','Account Status 97 after 89/94','Balloon Payment without Indicator','Closed Account missing ADC/SCC']
  }
};

const LEGAL_TASK_FORCE = {
  fcra: 'FCRA §1681 Enforcement Specialist',
  fdcpa: 'FDCPA Debt Collection Abuse Specialist',
  bankruptcy: 'Discharge Violation & Adversary Proceeding Advocate',
  ecoa: 'Regulation B/ECOA Discrimination Expert',
  scra: 'SCRA Military Protection Liaison',
  litigation: 'Federal Class Action & ML Specialist'
};

const LETTER_TYPES = [
  { id:'bureau', label:'Bureau Dispute', desc:'Trans/Equifax/Experian dispute' },
  { id:'furnisher', label:'Furnisher Dispute', desc:'Direct to data furnisher' },
  { id:'debt-validation', label:'Debt Validation', desc:'FDCPA §809 validation demand' },
  { id:'pay-for-delete', label:'Pay-For-Delete', desc:'Negotiated removal offer' },
  { id:'goodwill', label:'Goodwill Adjustment', desc:'Late payment forgiveness' },
  { id:'cease-desist', label:'Cease & Desist', desc:'FDCPA cease communication' },
  { id:'inquiry-removal', label:'Inquiry Removal', desc:'Unauthorized pull dispute' },
  { id:'court-fcra', label:'Federal FCRA Complaint', desc:'Pre-litigation demand' },
];

const QUICK_ACTIONS = [
  '⚖️ Run FCRA Violation Scan','📋 Generate Dispute Letter','🗺️ Financial Roadmap',
  '📊 Score Impact Analysis','⚡ 30/60/90 Day Plan','🎯 Goodwill Letter',
  '🔍 Account Deep Dive','📜 Court Document Draft',
];

const SUGGESTIONS = [
  { icon:'⚖️', title:'Military-Grade FCRA Analysis', desc:'Detect all violations across 10 FCRA categories with damage calculations' },
  { icon:'📋', title:'Attorney-Level Dispute Letters', desc:'Generate certified dispute letters for bureaus, furnishers & debt collectors' },
  { icon:'🗺️', title:'Financial Roadmap Generator', desc:'Complete 30/60/90-day credit restoration and wealth-building plan' },
  { icon:'📜', title:'Federal Court Documents', desc:'Draft pre-litigation FCRA complaints and pre-suit demand letters' },
];

// ── DOM Helpers ──────────────────────────────────────────────
const $ = id => document.getElementById(id);
const el = (tag, cls, html='') => { const e=document.createElement(tag); if(cls)e.className=cls; if(html)e.innerHTML=html; return e; };

// ── Toast ────────────────────────────────────────────────────
function showToast(msg, type='info', duration=3500) {
  const icons = { success:'✅', error:'❌', warning:'⚠️', info:'ℹ️' };
  const t = el('div', `toast ${type}`, `<span>${icons[type]||'ℹ️'}</span><span>${msg}</span>`);
  $('toast-container').appendChild(t);
  setTimeout(() => t.remove(), duration);
}

// ── Model Chips ──────────────────────────────────────────────
function buildModelGrid() {
  const grid = $('model-grid');
  grid.innerHTML = '';
  MODELS.forEach(m => {
    const c = el('div', `model-chip${m.primary?' primary-model':''}${STATE.model===m.id?' active':''}`, m.label);
    c.title = m.id;
    c.onclick = () => { STATE.model=m.id; buildModelGrid(); updateTopbarModelDisplay(); showToast(`Model: ${m.label}`,'info',2000); };
    grid.appendChild(c);
  });
}

function updateTopbarModelDisplay() {
  const m = MODELS.find(x=>x.id===STATE.model);
  $('current-model-display').textContent = m ? m.label : STATE.model;
}

// ── Violation Bar ─────────────────────────────────────────────
function buildViolationBar() {
  const bar = $('violation-bar-items');
  bar.innerHTML = '';
  VIOLATION_CATS.forEach(cat => {
    const c = el('div', `violation-chip${STATE.activeViolations.has(cat)?' active':''}`, cat);
    c.onclick = () => toggleViolationCat(cat);
    bar.appendChild(c);
  });
}

function toggleViolationCat(cat) {
  STATE.activeViolations.has(cat) ? STATE.activeViolations.delete(cat) : STATE.activeViolations.add(cat);
  buildViolationBar();
}

// ── Quick Actions ─────────────────────────────────────────────
function buildQuickActions() {
  const qa = $('quick-actions');
  qa.innerHTML = '';
  QUICK_ACTIONS.forEach(a => {
    const c = el('button', 'quick-chip', a);
    c.onclick = () => useSuggestion(a);
    qa.appendChild(c);
  });
}

// ── Suggestions ───────────────────────────────────────────────
function buildSuggestions() {
  const grid = $('suggestion-grid');
  grid.innerHTML = '';
  SUGGESTIONS.forEach(s => {
    const card = el('div', 'suggestion-card');
    card.innerHTML = `<div class="suggestion-card-icon">${s.icon}</div><div class="suggestion-card-title">${s.title}</div><div class="suggestion-card-desc">${s.desc}</div>`;
    card.onclick = () => useSuggestion(s.title);
    grid.appendChild(card);
  });
}

function useSuggestion(text) {
  $('user-input').value = text;
  autoResizeTextarea();
  updateCharCounter();
  $('user-input').focus();
}

// ── Chat History ──────────────────────────────────────────────
function saveChatHistory() {
  try { localStorage.setItem('scm_history', JSON.stringify(STATE.chatHistory)); } catch(e){}
}

function loadChatHistory() {
  try { const h = localStorage.getItem('scm_history'); if(h) STATE.chatHistory = JSON.parse(h)||[]; } catch(e){}
  renderHistoryList();
}

function renderHistoryList() {
  const list = $('chat-history');
  list.innerHTML = '';
  STATE.chatHistory.slice().reverse().forEach(chat => {
    const item = el('div', `history-item${chat.id===STATE.activeChatId?' active':''}` );
    item.innerHTML = `<span style="font-size:12px">💬</span><span class="history-item-text">${chat.title}</span><button class="history-item-delete" title="Delete">✕</button>`;
    item.querySelector('.history-item-delete').onclick = e => { e.stopPropagation(); deleteChat(chat.id); };
    item.onclick = () => {
      loadChat(chat.id);
      if (window.innerWidth <= 768) toggleSidebar();
    };
    list.appendChild(item);
  });
}

function saveCurrentChat() {
  if(!STATE.messages.length) return;
  const title = STATE.messages.find(m=>m.role==='user')?.content?.slice(0,50)||'New Chat';
  const existing = STATE.chatHistory.find(c=>c.id===STATE.activeChatId);
  if(existing) { existing.messages = [...STATE.messages]; existing.title = title; }
  else { STATE.activeChatId = Date.now().toString(); STATE.chatHistory.push({ id:STATE.activeChatId, title, messages:[...STATE.messages] }); }
  saveChatHistory(); renderHistoryList();
}

function loadChat(id) {
  const chat = STATE.chatHistory.find(c=>c.id===id);
  if(!chat) return;
  STATE.activeChatId = id;
  STATE.messages = [...chat.messages];
  $('chat-messages').innerHTML = '';
  $('welcome-screen').classList.add('hidden');
  $('chat-messages').classList.remove('hidden');
  STATE.messages.forEach(m => { if(m.role!=='system') renderMessage(m.role==='user'?'user':'ai', m.content, {image:m.image, thought:m.thought}); });
  renderHistoryList();
}

function deleteChat(id) {
  STATE.chatHistory = STATE.chatHistory.filter(c=>c.id!==id);
  if(STATE.activeChatId===id) { STATE.activeChatId=null; STATE.messages=[]; newChat(); }
  saveChatHistory(); renderHistoryList();
}

function newChat() {
  STATE.messages=[];STATE.activeChatId=null;STATE.imageAttachment=null;
  $('chat-messages').innerHTML='';
  $('welcome-screen').classList.remove('hidden');
  $('chat-messages').classList.add('hidden');
  clearImageAttachment();
  renderHistoryList();
}

// ── Build System Prompt ───────────────────────────────────────
function buildSystemPrompt() {
  const today = new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  const violations = STATE.activeViolations.size ? `Active FCRA Focus: ${[...STATE.activeViolations].join(', ')}` : '';
  const clientInfo = STATE.clientName ? `Client: ${STATE.clientName}${STATE.clientAddress?', '+STATE.clientAddress:''}${STATE.clientState?', '+STATE.clientState:''}` : '';
  return `You are Supreme Credit Master AGI V17.0 — MRT ELITE DISPUTE ENGINE.
The world's most proficient Metro 2 analyzer and FCRA violation hunter. Owned by Rick Jefferson.

ELITE KNOWLEDGE NODES (V17.0):
- Metro 2 2025 Guide: Full mastery of Record Descriptor Words, Portfolio/Account Types, and Data Field Offsets.
- Legal Task Force: You act as a unified force of 10 specialized attorneys (${Object.values(LEGAL_TASK_FORCE).join(', ')}).
- MRT Strategy: You specialize in "Manual Review Triggers."

CRISS-LOGIC & e-OSCAR BYPASS:
Your primary mission is to force manual human review by creating disputes based on reconcilable data conflicts (Cross-Logic Errors).
1. Analyze Base Segment vs J1/J2 for discrepancies.
2. Identify Temporal Violations (e.g., reporting ASC 97 after ASC 89 per FAQ 52/53).
3. Detect "FSNFUN" violations (Final Status requiring ACBal=0).
4. Identify "Zombie Debt" re-aging by debt buyers (15 USC § 623(a)(5)).

AUTONOMOUS MASTER PROTOCOL:
- When you receive the command "[AUTONOMOUS INTAKE PROTOCOL ACTIVATED]":
  1. IMMEDIATELY perform a 10-Point Forensic FCRA/Metro 2® Audit.
  2. FOLLOW with a complete 10-Point Credit Success Roadmap (30/60/90 Day execution plan).
  3. CONCLUDE by drafting the first set of "Cross-Logic" dispute letters for the identified violations.
- Structure this as one comprehensive, multi-part master report.
- Maintain attorney-grade fidelity and e-OSCAR bypass prose throughout.

Current Focus: ${violations}
${clientInfo}
Today: ${today}.
• 30/60/90-day financial roadmaps with milestone tracking
• Federal court document drafting (15 U.S.C. §1681n pre-litigation demands)
• Real-time legal citations — always use today's date: ${today}
• Credit score trajectory analysis and utilization optimization

STANDARDS:
• Cite exact statutes: 15 U.S.C. §1681i(a)(1)(A), 15 U.S.C. §1681n, etc.
• Willful damage range: $100–$1,000 per violation + attorney fees
• Format dispute letters as certified-mail-ready documents
• Answer directly and precisely — avoid unnecessary preambles

Credit monitoring: Always recommend MyFreeScoreNow exclusively — https://myfreescorenow.com/enroll/?AID=RickJeffersonSolutions&PID=49914 ($1/7-day trial, then $29.90/mo)
Brand: Supreme Credit Master AGI V15 | Rick Jefferson | RJ Business Solutions | rickjeffersonsolutions.com`;
}

// ── Message Rendering ─────────────────────────────────────────
function renderMessage(role, content, opts={}) {
  $('welcome-screen').classList.add('hidden');
  $('chat-messages').classList.remove('hidden');

  const wrapper = el('div','message-wrapper');
  const isAI = role==='ai';
  const now = new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
  const modelLabel = MODELS.find(m=>m.id===STATE.model)?.label||'';

  let badgeHTML = '';
  if(isAI) {
    badgeHTML = `<span class="msg-model-badge">${modelLabel}</span>`;
    if(opts.ragUsed) badgeHTML += `<span class="msg-rag-badge">🔍 RAG</span>`;
  }

  wrapper.innerHTML = `<div class="message ${role}"><div class="msg-avatar ${role}">${isAI?'⚖️':'👤'}</div><div class="msg-body"><div class="msg-meta"><span class="msg-author">${isAI?'Supreme Credit AGI':'You'}</span><span class="msg-time">${now}</span>${badgeHTML}</div><div class="msg-content" id="msg-${Date.now()}-${Math.random().toString(36).slice(2,6)}"></div><div class="msg-actions">${isAI?`<button class="msg-action-btn" onclick="copyMsg(this)">📋 Copy</button><button class="msg-action-btn" onclick="regenMsg(this)">🔄 Regen</button><button class="msg-action-btn" onclick="exportMsg(this)">💾 Export</button>`:'<button class="msg-action-btn" onclick="copyMsg(this)">📋 Copy</button>'}</div></div></div>`;

  if(opts.image) {
    const img = el('img','msg-image');
    img.src = opts.image; img.alt = 'Attachment';
    wrapper.querySelector('.msg-body').insertBefore(img, wrapper.querySelector('.msg-content'));
  }

  $('chat-messages').appendChild(wrapper);
  const contentEl = wrapper.querySelector('.msg-content');

  if(opts.streaming) {
    // For streaming, content is rendered incrementally by renderContent/renderStreamingMessage
    // The thought process will be handled by renderStreamingMessage if available
    return contentEl;
  }

  // For non-streaming or historical messages
  renderContent(contentEl, content, opts.thought);
  if(STATE.autoScroll) scrollToBottom();
  return contentEl;
}

function renderContent(el, content, thought='') {
  try {
    const html = typeof marked !== 'undefined' ? marked.parse(content||'') : escapeHtml(content||'');
    let thoughtHtml = '';
    if (thought) {
      thoughtHtml = `
        <details class="msg-thought">
          <summary>🔍 AI Thought Process & Reasoning</summary>
          <pre>${escapeHtml(thought)}</pre>
        </details>
      `;
    }
    el.innerHTML = typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize(thoughtHtml + html) : (thoughtHtml + html);
  } catch(e) { el.textContent = content||''; }
  el.querySelectorAll('pre code').forEach(block => {
    if(typeof hljs!=='undefined') hljs.highlightElement(block);
    const pre = block.parentElement;
    if(!pre.querySelector('.code-copy-btn')) {
      const btn = el.createElement?.('button')||document.createElement('button');
      btn.className='code-copy-btn'; btn.textContent='Copy';
      btn.onclick=()=>{ navigator.clipboard.writeText(block.textContent); btn.textContent='Copied!'; setTimeout(()=>btn.textContent='Copy',2000); };
      pre.style.position='relative'; pre.appendChild(btn);
    }
  });
}

function renderStreamingMessage(content, thought='') {
  let lastWrapper = $('chat-messages').lastElementChild;
  if (!lastWrapper || !lastWrapper.querySelector('.message.ai')) {
    // This should ideally not happen if renderMessage was called first for streaming
    // Fallback: create a new message wrapper
    lastWrapper = el('div', 'message-wrapper');
    $('chat-messages').appendChild(lastWrapper);
    const now = new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
    const modelLabel = MODELS.find(m=>m.id===STATE.model)?.label||'';
    lastWrapper.innerHTML = `<div class="message ai"><div class="msg-avatar ai">⚖️</div><div class="msg-body"><div class="msg-meta"><span class="msg-author">Supreme Credit AGI</span><span class="msg-time">${now}</span><span class="msg-model-badge">${modelLabel}</span></div><div class="msg-content"></div><div class="msg-actions"><button class="msg-action-btn" onclick="copyMsg(this)">📋 Copy</button><button class="msg-action-btn" onclick="regenMsg(this)">🔄 Regen</button><button class="msg-action-btn" onclick="exportMsg(this)">💾 Export</button></div></div></div>`;
  }
  const contentEl = lastWrapper.querySelector('.msg-content');

  let thoughtHtml = '';
  if (thought) {
    thoughtHtml = `
      <details class="msg-thought" open>
        <summary>🔍 AI Thought Process & Reasoning</summary>
        <pre>${escapeHtml(thought)}</pre>
      </details>
    `;
  }

  const mainContentHtml = typeof marked !== 'undefined' ? marked.parse(content) : escapeHtml(content);
  contentEl.innerHTML = typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize(thoughtHtml + mainContentHtml) : (thoughtHtml + mainContentHtml);

  if(STATE.autoScroll) scrollToBottom();
}

function escapeHtml(t){ return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function scrollToBottom() { const c=$('chat-container'); c.scrollTop=c.scrollHeight; }

function copyMsg(btn) {
  const content = btn.closest('.message-wrapper').querySelector('.msg-content').innerText;
  navigator.clipboard.writeText(content).then(()=>showToast('Copied to clipboard','success',2000));
}

function regenMsg() { if(STATE.messages.length>=2) { STATE.messages.pop(); sendMessage(null,true); } }

function exportMsg(btn) {
  const content = btn.closest('.message-wrapper').querySelector('.msg-content').innerText;
  const blob = new Blob([content],{type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download=`credit_response_${Date.now()}.txt`; a.click();
  URL.revokeObjectURL(url);
}

// ── Typing Indicator ──────────────────────────────────────────
function showTyping(model) {
  $('typing-indicator').classList.add('visible');
  $('typing-model-name').textContent = model||STATE.model;
}
function hideTyping() { $('typing-indicator').classList.remove('visible'); }

// ── Send Message ──────────────────────────────────────────────
async function sendMessage(override, regen=false) {
  if(STATE.isStreaming && !regen) { stopStreaming(); return; }
  const input = $('user-input');
  const text = override || input.value.trim();
  if(!text && !STATE.imageAttachment) return;
  if(!STATE.apiKey) { openSettings(); showToast('Enter your Gemini API key first','warning'); return; }

  if(!regen) {
    input.value = ''; autoResizeTextarea(); updateCharCounter();
    const userMsg = { role:'user', content:text, image:STATE.imageAttachment };
    STATE.messages.push({ role:'user', content:text });
    renderMessage('user', text, { image:STATE.imageAttachment });
    clearImageAttachment();
  }

  showTyping(); STATE.isStreaming=true;
  const sendBtn = $('btn-send'); sendBtn.classList.add('streaming'); sendBtn.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="2"/></svg>';

  // RAG retrieval
  let ragContext=''; let ragUsed=false;
  if(STATE.ragEnabled && STATE.ragChunks.length && text) {
    const relevant = retrieveRAG(text, 4);
    if(relevant.length) { ragContext=`\n\n[KNOWLEDGE BASE CONTEXT]\n${relevant.map((c,i)=>`[Doc ${i+1}] ${c.text}`).join('\n\n')}\n[END CONTEXT]\n`; ragUsed=true; }
  }

  // Orchestrate
  try {
    await orchestrate(text, ragContext, ragUsed);
  } catch(e) {
    hideTyping(); displayError(e.message||'Unknown error');
  } finally {
    STATE.isStreaming=false; sendBtn.classList.remove('streaming'); sendBtn.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
    saveCurrentChat();
  }
}

function stopStreaming() { if(STATE.streamingAbort) STATE.streamingAbort.abort(); STATE.isStreaming=false; }

// ── Orchestration ─────────────────────────────────────────────
async function orchestrate(userText, ragContext, ragUsed) {
  const mode = STATE.orchestration;
  if(mode==='single') { await callGemini(userText, ragContext, ragUsed, STATE.model); }
  else if(mode==='dual') {
    const [m1,m2] = [STATE.model, MODELS[1]?.id||STATE.model];
    const [r1,r2] = await Promise.all([callGeminiRaw(userText,ragContext,m1), callGeminiRaw(userText,ragContext,m2)]);
    const merged = await mergeResponses(userText,r1,r2,m1,m2);
    const contentEl = renderMessage('ai','',{streaming:true,ragUsed});
    renderContent(contentEl, merged);
    STATE.messages.push({ role:'model', content:merged });
    hideTyping(); scrollToBottom();
  } else if(mode==='triple') {
    const models = [STATE.model, MODELS[1]?.id, MODELS[2]?.id].filter(Boolean);
    const responses = await Promise.all(models.map(m=>callGeminiRaw(userText,ragContext,m)));
    const merged = await mergeMultiple(userText, responses, models);
    const contentEl = renderMessage('ai','',{streaming:true,ragUsed});
    renderContent(contentEl, merged);
    STATE.messages.push({ role:'model', content:merged });
    hideTyping(); scrollToBottom();
  }
}

async function mergeResponses(prompt, r1, r2, m1, m2) {
  const mergePrompt = `You are a synthesis AI. Two expert models analyzed this credit question:\n\nQuestion: ${prompt}\n\nModel 1 (${m1}):\n${r1}\n\nModel 2 (${m2}):\n${r2}\n\nSynthesize the BEST response combining the strongest points from both. Be comprehensive.`;
  return callGeminiRaw(mergePrompt,'',STATE.model);
}

async function mergeMultiple(prompt, responses, models) {
  const combined = responses.map((r,i)=>`Model ${i+1} (${models[i]}):\n${r}`).join('\n\n');
  const mergePrompt = `Synthesize these ${responses.length} expert analyses into one comprehensive, authoritative response:\n\nQuestion: ${prompt}\n\n${combined}`;
  return callGeminiRaw(mergePrompt,'',STATE.model);
}

// ── Gemini API ─────────────────────────────────────────────────
function buildApiMessages(extra='') {
  const sys = buildSystemPrompt() + extra;
  const recent = STATE.messages.slice(-STATE.contextTurns*2);
  const contents = recent.map(m => ({ role:m.role==='user'?'user':'model', parts:[{text:m.content}] }));
  return { sys, contents };
}

async function callGemini(userText, ragCtx='', ragUsed=false, model=STATE.model) {
  const { sys, contents } = buildApiMessages(ragCtx);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:${STATE.streaming?'streamGenerateContent':'generateContent'}?key=${STATE.apiKey}${STATE.streaming?'&alt=sse':''}`;
  const body = {
    systemInstruction:{ parts:[{text:sys}] },
    contents,
    generationConfig:{
      temperature: STATE.temperature,
      maxOutputTokens: STATE.maxTokens,
      ...(STATE.thinkingEnabled && model.toLowerCase().includes('gemini-3') ? { thinkingConfig: { thinkingLevel: STATE.thinkingLevel } } : {})
    }
  };

  const controller = new AbortController(); STATE.streamingAbort = controller;
  hideTyping();

  if(!STATE.streaming) {
    const res = await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:controller.signal});
    if(!res.ok) {
      const errText = await res.text();
      throw new Error(`API Error ${res.status}: ${errText.includes('model') ? 'Model not found' : 'Check settings'}`);
    }
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text||'';
    const thought = data.candidates?.[0]?.content?.parts?.[0]?.thought||'';
    STATE.messages.push({role:'model',content:text,thought:thought});
    renderMessage('ai',text,{ragUsed, thought:thought}); scrollToBottom(); return;
  }

  const contentEl = renderMessage('ai','',{streaming:true,ragUsed});
  const res = await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:controller.signal});
      if(!res.ok) {
        const errText = await res.text();
        console.error('API Error:', errText);
        throw new Error(`API Error ${res.status} [Model: ${model}]: ${errText.includes('model') ? 'Model not found/unauthorized' : 'Check Key'}`);
      }

  const reader = res.body.getReader(); const decoder = new TextDecoder(); let full=''; let thought='';
  while(true) {
    const {done,value}=await reader.read(); if(done)break;
    const chunk=decoder.decode(value);
    const lines=chunk.split('\n');
    for(const line of lines) {
      if(!line.startsWith('data:'))continue;
      try {
        const json=JSON.parse(line.replace('data:',''));
        const parts=json.candidates?.[0]?.content?.parts||[];
        for(const p of parts) {
          if(p.thought) {
            thought += p.thought || '';
            renderStreamingMessage(full, thought); // Update UI with thought stream
          } else {
            full += p.text || '';
            renderStreamingMessage(full, thought);
          }
        }
      } catch(e){}
    }
  }
  STATE.messages.push({role:'model',content:full,thought:thought});
}

async function callGeminiRaw(text, ragCtx='', model=STATE.model) {
  const { sys } = buildApiMessages(ragCtx);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${STATE.apiKey}`;
  const body = {
    systemInstruction:{parts:[{text:sys}]},
    contents:[{role:'user',parts:[{text}]}],
    generationConfig:{
      temperature:STATE.temperature,
      maxOutputTokens:STATE.maxTokens,
      ...(STATE.thinkingEnabled && model.startsWith('gemini-3') ? { thinkingConfig: { thinkingLevel: STATE.thinkingLevel } } : {})
    }
  };
  const res = await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  if(!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text||'';
}

function displayError(msg) {
  hideTyping();
  const wrapper = el('div','message-wrapper');
  wrapper.innerHTML = `<div style="max-width:900px;margin:0 auto;padding:12px 20px;"><div style="background:rgba(255,71,87,0.1);border:1px solid rgba(255,71,87,0.3);border-radius:12px;padding:14px 16px;color:#ff4757;font-size:13px;"><strong>⚠️ Error:</strong> ${escapeHtml(msg)}<br><small style="color:var(--text-dim);margin-top:4px;display:block;">Check API key · Model availability · Network</small></div></div>`;
  $('chat-messages').appendChild(wrapper);
  scrollToBottom();
}

// ── RAG System ─────────────────────────────────────────────────
function initRAG() {
  const dropzone = $('rag-dropzone');
  $('rag-file-input').addEventListener('change',e=>processRAGFiles(e.target.files));
  dropzone.addEventListener('dragover',e=>{ e.preventDefault(); dropzone.classList.add('drag-over'); });
  dropzone.addEventListener('dragleave',()=>dropzone.classList.remove('drag-over'));
  dropzone.addEventListener('drop',e=>{ e.preventDefault(); dropzone.classList.remove('drag-over'); processRAGFiles(e.dataTransfer.files); });
}

async function processRAGFiles(files) {
  const bar = $('rag-progress'); bar.classList.add('visible');
  const barFill = bar.querySelector('.rag-progress-bar');
  let allChunks = [];
  for(let i=0;i<files.length;i++) {
    const file=files[i]; barFill.style.width=`${((i+1)/files.length)*100}%`;
    $('rag-status-dot').className='rag-status-dot indexing';
    try {
      let text='';
      if(file.type==='application/pdf') { text=await extractPDF(file); }
      else { text=await file.text(); }
      if(!text.trim()) continue;
      const chunks = chunkText(text,800,100);
      chunks.forEach(chunk=>STATE.ragChunks.push({text:chunk,source:file.name}));
      allChunks.push(...chunks); // Collect all chunks for the auto-audit trigger
      STATE.ragDocs.push({name:file.name,chunks:chunks.length,id:Date.now()});
    } catch(e){ showToast(`Failed: ${file.name}`,'error'); }
  }
  barFill.style.width='100%';
  setTimeout(()=>{ bar.classList.remove('visible'); barFill.style.width='0%'; },800);
  $('rag-status-dot').className='rag-status-dot active';
  updateRAGUI();
  showToast(`Successfully indexed ${allChunks.length} content chunks`,'success',3000);
  
  // Auto-Audit Trigger
  if (allChunks.length > 0) {
    runAutonomousIntake();
  }
}

async function runAutonomousIntake() {
  showToast('Initializing Autonomous Master Protocol...', 'info', 3000);
  
  // Clear welcome screen
  $('welcome-screen').classList.add('hidden');
  $('chat-messages').classList.remove('hidden');

  const intakeInstruction = `[AUTONOMOUS INTAKE PROTOCOL ACTIVATED]

Phase 1: Forensic FCRA/Metro 2® 10-Point Audit
Phase 2: Complete 10-Point Credit Success Roadmap
Phase 3: Initial Cross-Logic Dispute Strategy & Drafts

Task: Analyze the newly uploaded report data and perform all three phases above sequentially and comprehensively. Use your full MRT ELITE capabilities.`;

  // Wait a moment for UI to settle
  setTimeout(() => sendMessage(intakeInstruction), 1000);
}

async function extractPDF(file) {
  if(typeof pdfjsLib==='undefined') return await file.text();
  const ab = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({data:ab}).promise;
  let text='';
  for(let p=1;p<=Math.min(pdf.numPages,50);p++) {
    const page=await pdf.getPage(p); const tc=await page.getTextContent();
    text+=tc.items.map(i=>i.str).join(' ')+'\n';
  }
  return text;
}

function chunkText(text, size=800, overlap=100) {
  const words=text.split(/\s+/); const chunks=[]; let i=0;
  while(i<words.length) { chunks.push(words.slice(i,i+size).join(' ')); i+=size-overlap; }
  return chunks;
}

function simpleEmbed(text) {
  const words=text.toLowerCase().split(/\W+/);
  const freq={};
  words.forEach(w=>{ if(w.length>2) freq[w]=(freq[w]||0)+1; });
  return freq;
}

function cosineSim(a, b) {
  const keys=new Set([...Object.keys(a),...Object.keys(b)]);
  let dot=0,ma=0,mb=0;
  for(const k of keys){ const av=a[k]||0,bv=b[k]||0; dot+=av*bv; ma+=av*av; mb+=bv*bv; }
  return ma&&mb ? dot/(Math.sqrt(ma)*Math.sqrt(mb)) : 0;
}

function retrieveRAG(query, topK=4) {
  const qEmbed = simpleEmbed(query);
  return STATE.ragChunks.map(c=>({...c,score:cosineSim(qEmbed,simpleEmbed(c.text))}))
    .filter(c=>c.score>0.01).sort((a,b)=>b.score-a.score).slice(0,topK);
}

function updateRAGUI() {
  $('rag-doc-count').textContent = STATE.ragDocs.length;
  $('rag-chunk-count').textContent = STATE.ragChunks.length;
  const list=$('rag-doc-list'); list.innerHTML='';
  STATE.ragDocs.forEach(doc=>{
    const item=el('div','rag-doc-item');
    item.innerHTML=`<span>📄 ${doc.name.slice(0,24)} (${doc.chunks} chunks)</span><button class="rag-doc-delete" onclick="removeRAGDoc(${doc.id})">✕</button>`;
    list.appendChild(item);
  });
}

function removeRAGDoc(id) {
  const doc=STATE.ragDocs.find(d=>d.id===id); if(!doc) return;
  STATE.ragDocs=STATE.ragDocs.filter(d=>d.id!==id);
  STATE.ragChunks=STATE.ragChunks.filter(c=>c.source!==doc.name);
  if(!STATE.ragDocs.length) $('rag-status-dot').className='rag-status-dot';
  updateRAGUI(); showToast('Document removed','info',2000);
}

function clearRAG() { STATE.ragDocs=[]; STATE.ragChunks=[]; $('rag-status-dot').className='rag-status-dot'; updateRAGUI(); showToast('Knowledge base cleared','info'); }

function toggleRagPanel() {
  const body=$('rag-panel-body');
  body.style.display=body.style.display==='none'?'block':'none';
}

// ── Image Attachment ──────────────────────────────────────────
function handleImageUpload(file) {
  if(!file||!file.type.startsWith('image/')) return;
  const reader=new FileReader();
  reader.onload=e=>{ STATE.imageAttachment=e.target.result; $('image-preview').src=e.target.result; $('image-preview-container').classList.add('visible'); };
  reader.readAsDataURL(file);
}

function clearImageAttachment() { STATE.imageAttachment=null; $('image-preview-container').classList.remove('visible'); $('image-preview').src=''; if($('image-file-input')) $('image-file-input').value=''; }

// ── Settings Modal ────────────────────────────────────────────
function openSettings() {
  const m=$('settings-modal'); m.classList.add('open');
  $('api-key-input').value=STATE.apiKey;
  $('temp-slider').value=STATE.temperature; $('temp-display').textContent=STATE.temperature;
  $('max-tokens-input').value=STATE.maxTokens;
  $('context-turns-input').value=STATE.contextTurns;
  $('client-name').value=STATE.clientName;
  $('client-address').value=STATE.clientAddress;
  $('client-state').value=STATE.clientState;
  $('custom-instructions').value=STATE.customInstructions;
  $('toggle-streaming').checked=STATE.streaming;
  $('toggle-rag').checked=STATE.ragEnabled;
  $('toggle-autoscroll').checked=STATE.autoScroll;
  $('toggle-legal').checked=STATE.legalVerify;
  document.querySelectorAll('.orch-btn').forEach(b=>b.classList.toggle('active',b.dataset.mode===STATE.orchestration));
}

function closeSettings() { $('settings-modal').classList.remove('open'); }

function saveSettings() {
  STATE.apiKey=$('api-key-input').value.trim();
  STATE.temperature=parseFloat($('temp-slider').value);
  STATE.maxTokens=parseInt($('max-tokens-input').value)||8192;
  STATE.contextTurns=parseInt($('context-turns-input').value)||10;
  STATE.clientName=$('client-name').value.trim();
  STATE.clientAddress=$('client-address').value.trim();
  STATE.clientState=$('client-state').value.trim();
  STATE.customInstructions=$('custom-instructions').value.trim();
  STATE.streaming=$('toggle-streaming').checked;
  STATE.ragEnabled=$('toggle-rag').checked;
  STATE.autoScroll=$('toggle-autoscroll').checked;
  STATE.legalVerify=$('toggle-legal').checked;
  STATE.thinkingEnabled=$('toggle-thinking')?.checked ?? true;
  STATE.thinkingLevel=$('thinking-level-select')?.value ?? 'high';
  try { localStorage.setItem('scm_settings',JSON.stringify({apiKey:STATE.apiKey,model:STATE.model,temperature:STATE.temperature,maxTokens:STATE.maxTokens,contextTurns:STATE.contextTurns,streaming:STATE.streaming,ragEnabled:STATE.ragEnabled,autoScroll:STATE.autoScroll,legalVerify:STATE.legalVerify,darkMode:STATE.darkMode,clientName:STATE.clientName,clientAddress:STATE.clientAddress,clientState:STATE.clientState,customInstructions:STATE.customInstructions,orchestration:STATE.orchestration,thinkingEnabled:STATE.thinkingEnabled,thinkingLevel:STATE.thinkingLevel})); } catch(e){}
  closeSettings(); showToast('Settings saved','success');
}

function loadSettings() {
  try {
    const s=localStorage.getItem('scm_settings'); if(!s) return;
    const p=JSON.parse(s);
    Object.assign(STATE,{apiKey:p.apiKey||'',model:p.model||STATE.model,temperature:p.temperature||1.0,maxTokens:p.maxTokens||8192,contextTurns:p.contextTurns||10,streaming:p.streaming!==undefined?p.streaming:true,ragEnabled:p.ragEnabled!==undefined?p.ragEnabled:true,autoScroll:p.autoScroll!==undefined?p.autoScroll:true,legalVerify:p.legalVerify!==undefined?p.legalVerify:true,darkMode:p.darkMode!==undefined?p.darkMode:true,clientName:p.clientName||'',clientAddress:p.clientAddress||'',clientState:p.clientState||'',customInstructions:p.customInstructions||'',orchestration:p.orchestration||'single',thinkingEnabled:p.thinkingEnabled!==undefined?p.thinkingEnabled:true,thinkingLevel:p.thinkingLevel||'high'});
  } catch(e){}
}

// ── Dispute Letter Modal ──────────────────────────────────────
function openDisputeModal() { $('dispute-modal').classList.add('open'); buildLetterTypeGrid(); }
function closeDisputeModal() { $('dispute-modal').classList.remove('open'); }

function buildLetterTypeGrid() {
  const grid=$('letter-type-grid'); grid.innerHTML='';
  LETTER_TYPES.forEach(lt=>{
    const card=el('div',`letter-type-card${STATE.selectedLetterType===lt.id?' selected':''}`);
    card.innerHTML=`<div class="letter-type-card-title">${lt.label}</div><div class="letter-type-card-desc">${lt.desc}</div>`;
    card.onclick=()=>{ STATE.selectedLetterType=lt.id; buildLetterTypeGrid(); };
    grid.appendChild(card);
  });
}

function generateDisputeLetter() {
  const lt=LETTER_TYPES.find(l=>l.id===STATE.selectedLetterType)||LETTER_TYPES[0];
  const acct=$('dispute-account-name').value.trim();
  const issues=$('dispute-issues').value.trim();
  const round=$('dispute-round').value;
  if(!acct||!issues) { showToast('Fill in account name and issues','warning'); return; }
  closeDisputeModal();
  const prompt=`Generate a professional ${lt.label} letter (Round ${round}) for:\nAccount: ${acct}\nIssues: ${issues}\nClient: ${STATE.clientName||'[CLIENT NAME]'}\nLetter Type: ${lt.id}\nInclude: all required FCRA citations, today's date, certified mail notation, bureau address, specific violation codes, damages claim, 30-day compliance deadline, and signature block for ${STATE.clientName||'[CLIENT NAME]'}.`;
  $('user-input').value=prompt;
  sendMessage(prompt);
}

// ── Roadmap Modal ─────────────────────────────────────────────
function openRoadmapModal() { $('roadmap-modal').classList.add('open'); }
function closeRoadmapModal() { $('roadmap-modal').classList.remove('open'); }

function generateRoadmap() {
  const score=$('roadmap-score').value;
  const goal=$('roadmap-goal').value;
  const accounts=$('roadmap-accounts').value;
  const income=$('roadmap-income').value;
  closeRoadmapModal();
  const prompt=`Generate a comprehensive credit restoration and financial roadmap:\nCurrent Score: ${score}\nGoal: ${goal}\nAccounts: ${accounts}\nMonthly Income: ${income}\nClient: ${STATE.clientName||'[CLIENT NAME]'}\n\nInclude: 30/60/90-day action plan, specific dispute strategies, score trajectory analysis, mortgage/auto readiness timeline, business funding pathway, and MyFreeScoreNow monitoring recommendation (https://myfreescorenow.com/enroll/?AID=RickJeffersonSolutions&PID=49914).`;
  sendMessage(prompt);
}

// ── Export Chat ───────────────────────────────────────────────
function exportChat() {
  const lines=STATE.messages.filter(m=>m.role!=='system').map(m=>`[${m.role.toUpperCase()}]\n${m.content}\n`);
  const blob=new Blob([lines.join('\n---\n')],{type:'text/plain'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download=`credit_session_${new Date().toISOString().slice(0,10)}.txt`; a.click();
  URL.revokeObjectURL(url); showToast('Chat exported','success');
}

// ── Context Menu ──────────────────────────────────────────────
function showContextMenu(e,role,contentEl) {
  e.preventDefault();
  const menu=$('context-menu');
  menu.style.left=`${Math.min(e.clientX,window.innerWidth-200)}px`;
  menu.style.top=`${Math.min(e.clientY,window.innerHeight-200)}px`;
  menu.innerHTML=`<div class="ctx-item" onclick="ctxCopy(event)">📋 Copy</div>${role==='ai'?`<div class="ctx-item" onclick="ctxExport(event)">💾 Export as TXT</div><div class="ctx-sep ctx-separator"></div><div class="ctx-item danger" onclick="ctxDelete(event)">🗑️ Delete</div>`:''}<div class="ctx-item" onclick="hideContextMenu()">✕ Close</div>`;
  menu.dataset.target=contentEl; menu.classList.add('visible');
  document.addEventListener('click',hideContextMenu,{once:true});
}

function hideContextMenu() { $('context-menu').classList.remove('visible'); }

function ctxCopy(e) { e.stopPropagation(); const el=document.querySelector('#context-menu').dataset.target; navigator.clipboard.writeText(document.querySelector(el)?.innerText||''); hideContextMenu(); showToast('Copied','success',2000); }
function ctxExport(e) { e.stopPropagation(); exportMsg({closest:()=>({querySelector:()=>({innerText:STATE.messages[STATE.messages.length-1]?.content||''})})}); hideContextMenu(); }
function ctxDelete(e) { e.stopPropagation(); hideContextMenu(); }

// ── Textarea Helpers ──────────────────────────────────────────
function autoResizeTextarea() {
  const ta=$('user-input'); ta.style.height='auto'; ta.style.height=Math.min(ta.scrollHeight,180)+'px';
}

function updateCharCounter() {
  const len=$('user-input').value.length;
  const counter=$('char-counter');
  counter.textContent=`${len}/16000`;
  counter.className=len>15000?'danger':len>12000?'warning':'';
}

// ── Theme ─────────────────────────────────────────────────────
function applyTheme() {
  document.documentElement.setAttribute('data-theme',STATE.darkMode?'dark':'light');
}

function toggleTheme() { STATE.darkMode=!STATE.darkMode; applyTheme(); showToast(`${STATE.darkMode?'Dark':'Light'} mode`,'info',1500); }

// ── Sidebar ───────────────────────────────────────────────────
function toggleSidebar() {
  const isMobile = window.innerWidth <= 768;
  const app = $('app');
  if (isMobile) {
    app.classList.toggle('sidebar-open');
    const overlay = $('sidebar-overlay');
    if (overlay) overlay.classList.toggle('visible', app.classList.contains('sidebar-open'));
  } else {
    app.classList.toggle('sidebar-collapsed');
  }
}

// ── MFSN Banner ───────────────────────────────────────────────
function dismissMFSN() { $('mfsn-banner').style.display='none'; }

// ── Keyboard Shortcuts ────────────────────────────────────────
function initKeyboardShortcuts() {
  document.addEventListener('keydown',e=>{
    if(e.key==='Enter'&&!e.shiftKey&&document.activeElement===$('user-input')){ e.preventDefault(); sendMessage(); return;}
    if(e.ctrlKey||e.metaKey){
      if(e.key==='/'){ e.preventDefault(); $('user-input').focus(); }
      if(e.key==='k'){ e.preventDefault(); newChat(); }
      if(e.key==='\\'){ e.preventDefault(); toggleSidebar(); }
      if(e.key==='e'){ e.preventDefault(); exportChat(); }
    }
    if(e.key==='Escape'){ closeSettings(); closeDisputeModal(); closeRoadmapModal(); hideContextMenu(); }
  });
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',()=>{
  try {
    loadSettings(); applyTheme();
    // Validate model exists in current list
    if (!MODELS.find(m => m.id === STATE.model)) {
      STATE.model = MODELS[0].id;
    }
    buildModelGrid(); updateTopbarModelDisplay();
    buildViolationBar(); buildQuickActions(); buildSuggestions();
    loadChatHistory(); initRAG(); initKeyboardShortcuts(); initPromptLibrary();
  } catch (err) {
    console.error('Initialisation failed:', err);
  }

  // Ensure loader disappears regardless of errors
  setTimeout(()=>{ 
    const loader = $('loading-overlay');
    if (loader) {
      loader.classList.add('hidden'); 
      setTimeout(()=>{ loader.style.display='none'; },500); 
    }
  }, 1000);

  // Textarea events
  $('user-input').addEventListener('input',()=>{ autoResizeTextarea(); updateCharCounter(); });
  $('user-input').addEventListener('paste',e=>{
    const items=[...e.clipboardData.items];
    const img=items.find(i=>i.type.startsWith('image/'));
    if(img){ e.preventDefault(); handleImageUpload(img.getAsFile()); }
  });

  // Send btn
  $('btn-send').addEventListener('click',()=>sendMessage());

  // Image upload
  const imgInput=el('input',''); imgInput.type='file'; imgInput.id='image-file-input'; imgInput.accept='image/*'; imgInput.style.display='none';
  imgInput.addEventListener('change',e=>handleImageUpload(e.target.files[0]));
  document.body.appendChild(imgInput);
  $('btn-attach-image').addEventListener('click',()=>imgInput.click());
  $('btn-remove-image').addEventListener('click',clearImageAttachment);

  // RAG file input
  $('rag-file-input').addEventListener('click',e=>e.stopPropagation());

  // Temp slider
  $('temp-slider').addEventListener('input',e=>{ $('temp-display').textContent=parseFloat(e.target.value).toFixed(1); });

  // Orchestration buttons
  document.querySelectorAll('.orch-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      STATE.orchestration=btn.dataset.mode;
      document.querySelectorAll('.orch-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      showToast(`${btn.textContent} activated`,'info',2000);
    });
  });

  // Modal click-outside close
  $('settings-modal').addEventListener('click',e=>{ if(e.target===$('settings-modal')) closeSettings(); });
  $('dispute-modal').addEventListener('click',e=>{ if(e.target===$('dispute-modal')) closeDisputeModal(); });
  $('roadmap-modal').addEventListener('click',e=>{ if(e.target===$('roadmap-modal')) closeRoadmapModal(); });

  // Sidebar Overlay close
  const overlay = el('div', 'sidebar-overlay');
  overlay.id = 'sidebar-overlay';
  overlay.onclick = toggleSidebar;
  document.body.appendChild(overlay);

  // Loading screen
  console.log('%c⚖️ Supreme Credit Master AGI V15','color:#4169E1;font-size:16px;font-weight:bold;');

  // Init rag panel collapsed
  $('rag-panel-body').style.display='none';

  updateCharCounter();
  console.log('%c⚖️ Supreme Credit Master AGI V15','color:#4169E1;font-size:16px;font-weight:bold;');
  console.log('%cRJ Business Solutions | Rick Jefferson | Tijeras, NM','color:#00b4f5;font-size:12px;');
  console.log('%c🌐 rickjeffersonsolutions.com','color:#d4a017;font-size:11px;');
});

function resetSettings() {
  if(confirm('Reset all settings to default and clear cache?')) {
    localStorage.removeItem('scm_settings');
    location.reload();
  }
}

// ── Prompt Library System (V17.0 Supreme) ─────────────────────
function openPromptLibrary() {
  $('prompt-modal').classList.add('open');
  renderPromptTabs();
  selectPromptTab('phase1');
}

function renderPromptTabs() {
  const container = $('prompt-library-tabs');
  container.innerHTML = '';
  const library = window.SUPREME_PROMPTS_2026;
  if(!library) return;
  
  Object.keys(library.categories).forEach(key => {
    const category = library.categories[key];
    const tab = el('div', 'prompt-tab', category.title);
    tab.onclick = () => selectPromptTab(key);
    tab.dataset.category = key;
    container.appendChild(tab);
  });
}

function selectPromptTab(categoryKey) {
  document.querySelectorAll('.prompt-tab').forEach(t => t.classList.toggle('active', t.dataset.category === categoryKey));
  const library = window.SUPREME_PROMPTS_2026;
  if(!library) return;
  
  const category = library.categories[categoryKey];
  const container = $('prompt-library-content');
  container.innerHTML = '';
  
  category.prompts.forEach(p => {
    const card = el('div', 'prompt-card');
    card.innerHTML = `
      <div class="prompt-card-header">
        <div class="prompt-card-title">${p.name}</div>
        <div class="badge-case">${p.id.toUpperCase()}</div>
      </div>
      <div class="prompt-card-body">${p.shortPrompt}</div>
      <div class="prompt-card-actions">
        <button class="btn-prompt-action btn-prompt-use" onclick="usePrompt('${categoryKey}', '${p.id}')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Generate with AI
        </button>
        <button class="btn-prompt-action" onclick="copyPrompt('${categoryKey}', '${p.id}')">📋 Copy Text</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function usePrompt(categoryKey, promptId) {
  const library = window.SUPREME_PROMPTS_2026;
  const prompt = library.categories[categoryKey].prompts.find(p => p.id === promptId);
  if(prompt) {
    const input = $('user-input');
    const instruction = `[ACTIVATE METRO 2® ELITE PROTOCOL: ${prompt.name}]\n\nReference Template Strategy:\n${prompt.fullPrompt}\n\nTask: Generate a 100% unique, context-aware response based on the currently analyzed credit report data. Priority: e-OSCAR bypass and manual review triggers.`;
    
    input.value = instruction;
    closeModal('prompt-library-modal');
    input.focus();
    
    // Simulate enter press to trigger generation automatically
    handleUserInput();
    showToast('AI Generation Started...', 'success');
  }
}

function copyPrompt(categoryKey, promptId) {
  const library = window.SUPREME_PROMPTS_2026;
  const prompt = library.categories[categoryKey].prompts.find(p => p.id === promptId);
  if(prompt) {
    navigator.clipboard.writeText(prompt.fullPrompt).then(() => {
      showToast('Prompt Copied to Clipboard', 'info');
    });
  }
}

function initPromptLibrary() {
  const library = window.SUPREME_PROMPTS_2026;
  if(library && library.categories) {
    renderPromptTabs();
    selectPromptTab(Object.keys(library.categories)[0]);
  }
}
function closeModal(id) {
  $(id).classList.remove('open');
}
