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

    // Helper to play sound effects safely
    function playSound(path, speed = 1.0) {
        const sound = new Audio(path);
        sound.playbackRate = speed;
        sound.play().catch(err => console.warn("Audio play failed:", err));
    }

    const explosionSoundSrc = "audio/explosion.mp3";
    const cleckSoundSrc = "audio/cleck-sound.mp3";
    const spinSounds = [
        "audio/spin-1.mp3",
        "audio/spin-2.mp3",
        "audio/spin-3.mp3",
        "audio/spin-4.mp3"
    ];
    const explosionImage = 'images/images.jpeg';

    // 2. Exploding Alek ("dont clek me")
    const clickExplosionAlek = document.getElementById('click-explosion-alek');
    if (clickExplosionAlek) {
        clickExplosionAlek.addEventListener('click', () => {
            playSound(cleckSoundSrc, 2.0);
            const img = clickExplosionAlek.querySelector('.alek-image');
            if (img) img.src = explosionImage;
            clickExplosionAlek.classList.add('is-transformed');
            clickExplosionAlek.disabled = true;
            clickExplosionAlek.setAttribute('aria-label', 'Alek transformed');
        }, { once: true });
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
                const img = spinAlek.querySelector('.alek-image');
                if (img) img.src = explosionImage;
                spinAlek.classList.add('is-transformed');
                spinAlek.disabled = true;
                spinAlek.setAttribute('aria-label', 'Alek spun into the latest image');
            }
        });
    }
});