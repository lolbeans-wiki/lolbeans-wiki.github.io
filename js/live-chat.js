const nicknameForm = document.querySelector('#live-chat-nickname-form');
const nicknameInput = document.querySelector('#live-chat-nickname');
const chatFrame = document.querySelector('#live-chat-frame');
const nicknameStorageKey = 'lolbeans-wiki-live-chat-nickname';

function joinChat(nickname) {
    const chat = document.createElement('iframe');
    const parameters = new URLSearchParams({
        nickname,
        theme: 'theme--night',
        custom_css_path: 'https://lolbeans-wiki.github.io/css/live-chat-overrides.css?v=20261106-chat-users-v10',
    });
    chat.src = `https://embed.tlk.io/lolbeans-wiki-live-chat?${parameters}`;
    chat.title = 'LolBeans Wiki live chat';
    chat.allow = 'clipboard-read; clipboard-write';
    nicknameForm.hidden = true;
    document.querySelector('#live-chat-prompt').remove();
    chatFrame.prepend(chat);
}

const savedNickname = localStorage.getItem(nicknameStorageKey);
if (savedNickname) {
    joinChat(savedNickname);
}

nicknameForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const nickname = nicknameInput.value.trim().slice(0, 20);
    if (!nickname) {
        nicknameInput.focus();
        return;
    }

    localStorage.setItem(nicknameStorageKey, nickname);
    joinChat(nickname);
});
