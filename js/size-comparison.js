const beanHues = new Map(); // keeps each bean's random color stable while searching
const TOP_BEAN_WIDTH = 200;
const CHART_BEAN_SCALE = 0.45;
const CHART_SIZE_SENSITIVITY = 5;
const BEAN_IMAGE_SOURCE = 'images/LolbeansRender.webp';
let sizeRulerPositions = [];

function positionSizeRulers() {
    const stage = document.getElementById('size-comparison-stage');
    if (!stage) return;

    const stageTop = stage.getBoundingClientRect().top;
    sizeRulerPositions.forEach(({ ruler, image }) => {
        ruler.style.setProperty('--ruler-top', `${image.getBoundingClientRect().top - stageTop + 9}px`);
    });
}

function getRankedPlayers() {
    return leaderboardData
        .filter((player) => {
            const rank = Number(player.rawCells[0]);
            return Number.isInteger(rank)
                && rank >= 1
                && rank <= 352
                && player.name.trim().toLowerCase() !== 'doggywoof';
        })
        .sort((first, second) => Number(first.rawCells[0]) - Number(second.rawCells[0]));
}

function getSizeDifferencePercent(player, referencePlayer) {
    return Math.max(0, (Number(player.score) / Number(referencePlayer.score) - 1) * 100);
}

function getBeanWidth(player, referencePlayer) {
    const difference = getSizeDifferencePercent(player, referencePlayer);
    return Math.max(20, TOP_BEAN_WIDTH / (1 + difference / 100));
}

function getChartBeanWidth(player, referencePlayer) {
    const difference = getSizeDifferencePercent(player, referencePlayer) * CHART_SIZE_SENSITIVITY;
    return Math.max(20, TOP_BEAN_WIDTH / (1 + difference / 100)) * CHART_BEAN_SCALE;
}

function getBeanHue(player) {
    if (!beanHues.has(player.name)) beanHues.set(player.name, Math.floor(Math.random() * 360));
    return beanHues.get(player.name);
}

function createBeanImage(player, width, loading = 'eager') {
    const image = document.createElement('img');
    image.src = BEAN_IMAGE_SOURCE;
    image.alt = `${player.name} bean`;
    image.draggable = false;
    image.loading = loading;
    image.style.filter = `hue-rotate(${getBeanHue(player)}deg) saturate(1.4)`;
    image.style.setProperty('--bean-width', `${width}px`);
    return image;
}

function renderSizeLeaderboard(rankedPlayers, referencePlayer) {
    const rows = document.getElementById('size-leaderboard-rows');
    const status = document.getElementById('size-leaderboard-status');
    if (!rows || !status) return;

    rows.replaceChildren();
    if (!rankedPlayers.length || !referencePlayer || !Number(referencePlayer.score)) {
        status.hidden = false;
        status.textContent = rankedPlayers.length
            ? 'Size differences are unavailable because the Top 1 score was not found.'
            : 'Loading leaderboard...';
        return;
    }

    status.hidden = true;
    const fragment = document.createDocumentFragment();
    rankedPlayers.forEach((player, index) => {
        const row = document.createElement('li');
        row.className = 'size-player-chart-row';
        const details = document.createElement('div');
        details.className = 'size-player-chart-details';
        const name = document.createElement('h3');
        const differenceLabel = document.createElement('p');
        const difference = getSizeDifferencePercent(player, referencePlayer);

        name.textContent = `#${Number(player.rawCells[0])} ${player.name}`;
        differenceLabel.textContent = index === 0
            ? 'Top 1'
            : `${difference.toFixed(1)}% smaller than Top 1`;
        details.append(name, differenceLabel);

        const figure = document.createElement('figure');
        figure.className = 'size-player-chart-figure';
        figure.appendChild(createBeanImage(player, getChartBeanWidth(player, referencePlayer), 'lazy'));
        row.append(details, figure);
        fragment.appendChild(row);
    });
    rows.appendChild(fragment);
}

function renderSizeComparison(searchTerm = '') {
    const stage = document.getElementById('size-comparison-stage');
    if (!stage) return;

    const rankedPlayers = getRankedPlayers();
    const joshy = rankedPlayers.find((player) => player.name.trim().toLowerCase() === 'joshy');
    renderSizeLeaderboard(rankedPlayers, joshy);
    stage.replaceChildren();
    sizeRulerPositions = [];
    if (!rankedPlayers.length || !joshy || !joshy.score) return;

    const query = searchTerm.trim().toLowerCase();
    if (!query) {
        const placeholder = document.createElement('p');
        placeholder.textContent = 'Type a player name above to compare size with Top 1.';
        placeholder.style.color = '#888888';
        placeholder.style.fontSize = '14px';
        stage.appendChild(placeholder);
        return;
    }

    const matchedPlayer = rankedPlayers.find((player) => player.name.toLowerCase().includes(query));
    if (!matchedPlayer) {
        const notFound = document.createElement('p');
        notFound.textContent = 'Player not found.';
        notFound.style.color = '#ff4d4d';
        notFound.style.fontSize = '14px';
        stage.appendChild(notFound);
        return;
    }

    const slowerByPercent = getSizeDifferencePercent(matchedPlayer, joshy);
    const matchedBeanWidth = getBeanWidth(matchedPlayer, joshy);

    // Top 1 Player (Left)
    const topFigure = document.createElement('figure');
    topFigure.className = 'size-comparison-player';
    const topImage = createBeanImage(joshy, TOP_BEAN_WIDTH);
    topImage.addEventListener('load', positionSizeRulers);

    const topCaption = document.createElement('figcaption');
    topCaption.textContent = `#${Number(joshy.rawCells[0])} ${joshy.name} (Top 1)`;
    topFigure.append(topImage, topCaption);

    // Searched Player (Right)
    const matchedFigure = document.createElement('figure');
    matchedFigure.className = 'size-comparison-player';
    const matchedImage = createBeanImage(matchedPlayer, matchedBeanWidth);
    matchedImage.addEventListener('load', positionSizeRulers);

    const matchedCaption = document.createElement('figcaption');
    matchedCaption.textContent = `#${Number(matchedPlayer.rawCells[0])} ${matchedPlayer.name} · ${slowerByPercent.toFixed(1)}% smaller`;
    matchedFigure.append(matchedImage, matchedCaption);

    stage.append(topFigure, matchedFigure);

    // Measure Lines (Ruler) positioned exactly at the top of their heads
    const topRuler = document.createElement('div');
    topRuler.className = 'size-ruler';
    topRuler.innerHTML = `<div class="size-ruler-line" style="top: 0;"></div><span class="size-ruler-label">Top 1 Height</span>`;

    const matchedRuler = document.createElement('div');
    matchedRuler.className = 'size-ruler';
    matchedRuler.style.left = '50%';
    matchedRuler.innerHTML = `<div class="size-ruler-line" style="top: 0;"></div><span class="size-ruler-label">${slowerByPercent.toFixed(1)}% Smaller</span>`;

    stage.append(topRuler, matchedRuler);
    sizeRulerPositions = [
        { ruler: topRuler, image: topImage },
        { ruler: matchedRuler, image: matchedImage }
    ];
    positionSizeRulers();
}

document.getElementById('size-player-search').addEventListener('input', (event) => {
    renderSizeComparison(event.target.value);
});

attachNameAutocomplete({
    input: document.getElementById('size-player-search'),
    listEl: document.getElementById('size-name-suggestions'),
    onSelect: (player) => renderSizeComparison(player.name)
});

loadSheetData();
window.addEventListener('resize', positionSizeRulers);
