import tarotData from './tarot-data.js';

class TarotReading {
    constructor() {
        this.cards = tarotData.major;
        this.selectedCards = [];
        this.currentStep = 0;
        this.positions = ['과거', '현재', '미래'];
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
        this.showLoading();
        this.shuffleCards();
        this.enableCardSelection();
        this.shuffleBtn.disabled = true;
    }

    showLoading() {
        this.loadingScreen.style.display = 'flex';
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
        }, 1500);
    }

    shuffleCards() {
        this.cards = [...this.cards].sort(() => Math.random() - 0.5);
    }

    enableCardSelection() {
        this.cardElements.forEach(card => {
            if (!card.classList.contains('selected')) {
                card.style.cursor = 'pointer';
            }
        });
    }

    handleCardClick(event) {
        const card = event.currentTarget;
        if (this.currentStep >= 3 || card.classList.contains('selected')) return;

        const selectedCard = this.cards[this.currentStep];
        const isReversed = Math.random() < 0.5;
        
        this.selectedCards.push({
            ...selectedCard,
            isReversed,
            position: this.positions[this.currentStep]
        });

        this.displayCard(card, selectedCard, isReversed);
        this.currentStep++;

        if (this.currentStep === 3) {
            setTimeout(() => this.showResults(), 1000);
        }
    }

    displayCard(cardElement, cardData, isReversed) {
        const cardFront = cardElement.querySelector('.card-front');
        cardFront.querySelector('.card-number').textContent = cardData.id;
        cardFront.querySelector('.card-title').textContent = cardData.name;
        cardFront.querySelector('img').src = `images/${cardData.image}`;

        cardElement.classList.add('selected');
        if (isReversed) {
            cardFront.style.transform = 'rotate(180deg)';
        }
    }

    showResults() {
        this.readingResult.style.display = 'block';
        
        this.selectedCards.forEach((card, index) => {
            const reading = document.getElementById(`${card.position}Reading`);
            
            reading.innerHTML = `
                <h4>${card.position}: ${card.name} ${card.isReversed ? '(역방향)' : ''}</h4>
                <p><strong>키워드:</strong> ${card.keywords.join(', ')}</p>
                <div class="meanings">
                    <p><strong>사랑:</strong> ${card.isReversed ? card.meanings.사랑.역방향 : card.meanings.사랑.정방향}</p>
                    <p><strong>직업/목표:</strong> ${card.isReversed ? card.meanings.직업목표_성취_열망.역방향 : card.meanings.직업목표_성취_열망.정방향}</p>
                    <p><strong>재정:</strong> ${card.isReversed ? card.meanings.경제적.역방향 : card.meanings.경제적.정방향}</p>
                    <p><strong>건강:</strong> ${card.isReversed ? card.meanings.건강.역방향 : card.meanings.건강.정방향}</p>
                </div>
                <div class="interpretation">
                    <p><strong>해석:</strong> ${card.interpretation.설명}</p>
                    <p><strong>${card.isReversed ? '부정적인' : '긍정적인'}:</strong> 
                       ${card.isReversed ? card.interpretation.부정적인 : card.interpretation.긍정적인}</p>
                    <p><strong>메시지:</strong> ${card.interpretation.메시지}</p>
                </div>
            `;
        });
    }

    shareToKakao() {
        if (this.selectedCards.length !== 3) return;

        Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
                title: '타로카드 운세 결과',
                description: this.getShareDescription(),
                imageUrl: 'YOUR_IMAGE_URL',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href,
                }
            },
            buttons: [
                {
                    title: '나도 타로카드 보기',
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href,
                    }
                }
            ]
        });
    }

    getShareDescription() {
        return this.selectedCards.map(card => 
            `${card.position}: ${card.name} ${card.isReversed ? '(역방향)' : ''}`
        ).join('\n');
    }

    resetReading() {
        this.selectedCards = [];
        this.currentStep = 0;
        this.shuffleBtn.disabled = false;
        this.readingResult.style.display = 'none';
        
        this.cardElements.forEach(card => {
            card.classList.remove('selected');
            const cardFront = card.querySelector('.card-front');
            cardFront.style.transform = '';
            cardFront.querySelector('.card-number').textContent = '';
            cardFront.querySelector('.card-title').textContent = '';
            cardFront.querySelector('img').src = 'images/card-back.jpg'; // 카드 뒷면 이미지로 리셋
        });
    }
}

// 페이지 로드 시 애플리케이션 초기화
document.addEventListener('DOMContentLoaded', () => {
    new TarotReading();
});