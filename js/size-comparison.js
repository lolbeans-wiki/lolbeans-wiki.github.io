const beanHues = new Map(); // keeps each bean's random color stable while searching

function renderSizeComparison(searchTerm = '') {
    const stage = document.getElementById('size-comparison-stage');
    if (!stage) return;

    const rankedPlayers = leaderboardData
        .filter((player) => {
            const rank = Number(player.rawCells[0]);
            return Number.isInteger(rank) && rank >= 1 && rank <= 352 && player.name.trim().toLowerCase() !== 'doggywoof';
        })
        .sort((first, second) => Number(first.rawCells[0]) - Number(second.rawCells[0]));

    const joshy = rankedPlayers.find((player) => player.name.trim().toLowerCase() === 'joshy');
    stage.replaceChildren();
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

    const referenceScore = Number(joshy.score);
    const baseBeanWidth = 200; // Base width for Top 1
    const slowerByPercent = Math.max(0, (Number(matchedPlayer.score) / referenceScore - 1) * 100);
    const matchedBeanWidth = Math.max(20, baseBeanWidth / (1 + slowerByPercent / 100));

    // Top 1 Player (Left)
    const topFigure = document.createElement('figure');
    topFigure.className = 'size-comparison-player';
    topFigure.style.setProperty('--bean-width', `${baseBeanWidth}px`);

    const topImage = document.createElement('img');
    topImage.src = 'LolbeansRender.webp';
    topImage.alt = `Top 1: ${joshy.name}`;
    topImage.draggable = false;
    if (!beanHues.has(joshy.name)) beanHues.set(joshy.name, Math.floor(Math.random() * 360));
    topImage.style.filter = `hue-rotate(${beanHues.get(joshy.name)}deg) saturate(1.4)`;

    const topCaption = document.createElement('figcaption');
    topCaption.textContent = `#${Number(joshy.rawCells[0])} ${joshy.name} (Top 1)`;
    topFigure.append(topImage, topCaption);

    // Searched Player (Right)
    const matchedFigure = document.createElement('figure');
    matchedFigure.className = 'size-comparison-player';
    matchedFigure.style.setProperty('--bean-width', `${matchedBeanWidth}px`);

    const matchedImage = document.createElement('img');
    matchedImage.src = 'LolbeansRender.webp';
    matchedImage.alt = `${matchedPlayer.name}`;
    matchedImage.draggable = false;
    if (!beanHues.has(matchedPlayer.name)) beanHues.set(matchedPlayer.name, Math.floor(Math.random() * 360));
    matchedImage.style.filter = `hue-rotate(${beanHues.get(matchedPlayer.name)}deg) saturate(1.4)`;

    const matchedCaption = document.createElement('figcaption');
    matchedCaption.textContent = `#${Number(matchedPlayer.rawCells[0])} ${matchedPlayer.name} · ${slowerByPercent.toFixed(1)}% smaller`;
    matchedFigure.append(matchedImage, matchedCaption);

    stage.append(topFigure, matchedFigure);

    // Measure Lines (Ruler) positioned exactly at the top of their heads
    const topHeightPx = baseBeanWidth * 1.32;
    const matchedHeightPx = matchedBeanWidth * 1.32;

    const topRuler = document.createElement('div');
    topRuler.className = 'size-ruler';
    topRuler.style.setProperty('--ruler-bottom', `${topHeightPx + 40}px`);
    topRuler.innerHTML = `<div class="size-ruler-line" style="top: 0;"></div><span class="size-ruler-label">Top 1 Height</span>`;

    const matchedRuler = document.createElement('div');
    matchedRuler.className = 'size-ruler';
    matchedRuler.style.setProperty('--ruler-bottom', `${matchedHeightPx + 40}px`);
    matchedRuler.style.left = '50%';
    matchedRuler.innerHTML = `<div class="size-ruler-line" style="top: 0;"></div><span class="size-ruler-label">${slowerByPercent.toFixed(1)}% Smaller</span>`;

    stage.append(topRuler, matchedRuler);
}

document.getElementById('size-player-search').addEventListener('input', (event) => {
    renderSizeComparison(event.target.value);
});

loadSheetData();
