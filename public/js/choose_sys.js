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

<button class="overlay__btn overlay__btn--colors" style="margin: 0 auto !important;">
    <input type="submit" value="Submit">
    <span class="overlay__btn-emoji"></span>
</button>
</form>`,

    selective: `

    <form action="/api/download" method="post">
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
            <br><br>
        </div>

        <div class="form-item">
            <label for="website">File Type:</label>
            <select name="FILE_TYPE" id="FILE_TYPE">
                <option value="jpg">jpg</option>
                <option value="pdf">pdf</option>
            </select>
            <br><br>
        </div>

        <div class="form-item">
            <label for="FOLDER_NAME">Folder Name</label>
            <input type="text" name="FOLDER_NAME" id="FOLDER_NAME"><br>
        </div>

        <div class="form-item">
            <label for="FOLDER_NAME">File Name</label>
            <input type="text" name="FILE_NAME" id="FILE_NAME"><br>
        </div>

        <div class="form-item">
            <label for="PAGES">PAGES</label>
            <input type="text" name="PAGES" id="PAGES"><br>
        </div>

        <div class="form-item">
            <label for="URI_START">URI_START</label>
            <input type="text" name="URI_START" id="URI_START"><br>
        </div>

        <div class="form-item">
            <label for="URI_END">URI_END</label>
            <input type="text" name="URI_END" id="URI_END"><br>
        </div>

        <input type="text" name="DTYPE" value="SELECT" hidden><br>

        <button class="overlay__btn overlay__btn--colors" style="margin: 0 auto !important;">
    <input type="submit" value="Submit">
    <span class="overlay__btn-emoji"></span>
</button>
    </form>`
}


var form_content = document.getElementById('form-content');
var tags = document.getElementsByClassName('tag');

for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];

    tag.addEventListener('click', () => {
        form_content.innerHTML = html_content[tag.id];
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