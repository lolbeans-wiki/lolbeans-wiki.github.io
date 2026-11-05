const beanCoin = document.querySelector('#bean-coin');
const beanCoinCount = document.querySelector('#bean-coin-count');
const beanPanel = beanCoin.closest('.sub-screen-panel');
const beanProgressDatabaseName = 'lolbeans-bean-clicker';
const beanProgressStoreName = 'progress';
const beanProgressRecordKey = 'current';
const beanProgressDatabase = openBeanProgressDatabase();
const beanRain = document.querySelector('#bean-rain');
const beanTravelers = document.querySelector('#bean-travelers');
const beanFastClickReward = document.querySelector('#bean-fast-click-reward');
const beanWorkerCostElement = document.querySelector('#bean-worker-cost');
const beanWorkerOwnedCount = document.querySelector('#bean-worker-owned-count');
const beanWorkersPerSecond = document.querySelector('#bean-coins-per-second');
const buyBeanWorkerButton = document.querySelector('#buy-bean-worker');
const beanClickUpgradeCostElement = document.querySelector('#bean-click-upgrade-cost');
const beanClickUpgradeOwnedCount = document.querySelector('#bean-click-upgrade-owned-count');
const beanCoinsPerClick = document.querySelector('#bean-coins-per-click');
const buyBeanClickUpgradeButton = document.querySelector('#buy-bean-click-upgrade');
const mahjicUpgradeCostElement = document.querySelector('#mahjic-upgrade-cost');
const buyMahjicUpgradeButton = document.querySelector('#buy-mahjic-upgrade');
const buyMajikHandUpgradeButton = document.querySelector('#buy-majik-hand-upgrade');
const buyNotSusBikerUpgradeButton = document.querySelector('#buy-not-sus-biker-upgrade');
const beanNotSusBikerOwnedCount = document.querySelector('#bean-not-sus-biker-owned-count');
const beanSaveStatus = document.querySelector('#bean-save-status');
const beanOfflineEarnings = document.querySelector('#bean-offline-earnings');
const beanResetProgressButton = document.querySelector('#bean-reset-progress');
let beanCoins = 0;
let beanLifetimeCoins = 0;
let beanWorkers = 0;
let beanClickUpgrades = 0;
let hasMahjicUpgrade = false;
let hasMajikHandUpgrade = false;
let hasNotSusBikerUpgrade = false;
let hasFastClickReward = false;
const beanClickTimestamps = [];
let nextWorkerCost = 100;
let nextClickUpgradeCost = 1000;
let isProgressReady = false;
let lastIncomeUpdate = Date.now();
let saveQueue = Promise.resolve();
let saveTimer;
let hasReportedStorageError = false;

function openBeanProgressDatabase() {
    if (!window.indexedDB) {
        return Promise.reject(new Error('IndexedDB is unavailable in this browser.'));
    }

    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open(beanProgressDatabaseName, 1);
        request.onupgradeneeded = () => {
            request.result.createObjectStore(beanProgressStoreName);
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(
            request.error || new Error('Could not open Bean Clicker progress storage.')
        );
        request.onblocked = () => reject(
            new Error('Bean Clicker progress storage is blocked by another open tab.')
        );
    });
}

function readBeanProgress(database) {
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(beanProgressStoreName, 'readonly');
        const request = transaction.objectStore(beanProgressStoreName).get(beanProgressRecordKey);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(
            request.error || new Error('Could not read Bean Clicker progress.')
        );
        transaction.onabort = () => reject(
            transaction.error || new Error('Reading Bean Clicker progress was interrupted.')
        );
    });
}

function writeBeanProgress(database, progress) {
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(beanProgressStoreName, 'readwrite');
        transaction.objectStore(beanProgressStoreName).put(progress, beanProgressRecordKey);
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(
            transaction.error || new Error('Could not save Bean Clicker progress.')
        );
        transaction.onabort = () => reject(
            transaction.error || new Error('Saving Bean Clicker progress was interrupted.')
        );
    });
}

