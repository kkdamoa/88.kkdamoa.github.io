import tarotData from './tarot-data.js';

class TarotApp {
    constructor() {
        this.allCards = tarotData.major;
        this.displayedCards = [];
        this.selectedCards = [];
        this.maxCards = 3;
        this.positions = ['과거', '현재', '미래'];
        this.isShuffling = false;
        
        this.initializeElements();
        this.addEventListeners();
        this.selectRandomCards();
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

    selectRandomCards() {
        // 전체 카드에서 랜덤하게 3장 선택
        this.displayedCards = [...this.allCards]
            .sort(() => Math.random() - 0.5)
            .slice(0, this.maxCards);
        
        this.renderCards();
    }

    renderCards() {
        this.cardsContainer.innerHTML = this.displayedCards.map((card, index) => `
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
        
        // 새로운 랜덤 카드 3장 선택
        this.selectRandomCards();
        
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
        const index = parseInt(cardElement.dataset.index);
        const card = this.displayedCards[index];
        
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

        this.showReading();
    }

    showReading() {
        const card = this.selectedCards[this.selectedCards.length - 1];
        const position = this.positions[this.selectedCards.length - 1];

        const readingHTML = `
            <div class="category">
                <h3>${position}: ${card.name} ${card.isReversed ? '(역방향)' : ''}</h3>
                <p>${card.interpretation.설명}</p>
                <p>${card.isReversed ? card.interpretation.부정적인 : card.interpretation.긍정적인}</p>
                <p><strong>메시지:</strong> ${card.interpretation.메시지}</p>
            </div>
        `;

        if (this.resultSection) {
            if (this.selectedCards.length === 1) {
                this.resultSection.innerHTML = `
                    <h2>타로 해석</h2>
                    <div class="interpretation-categories">
                        ${readingHTML}
                    </div>
                `;
            } else {
                this.resultSection.querySelector('.interpretation-categories')
                    .insertAdjacentHTML('beforeend', readingHTML);
            }
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