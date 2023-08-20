const todolist = document.querySelectorAll('.todo__list__li');
const sections = document.querySelectorAll('.canvan section');

const groupPlusBtn = document.querySelector('.group-plus-btn')
const groupPlusBtni = document.querySelector('.group-plus-btn i')
const groupPlus = document.querySelector('.plus__group')

groupPlusBtn.addEventListener('click', () => {
    groupPlus.classList.toggle('hidden')
})
document.body.addEventListener('click',(event)=>{
    if(groupPlusBtn != event.target && groupPlusBtni !=event.target){
    groupPlus.classList.add('hidden')}
  
})



const groupInvite = document.querySelector('.group-invite')
const groupInviteInput = document.querySelector('.group-invite-input')



groupInvite.addEventListener('click', () => {
    groupInviteInput.classList.toggle('hidden')
    console.log('hi')
})



sections.forEach((section, index) => {
    section.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    section.addEventListener('drop', (e) => {
        e.preventDefault();
        const selected = document.querySelector('.dragging');
        if (selected) {
            section.querySelector('ul').appendChild(selected);
            selected.classList.remove('dragging');

            const itemId = selected.getAttribute('data-id');
            const newProcessValue = index;

            updateItem(itemId, newProcessValue);
        }
    });
});

for (const item of todolist) {
    item.addEventListener('dragstart', (e) => {
        e.target.classList.add('dragging');
    });

    item.addEventListener('dragend', (e) => {
        e.target.classList.remove('dragging');
    });
}

const listMenuBtn = document.querySelectorAll('.list__menu-btn');
const listButtons = document.querySelectorAll('.list__buttons');

for (let i = 0; i < listMenuBtn.length; i++ ) {
    let handCount = 0;
    listMenuBtn[i].addEventListener('click', () => {
        listButtons[i].classList.toggle('hidden');
        handCount++;
        console.log(handCount);
        if (handCount % 2 == 1) {
            listMenuBtn[i].innerHTML = `<i class="fa-solid fa-hand"></i>`;
        } else {
            listMenuBtn[i].innerHTML = `<i class="fa-regular fa-hand"></i>`;
        }
    });
}

const canvanWrite = document.querySelector(".canvan__write")
const openModalBtn = document.querySelector(".add-new-task-btn")
const closeModalBtn = document.querySelector(".canvan__write__close")

openModalBtn.addEventListener("click", () => {
    canvanWrite.classList.remove('hidden')
});

closeModalBtn.addEventListener("click", () => {
    canvanWrite.classList.add('hidden')
});

canvanWrite.addEventListener("click", (event) => {
    if (event.target == canvanWrite) {
        canvanWrite.classList.add('hidden')
        
    }
    console.log(event.target)
    
    
})



const listContainer = document.querySelector('.canvan');
listContainer.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.list__delete-btn');
    if (deleteBtn) {
      const itemId = deleteBtn.getAttribute('data-id');
      deleteItem(itemId, deleteBtn);
    }
  });



function deleteItem(id, deleteBtn) {
    fetch(`/group/delete/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); 
    })
    .then(data => {
        console.log('데이터메시지',data.message);
        if (data) {
            deleteBtn.parentNode.parentNode.style.display = 'none';
        }
        console.log(data);
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}

function updateItem(id, newProcessValue) {
    fetch(`/group/update/${id}`, { // 요청 경로를 /group/update/:id로 수정
        method: 'POST', // 요청 메서드를 POST로 변경
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ in_process: newProcessValue }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); 
    })
    .then(data => {
        console.log('데이터메시지', data.message);
        // 상태 업데이트 완료 후 처리할 작업
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}