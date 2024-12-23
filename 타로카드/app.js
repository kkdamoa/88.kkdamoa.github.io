let selectedCards = [];
const maxSelections = 3;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createCards() {
    const cardContainer = document.getElementById('card-container');
    const shuffledCards = shuffleArray([...tarotData]);

    shuffledCards.forEach((card, index) => {
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

        cardElement.addEventListener('click', () => selectCard(cardElement, card));
        cardContainer.appendChild(cardElement);
    });
}

function selectCard(cardElement, cardData) {
    if (selectedCards.length >= maxSelections && !cardElement.classList.contains('selected')) {
        return;
    }

    cardElement.classList.toggle('selected');
    
    if (cardElement.classList.contains('selected')) {
        selectedCards.push(cardData);
    } else {
        selectedCards = selectedCards.filter(card => card.name !== cardData.name);
    }

    const resultButton = document.getElementById('showResult');
    resultButton.disabled = selectedCards.length !== maxSelections;
}

document.getElementById('showResult').addEventListener('click', () => {
    if (selectedCards.length === maxSelections) {
        localStorage.setItem('selectedCards', JSON.stringify(selectedCards));
        window.location.href = 'result.html';
    }
});

window.onload = createCards;