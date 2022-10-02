var form_content = document.getElementById('form-content');
var tags = document.getElementsByClassName('tag');
var tag_cont = document.getElementsByClassName('tag-cont');

for (let i = 0; i < tag_cont.length; i++) {
    const element = tag_cont[i];
    element.style.display = 'none';
}

let currTag = 'mixed';


for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];

    tag.addEventListener('click', () => {
        form_content.children[currTag].style.display = 'none';
        currTag = tag.id;
        form_content.children[currTag].style.display = 'block';
        clearTagsActive();
        tag.classList.add('active');
    })
}

function clearTagsActive() {
    for (let i = 0; i < tags.length; i++) {
        const tag = tags[i];
        tag.classList.remove('active');
    }
}

// =======================
