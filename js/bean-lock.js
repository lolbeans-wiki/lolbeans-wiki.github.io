document.querySelectorAll('.unlockable-game-link').forEach((link) => {
    link.classList.remove('is-locked');
    link.setAttribute('aria-disabled', 'false');
    link.removeAttribute('title');
    const note = link.querySelector('.game-unlock-note');
    if (note) note.hidden = true;
});
