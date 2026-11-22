const BOOST = 1000;

function stripName(s) {
    return String(s).toLowerCase().trim().replace(/[^a-z0-9]/g, '');
}

function dist(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;

    let row1 = [];
    let row2 = [];
    for (let j = 0; j <= b.length; j++) row1[j] = j;

    for (let i = 1; i <= a.length; i++) {
        row2[0] = i;
        for (let j = 1; j <= b.length; j++) {
            const c = a[i - 1] === b[j - 1] ? 0 : 1;
            row2[j] = Math.min(row1[j] + 1, row2[j - 1] + 1, row1[j - 1] + c);
        }
        row1 = row2;
        row2 = [];
    }
    return row1[b.length];
}

function fuzzySearchPlayers(query, limit = 7) {
    const q = String(query).trim();
    if (!q || typeof leaderboardData === 'undefined' || !leaderboardData.length) return [];

    const hits = fuzzysort.go(q, leaderboardData, { limit: limit || 0, key: 'name' });
    const norm = stripName(q);

    return hits.map(h => ({
        player: h.obj,
        index: leaderboardData.indexOf(h.obj),
        score: stripName(h.obj.name) === norm ? BOOST : h.score
    }));
}

function closestPlayerNames(query, limit = 3) {
    const norm = stripName(query);
    if (!norm || typeof leaderboardData === 'undefined' || !leaderboardData.length) return [];

    return leaderboardData
        .map((player, index) => {
            const clean = stripName(player.name);
            const max = Math.max(norm.length, clean.length) || 1;
            const similarity = clean.includes(norm) ? 1 : 1 - dist(norm, clean) / max;
            return { player, index, similarity };
        })
        .sort((x, y) => y.similarity - x.similarity || x.index - y.index)
        .slice(0, limit);
}

// attach click event listnte to input
function attachNameAutocomplete(cfg) {
    const input = cfg.input;
    const listEl = cfg.listEl;
    const limit = cfg.limit || 7;
    const onSelect = cfg.onSelect;
    if (!input || !listEl) return;

    let list = [];
    let cur = -1;

    function close() {
        list = [];
        cur = -1;
        listEl.innerHTML = '';
        listEl.classList.remove('open');
    }

    function paintActive() {
        for (let i = 0; i < listEl.children.length; i++) {
            listEl.children[i].classList.toggle('active', i === cur);
        }
    }

    function select(item) {
        if (!item) return;
        input.value = item.player.name;
        close();
        if (onSelect) onSelect(item.player);
    }

    input.addEventListener('input', () => {
        if (!input.value.trim()) return close();

        list = fuzzySearchPlayers(input.value, limit);
        cur = -1;
        listEl.innerHTML = '';

        if (!list.length) {
            listEl.classList.remove('open');
            return;
        }

        list.forEach(item => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';

            const n = document.createElement('span');
            n.textContent = item.player.name;

            const r = document.createElement('span');
            r.className = 'suggestion-meta';
            r.textContent = '#' + (item.index + 1);

            div.append(n, r);
            // make suree we fire the event before closing
            div.addEventListener('mousedown', e => {
                e.preventDefault();
                select(item);
            });
            listEl.appendChild(div);
        });

        listEl.classList.add('open');
    });

    input.addEventListener('focus', () => {
        if (input.value.trim() && !list.length) input.dispatchEvent(new Event('input'));
    });

    input.addEventListener('blur', () => {
        // delay the click for events
        setTimeout(close, 150);
    });

    input.addEventListener('keydown', e => {
        if (!list.length) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            cur = (cur + 1) % list.length;
            paintActive();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            cur = (cur - 1 + list.length) % list.length;
            paintActive();
        } else if (e.key === 'Enter' && cur >= 0) {
            e.preventDefault();
            select(list[cur]);
        } else if (e.key === 'Escape') {
            close();
        }
    });
}