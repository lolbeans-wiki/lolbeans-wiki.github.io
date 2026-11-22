const clickSfx = new Audio('audio/u_xg7ssi08yr-button-clicks-572422.mp3');

const siteTranslations = {
    en: {
        pageTitle: "US Lolbeans server Web",
        navHome: "Home",
        navSkill: "Skill Measure",
        navExtras: "Super Cool stuff",
        navAbout: "About",
        langButton: "Languages",
        mobileWarning: "Not Recommended for Mobile Devices",
        offlineMsg: "Check your internet connection",
        discordBanner: "Please consider joining our dc server for fun events! ",
        searchPlayerStats: "Search Player Stats",
        sizeComparison: "Size Comparison",
        winGrinders: "Win Grinders",
        tagGuidePageTitle: "Tag Guide - US Lolbeans server Web",
        backToExtras: "Back to Extras",
        guideCredits: "CREDITS: (10s) Mr Marsh",
        guideTitle: "The Tag Guide",
        tagGuideSec1: "1.0 The Lolbeans.io Tag Guide",
        tagGuideIntroP1: "My name is 10s mr marsh, I am widely considered to be the best Lolbeans Tag player of all time. This is a guide for the Tag Gamemode in Lolbeans.io. This will cover everything about the gamemode; its history, the basics, information on maps, how to juke, tricks and how to execute them, and various lesser known and discussed topics. My goal is that, with all my knowledge, I can shed a light on the gamemode for Battle Royale players who are hesitant to try, and newer players who have only played Battle Royale. I am here to show that Tag has both a lot of skill to it beneath the surface, and is overall a bunch of fun.",
        contentsHeader: "Contents",
        contentsDesc: "This guide is divided into two sections. Section one is a broad look into the gamemode, while section two dives deeper. It first goes over a list of tips, techs, tricks, and glitches, then discusses facts and history and other tidbits.",
        tagGuideSec11: "1.1 - Introduction, History, and Overview",
        tagGuideSec12: "1.2 - Basic Information",
        tagGuideSec13: "1.3 - Basic Mechanics",
        tagGuideSec14: "1.4 - How to Win",
        tagGuideSec15: "1.5 - Juking",
        tagGuideSec16: "1.6 - Deeper Dive into Mechanics",
        tagGuideSec17: "1.7 - Overview of the Maps",
        tocConstruction: "Construction",
        tocOriginalMaps: "Original Maps",
        tagGuideSec20: "2.0 Tips, Techs, Tricks, Glitches, and Facts",
        tagGuideSec21: "2.1 Settings",
        tagGuideSec22: "2.2 The Maps in More Detail",
        tocColorCity: "Color City",
        tocSupermarket: "Supermarket",
        tocTeleport: "Teleport",
        tocConstructionDetail: "Construction",
        tocNonMapTricks: "Non Map-Specific Tricks",
        tagGuideSec23: "2.3 Other Information",
        tocBotology: "Botology",
        tocPointsScored: "How are Points Truly Scored?",
        tocMapChanges: "Map Changes",
        tocHuntersDecided: "How are Hunters Decided?",
        tocKickTimes: "Kick Times",
        tocHeightBarrier: "The Height Barrier",
        tocServersCommunity: "Servers, Community, Notable Players, and Leaderboard",
        tocLeaderboardsGlitch: "Leaderboards, HTML Name Glitch",
        tagGuideSec24: "2.4 Video Resources for Tag",
        tagGuideSec25: "2.5 Conclusion"
    },
    bn: {
        pageTitle: "ইউএস ললবিনস সার্ভার ওয়েব",
        navHome: "হোম",
        navSkill: "দক্ষতা পরিমাপ",
        navExtras: "দারুণ সব জিনিস",
        navAbout: "সম্পর্কে",
        langButton: "ভাষা",
        mobileWarning: "মোবাইল ডিভাইসের জন্য প্রস্তাবিত নয়",
        offlineMsg: "আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন",
        discordBanner: "মজার ইভেন্টের জন্য আমাদের ডিসকর্ড সার্ভারে যোগ দিন! ",
        searchPlayerStats: "প্লেয়ারের পরিসংখ্যান খুঁজুন",
        sizeComparison: "আকার তুলনা",
        winGrinders: "জয় গ্রাইন্ডার"
    },
    fr: {
        pageTitle: "Serveur US Lolbeans Web",
        navHome: "Accueil",
        navSkill: "Mesure de compétence",
        navExtras: "Trucs super cools",
        navAbout: "À propos",
        langButton: "Langues",
        mobileWarning: "Non recommandé pour les appareils mobiles",
        offlineMsg: "Vérifiez votre connexion Internet",
        discordBanner: "Pensez à rejoindre notre serveur Discord pour des événements amusants ! ",
        searchPlayerStats: "Rechercher les stats des joueurs",
        sizeComparison: "Comparaison de taille",
        winGrinders: "Gagnants Grinders"
    },
    hi: {
        pageTitle: "यूएस लोलबीन्स सर्वर वेब",
        navHome: "होम",
        navSkill: "कौशल माप",
        navExtras: "शानदार चीज़ें",
        navAbout: "हमारे बारे में",
        langButton: "भाषाएँ",
        mobileWarning: "मोबाइल उपकरणों के लिए अनुशंसित नहीं",
        offlineMsg: "अपना इंटरनेट कनेक्शन जांचें",
        discordBanner: "मजेदार कार्यक्रमोंों के लिए हमारे डिस्कोर्ड सर्वर से जुड़ें! ",
        searchPlayerStats: "खिलाड़ी के आंकड़े खोजें",
        sizeComparison: "आकार की तुलना",
        winGrinders: "जीत ग्राइंडर"
    },
    id: {
        pageTitle: "Web Server Lolbeans AS",
        navHome: "Beranda",
        navSkill: "Pengukur Keahlian",
        navExtras: "Hal Super Keren",
        navAbout: "Tentang",
        langButton: "Bahasa",
        mobileWarning: "Tidak Direkomendasikan untuk Perangkat Seluler",
        offlineMsg: "Periksa koneksi internet Anda",
        discordBanner: "Silakan bergabung dengan server Discord kami untuk acara seru! ",
        searchPlayerStats: "Cari Statistik Pemain",
        sizeComparison: "Perbandingan Ukuran",
        winGrinders: "Pemenang Grinder"
    },
    ja: {
        pageTitle: "US Lolbeans サーバー Web",
        navHome: "ホーム",
        navSkill: "スキル測定",
        navExtras: "超クールなもの",
        navAbout: "概要",
        langButton: "言語",
        mobileWarning: "モバイル端末での利用は推奨されません",
        offlineMsg: "インターネット接続を確認してください",
        discordBanner: "楽しいイベントのためにDiscordサーバーに参加してください！ ",
        searchPlayerStats: "プレイヤー統計を検索",
        sizeComparison: "サイズ比較",
        winGrinders: "ウィングインダー"
    },
    zh: {
        pageTitle: "美国 Lolbeans 服务器网页",
        navHome: "首页",
        navSkill: "技能评估",
        navExtras: "超酷内容",
        navAbout: "关于",
        langButton: "语言",
        mobileWarning: "不建议在移动设备上使用",
        offlineMsg: "请检查您的网络连接",
        discordBanner: "请考虑加入我们的 Discord 服务器以参与有趣活动！ ",
        searchPlayerStats: "搜索玩家统计数据",
        sizeComparison: "大小比较",
        winGrinders: "获胜者统计"
    },
    ar: {
        pageTitle: "موقع خادم US Lolbeans",
        navHome: "الرئيسية",
        navSkill: "مقياس المهارة",
        navExtras: "أشياء رائعة للغاية",
        navAbout: "حول",
        langButton: "اللغات",
        mobileWarning: "غير موصى به للأجهزة المحمولة",
        offlineMsg: "تحقق من اتصالك بالإنترنت",
        discordBanner: "يرجى التفكير في الانضمام إلى خادم Discord الخاص بنا للحصول على فعاليات ممتعة! ",
        searchPlayerStats: "بحث إحصائيات اللاعبين",
        sizeComparison: "مقارنة الحجم",
        winGrinders: "الفائزون"
    },
    pt: {
        pageTitle: "Web do Servidor US Lolbeans",
        navHome: "Início",
        navSkill: "Medida de Habilidade",
        navExtras: "Coisas Super Legais",
        navAbout: "Sobre",
        langButton: "Idiomas",
        mobileWarning: "Não recomendado para dispositivos móveis",
        offlineMsg: "Verifique sua conexão com a internet",
        discordBanner: "Considere entrar no nosso servidor do Discord para eventos divertidos! ",
        searchPlayerStats: "Pesquisar Estatísticas de Jogadores",
        sizeComparison: "Comparação de Tamanho",
        winGrinders: "Grinders Vencedores"
    },
    ru: {
        pageTitle: "Веб-сайт сервера US Lolbeans",
        navHome: "Главная",
        navSkill: "Оценка навыков",
        navExtras: "Супер крутые штуки",
        navAbout: "О нас",
        langButton: "Языки",
        mobileWarning: "Не рекомендуется для мобильных устройств",
        offlineMsg: "Проверьте подключение к интернету",
        discordBanner: "Пожалуйста, присоединяйтесь к нашему серверу Discord для веселых мероприятий! ",
        searchPlayerStats: "Поиск статистики игроков",
        sizeComparison: "Сравнение размеров",
        winGrinders: "Гриндеры побед"
    },
    es: {
        pageTitle: "Web del servidor US Lolbeans",
        navHome: "Inicio",
        navSkill: "Medida de habilidad",
        navExtras: "Cosas súper geniales",
        navAbout: "Acerca de",
        langButton: "Idiomas",
        mobileWarning: "No recomendado para dispositivos móviles",
        offlineMsg: "Comprueba tu conexión a internet",
        discordBanner: "¡Considera unirte a nuestro servidor de Discord para eventos divertidos! ",
        searchPlayerStats: "Buscar estadísticas de jugadores",
        sizeComparison: "Comparación de tamaño",
        winGrinders: "Ganadores grinders"
    },
    ur: {
        pageTitle: "یو ایس لول بینز سرور ویب",
        navHome: "ہوم",
        navSkill: "مہارت کی پیمائش",
        navExtras: "زبردست چیزیں",
        navAbout: "ہمارے بارے میں",
        langButton: "زبانیں",
        mobileWarning: "موبایل آلات کے لیے تجویز کردہ نہیں",
        offlineMsg: "اپنا انٹرنیٹ کنکشن چیک کریں",
        discordBanner: "تفریحی ایونٹس کے لیے ہمارے ڈسکارڈ سرور میں شامل ہوں! ",
        searchPlayerStats: "کھلاڑی کے اعداد و شمار تلاش کریں",
        sizeComparison: "سائز کا موازنہ",
        winGrinders: "جیت گرائنڈرز"
    }
};

