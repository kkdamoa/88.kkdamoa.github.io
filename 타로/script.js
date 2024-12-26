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
            position: card.dataset.position
        });

        this.displayCard(card, selectedCard, isReversed);
        this.currentStep++;

        if (this.currentStep === 3) {
            setTimeout(() => this.showResults(), 1000);
        }
    }

    displayCard(cardElement, cardData, isReversed) {
        const cardFront = cardElement.querySelector('.card-front');
        const cardImage = cardFront.querySelector('img');
        
        // 이미지 경로 설정
        cardImage.src = `images/${cardData.image}`;
        cardImage.alt = cardData.name;
        
        // 카드 정보 표시
        cardFront.querySelector('.card-title').textContent = cardData.name;
        
        cardElement.classList.add('selected');
        if (isReversed) {
            cardFront.style.transform = 'rotate(180deg)';
        }
    }

    showResults() {
        this.readingResult.style.display = 'block';
        
        const positions = ['과거', '현재', '미래'];
        positions.forEach((position, index) => {
            const card = this.selectedCards[index];
            const reading = document.getElementById(`${position.toLowerCase()}Reading`);
            
            reading.innerHTML = `
                <h4>${card.name} ${card.isReversed ? '(역방향)' : ''}</h4>
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

        Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
                title: '타로카드 운세 결과',
                description: this.getShareDescription(),
                imageUrl: 'YOUR_IMAGE_URL', // 대표 이미지 URL 필요
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
        
        this.cardElements.forEach(cardElement => {
            cardElement.classList.remove('selected');
            const cardFront = cardElement.querySelector('.card-front');
            cardFront.style.transform = '';
            cardFront.querySelector('img').src = 'images/card-back.jpg'; // 카드 뒷면 이미지로 리셋
        });
    }
}

// 페이지 로드 시 애플리케이션 초기화
document.addEventListener('DOMContentLoaded', () => {
    new TarotReading();
});