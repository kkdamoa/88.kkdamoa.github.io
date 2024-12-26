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
                card.classList.add('selectable');
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
        cardElement.classList.add('selected');
        cardElement.classList.remove('selectable');
        
        // 카드 내용을 표시하는 div 생성
        const cardContent = document.createElement('div');
        cardContent.className = 'card-content';
        cardContent.style.transform = isReversed ? 'rotate(180deg)' : '';
        
        cardContent.innerHTML = `
            <h3>${cardData.name}</h3>
            <p>${isReversed ? '(역방향)' : '(정방향)'}</p>
        `;
        
        // 기존 내용을 지우고 새 내용으로 교체
        cardElement.innerHTML = '';
        cardElement.appendChild(cardContent);
    }

    showResults() {
        this.readingResult.style.display = 'block';
        this.readingResult.innerHTML = ''; // 기존 결과 초기화

        const positions = ['과거', '현재', '미래'];
        
        this.selectedCards.forEach((card, index) => {
            const resultSection = document.createElement('div');
            resultSection.className = 'reading-section';
            
            resultSection.innerHTML = `
                <h3>${positions[index]}</h3>
                <div class="card-result">
                    <h4>${card.name} ${card.isReversed ? '(역방향)' : '(정방향)'}</h4>
                    <div class="keywords">
                        <strong>키워드:</strong> ${card.keywords.join(', ')}
                    </div>
                    ${this.getCardMeaning(card)}
                    ${this.getCardInterpretation(card)}
                </div>
            `;
            
            this.readingResult.appendChild(resultSection);
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
        this.shuffleBtn.disabled = false;
        this.readingResult.style.display = 'none';
        
        this.cardElements.forEach(card => {
            card.classList.remove('selected');
            card.classList.remove('selectable');
            card.innerHTML = '<div class="card-back">타로 카드</div>';
        });
    }
}

// 페이지 로드 시 애플리케이션 초기화
document.addEventListener('DOMContentLoaded', () => {
    new TarotReading();
});