const RTL_LANGS = ['ar', 'ur'];
const GOOGLE_CODES = { bn: 'bn', fr: 'fr', hi: 'hi', id: 'id', ja: 'ja', zh: 'zh-CN', ar: 'ar', pt: 'pt', ru: 'ru', es: 'es', ur: 'ur' };

const NAME_GUESSES = ['[class*="name" i]', '[class*="row" i]', '[class*="entry" i]', '[class*="item" i]', '[class*="result" i]', '[class*="suggest" i]', 'td', 'li'];
const KEEP_ENGLISH = {
    '*': ['input', 'datalist', '[data-keep-english]'],
    'player-stats': NAME_GUESSES,
    'stats2': NAME_GUESSES,
    'win-grinders': NAME_GUESSES,
    'size-comparison': ['[class*="name" i]', '[class*="player" i] h3', '[class*="player" i] h4', '[class*="card" i] h3', '[class*="card" i] h4', '[class*="card" i] strong', '[class*="card" i] b'],
    'server-stats': NAME_GUESSES.concat(['button'])
};

const SONGS = [
    { file: 'SPCookie - Shikimori.mp3', credits: 'Credits: (10s) Mr Marsh' },
    { file: 'SPCookie - Flavorful Factory (1).mp3', credits: 'Credits: (10s) Mr Marsh' },
    { file: 'SPCookie - Sunshine.mp3', credits: 'Credits: (10s) Mr Marsh' },
    { file: 'SPCookie - Triangle Dash.mp3', credits: 'Credits: (10s) Mr Marsh' },
    { file: 'Video Project 35 (1).m4a', credits: 'Credits: Ᏽꓓⲙⲁ⳽ⲧⲉⲅ ✔' },
    { file: 'Video Project 35 (2).m4a', credits: 'Credits: Ᏽꓓⲙⲁ⳽ⲧⲉⲅ ✔' },
    { file: 'Video Project 35 (3).m4a', credits: 'Credits: Ᏽꓓⲙⲁ⳽ⲧⲉⲅ ✔' },
    { file: 'Video Project 35.m4a', credits: 'Credits: Ᏽꓓⲙⲁ⳽ⲧⲉⲅ ✔' }
];

