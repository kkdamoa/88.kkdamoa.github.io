// JavaScript (r1.js)

let currentQuestion = 0;
let answers = [];

// 2번 질문에 대한 라디오 버튼 클릭 시 결과 보기 버튼 활성화
function checkRadioButton() {
    const question2Radios = document.querySelectorAll('input[name="q2"]');
    let resultButton = document.getElementById('resultButton');

    // 2번 질문에 대해 라디오 버튼이 체크되었는지 확인
    let isQuestion2Answered = Array.from(question2Radios).some(radio => radio.checked);

    if (isQuestion2Answered) {
        resultButton.classList.remove('hidden'); // 버튼 활성화
    } else {
        resultButton.classList.add('hidden'); // 버튼 비활성화
    }
}

// 결과 보기 클릭 시 결과 표시 함수
function showResult() {
    let resultSection = document.getElementById('resultSection');
    let resultText = document.getElementById('resultText');

    // 결과를 "2"로 설정
    resultSection.classList.remove('hidden'); // 결과 섹션 보이기
    resultText.innerText = "결과: 2"; // 숫자 2 출력
}

// 시작 버튼 클릭 시 테스트 시작
document.getElementById('startTest').addEventListener('click', function() {
    document.getElementById('testSection').classList.remove('hidden');
    this.classList.add('hidden');
});

// 2번 질문에 대한 라디오 버튼 클릭 시 checkRadioButton 함수 실행
document.querySelectorAll('input[name="q2"]').forEach(radio => {
    radio.addEventListener('change', checkRadioButton);
});

// 결과 보기 버튼 클릭 시 showResult 함수 실행
document.getElementById('resultButton').addEventListener('click', showResult);
