// 추가 정보를 토글하는 함수
function toggleContent(sectionId) {
    const moreContent = document.getElementById(`${sectionId}-more`);
    if (moreContent.classList.contains('hidden')) {
        moreContent.classList.remove('hidden');
    } else {
        moreContent.classList.add('hidden');
    }
}
