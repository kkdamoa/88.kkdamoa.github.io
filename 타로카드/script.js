class TarotReading {
    // ... (기존 constructor 및 다른 메서드들은 유지)

    showResult() {
        this.resultSection.style.display = 'block';
        
        // 선택된 카드들 표시
        this.selectedCardsContainer.innerHTML = `
            <div class="selected-cards-container">
                ${this.selectedCards.map((card, index) => `
                    <div class="card-interpretation">
                        <h3>${card.name}</h3>
                        <p><strong>키워드:</strong> ${card.keywords.join(', ')}</p>
                        <p><strong>의미:</strong> ${this.getBasicMeaning(card, index)}</p>
                    </div>
                `).join('')}
            </div>
            <button id="showDetailBtn" class="detail-btn">상세히 알아보기</button>
        `;

        // 상세 해석 버튼 이벤트 리스너
        document.getElementById('showDetailBtn').addEventListener('click', () => {
            this.showDetailedInterpretation();
        });
    }

    getBasicMeaning(card, position) {
        const aspect = this.getRandomAspect();
        return card.isReversed ? 
            card.meanings[aspect].reversed :
            card.meanings[aspect].upright;
    }

    showDetailedInterpretation() {
        const [first, second, third] = this.selectedCards;
        
        this.interpretationContainer.innerHTML = `
            <div class="detailed-reading">
                <h2>🌟 종합 타로 해석</h2>
                
                <div class="overall-message">
                    <h3>전체적인 메시지</h3>
                    <p>${this.generateOverallMessage()}</p>
                </div>

                <div class="aspect-readings">
                    <div class="love-reading">
                        <h3>💕 연애/관계</h3>
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
                    <h3>🌈 조언</h3>
                    <p>${this.generateAdvice()}</p>
                </div>
            </div>
        `;
    }

    generateOverallMessage() {
        const energies = this.selectedCards.map(card => 
            card.keywords.slice(0, 2).join('과 ')
        );
        return `현재 당신의 상황에는 ${energies.join(', ')}의 에너지가 함께하고 있습니다. 
                이러한 에너지들이 서로 조화를 이루며 당신의 길을 안내하고 있습니다.`;
    }

    generateAspectReading(aspect) {
        return this.selectedCards.map(card => 
            card.isReversed ? 
                card.meanings[aspect].reversed : 
                card.meanings[aspect].upright
        ).join(' 그리고 ') + '.';
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
        return `현재 상황에서는 ${keywords.join(', ')}에 집중하시면 좋은 결과를 얻으실 수 있습니다.`;
    }

    getRandomAspect() {
        const aspects = ['love', 'career', 'money', 'health'];
        return aspects[Math.floor(Math.random() * aspects.length)];
    }
}