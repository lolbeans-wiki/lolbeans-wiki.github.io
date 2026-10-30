// ===== FUN FACT GENERATOR =====
// To add images: set image: "yourfile.png" on any fact. To add facts: add another line.
const FUN_FACTS = [
    { image: null, text: `You can actually jump over the fence without needing a partner in devils trick, it requires you to time it and waste a very short second, The player Aspect has gotten 4 seconds with this trick before. But its not easy to do.` },
    { image: null, text: `Nasty Seals used to have a bug that let you skip through the entire level in 1-2 seconds, it got patched tho.` },
    { image: null, text: `With horrible EXTREMELY high ping, you can make it so after you fall in the void your bean spawns in the last checkpoint letting you complete the level in less than 10 seconds, this bug is completely luck based and doesn't count in speedrunning if you manage to do it. Barely anyone ever gets it.` },
    { image: null, text: `You can get this 3rd purple cube in the lobby by walking to the end of the yellow boost up slide, going up diagonally and jumping, reach the top, walk down the yellow slide from its top, jump on the purple cube section, perhaps do a neo, and get the Purple cube!` },
    { image: null, text: `The top 10 player Speeder√ is actually a pro race car driver IRL, Dont remember which exact category.` },
    { image: null, text: `This was the first Website I have ever published.` },
    { image: null, text: `If your on macOS, theres a chance that hovering your mouse wont show all 3 decimals, best way to find them is going in developer tools from chrome > network > search up "stats" > refresh the page and go to stats > click "stats" in the box and get your exact times!` },
    { image: null, text: `There are 27 maps in the game so far!` },
    { image: null, text: `This generator has 100 Facts put into it, each one having 1% chance of getting picked, im tired writing these helppppp` },
    { image: null, text: `The owner of this website (me) Is a Geometry Dash player (Ignore the larp name I made it when I was 9)` },
    { image: null, text: `LOLBeans was made only 20-30 days after stumble guys, somehow succeeded less even tho most would agree its better.` },
    { image: null, text: `I hope your day is going fine` },
    { image: null, text: `Incase you dont have discord and dont know, PRObeans server died a long time ago, people now chat in other servers such as Bean champs` },
    { image: null, text: `Tumble town is consider to be the map with the least possible tricks` },
    { image: null, text: `Hisoka trick in Circus contest is 99% luck based, mastering it is still possible if your good at frame perfects but really hard.` },
    { image: null, text: `Monstor manor en-hop can happen to anyone, even noobs, which made a lot of less skilled players get super good times on the map.` },
    { image: null, text: `You can do trap boost on Nasty seals by literally not letting go of W and running forward right after getting zapped, and 33% of the time you will time it correctly unless you fail the spam jumping somehow. The reason this isn't an advantage is because when it does work, the doll is already halfway through spinning , meaning she usually zaps you mid flight with this trick.` },
    { image: null, text: `The game is much more popular durning the school year at school times, since 95% of the player base is kids playing from School computers.` },
    { image: null, timer: true, text: `The game's next birthday is in` },
    { image: null, text: `Private Party's have been getting a lot of hate for only being available for 15+ members` },
    { image: null, text: `I'm a larper` },
    { image: null, text: `A lot of people which includes OG's started quitting the game once they changed the air movement system and added a new option for it.` },
    { image: null, text: `The OG speed runner channels were blorkie, neo, and NoobyAtLolbeans, sadly, all of them quit the game for different reasons.` },
    { image: null, text: `Ar.Naud is considered the oldest Lolbeans Player, in his 60s, problem with this is that there's no way to prove if its true or not. Ar.Naud himself claims it is, so people decide to believe him.` },
    { image: null, text: `If a noob says your hacking, thats the best way to know your skill is above their comprehensions, there is no better feeling than getting called a hacker after doing orbit in front of their faces.` },
    { image: null, text: `To do orbit, most players jump off the ramp, but I find it much more easier to walk off instead of jumping since I think its easier to align yourself like that. It doesn't make you slower and its a great option to try if your still attempting orbit!` },
    { image: null, text: `The Tag Gamemode actually does have dedicated players in it that play it like its battle royale. Shoutout to people like SleepyTed and (10s) Mr Marsh!` },
    { image: null, text: `I'm very new to this game and only joined 3 months ago, so some things here might be wrong lol. Dont take it seriously its a fun facts page!` },
    { image: null, text: `Even if you make a super good community level, chances of it getting more than 4 stars is surprisingly low` },
    { image: null, text: `The game had 3 maps when it first came out, but most players agree that Hammer Ville was the first map ever made in lolbeans!` },
    { image: null, text: `Most loved Maps in the game are considered to be Gravity Gates, Spiky Slopes, and devil's trick, but even these get some hate.` },
    { image: null, text: `The most hated maps in the game are considered to be Escape Tsunami, Tumble town, and the Squid game Maps!` },
    { image: null, text: `According to stats, the game has had 250k player visits last month in September alone! Even tho it gets less these days, this is prove that the game is more popular than you might think` },
    { image: null, text: `the game has 61 Basic skins, 14 Exotic, and 4 premium` },
    { image: null, text: `Many consider the Exotic skins better than premium, so they decide theres no point in buying them. Serial better add some more animated skins grrrr` },
    { image: null, text: `There are 73 hats in the game` },
    { image: null, text: `South America is the least used server in lolbeans, good to grind for wins except that your ping might die` },
    { image: null, text: `US east is considered to be the most used server in all of LOLbeans, %50 of players use it, says gemini (might be wrong since its gemini)` },
    { image: null, text: `I'm running out of facts` },
    { image: null, text: `Whats the rarest Block in Minecraft?` },
    { image: null, text: `There's always a chance a random noob gets 11s on silly slide because the slide has a chance of launching you to the finish line from hitting you to hard with the spinning thingies.` },
    { image: null, text: `The Boulderhill Caterpillar boost trick actually took a while to get discovered, very surpising.` },
    { image: null, text: `Beacon bay is considered by many to be the only map thats better to do with Air movement toggled off. Since the platforms at the end give you a much bigger boost with it.` },
    { image: null, text: `The Crawling superpower is getting a tiny bit of hate because of how hilariously cursed it looks` },
    { image: null, cookie: true, text: `You get a lucky Bean Cookie! Click to see whats inside` },
    { image: null, text: `An average bean takes 2 days to walk a mile because of how smol it is` },
    { image: null, text: `Solve the mysterious riddle: Seixxk Seivion` },
    { image: null, text: `A beans Favorite food is the Arrowhead Mills Organic Puffed Kamut Cereal, because its the only food source they found in mill valley.` },
    { image: null, text: `There's a secret fact hidden somewhere` },
    { image: null, text: `Have you seen the biker? He has been VERY suspicious lately....` },
    { image: null, text: `The best forms of tournaments are SNLF Tournaments that go on every Saturday, You can join these tournaments from the bean champs Discord Server! https://discord.gg/36JB44AQ7C` },
    { image: null, text: `If you use black angel as your skin like me, there's a TON of people who do too just so you know` },
    { image: null, text: `One thing I will never understand how to do is Grammar` },
    { image: null, text: `I used ai to generate this fact for me and you cant stop me >:D` },
    { image: null, text: `People take Lava lake too seriously, 0.01s better PB isn't that cool unless its 33s` },
    { image: null, text: `Shoutout to nekoke for being good at existing.` },
    { image: null, text: `HayHay15 is was so good in his prime that even after he quit for a while he is still top 70 while i'm typing this` },
    { image: null, text: `A lot of OG's quit bcs their uncs now LMAO` },
    { image: null, text: `5 LIttle Beanies Jumping on my Balls` },
    { image: null, text: `This message` },
    { image: null, text: `is one part of three` },
    { image: null, text: `and you have to find and match` },
    { image: null, text: `Them togheter` },
    { image: null, text: `I train my bean, so if you try going on a pushing battle with me keep that in mind.... I defeated A poor fella named Wizard once, I dont want the same to happen to you....` },
    { image: null, text: `The Repetitive Loop system is weird` },
    { image: null, text: `Remember when you didnt know how to b-hop?` },
    { image: null, text: `The game was co-developed by Exodragon Games and Big Boss Dolphin, and in case you didn't know, Exodragon is also the creators of other io games such as Yohoho and Defly.io` },
    { image: null, text: `Apparently there's creepy pasta about the game on some Wiki? Who is Evil bean....` },
    { image: null, text: `There's an easter egg on top of the volcano in Lava lake!` },
    { image: null, text: `I am 14 years old` },
    { image: null, text: `Some facts here might be outdated` },
    { image: null, text: `If you never go for double UFO boost, at least go for front UFO boost, its easier and doesnt sacrifice too much time.` },
    { image: null, text: `Negavanitia has to be the biggest WR Grinder, He not only got so many records back in the day, but also stole a lot of community level WR'ds on his channel` },
    { image: null, text: `The hardest easy-looking trick has to be 12 seconds on kittie kegs trick. This is an opinion please dont kill me.` },
    { image: null, text: `Axe Whack trick in Risky Cliffs is still a WR strat that we haven't seen succeeded yet.` },
    { image: null, text: `You can actually jump on the pumpkin guy in Escape tsunami to skip the wave, but its an useless trick as far as we know since you barely dont get far enough to not get swiped by another wave before taking the second checkpoint.` },
    { image: null, text: `If your a Daily Basis lounge player who plays whos daddy games, AND your over 12 years old, you have to lock in bro` },
    { image: null, text: `The current lobby map "BallDrops" Used to be much simpler and was the only lobby in the game back in the day.` },
    { image: null, text: `They should add more Tag maps` },
    { image: null, text: `Did you know that calling yourself a coder while using vibecode means your an idiot? Isn't it surprising!` },
    { image: null, text: `Beans in real life taste good` },
    { image: null, text: `Lolbeans Merch would be peak, always wanted to have or make some...` },
    { image: null, text: `Most people found lolbeans through Crazy games, I myself found it from a Negavantia video.... Just me?!` },
    { image: null, text: `Grief is the current hardest level beaten in Geometry Dash` },
    { image: null, text: `You have free will` },
    { image: null, text: `People discover the most crazy tricks first day a map even releases, idk how their brain work.` },
    { image: null, text: `Back in the day, monthly crown grinders were so crazy that someone got 2.7k wins in one month only.` },
    { image: null, text: `Rayan(Bockbockri) is a player With over 10k wins in lolbeans, he is like top 2-7 I think in most wins in the game... That's the best I could find.` },
    { image: null, text: `The came used to have only like 10 different colors, they were all pretty dark.` },
    { image: null, text: `you know their a bot if they have the reindeer horns hat on....` },
    { image: null, text: `First NEW MAPS release were Silly slide and Boulder hill that made the game have 5 maps randomized` },
    { image: null, text: `the UI system where it shows you which map is getting picked was a long awaited feature that took a bit too long to finally come out. If im not wrong the game used to say which map is next.` },
    { image: null, text: `Sounds only came out after more than 20 individual updates, also to those confused YES the game has sounds 😭` },
    { image: null, text: `Only 2 of the facts have emoojiz in them` },
    { image: null, text: `🫃` },
    { image: null, text: `You used to not know about this games existence` },
    { image: null, text: `To the person reading this, I hope that whatever isrogen that your okay` },
    { image: null, text: `I hope this website will succeed....` },
    { image: null, text: `Lolbeans is a great game` }
];

