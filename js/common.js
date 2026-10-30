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