const pageName = (location.pathname.split('/').pop() || 'index').replace(/\.html?$/i, '').toLowerCase();
const keepSelector = [...KEEP_ENGLISH['*'], ...(KEEP_ENGLISH[pageName] || [])].join(',');
let googleLoaded = false;

function initMusicBox() {
    const box = document.querySelector('.music-box');
    const switchBtn = document.getElementById('music-switcher-btn');
    const playBtn = document.getElementById('music-mute-btn') || document.getElementById('music-toggle-btn');
    if (!box || !switchBtn || !playBtn) return;

    const saved = Number(localStorage.getItem('lolbeans_music_track_index'));
    let idx = Number.isInteger(saved) && saved >= 0 && saved < SONGS.length ? saved : 0;

    const audio = new Audio();
    audio.loop = true;
    audio.preload = 'auto';

    const trackNum = document.getElementById('music-track-num');
    const creditsBox = document.getElementById('music-credits');

    const syncUI = () => {
        const playing = !audio.paused;
        if (trackNum) trackNum.textContent = `${idx + 1}/${SONGS.length}`;
        if (creditsBox) creditsBox.textContent = SONGS[idx].credits;
        playBtn.textContent = playing ? 'PAUSE' : 'PLAY';
        playBtn.classList.toggle('muted', !playing);
    };

    const loadTrack = (next, autoPlay) => {
        idx = ((next % SONGS.length) + SONGS.length) % SONGS.length;
        localStorage.setItem('lolbeans_music_track_index', idx);
        audio.src = `audio/${encodeURIComponent(SONGS[idx].file)}`;
        audio.load();

        if (!autoPlay) {
            audio.pause();
            syncUI();
            return;
        }
        audio.play().then(syncUI).catch(syncUI);
    };

    loadTrack(idx, false);

    switchBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        loadTrack(idx + 1, !audio.paused);
    });

    playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!audio.paused) {
            audio.pause();
            syncUI();
            return;
        }
        if (!audio.src) {
            loadTrack(idx, true);
            return;
        }
        audio.play().then(syncUI).catch(() => {});
    });
}