function deleteBeanProgress(database) {
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(beanProgressStoreName, 'readwrite');
        transaction.objectStore(beanProgressStoreName).delete(beanProgressRecordKey);
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(
            transaction.error || new Error('Could not reset Bean Clicker progress.')
        );
        transaction.onabort = () => reject(
            transaction.error || new Error('Resetting Bean Clicker progress was interrupted.')
        );
    });
}

function reportStorageError(error) {
    if (hasReportedStorageError) return;
    hasReportedStorageError = true;
    console.error('Bean Clicker progress storage error:', error);
    beanSaveStatus.textContent = 'Progress could not be saved in this browser.';
    beanSaveStatus.hidden = false;
}

function getBeanProgressSnapshot() {
    return {
        coins: beanCoins,
        lifetimeCoins: beanLifetimeCoins,
        workers: beanWorkers,
        clickUpgrades: beanClickUpgrades,
        hasMahjicUpgrade,
        hasMajikHandUpgrade,
        hasNotSusBikerUpgrade,
        hasFastClickReward,
        nextWorkerCost,
        nextClickUpgradeCost,
        lastActive: Date.now()
    };
}

function saveBeanProgress(immediate = false) {
    if (!isProgressReady) return;
    if (beanCoins === 0
        && beanLifetimeCoins === 0
        && beanWorkers === 0
        && beanClickUpgrades === 0
        && !hasMahjicUpgrade
        && !hasMajikHandUpgrade
        && !hasNotSusBikerUpgrade
        && !hasFastClickReward) {
        return;
    }
    const persist = () => {
        saveTimer = undefined;
        const snapshot = getBeanProgressSnapshot();
        saveQueue = saveQueue.catch(() => {}).then(async () => {
            const database = await beanProgressDatabase;
            await writeBeanProgress(database, snapshot);
        });
        saveQueue.catch(reportStorageError);
    };

    window.clearTimeout(saveTimer);
    if (immediate) {
        persist();
    } else {
        saveTimer = window.setTimeout(persist, 250);
    }
}

function restoreBeanProgress(progress) {
    if (progress === undefined) return 0;
    const validNumber = (value) => typeof value === 'number' && Number.isFinite(value) && value >= 0;
    const validInteger = (value) => Number.isSafeInteger(value) && value >= 0;
    if (!progress
        || !validNumber(progress.coins)
        || !validNumber(progress.lifetimeCoins)
        || !validInteger(progress.workers)
        || !validInteger(progress.clickUpgrades)
        || !validNumber(progress.nextWorkerCost)
        || progress.nextWorkerCost < 1
        || !validNumber(progress.nextClickUpgradeCost)
        || progress.nextClickUpgradeCost < 1
        || !validNumber(progress.lastActive)
        || typeof progress.hasMahjicUpgrade !== 'boolean'
        || typeof progress.hasMajikHandUpgrade !== 'boolean'
        || typeof progress.hasNotSusBikerUpgrade !== 'boolean'
        || typeof progress.hasFastClickReward !== 'boolean') {
        throw new Error('Saved Bean Clicker progress is invalid.');
    }

    beanCoins = progress.coins;
    beanLifetimeCoins = Math.max(progress.lifetimeCoins, beanCoins);
    beanWorkers = progress.workers;
    beanClickUpgrades = progress.clickUpgrades;
    hasMahjicUpgrade = progress.hasMahjicUpgrade;
    hasMajikHandUpgrade = progress.hasMajikHandUpgrade;
    hasNotSusBikerUpgrade = progress.hasNotSusBikerUpgrade;
    hasFastClickReward = progress.hasFastClickReward;
    nextWorkerCost = progress.nextWorkerCost;
    nextClickUpgradeCost = progress.nextClickUpgradeCost;
    return calculateOfflineEarnings(progress.lastActive);
}

