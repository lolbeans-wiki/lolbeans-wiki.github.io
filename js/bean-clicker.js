const beanCoin = document.querySelector('#bean-coin');
const beanCoinCount = document.querySelector('#bean-coin-count');
const beanPanel = beanCoin.closest('.sub-screen-panel');
[
    'lolbeans-bean-coins',
    'lolbeans-bean-lifetime-coins',
    'lolbeans-bean-last-active',
    'lolbeans-bean-workers',
    'lolbeans-bean-click-power',
    'lolbeans-mahjic-upgrade',
    'lolbeans-majik-hand-upgrade',
    'lolbeans-not-sus-biker-upgrade',
    'lolbeans-fast-click-reward',
    'lolbeans-fun-fact-unlocked',
    'lolbeans-bouncy-alek-unlocked'
].forEach((key) => localStorage.removeItem(key));
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
const beanRefreshButton = document.querySelector('#bean-refresh');
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
    buyBeanWorkerButton.disabled = beanCoins < nextWorkerCost;
    beanClickUpgradeCostElement.textContent = String(nextClickUpgradeCost);
    beanClickUpgradeOwnedCount.textContent = String(beanClickUpgrades);
    beanClickUpgradeOwnedCount.setAttribute('aria-label', `${beanClickUpgrades} Bean Editors owned`);
    buyBeanClickUpgradeButton.setAttribute('aria-label', `Buy Bean Editor for ${nextClickUpgradeCost} coins`);
    buyBeanClickUpgradeButton.disabled = beanCoins < nextClickUpgradeCost;
    buyMahjicUpgradeButton.hidden = hasMahjicUpgrade;
    buyMahjicUpgradeButton.disabled = beanCoins < 500;
    mahjicUpgradeCostElement.textContent = '500';
    buyMajikHandUpgradeButton.hidden = hasMajikHandUpgrade;
    buyMajikHandUpgradeButton.disabled = beanCoins < 1000;
    beanNotSusBikerOwnedCount.textContent = String(Number(hasNotSusBikerUpgrade));
    beanNotSusBikerOwnedCount.setAttribute(
        'aria-label',
        `${Number(hasNotSusBikerUpgrade)} NOT sus bikers owned`
    );
    buyNotSusBikerUpgradeButton.disabled = hasNotSusBikerUpgrade || beanCoins < 20000;
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

updateBeanClickerDisplay();
updateBeanTravelers();
beanFastClickReward.hidden = true;
let lastIncomeUpdate = performance.now();

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
    const now = performance.now();
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
    if (hasFastClickReward) return;

    addBeanCoins(1000);
    hasFastClickReward = true;
    beanFastClickReward.hidden = true;
    updateBeanClickerDisplay();
});

buyBeanWorkerButton.addEventListener('click', () => {
    if (beanCoins < nextWorkerCost) return;

    beanCoins -= nextWorkerCost;
    beanWorkers += 1;
    nextWorkerCost = Math.ceil(nextWorkerCost * 1.15);
    updateBeanClickerDisplay();
    updateBeanTravelers();
});

buyBeanClickUpgradeButton.addEventListener('click', () => {
    if (beanCoins < nextClickUpgradeCost) return;

    beanCoins -= nextClickUpgradeCost;
    beanClickUpgrades += 1;
    nextClickUpgradeCost = Math.ceil(nextClickUpgradeCost * 1.15);
    updateBeanClickerDisplay();
    updateBeanTravelers();
});

buyMahjicUpgradeButton.addEventListener('click', () => {
    if (hasMahjicUpgrade || beanCoins < 500) return;

    beanCoins -= 500;
    hasMahjicUpgrade = true;
    updateBeanClickerDisplay();
});

buyMajikHandUpgradeButton.addEventListener('click', () => {
    if (hasMajikHandUpgrade || beanCoins < 1000) return;

    beanCoins -= 1000;
    hasMajikHandUpgrade = true;
    updateBeanClickerDisplay();
});

buyNotSusBikerUpgradeButton.addEventListener('click', () => {
    if (hasNotSusBikerUpgrade || beanCoins < 20000) return;

    beanCoins -= 20000;
    hasNotSusBikerUpgrade = true;
    updateBeanClickerDisplay();
    updateBeanTravelers();
});

window.setInterval(() => {
    const now = performance.now();
    const elapsedSeconds = (now - lastIncomeUpdate) / 1000;
    lastIncomeUpdate = now;
    const { speed } = getBeanProgress();
    const coinsPerSecond = (beanWorkers * 0.5 * (hasMahjicUpgrade ? 5 : 1)
        + (hasNotSusBikerUpgrade ? 1000 : 0)) * speed;
    if (coinsPerSecond === 0) return;

    addBeanCoins(coinsPerSecond * elapsedSeconds);
    updateBeanClickerDisplay();
}, 1000);

beanCoin.addEventListener('animationend', () => {
    beanCoin.classList.remove('is-clicked');
});

beanRefreshButton.addEventListener('click', () => {
    window.location.reload();
});
