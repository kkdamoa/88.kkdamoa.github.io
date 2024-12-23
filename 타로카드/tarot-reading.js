import tarotData from './tarot-data.js';

class TarotReading {
    constructor() {
        this.cards = tarotData.major;
        this.selectedCards = [];
        this.isSelectionComplete = false;

        // DOM 요소들
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.cardElements = document.querySelectorAll('.card');
        this.resultSection = document.querySelector('.reading-result');
        this.selectedCardsContainer = document.querySelector('.selected-cards');
        this.interpretationContainer = document.querySelector('.interpretation');
    }

    initialize() {
        this.shuffleBtn.addEventListener('click', () => this.shuffleCards());
        this.cardElements.forEach(card => {
            card.addEventListener('click', (e) => this.selectCard(e));
        });
    }

    shuffleCards() {
        this.cards = [...this.cards].sort(() => Math.random() - 0.5);
        this.selectedCards = [];
        this.isSelectionComplete = false;
        this.resultSection.style.display = 'none';
        
        this.cardElements.forEach(card => {
            card.classList.remove('selected', 'revealed');
        });
    }

    selectCard(event) {
        if (this.isSelectionComplete) return;

        const card = event.currentTarget;
        if (!card.classList.contains('selected')) {
            card.classList.add('selected');
            const selectedIndex = Array.from(this.cardElements).indexOf(card);
            const isReversed = Math.random() < 0.5;
            
            this.selectedCards.push({
                ...this.cards[selectedIndex],
                isReversed: isReversed
            });

            if (this.selectedCards.length === 3) {
                this.isSelectionComplete = true;
                this.showResult();
            }
        }
    }

    showResult() {
        this.resultSection.style.display = 'block';
        
        // 선택된 카드들 표시
        this.selectedCardsContainer.innerHTML = `
            <div class="selected-cards-container">
                ${this.selectedCards.map((card, index) => `
                    <div class="card-interpretation">
                        <h3>${card.name} ${card.isReversed ? '(역방향)' : ''}</h3>
                        <p><strong>키워드:</strong> ${card.keywords.join(', ')}</p>
                        <p><strong>의미:</strong> ${this.getBasicMeaning(card, index)}</p>
                    </div>
                `).join('')}
            </div>
            <button id="showDetailBtn" class="detail-btn">상세히 알아보기</button>
        `;

        document.getElementById('showDetailBtn').addEventListener('click', () => {
            this.showDetailedInterpretation();
        });
    }

    showDetailedInterpretation() {
        const positions = ['과거', '현재', '미래'];
        
        this.interpretationContainer.innerHTML = `
            <div class="detailed-reading">
                <h2>🌟 종합 타로 해석</h2>
                
                <div class="overall-message">
                    <h3>🔮 전체적인 메시지</h3>
                    <p>${this.generateOverallMessage(positions)}</p>
                </div>

                <div class="aspect-readings">
                    <div class="love-reading">
                        <h3>❤️ 연애/관계</h3>
                        <p>${this.generateLoveReading()}</p>
                    </div>

                    <div class="career-reading">
                        <h3>💼 경력/직업</h3>
                        <p>${this.generateCareerReading()}</p>
                    </div>

                    <div class="money-reading">
                        <h3>💰 금전/재물</h3>
                        <p>${this.generateMoneyReading()}</p>
                    </div>
                </div>

                <div class="final-advice">
                    <h3>💫 종합 조언</h3>
                    <p>${this.generateAdvice()}</p>
                </div>
            </div>
        `;

        this.addDetailedStyles();
    }

    getBasicMeaning(card, position) {
        const aspect = this.getRandomAspect();
        return card.isReversed ? 
            card.meanings[aspect].reversed :
            card.meanings[aspect].upright;
    }

    generateOverallMessage(positions) {
        let message = '세 장의 카드가 보여주는 전체적인 메시지입니다:\n\n';
        
        this.selectedCards.forEach((card, index) => {
            const position = positions[index];
            const meaning = this.getBasicMeaning(card, index);
            message += `${position}의 "${card.name}"${card.isReversed ? '(역방향)' : ''} 카드는 
                       ${meaning}을(를) 나타내고 있습니다.\n`;
        });

        message += '\n이 카드들은 서로 연결되어 당신의 상황을 입체적으로 보여주고 있습니다.';
        return message;
    }

    generateAspectReading(aspect) {
        const readings = this.selectedCards.map(card => 
            card.isReversed ? 
                card.meanings[aspect].reversed : 
                card.meanings[aspect].upright
        );
        
        return readings.join(' 그리고 ') + 
               '. 이러한 에너지들이 현재 상황에 영향을 미치고 있습니다.';
    }

    generateLoveReading() {
        return this.generateAspectReading('love');
    }

    generateCareerReading() {
        return this.generateAspectReading('career');
    }

    generateMoneyReading() {
        return this.generateAspectReading('money');
    }

    generateAdvice() {
        const keywords = this.selectedCards.map(card => 
            card.keywords[Math.floor(Math.random() * card.keywords.length)]
        );

        return `현재 상황에서는 ${keywords.join(', ')}의 에너지에 특히 주목하시기 바랍니다. 
                이러한 에너지들을 잘 활용하면 긍정적인 변화를 이끌어낼 수 있습니다.`;
    }

    getRandomAspect() {
        const aspects = ['love', 'career', 'money', 'health'];
        return aspects[Math.floor(Math.random() * aspects.length)];
    }

    addDetailedStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .detailed-reading {
                padding: 2rem;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 15px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                margin-top: 2rem;
            }

            .detailed-reading h2 {
                text-align: center;
                color: #2c3e50;
                margin-bottom: 2rem;
            }

            .detailed-reading h3 {
                color: #34495e;
                margin: 1.5rem 0 1rem;
                border-bottom: 2px solid #e0e0e0;
                padding-bottom: 0.5rem;
            }

            .aspect-readings {
                display: grid;
                gap: 1.5rem;
                margin: 2rem 0;
            }

            .final-advice {
                background: #f8f9fa;
                padding: 1.5rem;
                border-radius: 10px;
                margin-top: 2rem;
            }

            .overall-message {
                background: #fff;
                padding: 1.5rem;
                border-radius: 10px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            }
        `;
        document.head.appendChild(style);
    }
}

export default TarotReading;