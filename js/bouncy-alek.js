const crossingAleks = [...document.querySelectorAll('.slow-crossing')];
let crossingStates = [];
let crossingFrame = 0;
let previousCrossingFrame = 0;

function resetCrossingAleks() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const firstSize = crossingAleks[0].getBoundingClientRect().width;
    const secondSize = crossingAleks[1].getBoundingClientRect().width;
    crossingStates = [
        { element: crossingAleks[0], x: 24, y: viewportHeight * 0.2, vx: 108, vy: 36, size: firstSize },
        { element: crossingAleks[1], x: viewportWidth - secondSize - 24, y: viewportHeight * 0.76, vx: -96, vy: -30, size: secondSize }
    ];
}

function animateCrossingAleks(timestamp) {
    if (!document.body.classList.contains('fun-thingies-active')) {
        crossingFrame = 0;
        previousCrossingFrame = 0;
        return;
    }

    const deltaSeconds = previousCrossingFrame
        ? Math.min((timestamp - previousCrossingFrame) / 1000, 0.05)
        : 0;
    previousCrossingFrame = timestamp;

    crossingStates.forEach((state) => {
        state.x += state.vx * deltaSeconds;
        state.y += state.vy * deltaSeconds;

        const maxX = Math.max(0, window.innerWidth - state.size);
        const maxY = Math.max(0, window.innerHeight - state.size * 1.25);
        if (state.x <= 0 || state.x >= maxX) {
            state.x = Math.max(0, Math.min(state.x, maxX));
            state.vx *= -1;
        }
        if (state.y <= 0 || state.y >= maxY) {
            state.y = Math.max(0, Math.min(state.y, maxY));
            state.vy *= -1;
        }
    });

    const [first, second] = crossingStates;
    const dx = first.x + first.size / 2 - second.x - second.size / 2;
    const dy = first.y + first.size * 0.625 - second.y - second.size * 0.625;
    const distance = Math.hypot(dx, dy) || 1;
    const minDistance = (first.size + second.size) * 0.42;

    if (distance < minDistance) {
        const normalX = dx / distance;
        const normalY = dy / distance;
        const relativeSpeed = (first.vx - second.vx) * normalX + (first.vy - second.vy) * normalY;

        if (relativeSpeed < 0) {
            first.vx -= relativeSpeed * normalX;
            first.vy -= relativeSpeed * normalY;
            second.vx += relativeSpeed * normalX;
            second.vy += relativeSpeed * normalY;
        }

        const overlap = minDistance - distance;
        first.x += normalX * overlap / 2;
        first.y += normalY * overlap / 2;
        second.x -= normalX * overlap / 2;
        second.y -= normalY * overlap / 2;
    }

    crossingStates.forEach((state) => {
        state.element.style.left = `${state.x}px`;
        state.element.style.top = `${state.y}px`;
    });

    crossingFrame = requestAnimationFrame(animateCrossingAleks);
}

function startCrossingAleks() {
    if (crossingFrame || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    resetCrossingAleks();
    previousCrossingFrame = 0;
    crossingFrame = requestAnimationFrame(animateCrossingAleks);
}

function stopCrossingAleks() {
    if (crossingFrame) cancelAnimationFrame(crossingFrame);
    crossingFrame = 0;
    previousCrossingFrame = 0;
}

startCrossingAleks();

document.addEventListener("DOMContentLoaded", () => {
    // 1. Background Music Loop Handler
    const bgMusic = document.getElementById("bg-music");
    if (bgMusic) {
        bgMusic.volume = 0.4;
        
        const unlockAudio = () => {
            bgMusic.play().catch(e => console.log("Waiting for user interaction"));
            window.removeEventListener("click", unlockAudio);
            window.removeEventListener("keydown", unlockAudio);
        };

        bgMusic.play().catch(() => {
            window.addEventListener("click", unlockAudio);
            window.addEventListener("keydown", unlockAudio);
        });
    }

    // Helper to play sound effects
    function playSound(path, speed = 1.0) {
        const sound = new Audio(path);
        sound.playbackRate = speed; // Set playback speed (e.g. 2.0 for 2x faster)
        sound.play().catch(err => console.warn("Audio play failed:", err));
    }

    const explosionSoundSrc = "audio/explosion.mp3";
    const cleckSoundSrc = "audio/cleck-sound.mp3";[cite: 9]
    const spinSounds = [
        "audio/spin-1.mp3",
        "audio/spin-2.mp3",
        "audio/spin-3.mp3",
        "audio/spin-4.mp3"
    ];
    const explosionImage = 'images/images.jpeg';

    // 2. Exploding Alek ("dont clek me") - Plays 2x faster and only once
    const clickExplosionAlek = document.getElementById('click-explosion-alek');
    if (clickExplosionAlek) {
        clickExplosionAlek.addEventListener('click', () => {
            playSound(cleckSoundSrc, 2.0); // Plays 2x faster
            clickExplosionAlek.querySelector('.alek-image').src = explosionImage;
            clickExplosionAlek.classList.add('is-transformed');
            clickExplosionAlek.disabled = true;
            clickExplosionAlek.setAttribute('aria-label', 'Alek transformed');
        }, { once: true }); // { once: true } ensures this click handler only fires once!
    }

    // 3. Thanky Alek
    const thankyAlek = document.getElementById('thanky-alek');
    if (thankyAlek) {
        thankyAlek.addEventListener('click', () => {
            thankyAlek.classList.add('is-stopped');
            thankyAlek.setAttribute('aria-pressed', 'true');
            const thankyMsg = document.getElementById('thanky-message');
            if (thankyMsg) thankyMsg.textContent = 'thanki yoyu';
        });
    }

    // 4. Spinning Alek
    const spinAlek = document.getElementById('spin-alek');
    if (spinAlek) {
        let spinClickCount = 0;
        const maxSpinClicks = 8;

        spinAlek.addEventListener('click', () => {
            spinClickCount += 1;
            const spinDuration = Math.max(0.28, 1.4 - spinClickCount * 0.14);
            spinAlek.style.setProperty('--spin-duration', `${spinDuration}s`);

            if (spinClickCount < maxSpinClicks) {
                const randomSound = spinSounds[Math.floor(Math.random() * spinSounds.length)];
                playSound(randomSound, 1.0);
            } else {
                playSound(explosionSoundSrc, 1.0);
                spinAlek.querySelector('.alek-image').src = explosionImage;
                spinAlek.classList.add('is-transformed');
                spinAlek.disabled = true;
                spinAlek.setAttribute('aria-label', 'Alek spun into the latest image');
            }
        });
    }
});