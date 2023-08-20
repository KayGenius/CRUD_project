const loginAlert = document.querySelector('.login__alert')
const loginId = document.querySelector('#id')
const loginPw = document.querySelector('#pw')
const loginSubmit = document.querySelector('.login__btnn')


// 로그인 경고

loginSubmit.addEventListener('click', (event) => {
    if (loginId.value === "") {
        event.preventDefault()
        loginAlert.innerHTML = '아이디를 입력해주세요'
    }
    else if (loginPw.value === "") {
        event.preventDefault()
        loginAlert.innerHTML = '비밀번호를 입력해주세요'
    }    
})




