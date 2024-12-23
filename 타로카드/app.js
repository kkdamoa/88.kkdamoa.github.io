import tarotData from './tarot-data.js';

let selectedCards = [];
let isShuffling = false;

function shuffleCards() {
    if (isShuffling) return;
    isShuffling = true;
    
    selectedCards = [];
    const cardsContainer = document.getElementById('cardsContainer');
    cardsContainer.innerHTML = '';
    
    // 버튼 숨기기
    document.getElementById('detailButton').style.display = 'none';
    document.getElementById('shareButton').style.display = 'none';
    document.getElementById('restartButton').style.display = 'none';
    
    // 메이저 아르카나에서 카드 셔플
    const shuffledCards = [...tarotData.major].sort(() => Math.random() - 0.5);
    
    // 3장의 카드 선택
    selectedCards = shuffledCards.slice(0, 3);
    
    // 카드 애니메이션
    selectedCards.forEach((card, index) => {
        setTimeout(() => {
            const cardElement = createCardElement(card, index);
            cardsContainer.appendChild(cardElement);
            
            if (index === 2) {
                setTimeout(() => {
                    document.getElementById('detailButton').style.display = 'inline-block';
                    document.getElementById('shareButton').style.display = 'inline-block';
                    document.getElementById('restartButton').style.display = 'inline-block';
                    isShuffling = false;
                }, 1000);
            }
        }, index * 800);
    });
}

function createCardElement(card, index) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.innerHTML = `
        <div class="card-inner">
            <div class="card-front">
                <img src="images/card-back.jpg" alt="카드 뒷면" loading="lazy">
            </div>
            <div class="card-back">
                <img src="images/${card.image}" alt="${card.name}" loading="lazy">
            </div>
        </div>
    `;
    
    setTimeout(() => {
        cardDiv.classList.add('flipped');
    }, 500);
    
    return cardDiv;
}

function showDetail() {
    const cardIds = selectedCards.map(card => card.id);
    window.location.href = `detail.html?cards=${cardIds.join(',')}`;
}

function shareResult() {
    const currentUrl = window.location.href;
    
    try {
        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: '나의 타로 카드 운세',
                description: '타로 카드로 보는 나의 운세 결과입니다.',
                imageUrl: `${window.location.origin}/images/${selectedCards[0].image}`,
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
    } catch (error) {
        console.error('카카오 공유하기 에러:', error);
        alert('공유하기를 실행할 수 없습니다.');
    }
}

// 전역 함수로 등록
window.shuffleCards = shuffleCards;
window.showDetail = showDetail;
window.shareResult = shareResult;

// 페이지 로드 시 자동으로 카드 섞기
document.addEventListener('DOMContentLoaded', shuffleCards);