document.addEventListener('DOMContentLoaded', () => {

    // 1. Googly Eyes Logic
    document.addEventListener('dragstart', (e) => {
        if (e.target instanceof HTMLImageElement) e.preventDefault();
    });

    const pupils = document.querySelectorAll('.bean-pupil');
    if (pupils.length > 0) {
        document.addEventListener('pointermove', (e) => {
            pupils.forEach((pupil) => {
                const eye = pupil.parentElement.getBoundingClientRect();
                const deltaX = e.clientX - (eye.left + eye.width / 2);
                const deltaY = e.clientY - (eye.top + eye.height / 2);
                const distance = Math.hypot(deltaX, deltaY);
                const maxOffset = eye.width * 0.18;
                const movement = distance > 0 ? Math.min(1, maxOffset / distance) : 0;
                const isMirrored = pupil.closest('.bean-side-left') !== null;
                const offsetX = deltaX * movement * (isMirrored ? -1 : 1);
                const offsetY = deltaY * movement;
                pupil.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
            });
        });
    }

    // 2. Bean Rain Animation Logic
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const beanRainContainer = document.querySelector('#bean-rain') || document.querySelector('.sub-screen-panel');
        const characterRain = document.createElement('div');
        characterRain.className = 'bean-character-rain';
        const beansFrag = document.createDocumentFragment();
        const rainImage = document.body.dataset.rainImage;
        const beanCount = rainImage ? 48 : 24;

        for (let i = 0; i < beanCount; i += 1) {
            const bean = document.createElement('img');
            const duration = (18 + Math.random() * 12) / (rainImage ? 2 : 1);
            const beanImageIndex = (i % 15) + 1;
            bean.src = rainImage || `images/bean-rain/bean-${String(beanImageIndex).padStart(2, '0')}.png`;
            bean.alt = '';
            bean.className = 'bean-character-rain-drop';
            bean.draggable = false;
            bean.style.setProperty('--bean-x', `${Math.random() * 100}%`);
            bean.style.setProperty('--bean-size', `${17 + Math.random() * 8}px`);
            bean.style.setProperty('--bean-duration', `${duration}s`);
            bean.style.setProperty('--bean-delay', `${-Math.random() * duration}s`);
            beansFrag.appendChild(bean);
        }

        characterRain.appendChild(beansFrag);
        if (beanRainContainer) {
            beanRainContainer.appendChild(characterRain);
        } else {
            document.body.appendChild(characterRain);
        }

        document.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.bean-character-rain')) e.preventDefault();
        });

        const clickableSelector = 'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), summary, [role="button"], [onclick], [tabindex]:not([tabindex="-1"])';

        document.querySelectorAll(clickableSelector).forEach((el) => {
            const compStyle = window.getComputedStyle(el);
            if (compStyle.position === 'static') el.classList.add('bean-rain-clickable-static');
            if (compStyle.zIndex === 'auto' || compStyle.zIndex === '0') el.classList.add('bean-rain-clickable-raised');
        });
    }

    // 3. Dynamic Discord Invite Banner
    if (document.body.hasAttribute('data-discord-invite')) {
        const discordAside = document.createElement('aside');
        discordAside.className = 'discord-invite-container';
        discordAside.style.cssText = 'position: fixed !important; top: 83px !important; right: 12px !important; z-index: 120 !important;';

        const discordCard = document.createElement('button');
        discordCard.className = 'discord-invite';
        discordCard.type = 'button';
        discordCard.setAttribute('aria-expanded', 'false');
        discordCard.setAttribute('aria-controls', 'discord-invite-go');

        const discordImg = document.createElement('img');
        discordImg.src = 'images/discord-server.png';
        discordImg.alt = '';

        const discordMsg = document.createElement('span');
        discordMsg.setAttribute('data-i18n', 'discordBanner');
        discordMsg.textContent = 'Please consider joining our dc server for fun events! ';

        const discordUrlSpan = document.createElement('span');
        discordUrlSpan.className = 'discord-invite-url';
        discordUrlSpan.textContent = 'https://discord.gg/Vzmw74CUjk';
        discordMsg.appendChild(discordUrlSpan);

        discordCard.append(discordImg, discordMsg);

        const discordGo = document.createElement('a');
        discordGo.className = 'discord-invite-go';
        discordGo.id = 'discord-invite-go';
        discordGo.href = 'https://discord.gg/Vzmw74CUjk';
        discordGo.target = '_blank';
        discordGo.rel = 'noopener noreferrer';
        discordGo.textContent = 'GO!';
        discordGo.hidden = true;

        discordCard.addEventListener('click', () => {
            discordGo.hidden = false;
            discordCard.setAttribute('aria-expanded', 'true');
        });

        discordAside.append(discordCard, discordGo);
        document.body.appendChild(discordAside);
    }

    // 4. Multi-Language Dictionary & Translation Engine
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
            // Tag Guide Section Keys
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
            discordBanner: "मजेदार कार्यक्रमों के लिए हमारे डिस्कोर्ड सर्वर से जुड़ें! ",
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

    // ===== TRANSLATION ENGINE =====
    // Your hand-written dictionary (above) is used for elements marked data-i18n.
    // EVERYTHING ELSE on the page is translated automatically by Google Translate.
    const RTL_LANGS = ['ar', 'ur'];
    const GOOGLE_CODES = { bn: 'bn', fr: 'fr', hi: 'hi', id: 'id', ja: 'ja', zh: 'zh-CN', ar: 'ar', pt: 'pt', ru: 'ru', es: 'es', ur: 'ur' };
    let googleLoaded = false;

    // --- Part A: your dictionary, for data-i18n elements ---
    function translateKeyed(el, lang) {
        const key = el.getAttribute('data-i18n');
        const dict = siteTranslations[lang] || {};
        const hand = dict[key] != null;                       // do we have a hand-written translation?
        const value = hand ? dict[key] : siteTranslations.en[key];
        if (value == null) return;

        let done = false;
        for (const node of el.childNodes) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
                node.textContent = value;
                done = true;
                break;
            }
        }
        if (!done) {
            if (el.children.length) el.insertBefore(document.createTextNode(value), el.firstChild);
            else el.textContent = value;
        }

        // Hand-written text is protected from Google; anything else is left for Google to translate
        if (hand && lang !== 'en') {
            el.setAttribute('translate', 'no');
            el.classList.add('notranslate');
        } else {
            el.removeAttribute('translate');
            el.classList.remove('notranslate');
        }
    }

    function applyDictionary(lang, root) {
        const scope = root || document;
        if (scope.nodeType === Node.ELEMENT_NODE && scope.hasAttribute('data-i18n')) translateKeyed(scope, lang);
        scope.querySelectorAll('[data-i18n]').forEach((el) => translateKeyed(el, lang));
    }

    // --- Part B: Google Translate for everything else ---
    function getCookie(name) {
        const row = document.cookie.split('; ').find((r) => r.startsWith(name + '='));
        return row ? decodeURIComponent(row.slice(name.length + 1)) : '';
    }

    function setGoogleCookie(value) {
        const expires = value ? '' : '; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'googtrans=' + value + '; path=/' + expires;
        document.cookie = 'googtrans=' + value + '; path=/; domain=' + location.hostname + expires;
    }

    function loadGoogleTranslate() {
        if (googleLoaded) return;
        googleLoaded = true;

        // Hide Google's toolbar/banner so only your own language menu is visible
        const style = document.createElement('style');
        style.textContent = [
            '#google_translate_element{display:none !important}',
            '.goog-te-banner-frame,.skiptranslate iframe,.VIpgJd-ZVi9od-ORHb-OEVmcd,.VIpgJd-ZVi9od-aZ2wEe-wOHMyf{display:none !important}',
            'body{top:0 !important;position:static !important}',
            '.goog-tooltip,.goog-tooltip:hover{display:none !important}',
            '.goog-text-highlight{background:none !important;box-shadow:none !important}'
        ].join('\n');
        document.head.appendChild(style);

        const holder = document.createElement('div');
        holder.id = 'google_translate_element';
        holder.setAttribute('translate', 'no');
        document.body.appendChild(holder);

        window.googleTranslateElementInit = function () {
            new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: Object.values(GOOGLE_CODES).join(','),
                autoDisplay: false
            }, 'google_translate_element');
        };

        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.head.appendChild(script);
    }

    // ===== KEEP PLAYER NAMES IN ENGLISH (never machine-translated) =====
    // Add more selectors to any list below to protect more things.
    // '*' = every page. Other keys are page file names (without .html).
    // You can also add  translate="no"  or  data-keep-english  to any element in the HTML.
    const NAME_GUESSES = ['[class*="name" i]', '[class*="row" i]', '[class*="entry" i]', '[class*="item" i]', '[class*="result" i]', '[class*="suggest" i]', 'td', 'li'];
    const KEEP_ENGLISH = {
        '*': ['input', 'datalist', '[data-keep-english]'],
        'player-stats': NAME_GUESSES,
        'stats2': NAME_GUESSES,
        'win-grinders': NAME_GUESSES,
        // Size comparison: only the player-name part of each card (keeps "smaller than leader" translated)
        'size-comparison': ['[class*="name" i]', '[class*="player" i] h3', '[class*="player" i] h4', '[class*="card" i] h3', '[class*="card" i] h4', '[class*="card" i] strong', '[class*="card" i] b'],
        'server-stats': NAME_GUESSES.concat(['button'])
    };
    const pageName = (location.pathname.split('/').pop() || 'index').replace(/\.html?$/i, '').toLowerCase();
    const keepSelector = [].concat(KEEP_ENGLISH['*'], KEEP_ENGLISH[pageName] || []).join(',');

    function protectNames(node) {
        if (!keepSelector || !node) return;
        const el = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
        if (!el || el.nodeType !== Node.ELEMENT_NODE) return;
        const mark = (e) => { e.setAttribute('translate', 'no'); e.classList.add('notranslate'); };
        const hit = el.closest(keepSelector);
        if (hit) mark(hit);
        el.querySelectorAll(keepSelector).forEach(mark);
    }

    // --- Main function (same name your menu already uses) ---
    function applySiteLanguage(lang, userInitiated) {
        if (!siteTranslations[lang]) lang = 'en';

        applyDictionary(lang);
        protectNames(document.body);
        document.documentElement.lang = lang;
        document.documentElement.dir = RTL_LANGS.includes(lang) ? 'rtl' : 'ltr';
        document.querySelectorAll('.lang-option').forEach((btn) => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        localStorage.setItem('siteLanguage', lang);

        // Tell Google which language to use (it remembers via a cookie, so every page matches)
        const wanted = lang === 'en' ? '' : '/en/' + GOOGLE_CODES[lang];
        const had = getCookie('googtrans');
        if (wanted !== had) {
            setGoogleCookie(wanted);
            if (userInitiated) { location.reload(); return; }   // clean switch between languages
        }
        if (wanted) loadGoogleTranslate();
    }

    // Keep your dictionary working for elements other scripts add later
    new MutationObserver((mutations) => {
        const lang = localStorage.getItem('siteLanguage') || 'en';
        mutations.forEach((m) => m.addedNodes.forEach((n) => {
            if (n.nodeType === Node.ELEMENT_NODE) applyDictionary(lang, n);
            protectNames(n);
        }));
    }).observe(document.body, { childList: true, subtree: true });

    // Setup Dropdown Events (Only runs on pages where the language button exists)
    const toggleBtn = document.getElementById('lang-toggle-btn');
    const langMenu = document.getElementById('lang-menu');
    const langOptions = document.querySelectorAll('.lang-option');

    if (toggleBtn && langMenu) {
        langMenu.setAttribute('translate', 'no'); // keep language names like "Español" untouched
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = langMenu.classList.toggle('open');
            toggleBtn.setAttribute('aria-expanded', isOpen);
        });

        langOptions.forEach((option) => {
            option.addEventListener('click', () => {
                applySiteLanguage(option.dataset.lang, true);
                langMenu.classList.remove('open');
                toggleBtn.setAttribute('aria-expanded', 'false');
            });
        });

        document.addEventListener('click', () => {
            langMenu.classList.remove('open');
            toggleBtn.setAttribute('aria-expanded', 'false');
        });
    }

    // Automatically apply saved language on EVERY page load
    const savedLang = localStorage.getItem('siteLanguage') || 'en';
    applySiteLanguage(savedLang);
});