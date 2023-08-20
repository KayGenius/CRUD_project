const noticeBtn = document.querySelector('.group__notice')
const noticeList = document.querySelector('.notice__list')
const canvanBoard = document.querySelector('.canvan')
const canvanBtn = document.querySelector('.group__board')
const openModalBtn1 = document.querySelector(".add-new-task-btn");
const openModalBtn2 = document.querySelector(".add-new-task-btn1");

// const canvan

noticeBtn.addEventListener('click', () => {
    noticeBtn.classList.add('blue')
    noticeList.classList.remove('hidden')
    canvanBtn.classList.remove('blue')
    canvanBoard.classList.add('hidden')
    openModalBtn1.classList.add('hidden')
    openModalBtn2.classList.remove('hidden')
})

canvanBtn.addEventListener('click', () => {
    canvanBtn.classList.add('blue')
    canvanBoard.classList.remove('hidden')
    noticeBtn.classList.remove('blue')
    noticeList.classList.add('hidden')
    openModalBtn1.classList.remove('hidden')
    openModalBtn2.classList.add('hidden')
})