function initEyes() {
    document.addEventListener('dragstart', (e) => {
        if (e.target instanceof HTMLImageElement) e.preventDefault();
    });

    const pupils = document.querySelectorAll('.bean-pupil');
    if (!pupils.length) return;

    document.addEventListener('pointermove', (e) => {
        for (const pupil of pupils) {
            const eye = pupil.parentElement.getBoundingClientRect();
            const dx = e.clientX - (eye.left + eye.width / 2);
            const dy = e.clientY - (eye.top + eye.height / 2);
            const dist = Math.hypot(dx, dy);
            const max = eye.width * 0.18;
            const scale = dist > 0 ? Math.min(1, max / dist) : 0;
            const flip = pupil.closest('.bean-side-left') ? -1 : 1;
            pupil.style.transform = `translate(calc(-50% + ${dx * scale * flip}px), calc(-50% + ${dy * scale}px))`;
        }
    });
}

function initBeanRain() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const host = document.querySelector('#bean-rain') || document.querySelector('.sub-screen-panel') || document.body;
    const wrap = document.createElement('div');
    wrap.className = 'bean-character-rain';

    const customImg = document.body.dataset.rainImage;
    const total = customImg ? 48 : 24;

    for (let i = 0; i < total; i++) {
        const img = document.createElement('img');
        const speed = (18 + Math.random() * 12) / (customImg ? 2 : 1);
        const num = String((i % 15) + 1).padStart(2, '0');
        img.src = customImg || `images/bean-rain/bean-${num}.png`;
        img.alt = '';
        img.className = 'bean-character-rain-drop';
        img.draggable = false;
        img.style.setProperty('--bean-x', `${Math.random() * 100}%`);
        img.style.setProperty('--bean-size', `${17 + Math.random() * 8}px`);
        img.style.setProperty('--bean-duration', `${speed}s`);
        img.style.setProperty('--bean-delay', `${-Math.random() * speed}s`);
        wrap.appendChild(img);
    }

    host.appendChild(wrap);

    document.addEventListener('contextmenu', (e) => {
        if (e.target.closest('.bean-character-rain')) e.preventDefault();
    });

    const clickables = 'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), summary, [role="button"], [onclick], [tabindex]:not([tabindex="-1"])';
    document.querySelectorAll(clickables).forEach((el) => {
        const style = getComputedStyle(el);
        if (style.position === 'static') el.classList.add('bean-rain-clickable-static');
        if (style.zIndex === 'auto' || style.zIndex === '0') el.classList.add('bean-rain-clickable-raised');
    });
}

