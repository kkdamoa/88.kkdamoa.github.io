function showAnswers() {
    const q1 = document.querySelector('input[name="q1"]:checked');
    const q2 = document.querySelector('input[name="q2"]:checked');
    const q3 = document.querySelector('input[name="q3"]:checked');
    
    if (!q1 || !q2 || !q3) {
        alert("모든 질문에 답변을 선택해주세요.");
        return;
    }

    // 항상 '나는 바보다'라는 답변을 출력
    const answers = "나는 바보다";

    document.getElementById("resultQ1").textContent = `질문 1: ${answers}`;
    document.getElementById("resultQ2").textContent = `질문 2: ${answers}`;
    document.getElementById("resultQ3").textContent = `질문 3: ${answers}`;

    document.getElementById("answers").style.display = "block";
}
