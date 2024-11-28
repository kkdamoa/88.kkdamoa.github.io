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
    resultText.innerText = "테스트를 완료하셨습니다! 선택한 답변에 따라 결과가 나옵니다."; // 결과 내용 변경 가능
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
