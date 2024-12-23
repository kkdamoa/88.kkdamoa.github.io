let selectedCards = [];
const MAX_CARDS = 3;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    try {
        // 로딩 화면 표시
        showLoading();
        
        // 카드 그리드 생성 및 초기화
        await createCardGrid();
        initializeButtons();
        
        // 카드 셔플
        await shuffleCards();
        
        // 로딩 화면 숨기기
        hideLoading();
    } catch (error) {
        console.error('초기화 중 오류 발생:', error);
        hideLoading();
    }
}

function showLoading() {
    document.querySelector('.loading-screen').style.display = 'flex';
}

function hideLoading() {
    document.querySelector('.loading-screen').style.display = 'none';
}

// 카드 그리드 생성
async function createCardGrid() {
    const cardGrid = document.getElementById('cardGrid');
    cardGrid.innerHTML = ''; // 기존 카드들 제거
    
    // major 배열이 존재하는지 확인
    if (!tarotData.major || !Array.isArray(tarotData.major)) {
        console.error('타로 데이터가 올바르지 않습니다:', tarotData);
        return;
    }

    // 메이저 아르카나 카드만 표시
    tarotData.major.forEach(card => {
        if (card && card.id !== undefined) {
            const cardElement = createCardElement(card);
            cardGrid.appendChild(cardElement);
        }
    });
}

// 카드 요소 생성
function createCardElement(card) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.setAttribute('data-card', card.id);
    
    cardDiv.innerHTML = `
        <div class="card-inner">
            <div class="card-back">
                <div class="card-corner"></div>
                <div class="card-corner"></div>
                <div class="card-corner"></div>
                <div class="card-corner"></div>
            </div>
            <div class="card-front">
                <div class="card-number">${card.id}</div>
                <div class="card-symbol"></div>
                <div class="card-title">${card.name}</div>
            </div>
        </div>
    `;

    // 카드 클릭 이벤트
    cardDiv.addEventListener('click', () => {
        if (!cardDiv.classList.contains('selected') && selectedCards.length >= MAX_CARDS) {
            alert('이미 3장의 카드를 선택하셨습니다.');
            return;
        }
        
        if (cardDiv.classList.contains('selected')) {
            cardDiv.classList.remove('selected');
            selectedCards = selectedCards.filter(c => c.id !== card.id);
        } else {
            cardDiv.classList.add('selected');
            selectedCards.push(card);
        }
        
        updateViewResultButton();
        console.log('현재 선택된 카드:', selectedCards.length);
    });

    return cardDiv;
}

// 카드 셔플
async function shuffleCards() {
    const cardGrid = document.getElementById('cardGrid');
    const cards = Array.from(cardGrid.children);
    
    cards.forEach(card => {
        card.style.animation = 'shuffle 0.5s ease-in-out';
    });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    cards.forEach(card => {
        const random = Math.random();
        card.style.order = Math.floor(random * cards.length);
    });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    cards.forEach(card => {
        card.style.animation = '';
    });
}

// 결과 보기 버튼 상태 업데이트
function updateViewResultButton() {
    const viewResultBtn = document.getElementById('viewResultBtn');
    viewResultBtn.disabled = selectedCards.length !== MAX_CARDS;
    console.log('선택된 카드 수:', selectedCards.length);
    console.log('버튼 상태:', viewResultBtn.disabled);
}

// 결과 페이지 표시
function showResults() {
    document.querySelector('.selection-page').style.display = 'none';
    document.querySelector('.reading-result').style.display = 'block';
    
    const resultContainer = document.querySelector('.result-container');
    resultContainer.innerHTML = selectedCards.map((card, index) => `
        <div class="result-card">
            <div class="card-image">
                <img src="images/${card.image}" alt="${card.name}">
            </div>
            <div class="card-info">
                <h2>${card.name}</h2>
                <p class="keywords">키워드: ${card.keywords.join(', ')}</p>
                <div class="meanings">
                    <h3>의미</h3>
                    <p>사랑: ${card.meanings.love.upright}</p>
                    <p>경력: ${card.meanings.career.upright}</p>
                    <p>재물: ${card.meanings.money.upright}</p>
                    <p>건강: ${card.meanings.health.upright}</p>
                </div>
            </div>
        </div>
    `).join('');

    // 종합 해석 추가
    const interpretations = getCardInterpretations(selectedCards);
    document.querySelector('.overall-interpretation').innerHTML = `
        <h2>종합 해석</h2>
        <p>${interpretations.overall}</p>
        
        <div class="interpretation-categories">
            <div class="category">
                <h3>사랑</h3>
                <p>${interpretations.love}</p>
            </div>
            <div class="category">
                <h3>경력</h3>
                <p>${interpretations.career}</p>
            </div>
            <div class="category">
                <h3>재물</h3>
                <p>${interpretations.money}</p>
            </div>
            <div class="category">
                <h3>건강</h3>
                <p>${interpretations.health}</p>
            </div>
        </div>
    `;
}

// 카드 해석 생성
function getCardInterpretations(cards) {
    // 여기에 카드 조합에 따른 해석 로직 구현
    return {
        overall: "선택하신 카드들의 조합은...",
        love: "사랑과 관련하여...",
        career: "경력 측면에서...",
        money: "재물운은...",
        health: "건강 관련하여..."
    };
}

// 카카오톡 공유
function shareKakao() {
    Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: '타로 카드 운세 결과',
            description: `선택된 카드: ${selectedCards.map(card => card.name).join(', ')}`,
            imageUrl: 'YOUR_IMAGE_URL',
            link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href,
            },
        },
        buttons: [
            {
                title: '결과 보기',
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href,
                },
            },
        ],
    });
}

// 버튼 초기화
function initializeButtons() {
    document.getElementById('viewResultBtn').addEventListener('click', showResults);
}

// 선택 페이지로 돌아가기
function backToSelection() {
    selectedCards = [];
    document.querySelectorAll('.card.selected').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector('.reading-result').style.display = 'none';
    document.querySelector('.selection-page').style.display = 'block';
    updateViewResultButton();
}