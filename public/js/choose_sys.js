var html_content = {
    mixed: `<form action="/url_parser" method="post">
        <div class="form-item">
            <label for="FILES_NUMBER">Files Number</label>
            <input type="number" name="FILES_NUMBER" id="FILES_NUMBER"><br>
        </div>

        <div class="form-item">
            <label for="url">URL</label>
            <input type="text" name="url" id="url" />
        </div>

        <input type="text" name="DTYPE" value="mixed" hidden>

        <button class="overlay__btn overlay__btn--colors" style="margin: 0 auto !important;">
            <input type="submit" value="Submit">
            <span class="overlay__btn-emoji"></span>
        </button>
        </form>`,

    selective: `
        <form action="/url_parser" method="post">
            <!-- 
            <div class="form-item">
                <label for="website">Choose a website:</label>
                <select name="website" id="website">
                    <option value="Google-Drive">Google-Drive</option>
                    <option value="QNL">QNL</option>
                    <option value="Slideshare">Slideshare</option>
                    <option value="archive.alsharekh">archive.alsharekh</option>
                    <option value="dar.bibalex">dar.bibalex</option>
                    <option value="yunong.io">yunong.io</option>
                    <option value="InfoQ">InfoQ</option>
                </select>    
            </div>

            <div class="form-item">
                <label for="website">File Type:</label>
                <select name="FILE_TYPE" id="FILE_TYPE">
                    <option value="jpg">jpg</option>
                    <option value="pdf">pdf</option>
                </select>
                
            </div>

            <div class="form-item">
                <label for="FOLDER_NAME">Folder Name</label>
                <input type="text" name="FOLDER_NAME" id="FOLDER_NAME">
            </div>

            <div class="form-item">
                <label for="FOLDER_NAME">File Name</label>
                <input type="text" name="FILE_NAME" id="FILE_NAME">
            </div>

            <div class="form-item">
                <label for="URI_START">URI_START</label>
                <input type="text" name="URI_START" id="URI_START">
            </div>

            <div class="form-item">
                <label for="URI_END">URI_END</label>
                <input type="text" name="URI_END" id="URI_END">
            </div>
            -->

            <div class="form-item">
                <label for="PAGES">Pages: </label>
                <span id="selected_pages"></span>

                <div style="display: flex">
                    <input type="text" name="PAGES" id="pages_input">

                    <span id="add_page_btn" class="overlay__btn overlay__btn--colors" 
                    style="margin: 0 auto !important;
                    width: fit-content !important;
                    position: relative;
                    left: -2.5rem;
                    bottom: -0.12rem;
                    border-top-left-radius: 0;
                    border-bottom-left-radius: 0;
                    font-size: 0.75em;
                    padding: 0rem 0.6rem;
                    scale: 1.075;">
                        Add
                    </span>
                </div>
            </div>

            <div class="form-item">
                <label for="url">URL</label>
                <input type="text" name="url" id="url" />
            </div>

            <input type="text" name="DTYPE" value="selective" hidden>

            <button class="overlay__btn overlay__btn--colors" style="margin: 0 auto !important;">
                <input type="submit" value="Submit">
                <span class="overlay__btn-emoji"></span>
            </button>
        </form>`
}


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
var selected_pages = document.getElementById('selected_pages')
var pages_input = document.getElementById('pages_input')
var add_page_btn = document.getElementById('add_page_btn')

add_page_btn.addEventListener('click', () => {
    selected_pages.innerHTML += `<span class="page">${pages_input.value}</span>`;
    pages_input.value = '';
    console.log(selected_pages);
})