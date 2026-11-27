const wanderers = [...document.querySelectorAll('.slow-crossing')];
let balls = [];
let rafId = 0;
let lastTime = 0;

function setupBalls() {
    if (!wanderers.length) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const widthOf = (el) => el.getBoundingClientRect().width || 60;

    const sizeA = widthOf(wanderers[0]);
    balls = [{ el: wanderers[0], x: 24, y: h * 0.2, vx: 108, vy: 36, size: sizeA }];

    if (wanderers[1]) {
        const sizeB = widthOf(wanderers[1]);
        balls.push({ el: wanderers[1], x: w - sizeB - 24, y: h * 0.76, vx: -96, vy: -30, size: sizeB });
    }
}

function bumpTogether(a, b) {
    const dx = a.x + a.size / 2 - b.x - b.size / 2;
    const dy = a.y + a.size * 0.625 - b.y - b.size * 0.625;
    const dist = Math.hypot(dx, dy) || 1;
    const minDist = (a.size + b.size) * 0.42;
    if (dist >= minDist) return;

    const nx = dx / dist;
    const ny = dy / dist;
    const approach = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
    if (approach < 0) {
        a.vx -= approach * nx;
        a.vy -= approach * ny;
        b.vx += approach * nx;
        b.vy += approach * ny;
    }

    const push = (minDist - dist) / 2;
    a.x += nx * push;
    a.y += ny * push;
    b.x -= nx * push;
    b.y -= ny * push;
}

function moveBalls(time) {
    if (!document.body.classList.contains('fun-thingies-active') || !wanderers.length) {
        rafId = 0;
        lastTime = 0;
        return;
    }

    const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
    lastTime = time;

    for (const b of balls) {
        b.x += b.vx * dt;
        b.y += b.vy * dt;

        const maxX = Math.max(0, window.innerWidth - b.size);
        const maxY = Math.max(0, window.innerHeight - b.size * 1.25);
        if (b.x <= 0 || b.x >= maxX) {
            b.x = Math.max(0, Math.min(b.x, maxX));
            b.vx *= -1;
        }
        if (b.y <= 0 || b.y >= maxY) {
            b.y = Math.max(0, Math.min(b.y, maxY));
            b.vy *= -1;
        }
    }

    if (balls.length >= 2) bumpTogether(balls[0], balls[1]);

    for (const b of balls) {
        b.el.style.left = b.x + 'px';
        b.el.style.top = b.y + 'px';
    }

    rafId = requestAnimationFrame(moveBalls);
}

