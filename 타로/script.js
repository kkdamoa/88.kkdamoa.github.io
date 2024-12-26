import tarotData from './tarot-data.js';

class TarotReader {
    constructor() {
        this.cards = tarotData.major;
        this.selectedCards = [];
    }

    // 카드 섞기
    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    // 카드 뽑기
    drawCards(count) {
        this.shuffleCards();
        this.selectedCards = this.cards.slice(0, count);
        return this.selectedCards;
    }

    // 카드 해석 가져오기
    getReadings(aspect) {
        return this.selectedCards.map(card => {
            const isReversed = Math.random() < 0.5;
            return {
                name: card.name,
                image: card.image,
                keywords: card.keywords,
                meaning: card.meanings[aspect][isReversed ? '역방향' : '정방향'],
                isReversed: isReversed,
                interpretation: card.interpretation
            };
        });
    }

    // 전체 해석 생성
    generateFullReading(aspect) {
        const readings = this.getReadings(aspect);
        let fullReading = '';

        readings.forEach((reading, index) => {
            fullReading += `\n${index + 1}번째 카드: ${reading.name} ${reading.isReversed ? '(역방향)' : ''}\n`;
            fullReading += `키워드: ${reading.keywords.join(', ')}\n`;
            fullReading += `의미: ${reading.meaning}\n`;
            fullReading += `해석: ${reading.interpretation.메시지}\n`;
        });

        return fullReading;
    }
}

// DOM 요소 선택
const startButton = document.getElementById('start-reading');
const cardContainer = document.getElementById('card-container');
const readingResult = document.getElementById('reading-result');

// 타로 리더 인스턴스 생성
const tarotReader = new TarotReader();

// 이벤트 리스너 설정
startButton.addEventListener('click', () => {
    // 카드 선택 및 표시
    const selectedCards = tarotReader.drawCards(3);
    displayCards(selectedCards);
    
    // 해석 생성 및 표시
    const reading = tarotReader.generateFullReading('사랑');
    readingResult.textContent = reading;
});

// 카드 화면에 표시
function displayCards(cards) {
    cardContainer.innerHTML = '';
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'tarot-card';
        
        const img = document.createElement('img');
        img.src = `images/${card.image}`;
        img.alt = card.name;
        
        cardElement.appendChild(img);
        cardContainer.appendChild(cardElement);
    });
}

// 초기화 함수
function init() {
    cardContainer.innerHTML = '';
    readingResult.textContent = '';
}

// 페이지 로드 시 초기화
window.addEventListener('load', init);