document.addEventListener("DOMContentLoaded", () => {
    const startTestButton = document.getElementById("startTest");
    const testSection = document.getElementById("testSection");
    const nextQuestionButton = document.getElementById("nextQuestion");
    const questions = document.querySelectorAll(".question");
    let currentQuestionIndex = 0;

    // 테스트 시작 버튼 클릭 시
    startTestButton.addEventListener("click", () => {
        startTestButton.parentElement.classList.add("hidden");
        testSection.classList.remove("hidden");
    });

    // 다음 질문 버튼 클릭 시
    nextQuestionButton.addEventListener("click", () => {
        const currentQuestion = questions[currentQuestionIndex];
        const selectedOption = currentQuestion.querySelector("input:checked");

        // 사용자가 선택하지 않은 경우 알림
        if (!selectedOption) {
            alert("답변을 선택해주세요!");
            return;
        }

        // 현재 질문 숨기기
        currentQuestion.classList.add("hidden");
        currentQuestionIndex++;

        // 다음 질문 표시
        if (currentQuestionIndex < questions.length) {
            questions[currentQuestionIndex].classList.remove("hidden");
        } else {
            // 질문이 모두 끝난 경우
            alert("테스트가 완료되었습니다!");
            nextQuestionButton.classList.add("hidden");
        }
    });
});
