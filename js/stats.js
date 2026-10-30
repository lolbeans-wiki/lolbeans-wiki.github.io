function getMapEvaluation(mapIndex, mapName, time) {
    const t = parseFloat(time);
    if (isNaN(t) || t === 0) return `${mapName} (${time}): N/A`;
    let evalText = "";
    const m = mapIndex + 1;
    if (m === 1) {
        if (t >= 34) evalText = "Fantastic";
        else if (t >= 1.000 && t <= 39.999) evalText = "Very good Beanie!";
        else if (t >= 40.000 && t <= 45.999) evalText = "Reasonable";
        else if (t >= 46.000 && t <= 49.999) evalText = "Needs improvement";
        else if (t >= 50.000 && t <= 66.999) evalText = "L time, lock in";
        else evalText = "Bad";
    } else if (m === 2) {
        if (t <= 30) evalText = "Fantastic";
        else if (t >= 21.000 && t <= 33.999) evalText = "Very good Beanie!";
        else if (t >= 34.000 && t <= 39.999) evalText = "Reasonable";
        else if (t >= 40.000 && t <= 45.999) evalText = "Needs improvement";
        else if (t >= 46.000 && t <= 66.999) evalText = "L time, lock in";
        else if (t >= 67.000 || t >= 69.999) evalText = "Funny number";
        else evalText = "Bad";
    } else if (m === 3) {
        if (t <= 12) evalText = "HOW?!";
        else if (t >= 13.000 && t <= 20.999) evalText = "Unbelievable";
        else if (t >= 21.000 && t <= 30.999) evalText = "Very nice";
        else if (t >= 31.000 && t <= 45.999) evalText = "Needs improvement";
        else if (t >= 46.000 && t <= 70.999) evalText = "Bad";
        else evalText = "Lock in";
    } else if (m === 4) {
        if (t <= 3) evalText = "W pusher";
        else if (t >= 1.000 && t <= 9.999) evalText = "Fantastic";
        else if (t >= 10.000 && t <= 19.999) evalText = "Rly good";
        else if (t >= 20.000 && t <= 30.999) evalText = "Not bad";
        else if (t >= 31.000 && t <= 50.999) evalText = "needs improvement";
        else evalText = "bad";
    } else if (m === 5) {
        if (t <= 34) evalText = "Amazing";
        else if (t >= 1.000 && t <= 39.999) evalText = "Nice!";
        else if (t >= 40.000 && t <= 49.999) evalText = "Mediocre";
        else if (t >= 50.000 && t <= 70.999) evalText = "Its Brainrot so okay";
        else evalText = "Bad";
    } else if (m === 6) {
        if (t <= 15) evalText = "AMAZINIGNING!!!";
        else if (t >= 1.000 && t <= 20.999) evalText = "Very Nice";
        else if (t >= 21.000 && t <= 30.999) evalText = "Good, can improve still";
        else if (t >= 31.000 && t <= 50.999) evalText = "Improvement needed";
        else evalText = "Horrible man";
    } else if (m === 7) {
        if (t <= 34) evalText = "Amazing!";
        else if (t <= 35.999) evalText = "VERY GOOD";
        else if (t <= 36.999) evalText = "Way to go";
        else if (t <= 40.999) evalText = "Could be better";
        else if (t <= 50.999) evalText = "Bad";
        else evalText = "Horrible";
    } else if (m === 8) {
        if (t <= 17) evalText = "NICEEEE";
        else if (t === 1.000) evalText = "GREAT";
        else if (t >= 19.000 && t <= 24.999) evalText = "Good orbit bro";
        else if (t >= 25.000 && t <= 40.999) evalText = "Mastur orbit maybe?";
        else if (t >= 41.000 && t <= 60.999) evalText = "Bad";
        else evalText = "Horrible";
    } else if (m === 9) {
        if (t <= 17) evalText = "AMAZING!!";
        else if (t >= 1.000 && t <= 22.999) evalText = "Great";
        else if (t >= 23.000 && t <= 30.999) evalText = "Nice";
        else if (t >= 31.000 && t <= 40.999) evalText = "Not bad";
        else if (t >= 41.000 && t <= 50.999) evalText = "bad";
        else evalText = "Horrible";
    } else if (m === 10) {
        if (t <= 24) evalText = "AMAZING!!";
        else if (t >= 1.000 && t <= 30.999) evalText = "Nice!";
        else if (t >= 31.000 && t <= 40.999) evalText = "Needs improvment";
        else if (t >= 41.000 && t <= 50.999) evalText = "Bad";
        else evalText = "Horrible";
    } else if (m === 11) {
        if (t <= 13) evalText = "Generational";
        else if (t >= 1.000 && t <= 18.999) evalText = "Amazing";
        else if (t >= 19.000 && t <= 25.999) evalText = "Greatttt";
        else if (t >= 26.000 && t <= 30.999) evalText = "Good";
        else if (t >= 31.000 && t <= 40.999) evalText = "could be better";
        else if (t >= 41.000 && t <= 60.999) evalText = "Bad";
        else evalText = "HORRIBLE";
    } else if (m === 12) {
        if (t <= 24) evalText = "AMAZING!!";
        else if (t >= 1.000 && t <= 29.999) evalText = "Very Good";
        else if (t >= 30.000 && t <= 40.999) evalText = "Not bad";
        else if (t >= 41.000 && t <= 50.999) evalText = "Could be worse";
        else if (t >= 51.000 && t <= 60.999) evalText = "Bad";
        else if (t >= 61.000 && t <= 70.999) evalText = "Horrible";
        else evalText = "Horrible";
    } else if (m === 13) {
        if (t <= 13) evalText = "AMAINGGGG!!";
        else if (t >= 1.000 && t <= 17.999) evalText = "Very Good";
        else if (t >= 18.000 && t <= 21.999) evalText = "good";
        else if (t >= 22.000 && t <= 25.999) evalText = "not bad";
        else if (t >= 26.000 && t <= 30.999) evalText = "Meh";
        else if (t >= 31.000 && t <= 40.999) evalText = "Bad";
        else evalText = "HoRIBLE";
    } else if (m === 14) {
        if (t <= 13) evalText = "AMAZINGINI";
        else if (t >= 1.000 && t <= 17.999) evalText = "Very Good!";
        else if (t >= 18.000 && t <= 22.999) evalText = "Nice";
        else if (t >= 23.000 && t <= 30.999) evalText = "Meh";
        else if (t >= 31.000 && t <= 40.999) evalText = "Bad";
        else evalText = "HOORIIBLE";
    } else if (m === 15) {
        if (t <= 14.999) evalText = "AMAZING";
        else if (t >= 15.000 && t <= 25.999) evalText = "AMAZING!";
        else if (t >= 20.000 && t <= 25.999) evalText = "Very Good";
        else if (t >= 26.000 && t <= 33.999) evalText = "not bad";
        else if (t >= 34.000 && t <= 40.999) evalText = "Bad";
        else evalText = "Horrible";
    } else if (m === 16) {
        if (t <= 27) evalText = "Fantastic";
        else if (t >= 1.000 && t <= 33.999) evalText = "Very Good";
        else if (t >= 34.000 && t <= 40.999) evalText = "Not bad";
        else if (t >= 41.000 && t <= 50.999) evalText = "Bad";
        else evalText = "HORRIBLE";
    } else if (m === 17) {
        if (t <= 18) evalText = "AMAZING!";
        else if (t >= 1.000 && t <= 23.999) evalText = "Very Good!";
        else if (t >= 24.000 && t <= 27.999) evalText = "Fine";
        else if (t >= 28.000 && t <= 35.999) evalText = "Not bad";
        else if (t >= 36.000 && t <= 50.999) evalText = "Bad";
        else evalText = "Very Bad";
    } else if (m === 18) {
        if (t <= 20) evalText = "AMAZING!!";
        else if (t >= 1.000 && t <= 25.999) evalText = "Good";
        else if (t >= 26.000 && t <= 30.999) evalText = "Not bad";
        else if (t >= 31.000 && t <= 40.999) evalText = "Bad";
        else evalText = "HORRIBLE";
    } else if (m === 19) {
        if (t <= 20) evalText = "AMAZING!!!";
        else if (t >= 1.000 && t <= 25.999) evalText = "Very Good";
        else if (t >= 26.000 && t <= 33.999) evalText = "Good";
        else if (t >= 34.000 && t <= 40.999) evalText = "fine";
        else if (t >= 41.000 && t <= 50.999) evalText = "Bad";
        else evalText = "HOORIBLE";
    } else if (m === 20) {
        if (t <= 22) evalText = "AMAZING!!";
        else if (t >= 1.000 && t <= 26.999) evalText = "RLY GOOD!";
        else if (t >= 27.000 && t <= 30.999) evalText = "Good";
        else if (t >= 31.000 && t <= 40.999) evalText = "Fair";
        else if (t >= 41.000 && t <= 50.999) evalText = "Bad";
        else evalText = "HORRIBLE";
    } else if (m === 21) {
        if (t <= 11) evalText = "Ur not human bubba";
        else if (t >= 1.000 && t <= 15.999) evalText = "VERY GOOD!";
        else if (t >= 16.000 && t <= 20.999) evalText = "rly good";
        else if (t >= 21.000 && t <= 25.999) evalText = "Nice";
        else if (t >= 26.000 && t <= 30.999) evalText = "fair";
        else if (t >= 31.000 && t <= 40.999) evalText = "bad";
        else evalText = "HORRIBLE";
    } else if (m === 22) {
        if (t <= 12) evalText = "AMAZING!!!";
        else if (t >= 1.000 && t <= 17.999) evalText = "RLY GOOD";
        else if (t >= 18.000 && t <= 24.999) evalText = "Fair";
        else if (t >= 25.000 && t <= 30.999) evalText = "meh";
        else if (t >= 31.000 && t <= 40.999) evalText = "bad";
        else evalText = "HORRIBLE";
    } else if (m === 23) {
        if (t <= 8) evalText = "AMAZING!!!";
        else if (t >= 1.000 && t <= 11.999) evalText = "VERY GOOD!";
        else if (t >= 11.000 && t <= 15.999) evalText = "Nice!";
        else if (t >= 16.000 && t <= 20.999) evalText = "Good";
        else if (t >= 21.000 && t <= 30.999) evalText = "fair";
        else if (t >= 31.000 && t <= 40.999) evalText = "Bad";
        else evalText = "BAD BRO EWW";
    } else if (m === 24) {
        if (t <= 33) evalText = "AMAZINGINGIN!";
        else if (t >= 1.000 && t <= 39.999) evalText = "Very Good!";
        else if (t >= 40.000 && t <= 43.999) evalText = "nice";
        else if (t >= 44.000 && t <= 50.999) evalText = "meh";
        else if (t >= 51.000 && t <= 60.999) evalText = "Bad";
        else evalText = "HORRIBLE";
    } else if (m === 25) {
        if (t <= 12) evalText = "AMAZINGG!";
        else if (t >= 1.000 && t <= 17.999) evalText = "VERY GOOD!";
        else if (t >= 18.000 && t <= 22.999) evalText = "Good";
        else if (t >= 23.000 && t <= 30.999) evalText = "Meh";
        else if (t >= 31.000 && t <= 40.999) evalText = "Bad";
        else evalText = "HORRIBLE";
    } else if (m === 26) {
        if (t <= 20) evalText = "FANTASTICOOO";
        else if (t >= 1.000 && t <= 23.999) evalText = "chefs kiss";
        else if (t >= 24.000 && t <= 27.999) evalText = "nice";
        else if (t >= 28.000 && t <= 32.999) evalText = "Mid";
        else if (t >= 33.000 && t <= 40.999) evalText = "bad";
        else evalText = "HORRIBLE";
    } else if (m === 27) {
        if (t <= 39) evalText = "CHEFFFF KISSSS";
        else if (t >= 1.000 && t <= 43.999) evalText = "Very good!";
        else if (t >= 44.000 && t <= 50.999) evalText = "not bad";
        else if (t >= 51.000 && t <= 60.999) evalText = "bad";
        else evalText = "HORRIBLE";
    } else {
        evalText = "Done";
    }

    return `${mapName} (${t}) ${evalText}`;
}

