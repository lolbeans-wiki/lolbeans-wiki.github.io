const DB_NAME = 'lolbeans-bean-clicker';
const STORE = 'progress';
const SAVE_KEY = 'current';

const $ = (selector) => document.querySelector(selector);

const coinButton = $('#bean-coin');
const coinCount = $('#bean-coin-count');
const panel = coinButton.closest('.sub-screen-panel');
const rain = $('#bean-rain');
const travelersBox = $('#bean-travelers');
const fastRewardButton = $('#bean-fast-click-reward');
const perSecondText = $('#bean-coins-per-second');
const perClickText = $('#bean-coins-per-click');
const saveStatus = $('#bean-save-status');
const offlineText = $('#bean-offline-earnings');
const resetButton = $('#bean-reset-progress');

const workerButton = $('#buy-bean-worker');
const workerCostText = $('#bean-worker-cost');
const workerOwnedText = $('#bean-worker-owned-count');

const editorButton = $('#buy-bean-click-upgrade');
const editorCostText = $('#bean-click-upgrade-cost');
const editorOwnedText = $('#bean-click-upgrade-owned-count');

const mahjicButton = $('#buy-mahjic-upgrade');
const mahjicCostText = $('#mahjic-upgrade-cost');
const majikHandButton = $('#buy-majik-hand-upgrade');

const bikerButton = $('#buy-not-sus-biker-upgrade');
const bikerOwnedText = $('#bean-not-sus-biker-owned-count');
const bikerCostText = document.getElementById('not-sus-biker-upgrade-cost');

function freshState() {
    return {
        coins: 0,
        lifetime: 0,
        workers: 0,
        clickUpgrades: 0,
        bikers: 0,
        hasMahjic: false,
        hasMajikHand: false,
        hasFastReward: false,
        workerCost: 100,
        clickCost: 1000,
        bikerCost: 20000
    };
}

let g = freshState();
const clickTimes = [];
let ready = false;
let lastIncome = Date.now();
let saveQueue = Promise.resolve();
let saveTimer;
let reportedError = false;

function openDatabase() {
    if (!window.indexedDB) {
        return Promise.reject(new Error('No IndexedDB in this browser'));
    }

    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = () => request.result.createObjectStore(STORE);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        request.onblocked = () => reject(new Error('Save database is blocked by another tab'));
    });
}

const db = openDatabase();

function dbRun(database, mode, action) {
    return new Promise((resolve, reject) => {
        const tx = database.transaction(STORE, mode);
        const request = action(tx.objectStore(STORE));
        tx.oncomplete = () => resolve(request.result);
        tx.onerror = tx.onabort = () => reject(tx.error || request.error);
    });
}

const readSave = (database) => dbRun(database, 'readonly', (store) => store.get(SAVE_KEY));
const writeSave = (database, data) => dbRun(database, 'readwrite', (store) => store.put(data, SAVE_KEY));
const deleteSave = (database) => dbRun(database, 'readwrite', (store) => store.delete(SAVE_KEY));

function reportError(error) {
    if (reportedError) return;
    reportedError = true;
    console.error('Bean Clicker save error:', error);
    saveStatus.textContent = 'Progress could not be saved in this browser.';
    saveStatus.hidden = false;
}

function snapshot() {
    return {
        coins: g.coins,
        lifetimeCoins: g.lifetime,
        workers: g.workers,
        clickUpgrades: g.clickUpgrades,
        notSusBikers: g.bikers,
        hasMahjicUpgrade: g.hasMahjic,
        hasMajikHandUpgrade: g.hasMajikHand,
        hasFastClickReward: g.hasFastReward,
        nextWorkerCost: g.workerCost,
        nextClickUpgradeCost: g.clickCost,
        nextNotSusBikerCost: g.bikerCost,
        lastActive: Date.now()
    };
}

