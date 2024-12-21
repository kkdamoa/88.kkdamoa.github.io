// 연인.js

document.addEventListener('DOMContentLoaded', () => {
    let currentQuestion = 1;
    const totalQuestions = 45;
    const maxScorePerType = 9 * 5; // 각 유형당 최대 점수 (9문항 * 선택값 최대 5)
    const progressBar = document.getElementById('progressBar');
    const testSection = document.getElementById('testSection');
    const resultSection = document.getElementById('resultSection');
    const resultText = document.getElementById('resultText');
    const showResultButton = document.getElementById('showResultButton');
    const startTestButton = document.getElementById('startTest');
    const questionsContainer = document.getElementById('questionsContainer');
    
    // 팝업 요소
    const popup = document.querySelector('.popup');
    const popupOverlay = document.querySelector('.popup-overlay');
    const confirmPopupBtn = document.querySelector('.confirm-popup-btn');
    const adsenseContainer = document.querySelector('#adsense-container');
    const counter = document.querySelector('#counter');
    let countdown;

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
    
    // 질문 데이터 (예시: 실제 질문 내용으로 대체)
    const questions = {
        1: "나는 일상에서 규칙을 지키는 것이 매우 중요하다고 느낀다.",
        2: "나는 감정 표현을 자주 한다.",
        3: "나는 새로운 상황에서 쉽게 적응한다.",
        4: "나는 계획을 철저히 세우는 편이다.",
        5: "나는 타인의 감정을 잘 이해한다.",
        6: "나는 어려운 문제를 해결하는 것을 즐긴다.",
        7: "나는 리더십을 발휘하는 것을 좋아한다.",
        8: "나는 혼자 있는 시간을 선호한다.",
        9: "나는 도전을 두려워하지 않는다.",
        10: "나는 스트레스를 효과적으로 관리한다.",
        11: "나는 타인의 기대에 부응하려 노력한다.",
        12: "나는 자신의 감정을 숨기지 않는다.",
        13: "나는 논리적으로 사고하는 편이다.",
        14: "나는 새로운 사람들을 만나는 것을 즐긴다.",
        15: "나는 자신의 실수를 인정하는 것을 어려워한다.",
        16: "나는 일을 체계적으로 처리한다.",
        17: "나는 타인에게 의존하는 것을 좋아한다.",
        18: "나는 자신의 목표를 명확히 설정한다.",
        19: "나는 과거의 실수를 자주 되새긴다.",
        20: "나는 자신의 행동에 책임을 느낀다.",
        21: "나는 문제 해결을 위해 다양한 방법을 시도한다.",
        22: "나는 타인의 의견을 잘 수용한다.",
        23: "나는 자신의 감정을 통제하는 편이다.",
        24: "나는 도전을 통해 성장한다고 믿는다.",
        25: "나는 자신의 한계를 인식하고 있다.",
        26: "나는 타인과의 갈등을 피하려고 노력한다.",
        27: "나는 자신의 결정에 확신이 있다.",
        28: "나는 감정에 휘둘리지 않는다.",
        29: "나는 논쟁을 즐기지 않는다.",
        30: "나는 자신의 가치관을 고수한다.",
        31: "나는 스트레스를 받으면 효과적으로 대처한다.",
        32: "나는 타인의 기대에 맞추려 노력한다.",
        33: "나는 자신의 감정을 잘 표현하지 않는다.",
        34: "나는 계획 없이 일을 시작하는 편이다.",
        35: "나는 타인과의 관계에서 주도권을 잡는 것을 좋아한다.",
        36: "나는 혼자만의 시간을 필요로 한다.",
        37: "나는 감정에 따라 행동하는 경우가 많다.",
        38: "나는 논리적인 사고보다 직감을 더 신뢰한다.",
        39: "나는 타인의 감정을 쉽게 상하게 하지 않는다.",
        40: "나는 자신의 목표를 달성하기 위해 노력한다.",
        41: "나는 타인과의 경쟁을 즐긴다.",
        42: "나는 자신의 감정을 자주 억누른다.",
        43: "나는 변화에 잘 적응한다.",
        44: "나는 타인의 의견에 쉽게 동의한다.",
        45: "나는 자신의 실수를 잘 인정하지 않는다."
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
    }
    
    // 질문 표시 함수
    function showQuestion(questionNumber) {
        const questions = document.querySelectorAll('.question');
        questions.forEach(q => q.classList.add('hidden'));
        const current = document.querySelector(`.question[data-question="${questionNumber}"]`);
        if (current) {
            current.classList.remove('hidden');
        }

        // 진행 상황 업데이트
        updateProgressBar();
    }
    
    // 진행 바 업데이트 함수
    function updateProgressBar() {
        const percentage = (currentQuestion / totalQuestions) * 100;
        progressBar.style.width = `${percentage}%`;
        progressBar.textContent = `${Math.round(percentage)}%`;
    }
    
    // 답변 처리 함수
    function handleAnswer(event) {
        const selectedValue = parseInt(event.target.value, 10);  // 선택된 값 가져오기

        if (isNaN(selectedValue)) return;

        // 선택된 값에 해당하는 점수 추가 (해당 유형에 점수 반영)
        const questionType = questionTypeMapping[currentQuestion];
        scores[questionType] += selectedValue;

        // 질문 번호 증가 후, 다음 질문 표시
        currentQuestion++;

        if (currentQuestion <= totalQuestions) {
            showQuestion(currentQuestion);
        } else {
            // 모든 질문을 끝낸 후 "결과 보기" 버튼 표시
            showResultButton.classList.remove('hidden');
        }
    }
    
    // 테스트 시작 버튼 클릭 시
    startTestButton.addEventListener('click', () => {
        document.querySelector('header').classList.add('hidden');
        testSection.classList.remove('hidden');
        showQuestion(currentQuestion);
    });
    
    // 이벤트 위임을 통한 라디오 버튼 이벤트 리스너 추가
    testSection.addEventListener('change', (event) => {
        if (event.target.matches('input[type="radio"]')) {
            handleAnswer(event);
        }
    });
    
    // 결과 보기 버튼 클릭 시 팝업 열기
    showResultButton.addEventListener('click', () => {
        popup.style.display = 'block'; // 팝업 표시
        popupOverlay.style.display = 'block'; // 배경 표시
        loadAd(); // 광고 로드
        startCountdown(); // 카운트다운 시작
    });
    
    // 확인 버튼 클릭 시 팝업 닫기 및 결과 표시
    confirmPopupBtn.addEventListener('click', () => {
        popup.style.display = 'none'; // 팝업 숨기기
        popupOverlay.style.display = 'none'; // 배경 숨기기
        clearAd(); // 광고 제거
        clearInterval(countdown); // 카운트다운 정지
        showResult(); // 결과 표시
    });
    
    // 배경 클릭 시 팝업 닫기
    popupOverlay.addEventListener('click', () => {
        popup.style.display = 'none';
        popupOverlay.style.display = 'none';
        clearAd(); // 광고 제거
        clearInterval(countdown); // 카운트다운 정지
    });
    
    // 광고 로드 함수
    function loadAd() {
        const adScript = document.createElement('script');
        adScript.async = true;
        adScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9374368296307755";
        document.head.appendChild(adScript);

        const adContainer = document.createElement('ins');
        adContainer.classList.add('adsbygoogle');
        adContainer.style.display = 'block';
        adContainer.setAttribute('data-ad-client', 'ca-pub-9374368296307755');
        adContainer.setAttribute('data-ad-slot', '3201247599');
        adContainer.setAttribute('data-ad-format', 'auto');
        adContainer.setAttribute('data-full-width-responsive', 'true');

        adsenseContainer.appendChild(adContainer);

        (adsbygoogle = window.adsbygoogle || []).push({});
    }

    // 광고 제거 함수
    function clearAd() {
        adsenseContainer.innerHTML = '';
    }

    // 카운트다운 함수
    function startCountdown() {
        let timeLeft = 7;
        counter.textContent = `${timeLeft}초 결과값 확인중 입니다..`;

        countdown = setInterval(() => {
            timeLeft--;
            counter.textContent = `${timeLeft}초 결과값 확인중 입니다..`;
            if (timeLeft <= 0) {
                clearInterval(countdown);
                counter.textContent = "결과값이 나왔습니다";
                confirmPopupBtn.style.display = 'inline-block'; // 확인 버튼 표시
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
