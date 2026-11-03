// Shared Google Sheet loader. Pages that include this file call loadSheetData() themselves.
function setStatus(message) {
    const el = document.getElementById('error-msg');
    if (el) el.innerText = message;
}

const SHEET_ID = '1g7lA2WkLydwbukZ3asJHS784rklojqsC7MfSAxOcCwk';

// MrBlankCoding
// Cache the file for 24 hours to avoid Google Sheets API
const CACHE_KEY = 'lolbeansLeaderboardCacheV1';
const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000; 

let leaderboardData = [];
let mapHeaders = [];

function saveCachedData() {
    try {
        const payload = {
            savedAt: Date.now(),
            mapHeaders,
            data: leaderboardData
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
    } catch (err) {
        // Turned off local storage or its full
        // weird case
        console.warn("Failed :(", err);
    }
}

// return true when we have the data cached
function loadCachedData(allowStale = false) {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return false;
        const payload = JSON.parse(raw);
        if (!payload || !Array.isArray(payload.data) || !payload.data.length) return false;
        const isFresh = Date.now() - payload.savedAt <= CACHE_MAX_AGE_MS;
        if (!allowStale && !isFresh) return false;
        mapHeaders = Array.isArray(payload.mapHeaders) ? payload.mapHeaders : [];
        leaderboardData = payload.data;
        return true;
    } catch (err) {
        return false;
    }
}

function handleResponse(json) {
    try {
        console.log("Raw Google Sheet JSON:", json);

        if (json.table.cols) {
            mapHeaders = json.table.cols.slice(2, 29).map((col, idx) => col.label ? col.label.trim() : `Map ${idx + 1}`);
        }

        const rows = json.table.rows;
        leaderboardData = [];

        for (let row of rows) {
            if (!row.c) continue;

            const cells = row.c.map(cell => cell ? (cell.f !== undefined && cell.f !== null ? cell.f : cell.v) : '');

            let name = '';
            let score = 0;

            for (let cell of cells) {
                const strVal = String(cell).trim();
                if (strVal && isNaN(Number(strVal))) {
                    const lower = strVal.toLowerCase();
                    if (lower.includes('world record times') || lower.includes('probeans') || ['rank', 'name', 'player', 'total', 'score', 'time'].includes(lower)) {
                        name = '';
                        break;
                    }
                    if (!name) name = strVal;
                }

                const numVal = parseFloat(cell);
                if (!isNaN(numVal) && numVal > 10) {
                    score = numVal;
                }
            }

            const mapScores = [];
            for (let i = 2; i < 29; i++) {
                const val = cells[i] !== undefined && cells[i] !== '' ? parseFloat(cells[i]) : 0;
                mapScores.push(isNaN(val) ? 0 : val);
            }

            if (name && score > 0) {
                leaderboardData.push({
                    name: name,
                    score: score,
                    classRank: String(cells[30] || '').trim(),
                    mapScores: mapScores,
                    rawCells: cells
                });
            }

            if (leaderboardData.length >= 352) {
                break;
            }
        }

        if (leaderboardData.length) saveCachedData();
        setStatus("");
        if (typeof renderSizeComparison === 'function') renderSizeComparison();
    } catch (err) {
        console.error("Parsing error:", err);
        setStatus("Error parsing Google Sheet data.");
    }
}

function loadSheetData() {
    // Fresh cache
    if (loadCachedData()) {
        if (typeof renderSizeComparison === 'function') renderSizeComparison();
        setStatus("");
        return;
    }

    const script = document.createElement('script');
    script.src = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?headers=0&tqx=out:json;responseHandler:handleResponse`;
    script.onerror = function() {
        // offline handeling
        if (loadCachedData(true)) {
            setStatus("Couldn't reach the sheet — showing cached leaderboard data.");
            if (typeof renderSizeComparison === 'function') renderSizeComparison();
        } else {
            setStatus("Failed to load Google Sheet.");
        }
    };
    document.body.appendChild(script);
}
