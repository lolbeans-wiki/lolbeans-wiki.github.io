// Shared Google Sheet loader. Pages that include this file call loadSheetData() themselves.
function setStatus(message) {
    const el = document.getElementById('error-msg');
    if (el) el.innerText = message;
}

const SHEET_ID = '1g7lA2WkLydwbukZ3asJHS784rklojqsC7MfSAxOcCwk';
let leaderboardData = [];
let mapHeaders = [];

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

        console.log("Cleaned Leaderboard Data (Total:", leaderboardData.length, "):", leaderboardData);
        setStatus("");
        if (typeof renderSizeComparison === 'function') renderSizeComparison();
    } catch (err) {
        console.error("Parsing error:", err);
        setStatus("Error parsing Google Sheet data.");
    }
}

function loadSheetData() {
    const script = document.createElement('script');
    script.src = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?headers=0&tqx=out:json;responseHandler:handleResponse`;
    script.onerror = function() {
        setStatus("Failed to load Google Sheet.");
    };
    document.body.appendChild(script);
}
