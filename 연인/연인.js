let currentQuestion = 1;
const totalQuestions = 45;
const progressBar = document.getElementById('progressBar');
const testSection = document.getElementById('testSection');
const resultSection = document.getElementById('resultSection');
const resultText = document.getElementById('resultText');

// 각 유형에 대한 점수
let scores = {
    type1: 0, // 미련형
    type2: 0, // 분노형
    type3: 0, // 후회형
    type4: 0, // 무덤덤형
    type5: 0  // 무감정형(공허·냉소)
};

// 각 질문에 대한 점수 매핑 (각 유형별로 9개의 질문)
const questionTypeMapping = {
    1: 'type1', 2: 'type1', 3: 'type1', 4: 'type1', 5: 'type1', 6: 'type1', 7: 'type1', 8: 'type1', 9: 'type1',
    10: 'type2', 11: 'type2', 12: 'type2', 13: 'type2', 14: 'type2', 15: 'type2', 16: 'type2', 17: 'type2', 18: 'type2',
    19: 'type3', 20: 'type3', 21: 'type3', 22: 'type3', 23: 'type3', 24: 'type3', 25: 'type3', 26: 'type3', 27: 'type3',
    28: 'type4', 29: 'type4', 30: 'type4', 31: 'type4', 32: 'type4', 33: 'type4', 34: 'type4', 35: 'type4', 36: 'type4',
    37: 'type5', 38: 'type5', 39: 'type5', 40: 'type5', 41: 'type5', 42: 'type5', 43: 'type5', 44: 'type5', 45: 'type5'
};

// 질문 표시
function showQuestion(questionNumber) {
    const questions = document.querySelectorAll('.question');
    questions.forEach(q => q.classList.add('hidden'));
    const current = document.querySelector(`.question[data-question="${questionNumber}"]`);
    current.classList.remove('hidden');

    // 진행 상황 업데이트
    updateProgressBar();
}

// 진행 바 업데이트
function updateProgressBar() {
    const percentage = (currentQuestion / totalQuestions) * 100;
    progressBar.style.width = `${percentage}%`;
    progressBar.textContent = `${Math.round(percentage)}%`;
}

// 라디오 버튼 선택 시 점수 누적 및 자동으로 다음 질문으로 이동
function handleAnswer(event) {
    const selectedValue = parseInt(event.target.value);  // 선택된 값 가져오기
    
    // 선택된 값에 해당하는 점수 추가 (해당 유형에 점수 반영)
    const questionType = questionTypeMapping[currentQuestion];
    scores[questionType] += selectedValue;

    // 질문 번호 증가 후, 다음 질문 표시
    currentQuestion++;

    if (currentQuestion <= totalQuestions) {
        showQuestion(currentQuestion);
    } else {
        // 45번째 질문을 끝낸 후 "결과 보기" 버튼 표시
        document.getElementById('showResultButton').classList.remove('hidden');
    }
}

// 시작 버튼 클릭 시
document.getElementById('startTest').addEventListener('click', () => {
    document.querySelector('header').classList.add('hidden');
    testSection.classList.remove('hidden');
    showQuestion(currentQuestion);
});

// 라디오 버튼에 이벤트 리스너 추가
document.querySelectorAll('.question input[type="radio"]').forEach(input => {
    input.addEventListener('change', handleAnswer);
});

// 결과 보기 버튼 클릭 시 결과 화면으로 전환
document.getElementById('showResultButton').addEventListener('click', () => {
    showResult();
});

