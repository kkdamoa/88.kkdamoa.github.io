let answers = {};

function answer(questionNumber, choice) {
  answers[questionNumber] = choice;
}

function showResult() {
  if (Object.keys(answers).length < 3) {
    alert("Please answer all questions!");
    return;
  }

  const result = `${answers[1]}${answers[2]}${answers[3]}`;
  document.getElementById("result").innerText = `Your result is: ${result}`;
}
