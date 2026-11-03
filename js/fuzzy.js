const FUZZY_EXACT_SCORE = 1000;

function normalizeName(value) {
    return String(value).toLowerCase().trim().replace(/[^a-z0-9]/g, '');
}

function levenshteinDistance(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    let previous = new Array(b.length + 1);
    let current = new Array(b.length + 1);
    for (let j = 0; j <= b.length; j++) previous[j] = j;
    for (let i = 1; i <= a.length; i++) {
        current[0] = i;
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            current[j] = Math.min(
                previous[j] + 1,      // deletion
                current[j - 1] + 1,   // insertion
                previous[j - 1] + cost // substitution
            );
        }
        [previous, current] = [current, previous];
    }
    return previous[b.length];
}

function fuzzySearchPlayers(query, limit = 7) {
    const search = String(query).trim();
    if (!search || typeof leaderboardData === 'undefined' || !leaderboardData.length) return [];

    const results = fuzzysort.go(search, leaderboardData, {
        limit: limit || 0,
        key: 'name'
    });

    const normalizedQuery = normalizeName(search);
    return results.map(result => ({
        player: result.obj,
        index: leaderboardData.indexOf(result.obj),
        score: normalizeName(result.obj.name) === normalizedQuery ? FUZZY_EXACT_SCORE : result.score
    }));
}

function closestPlayerNames(query, limit = 3) {
    const normalized = normalizeName(query);
    if (!normalized || typeof leaderboardData === 'undefined' || !leaderboardData.length) return [];
    return leaderboardData
        .map((player, index) => {
            const candidate = normalizeName(player.name);
            const maxLength = Math.max(normalized.length, candidate.length) || 1;
            const similarity = candidate.includes(normalized)
                ? 1
                : 1 - levenshteinDistance(normalized, candidate) / maxLength;
            return { player, index, similarity };
        })
        .sort((first, second) => second.similarity - first.similarity || first.index - second.index)
        .slice(0, limit);
}

// attach click event listnte to input
function attachNameAutocomplete(options) {
    const input = options.input;
    const listEl = options.listEl;
    const limit = options.limit || 7;
    const onSelect = options.onSelect;
    if (!input || !listEl) return;

    let items = [];
    let activeIndex = -1;

    function close() {
        items = [];
        activeIndex = -1;
        listEl.replaceChildren();
        listEl.classList.remove('open');
    }

    function highlight() {
        Array.from(listEl.children).forEach((child, idx) => {
            child.classList.toggle('active', idx === activeIndex);
        });
    }

    function choose(item) {
        if (!item) return;
        input.value = item.player.name;
        close();
        if (onSelect) onSelect(item.player);
    }

    input.addEventListener('input', () => {
        if (!input.value.trim()) {
            close();
            return;
        }
        items = fuzzySearchPlayers(input.value, limit);
        activeIndex = -1;
        listEl.replaceChildren();
        if (!items.length) {
            listEl.classList.remove('open');
            return;
        }
        items.forEach(item => {
            const row = document.createElement('div');
            row.className = 'suggestion-item';
            const name = document.createElement('span');
            name.textContent = item.player.name;
            const meta = document.createElement('span');
            meta.className = 'suggestion-meta';
            meta.textContent = `#${item.index + 1}`;
            row.append(name, meta);
            // make suree we fire the event before closing
            row.addEventListener('mousedown', (event) => {
                event.preventDefault();
                choose(item);
            });
            listEl.appendChild(row);
        });
        listEl.classList.add('open');
    });

    input.addEventListener('focus', () => {
        if (input.value.trim() && !items.length) input.dispatchEvent(new Event('input'));
    });

    input.addEventListener('blur', () => {
        // delay the click for events
        setTimeout(close, 150);
    });

    input.addEventListener('keydown', (event) => {
        if (!items.length) return;
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            activeIndex = (activeIndex + 1) % items.length;
            highlight();
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            activeIndex = (activeIndex - 1 + items.length) % items.length;
            highlight();
        } else if (event.key === 'Enter' && activeIndex >= 0) {
            event.preventDefault();
            choose(items[activeIndex]);
        } else if (event.key === 'Escape') {
            close();
        }
    });
}
