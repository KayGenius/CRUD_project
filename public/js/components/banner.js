const btnOne = document.querySelector('.btnone')
const btnTwo = document.querySelector('.btntwo')
const btnThree = document.querySelector('.btnthree')
const bannerSlide = document.querySelector('.banner__slide')
const bannerContent = document.querySelectorAll('.banner__content')





let bannerCount = 0
btnOne.addEventListener('click', () => {
    bannerSlide.style.transform = 'translateX(95vw)';
    btnTwo.style.backgroundColor = 'gray'
    btnThree.style.backgroundColor = 'gray'
    btnOne.style.backgroundColor = 'black'
    
    bannerCount = 3
})

btnTwo.addEventListener('click', () => {
    bannerSlide.style.transform = 'translateX(0vw)';
    btnOne.style.backgroundColor = 'gray'
    btnThree.style.backgroundColor = 'gray'
    btnTwo.style.backgroundColor = 'black'
    
    bannerCount = 6
})

btnThree.addEventListener('click', () => {
    bannerSlide.style.transform = 'translateX(-95vw)';
    btnOne.style.backgroundColor = 'gray'
    btnTwo.style.backgroundColor = 'gray'
    btnThree.style.backgroundColor = 'black'
    
    bannerCount = 9
})




setInterval(() => {
    bannerCount += 1
    
    if (bannerCount === 3) {
        bannerSlide.style.transform = 'translateX(0vw)';
        btnOne.style.backgroundColor = 'gray'
        btnTwo.style.backgroundColor = 'black'
        btnThree.style.backgroundColor = 'gray'
    } else if (bannerCount === 6) {
        bannerSlide.style.transform = 'translateX(-95vw)';
        btnTwo.style.backgroundColor = 'gray'
        btnOne.style.backgroundColor = 'gray'
        btnThree.style.backgroundColor = 'black'
    } else if (bannerCount === 9) {
        bannerSlide.style.transform = 'translateX(95vw)';
        btnOne.style.backgroundColor = 'black'
        btnTwo.style.backgroundColor = 'gray'
        btnThree.style.backgroundColor = 'gray'
        bannerCount = 0
    }
}, 1000)




// 만약 숫자가 1이면 100 주고 2면 0 3이면 -95 줘라 그러면
// 그러면 이제 시간 몇초마다 이동시켜라 
// 로 바꾸면 되겠다.

// 3이 되는순간 3번블록에 있는애는 바로 transform 100으로 만들어주면 될 거 같다. =