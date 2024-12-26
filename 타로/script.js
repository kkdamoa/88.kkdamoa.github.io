import tarotData from './tarot-data.js';

document.addEventListener('DOMContentLoaded', () => {
    const selectButton = document.getElementById('selectCards');
    const cardSlots = document.querySelectorAll('.card-slot');
    const shareButton = document.getElementById('shareKakao');
    let selectedCards = [];

    selectButton.addEventListener('click', () => {
        // 카드 초기화
        selectedCards = [];
        cardSlots.forEach(slot => {
            slot.classList.remove('flipped');
            const reading = document.getElementById(`reading${slot.id.slice(-1)}`);
            reading.style.display = 'none';
        });

        // 랜덤으로 3장의 카드 선택
        const shuffledCards = [...tarotData.major].sort(() => Math.random() - 0.5);
        selectedCards = shuffledCards.slice(0, 3);

        // 카드 표시
        selectedCards.forEach((card, index) => {
            const cardSlot = cardSlots[index];
            const cardFront = cardSlot.querySelector('.card-front');
            
            // 카드 이미지와 정보 설정
            cardFront.innerHTML = `
                <h3>${card.name}</h3>
                <img src="images/${card.image}" alt="${card.name}" style="width: 150px; height: 250px; object-fit: cover;">
            `;

            // 클릭 이벤트 추가
            cardSlot.onclick = () => revealCard(index + 1, card);
        });
    });

    function revealCard(index, card) {
        const cardSlot = document.getElementById(`card${index}`);
        const reading = document.getElementById(`reading${index}`);
        
        if (!cardSlot.classList.contains('flipped')) {
            cardSlot.classList.add('flipped');
            
            // 해석 표시
            reading.innerHTML = `
                <h3>${card.name}</h3>
                <p><strong>키워드:</strong> ${card.keywords.join(', ')}</p>
                <p><strong>해석:</strong> ${card.interpretation.설명}</p>
                <p><strong>메시지:</strong> ${card.interpretation.메시지}</p>
            `;
            reading.style.display = 'block';
        }

        // 모든 카드가 공개되었는지 확인
        if (document.querySelectorAll('.card-slot.flipped').length === 3) {
            shareButton.style.display = 'inline-block';
        }
    }

    // 카카오톡 공유하기
    shareButton.addEventListener('click', () => {
        Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
                title: '타로 카드 운세',
                description: '나의 운세를 확인해보세요!',
                imageUrl: 'YOUR_IMAGE_URL',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href,
                },
            },
            buttons: [
                {
                    title: '웹으로 보기',
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href,
                    },
                },
            ],
        });
    });
});