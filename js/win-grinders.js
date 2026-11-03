const grinderNames = document.querySelectorAll('.win-grinder-name');
const lightestHighlight = 45;
const lastGrinderIndex = grinderNames.length - 1;

grinderNames.forEach((name, index) => {
    const shade = lastGrinderIndex > 0
        ? lightestHighlight * (1 - index / lastGrinderIndex)
        : 0;

    name.style.setProperty('--highlight-shade', `${shade}%`);
});
