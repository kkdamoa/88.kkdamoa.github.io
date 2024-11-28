document.getElementById("startTest").addEventListener("click", startTest);

let currentQuestion = 1;
const totalQuestions = 63;
const results = {};

// 에니어그램 유형 9개에 대한 초기 점수 (각각 0으로 시작)
const types = {
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

function startTest() {
    document.querySelector("header").style.display = "none"; // 테스트 시작 버튼 숨기기
    document.getElementById("testSection").classList.remove("hidden"); // 질문 섹션 보이기
    showQuestion(currentQuestion);
}

function showQuestion(questionNumber) {
    const question = document.querySelector(`.question[data-question="${questionNumber}"]`);
    question.classList.add("active");

    // 진행 바 업데이트
    updateProgressBar(questionNumber);
}

function updateProgressBar(questionNumber) {
    const progressBar = document.getElementById("progressBar");
    const percentage = (questionNumber / totalQuestions) * 100;
    progressBar.style.width = percentage + "%";
    progressBar.textContent = Math.round(percentage) + "%";
}

document.querySelectorAll(".radioContainer input").forEach(input => {
    input.addEventListener("change", function () {
        const questionData = this.closest(".question");
        const questionId = questionData.dataset.question;
        const score = parseInt(this.value);

        // 선택된 점수로 해당 유형 업데이트
        const questionType = getQuestionType(questionId);
        types[questionType] += score;

        // 다음 질문으로 이동
        nextQuestion(questionId);
    });
});

function getQuestionType(questionId) {
    // 각 질문에 대해 해당 유형을 분배 (예시로 임의 배정)
    // 이 부분은 각 질문이 어떤 유형에 해당하는지 매핑해야 합니다.
    if (questionId <= 7) return 'type1';
    else if (questionId <= 14) return 'type2';
    else if (questionId <= 21) return 'type3';
    else if (questionId <= 28) return 'type4';
    else if (questionId <= 35) return 'type5';
    else if (questionId <= 42) return 'type6';
    else if (questionId <= 49) return 'type7';
    else if (questionId <= 56) return 'type8';
    else return 'type9';
}

function nextQuestion(currentQuestionId) {
    // 현재 질문 숨기기
    document.querySelector(`.question[data-question="${currentQuestionId}"]`).classList.remove("active");

    // 다음 질문으로 이동
    currentQuestionId++;

    if (currentQuestionId > totalQuestions) {
        showResult();
    } else {
        showQuestion(currentQuestionId);
    }
}

function showResult() {
    // 가장 높은 점수를 받은 유형을 계산
    const highestType = Object.keys(types).reduce((a, b) => types[a] > types[b] ? a : b);

    let resultText = `당신의 에니어그램 유형은: ${highestType}입니다.`;

    document.getElementById("resultText").textContent = resultText;
    document.getElementById("resultSection").classList.remove("hidden");
    document.getElementById("testSection").classList.add("hidden");
}
