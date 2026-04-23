document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('action-btn');
    
    btn.addEventListener('click', async () => {
        btn.textContent = 'Loading...';
        btn.style.transform = 'scale(0.95)';
        
        try {
            // 서버(Tomcat)로 API 요청을 보냅니다.
            const response = await fetch('api.jsp');
            
            // 톰캣이 켜져있지 않거나, 단순히 HTML 파일로 열었을 경우 JSON 파싱 에러가 발생합니다.
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            
            document.getElementById('api-result').innerHTML = 
                `API Success: ${data.message} <br> Time: ${data.serverTime}`;
            
            btn.textContent = 'Success!';
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('api-result').innerHTML = 
                '❌ Failed! Tomcat server is NOT running or you opened the file directly.';
            btn.textContent = 'Error!';
        }

        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 150);

        setTimeout(() => {
            btn.textContent = 'Call Tomcat API';
        }, 2000);
        
        createBurst(btn);
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
