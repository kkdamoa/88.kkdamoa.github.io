document.addEventListener('DOMContentLoaded', function() {
    const color = localStorage.getItem('colorTestResult');
    const detailedResultDiv = document.getElementById('detailedResult');

    if (color) {
        // colors.json 파일에서 데이터 불러오기
        fetch('colors.json')
            .then(response => response.json())
            .then(data => {
                if (data[color]) {
                    const colorData = data[color];
                    let detailedText = `
                        <h2>${colorData.title}</h2>
                        <img src="${colorData.image}" alt="${colorData.title}" />
                        <p>${colorData.description}</p>
                        <h3>심리적 특징</h3>
                        <ul>
                            ${colorData.psychological_traits.map(trait => `<li>${trait}</li>`).join('')}
                        </ul>
                        <h3>생활 속 조언</h3>
                        <p>${colorData.advice}</p>
                    `;
                    detailedResultDiv.innerHTML = detailedText;
                } else {
                    detailedResultDiv.innerHTML = `<p>상세 결과를 불러올 수 없습니다.</p>`;
                }
            })
            .catch(error => {
                console.error('Error loading colors.json:', error);
                detailedResultDiv.innerHTML = `<p>상세 결과를 불러오는 중 오류가 발생했습니다.</p>`;
            });
    } else {
        detailedResultDiv.innerHTML = `<p>결과가 없습니다. 테스트를 먼저 완료해주세요.</p>`;
    }
});

function goBack() {
    window.history.back();
}
