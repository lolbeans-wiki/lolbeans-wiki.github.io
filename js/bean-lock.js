const beanCoinStorageKey = 'lolbeans-bean-coins';
const beanGameUnlockStorageKeys = {
    'fun-fact.html': 'lolbeans-fun-fact-unlocked',
    'bouncy-alek.html': 'lolbeans-bouncy-alek-unlocked'
};
const unlockableGames = [
    {
        selector: '.fun-fact-link',
        page: 'fun-fact.html',
        requiredCoins: 1000,
        label: 'Fun fact Generator'
    },
    {
        selector: '.bouncy-alek-link',
        page: 'bouncy-alek.html',
        requiredCoins: 10000,
        label: 'Bouncy Alek'
    }
];

function getSavedBeanCoins() {
    const savedCoins = Number(localStorage.getItem(beanCoinStorageKey));
    return Number.isFinite(savedCoins) && savedCoins >= 0 ? savedCoins : 0;
}

function updateUnlockableGameAccess() {
    const savedCoins = getSavedBeanCoins();

    unlockableGames.forEach(({ selector, page, requiredCoins, label }) => {
        const link = document.querySelector(selector);
        const unlockStorageKey = beanGameUnlockStorageKeys[page];
        const wasUnlocked = localStorage.getItem(unlockStorageKey) === 'true';
        const isUnlocked = wasUnlocked || savedCoins >= requiredCoins;

        if (isUnlocked && !wasUnlocked) {
            localStorage.setItem(unlockStorageKey, 'true');
        }
        if (!link) return;
        link.classList.toggle('is-locked', !isUnlocked);
        link.setAttribute('aria-disabled', String(!isUnlocked));
        link.title = isUnlocked
            ? ''
            : `Collect ${requiredCoins.toLocaleString()} Bean Coins in Bean Clicker to unlock ${label}`;
        const note = link.querySelector('.game-unlock-note');
        if (note) note.hidden = isUnlocked;
    });
}

updateUnlockableGameAccess();
window.addEventListener('storage', updateUnlockableGameAccess);

unlockableGames.forEach(({ selector, page, requiredCoins }) => {
    const unlockStorageKey = beanGameUnlockStorageKeys[page];
    const link = document.querySelector(selector);
    link?.addEventListener('click', (event) => {
        if (getSavedBeanCoins() < requiredCoins
            && localStorage.getItem(unlockStorageKey) !== 'true') {
            event.preventDefault();
            updateUnlockableGameAccess();
        }
    });

    if (window.location.pathname.endsWith(`/${page}`)
        && getSavedBeanCoins() < requiredCoins
        && localStorage.getItem(unlockStorageKey) !== 'true') {
        window.location.replace('extras.html');
    }
});