function initDiscordBanner() {
    if (!document.body.hasAttribute('data-discord-invite')) return;

    const aside = document.createElement('aside');
    aside.className = 'discord-invite-container';
    aside.style.cssText = 'position: fixed !important; top: 83px !important; right: 12px !important; z-index: 120 !important;';

    const card = document.createElement('button');
    card.className = 'discord-invite';
    card.type = 'button';
    card.setAttribute('aria-expanded', 'false');
    card.setAttribute('aria-controls', 'discord-invite-go');

    const icon = document.createElement('img');
    icon.src = 'images/discord-server.png';
    icon.alt = '';

    const msg = document.createElement('span');
    msg.dataset.i18n = 'discordBanner';
    msg.textContent = 'Please consider joining our dc server for fun events! ';

    const url = document.createElement('span');
    url.className = 'discord-invite-url';
    url.textContent = 'https://discord.gg/Vzmw74CUjk';
    msg.appendChild(url);
    card.append(icon, msg);

    const go = document.createElement('a');
    go.className = 'discord-invite-go';
    go.id = 'discord-invite-go';
    go.href = 'https://discord.gg/Vzmw74CUjk';
    go.target = '_blank';
    go.rel = 'noopener noreferrer';
    go.textContent = 'GO!';
    go.hidden = true;

    card.addEventListener('click', () => {
        go.hidden = false;
        card.setAttribute('aria-expanded', 'true');
    });

    aside.append(card, go);
    document.body.appendChild(aside);
}

function translateKeyed(el, lang) {
    const key = el.dataset.i18n;
    const dict = siteTranslations[lang] || {};
    const hasCustom = dict[key] != null;
    const text = hasCustom ? dict[key] : siteTranslations.en[key];
    if (text == null) return;

    let replaced = false;
    for (const node of el.childNodes) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
            node.textContent = text;
            replaced = true;
            break;
        }
    }
    if (!replaced) {
        if (el.children.length) el.insertBefore(document.createTextNode(text), el.firstChild);
        else el.textContent = text;
    }

    const skipGoogle = hasCustom && lang !== 'en';
    if (skipGoogle) el.setAttribute('translate', 'no');
    else el.removeAttribute('translate');
    el.classList.toggle('notranslate', skipGoogle);
}

function applyDictionary(lang, root = document) {
    if (root.nodeType === Node.ELEMENT_NODE && root.hasAttribute('data-i18n')) {
        translateKeyed(root, lang);
    }
    root.querySelectorAll('[data-i18n]').forEach((el) => translateKeyed(el, lang));
}

