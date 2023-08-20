const menuBtn = document.querySelector('.header__menu');
const menuBar = document.querySelector('.menu-bar');
const menuClose = document.querySelector('.menu-bar__close');
const navBlack = document.querySelector('.nav__black');

menuBtn.addEventListener('click', () => {
    menuBar.classList.add('show-menu');
    menuBtn.classList.add('remove__btn')
    navBlack.classList.add('show-nav')
});

menuClose.addEventListener('click', () => {
    menuBar.classList.remove('show-menu');
    menuBtn.classList.remove('remove__btn')
    navBlack.classList.remove('show-nav')
});

// document는 웹 페이지의 전체 문서를 나타내는 객체
document.addEventListener('click', (event) => {
    // 클릭된 요소가 menuBar 요소의 자식이 아니고, menuBtn 요소의 자식이 아닐 때
    if (!menuBar.contains(event.target) && !menuBtn.contains(event.target)) {
        // 메뉴 바 외부를 클릭한 경우, 메뉴 바를 닫습니다.
        menuBar.classList.remove('show-menu');
        menuBtn.classList.remove('remove__btn')
        navBlack.classList.remove('show-nav')
    }
});