function startBalls() {
    if (rafId || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setupBalls();
    lastTime = 0;
    rafId = requestAnimationFrame(moveBalls);
}

startBalls();

document.addEventListener('DOMContentLoaded', () => {
    const bgMusic = document.getElementById('bg-music');
    if (bgMusic) {
        bgMusic.volume = 0.4;

        const unlock = () => {
            bgMusic.play().catch(() => {});
            window.removeEventListener('click', unlock);
            window.removeEventListener('keydown', unlock);
        };

        bgMusic.play().catch(() => {
            window.addEventListener('click', unlock);
            window.addEventListener('keydown', unlock);
        });
    }

    function playSound(path) {
        new Audio(path).play().catch(() => {});
    }

    const explosionSound = 'audio/explosion.mp3';
    const cleckSound = 'audio/cleck-sound.mp3';
    const spinSounds = [
        'audio/spin-1.mp3',
        'audio/spin-2.mp3',
        'audio/spin-3.mp3',
        'audio/spin-4.mp3'
    ];
    const explosionImage = 'images/images.jpeg';

    const popupImage = 'images/Screenshot%202026-11-13%20at%205.04.38%20PM.png';
    new Image().src = popupImage;
    let audioCtx = null;

    function playWithPopup(soundPath, imageSrc) {
        const sound = new Audio(soundPath);
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = '';
        img.draggable = false;
        img.style.cssText = 'position:fixed;left:50%;top:50%;width:28vmin;height:auto;' +
            'transform:translate(-50%,-50%);transition:transform 70ms ease-out;' +
            'z-index:9999;pointer-events:none;user-select:none;';

        let analyser = null;
        let data = null;
        let raf = 0;
        let done = false;

        if (location.protocol.indexOf('http') === 0) {
            try {
                const AC = window.AudioContext || window.webkitAudioContext;
                audioCtx = audioCtx || new AC();
                if (audioCtx.state === 'suspended') audioCtx.resume();
                const source = audioCtx.createMediaElementSource(sound);
                analyser = audioCtx.createAnalyser();
                analyser.fftSize = 256;
                source.connect(analyser);
                analyser.connect(audioCtx.destination);
                data = new Uint8Array(analyser.frequencyBinCount);
            } catch (err) {
                analyser = null;
            }
        }

        function finish() {
            if (done) return;
            done = true;
            cancelAnimationFrame(raf);
            img.remove();
        }

        let lastLevel = 0;
        let lastSwitch = 0;
        let size = 1;
        let stretchX = 1;
        let stretchY = 1;

        function newShape() {
            size = 0.7 + Math.random();
            if (Math.random() < 0.5) {
                stretchX = 1.4 + Math.random() * 0.8;
                stretchY = 0.6 + Math.random() * 0.3;
            } else {
                stretchX = 0.6 + Math.random() * 0.3;
                stretchY = 1.4 + Math.random() * 0.8;
            }
        }

        function frame(now) {
            if (done) return;

            let level;
            if (analyser) {
                analyser.getByteFrequencyData(data);
                let sum = 0;
                for (let i = 0; i < data.length; i++) sum += data[i];
                level = sum / data.length / 255;
            } else {
                level = 0.2 + Math.random() * 0.6;
            }

            const hit = level > lastLevel + 0.05 || now - lastSwitch > 160;
            if (hit && level > 0.02) {
                newShape();
                lastSwitch = now;
            }
            lastLevel = level;

            const pulse = 1 + level * 0.4;
            img.style.transform = 'translate(-50%,-50%) scale(' +
                (stretchX * size * pulse) + ',' + (stretchY * size * pulse) + ')';
            raf = requestAnimationFrame(frame);
        }

        sound.addEventListener('ended', finish);
        sound.addEventListener('error', finish);
        document.body.appendChild(img);
        sound.play().then(() => { raf = requestAnimationFrame(frame); }).catch(finish);
    }

    function blowUp(button) {
        playSound(explosionSound);
        const img = button.querySelector('.alek-image');
        if (img) img.src = explosionImage;
        button.classList.add('is-transformed');
        button.disabled = true;
    }

    const dontClek = document.getElementById('click-explosion-alek');
    if (dontClek) {
        dontClek.addEventListener('click', () => blowUp(dontClek), { once: true });
    }

    const thanky = document.getElementById('thanky-alek');
    if (thanky) {
        thanky.addEventListener('click', () => {
            playWithPopup(cleckSound, popupImage);
            thanky.classList.add('is-stopped');
            const img = thanky.querySelector('.alek-image');
            if (img) img.src = explosionImage;
            thanky.classList.add('is-transformed');
            const msg = document.getElementById('thanky-message');
            if (msg) msg.textContent = 'thanki yoyu';
        }, { once: true });
    }

    const spinner = document.getElementById('spin-alek');
    if (spinner) {
        let clicks = 0;
        const maxClicks = 8;

        spinner.addEventListener('click', () => {
            clicks += 1;
            const duration = Math.max(0.28, 1.4 - clicks * 0.14);
            spinner.style.setProperty('--spin-duration', duration + 's');

            if (clicks < maxClicks) {
                playSound(spinSounds[Math.floor(Math.random() * spinSounds.length)]);
            } else {
                blowUp(spinner);
            }
        });
    }
});