function calculateOfflineEarnings(lastActive) {
    const elapsedSeconds = Math.max(0, (Date.now() - lastActive) / 1000);
    const baseRate = beanWorkers * 0.5 * (hasMahjicUpgrade ? 5 : 1)
        + (hasNotSusBikerUpgrade ? 1000 : 0);
    if (elapsedSeconds === 0 || baseRate === 0) return 0;

    let remainingSeconds = elapsedSeconds;
    let earned = 0;
    let lifetimeCoins = beanLifetimeCoins;
    while (remainingSeconds > 0) {
        const milestones = Math.floor(lifetimeCoins / 1000);
        const speed = Math.min(3, 1 + milestones * 0.05);
        if (speed >= 3) {
            earned += baseRate * speed * remainingSeconds;
            break;
        }

        const nextMilestone = (milestones + 1) * 1000;
        const secondsToMilestone = (nextMilestone - lifetimeCoins) / (baseRate * speed);
        const segmentSeconds = Math.min(remainingSeconds, secondsToMilestone);
        const segmentEarnings = baseRate * speed * segmentSeconds;
        earned += segmentEarnings;
        lifetimeCoins += segmentEarnings;
        remainingSeconds -= segmentSeconds;
        if (segmentSeconds === 0) break;
    }

    beanCoins += earned;
    beanLifetimeCoins += earned;
    return earned;
}

function getBeanProgress() {
    const milestones = Math.floor(beanLifetimeCoins / 1000);
    return {
        speed: Math.min(3, 1 + milestones * 0.05),
        glow: Math.min(1, milestones / 20)
    };
}

function addBeanCoins(amount) {
    beanCoins += amount;
    beanLifetimeCoins += amount;
    saveBeanProgress();
}

function formatBeanCoins(amount) {
    return Number.isInteger(amount) ? String(amount) : amount.toFixed(1);
}

function updateBeanClickerDisplay() {
    const { speed, glow } = getBeanProgress();
    beanPanel.style.setProperty('--bean-speed', String(1 / speed));
    beanPanel.style.setProperty('--bean-glow-blur', `${4 + glow * 18}px`);
    beanPanel.style.setProperty('--bean-glow-opacity', String(0.15 + glow * 0.7));
    beanRain.classList.toggle('has-mahjic-upgrade', hasMahjicUpgrade);
    beanRain.classList.toggle('has-majik-hand-upgrade', hasMajikHandUpgrade);
    beanCoinCount.textContent = formatBeanCoins(beanCoins);
    const coinsPerSecond = beanWorkers * 0.5 * (hasMahjicUpgrade ? 5 : 1)
        + (hasNotSusBikerUpgrade ? 1000 : 0);
    beanWorkersPerSecond.textContent = `${formatBeanCoins(coinsPerSecond * speed)} coins per second`;
    const coinsPerClick = ((beanClickUpgrades + 1) * (hasMajikHandUpgrade ? 5 : 1)
        + (hasNotSusBikerUpgrade ? 1000 : 0)) * speed;
    beanCoinsPerClick.textContent = `${formatBeanCoins(coinsPerClick)} ${coinsPerClick === 1 ? 'coin' : 'coins'} per click`;
    beanWorkerCostElement.textContent = String(nextWorkerCost);
    beanWorkerOwnedCount.textContent = String(beanWorkers);
    beanWorkerOwnedCount.setAttribute('aria-label', `${beanWorkers} Bean Workers owned`);
    buyBeanWorkerButton.setAttribute('aria-label', `Buy Bean Worker for ${nextWorkerCost} coins`);
    buyBeanWorkerButton.disabled = !isProgressReady || beanCoins < nextWorkerCost;
    beanClickUpgradeCostElement.textContent = String(nextClickUpgradeCost);
    beanClickUpgradeOwnedCount.textContent = String(beanClickUpgrades);
    beanClickUpgradeOwnedCount.setAttribute('aria-label', `${beanClickUpgrades} Bean Editors owned`);
    buyBeanClickUpgradeButton.setAttribute('aria-label', `Buy Bean Editor for ${nextClickUpgradeCost} coins`);
    buyBeanClickUpgradeButton.disabled = !isProgressReady || beanCoins < nextClickUpgradeCost;
    buyMahjicUpgradeButton.hidden = hasMahjicUpgrade;
    buyMahjicUpgradeButton.disabled = !isProgressReady || beanCoins < 500;
    mahjicUpgradeCostElement.textContent = '500';
    buyMajikHandUpgradeButton.hidden = hasMajikHandUpgrade;
    buyMajikHandUpgradeButton.disabled = !isProgressReady || beanCoins < 1000;
    beanNotSusBikerOwnedCount.textContent = String(Number(hasNotSusBikerUpgrade));
    beanNotSusBikerOwnedCount.setAttribute(
        'aria-label',
        `${Number(hasNotSusBikerUpgrade)} NOT sus bikers owned`
    );
    buyNotSusBikerUpgradeButton.disabled = !isProgressReady
        || hasNotSusBikerUpgrade
        || beanCoins < 20000;
    beanCoin.disabled = !isProgressReady;
    beanFastClickReward.disabled = !isProgressReady;
    beanResetProgressButton.disabled = !isProgressReady;
}

