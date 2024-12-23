// 선택된 카드를 저장할 배열
let selectedCards = [];
const maxSelections = 3;

// 배열을 섞는 함수
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 카드 생성 함수
function createCards() {
    const cardContainer = document.getElementById('card-container');
    const shuffledCards = shuffleArray([...tarotData]);

    shuffledCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.card = card.id; // 카드의 고유 ID 저장
        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-back">
                    <div class="card-corner"></div>
                    <div class="card-corner"></div>
                    <div class="card-corner"></div>
                    <div class="card-corner"></div>
                </div>
                <div class="card-front">
                    <img src="${card.image}" alt="${card.name}">
                    <div class="card-title">${card.name}</div>
                </div>
            </div>
        `;

        cardElement.addEventListener('click', () => selectCard(cardElement, card));
        cardContainer.appendChild(cardElement);
    });
}

// 카드 선택 함수
function selectCard(cardElement, cardData) {
    // 이미 3장이 선택되었고, 현재 카드가 선택되지 않은 상태라면 선택 불가
    if (selectedCards.length >= maxSelections && !cardElement.classList.contains('selected')) {
        alert('이미 3장의 카드를 선택하셨습니다.');
        return;
    }

    // 카드 선택 토글
    cardElement.classList.toggle('selected');
    
    if (cardElement.classList.contains('selected')) {
        // 카드 선택
        selectedCards.push(cardData);
    } else {
        // 카드 선택 해제
        selectedCards = selectedCards.filter(card => card.id !== cardData.id);
    }

    // 결과 보기 버튼 상태 업데이트
    updateResultButton();
}

// 결과 보기 버튼 상태 업데이트 함수
function updateResultButton() {
    const resultButton = document.getElementById('showResult');
    resultButton.disabled = selectedCards.length !== maxSelections;
}

// 결과 보기 버튼 클릭 이벤트
document.getElementById('showResult').addEventListener('click', () => {
    if (selectedCards.length === maxSelections) {
        // 선택된 카드 정보를 로컬 스토리지에 저장
        localStorage.setItem('selectedCards', JSON.stringify(selectedCards));
        // 결과 페이지로 이동
        window.location.href = 'result.html';
    }
});

// 카카오톡 공유하기 기능
function shareToKakao() {
    Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
            title: '타로 카드 리딩 결과',
            description: '나의 운세를 확인해보세요!',
            imageUrl: 'YOUR_IMAGE_URL', // 대표 이미지 URL
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

// 페이지 로드 시 카드 생성
window.onload = createCards;