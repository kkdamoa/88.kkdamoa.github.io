import tarotData from './tarot-data.js';

class TarotReading {
    constructor() {
        this.cards = tarotData.major;
        this.selectedCards = [];
        this.isSelectionComplete = false;

        // DOM 요소
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.cardElements = document.querySelectorAll('.card');
        this.resultSection = document.querySelector('.reading-result');
        this.selectedCardsContainer = document.querySelector('.selected-cards');
        this.interpretationContainer = document.querySelector('.interpretation');
        this.shareBtn = document.getElementById('shareBtn');
        this.restartBtn = document.getElementById('restartBtn');

        // 이벤트 리스너 설정
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.shuffleBtn.addEventListener('click', () => this.shuffleCards());
        this.cardElements.forEach(card => {
            card.addEventListener('click', (e) => this.handleCardClick(e));
        });
        this.shareBtn.addEventListener('click', () => this.shareResult());
        this.restartBtn.addEventListener('click', () => this.restart());
    }

    shuffleCards() {
        // Fisher-Yates 셔플 알고리즘
        this.cards = [...this.cards].sort(() => Math.random() - 0.5);
        this.shuffleBtn.disabled = true;
        this.shuffleBtn.textContent = '카드를 선택하세요';
        
        // 카드 선택 애니메이션
        this.cardElements.forEach(card => {
            card.style.animation = 'shuffle 0.5s ease';
            setTimeout(() => {
                card.style.animation = '';
            }, 500);
        });
    }

    handleCardClick(event) {
        if (this.isSelectionComplete || !this.shuffleBtn.disabled) return;

        const card = event.currentTarget;
        const index = parseInt(card.dataset.index);

        if (!card.classList.contains('flipped') && this.selectedCards.length < 3) {
            card.classList.add('flipped');
            
            // 카드 정보 저장
            const cardData = this.cards[this.selectedCards.length];
            const isReversed = Math.random() < 0.5;
            this.selectedCards.push({
                ...cardData,
                isReversed
            });

            // 카드 앞면에 이름 표시
            const cardFront = card.querySelector('.card-front');
            cardFront.textContent = cardData.name;

            // 3장의 카드를 모두 선택했을 때
            if (this.selectedCards.length === 3) {
                this.isSelectionComplete = true;
                setTimeout(() => this.showResult(), 1000);
            }
        }
    }

    showResult() {
        // 결과 섹션 표시
        this.resultSection.style.display = 'block';
        
        // 선택된 카드 표시
        this.selectedCardsContainer.innerHTML = this.selectedCards.map((card, index) => `
            <div class="selected-card ${card.isReversed ? 'reversed' : ''}">
                <div class="selected-card-inner">
                    <h3>${card.name}</h3>
                    <div class="card-keywords">${card.keywords.join(', ')}</div>
                    <div class="card-position">${['과거', '현재', '미래'][index]}</div>
                    <div class="card-direction">${card.isReversed ? '역방향' : '정방향'}</div>
                </div>
            </div>
        `).join('');

        // 해석 표시
        this.interpretationContainer.innerHTML = this.generateInterpretation();

        // 결과 영역으로 스크롤
        this.resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    generateInterpretation() {
        let interpretation = '<h3>카드 해석</h3>';
        
        const positions = ['과거', '현재', '미래'];
        this.selectedCards.forEach((card, index) => {
            interpretation += `
                <div class="card-interpretation">
                    <h4>${positions[index]}: ${card.name} ${card.isReversed ? '(역방향)' : '(정방향)'}</h4>
                    <div class="interpretation-content">
                        <p class="keywords"><strong>키워드:</strong> ${card.keywords.join(', ')}</p>
                        <div class="meaning-section">
                            <p class="love"><strong>💕 사랑:</strong> ${card.isReversed ? card.meanings.love.reversed : card.meanings.love.upright}</p>
                            <p class="career"><strong>💼 경력:</strong> ${card.isReversed ? card.meanings.career.reversed : card.meanings.career.upright}</p>
                            <p class="money"><strong>💰 금전:</strong> ${card.isReversed ? card.meanings.money.reversed : card.meanings.money.upright}</p>
                            <p class="health"><strong>🏥 건강:</strong> ${card.isReversed ? card.meanings.health.reversed : card.meanings.health.upright}</p>
                        </div>
                    </div>
                </div>
            `;
        });

        return interpretation;
    }

    shareResult() {
        const resultText = this.selectedCards.map((card, index) => 
            `${['과거', '현재', '미래'][index]}: ${card.name} (${card.isReversed ? '역방향' : '정방향'})`
        ).join('\n');

        Kakao.Link.sendDefault({
            objectType: 'text',
            text: '🔮 타로 카드 리딩 결과 🔮\n\n' + resultText,
            link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href,
            },
            buttons: [
                {
                    title: '나도 타로 보기',
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href,
                    },
                },
            ],
        });
    }

    restart() {
        // 초기 상태로 리셋
        this.selectedCards = [];
        this.isSelectionComplete = false;
        this.shuffleBtn.disabled = false;
        this.shuffleBtn.textContent = '카드 섞기';
        this.resultSection.style.display = 'none';
        
        // 카드 뒤집기 초기화
        this.cardElements.forEach(card => {
            card.classList.remove('flipped');
            const cardFront = card.querySelector('.card-front');
            cardFront.textContent = '';
        });

        // 페이지 상단으로 스크롤
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// 애니메이션 키프레임 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes shuffle {
        0% { transform: translateX(0) rotate(0); }
        25% { transform: translateX(-20px) rotate(-5deg); }
        75% { transform: translateX(20px) rotate(5deg); }
        100% { transform: translateX(0) rotate(0); }
    }
`;
document.head.appendChild(style);

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    new TarotReading();
});