let factTimerInterval = null;

function getBirthdayTarget() {
    // Oct 14, 2027 (local midnight); once passed, resets to 365 days later, repeating.
    const target = new Date(2027, 9, 14, 0, 0, 0);
    const now = new Date();
    while (now >= target) target.setDate(target.getDate() + 365);
    return target;
}

function updateFactTimer() {
    const diff = getBirthdayTarget() - new Date();
    const total = Math.max(0, Math.floor(diff / 1000));
    const d = Math.floor(total / 86400);
    const h = Math.floor((total % 86400) / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    document.getElementById('fact-timer').textContent = `${d}d ${h}h ${m}m ${s}s`;
}

function stopFactTimer() {
    if (factTimerInterval) clearInterval(factTimerInterval);
    factTimerInterval = null;
}

function renderFactText(text) {
    const el = document.getElementById('fact-text');
    el.replaceChildren();
    text.split(/(https?:\/\/\S+)/g).forEach((part) => {
        if (/^https?:\/\//.test(part)) {
            const a = document.createElement('a');
            a.href = part;
            a.textContent = part;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.style.color = '#8db8ff';
            el.appendChild(a);
        } else if (part) {
            el.appendChild(document.createTextNode(part));
        }
    });
}

function generateFunFact() {
    // Equal chance for each fact: 1 / FUN_FACTS.length (exactly 1% at 100 facts)
    const fact = FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)];
    stopFactTimer();
    document.getElementById('fact-box').hidden = false;
    renderFactText(fact.text);

    const img = document.getElementById('fact-image');
    if (fact.image) { img.src = fact.image; img.hidden = false; }
    else { img.hidden = true; img.removeAttribute('src'); }

    const cookieBtn = document.getElementById('fact-cookie');
    const cookieMsg = document.getElementById('fact-cookie-msg');
    cookieMsg.hidden = true;
    cookieMsg.textContent = '';
    cookieBtn.hidden = !fact.cookie;
    cookieBtn.disabled = false;

    const timerEl = document.getElementById('fact-timer');
    if (fact.timer) {
        timerEl.hidden = false;
        updateFactTimer();
        factTimerInterval = setInterval(updateFactTimer, 1000);
    } else {
        timerEl.hidden = true;
    }
}

document.getElementById('generate-fact-btn').addEventListener('click', generateFunFact);

const COOKIE_MESSAGES = [
    () => `Your lucky number is ${Math.floor(Math.random() * 100) + 1}`,
    () => `There's nothing here, get scammed lol`,
    () => `Someone Ugly is gonna make your day pretty today`,
    () => `that shrek looking biker in the shop is selling weed, dont tell anyone`
];
document.getElementById('fact-cookie').addEventListener('click', (event) => {
    const cookieBtn = event.currentTarget;
    if (cookieBtn.disabled) return;
    cookieBtn.disabled = true; // one reveal per cookie; generate the fact again for a new one
    const msg = document.getElementById('fact-cookie-msg');
    msg.textContent = COOKIE_MESSAGES[Math.floor(Math.random() * COOKIE_MESSAGES.length)]();
    msg.hidden = false;
});
