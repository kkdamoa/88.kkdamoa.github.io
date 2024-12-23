function displayResults() {
    const selectedCards = JSON.parse(localStorage.getItem('selectedCards'));
    const resultContainer = document.getElementById('reading-result');

    if (!selectedCards || selectedCards.length !== 3) {
        resultContainer.innerHTML = '<p>오류가 발생했습니다. 카드를 다시 선택해주세요.</p>';
        return;
    }

    selectedCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'result-card';
        cardElement.innerHTML = `
            <div class="card-image">
                <img src="${card.image}" alt="${card.name}">
            </div>
            <div class="card-info">
                <h2>${card.name}</h2>
                <p><strong>키워드:</strong> ${card.keywords.join(', ')}</p>
                <p><strong>해석:</strong> ${card.interpretation}</p>
            </div>
        `;
        resultContainer.appendChild(cardElement);
    });
}

window.onload = displayResults;