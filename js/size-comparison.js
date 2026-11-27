const hues = new Map();
const TOP_WIDTH = 200;
const CHART_SCALE = 0.45;
const CHART_SENS = 5;
const BEAN_IMG = 'images/LolbeansRender.webp';
let rulers = [];

function placeRulers() {
    const stage = document.getElementById('size-comparison-stage');
    if (!stage) return;
    const top = stage.getBoundingClientRect().top;
    rulers.forEach(({ ruler, image }) => {
        ruler.style.setProperty('--ruler-top', `${image.getBoundingClientRect().top - top + 9}px`);
    });
}

function rankedPlayers() {
    return leaderboardData
        .filter((p) => {
            const rank = Number(p.rawCells[0]);
            return Number.isInteger(rank) && rank >= 1 && rank <= 352 && p.name.trim().toLowerCase() !== 'doggywoof';
        })
        .sort((a, b) => Number(a.rawCells[0]) - Number(b.rawCells[0]));
}

function smallerBy(p, ref) {
    return Math.max(0, (Number(p.score) / Number(ref.score) - 1) * 100);
}

function beanWidth(p, ref, sens = 1) {
    const diff = smallerBy(p, ref) * sens;
    return Math.max(20, TOP_WIDTH / (1 + diff / 100));
}

function hueFor(p) {
    if (!hues.has(p.name)) hues.set(p.name, Math.floor(Math.random() * 360));
    return hues.get(p.name);
}

function beanImage(p, width, loading = 'eager') {
    const img = document.createElement('img');
    img.src = BEAN_IMG;
    img.alt = `${p.name} bean`;
    img.draggable = false;
    img.loading = loading;
    img.style.filter = `hue-rotate(${hueFor(p)}deg) saturate(1.4)`;
    img.style.setProperty('--bean-width', `${width}px`);
    return img;
}

function renderLeaderboard(players, ref) {
    const rows = document.getElementById('size-leaderboard-rows');
    const status = document.getElementById('size-leaderboard-status');
    if (!rows || !status) return;

    rows.replaceChildren();
    if (!players.length || !ref || !Number(ref.score)) {
        status.hidden = false;
        status.textContent = players.length
            ? 'Size differences are unavailable because the Top 1 score was not found.'
            : 'Loading leaderboard...';
        return;
    }

    status.hidden = true;
    const frag = document.createDocumentFragment();
    players.forEach((p, i) => {
        const row = document.createElement('li');
        row.className = 'size-player-chart-row';

        const details = document.createElement('div');
        details.className = 'size-player-chart-details';
        const name = document.createElement('h3');
        const label = document.createElement('p');
        name.textContent = `#${Number(p.rawCells[0])} ${p.name}`;
        label.textContent = i === 0 ? 'Top 1' : `${smallerBy(p, ref).toFixed(1)}% smaller than Top 1`;
        details.append(name, label);

        const figure = document.createElement('figure');
        figure.className = 'size-player-chart-figure';
        figure.appendChild(beanImage(p, beanWidth(p, ref, CHART_SENS) * CHART_SCALE, 'lazy'));

        row.append(details, figure);
        frag.appendChild(row);
    });
    rows.appendChild(frag);
}

function note(stage, text, color) {
    const p = document.createElement('p');
    p.textContent = text;
    p.style.color = color;
    p.style.fontSize = '14px';
    stage.appendChild(p);
}

function renderSizeComparison(searchTerm = '') {
    const stage = document.getElementById('size-comparison-stage');
    if (!stage) return;

    const players = rankedPlayers();
    const joshy = players.find((p) => p.name.trim().toLowerCase() === 'joshy');
    renderLeaderboard(players, joshy);
    stage.replaceChildren();
    rulers = [];
    if (!players.length || !joshy || !joshy.score) return;

    const query = searchTerm.trim().toLowerCase();
    if (!query) {
        note(stage, 'Type a player name above to compare size with Top 1.', '#888888');
        return;
    }

    const match = players.find((p) => p.name.toLowerCase().includes(query));
    if (!match) {
        note(stage, 'Player not found.', '#ff4d4d');
        return;
    }

    const percent = smallerBy(match, joshy);

    const topFigure = document.createElement('figure');
    topFigure.className = 'size-comparison-player';
    const topImage = beanImage(joshy, TOP_WIDTH);
    topImage.addEventListener('load', placeRulers);
    const topCaption = document.createElement('figcaption');
    topCaption.textContent = `#${Number(joshy.rawCells[0])} ${joshy.name} (Top 1)`;
    topFigure.append(topImage, topCaption);

    const matchFigure = document.createElement('figure');
    matchFigure.className = 'size-comparison-player';
    const matchImage = beanImage(match, beanWidth(match, joshy));
    matchImage.addEventListener('load', placeRulers);
    const matchCaption = document.createElement('figcaption');
    matchCaption.textContent = `#${Number(match.rawCells[0])} ${match.name} · ${percent.toFixed(1)}% smaller`;
    matchFigure.append(matchImage, matchCaption);

    stage.append(topFigure, matchFigure);

    const topRuler = document.createElement('div');
    topRuler.className = 'size-ruler';
    topRuler.innerHTML = `<div class="size-ruler-line" style="top: 0;"></div><span class="size-ruler-label">Top 1 Height</span>`;

    const matchRuler = document.createElement('div');
    matchRuler.className = 'size-ruler';
    matchRuler.style.left = '50%';
    matchRuler.innerHTML = `<div class="size-ruler-line" style="top: 0;"></div><span class="size-ruler-label">${percent.toFixed(1)}% Smaller</span>`;

    stage.append(topRuler, matchRuler);
    rulers = [
        { ruler: topRuler, image: topImage },
        { ruler: matchRuler, image: matchImage }
    ];
    placeRulers();
}

const search = document.getElementById('size-player-search');
search.addEventListener('input', (e) => renderSizeComparison(e.target.value));

attachNameAutocomplete({
    input: search,
    listEl: document.getElementById('size-name-suggestions'),
    onSelect: (p) => renderSizeComparison(p.name)
});

loadSheetData();
window.addEventListener('resize', placeRulers);