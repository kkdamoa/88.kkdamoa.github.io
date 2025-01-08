// 기존 토글 함수
function toggleContent(id) {
    // ...existing code...
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
