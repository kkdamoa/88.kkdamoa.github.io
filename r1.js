function showAnswers() {
    const q1 = document.querySelector('input[name="q1"]:checked');
    const q2 = document.querySelector('input[name="q2"]:checked');
    const q3 = document.querySelector('input[name="q3"]:checked');
    
    if (!q1 || !q2 || !q3) {
        alert("모든 질문에 답변을 선택해주세요.");
        return;
    }

    const answers = {
        q1: q1.value === "yes" ? "감정 이해가 뛰어납니다." : "감정 이해가 부족할 수 있습니다.",
        q2: q2.value === "yes" ? "논리적인 접근을 선호합니다." : "감정적인 접근을 선호합니다.",
        q3: q3.value === "yes" ? "긴장감을 자주 느낍니다." : "긴장감을 덜 느낍니다."
    };

    document.getElementById("resultQ1").textContent = `질문 1: ${answers.q1}`;
    document.getElementById("resultQ2").textContent = `질문 2: ${answers.q2}`;
    document.getElementById("resultQ3").textContent = `질문 3: ${answers.q3}`;

    document.getElementById("answers").style.display = "block";
}
