// JavaScript (r1.js)

// 전역 변수
let currentQuestion = 0;
let answers = [];

// 질문에 대한 라디오 버튼 선택을 처리하는 함수
function checkRadioButton() {
    const question2Radios = document.querySelectorAll('input[name="q2"]');
    let resultButton = document.getElementById('resultButton');

    // 2번 질문의 라디오 버튼 중 하나가 선택되었는지 확인
    let isQuestion2Answered = Array.from(question2Radios).some(radio => radio.checked);

    // 2번 질문에 대해 답을 선택했다면 '결과 보기' 버튼을 활성화
    if (isQuestion2Answered) {
        resultButton.classList.remove('hidden');
    } else {
        resultButton.classList.add('hidden');
    }
}

// 결과 보기 버튼 클릭 시 결과 영역을 표시하는 함수
function showResult() {
    let resultSection = document.getElementById('resultSection');
    let resultText = document.getElementById('resultText');

    resultSection.classList.remove('hidden');
    resultText.innerText = "결과: 2"; // 결과로 숫자 2를 표시합니다.
}

// 이벤트 리스너 설정
document.getElementById('startTest').addEventListener('click', function() {
    document.getElementById('testSection').classList.remove('hidden');
    this.classList.add('hidden');
});

document.querySelectorAll('input[name="q2"]').forEach(radio => {
    radio.addEventListener('change', checkRadioButton);
});

document.getElementById('resultButton').addEventListener('click', showResult);