function updateBeanTravelers() {
    const purchasedBeans = [
        { image: 'images/bean-worker.png', count: beanWorkers },
        { image: 'images/bean-click-upgrade.png', count: beanClickUpgrades },
        { image: 'images/bean-not-sus-biker.png', count: Number(hasNotSusBikerUpgrade) }
    ];
    const travelers = document.createDocumentFragment();
    let travelerIndex = 0;

    purchasedBeans.forEach(({ image, count }, beanTypeIndex) => {
        for (let i = 0; i < Math.min(count, 50); i += 1) {
            const traveler = document.createElement('img');
            const duration = 10 + ((i * 7 + beanTypeIndex * 3) % 10);
            traveler.src = image;
            traveler.alt = '';
            traveler.className = 'bean-traveler';
            traveler.style.setProperty('--traveler-y', `${6 + ((travelerIndex * 29) % 88)}%`);
            traveler.style.setProperty('--traveler-duration', `${duration}s`);
            traveler.style.setProperty(
                '--traveler-delay',
                `${-((travelerIndex * 2.7) % duration)}s`
            );
            travelers.appendChild(traveler);
            travelerIndex += 1;
        }
    });

    beanTravelers.replaceChildren(travelers);
}

async function initializeBeanProgress() {
    try {
        const database = await beanProgressDatabase;
        const savedProgress = await readBeanProgress(database);
        const offlineEarnings = restoreBeanProgress(savedProgress);
        isProgressReady = true;
        lastIncomeUpdate = Date.now();
        beanSaveStatus.hidden = true;
        updateBeanClickerDisplay();
        updateBeanTravelers();
        if (offlineEarnings > 0) {
            beanOfflineEarnings.textContent = `You earned ${formatBeanCoins(offlineEarnings)} Bean Coins while away!`;
            beanOfflineEarnings.hidden = false;
            window.setTimeout(() => {
                beanOfflineEarnings.hidden = true;
            }, 3000);
        }
        saveBeanProgress();
    } catch (error) {
        reportStorageError(error);
        isProgressReady = true;
        lastIncomeUpdate = Date.now();
        updateBeanClickerDisplay();
        updateBeanTravelers();
    }
}

updateBeanClickerDisplay();
updateBeanTravelers();
beanFastClickReward.hidden = true;
beanSaveStatus.textContent = 'Loading saved progress...';
beanSaveStatus.hidden = false;
void initializeBeanProgress();

window.setTimeout(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const beans = document.createDocumentFragment();

    for (let i = 0; i < 100; i += 1) {
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

    beanRain.appendChild(beans);
}, 0);

beanCoin.addEventListener('click', () => {
    if (!isProgressReady) return;
    const now = Date.now();
    beanClickTimestamps.push(now);
    while (beanClickTimestamps[0] <= now - 1000) {
        beanClickTimestamps.shift();
    }

    const { speed } = getBeanProgress();
    addBeanCoins(((beanClickUpgrades + 1) * (hasMajikHandUpgrade ? 5 : 1)
        + (hasNotSusBikerUpgrade ? 1000 : 0)) * speed);
    if (beanCoins >= 100
        && beanClickTimestamps.length > 10
        && !hasFastClickReward) {
        beanFastClickReward.hidden = false;
    }
    updateBeanClickerDisplay();
    beanCoin.classList.remove('is-clicked');
    void beanCoin.offsetWidth;
    beanCoin.classList.add('is-clicked');
});

beanFastClickReward.addEventListener('click', () => {
    if (!isProgressReady || hasFastClickReward) return;

    addBeanCoins(1000);
    hasFastClickReward = true;
    beanFastClickReward.hidden = true;
    updateBeanClickerDisplay();
    saveBeanProgress();
});

