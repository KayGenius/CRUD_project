const userName = document.querySelector('#name')
const id = document.querySelector('#join__id')
const password = document.querySelector('#join__pw')
const passwordRe = document.querySelector('#join__pw-re')
const gitId = document.querySelector('#gitid')
const phoneNum = document.querySelector('#phone')
const classSelect = document.querySelector('#option__class')
const joinAlert = document.querySelector('.join__alert')
const submitBtn = document.querySelector('.join__button')



submitBtn.addEventListener('click', (event) => {
    if (id.value === "") {
        event.preventDefault()
        joinAlert.innerHTML = `아이디를 입력해주세요`;
    } else if (password.value === "") {
        event.preventDefault()
        joinAlert.innerHTML = `비밀번호를 입력해주세요`;
    } else if (passwordRe.value === "") {
        event.preventDefault()
        joinAlert.innerHTML = `비밀번호를 다시 확인해주세요`;
    } else if (passwordRe.value !== password.value) {
        event.preventDefault()
        joinAlert.innerHTML = `비밀번호가 틀렸습니다`;
    } else if (userName.value === "") {
        event.preventDefault()
        joinAlert.innerHTML = `이름을 입력해주세요`;
    } else if (gitId.value === "") {
        event.preventDefault()
        joinAlert.innerHTML = `깃허브 아이디를 입력해주세요`;
    } else if (phoneNum.value === "") {
        event.preventDefault()
        joinAlert.innerHTML = `핸드폰 번호를 입력해주세요`;
    } else if (phoneNum.value === "") {
        event.preventDefault()
        joinAlert.innerHTML = `핸드폰 번호를 입력해주세요`;
    } else if (classSelect.value === "") {
        event.preventDefault()
        joinAlert.innerHTML = `과정을 선택해주세요`;
    } 
})