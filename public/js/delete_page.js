var selected_pages = document.getElementById('selected_pages')
var pages_input = document.getElementById('pages_input')
var pages_arr_input = document.getElementById('pages_arr');
var add_page_btn = document.getElementById('add_page_btn')
var files = [];
let files_legnth = 0;

add_page_btn.addEventListener('click', () => {
    try {
        var to_push = Number(pages_input.value);
        if (files.indexOf(to_push) === -1) {
            files.push(to_push);
            files.sort(compareNumbers);
            // files.filter(unique);
        }
        pages_arr_input.value = files;

        selected_pages.innerHTML = '';
        files.forEach((number, index) => {
            // var newSpan = document.createElement('span')
            // newSpan.innerHTML = number;
            // newSpan.id = `page-${index}`
            // newSpan.className = 'page';
            // newSpan.addEventListener("click",deleteNumber(index), false);
            // selected_pages.appendChild(newSpan);

            selected_pages.innerHTML += `<span onclick="deleteNumber(${index})" class="page" id="${index}">${number}</span>`;
        })

        // selected_pages.innerHTML += `<span class="page">${pages_input.value}</span>`;
        pages_input.value = '';

    } catch (error) {
        console.log('nooooo');
        pages_input.value = '';
    }
})

function compareNumbers(a, b) {
    // console.log(a, b);
    return a - b;
}

function deleteNumber(index) {
    files.splice(index, 1);
    pages_arr_input.value = files;
    selected_pages.innerHTML = '';
    files.forEach((number, index) => {
        selected_pages.innerHTML += `<span class="page" id="${index}" onclick="deleteNumber(${index})">${number}</span>`;
    })
}

const unique = (value, index, self) => {
    return self.indexOf(value) === index
}