// app.js

document.addEventListener('DOMContentLoaded', () => {
    // DOM 요소들
    const sections = {
        welcome: document.getElementById('welcomeSection'),
        category: document.getElementById('categorySection'),
        cardSelection: document.getElementById('cardSelectionSection'),
        result: document.getElementById('resultSection'),
        loading: document.getElementById('loadingSection')
    };

    // 상태 관리
    const state = {
        userName: '',
        question: '',
        category: '',
        selectedCards: [],
        maxCards: 3
    };

    // 시작 버튼 이벤트
    document.getElementById('startButton').addEventListener('click', () => {
        state.userName = document.getElementById('nameInput').value;
        state.question = document.getElementById('questionInput').value;

        if (!state.userName || !state.question) {
            alert('이름과 질문을 모두 입력해주세요.');
            return;
        }

        showSection('category');
    });

    // 카테고리 선택 이벤트
    document.querySelectorAll('.category-buttons button').forEach(button => {
        button.addEventListener('click', (e) => {
            state.category = e.target.dataset.category;
            initializeCardSelection();
            showSection('cardSelection');
        });
    });

    // 카드 선택 초기화
    function initializeCardSelection() {
        const cardsGrid = document.querySelector('.cards-grid');
        cardsGrid.innerHTML = '';
        state.selectedCards = [];
        
        // 78장의 카드를 무작위로 섞기
        const shuffledCards = [...tarotData].sort(() => Math.random() - 0.5);
        
        shuffledCards.forEach((card, index) => {
            const cardElement = createCardElement(card, index);
            cardsGrid.appendChild(cardElement);
        });

        updateCardsRemaining();
    }

    // 카드 요소 생성
    function createCardElement(card, index) {
        const cardElement = document.createElement('div');
        cardElement.className = 'tarot-card';
        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <div class="card-info">
                        <h4 class="card-name">${card.name}</h4>
                    </div>
                </div>
                <div class="card-back"></div>
            </div>
        `;

        cardElement.addEventListener('click', () => handleCardClick(cardElement, card));
        return cardElement;
    }

    // 카드 클릭 처리
    function handleCardClick(cardElement, card) {
        if (state.selectedCards.length >= state.maxCards || cardElement.classList.contains('selected')) {
            return;
        }

        cardElement.classList.add('selected');
        state.selectedCards.push(card);
        
        cardElement.querySelector('.card-inner').style.transform = 'rotateY(180deg)';
        updateCardsRemaining();

        if (state.selectedCards.length === state.maxCards) {
            setTimeout(showResult, 1500);
        }
    }

    // 남은 카드 수 업데이트
    function updateCardsRemaining() {
        const remaining = document.querySelector('.cards-remaining span');
        remaining.textContent = state.maxCards - state.selectedCards.length;
    }

    // 결과 표시
    function showResult() {
        showSection('loading');
        
        setTimeout(() => {
            const positions = ['과거/현재의 영향', '현재 상황', '조언/미래의 가능성'];
            
            // 사용자 정보 표시
            document.querySelector('.user-name').textContent = `${state.userName}님의 타로 리딩`;
            document.querySelector('.user-question').textContent = `Q: ${state.question}`;
            document.querySelector('.reading-category').textContent = `카테고리: ${getCategoryName(state.category)}`;

            // 카드 결과 표시
            state.selectedCards.forEach((card, index) => {
                const cardResult = document.querySelector(`.card${index + 1}`);
                cardResult.innerHTML = `
                    <h4>${card.name}</h4>
                    <p>${card.keywords.join(', ')}</p>
                    <p class="interpretation">${card.meanings[state.category].upright}</p>
                `;
            });

            // 전체 해석 내용 생성
            const interpretation = generateInterpretation();
            document.querySelector('.result-content').innerHTML = interpretation;

            showSection('result');
        }, 1500);
    }

    // 카테고리 이름 변환
    function getCategoryName(category) {
        const categories = {
            love: '연애/사랑',
            career: '직장/진로',
            money: '재물/금전',
            health: '건강/체력'
        };
        return categories[category];
    }

    // 전체 해석 생성
    function generateInterpretation() {
        const positions = ['과거/현재의 영향', '현재 상황', '조언/미래의 가능성'];
        let interpretation = `<h3>${state.userName}님의 타로 해석 결과</h3>`;
        
        state.selectedCards.forEach((card, index) => {
            interpretation += `
                <div class="interpretation-section">
                    <h4>${positions[index]}: ${card.name}</h4>
                    <p>${card.meanings[state.category].upright}</p>
                    <p>키워드: ${card.keywords.join(', ')}</p>
                </div>
            `;
        });

        return interpretation;
    }

    // 섹션 전환 함수
    function showSection(sectionId) {
        Object.values(sections).forEach(section => {
            section.classList.add('hidden');
        });
        sections[sectionId].classList.remove('hidden');
    }

    // 다시하기 버튼
    document.getElementById('retryButton').addEventListener('click', () => {
        state.selectedCards = [];
        showSection('welcome');
    });
});