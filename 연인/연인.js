// 연인.js

document.addEventListener('DOMContentLoaded', () => {
    let currentQuestion = 1;
    const totalQuestions = 45;
    const maxScorePerType = 9 * 2; // 각 유형당 최대 점수 (9문항 * 선택값 최대 2)
    const progressBar = document.getElementById('progressBar');
    const testSection = document.getElementById('testSection');
    const resultSection = document.getElementById('resultSection');
    const resultText = document.getElementById('resultText');
    const showResultButton = document.getElementById('showResultButton');
    const startTestButton = document.getElementById('startTest');
    const questionsContainer = document.getElementById('questionsContainer');
    
    // 팝업 요소
    const adPopup = document.getElementById('adPopup');
    const popupOverlay = document.querySelector('.popup-overlay');
    const confirmAdPopupBtn = adPopup.querySelector('.confirm-popup-btn');
    const adsenseContainer = document.querySelector('#adsense-container');
    const counter = document.querySelector('#counter');
    let countdown;

    // 질문 완료 안내 팝업 요소
    const incompletePopup = document.getElementById('incompletePopup');
    const incompletePopupOverlay = document.getElementById('incompletePopupOverlay');
    const confirmIncompleteBtn = incompletePopup.querySelector('.confirm-incomplete-btn');

    // 각 유형에 대한 점수
    let scores = {
        type1: 0, // 미련형
        type2: 0, // 분노형
        type3: 0, // 후회형
        type4: 0, // 무덤덤형
        type5: 0  // 무감정형(공허·냉소)
    };
    
    // 각 질문에 대한 점수 매핑 (각 유형별로 9개의 질문)
    const questionTypeMapping = {
        1: 'type1', 2: 'type1', 3: 'type1', 4: 'type1', 5: 'type1', 6: 'type1', 7: 'type1', 8: 'type1', 9: 'type1',
        10: 'type2', 11: 'type2', 12: 'type2', 13: 'type2', 14: 'type2', 15: 'type2', 16: 'type2', 17: 'type2', 18: 'type2',
        19: 'type3', 20: 'type3', 21: 'type3', 22: 'type3', 23: 'type3', 24: 'type3', 25: 'type3', 26: 'type3', 27: 'type3',
        28: 'type4', 29: 'type4', 30: 'type4', 31: 'type4', 32: 'type4', 33: 'type4', 34: 'type4', 35: 'type4', 36: 'type4',
        37: 'type5', 38: 'type5', 39: 'type5', 40: 'type5', 41: 'type5', 42: 'type5', 43: 'type5', 44: 'type5', 45: 'type5'
    };
    
    // 질문 데이터
    const questions = {
        // 타입1: 미련형 (1-9)
        1: "나는 연인과의 약속을 철저히 지키려고 노력한다.",
        2: "연인이 나에게 상처를 주면 쉽게 잊지 못하고 계속 생각하게 된다.",
        3: "나는 과거의 관계를 자주 되돌아본다.",
        4: "연인과의 문제가 생기면 해결하려 애쓰는 편이다.",
        5: "나는 연인이 나에게 보여주는 작은 관심도 소중하게 여긴다.",
        6: "연인이 나를 떠날까봐 불안해하는 경우가 많다.",
        7: "나는 연인과의 추억을 소중히 간직한다.",
        8: "연인이 다른 사람과 가까워지면 질투를 느낀다.",
        9: "나는 연인이 나에게 기대하는 바를 항상 채우려고 노력한다.",
        
        // 타입2: 분노형 (10-18)
        10: "나는 연인이 나에게 무관심하게 대할 때 화가 난다.",
        11: "연인이 내 말을 무시하면 쉽게 화를 낸다.",
        12: "나는 감정을 잘 통제하지 못하고 화를 자주 낸다.",
        13: "연인이 내 기대에 미치지 못하면 실망감을 느낀다.",
        14: "나는 연인이 나에게 불만을 표출하면 즉각적으로 반응한다.",
        15: "연인이 나에게 거짓말을 하면 화가 난다.",
        16: "나는 연인과의 다툼이 길어지면 스트레스를 받는다.",
        17: "연인이 나의 노력을 인정하지 않을 때 불만을 느낀다.",
        18: "나는 연인이 나에게 잘못을 저지르면 쉽게 화를 낸다.",
        
        // 타입3: 후회형 (19-27)
        19: "나는 연인과의 관계에서 실수를 자주 한다고 생각한다.",
        20: "연인이 나를 떠난 후 많은 후회를 한다.",
        21: "나는 연인과의 약속을 지키지 못했을 때 자책한다.",
        22: "나는 과거의 관계를 계속 후회하며 생각한다.",
        23: "연인과의 다툼 후에 많은 후회를 한다.",
        24: "나는 연인에게 충분히 애정을 표현하지 못했다고 느낀다.",
        25: "나는 연인이 나에게 원하는 것을 제공하지 못했다고 생각한다.",
        26: "나는 연인과의 시간을 더 많이 보내지 못한 것을 후회한다.",
        27: "나는 연인이 나를 떠난 이유를 계속 후회한다.",
        
        // 타입4: 무덤덤형 (28-36)
        28: "나는 연인과의 관계에서 감정의 기복이 크지 않다.",
        29: "연인이 나에게 큰 기대를 하지 않아도 된다.",
        30: "나는 연인과의 관계를 너무 깊게 생각하지 않는다.",
        31: "연인이 나에게 감정을 표현해도 크게 신경 쓰지 않는다.",
        32: "나는 연인과의 관계에서 특별한 변화를 원하지 않는다.",
        33: "연인과의 일상에 큰 의미를 부여하지 않는다.",
        34: "나는 연인과의 문제를 크게 생각하지 않고 넘어간다.",
        35: "연인과의 관계에서 특별한 감정을 느끼지 않는다.",
        36: "나는 연인과의 관계를 평범하게 유지하려고 한다.",
        
        // 타입5: 무감정형(공허·냉소) (37-45)
        37: "나는 연인과의 관계에서 감정이 거의 없다.",
        38: "연인이 나에게 다가와도 큰 반응을 보이지 않는다.",
        39: "나는 연인과의 관계에서 의미를 느끼지 못한다.",
        40: "연인이 나에게 무엇을 요구해도 크게 신경 쓰지 않는다.",
        41: "나는 연인과의 대화에서 감정적인 교류가 부족하다고 느낀다.",
        42: "연인이 나에게 감정을 표현해도 공허함을 느낀다.",
        43: "나는 연인과의 관계에서 깊은 애정을 느끼지 않는다.",
        44: "연인과의 문제를 해결하려는 노력이 없다.",
        45: "나는 연인과의 관계에서 냉소적인 태도를 취한다."
    };
    
    // 라디오 버튼 값 설정
    const radioValues = [
        { value: -2, label: "전혀 그렇지 않다" },
        { value: -1, label: "" },
        { value: 0, label: "" },
        { value: 1, label: "" },
        { value: 2, label: "매우 그렇다" }
    ];
    
    // 질문 생성 함수
    function generateQuestions() {
        for (let i = 1; i <= totalQuestions; i++) {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('question', 'hidden');
            questionDiv.setAttribute('data-question', i);
            
            const questionText = document.createElement('p');
            questionText.textContent = questions[i] || `질문 ${i} 내용...`;
            questionDiv.appendChild(questionText);
            
            const radioContainer = document.createElement('div');
            radioContainer.classList.add('radioContainer');
            
            radioValues.forEach((radio, index) => {
                if (index === 0) {
                    const spanFalse = document.createElement('span');
                    spanFalse.classList.add('false');
                    spanFalse.textContent = radio.label;
                    radioContainer.appendChild(spanFalse);
                }
                
                const label = document.createElement('label');
                label.classList.add('labelContainer');
                
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = `q${i}`;
                input.value = radio.value;
                
                const checkmark = document.createElement('span');
                checkmark.classList.add('checkmark');
                
                label.appendChild(input);
                label.appendChild(checkmark);
                radioContainer.appendChild(label);
                
                if (index === radioValues.length - 1) {
                    const spanTrue = document.createElement('span');
                    spanTrue.classList.add('true');
                    spanTrue.textContent = radio.label;
                    radioContainer.appendChild(spanTrue);
                }
            });
            
            questionDiv.appendChild(radioContainer);
            questionsContainer.appendChild(questionDiv);
        }
        console.log('All questions generated.');
    }
    
    // 질문 표시 함수
    function showQuestion(questionNumber) {
        const questions = document.querySelectorAll('.question');
        questions.forEach(q => q.classList.add('hidden'));
        const current = document.querySelector(`.question[data-question="${questionNumber}"]`);
        if (current) {
            current.classList.remove('hidden');
            console.log(`Showing question ${questionNumber}`);
        } else {
            console.log(`No question found for ${questionNumber}`);
        }

        // 진행 상황 업데이트
        updateProgressBar();
    }
    
    // 진행 바 업데이트 함수
    function updateProgressBar() {
        const percentage = (currentQuestion / totalQuestions) * 100;
        progressBar.style.width = `${percentage}%`;
        progressBar.textContent = `${Math.round(percentage)}%`;
        console.log(`Progress: ${percentage}%`);
    }
    
    // 답변 처리 함수
    function handleAnswer(event) {
        const selectedValue = parseInt(event.target.value, 10);  // 선택된 값 가져오기
        console.log(`Selected value: ${selectedValue}`);
    
        if (isNaN(selectedValue)) return;
    
        // 선택된 값에 해당하는 점수 추가 (해당 유형에 점수 반영)
        const questionType = questionTypeMapping[currentQuestion];
        console.log(`Question Type: ${questionType}`);
        scores[questionType] += selectedValue;
        console.log(`Score for ${questionType}: ${scores[questionType]}`);
    
        // 질문 번호 증가 후, 다음 질문 표시
        currentQuestion++;
        console.log(`Current Question: ${currentQuestion}`);
    
        if (currentQuestion <= totalQuestions) {
            showQuestion(currentQuestion);
        } else {
            // 모든 질문을 끝낸 후 "결과 보기" 버튼 활성화
            showResultButton.disabled = false;
            console.log(`All questions completed. Show Result button enabled.`);
        }
    }
    
    // 테스트 시작 버튼 클릭 시
    startTestButton.addEventListener('click', () => {
        document.querySelector('header').classList.add('hidden');
        testSection.classList.remove('hidden');
        showQuestion(currentQuestion);
        console.log('Test started');
    });
    
    // 이벤트 위임을 통한 라디오 버튼 이벤트 리스너 추가
    testSection.addEventListener('change', (event) => {
        if (event.target.matches('input[type="radio"]')) {
            handleAnswer(event);
        }
    });
    
    // 결과 보기 버튼 클릭 시 팝업 열기
    showResultButton.addEventListener('click', () => {
        if (currentQuestion > totalQuestions) {
            // 모든 질문이 완료된 경우 팝업 열기
            adPopup.style.display = 'block'; // 팝업 표시
            popupOverlay.style.display = 'block'; // 배경 표시
            loadAd(); // 광고 로드
            startCountdown(); // 카운트다운 시작
            console.log('Show Result button clicked: all questions completed');
        } else {
            // 질문이 완료되지 않은 경우 안내 팝업 열기
            incompletePopup.style.display = 'block';
            incompletePopupOverlay.style.display = 'block';
            console.log('Show Result button clicked: incomplete');
        }
    });
    
    // 광고 팝업의 확인 버튼 클릭 시 팝업 닫기 및 결과 표시
    confirmAdPopupBtn.addEventListener('click', () => {
        // 팝업 닫기
        adPopup.style.display = 'none'; // 팝업 숨기기
        popupOverlay.style.display = 'none'; // 배경 숨기기
        console.log('Ad popup confirmed and closed');
    
        // 광고 제거 및 카운트다운 정지
        clearAd(); // 광고 제거
        clearInterval(countdown); // 카운트다운 정지
    
        // 결과 표시
        showResult(); // 결과 표시
        console.log('Showing result');
    });
    
    // 질문 완료 안내 팝업의 확인 버튼 클릭 시 팝업 닫기
    confirmIncompleteBtn.addEventListener('click', () => {
        incompletePopup.style.display = 'none';
        incompletePopupOverlay.style.display = 'none';
        console.log('Incomplete popup confirmed and closed');
    });
    
    // 배경 클릭 시 팝업 닫기
    popupOverlay.addEventListener('click', () => {
        adPopup.style.display = 'none';
        popupOverlay.style.display = 'none';
        incompletePopup.style.display = 'none'; // 질문 완료 안내 팝업 숨기기
        incompletePopupOverlay.style.display = 'none'; // 질문 완료 안내 팝업 배경 숨기기
        clearAd(); // 광고 제거
        clearInterval(countdown); // 카운트다운 정지
        console.log('Popup overlay clicked: popups closed');
    });
    
    // 광고 로드 함수
    function loadAd() {
        const adScript = document.createElement('script');
        adScript.async = true;
        adScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9374368296307755";
        document.head.appendChild(adScript);
        console.log('Ad script loaded');
    
        const adContainer = document.createElement('ins');
        adContainer.classList.add('adsbygoogle');
        adContainer.style.display = 'block';
        adContainer.setAttribute('data-ad-client', 'ca-pub-9374368296307755');
        adContainer.setAttribute('data-ad-slot', '3201247599');
        adContainer.setAttribute('data-ad-format', 'auto');
        adContainer.setAttribute('data-full-width-responsive', 'true');
    
        adsenseContainer.appendChild(adContainer);
        console.log('Ad container appended');
    
        (adsbygoogle = window.adsbygoogle || []).push({});
    }
    
    // 광고 제거 함수
    function clearAd() {
        adsenseContainer.innerHTML = '';
        console.log('Ads cleared');
    }
    
    // 카운트다운 함수
    function startCountdown() {
        let timeLeft = 7;
        counter.textContent = `${timeLeft}초 결과값 확인중 입니다..`;
        console.log(`Countdown started: ${timeLeft} seconds`);
    
        countdown = setInterval(() => {
            timeLeft--;
            counter.textContent = `${timeLeft}초 결과값 확인중 입니다..`;
            console.log(`Countdown: ${timeLeft} seconds left`);
            if (timeLeft <= 0) {
                clearInterval(countdown);
                counter.textContent = "결과값이 나왔습니다";
                // "확인" 버튼 활성화
                confirmAdPopupBtn.disabled = false;
                confirmAdPopupBtn.classList.add('enabled');
                console.log('Countdown ended: Confirm button enabled');
            }
        }, 1000);
    }
    
    // 결과 계산 및 표시 함수
    function showResult() {
        // 점수 내림차순으로 정렬
        const sortedScores = Object.keys(scores)
            .map(type => ({ type, score: scores[type] }))
            .sort((a, b) => b.score - a.score);
    
        // 결과 메시지 생성
        let resultDetails = sortedScores.map((item, index) => {
            const percentage = (item.score / maxScorePerType) * 100;  // 각 유형의 최대 점수를 기준으로 퍼센트 계산
            return `
                <div class="result-item">
                    <div class="result-type">${index + 1}. ${getTypeName(item.type)}</div>
                    <div class="result-score">${percentage.toFixed(2)}%</div>
                    <div><a href="#" class="more-info" data-type="${item.type}" aria-label="${getTypeName(item.type)} 자세히 알아보기">자세히 알아보기</a></div>
                </div>
            `;
        }).join('');
    
        resultText.innerHTML = `<h2>당신의 연인 유형은:</h2>${resultDetails}`;
        resultSection.classList.remove('hidden');
        console.log('Result section displayed');
    
        // "자세히 알아보기" 클릭 이벤트 추가
        document.querySelectorAll('.more-info').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const type = e.target.getAttribute('data-type');
                showDetailedPage(type);
            });
        });
    
        // 소셜 미디어 공유 버튼 추가
        addShareButtons();
        console.log('Share buttons added');
    }
    
    // 소셜 미디어 공유 버튼 추가 함수
    function addShareButtons() {
        const shareButtons = [
            { id: 'facebookShare', alt: '페이스북 공유', icon: 'https://cdn-icons-png.flaticon.com/512/124/124010.png' },
            { id: 'instagramShare', alt: '인스타그램 공유', icon: 'https://cdn-icons-png.flaticon.com/512/174/174855.png' },
            { id: 'twitterShare', alt: '트위터 공유', icon: 'https://cdn-icons-png.flaticon.com/512/124/124021.png' },
            { id: 'urlShare', alt: 'URL 복사', icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828817.png' },     
        ];
    
        const shareContainer = document.createElement('div');
        shareContainer.classList.add('share-buttons');
    
        // 각 버튼을 생성하여 추가
        shareButtons.forEach(button => {
            const buttonElement = document.createElement('button');
            buttonElement.id = button.id;
            buttonElement.classList.add('share-button');
            buttonElement.setAttribute('aria-label', button.alt);
            buttonElement.innerHTML = `<img src="${button.icon}" alt="${button.alt}" />`;
    
            // 공유 버튼 클릭 이벤트
            buttonElement.addEventListener('click', () => {
                shareContent(button.id);
            });
    
            shareContainer.appendChild(buttonElement);
        });
    
        // 공유 버튼을 결과 화면에 추가
        resultSection.appendChild(shareContainer);
        console.log('Share buttons appended to result section');
    }
    
    // 콘텐츠 공유 함수 (각 소셜 미디어 버튼 클릭 시)
    function shareContent(platform) {
        const url = window.location.href;  // 현재 페이지 URL
        const text = '나의 연인 유형은? 확인해보세요!';
    
        switch(platform) {
            case 'facebookShare':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'instagramShare':
                // 인스타그램은 URL 공유가 직접적으로 지원되지 않음
                alert('인스타그램에서는 URL 공유가 지원되지 않습니다.');
                break;
            case 'twitterShare':
                window.open(`https://twitter.com/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
                break;
            case 'urlShare':
                navigator.clipboard.writeText(url)
                    .then(() => {
                        alert('URL이 클립보드에 복사되었습니다!');
                    })
                    .catch(err => {
                        console.error('URL 복사 실패:', err);
                        alert('URL 복사에 실패했습니다. 수동으로 복사해 주세요.');
                    });
                break;
            default:
                break;
        }
    }
    
    // 유형 이름 반환 함수
    function getTypeName(type) {
        switch (type) {
            case 'type1': return '미련형';
            case 'type2': return '분노형';
            case 'type3': return '후회형';
            case 'type4': return '무덤덤형';
            case 'type5': return '무감정형(공허·냉소)';
            default: return '';
        }
    }
    
    // 자세히 알아보기 페이지로 이동 함수
    function showDetailedPage(type) {
        // 각 유형에 맞는 페이지 URL 설정
        const pageUrls = {
            type1: 'https://testpro.site/k-test/연인/미련형',
            type2: 'https://testpro.site/k-test/연인/분노형',
            type3: 'https://testpro.site/k-test/연인/후회형',
            type4: 'https://testpro.site/k-test/연인/무덤덤형',
            type5: 'https://testpro.site/k-test/연인/무감정형'
        };

        // 해당 페이지로 이동
        window.location.href = pageUrls[type];
    }
    
    // 질문 생성
    generateQuestions();
});