function getCookie(name) {
    const match = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`));
    return match ? decodeURIComponent(match.slice(name.length + 1)) : '';
}

function setGoogleCookie(val) {
    const exp = val ? '' : '; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = `googtrans=${val}; path=/${exp}`;
    document.cookie = `googtrans=${val}; path=/; domain=${location.hostname}${exp}`;
}

function loadGoogleTranslate() {
    if (googleLoaded) return;
    googleLoaded = true;

    const css = document.createElement('style');
    css.textContent = `
        #google_translate_element { display: none !important; }
        .goog-te-banner-frame, .skiptranslate iframe, .VIpgJd-ZVi9od-ORHb-OEVmcd, .VIpgJd-ZVi9od-aZ2wEe-wOHMyf { display: none !important; }
        body { top: 0 !important; position: static !important; }
        .goog-tooltip, .goog-tooltip:hover { display: none !important; }
        .goog-text-highlight { background: none !important; box-shadow: none !important; }
    `;
    document.head.appendChild(css);

    const box = document.createElement('div');
    box.id = 'google_translate_element';
    box.setAttribute('translate', 'no');
    document.body.appendChild(box);

    window.googleTranslateElementInit = () => {
        new google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: Object.values(GOOGLE_CODES).join(','),
            autoDisplay: false
        }, 'google_translate_element');
    };

    const s = document.createElement('script');
    s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.async = true;
    document.head.appendChild(s);
}

function protectNames(node) {
    if (!keepSelector || !node) return;
    const el = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
    if (!el || el.nodeType !== Node.ELEMENT_NODE) return;

    const mark = (target) => {
        target.setAttribute('translate', 'no');
        target.classList.add('notranslate');
    };
    const hit = el.closest(keepSelector);
    if (hit) mark(hit);
    el.querySelectorAll(keepSelector).forEach(mark);
}

function applySiteLanguage(lang, reloadOnChange = false) {
    if (!siteTranslations[lang]) lang = 'en';

    applyDictionary(lang);
    protectNames(document.body);
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL_LANGS.includes(lang) ? 'rtl' : 'ltr';
    document.querySelectorAll('.lang-option').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    localStorage.setItem('siteLanguage', lang);

    const target = lang === 'en' ? '' : `/en/${GOOGLE_CODES[lang]}`;
    if (target !== getCookie('googtrans')) {
        setGoogleCookie(target);
        if (reloadOnChange) {
            location.reload();
            return;
        }
    }
    if (target) loadGoogleTranslate();
}

function initLanguageMenu() {
    const toggleBtn = document.getElementById('lang-toggle-btn');
    const menu = document.getElementById('lang-menu');
    if (toggleBtn && menu) {
        menu.setAttribute('translate', 'no');
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const open = menu.classList.toggle('open');
            toggleBtn.setAttribute('aria-expanded', open);
        });

        menu.querySelectorAll('.lang-option').forEach((opt) => {
            opt.addEventListener('click', () => {
                applySiteLanguage(opt.dataset.lang, true);
                menu.classList.remove('open');
                toggleBtn.setAttribute('aria-expanded', 'false');
            });
        });

        document.addEventListener('click', () => {
            menu.classList.remove('open');
            toggleBtn.setAttribute('aria-expanded', 'false');
        });
    }

    new MutationObserver((list) => {
        const lang = localStorage.getItem('siteLanguage') || 'en';
        for (const m of list) {
            for (const n of m.addedNodes) {
                if (n.nodeType === Node.ELEMENT_NODE) applyDictionary(lang, n);
                protectNames(n);
            }
        }
    }).observe(document.body, { childList: true, subtree: true });

    applySiteLanguage(localStorage.getItem('siteLanguage') || 'en');
}

document.addEventListener('DOMContentLoaded', () => {
    initMusicBox();
    initEyes();
    initBeanRain();
    initDiscordBanner();
    initLanguageMenu();
});

document.addEventListener('click', (e) => {
    const btn = e.target.closest('a, button');
    if (!btn) return;
    const label = btn.textContent.trim().toLowerCase();
    if (/\bfun fact\b|\bfact\b/.test(label)) {
        clickSfx.currentTime = 0;
        clickSfx.play().catch(() => {});
    }
});