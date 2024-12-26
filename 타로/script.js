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
        this.cardsContainer = document.querySelector('.cards-container');
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
        // 로딩 화면 표시
        this.loadingScreen.style.display = 'flex';
        this.shuffleBtn.style.display = 'none'; // 섞기 버튼 숨기기
        
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
        this.currentStep++;

        if (this.currentStep === 3) {
            setTimeout(() => this.showResults(), 1000);
        }
    }

    displayCard(cardElement, cardData, isReversed) {
        cardElement.classList.remove('selectable');
        cardElement.classList.add('selected');

        const cardFront = cardElement.querySelector('.card-front');
        const cardContent = cardFront.querySelector('.card-content');

        // 카드 내용 업데이트
        cardContent.querySelector('.card-number').textContent = cardData.id;
        cardContent.querySelector('.card-title').textContent = cardData.name;

        // 역방향 적용
        if (isReversed) {
            cardFront.style.transform = 'rotate(180deg)';
        }

        // 카드 뒤집기 애니메이션
        cardElement.querySelector('.card-inner').style.transform = 'rotateY(180deg)';
    }

    showResults() {
        this.readingResult.style.display = 'block';
        
        const positions = ['과거', '현재', '미래'];
        positions.forEach((position, index) => {
            const card = this.selectedCards[index];
            const readingElement = document.getElementById(`${position}Reading`);
            
            readingElement.innerHTML = `
                <h4>${card.name} ${card.isReversed ? '(역방향)' : '(정방향)'}</h4>
                <div class="keywords">
                    <strong>키워드:</strong> ${card.keywords.join(', ')}
                </div>
                ${this.getCardMeaning(card)}
                ${this.getCardInterpretation(card)}
            `;
        });
    }

    getCardMeaning(card) {
        let html = '<div class="meanings">';
        for (const aspect in card.meanings) {
            html += `
                <div class="aspect">
                    <strong>${aspect}:</strong>
                    <p>${card.isReversed ? card.meanings[aspect].역방향 : card.meanings[aspect].정방향}</p>
                </div>
            `;
        }
        html += '</div>';
        return html;
    }

    getCardInterpretation(card) {
        return `
            <div class="interpretation">
                <p><strong>설명:</strong> ${card.interpretation.설명}</p>
                <p><strong>${card.isReversed ? '부정적인' : '긍정적인'}:</strong> 
                   ${card.isReversed ? card.interpretation.부정적인 : card.interpretation.긍정적인}</p>
                <p><strong>메시지:</strong> ${card.interpretation.메시지}</p>
            </div>
        `;
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
            card.querySelector('.card-inner').style.transform = '';
            card.querySelector('.card-front').style.transform = '';
        });
    }
}

// 페이지 로드 시 애플리케이션 초기화
document.addEventListener('DOMContentLoaded', () => {
    new TarotReading();
});