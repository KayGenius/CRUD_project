const writeGroup = document.querySelector('.write__group')
const writeSelect = document.querySelector('.write__select')
const selectValue = writeSelect.value
const selectStack = document.querySelector('.select-stack')
const selectCate = document.querySelector('.write__sort-cate')
console.log(selectValue)


    writeSelect.addEventListener('input', () => {
        if (writeSelect.value === '자유게시판') {
            writeGroup.classList.add('hidden');
            selectStack.classList.add('hidden');
            selectCate.classList.remove('hidden');
        } else {
            writeGroup.classList.remove('hidden');
            selectStack.classList.remove('hidden');
            selectCate.classList.add('hidden');
        }
    });



const todayDateInput = document.getElementById('todayDate');

// 오늘 날짜를 가져오기 위한 함수
function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 오늘 날짜를 input 요소의 value로 설정
todayDateInput.value = getTodayDate();



// 기술 스택
function addOption(value, text) {
            const container = document.getElementById('selected-container');

            const span = document.createElement('span');
            span.textContent = text;
            span.classList.add('span-text')

            const remove = document.createElement('span');
            remove.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
            remove.classList.add('remove');
            remove.addEventListener('click', function () {
                container.removeChild(span);
                const optionToRemove = document.querySelector(`#options option[value="${value}"]`);
                optionToRemove.removeAttribute('disabled');
            });

            span.appendChild(remove);
            container.appendChild(span);
        }

        document.addEventListener('DOMContentLoaded', function () {
            const selectElem = document.getElementById('options');
            selectElem.addEventListener('change', function () {
                const option = this.options[this.selectedIndex];
                const value = option.value;
                const text = option.text;
                addOption(value, text);
                option.setAttribute('disabled', true); // 추가된 코드
                this.selectedIndex = 0; // 추가된 코드
            });
        });