buyBeanWorkerButton.addEventListener('click', () => {
    if (!isProgressReady || beanCoins < nextWorkerCost) return;

    beanCoins -= nextWorkerCost;
    beanWorkers += 1;
    nextWorkerCost = Math.ceil(nextWorkerCost * 1.15);
    updateBeanClickerDisplay();
    updateBeanTravelers();
    saveBeanProgress();
});

buyBeanClickUpgradeButton.addEventListener('click', () => {
    if (!isProgressReady || beanCoins < nextClickUpgradeCost) return;

    beanCoins -= nextClickUpgradeCost;
    beanClickUpgrades += 1;
    nextClickUpgradeCost = Math.ceil(nextClickUpgradeCost * 1.15);
    updateBeanClickerDisplay();
    updateBeanTravelers();
    saveBeanProgress();
});

buyMahjicUpgradeButton.addEventListener('click', () => {
    if (!isProgressReady || hasMahjicUpgrade || beanCoins < 500) return;

    beanCoins -= 500;
    hasMahjicUpgrade = true;
    updateBeanClickerDisplay();
    saveBeanProgress();
});

buyMajikHandUpgradeButton.addEventListener('click', () => {
    if (!isProgressReady || hasMajikHandUpgrade || beanCoins < 1000) return;

    beanCoins -= 1000;
    hasMajikHandUpgrade = true;
    updateBeanClickerDisplay();
    saveBeanProgress();
});

buyNotSusBikerUpgradeButton.addEventListener('click', () => {
    if (!isProgressReady || hasNotSusBikerUpgrade || beanCoins < 20000) return;

    beanCoins -= 20000;
    hasNotSusBikerUpgrade = true;
    updateBeanClickerDisplay();
    updateBeanTravelers();
    saveBeanProgress();
});

window.setInterval(() => {
    const now = Date.now();
    const elapsedSeconds = Math.max(0, (now - lastIncomeUpdate) / 1000);
    lastIncomeUpdate = now;
    if (!isProgressReady) return;
    const { speed } = getBeanProgress();
    const coinsPerSecond = (beanWorkers * 0.5 * (hasMahjicUpgrade ? 5 : 1)
        + (hasNotSusBikerUpgrade ? 1000 : 0)) * speed;
    if (coinsPerSecond > 0 && elapsedSeconds > 0) {
        addBeanCoins(coinsPerSecond * elapsedSeconds);
        updateBeanClickerDisplay();
    }
}, 1000);
window.setInterval(saveBeanProgress, 10000);
window.addEventListener('pagehide', () => saveBeanProgress(true));
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') saveBeanProgress(true);
});

beanCoin.addEventListener('animationend', () => {
    beanCoin.classList.remove('is-clicked');
});

beanResetProgressButton.addEventListener('click', async () => {
    if (!isProgressReady) return;
    isProgressReady = false;
    window.clearTimeout(saveTimer);
    saveTimer = undefined;
    updateBeanClickerDisplay();
    try {
        await saveQueue.catch(() => {});
        const database = await beanProgressDatabase;
        await deleteBeanProgress(database);
        beanCoins = 0;
        beanLifetimeCoins = 0;
        beanWorkers = 0;
        beanClickUpgrades = 0;
        hasMahjicUpgrade = false;
        hasMajikHandUpgrade = false;
        hasNotSusBikerUpgrade = false;
        hasFastClickReward = false;
        nextWorkerCost = 100;
        nextClickUpgradeCost = 1000;
        lastIncomeUpdate = Date.now();
        isProgressReady = true;
        beanOfflineEarnings.hidden = true;
        updateBeanClickerDisplay();
        updateBeanTravelers();
        beanSaveStatus.textContent = 'Progress reset.';
        beanSaveStatus.hidden = false;
        window.setTimeout(() => {
            if (beanSaveStatus.textContent === 'Progress reset.') {
                beanSaveStatus.hidden = true;
            }
        }, 2000);
    } catch (error) {
        isProgressReady = true;
        updateBeanClickerDisplay();
        reportStorageError(error);
    }
});
