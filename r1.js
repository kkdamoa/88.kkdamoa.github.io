let currentQuestion = 1;
const totalQuestions = 60;
const progressBar = document.getElementById('progressBar');
const nextButton = document.getElementById('nextButton');
const testSection = document.getElementById('testSection');
const resultSection = document.getElementById('resultSection');
const resultText = document.getElementById('resultText');

// 각 유형에 대한 점수
let scores = {
    type1: 0,
    type2: 0,
    type3: 0,
    type4: 0,
    type5: 0,
    type6: 0,
    type7: 0,
    type8: 0,
    type9: 0
};

// 질문 보기
function showQuestion(questionNumber) {
    const questions = document.querySelectorAll('.question');
    questions.forEach(q => q.classList.add('hidden'));
    const current = document.querySelector(`.question[data-question="${questionNumber}"]`);
    current.classList.remove('hidden');

    // 라디오 버튼 선택 상태 체크
    const radioButtons = current.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => radio.addEventListener('change', handleAnswer));

    nextButton.disabled = true; // 초기화
}

// 진행 바 업데이트
function updateProgressBar() {
    const percentage = (currentQuestion / totalQuestions) * 100;
    progressBar.style.width = `${percentage}%`;
    progressBar.textContent = `${Math.round(percentage)}%`;
}

// 답변이 완료되었는지 확인하고 버튼 활성화
function handleAnswer() {
    nextButton.disabled = false;
}

// 시작 버튼 클릭 시
document.getElementById('startTest').addEventListener('click', () => {
    document.querySelector('header').classList.add('hidden');
    testSection.classList.remove('hidden');
    showQuestion(currentQuestion);
});

// 다음 버튼 클릭 시
nextButton.addEventListener('click', () => {
    const selectedValue = document.querySelector(`.question[data-question="${currentQuestion}"] input[type="radio"]:checked`).value;
    
    // 현재 질문에 대한 점수 누적
    if (currentQuestion <= 20) {
        scores.type1 += parseInt(selectedValue); // 예: 1번 유형 점수 추가
    } else if (currentQuestion <= 40) {
        scores.type2 += parseInt(selectedValue); // 예: 2번 유형 점수 추가
    } else if (currentQuestion <= 60) {
        scores.type3 += parseInt(selectedValue); // 예: 3번 유형 점수 추가
    }

    currentQuestion++;

    if (currentQuestion <= totalQuestions) {
        showQuestion(currentQuestion);
        updateProgressBar();
    } else {
        showResult();
    }
});

// 결과 계산 및 표시
function showResult() {
    let maxScore = -Infinity;
    let dominantType = '';

    for (let type in scores) {
        if (scores[type] > maxScore) {
            maxScore = scores[type];
            dominantType = type;
        }
    }

    let resultMessage = '';
    switch (dominantType) {
        case 'type1':
            resultMessage = '당신은 1번 유형: 완벽주의자입니다.';
            break;
        case 'type2':
            resultMessage = '당신은 2번 유형: 헌신적인 사람입니다.';
            break;
        case 'type3':
            resultMessage = '당신은 3번 유형: 성공을 추구하는 사람입니다.';
            break;
        case 'type4':
            resultMessage = '당신은 4번 유형: 개인주의자입니다.';
            break;
        case 'type5':
            resultMessage = '당신은 5번 유형: 탐구하는 사람입니다.';
            break;
        case 'type6':
            resultMessage = '당신은 6번 유형: 충성적인 사람입니다.';
            break;
        case 'type7':
            resultMessage = '당신은 7번 유형: 낙천적인 사람입니다.';
            break;
        case 'type8':
            resultMessage = '당신은 8번 유형: 리더형 사람입니다.';
            break;
        case 'type9':
            resultMessage = '당신은 9번 유형: 평화주의자입니다.';
            break;
        default:
            resultMessage = '결과를 계산할 수 없습니다.';
    }

    resultText.innerText = resultMessage;
    resultSection.classList.remove('hidden');
}
