class FortuneApp {
    constructor() {
        this.currentSection = 0;
        this.userData = null;
        this.fortune = null;
        this.biorhythm = null;
        
        this.initializeElements();
        this.addEventListeners();
        this.initializeAds();
    }

    initializeElements() {
        // 폼 요소
        this.fortuneForm = document.getElementById('fortuneForm');
        this.nameInput = document.getElementById('name');
        this.birthdateInput = document.getElementById('birthdate');
        this.genderInput = document.getElementById('gender');

        // 섹션 요소
        this.userFormSection = document.getElementById('userForm');
        this.fortuneSection = document.getElementById('fortuneSection');
        this.fullFortuneSection = document.getElementById('fullFortune');

        // 운세 표시 요소
        this.sectionTitle = document.getElementById('sectionTitle');
        this.fortuneContent = document.getElementById('fortuneContent');
        this.progressFill = document.getElementById('progressFill');
        this.nextButton = document.getElementById('nextButton');
        this.fullFortuneContent = document.getElementById('fullFortuneContent');

        // 바이오리듬 요소
        this.biorhythmBars = document.querySelector('.biorhythm-bars');

        // 카카오 공유 버튼
        this.kakaoShareButton = document.getElementById('kakaoShareButton');
    }
    addEventListeners() {
        this.fortuneForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        this.nextButton.addEventListener('click', () => this.handleNext());
        this.kakaoShareButton.addEventListener('click', () => this.shareToKakao());
    }

    initializeAds() {
        // 구글 애드센스 광고 초기화
        (adsbygoogle = window.adsbygoogle || []).push({});
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.userData = {
            name: this.nameInput.value,
            birthdate: this.birthdateInput.value,
            gender: this.genderInput.value
        };
        
        this.generateFortune();
        this.calculateBiorhythm();
        this.showFortuneSection();
    }

    generateFortune() {
        const getLuckyLevel = () => {
            const birthDate = new Date(this.userData.birthdate);
            const today = new Date();
            const sum = birthDate.getDate() + today.getDate();
            return sum % 5; // 0-4 사이의 값
        };

        const getRandomFortune = (category) => {
            const fortunes = fortuneData[category];
            const level = getLuckyLevel();
            const startIndex = level * 10; // 각 레벨별로 10개씩 구분
            const endIndex = startIndex + 10;
            const selectedFortunes = fortunes.slice(startIndex, endIndex);
            return selectedFortunes[Math.floor(Math.random() * selectedFortunes.length)];
        };

        this.fortune = {
            daily: getRandomFortune('daily'),
            money: getRandomFortune('money'),
            love: getRandomFortune('love'),
            work: getRandomFortune('work'),
            health: getRandomFortune('health'),
            caution: getRandomFortune('caution')
        };
    }

    calculateBiorhythm() {
        const birthday = new Date(this.userData.birthdate);
        const today = new Date();
        const diff = Math.floor((today - birthday) / (1000 * 60 * 60 * 24));

        this.biorhythm = {
            physical: Math.round(Math.sin((2 * Math.PI * diff) / 23) * 100),
            emotional: Math.round(Math.sin((2 * Math.PI * diff) / 28) * 100),
            intellectual: Math.round(Math.sin((2 * Math.PI * diff) / 33) * 100)
        };
    }

    showFortuneSection() {
        this.userFormSection.classList.add('hidden');
        this.fortuneSection.classList.remove('hidden');
        this.updateFortuneContent();
    }

    updateFortuneContent() {
        const sections = [
            { title: '오늘의 운세', content: this.fortune.daily },
            { title: '금전운', content: this.fortune.money },
            { title: '애정운', content: this.fortune.love },
            { title: '직장운', content: this.fortune.work },
            { title: '건강운', content: this.fortune.health },
            { title: '조언', content: this.fortune.caution }
        ];

        this.sectionTitle.textContent = sections[this.currentSection].title;
        this.fortuneContent.textContent = sections[this.currentSection].content;
        this.progressFill.style.width = `${((this.currentSection + 1) / sections.length) * 100}%`;
        
        if (this.currentSection === sections.length - 1) {
            this.nextButton.textContent = '전체 운세 보기';
        }
    }

    handleNext() {
        if (this.currentSection < 5) {
            this.currentSection++;
            this.updateFortuneContent();
        } else {
            this.showFullFortune();
        }
    }

    showFullFortune() {
        this.fortuneSection.classList.add('hidden');
        this.fullFortuneSection.classList.remove('hidden');
        this.displayFullFortune();
        this.displayBiorhythm();
    }

    displayFullFortune() {
        const sections = [
            { title: '오늘의 운세', content: this.fortune.daily },
            { title: '금전운', content: this.fortune.money },
            { title: '애정운', content: this.fortune.love },
            { title: '직장운', content: this.fortune.work },
            { title: '건강운', content: this.fortune.health },
            { title: '조언', content: this.fortune.caution }
        ];

        this.fullFortuneContent.innerHTML = sections.map(section => `
            <div class="fortune-item">
                <h3>${section.title}</h3>
                <p>${section.content}</p>
            </div>
        `).join('');
    }

    displayBiorhythm() {
        const getBarColor = (value) => {
            if (value > 50) return '#4CAF50';
            if (value > 0) return '#8BC34A';
            if (value > -50) return '#FFC107';
            return '#F44336';
        };

        const interpretBiorhythm = (value) => {
            if (value > 75) return "매우 좋음";
            if (value > 25) return "좋음";
            if (value > -25) return "보통";
            if (value > -75) return "나쁨";
            return "매우 나쁨";
        };

        const biorhythmTypes = {
            physical: '신체리듬',
            emotional: '감정리듬',
            intellectual: '지성리듬'
        };

        this.biorhythmBars.innerHTML = Object.entries(this.biorhythm).map(([type, value]) => `
            <div class="biorhythm-bar">
                <div class="bar-label">${biorhythmTypes[type]}</div>
                <div class="bar-container">
                    <div class="bar-fill" style="
                        width: ${Math.abs(value)}%;
                        background-color: ${getBarColor(value)}
                    "></div>
                </div>
                <div class="bar-value">${value}% (${interpretBiorhythm(value)})</div>
            </div>
        `).join('');
    }

    shareToKakao() {
        if (window.Kakao) {
            window.Kakao.Link.sendDefault({
                objectType: 'feed',
                content: {
                    title: `${this.userData.name}님의 오늘의 운세`,
                    description: `${this.fortune.daily}\n\n바이오리듬: 신체(${this.biorhythm.physical}%) 감정(${this.biorhythm.emotional}%) 지성(${this.biorhythm.intellectual}%)`,
                    imageUrl: 'https://your-domain.com/fortune-image.jpg', // 실제 이미지 URL로 변경 필요
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href,
                    },
                },
                buttons: [
                    {
                        title: '나의 운세 보기',
                        link: {
                            mobileWebUrl: window.location.href,
                            webUrl: window.location.href,
                        },
                    },
                ],
            });
        }
    }
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    new FortuneApp();
});