function save(now = false) {
    if (!ready) return;
    const nothingYet = g.coins === 0 && g.lifetime === 0 && g.workers === 0
        && g.clickUpgrades === 0 && g.bikers === 0
        && !g.hasMahjic && !g.hasMajikHand && !g.hasFastReward;
    if (nothingYet) return;

    const persist = () => {
        saveTimer = undefined;
        const data = snapshot();
        saveQueue = saveQueue.catch(() => {}).then(async () => {
            await writeSave(await db, data);
        });
        saveQueue.catch(reportError);
    };

    window.clearTimeout(saveTimer);
    if (now) persist();
    else saveTimer = window.setTimeout(persist, 250);
}

function restore(data) {
    if (data === undefined) return 0;

    const ok = (n) => Number.isFinite(n) && n >= 0;
    const good = data
        && ok(data.coins)
        && ok(data.lifetimeCoins)
        && ok(data.lastActive)
        && Number.isInteger(data.workers) && data.workers >= 0
        && Number.isInteger(data.clickUpgrades) && data.clickUpgrades >= 0
        && data.nextWorkerCost >= 1
        && data.nextClickUpgradeCost >= 1
        && typeof data.hasMahjicUpgrade === 'boolean'
        && typeof data.hasMajikHandUpgrade === 'boolean'
        && typeof data.hasFastClickReward === 'boolean';
    if (!good) throw new Error('Saved progress is invalid');

    g.coins = data.coins;
    g.lifetime = Math.max(data.lifetimeCoins, g.coins);
    g.workers = data.workers;
    g.clickUpgrades = data.clickUpgrades;
    g.bikers = typeof data.notSusBikers === 'number' ? data.notSusBikers : (data.hasNotSusBikerUpgrade ? 1 : 0);
    g.hasMahjic = data.hasMahjicUpgrade;
    g.hasMajikHand = data.hasMajikHandUpgrade;
    g.hasFastReward = data.hasFastClickReward;
    g.workerCost = data.nextWorkerCost;
    g.clickCost = data.nextClickUpgradeCost;
    g.bikerCost = data.nextNotSusBikerCost || (20000 * Math.pow(1.15, g.bikers));
    return offlineEarnings(data.lastActive);
}

const baseIncome = () => g.workers * 0.5 * (g.hasMahjic ? 5 : 1) + (g.bikers * 1000);
const baseClick = () => (g.clickUpgrades + 1) * (g.hasMajikHand ? 5 : 1) + (g.bikers * 1000);

function bonus() {
    const steps = Math.floor(g.lifetime / 1000);
    return {
        speed: Math.min(3, 1 + steps * 0.05),
        glow: Math.min(1, steps / 20)
    };
}

function offlineEarnings(lastActive) {
    const elapsed = Math.max(0, (Date.now() - lastActive) / 1000);
    const rate = baseIncome();
    if (elapsed === 0 || rate === 0) return 0;

    let left = elapsed;
    let earned = 0;
    let lifetime = g.lifetime;

    while (left > 0) {
        const steps = Math.floor(lifetime / 1000);
        const speed = Math.min(3, 1 + steps * 0.05);
        if (speed >= 3) {
            earned += rate * speed * left;
            break;
        }

        const nextStep = (steps + 1) * 1000;
        const secondsToStep = (nextStep - lifetime) / (rate * speed);
        const seconds = Math.min(left, secondsToStep);
        const gained = rate * speed * seconds;
        earned += gained;
        lifetime += gained;
        left -= seconds;
        if (seconds === 0) break;
    }

    g.coins += earned;
    g.lifetime += earned;
    return earned;
}

function addCoins(amount) {
    g.coins += amount;
    g.lifetime += amount;
    save();
}

function format(amount) {
    return Number.isInteger(amount) ? String(amount) : amount.toFixed(1);
}

