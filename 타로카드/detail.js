document.addEventListener('DOMContentLoaded', function() {
    // URL에서 선택된 카드 ID들을 가져옴
    const urlParams = new URLSearchParams(window.location.search);
    const cardIds = urlParams.get('cards').split(',');
    
    // 선택된 카드들의 정보를 가져옴
    const selectedCards = cardIds.map(id => 
        tarotData.find(card => card.id === parseInt(id))
    );
    
    // 카드들을 화면에 표시
    const cardsDetailElement = document.getElementById('cardsDetail');
    const positions = ['과거', '현재', '미래'];
    
    selectedCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card-detail';
        cardElement.innerHTML = `
            <h3>${positions[index]}</h3>
            <img src="${card.image}" alt="${card.name}">
            <h4>${card.name}</h4>
            <p>${card.meaning}</p>
        `;
        cardsDetailElement.appendChild(cardElement);
    });
    
    // 종합 해석을 표시
    const interpretationElement = document.getElementById('interpretation');
    interpretationElement.innerHTML = `
        <h2>🔮 종합 해석</h2>
        <div class="interpretation-content">
            <p class="time-interpretation">
                <strong>과거:</strong> ${selectedCards[0].meaning}<br><br>
                <strong>현재:</strong> ${selectedCards[1].meaning}<br><br>
                <strong>미래:</strong> ${selectedCards[2].meaning}
            </p>
            <p class="combined-interpretation">
                ${generateCombinedInterpretation(selectedCards)}
            </p>
        </div>
    `;
});

// 종합 해석 생성 함수
function generateCombinedInterpretation(cards) {
    return `
        <strong>종합적인 메시지</strong><br>
        ${cards[0].name}, ${cards[1].name}, ${cards[2].name}의 조합이 보여주는 
        당신의 여정은 ${cards[0].meaning}에서 시작하여,
        현재 ${cards[1].meaning}의 상황을 겪고 있으며,
        앞으로 ${cards[2].meaning}의 방향으로 나아갈 것을 의미합니다.
        이는 당신의 성장과 변화의 과정을 보여주고 있습니다.
    `;
}

// 카카오톡 공유하기 기능
function shareToKakao() {
    const currentUrl = window.location.href;
    
    Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: '나의 타로 카드 운세 결과',
            description: '타로 카드가 보여주는 나의 과거, 현재, 미래',
            imageUrl: document.querySelector('.card-detail img').src,
            link: {
                mobileWebUrl: currentUrl,
                webUrl: currentUrl,
            },
        },
        buttons: [
            {
                title: '결과 보기',
                link: {
                    mobileWebUrl: currentUrl,
                    webUrl: currentUrl,
                },
            },
        ],
    });
}