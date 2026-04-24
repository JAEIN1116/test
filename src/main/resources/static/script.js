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
        
        if (isUser || isHistory) {
            // 유저 메시지나 히스토리는 즉시 출력 (마크다운 적용)
            msgDiv.innerHTML = isUser ? message : marked.parse(message);
            chatBox.appendChild(msgDiv);
        } else {
            // AI의 새 메시지는 타이핑 효과 적용
            chatBox.appendChild(msgDiv);
            typeWriter(msgDiv, message);
        }
        
        chatBox.scrollTop = chatBox.scrollHeight;
        return msgDiv;
    }

    function typeWriter(element, text) {
        let i = 0;
        element.innerHTML = '';
        const speed = 20; // 타이핑 속도 (ms)

        function type() {
            if (i < text.length) {
                // 한 글자씩 추가하되, 마크다운 렌더링을 위해 전체를 다시 파싱
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
        indicator.innerHTML = '<span></span><span></span><span></span>';
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