function updateDisplay() {
    const { speed, glow } = bonus();
    panel.style.setProperty('--bean-speed', String(1 / speed));
    panel.style.setProperty('--bean-glow-blur', `${4 + glow * 18}px`);
    panel.style.setProperty('--bean-glow-opacity', String(0.15 + glow * 0.7));
    rain.classList.toggle('has-mahjic-upgrade', g.hasMahjic);
    rain.classList.toggle('has-majik-hand-upgrade', g.hasMajikHand);

    coinCount.textContent = format(g.coins);
    perSecondText.textContent = `${format(baseIncome() * speed)} coins per second`;
    const perClick = baseClick() * speed;
    perClickText.textContent = `${format(perClick)} ${perClick === 1 ? 'coin' : 'coins'} per click`;

    workerCostText.textContent = String(g.workerCost);
    workerOwnedText.textContent = String(g.workers);
    workerOwnedText.setAttribute('aria-label', `${g.workers} Bean Workers owned`);
    workerButton.setAttribute('aria-label', `Buy Bean Worker for ${g.workerCost} coins`);
    workerButton.disabled = !ready || g.coins < g.workerCost;

    editorCostText.textContent = String(g.clickCost);
    editorOwnedText.textContent = String(g.clickUpgrades);
    editorOwnedText.setAttribute('aria-label', `${g.clickUpgrades} Bean Editors owned`);
    editorButton.setAttribute('aria-label', `Buy Bean Editor for ${g.clickCost} coins`);
    editorButton.disabled = !ready || g.coins < g.clickCost;

    mahjicButton.hidden = g.hasMahjic;
    mahjicButton.disabled = !ready || g.coins < 500;
    mahjicCostText.textContent = '500';

    majikHandButton.hidden = g.hasMajikHand;
    majikHandButton.disabled = !ready || g.coins < 1000;

    if (bikerCostText) bikerCostText.textContent = String(Math.round(g.bikerCost));
    bikerOwnedText.textContent = String(g.bikers);
    bikerOwnedText.setAttribute('aria-label', `${g.bikers} NOT sus bikers owned`);
    bikerButton.setAttribute('aria-label', `Buy NOT sus biker for ${Math.round(g.bikerCost)} coins`);
    bikerButton.disabled = !ready || g.coins < g.bikerCost;

    coinButton.disabled = !ready;
    fastRewardButton.disabled = !ready;
    resetButton.disabled = !ready;
}

function updateTravelers() {
    const types = [
        { image: 'images/bean-worker.png', count: g.workers },
        { image: 'images/bean-click-upgrade.png', count: g.clickUpgrades },
        { image: 'images/bean-not-sus-biker.png', count: g.bikers }
    ];
    const fragment = document.createDocumentFragment();
    let n = 0;

    types.forEach(({ image, count }, typeIndex) => {
        for (let i = 0; i < Math.min(count, 50); i++) {
            const bean = document.createElement('img');
            const duration = 10 + ((i * 7 + typeIndex * 3) % 10);
            bean.src = image;
            bean.alt = '';
            bean.className = 'bean-traveler';
            bean.style.setProperty('--traveler-y', `${6 + ((n * 29) % 88)}%`);
            bean.style.setProperty('--traveler-duration', `${duration}s`);
            bean.style.setProperty('--traveler-delay', `${-((n * 2.7) % duration)}s`);
            fragment.appendChild(bean);
            n++;
        }
    });

    travelersBox.replaceChildren(fragment);
}

async function loadGame() {
    try {
        const database = await db;
        const offline = restore(await readSave(database));
        ready = true;
        lastIncome = Date.now();
        saveStatus.hidden = true;
        updateDisplay();
        updateTravelers();

        if (offline > 0) {
            offlineText.textContent = `You earned ${format(offline)} Bean Coins while away!`;
            offlineText.hidden = false;
            window.setTimeout(() => {
                offlineText.hidden = true;
            }, 3000);
        }
        save();
    } catch (error) {
        reportError(error);
        ready = true;
        lastIncome = Date.now();
        updateDisplay();
        updateTravelers();
    }
}

updateDisplay();
updateTravelers();
fastRewardButton.hidden = true;
saveStatus.textContent = 'Loading saved progress...';
saveStatus.hidden = false;
loadGame();

