// 선택된 카드들을 저장할 배열
let selectedCards = [];

// 카드 셔플 함수
function shuffleCards() {
    // 기존 선택된 카드들 초기화
    selectedCards = [];
    const cardsContainer = document.getElementById('cardsContainer');
    cardsContainer.innerHTML = '';
    
    // 카드 데이터 복사 후 셔플
    const shuffledCards = [...tarotData].sort(() => Math.random() - 0.5);
    
    // 3장의 카드만 선택
    selectedCards = shuffledCards.slice(0, 3);
    
    // 카드 애니메이션을 위한 지연 시간
    selectedCards.forEach((card, index) => {
        setTimeout(() => {
            const cardElement = createCardElement(card, index);
            cardsContainer.appendChild(cardElement);
            
            // 마지막 카드가 추가된 후 버튼들 표시
            if (index === 2) {
                document.getElementById('detailButton').style.display = 'inline-block';
                document.getElementById('shareButton').style.display = 'inline-block';
            }
        }, index * 500); // 각 카드를 0.5초 간격으로 표시
    });
}

// 카드 엘리먼트 생성 함수
function createCardElement(card, index) {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.innerHTML = `
        <img src="${card.image}" alt="${card.name}">
        <h3>${card.name}</h3>
    `;
    
    // 카드 등장 애니메이션
    cardElement.style.opacity = '0';
    cardElement.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        cardElement.style.transition = 'all 0.5s ease';
        cardElement.style.opacity = '1';
        cardElement.style.transform = 'translateY(0)';
    }, 100);
    
    return cardElement;
}

// 상세 보기 페이지로 이동
function showDetail() {
    const cardIds = selectedCards.map(card => card.id).join(',');
    window.location.href = `detail.html?cards=${cardIds}`;
}

// 카카오톡 공유하기 기능
function shareToKakao() {
    Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: '나의 타로 카드 운세',
            description: '타로 카드로 보는 나의 운세 결과입니다.',
            imageUrl: selectedCards[0].image,
            link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href,
            },
        },
        buttons: [
            {
                title: '결과 보기',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href,
                },
            },
        ],
    });
}