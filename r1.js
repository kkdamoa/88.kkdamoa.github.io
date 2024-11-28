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

// 각 질문에 대한 유형 매핑
const questionTypeMapping = {};

// 1번~7번: type1, 8번~14번: type2, 15번~21번: type3, ..., 57번~63번: type9
for (let i = 1; i <= totalQuestions; i++) {
    if (i <= 7) questionTypeMapping[i] = 'type1'; // 1~7번은 type1
    else if (i <= 14) questionTypeMapping[i] = 'type2'; // 8~14번은 type2
    else if (i <= 21) questionTypeMapping[i] = 'type3'; // 15~21번은 type3
    else if (i <= 28) questionTypeMapping[i] = 'type4'; // 22~28번은 type4
    else if (i <= 35) questionTypeMapping[i] = 'type5'; // 29~35번은 type5
    else if (i <= 42) questionTypeMapping[i] = 'type6'; // 36~42번은 type6
    else if (i <= 49) questionTypeMapping[i] = 'type7'; // 43~49번은 type7
    else if (i <= 56) questionTypeMapping[i] = 'type8'; // 50~56번은 type8
    else questionTypeMapping[i] = 'type9'; // 57~63번은 type9
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
    const questionType = questionTypeMapping[currentQuestion]; // 현재 질문에 해당하는 유형 가져오기
    scores[questionType] += parseInt(selectedValue); // 해당 유형에 점수 추가

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
    // 점수 내림차순으로 정렬
    const sortedScores = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
    
    // 상위 3개 유형 선택
    let resultMessage = '당신의 성격 유형은:\n';
    sortedScores.slice(0, 3).forEach((type, index) => {
        resultMessage += `${index + 1}. ${getTypeName(type)} (점수: ${scores[type]})\n`;
    });

    // 결과 표시
    resultText.innerText = resultMessage;
    resultSection.classList.remove('hidden');
}

// 유형 이름을 반환하는 함수
function getTypeName(type) {
    const typeNames = {
        type1: '완벽주의자',
        type2: '헌신적인 사람',
        type3: '성취를 추구하는 사람',
        type4: '개성추구자',
        type5: '탐구자',
        type6: '충실한 사람',
        type7: '열정적인 사람',
        type8: '도전자',
        type9: '평화주의자'
    };
    return typeNames[type] || '알 수 없음';
}
