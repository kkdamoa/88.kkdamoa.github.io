let selectedCards = [];
const maxCards = 3;

document.addEventListener('DOMContentLoaded', function() {
    initializeDeck();
    setupKakaoShare();
});

function initializeDeck() {
    const deckContainer = document.querySelector('.deck-container');
    tarotData.forEach((card, index) => {
        const cardElement = createCard(card, index);
        deckContainer.appendChild(cardElement);
    });
}

function createCard(card, index) {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.innerHTML = `
        <div class="card-inner">
            <div class="card-back"></div>
            <div class="card-front">
                <img src="${card.image}" alt="${card.name}">
            </div>
        </div>
    `;

    cardElement.addEventListener('click', () => handleCardClick(cardElement, card));
    return cardElement;
}

function handleCardClick(cardElement, card) {
    if (selectedCards.length >= maxCards || cardElement.classList.contains('flipped')) {
        return;
    }

    cardElement.classList.add('flipped');
    selectedCards.push(card);

    if (selectedCards.length === maxCards) {
        document.getElementById('readingBtn').classList.remove('hidden');
        document.getElementById('shareKakao').classList.remove('hidden');
        displaySelectedCards();
    }
}

function displaySelectedCards() {
    const selectedCardsContainer = document.querySelector('.selected-cards');
    selectedCardsContainer.innerHTML = '';
    
    selectedCards.forEach((card, index) => {
        const cardReading = document.createElement('div');
        cardReading.className = 'card-reading';
        cardReading.innerHTML = `
            <img src="${card.image}" alt="${card.name}">
            <h3>${card.name}</h3>
            <p>${card.meaning}</p>
        `;
        selectedCardsContainer.appendChild(cardReading);
    });
}

function setupKakaoShare() {
    document.getElementById('shareKakao').addEventListener('click', function() {
        Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
                title: '나의 타로 카드 운세',
                description: '선택된 카드로 보는 나의 운세',
                imageUrl: 'YOUR_IMAGE_URL',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href,
                }
            },
            buttons: [
                {
                    title: '웹으로 보기',
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href,
                    },
                },
            ]
        });
    });
}