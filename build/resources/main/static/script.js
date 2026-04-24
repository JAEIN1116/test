document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('send-btn');
    const chatInput = document.getElementById('chat-input');
    const chatBox = document.getElementById('chat-box');

    function appendMessage(text, isUser) {
        const msgDiv = document.createElement('div');
        msgDiv.textContent = text;
        msgDiv.style.padding = '8px 12px';
        msgDiv.style.borderRadius = '12px';
        msgDiv.style.maxWidth = '80%';
        msgDiv.style.wordBreak = 'break-word';

        if (isUser) {
            msgDiv.style.alignSelf = 'flex-end';
            msgDiv.style.background = 'rgba(74, 222, 128, 0.2)'; // 연한 녹색 (사용자)
            msgDiv.style.borderBottomRightRadius = '0';
        } else {
            msgDiv.style.alignSelf = 'flex-start';
            msgDiv.style.background = 'rgba(99, 102, 241, 0.2)'; // 보라색 (AI)
            msgDiv.style.borderBottomLeftRadius = '0';
        }

        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        appendMessage(text, true);
        chatInput.value = '';
        sendBtn.disabled = true;
        sendBtn.textContent = '...';

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            if (!response.ok) throw new Error('API Error');
            const data = await response.json();
            appendMessage(data.reply, false);
        } catch (error) {
            console.error('Error:', error);
            appendMessage('❌ 에러 발생: 서버와 통신할 수 없습니다.', false);
        } finally {
            sendBtn.disabled = false;
            sendBtn.textContent = '전송';
        }
    }

    // 페이지 로드 시 기존 대화 내역 불러오기
    async function loadHistory() {
        try {
            const response = await fetch('/api/history');
            if (response.ok) {
                const history = await response.json();
                chatBox.innerHTML = ''; // 기존 "안녕하세요" 메시지 등 초기화
                history.forEach(chat => {
                    appendMessage(chat.message, chat.sender === 'USER');
                });
                if (history.length === 0) {
                    appendMessage('안녕하세요! 무엇이든 물어보세요!', false);
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

    function createBurst(element) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.width = '10px';
            particle.style.height = '10px';
            particle.style.background = i % 2 === 0 ? '#6366f1' : '#a855f7';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9999';
            
            document.body.appendChild(particle);

            const angle = (i / 8) * Math.PI * 2;
            const velocity = 50 + Math.random() * 50;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            particle.animate([
                { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
                { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
            ], {
                duration: 600,
                easing: 'cubic-bezier(0, .9, .57, 1)'
            }).onfinish = () => particle.remove();
        }
    }
});
