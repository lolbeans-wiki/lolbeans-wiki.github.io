// Googly eyes: pupils follow the cursor on every page that has bean decorations.
const pupils = document.querySelectorAll('.bean-pupil');
document.addEventListener('pointermove', (event) => {
    pupils.forEach((pupil) => {
        const eye = pupil.parentElement.getBoundingClientRect();
        const deltaX = event.clientX - (eye.left + eye.width / 2);
        const deltaY = event.clientY - (eye.top + eye.height / 2);
        const distance = Math.hypot(deltaX, deltaY);
        const maxOffset = eye.width * 0.18;
        const movement = distance > 0 ? Math.min(1, maxOffset / distance) : 0;
        const isMirrored = pupil.closest('.bean-side-left') !== null;
        const offsetX = deltaX * movement * (isMirrored ? -1 : 1);
        const offsetY = deltaY * movement;
        pupil.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
    });
});

if (document.body.hasAttribute('data-discord-invite')) {
    const discordInvite = document.createElement('aside');
    discordInvite.className = 'discord-invite-container';
    discordInvite.style.setProperty('position', 'fixed', 'important');
    discordInvite.style.setProperty('top', '83px', 'important');
    discordInvite.style.setProperty('right', '12px', 'important');
    discordInvite.style.setProperty('z-index', '120', 'important');

    const discordCard = document.createElement('button');
    discordCard.className = 'discord-invite';
    discordCard.type = 'button';
    discordCard.setAttribute('aria-expanded', 'false');
    discordCard.setAttribute('aria-controls', 'discord-invite-go');

    const discordImage = document.createElement('img');
    discordImage.src = 'images/discord-server.png';
    discordImage.alt = '';

    const discordMessage = document.createElement('span');
    discordMessage.append(document.createTextNode('Please consider joining our dc server for fun events! '));

    const discordUrl = document.createElement('span');
    discordUrl.className = 'discord-invite-url';
    discordUrl.textContent = 'https://discord.gg/Vzmw74CUjk';

    discordMessage.appendChild(discordUrl);
    discordCard.append(discordImage, discordMessage);

    const discordGo = document.createElement('a');
    discordGo.className = 'discord-invite-go';
    discordGo.id = 'discord-invite-go';
    discordGo.href = 'https://discord.gg/Vzmw74CUjk';
    discordGo.target = '_blank';
    discordGo.rel = 'noopener noreferrer';
    discordGo.textContent = 'GO!';
    discordGo.hidden = true;

    discordCard.addEventListener('click', () => {
        discordGo.hidden = false;
        discordCard.setAttribute('aria-expanded', 'true');
    });

    discordInvite.append(discordCard, discordGo);
    document.body.appendChild(discordInvite);

    if (window.matchMedia('(max-width: 480px)').matches) {
        discordInvite.style.setProperty('top', '79px', 'important');
        discordInvite.style.setProperty('right', '8px', 'important');
    }
}
