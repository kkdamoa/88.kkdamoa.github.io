import tarotData from './tarot-data.js';

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const cardIds = urlParams.get('cards')?.split(',').map(Number) || [];
    
    if (!cardIds.length) {
        window.location.href = 'index.html';
        return;
    }
    
    const selectedCards = cardIds.map(id => 
        tarotData.major.find(card => card.id === id)
    ).filter(Boolean);
    
    if (selectedCards.length !== 3) {
        window.location.href = 'index.html';
        return;
    }
    
    const cardsDetailElement = document.getElementById('cardsDetail');
    const positions = ['과거', '현재', '미래'];
    
    selectedCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card-detail';
        cardElement.innerHTML = `
            <h3>${positions[index]}: ${card.name}</h3>
            <div class="card-image">
                <img src="images/${card.image}" alt="${card.name}" loading="lazy">
            </div>
            <div class="card-meanings">
                <h4>키워드</h4>
                <p>${card.keywords.join(', ')}</p>
                
                <h4>사랑</h4>
                <p>${card.meanings.love.upright}</p>
                
                <h4>경력</h4>
                <p>${card.meanings.career.upright}</p>
                
                <h4>금전</h4>
                <p>${card.meanings.money.upright}</p>
                
                <h4>건강</h4>
                <p>${card.meanings.health.upright}</p>
            </div>
        `;
        cardsDetailElement.appendChild(cardElement);
    });
});