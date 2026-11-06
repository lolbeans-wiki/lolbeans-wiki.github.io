const nicknameForm = document.querySelector('#live-chat-nickname-form');
const nicknameInput = document.querySelector('#live-chat-nickname');
const chatFrame = document.querySelector('#live-chat-frame');

nicknameForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const nickname = nicknameInput.value.trim().slice(0, 20);
    if (!nickname) {
        nicknameInput.focus();
        return;
    }

    const chat = document.createElement('iframe');
    const parameters = new URLSearchParams({
        nickname,
        theme: 'theme--night',
        custom_css_path: 'https://lolbeans-wiki.github.io/css/live-chat-overrides.css?v=20261106-chat-users-v6',
    });
    chat.src = `https://embed.tlk.io/lolbeans-wiki-live-chat?${parameters}`;
    chat.title = 'LolBeans Wiki live chat';
    chat.allow = 'clipboard-read; clipboard-write';
    document.querySelector('#live-chat-prompt').remove();
    chatFrame.prepend(chat);
});
