class TarotReading {
    constructor() {
        this.cards = tarotData.major;
        this.selectedCards = [];
        this.currentStep = 0;
        this.maxCards = 3;
        this.positions = ['과거', '현재', '미래'];
        this.initializeElements();
        this.addEventListeners();
    }

    initializeElements() {
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.cardsContainer = document.querySelector('.cards-container');
        this.readingResult = document.querySelector('.reading-result');
        this.loadingScreen = document.querySelector('.loading-screen');
        this.shareButton = document.getElementById('shareKakao');
        this.resetButton = document.getElementById('resetReading');
        
        this.createCards();
    }

    addEventListeners() {
        this.shuffleBtn.addEventListener('click', () => this.shuffleCards());
        
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.addEventListener('click', (e) => this.handleCardClick(e));
        });

        if (this.resetButton) {
            this.resetButton.addEventListener('click', () => this.resetReading());
        }
    }

    createCards() {
        this.cardsContainer.innerHTML = '';
        for (let i = 0; i < this.maxCards; i++) {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-back"></div>
                    <div class="card-front">
                        <div class="card-number"></div>
                        <div class="card-symbol"></div>
                        <div class="card-title"></div>
                    </div>
                </div>
            `;
            card.style.pointerEvents = 'none';
            this.cardsContainer.appendChild(card);
        }
    }

    shuffleCards() {
        this.cards = [...this.cards].sort(() => Math.random() - 0.5);
        
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.classList.add('shuffle');
            setTimeout(() => {
                card.classList.remove('shuffle');
            }, 500);
        });
        
        this.shuffleBtn.disabled = true;
        cards.forEach(card => {
            card.style.pointerEvents = 'auto';
        });
    }

    handleCardClick(event) {
        const card = event.currentTarget;
        if (card.classList.contains('selected') || this.currentStep >= this.maxCards) return;

        const selectedCard = this.cards[this.currentStep];
        const isReversed = Math.random() < 0.5;

        card.classList.add('selecting');
        setTimeout(() => {
            card.classList.remove('selecting');
            card.classList.add('selected');
            
            const cardInner = card.querySelector('.card-inner');
            const cardFront = card.querySelector('.card-front');
            const cardNumber = card.querySelector('.card-number');
            const cardSymbol = card.querySelector('.card-symbol');
            const cardTitle = card.querySelector('.card-title');

            cardNumber.textContent = selectedCard.id;
            cardSymbol.textContent = this.getCardSymbol(selectedCard.id);
            cardTitle.textContent = selectedCard.name;

            if (isReversed) {
                cardInner.classList.add('reversed');
            }

            this.selectedCards.push({
                ...selectedCard,
                position: this.positions[this.currentStep],
                isReversed: isReversed
            });

            this.currentStep++;
            if (this.currentStep === this.maxCards) {
                this.showResults();
            }
        }, 800);
    }

    getCardSymbol(id) {
        // 카드 심볼 로직 구현
        return '★'; // 또는 다른 심볼
    }

    showResults() {
        this.loadingScreen.style.display = 'flex';
        
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
            this.readingResult.style.display = 'block';
            this.readingResult.innerHTML = '';
            
            this.selectedCards.forEach(card => {
                this.displayCardResult(card);
            });
            
            if (this.shareButton) {
                this.shareButton.style.display = 'block';
                this.initializeKakaoShare();
            }
            if (this.resetButton) {
                this.resetButton.style.display = 'block';
            }
        }, 2000);
    }

    displayCardResult(card) {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'result-card';
        
        resultDiv.innerHTML = `
            <div class="card-image ${card.isReversed ? 'reversed' : ''}">
                <img src="images/${card.image}" alt="${card.name}">
            </div>
            <div class="card-info">
                <h2>${card.name} ${card.isReversed ? '(역방향)' : ''}</h2>
                <p><strong>위치:</strong> ${card.position}</p>
                <p><strong>키워드:</strong> ${card.keywords.join(', ')}</p>
                
                <div class="meanings">
                    <h3>의미</h3>
                    <p><strong>사랑:</strong> ${card.meanings.사랑[card.isReversed ? '역방향' : '정방향']}</p>
                    <p><strong>직업/목표:</strong> ${card.meanings.직업목표_성취_열망[card.isReversed ? '역방향' : '정방향']}</p>
                    <p><strong>재물:</strong> ${card.meanings.경제적[card.isReversed ? '역방향' : '정방향']}</p>
                    <p><strong>건강:</strong> ${card.meanings.건강[card.isReversed ? '역방향' : '정방향']}</p>
                </div>

                <div class="interpretation">
                    <h3>카드 해석</h3>
                    <p>${card.interpretation.설명}</p>
                    <p><strong>긍정적 메시지:</strong> ${card.interpretation.긍정적인}</p>
                    <p><strong>주의할 점:</strong> ${card.interpretation.부정적인}</p>
                    <p><strong>핵심 메시지:</strong> ${card.interpretation.메시지}</p>
                </div>
            </div>
        `;

        this.readingResult.appendChild(resultDiv);
    }

    initializeKakaoShare() {
        if (!window.Kakao) return;
        
        window.Kakao.Share.createDefaultButton({
            container: '#shareKakao',
            objectType: 'text',
            text: `타로카드 운세 결과\n\n${this.getShareDescription()}`,
            link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href,
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
        
        this.createCards();
        
        if (this.shareButton) this.shareButton.style.display = 'none';
        if (this.resetButton) this.resetButton.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TarotReading();
});