// 결과 계산 및 표시
function showResult() {
    let resultMessage = '당신의 연인 유형은:\n\n';
    let resultDetails = [];
    let sortedScores = [];

    // 각 유형의 점수를 배열에 저장하여 내림차순으로 정렬
    for (let type in scores) {
        sortedScores.push({ type: type, score: scores[type] });
    }

    // 점수 내림차순으로 정렬
    sortedScores.sort((a, b) => b.score - a.score);

    // 결과 메시지 설정
    sortedScores.forEach((item, index) => {
        const percentage = (item.score / 45) * 100;  // 45점 기준으로 퍼센트 계산
        resultDetails.push(`
            <div class="result-item">
                <div class="result-type">${index + 1}. ${getTypeName(item.type)}</div>
                <div class="result-score">${percentage.toFixed(2)}%</div>
                <div><a href="#" class="more-info" data-type="${item.type}">자세히 알아보기</a></div>
            </div>
        `);
    });

    resultMessage += resultDetails.join('');

    setTimeout(() => {
        resultText.innerHTML = resultMessage;
        resultSection.classList.remove('hidden');

        // "자세히 알아보기" 클릭 이벤트 추가
        document.querySelectorAll('.more-info').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const type = e.target.getAttribute('data-type');
                showDetailedPage(type);
            });
        });

        // 소셜 미디어 공유 버튼 추가
        addShareButtons();
    }, 5000); // 5초(5000ms) 후에 실행
}

// 소셜 미디어 공유 버튼 추가
function addShareButtons() {
    const shareButtons = [
        { id: 'facebookShare', alt: '페이스북 공유', icon: '/k-test/log/페이스북.png' },
        { id: 'instagramShare', alt: '인스타그램 공유', icon: '/k-test/log/인스타.png' },
        { id: 'twitterShare', alt: '트위터 공유', icon: '/k-test/log/트위터.png' },
        { id: 'urlShare', alt: 'URL 복사', icon: '/k-test/log/url.png' },     
    ];

    const resultSection = document.getElementById('resultSection');
    const shareContainer = document.createElement('div');
    shareContainer.classList.add('share-buttons');

    // 각 버튼을 생성하여 추가
    shareButtons.forEach(button => {
        const buttonElement = document.createElement('button');
        buttonElement.id = button.id;
        buttonElement.classList.add('share-button');
        buttonElement.innerHTML = `<img src="${button.icon}" alt="${button.alt}" />`;

        // 공유 버튼 클릭 이벤트
        buttonElement.addEventListener('click', () => {
            shareContent(button.id);
        });

        shareContainer.appendChild(buttonElement);
    });

    // 공유 버튼을 결과 화면에 추가
    resultSection.appendChild(shareContainer);
}

// 콘텐츠 공유 함수 (각 소셜 미디어 버튼 클릭 시)
function shareContent(platform) {
    const url = window.location.href;  // 현재 페이지 URL
    const text = '나의 연인 유형은? 확인해보세요!';

    switch(platform) {
        case 'facebookShare':
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
            break;
        case 'instagramShare':
            window.open(`https://www.instagram.com/?url=${encodeURIComponent(url)}`, '_blank');
            break;
        case 'twitterShare':
            window.open(`https://twitter.com/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
            break;
        case 'urlShare':
            alert('URL이 복사되었습니다: ' + url); // URL 복사 메시지
            break;
    }
}

// 유형 이름 반환 함수
function getTypeName(type) {
    switch (type) {
        case 'type1': return '미련형';
        case 'type2': return '분노형';
        case 'type3': return '후회형';
        case 'type4': return '무덤덤형';
        case 'type5': return '무감정형(공허·냉소)';
        default: return '';
    }
}

// 자세히 알아보기 페이지로 이동
function showDetailedPage(type) {
    // 각 유형에 맞는 페이지 URL 설정
    const pageUrls = {
        type1: 'https://testpro.site/k-test/연인/미련형',
        type2: 'https://testpro.site/k-test/연인/분노형',
        type3: 'https://testpro.site/k-test/연인/후회형',
        type4: 'https://testpro.site/k-test/연인/무덤덤형',
        type5: 'https://testpro.site/k-test/연인/무감정형'
    };

    // 해당 페이지로 이동
    window.location.href = pageUrls[type];
}
