import tarotData from './tarot-data.js';

class TarotReading {
    constructor() {
        this.currentCard = null;
        this.initializeElements();
        this.addEventListeners();
    }

    initializeElements() {
        this.readingType = document.getElementById('readingType');
        this.drawButton = document.getElementById('drawButton');
        this.selectedCard = document.getElementById('selectedCard');
        this.cardName = document.getElementById('cardName');
        this.cardMeaning = document.getElementById('cardMeaning');
        this.shareButton = document.getElementById('shareKakao');
    }

    addEventListeners() {
        this.drawButton.addEventListener('click', () => this.drawCard());
        this.shareButton.addEventListener('click', () => this.shareToKakao());
    }

    drawCard() {
        // 카드 뽑기 전 로딩 애니메이션 표시
        this.selectedCard.innerHTML = '<div class="loading"></div>';
        this.cardName.textContent = '';
        this.cardMeaning.textContent = '';

        // 카드 선택 애니메이션을 위한 지연
        setTimeout(() => {
            const allCards = [...tarotData.major];
            const randomIndex = Math.floor(Math.random() * allCards.length);
            this.currentCard = allCards[randomIndex];
            
            // 정방향/역방향 결정 (50% 확률)
            const isReversed = Math.random() < 0.5;
            
            this.displayCard(isReversed);
        }, 1000);
    }

    displayCard(isReversed) {
        // 카드 이미지 표시
        this.selectedCard.innerHTML = `
            <img src="${this.currentCard.image}" 
                 class="card ${isReversed ? 'reversed' : ''}" 
                 alt="${this.currentCard.name}">
        `;

        // 카드 정보 표시
        this.cardName.textContent = `${this.currentCard.name} ${isReversed ? '(역방향)' : '(정방향)'}`;
        
        // 선택된 운세 타입에 따른 의미 표시
        const selectedType = this.readingType.value;
        const meaning = isReversed 
            ? this.currentCard.meanings[selectedType].reversed
            : this.currentCard.meanings[selectedType].upright;

        this.cardMeaning.textContent = meaning;

        // 결과 섹션에 애니메이션 효과 추가
        document.getElementById('cardResult').classList.add('show');
    }

    shareToKakao() {
        if (!this.currentCard) return;

        Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
                title: '타로카드 운세 결과',
                description: `${this.currentCard.name}\n${this.cardMeaning.textContent}`,
                imageUrl: window.location.origin + '/' + this.currentCard.image,
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
}

// 페이지 로드 시 애플리케이션 초기화
document.addEventListener('DOMContentLoaded', () => {
    new TarotReading();
});

// 카드 뒤집기 애니메이션 효과
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
    });
});

// 페이지 로드 시 페이드인 효과
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// 구글 애드센스 광고 로드
(adsbygoogle = window.adsbygoogle || []).push({});