window.setTimeout(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const beans = document.createDocumentFragment();
    for (let i = 0; i < 100; i++) {
        const bean = document.createElement('img');
        const duration = 8 + Math.random() * 14;
        bean.src = 'images/bean-rain.png';
        bean.alt = '';
        bean.className = 'bean-rain-drop';
        bean.style.setProperty('--bean-x', `${Math.random() * 100}%`);
        bean.style.setProperty('--bean-size', `${8 + Math.random() * 10}px`);
        bean.style.setProperty('--bean-duration', `${duration}s`);
        bean.style.setProperty('--bean-delay', `${-Math.random() * duration}s`);
        beans.appendChild(bean);
    }
    rain.appendChild(beans);
}, 0);

coinButton.addEventListener('click', () => {
    if (!ready) return;
    const now = Date.now();

    clickTimes.push(now);
    while (clickTimes[0] <= now - 1000) clickTimes.shift();

    addCoins(baseClick() * bonus().speed);

    if (g.coins >= 100 && clickTimes.length > 10 && !g.hasFastReward) {
        fastRewardButton.hidden = false;
    }
    updateDisplay();

    coinButton.classList.remove('is-clicked');
    void coinButton.offsetWidth;
    coinButton.classList.add('is-clicked');
});

coinButton.addEventListener('animationend', () => {
    coinButton.classList.remove('is-clicked');
});

fastRewardButton.addEventListener('click', () => {
    if (!ready || g.hasFastReward) return;
    addCoins(1000);
    g.hasFastReward = true;
    fastRewardButton.hidden = true;
    updateDisplay();
    save();
});

function buyCounted(countKey, costKey) {
    if (!ready || g.coins < g[costKey]) return;
    g.coins -= g[costKey];
    g[countKey] += 1;
    g[costKey] = Math.ceil(g[costKey] * 1.15);
    updateDisplay();
    updateTravelers();
    save();
}

workerButton.addEventListener('click', () => buyCounted('workers', 'workerCost'));
editorButton.addEventListener('click', () => buyCounted('clickUpgrades', 'clickCost'));
bikerButton.addEventListener('click', () => buyCounted('bikers', 'bikerCost'));

mahjicButton.addEventListener('click', () => {
    if (!ready || g.hasMahjic || g.coins < 500) return;
    g.coins -= 500;
    g.hasMahjic = true;
    updateDisplay();
    save();
});

majikHandButton.addEventListener('click', () => {
    if (!ready || g.hasMajikHand || g.coins < 1000) return;
    g.coins -= 1000;
    g.hasMajikHand = true;
    updateDisplay();
    save();
});

window.setInterval(() => {
    const now = Date.now();
    const elapsed = Math.max(0, (now - lastIncome) / 1000);
    lastIncome = now;
    if (!ready) return;

    const perSecond = baseIncome() * bonus().speed;
    if (perSecond > 0 && elapsed > 0) {
        addCoins(perSecond * elapsed);
        updateDisplay();
    }
}, 1000);

window.setInterval(save, 10000);
window.addEventListener('pagehide', () => save(true));
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') save(true);
});

resetButton.addEventListener('click', async () => {
    if (!ready) return;
    ready = false;
    window.clearTimeout(saveTimer);
    saveTimer = undefined;
    updateDisplay();

    try {
        await saveQueue.catch(() => {});
        await deleteSave(await db);
        g = freshState();
        lastIncome = Date.now();
        ready = true;
        offlineText.hidden = true;
        updateDisplay();
        updateTravelers();
        saveStatus.textContent = 'Progress reset.';
        saveStatus.hidden = false;
        window.setTimeout(() => {
            if (saveStatus.textContent === 'Progress reset.') saveStatus.hidden = true;
        }, 2000);
    } catch (error) {
        ready = true;
        updateDisplay();
        reportError(error);
    }
});

const bgm = new Audio('audio/477069_Background-Music-loop.mp3');
bgm.loop = true;

document.addEventListener('click', () => {
    if (bgm.paused) bgm.play().catch(() => {});
}, { once: true });