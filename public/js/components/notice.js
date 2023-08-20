const noticeWrite = document.querySelector(".notice__write");
const openNoticeBtn = document.querySelector(".add-new-task-btn1");
const closeNoticeBtn = document.querySelector(".notice__write__close");
// 모달창 열기

openNoticeBtn.addEventListener("click", (event) => {

    
    noticeWrite.classList.remove('hidden')
 
  
});
// 모달창 닫기
closeNoticeBtn.addEventListener("click", () => {
    noticeWrite.classList.add('hidden')
    
})

noticeWrite.addEventListener('click', (event) => {
    if (event.target == noticeWrite) noticeWrite.classList.add('hidden')
    console.log(event.target)
    
})

