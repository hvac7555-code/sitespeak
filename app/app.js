/* ============================================================
   SiteSpeak — application
   Single-page app. Progress is saved per user in the artifact's
   private cloud store (db) with a local copy; the AI tutor runs
   through the platform's Claude capability (no API keys in the page).
   ============================================================ */
(function () {
  'use strict';
  const C = window.CONTENT;
  const LV = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const LI = l => Math.max(0, LV.indexOf(l || 'A1'));
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const dayDiff = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); };
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (a, n) => shuffle(a).slice(0, n);
  const norm = s => String(s || '').toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();

  /* ------------------------------------------------------------
     State
     ------------------------------------------------------------ */
  const DEFAULT = () => ({
    v: 1, updatedAt: 0, ui: 'ar', theme: (() => { try { if (window.SiteSpeakNative && window.SiteSpeakNative.isSystemDark) return window.SiteSpeakNative.isSystemDark() ? 'dark' : 'light'; } catch (e) { } return (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'; })(),
    name: '', goal: 'professional', level: null, placement: null, certs: {},
    xp: 0, streak: 0, lastDay: null, days: {},
    srs: {}, grammarDone: {}, unitsDone: {}, readingDone: {}, levelTests: {},
    mistakes: [], skills: {}, stats: { conversations: 0, siteSims: 0, interviews: 0, emails: 0, dictations: 0, tests: [] },
    planMinutes: 45, mepExtra: true, newPerDay: 10, voice: 'en-US', rate: 0.95, showPA: true, autoSpeak: true, reports: [], trHistory: [], saved: [], videos: [], blocks: { known: {}, fav: {} },
    fast: { started: null, sprints: {}, chunks: {}, my: [], size: 'std' }
  });
  let S = DEFAULT();

  /* ------------------------------------------------------------
     Storage: private per-user cloud doc + local copy
     ------------------------------------------------------------ */
  /* Merge two copies of the learner's state (this device + the other device) without losing progress */
  function mergeState(a, b) {
    a = a || {}; b = b || {};
    const newer = (b.updatedAt || 0) > (a.updatedAt || 0) ? b : a, older = newer === a ? b : a;
    const r = Object.assign(DEFAULT(), JSON.parse(JSON.stringify(newer)));
    const o = JSON.parse(JSON.stringify(older));
    r.updatedAt = Math.max(a.updatedAt || 0, b.updatedAt || 0);
    r.xp = Math.max(a.xp || 0, b.xp || 0);
    if ((o.lastDay || '') > (r.lastDay || '')) { r.lastDay = o.lastDay; r.streak = o.streak; }
    else if (o.lastDay === r.lastDay) r.streak = Math.max(r.streak || 0, o.streak || 0);
    r.days = r.days || {};
    Object.entries(o.days || {}).forEach(([d, x]) => {
      const y = r.days[d];
      if (!y) { r.days[d] = x; return; }
      y.min = Math.max(y.min || 0, x.min || 0); y.xp = Math.max(y.xp || 0, x.xp || 0);
      y.tasks = Object.assign({}, x.tasks || {}, y.tasks || {}); if (!y.newWords && x.newWords) y.newWords = x.newWords;
    });
    r.srs = r.srs || {};
    Object.entries(o.srs || {}).forEach(([k, x]) => { const y = r.srs[k]; if (!y || (x.seen || 0) > (y.seen || 0)) r.srs[k] = x; });
    ['grammarDone', 'readingDone', 'levelTests'].forEach(f => { r[f] = r[f] || {}; Object.entries(o[f] || {}).forEach(([k, v]) => { r[f][k] = Math.max(r[f][k] == null ? -1 : r[f][k], v); }); });
    ['unitsDone', 'certs'].forEach(f => { r[f] = Object.assign({}, o[f] || {}, r[f] || {}); });
    const uniq = (arr, key, max) => { const seen = new Set(); const out = []; arr.forEach(x => { const k = key(x); if (!seen.has(k)) { seen.add(k); out.push(x); } }); return max ? out.slice(0, max) : out; };
    r.mistakes = uniq([...(r.mistakes || []), ...(o.mistakes || [])], m => m.d + '|' + m.wrong + '|' + m.right, 150).sort((x, y) => (y.d || '').localeCompare(x.d || ''));
    r.stats = r.stats || {}; const os = o.stats || {};
    ['conversations', 'siteSims', 'interviews', 'emails', 'dictations'].forEach(k => { r.stats[k] = Math.max(r.stats[k] || 0, os[k] || 0); });
    r.stats.tests = uniq([...(os.tests || []), ...(r.stats.tests || [])], t => t.d + '|' + t.name + '|' + t.score);
    r.saved = uniq([...(r.saved || []), ...(o.saved || [])], x => x.en, 200);
    r.trHistory = uniq([...(r.trHistory || []), ...(o.trHistory || [])], x => x.src, 30);
    { const fa = r.fast = Object.assign({ started: null, sprints: {}, chunks: {}, my: [], size: 'std' }, r.fast || {}); const fb = o.fast || {};
      if (fb.started && (!fa.started || fb.started < fa.started)) fa.started = fb.started;
      fa.sprints = Object.assign({}, fb.sprints || {}, fa.sprints || {});
      Object.entries(fb.sprints || {}).forEach(([d, x]) => { const y = fa.sprints[d]; if (y && x && (x.n || 0) > (y.n || 0)) fa.sprints[d] = x; });
      fa.chunks = fa.chunks || {}; Object.entries(fb.chunks || {}).forEach(([k, x]) => { const y = fa.chunks[k]; if (!y || (x.seen || 0) > (y.seen || 0)) fa.chunks[k] = x; });
      fa.my = uniq([...(fa.my || []), ...(fb.my || [])], x => x.en, 200); }
    r.reports = uniq([...(r.reports || []), ...(o.reports || [])], x => x.d + x.text.length, 12);
    return r;
  }

  const Store = {
    ref: null, sumRef: null, lastSum: '', lastSumAt: 0, cloud: 'off', saving: false, again: false, timer: null, unsub: null, lastWritten: 0, onRemote: null,
    loadLocal() { try { const r = localStorage.getItem('fluent-mep-state'); if (r) return JSON.parse(r); } catch (e) { } return null; },
    keepLocal() { try { localStorage.setItem('fluent-mep-state', JSON.stringify(S)); } catch (e) { } },
    async init() {
      const local = this.loadLocal();
      if (local) S = Object.assign(DEFAULT(), local);
      if (!(window.claude && window.claude.use)) { this.cloud = 'off'; return; }
      this.cloud = 'connecting';
      try {
        const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
        const uid = user ? await user.id() : null;
        if (!db || !uid) { this.cloud = 'off'; return; }
        this.ref = db.doc('data/users/' + uid + '/progress');
        this.sumRef = db.doc('reports/daily-summary');
        const snap = await Promise.race([this.ref.get(), new Promise((_, rej) => setTimeout(() => rej({ code: 'timeout' }), 10000))]);
        if (snap && snap.exists) {
          const remote = snap.data();
          const localNewer = local && (local.updatedAt || 0) > (remote.updatedAt || 0);
          S = mergeState(local || {}, remote); this.lastWritten = remote.updatedAt || 0; this.keepLocal();
          if (localNewer) this.save();
        } else if (local) this.save();
        this.cloud = 'on';
        this.listen();
      } catch (e) { this.cloud = e && e.code === 'timeout' ? 'slow' : 'off'; }
    },
    /* Live sync: progress made on the other device appears here automatically */
    listen() {
      if (!this.ref || this.unsub) return;
      try {
        this.unsub = this.ref.onSnapshot(snap => {
          if (!snap || !snap.exists || (snap.metadata && snap.metadata.hasPendingWrites)) return;
          this.applyRemote(snap.data());
        }, () => { this.unsub = null; });
      } catch (e) { this.unsub = null; }
    },
    applyRemote(remote) {
      if (!remote || (remote.updatedAt || 0) <= (this.lastWritten || 0)) return;
      if ((remote.updatedAt || 0) <= (S.updatedAt || 0) && this.timer) return;
      const pending = !!this.timer || this.saving;
      S = mergeState(S, remote); this.lastWritten = remote.updatedAt || 0; this.keepLocal();
      if (pending) this.save();
      this.onRemote && this.onRemote();
    },
    async pull() {
      if (!this.ref) return;
      try { const snap = await this.ref.get(); if (snap && snap.exists) this.applyRemote(snap.data()); } catch (e) { }
      this.listen();
    },
    save() {
      S.updatedAt = Date.now();
      this.keepLocal();
      clearTimeout(this.timer); this.timer = setTimeout(() => { this.timer = null; this.flush(); }, 1500);
    },
    /* Readable progress summary (owner-only) so Claude can report daily progress from any chat */
    async writeSummary(force) {
      if (!this.sumRef) return;
      if (!force && Date.now() - this.lastSumAt < 60000) return;
      try {
        const sum = progressSummary(); const key = JSON.stringify(sum);
        if (key === this.lastSum) return;
        await this.sumRef.set(Object.assign({ updatedAt: new Date().toISOString() }, sum));
        this.lastSum = key; this.lastSumAt = Date.now();
      } catch (e) { if (e && e.code === 'invalid_argument') this.sumRef = null; }
    },
    async flush() {
      if (!this.ref) return;
      if (this.saving) { this.again = true; return; }
      this.saving = true;
      let prevWritten = this.lastWritten, wrote = false;
      try {
        // read the latest copy first so a stale device never overwrites newer progress
        try { const snap = await this.ref.get(); if (snap && snap.exists) { const rem = snap.data(); if ((rem.updatedAt || 0) > (this.lastWritten || 0)) { const t = S.updatedAt; S = mergeState(S, rem); S.updatedAt = Math.max(t, rem.updatedAt || 0) + 1; this.keepLocal(); } } } catch (e) { }
        const body = JSON.parse(JSON.stringify(S));
        // mark this copy as ours BEFORE writing, so the echo of our own write is never treated as "the other device"
        prevWritten = this.lastWritten; this.lastWritten = body.updatedAt;
        await this.ref.set(body); wrote = true; this.cloud = 'on'; await this.writeSummary();
      }
      catch (e) {
        if (!wrote) this.lastWritten = prevWritten;
        if (e && (e.code === 'invalid_argument' || e.code === 'revoked' || e.code === 'not_granted')) { this.ref = null; this.cloud = 'off'; } }
      this.saving = false;
      if (this.again) { this.again = false; this.flush(); }
    }
  };
  const save = () => Store.save();

  function progressSummary() {
    const days = [...Array(14)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - i); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); });
    const lastDays = days.map(d => { const r = S.days[d]; return { date: d, minutes: r ? r.min : 0, xp: r ? r.xp : 0, tasksDone: r ? Object.keys(r.tasks) : [] }; });
    const g = Object.values(S.grammarDone);
    return {
      name: S.name || '', level: S.level || null, goal: S.goal, streak: liveStreak(), lastActiveDay: S.lastDay, xp: S.xp,
      totalMinutes: Object.values(S.days).reduce((a, d) => a + (d.min || 0), 0),
      wordsInReview: Object.keys(S.srs).length, wordsLearned: Object.values(S.srs).filter(x => x.box >= 2).length,
      grammarLessons: Object.keys(S.grammarDone).length, grammarAvg: g.length ? Math.round(g.reduce((a, b) => a + b, 0) / g.length) : null,
      unitsDone: Object.keys(S.unitsDone), certificates: Object.keys(S.certs), levelTests: S.levelTests,
      placement: S.placement ? { date: S.placement.date, level: S.placement.level, skills: S.placement.skills } : null,
      skills: S.skills, stats: { conversations: S.stats.conversations, siteSims: S.stats.siteSims, interviews: S.stats.interviews, emails: S.stats.emails, dictations: S.stats.dictations, videos: S.stats.videos || 0 },
      planMinutes: S.planMinutes, last14Days: lastDays,
      fastTrack: (() => { const f = S.fast || {}; const sp = f.sprints || {}; const ds = Object.keys(sp).sort(); return { started: f.started || null, sprintsDone: ds.length, dayOf90: Math.min(90, ds.length), lastSprint: ds.length ? Object.assign({ date: ds[ds.length - 1] }, sp[ds[ds.length - 1]]) : null, recentSprints: ds.slice(-14).map(d => Object.assign({ date: d }, sp[d])), chunksInReview: Object.keys(f.chunks || {}).length, chunksMastered: Object.values(f.chunks || {}).filter(x => x.box >= 2).length, myWorkSentences: (f.my || []).length, sprintSize: f.size || 'std' }; })(),
      recentMistakes: S.mistakes.slice(0, 15).map(m => ({ date: m.d, src: m.src, wrong: m.wrong, right: m.right }))
    };
  }

  /* ------------------------------------------------------------
     AI (Claude via the platform) — no keys in the page
     ------------------------------------------------------------ */
  const AI = {
    s: null, state: 'checking',
    async init() {
      if (!(window.claude && window.claude.use)) { this.state = 'off'; return; }
      try { this.s = await window.claude.use('sample'); this.state = this.s ? 'on' : 'off'; } catch (e) { this.state = 'off'; }
    },
    ok() { return !!this.s; },
    errText(e) {
      const c = e && e.code;
      if (c === 'not_granted') return 'لم يتم السماح للمنصة باستخدام الذكاء الاصطناعي. اسمح بذلك عند ظهور طلب الإذن.';
      if (c === 'rate_limited') return 'تم الوصول للحد المؤقت للاستخدام. حاول بعد دقيقة.';
      return 'تعذر الاتصال بالذكاء الاصطناعي الآن. حاول مرة أخرى.' + (e && e.message ? ' (' + e.message + ')' : '');
    },
    async text(input, onText, signal) {
      const r = await this.s(input, { onText, signal, cache: false });
      return r.text;
    },
    async json(prompt) {
      const r = await this.s.json(prompt, { cache: false });
      return typeof r === 'string' ? JSON.parse(r) : r;
    }
  };

  /* ------------------------------------------------------------
     Speech: Text-to-Speech (browser) and Speech-to-Text (if allowed)
     ------------------------------------------------------------ */
  /* Android app bridge: when SiteSpeak runs inside its Android app, the app exposes
     window.SiteSpeakNative for real text-to-speech and microphone speech recognition. */
  const NATIVE = (() => { try { return (window.SiteSpeakNative && typeof window.SiteSpeakNative.speak === 'function') ? window.SiteSpeakNative : null; } catch (e) { return null; } })();
  let ttsPoll = null;
  const TTS = {
    voices: [],
    ok: !!NATIVE || 'speechSynthesis' in window,
    load() { if ('speechSynthesis' in window) this.voices = speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang)); },
    voiceFor(lang) {
      const L = lang.toLowerCase();
      return this.voices.find(v => v.lang.toLowerCase().replace('_', '-') === L && /natural|google|premium|enhanced/i.test(v.name))
        || this.voices.find(v => v.lang.toLowerCase().replace('_', '-') === L)
        || this.voices.find(v => v.lang.toLowerCase().startsWith(L.slice(0, 2)));
    },
    speak(text, opt = {}) {
      if (NATIVE) {
        try {
          clearInterval(ttsPoll);
          NATIVE.speak(String(text).replace(/[•→]/g, ' '), opt.lang || S.voice, +(opt.rate || S.rate));
          if (opt.onend) { let started = false; const t0 = Date.now(); ttsPoll = setInterval(() => { let sp = false; try { sp = NATIVE.isSpeaking(); } catch (e) { } if (sp) started = true; if ((started && !sp) || Date.now() - t0 > 30000 || (!started && Date.now() - t0 > 2500)) { clearInterval(ttsPoll); opt.onend(); } }, 200); }
        } catch (e) { toast('تعذر تشغيل الصوت.'); }
        return;
      }
      if (!this.ok) { toast('النطق الصوتي غير مدعوم في هذا المتصفح.'); return; }
      try {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(String(text).replace(/[•→]/g, ' '));
        u.lang = opt.lang || S.voice; const v = this.voiceFor(u.lang); if (v) u.voice = v;
        u.rate = opt.rate || S.rate;
        if (opt.onend) u.onend = opt.onend;
        speechSynthesis.speak(u);
      } catch (e) { toast('تعذر تشغيل الصوت.'); }
    },
    stop() { clearInterval(ttsPoll); try { if (NATIVE) NATIVE.stop(); else speechSynthesis.cancel(); } catch (e) { } }
  };
  // Android WebView has no speechSynthesis (the app speaks through NATIVE), so only hook it when it exists
  if ('speechSynthesis' in window) { TTS.load(); speechSynthesis.onvoiceschanged = () => TTS.load(); }

  const STT = {
    Rec: window.SpeechRecognition || window.webkitSpeechRecognition,
    blocked: false, rec: null,
    native: !!NATIVE, poll: null,
    start(onText, onEnd) {
      if (NATIVE) {
        try {
          clearInterval(this.poll); NATIVE.startListening('en-US');
          let last = '', t0 = Date.now();
          this.poll = setInterval(() => {
            let st = {}; try { st = JSON.parse(NATIVE.sttState() || '{}'); } catch (e) { }
            if (st.t && st.t !== last) { last = st.t; onText(st.t, st.s === 'done'); }
            if (st.s === 'done' || st.s === 'error' || Date.now() - t0 > 60000) {
              clearInterval(this.poll);
              if (st.s === 'error' && st.e === 'permission') toast('اسمح لتطبيق SiteSpeak باستخدام الميكروفون من الإعدادات.');
              else if (st.s === 'error' && st.e !== 'nomatch') toast('لم يتم التقاط الصوت — حاول مرة أخرى.');
              else if (st.s === 'error') toast('لم أسمع كلاماً واضحاً — تكلّم بعد ظهور الإشارة.');
              onEnd && onEnd();
            }
          }, 150);
          return true;
        } catch (e) { onEnd && onEnd(); return false; }
      }
      if (!this.Rec || this.blocked) { this.hint(); onEnd && onEnd(); return false; }
      try {
        const r = new this.Rec(); this.rec = r;
        r.lang = 'en-US'; r.interimResults = true; r.continuous = false;
        r.onresult = ev => { let t = ''; for (const res of ev.results) t += res[0].transcript; onText(t, ev.results[ev.results.length - 1].isFinal); };
        r.onerror = ev => { if (ev.error === 'not-allowed' || ev.error === 'service-not-allowed' || ev.error === 'audio-capture') { this.blocked = true; this.hint(); } };
        r.onend = () => { this.rec = null; onEnd && onEnd(); };
        r.start(); return true;
      } catch (e) { this.blocked = true; this.hint(); onEnd && onEnd(); return false; }
    },
    stop() { try { if (NATIVE) NATIVE.stopListening(); else this.rec && this.rec.stop(); } catch (e) { } },
    hint() { modal('🎙️ الميكروفون', '<p>الوصول المباشر للميكروفون غير متاح في هذه الصفحة على جهازك.</p><p><b>البديل العملي:</b> اضغط على مربع الكتابة ثم اضغط زر الميكروفون 🎤 في <b>لوحة مفاتيح هاتفك</b> (الإملاء الصوتي) واختر اللغة الإنجليزية، وتكلّم — سيتحول كلامك إلى نص ويقيّمه المدرس.</p><p class="muted small">ملاحظة أمانة: لا تقيس المنصة دقة النطق صوتياً؛ التقييم يعتمد على النص الذي فُهم من كلامك.</p>'); }
  };

  /* ------------------------------------------------------------
     UI strings (interface language)
     ------------------------------------------------------------ */
  const ROUTES = [
    ['home', '🏠', 'الرئيسية', 'Home Dashboard', 0], ['fast', '🚀', 'المسار السريع 90 يوم', 'Fast Track 90', 0], ['plan', '🗓️', 'خطتي التعليمية', 'My Learning Plan', 0], ['levels', '🪜', 'المستويات', 'English Levels', 0],
    ['translate', '🌐', 'المترجم', 'Translator', 1], ['tutor', '🤖', 'المحادثة مع المدرس', 'AI Conversation', 1], ['vocab', '📚', 'المفردات', 'Vocabulary', 1], ['grammar', '✍️', 'القواعد', 'Grammar', 1],
    ['listening', '🎧', 'الاستماع', 'Listening', 1], ['pron', '🗣️', 'النطق', 'Pronunciation', 1], ['reading', '📖', 'القراءة', 'Reading', 1], ['blocks', '📦', 'بلوكات الكلام', 'Speaking Blocks', 1], ['video', '🎬', 'التعلم من الفيديو', 'Learn from Video', 1], ['writing', '📝', 'الكتابة والترجمة', 'Writing', 1],
    ['business', '💼', 'الإنجليزية المهنية', 'Business English', 2], ['mep', '🔧', 'الإنجليزية الهندسية MEP', 'Engineering & MEP English', 2], ['site', '🦺', 'محاكي التواصل في الموقع', 'Site Communication', 2],
    ['emails', '📧', 'الإيميلات والتقارير', 'Professional Emails', 2], ['interview', '🤝', 'محاكي المقابلات', 'Interview Simulator', 2],
    ['tests', '🧪', 'الاختبارات والتقييم', 'Tests & Assessments', 3], ['progress', '📈', 'تقدمي', 'My Progress', 3], ['settings', '⚙️', 'الإعدادات', 'Settings', 3], ['install', '📲', 'ثبّت التطبيق', 'Install app', 3]
  ];
  const GROUPS = [['التعلّم', 'Learning'], ['المهارات', 'Skills'], ['المسار المهني والهندسي', 'Professional'], ['المتابعة', 'Tracking']];
  const L = (ar, en) => S.ui === 'en' ? en : ar;

  /* ------------------------------------------------------------
     Helpers: toast, modal, XP, streak, mistakes, skills
     ------------------------------------------------------------ */
  function toast(msg) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 2600); }
  function modal(title, html, buttons) {
    const bg = document.createElement('div'); bg.className = 'modal-bg';
    bg.innerHTML = `<div class="modal"><h3>${esc(title)}</h3><div>${html}</div><div class="row" style="margin-top:14px;justify-content:flex-end"></div></div>`;
    const row = $('.row', bg);
    (buttons || [['حسناً', null]]).forEach(([label, fn, cls]) => { const b = document.createElement('button'); b.className = 'btn ' + (cls || ''); b.textContent = label; b.onclick = () => { bg.remove(); fn && fn(); }; row.appendChild(b); });
    bg.addEventListener('click', e => { if (e.target === bg) bg.remove(); });
    document.body.appendChild(bg);
  }
  const dayRec = (d = today()) => (S.days[d] = S.days[d] || { min: 0, xp: 0, tasks: {} });
  function markActive() {
    const d = today();
    if (S.lastDay !== d) {
      S.streak = (S.lastDay && dayDiff(S.lastDay, d) === 1) ? S.streak + 1 : 1;
      S.lastDay = d;
    }
  }
  /* streak as it stands today: a missed day (or more) shows 0 until the learner is active again */
  const liveStreak = () => (S.lastDay && dayDiff(S.lastDay, today()) > 1) ? 0 : (S.streak || 0);
  function addXP(n) { markActive(); S.xp += n; dayRec().xp += n; checkBadges(); save(); renderChips(); }
  function doneTask(k) { const r = dayRec(); if (!r.tasks[k]) { r.tasks[k] = true; addXP(10); toast('✅ ' + L('تم إنجاز مهمة من خطة اليوم', 'Daily task completed')); } if (planTask && planTask === k) planBar(true); }
  /* Plan bar: when a task is opened from today's plan, a "back to home" bar stays on top;
     after finishing the task it offers Home or the next task. */
  let planTask = null;
  function planBar(done) {
    const bar = $('#planBar'); if (!bar) return;
    if (!planTask || current === 'home') { bar.innerHTML = ''; bar.className = ''; return; }
    const tasks = planTasks(); const t = tasks.find(x => x.k === planTask); const d = dayRec();
    const next = tasks.find(x => !d.tasks[x.k] && x.k !== planTask);
    const finished = done || d.tasks[planTask];
    bar.className = 'planbar' + (finished ? ' done' : '');
    bar.innerHTML = finished
      ? `<span>✅ ${L('أنجزت', 'Done')}: <b>${esc(t ? t.label : '')}</b></span><span class="row" style="gap:6px"><button class="btn sm" data-home>🏠 ${L('الرئيسية', 'Home')}</button>${next ? `<button class="btn sm sec" data-next="${next.k}">${next.icon} ${L('المهمة التالية', 'Next task')}</button>` : `<span class="pill ok">🎉 ${L('أنهيت خطة اليوم', 'Plan complete')}</span>`}</span>`
      : `<button class="btn sm ghost" data-home>🏠 ${L('رجوع للصفحة الرئيسية', 'Back to home')}</button><span class="small muted">${t ? t.icon + ' ' + esc(t.label) : ''}</span>`;
    const h = $('[data-home]', bar); if (h) h.onclick = () => { planTask = null; go('home'); };
    const n = $('[data-next]', bar); if (n) n.onclick = () => startTask(n.dataset.next);
  }
  function startTask(k) {
    const t = planTasks().find(x => x.k === k); if (!t) return;
    planTask = k;
    if (k === 'review') { if (current !== 'home') { go('home'); setTimeout(() => { reviewMistakes($('#view')); planBar(); }, 50); } else { reviewMistakes($('#view')); planBar(); } return; }
    if (k === 'vocab') vocabTab = 'today';
    if (k === 'listening') lisTab = 'dictation';
    go(t.route);
    if (k === 'grammar') setTimeout(() => { if (current === 'grammar') { grammarLesson($('#view'), nextGrammar()); planBar(); } }, 60);
  }
  /* Hard words: every word that comes out wrong in a speaking check is remembered across sessions.
     Saying it right 3 times in a row (after the last miss) marks it as mastered. */
  const HARD_SKIP = new Set(['a', 'an', 'the', 'to', 'of', 'and', 'in', 'on', 'at', 'is', 'it', 'i', 'be', 'or']);
  function hardWords() { return (S.hardWords = S.hardWords || {}); }
  function trackWords(ops) {
    const H = hardWords(), d = today();
    ops.forEach(o => {
      const k = String(o.w || '').toLowerCase();
      if (!k || k.length < 2 || HARD_SKIP.has(k)) return;
      if (o.t === 'sub' || o.t === 'del') {
        const r = H[k] || (H[k] = { miss: 0, ok: 0, heard: '' });
        r.miss++; r.ok = 0; r.last = d; r.done = false; if (o.h) r.heard = o.h;
      } else if (o.t === 'ok' && H[k] && !H[k].done) {
        H[k].ok++; H[k].last = d; if (H[k].ok >= 3) { H[k].done = true; toast('🏆 ' + L('أتقنت نطق', 'Mastered') + ' "' + k + '"'); }
      }
    });
  }
  const activeHard = () => Object.entries(hardWords()).filter(([, r]) => !r.done).sort((a, b) => b[1].miss - a[1].miss || (b[1].last || '').localeCompare(a[1].last || ''));
  function addMistake(m) { S.mistakes.unshift(Object.assign({ d: today(), n: 0 }, m)); if (S.mistakes.length > 150) S.mistakes.length = 150; save(); }
  function setSkill(k, v) { v = Math.max(0, Math.min(100, Math.round(v))); S.skills[k] = S.skills[k] == null ? v : Math.round(S.skills[k] * 0.6 + v * 0.4); save(); }
  let badgeSeen = null;
  function checkBadges() {
    const got = C.BADGES.filter(b => { try { return b.test(S); } catch (e) { return false; } }).map(b => b.id);
    if (badgeSeen) got.filter(id => !badgeSeen.includes(id)).forEach(id => { const b = C.BADGES.find(x => x.id === id); setTimeout(() => toast(b.icon + ' ' + L('وسام جديد: ', 'New badge: ') + (S.ui === 'en' ? b.name : b.ar)), 400); });
    badgeSeen = got;
  }
  const say = (t) => `<button class="speak" data-say="${esc(t)}" title="استمع">🔊</button>`;
  const PA = window.PRON_AR || {};
  const paText = en => PA[en] || (window.PRON_AR_STRESS || {})[en] || '';
  const legend = () => `<div class="row small" style="gap:6px;margin-top:6px">🗣️ ${(window.PRON_AR_LEGEND || []).map(x => `<span class="chip"><b>${esc(x[0])}</b>&nbsp;=&nbsp;<bdi>${esc(x[1])}</bdi></span>`).join('')}<span class="muted">${L('الكتابة بالعربي تقريبية — استمع دائماً للصوت 🔊', 'Approximate — always listen 🔊')}</span></div>`;
  const EXA = window.EX_AR || {};
  const exa = w => EXA[w.en] ? `<div class="exar" dir="rtl">↩︎ ${esc(EXA[w.en])}</div>` : '';
  const pa = (en, big) => { if (S.showPA === false) return ''; const t = paText(en); return t ? `<div class="pa${big ? ' big' : ''}" dir="rtl">🗣️ ${esc(t)}</div>` : ''; };
  const aiNote = () => AI.ok() ? '' : `<div class="note">🤖 ${AI.state === 'checking' ? 'جارٍ الاتصال بالذكاء الاصطناعي…' : 'ميزات الذكاء الاصطناعي تعمل عند فتح المنصة من رابطها على Claude بعد السماح لها. باقي الأقسام تعمل بالكامل بدونه.'}</div>`;
  const level = () => S.level || 'A1';

  /* ------------------------------------------------------------
     Time tracking (active minutes)
     ------------------------------------------------------------ */
  let lastInput = Date.now();
  ['click', 'keydown', 'touchstart', 'scroll'].forEach(e => window.addEventListener(e, () => { lastInput = Date.now(); }, { passive: true }));
  setInterval(() => { if (document.visibilityState === 'visible' && Date.now() - lastInput < 120000 && S.lastDay) { dayRec().min += 1; save(); } }, 60000);

  /* ------------------------------------------------------------
     Layout: sidebar, bottom nav, top chips
     ------------------------------------------------------------ */
  function renderShell() {
    document.documentElement.lang = S.ui; document.documentElement.dir = S.ui === 'en' ? 'ltr' : 'rtl';
    document.documentElement.dataset.theme = S.theme;
    // inside the Android app: recolor the phone's status bar and navigation bar to match
    try { if (window.SiteSpeakNative && window.SiteSpeakNative.setTheme) window.SiteSpeakNative.setTheme(S.theme); } catch (e) { }
    $('#themeBtn').textContent = S.theme === 'dark' ? '☀️' : '🌙';
    let h = `<div class="logo">${ICON_SVG(36)}<div><span class="en"><span style="color:var(--brand)">Site</span><span style="color:var(--warn)">Speak</span></span><div class="small muted" style="font-weight:500">${L('مدرسك الشخصي للإنجليزية', 'Your personal English tutor')}</div></div></div><nav class="nav">`;
    GROUPS.forEach((g, gi) => {
      h += `<div class="nav-group">${L(g[0], g[1])}</div>`;
      ROUTES.filter(r => r[4] === gi).forEach(r => { h += `<a href="#${r[0]}" data-r="${r[0]}"><span class="ic">${r[1]}</span><span>${L(r[2], r[3])}</span></a>`; });
    });
    $('#side').innerHTML = h + '</nav>';
    $('#bottomNav').innerHTML = [['home', '🏠', 'الرئيسية', 'Home'], ['fast', '🚀', 'السريع', 'Fast'], ['tutor', '🤖', 'المدرس', 'Tutor'], ['vocab', '📚', 'كلمات', 'Words'], ['progress', '📈', 'تقدمي', 'Progress']]
      .map(r => `<a href="#${r[0]}" data-r="${r[0]}"><span class="ic">${r[1]}</span>${L(r[2], r[3])}</a>`).join('');
    renderChips();
  }
  function renderChips() {
    $('#chipLevel').textContent = (S.level || '—') + ' CEFR';
    $('#chipStreak').textContent = '🔥 ' + liveStreak();
    $('#chipXp').textContent = '⭐ ' + S.xp + ' XP';
  }
  function closeDrawer() { $('#side').classList.remove('open'); $('#drawerBg').classList.remove('open'); }

  /* ------------------------------------------------------------
     Router
     ------------------------------------------------------------ */
  const views = {};
  let current = 'home';
  /* viewTouched: the learner has interacted with the current page (answered, typed, started an exercise).
     Background events (cloud connected, sync from the other device) must never redraw such a page. */
  let viewTouched = false;
  ['click', 'input', 'keydown'].forEach(ev => $('#view').addEventListener(ev, () => { viewTouched = true; }, true));
  function route() {
    viewTouched = false;
    TTS.stop(); if (activeChat && activeChat.abort) activeChat.abort(); activeChat = null;
    const id = (location.hash || '#home').slice(1);
    current = views[id] ? id : 'home';
    $$('[data-r]').forEach(a => a.classList.toggle('on', a.dataset.r === current));
    const r = ROUTES.find(x => x[0] === current);
    $('#pageTitle').textContent = r[1] + ' ' + L(r[2], r[3]);
    closeDrawer();
    const fab = $('#fab'); if (fab) fab.style.display = current === 'translate' ? 'none' : '';
    const v = $('#view'); v.innerHTML = ''; window.scrollTo(0, 0);
    if (current === 'home') planTask = null;
    if (planTask) { const pt = planTasks().find(x => x.k === planTask); if (!pt || pt.route !== current) planTask = null; }
    views[current](v);
    planBar();
  }
  const go = id => { if (location.hash === '#' + id) route(); else location.hash = id; };

  /* ------------------------------------------------------------
     Shared component: quiz (MCQ + fill-in)
     q = {q, options?, answer (index | string), explain, type}
     ------------------------------------------------------------ */
  function runQuiz(el, qs, opt = {}) {
    let i = 0, score = 0; const wrongs = [];
    const draw = () => {
      if (i >= qs.length) {
        const pct = Math.round(score / qs.length * 100);
        el.innerHTML = `<div class="card"><h2>${pct >= 70 ? '🎉' : '💪'} ${L('النتيجة', 'Result')}: ${score}/${qs.length} (${pct}%)</h2>
          <div class="bar" style="margin:10px 0"><i style="width:${pct}%"></i></div>
          ${wrongs.length ? `<h3>${L('راجع هذه الأخطاء', 'Review these')}</h3>` + wrongs.map(w => `<div class="badbox" style="margin:6px 0"><div class="en">${esc(w.q)}</div><div>✔ <b class="en">${esc(w.right)}</b> — ${esc(w.explain || '')}</div></div>`).join('') : `<div class="okbox">${L('ممتاز! لا أخطاء.', 'Perfect — no mistakes.')}</div>`}
          <div class="row" style="margin-top:12px"><button class="btn sec" id="qRetry">${L('أعد المحاولة', 'Try again')}</button>${opt.next ? `<button class="btn" id="qNext">${esc(opt.nextLabel || L('التالي', 'Next'))}</button>` : ''}</div></div>`;
        $('#qRetry', el).onclick = () => runQuiz(el, opt.reshuffle ? shuffle(qs) : qs, opt);
        if (opt.next) $('#qNext', el).onclick = opt.next;
        opt.onDone && opt.onDone(pct, score, wrongs);
        return;
      }
      const q = qs[i];
      const head = `<div class="row between small muted"><span>${esc(opt.title || '')}</span><span>${i + 1} / ${qs.length}</span></div><div class="bar" style="margin:6px 0 14px"><i style="width:${i / qs.length * 100}%"></i></div>`;
      if (q.type === 'fill') {
        el.innerHTML = `<div class="card">${head}<h3 class="en" style="font-size:18px">${esc(q.q)} ${say(q.q.replace(/___/g, '…'))}</h3>
          <input type="text" class="en" id="qIn" placeholder="type the answer" autocomplete="off" autocapitalize="off">
          <div id="qFb" style="margin-top:10px"></div><div class="row" style="margin-top:10px"><button class="btn" id="qChk">${L('تحقق', 'Check')}</button></div></div>`;
        const inp = $('#qIn', el); inp.focus();
        const check = () => {
          const ok = String(q.answer).split('|').some(a => norm(a) === norm(inp.value));
          answer(ok, inp.value, String(q.answer).split('|')[0]);
        };
        $('#qChk', el).onclick = check; inp.onkeydown = e => { if (e.key === 'Enter') check(); };
      } else {
        el.innerHTML = `<div class="card">${head}<h3 class="${/[a-z]/i.test(q.q) && !/[؀-ۿ]/.test(q.q) ? 'en' : ''}" style="font-size:18px">${esc(q.q)} ${q.say ? say(q.say) : (/[a-z]{3}/i.test(q.q) ? say(q.q.replace(/___/g, '…')) : '')}</h3>
          <div id="qOpts">${q.options.map((o, k) => `<button class="opt ${/[؀-ۿ]/.test(o) ? '' : 'en'}" data-k="${k}">${esc(o)}</button>`).join('')}</div><div id="qFb" style="margin-top:10px"></div></div>`;
        if (q.say) setTimeout(() => TTS.speak(q.say), 250);
        $$('#qOpts .opt', el).forEach(b => b.onclick = () => {
          const k = +b.dataset.k; $$('#qOpts .opt', el).forEach(x => { x.disabled = true; if (+x.dataset.k === q.answer) x.classList.add('right'); });
          if (k !== q.answer) b.classList.add('wrong');
          answer(k === q.answer, q.options[k], q.options[q.answer]);
        });
      }
      function answer(ok, given, right) {
        if (ok) score++; else {
          wrongs.push({ q: q.q, right, explain: q.explain });
          addMistake({ src: opt.src || 'quiz', q: q.q, wrong: given, right, ar: q.explain || '' });
        }
        $('#qFb', el).innerHTML = `<div class="${ok ? 'okbox' : 'badbox'}">${ok ? '✔ ' + L('صحيح!', 'Correct!') : '✘ ' + L('الإجابة الصحيحة', 'Correct answer') + ': <b class="en">' + esc(right) + '</b>'}${q.explain ? '<div class="small" style="margin-top:4px">' + esc(q.explain) + '</div>' : ''}</div>
          <div class="row" style="margin-top:10px"><button class="btn" id="qGo">${i + 1 < qs.length ? L('السؤال التالي', 'Next question') : L('عرض النتيجة', 'See result')}</button></div>`;
        const chk = $('#qChk', el); if (chk) chk.remove();
        $('#qGo', el).onclick = () => { i++; draw(); };
        $('#qGo', el).focus();
      }
    };
    draw();
  }
  const exToQ = e => e[0] === 'mc' ? { type: 'mc', q: e[1], options: e[2], answer: e[3], explain: e[4] } : { type: 'fill', q: e[1], answer: e[2], explain: e[4] };
  const wordQuiz = (words, n = 5) => pick(words, Math.min(n, words.length)).map(w => {
    const dist = pick(C.ALL_WORDS.filter(x => x.ar !== w.ar), 3).map(x => x.ar);
    const opts = shuffle([w.ar, ...dist]);
    return { type: 'mc', q: L('ما معنى: ', 'Meaning of: ') + w.en, options: opts, answer: opts.indexOf(w.ar), explain: w.en + (paText(w.en) ? ' (' + paText(w.en) + ')' : '') + ' = ' + w.ar + ' — ' + w.ex + (EXA[w.en] ? ' (' + EXA[w.en] + ')' : '') };
  });

  /* ------------------------------------------------------------
     Shared component: AI chat (tutor, roleplay, site, interview)
     ------------------------------------------------------------ */
  let activeChat = null;
  function chatUI(el, cfg) {
    // cfg: {title, intro, system, mode: 'fluency'|'correct', kind, onEval}
    const msgs = []; let busy = false, ctrl = null, ended = false;
    el.innerHTML = `<div class="card"><div class="row between"><h2>${esc(cfg.title)}</h2>
        <div class="row"><label class="small"><input type="checkbox" id="cAuto" ${S.autoSpeak ? 'checked' : ''}> ${L('قراءة الردود صوتياً', 'Read replies aloud')}</label></div></div>
      ${cfg.intro ? `<p class="muted small">${cfg.intro}</p>` : ''}
      <div class="chat" id="cLog"></div>
      <div class="composer"><button class="mic" id="cMic" title="تحدث">🎙️</button><textarea id="cIn" class="en" placeholder="Type or dictate in English…"></textarea><button class="btn" id="cSend">${L('إرسال', 'Send')}</button></div>
      <div class="row" style="margin-top:10px"><button class="btn sec sm" id="cHelp">💡 ${L('ساعدني أرد', 'Help me reply')}</button><button class="btn ghost sm" id="cEnd">🏁 ${L('إنهاء وتقييم', 'Finish & evaluate')}</button></div>
      <div id="cEval"></div></div>`;
    const log = $('#cLog', el), inp = $('#cIn', el);
    $('#cAuto', el).onchange = e => { S.autoSpeak = e.target.checked; save(); };
    const bubble = (role, text, fix) => {
      const d = document.createElement('div'); d.className = 'msg ' + (role === 'user' ? 'me' : 'ai') + ' en';
      d.innerHTML = esc(text) + (role !== 'user' ? ' ' + say(text) : '') + (fix ? `<div class="fix">✏️ ${esc(fix)}</div>` : '');
      log.appendChild(d); log.scrollTop = log.scrollHeight; return d;
    };
    const split = t => { const i = t.indexOf('✏️'); return i < 0 ? [t.trim(), ''] : [t.slice(0, i).trim(), t.slice(i + 2).trim()]; };
    const apiMsgs = () => {
      const a = [{ role: 'user', content: cfg.system + '\n\n' + rulesFor(cfg.mode) + '\n\n[The session starts now. Send your first message.]' }];
      msgs.forEach(m => a.push({ role: m.role, content: m.role === 'assistant' ? m.text + (m.fix ? '\n✏️ ' + m.fix : '') : m.text }));
      return a;
    };
    async function turn() {
      if (!AI.ok()) { bubble('assistant', 'AI is not available here. ' + 'افتح المنصة من رابطها على Claude لتفعيل المدرس.'); return; }
      busy = true; $('#cSend', el).disabled = true;
      const d = bubble('assistant', '…'); d.classList.add('typing');
      ctrl = new AbortController();
      try {
        const txt = await AI.text(apiMsgs(), ({ text }) => { const [a] = split(text); d.firstChild.textContent = a; log.scrollTop = log.scrollHeight; }, ctrl.signal);
        const [a, fix] = split(txt);
        d.remove(); bubble('assistant', a, fix);
        msgs.push({ role: 'assistant', text: a, fix });
        if (fix && msgs.length > 1) { const last = msgs.filter(m => m.role === 'user').slice(-1)[0]; if (last) addMistake({ src: cfg.kind, wrong: last.text, right: fix, ar: '' }); }
        if (S.autoSpeak) TTS.speak(a);
      } catch (e) { d.remove(); if (!(e && e.name === 'AbortError')) bubble('assistant', AI.errText(e)); }
      busy = false; $('#cSend', el).disabled = false;
    }
    function send() {
      const t = inp.value.trim(); if (!t || busy || ended) return;
      inp.value = ''; bubble('user', t); msgs.push({ role: 'user', text: t }); markActive(); turn();
    }
    $('#cSend', el).onclick = send;
    inp.onkeydown = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };
    let recOn = false;
    $('#cMic', el).onclick = () => {
      const mic = $('#cMic', el);
      if (recOn) { STT.stop(); return; }
      const base = inp.value;
      const started = STT.start((t) => { inp.value = (base ? base + ' ' : '') + t; }, () => { recOn = false; mic.classList.remove('rec'); });
      if (started) { recOn = true; mic.classList.add('rec'); }
    };
    $('#cHelp', el).onclick = async () => {
      if (!AI.ok() || busy || !msgs.length) return;
      const lastAI = msgs.filter(m => m.role === 'assistant').slice(-1)[0];
      busy = true;
      try {
        const r = await AI.text(`You help an Arabic-speaking English learner (CEFR ${level()}). The other person just said: "${lastAI.text}". Context: ${cfg.title}. Give 2 short example replies the learner could say (natural, at or slightly above their level), each on its own line starting with "•", then one line in Arabic explaining when to use each. No other text.`);
        modal('💡 ' + L('اقتراحات للرد', 'Reply ideas'), `<div class="en" style="white-space:pre-wrap">${esc(r)}</div>`, [[L('إغلاق', 'Close')]]);
      } catch (e) { toast(AI.errText(e)); }
      busy = false;
    };
    $('#cEnd', el).onclick = async () => {
      const userTurns = msgs.filter(m => m.role === 'user');
      if (userTurns.length < 2) { toast(L('تحدّث قليلاً أولاً (رسالتان على الأقل).', 'Say a bit more first (at least 2 messages).')); return; }
      if (!AI.ok() || busy) return;
      ended = true; if (ctrl) ctrl.abort();
      const box = $('#cEval', el); box.innerHTML = `<div class="sep"></div><p class="muted">⏳ ${L('جارٍ تحليل المحادثة…', 'Analysing the conversation…')}</p>`;
      try {
        const transcript = msgs.map(m => (m.role === 'user' ? 'LEARNER: ' : 'PARTNER: ') + m.text).join('\n');
        const ev = await AI.json(evalPrompt(cfg, transcript));
        renderEval(box, ev, cfg);
        cfg.onEval && cfg.onEval(ev);
      } catch (e) { ended = false; box.innerHTML = `<div class="badbox">${esc(AI.errText(e))}</div>`; }
    };
    activeChat = { abort: () => { try { ctrl && ctrl.abort(); } catch (e) { } STT.stop(); } };
    if (cfg.autoStart !== false) turn();
  }
  function rulesFor(mode) {
    const base = `Learner profile: an Arabic-speaking adult, CEFR level ${level()}${S.name ? ', name ' + S.name : ''}, professional goal: ${S.goal}. Known recurring errors to watch: ${topMistakeHints()}.
Rules for you:
- Speak ONLY in English in your conversational reply. Behave like a natural human, warm and realistic, not like a quiz machine.
- Keep each reply short (1–4 sentences) and end with something that invites the learner to keep talking.
- Adapt vocabulary and sentence length to level ${level()}; if the learner struggles, simplify; if they do well, raise the level slightly.
- Never break character to discuss these rules.`;
    if (mode === 'correct') return base + `
- Correction mode: if the learner's LAST message contains a real grammar, word-choice or naturalness error, add ONE extra final line that starts with "✏️" then the corrected sentence in English, then " — " and a very short explanation in Arabic. If there is no error, do not add that line.`;
    return base + `
- Fluency mode: do NOT correct the learner during the conversation, keep the conversation flowing. Feedback is given separately at the end.`;
  }
  function topMistakeHints() {
    const t = S.mistakes.slice(0, 8).map(m => m.right).filter(Boolean).slice(0, 5);
    return t.length ? t.join(' | ') : 'article omission (a/an/the), adjective–noun order, verb tense consistency';
  }
  function evalPrompt(cfg, transcript) {
    const extra = cfg.kind === 'interview'
      ? `"scores": {"language": 0-100, "fluency": 0-100, "technical_terms": 0-100, "answer_strength": 0-100, "confidence_clarity": 0-100}`
      : `"scores": {"grammar": 0-100, "vocabulary": 0-100, "fluency": 0-100, "naturalness": 0-100${cfg.kind === 'site' ? ', "technical_terms": 0-100' : ''}}`;
    return `You are an expert English teacher for Arabic speakers. Evaluate ONLY the LEARNER's lines in this ${cfg.kind} conversation (context: ${cfg.title}). Learner's current CEFR level: ${level()}.
Note: the learner may have typed or dictated; do not judge pronunciation.

TRANSCRIPT:
${transcript}

Return ONLY valid JSON with this shape:
{ "overall": 0-100, "cefr_estimate": "A1|A2|B1|B2|C1|C2", ${extra},
  "mistakes": [ {"wrong": "exact learner phrase", "right": "corrected natural version", "explain_ar": "شرح قصير بالعربية"} ],
  "better_phrases": [ {"plain": "what learner said", "pro": "more natural / professional version"} ],
  "strengths_ar": ["..."], "improve_ar": ["..."], "summary_ar": "فقرة قصيرة بالعربية" }
Include at most 6 mistakes and 4 better_phrases. Be honest but encouraging. Arabic fields must be in Arabic.`;
  }
  const scoreName = { grammar: 'القواعد', vocabulary: 'المفردات', fluency: 'الطلاقة', naturalness: 'الطبيعية', technical_terms: 'المصطلحات الفنية', language: 'صحة اللغة', answer_strength: 'قوة الإجابة', confidence_clarity: 'الثقة والوضوح' };
  function renderEval(box, ev, cfg) {
    const sc = ev.scores || {};
    box.innerHTML = `<div class="sep"></div><h2>📋 ${L('تقييم المحادثة', 'Conversation feedback')} <span class="pill">${esc(ev.cefr_estimate || '')}</span> <span class="pill ok">${esc(ev.overall)}/100</span></h2>
      <p>${esc(ev.summary_ar || '')}</p>
      <div class="grid g2">${Object.keys(sc).map(k => `<div><div class="row between small"><span>${scoreName[k] || k}</span><b>${esc(sc[k])}</b></div><div class="bar"><i style="width:${+sc[k] || 0}%"></i></div></div>`).join('')}</div>
      ${(ev.mistakes || []).length ? `<h3 style="margin-top:14px">✏️ ${L('الأخطاء والتصحيح', 'Corrections')}</h3>` + ev.mistakes.map(m => `<div class="card" style="padding:10px;margin:6px 0"><div class="en" style="color:var(--bad)">✘ ${esc(m.wrong)}</div><div class="en" style="color:var(--ok)">✔ ${esc(m.right)} ${say(m.right)}</div><div class="small muted">${esc(m.explain_ar)}</div></div>`).join('') : ''}
      ${(ev.better_phrases || []).length ? `<h3>✨ ${L('صياغة أكثر احترافية', 'Say it better')}</h3><table>${ev.better_phrases.map(p => `<tr><td class="en muted">${esc(p.plain)}</td><td class="en">${esc(p.pro)} ${say(p.pro)}</td></tr>`).join('')}</table>` : ''}
      <div class="grid g2" style="margin-top:12px"><div class="okbox"><b>${L('نقاط القوة', 'Strengths')}</b><ul>${(ev.strengths_ar || []).map(s => `<li>${esc(s)}</li>`).join('')}</ul></div><div class="info"><b>${L('للتحسين', 'To improve')}</b><ul>${(ev.improve_ar || []).map(s => `<li>${esc(s)}</li>`).join('')}</ul></div></div>
      <div class="row" style="margin-top:12px"><button class="btn" data-go="${current}">${L('محادثة جديدة', 'New conversation')}</button></div>`;
    (ev.mistakes || []).forEach(m => addMistake({ src: cfg.kind, wrong: m.wrong, right: m.right, ar: m.explain_ar }));
    const f = sc.fluency != null ? sc.fluency : ev.overall;
    setSkill('speaking', f);
    if (sc.grammar != null) setSkill('grammar_use', sc.grammar);
    if (sc.technical_terms != null) setSkill('professional', sc.technical_terms);
    if (cfg.kind === 'interview' && sc.answer_strength != null) setSkill('professional', (sc.answer_strength + (sc.technical_terms || sc.answer_strength)) / 2);
    addXP(40);
  }

  /* ============================================================
     VIEWS
     ============================================================ */

  /* ---------- Home ---------- */
  views.home = v => {
    const d = dayRec(); const plan = planTasks(); const done = plan.filter(t => d.tasks[t.k]).length;
    const learned = Object.values(S.srs).filter(x => x.box >= 2).length;
    const due = dueWords().length;
    const wod = todaysNewWords()[0];
    v.innerHTML = `
      <div class="card" style="background:linear-gradient(135deg,var(--brandSoft),var(--accentSoft))">
        <h2>${L('أهلاً', 'Welcome')}${S.name ? ' ' + esc(S.name) : ''} 👋</h2>
        <p class="muted" style="margin:0">${S.level ? L('مستواك الحالي ', 'Your level ') + `<b>${S.level} – ${C.LEVELS[LI(S.level)].ar}</b>. ` + L('استمر يومياً لتنتقل للمستوى التالي.', 'Keep going daily to move up.') : L('ابدأ باختبار تحديد المستوى (15 دقيقة) لنبني لك خطة شخصية.', 'Start with the placement test to get a personal plan.')}</p>
        ${!S.level ? `<div class="row" style="margin-top:12px"><button class="btn" data-go="tests">🎯 ${L('ابدأ اختبار تحديد المستوى', 'Start placement test')}</button><button class="btn sec" id="skipA1">${L('ابدأ من الصفر (A1)', 'Start from A1')}</button></div>` : ''}
      </div>
      ${(() => { const f = S.fast || {}; const sp = f.sprints || {}; const n = Object.keys(sp).length; const doneT = !!sp[today()]; return `<div class="card fast-hero home-fast"><div class="row between"><div><div class="small" style="opacity:.85">🚀 ${L('المسار السريع — 90 يوم', 'Fast Track — 90 days')}</div><h2 style="margin:4px 0">${doneT ? '✅ ' + L('أنجزت جلسة اليوم', "Today's sprint done") : L('جلسة اليوم جاهزة', "Today's sprint is ready")} · ${L('اليوم', 'Day')} ${Math.min(90, n + (doneT ? 0 : 1))}/90</h2><div class="small" style="opacity:.9">${L('جلسة واحدة موجّهة تجمع: استرجاع ← جمل جاهزة ← قاعدة ← Shadowing ← تفكير بالإنجليزي ← محادثة', 'One guided session: recall → chunks → pattern → shadowing → think in English → speak')}</div></div><button class="btn fast-go" data-go="fast">${doneT ? L('افتح المسار', 'Open') : '▶️ ' + L('ابدأ الآن', 'Start now')}</button></div></div>`; })()}
      ${(() => { const day = Math.floor(Date.now() / 864e5); const g = VID_SUGG.find(x => x.k === (S.goal === 'daily' ? 'daily' : 'mep')); const q = g.qs[day % g.qs.length]; return `<div class="card"><div class="row between"><div><div class="small muted">🎬 ${L('فيديو اليوم المقترح', 'Suggested video today')}</div><b class="en">${esc(q)}</b><div class="small muted">${L('شاهده ثم حوّله لدرس: نص مزدوج، مفردات، اختبار، Shadowing', 'Watch it, then turn it into a lesson')}</div></div><div class="row" style="gap:6px"><a class="btn sm sec" href="${ytSearch(q)}" target="_blank" rel="noopener">▶️ YouTube</a><button class="btn sm" data-go="video">🎓 ${L('حوّله لدرس', 'Make lesson')}</button><button class="btn sm sec" data-go="blocks">📦 ${L('بلوكات الكلام', 'Blocks')}</button></div></div></div>`; })()}
      ${S.hideInstall ? '' : `<div class="card install-banner"><div class="install-icon sm">${ICON_SVG(48)}</div><div style="flex:1"><b>${L('ثبّت SiteSpeak على موبايلك', 'Install SiteSpeak on your phone')}</b><div class="small muted">${L('أيقونة على الشاشة الرئيسية وفتح بضغطة واحدة', 'Home-screen icon, one-tap launch')}</div></div><button class="btn sm" data-go="install">📲 ${L('ثبّت', 'Install')}</button><button class="iconbtn" id="hideInst" aria-label="close">✕</button></div>`}
      ${aiNote()}
      <div class="grid g4" style="margin:16px 0">
        <div class="stat"><div class="v">${S.level || '—'}</div><div class="l">${L('المستوى CEFR', 'CEFR level')}</div></div>
        <div class="stat"><div class="v">🔥 ${liveStreak()}</div><div class="l">${L('أيام متتالية', 'Day streak')}</div></div>
        <div class="stat"><div class="v">${learned}</div><div class="l">${L('كلمات مكتسبة', 'Words learned')}</div></div>
        <div class="stat"><div class="v">${Math.round(totalMinutes() / 6) / 10}</div><div class="l">${L('ساعات التدريب', 'Practice hours')}</div></div>
      </div>
      <div class="grid g2">
        <div class="card"><div class="row between"><h2>🗓️ ${L('خطة اليوم', "Today's plan")}</h2><span class="pill">${done}/${plan.length}</span></div>
          <div class="bar" style="margin:8px 0 12px"><i style="width:${done / plan.length * 100}%"></i></div>
          ${plan.map(t => `<div class="row between" style="padding:6px 0;border-bottom:1px solid var(--line)"><span>${d.tasks[t.k] ? '✅' : '⬜'} ${t.icon} ${esc(t.label)} <span class="muted small">· ${t.min} ${L('د', 'min')}</span></span><button class="btn sm ${d.tasks[t.k] ? 'sec' : ''}" data-task="${t.k}" data-go="${t.route}">${d.tasks[t.k] ? L('مراجعة', 'Again') : L('ابدأ', 'Start')}</button></div>`).join('')}
        </div>
        <div>
          ${wod ? `<div class="card"><div class="small muted">${L('كلمة اليوم', 'Word of the day')}</div><div class="row"><b class="en" style="font-size:22px">${esc(wod.en)}</b>${say(wod.en)}</div>${pa(wod.en)}<div>${esc(wod.ar)}</div><div class="en small muted">${esc(wod.ex)}</div>${exa(wod)}</div>` : ''}
          <div class="card"><h3>🔁 ${L('للمراجعة', 'To review')}</h3><p class="muted small" style="margin:0 0 8px">${due} ${L('كلمة مستحقة للمراجعة', 'words due')} · ${S.mistakes.filter(m => m.n < 2).length} ${L('خطأ سابق', 'past mistakes')}</p>
            <div class="row"><button class="btn sm" data-go="vocab">${L('راجع الكلمات', 'Review words')}</button><button class="btn sm sec" id="revMist">${L('راجع أخطائي', 'Review mistakes')}</button></div></div>
        </div>
      </div>
      <h3 style="margin:8px 0 10px">${L('تدريب سريع', 'Quick practice')}</h3>
      <div class="grid g4">
        ${[['tutor', '🤖', 'محادثة مع المدرس', 'Talk to the tutor'], ['site', '🦺', 'محاكي الموقع', 'Site simulator'], ['interview', '🤝', 'مقابلة عمل', 'Job interview'], ['emails', '📧', 'إيميل احترافي', 'Pro email'], ['mep', '🔧', 'مصطلحات MEP', 'MEP terms'], ['grammar', '✍️', 'قواعد', 'Grammar'], ['listening', '🎧', 'استماع', 'Listening'], ['pron', '🗣️', 'نطق', 'Pronunciation']]
        .map(t => `<button class="tile" data-go="${t[0]}"><div class="big">${t[1]}</div><b>${L(t[2], t[3])}</b></button>`).join('')}
      </div>`;
    const s = $('#skipA1', v); if (s) s.onclick = () => { S.level = 'A1'; save(); renderChips(); route(); };
    const hi = $('#hideInst', v); if (hi) hi.onclick = () => { S.hideInstall = true; save(); hi.closest('.card').remove(); };
    $('#revMist', v).onclick = () => reviewMistakes(v);
    $$('[data-task="review"]', v).forEach(b => b.onclick = e => { e.stopPropagation(); startTask('review'); });
  };

  function reviewMistakes(v) {
    const items = S.mistakes.filter(m => m.n < 2).slice(0, 10);
    if (!items.length) { toast(L('لا توجد أخطاء للمراجعة 🎉', 'No mistakes to review 🎉')); doneTask('review'); return; }
    let i = 0;
    const draw = () => {
      if (i >= items.length) { doneTask('review'); save(); planTask = null; planBar(); v.innerHTML = `<div class="card"><h2>✅ ${L('أنهيت مراجعة الأخطاء', 'Mistake review done')}</h2><button class="btn" data-go="home">${L('الرئيسية', 'Home')}</button></div>`; return; }
      const m = items[i];
      v.innerHTML = `<div class="card"><div class="row between small muted"><span>🔁 ${L('مراجعة الأخطاء', 'Mistake review')} · ${esc(m.src)}</span><span>${i + 1}/${items.length}</span></div>
        ${m.q ? `<p class="en"><b>${esc(m.q)}</b></p>` : ''}
        <div class="badbox en">✘ ${esc(m.wrong)}</div>
        <p class="muted small">${L('فكّر في التصحيح ثم اكشفه', 'Think of the correction, then reveal it')}</p>
        <div id="rv" style="display:none"><div class="okbox en">✔ ${esc(m.right)} ${say(m.right)}</div><p class="small">${esc(m.ar || '')}</p></div>
        <div class="row" id="rb"><button class="btn" id="show">${L('اكشف', 'Reveal')}</button></div></div>`;
      $('#show', v).onclick = () => {
        $('#rv', v).style.display = 'block';
        $('#rb', v).innerHTML = `<button class="btn" id="knew">👍 ${L('عرفته', 'I knew it')}</button><button class="btn sec" id="again">🔁 ${L('أحتاج مراجعة', 'Need more review')}</button>`;
        $('#knew', v).onclick = () => { m.n += 1; i++; save(); draw(); };
        $('#again', v).onclick = () => { m.n = 0; i++; save(); draw(); };
      };
    };
    draw();
  }

  /* ---------- Daily plan ---------- */
  function nextGrammar() {
    const lv = LI(level());
    const pool = C.GRAMMAR.filter(g => LI(g.level) <= lv + 1);
    return pool.find(g => !(S.grammarDone[g.id] >= 80)) || pool[pool.length - 1];
  }
  function planTasks() {
    const m = S.planMinutes; const k = m / 45;
    const t = [
      { k: 'vocab', icon: '📚', label: L('مفردات جديدة ومراجعة', 'Vocabulary'), min: Math.round(10 * k), route: 'vocab' },
      { k: 'grammar', icon: '✍️', label: L('قواعد: ', 'Grammar: ') + nextGrammar().title, min: Math.round(10 * k), route: 'grammar' },
      { k: 'listening', icon: '🎧', label: L('استماع وإملاء', 'Listening & dictation'), min: Math.round(10 * k), route: 'listening' },
      { k: 'speaking', icon: '🗣️', label: L('محادثة مع المدرس', 'Speaking with the tutor'), min: Math.round(10 * k), route: 'tutor' },
      { k: 'review', icon: '🔁', label: L('مراجعة الأخطاء', 'Review'), min: Math.round(5 * k), route: 'home' }
    ];
    if (S.mepExtra) t.push({ k: 'mep', icon: '🔧', label: L('تدريب مهني وهندسي (اختياري)', 'Professional / MEP (optional)'), min: 15, route: 'mep' });
    return t;
  }
  views.plan = v => {
    const d = dayRec(); const tasks = planTasks();
    const weak = weakSkills();
    const last7 = [...Array(7)].map((_, i) => addDays(today(), i - 6));
    v.innerHTML = `
      <div class="card"><h2>🗓️ ${L('برنامج اليوم', "Today's programme")} — ${tasks.reduce((a, t) => a + t.min, 0)} ${L('دقيقة', 'min')}</h2>
        <p class="muted small">${L('الخطة تتغير حسب مستواك وأخطائك المتكررة. القواعد التالية مختارة لك تلقائياً، والمفردات من مستواك ومجالك.', 'The plan adapts to your level and recurring mistakes.')}</p>
        ${tasks.map(t => `<div class="row between" style="padding:9px 0;border-bottom:1px solid var(--line)"><span>${d.tasks[t.k] ? '✅' : '⬜'} ${t.icon} <b>${esc(t.label)}</b> <span class="muted small">${t.min} ${L('دقيقة', 'min')}</span></span><button class="btn sm" data-task="${t.k}" data-go="${t.route}">${L('ابدأ', 'Start')}</button></div>`).join('')}
        <div class="row" style="margin-top:12px">
          <label>${L('مدة الخطة اليومية', 'Daily duration')}: <select id="pMin" style="width:auto">${[20, 30, 45, 60, 90].map(x => `<option ${x === S.planMinutes ? 'selected' : ''} value="${x}">${x} ${L('دقيقة', 'min')}</option>`).join('')}</select></label>
          <label><input type="checkbox" id="pMep" ${S.mepExtra ? 'checked' : ''}> ${L('إضافة 15 دقيقة تدريب هندسي', 'Add 15 min engineering practice')}</label>
        </div></div>
      <div class="grid g2">
        <div class="card"><h3>🎯 ${L('خطتك الشخصية', 'Your personal plan')}</h3>
          <p>${L('المستوى', 'Level')}: <b>${level()}</b> → ${L('الهدف التالي', 'Next target')}: <b>${LV[Math.min(5, LI(level()) + 1)]}</b></p>
          ${weak.length ? `<p>${L('نقاط تحتاج تركيز', 'Focus areas')}: ${weak.map(w => `<span class="pill warn">${esc(w)}</span>`).join(' ')}</p>` : ''}
          <p class="small muted">${L('دروس القواعد القادمة', 'Upcoming grammar')}:</p>
          <ol class="small">${C.GRAMMAR.filter(g => LI(g.level) <= LI(level()) + 1 && !(S.grammarDone[g.id] >= 80)).slice(0, 5).map(g => `<li class="en">${esc(g.title)} <span class="muted">(${g.level})</span></li>`).join('') || '<li>' + L('أنهيت كل دروس مستواك 👏', 'All done 👏') + '</li>'}</ol>
          ${S.placement ? '' : `<button class="btn sm" data-go="tests">${L('حدّد مستواك لتخصيص الخطة', 'Take placement test')}</button>`}
        </div>
        <div class="card"><h3>📅 ${L('آخر 7 أيام', 'Last 7 days')}</h3>
          <div class="grid" style="grid-template-columns:repeat(7,1fr);gap:6px;text-align:center">
          ${last7.map(day => { const r = S.days[day]; const n = r ? Object.keys(r.tasks).length : 0; return `<div><div class="small muted">${new Date(day).toLocaleDateString(S.ui === 'en' ? 'en' : 'ar', { weekday: 'short' })}</div><div style="height:46px;border-radius:9px;background:${n ? 'var(--brand)' : 'var(--surface2)'};opacity:${n ? 0.35 + Math.min(n, 6) / 10 : 1};display:grid;place-items:center;color:#fff;font-weight:700">${n || ''}</div></div>`; }).join('')}
          </div><p class="small muted">${L('عدد المهام المنجزة يومياً', 'Tasks completed per day')}</p></div>
      </div>`;
    $('#pMin', v).onchange = e => { S.planMinutes = +e.target.value; save(); route(); };
    $('#pMep', v).onchange = e => { S.mepExtra = e.target.checked; save(); route(); };
    $$('[data-task="review"]', v).forEach(b => b.onclick = e => { e.stopPropagation(); startTask('review'); });
  };
  function weakSkills() {
    const sk = skillMap(); return Object.entries(sk).filter(([, x]) => x != null && x < 55).sort((a, b) => a[1] - b[1]).slice(0, 3).map(([k]) => SKILL_AR[k]);
  }

  /* ---------- Levels ---------- */
  let levelTab = null;
  views.levels = v => {
    levelTab = levelTab || level();
    const units = C.UNITS[levelTab] || [];
    const done = units.filter((_, i) => S.unitsDone[levelTab + '-' + i]).length;
    v.innerHTML = `<div class="tabs">${C.LEVELS.map(l => `<button class="tab ${l.id === levelTab ? 'on' : ''}" data-l="${l.id}">${l.id} · ${L(l.ar, l.name)}${S.certs[l.id] ? ' 🏅' : ''}</button>`).join('')}</div>
      <div class="card"><h2>${levelTab} – ${C.LEVELS[LI(levelTab)].name} <span class="muted small">(${C.LEVELS[LI(levelTab)].ar})</span></h2><p class="muted">${C.LEVELS[LI(levelTab)].desc}</p>
        <div class="bar"><i style="width:${units.length ? done / units.length * 100 : 0}%"></i></div><p class="small muted">${done}/${units.length} ${L('وحدات مكتملة', 'units complete')}</p></div>
      <div class="grid g2">${units.map((u, i) => { const g = C.GRAMMAR.find(x => x.id === u.g); const ok = S.unitsDone[levelTab + '-' + i]; return `<button class="tile" data-u="${i}"><div class="row between"><b>${L('الوحدة', 'Unit')} ${i + 1}</b>${ok ? '<span class="pill ok">✔</span>' : ''}</div><div class="en" style="font-size:17px;font-weight:600">${esc(u.t)}</div><div class="small muted">✍️ ${esc(g.title)} · 📚 ${esc(C.VOCAB_SETS.find(s => s.id === u.v).ar)} · 💬 ${esc(C.DIALOGUES.find(x => x.id === u.d).ar)}${u.r ? ' · 📖' : ''}</div></button>`; }).join('')}</div>
      <div class="card" style="margin-top:16px"><h3>🏁 ${L('التقييم النهائي للمستوى', 'Final level assessment')} ${levelTab}</h3><p class="muted small">${L('10 أسئلة. النجاح 70% أو أكثر يمنحك شهادة إتمام المستوى وينقلك للمستوى التالي.', '10 questions; 70% passes, gives a certificate and moves you up.')}</p>
        ${S.levelTests[levelTab] != null ? `<p>${L('آخر نتيجة', 'Last score')}: <b>${S.levelTests[levelTab]}%</b></p>` : ''}<button class="btn" id="lvTest">${L('ابدأ التقييم', 'Start assessment')}</button></div>`;
    $$('[data-l]', v).forEach(b => b.onclick = () => { levelTab = b.dataset.l; route(); });
    $$('[data-u]', v).forEach(b => b.onclick = () => openUnit(v, levelTab, +b.dataset.u));
    $('#lvTest', v).onclick = () => levelTest(v, levelTab);
  };
  function openUnit(v, lv, i) {
    const u = C.UNITS[lv][i]; const g = C.GRAMMAR.find(x => x.id === u.g); const set = C.VOCAB_SETS.find(s => s.id === u.v);
    const words = set.words.slice((i * 6) % Math.max(1, set.words.length - 6), (i * 6) % Math.max(1, set.words.length - 6) + 8);
    const dlg = C.DIALOGUES.find(x => x.id === u.d); const rd = u.r && C.READINGS.find(x => x.id === u.r);
    const g2 = u.g2 && C.GRAMMAR.find(x => x.id === u.g2);
    v.innerHTML = `<button class="btn ghost sm" id="back">← ${L('رجوع', 'Back')}</button>
      <div class="card"><div class="small muted">${lv} · ${L('الوحدة', 'Unit')} ${i + 1}</div><h2 class="en">${esc(u.t)}</h2></div>
      <div class="card"><h3>1️⃣ ✍️ ${L('القواعد', 'Grammar')}: <span class="en">${esc(g.title)}</span></h3><p>${esc(g.explain)}</p><ul>${g.rules.map(r => `<li class="en">${esc(r)} ${say(r.split('(')[0])}</li>`).join('')}</ul>
        ${g2 ? `<h3 class="en">+ ${esc(g2.title)}</h3><p>${esc(g2.explain)}</p><ul>${g2.rules.map(r => `<li class="en">${esc(r)} ${say(r.split('(')[0])}</li>`).join('')}</ul>` : ''}</div>
      <div class="card"><h3>2️⃣ 📚 ${L('كلمات ومصطلحات', 'Words')}</h3><table>${words.map(w => `<tr><td class="en"><b>${esc(w.en)}</b> ${say(w.en)}${pa(w.en)}</td><td>${esc(w.ar)}</td><td class="en small muted">${esc(w.ex)}${exa(w)}</td></tr>`).join('')}</table>
        <button class="btn sm sec" id="addW" style="margin-top:8px">➕ ${L('أضف الكلمات لمراجعتي', 'Add to my review')}</button></div>
      <div class="card"><h3>3️⃣ 💬 ${L('محادثة', 'Dialogue')}: ${esc(dlg.ar)}</h3>${dialogueHTML(dlg)}</div>
      ${rd ? `<div class="card"><h3>4️⃣ 📖 ${L('قراءة', 'Reading')}: <span class="en">${esc(rd.title)}</span></h3><p class="en">${esc(rd.text)} ${say(rd.text)}</p></div>` : ''}
      <div class="card"><h3>✅ ${L('اختبار الوحدة', 'Unit quiz')}</h3><div id="uq"></div></div>`;
    $('#back', v).onclick = () => route();
    bindDialogue(v, dlg);
    $('#addW', v).onclick = () => { words.forEach(addToSRS); save(); toast(L('تمت الإضافة', 'Added')); };
    const qs = [...g.ex.map(exToQ), ...(g2 ? g2.ex.slice(0, 2).map(exToQ) : []), ...wordQuiz(words, 3), ...(rd ? rd.q.map(q => ({ type: 'mc', q: q[0], options: q[1], answer: q[2] })) : [])];
    runQuiz($('#uq', v), qs, {
      title: u.t, src: 'unit ' + lv, onDone: pct => {
        S.grammarDone[g.id] = Math.max(S.grammarDone[g.id] || 0, pct);
        if (pct >= 60) { if (!S.unitsDone[lv + '-' + i]) { S.unitsDone[lv + '-' + i] = today(); addXP(50); } doneTask('grammar'); }
        setSkill('grammar', pct); save();
      }
    });
  }
  function levelTest(v, lv) {
    const fromPlacement = C.PLACEMENT.filter(p => p[0] === lv).map(p => ({ type: 'mc', q: p[1], options: p[2], answer: p[3] }));
    const fromGrammar = C.GRAMMAR.filter(g => g.level === lv).flatMap(g => g.ex).map(exToQ);
    const qs = shuffle([...fromPlacement, ...pick(fromGrammar, 10 - fromPlacement.length)]).slice(0, 10);
    v.innerHTML = `<button class="btn ghost sm" id="back">← ${L('رجوع', 'Back')}</button><div id="lt"></div>`;
    $('#back', v).onclick = () => route();
    runQuiz($('#lt', v), qs, {
      title: L('التقييم النهائي ', 'Final assessment ') + lv, src: 'level test', onDone: pct => {
        S.levelTests[lv] = pct; S.stats.tests.push({ d: today(), name: 'Level ' + lv, score: pct });
        if (pct >= 70) {
          S.certs[lv] = today(); addXP(150);
          if (LI(S.level) <= LI(lv) && lv !== 'C2') { S.level = LV[LI(lv) + 1]; renderChips(); }
          setTimeout(() => modal('🏅 ' + L('مبروك!', 'Congratulations!'), certHTML(lv), [['🎉']]), 300);
        }
        save();
      }
    });
  }
  function certHTML(lv) {
    return `<div class="cert"><div style="font-size:40px">🏅</div><div class="muted">SiteSpeak — Certificate of Completion</div><h2 class="en">${esc(S.name || 'Learner')}</h2><p class="en">has successfully completed CEFR level <b>${lv} – ${C.LEVELS[LI(lv)].name}</b></p><p class="small muted en">${S.certs[lv] || today()}</p></div><p class="small muted">${L('يمكنك أخذ لقطة شاشة للشهادة.', 'Take a screenshot to keep it.')}</p>`;
  }

  /* ---------- Dialogue component (static model dialogues with audio) ---------- */
  function dialogueHTML(dlg) {
    return `<div class="row" style="margin-bottom:8px"><button class="btn sm" data-dplay>▶️ ${L('تشغيل الحوار', 'Play dialogue')}</button><label class="small"><input type="checkbox" data-dtr checked> ${L('الترجمة العربية', 'Arabic')}</label></div>
      ${dlg.lines.map((l, i) => `<div class="row" style="align-items:flex-start;margin:6px 0;flex-wrap:nowrap" data-dl="${i}"><span class="pill" style="flex:0 0 auto">${l[0] === 'A' ? '👤 A' : '🙂 You'}</span><div><div class="en">${esc(l[1])} ${say(l[1])}</div><div class="small muted" data-ar>${esc(l[2])}</div></div></div>`).join('')}`;
  }
  function bindDialogue(root, dlg) {
    const p = $('[data-dplay]', root); if (!p) return;
    p.onclick = () => {
      let i = 0; const next = () => { $$('[data-dl]', root).forEach(x => x.style.opacity = 1); if (i >= dlg.lines.length) return; const row = $(`[data-dl="${i}"]`, root); row.style.opacity = 1; $$('[data-dl]', root).forEach(x => { if (x !== row) x.style.opacity = .45; }); TTS.speak(dlg.lines[i][1], { lang: dlg.lines[i][0] === 'A' ? 'en-GB' : 'en-US', onend: () => { i++; setTimeout(next, 350); } }); };
      next();
    };
    $('[data-dtr]', root).onchange = e => $$('[data-ar]', root).forEach(x => x.style.display = e.target.checked ? '' : 'none');
  }

  /* ---------- Translator ---------- */
  const hasAr = t => /[؀-ۿ]/.test(t);
  function dictLookup(t) {
    const q = t.trim().toLowerCase(); if (!q || q.split(/\s+/).length > 4) return [];
    if (hasAr(q)) return C.ALL_WORDS.filter(w => w.ar.includes(q)).slice(0, 6);
    return C.ALL_WORDS.filter(w => { const e = w.en.toLowerCase(); return e === q || e.startsWith(q + ' ') || e.split(/[ (/]+/).includes(q); }).slice(0, 6);
  }
  let trDraft = '';
  views.translate = v => {
    v.innerHTML = `<div class="card"><div class="row between"><h2>🌐 ${L('المترجم', 'Translator')}</h2><span class="pill" id="trDir">…</span></div>
        <p class="muted small" style="margin:0 0 8px">${L('اكتب كلمة أو جملة بالعربي أو الإنجليزي — اللغة تُكتشف تلقائياً.', 'Type Arabic or English — language is detected automatically.')}</p>
        <textarea id="trIn" placeholder="${L('اكتب هنا… مثال: يرجى اعتماد المخططات / submittal', 'Type here…')}" style="min-height:90px">${esc(trDraft)}</textarea>
        <div class="row" style="margin-top:10px"><button class="btn" id="trGo">🌐 ${L('ترجم', 'Translate')}</button><button class="mic" id="trMic" title="تحدث" style="width:42px;height:42px;flex:0 0 42px">🎙️</button><button class="btn sec sm" id="trSay">🔊</button><button class="btn ghost sm" id="trClr">✖ ${L('مسح', 'Clear')}</button></div>
        <div id="trOut" style="margin-top:12px"></div></div>
      ${(S.saved || []).length ? `<div class="card"><h3>⭐ ${L('كلماتي وجملي المحفوظة', 'My saved items')}</h3><table>${S.saved.slice(0, 40).map((x, i) => `<tr><td class="en"><b>${esc(x.en)}</b> ${say(x.en)}${x.pa && S.showPA !== false ? `<div class="pa" dir="rtl">🗣️ ${esc(x.pa)}</div>` : ''}</td><td>${esc(x.ar)}</td><td><button class="btn sm ghost" data-unsave="${i}">✖</button></td></tr>`).join('')}</table></div>` : ''}
      ${(S.trHistory || []).length ? `<div class="card"><h3>🕘 ${L('آخر الترجمات', 'Recent')}</h3>${S.trHistory.slice(0, 15).map((h, i) => `<button class="opt" data-h="${i}"><span class="${hasAr(h.src) ? '' : 'en'}">${esc(h.src)}</span><br><span class="small muted ${hasAr(h.out) ? '' : 'en'}">→ ${esc(h.out)}</span></button>`).join('')}</div>` : ''}`;
    const inp = $('#trIn', v), out = $('#trOut', v);
    const dir = () => { const ar = hasAr(inp.value); $('#trDir', v).textContent = inp.value.trim() ? (ar ? L('من العربية إلى الإنجليزية', 'Arabic to English') : L('من الإنجليزية إلى العربية', 'English to Arabic')) : L('عربي ⇄ إنجليزي', 'AR ⇄ EN'); inp.className = ar || !inp.value ? '' : 'en'; };
    inp.oninput = () => { trDraft = inp.value; dir(); }; dir();
    inp.onkeydown = e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) translate(); };
    $('#trClr', v).onclick = () => { inp.value = ''; trDraft = ''; out.innerHTML = ''; dir(); inp.focus(); };
    $('#trSay', v).onclick = () => { if (inp.value.trim() && !hasAr(inp.value)) TTS.speak(inp.value); };
    let rec = false;
    $('#trMic', v).onclick = () => { const m = $('#trMic', v); if (rec) { STT.stop(); return; } if (STT.start(t => { inp.value = t; trDraft = t; dir(); }, () => { rec = false; m.classList.remove('rec'); })) { rec = true; m.classList.add('rec'); } };
    $$('[data-h]', v).forEach(b => b.onclick = () => { const h = S.trHistory[+b.dataset.h]; inp.value = h.src; trDraft = h.src; dir(); translate(); window.scrollTo(0, 0); });
    $$('[data-unsave]', v).forEach(b => b.onclick = () => { S.saved.splice(+b.dataset.unsave, 1); save(); route(); });
    $('#trGo', v).onclick = translate;
    async function translate() {
      const text = inp.value.trim(); if (!text) { inp.focus(); return; }
      const ar = hasAr(text); const dict = dictLookup(text);
      const dictHTML = dict.length ? `<div class="sep"></div><h3>📚 ${L('من قاموس المنصة', 'From the platform dictionary')}</h3>${dict.map(w => `<div style="padding:6px 0;border-bottom:1px solid var(--line)"><b class="en">${esc(w.en)}</b> ${say(w.en)} — <b>${esc(w.ar)}</b>${pa(w.en)}<div class="en small muted">${esc(w.ex)}</div>${exa(w)}</div>`).join('')}` : '';
      if (!AI.ok()) {
        out.innerHTML = dict.length ? dictHTML : `<div class="note">${L('ترجمة الجمل تحتاج الذكاء الاصطناعي — افتح المنصة من رابطها على Claude. القاموس الداخلي يترجم مصطلحات المنصة فقط.', 'Sentence translation needs AI (open via the Claude link).')}</div>`;
        return;
      }
      out.innerHTML = `<p class="muted">⏳ ${L('جارٍ الترجمة…', 'Translating…')}</p>`; $('#trGo', v).disabled = true;
      try {
        const r = await AI.json(`You are a precise translator for an Arabic-speaking engineer learning English (use construction / MEP terminology when the text is technical, otherwise everyday meaning).
Translate this ${ar ? 'Arabic text into natural, correct English' : 'English text into clear Modern Standard Arabic'}:
<<<${text}>>>
Return ONLY JSON:
{"translation": "best translation",
 "alternatives": ["up to 2 other natural ways to say it, in the target language"],
 "pronunciation_ar": "the ENGLISH side (${ar ? 'your translation' : 'the original text'}) written in Arabic letters for pronunciation, using پ=P ڤ=V چ=hard G ج=J ث=th as in think ذ=th as in this تش=ch",
 "notes_ar": "one or two short Arabic sentences about meaning, register or usage (empty string if not needed)",
 "key_words": [{"en": "word", "ar": "معنى"}]}
key_words: up to 5 important words only when the text has more than 3 words, else [].`);
        const en = ar ? r.translation : text, arTxt = ar ? text : r.translation;
        out.innerHTML = `<div class="okbox" style="font-size:19px;color:var(--text);background:var(--brandSoft)"><div class="${ar ? 'en' : ''}" style="font-weight:600">${esc(r.translation)}</div>
            ${r.pronunciation_ar && S.showPA !== false ? `<div class="pa" dir="rtl" style="font-size:15px">🗣️ ${esc(r.pronunciation_ar)}</div>` : ''}</div>
          <div class="row" style="margin-top:8px"><button class="btn sm sec" id="tS">🔊 ${L('استمع للإنجليزي', 'Listen')}</button><button class="btn sm sec" id="tSl">🐢</button><button class="btn sm sec" id="tC">📋 ${L('نسخ', 'Copy')}</button><button class="btn sm" id="tSave">⭐ ${L('احفظ', 'Save')}</button></div>
          ${(r.alternatives || []).filter(Boolean).length ? `<p class="small muted" style="margin:10px 0 4px">${L('صيغ أخرى', 'Alternatives')}:</p>${r.alternatives.filter(Boolean).map(a => `<div class="${ar ? 'en' : ''}">• ${esc(a)} ${ar ? say(a) : ''}</div>`).join('')}` : ''}
          ${r.notes_ar ? `<div class="info small" style="margin-top:10px">💡 ${esc(r.notes_ar)}</div>` : ''}
          ${(r.key_words || []).length ? `<table style="margin-top:10px">${r.key_words.map(k => `<tr><td class="en"><b>${esc(k.en)}</b> ${say(k.en)}${pa(k.en)}</td><td>${esc(k.ar)}</td></tr>`).join('')}</table>` : ''}
          ${dictHTML}`;
        $('#tS', v).onclick = () => TTS.speak(en); $('#tSl', v).onclick = () => TTS.speak(en, { rate: 0.7 });
        $('#tC', v).onclick = () => navigator.clipboard.writeText(r.translation).then(() => toast(L('تم النسخ', 'Copied')), () => toast('—'));
        $('#tSave', v).onclick = () => { S.saved = S.saved || []; if (!S.saved.some(x => x.en === en)) { S.saved.unshift({ en, ar: arTxt, pa: r.pronunciation_ar || '', d: today() }); if (S.saved.length > 200) S.saved.length = 200; save(); } toast('⭐ ' + L('تم الحفظ في كلماتي', 'Saved')); };
        if (ar) TTS.speak(en);
        S.trHistory = [{ src: text, out: r.translation }, ...(S.trHistory || []).filter(h => h.src !== text)].slice(0, 30);
        markActive(); save();
      } catch (e) { out.innerHTML = `<div class="badbox">${esc(AI.errText(e))}</div>` + dictHTML; }
      $('#trGo', v).disabled = false;
    }
    if (!('ontouchstart' in window)) inp.focus();
  };

  /* ---------- AI Tutor ---------- */
  views.tutor = v => {
    v.innerHTML = `${aiNote()}<div class="card"><h2>🤖 ${L('مدرسك الشخصي', 'Your AI tutor')}</h2>
      <p class="muted small">${L('تحدث بالإنجليزية عن أي موضوع. المدرس يتكيف مع مستواك، يتذكر أخطاءك المتكررة، ويعطيك تقييماً بعد الانتهاء. للتحدث صوتياً استخدم زر 🎙️ أو الإملاء الصوتي في لوحة مفاتيح هاتفك.', 'Talk about anything; the tutor adapts to you and evaluates at the end.')}</p>
      <div class="grid g2">
        <label>${L('نوع التدريب', 'Mode')}<select id="tMode"><option value="fluency">${L('طلاقة — بدون مقاطعة، التصحيح في النهاية', 'Fluency — feedback at the end')}</option><option value="correct">${L('تصحيح فوري — تصحيح كل رسالة بالعربية', 'Instant correction')}</option></select></label>
        <label>${L('الموضوع', 'Topic')}<select id="tTopic"><option value="free">${L('حديث حر — المدرس يختار', 'Free talk')}</option>${C.DIALOGUES.map(d => `<option value="${d.id}">${esc(d.ar)} — ${esc(d.title)}</option>`).join('')}<option value="work">${L('عملي ومشروعي الحالي', 'My work and project')}</option></select></label>
      </div><div class="row" style="margin-top:12px"><button class="btn" id="tGo" ${AI.ok() ? '' : 'disabled'}>▶️ ${L('ابدأ المحادثة', 'Start conversation')}</button></div></div>
      <div class="card"><h3>📖 ${L('بدون ذكاء اصطناعي: حوارات نموذجية', 'Offline: model dialogues')}</h3><p class="muted small">${L('استمع للحوار وكرّر بصوت عالٍ دور "You".', 'Listen and repeat the "You" lines aloud.')}</p>
        <select id="dSel">${C.DIALOGUES.map(d => `<option value="${d.id}">${d.level} · ${esc(d.ar)}</option>`).join('')}</select><div id="dBox" style="margin-top:10px"></div></div>
      <div id="tChat"></div>`;
    const showD = () => { const d = C.DIALOGUES.find(x => x.id === $('#dSel', v).value); $('#dBox', v).innerHTML = dialogueHTML(d); bindDialogue($('#dBox', v), d); };
    $('#dSel', v).onchange = showD; showD();
    $('#tGo', v).onclick = () => {
      const topic = $('#tTopic', v).value; const d = C.DIALOGUES.find(x => x.id === topic);
      const sys = topic === 'free' ? `You are "Emma", a friendly, patient English tutor and conversation partner. Start a natural conversation; pick an everyday topic suited to the learner's level and life in Riyadh.`
        : topic === 'work' ? `You are "Emma", an English tutor who is also familiar with construction and MEP. Have a natural conversation about the learner's work: his projects, daily tasks on site, challenges and plans. Ask follow-up questions.`
          : `You are role-playing ${d.role}. Situation: ${d.title}. Make it realistic and stay in role.`;
      const card = v.querySelector('.card'); card.style.display = 'none';
      $('#tChat', v).scrollIntoView();
      chatUI($('#tChat', v), {
        title: topic === 'free' ? L('محادثة حرة مع Emma', 'Free talk with Emma') : (d ? d.title : L('حديث عن عملك', 'Your work')), kind: 'tutor', mode: $('#tMode', v).value, system: sys,
        onEval: () => { S.stats.conversations++; doneTask('speaking'); save(); }
      });
    };
  };

  /* ---------- Vocabulary + SRS ---------- */
  const INTERVALS = [0, 1, 3, 7, 14, 30, 60, 120];
  function addToSRS(w) { if (!S.srs[w.en]) S.srs[w.en] = { box: 0, due: today(), seen: 0, wrong: 0 }; }
  function dueWords() { const t = today(); return Object.entries(S.srs).filter(([, x]) => x.due <= t && x.seen > 0).map(([en]) => C.ALL_WORDS.find(w => w.en === en)).filter(Boolean); }
  function todaysNewWords() {
    const r = dayRec();
    if (!r.newWords) {
      const lv = LI(level());
      const pro = S.goal !== 'daily';
      let pool = C.ALL_WORDS.filter(w => LI(w.level) <= lv + 1 && !S.srs[w.en]);
      const tech = pool.filter(w => ['hvac', 'fire', 'plumbing', 'electrical', 'construction', 'pm'].includes(w.set));
      const gen = pool.filter(w => !tech.includes(w));
      const out = []; let a = 0, b = 0;
      while (out.length < S.newPerDay && (a < gen.length || b < tech.length)) {
        if (pro && b < tech.length && (out.length % 2 === 1 || a >= gen.length)) out.push(tech[b++]); else if (a < gen.length) out.push(gen[a++]); else out.push(tech[b++]);
      }
      r.newWords = out.map(w => w.en); save();
    }
    return r.newWords.map(en => C.ALL_WORDS.find(w => w.en === en)).filter(Boolean);
  }
  let vocabTab = 'today';
  views.vocab = v => {
    const tabs = [['today', '🗓️ ' + L('جلسة اليوم', "Today's session")], ['sets', '📂 ' + L('المجموعات', 'Word sets')], ['hard', '⚠️ ' + L('الكلمات الصعبة', 'Hard words')], ['quiz', '❓ ' + L('اختبار سريع', 'Quick quiz')]];
    v.innerHTML = `<div class="tabs">${tabs.map(t => `<button class="tab ${t[0] === vocabTab ? 'on' : ''}" data-t="${t[0]}">${t[1]}</button>`).join('')}</div><div id="vb"></div>`;
    $$('[data-t]', v).forEach(b => b.onclick = () => { vocabTab = b.dataset.t; route(); });
    const box = $('#vb', v);
    if (vocabTab === 'today') {
      const nw = todaysNewWords().filter(w => !(S.srs[w.en] && S.srs[w.en].seen)); const due = dueWords();
      box.innerHTML = `<div class="card"><h2>📚 ${L('جلسة المفردات', 'Vocabulary session')}</h2><p>${nw.length} ${L('كلمات جديدة', 'new words')} + ${due.length} ${L('مراجعة متباعدة', 'spaced reviews')}</p><p class="muted small">${L('نظام المراجعة المتباعدة: الكلمة التي تعرفها تظهر بعد أيام أطول، والصعبة تعود قريباً.', 'Spaced repetition: known words come back later, hard ones sooner.')}</p>
        <button class="btn" id="vGo" ${nw.length + due.length ? '' : 'disabled'}>▶️ ${L('ابدأ', 'Start')}</button> ${!nw.length && !due.length ? `<span class="okbox" style="display:inline-block">${L('أنهيت جلسة اليوم 🎉 تعال غداً أو تصفح المجموعات.', 'All done for today 🎉')}</span>` : ''}</div>`;
      $('#vGo', v).onclick = () => flashSession(box, [...nw, ...shuffle(due)].slice(0, 30));
    } else if (vocabTab === 'sets') {
      let cur = C.VOCAB_SETS[0].id;
      const draw = () => {
        const set = C.VOCAB_SETS.find(s => s.id === cur);
        box.innerHTML = `<div class="tabs">${C.VOCAB_SETS.map(s => `<button class="tab ${s.id === cur ? 'on' : ''}" data-s="${s.id}">${esc(s.ar)} <span class="muted">${s.level}</span></button>`).join('')}</div>${wordTable(set.words)}`;
        $$('[data-s]', box).forEach(b => b.onclick = () => { cur = b.dataset.s; draw(); });
        bindWordTable(box);
      };
      draw();
    } else if (vocabTab === 'hard') {
      const hard = Object.entries(S.srs).filter(([, x]) => x.wrong > 0).sort((a, b) => b[1].wrong - a[1].wrong).map(([en]) => C.ALL_WORDS.find(w => w.en === en)).filter(Boolean);
      box.innerHTML = hard.length ? `<div class="card"><button class="btn" id="hGo">🔁 ${L('راجع الكلمات الصعبة', 'Review hard words')}</button></div>` + wordTable(hard) : `<div class="card muted">${L('لا توجد كلمات صعبة بعد.', 'No hard words yet.')}</div>`;
      if (hard.length) { $('#hGo', box).onclick = () => flashSession(box, hard.slice(0, 20)); bindWordTable(box); }
    } else {
      const known = Object.keys(S.srs).map(en => C.ALL_WORDS.find(w => w.en === en)).filter(Boolean);
      const pool = known.length >= 5 ? known : C.ALL_WORDS.filter(w => LI(w.level) <= LI(level()) + 1);
      runQuiz(box, wordQuiz(pool, 10), { title: L('اختبار المفردات', 'Vocabulary quiz'), src: 'vocab', reshuffle: true, onDone: p => { setSkill('vocabulary', p); addXP(15); } });
    }
  };
  function wordTable(words) {
    return `<div class="card scroll-x"><table><tr><th>English</th><th>${L('العربية', 'Arabic')}</th><th>${L('المعنى والمثال', 'Meaning & example')}</th><th></th></tr>${words.map(w => `<tr><td class="en"><b>${esc(w.en)}</b>${pa(w.en)}${say(w.en)} ${S.srs[w.en] ? `<span class="pill ${S.srs[w.en].box >= 2 ? 'ok' : ''}">${L('مربع', 'box')} ${S.srs[w.en].box}</span>` : ''}</td><td>${esc(w.ar)}</td><td class="en small">${esc(w.def)}<br><i>${esc(w.ex)}</i> ${say(w.ex)}${exa(w)}${w.syn ? `<br><span class="muted">≈ ${esc(w.syn)}</span>` : ''}${w.ant ? ` <span class="muted">≠ ${esc(w.ant)}</span>` : ''}</td><td>${S.srs[w.en] ? '' : `<button class="btn sm sec" data-add="${esc(w.en)}">➕</button>`}</td></tr>`).join('')}</table></div>`;
  }
  function bindWordTable(root) { $$('[data-add]', root).forEach(b => b.onclick = () => { const w = C.ALL_WORDS.find(x => x.en === b.dataset.add); addToSRS(w); S.srs[w.en].seen = 1; save(); b.remove(); toast(L('أُضيفت للمراجعة', 'Added to review')); }); }
  function flashSession(box, words) {
    let i = 0, flipped = false; const reviewed = [];
    const draw = () => {
      if (i >= words.length) {
        doneTask('vocab'); setSkill('vocabulary', Math.round(Object.values(S.srs).filter(x => x.box >= 2).length / Math.max(1, Object.keys(S.srs).length) * 100));
        box.innerHTML = `<div class="card"><h2>✅ ${L('أنهيت', 'Done')} ${words.length} ${L('كلمة', 'words')}</h2><p>${L('اختبار سريع على كلمات الجلسة:', 'Quick quiz on these words:')}</p><div id="fq"></div></div>`;
        runQuiz($('#fq', box), wordQuiz(reviewed, 5), { title: L('اختبار سريع', 'Quick quiz'), src: 'vocab', onDone: p => { addXP(10); setSkill('vocabulary', p); } });
        return;
      }
      const w = words[i]; flipped = false;
      box.innerHTML = `<div class="card"><div class="row between small muted"><span>${esc(C.VOCAB_SETS.find(s => s.id === w.set).ar)} · ${w.level}</span><span>${i + 1}/${words.length}</span></div>
        <div class="bar" style="margin:6px 0 12px"><i style="width:${i / words.length * 100}%"></i></div>
        <div class="flash" id="fc"><div class="w en">${esc(w.en)}</div>${pa(w.en, true)}<div class="muted small">${L('اضغط لعرض المعنى', 'Tap to reveal')}</div><div id="back" style="display:none;margin-top:12px"><div style="font-size:20px;font-weight:600">${esc(w.ar)}</div><div class="en small">${esc(w.def)}</div><div class="en" style="margin-top:6px"><i>${esc(w.ex)}</i></div>${exa(w)}${w.syn ? `<div class="en small muted">≈ ${esc(w.syn)}${w.ant ? ' · ≠ ' + esc(w.ant) : ''}</div>` : ''}</div></div>
        <div class="row" style="justify-content:center;margin-top:10px"><button class="speak" data-say="${esc(w.en)}">🔊 ${L('الكلمة', 'Word')}</button><button class="speak" data-say="${esc(w.ex)}">🔊 ${L('المثال', 'Example')}</button></div>
        <div class="row" id="grade" style="justify-content:center;margin-top:12px;visibility:hidden">
          <button class="btn danger sm" data-g="0">${L('لم أعرفها', 'Again')}</button><button class="btn sec sm" data-g="1">${L('صعبة', 'Hard')}</button><button class="btn sm" data-g="2">${L('جيدة', 'Good')}</button><button class="btn sm" data-g="3" style="background:var(--accent)">${L('سهلة جداً', 'Easy')}</button></div></div>`;
      TTS.speak(w.en);
      $('#fc', box).onclick = () => { if (flipped) return; flipped = true; $('#back', box).style.display = 'block'; $('#grade', box).style.visibility = 'visible'; };
      $$('[data-g]', box).forEach(b => b.onclick = e => {
        e.stopPropagation(); const g = +b.dataset.g; addToSRS(w); const s = S.srs[w.en]; s.seen++;
        if (g === 0) { s.box = 0; s.wrong++; addMistake({ src: 'vocab', wrong: w.en + ' = ?', right: w.en + ' = ' + w.ar, ar: w.def }); }
        else if (g === 1) { s.box = Math.max(1, s.box); s.wrong++; }
        else s.box = Math.min(7, s.box + (g === 3 ? 2 : 1));
        s.due = addDays(today(), g === 0 ? 0 : INTERVALS[s.box]);
        if (g === 0) words.push(w);
        if (!reviewed.includes(w)) reviewed.push(w);
        addXP(2); i++; draw();
      });
    };
    draw();
  }

  /* ---------- Grammar ---------- */
  views.grammar = v => {
    v.innerHTML = `${LV.map(lv => { const gs = C.GRAMMAR.filter(g => g.level === lv); if (!gs.length) return ''; return `<h3 style="margin:14px 0 8px">${lv} – ${C.LEVELS[LI(lv)].ar}</h3><div class="grid g3">${gs.map(g => `<button class="tile" data-g="${g.id}"><b class="en">${esc(g.title)}</b><div class="small muted">${esc(g.ar)}</div>${S.grammarDone[g.id] != null ? `<span class="pill ${S.grammarDone[g.id] >= 80 ? 'ok' : 'warn'}">${S.grammarDone[g.id]}%</span>` : ''}</button>`).join('')}</div>`; }).join('')}
      <div class="card" style="margin-top:18px"><h2>⏱️ ${L('الأزمنة الاثنا عشر', 'The 12 tenses')}</h2><div class="scroll-x"><table><tr><th>Tense</th><th>${L('الزمن', 'Arabic')}</th><th>Example</th></tr>${C.TENSES.map(t => `<tr><td class="en"><b>${t[0]}</b></td><td>${t[1]}</td><td class="en">${esc(t[2])} ${say(t[2])}</td></tr>`).join('')}</table></div></div>`;
    $$('[data-g]', v).forEach(b => b.onclick = () => grammarLesson(v, C.GRAMMAR.find(g => g.id === b.dataset.g)));
  };
  function grammarLesson(v, g) {
    v.innerHTML = `<button class="btn ghost sm" id="back">← ${L('كل الدروس', 'All lessons')}</button>
      <div class="card"><span class="pill">${g.level}</span><h2 class="en">${esc(g.title)}</h2><h3>${esc(g.ar)}</h3><p>${esc(g.explain)}</p>
      <h3>${L('أمثلة', 'Examples')}</h3><ul>${g.rules.map(r => `<li class="en">${esc(r)} ${say(r.split('(')[0])}</li>`).join('')}</ul></div>
      <div id="gq"></div><div class="card"><h3>🤖 ${L('تدريب إضافي بالذكاء الاصطناعي', 'More AI practice')}</h3><p class="muted small">${L('5 تمارين جديدة على نفس القاعدة بأمثلة من مجال عملك.', '5 new exercises on this rule with work examples.')}</p><button class="btn sec" id="gMore" ${AI.ok() ? '' : 'disabled'}>✨ ${L('أنشئ تمارين جديدة', 'Generate exercises')}</button><div id="gq2" style="margin-top:10px"></div></div>`;
    $('#back', v).onclick = () => route();
    const done = pct => { S.grammarDone[g.id] = Math.max(S.grammarDone[g.id] || 0, pct); setSkill('grammar', pct); addXP(20); if (pct >= 60) doneTask('grammar'); save(); };
    runQuiz($('#gq', v), g.ex.map(exToQ), { title: g.title, src: 'grammar', onDone: done });
    $('#gMore', v).onclick = async () => {
      const box = $('#gq2', v); box.innerHTML = '<p class="muted">⏳ …</p>';
      try {
        const r = await AI.json(`Create 5 NEW multiple-choice exercises to practise "${g.title}" for an Arabic-speaking learner at CEFR ${g.level}. Use realistic sentences from construction / MEP site work and daily life. Each exercise tests the grammar point, with exactly 3 options and one correct answer.
Return ONLY JSON: {"items":[{"q":"sentence with ___","options":["a","b","c"],"answer":0,"explain_ar":"شرح قصير بالعربية"}]}`);
        const qs = (r.items || []).filter(x => x.options && x.options.length >= 2).map(x => ({ type: 'mc', q: x.q, options: x.options, answer: +x.answer, explain: x.explain_ar }));
        if (!qs.length) throw { message: 'empty' };
        runQuiz(box, qs, { title: 'AI · ' + g.title, src: 'grammar', onDone: done });
      } catch (e) { box.innerHTML = `<div class="badbox">${esc(AI.errText(e))}</div>`; }
    };
  }

  /* ---------- Listening ---------- */
  let lisTab = 'dialogues';
  views.listening = v => {
    const tabs = [['dialogues', '💬 ' + L('حوارات بسرعات مختلفة', 'Dialogues')], ['dictation', '✍️ ' + L('إملاء', 'Dictation')], ['accents', '🌍 ' + L('اللهجات', 'Accents')]];
    v.innerHTML = `<div class="tabs">${tabs.map(t => `<button class="tab ${t[0] === lisTab ? 'on' : ''}" data-t="${t[0]}">${t[1]}</button>`).join('')}</div><div id="lb"></div>`;
    $$('[data-t]', v).forEach(b => b.onclick = () => { lisTab = b.dataset.t; route(); });
    const box = $('#lb', v);
    const speeds = `<div class="row small">${L('السرعة', 'Speed')}: ${[0.7, 0.85, 1, 1.15].map(r => `<button class="tab ${S.rate === r ? 'on' : ''}" data-rate="${r}">${r}×</button>`).join('')}</div>`;
    if (lisTab === 'dialogues') {
      box.innerHTML = `<div class="card">${speeds}<select id="ld" style="margin-top:10px">${C.DIALOGUES.map(d => `<option value="${d.id}">${d.level} · ${esc(d.ar)} — ${esc(d.title)}</option>`).join('')}</select>
        <p class="muted small">${L('نصيحة: استمع أولاً بدون ترجمة، ثم مع النص.', 'Tip: listen first without the text.')}</p><div id="ldb"></div><div id="ldq"></div></div>`;
      const show = () => {
        const d = C.DIALOGUES.find(x => x.id === $('#ld', box).value);
        $('#ldb', box).innerHTML = `<label class="small"><input type="checkbox" id="hideTxt" checked> ${L('إخفاء النص (تدريب الأذن)', 'Hide text (ear training)')}</label><div id="dtext" style="display:none">${dialogueHTML(d)}</div><div class="row" style="margin-top:8px"><button class="btn" id="pl">▶️ ${L('استمع', 'Listen')}</button><button class="btn sec" id="qz">❓ ${L('أسئلة فهم', 'Comprehension')}</button></div>`;
        bindDialogue($('#ldb', box), d);
        $('#hideTxt', box).onchange = e => $('#dtext', box).style.display = e.target.checked ? 'none' : '';
        $('#pl', box).onclick = () => $('[data-dplay]', box).click();
        $('#qz', box).onclick = () => {
          const qs = pick(d.lines, 3).map(l => { const others = pick(C.DIALOGUES.flatMap(x => x.lines).filter(x => x[2] !== l[2]), 2).map(x => x[2]); const o = shuffle([l[2], ...others]); return { type: 'mc', q: L('استمع: ما معنى الجملة؟', 'Listen: what does it mean?'), options: o, answer: o.indexOf(l[2]), explain: l[1], say: l[1] }; });
          runQuizListen($('#ldq', box), qs);
        };
      };
      $('#ld', box).onchange = show; show();
    } else if (lisTab === 'dictation') {
      const pool = [...C.GRAMMAR.filter(g => LI(g.level) <= LI(level()) + 1).flatMap(g => g.rules.map(r => r.split('(')[0].trim())), ...C.ALL_WORDS.filter(w => LI(w.level) <= LI(level()) + 1).map(w => w.ex)].filter(s => s.split(' ').length >= 4);
      let n = 0, total = 0, sent = pick(pool, 1)[0];
      const draw = () => {
        box.innerHTML = `<div class="card">${speeds}<h2>✍️ ${L('اكتب ما تسمعه', 'Write what you hear')}</h2><p class="muted small">${L('استمع للجملة (يمكنك التكرار) ثم اكتبها كما سمعتها.', 'Listen (repeat if needed) and type it.')}</p>
          <div class="row"><button class="btn" id="dp">🔊 ${L('استمع', 'Listen')}</button><button class="btn sec" id="ds">🐢 ${L('ببطء', 'Slowly')}</button><span class="muted small">${L('الجمل', 'Sentences')}: ${n} · ${L('الدقة', 'Accuracy')}: ${n ? Math.round(total / n) : 0}%</span></div>
          <textarea id="dt" class="en" style="margin-top:10px;min-height:70px" placeholder="Type here…"></textarea><div id="dr" style="margin-top:8px"></div>
          <div class="row" style="margin-top:8px"><button class="btn" id="dc">${L('تحقق', 'Check')}</button><button class="btn ghost" id="dn">${L('جملة أخرى', 'Next')}</button></div></div>`;
        $('#dp', box).onclick = () => TTS.speak(sent); $('#ds', box).onclick = () => TTS.speak(sent, { rate: 0.65 });
        $('#dn', box).onclick = () => { sent = pick(pool, 1)[0]; draw(); };
        $('#dc', box).onclick = () => {
          const target = norm(sent).split(' '), got = norm($('#dt', box).value).split(' ');
          const res = diffWords(target, got); const acc = Math.round(res.hit / target.length * 100);
          n++; total += acc; S.stats.dictations++; setSkill('listening', acc); addXP(5); if (n >= 3) doneTask('listening');
          if (acc < 80) addMistake({ src: 'dictation', wrong: $('#dt', box).value, right: sent, ar: 'إملاء استماع' });
          $('#dr', box).innerHTML = `<div class="${acc >= 80 ? 'okbox' : 'badbox'}"><b>${acc}%</b> — <span class="en">${res.html}</span></div><div class="en small" style="margin-top:6px">✔ ${esc(sent)}</div>`;
          $('#dc', box).disabled = true;
        };
        setTimeout(() => TTS.speak(sent), 300);
      };
      draw();
    } else {
      const acc = [['en-US', 'American 🇺🇸'], ['en-GB', 'British 🇬🇧'], ['en-AU', 'Australian 🇦🇺'], ['en-IN', 'Indian 🇮🇳'], ['en-IE', 'Irish 🇮🇪'], ['en-ZA', 'South African 🇿🇦']];
      const s = 'The consultant has approved the shop drawings, so we can start the installation on Sunday.';
      box.innerHTML = `<div class="card"><h2>🌍 ${L('استمع لنفس الجملة بلهجات مختلفة', 'Same sentence, different accents')}</h2><p class="en">${s}</p>
        <div class="grid g3">${acc.map(a => `<button class="tile" data-acc="${a[0]}"><b>${a[1]}</b><div class="small muted">${TTS.voiceFor(a[0]) ? '✔ ' + L('متوفر', 'available') : L('قد لا يتوفر على جهازك', 'may be unavailable on this device')}</div></button>`).join('')}</div>
        <p class="small muted" style="margin-top:10px">${L('اللهجات تعتمد على الأصوات المثبتة في جهازك. في مواقع الخليج ستسمع كثيراً اللهجات الهندية والبريطانية والأمريكية والفلبينية.', 'Accents depend on voices installed on your device.')}</p>
        <label>${L('لهجتك الافتراضية للتدريب', 'Default practice accent')}<select id="defAcc">${acc.map(a => `<option value="${a[0]}" ${S.voice === a[0] ? 'selected' : ''}>${a[1]}</option>`).join('')}</select></label></div>`;
      $$('[data-acc]', box).forEach(b => b.onclick = () => TTS.speak(s, { lang: b.dataset.acc }));
      $('#defAcc', box).onchange = e => { S.voice = e.target.value; save(); };
    }
    $$('[data-rate]', box).forEach(b => b.onclick = () => { S.rate = +b.dataset.rate; save(); $$('[data-rate]', box).forEach(x => x.classList.toggle('on', x === b)); });
  };
  function runQuizListen(el, qs) {
    runQuiz(el, qs, { title: L('فهم المسموع', 'Listening comprehension'), src: 'listening', onDone: p => { setSkill('listening', p); addXP(10); doneTask('listening'); } });
  }
  function diffWords(target, got) {
    // LCS alignment for word-level feedback
    const n = target.length, m = got.length, dp = [...Array(n + 1)].map(() => Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = target[i] === got[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    let i = 0, j = 0, html = '', hit = 0;
    while (i < n) {
      if (j < m && target[i] === got[j]) { html += `<span style="color:var(--ok)">${esc(target[i])}</span> `; hit++; i++; j++; }
      else if (j < m && dp[i][j + 1] >= dp[i + 1][j]) { html += `<s style="color:var(--muted)">${esc(got[j])}</s> `; j++; }
      else { html += `<u style="color:var(--bad)">${esc(target[i])}</u> `; i++; }
    }
    return { hit, html };
  }

  /* ============================================================
     🎤 Speak & get corrected — shared component.
     The learner says the target sentence out loud. Speech reaches the
     page through the phone/laptop keyboard dictation (or the browser's
     speech recognition where the frame allows it). The page then
     compares what was recognised with the target word by word, shows
     which words came out wrong, explains the likely sound problem in
     Arabic, and (with AI) gives a detailed pronunciation correction.
     ============================================================ */
  function alignWords(target, got) {
    const n = target.length, m = got.length, dp = [...Array(n + 1)].map(() => Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = target[i] === got[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    const ops = []; let i = 0, j = 0;
    while (i < n || j < m) {
      if (i < n && j < m && target[i] === got[j]) { ops.push({ t: 'ok', w: target[i] }); i++; j++; }
      else if (j < m && (i >= n || dp[i][j + 1] >= dp[i + 1][j])) { ops.push({ t: 'ins', h: got[j] }); j++; }
      else { ops.push({ t: 'del', w: target[i] }); i++; }
    }
    // pair a missing word with an extra word next to it = "said X instead of Y"
    const out = [];
    for (let k = 0; k < ops.length; k++) {
      const a = ops[k], b = ops[k + 1];
      if (b && ((a.t === 'del' && b.t === 'ins') || (a.t === 'ins' && b.t === 'del'))) { out.push({ t: 'sub', w: a.t === 'del' ? a.w : b.w, h: a.t === 'ins' ? a.h : b.h }); k++; }
      else out.push(a);
    }
    return out;
  }
  function soundTip(w, h) {
    const tips = [];
    if (!h) {
      if (w.length <= 3) tips.push('كلمة صغيرة ضاعت — انطقها بوضوح ولا تبلعها.');
      else tips.push('الكلمة لم تُسمع — انطقها أبطأ وبوضوح.');
      return tips;
    }
    const has = (s, re) => re.test(s);
    if (has(w, /p/) && !has(h, /p/) && has(h, /b/)) tips.push('صوت P خرج B — انفخ هواءً خفيفاً مع P (پ) والشفايف مقفولة.');
    if (has(w, /v/) && !has(h, /v/) && has(h, /f|b|w/)) tips.push('صوت V (ڤ) — الأسنان العليا على الشفة السفلى مع اهتزاز الصوت.');
    if (has(w, /th/) && !has(h, /th/)) tips.push('صوت th — ضع طرف لسانك بين أسنانك (ث في think، ذ في this).');
    if (has(w, /^str|^spr|^spl|^sc|^sk|^sp|^st/) && !has(h, /^s/)) tips.push('بداية الكلمة بحرفين ساكنين — لا تضف "إ" قبلها (street وليس istreet).');
    if (has(w, /ed$/) && !has(h, /ed$|d$|t$/)) tips.push('نهاية الماضي -ed ضاعت — انطق صوت d/t في آخر الكلمة.');
    if (has(w, /s$/) && !has(h, /s$|z$/)) tips.push('حرف s في آخر الكلمة لم يُسمع (جمع أو he/she) — انطقه.');
    if (has(w, /ee|ea/) && has(h, /i/) && !has(h, /ee|ea/)) tips.push('الحرف المتحرك طويل (ii) — مدّه أكثر: sheep وليس ship.');
    if (has(w, /i/) && !has(w, /ee|ea|ie/) && has(h, /ee|ea/)) tips.push('الحرف المتحرك قصير هنا — لا تمدّه: ship وليس sheep.');
    if (has(w, /g/) && has(h, /j/)) tips.push('صوت G هنا جيم مصرية (چ) وليس J.');
    if (!tips.length) tips.push('سُمعت "' + h + '" بدل "' + w + '" — استمع للكلمة وقلّدها مقطعاً مقطعاً.');
    return tips;
  }
  function dictKey() {
    const ua = navigator.userAgent || '';
    if (NATIVE) return { dev: 'app', ar: 'اضغط زر 🎙️ وتكلّم بالإنجليزي — التطبيق يسمعك مباشرة.', short: '🎙️ ' + 'ثم تكلّم' };
    if (/Android/i.test(ua)) return { dev: 'android', ar: 'اضغط زر الميكروفون 🎤 في كيبورد Gboard (فوق الحروف)، واختر English.', short: '🎤 كيبورد الموبايل' };
    if (/iPhone|iPad|iPod/i.test(ua)) return { dev: 'ios', ar: 'اضغط زر الميكروفون 🎤 أسفل الكيبورد (جنب المسافة)، والكيبورد English.', short: '🎤 كيبورد الآيفون' };
    if (/Mac/i.test(ua)) return { dev: 'mac', ar: 'اضغط مفتاح Fn مرتين (أو 🎤) لبدء الإملاء، واللغة English.', short: 'Fn Fn' };
    return { dev: 'win', ar: 'اضغط الآن على مفتاحي ⊞ Windows + H معاً — هتظهر لوحة "الكتابة الصوتية"، اتكلم بالإنجليزي والكلام هيتكتب في المربع.', short: '⊞ Win + H' };
  }
  function speakCheck(el, target, opt = {}) {
    // opt: { onResult(acc), src, compact }
    const id = 'sc' + Math.random().toString(36).slice(2, 7);
    el.innerHTML = `<div class="speakbox">
        <div class="row" style="justify-content:space-between;align-items:center"><b>🎤 ${L('قلها بصوتك وسيتم تصحيحك', 'Say it and get corrected')}</b><button class="mic" id="${id}m" title="${L('تحدث', 'Speak')}" style="width:42px;height:42px;flex:0 0 42px">🎙️</button></div>
        <div class="small muted" style="margin:4px 0 8px" id="${id}h">${NATIVE ? L('اضغط 🎙️ واقرأ الجملة بصوت عالٍ — التطبيق يسمعك ويصحّح لك مباشرة.', 'Tap 🎙️ and read aloud — the app hears and corrects you.') : `${L('اضغط 🎙️ (أو داخل المربع) ثم', 'Tap 🎙️ (or the box), then')} <b class="kbd">${dictKey().short}</b> ${L('واقرأ الجملة بصوت عالٍ.', 'and read the sentence aloud.')}`}</div>
        <textarea id="${id}t" class="en speakin" rows="2" autocapitalize="off" autocomplete="off" spellcheck="false" placeholder="🎤 ${L('اضغط هنا ثم ميكروفون الكيبورد وتكلّم…', 'Tap here, then the keyboard mic, and speak…')}"></textarea>
        <div class="row" style="margin-top:8px"><button class="btn sm" id="${id}c">✔ ${L('صحّح نطقي', 'Check me')}</button><button class="btn sm ghost" id="${id}r">↺ ${L('حاول مرة أخرى', 'Try again')}</button></div>
        <div id="${id}o" style="margin-top:10px"></div></div>`;
    const ta = $('#' + id + 't', el), out = $('#' + id + 'o', el);
    let timer = null, lastChecked = '', attempts = 0, best = 0;
    ta.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => { if (ta.value.trim() && ta.value !== lastChecked) check(); }, 1600); });
    $('#' + id + 'c', el).onclick = () => check();
    $('#' + id + 'r', el).onclick = () => { ta.value = ''; lastChecked = ''; out.innerHTML = ''; ta.focus(); };
    let rec = false;
    $('#' + id + 'm', el).onclick = () => {
      const m = $('#' + id + 'm', el);
      if (rec) { STT.stop(); return; }
      if (NATIVE) { if (STT.start((t, fin) => { ta.value = t; if (fin) check(); }, () => { rec = false; m.classList.remove('rec'); })) { rec = true; m.classList.add('rec'); } return; }
      if (!STT.Rec || STT.blocked || window.self !== window.top) { inlineHint(); return; }
      try {
        const r = new STT.Rec(); STT.rec = r; r.lang = 'en-US'; r.interimResults = true; r.continuous = false;
        r.onresult = ev => { let t = ''; for (const res of ev.results) t += res[0].transcript; ta.value = t; if (ev.results[ev.results.length - 1].isFinal) check(); };
        r.onerror = ev => { STT.blocked = true; inlineHint(); };
        r.onend = () => { rec = false; m.classList.remove('rec'); };
        let got = false; const r0 = r.onresult; r.onresult = ev => { got = true; r0(ev); };
        r.start(); rec = true; m.classList.add('rec');
        setTimeout(() => { if (!got) { try { r.stop(); } catch (e) { } inlineHint(); } }, 6000);
      } catch (e) { STT.blocked = true; inlineHint(); }
    };
    function inlineHint() {
      const h = $('#' + id + 'h', el);
      const k = dictKey();
      h.innerHTML = `<span class="info" style="display:block">🎤 <b>${L('المربع جاهز —', 'Box is ready —')}</b> ${esc(k.ar)}${k.dev === 'win' ? `<br><span class="small">${L('لو ماظهرتش اللوحة: الإعدادات ← الوقت واللغة ← الكلام، وفعّل "الكتابة الصوتية"، وتأكد إن لغة الكيبورد English (Alt + Shift).', 'If nothing appears: Settings → Time & language → Speech, enable voice typing; keyboard language English (Alt+Shift).')}</span>` : ''}</span>`;
      ta.focus(); ta.classList.add('listening'); setTimeout(() => ta.classList.remove('listening'), 4000);
    }
    async function check() {
      const said = ta.value.trim(); if (!said) { ta.focus(); return; }
      lastChecked = ta.value; clearTimeout(timer); attempts++;
      const tw = norm(target).split(' ').filter(Boolean), gw = norm(said).split(' ').filter(Boolean);
      const ops = alignWords(tw, gw);
      const hit = ops.filter(o => o.t === 'ok').length; const acc = Math.max(0, Math.round((hit - ops.filter(o => o.t === 'ins').length * 0.5) / tw.length * 100));
      best = Math.max(best, acc);
      const wrong = ops.filter(o => o.t === 'sub' || o.t === 'del');
      const line = ops.map(o => o.t === 'ok' ? `<span class="w-ok">${esc(o.w)}</span>` : o.t === 'sub' ? `<span class="w-bad">${esc(o.w)}<small>${esc(o.h)}</small></span>` : o.t === 'del' ? `<span class="w-miss">${esc(o.w)}</span>` : `<span class="w-extra">${esc(o.h)}</span>`).join(' ');
      const grade = acc >= 90 ? ['okbox', '🎉 ' + L('ممتاز! نطقك واضح', 'Excellent — clear!')] : acc >= 70 ? ['info', '👍 ' + L('جيد — صحّح الكلمات الحمراء', 'Good — fix the red words')] : ['badbox', '💪 ' + L('محتاج تدريب — استمع وكرر', 'Needs practice — listen and repeat')];
      out.innerHTML = `<div class="${grade[0]}"><div class="row between"><b>${grade[1]}</b><b>${acc}%</b></div>
          <div class="small" style="margin-top:4px">${L('ما سمعته المنصة', 'What was heard')}: <span class="en">"${esc(said)}"</span></div></div>
        <div class="en speakline">${line}</div>
        <div class="small muted">${L('أخضر = صحيح · أحمر = خرجت كلمة مختلفة (تحتها ما سُمع) · مشطوب = لم تُسمع', 'green = right · red = heard differently · struck = not heard')}</div>
        ${wrong.length ? `<div style="margin-top:10px">${wrong.slice(0, 6).map(o => `<div class="fixrow"><div class="row between" style="flex-wrap:nowrap"><span><b class="en">${esc(o.w)}</b>${o.h ? ` <span class="muted small">← ${L('سُمعت', 'heard')} <span class="en">${esc(o.h)}</span></span>` : ''}</span><span class="row" style="gap:4px;flex-wrap:nowrap"><button class="speak" data-say="${esc(o.w)}">🔊</button><button class="speak" data-slow="${esc(o.w)}">🐢</button></span></div>${paText(o.w) && S.showPA !== false ? `<div class="pa" dir="rtl">🗣️ ${esc(paText(o.w))}</div>` : ''}<div class="small">${soundTip(o.w, o.h).map(esc).join('<br>')}</div></div>`).join('')}</div>` : ''}
        <div id="${id}ai"></div>
        <div class="small muted" style="margin-top:8px">ℹ️ ${L('التصحيح مبني على ما فهمه التعرف على الكلام من صوتك؛ إذا خرجت كلمة مختلفة فغالباً نطقها يحتاج تحسين.', 'Correction is based on what speech recognition understood from your voice.')}</div>`;
      $$('[data-slow]', out).forEach(b => b.onclick = e => { e.stopPropagation(); TTS.speak(b.dataset.slow, { rate: 0.6 }); });
      setSkill('pronunciation', acc); if (attempts === 1) addXP(4);
      trackWords(ops); save();
      if (acc < 90) addMistake({ src: opt.src || 'pronunciation', wrong: said, right: target, ar: 'نطق: ' + wrong.map(o => o.w).join('، ') });
      if (wrong.length && AI.ok()) aiFeedback(said, wrong);
      opt.onResult && opt.onResult(acc, best, attempts);
    }
    async function aiFeedback(said, wrong) {
      const box = $('#' + id + 'ai', el); box.innerHTML = `<p class="small muted">🤖 ${L('المدرس يحلل نطقك…', 'Tutor is analysing…')}</p>`;
      try {
        const r = await AI.json(`You are a pronunciation coach for Arabic (Egyptian) speakers learning English.
Target sentence: "${target}"
Speech recognition heard the learner say: "${said}"
Words that came out wrong or missing: ${wrong.map(o => o.w + (o.h ? ' (heard as "' + o.h + '")' : ' (not heard)')).join(', ')}.
Infer the most likely pronunciation problems typical for Arabic speakers (p/b, v/f, th, short vs long vowels, vowel insertion in clusters, dropped endings, word stress) from these recognition errors.
Return ONLY JSON: {"issues":[{"word":"...","problem_ar":"ما الخطأ المحتمل بالعربية","how_ar":"كيف تنطقها صح (وضع الفم/اللسان) بالعربية","arabic_letters":"نطق الكلمة بحروف عربية مع [المقطع المشدد]"}],"overall_ar":"جملة تشجيعية ونصيحة واحدة بالعربية"}
Max 4 issues, short and practical.`);
        box.innerHTML = `<div class="card" style="margin:10px 0 0;padding:12px"><b>🤖 ${L('تصحيح المدرس', 'Tutor correction')}</b>${(r.issues || []).map(x => `<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--line)"><b class="en">${esc(x.word)}</b> ${say(x.word)}${x.arabic_letters ? `<div class="pa" dir="rtl">🗣️ ${esc(x.arabic_letters)}</div>` : ''}<div class="small">❗ ${esc(x.problem_ar)}</div><div class="small">✅ ${esc(x.how_ar)}</div></div>`).join('')}${r.overall_ar ? `<div class="small" style="margin-top:8px">💬 ${esc(r.overall_ar)}</div>` : ''}</div>`;
      } catch (e) { box.innerHTML = ''; }
    }
  }

  /* ---------- Pronunciation ---------- */
  let pronTab = 'pairs';
  views.pron = v => {
    const tabs = [['pairs', '👂 ' + L('التمييز بين الأصوات', 'Minimal pairs')], ['shadow', '🔁 ' + L('تمارين Shadowing', 'Shadowing')], ['stress', '🎵 ' + L('النبر والإيقاع', 'Stress & rhythm')], ['hard', '🎯 ' + L('كلماتي الصعبة', 'My hard words') + (activeHard().length ? ' (' + activeHard().length + ')' : '')]];
    v.innerHTML = `<div class="note">ℹ️ ${L('صراحةً: المنصة لا تحلل الصوت لتقييم دقة النطق علمياً. تقيس قدرتك على تمييز الأصوات بالسمع، وإذا كان التعرف على الكلام متاحاً في متصفحك، تقارن ما فُهم من كلامك بالجملة المستهدفة.', 'Honest note: no acoustic pronunciation scoring; we test sound discrimination and, if speech recognition is available, compare what was recognised.')}</div>
      <div class="card" style="margin-top:10px;padding:12px"><b>${L('دليل النطق بالحروف العربية', 'Arabic-script guide')}</b>${legend()}</div>
      <div class="tabs" style="margin-top:12px">${tabs.map(t => `<button class="tab ${t[0] === pronTab ? 'on' : ''}" data-t="${t[0]}">${t[1]}</button>`).join('')}</div><div id="pb"></div>`;
    $$('[data-t]', v).forEach(b => b.onclick = () => { pronTab = b.dataset.t; route(); });
    const box = $('#pb', v);
    if (pronTab === 'pairs') {
      box.innerHTML = C.PRONUNCIATION.filter(p => p.id !== 'p-stress').map(p => `<div class="card"><div class="row between"><h3 class="en">${esc(p.title)}</h3><button class="btn sm" data-game="${p.id}">🎮 ${L('اختبر أذنك', 'Ear test')}</button></div><p class="small">${esc(p.ar)}</p><div class="row">${p.pairs.map(pr => `<span class="chip en" style="flex-direction:column;align-items:stretch;border-radius:12px"><span>${esc(pr[0])} ${say(pr[0])} · ${esc(pr[1])} ${say(pr[1])}</span>${S.showPA === false ? '' : `<span class="pa" dir="rtl">🗣️ ${esc(paText(pr[0]))} · ${esc(paText(pr[1]))}</span>`}</span>`).join('')}</div></div>`).join('');
      $$('[data-game]', box).forEach(b => b.onclick = () => pairGame(box, C.PRONUNCIATION.find(p => p.id === b.dataset.game)));
    } else if (pronTab === 'shadow') {
      const pool = [...C.DIALOGUES.filter(d => LI(d.level) <= LI(level()) + 1).flatMap(d => d.lines.map(l => l[1])), ...C.BUSINESS.flatMap(b => b.phrases.map(p => p[0]))];
      let s = pick(pool, 1)[0];
      const draw = () => {
        box.innerHTML = `<div class="card"><h2>🔁 Shadowing</h2><p class="muted small">${L('1) استمع. 2) كرّر بصوت عالٍ مقلداً الإيقاع. 3) قلها في المربع بميكروفون الكيبورد — المنصة تسمعك وتصحح لك الكلمات اللي نطقها محتاج تحسين.', '1) Listen 2) Repeat aloud 3) Say it into the box — you get corrected.')}</p>
          <div class="flash" style="min-height:110px;cursor:default"><div class="en" style="font-size:22px;font-weight:600">${esc(s)}</div>${pa(s)}</div>
          <div class="row" style="margin-top:12px;justify-content:center"><button class="btn" id="sp">🔊 ${L('استمع', 'Listen')}</button><button class="btn sec" id="ss">🐢 0.7×</button><button class="btn ghost" id="sn">${L('جملة أخرى', 'Next')} ←</button></div>
          <div id="sres" style="margin-top:12px"></div></div>`;
        $('#sp', box).onclick = () => TTS.speak(s); $('#ss', box).onclick = () => TTS.speak(s, { rate: 0.7 });
        $('#sn', box).onclick = () => { s = pick(pool, 1)[0]; draw(); };
        speakCheck($('#sres', box), s, { src: 'shadowing' });
        setTimeout(() => TTS.speak(s), 300);
      };
      draw();
    } else if (pronTab === 'hard') {
      hardWordsView(box);
    } else {
      const p = C.PRONUNCIATION.find(x => x.id === 'p-stress');
      box.innerHTML = `<div class="card"><h3 class="en">${esc(p.title)}</h3><p>${esc(p.ar)}</p><table>${p.pairs.map(pr => `<tr>${pr.map(w => `<td class="en"><b>${esc(w)}</b> ${say(w.toLowerCase())}${pa(w)}</td>`).join('')}</tr>`).join('')}</table></div>
        <div class="card"><h3>${L('الإيقاع: الكلمات المهمة تُشدّ', 'Sentence rhythm')}</h3><p class="small">${L('في الإنجليزية نشدّ الكلمات التي تحمل المعنى ونخفف الكلمات الصغيرة (a, the, to, of). استمع وركّز على الكلمات الكبيرة:', 'Content words are stressed, function words reduced:')}</p>
        ${['We NEED the DRAWINGS by THURSDAY.', 'The PUMP is in the BASEMENT.', 'COULD you SEND me the REPORT?', 'I\'ve been WORKING in MEP for THIRTEEN YEARS.'].map(x => `<p class="en">${esc(x)} ${say(x.toLowerCase())}</p>`).join('')}</div>`;
    }
  };
  function hardWordsView(box) {
    const list = activeHard(), mastered = Object.values(hardWords()).filter(r => r.done).length;
    const tab = document.querySelector('[data-t="hard"]');
    if (tab) tab.textContent = '🎯 ' + L('كلماتي الصعبة', 'My hard words') + (list.length ? ' (' + list.length + ')' : '');
    if (!list.length) {
      box.innerHTML = `<div class="card"><h2>🎯 ${L('كلماتي الصعبة', 'My hard words')}</h2>
        <p>${mastered ? '🏆 ' + L('رائع! لا توجد كلمات صعبة حالياً — أتقنت', 'Great! No hard words right now — mastered') + ' ' + mastered + ' ' + L('كلمة.', 'words.') : L('لسه مفيش كلمات هنا. كل كلمة تنطقها غلط في أي تمرين نطق (Shadowing، بلوكات الكلام، المحادثة…) هتتجمع هنا تلقائياً علشان تتدرب عليها.', 'No words yet. Every word you mispronounce in any speaking exercise is collected here for practice.')}</p>
        <button class="btn" id="hwGo">🔁 ${L('ابدأ Shadowing', 'Start shadowing')}</button></div>`;
      $('#hwGo', box).onclick = () => { pronTab = 'shadow'; route(); };
      return;
    }
    box.innerHTML = `<div class="card"><div class="row between"><h2>🎯 ${L('كلماتي الصعبة', 'My hard words')}</h2><button class="btn" id="hwDrill">🎤 ${L('تدرّب عليها', 'Practice them')}</button></div>
        <p class="small muted">${L('كلمات خرجت غلط في تمارين النطق. قل الكلمة صح 3 مرات متتالية لتنتقل إلى "أتقنتها".', 'Words that came out wrong. Say a word right 3 times in a row to master it.')}${mastered ? ' · 🏆 ' + L('أتقنت', 'Mastered') + ': ' + mastered : ''}</p>
        ${list.slice(0, 30).map(([w, r]) => `<div class="fixrow"><div class="row between" style="flex-wrap:nowrap">
          <span><b class="en">${esc(w)}</b> <span class="small muted">· ${L('أخطأت', 'missed')} ${r.miss}×${r.heard ? ' · ' + L('سُمعت', 'heard') + ' <span class="en">' + esc(r.heard) + '</span>' : ''}</span></span>
          <span class="row" style="gap:4px;flex-wrap:nowrap"><span class="small" title="${L('مرات صحيحة متتالية', 'correct in a row')}">${'●'.repeat(r.ok)}${'○'.repeat(3 - r.ok)}</span><button class="speak" data-say="${esc(w)}">🔊</button><button class="speak" data-slow="${esc(w)}">🐢</button></span></div>${pa(w)}</div>`).join('')}</div>`;
    $$('[data-slow]', box).forEach(b => b.onclick = e => { e.stopPropagation(); TTS.speak(b.dataset.slow, { rate: 0.6 }); });
    $('#hwDrill', box).onclick = () => hardDrill(box, list.slice(0, 10).map(x => x[0]));
  }
  function hardDrill(box, words) {
    let i = 0;
    const draw = () => {
      if (i >= words.length) { toast('✅ ' + L('خلصت جولة التدريب', 'Round complete')); hardWordsView(box); return; }
      const w = words[i], r = hardWords()[w] || { ok: 0 };
      box.innerHTML = `<div class="card"><div class="row between"><h2>🎯 ${i + 1} / ${words.length}</h2><button class="btn ghost sm" id="hdBack">← ${L('القائمة', 'List')}</button></div>
        <div class="flash" style="min-height:110px;cursor:default"><div class="en" style="font-size:30px;font-weight:700">${esc(w)}</div>${pa(w)}<div class="small" style="margin-top:6px">${'●'.repeat(r.ok || 0)}${'○'.repeat(3 - (r.ok || 0))}</div></div>
        <div class="row" style="margin-top:12px;justify-content:center"><button class="btn" id="hdL">🔊 ${L('استمع', 'Listen')}</button><button class="btn sec" id="hdS">🐢 0.6×</button><button class="btn ghost" id="hdN">${L('التالية', 'Next')} ←</button></div>
        <div id="hdRes" style="margin-top:12px"></div></div>`;
      $('#hdL', box).onclick = () => TTS.speak(w); $('#hdS', box).onclick = () => TTS.speak(w, { rate: 0.6 });
      $('#hdN', box).onclick = () => { i++; draw(); };
      $('#hdBack', box).onclick = () => hardWordsView(box);
      speakCheck($('#hdRes', box), w, { src: 'hard-words', onResult: acc => { if (acc >= 90) setTimeout(() => { i++; draw(); }, 1400); } });
      setTimeout(() => TTS.speak(w), 300);
    };
    draw();
  }
  function pairGame(box, p) {
    const qs = [...p.pairs, ...p.pairs].slice(0, 8).map(pr => { const k = Math.random() < .5 ? 0 : 1; return { type: 'mc', q: L('أي كلمة سمعت؟', 'Which word did you hear?'), options: [pr[0], pr[1]], answer: k, explain: p.ar, say: pr[k] }; });
    box.innerHTML = `<button class="btn ghost sm" id="bk">← ${L('رجوع', 'Back')}</button><div id="pg"></div>`;
    $('#bk', box).onclick = () => route();
    runQuizListenSimple($('#pg', box), qs, p.title);
  }
  function runQuizListenSimple(el, qs, title) {
    let i = 0, score = 0;
    const draw = () => {
      if (i >= qs.length) { const pct = Math.round(score / qs.length * 100); setSkill('pronunciation', pct); addXP(10); el.innerHTML = `<div class="card"><h2>${pct >= 75 ? '🎉' : '💪'} ${score}/${qs.length}</h2><p>${L('تمييز الأصوات يحسّن نطقك مباشرة.', 'Hearing the difference improves your speaking.')}</p><button class="btn" id="again">${L('مرة أخرى', 'Again')}</button></div>`; $('#again', el).onclick = () => { i = 0; score = 0; qs.forEach(q => { q.answer = Math.random() < .5 ? 0 : 1; q.say = q.options[q.answer]; }); draw(); }; return; }
      const q = qs[i];
      el.innerHTML = `<div class="card"><div class="small muted en">${esc(title)} · ${i + 1}/${qs.length}</div><h3>${q.q}</h3><button class="btn" id="hear">🔊 ${L('استمع', 'Listen')}</button><div class="grid g2" style="margin-top:12px">${q.options.map((o, k) => `<button class="opt en" style="text-align:center;font-size:20px" data-k="${k}">${esc(o)}${pa(o)}</button>`).join('')}</div><div id="fb"></div></div>`;
      $('#hear', el).onclick = () => TTS.speak(q.say, { rate: 0.85 });
      setTimeout(() => TTS.speak(q.say, { rate: 0.85 }), 250);
      $$('[data-k]', el).forEach(b => b.onclick = () => {
        const ok = +b.dataset.k === q.answer; if (ok) score++;
        $$('[data-k]', el).forEach(x => { x.disabled = true; if (+x.dataset.k === q.answer) x.classList.add('right'); }); if (!ok) b.classList.add('wrong');
        $('#fb', el).innerHTML = `<div class="row" style="margin-top:10px"><button class="btn" id="nx">${L('التالي', 'Next')}</button>${say(q.options[0])} ${say(q.options[1])}</div>`;
        $('#nx', el).onclick = () => { i++; draw(); };
      });
    };
    draw();
  }

  /* ---------- Reading ---------- */
  views.reading = v => {
    v.innerHTML = `<div class="grid g2">${C.READINGS.map(r => `<button class="tile" data-r2="${r.id}"><span class="pill">${r.level}</span> <b class="en">${esc(r.title)}</b>${S.readingDone[r.id] != null ? ` <span class="pill ok">${S.readingDone[r.id]}%</span>` : ''}<div class="small muted en">${esc(r.text.slice(0, 90))}…</div></button>`).join('')}</div>
      <div class="card" style="margin-top:16px"><h3>🤖 ${L('نص جديد بمستواك', 'New text at your level')}</h3><p class="muted small">${L('اكتب موضوعاً (اختياري) وسيُنشئ لك الذكاء الاصطناعي نصاً مع أسئلة فهم ومفردات.', 'Optional topic; AI generates a passage with questions.')}</p>
        <div class="row"><input type="text" id="rt" placeholder="${L('مثال: صيانة المضخات، السفر، مقابلة عمل', 'e.g. pump maintenance')}" style="flex:1"><select id="rl" style="width:auto">${LV.map(l => `<option ${l === level() ? 'selected' : ''}>${l}</option>`).join('')}</select><button class="btn" id="rg" ${AI.ok() ? '' : 'disabled'}>✨ ${L('أنشئ', 'Generate')}</button></div><div id="rbx"></div></div>`;
    $$('[data-r2]', v).forEach(b => b.onclick = () => { const r = C.READINGS.find(x => x.id === b.dataset.r2); readPassage(v, { id: r.id, title: r.title, level: r.level, text: r.text, qs: r.q.map(q => ({ type: 'mc', q: q[0], options: q[1], answer: q[2] })) }); });
    $('#rg', v).onclick = async () => {
      const box = $('#rbx', v); box.innerHTML = '<p class="muted">⏳ …</p>';
      try {
        const lv = $('#rl', v).value; const topic = $('#rt', v).value.trim() || 'a realistic situation from MEP construction work or daily life in Saudi Arabia';
        const r = await AI.json(`Write an original reading passage for an Arabic-speaking English learner at CEFR ${lv} about: ${topic}. Length: ${['A1', 'A2'].includes(lv) ? '80-120' : lv === 'B1' ? '150-200' : '200-280'} words, vocabulary and grammar appropriate to ${lv}.
Return ONLY JSON: {"title":"...","text":"...","questions":[{"q":"...","options":["a","b","c"],"answer":0}],"glossary":[{"en":"word","ar":"المعنى"}]} with 4 questions and 6 glossary items.`);
        readPassage(v, { id: null, title: r.title, level: lv, text: r.text, glossary: r.glossary, qs: (r.questions || []).map(q => ({ type: 'mc', q: q.q, options: q.options, answer: +q.answer })) });
      } catch (e) { box.innerHTML = `<div class="badbox">${esc(AI.errText(e))}</div>`; }
    };
  };
  function readPassage(v, r) {
    v.innerHTML = `<button class="btn ghost sm" id="back">← ${L('رجوع', 'Back')}</button>
      <div class="card"><span class="pill">${r.level}</span><h2 class="en">${esc(r.title)}</h2><div class="row"><button class="btn sm" id="rp">🔊 ${L('استمع للنص', 'Listen')}</button><span class="small muted">${L('اضغط على أي كلمة لسماعها', 'Tap any word to hear it')}</span></div>
        <p class="en" style="font-size:17px;line-height:1.9" id="rtext">${esc(r.text).split(/(\s+)/).map(w => /\w/.test(w) ? `<span style="cursor:pointer" data-w="${esc(w.replace(/[^\w'-]/g, ''))}">${w}</span>` : w).join('')}</p>
        ${r.glossary ? `<table>${r.glossary.map(g => `<tr><td class="en"><b>${esc(g.en)}</b> ${say(g.en)}</td><td>${esc(g.ar)}</td></tr>`).join('')}</table>` : ''}</div>
      <div id="rq"></div>`;
    $('#back', v).onclick = () => route();
    $('#rp', v).onclick = () => TTS.speak(r.text);
    $$('[data-w]', v).forEach(s => s.onclick = () => { TTS.speak(s.dataset.w); const w = C.ALL_WORDS.find(x => x.en.toLowerCase().startsWith(s.dataset.w.toLowerCase())); if (w) toast(w.en + (paText(w.en) ? ' — ' + paText(w.en) : '') + ' = ' + w.ar); else if (paText(s.dataset.w.toLowerCase())) toast(paText(s.dataset.w.toLowerCase())); });
    runQuiz($('#rq', v), r.qs, { title: L('أسئلة الفهم', 'Comprehension'), src: 'reading', onDone: p => { if (r.id) S.readingDone[r.id] = Math.max(S.readingDone[r.id] || 0, p); setSkill('reading', p); addXP(15); save(); } });
  }

  /* ---------- Speaking blocks: short starters to open a question or an answer ---------- */
  const BLOCKS = [
    { k: 'me', ic: '🙋', ar: 'بدايات عن نفسك', en: 'I will / I can\'t…', items: [
      ['I will ___.', 'هـ___ / سوف ___ (قرار أو وعد)', 'آي وِل', 'I will call you tomorrow.', 'للقرار اللي بتاخده دلوقتي أو وعد. المختصر: I\'ll'],
      ['I won\'t ___.', 'مش هـ___', 'آي وونت', 'I won\'t be late again.', 'نفي will = will not'],
      ['I\'m going to ___.', 'ناوي / هـ___ (خطة)', 'آيم جوينج تو', 'I\'m going to visit the site on Monday.', 'لخطة متفق عليها من قبل، عكس will اللي قرار لحظي'],
      ['I can ___.', 'أقدر ___', 'آي كان', 'I can finish it today.', ''],
      ['I can\'t ___.', 'مش قادر / مقدرش ___', 'آي كانْت', 'I can\'t find the drawing.', 'انطقها طويلة «كانْت» عشان تتفرق عن can'],
      ['I could ___.', 'ممكن أـ___ (اقتراح) / كنت أقدر', 'آي كُد', 'I could send it by email.', ''],
      ['I may ___.', 'يمكن أـ___ (احتمال)', 'آي مِي', 'I may need your help.', 'احتمال تقريباً ٥٠٪'],
      ['I might ___.', 'وارد أـ___ (احتمال أضعف)', 'آي مايت', 'I might be a little late.', 'احتمال أقل من may'],
      ['I have to ___.', 'لازم أـ___ (ظرف أو أوامر)', 'آي هاف تو', 'I have to submit the report today.', 'الإلزام من بره: الشغل، المدير، القانون'],
      ['I don\'t have to ___.', 'مش لازم أـ___', 'آي دونت هاف تو', 'I don\'t have to come on Friday.', 'معناها مش مطلوب، مش معناها ممنوع'],
      ['I must ___.', 'لازم أـ___ (من نفسي / رسمي)', 'آي ماست', 'I must check the pressure first.', 'أقوى من have to وغالباً من قناعتك'],
      ['I should ___.', 'المفروض أـ___ (نصيحة)', 'آي شُد', 'I should ask the consultant.', ''],
      ['I need to ___.', 'محتاج أـ___', 'آي نيد تو', 'I need to talk to you.', ''],
      ['I want to ___.', 'عايز أـ___', 'آي وونت تو', 'I want to improve my English.', 'في الكلام السريع بتتقال wanna'],
      ['I\'d like to ___.', 'أحب أـ___ (مؤدبة)', 'آيد لايك تو', 'I\'d like to ask a question.', 'أكثر أدباً من I want to — استخدمها مع المدير والعميل'],
      ['I\'d rather ___.', 'أفضّل أـ___', 'آيد راذَر', 'I\'d rather start early.', 'بعدها فعل من غير to'],
      ['I\'m trying to ___.', 'بحاول أـ___', 'آيم ترايِنج تو', 'I\'m trying to fix the problem.', ''],
      ['I\'m about to ___.', 'على وشك أـ___', 'آيم أباوت تو', 'I\'m about to leave the office.', ''],
      ['I used to ___.', 'كنت زمان بـ___', 'آي يوزد تو', 'I used to work in Egypt.', 'عادة في الماضي خلاص بطّلتها'],
      ['I forgot to ___.', 'نسيت أـ___', 'آي فورجوت تو', 'I forgot to send the file.', ''],
      ['I hope to ___.', 'أتمنى أـ___', 'آي هوپ تو', 'I hope to finish this week.', ''],
      ['I\'m planning to ___.', 'مخطط أـ___', 'آيم پلانِنج تو', 'I\'m planning to change jobs.', ''],
      ['I\'ve already ___.', 'أنا خلاص ___', 'آيڤ أولرِدي', 'I\'ve already sent it.', 'بعدها التصريف التالت للفعل'],
      ['I haven\'t ___ yet.', 'لسه ما ___ش', 'آي هاڤنت … يِت', 'I haven\'t received it yet.', ''],
      ['Let me ___.', 'خليني / اسمحلي أـ___', 'لِت مي', 'Let me check and call you back.', 'بعدها فعل من غير to']] },
    { k: 'askme', ic: '🙏', ar: 'أسئلة بنفس البدايات', en: 'Can I…? Should I…?', items: [
      ['Can I ___?', 'ممكن أـ___؟', 'كان آي', 'Can I ask you something?', ''],
      ['Could I ___?', 'ممكن أـ___؟ (أدب أكتر)', 'كُد آي', 'Could I leave early today?', ''],
      ['May I ___?', 'تسمح لي أـ___؟ (رسمية جداً)', 'مِي آي', 'May I come in?', ''],
      ['Should I ___?', 'أعمل ___؟ / المفروض أـ___؟', 'شُد آي', 'Should I send it now?', ''],
      ['Do I have to ___?', 'لازم أـ___؟', 'دو آي هاف تو', 'Do I have to sign this?', ''],
      ['Will you ___?', 'هتـ___؟', 'وِل يو', 'Will you be at the meeting?', ''],
      ['Would you like to ___?', 'تحب تـ___؟', 'وُد يو لايك تو', 'Would you like to see the site?', ''],
      ['Shall we ___?', 'نـ___؟ (اقتراح)', 'شال وي', 'Shall we start?', ''],
      ['Are you going to ___?', 'ناوي تـ___؟', 'آر يو جوينج تو', 'Are you going to approve it?', ''],
      ['Do you want me to ___?', 'عايزني أـ___؟', 'دو يو وونت مي تو', 'Do you want me to call him?', '']] },
    { k: 'askmore', ic: '🙋‍♂️', ar: 'أسئلة أكتر', en: 'More questions', items: [
      ['Can I have ___?', 'ممكن آخد ___؟ / ممكن تديني ___؟', 'كان آي هاڤ', 'Can I have a copy of the report?', 'أشهر طريقة تطلب بيها حاجة في محل أو مطعم أو شغل'],
      ['Can I get ___?', 'ممكن آخد ___؟ (عامية أكتر)', 'كان آي جِت', 'Can I get a coffee, please?', ''],
      ['Could you give me ___?', 'ممكن تديني ___؟', 'كُد يو جِڤ مي', 'Could you give me five minutes?', ''],
      ['Could you help me with ___?', 'ممكن تساعدني في ___؟', 'كُد يو هِلپ مي وِذ', 'Could you help me with this form?', ''],
      ['Do you have ___?', 'عندك ___؟', 'دو يو هاڤ', 'Do you have the latest drawings?', ''],
      ['Is there ___?', 'فيه ___؟ (مفرد)', 'إز ذِير', 'Is there a meeting today?', ''],
      ['Are there ___?', 'فيه ___؟ (جمع)', 'آر ذِير', 'Are there any comments?', ''],
      ['Have you ___?', 'هل أنت ___؟ (خلّصت حاجة)', 'هاڤ يو', 'Have you checked the pump?', 'بعدها التصريف التالت للفعل'],
      ['Did you ___?', 'هل ___ت؟ (ماضي)', 'دِد يو', 'Did you get my email?', 'بعدها الفعل في المصدر'],
      ['Is it okay if I ___?', 'ينفع لو ___؟', 'إز إت أوكِي إف آي', 'Is it okay if I leave at four?', ''],
      ['Do you mind if I ___?', 'تمانع لو ___؟', 'دو يو مايند إف آي', 'Do you mind if I open the window?', 'لو موافق بترد: Not at all / No, go ahead'],
      ['Would it be possible to ___?', 'هل ممكن ___؟ (رسمية جداً)', 'وُد إت بي پوسِبل تو', 'Would it be possible to extend the deadline?', 'ممتازة مع العميل والاستشاري'],
      ['What time ___?', 'الساعة كام ___؟', 'وات تايم', 'What time does the meeting start?', ''],
      ['Where is ___?', 'فين ___؟', 'وِير إز', 'Where is the electrical room?', ''],
      ['When will ___?', 'إمتى هـ___؟', 'وِن وِل', 'When will the material arrive?', ''],
      ['Why did ___?', 'ليه ___؟ (ماضي)', 'واي دِد', 'Why did the test fail?', ''],
      ['How much ___?', 'بكام / قد إيه ___؟ (غير معدود)', 'هاو ماتش', 'How much does it cost?', ''],
      ['How many ___?', 'كام ___؟ (معدود)', 'هاو مِني', 'How many workers do we have?', ''],
      ['Which one ___?', 'أنهي واحد ___؟', 'وِتش وان', 'Which one do you prefer?', ''],
      ['Who is responsible for ___?', 'مين المسؤول عن ___؟', 'هو إز رِسپونسِبل فور', 'Who is responsible for the fire alarm?', ''],
      ['What about ___?', 'وإيه بالنسبة لـ___؟', 'وات أباوت', 'What about the second floor?', ''],
      ['How about ___?', 'إيه رأيك في ___؟ (اقتراح)', 'هاو أباوت', 'How about meeting at ten?', 'بعدها فعل بـ ing أو اسم'],
      ['Why don\'t we ___?', 'ما ___ ليه؟ (اقتراح)', 'واي دونت وي', 'Why don\'t we start now?', '']] },
    { k: 'yes', ic: '✅', ar: 'ردود بالموافقة', en: 'Yes replies', items: [
      ['Sure, no problem.', 'أكيد، مفيش مشكلة.', 'شور، نو پروبلِم', 'A: Can you help me? — B: Sure, no problem.', ''],
      ['Of course.', 'طبعاً.', 'أوف كورس', 'A: Can I have a copy? — B: Of course.', ''],
      ['Absolutely.', 'أكيد جداً.', 'أبسولوتلي', 'A: Is it important? — B: Absolutely.', ''],
      ['Yes, I can.', 'أيوه أقدر.', 'يِس، آي كان', 'A: Can you finish today? — B: Yes, I can.', ''],
      ['Yes, I have.', 'أيوه، عملت.', 'يِس، آي هاڤ', 'A: Have you checked it? — B: Yes, I have.', 'الرد القصير بيكرر نفس الفعل المساعد اللي في السؤال'],
      ['Yes, I did.', 'أيوه، عملت.', 'يِس، آي دِد', 'A: Did you send it? — B: Yes, I did.', ''],
      ['Go ahead.', 'اتفضل.', 'جو أهِد', 'A: Can I ask something? — B: Go ahead.', ''],
      ['Not at all.', 'خالص (مش ممانع).', 'نوت أت أول', 'A: Do you mind if I sit here? — B: Not at all.', 'الرد بالموافقة على Do you mind'],
      ['Sounds good.', 'تمام / فكرة حلوة.', 'ساوندز جود', 'A: How about ten? — B: Sounds good.', ''],
      ['That works for me.', 'ده يناسبني.', 'ذات ووركس فور مي', 'A: Is Sunday okay? — B: That works for me.', ''],
      ['I\'d love to.', 'يا ريت / بكل سرور.', 'آيد لاڤ تو', 'A: Would you like to join us? — B: I\'d love to.', ''],
      ['Will do.', 'حاضر هعمل كده.', 'وِل دو', 'A: Please update the file. — B: Will do.', ''],
      ['I\'m on it.', 'بشتغل عليها حالاً.', 'آيم أون إت', 'A: We need the report. — B: I\'m on it.', ''],
      ['Got it.', 'فهمت.', 'جوت إت', 'A: Use the new template. — B: Got it.', ''],
      ['Noted.', 'تم الملاحظة / علم.', 'نوتِد', 'A: The meeting moved to 2 pm. — B: Noted, thanks.', 'شائعة جداً في الإيميلات'],
      ['Exactly.', 'بالظبط.', 'إجزاكتلي', 'A: So we need a bigger pump? — B: Exactly.', ''],
      ['I think so.', 'أظن كده.', 'آي ثِنك سو', 'A: Will it be ready? — B: I think so.', '']] },
    { k: 'no', ic: '❌', ar: 'ردود بالرفض بأدب', en: 'Polite no', items: [
      ['No, I can\'t, sorry.', 'لا مقدرش، آسف.', 'نو، آي كانْت، سوري', 'A: Can you come today? — B: No, I can\'t, sorry.', ''],
      ['I\'m afraid not.', 'للأسف لا.', 'آيم أفريد نوت', 'A: Is it ready? — B: I\'m afraid not.', 'رفض مؤدب جداً'],
      ['I\'m afraid I can\'t ___.', 'للأسف مقدرش ___.', 'آيم أفريد آي كانْت', 'I\'m afraid I can\'t make it today.', ''],
      ['Not yet.', 'لسه.', 'نوت يِت', 'A: Did they approve it? — B: Not yet.', ''],
      ['Not really.', 'مش أوي / مش بالظبط.', 'نوت ريلي', 'A: Do you like it? — B: Not really.', ''],
      ['No, I haven\'t.', 'لا، ما عملتش.', 'نو، آي هاڤنت', 'A: Have you seen the drawing? — B: No, I haven\'t.', ''],
      ['No, I didn\'t.', 'لا، ما عملتش.', 'نو، آي دِدنت', 'A: Did you call him? — B: No, I didn\'t.', ''],
      ['I don\'t think so.', 'ما اظنش.', 'آي دونت ثِنك سو', 'A: Will it rain? — B: I don\'t think so.', ''],
      ['I\'d rather not.', 'أفضّل لا.', 'آيد راذَر نوت', 'A: Do you want to work Friday? — B: I\'d rather not.', ''],
      ['Thanks, but ___.', 'شكراً، بس ___.', 'ثانكس، بات', 'Thanks, but I already have one.', ''],
      ['Maybe next time.', 'خليها مرة تانية.', 'مِيبي نِكست تايم', 'A: Join us for lunch? — B: Maybe next time.', '']] },
    { k: 'unsure', ic: '🤔', ar: 'ردود مش متأكد', en: 'Not sure', items: [
      ['I\'m not sure.', 'مش متأكد.', 'آيم نوت شور', 'A: When will it arrive? — B: I\'m not sure.', ''],
      ['It depends on ___.', 'على حسب ___.', 'إت ديپِندز أون', 'It depends on the approval.', ''],
      ['Let me check.', 'خليني أتأكد.', 'لِت مي تشِك', 'A: Is the room free? — B: Let me check.', ''],
      ['I\'ll let you know.', 'هبلغك.', 'آيل لِت يو نو', 'A: Can you come? — B: I\'ll let you know.', ''],
      ['I don\'t know yet.', 'لسه معرفش.', 'آي دونت نو يِت', 'A: Who will attend? — B: I don\'t know yet.', ''],
      ['Probably.', 'غالباً.', 'پروبابلي', 'A: Will we finish today? — B: Probably.', ''],
      ['I hope so.', 'أتمنى.', 'آي هوپ سو', 'A: Will it pass the test? — B: I hope so.', ''],
      ['Maybe.', 'يمكن.', 'مِيبي', 'A: Are you coming? — B: Maybe.', '']] },
    { k: 'polite', ic: '🤝', ar: 'شكر واعتذار وردود سريعة', en: 'Thanks, sorry & quick replies', items: [
      ['Thank you so much.', 'شكراً جزيلاً.', 'ثانك يو سو ماتش', 'Thank you so much for your help.', ''],
      ['You\'re welcome.', 'العفو.', 'يور وِلكَم', 'A: Thanks! — B: You\'re welcome.', ''],
      ['No worries.', 'ولا يهمك.', 'نو وَريز', 'A: Sorry I\'m late. — B: No worries.', ''],
      ['Sorry about that.', 'آسف على كده.', 'سوري أباوت ذات', 'Sorry about that, I\'ll fix it.', ''],
      ['My mistake.', 'غلطتي.', 'ماي مِستيك', 'My mistake, I sent the wrong file.', ''],
      ['It won\'t happen again.', 'مش هتتكرر.', 'إت وونت هاپِن أجِين', 'Sorry, it won\'t happen again.', ''],
      ['That\'s okay.', 'مفيش مشكلة.', 'ذاتس أوكِي', 'A: I forgot. — B: That\'s okay.', ''],
      ['Never mind.', 'خلاص مش مهم.', 'نِڤَر مايند', 'Never mind, I found it.', ''],
      ['Really?', 'بجد؟', 'ريلي', 'A: The client approved it. — B: Really? Great!', ''],
      ['That\'s great!', 'ده رائع!', 'ذاتس جريت', 'A: We passed the test. — B: That\'s great!', ''],
      ['I see.', 'فاهم / آه كده.', 'آي سي', 'A: The pipe was blocked. — B: I see.', '']] },
    { k: 'ask', ic: '❓', ar: 'ابدأ سؤال', en: 'Start a question', items: [
      ['Can you tell me ___?', 'ممكن تقولي ___؟', 'كان يو تِل مي', 'Can you tell me the delivery date?'],
      ['Do you know if ___?', 'تعرف إذا كان ___؟', 'دو يو نو إف', 'Do you know if the pump arrived?'],
      ['Is it possible to ___?', 'هل ممكن ___؟', 'إز إت پوسِبل تو', 'Is it possible to finish by Sunday?'],
      ['What do you think about ___?', 'إيه رأيك في ___؟', 'وات دو يو ثِنك أباوت', 'What do you think about this layout?'],
      ['How long does it take to ___?', 'بياخد قد إيه عشان ___؟', 'هاو لونج داز إت تيك تو', 'How long does it take to test the system?'],
      ['Could you please ___?', 'ممكن من فضلك ___؟', 'كُد يو پليز', 'Could you please send me the drawings?']] },
    { k: 'answer', ic: '💬', ar: 'ابدأ إجابة', en: 'Start an answer', items: [
      ['Actually, ___.', 'في الحقيقة، ___.', 'أكتشوالي', 'Actually, we finished yesterday.'],
      ['Well, the thing is ___.', 'بص، الموضوع إن ___.', 'وِل، ذَ ثِنج إز', 'Well, the thing is the material is late.'],
      ['To be honest, ___.', 'بصراحة، ___.', 'تو بي أونِست', 'To be honest, I need more time.'],
      ['As far as I know, ___.', 'على حد علمي، ___.', 'أز فار أز آي نو', 'As far as I know, the test passed.'],
      ['Basically, ___.', 'باختصار، ___.', 'بيسِكلي', 'Basically, we need two more workers.'],
      ['Yes, and also ___.', 'أيوه، وكمان ___.', 'يِس، أند أولسو', 'Yes, and also we checked the valves.']] },
    { k: 'opinion', ic: '🧠', ar: 'رأيك', en: 'Opinion', items: [
      ['I think ___.', 'أعتقد إن ___.', 'آي ثِنك', 'I think this duct is too small.'],
      ['In my opinion, ___.', 'في رأيي، ___.', 'إن ماي أوپِنيَن', 'In my opinion, we should change the supplier.'],
      ['I believe ___.', 'أنا مقتنع إن ___.', 'آي بِليڤ', 'I believe the design is correct.'],
      ['It seems to me that ___.', 'يبان لي إن ___.', 'إت سيمز تو مي ذات', 'It seems to me that the pressure is low.']] },
    { k: 'agree', ic: '👍', ar: 'موافقة واعتراض', en: 'Agree / disagree', items: [
      ['I agree with you, ___.', 'أنا متفق معاك، ___.', 'آي أجري وِذ يو', 'I agree with you, it is urgent.'],
      ['That makes sense, ___.', 'ده منطقي، ___.', 'ذات ميكس سِنس', 'That makes sense, let\'s do it.'],
      ['I see your point, but ___.', 'فاهم قصدك، بس ___.', 'آي سي يور پوينت، بات', 'I see your point, but the cost is high.'],
      ['I\'m not sure about that, ___.', 'مش متأكد من ده، ___.', 'آيم نوت شور أباوت ذات', 'I\'m not sure about that, let me check.']] },
    { k: 'clarify', ic: '🔎', ar: 'استيضاح وكسب وقت', en: 'Clarify & buy time', items: [
      ['Sorry, do you mean ___?', 'آسف، قصدك ___؟', 'سوري، دو يو مين', 'Sorry, do you mean the second floor?'],
      ['Could you say that again, please?', 'ممكن تعيد تاني من فضلك؟', 'كُد يو سِي ذات أجِين پليز', 'Could you say that again, please?'],
      ['Let me think about it, ___.', 'خليني أفكر، ___.', 'لِت مي ثِنك أباوت إت', 'Let me think about it, I\'ll reply today.'],
      ['That\'s a good question. ___.', 'سؤال حلو. ___.', 'ذاتس أ جود كوِسچَن', 'That\'s a good question. I\'ll ask the consultant.']] },
    { k: 'site', ic: '🦺', ar: 'الموقع والاجتماعات', en: 'Site & meetings', items: [
      ['We need to ___.', 'محتاجين ___.', 'وي نيد تو', 'We need to fix the leak today.'],
      ['The problem is ___.', 'المشكلة إن ___.', 'ذَ پروبلِم إز', 'The problem is the shaft is too small.'],
      ['We are waiting for ___.', 'إحنا مستنيين ___.', 'وي آر ويتِنج فور', 'We are waiting for the approval.'],
      ['It will be ready by ___.', 'هيبقى جاهز يوم ___.', 'إت وِل بي رِدي باي', 'It will be ready by Thursday.'],
      ['Please make sure ___.', 'من فضلك اتأكد إن ___.', 'پليز ميك شور', 'Please make sure the area is clean.'],
      ['I\'ll get back to you ___.', 'هرجعلك ___.', 'آيل جِت باك تو يو', 'I\'ll get back to you after lunch.']] }
  ].map(g => ({ ...g, ar: (window.BLK_CAT_AR || {})[g.k] || g.ar, items: g.items.map((x, i) => ({ id: g.k + i, en: x[0], ar: (window.BLK_AR || {})[x[0]] || x[1], pa: x[2], ex: x[3], note: x[4] || '' })) }));
  const ALL_BLOCKS = BLOCKS.flatMap(g => g.items);
  const bxa = ex => { const t = (window.BLK_EX_AR || {})[ex]; return t ? `<div class="exar" dir="rtl">↩︎ ${esc(t)}</div>` : ''; };
  const blk = () => (S.blocks = S.blocks || { known: {}, fav: {} });
  let blkTab = 'learn', blkCat = 'me';
  views.blocks = v => {
    const B = blk();
    const known = Object.keys(B.known).length;
    const tabs = [['learn', '📦', 'البلوكات', 'Blocks'], ['drill', '🧠', 'احفظها', 'Memorise'], ['reply', '🔁', 'تدريب الرد', 'Reply drill'], ['build', '🛠️', 'كوّن جملتك', 'Build a sentence']];
    v.innerHTML = `<div class="card" style="background:linear-gradient(135deg,var(--brandSoft),var(--accentSoft))"><h2>📦 ${L('بلوكات الكلام', 'Speaking blocks')}</h2>
        <p class="small">${L('بداية جاهزة تحفظها مرة وتستخدمها كل يوم: ابدأ بيها السؤال أو الإجابة، وكمّل بعدها بكلمتك. البلوك + كلمتك = جملة كاملة.', 'Ready starters: block + your words = a full sentence.')}</p>
        <div class="row between small"><span>${L('حفظت', 'Memorised')} <b>${known}</b> / ${ALL_BLOCKS.length}</span></div><div class="bar" style="margin-top:6px"><i style="width:${known / ALL_BLOCKS.length * 100}%"></i></div></div>
      <div class="tabs">${tabs.map(t => `<button class="tab ${blkTab === t[0] ? 'on' : ''}" data-bt="${t[0]}">${t[1]} ${L(t[2], t[3])}</button>`).join('')}</div><div id="bBody"></div>`;
    $$('[data-bt]', v).forEach(b => b.onclick = () => { blkTab = b.dataset.bt; route(); });
    const body = $('#bBody', v);
    const blockHTML = (b, big) => `<div class="en" style="font-size:${big ? 22 : 18}px;font-weight:600">${esc(b.en).replace('___', '<span style="color:var(--warn)">___</span>')} ${say(b.en.replace('___', ''))}</div>${S.showPA !== false ? `<div class="pa${big ? ' big' : ''}" dir="rtl">🗣️ ${esc(b.pa)}</div>` : ''}<div>${esc(b.ar)}</div>`;
    if (blkTab === 'learn') {
      const showFav = blkCat === 'fav';
      const items = showFav ? ALL_BLOCKS.filter(b => B.fav[b.id]) : BLOCKS.find(g => g.k === blkCat).items;
      body.innerHTML = `<div class="tabs">${BLOCKS.map(g => `<button class="tab ${blkCat === g.k ? 'on' : ''}" data-bc="${g.k}">${g.ic} ${L(g.ar, g.en)}</button>`).join('')}<button class="tab ${showFav ? 'on' : ''}" data-bc="fav">⭐ ${L('المفضلة', 'Favourites')}</button></div>
        ${items.length ? items.map(b => `<div class="card" style="padding:12px"><div class="row between" style="align-items:flex-start"><div>${blockHTML(b)}</div><div class="row" style="gap:4px"><button class="btn sm ghost" data-fav="${b.id}" title="fav">${B.fav[b.id] ? '⭐' : '☆'}</button><button class="btn sm ${B.known[b.id] ? 'sec' : ''}" data-kn="${b.id}">${B.known[b.id] ? '✅ ' + L('محفوظ', 'Known') : L('حفظته', 'Got it')}</button></div></div>
          <div class="info small en" style="margin-top:8px">▶ ${esc(b.ex)} ${say(b.ex)} <button class="speak" data-slow="${esc(b.ex)}">🐢</button>${bxa(b.ex)}</div>${b.note ? `<div class="small muted" style="margin-top:6px">💡 ${esc(b.note)}</div>` : ''}</div>`).join('') : `<div class="note">${L('اضغط ☆ على أي بلوك عشان يتحفظ هنا.', 'Tap ☆ on a block to keep it here.')}</div>`}`;
      $$('[data-bc]', body).forEach(b => b.onclick = () => { blkCat = b.dataset.bc; route(); });
      $$('[data-fav]', body).forEach(b => b.onclick = () => { const id = b.dataset.fav; if (B.fav[id]) delete B.fav[id]; else B.fav[id] = 1; save(); route(); });
      $$('[data-kn]', body).forEach(b => b.onclick = () => { const id = b.dataset.kn; if (B.known[id]) delete B.known[id]; else { B.known[id] = today(); addXP(2); } save(); route(); });
      $$('[data-slow]', body).forEach(b => b.onclick = () => TTS.speak(b.dataset.slow, { rate: 0.7 }));
    } else if (blkTab === 'reply') {
      const pairs = ALL_BLOCKS.filter(b => /^A: .+ — B: /.test(b.ex)).map(b => { const m = b.ex.match(/^A: (.+) — B: (.+)$/); return { q: m[1], a: m[2], ar: b.ar }; });
      const qs = shuffle(pairs).slice(0, 8).map(p => { const opts = shuffle([p.a, ...shuffle(pairs.filter(x => x.a !== p.a)).slice(0, 2).map(x => x.a)]); return { type: 'mc', q: L('ردّ على: ', 'Reply to: ') + p.q, options: opts, answer: opts.indexOf(p.a), explain: p.a + ' = ' + p.ar }; });
      body.innerHTML = `<div class="note small">${L('اختار أنسب رد. بعد ما تجاوب قول الرد بصوت عالي 🔊.', 'Pick the best reply, then say it aloud.')}</div><div id="bRq"></div>`;
      runQuiz($('#bRq', body), qs, { title: L('تدريب الرد', 'Reply drill'), src: 'blocks', reshuffle: true, onDone: p => { setSkill('speaking', p); addXP(10); save(); } });
    } else if (blkTab === 'drill') {
      const pool = shuffle(ALL_BLOCKS.filter(b => !B.known[b.id]).concat(shuffle(ALL_BLOCKS.filter(b => B.known[b.id])).slice(0, 3))).slice(0, 8);
      let i = 0, right = 0;
      const card = () => {
        if (i >= pool.length) { addXP(10); doneTask('speaking'); save(); body.innerHTML = `<div class="card"><h2>🎉 ${L('خلصت الجولة', 'Round done')}</h2><p>${L('عرفت', 'You knew')} <b>${right}</b> / ${pool.length}</p><button class="btn" id="bAgain">${L('جولة جديدة', 'New round')}</button></div>`; $('#bAgain', body).onclick = () => route(); return; }
        const b = pool[i];
        body.innerHTML = `<div class="card"><div class="row between small muted"><span>${L('قول البلوك بالإنجليزي قبل ما تقلب', 'Say it in English before flipping')}</span><span>${i + 1}/${pool.length}</span></div><div class="bar" style="margin:6px 0 14px"><i style="width:${i / pool.length * 100}%"></i></div>
          <h2 style="text-align:center">${esc(b.ar)}</h2><div id="bBack" style="display:none;text-align:center;margin-top:10px">${blockHTML(b, true)}<div class="info small en" style="margin-top:8px">▶ ${esc(b.ex)}${bxa(b.ex)}</div>${b.note ? `<div class="small muted" style="margin-top:6px">💡 ${esc(b.note)}</div>` : ''}</div>
          <div class="row" style="justify-content:center;margin-top:14px" id="bBtns"><button class="btn" id="bFlip">🔄 ${L('اقلب', 'Flip')}</button></div></div>`;
        $('#bFlip', body).onclick = () => {
          $('#bBack', body).style.display = ''; TTS.speak(b.en.replace('___', ''));
          $('#bBtns', body).innerHTML = `<button class="btn sec" id="bNo">😕 ${L('لسه', 'Not yet')}</button><button class="btn" id="bYes">✅ ${L('عرفتها', 'I knew it')}</button>`;
          $('#bYes', body).onclick = () => { right++; B.known[b.id] = B.known[b.id] || today(); save(); i++; card(); };
          $('#bNo', body).onclick = () => { delete B.known[b.id]; save(); i++; card(); };
        };
      };
      card();
    } else {
      body.innerHTML = `${aiNote()}<div class="card"><h3>🛠️ ${L('اختار بلوك وكمّله بفكرتك', 'Pick a block and finish it')}</h3>
        <label>${L('البلوك', 'Block')}<select id="bSel" class="en" dir="ltr">${BLOCKS.map(g => `<optgroup label="${esc(L(g.ar, g.en))}">${g.items.map(b => `<option value="${b.id}">${esc(b.en)}</option>`).join('')}</optgroup>`).join('')}</select></label>
        <label style="display:block;margin-top:8px">${L('فكرتك (بالعربي أو بالإنجليزي)', 'Your idea (Arabic or English)')}<textarea id="bIdea" rows="2" placeholder="${L('مثال: عايز أسأل المورد امتى هيوصل التشيلر', 'e.g. ask the supplier when the chiller arrives')}"></textarea></label>
        <div class="row" style="margin-top:10px"><button class="btn" id="bMake" ${AI.ok() ? '' : 'disabled'}>✨ ${L('كوّن الجملة', 'Build it')}</button></div><div id="bOut" style="margin-top:10px"></div></div>`;
      $('#bMake', body).onclick = async () => {
        const b = ALL_BLOCKS.find(x => x.id === $('#bSel', body).value), idea = $('#bIdea', body).value.trim(), out = $('#bOut', body);
        if (!idea) { $('#bIdea', body).focus(); return; }
        out.innerHTML = '<p class="muted">⏳ …</p>';
        try {
          const r = await AI.json(`An Arabic-speaking English learner (CEFR ${level()}) wants to say this idea: "${idea}". They must start with the speaking block "${b.en}" (___ is the slot). Return ONLY JSON: {"sentence":"full natural English sentence starting with the block","ar":"ترجمة عربية","pa":"النطق بحروف عربية (پ=P ڤ=V چ=G ث=th think ذ=th this)","more":["2 other short sentences with the same block on the same idea"],"tip_ar":"ملاحظة قصيرة بالعربية"}`);
          out.innerHTML = `<div class="okbox" style="color:var(--text);background:var(--brandSoft)"><div class="en" style="font-size:19px;font-weight:600">${esc(r.sentence)} ${say(r.sentence)}</div>${r.pa && S.showPA !== false ? `<div class="pa" dir="rtl">🗣️ ${esc(r.pa)}</div>` : ''}<div>${esc(r.ar)}</div></div>
            ${(r.more || []).map(m => `<div class="en" style="margin-top:6px">• ${esc(m)} ${say(m)}</div>`).join('')}${r.tip_ar ? `<div class="info small" style="margin-top:8px">💡 ${esc(r.tip_ar)}</div>` : ''}
            <div class="row" style="margin-top:8px"><button class="btn sm" id="bSave">⭐ ${L('احفظ في كلماتي', 'Save')}</button></div>`;
          $('#bSave', out).onclick = () => { S.saved = S.saved || []; if (!S.saved.some(s => s.en === r.sentence)) { S.saved.unshift({ en: r.sentence, ar: r.ar, pa: r.pa || '', d: today() }); if (S.saved.length > 200) S.saved.length = 200; save(); } toast('⭐ ' + L('تم الحفظ', 'Saved')); };
          addXP(5);
        } catch (e) { out.innerHTML = `<div class="badbox">${esc(AI.errText(e))}</div>`; }
      };
    }
  };

  /* ---------- Learn from video (YouTube / TikTok / any clip) ---------- */
  const VID_SUGG = [
    { k: 'mep', ic: '🔧', ar: 'شرح أنظمة MEP', en: 'MEP explained', qs: ['HVAC system explained', 'chiller plant explained', 'fire sprinkler system how it works', 'fire pump explained', 'plumbing drainage system explained', 'VRF system explained'] },
    { k: 'site', ic: '🦺', ar: 'إنجليزي الموقع والاجتماعات', en: 'Site & meetings', qs: ['construction site English phrases', 'site meeting English vocabulary', 'construction safety toolbox talk', 'how to lead a project meeting in English'] },
    { k: 'interview', ic: '🤝', ar: 'مقابلات العمل للمهندسين', en: 'Engineer interviews', qs: ['mechanical engineer interview questions and answers', 'MEP engineer interview', 'tell me about yourself engineer interview'] },
    { k: 'daily', ic: '☕', ar: 'محادثة يومية قصيرة', en: 'Daily conversation', qs: ['English conversation practice slow', 'daily English phrases for beginners', 'English small talk at work'] },
    { k: 'pron', ic: '🗣️', ar: 'النطق للعرب', en: 'Pronunciation for Arabs', qs: ['English pronunciation P and B for Arabic speakers', 'English pronunciation V and F', 'English word stress practice'] }
  ];
  const ytSearch = q => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);
  const ttSearch = q => 'https://www.tiktok.com/search?q=' + encodeURIComponent(q);
  const vidSource = u => /youtu\.?be/i.test(u) ? 'YouTube' : /tiktok/i.test(u) ? 'TikTok' : /instagram/i.test(u) ? 'Instagram' : u ? L('رابط', 'Link') : '';
  const simScore = (a, b) => {
    const A = norm(a).split(' ').filter(Boolean), B = norm(b).split(' ').filter(Boolean);
    if (!A.length) return 0; const pool = B.slice(); let hit = 0;
    A.forEach(w => { const i = pool.indexOf(w); if (i >= 0) { hit++; pool.splice(i, 1); } });
    return Math.round(hit / Math.max(A.length, B.length) * 100);
  };
  let vidTab = 'lines';
  views.video = v => {
    S.videos = S.videos || [];
    const day = Math.floor(Date.now() / 864e5);
    const pref = S.goal === 'daily' ? ['daily', 'pron', 'site'] : ['mep', 'site', 'interview'];
    const todays = pref.map((k, i) => { const g = VID_SUGG.find(x => x.k === k); return { g, q: g.qs[(day + i) % g.qs.length] }; });
    v.innerHTML = `${aiNote()}
      <div class="card" style="background:linear-gradient(135deg,var(--brandSoft),var(--accentSoft))"><h2>🎬 ${L('اتعلّم من أي فيديو', 'Learn from any video')}</h2>
        <p class="small">${L('شاهد فيديو من يوتيوب أو تيك توك، والصق النص المكتوب له، والمنصة تحوّله لدرس كامل: نص مزدوج إنجليزي/عربي، مفردات بالنطق، اختبار فهم، تدريب تكرار (Shadowing)، ومحادثة مع المدرس عن الفيديو.', 'Paste a clip transcript and get a full lesson.')}</p></div>
      <div class="card"><h3>✨ ${L('مقترحات اليوم لك', 'Today\'s picks for you')}</h3><p class="muted small">${L('تتغير كل يوم حسب هدفك. افتح البحث، اختر فيديو قصير (1–5 دقائق)، ثم انسخ رابطه ونصه هنا.', 'Changes daily based on your goal.')}</p>
        <div class="grid g2">${todays.map(t => `<div class="tile" style="cursor:default"><div><b>${t.g.ic} ${L(t.g.ar, t.g.en)}</b></div><div class="en small" style="margin:6px 0">${esc(t.q)}</div><div class="row" style="gap:6px"><a class="btn sm" href="${ytSearch(t.q)}" target="_blank" rel="noopener">▶️ YouTube</a><a class="btn sm sec" href="${ttSearch(t.q)}" target="_blank" rel="noopener">🎵 TikTok</a></div></div>`).join('')}</div>
        <details style="margin-top:10px"><summary class="small">${L('كل الأقسام المقترحة', 'All suggested topics')}</summary>
          ${VID_SUGG.map(g => `<div style="margin-top:8px"><b>${g.ic} ${L(g.ar, g.en)}</b><div class="row" style="gap:6px;margin-top:4px">${g.qs.map(q => `<a class="chip en" href="${ytSearch(q)}" target="_blank" rel="noopener">${esc(q)}</a>`).join('')}</div></div>`).join('')}</details>
        <div class="row" style="margin-top:10px"><button class="btn sm ghost" id="vAiSug" ${AI.ok() ? '' : 'disabled'}>🤖 ${L('اقترح لي مواضيع حسب مستواي وأخطائي', 'Suggest topics for my level')}</button></div><div id="vAiBox"></div></div>
      <div class="card"><h3>📥 ${L('حوّل فيديو لدرس', 'Turn a video into a lesson')}</h3>
        <label>${L('رابط الفيديو (اختياري)', 'Video link (optional)')}<input type="url" id="vUrl" class="en" dir="ltr" placeholder="https://youtube.com/… or https://vt.tiktok.com/…"></label>
        <label style="margin-top:8px;display:block">${L('النص المكتوب للفيديو (الترجمة / Transcript)', 'Transcript')}<textarea id="vTx" class="en" dir="ltr" rows="6" placeholder="Paste the English transcript or captions here…"></textarea></label>
        <details class="small" style="margin-top:6px"><summary>${L('إزاي أجيب النص؟', 'How do I get the transcript?')}</summary><ul>
          <li><b>YouTube:</b> ${L('تحت الفيديو اضغط «المزيد» ← «عرض النص» (Show transcript)، حدّد النص وانسخه.', 'Under the video: More → Show transcript, then copy.')}</li>
          <li><b>TikTok / Reels:</b> ${L('شغّل الترجمة (CC) واكتب أو انسخ الجمل، أو استخدم الإملاء الصوتي في لوحة المفاتيح وأنت مشغّل الفيديو.', 'Turn on captions and copy or dictate the lines.')}</li>
          <li>${L('مفيش نص؟ اكتب موضوع الفيديو بس، والمدرس يكتب سكريبت قصير بنفس الأسلوب.', 'No transcript? Just type the topic and the tutor writes a short clip-style script.')}</li></ul></details>
        <div class="row" style="margin-top:10px"><select id="vLv" style="width:auto">${LV.map(l => `<option ${l === level() ? 'selected' : ''}>${l}</option>`).join('')}</select>
          <button class="btn" id="vGo" ${AI.ok() ? '' : 'disabled'}>🎓 ${L('حوّله لدرس', 'Make lesson')}</button>
          <button class="btn sec" id="vGen" ${AI.ok() ? '' : 'disabled'}>🎞️ ${L('ما عنديش نص — اكتب سكريبت', 'No transcript — write a script')}</button></div>
        <div id="vMsg"></div></div>
      ${S.videos.length ? `<div class="card"><h3>📼 ${L('مكتبة فيديوهاتي', 'My video library')}</h3>${S.videos.map((x, i) => `<div class="row between" style="padding:8px 0;border-bottom:1px solid var(--line)"><span><span class="pill">${esc(x.level)}</span> <b class="en">${esc(x.title)}</b> <span class="small muted">${esc(vidSource(x.url))} · ${esc(x.d)}${x.score != null ? ' · ' + x.score + '%' : ''}</span></span><span class="row" style="gap:6px"><button class="btn sm" data-vo="${i}">${L('افتح', 'Open')}</button><button class="btn sm ghost" data-vd="${i}">✖</button></span></div>`).join('')}</div>` : ''}`;
    $$('[data-vo]', v).forEach(b => b.onclick = () => { vidTab = 'lines'; videoLesson(v, S.videos[+b.dataset.vo]); });
    $$('[data-vd]', v).forEach(b => b.onclick = () => { S.videos.splice(+b.dataset.vd, 1); save(); route(); });
    $('#vAiSug', v).onclick = async () => {
      const box = $('#vAiBox', v); box.innerHTML = '<p class="muted">⏳ …</p>';
      try {
        const r = await AI.json(`Suggest 6 short-video search topics for an Arabic-speaking English learner (CEFR ${level()}, goal: ${S.goal}). Recent errors: ${topMistakeHints()}. Mix: their profession (MEP/construction if relevant), weak points, and everyday English. Return ONLY JSON: {"items":[{"query":"English YouTube/TikTok search phrase","why_ar":"سبب قصير بالعربية"}]}`);
        box.innerHTML = `<div style="margin-top:8px">${(r.items || []).map(x => `<div style="padding:6px 0;border-bottom:1px solid var(--line)"><b class="en">${esc(x.query)}</b><div class="small muted">${esc(x.why_ar)}</div><div class="row" style="gap:6px;margin-top:4px"><a class="btn sm" href="${ytSearch(x.query)}" target="_blank" rel="noopener">▶️ YouTube</a><a class="btn sm sec" href="${ttSearch(x.query)}" target="_blank" rel="noopener">🎵 TikTok</a></div></div>`).join('')}</div>`;
      } catch (e) { box.innerHTML = `<div class="badbox">${esc(AI.errText(e))}</div>`; }
    };
    const build = async (gen) => {
      const url = $('#vUrl', v).value.trim(), tx = $('#vTx', v).value.trim(), lv = $('#vLv', v).value, msg = $('#vMsg', v);
      if (!tx) { toast(gen ? L('اكتب موضوع الفيديو في خانة النص', 'Type the topic in the text box') : L('الصق نص الفيديو أولاً', 'Paste the transcript first')); $('#vTx', v).focus(); return; }
      $('#vGo', v).disabled = $('#vGen', v).disabled = true;
      msg.innerHTML = `<p class="muted">⏳ ${L('جارٍ تجهيز الدرس… (قد يستغرق دقيقة)', 'Preparing the lesson…')}</p>`;
      const src = gen
        ? `There is no transcript. Write an ORIGINAL short-video script (TikTok/YouTube Shorts style, 60–90 seconds, 8–14 lines, natural spoken English, engaging hook in line 1) about: ${tx.slice(0, 400)}. Use it as the transcript.`
        : `TRANSCRIPT (may contain timestamps or caption noise — clean it, fix obvious caption errors, keep the speaker's wording):\n<<<${tx.slice(0, 6000)}>>>`;
      try {
        const r = await AI.json(`You turn a short video into an English lesson for an Arabic-speaking learner at CEFR ${lv} (goal: ${S.goal}). ${src}
Return ONLY JSON:
{"title":"short English title","summary_ar":"ملخص الفيديو في 2-3 جمل بالعربية",
 "lines":[{"en":"one spoken sentence","ar":"ترجمة عربية طبيعية","pa":"النطق بحروف عربية (پ=P ڤ=V چ=G ث=th think ذ=th this تش=ch)"}],
 "vocab":[{"en":"word or phrase","ar":"المعنى","pa":"النطق بالعربي","ex":"example sentence from or like the video"}],
 "phrases":[{"en":"useful chunk / expression","ar":"المعنى","use_ar":"متى تستخدمها"}],
 "quiz":[{"q":"question in English","options":["a","b","c","d"],"answer":0,"explain":"شرح قصير بالعربية"}]}
Rules: max 25 lines (choose the most useful if longer), 8–10 vocab chosen for level ${lv} (prefer technical terms if the video is technical), 4–6 phrases, 5 quiz questions mixing comprehension and vocabulary.`);
        if (!r || !(r.lines || []).length) throw new Error('empty');
        const item = { id: Date.now(), url, title: r.title || 'Video', level: lv, d: today(), gen: !!gen, summary_ar: r.summary_ar || '', lines: (r.lines || []).slice(0, 25), vocab: r.vocab || [], phrases: r.phrases || [], quiz: r.quiz || [], score: null };
        S.videos.unshift(item); if (S.videos.length > 10) S.videos.length = 10;
        S.stats.videos = (S.stats.videos || 0) + 1; addXP(15); save();
        vidTab = 'lines'; videoLesson(v, item);
      } catch (e) { msg.innerHTML = `<div class="badbox">${esc(AI.errText(e))}</div>`; $('#vGo', v).disabled = $('#vGen', v).disabled = false; }
    };
    $('#vGo', v).onclick = () => build(false);
    $('#vGen', v).onclick = () => build(true);
  };
  function videoLesson(v, x) {
    const tabs = [['lines', '📜', 'النص المزدوج', 'Transcript'], ['vocab', '📚', 'المفردات', 'Vocabulary'], ['quiz', '❓', 'اختبار الفهم', 'Quiz'], ['shadow', '🔁', 'التكرار Shadowing', 'Shadowing'], ['talk', '🤖', 'ناقش الفيديو', 'Discuss']];
    const draw = () => {
      if (activeChat && activeChat.abort) { activeChat.abort(); activeChat = null; }
      v.innerHTML = `<button class="btn ghost sm" id="vBack">← ${L('رجوع للفيديوهات', 'Back to videos')}</button>
        <div class="card"><div class="row between"><h2 class="en" style="margin:0">${esc(x.title)}</h2><span class="pill">${esc(x.level)}</span></div>
          <p style="margin:8px 0">${esc(x.summary_ar)}</p>
          <div class="row" style="gap:6px">${x.url ? `<a class="btn sm" href="${esc(x.url)}" target="_blank" rel="noopener">▶️ ${L('افتح الفيديو على', 'Open on')} ${esc(vidSource(x.url))}</a>` : ''}${x.gen ? `<span class="pill">${L('سكريبت مولّد', 'Generated script')}</span>` : ''}<button class="btn sm sec" id="vAll">🔊 ${L('استمع للنص كله', 'Listen to all')}</button></div></div>
        <div class="tabs">${tabs.map(t => `<button class="tab ${vidTab === t[0] ? 'on' : ''}" data-vt="${t[0]}">${t[1]} ${L(t[2], t[3])}</button>`).join('')}</div>
        <div id="vBody"></div>`;
      $('#vBack', v).onclick = () => route();
      $('#vAll', v).onclick = () => TTS.speak(x.lines.map(l => l.en).join(' '));
      $$('[data-vt]', v).forEach(b => b.onclick = () => { vidTab = b.dataset.vt; draw(); });
      const body = $('#vBody', v);
      if (vidTab === 'lines') {
        let showAr = true;
        const paint = () => {
          body.innerHTML = `<div class="card"><div class="row between"><span class="small muted">${L('اضغط 🔊 لسماع الجملة، 🐢 للبطء.', 'Tap 🔊 to hear, 🐢 slow.')}</span><label class="small"><input type="checkbox" id="vAr" ${showAr ? 'checked' : ''}> ${L('إظهار الترجمة', 'Show Arabic')}</label></div>
            ${x.lines.map((l, i) => `<div style="padding:10px 0;border-bottom:1px solid var(--line)"><div class="en" style="font-size:17px">${esc(l.en)} ${say(l.en)} <button class="speak" data-slow="${i}" title="slow">🐢</button></div>${pa(l.en) || (l.pa && S.showPA !== false ? `<div class="pa" dir="rtl">🗣️ ${esc(l.pa)}</div>` : '')}${showAr ? `<div class="muted">${esc(l.ar)}</div>` : ''}</div>`).join('')}</div>`;
          $('#vAr', body).onchange = e => { showAr = e.target.checked; paint(); };
          $$('[data-slow]', body).forEach(b => b.onclick = () => TTS.speak(x.lines[+b.dataset.slow].en, { rate: 0.7 }));
        };
        paint();
      } else if (vidTab === 'vocab') {
        body.innerHTML = `<div class="card"><div class="row between"><h3 style="margin:0">📚 ${L('كلمات الفيديو', 'Video words')}</h3><button class="btn sm" id="vSaveAll">⭐ ${L('احفظ الكل في كلماتي', 'Save all')}</button></div>
          <table style="margin-top:8px">${x.vocab.map((w, i) => `<tr><td class="en"><b>${esc(w.en)}</b> ${say(w.en)}${w.pa && S.showPA !== false ? `<div class="pa" dir="rtl">🗣️ ${esc(w.pa)}</div>` : ''}<div class="small muted">${esc(w.ex || '')}</div></td><td>${esc(w.ar)}</td><td><button class="btn sm ghost" data-vs="${i}">⭐</button></td></tr>`).join('')}</table>
          ${x.phrases.length ? `<h3 style="margin-top:14px">💬 ${L('تعبيرات جاهزة من الفيديو', 'Useful phrases')}</h3>${x.phrases.map(p => `<div style="padding:6px 0;border-bottom:1px solid var(--line)"><b class="en">${esc(p.en)}</b> ${say(p.en)} — ${esc(p.ar)}<div class="small muted">${esc(p.use_ar || '')}</div></div>`).join('')}` : ''}</div>`;
        const saveW = w => { S.saved = S.saved || []; if (!S.saved.some(s => s.en === w.en)) { S.saved.unshift({ en: w.en, ar: w.ar, pa: w.pa || '', d: today() }); if (S.saved.length > 200) S.saved.length = 200; } };
        $$('[data-vs]', body).forEach(b => b.onclick = () => { saveW(x.vocab[+b.dataset.vs]); save(); toast('⭐ ' + L('تم الحفظ في كلماتي', 'Saved')); });
        $('#vSaveAll', body).onclick = () => { x.vocab.forEach(saveW); save(); toast('⭐ ' + L('تم حفظ كل الكلمات (تجدها في المترجم ← كلماتي)', 'All saved')); };
      } else if (vidTab === 'quiz') {
        const qs = (x.quiz || []).filter(q => q && q.options).map(q => ({ type: 'mc', q: q.q, options: q.options, answer: +q.answer || 0, explain: q.explain }));
        if (!qs.length) { body.innerHTML = `<div class="note">${L('لا يوجد اختبار لهذا الفيديو.', 'No quiz for this video.')}</div>`; return; }
        runQuiz(body, qs, { title: L('اختبار الفيديو', 'Video quiz'), src: 'video', reshuffle: true, onDone: p => { x.score = Math.max(x.score || 0, p); setSkill('listening', p); addXP(15); doneTask('listening'); save(); } });
      } else if (vidTab === 'shadow') {
        let i = 0, total = [];
        const paint = () => {
          const l = x.lines[i];
          body.innerHTML = `<div class="card"><div class="row between small muted"><span>${L('استمع ← كرر بصوت عالٍ ← قارن', 'Listen → repeat aloud → compare')}</span><span>${i + 1} / ${x.lines.length}</span></div><div class="bar" style="margin:6px 0 14px"><i style="width:${i / x.lines.length * 100}%"></i></div>
            <div class="en" style="font-size:19px;font-weight:600">${esc(l.en)}</div>${l.pa && S.showPA !== false ? `<div class="pa big" dir="rtl">🗣️ ${esc(l.pa)}</div>` : ''}<div class="muted">${esc(l.ar)}</div>
            <div class="row" style="margin:12px 0"><button class="btn sec" id="sh1">🔊 ${L('عادي', 'Normal')}</button><button class="btn sec" id="sh2">🐢 ${L('بطيء', 'Slow')}</button></div>
            <div class="composer"><button class="mic" id="shMic">🎙️</button><textarea id="shIn" class="en" placeholder="${L('قل الجملة (🎙️ أو إملاء لوحة المفاتيح)…', 'Say it (mic or keyboard dictation)…')}"></textarea><button class="btn" id="shChk">${L('قارن', 'Check')}</button></div>
            <div id="shFb" style="margin-top:10px"></div>
            <div class="row" style="margin-top:10px">${i > 0 ? `<button class="btn ghost sm" id="shPrev">→ ${L('السابق', 'Prev')}</button>` : ''}<button class="btn sm" id="shNext">${i + 1 < x.lines.length ? L('الجملة التالية', 'Next line') + ' ←' : '🏁 ' + L('إنهاء', 'Finish')}</button></div></div>`;
          $('#sh1', body).onclick = () => TTS.speak(l.en); $('#sh2', body).onclick = () => TTS.speak(l.en, { rate: 0.65 });
          const inp = $('#shIn', body);
          let on = false; $('#shMic', body).onclick = () => { const m = $('#shMic', body); if (on) { STT.stop(); return; } if (STT.start(t => { inp.value = t; }, () => { on = false; m.classList.remove('rec'); })) { on = true; m.classList.add('rec'); } };
          $('#shChk', body).onclick = () => {
            const s = simScore(l.en, inp.value); total[i] = s;
            const said = norm(inp.value).split(' ');
            const marked = l.en.split(/\s+/).map(w => said.includes(norm(w)) ? `<span style="color:var(--ok)">${esc(w)}</span>` : `<span style="color:var(--bad);text-decoration:underline">${esc(w)}</span>`).join(' ');
            $('#shFb', body).innerHTML = `<div class="${s >= 80 ? 'okbox' : s >= 50 ? 'info' : 'badbox'}"><b>${s}%</b> — ${s >= 80 ? L('ممتاز!', 'Great!') : s >= 50 ? L('قريب، كرر الكلمات الحمراء', 'Close — repeat the red words') : L('استمع مرة أخرى ببطء وكرر', 'Listen slowly and try again')}<div class="en" style="margin-top:6px">${marked}</div></div>`;
          };
          if ($('#shPrev', body)) $('#shPrev', body).onclick = () => { i--; paint(); };
          $('#shNext', body).onclick = () => {
            if (i + 1 < x.lines.length) { i++; paint(); TTS.speak(x.lines[i].en); return; }
            const got = total.filter(n => n != null); const avg = got.length ? Math.round(got.reduce((a, b) => a + b, 0) / got.length) : 0;
            if (got.length) { setSkill('speaking', avg); addXP(20); doneTask('speaking'); }
            body.innerHTML = `<div class="card"><h2>🎉 ${L('أنهيت التكرار', 'Shadowing done')}</h2>${got.length ? `<p>${L('متوسط التطابق', 'Average match')}: <b>${avg}%</b> (${got.length}/${x.lines.length})</p>` : `<p class="muted">${L('لم تقارن أي جملة.', 'No lines checked.')}</p>`}<p class="small muted">${L('التطابق يقيس الكلمات التي فُهمت من كلامك، وليس دقة النطق الصوتي.', 'Matches recognised words, not exact pronunciation.')}</p><button class="btn" id="shAgain">${L('ابدأ من جديد', 'Again')}</button></div>`;
            $('#shAgain', body).onclick = () => { i = 0; total = []; paint(); };
          };
        };
        paint();
      } else if (vidTab === 'talk') {
        chatUI(body, {
          title: L('ناقش الفيديو مع Emma', 'Discuss the video with Emma'), kind: 'tutor', mode: 'correct',
          intro: L('المدرس شاف نص الفيديو. هيسألك عنه ويخليك تستخدم كلماته الجديدة.', 'The tutor knows the transcript and will ask you about it.'),
          system: `You are "Emma", a friendly English tutor. The learner just watched a short video titled "${x.title}". Transcript:\n${x.lines.map(l => l.en).join(' ').slice(0, 3000)}\nKey words to recycle: ${x.vocab.map(w => w.en).join(', ')}.\nDiscuss the video naturally: ask what they understood, their opinion, and how it relates to their own work or life. Encourage them to use the key words.`,
          onEval: () => { S.stats.conversations++; save(); }
        });
      }
    };
    draw();
  }

  /* ---------- Writing assistant ---------- */
  const WMODES = [
    ['correct', '✔ تصحيح القواعد والإملاء مع الشرح', 'Correct grammar & spelling'],
    ['improve', '✨ تحسين الأسلوب', 'Improve style'],
    ['pro', '💼 تحويل لصياغة احترافية', 'Make it professional'],
    ['ar2en', '🔁 ترجمة من العربية للإنجليزية', 'Arabic → English'],
    ['en2ar', '🔁 ترجمة من الإنجليزية للعربية', 'English → Arabic'],
    ['email', '📧 اكتب لي إيميلاً من هذه النقاط', 'Write an email from my notes'],
    ['report', '📄 اكتب فقرة تقرير من هذه النقاط', 'Write a report paragraph'],
    ['pa', '🗣️ اكتب لي النطق بالحروف العربية', 'Arabic-script pronunciation']
  ];
  function writingPrompt(mode, text) {
    const who = `The user is an Arabic-speaking ${S.goal === 'daily' ? 'English learner' : 'MEP / construction engineer'} at CEFR ${level()}.`;
    const fmt = `Format your answer in plain text (no markdown tables).`;
    switch (mode) {
      case 'correct': return `${who} Correct this English text. First give the fully corrected text. Then a section "الأخطاء:" listing each error as: ✘ wrong → ✔ right — شرح قصير بالعربية. ${fmt}\n\nTEXT:\n${text}`;
      case 'improve': return `${who} Improve the style and naturalness of this English text while keeping the meaning. Give the improved version, then "ما الذي تغيّر:" with 3–5 short notes in Arabic. ${fmt}\n\nTEXT:\n${text}`;
      case 'pro': return `${who} Rewrite this into polished professional English suitable for a consultant/client in a construction project. Give the professional version, then "تعبيرات احترافية مفيدة:" listing 3–5 phrases used with Arabic meaning. ${fmt}\n\nTEXT:\n${text}`;
      case 'ar2en': return `Translate this Arabic text into natural, accurate English (use correct construction/MEP terminology when relevant). Give the translation, then "ملاحظات:" with up to 3 Arabic notes on tricky terms. ${fmt}\n\nTEXT:\n${text}`;
      case 'en2ar': return `Translate this English text into clear Modern Standard Arabic, keeping technical terms accurate (add the English term in brackets where useful). ${fmt}\n\nTEXT:\n${text}`;
      case 'email': return `${who} Write a clear, professional English email (with Subject line) from these notes (which may be in Arabic or English). Then add "شرح:" with 3 short Arabic notes on the key phrases used. ${fmt}\n\nNOTES:\n${text}`;
      case 'pa': return `Write the pronunciation of this English text in Arabic letters for an Egyptian/Arabic speaker, line by line: first the English line, then on the next line the Arabic-letter pronunciation with short-vowel diacritics where helpful. Use this convention: پ = P, ڤ = V, چ = hard G, ج = J, ث = th as in think, ذ = th as in this, تش = ch. Put the stressed syllable of long words in [brackets]. Plain text only.\n\nTEXT:\n${text}`;
      default: return `${who} Write a concise professional report paragraph (progress/technical report style, passive voice where natural) from these notes. Then "شرح:" with 3 short Arabic notes. ${fmt}\n\nNOTES:\n${text}`;
    }
  }
  views.writing = v => {
    const prompts = { A1: 'Write 3 sentences about yourself and your job.', A2: 'Describe what you did yesterday at work (5 sentences).', B1: 'Write a short email to your manager asking for a day off.', B2: 'Explain a technical problem on site and your proposed solution.', C1: 'Write a formal response to a consultant rejecting your submittal.', C2: 'Write a persuasive paragraph justifying an extension of time.' };
    v.innerHTML = `${aiNote()}<div class="card"><h2>📝 ${L('مساعد الكتابة والترجمة', 'Writing assistant')}</h2>
      <div class="info small">✍️ ${L('تمرين مقترح لمستواك', 'Suggested task')}: <span class="en">${prompts[level()]}</span></div>
      <label style="display:block;margin-top:10px">${L('المطلوب', 'Task')}<select id="wm">${WMODES.map(m => `<option value="${m[0]}">${L(m[1], m[2])}</option>`).join('')}</select></label>
      <textarea id="wt" style="margin-top:10px" placeholder="${L('اكتب أو الصق النص هنا…', 'Type or paste text…')}"></textarea>
      <div class="row" style="margin-top:10px"><button class="btn" id="wg" ${AI.ok() ? '' : 'disabled'}>✨ ${L('نفّذ', 'Run')}</button><span class="small muted" id="wc"></span></div>
      <div id="wo" style="margin-top:12px"></div></div>`;
    const ta = $('#wt', v); ta.oninput = () => { $('#wc', v).textContent = ta.value.trim().split(/\s+/).filter(Boolean).length + ' words'; };
    $('#wm', v).onchange = () => { ta.className = ['ar2en', 'email', 'report'].includes($('#wm', v).value) ? '' : 'en'; };
    ta.className = 'en';
    $('#wg', v).onclick = async () => {
      const text = ta.value.trim(); if (!text) return toast(L('اكتب نصاً أولاً', 'Enter some text first'));
      const out = $('#wo', v); out.innerHTML = '<pre class="mail" id="wout">…</pre><div class="row" style="margin-top:8px"><button class="btn sm sec" id="wcopy">📋 ' + L('نسخ', 'Copy') + '</button><button class="btn sm sec" id="wsay">🔊</button></div>';
      const mode = $('#wm', v).value; const pre = $('#wout', v); pre.style.direction = mode === 'en2ar' ? 'rtl' : 'ltr'; pre.style.textAlign = mode === 'en2ar' ? 'right' : 'left';
      $('#wg', v).disabled = true;
      try {
        const r = await AI.text(writingPrompt(mode, text), ({ text: t }) => { pre.textContent = t; });
        pre.textContent = r; addXP(15); setSkill('writing', mode === 'correct' ? estimateWriting(r, text) : (S.skills.writing || 50));
        if (mode === 'email' || mode === 'pro') { S.stats.emails++; setSkill('professional', Math.max(S.skills.professional || 40, 50)); }
        save();
        $('#wcopy', v).onclick = () => navigator.clipboard.writeText(r).then(() => toast(L('تم النسخ', 'Copied')), () => toast(L('لم يتم النسخ', 'Copy failed')));
        $('#wsay', v).onclick = () => TTS.speak(r.split(/الأخطاء:|ما الذي|تعبيرات|شرح:|ملاحظات:/)[0]);
      } catch (e) { out.innerHTML = `<div class="badbox">${esc(AI.errText(e))}</div>`; }
      $('#wg', v).disabled = false;
    };
  };
  function estimateWriting(result, text) { const errs = (result.match(/✘/g) || []).length; const words = Math.max(1, text.split(/\s+/).length); return Math.max(20, 100 - Math.round(errs / words * 400)); }

  /* ---------- Business English ---------- */
  views.business = v => {
    let cur = C.BUSINESS[0].id;
    const draw = () => {
      const b = C.BUSINESS.find(x => x.id === cur);
      v.innerHTML = `<div class="tabs">${C.BUSINESS.map(x => `<button class="tab ${x.id === cur ? 'on' : ''}" data-b="${x.id}">${esc(x.ar)}</button>`).join('')}</div>
        <div class="card"><h2 class="en">${esc(b.title)} <span class="muted small">${esc(b.ar)}</span></h2><table>${b.phrases.map(p => `<tr><td class="en"><b>${esc(p[0])}</b> ${say(p[0])}</td><td>${esc(p[1])}</td></tr>`).join('')}</table>
          <div class="row" style="margin-top:12px"><button class="btn sec" id="bq">❓ ${L('اختبر نفسك', 'Quiz')}</button><button class="btn" id="br" ${AI.ok() ? '' : 'disabled'}>🎭 ${L('تدرّب بلعب الأدوار', 'Role-play this')}</button></div></div><div id="bx"></div>`;
      $$('[data-b]', v).forEach(x => x.onclick = () => { cur = x.dataset.b; draw(); });
      $('#bq', v).onclick = () => {
        const all = C.BUSINESS.flatMap(x => x.phrases);
        const qs = pick(b.phrases, Math.min(5, b.phrases.length)).map(p => { const o = shuffle([p[0], ...pick(all.filter(x => x[0] !== p[0]), 2).map(x => x[0])]); return { type: 'mc', q: L('كيف تقول: ', 'How do you say: ') + p[1], options: o, answer: o.indexOf(p[0]), explain: p[0] }; });
        runQuiz($('#bx', v), qs, { title: b.title, src: 'business', onDone: p => { setSkill('professional', p); addXP(10); } });
      };
      $('#br', v).onclick = () => {
        $('#bx', v).scrollIntoView();
        chatUI($('#bx', v), { title: 'Role-play: ' + b.title, kind: 'business', mode: 'correct', system: `You are a colleague/manager/client in a construction company in Riyadh. Create a short realistic business situation about "${b.title}" and role-play it with the learner. Encourage him to use phrases like: ${b.phrases.map(p => p[0]).join(' / ')}.`, onEval: () => { S.stats.conversations++; save(); } });
      };
    };
    draw();
  };

  /* ---------- Engineering & MEP English ---------- */
  views.mep = v => {
    const sets = ['hvac', 'fire', 'plumbing', 'electrical', 'construction', 'pm'].map(id => C.VOCAB_SETS.find(s => s.id === id));
    let cur = 'hvac', q = '';
    const draw = () => {
      const set = sets.find(s => s.id === cur);
      const words = q ? sets.flatMap(s => s.words).filter(w => (w.en + ' ' + w.ar + ' ' + w.def).toLowerCase().includes(q.toLowerCase())) : set.words;
      v.innerHTML = `<div class="card"><h2>🔧 Professional Engineering & MEP English</h2><p class="muted small">${L('لكل مصطلح: الترجمة، النطق الصوتي، النطق بالحروف العربية، المعنى، وجملة كما تُستخدم في المشروع.', 'Each term: Arabic, audio, Arabic-script pronunciation, meaning, and a project sentence.')}</p>${legend()}
          <input type="text" id="ms" placeholder="${L('ابحث عن مصطلح… (مثال: damper أو صمام)', 'Search a term…')}" value="${esc(q)}"></div>
        <div class="tabs">${sets.map(s => `<button class="tab ${s.id === cur && !q ? 'on' : ''}" data-m="${s.id}">${esc(s.title)} · ${esc(s.ar)}</button>`).join('')}</div>
        <div class="row" style="margin-bottom:12px"><button class="btn sm" id="mq">❓ ${L('اختبر نفسك في هذا القسم', 'Quiz this set')}</button><button class="btn sm sec" id="madd">➕ ${L('أضف الكل للمراجعة المتباعدة', 'Add all to review')}</button><button class="btn sm ghost" id="mtalk" ${AI.ok() ? '' : 'disabled'}>🤖 ${L('ناقش هذا التخصص مع المدرس', 'Discuss with tutor')}</button></div>
        <div id="mx"></div>
        <div class="grid g2">${words.map(w => `<div class="card" style="margin:0"><div class="row between"><b class="en" style="font-size:17px">${esc(w.en)}</b>${say(w.en)}</div>${pa(w.en)}<div style="font-weight:600">${esc(w.ar)}</div><div class="en small muted">${esc(w.def)}</div><div class="en small" style="margin-top:6px;padding:6px 8px;background:var(--surface2);border-radius:8px">🏗️ ${esc(w.ex)} ${say(w.ex)}${exa(w)}</div></div>`).join('')}</div>`;
      $('#ms', v).oninput = e => { q = e.target.value; const pos = e.target.selectionStart; draw(); const i = $('#ms', v); i.focus(); i.setSelectionRange(pos, pos); };
      $$('[data-m]', v).forEach(b => b.onclick = () => { cur = b.dataset.m; q = ''; draw(); });
      $('#mq', v).onclick = () => { const box = $('#mx', v); runQuiz(box, wordQuiz(words, 8), { title: set.title, src: 'mep', onDone: p => { setSkill('professional', p); addXP(15); doneTask('mep'); } }); box.scrollIntoView(); };
      $('#madd', v).onclick = () => { words.forEach(w => { addToSRS(w); S.srs[w.en].seen = Math.max(1, S.srs[w.en].seen); }); save(); toast(L('أضيفت ', 'Added ') + words.length); };
      $('#mtalk', v).onclick = () => { const box = $('#mx', v); box.scrollIntoView(); chatUI(box, { title: set.title + ' talk', kind: 'mep', mode: 'correct', system: `You are a senior ${set.title} engineer chatting with a colleague. Ask him practical questions about ${set.title} work on site (installation, testing, problems) and encourage him to use these terms: ${set.words.slice(0, 12).map(w => w.en).join(', ')}.`, onEval: () => { doneTask('mep'); save(); } }); };
    };
    draw();
  };

  /* ---------- Site Communication Simulator ---------- */
  views.site = v => {
    v.innerHTML = `${aiNote()}<div class="card"><h2>🦺 Site Communication Simulator</h2><p class="muted small">${L('الذكاء الاصطناعي يلعب دوراً في المشروع ويتحدث معك بالإنجليزية، ثم يقيّمك ويصحح لك بالعربية.', 'The AI plays a project role in English, then corrects you in Arabic.')}</p>
      <div class="grid g2">${C.SITE_SCENARIOS.map(s => `<button class="tile" data-sc="${s.id}"><b>${esc(s.ar)}</b><div class="en small">${esc(s.title)}</div><div class="small muted">🎭 ${esc(s.ai)}</div></button>`).join('')}</div></div><div id="sx"></div>`;
    $$('[data-sc]', v).forEach(b => b.onclick = () => {
      const s = C.SITE_SCENARIOS.find(x => x.id === b.dataset.sc);
      const box = $('#sx', v);
      box.innerHTML = `<div class="card"><h3>${esc(s.ar)}</h3><p class="en small">${esc(s.brief)}</p><div class="grid g2"><label>${L('دور الذكاء الاصطناعي', 'AI role')}<select id="srole">${C.SITE_ROLES.map(r => `<option ${r === s.ai ? 'selected' : ''}>${r}</option>`).join('')}</select></label><label>${L('دورك', 'Your role')}<select id="smy">${C.SITE_ROLES.map(r => `<option ${r === (s.ai === 'Contractor' ? 'Client' : 'MEP Manager') ? 'selected' : ''}>${r}</option>`).join('')}</select></label></div>
        <label style="display:block;margin-top:8px">${L('نوع التدريب', 'Mode')}<select id="smode"><option value="fluency">${L('واقعي — التصحيح في النهاية', 'Realistic — feedback at end')}</option><option value="correct">${L('تصحيح فوري', 'Instant correction')}</option></select></label>
        <button class="btn" id="sgo" style="margin-top:10px" ${AI.ok() ? '' : 'disabled'}>▶️ ${L('ابدأ المحاكاة', 'Start simulation')}</button></div>`;
      box.scrollIntoView();
      $('#sgo', box).onclick = () => {
        const role = $('#srole', box).value, my = $('#smy', box).value;
        chatUI(box, { title: s.title + ' — ' + role, kind: 'site', mode: $('#smode', box).value, intro: esc(s.brief),
          system: `You are role-playing the ${role} on a real construction fit-out project in Riyadh (NHC-type office tower, MEP works). The learner plays the ${my}. Scenario: ${s.brief}
Be realistic: use real project vocabulary (RFI, WIR, MIR, NCR, shop drawings, lookahead, VO, critical path, T&C) naturally, push back where a real ${role} would, ask for dates, evidence and commitments. Start the conversation in role.`,
          onEval: () => { S.stats.siteSims++; doneTask('mep'); save(); } });
      };
    });
  };

  /* ---------- Professional Emails ---------- */
  views.emails = v => {
    v.innerHTML = `<div class="grid g2"><div><div class="card"><h2>📧 ${L('نماذج جاهزة', 'Templates')}</h2>${C.EMAILS.map(e => `<button class="opt" data-e="${e.id}"><b>${esc(e.ar)}</b> <span class="en small muted">— ${esc(e.title)}</span></button>`).join('')}</div></div>
      <div><div class="card" id="ev"><p class="muted">${L('اختر نموذجاً لعرضه', 'Pick a template')}</p></div></div></div>
      <div class="card"><h2>✍️ ${L('اكتب إيميلك وسأصححه', 'Write your own and get feedback')}</h2>
        <label>${L('نوع المراسلة', 'Type')}<select id="et">${C.EMAILS.map(e => `<option>${esc(e.title)}</option>`).join('')}<option>Other</option></select></label>
        <textarea id="ebody" class="en" style="margin-top:10px;min-height:160px" placeholder="Dear …,"></textarea>
        <button class="btn" id="echeck" style="margin-top:10px" ${AI.ok() ? '' : 'disabled'}>✔ ${L('صحّح وحسّن الصياغة', 'Correct & improve')}</button><div id="eout" style="margin-top:10px"></div></div>`;
    $$('[data-e]', v).forEach(b => b.onclick = () => {
      const e = C.EMAILS.find(x => x.id === b.dataset.e);
      $('#ev', v).innerHTML = `<div class="row between"><h3>${esc(e.ar)}</h3><div class="row"><button class="btn sm sec" id="ecp">📋 ${L('نسخ', 'Copy')}</button><button class="btn sm sec" id="esp">🔊</button><button class="btn sm" id="euse">${L('استخدمه كقالب', 'Use as draft')}</button></div></div><pre class="mail">${esc(e.body)}</pre>`;
      $('#ecp', v).onclick = () => navigator.clipboard.writeText(e.body).then(() => toast(L('تم النسخ', 'Copied')), () => toast('—'));
      $('#esp', v).onclick = () => TTS.speak(e.body);
      $('#euse', v).onclick = () => { $('#ebody', v).value = e.body; $('#et', v).value = e.title; $('#ebody', v).scrollIntoView(); };
      if (innerWidth < 860) $('#ev', v).scrollIntoView();
    });
    $('#echeck', v).onclick = async () => {
      const t = $('#ebody', v).value.trim(); if (t.length < 20) return toast(L('اكتب الإيميل أولاً', 'Write the email first'));
      const out = $('#eout', v); out.innerHTML = '<pre class="mail" id="eo">…</pre>';
      try {
        const r = await AI.text(`You are an expert in professional construction-industry correspondence and an English teacher for Arabic speakers (learner CEFR ${level()}). The learner wrote this "${$('#et', v).value}" email.
1) Give a score out of 10 for: Grammar, Clarity, Professional tone, Structure (one line).
2) "النسخة المحسّنة:" — the corrected, professional version, keeping his facts.
3) "الأخطاء:" — each as ✘ wrong → ✔ right — شرح قصير بالعربية (max 8).
4) "نصائح:" — 2-3 Arabic tips for this type of email.
Plain text, no markdown tables.

EMAIL:
${t}`, ({ text }) => { $('#eo', v).textContent = text; });
        $('#eo', v).textContent = r; S.stats.emails++; const m = r.match(/Professional tone\D*(\d+)/i); setSkill('writing', estimateWriting(r, t)); if (m) setSkill('professional', +m[1] * 10); addXP(25); save();
      } catch (e) { out.innerHTML = `<div class="badbox">${esc(AI.errText(e))}</div>`; }
    };
  };

  /* ---------- Interview Simulator ---------- */
  views.interview = v => {
    v.innerHTML = `${aiNote()}<div class="card"><h2>🤝 Interview Simulator</h2><p class="muted small">${L('مقابلة حقيقية بالإنجليزية: أسئلة شخصية وفنية، ثم تقييم لصحة اللغة والطلاقة والمصطلحات وقوة الإجابة والثقة.', 'Real interview in English, then a full evaluation.')}</p>
      <div class="grid g2"><label>${L('الوظيفة', 'Position')}<select id="ir">${C.INTERVIEW_ROLES.map(r => `<option>${r}</option>`).join('')}</select></label>
      <label>${L('نوع الشركة', 'Company type')}<select id="ic"><option>Main contractor (Saudi Arabia)</option><option>MEP subcontractor</option><option>Consultant / PMC</option><option>Developer / Client (e.g. housing company)</option><option>Company in Egypt</option></select></label>
      <label>${L('الصعوبة', 'Difficulty')}<select id="id"><option value="friendly">${L('ودية', 'Friendly')}</option><option value="standard" selected>${L('عادية', 'Standard')}</option><option value="tough">${L('صعبة', 'Tough panel')}</option></select></label>
      <label>${L('خبرتك (اختياري)', 'Your background (optional)')}<input type="text" id="ib" placeholder="13 years MEP, HVAC & fire fighting…"></label></div>
      <button class="btn" id="igo" style="margin-top:12px" ${AI.ok() ? '' : 'disabled'}>▶️ ${L('ابدأ المقابلة', 'Start interview')}</button></div>
      <div class="card"><h3>💡 ${L('عبارات مفيدة', 'Useful phrases')}</h3><table>${C.BUSINESS.find(b => b.id === 'b-interview').phrases.map(p => `<tr><td class="en">${esc(p[0])} ${say(p[0])}</td><td>${esc(p[1])}</td></tr>`).join('')}</table></div><div id="ix"></div>`;
    $('#igo', v).onclick = () => {
      const role = $('#ir', v).value, comp = $('#ic', v).value, diff = $('#id', v).value, bg = $('#ib', v).value;
      $('#ix', v).scrollIntoView();
      chatUI($('#ix', v), { title: 'Interview — ' + role, kind: 'interview', mode: 'fluency',
        system: `You are an experienced hiring manager interviewing a candidate for the position of ${role} at a ${comp}. Interview style: ${diff}. ${bg ? 'Candidate background: ' + bg + '.' : ''}
Run a realistic interview of about 8 questions, ONE question at a time: start with a greeting and "tell me about yourself", then mix behavioural questions (STAR), technical questions relevant to ${role} (HVAC, fire fighting, plumbing, coordination, T&C, codes like SBC/NFPA, managing subcontractors, delays and claims as relevant), and finish with "Do you have any questions for us?". React briefly to each answer like a real interviewer (follow-up if an answer is vague). Do not give feedback during the interview.`,
        onEval: () => { S.stats.interviews++; save(); } });
    };
  };

  /* ---------- Tests & Assessments ---------- */
  views.tests = v => {
    v.innerHTML = `<div class="card"><h2>🎯 ${L('اختبار تحديد المستوى', 'Placement test')}</h2><p>${L('30 سؤالاً متدرجاً من A1 إلى C2 (قواعد، مفردات، مواقف) + قطعة قراءة + كتابة قصيرة يقيّمها الذكاء الاصطناعي. يحدد مستواك وفق CEFR ويُعدّ تقريراً بنقاط القوة والضعف.', '30 graded questions + reading + short writing.')}</p>
        ${S.placement ? `<div class="okbox">${L('آخر نتيجة', 'Last result')}: <b>${S.placement.level}</b> (${S.placement.date})</div>` : ''}
        <button class="btn" id="pgo" style="margin-top:10px">${S.placement ? '🔁 ' + L('أعد الاختبار لمتابعة تطورك', 'Retake to track progress') : '▶️ ' + L('ابدأ الاختبار', 'Start')}</button></div>
      ${S.placement ? placementReport(S.placement) : ''}
      <div class="card"><h2>🏁 ${L('تقييمات المستويات', 'Level assessments')}</h2><div class="grid g3">${LV.map(l => `<button class="tile" data-lt="${l}"><b>${l}</b> ${S.certs[l] ? '🏅' : ''}<div class="small muted">${S.levelTests[l] != null ? S.levelTests[l] + '%' : L('لم يُختبر', 'Not taken')}</div></button>`).join('')}</div></div>
      <div class="card"><h2>📜 ${L('سجل الاختبارات', 'Test history')}</h2>${S.stats.tests.length ? `<table><tr><th>${L('التاريخ', 'Date')}</th><th>${L('الاختبار', 'Test')}</th><th>${L('النتيجة', 'Score')}</th></tr>${S.stats.tests.slice().reverse().slice(0, 20).map(t => `<tr><td>${t.d}</td><td class="en">${esc(t.name)}</td><td><b>${esc(t.score)}${typeof t.score === 'number' ? '%' : ''}</b></td></tr>`).join('')}</table>` : `<p class="muted">—</p>`}</div>`;
    $('#pgo', v).onclick = () => placementTest(v);
    $$('[data-lt]', v).forEach(b => b.onclick = () => levelTest(v, b.dataset.lt));
  };
  function placementTest(v) {
    const qs = C.PLACEMENT.map(p => ({ lvl: p[0], skill: p[4], type: 'mc', q: p[1], options: p[2], answer: p[3] }));
    const rq = C.PLACEMENT_READING.q.map(q => ({ lvl: 'B1', skill: 'reading', type: 'mc', q: q[0], options: q[1], answer: q[2] }));
    const res = []; let i = 0;
    const all = [...qs, ...rq];
    const draw = () => {
      if (i >= all.length) return writingStep();
      const q = all[i]; const isR = q.skill === 'reading';
      v.innerHTML = `<div class="card"><div class="row between small muted"><span>🎯 ${L('اختبار تحديد المستوى', 'Placement')}</span><span>${i + 1}/${all.length + 1}</span></div><div class="bar" style="margin:6px 0 14px"><i style="width:${i / (all.length + 1) * 100}%"></i></div>
        ${isR ? `<div class="info en" style="margin-bottom:10px;font-size:14.5px">${esc(C.PLACEMENT_READING.text)}</div>` : ''}
        <h3 class="en" style="font-size:18px">${esc(q.q)}</h3>${q.options.map((o, k) => `<button class="opt en" data-k="${k}">${esc(o)}</button>`).join('')}
        <div class="row" style="margin-top:10px"><button class="btn ghost sm" id="dk">${L('لا أعرف', "I don't know")}</button></div></div>`;
      $$('[data-k]', v).forEach(b => b.onclick = () => { res.push({ ...q, ok: +b.dataset.k === q.answer }); i++; draw(); });
      $('#dk', v).onclick = () => { res.push({ ...q, ok: false }); i++; draw(); };
    };
    const writingStep = () => {
      v.innerHTML = `<div class="card"><h3>${L('الجزء الأخير: الكتابة', 'Final part: writing')}</h3><p class="en">Write 4–6 sentences: introduce yourself, your job, and describe one problem you solved at work.</p>
        <textarea id="pw" class="en" placeholder="${L('اكتب بالإنجليزية… (يمكنك ترك هذا الجزء فارغاً)', 'Write in English…')}"></textarea>
        <p class="small muted">${AI.ok() ? L('سيقيّم الذكاء الاصطناعي كتابتك.', 'AI will grade it.') : L('الذكاء الاصطناعي غير متاح: سيُحسب المستوى من الأسئلة فقط.', 'AI unavailable: level from questions only.')}</p>
        <p class="small muted">🎙️ ${L('تقييم المحادثة والنطق يتم لاحقاً عبر المدرس الذكي عند توفر الميكروفون/الإملاء الصوتي.', 'Speaking is assessed later with the AI tutor.')}</p>
        <button class="btn" id="pf">${L('أنهِ واعرض التقرير', 'Finish & see report')}</button></div>`;
      $('#pf', v).onclick = async () => {
        const text = $('#pw', v).value.trim(); let w = null;
        if (text && AI.ok()) {
          v.innerHTML = `<div class="card"><p>⏳ ${L('جارٍ تقييم الكتابة…', 'Grading writing…')}</p></div>`;
          try { w = await AI.json(`Assess this short text by an Arabic-speaking English learner. Return ONLY JSON: {"cefr":"A1|A2|B1|B2|C1|C2","score":0-100,"feedback_ar":"جملتان بالعربية","mistakes":[{"wrong":"","right":"","explain_ar":""}]} (max 4 mistakes).\n\nTEXT:\n${text}`); } catch (e) { w = null; }
        }
        finishPlacement(v, res, w);
      };
    };
    draw();
  }
  function finishPlacement(v, res, w) {
    const acc = {}; LV.forEach(l => { const r = res.filter(x => x.lvl === l && x.skill !== 'reading'); acc[l] = r.length ? r.filter(x => x.ok).length / r.length : 0; });
    let placed = null; let slack = 1;
    for (const l of LV) { if (acc[l] >= 0.6) placed = l; else if (acc[l] >= 0.4 && slack-- > 0 && placed) continue; else break; }
    placed = placed || 'A1';
    if (w && w.cefr && LV.includes(w.cefr)) { const d = LI(w.cefr) - LI(placed); if (d >= 2) placed = LV[LI(placed) + 1]; if (d <= -2) placed = LV[LI(placed) - 1]; }
    const sk = {}; ['grammar', 'vocabulary', 'reading', 'speaking', 'writing'].forEach(s => { const r = res.filter(x => x.skill === s); if (r.length) sk[s] = Math.round(r.filter(x => x.ok).length / r.length * 100); });
    if (w && w.score != null) sk.writing = Math.round(((sk.writing || w.score) + w.score) / 2);
    const strengths = Object.entries(sk).filter(([, x]) => x >= 70).map(([k]) => k), weak = Object.entries(sk).filter(([, x]) => x < 55).map(([k]) => k);
    S.placement = { date: today(), level: placed, acc: Object.fromEntries(LV.map(l => [l, Math.round(acc[l] * 100)])), skills: sk, strengths, weak, writing: w };
    S.level = placed; levelTab = placed;
    Object.entries(sk).forEach(([k, x]) => { S.skills[k] = x; });
    if (w && w.mistakes) w.mistakes.forEach(m => addMistake({ src: 'placement', wrong: m.wrong, right: m.right, ar: m.explain_ar }));
    S.stats.tests.push({ d: today(), name: 'Placement test', score: placed });
    // reset today's new words so they match the new level
    delete dayRec().newWords;
    addXP(50); save(); renderChips();
    v.innerHTML = `<div class="card" style="text-align:center"><div style="font-size:44px">🎯</div><h2>${L('مستواك', 'Your level')}: ${placed} – ${C.LEVELS[LI(placed)].name}</h2><p>${C.LEVELS[LI(placed)].desc}</p><div class="row" style="justify-content:center"><button class="btn" data-go="plan">${L('اعرض خطتي الشخصية', 'See my plan')}</button></div></div>` + placementReport(S.placement);
  }
  const SKILL_AR = { grammar: 'القواعد', vocabulary: 'المفردات', reading: 'القراءة', speaking: 'المحادثة', writing: 'الكتابة', listening: 'الاستماع', pronunciation: 'النطق', professional: 'الإنجليزية المهنية' };
  function placementReport(p) {
    return `<div class="card"><h2>📋 ${L('تقرير تحديد المستوى', 'Placement report')}</h2>
      <h3>${L('الدقة في كل مستوى', 'Accuracy per level')}</h3><div class="grid g3">${LV.map(l => `<div><div class="row between small"><span>${l}</span><b>${p.acc[l]}%</b></div><div class="bar"><i style="width:${p.acc[l]}%"></i></div></div>`).join('')}</div>
      <h3 style="margin-top:12px">${L('المهارات', 'Skills')}</h3><div class="grid g3">${Object.entries(p.skills).map(([k, x]) => `<div><div class="row between small"><span>${SKILL_AR[k]}</span><b>${x}%</b></div><div class="bar"><i style="width:${x}%"></i></div></div>`).join('')}</div>
      <div class="grid g2" style="margin-top:12px"><div class="okbox"><b>${L('نقاط القوة', 'Strengths')}:</b> ${p.strengths.map(s => SKILL_AR[s]).join('، ') || '—'}</div><div class="badbox"><b>${L('نقاط الضعف', 'Weaknesses')}:</b> ${p.weak.map(s => SKILL_AR[s]).join('، ') || '—'}</div></div>
      ${p.writing ? `<div class="info" style="margin-top:10px"><b>${L('الكتابة', 'Writing')}: ${esc(p.writing.cefr)} (${esc(p.writing.score)}/100)</b> — ${esc(p.writing.feedback_ar)}</div>` : ''}</div>`;
  }

  /* ---------- Progress & reports ---------- */
  function totalMinutes() { return Object.values(S.days).reduce((a, d) => a + (d.min || 0), 0); }
  function skillMap() {
    const g = Object.values(S.grammarDone); const grammar = S.skills.grammar != null ? S.skills.grammar : (g.length ? Math.round(g.reduce((a, b) => a + b, 0) / g.length) : null);
    return { speaking: S.skills.speaking, pronunciation: S.skills.pronunciation, listening: S.skills.listening, reading: S.skills.reading, writing: S.skills.writing, grammar, vocabulary: S.skills.vocabulary, professional: S.skills.professional };
  }
  function weekData() {
    const days = [...Array(7)].map((_, i) => addDays(today(), i - 6));
    const recs = days.map(d => S.days[d] || { min: 0, xp: 0, tasks: {} });
    const plan = planTasks().length;
    return { days, mins: recs.reduce((a, r) => a + r.min, 0), xp: recs.reduce((a, r) => a + r.xp, 0), tasks: recs.reduce((a, r) => a + Object.keys(r.tasks).length, 0), possible: plan * 7, active: recs.filter(r => r.xp > 0).length,
      mistakes: S.mistakes.filter(m => dayDiff(m.d, today()) <= 7) };
  }
  views.progress = v => {
    const sk = skillMap(); const w = weekData();
    const learned = Object.values(S.srs).filter(x => x.box >= 2).length;
    const got = C.BADGES.filter(b => { try { return b.test(S); } catch (e) { return false; } }).map(b => b.id);
    const freq = {}; S.mistakes.forEach(m => { const k = (m.src || '') ; freq[k] = (freq[k] || 0) + 1; });
    v.innerHTML = `<div class="grid g4">
        <div class="stat"><div class="v">${S.level || '—'}</div><div class="l">${L('المستوى الحالي CEFR', 'Current CEFR')}</div></div>
        <div class="stat"><div class="v">${Math.round(w.tasks / Math.max(1, w.possible) * 100)}%</div><div class="l">${L('إكمال الخطة (7 أيام)', 'Plan completion (7d)')}</div></div>
        <div class="stat"><div class="v">${learned}<span class="small muted"> / ${Object.keys(S.srs).length}</span></div><div class="l">${L('كلمات مكتسبة / قيد التعلم', 'Words learned / learning')}</div></div>
        <div class="stat"><div class="v">${(totalMinutes() / 60).toFixed(1)}</div><div class="l">${L('ساعات التدريب', 'Practice hours')}</div></div></div>
      <div class="grid g2" style="margin-top:16px">
        <div class="card"><h2>🧭 ${L('مستوى المهارات', 'Skill levels')}</h2>${Object.entries(sk).map(([k, x]) => `<div style="margin:8px 0"><div class="row between small"><span>${SKILL_AR[k]}</span><b>${x == null ? '<span class="muted">' + L('لم يُقيّم بعد', 'not assessed') + '</span>' : x + '%'}</b></div><div class="bar"><i style="width:${x || 0}%"></i></div></div>`).join('')}
          <p class="small muted">${L('المحادثة والمهنية تُقاس من تقييمات المدرس والمحاكيات. النطق من تمارين التمييز والـ Shadowing.', 'Speaking/professional come from AI evaluations.')}</p></div>
        <div class="card"><h2>📊 ${L('هذا الأسبوع', 'This week')}</h2>
          <table><tr><td>${L('أيام نشطة', 'Active days')}</td><td><b>${w.active}/7</b></td></tr><tr><td>${L('دقائق', 'Minutes')}</td><td><b>${w.mins}</b></td></tr><tr><td>XP</td><td><b>${w.xp}</b></td></tr><tr><td>${L('مهام منجزة', 'Tasks done')}</td><td><b>${w.tasks}</b></td></tr><tr><td>${L('محادثات / محاكاة / مقابلات', 'Talks / sims / interviews')}</td><td><b>${S.stats.conversations} / ${S.stats.siteSims} / ${S.stats.interviews}</b></td></tr><tr><td>${L('إيميلات مصححة', 'Emails reviewed')}</td><td><b>${S.stats.emails}</b></td></tr></table>
          <button class="btn" id="rep" style="margin-top:12px">📝 ${L('أصدر التقرير الأسبوعي', 'Generate weekly report')}</button></div></div>
      <div id="repBox"></div>
      <div class="card"><h2>🔁 ${L('الأخطاء المتكررة', 'Recurring mistakes')}</h2>${S.mistakes.length ? `<div class="row" style="margin-bottom:8px">${Object.entries(freq).sort((a, b) => b[1] - a[1]).map(([k, n]) => `<span class="pill warn">${esc(k)}: ${n}</span>`).join(' ')}</div><table>${S.mistakes.slice(0, 12).map(m => `<tr><td class="en" style="color:var(--bad)">${esc(m.wrong)}</td><td class="en" style="color:var(--ok)">${esc(m.right)}</td><td class="small muted">${esc(m.ar)}</td></tr>`).join('')}</table>` : '<p class="muted">—</p>'}</div>
      <div class="card"><h2>🏅 ${L('الأوسمة', 'Badges')}</h2><div class="grid g4">${C.BADGES.map(b => `<div class="badge ${got.includes(b.id) ? '' : 'locked'}"><div class="i">${b.icon}</div><b>${L(b.ar, b.name)}</b></div>`).join('')}</div></div>
      <div class="card"><h2>🎓 ${L('شهادات إتمام المستويات', 'Level certificates')}</h2>${Object.keys(S.certs).length ? Object.keys(S.certs).map(l => certHTML(l)).join('<br>') : `<p class="muted">${L('اجتز التقييم النهائي لأي مستوى (70%+) لتحصل على شهادة.', 'Pass a level assessment to earn one.')}</p>`}</div>
      ${S.reports.length ? `<div class="card"><h2>🗂️ ${L('تقارير سابقة', 'Past reports')}</h2>${S.reports.slice(0, 6).map(r => `<details><summary>${r.d}</summary><div style="white-space:pre-wrap" class="small">${esc(r.text)}</div></details>`).join('')}</div>` : ''}`;
    $('#rep', v).onclick = () => weeklyReport($('#repBox', v));
  };
  async function weeklyReport(box) {
    const w = weekData(); const sk = skillMap();
    const grammarWeek = C.GRAMMAR.filter(g => S.grammarDone[g.id] != null).map(g => g.title + ' ' + S.grammarDone[g.id] + '%');
    const base = `📅 ${L('التقرير الأسبوعي', 'Weekly report')} — ${w.days[0]} → ${w.days[6]}
${L('ما تم تعلمه', 'What you learned')}: ${w.tasks} ${L('مهمة', 'tasks')}، ${w.mins} ${L('دقيقة', 'min')}، ${Object.keys(S.srs).length} ${L('كلمة في المراجعة', 'words in review')}.
${L('دروس القواعد', 'Grammar')}: ${grammarWeek.slice(-5).join('، ') || '—'}
${L('الأخطاء المتكررة هذا الأسبوع', 'Recurring mistakes')}: ${w.mistakes.length}
${L('المهارات', 'Skills')}: ${Object.entries(sk).filter(([, x]) => x != null).map(([k, x]) => SKILL_AR[k] + ' ' + x + '%').join('، ')}
${L('نقاط الضعف', 'Weak points')}: ${weakSkills().join('، ') || '—'}`;
    box.innerHTML = `<div class="card"><h2>📝 ${L('التقرير الأسبوعي', 'Weekly report')}</h2><div id="rt" style="white-space:pre-wrap">${esc(base)}</div></div>`;
    let text = base;
    if (AI.ok()) {
      const rt = $('#rt', box); rt.textContent = base + '\n\n⏳ ' + L('يكتب المدرس التوصيات…', 'Tutor is writing recommendations…');
      try {
        const r = await AI.text(`You are the personal English tutor of an Arabic-speaking learner (CEFR ${level()}, goal: ${S.goal}). Write his weekly report IN ARABIC (English examples allowed), with these headings: "ما تعلمته"، "الأخطاء المتكررة" (group them into patterns with the correct form)، "التحسن في كل مهارة"، "نقاط الضعف"، "توصيات الأسبوع القادم" (5 concrete actions inside this platform). Be specific, honest and encouraging, max 300 words. Plain text.
DATA: ${JSON.stringify({ week: { minutes: w.mins, activeDays: w.active, tasks: w.tasks, xp: w.xp }, skills: sk, grammar: grammarWeek, stats: S.stats, mistakes: w.mistakes.slice(0, 25).map(m => ({ src: m.src, wrong: m.wrong, right: m.right })) })}`, ({ text: t }) => { rt.textContent = base + '\n\n' + t; });
        text = base + '\n\n' + r; rt.textContent = text;
      } catch (e) { rt.textContent = base + '\n\n' + AI.errText(e); }
    } else {
      text = base + '\n\n' + L('توصيات: ', 'Recommendations: ') + (weakSkills().length ? L('ركّز هذا الأسبوع على ', 'Focus on ') + weakSkills().join('، ') + '. ' : '') + L('أكمل خطة اليوم يومياً، وراجع أخطائك من الصفحة الرئيسية.', 'Complete the daily plan and review mistakes.');
      $('#rt', box).textContent = text;
    }
    S.reports.unshift({ d: today(), text }); if (S.reports.length > 12) S.reports.length = 12; save();
  }

  /* ---------- Settings ---------- */
  /* ------------------------------------------------------------
     Install on phone: app icon + home-screen launcher
     ------------------------------------------------------------ */
  const APP_URL = 'https://sitespeak-app.netlify.app';            // installable SiteSpeak launcher (PWA) — opens this platform full-screen
  const ARTIFACT_URL = 'https://claude.ai/artifact/BSM3KaJPE1wAhaBYk8zjeg';
  const ICON_SVG = (size) => `<svg viewBox="0 0 512 512" width="${size}" height="${size}" aria-hidden="true"><defs><linearGradient id="ssg${size}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#14b8a6"/><stop offset=".55" stop-color="#0f766e"/><stop offset="1" stop-color="#134e4a"/></linearGradient></defs><rect width="512" height="512" rx="112" fill="url(#ssg${size})"/><g transform="translate(0 -14)"><path d="M150 112h212a52 52 0 0 1 52 52v150a52 52 0 0 1-52 52H236l-78 64a8 8 0 0 1-13-6v-58a52 52 0 0 1-47-52V164a52 52 0 0 1 52-52z" fill="#fff"/><path d="M168 300c0-60 39-104 88-104s88 44 88 104z" fill="#f59e0b"/><path d="M242 198h28v102h-28z" fill="#d97706"/><rect x="142" y="292" width="228" height="30" rx="15" fill="#d97706"/><rect x="142" y="292" width="228" height="15" rx="7.5" fill="#f59e0b"/></g></svg>`;
  const devKind = () => { const u = navigator.userAgent || ''; return /iPhone|iPad|iPod/i.test(u) || (/Macintosh/.test(u) && navigator.maxTouchPoints > 1) ? 'ios' : /Android/i.test(u) ? 'android' : 'desktop'; };
  function copyLink(url, btn) {
    const done = () => { toast('📋 ' + L('تم نسخ الرابط', 'Link copied')); if (btn) btn.textContent = '✅ ' + L('تم النسخ', 'Copied'); };
    try { navigator.clipboard.writeText(url).then(done, () => modal(L('انسخ الرابط', 'Copy the link'), `<input type="text" value="${esc(url)}" readonly onclick="this.select()" dir="ltr" style="width:100%">`)); }
    catch (e) { modal(L('انسخ الرابط', 'Copy the link'), `<input type="text" value="${esc(url)}" readonly onclick="this.select()" dir="ltr" style="width:100%">`); }
  }
  views.install = v => {
    const k = devKind(); const url = APP_URL || ARTIFACT_URL;
    const steps = {
      ios: [['1', L('افتح الرابط في <b>Safari</b> على الآيفون', 'Open the link in <b>Safari</b> on your iPhone')], ['2', L('اضغط زر المشاركة <b>⬆️</b> أسفل الشاشة', 'Tap the Share button <b>⬆️</b>')], ['3', L('اختر <b>«إضافة إلى الشاشة الرئيسية»</b>', 'Choose <b>"Add to Home Screen"</b>')], ['4', L('اضغط <b>إضافة</b> — ستظهر أيقونة SiteSpeak بجانب تطبيقاتك', 'Tap <b>Add</b> — the SiteSpeak icon appears with your apps')]],
      android: [['1', L('افتح الرابط في <b>Chrome</b>', 'Open the link in <b>Chrome</b>')], ['2', L('اضغط زر <b>«تثبيت التطبيق»</b> الذي يظهر في الصفحة، أو قائمة <b>⋮</b>', 'Tap <b>"Install app"</b> on the page, or the <b>⋮</b> menu')], ['3', L('اختر <b>«تثبيت التطبيق»</b> أو <b>«إضافة إلى الشاشة الرئيسية»</b>', 'Choose <b>"Install app"</b> or <b>"Add to Home screen"</b>')], ['4', L('افتح SiteSpeak من أيقونته — يفتح بملء الشاشة', 'Open SiteSpeak from its icon — full screen')]],
      desktop: [['1', L('افتح الرابط في Chrome أو Edge', 'Open the link in Chrome or Edge')], ['2', L('اضغط أيقونة التثبيت <b>⊕</b> في شريط العنوان', 'Click the install icon <b>⊕</b> in the address bar')], ['3', L('يظهر SiteSpeak كتطبيق مستقل في قائمة البرامج', 'SiteSpeak appears as its own app')]]
    };
    const tab = (id, label) => `<button class="tab ${id === k ? 'on' : ''}" data-dev="${id}">${label}</button>`;
    const stepList = id => `<ol class="install-steps">${steps[id].map(s => `<li><span class="n">${s[0]}</span><span>${s[1]}</span></li>`).join('')}</ol>`;
    v.innerHTML = `
      <div class="card install-hero">
        <div class="install-icon">${ICON_SVG(112)}</div>
        <div><h2 style="margin:0">SiteSpeak</h2><div class="muted">${L('منصة الإنجليزية للمهندسين — على شاشتك الرئيسية', 'English for engineers — on your home screen')}</div>
          <div class="row" style="margin-top:12px"><a class="btn" href="${esc(url)}" target="_blank" rel="noopener">📲 ${APP_URL ? L('افتح صفحة التثبيت', 'Open install page') : L('افتح المنصة', 'Open the platform')}</a><button class="btn sec" id="cpLink">📋 ${L('انسخ الرابط', 'Copy link')}</button></div>
          <div class="small muted en" dir="ltr" style="margin-top:6px">${esc(url)}</div></div>
      </div>
      ${APP_URL ? '' : `<div class="note">${L('ملاحظة: الأيقونة على الشاشة الرئيسية ستظهر باسم وشعار SiteSpeak بعد تفعيل صفحة التثبيت. حتى ذلك الحين، الإضافة من الرابط الحالي تعطي اختصاراً يفتح المنصة مباشرة.', 'Until the install page is live, adding the current link creates a shortcut that opens the platform directly.')}</div>`}
      <div class="card"><h2>🧭 ${L('خطوات التثبيت', 'How to install')}</h2>
        <div class="tabs">${tab('ios', '📱 iPhone')}${tab('android', '🤖 Android')}${tab('desktop', '💻 ' + L('لابتوب', 'Laptop'))}</div>
        <div id="devSteps">${stepList(k)}</div></div>
      <div class="card"><h2>💡 ${L('معلومات مهمة', 'Good to know')}</h2><ul class="small" style="margin:0;padding-inline-start:18px;line-height:1.9">
        <li>${L('تقدمك محفوظ في حسابك على Claude ويتزامن بين الموبايل واللابتوب — نفس النقاط والكلمات والمستوى.', 'Your progress lives in your Claude account and syncs between phone and laptop.')}</li>
        <li>${L('أول مرة قد يُطلب منك تسجيل الدخول إلى Claude داخل التطبيق — مرة واحدة فقط.', 'The first time you may be asked to sign in to Claude — once only.')}</li>
        <li>${L('لميزات الصوت (النطق والإملاء) اسمح للمتصفح باستخدام الميكروفون عند الطلب.', 'For speaking practice, allow microphone access when asked.')}</li>
        <li>${L('يمكنك أيضاً تثبيت تطبيق Claude من المتجر وفتح الرابط من داخله.', 'You can also install the Claude app and open the link from there.')}</li></ul></div>`;
    $('#cpLink', v).onclick = e => copyLink(url, e.currentTarget);
    $$('[data-dev]', v).forEach(b => b.onclick = () => { $$('[data-dev]', v).forEach(x => x.classList.toggle('on', x === b)); $('#devSteps', v).innerHTML = stepList(b.dataset.dev); });
  };

  views.settings = v => {
    v.innerHTML = `<div class="card"><h2>👤 ${L('الملف الشخصي', 'Profile')}</h2><div class="grid g2">
        <label>${L('الاسم (يظهر في الشهادات)', 'Name (for certificates)')}<input type="text" id="sn" value="${esc(S.name)}"></label>
        <label>${L('هدفك الأساسي', 'Main goal')}<select id="sg"><option value="professional" ${S.goal === 'professional' ? 'selected' : ''}>${L('العمل والهندسة MEP', 'Work & MEP engineering')}</option><option value="interviews" ${S.goal === 'interviews' ? 'selected' : ''}>${L('المقابلات والبحث عن عمل', 'Interviews & job search')}</option><option value="daily" ${S.goal === 'daily' ? 'selected' : ''}>${L('الحياة اليومية والسفر', 'Daily life & travel')}</option></select></label>
        <label>${L('المستوى (يدوياً)', 'Level (manual)')}<select id="sl">${LV.map(l => `<option ${l === S.level ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
        <label>${L('كلمات جديدة يومياً', 'New words per day')}<select id="sw">${[5, 10, 15, 20].map(n => `<option ${n === S.newPerDay ? 'selected' : ''}>${n}</option>`).join('')}</select></label></div></div>
      <div class="card"><h2>🎨 ${L('الواجهة والصوت', 'Interface & audio')}</h2><div class="grid g2">
        <label>${L('لغة الواجهة', 'Interface language')}<select id="su"><option value="ar" ${S.ui === 'ar' ? 'selected' : ''}>العربية (RTL)</option><option value="en" ${S.ui === 'en' ? 'selected' : ''}>English (LTR)</option></select></label>
        <label>${L('المظهر', 'Theme')}<select id="st"><option value="light" ${S.theme === 'light' ? 'selected' : ''}>${L('فاتح', 'Light')}</option><option value="dark" ${S.theme === 'dark' ? 'selected' : ''}>${L('داكن', 'Dark')}</option></select></label>
        <label>${L('اللهجة', 'Accent')}<select id="sv">${['en-US', 'en-GB', 'en-AU', 'en-IN'].map(a => `<option ${a === S.voice ? 'selected' : ''}>${a}</option>`).join('')}</select></label>
        <label>${L('النطق بالحروف العربية', 'Arabic-script pronunciation')}<select id="spa"><option value="1" ${S.showPA !== false ? 'selected' : ''}>${L('إظهار', 'Show')}</option><option value="0" ${S.showPA === false ? 'selected' : ''}>${L('إخفاء', 'Hide')}</option></select></label>
        <label>${L('سرعة النطق', 'Speech rate')}<select id="sr">${[0.7, 0.85, 0.95, 1, 1.15].map(r => `<option ${r === S.rate ? 'selected' : ''}>${r}</option>`).join('')}</select></label></div>
        <div class="row" style="margin-top:10px"><button class="btn sec sm" id="stest">🔊 ${L('جرّب الصوت', 'Test voice')}</button><span class="small muted">${TTS.ok ? TTS.voices.length + ' ' + L('صوت إنجليزي متاح على جهازك', 'English voices on this device') : L('النطق غير مدعوم', 'TTS unsupported')}</span></div></div>
      <div class="card"><h2>☁️ ${L('الحفظ والخدمات', 'Saving & services')}</h2>
        <table><tr><td>${L('حفظ التقدم في السحابة (خاص بك)', 'Cloud progress (private)')}</td><td>${{ on: '✅ ' + L('مفعّل', 'On'), off: '⚠️ ' + L('غير متاح — الحفظ على هذا الجهاز فقط', 'Unavailable — this device only'), connecting: '⏳', slow: '⚠️ ' + L('بطيء — سيُعاد المحاولة', 'Slow') }[Store.cloud]}</td></tr>
        <tr><td>${L('المزامنة بين الموبايل واللابتوب', 'Sync between phone & laptop')}</td><td>${Store.ref ? '✅ ' + L('مباشرة — التقدم يظهر على الجهاز الآخر خلال ثوانٍ', 'Live') : '⚠️ ' + L('تعمل عند فتح المنصة من رابطها على Claude بنفس الحساب', 'Works via the Claude link with the same account')}</td></tr>
        <tr><td>${L('ملخص التقدم اليومي لـ Claude', 'Daily progress summary for Claude')}</td><td>${Store.sumRef ? '✅ ' + L('يُحدّث تلقائياً — اسأل Claude في أي محادثة عن تقدمك', 'Auto-updated — ask Claude about your progress') : '⚠️ ' + L('يعمل عند فتح المنصة من رابطها على Claude', 'Works when opened from the Claude link')}</td></tr>
        <tr><td>${L('الذكاء الاصطناعي (Claude)', 'AI (Claude)')}</td><td>${AI.ok() ? '✅' : '⚠️ ' + L('غير متاح هنا', 'Unavailable here')}</td></tr>
        <tr><td>${L('تحويل النص لصوت', 'Text-to-speech')}</td><td>${TTS.ok ? '✅ ' + L('من المتصفح', 'Browser') : '❌'}</td></tr>
        <tr><td>${L('تحويل الصوت لنص', 'Speech-to-text')}</td><td>${NATIVE ? '✅ ' + L('ميكروفون تطبيق SiteSpeak', 'SiteSpeak app microphone') : STT.Rec && !STT.blocked ? '🟡 ' + L('قد يعمل حسب أذونات المتصفح', 'May work, depends on permissions') : '⚠️ ' + L('استخدم الإملاء الصوتي في لوحة المفاتيح', 'Use keyboard dictation')}</td></tr></table>
        <div class="row" style="margin-top:12px"><button class="btn sec sm" id="sexp">📋 ${L('انسخ نسخة احتياطية', 'Copy backup')}</button><button class="btn sec sm" id="simp">📥 ${L('استرجع من نسخة', 'Restore backup')}</button><button class="btn danger sm" id="sreset">🗑️ ${L('ابدأ من جديد', 'Reset all')}</button></div></div>`;
    const bind = (id, k, f = x => x, re) => { $(id, v).onchange = e => { S[k] = f(e.target.value); save(); if (re) { renderShell(); route(); } else renderChips(); }; };
    $('#sn', v).oninput = e => { S.name = e.target.value; save(); };
    bind('#sg', 'goal', x => { delete dayRec().newWords; return x; }); bind('#sl', 'level', x => { delete dayRec().newWords; return x; }); bind('#sw', 'newPerDay', x => { delete dayRec().newWords; return +x; });
    bind('#su', 'ui', x => x, true); bind('#st', 'theme', x => x, true); bind('#sv', 'voice'); bind('#spa', 'showPA', x => x === '1'); bind('#sr', 'rate', x => +x);
    $('#stest', v).onclick = () => TTS.speak('Hello Mohamed, the chilled water pump has been tested and commissioned.');
    $('#sexp', v).onclick = () => navigator.clipboard.writeText(JSON.stringify(S)).then(() => toast(L('تم نسخ النسخة الاحتياطية — احفظها في ملاحظاتك', 'Backup copied')), () => modal('Backup', `<textarea class="en" style="min-height:200px">${esc(JSON.stringify(S))}</textarea>`));
    $('#simp', v).onclick = () => modal(L('استرجاع', 'Restore'), `<textarea id="impTxt" class="en" style="min-height:160px" placeholder="{...}"></textarea>`, [[L('إلغاء', 'Cancel'), null, 'sec'], [L('استرجع', 'Restore'), () => { try { const d = JSON.parse($('#impTxt').value); S = Object.assign(DEFAULT(), d); save(); renderShell(); route(); toast('✅'); } catch (e) { toast(L('النص غير صالح', 'Invalid data')); } }]]);
    $('#sreset', v).onclick = () => modal(L('تأكيد', 'Confirm'), L('سيُحذف كل تقدمك نهائياً. هل أنت متأكد؟', 'All progress will be deleted. Sure?'), [[L('إلغاء', 'Cancel'), null, 'sec'], [L('احذف', 'Delete'), () => { const ui = S.ui, th = S.theme; S = DEFAULT(); S.ui = ui; S.theme = th; save(); renderShell(); go('home'); }, 'danger']]);
  };

  /* ============================================================
     🚀 FAST TRACK 90 — one guided daily sprint that chains the
     fastest-learning techniques in order:
     retrieval → power chunks → grammar pattern → shadowing →
     Arabic→English production → speaking with AI upgrade.
     ============================================================ */
  const F = window.FAST || { CHUNKS: [], TOPICS: [], PHASES: [] };
  function fs() {
    S.fast = S.fast || {};
    const f = S.fast;
    f.sprints = f.sprints || {}; f.chunks = f.chunks || {}; f.my = f.my || []; f.size = f.size || 'std';
    return f;
  }
  const SIZES = {
    short: { min: 15, ar: 'سريعة', en: 'Quick', newC: 3, words: 2, warm: 4, shadow: 3, tr: 3, talk: 2 },
    std: { min: 30, ar: 'قياسية', en: 'Standard', newC: 5, words: 3, warm: 6, shadow: 4, tr: 4, talk: 3 },
    long: { min: 45, ar: 'مكثفة', en: 'Intensive', newC: 7, words: 4, warm: 8, shadow: 5, tr: 5, talk: 3 }
  };
  const allChunks = () => [...fs().my, ...F.CHUNKS];
  const chunkById = id => allChunks().find(c => c.id === id);
  const sprintDates = () => Object.keys(fs().sprints).sort();
  const sprintCount = () => sprintDates().length;
  const fastDay = () => Math.min(90, sprintCount() + (fs().sprints[today()] ? 0 : 1));
  const phaseOf = d => F.PHASES.find(p => d >= p.from && d <= p.to) || F.PHASES[F.PHASES.length - 1];
  const chunksLearned = () => Object.values(fs().chunks).filter(x => x.box >= 2).length;
  function dueChunks() {
    const t = today();
    return Object.entries(fs().chunks).filter(([, x]) => x.seen > 0 && x.due <= t).sort((a, b) => a[1].box - b[1].box).map(([id]) => chunkById(id)).filter(Boolean);
  }
  function todaysChunks(n) {
    const r = dayRec();
    if (!r.fastNew || r.fastNew.length < n) {
      const f = fs(); const lv = LI(level());
      const unseen = c => !(f.chunks[c.id] && f.chunks[c.id].seen);
      const mine = f.my.filter(unseen);
      const same = F.CHUNKS.filter(c => unseen(c) && LI(c.lv) === lv);
      const lower = F.CHUNKS.filter(c => unseen(c) && LI(c.lv) < lv);
      const upper = F.CHUNKS.filter(c => unseen(c) && LI(c.lv) === lv + 1);
      const pool = [...mine, ...same, ...lower, ...upper];
      const keep = (r.fastNew || []).filter(id => chunkById(id));
      pool.forEach(c => { if (keep.length < n && !keep.includes(c.id)) keep.push(c.id); });
      r.fastNew = keep; save();
    }
    return r.fastNew.slice(0, n).map(chunkById).filter(Boolean);
  }
  function gradeChunk(c, g) {
    const f = fs(); const s = f.chunks[c.id] = f.chunks[c.id] || { box: 0, due: today(), seen: 0, wrong: 0 };
    s.seen++;
    if (g === 0) { s.box = 0; s.wrong++; }
    else if (g === 1) { s.box = Math.max(1, s.box); }
    else s.box = Math.min(7, s.box + (g === 3 ? 2 : 1));
    s.due = addDays(today(), g === 0 ? 1 : INTERVALS[Math.max(1, s.box)]);
  }
  const fastTopic = () => {
    const lv = LI(level());
    const pool = F.TOPICS.filter(t => LI(t.lv) <= lv + 1 && LI(t.lv) >= lv - 1);
    const list = pool.length ? pool : F.TOPICS;
    return list[sprintCount() % list.length];
  };
  const micHint = () => `<p class="small muted">🎙️ ${L('للتحدث: اضغط زر الميكروفون، أو استخدم ميكروفون لوحة المفاتيح في الموبايل واختر الإنجليزية.', 'To speak: tap the mic, or use your phone keyboard dictation in English.')}</p>`;

  /* ---------------- Hub ---------------- */
  views.fast = v => {
    const f = fs(); const day = fastDay(); const ph = phaseOf(day); const doneToday = !!f.sprints[today()];
    const sz = SIZES[f.size] || SIZES.std;
    const dates = sprintDates(); const scores = dates.map(d => f.sprints[d].score || 0);
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
    const week = [...Array(7)].map((_, i) => addDays(today(), i - 6)).filter(d => f.sprints[d]).length;
    const due = dueChunks().length;
    v.innerHTML = `
      <div class="card fast-hero">
        <div class="row between"><div><div class="small" style="opacity:.85">🚀 Fast Track 90 · ${L('المرحلة', 'Phase')} ${F.PHASES.indexOf(ph) + 1}: ${L(ph.ar, ph.en)}</div>
          <h2 style="font-size:26px;margin:4px 0">${L('اليوم', 'Day')} ${day} <span style="opacity:.7;font-size:16px">/ 90</span></h2>
          <div class="small" style="opacity:.9">🎯 ${L(ph.goal_ar, ph.goal_en)}</div></div>
          <div class="fast-ring" style="--p:${Math.round(sprintCount() / 90 * 100)}"><b>${Math.round(sprintCount() / 90 * 100)}%</b></div></div>
        <div class="bar" style="margin:14px 0;background:rgba(255,255,255,.25)"><i style="width:${sprintCount() / 90 * 100}%;background:#fff"></i></div>
        ${!S.level ? `<div class="fast-level"><b>${L('حدد مستواك أولاً لتبدأ من المكان الصحيح:', 'Pick your level first:')}</b><div class="row" style="margin-top:8px">${['A1', 'A2', 'B1', 'B2'].map(l => `<button class="btn sm sec" data-lvl="${l}">${l} · ${C.LEVELS[LI(l)].ar}</button>`).join('')}<button class="btn sm" data-go="tests">🎯 ${L('اختبار تحديد المستوى', 'Placement test')}</button></div></div>` : ''}
        <div class="row" style="margin-top:10px">
          <button class="btn fast-go" id="fGo">${doneToday ? '🔁 ' + L('جلسة إضافية', 'Extra sprint') : '▶️ ' + L('ابدأ جلسة اليوم', "Start today's sprint")} · ${sz.min} ${L('دقيقة', 'min')}</button>
          <select id="fSize" style="width:auto">${Object.entries(SIZES).map(([k, x]) => `<option value="${k}" ${k === f.size ? 'selected' : ''}>${L(x.ar, x.en)} — ${x.min} ${L('د', 'min')}</option>`).join('')}</select>
        </div>
        ${doneToday ? `<div class="small" style="margin-top:8px">✅ ${L('أنهيت جلسة اليوم بنتيجة', "Today's sprint done:")} ${f.sprints[today()].score}% — ${L('تعال بكرة لتحافظ على السلسلة 🔥', 'come back tomorrow 🔥')}</div>` : ''}
      </div>
      <div class="grid g4" style="margin-bottom:16px">
        <div class="stat"><div class="v">${sprintCount()}</div><div class="l">${L('جلسات مكتملة', 'Sprints done')}</div></div>
        <div class="stat"><div class="v">${chunksLearned()}</div><div class="l">${L('جمل جاهزة تتقنها', 'Chunks mastered')}</div></div>
        <div class="stat"><div class="v">${avg == null ? '—' : avg + '%'}</div><div class="l">${L('متوسط الدقة', 'Avg accuracy')}</div></div>
        <div class="stat"><div class="v">${week}/7</div><div class="l">${L('هذا الأسبوع', 'This week')}</div></div>
      </div>
      <div class="grid g2">
        <div class="card"><h3>⚡ ${L('ماذا يحدث في الجلسة؟', 'Inside a sprint')}</h3>
          <ol class="fast-steps">
            <li><b>🔁 ${L('استرجاع', 'Recall')}</b> — ${L('تتذكر جمل الأيام السابقة قبل أن تُنسى (مراجعة متباعدة)', 'recall earlier chunks before you forget')} <span class="pill">${due}</span></li>
            <li><b>🧩 ${L('جمل جاهزة', 'Power chunks')}</b> — ${L('جمل كاملة تستخدمها في الشغل مباشرة + قالب تبدّل فيه الكلمات', 'whole work sentences + a reusable frame')}</li>
            <li><b>✍️ ${L('قاعدة واحدة', 'One pattern')}</b> — ${L('شرح قصير وتمارين فورية', 'short explanation + drills')}</li>
            <li><b>🎧 Shadowing</b> — ${L('اسمع وكرر بنفس الإيقاع', 'listen and repeat with the same rhythm')}</li>
            <li><b>🔄 ${L('فكّر بالإنجليزي', 'Think in English')}</b> — ${L('تحوّل جمل عربية لإنجليزي بنفسك', 'produce English from Arabic')}</li>
            <li><b>🗣️ ${L('تكلّم', 'Speak')}</b> — ${L('تجاوب على أسئلة عن شغلك ويرجّع لك المدرس نسخة أفضل من كلامك', 'answer and get a better version of your own words')}</li>
          </ol>
          <p class="small muted">${L('السر في السرعة: التكرار اليومي القصير + الاسترجاع بدل القراءة + كلامك أنت يتحول لمادة مذاكرة.', 'Speed comes from short daily reps, active recall and studying your own words.')}</p></div>
        <div class="card"><h3>🗺️ ${L('خريطة الـ 90 يوم', '90-day roadmap')}</h3>
          ${F.PHASES.map((p, i) => `<div class="fast-phase ${p === ph ? 'on' : ''}"><b>${i + 1}. ${L(p.ar, p.en)}</b> <span class="small muted">${L('يوم', 'Days')} ${p.from}–${p.to}</span><div class="small">${L(p.goal_ar, p.goal_en)}</div></div>`).join('')}
          <div class="fast-dots">${[...Array(90)].map((_, i) => `<i class="${i < sprintCount() ? 'ok' : i === sprintCount() && !doneToday ? 'now' : ''}" title="${i + 1}"></i>`).join('')}</div>
          <p class="small muted">${L('كل 7 جلسات: اختبار نقطة تفتيش لقياس تقدمك.', 'Every 7 sprints: a checkpoint test.')}</p></div>
      </div>
      <div class="card"><div class="row between"><h3>📌 ${L('جملي من الشغل', 'My work sentences')}</h3><span class="pill">${f.my.length}</span></div>
        <p class="small muted">${L('اكتب بالعربي أي جملة تحتاج تقولها في شغلك (اجتماع، موقع، إيميل). المدرس يحولها لإنجليزي طبيعي، وتدخل جلساتك القادمة أولاً — هكذا تتعلم بالضبط ما تحتاجه.', 'Write any sentence you need at work in Arabic; the tutor turns it into natural English and it enters your next sprints first.')}</p>
        <textarea id="fMyIn" placeholder="${L('مثال: محتاج أعرف متى هيوصل الدكت للموقع؟ | المقاول ما التزمش بالبرنامج الزمني', 'e.g. I need to know when the duct will arrive')}"></textarea>
        <div class="row" style="margin-top:8px"><button class="btn sm" id="fMyAdd" ${AI.ok() ? '' : 'disabled'}>✨ ${L('حوّلها لإنجليزي وأضفها', 'Convert & add')}</button>${AI.ok() ? '' : `<span class="small muted">${L('تحتاج الذكاء الاصطناعي — افتح المنصة من رابطها على Claude', 'Needs AI — open via the Claude link')}</span>`}</div>
        <div id="fMyList" style="margin-top:10px">${f.my.slice(0, 30).map(c => `<div class="fast-my"><div><div class="en"><b>${esc(c.en)}</b> ${say(c.en)}</div><div class="small muted">${esc(c.ar)}${c.hint ? ' · <span class="en">' + esc(c.hint) + '</span>' : ''}</div></div><button class="iconbtn" data-del="${esc(c.id)}" title="${L('حذف', 'Delete')}">✕</button></div>`).join('')}</div></div>`;
    $('#fGo', v).onclick = () => runSprint(v);
    $('#fSize', v).onchange = e => { fs().size = e.target.value; delete dayRec().fastNew; save(); route(); };
    $$('[data-lvl]', v).forEach(b => b.onclick = () => { S.level = b.dataset.lvl; delete dayRec().fastNew; delete dayRec().newWords; save(); renderChips(); route(); });
    $$('[data-del]', v).forEach(b => b.onclick = () => { f.my = f.my.filter(c => c.id !== b.dataset.del); delete f.chunks[b.dataset.del]; save(); route(); });
    $('#fMyAdd', v).onclick = async () => {
      const txt = $('#fMyIn', v).value.trim(); if (!txt) return;
      const btn = $('#fMyAdd', v); btn.disabled = true; btn.textContent = '⏳ …';
      try {
        const r = await AI.json(`You are an English coach for an Arabic-speaking MEP / construction engineer (CEFR ${level()}). Convert each Arabic sentence (Egyptian/Gulf/MSA, separated by new lines or "|") into the most natural English a professional would actually say on a project. Keep it short and usable.
Return ONLY JSON: {"items":[{"ar":"the original Arabic","en":"natural English","hint":"the reusable frame, e.g. Could you confirm…?"}]}

ARABIC:
${txt}`);
        const items = (r && r.items) || [];
        items.filter(x => x && x.en).forEach(x => { if (!f.my.some(c => norm(c.en) === norm(x.en))) f.my.unshift({ id: 'm' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), lv: level(), en: String(x.en), ar: String(x.ar || ''), hint: String(x.hint || '') }); });
        if (f.my.length > 200) f.my.length = 200;
        delete dayRec().fastNew; save(); toast('✅ ' + L('أُضيفت لجلساتك القادمة', 'Added to your next sprints')); route();
      } catch (e) { btn.disabled = false; btn.textContent = '✨ ' + L('حاول مرة أخرى', 'Try again'); toast(AI.errText(e)); }
    };
  };

  /* ---------------- Sprint runner ---------------- */
  function runSprint(v) {
    const sz = SIZES[fs().size] || SIZES.std;
    const R = { ok: 0, total: 0, start: Date.now(), mistakes: 0, newC: todaysChunks(sz.newC), talkScore: null };
    const newWords = todaysNewWords().filter(w => !(S.srs[w.en] && S.srs[w.en].seen)).slice(0, sz.words);
    const STEPS = [
      ['warm', '🔁', 'استرجاع', 'Recall'], ['learn', '🧩', 'جمل جديدة', 'New chunks'], ['grammar', '✍️', 'القاعدة', 'Pattern'],
      ['shadow', '🎧', 'Shadowing', 'Shadowing'], ['produce', '🔄', 'فكّر بالإنجليزي', 'Think in English'], ['talk', '🗣️', 'تكلّم', 'Speak']
    ];
    let si = 0;
    v.innerHTML = `<div class="fast-stepper" id="fStep"></div><div id="fBox"></div>`;
    const box = $('#fBox', v);
    const head = () => {
      $('#fStep', v).innerHTML = STEPS.map((s, i) => `<div class="fs ${i < si ? 'done' : i === si ? 'on' : ''}"><span>${i < si ? '✓' : s[1]}</span><small>${L(s[2], s[3])}</small></div>`).join('') + `<button class="btn ghost sm" id="fQuit">✕</button>`;
      $('#fQuit', v).onclick = () => modal(L('إنهاء الجلسة؟', 'Quit sprint?'), L('لن تُحسب الجلسة إلا إذا أكملتها. الجمل التي راجعتها محفوظة.', 'The sprint counts only when finished. Reviewed items are saved.'), [[L('أكمل', 'Continue'), null, 'sec'], [L('خروج', 'Quit'), () => go('fast'), 'danger']]);
      window.scrollTo(0, 0);
    };
    const next = () => { si++; save(); if (si >= STEPS.length) return finish(); head(); RUN[STEPS[si][0]](); };
    const tally = (ok) => { R.total++; if (ok) R.ok++; else R.mistakes++; };
    const stepTitle = (t, sub) => `<div class="row between"><h2>${t}</h2><span class="small muted">${sub || ''}</span></div>`;

    const RUN = {
      warm() {
        const items = [...dueChunks().slice(0, sz.warm).map(c => ({ c })), ...shuffle(dueWords()).slice(0, Math.max(2, sz.warm - dueChunks().length)).map(w => ({ w }))].slice(0, sz.warm + 2);
        if (!items.length) {
          box.innerHTML = `<div class="card">${stepTitle('🔁 ' + L('استرجاع', 'Recall'))}<div class="info">${L('لا توجد مراجعة مستحقة اليوم — الجمل التي تتعلمها الآن ستعود لك هنا في الأيام القادمة قبل أن تنساها.', 'Nothing due yet — what you learn today comes back here before you forget it.')}</div><div class="row" style="margin-top:12px"><button class="btn" id="fN">${L('التالي', 'Next')} ←</button></div></div>`;
          $('#fN', box).onclick = next; return;
        }
        let i = 0;
        const draw = () => {
          if (i >= items.length) return next();
          const it = items[i];
          const front = it.c ? `<div class="small muted">${L('قلها بالإنجليزي (بصوت عالٍ)', 'Say it in English (out loud)')}</div><div style="font-size:22px;font-weight:700;margin-top:6px">${esc(it.c.ar)}</div>` : `<div class="small muted">${L('ما معناها؟', 'What does it mean?')}</div><div class="w en">${esc(it.w.en)}</div>${pa(it.w.en, true)}`;
          const back = it.c ? `<div class="en" style="font-size:20px;font-weight:600">${esc(it.c.en)} ${say(it.c.en)}</div>${it.c.hint ? `<div class="small muted en">${esc(it.c.hint)}</div>` : ''}` : `<div style="font-size:20px;font-weight:600">${esc(it.w.ar)}</div><div class="en small"><i>${esc(it.w.ex)}</i> ${say(it.w.ex)}</div>`;
          box.innerHTML = `<div class="card">${stepTitle('🔁 ' + L('استرجاع', 'Recall'), (i + 1) + ' / ' + items.length)}
            <div class="bar" style="margin:4px 0 12px"><i style="width:${i / items.length * 100}%"></i></div>
            <div class="flash" id="fc">${front}<div id="fb" style="display:none;margin-top:14px">${back}</div><div class="small muted" id="fhint" style="margin-top:10px">${L('فكّر… ثم اضغط للكشف', 'Think… then tap to reveal')}</div></div>
            <div class="row" id="fg" style="justify-content:center;margin-top:12px;visibility:hidden"><button class="btn danger sm" data-g="0">❌ ${L('نسيتها', 'Forgot')}</button><button class="btn sec sm" data-g="1">🤔 ${L('بصعوبة', 'Hard')}</button><button class="btn sm" data-g="2">✅ ${L('عرفتها', 'Got it')}</button><button class="btn sm" data-g="3" style="background:var(--accent)">⚡ ${L('سهلة', 'Easy')}</button></div></div>`;
          $('#fc', box).onclick = () => { $('#fb', box).style.display = 'block'; $('#fhint', box).remove(); $('#fg', box).style.visibility = 'visible'; TTS.speak(it.c ? it.c.en : it.w.en); };
          $$('[data-g]', box).forEach(b => b.onclick = () => {
            const g = +b.dataset.g; tally(g >= 2);
            if (it.c) { gradeChunk(it.c, g); if (g === 0) addMistake({ src: 'fast', q: it.c.ar, wrong: '—', right: it.c.en, ar: it.c.hint || '' }); }
            else { addToSRS(it.w); const s = S.srs[it.w.en]; s.seen++; if (g === 0) { s.box = 0; s.wrong++; } else if (g === 1) { s.box = Math.max(1, s.box); s.wrong++; } else s.box = Math.min(7, s.box + (g === 3 ? 2 : 1)); s.due = addDays(today(), g === 0 ? 1 : INTERVALS[Math.max(1, s.box)]); }
            addXP(2); i++; draw();
          });
        };
        draw();
      },
      learn() {
        const cards = [...R.newC.map(c => ({ c })), ...newWords.map(w => ({ w }))];
        if (!cards.length) { box.innerHTML = `<div class="card"><div class="okbox">${L('أنهيت كل الجمل المتاحة لمستواك 👏 أضف جملاً من شغلك في صفحة المسار السريع.', 'All chunks for your level done 👏 Add your own work sentences.')}</div><button class="btn" id="fN" style="margin-top:10px">${L('التالي', 'Next')}</button></div>`; $('#fN', box).onclick = next; return; }
        let i = 0;
        const draw = () => {
          if (i >= cards.length) return next();
          const it = cards[i]; let reps = 0;
          if (it.c) {
            box.innerHTML = `<div class="card">${stepTitle('🧩 ' + L('جملة جاهزة', 'Power chunk'), (i + 1) + ' / ' + cards.length)}
              <div class="bar" style="margin:4px 0 12px"><i style="width:${i / cards.length * 100}%"></i></div>
              <div class="flash" style="cursor:default"><div class="en" style="font-size:24px;font-weight:700;line-height:1.4">${esc(it.c.en)}</div>${pa(it.c.en, true)}<div style="font-size:17px;margin-top:10px">${esc(it.c.ar)}</div>
                ${it.c.hint ? `<div class="fast-frame en">🧱 ${esc(it.c.hint)}</div><div class="small muted">${L('القالب: احفظه وغيّر الكلمات لتقول مئات الجمل', 'Frame: keep it, swap the words')}</div>` : ''}</div>
              <div class="row" style="justify-content:center;margin-top:12px"><button class="btn sec" id="fL">🔊 ${L('استمع', 'Listen')}</button><button class="btn sec" id="fS">🐢 ${L('ببطء', 'Slow')}</button><button class="btn" id="fR">🗣️ ${L('قلتها بصوت عالٍ', 'I said it aloud')} <bdi class="en">(<span id="fRc">0</span>/3)</bdi></button></div>
              <div class="row" style="justify-content:center;margin-top:10px"><button class="btn ghost" id="fN" disabled>${L('التالي', 'Next')} ←</button></div></div>`;
            const play = r => TTS.speak(it.c.en, { rate: r });
            $('#fL', box).onclick = () => play(); $('#fS', box).onclick = () => play(0.65);
            $('#fR', box).onclick = () => { reps = Math.min(3, reps + 1); $('#fRc', box).textContent = reps; if (reps >= 2) $('#fN', box).disabled = false; if (reps < 3) play(); };
            $('#fN', box).onclick = () => { const f = fs(); if (!f.chunks[it.c.id]) { f.chunks[it.c.id] = { box: 1, due: addDays(today(), 1), seen: 1, wrong: 0 }; } addXP(3); i++; draw(); };
            setTimeout(() => play(), 300);
          } else {
            const w = it.w;
            box.innerHTML = `<div class="card">${stepTitle('📚 ' + L('كلمة مهمة', 'Key word'), (i + 1) + ' / ' + cards.length)}
              <div class="bar" style="margin:4px 0 12px"><i style="width:${i / cards.length * 100}%"></i></div>
              <div class="flash" style="cursor:default"><div class="w en">${esc(w.en)}</div>${pa(w.en, true)}<div style="font-size:19px;font-weight:600">${esc(w.ar)}</div><div class="en" style="margin-top:8px"><i>${esc(w.ex)}</i> ${say(w.ex)}</div>${exa(w)}</div>
              <div class="row" style="justify-content:center;margin-top:12px"><button class="btn" id="fN">${L('حفظتها — التالي', 'Got it — next')} ←</button></div></div>`;
            TTS.speak(w.en);
            $('#fN', box).onclick = () => { addToSRS(w); const s = S.srs[w.en]; s.seen = Math.max(1, s.seen); s.box = Math.max(1, s.box); s.due = addDays(today(), 1); addXP(2); i++; draw(); };
          }
        };
        draw();
      },
      grammar() {
        const g = nextGrammar();
        box.innerHTML = `<div class="card">${stepTitle('✍️ ' + esc(g.title), esc(g.ar) + ' · ' + g.level)}
          <div class="info" style="margin:8px 0">${esc(g.explain)}</div>
          <ul class="en">${g.rules.slice(0, 4).map(r => `<li>${esc(r)} ${say(r)}</li>`).join('')}</ul>
          <button class="btn" id="fGq">${L('ابدأ التمارين', 'Start drills')} ←</button></div><div id="fGbox"></div>`;
        $('#fGq', box).onclick = () => {
          const q = $('#fGbox', box); $('#fGq', box).remove();
          runQuiz(q, g.ex.map(exToQ), {
            title: g.title, src: 'grammar', next, nextLabel: L('الخطوة التالية ←', 'Next step →'),
            onDone: (p, sc, wr) => { R.total += g.ex.length; R.ok += sc; R.mistakes += wr.length; S.grammarDone[g.id] = Math.max(S.grammarDone[g.id] || 0, p); setSkill('grammar', p); addXP(10); save(); }
          });
          q.scrollIntoView({ behavior: 'smooth' });
        };
      },
      shadow() {
        const list = shuffle([...R.newC, ...dueChunks()]).filter((c, k, a) => a.indexOf(c) === k).slice(0, sz.shadow);
        if (!list.length) return next();
        let i = 0;
        const draw = () => {
          if (i >= list.length) return next();
          const c = list[i];
          box.innerHTML = `<div class="card">${stepTitle('🎧 Shadowing', (i + 1) + ' / ' + list.length)}
            <p class="small muted">${L('استمع ثم كرر فوراً مع الصوت — قلّد السرعة والإيقاع. بعدها قلها في المربع بميكروفون الكيبورد وهتتصحح.', 'Listen, repeat, then say it into the box to get corrected.')}</p>
            <div class="flash" style="cursor:default;min-height:120px"><div class="en" style="font-size:22px;font-weight:600">${esc(c.en)}</div>${pa(c.en)}<div class="small muted" style="margin-top:6px">${esc(c.ar)}</div></div>
            <div class="row" style="justify-content:center;margin-top:12px"><button class="btn sec" id="fL">🔊 ${L('استمع', 'Listen')}</button><button class="btn sec" id="fS">🐢 0.7×</button></div>
            <div id="fRes" style="margin-top:10px"></div>
            <div class="row" style="justify-content:center;margin-top:10px"><button class="btn" id="fN" style="display:none">${L('التالي', 'Next')} ←</button><button class="btn ghost sm" id="fSkip">${L('تخطي (قيّم نفسك)', 'Skip (self-rate)')}</button></div>
            <div class="row" id="fSelf" style="justify-content:center;margin-top:8px;display:none">${[2, 3, 4, 5].map(k => `<button class="btn sm sec" data-self="${k}">${'⭐'.repeat(k)}</button>`).join('')}</div></div>`;
          $('#fL', box).onclick = () => TTS.speak(c.en); $('#fS', box).onclick = () => TTS.speak(c.en, { rate: 0.7 });
          let counted = false;
          speakCheck($('#fRes', box), c.en, { src: 'fast shadowing', onResult: (acc) => { if (!counted) { counted = true; tally(acc >= 75); } $('#fN', box).style.display = ''; } });
          $('#fN', box).onclick = () => { i++; draw(); };
          $('#fSkip', box).onclick = () => { $('#fSelf', box).style.display = 'flex'; };
          $$('[data-self]', box).forEach(b => b.onclick = () => { const k = +b.dataset.self; if (!counted) tally(k >= 4); setSkill('pronunciation', k * 20); addXP(3); i++; draw(); });
          setTimeout(() => TTS.speak(c.en), 300);
        };
        draw();
      },
      produce() {
        const pool = shuffle([...R.newC, ...dueChunks(), ...Object.keys(fs().chunks).map(chunkById).filter(Boolean)]).filter((c, k, a) => a.indexOf(c) === k);
        const list = pool.slice(0, sz.tr);
        if (!list.length) return next();
        const ans = []; let i = 0;
        const draw = () => {
          if (i >= list.length) return evaluate();
          const c = list[i];
          box.innerHTML = `<div class="card">${stepTitle('🔄 ' + L('فكّر بالإنجليزي', 'Think in English'), (i + 1) + ' / ' + list.length)}
            <p class="small muted">${L('اكتب أو قل الجملة بالإنجليزي. لا تترجم كلمة بكلمة — فكّر في القالب.', "Write or say it in English. Don't translate word by word — think of the frame.")}</p>
            <div class="fast-ar">${esc(c.ar)}</div>
            ${c.hint ? `<details class="small"><summary>💡 ${L('تلميح: القالب', 'Hint: frame')}</summary><span class="en">${esc(c.hint)}</span></details>` : ''}
            <div class="composer" style="margin-top:10px"><button class="mic" id="fMic">🎙️</button><textarea id="fIn" class="en" placeholder="Type or dictate in English…"></textarea></div>
            <div class="row" style="margin-top:10px"><button class="btn" id="fOk">${L('تحقق', 'Check')}</button><button class="btn ghost sm" id="fSkip">${L('لا أعرف', "I don't know")}</button></div><div id="fFb" style="margin-top:10px"></div></div>`;
          const inp = $('#fIn', box); inp.focus();
          $('#fMic', box).onclick = () => { const m = $('#fMic', box); m.classList.add('rec'); STT.start((t) => { inp.value = t; }, () => m.classList.remove('rec')); };
          const check = (given) => {
            const tw = norm(c.en).split(' '); const r = diffWords(tw, norm(given).split(' ')); const acc = given.trim() ? Math.round(r.hit / tw.length * 100) : 0;
            ans.push({ c, given: given.trim(), acc });
            $('#fFb', box).innerHTML = `<div class="${acc >= 80 ? 'okbox' : 'info'}">${acc >= 80 ? '✔ ' + L('ممتاز!', 'Great!') : L('النموذج', 'Model answer') + ':'} <b class="en">${esc(c.en)}</b> ${say(c.en)}${given.trim() && acc < 80 ? `<div class="small" style="margin-top:4px">${L('قد تكون إجابتك صحيحة بصياغة مختلفة — المدرس سيراجعها في النهاية.', 'Yours may also be right — the tutor checks at the end.')}</div>` : ''}</div>
              <div class="row" style="margin-top:8px"><button class="btn" id="fN">${i + 1 < list.length ? L('التالي', 'Next') : L('راجع إجاباتي', 'Review my answers')} ←</button></div>`;
            $('#fOk', box).remove(); $('#fSkip', box).remove();
            $('#fN', box).onclick = () => { i++; draw(); }; $('#fN', box).focus();
          };
          $('#fOk', box).onclick = () => check(inp.value); $('#fSkip', box).onclick = () => check('');
          inp.onkeydown = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); check(inp.value); } };
        };
        const apply = (res) => {
          ans.forEach((a, k) => {
            const r = res[k] || { ok: a.acc >= 80 };
            tally(!!r.ok); gradeChunk(a.c, r.ok ? 2 : 0);
            if (!r.ok && a.given) addMistake({ src: 'fast', q: a.c.ar, wrong: a.given, right: r.better || a.c.en, ar: r.note_ar || '' });
          });
          setSkill('writing', Math.round(ans.filter((a, k) => (res[k] || {}).ok || a.acc >= 80).length / ans.length * 100)); addXP(10);
          box.innerHTML = `<div class="card">${stepTitle('🔄 ' + L('نتيجة "فكّر بالإنجليزي"', 'Think-in-English results'))}
            ${ans.map((a, k) => { const r = res[k] || { ok: a.acc >= 80 }; return `<div class="fast-res ${r.ok ? 'ok' : 'bad'}"><div class="small">${esc(a.c.ar)}</div><div class="en">${r.ok ? '✔' : '✘'} ${esc(a.given || '—')}</div>${!r.ok || r.better ? `<div class="en" style="color:var(--ok)">★ ${esc(r.better || a.c.en)} ${say(r.better || a.c.en)}</div>` : ''}${r.note_ar ? `<div class="small muted">${esc(r.note_ar)}</div>` : ''}</div>`; }).join('')}
            <div class="row" style="margin-top:12px"><button class="btn" id="fN">${L('الخطوة الأخيرة: تكلّم', 'Last step: speak')} ←</button></div></div>`;
          $('#fN', box).onclick = next;
        };
        const evaluate = async () => {
          const answered = ans.filter(a => a.given);
          if (!AI.ok() || !answered.length) return apply([]);
          box.innerHTML = `<div class="card"><p>⏳ ${L('المدرس يراجع إجاباتك…', 'The tutor is checking…')}</p></div>`;
          try {
            const r = await AI.json(`You are an English teacher for an Arabic-speaking engineer (CEFR ${level()}). For each item, judge whether the learner's English correctly and naturally expresses the Arabic meaning. Accept different wording if it is correct and natural. Return ONLY JSON: {"results":[{"ok":true|false,"better":"best natural version (only if not ok or clearly improvable, else empty)","note_ar":"ملاحظة قصيرة جداً بالعربية عن الخطأ، أو فارغ"}]} in the same order.
ITEMS:
${ans.map((a, k) => `${k + 1}. Arabic: ${a.c.ar}\n   Model: ${a.c.en}\n   Learner: ${a.given || '(no answer)'}`).join('\n')}`);
            const res = (r && r.results) || [];
            apply(ans.map((a, k) => a.given ? (res[k] || { ok: a.acc >= 80 }) : { ok: false, better: a.c.en, note_ar: '' }));
          } catch (e) { apply([]); }
        };
        draw();
      },
      talk() {
        const tp = fastTopic(); const qs = tp.q.slice(0, sz.talk); const answers = []; let i = 0;
        const draw = () => {
          if (i >= qs.length) return evaluate();
          box.innerHTML = `<div class="card">${stepTitle('🗣️ ' + L('تكلّم', 'Speak') + ': ' + esc(L(tp.ar, tp.t)), (i + 1) + ' / ' + qs.length)}
            <div class="fast-q en">${esc(qs[i])} ${say(qs[i])}</div>
            <p class="small muted">${L('جاوب في 2–4 جمل. لا تخف من الأخطاء — المدرس سيصلحها ويعطيك نسخة أفضل من كلامك.', 'Answer in 2–4 sentences. Mistakes are fine — you will get a better version.')}</p>
            <div class="composer"><button class="mic" id="fMic">🎙️</button><textarea id="fIn" class="en" placeholder="Speak or type your answer…" style="min-height:90px"></textarea></div>${micHint()}
            <div class="row" style="margin-top:6px"><button class="btn" id="fOk">${i + 1 < qs.length ? L('السؤال التالي', 'Next question') : L('أرسل للتقييم', 'Get feedback')} ←</button></div></div>`;
          const inp = $('#fIn', box);
          setTimeout(() => TTS.speak(qs[i]), 250);
          $('#fMic', box).onclick = () => { const m = $('#fMic', box); m.classList.add('rec'); const base = inp.value ? inp.value + ' ' : ''; STT.start((t) => { inp.value = base + t; }, () => m.classList.remove('rec')); };
          $('#fOk', box).onclick = () => { answers.push({ q: qs[i], a: inp.value.trim() }); i++; draw(); };
        };
        const evaluate = async () => {
          const got = answers.filter(x => x.a);
          if (!got.length) { box.innerHTML = `<div class="card"><div class="note">${L('لم تكتب إجابات. جرّب غداً أن تجاوب ولو بجملة واحدة — الكلام هو أسرع طريق للطلاقة.', 'No answers. Tomorrow try at least one sentence.')}</div><button class="btn" id="fN" style="margin-top:10px">${L('إنهاء الجلسة', 'Finish')}</button></div>`; $('#fN', box).onclick = next; return; }
          if (!AI.ok()) { box.innerHTML = `<div class="card"><div class="note">${L('الذكاء الاصطناعي غير متاح هنا لتقييم كلامك. افتح المنصة من رابطها على Claude.', 'AI unavailable here to review your answers.')}</div>${got.map(x => `<p class="en"><b>${esc(x.q)}</b><br>${esc(x.a)}</p>`).join('')}<button class="btn" id="fN">${L('إنهاء الجلسة', 'Finish')}</button></div>`; $('#fN', box).onclick = next; S.stats.conversations++; return; }
          box.innerHTML = `<div class="card"><p>⏳ ${L('المدرس يحلل كلامك ويجهز نسخة أفضل…', 'Analysing your answers…')}</p></div>`;
          try {
            const r = await AI.json(`You are a supportive expert English coach for an Arabic-speaking mechanical/MEP engineer working in Riyadh. Current CEFR: ${level()}. He answered speaking questions (typed or dictated — do not judge pronunciation or punctuation from dictation).
For EACH answer return: "corrected" (his answer with only the errors fixed, keep his ideas), "upgrade" (how a confident professional at about one CEFR level higher would say the same thing — natural, not too long), "mistakes" (max 3: wrong, right, explain_ar), "key_phrase" (one short reusable phrase from the upgrade worth memorising) and "key_phrase_ar" (its Arabic meaning).
Then overall: "score" 0-100 (communication + accuracy at his level), "cefr_estimate", "tip_ar" (one concrete tip in Arabic for tomorrow).
Return ONLY JSON: {"items":[{"corrected":"","upgrade":"","mistakes":[{"wrong":"","right":"","explain_ar":""}],"key_phrase":"","key_phrase_ar":""}],"score":0,"cefr_estimate":"","tip_ar":""}

${got.map((x, k) => `Q${k + 1}: ${x.q}\nA${k + 1}: ${x.a}`).join('\n\n')}`);
            const items = (r && r.items) || [];
            R.talkScore = +r.score || null; if (R.talkScore != null) { setSkill('speaking', R.talkScore); tally(R.talkScore >= 60); }
            S.stats.conversations++; addXP(15);
            items.forEach(it => (it.mistakes || []).forEach(m => addMistake({ src: 'speaking', wrong: m.wrong, right: m.right, ar: m.explain_ar })));
            box.innerHTML = `<div class="card">${stepTitle('🗣️ ' + L('تقييم كلامك', 'Your speaking feedback'), `<span class="pill">${esc(r.cefr_estimate || '')}</span> <span class="pill ok">${esc(r.score)}/100</span>`)}
              ${got.map((x, k) => { const it = items[k] || {}; return `<div class="fast-talk"><div class="small muted en">${esc(x.q)}</div>
                <div class="en"><span class="lbl">${L('أنت', 'You')}</span> ${esc(x.a)}</div>
                ${it.corrected && norm(it.corrected) !== norm(x.a) ? `<div class="en"><span class="lbl ok">${L('مصحّح', 'Fixed')}</span> ${esc(it.corrected)}</div>` : ''}
                ${it.upgrade ? `<div class="en up"><span class="lbl up">⭐ ${L('بشكل احترافي', 'Pro version')}</span> ${esc(it.upgrade)} ${say(it.upgrade)}</div>` : ''}
                ${(it.mistakes || []).map(m => `<div class="small"><span class="en" style="color:var(--bad)">✘ ${esc(m.wrong)}</span> → <span class="en" style="color:var(--ok)">${esc(m.right)}</span> — ${esc(m.explain_ar)}</div>`).join('')}
                ${it.key_phrase ? `<div class="row" style="margin-top:6px"><span class="chip en">🔑 ${esc(it.key_phrase)}</span><button class="btn sm sec" data-keep="${k}">📌 ${L('أضفها لجملي', 'Save to my sentences')}</button></div>` : ''}</div>`; }).join('')}
              ${r.tip_ar ? `<div class="info">💡 ${esc(r.tip_ar)}</div>` : ''}
              <div class="row" style="margin-top:12px"><button class="btn" id="fN">🏁 ${L('إنهاء الجلسة', 'Finish sprint')}</button></div></div>`;
            $$('[data-keep]', box).forEach(b => b.onclick = () => { const it = items[+b.dataset.keep]; const f = fs(); if (!f.my.some(c => norm(c.en) === norm(it.key_phrase))) f.my.unshift({ id: 'm' + Date.now().toString(36), lv: level(), en: it.key_phrase, ar: it.key_phrase_ar || '', hint: '' }); save(); b.disabled = true; b.textContent = '✅'; });
            $('#fN', box).onclick = next;
          } catch (e) { box.innerHTML = `<div class="card"><div class="badbox">${esc(AI.errText(e))}</div><button class="btn" id="fN" style="margin-top:10px">${L('إنهاء الجلسة', 'Finish')}</button></div>`; $('#fN', box).onclick = next; }
        };
        draw();
      }
    };

    function finish() {
      const f = fs(); const score = R.total ? Math.round(R.ok / R.total * 100) : 100;
      const min = Math.max(1, Math.round((Date.now() - R.start) / 60000));
      const first = !f.sprints[today()];
      const prev = f.sprints[today()];
      f.sprints[today()] = { score: prev ? Math.max(prev.score, score) : score, min: (prev ? prev.min : 0) + min, n: (prev ? prev.n : 0) + 1 };
      if (!f.started) f.started = today();
      const d = dayRec(); ['vocab', 'grammar', 'listening', 'speaking', 'review'].forEach(k => { d.tasks[k] = true; });
      addXP(first ? 40 : 15); save(); Store.writeSummary(true);
      const n = sprintCount(); const due = Object.values(f.chunks).filter(x => x.due <= addDays(today(), 1) && x.seen > 0).length;
      $('#fStep', v).innerHTML = '';
      box.innerHTML = `<div class="card fast-hero" style="text-align:center">
        <div style="font-size:46px">🏆</div><h2 style="font-size:24px">${L('أنهيت اليوم', 'Day')} ${Math.min(90, n)} ${L('من 90', 'of 90 complete')}!</h2>
        <div class="grid g4" style="margin:16px 0">
          <div><div style="font-size:24px;font-weight:700">${score}%</div><div class="small">${L('الدقة', 'Accuracy')}</div></div>
          <div><div style="font-size:24px;font-weight:700">${R.newC.length}</div><div class="small">${L('جمل جديدة', 'New chunks')}</div></div>
          <div><div style="font-size:24px;font-weight:700">🔥 ${liveStreak()}</div><div class="small">${L('أيام متتالية', 'Streak')}</div></div>
          <div><div style="font-size:24px;font-weight:700">${min}</div><div class="small">${L('دقيقة', 'minutes')}</div></div>
        </div>
        <p>${score >= 85 ? L('أداء قوي جداً — المرحلة القادمة ستكون أصعب قليلاً.', 'Strong — tomorrow gets a bit harder.') : score >= 60 ? L('جيد — الأخطاء ستعود لك في الاسترجاع حتى تثبت.', 'Good — mistakes come back in recall until they stick.') : L('عادي جداً في البداية — الاستمرار اليومي هو اللي يفرق.', 'Normal at the start — consistency wins.')}</p>
        <p class="small">${L('بكرة', 'Tomorrow')}: ${due} ${L('جملة للاسترجاع + جمل جديدة', 'chunks to recall + new ones')}</p>
        ${n % 7 === 0 ? `<div class="fast-level" style="text-align:start">🧪 <b>${L('نقطة تفتيش!', 'Checkpoint!')}</b> ${L('أكملت أسبوعاً. اختبر مستواك الآن لترى تقدمك.', 'A week done — test your level now.')} <button class="btn sm" data-go="levels">${L('اختبار المستوى', 'Level test')}</button></div>` : ''}
        <div class="row" style="justify-content:center;margin-top:14px"><button class="btn sec" data-go="fast">🚀 ${L('المسار السريع', 'Fast Track')}</button><button class="btn sec" data-go="home">🏠 ${L('الرئيسية', 'Home')}</button></div></div>`;
      window.scrollTo(0, 0);
    }
    head(); RUN[STEPS[0][0]]();
  }

  /* ------------------------------------------------------------
     Global events & boot
     ------------------------------------------------------------ */
  document.addEventListener('click', e => {
    const s = e.target.closest('[data-say]'); if (s) { e.preventDefault(); e.stopPropagation(); TTS.speak(s.dataset.say); return; }
    const g = e.target.closest('[data-go]'); if (g && !g.dataset.task) { e.preventDefault(); go(g.dataset.go); return; }
    if (g && g.dataset.task && g.dataset.task !== 'review') { e.preventDefault(); startTask(g.dataset.task); }
    // tapping the menu item of the page you are already on takes you back to that page's start (e.g. the lessons list)
    const n = e.target.closest('[data-r]'); if (n && n.dataset.r === current) { e.preventDefault(); route(); }
  });
  $('#fab').onclick = () => go('translate');
  $('#menuBtn').onclick = () => { $('#side').classList.add('open'); $('#drawerBg').classList.add('open'); };
  $('#drawerBg').onclick = closeDrawer;
  $('#themeBtn').onclick = () => { S.theme = S.theme === 'dark' ? 'light' : 'dark'; save(); renderShell(); };
  $('#langBtn').onclick = () => { S.ui = S.ui === 'en' ? 'ar' : 'en'; save(); renderShell(); route(); };
  window.addEventListener('hashchange', route);
  Store.onRemote = () => {
    renderChips(); checkBadges();
    const busy = $('.chat, #qOpts, #qIn, .flash, #rv, #trIn:focus, textarea:focus, input:focus');
    if (!busy && !viewTouched && ['home', 'plan', 'progress', 'levels', 'tests', 'grammar', 'reading'].includes(current)) route();
    toast('🔄 ' + L('تم تحديث تقدمك من جهازك الآخر', 'Progress synced from your other device'));
  };
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') Store.pull(); });
  setInterval(() => { if (document.visibilityState === 'visible' && Store.ref && !Store.unsub) Store.pull(); }, 30000);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') { clearTimeout(Store.timer); Store.flush().then(() => Store.writeSummary(true)); } });

  // First paint immediately from local data, then upgrade when platform capabilities answer.
  const local = Store.loadLocal(); if (local) S = Object.assign(DEFAULT(), local);
  renderShell(); route(); checkBadges();
  Promise.all([Store.init(), AI.init()]).then(() => { renderShell(); checkBadges(); if (!$('.chat') && !viewTouched) route(); });
})();
