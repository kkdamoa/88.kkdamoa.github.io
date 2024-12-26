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
        
        // 초기 카드 생성
        this.createCards();
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
            this.cardsContainer.appendChild(card);
        }
        this.cardElements = document.querySelectorAll('.card');
    }

    addEventListeners() {
        this.shuffleBtn.addEventListener('click', () => this.startReading());
        this.cardElements.forEach(card => {
            card.addEventListener('click', (e) => this.handleCardClick(e));
        });
        this.shareButton?.addEventListener('click', () => this.shareToKakao());
        this.resetButton?.addEventListener('click', () => this.resetReading());
    }

    startReading() {
        this.showLoading();
        this.shuffleCards();
        setTimeout(() => {
            this.hideLoading();
            this.enableCardSelection();
        }, 1500);
    }

    shuffleCards() {
        this.cards = [...this.cards].sort(() => Math.random() - 0.5);
        this.cardsContainer.classList.add('shuffling');
        setTimeout(() => {
            this.cardsContainer.classList.remove('shuffling');
        }, 800);
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
            
            // 카드 내용 업데이트
            const cardFront = card.querySelector('.card-front');
            const cardNumber = card.querySelector('.card-number');
            const cardSymbol = card.querySelector('.card-symbol');
            const cardTitle = card.querySelector('.card-title');

            cardNumber.textContent = selectedCard.id;
            cardSymbol.textContent = this.getCardSymbol(selectedCard.id);
            cardTitle.textContent = selectedCard.name;

            if (isReversed) {
                cardFront.style.transform = 'rotateY(180deg) rotateX(180deg)';
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
        // 카드 ID에 따른 심볼 반환
        const symbols = {
            0: '☆',
            1: '✦',
            // ... 다른 카드 심볼들
        };
        return symbols[id] || '★';
    }

    showResults() {
        this.shuffleBtn.disabled = true;
        this.readingResult.innerHTML = '<h2>타로 리딩 결과</h2>';
        
        this.selectedCards.forEach(card => {
            this.displayCardResult(card);
        });

        this.readingResult.style.display = 'block';
        if (this.shareButton) this.shareButton.style.display = 'block';
        if (this.resetButton) this.resetButton.style.display = 'block';
    }

    displayCardResult(card) {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'result-card';
        
        resultDiv.innerHTML = `
            <div class="card-image">
                <img src="images/${card.image}" alt="${card.name}">
            </div>
            <div class="card-info">
                <h2>${card.name} ${card.isReversed ? '(역방향)' : ''}</h2>
                <p><strong>위치:</strong> ${card.position}</p>
                <p><strong>키워드:</strong> ${card.keywords.join(', ')}</p>
                
                <div class="meanings">
                    <h3>의미</h3>
                    <p><strong>사랑:</strong> ${card.meanings.love[card.isReversed ? 'reversed' : 'upright']}</p>
                    <p><strong>경력:</strong> ${card.meanings.career[card.isReversed ? 'reversed' : 'upright']}</p>
                    <p><strong>재물:</strong> ${card.meanings.money[card.isReversed ? 'reversed' : 'upright']}</p>
                    <p><strong>건강:</strong> ${card.meanings.health[card.isReversed ? 'reversed' : 'upright']}</p>
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

    showLoading() {
        this.loadingScreen.style.display = 'flex';
    }

    hideLoading() {
        this.loadingScreen.style.display = 'none';
    }

    enableCardSelection() {
        this.shuffleBtn.disabled = true;
        this.cardElements.forEach(card => {
            card.style.cursor = 'pointer';
        });
    }

    shareToKakao() {
        Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
                title: '타로 카드 리딩 결과',
                description: this.getShareDescription(),
                imageUrl: 'YOUR_IMAGE_URL', // 대표 이미지 URL
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
        
        // 카드 초기화
        this.createCards();
        
        // 공유 버튼 숨기기
        if (this.shareButton) this.shareButton.style.display = 'none';
        if (this.resetButton) this.resetButton.style.display = 'none';
    }
}

// 페이지 로드 시 애플리케이션 초기화
document.addEventListener('DOMContentLoaded', () => {
    new TarotReading();
});