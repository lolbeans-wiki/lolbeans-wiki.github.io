(() => {
const presenceCount = document.querySelector('#live-chat-presence-count');
const nicknameForm = document.querySelector('#live-chat-nickname-form');
const nicknameInput = document.querySelector('#live-chat-nickname');
const presenceKeyPrefix = 'lolbeans-live-chat-presence:';
const presenceKey = `${presenceKeyPrefix}${crypto.randomUUID()}`;
const presenceExpirationMs = 30000;
const presenceRefreshMs = 10000;
let presenceStarted = false;

function refreshPresence() {
    const now = Date.now();
    const expiredKeys = [];
    let activeCount = 0;

    try {
        localStorage.setItem(presenceKey, String(now));

        for (let index = 0; index < localStorage.length; index += 1) {
            const key = localStorage.key(index);
            if (!key?.startsWith(presenceKeyPrefix)) {
                continue;
            }

            const lastSeen = Number(localStorage.getItem(key));
            if (!Number.isFinite(lastSeen) || now - lastSeen > presenceExpirationMs) {
                expiredKeys.push(key);
            } else {
                activeCount += 1;
            }
        }

        expiredKeys.forEach((key) => localStorage.removeItem(key));
        presenceCount.textContent = String(activeCount);
    } catch (error) {
        presenceCount.textContent = '—';
        presenceCount.setAttribute('aria-label', 'Local online count unavailable');
        console.error('Unable to update the local live chat counter.', error);
    }
}

nicknameForm.addEventListener('submit', () => {
    if (!nicknameInput.value.trim() || presenceStarted) {
        return;
    }

    presenceStarted = true;
    refreshPresence();
    window.setInterval(refreshPresence, presenceRefreshMs);
});

document.addEventListener('visibilitychange', () => {
    if (presenceStarted && document.visibilityState === 'visible') {
        refreshPresence();
    }
});

window.addEventListener('pagehide', () => {
    if (!presenceStarted) {
        return;
    }

    try {
        localStorage.removeItem(presenceKey);
    } catch (error) {
        console.error('Unable to clear the local live chat counter entry.', error);
    }
});
})();
