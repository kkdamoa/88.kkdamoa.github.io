import tarotData from './tarot-data.js';

class TarotApp {
    constructor() {
        this.cards = tarotData.major;
        this.selectedCards = [];
        this.maxCards = 3;
        this.positions = ['과거', '현재', '미래'];
        this.isShuffling = false;
        
        this.initializeElements();
        this.addEventListeners();
        this.renderCards();
    }

    initializeElements() {
        this.cardsContainer = document.querySelector('.cards-container');
        this.shuffleButton = document.querySelector('button');
        this.resultSection = document.querySelector('.reading-result');
        this.loadingScreen = document.querySelector('.loading-screen');
    }

    addEventListeners() {
        this.shuffleButton.addEventListener('click', () => this.shuffleCards());
        this.cardsContainer.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            if (card && !this.isShuffling && !card.classList.contains('selected')) {
                this.selectCard(card);
            }
        });
    }

    renderCards() {
        this.cardsContainer.innerHTML = this.cards.map((card, index) => `
            <div class="card" data-index="${index}">
                <div class="card-inner">
                    <div class="card-back"></div>
                    <div class="card-front">
                        <span class="card-number">${card.id}</span>
                        <div class="card-title">${card.name}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async shuffleCards() {
        if (this.isShuffling) return;
        
        this.isShuffling = true;
        this.shuffleButton.disabled = true;
        this.showLoading('카드를 섞는 중...');

        // 카드 섞기 애니메이션
        this.cardsContainer.classList.add('shuffling');
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 카드 배열 섞기
        this.cards = [...this.cards].sort(() => Math.random() - 0.5);
        
        this.renderCards();
        this.hideLoading();
        
        this.cardsContainer.classList.remove('shuffling');
        this.shuffleButton.disabled = false;
        this.isShuffling = false;
        
        // 선택된 카드 초기화
        this.selectedCards = [];
        if (this.resultSection) {
            this.resultSection.innerHTML = '';
        }
    }

    selectCard(cardElement) {
        if (this.selectedCards.length >= this.maxCards) return;

        const index = parseInt(cardElement.dataset.index);
        const card = this.cards[index];
        
        // 카드 선택 효과
        cardElement.classList.add('selecting');
        setTimeout(() => {
            cardElement.classList.add('selected');
            cardElement.classList.remove('selecting');
        }, 800);

        this.selectedCards.push({
            ...card,
            isReversed: Math.random() < 0.5
        });

        if (this.selectedCards.length === this.maxCards) {
            this.showReading();
        }
    }

    showReading() {
        const readingHTML = this.selectedCards.map((card, index) => `
            <div class="category">
                <h3>${this.positions[index]}: ${card.name} ${card.isReversed ? '(역방향)' : ''}</h3>
                <p>${card.interpretation.설명}</p>
                <p>${card.isReversed ? card.interpretation.부정적인 : card.interpretation.긍정적인}</p>
                <p><strong>메시지:</strong> ${card.interpretation.메시지}</p>
            </div>
        `).join('');

        if (this.resultSection) {
            this.resultSection.innerHTML = `
                <h2>타로 해석</h2>
                <div class="interpretation-categories">
                    ${readingHTML}
                </div>
            `;
        }
    }

    showLoading(message) {
        this.loadingScreen.querySelector('p').textContent = message;
        this.loadingScreen.style.display = 'flex';
    }

    hideLoading() {
        this.loadingScreen.style.display = 'none';
    }
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    new TarotApp();
});