// 광고 로딩 최적화
window.addEventListener('load', function() {
    // 광고 초기화 함수
    function initAds() {
        (adsbygoogle = window.adsbygoogle || []).push({});
    }

    // 광고 로딩 지연
    setTimeout(initAds, 1000);
});

// 콘텐츠 토글 함수
function toggleContent(id) {
    const content = document.getElementById(id + '-more');
    content.style.display = content.style.display === 'none' ? 'block' : 'none';
}

// 팝업 광고 관련 함수
function showPopupAd() {
    const popup = document.getElementById('popupAd');
    popup.style.display = 'block';
    
    // 팝업 광고 실행
    (adsbygoogle = window.adsbygoogle || []).push({});
}

// 팝업 닫기
document.querySelector('.close-btn').addEventListener('click', function() {
    document.getElementById('popupAd').style.display = 'none';
});

// 페이지 로드 후 5초 뒤 팝업 표시
window.addEventListener('load', function() {
    setTimeout(showPopupAd, 5000);
});
