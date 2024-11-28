let currentQuestion = 1;
const totalQuestions = 63;
const progressBar = document.getElementById('progressBar');
const testSection = document.getElementById('testSection');
const resultSection = document.getElementById('resultSection');
const resultText = document.getElementById('resultText');

// 각 유형에 대한 점수
let scores = {
    type1: 0, // 완벽주의자
    type2: 0, // 헌신자
    type3: 0, // 성취자
    type4: 0, // 개성추구자
    type5: 0, // 탐구자
    type6: 0, // 충실한 사람
    type7: 0, // 열정적인 사람
    type8: 0, // 도전자
    type9: 0  // 평화주의자
};

// 각 질문에 대한 점수 매핑
// 1~7번: type1, 8~14번: type2, ..., 57~63번: type9
const questionTypeMapping = {};

// 1부터 63까지 질문을 각 유형에 7개씩 매핑
for (let i = 1; i <= totalQuestions; i++) {
    const typeIndex = Math.ceil(i / 7); // 1부터 9까지 유형을 순차적으로 매핑
    questionTypeMapping[i] = { 
        [`type${typeIndex}`]: 1 // 각 질문마다 해당 유형에 점수 1점 추가
    };
}

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
    const selectedValue = event.target.value;  // 선택된 값 가져오기
    
    // 선택된 값에 해당하는 점수 추가
    const questionScores = questionTypeMapping[currentQuestion];
    Object.keys(questionScores).forEach(type => {
        scores[type] += parseInt(selectedValue) * questionScores[type];
    });

    // 질문 번호 증가 후, 다음 질문 표시
    currentQuestion++;

    if (currentQuestion <= totalQuestions) {
        showQuestion(currentQuestion);
    } else {
        showResult();
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

// 결과 계산 및 표시
function showResult() {
    let resultMessage = '당신의 에니어그램 유형은:\n\n';
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
        resultDetails.push(`${index + 1}. ${getTypeName(item.type)}: ${item.score}점`);
    });

    resultMessage += resultDetails.join('\n');

    // 결과 표시
    resultText.innerText = resultMessage;
    resultSection.classList.remove('hidden');
}

// 유형 이름 반환 함수
function getTypeName(type) {
    switch (type) {
        case 'type1': return '완벽주의자';
        case 'type2': return '헌신자';
        case 'type3': return '성취자';
        case 'type4': return '개성추구자';
        case 'type5': return '탐구자';
        case 'type6': return '충실한 사람';
        case 'type7': return '열정적인 사람';
        case 'type8': return '도전자';
        case 'type9': return '평화주의자';
        default: return '';
    }
}
