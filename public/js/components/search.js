const searchBtn = document.querySelector('.search__button')
const searchInput = document.querySelector('.search__input')

searchBtn.addEventListener('click', () => {
    searchInput.classList.toggle('search__show')
})

const searchClick = window.location.pathname.toLowerCase();
console.log(searchClick);

let searchLinks = document.querySelectorAll('.search__list a');
for (let i = 0; i < searchLinks.length; i++) {
    searchLinks[0].style.fontWeight = '900';
    console.log(searchClick)
    searchLinks[i].classList.remove('search-clicked');
    if (searchClick.toLowerCase() === '/page/1') {
        searchLinks[0].classList.add('search-clicked');

    } else if (searchClick.toLowerCase() === '/project') {
        searchLinks[1].classList.add('search-clicked');
        searchLinks[0].style.fontWeight = '400';
    } else if (searchClick.toLowerCase() === '/study') {
        searchLinks[2].classList.add('search-clicked');
        searchLinks[0].style.fontWeight = '400';
    } else if (searchClick.toLowerCase() === '/competition') {
        searchLinks[3].classList.add('search-clicked');
        searchLinks[0].style.fontWeight = '400';
    } else if (searchClick.toLowerCase() === '/boardpan') {
        searchLinks[4].classList.add('search-clicked');
        searchLinks[0].style.fontWeight = '400';
    }
}