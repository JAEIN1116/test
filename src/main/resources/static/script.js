document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');

    // 마크다운 설정 (줄바꿈 허용)
    marked.setOptions({
        breaks: true,
        gfm: true
    });

    function appendMessage(message, isUser, isHistory = false) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message');
        msgDiv.classList.add(isUser ? 'user-message' : 'ai-message');
        
        // 아바타 추가
        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('avatar');
        const img = document.createElement('img');
        img.src = isUser ? 'user-avatar.png' : 'jane-avatar.png';
        img.onerror = () => { avatarDiv.innerHTML = isUser ? '👤' : '🤖'; }; // 이미지 없으면 이모지로 대체
        avatarDiv.appendChild(img);
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('msg-content');
        
        msgDiv.appendChild(avatarDiv);
        msgDiv.appendChild(contentDiv);
        
        if (isUser || isHistory) {
            contentDiv.innerHTML = isUser ? message : marked.parse(message);
            chatBox.appendChild(msgDiv);
        } else {
            chatBox.appendChild(msgDiv);
            typeWriter(contentDiv, message);
        }
        
        chatBox.scrollTop = chatBox.scrollHeight;
        return msgDiv;
    }

    function typeWriter(element, text) {
        let i = 0;
        element.innerHTML = '';
        const speed = 20;

        function type() {
            if (i < text.length) {
                element.innerHTML = marked.parse(text.substring(0, i + 1));
                i++;
                chatBox.scrollTop = chatBox.scrollHeight;
                setTimeout(type, speed);
            }
        }
        type();
    }

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'typing-indicator';
        indicator.classList.add('message', 'ai-message', 'typing');
        
        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('avatar');
        avatarDiv.innerHTML = '🤖';
        
        const dotsDiv = document.createElement('div');
        dotsDiv.classList.add('msg-content');
        dotsDiv.innerHTML = '<span></span><span></span><span></span>';
        
        indicator.appendChild(avatarDiv);
        indicator.appendChild(dotsDiv);
        
        chatBox.appendChild(indicator);
        chatBox.scrollTop = chatBox.scrollHeight;
        return indicator;
    }

    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        appendMessage(message, true);
        chatInput.value = '';

        const indicator = showTypingIndicator();

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message })
            });

            const data = await response.json();
            indicator.remove(); // 타이핑 표시 제거

            if (data.reply) {
                appendMessage(data.reply, false);
            } else {
                appendMessage('에러가 발생했습니다: ' + (data.error || '알 수 없는 오류'), false);
            }
        } catch (error) {
            indicator.remove();
            appendMessage('서버와 통신 중 오류가 발생했습니다.', false);
        }
    }

    async function loadHistory() {
        try {
            const response = await fetch('/api/history');
            if (response.ok) {
                const history = await response.json();
                chatBox.innerHTML = '';
                history.forEach(chat => {
                    appendMessage(chat.message, chat.sender === 'USER', true);
                });
                if (history.length === 0) {
                    appendMessage('안녕하세요! 무엇이든 물어보세요!', false, true);
                }
            }
        } catch (error) {
            console.error('History load failed:', error);
        }
    }

    loadHistory();

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});
