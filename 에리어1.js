document.addEventListener("DOMContentLoaded", () => {
    let currentQuestion = 1; // 현재 질문 번호
    const totalQuestions = 4; // 총 질문 수
    const progressBar = document.getElementById('progressBar');
    const nextButton = document.getElementById('nextQuestion');
    const testSection = document.getElementById('testSection');

    // 테스트 시작 버튼 클릭 시
    document.getElementById('startTest').addEventListener('click', () => {
        testSection.classList.remove('hidden');
        showQuestion(currentQuestion);
    });

    // 다음 질문 버튼 클릭 시
    nextButton.addEventListener('click', () => {
        const selectedOption = document.querySelector(`input[name="q${currentQuestion}"]:checked`);
        if (selectedOption) {
            // 진행 바 업데이트
            updateProgress();
            currentQuestion++;

            if (currentQuestion <= totalQuestions) {
                showQuestion(currentQuestion);
            } else {
                alert("테스트가 완료되었습니다!");
                nextButton.textContent = "완료";
            }
        } else {
            alert("질문에 답해주세요!");
        }
    });

    // 질문 보여주는 함수
    function showQuestion(questionNumber) {
        // 이전 질문 숨기기
        const previousQuestion = document.querySelector(`.question[data-question="${questionNumber - 1}"]`);
        if (previousQuestion) {
            previousQuestion.classList.add('hidden');
        }

        // 현재 질문 보이기
        const currentQuestionElement = document.querySelector(`.question[data-question="${questionNumber}"]`);
        if (currentQuestionElement) {
            currentQuestionElement.classList.remove('hidden');
        }

        // "다음 질문" 버튼 활성화
        nextButton.disabled = false;
    }

    // 진행 바 업데이트 함수
    function updateProgress() {
        const progress = (currentQuestion - 1) / totalQuestions * 100;
        progressBar.style.width = `${progress}%`;
        progressBar.textContent = `${Math.round(progress)}%`;
    }
});
