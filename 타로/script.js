import tarotData from './tarot-data.js';

class TarotReading {
    constructor() {
        this.cards = tarotData.major;
        this.selectedCards = [];
        this.currentStep = 0;
        this.initializeElements();
        this.addEventListeners();
    }

    initializeElements() {
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.cardElements = document.querySelectorAll('.card');
        this.loadingScreen = document.querySelector('.loading-screen');
        this.readingResult = document.querySelector('.reading-result');
        this.shareButton = document.getElementById('shareKakao');
        this.resetButton = document.getElementById('resetReading');
    }

    addEventListeners() {
        this.shuffleBtn.addEventListener('click', () => this.startReading());
        this.cardElements.forEach(card => {
            card.addEventListener('click', (e) => this.handleCardClick(e));
        });
        this.shareButton.addEventListener('click', () => this.shareToKakao());
        this.resetButton.addEventListener('click', () => this.resetReading());
    }

    startReading() {
        this.loadingScreen.style.display = 'flex';
        this.shuffleBtn.style.display = 'none';
        
        setTimeout(() => {
            this.shuffleCards();
            this.loadingScreen.style.display = 'none';
            this.enableCardSelection();
        }, 1500);
    }

    shuffleCards() {
        this.cards = [...this.cards].sort(() => Math.random() - 0.5);
    }

    enableCardSelection() {
        this.cardElements.forEach(card => {
            if (!card.classList.contains('selected')) {
                card.classList.add('selectable');
            }
        });
    }

    handleCardClick(event) {
        const card = event.currentTarget;
        if (!card.classList.contains('selectable') || this.currentStep >= 3) return;

        const selectedCard = this.cards[this.currentStep];
        const isReversed = Math.random() < 0.5;
        
        this.selectedCards.push({
            ...selectedCard,
            isReversed,
            position: card.dataset.position
        });

        this.displayCard(card, selectedCard, isReversed);
        card.classList.remove('selectable');
        this.currentStep++;

        if (this.currentStep === 3) {
            setTimeout(() => this.showResults(), 1000);
        }
    }

    displayCard(cardElement, cardData, isReversed) {
        cardElement.classList.add('selected');
        const cardFront = cardElement.querySelector('.card-front');
        const cardTitle = cardElement.querySelector('.card-title');
        const cardNumber = cardElement.querySelector('.card-number');

        cardTitle.textContent = cardData.name;
        cardNumber.textContent = `${cardData.id}`;

        if (isReversed) {
            cardFront.style.transform = 'rotate(180deg)';
        }

        cardElement.querySelector('.card-inner').style.transform = 'rotateY(180deg)';
    }

    showResults() {
        this.readingResult.style.display = 'block';
        
        const positions = ['과거', '현재', '미래'];
        positions.forEach((position, index) => {
            const card = this.selectedCards[index];
            const readingDiv = document.getElementById(`${position.toLowerCase()}Reading`);
            
            let resultHTML = `
                <h4>${card.name} ${card.isReversed ? '(역방향)' : '(정방향)'}</h4>
                <div class="keywords">
                    <p><strong>키워드:</strong> ${card.keywords.join(', ')}</p>
                </div>
                <div class="meanings">
            `;

            // 각 영역별 의미 추가
            Object.entries(card.meanings).forEach(([aspect, meanings]) => {
                resultHTML += `
                    <div class="aspect">
                        <h5>${aspect}</h5>
                        <p>${card.isReversed ? meanings.역방향 : meanings.정방향}</p>
                    </div>
                `;
            });

            // 해석 추가
            resultHTML += `
                </div>
                <div class="interpretation">
                    <h5>카드 해석</h5>
                    <p><strong>설명:</strong> ${card.interpretation.설명}</p>
                    <p><strong>${card.isReversed ? '부정적인 의미' : '긍정적인 의미'}:</strong> 
                        ${card.isReversed ? card.interpretation.부정적인 : card.interpretation.긍정적인}</p>
                    <p><strong>메시지:</strong> ${card.interpretation.메시지}</p>
                </div>
            `;

            readingDiv.innerHTML = resultHTML;
        });
    }

    shareToKakao() {
        if (this.selectedCards.length !== 3) return;
        alert('카카오톡 공유 기능은 현재 준비중입니다.');
    }

    resetReading() {
        this.selectedCards = [];
        this.currentStep = 0;
        this.shuffleBtn.style.display = 'block';
        this.readingResult.style.display = 'none';
        
        this.cardElements.forEach(card => {
            card.classList.remove('selected', 'selectable');
            const cardInner = card.querySelector('.card-inner');
            const cardFront = card.querySelector('.card-front');
            cardInner.style.transform = '';
            cardFront.style.transform = '';
            card.querySelector('.card-title').textContent = '';
            card.querySelector('.card-number').textContent = '';
        });
    }
}

// 페이지 로드 시 애플리케이션 초기화
document.addEventListener('DOMContentLoaded', () => {
    new TarotReading();
});