function calculateStats() {
    const searchInput = document.getElementById('playerNameInput').value.trim();
    const searchName = searchInput.toLowerCase();
    const errorDiv = document.getElementById('error-msg');
    const statsCard = document.getElementById('statsCard');

    errorDiv.innerText = "";

    if (!searchInput) {
        errorDiv.innerText = "Please type a player name.";
        return;
    }

    if (leaderboardData.length === 0) {
        errorDiv.innerText = "Leaderboard data is still loading... please wait a second.";
        return;
    }

    let playerIndex = leaderboardData.findIndex(item => item.name.toLowerCase() === searchName);
    if (playerIndex === -1) {
        playerIndex = leaderboardData.findIndex(item => 
            item.name.toLowerCase().includes(searchName) || 
            item.rawCells.some(c => String(c).toLowerCase().includes(searchName))
        );
    }

    if (playerIndex === -1) {
        statsCard.style.display = "none";
        errorDiv.innerText = `Player "${searchInput}" was not found on the sheet.`;
        return;
    }

    const totalPlayers = 352;
    const playerRank = playerIndex + 1;
    const player = leaderboardData[playerIndex];
    const worldRecord = leaderboardData[0]; 

    const wrGap = Math.abs(player.score - worldRecord.score).toFixed(3);

    let percentile;
    if (playerRank === 1) {
        percentile = "100.0";
    } else {
        percentile = (((totalPlayers - playerRank) / totalPlayers) * 100).toFixed(1);
    }

    document.getElementById('displayName').innerText = player.name;
    document.getElementById('displayClass').innerText = player.classRank ? `(${player.classRank})` : '';
    document.getElementById('displayRank').innerText = `#${playerRank} of ${totalPlayers}`;
    document.getElementById('displayScore').innerText = player.score;
    document.getElementById('displayWR').innerText = `${worldRecord.score} (${worldRecord.name})`;
    document.getElementById('displayWRGap').innerText = playerRank === 1 ? "0.000 sec (World Record!)" : `+${wrGap} sec`;
    document.getElementById('displayPercentile').innerText = `Better than ${percentile}% of players`;

    const mapContainer = document.getElementById('displayMapBreakdown');
    mapContainer.replaceChildren();
    const mapWorldRecords = [];
    for (let mapIndex = 0; mapIndex < player.mapScores.length; mapIndex++) {
        let bestTime = Infinity;
        for (const leaderboardPlayer of leaderboardData) {
            const mapTime = leaderboardPlayer.mapScores[mapIndex];
            if (mapTime > 0 && mapTime < bestTime) {
                bestTime = mapTime;
            }
        }
        mapWorldRecords.push(bestTime === Infinity ? null : bestTime);
    }

    const defaultMapNames = [
        "Beacon Bay", "Boulder Hill", "Circus Contest", "Devil's Trick", "Escape Tsunami", "Dash Cup",
        "Lava Lake", "Gravity Gates", "Hammer Ville", "Jungle Temple", "Kittie Kegs", "Mecha Maze",
        "Mill Valley", "Monster Manor", "Nasty Seals", "Neon City", "Polar Path", "1-2-3 Red Light",
        "Rickety Run", "Risky Cliffs", "Shark Park", "Silly Slide", "Spiky Slopes", "Splash Dash",
        "Tricky Traps", "Tumble Town", "UFO Attack"
    ];

    player.mapScores.forEach((scoreVal, idx) => {
        const mapName = defaultMapNames[idx] || (
            mapHeaders[idx] && !mapHeaders[idx].startsWith('Col')
                ? mapHeaders[idx]
                : `Map ${idx + 1}`
        );
        const evalString = getMapEvaluation(idx, mapName, scoreVal);
        const mapWorldRecord = mapWorldRecords[idx];
        const percentageSlower = mapWorldRecord && scoreVal > 0
            ? Math.max(0, ((scoreVal - mapWorldRecord) / mapWorldRecord) * 100)
            : null;
        const secondsSlower = mapWorldRecord && scoreVal > 0
            ? Math.max(0, scoreVal - mapWorldRecord)
            : null;

        const div = document.createElement('div');
        div.className = 'map-item';
        if (percentageSlower !== null) {
            const colorPercentage = Math.min(percentageSlower, 100);
            const hue = 120 - colorPercentage * 1.2;
            div.style.backgroundColor = `hsl(${hue} 65% 25%)`;
        }
        const result = document.createElement('span');
        result.className = 'map-result';
        result.textContent = evalString;
        const comparison = document.createElement('span');
        comparison.className = 'map-comparison';
        comparison.textContent = secondsSlower !== null
            ? `(${secondsSlower.toFixed(3)} sec slower than WR)`
            : '(no WR comparison)';
        div.appendChild(result);
        div.appendChild(comparison);
        mapContainer.appendChild(div);
    });

    statsCard.style.display = "block";
}

document.getElementById('see-stats-btn').addEventListener('click', calculateStats);
document.getElementById('playerNameInput').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') calculateStats();
});

loadSheetData();
